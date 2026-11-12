import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuditHandlers, createDispatcher } from '../netlify/functions/lib/audit/handlers.mjs';
import { MemoryAuditStore } from '../netlify/functions/lib/audit/store.mjs';
import { loadConfig } from '../netlify/functions/lib/audit/config.mjs';
import { signToken, verifyToken, verifyBot, readJson } from '../netlify/functions/lib/audit/security.mjs';

const config = {
  enabled: true, reportEnabled: true, mode: 'live', origin: 'https://agency.example',
  signingSecret: 'a-test-only-signing-secret-at-least-32-bytes', botHostname: 'agency.example',
  botSecret: 'test-secret', botSiteKey: 'test-sitekey',
  ipDaily: 3, sessionDaily: 3, globalDaily: 50, maxActive: 2, maxQueued: 8,
  cacheMs: 86400000, leaseMs: 120000, dailyBudgetMicros: 100, monthlyBudgetMicros: 1000,
  maxScanCostMicros: 10, maxReportCostMicros: 5,
};
const context = { ip: '203.0.113.10' };
const report = { version: 1, url: 'https://restorer-demo.com/', service: 'Water restoration', area: 'Lancaster', generatedAt: new Date().toISOString(), score: 75, categories: [], checks: [], fixes: [], pages: [], limitations: [] };
const fields = (extra = {}) => ({ url: 'https://restorer-demo.com', service: 'Water restoration', area: 'Lancaster', botToken: 'verified', ...extra });
const post = (body, extras = {}) => new Request('https://agency.example/.netlify/functions/website-audit', { method: 'POST', headers: { Origin: config.origin, 'Content-Type': 'application/json', ...extras }, body: JSON.stringify(body) });
const make = (overrides = {}) => {
  const settings = { ...config, ...overrides.config };
  const store = overrides.store ?? new MemoryAuditStore({ config: settings });
  return { store, settings, api: createAuditHandlers({ config: settings, store, bot: async () => {}, scan: async () => report, deliver: async () => ({ delivered: true }), ...overrides, config: settings }) };
};
const workerRequest = () => new Request(`${config.origin}/.netlify/functions/audit-worker`, { method: 'POST', headers: { Authorization: `Bearer ${signToken(config.signingSecret, 'worker', { exp: Date.now() + 60000 })}` } });

test('launch needs explicit verification/infrastructure and uses only approved spending ceilings', () => {
  assert.equal(loadConfig({}).enabled, false);
  const env = { AUDIT_ENABLED: 'true', AUDIT_LAUNCH_VERIFIED: 'true', AUDIT_ORIGIN: config.origin, AUDIT_DATABASE_URL: 'postgresql://local/audit', AUDIT_TURNSTILE_SECRET: 'x', AUDIT_TURNSTILE_SITE_KEY: 'x', AUDIT_SIGNING_SECRET: config.signingSecret };
  assert.equal(loadConfig(env).enabled, true);
  assert.equal(loadConfig(env).dailyBudgetMicros, 5_000_000);
  assert.equal(loadConfig(env).monthlyBudgetMicros, 50_000_000);
  assert.equal(loadConfig(env).maxScanCostMicros, 0);
  assert.equal(loadConfig({ ...env, AUDIT_DAILY_BUDGET_MICROS: '5000001' }).enabled, false);
  assert.equal(loadConfig({ ...env, AUDIT_MONTHLY_BUDGET_MICROS: '50000001' }).enabled, false);
  Object.assign(env, { AUDIT_DAILY_BUDGET_MICROS: '0', AUDIT_MONTHLY_BUDGET_MICROS: '0', AUDIT_MAX_SCAN_COST_MICROS: '0' });
  assert.equal(loadConfig(env).enabled, true);
  assert.equal(loadConfig({ ...env, AUDIT_MAX_ACTIVE: '3' }).enabled, false);
  assert.equal(loadConfig({ ...env, AUDIT_MAX_QUEUED: '0' }).enabled, false);
  assert.equal(loadConfig({ ...env, AUDIT_DAILY_BUDGET_MICROS: '-1' }).enabled, false);
  assert.equal(loadConfig({ ...env, AUDIT_ORIGIN: 'http://agency.example' }).enabled, false);
});

test('disabled APIs perform no storage, scanning, dispatch or delivery', async () => {
  const forbidden = new Proxy({}, { get() { throw new Error('must not use store'); } });
  const { api } = make({ config: { enabled: false }, store: forbidden, scan: () => assert.fail(), dispatch: () => assert.fail(), deliver: () => assert.fail() });
  const response = await api.website(new Request(config.origin), context);
  assert.equal((await response.json()).enabled, false);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal((await api.website(post(fields()), context)).status, 503);
  assert.equal((await api.report(post({}), context)).status, 503);
  assert.equal((await api.worker(workerRequest())).status, 403);
});

