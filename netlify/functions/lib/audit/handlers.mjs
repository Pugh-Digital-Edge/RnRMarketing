import { createHash, randomUUID } from 'node:crypto';
import { publicConfig } from './config.mjs';
import { AuditError, digest, readJson, requireOrigin, session, signToken, trustedIp, verifyBot, verifyToken } from './security.mjs';
import { normalizeTarget } from './scanner.mjs';
import { validEmail } from './delivery.mjs';

const messages = {
  IP_QUOTA: 'This connection has reached its daily fresh-audit limit. Try again tomorrow.',
  SESSION_QUOTA: 'You have reached today’s fresh-audit limit. Try again tomorrow.',
  ACTIVE_SESSION: 'An audit is already in progress. Wait for it to finish.',
  GLOBAL_QUOTA: 'Today’s free audits are fully booked. Please try tomorrow or book a call.',
  QUEUE_FULL: 'The audit queue is full. Please try again shortly.',
  DAILY_BUDGET: 'Free audits are paused for today. Please try tomorrow or book a call.',
  MONTHLY_BUDGET: 'Free audits are paused. You can still book a call.',
  RATE_LIMIT: 'Too many requests. Please wait a minute and try again.',
  BOT_CHECK: 'Please complete the verification again.',
  BOT_UNAVAILABLE: 'Verification is temporarily unavailable. Please try again shortly.',
  ORIGIN_DENIED: 'This request is not allowed.',
  UNAUTHORIZED: 'This report link is invalid or has expired. Request a new audit.',
  NOT_FOUND: 'This audit is unavailable or has expired. Request a new audit.',
  INVALID_INPUT: 'Enter a public website, your main service, and service area.',
  INVALID_PAYLOAD: 'The request could not be read. Please check the form and try again.',
  REPORT_UNAVAILABLE: 'Email reports are not available yet. You can review the report here or book a call.',
  REPORT_PENDING: 'This report request already exists. Delivery could not be confirmed. Please contact us before requesting another copy.',
};

const headers = {
  'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer',
};
const json = (body, status = 200, extras = {}) => Response.json(body, { status, headers: { ...headers, ...extras } });
const failure = (error) => {
  const code = error?.code ?? 'UNAVAILABLE';
  const quota = /QUOTA|BUDGET|QUEUE_FULL|RATE_LIMIT|ACTIVE_SESSION/.test(code);
  const status = error?.status ?? (quota ? 429 : code === 'INVALID_INPUT' ? 422 : 503);
  return json({ error: messages[code] ?? 'The audit service is temporarily unavailable. Please try again later or book a call.', code }, status, quota ? { 'Retry-After': code === 'RATE_LIMIT' || code === 'QUEUE_FULL' ? '60' : '3600' } : {});
};

function cleanText(value, max) {
  if (typeof value !== 'string') throw new AuditError('INVALID_INPUT', 422);
  const result = value.normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (result.length < 2 || result.length > max || /[\u0000-\u001f\u007f]/.test(result)) throw new AuditError('INVALID_INPUT', 422);
  return result;
}

function inputFrom(body) {
  let url;
  try { url = normalizeTarget(body.url); } catch { throw new AuditError('INVALID_INPUT', 422); }
  return { url, service: cleanText(body.service, 100), area: cleanText(body.area, 120) };
}

function jobResponse(job) {
  return {
    jobId: job.id, status: job.status,
    ...(job.status === 'complete' ? { report: job.report } : {}),
    ...(job.status === 'failed' ? { error: 'The site could not be checked safely or the audit timed out. You can book a manual review.' } : {}),
  };
}

async function rate(store, scope, key, limit, windowMs = 60000) {
  const result = await store.consumeRate({ scope, key, limit, windowMs });
  if (!result.allowed) throw new AuditError('RATE_LIMIT', 429);
}

