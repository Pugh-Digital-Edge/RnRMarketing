import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';

export class AuditError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}

export const digest = (secret, namespace, value) => createHmac('sha256', secret).update(`${namespace}\0${value}`).digest('hex');
const safeEqual = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export function signToken(secret, purpose, payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${digest(secret, purpose, data)}`;
}

export function verifyToken(secret, purpose, token, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 2048) throw new AuditError('UNAUTHORIZED', 401);
  const [data, signature, extra] = token.split('.');
  if (extra || !data || !safeEqual(signature, digest(secret, purpose, data))) throw new AuditError('UNAUTHORIZED', 401);
  let payload;
  try { payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')); } catch { throw new AuditError('UNAUTHORIZED', 401); }
  if (!Number.isSafeInteger(payload.exp) || payload.exp <= now) throw new AuditError('UNAUTHORIZED', 401);
  return payload;
}

export function session(request, config, now = Date.now()) {
  const raw = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith('__Host-rnr_audit='))?.slice('__Host-rnr_audit='.length);
  let id;
  try { id = verifyToken(config.signingSecret, 'session', raw, now).id; } catch { /* Rotate missing or invalid anonymous cookie. */ }
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) id = randomUUID();
  const token = signToken(config.signingSecret, 'session', { id, exp: now + 86400000 });
  return { hash: digest(config.signingSecret, 'session-id', id), cookie: `__Host-rnr_audit=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400` };
}

export function trustedIp(context) {
  // Netlify's runtime context is authoritative; request IP headers are untrusted.
  if (!context || !isIP(context.ip ?? '')) throw new AuditError('IP_UNAVAILABLE', 503);
  return context.ip;
}

export function requireOrigin(request, config) {
  if (request.headers.get('origin') !== config.origin) throw new AuditError('ORIGIN_DENIED', 403);
}

export async function readJson(request, maxBytes = 8192) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new AuditError('INVALID_PAYLOAD', 415);
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new AuditError('INVALID_PAYLOAD', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new AuditError('INVALID_PAYLOAD', 400);
  const chunks = []; let size = 0; let expired = false;
  const timer = setTimeout(() => { expired = true; void reader.cancel().catch(() => {}); }, 3000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new AuditError('INVALID_PAYLOAD', 413); }
      chunks.push(Buffer.from(value));
    }
    if (expired) throw new AuditError('INVALID_PAYLOAD', 408);
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('shape');
    return value;
  } catch (error) {
    if (error instanceof AuditError) throw error;
    throw new AuditError('INVALID_PAYLOAD', 400);
  } finally { clearTimeout(timer); reader.releaseLock(); }
}

export async function verifyBot(token, action, ip, config, fetchImpl = fetch) {
  if (typeof token !== 'string' || !token || token.length > 2048) throw new AuditError('BOT_CHECK', 403);
  try {
    const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: config.botSecret, response: token, remoteip: ip }),
    });
    if (!response.ok) throw new Error('unavailable');
    const result = await response.json();
    if (result.success !== true || result.hostname !== config.botHostname || result.action !== action) throw new AuditError('BOT_CHECK', 403);
    const age = Date.now() - Date.parse(result.challenge_ts);
    if (!Number.isFinite(age) || age < -30000 || age > 300000) throw new AuditError('BOT_CHECK', 403);
  } catch (error) {
    if (error instanceof AuditError) throw error;
    throw new AuditError('BOT_UNAVAILABLE', 503);
  }
}