test('server requires exact Origin and runtime IP, ignores spoofed forwarding headers', async () => {
  let bots = 0;
  const { api } = make({ bot: async () => { bots++; } });
  assert.equal((await api.website(post(fields(), { Origin: 'https://evil.example' }), context)).status, 403);
  assert.equal((await api.website(post(fields(), { 'X-Forwarded-For': context.ip }), {})).status, 503);
  assert.equal((await api.website(post(fields({ url: 'http://127.0.0.1' })), context)).status, 422);
  assert.equal((await api.website(post(fields({ service: '' })), context)).status, 422);
  assert.equal(bots, 0);
});

test('bot verification precedes admission; provider failure and hostname/action/replay rejection fail closed', async () => {
  const { api, store } = make({ bot: async () => { throw Object.assign(new Error('bot'), { code: 'BOT_CHECK', status: 403 }); } });
  assert.equal((await api.website(post(fields()), context)).status, 403);
  assert.equal(Object.keys(store.state.jobs).length, 0);
  const valid = { success: true, hostname: config.botHostname, action: 'website_audit', challenge_ts: new Date().toISOString() };
  for (const result of [{ ...valid, hostname: 'evil.example' }, { ...valid, action: 'audit_report' }, { ...valid, success: false }, { ...valid, challenge_ts: 'invalid' }]) {
    await assert.rejects(verifyBot('token', 'website_audit', context.ip, config, async () => Response.json(result)), { code: 'BOT_CHECK' });
  }
  await assert.rejects(verifyBot('token', 'website_audit', context.ip, config, async () => { throw new Error('down'); }), { code: 'BOT_UNAVAILABLE' });
  await verifyBot('token', 'website_audit', context.ip, config, async (url, options) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(options.redirect, 'error');
    return Response.json(valid);
  });
});

test('concurrent identical submissions share one reservation and public reports exclude identities', async () => {
  let dispatches = 0;
  const { api, store } = make({ dispatch: async () => { dispatches++; } });
  const responses = await Promise.all(Array.from({ length: 5 }, () => api.website(post(fields()), context)));
  assert.ok(responses.every(response => response.status === 202));
  const bodies = await Promise.all(responses.map(response => response.json()));
  assert.equal(new Set(bodies.map(body => body.jobId)).size, 1);
  assert.equal(Object.keys(store.state.jobs).length, 1);
  assert.equal(Object.values(store.state.daily)[0].reservedMicros, 10);
  assert.ok(dispatches > 0);
  const body = bodies[0];
  const url = `${config.origin}/.netlify/functions/website-audit?jobId=${body.jobId}`;
  assert.equal((await api.website(new Request(url), context)).status, 401);
  assert.equal((await api.website(new Request(url, { headers: { Authorization: `Bearer ${body.accessToken}x` } }), context)).status, 401);
  await api.worker(workerRequest());
  const response = await api.website(new Request(url, { headers: { Authorization: `Bearer ${body.accessToken}` } }), context);
  const data = await response.json();
  assert.equal(data.status, 'complete');
  assert.equal(data.report.score, 75);
  assert.equal('ipHash' in data, false);
  assert.equal('sessionHash' in data, false);
  const cached = await (await api.website(post(fields()), context)).json();
  assert.equal(cached.cached, true);
  assert.equal(Object.values(store.state.daily)[0].global, 1);
  assert.equal(Object.values(store.state.daily)[0].reservedMicros, 0);
});

test('shared budget stops fresh work before dispatch even under concurrent requests', async () => {
  let calls = 0;
  const { api, store } = make({ config: { dailyBudgetMicros: 20, ipDaily: 10 }, dispatch: async () => { calls++; } });
  const responses = await Promise.all(Array.from({ length: 5 }, (_, index) => api.website(post(fields({ area: `Area ${index}` })), context)));
  assert.equal(responses.filter(response => response.status === 202).length, 2);
  assert.equal(responses.filter(response => response.status === 429).length, 3);
  assert.equal(calls, 2);
  assert.equal(Object.values(store.state.daily)[0].reservedMicros, 20);
});

test('anonymous signed session permits one active fresh scan; cached duplicates still work', async () => {
  const { api } = make();
  const page = await api.website(new Request(config.origin), context);
  const cookie = page.headers.get('set-cookie').split(';')[0];
  assert.match(page.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Strict/);
  assert.equal((await api.website(post(fields(), { Cookie: cookie }), context)).status, 202);
  assert.equal((await api.website(post(fields({ area: 'Baltimore' }), { Cookie: cookie }), context)).status, 429);
  assert.equal((await api.website(post(fields(), { Cookie: cookie }), context)).status, 202);
});

test('two signed workers drain the bounded queue with at most two simultaneous scans', async () => {
  let active = 0; let peak = 0; let calls = 0;
  const { api, store } = make({ config: { ipDaily: 10 }, scan: async () => {
    active++; peak = Math.max(peak, active); calls++;
    await new Promise(resolve => setTimeout(resolve, 5));
    active--; return report;
  } });
  for (let index = 0; index < 5; index++) assert.equal((await api.website(post(fields({ area: `Area ${index}` })), context)).status, 202);
  assert.equal((await api.worker(new Request(config.origin, { method: 'POST' }))).status, 403);
  await Promise.all(Array.from({ length: 4 }, () => api.worker(workerRequest())));
  assert.equal(calls, 5);
  assert.equal(peak, 2);
  assert.ok(Object.values(store.state.jobs).every(job => job.status === 'complete'));
});

