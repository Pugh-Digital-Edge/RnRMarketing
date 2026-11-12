import http from 'node:http';
import { readFile, mkdir, stat, lstat, rename, open, realpath } from 'node:fs/promises';
import { resolve, join, dirname, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { constants as fsConstants } from 'node:fs';
import { createAuditHandlers } from '../netlify/functions/lib/audit/handlers.mjs';
import { APPROVED_SCAN_BUDGET } from '../netlify/functions/lib/audit/budget-policy.mjs';
import { renderReport } from '../netlify/functions/lib/audit/delivery.mjs';
import { normalizeTarget } from '../netlify/functions/lib/audit/scanner.mjs';
import { signToken } from '../netlify/functions/lib/audit/security.mjs';
import { createPreviewStore } from './lib/audit-preview-store.mjs';
import { PREVIEW_FIXTURES, scanPreviewFixture } from './lib/audit-preview-fixtures.mjs';

const HOST = '127.0.0.1';
const CSP = "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'";
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.png': 'image/png', '.ico': 'image/x-icon', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const json = (body, status = 200) => Response.json(body, { status });
const equal = (left, right) => typeof left === 'string' && typeof right === 'string' && Buffer.byteLength(left) === Buffer.byteLength(right) && timingSafeEqual(Buffer.from(left), Buffer.from(right));

function localOnly(env) {
  if (env.NODE_ENV === 'production' || env.NETLIFY || env.CONTEXT || env.AWS_LAMBDA_FUNCTION_NAME || env.VERCEL || env.CF_PAGES) {
    throw new Error('The fixture preview is local-only and refuses hosted/production environments. Use the guarded production functions there.');
  }
}

async function findAssets(requested) {
  const candidates = requested ? [resolve(requested)] : [fileURLToPath(new URL('./dist/', import.meta.url)), fileURLToPath(new URL('../dist/', import.meta.url))];
  for (const candidate of candidates) {
    try { if ((await stat(join(candidate, 'website-audit/index.html'))).isFile()) return await realpath(candidate); } catch { /* Next known local build path. */ }
  }
  throw new Error('Build the site with npm run build first, or use the complete extracted local-preview bundle.');
}

async function atomicJson(path, value) {
  const temporary = `${path}.${randomBytes(8).toString('hex')}.tmp`;
  const file = await open(temporary, 'wx', 0o600);
  try { await file.writeFile(JSON.stringify(value)); await file.sync(); } finally { await file.close(); }
  await rename(temporary, path);
}

async function localIdentity(directory) {
  // This private local fixture seed is not a provider credential. Persisting it
  // keeps pseudonymous quota keys/cookies stable across normal preview restarts.
  const path = join(directory, 'local-preview-identity.json');
  let file;
  try {
    try { file = await open(path, fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0)); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const key = randomBytes(32).toString('hex');
      file = await open(path, 'wx', 0o600);
      await file.writeFile(JSON.stringify({ localPreviewIdentity: 1, key })); await file.sync();
      return key;
    }
    const info = await file.stat();
    if (!info.isFile() || info.nlink !== 1 || info.size > 256 || (typeof process.getuid === 'function' && info.uid !== process.getuid())) throw new Error('Invalid identity file.');
    const value = JSON.parse(await file.readFile('utf8'));
    if (value.localPreviewIdentity !== 1 || !/^[a-f0-9]{64}$/.test(value.key)) throw new Error('Invalid identity data.');
    return value.key;
  } catch { throw new Error('Local preview identity could not be verified; existing state was not reset. Use --fresh for an independent fixture session.'); }
  finally { await file?.close(); }
}

async function bodyOf(request) {
  const chunks = []; let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > 8192) throw Object.assign(new Error('Payload too large.'), { status: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function webRequest(request, origin, body) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) if (value !== undefined && name !== 'content-length') headers.set(name, Array.isArray(value) ? value.join(', ') : value);
  const cookie = headers.get('cookie');
  if (cookie) headers.set('cookie', cookie.replace(/\brnr_audit_local=/g, '__Host-rnr_audit='));
  return new Request(`${origin}${request.url}`, { method: request.method, headers, ...(['GET', 'HEAD'].includes(request.method) ? {} : { body: body ?? '' }) });
}

function send(response, result) {
  response.statusCode = result.status;
  for (const [key, value] of result.headers) {
    if (key.toLowerCase() === 'set-cookie') response.setHeader(key, value.replace('__Host-rnr_audit=', 'rnr_audit_local=').replace(/; Secure\b/, ''));
    else response.setHeader(key, value);
  }
  return result.arrayBuffer().then(buffer => response.end(Buffer.from(buffer)));
}