function authorizeJob(request, body, config) {
  const url = new URL(request.url);
  const id = body?.jobId ?? url.searchParams.get('jobId');
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) throw new AuditError('UNAUTHORIZED', 401);
  const token = body?.accessToken ?? request.headers.get('authorization')?.replace(/^Bearer /, '');
  const payload = verifyToken(config.signingSecret, 'report', token);
  if (payload.jobId !== id) throw new AuditError('UNAUTHORIZED', 401);
  return { id, token };
}

function currentJob(job, config) {
  if (!job || (job.finishedAt ?? job.createdAt) + config.cacheMs <= Date.now()) throw new AuditError('NOT_FOUND', 404);
  return job;
}

/** Dependency injection is explicit: production wrappers always use PostgreSQL. */
export function createAuditHandlers({ config, store, scan, deliver, dispatch = async () => {}, bot = verifyBot }) {
  async function website(request, context) {
    try {
      if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
      if (!config.enabled) {
        if (request.method === 'GET' && !new URL(request.url).searchParams.has('jobId')) return json(publicConfig(config));
        throw new AuditError('UNAVAILABLE', 503);
      }
      const ip = trustedIp(context);
      const ipHash = digest(config.signingSecret, 'ip', ip);
      if (request.method === 'GET') {
        await rate(store, 'read', ipHash, 90);
        if (!new URL(request.url).searchParams.has('jobId')) {
          await store.ping();
          const identity = session(request, config);
          return json(publicConfig(config), 200, { 'Set-Cookie': identity.cookie });
        }
        const { id } = authorizeJob(request, undefined, config);
        return json(jobResponse(currentJob(await store.read(id), config)));
      }
      requireOrigin(request, config);
      await rate(store, 'submit', ipHash, 10);
      const body = await readJson(request);
      const input = inputFrom(body);
      await bot(body.botToken, 'website_audit', ip, config);
      const identity = session(request, config);
      const key = createHash('sha256').update(JSON.stringify([1, input.url, input.service.toLowerCase(), input.area.toLowerCase()])).digest('hex');
      // submit performs cache lookup, deduplication, quotas, queue admission and
      // worst-case budget reservation in ONE strongly consistent transaction.
      const result = await store.submit({ key, input, ipHash, sessionHash: identity.hash });
      const accessToken = signToken(config.signingSecret, 'report', { jobId: result.job.id, exp: (result.job.finishedAt ?? result.job.createdAt) + config.cacheMs });
      if (result.job.status === 'queued') {
        try { await dispatch(); } catch { /* Queued work expires safely; no unreserved inline fallback. */ }
      }
      return json({ ...jobResponse(result.job), accessToken, cached: result.cached, deduplicated: result.deduplicated }, result.job.status === 'complete' ? 200 : 202, { 'Set-Cookie': identity.cookie, 'Retry-After': '3' });
    } catch (error) {
      // Config reads advertise disabled when the control store cannot be verified.
      if (request.method === 'GET' && !new URL(request.url).searchParams.has('jobId')) return json({ enabled: false, reportEnabled: false, mode: 'disabled', message: 'Live audits are temporarily unavailable. Explore the example report or book a call.' });
      return failure(error);
    }
  }

  async function report(request, context) {
    try {
      if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
      if (!config.enabled || !config.reportEnabled) throw new AuditError('REPORT_UNAVAILABLE', 503);
      requireOrigin(request, config);
      const ip = trustedIp(context);
      const ipHash = digest(config.signingSecret, 'ip', ip);
      await rate(store, 'report-attempt', ipHash, 6);
      const body = await readJson(request);
      const { id, token } = authorizeJob(request, body, config);
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (!validEmail(email) || typeof body.marketingConsent !== 'boolean') throw new AuditError('INVALID_INPUT', 422);
      const job = currentJob(await store.read(id), config);
      if (job.status !== 'complete') throw new AuditError('REPORT_UNAVAILABLE', 409);
      await bot(body.botToken, 'audit_report', ip, config);
      const identity = session(request, config);
      await rate(store, 'report-session', identity.hash, 3, 86400000);
      await rate(store, 'report-ip', ipHash, 3, 86400000);
      const requestId = digest(config.signingSecret, 'delivery', `${id}\0${email}`);
      // Only opaque identifiers enter the control/cache store. Email, name and
      // consent travel directly to the configured delivery/CRM adapters.
      const reservation = await store.reserveAuxiliary({ id: requestId, maxCostMicros: config.maxReportCostMicros });
      if (!reservation.reserved) {
        if (reservation.status === 'complete' && config.mode === 'local') return json({ previewSaved: true, previewReportUrl: `/__audit-preview/outbox/${requestId}`, message: 'This preview report was already saved locally. No email was sent.' });
        if (reservation.status === 'complete') return json({ delivered: true, message: 'Your report was already accepted for delivery. Check your inbox and spam folder.' });
        throw new AuditError('REPORT_PENDING', 409);
      }
      let accepted = false;
      try {
        const result = await deliver({ email, report: job.report, reportUrl: `${config.origin}/website-audit/#report=${id}&token=${encodeURIComponent(token)}`, marketingConsent: body.marketingConsent, requestId }, { config });
        if (config.mode === 'local' && result.previewSaved === true) {
          accepted = true;
          await store.finishAuxiliary(requestId, { status: 'complete', actualCostMicros: 0 });
          return json({ previewSaved: true, previewReportUrl: result.previewReportUrl, message: 'Saved to the local preview outbox. No email or HubSpot record was sent.' }, 200, { 'Set-Cookie': identity.cookie });
        }
        if (result.delivered !== true) throw new Error('Delivery unconfirmed');
        accepted = true;
        // Hold the full reservation: provider acceptance is not a cost receipt.
        await store.finishAuxiliary(requestId, { status: 'complete' });
        return json({ delivered: true, message: 'Your report was accepted for delivery. Check your inbox and spam folder.' }, 200, { 'Set-Cookie': identity.cookie });
      } catch {
        // If acknowledgement is lost, never send again automatically. A provider
        // may already have accepted it. Retain budget and require reconciliation.
        if (!accepted) { try { await store.finishAuxiliary(requestId, { status: 'failed' }); } catch { /* Fail closed. */ } }
        throw new AuditError('REPORT_PENDING', 503);
      }
    } catch (error) { return failure(error); }
  }

  async function worker(request) {
    if (!config.enabled || request.method !== 'POST') return new Response(null, { status: 403 });
    try {
      const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
      verifyToken(config.signingSecret, 'worker', token);
      await store.ping();
    } catch { return new Response(null, { status: 403 }); }
    const deadline = Date.now() + 90000;
    while (Date.now() < deadline) {
      let claimed;
      try { claimed = await store.claimNext(); } catch { break; }
      if (!claimed) break;
      const { job, leaseToken } = claimed;
      try {
        const report = await scan(job.input);
        // The current scanner makes zero AI/metered provider calls. Hosting and
        // database billing require independent provider limits (see runbook).
        await store.complete(job.id, report, { leaseToken, actualCostMicros: 0 });
      } catch {
        try { await store.fail(job.id, 'Audit unavailable or timed out.', { leaseToken }); } catch { /* Expired fencing token: no stale write or retry. */ }
      }
    }
    return new Response(null, { status: 204 });
  }
  return { website, report, worker };
}

export function createDispatcher(config, fetchImpl = fetch) {
  return async () => {
    const token = signToken(config.signingSecret, 'worker', { nonce: randomUUID(), exp: Date.now() + 60000 });
    const response = await fetchImpl(`${config.origin}/.netlify/functions/audit-worker`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
      redirect: 'error', signal: AbortSignal.timeout(5000),
    });
    if (response.status !== 202) throw new AuditError('DISPATCH_UNAVAILABLE', 503);
  };
}