test('scanner failure releases active capacity, keeps reservation and exposes no error details', async () => {
  const { api, store } = make({ scan: async () => { throw new Error('credential-sensitive-details'); } });
  const queued = await (await api.website(post(fields()), context)).json();
  await api.worker(workerRequest());
  const response = await api.website(new Request(`${config.origin}?jobId=${queued.jobId}`, { headers: { Authorization: `Bearer ${queued.accessToken}` } }), context);
  const data = await response.json();
  assert.equal(data.status, 'failed');
  assert.doesNotMatch(JSON.stringify(data), /credential-sensitive/);
  assert.equal(Object.values(store.state.daily)[0].reservedMicros, 10);
});

test('report requires real completed job, separate consent and atomic idempotent cost reservation', async () => {
  let sends = 0;
  const email = 'private-owner@example.com';
  const { api, store } = make({ deliver: async (input) => {
    assert.equal(Object.values(store.state.daily)[0].reservedMicros, 5);
    sends++;
    assert.equal(input.email, email);
    assert.equal(input.marketingConsent, false);
    assert.match(input.reportUrl, /#report=/);
    return { delivered: true };
  } });
  const queued = await (await api.website(post(fields()), context)).json();
  const body = { jobId: queued.jobId, accessToken: queued.accessToken, email, marketingConsent: false, botToken: 'fresh-report-token' };
  assert.equal((await api.report(post(body), context)).status, 409);
  await api.worker(workerRequest());
  assert.equal((await api.report(post({ ...body, marketingConsent: undefined }), context)).status, 422);
  assert.equal((await api.report(post({ ...body, email: 'owner..name@example.com' }), context)).status, 422);
  assert.equal(Object.keys(store.state.auxiliary).length, 0);
  const results = await Promise.all([api.report(post(body), context), api.report(post(body), context)]);
  assert.ok(results.some(response => response.status === 200));
  assert.equal(sends, 1);
  assert.doesNotMatch(JSON.stringify(store.state), /private-owner|marketingConsent/);
  assert.equal(Object.values(store.state.daily)[0].reservedMicros, 5);
});

test('ambiguous delivery or store acknowledgement never triggers an automatic second send', async () => {
  let sends = 0;
  const { api, store } = make({ deliver: async () => { sends++; throw new Error('provider timeout'); } });
  const queued = await (await api.website(post(fields()), context)).json();
  await api.worker(workerRequest());
  const body = { ...queued, email: 'owner@example.com', marketingConsent: true, botToken: 'fresh-token' };
  assert.equal((await api.report(post(body), context)).status, 503);
  assert.equal((await api.report(post(body), context)).status, 409);
  assert.equal(sends, 1);
  assert.equal(Object.values(store.state.daily)[0].reservedMicros, 5);
});

test('store failure disables config and never dispatches or sends; expired links fail', async () => {
  const { api } = make({ store: { consumeRate: async () => { throw new Error('down'); } }, dispatch: async () => assert.fail() });
  assert.equal((await (await api.website(new Request(config.origin), context)).json()).enabled, false);
  assert.equal((await api.website(post(fields()), context)).status, 503);
  assert.throws(() => verifyToken(config.signingSecret, 'report', signToken(config.signingSecret, 'report', { exp: Date.now() - 1 })), { code: 'UNAUTHORIZED' });
});

test('worker dispatch uses fixed configured origin, short signed authorization and no redirects', async () => {
  let calls = 0;
  await createDispatcher(config, async (url, options) => {
    calls++;
    assert.equal(url, `${config.origin}/.netlify/functions/audit-worker`);
    assert.equal(options.redirect, 'error');
    assert.ok(verifyToken(config.signingSecret, 'worker', options.headers.Authorization.slice(7)).nonce);
    return new Response(null, { status: 202 });
  })();
  assert.equal(calls, 1);
});

test('JSON request bounds reject oversized and malformed payloads before providers', async () => {
  await assert.rejects(readJson(post({ junk: 'a'.repeat(9000) })), { code: 'INVALID_PAYLOAD' });
  await assert.rejects(readJson(new Request(config.origin, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })), { code: 'INVALID_PAYLOAD' });
});

test('Unicode token signatures fail authorization cleanly without byte-length exceptions', () => {
  const valid = signToken(config.signingSecret, 'report', { exp: Date.now() + 10000 });
  const data = valid.split('.')[0];
  assert.throws(() => verifyToken(config.signingSecret, 'report', `${data}.${'é'.repeat(64)}`), { code: 'UNAUTHORIZED', status: 401 });
});

test('a hanging body cannot submit a valid JSON prefix after the request deadline', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{}')); } });
  const request = new Request(config.origin, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, duplex: 'half' });
  const pending = readJson(request);
  await Promise.resolve();
  t.mock.timers.tick(3000);
  await assert.rejects(pending, { code: 'INVALID_PAYLOAD', status: 408 });
});