/** An independent fixture application. Never imports the production runtime. */
export async function startAuditLocalPreview({ assetsDirectory, stateDirectory, port = 4322, env = process.env } = {}) {
  localOnly(env);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid local preview port.');
  const assets = await findAssets(assetsDirectory);
  const identity = createHash('sha256').update(fileURLToPath(import.meta.url)).digest('hex').slice(0, 16);
  const directory = resolve(stateDirectory ?? join(tmpdir(), `rnr-audit-local-preview-${identity}`));
  if (directory === assets || directory.startsWith(assets + sep)) throw new Error('Preview state must stay outside the built website.');
  // Refuse automatic writes in any existing checkout, including Matt's.
  for (let current = directory; ; current = dirname(current)) {
    const marker = join(current, '.git');
    try {
      const info = await lstat(marker);
      if (info.isFile() && info.size < 4096 && (await readFile(marker, 'utf8')).startsWith('gitdir:')) throw new Error('Choose a preview state directory outside any Git checkout.');
      if (info.isDirectory()) {
        try { if ((await stat(join(marker, 'HEAD'))).isFile()) throw new Error('Choose a preview state directory outside any Git checkout.'); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
      }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (dirname(current) === current) break;
  }
  const outbox = join(directory, 'outbox');
  const csrfToken = randomBytes(32).toString('hex');
  let signingSecret = randomBytes(32).toString('hex');
  let api, config, store, origin, closing = false;
  const workers = new Set();
  const server = http.createServer(async (request, response) => {
    response.setHeader('Content-Security-Policy', CSP);
    response.setHeader('Cache-Control', 'no-store, private');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    request.setTimeout(5000, () => request.destroy());
    try {
      if (!api || closing) return await send(response, json({ error: 'Local preview is starting or stopping.' }, 503));
      if (request.headers.host !== new URL(origin).host || request.headers['sec-fetch-site'] === 'cross-site') return await send(response, json({ error: 'Local preview requests must use the printed loopback URL.' }, 403));
      if (request.headers.origin && request.headers.origin !== origin) return await send(response, json({ error: 'Cross-origin preview request denied.' }, 403));
      const url = new URL(request.url, origin);
      if (request.method === 'POST') {
        if (request.headers.origin !== origin || !equal(request.headers['x-audit-preview-csrf'], csrfToken)) return await send(response, json({ error: 'Refresh the local preview before submitting.' }, 403));
      }
      if (url.pathname === '/.netlify/functions/website-audit') {
        const body = request.method === 'POST' ? await bodyOf(request) : undefined;
        if (body !== undefined) {
          let input; try { input = JSON.parse(body); } catch { return await send(response, json({ error: 'Invalid preview request.' }, 400)); }
          let target; try { target = normalizeTarget(input.url); } catch { /* Invalid input is a fixture-only rejection. */ }
          if (!PREVIEW_FIXTURES.some(fixture => fixture.url === target)) return await send(response, json({ error: 'Choose one of the fictional local test sites. This preview never scans public websites.', code: 'PREVIEW_FIXTURE_ONLY' }, 422));
        }
        const result = await api.website(webRequest(request, origin, body), { ip: HOST });
        if (request.method === 'GET' && !url.searchParams.has('jobId') && result.ok) {
          const payload = await result.json();
          const headers = new Headers(result.headers); headers.delete('content-length');
          return await send(response, Response.json({ ...payload, mode: 'local', localPreview: true, fixtures: PREVIEW_FIXTURES, csrfToken }, { headers }));
        }
        return await send(response, result);
      }
      if (url.pathname === '/.netlify/functions/audit-report') return await send(response, await api.report(webRequest(request, origin, await bodyOf(request)), { ip: HOST }));
      if (url.pathname.startsWith('/.netlify/functions/')) return await send(response, json({ error: 'Other functions, external workers and production services are unavailable in this local preview.' }, 403));
      if (!['GET', 'HEAD'].includes(request.method)) return await send(response, json({ error: 'Method not allowed.' }, 405));
      if (url.pathname.startsWith('/__audit-preview/outbox/')) {
        const id = url.pathname.slice('/__audit-preview/outbox/'.length);
        if (!/^[a-f0-9]{64}$/.test(id)) return await send(response, json({ error: 'Invalid local report reference.' }, 404));
        try {
          const saved = JSON.parse(await readFile(join(outbox, `${id}.json`), 'utf8'));
          return await send(response, new Response(saved.html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
        } catch { return await send(response, json({ error: 'That saved preview report is unavailable.' }, 404)); }
      }
      let path;
      try { path = resolve(assets, `.${decodeURIComponent(url.pathname)}`); } catch { return await send(response, new Response('Invalid path.', { status: 400 })); }
      if (path !== assets && !path.startsWith(assets + sep)) return await send(response, new Response('Not found.', { status: 404 }));
      try {
        if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
        path = await realpath(path);
        if (path !== assets && !path.startsWith(assets + sep)) return await send(response, new Response('Not found.', { status: 404 }));
        const body = await readFile(path);
        return await send(response, new Response(request.method === 'HEAD' ? null : body, { headers: { 'Content-Type': MIME[extname(path)] ?? 'application/octet-stream' } }));
      } catch { return await send(response, new Response('This preview includes the built local site routes only.', { status: 404 })); }
    } catch (error) {
      if (!response.headersSent) await send(response, json({ error: error.status === 413 ? 'Preview payload is too large.' : 'The local preview could not complete the request. Its persisted state has not been silently reset.' }, error.status ?? 503));
      else response.end();
    }
  });
  await new Promise((done, fail) => { server.once('error', fail); server.listen(port, HOST, done); });
  origin = `http://${HOST}:${server.address().port}`;
  config = { enabled: true, reportEnabled: true, mode: 'local', origin, signingSecret, ipDaily: 3, sessionDaily: 3, globalDaily: 50, maxActive: 2, maxQueued: 8,
    cacheMs: 86400000, leaseMs: 120000, dailyBudgetMicros: APPROVED_SCAN_BUDGET.dailyBudgetMicros, monthlyBudgetMicros: APPROVED_SCAN_BUDGET.monthlyBudgetMicros,
    maxScanCostMicros: 0, maxReportCostMicros: 0, environment: 'local' };
  try {
    store = await createPreviewStore({ directory, config });
    try { await mkdir(outbox, { mode: 0o700 }); } catch (error) { if (error.code !== 'EEXIST') throw error; }
    const info = await lstat(outbox);
    if (!info.isDirectory() || info.isSymbolicLink() || await realpath(outbox) !== join(await realpath(directory), 'outbox')) throw new Error('The local outbox must be a private preview directory.');
    signingSecret = await localIdentity(directory); config.signingSecret = signingSecret;
  }
  catch (error) { await store?.close().catch(() => {}); await new Promise(done => server.close(done)); throw error; }
  const deliver = async input => {
    const rendered = renderReport(input);
    const notice = '<div style="padding:20px;background:#fff4c2;color:#071a42;font-weight:bold">LOCAL PREVIEW: saved on this computer only. No email was sent and no HubSpot contact or marketing enrollment was created.</div>';
    const html = rendered.html.replace(/(<body[^>]*>)/i, `$1${notice}`);
    await atomicJson(join(outbox, `${input.requestId}.json`), { localPreview: true, createdAt: new Date().toISOString(), email: input.email, report: input.report, html, text: rendered.text });
    return { previewSaved: true, previewReportUrl: `/__audit-preview/outbox/${input.requestId}` };
  };
  const dispatch = async () => {
    if (closing || workers.size >= 2) return;
    const work = new Promise(done => setTimeout(done, 25)).then(async () => {
      if (closing) return;
      const token = signToken(signingSecret, 'worker', { exp: Date.now() + 60000 });
      await api.worker(new Request(`${origin}/__local_worker`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }));
    });
    workers.add(work); void work.finally(() => workers.delete(work));
  };
  api = createAuditHandlers({ config, store, scan: scanPreviewFixture, deliver, dispatch,
    bot: async token => { if (token !== 'local-preview') throw Object.assign(new Error('Local preview token required.'), { code: 'BOT_CHECK', status: 403 }); } });
  let closed = false;
  return { origin, directory, outbox,
    async close() {
      if (closed) return; closed = true; closing = true;
      server.closeIdleConnections?.();
      await new Promise(done => server.close(done));
      await Promise.allSettled([...workers]); await store.close();
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const readOption = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
  const unknown = args.filter((arg, index) => !['--fresh', '--port', '--state-dir', '--assets'].includes(arg) && (index === 0 || !['--port', '--state-dir', '--assets'].includes(args[index - 1])));
  if (unknown.length) throw new Error('Use only --fresh, --port NUMBER, --state-dir DIRECTORY or --assets DIRECTORY.');
  let stateDirectory = readOption('--state-dir');
  if (args.includes('--fresh') && !stateDirectory) stateDirectory = join(tmpdir(), `rnr-audit-local-preview-fresh-${Date.now()}-${randomBytes(4).toString('hex')}`);
  try {
    const preview = await startAuditLocalPreview({ port: Number(readOption('--port') ?? 4322), stateDirectory, assetsDirectory: readOption('--assets') });
    console.log(`Functional local audit: ${preview.origin}/website-audit/`);
    console.log(`Local-only state and outbox: ${preview.directory}`);
    console.log('Choose a fictional test site and run a real local audit. No public scans, email sends, HubSpot writes or paid APIs. Stop with Ctrl+C.');
    for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { void preview.close().then(() => process.exit(0)); });
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
