import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bookingUrl } from '../src/data/booking.js';
import { deliverReport, DeliveryError, DELIVERY_LIMITS, isSafeAuditProperty, validateDeliveryConfig } from '../netlify/functions/lib/audit/delivery.mjs';

const CONTACTS = 'https://api.hubapi.com/crm/v3/objects/contacts';
const EMAILS = 'https://api.resend.com/emails';
const config = (overrides = {}) => ({
  resendApiKey: 'test_resend_key', emailFrom: 'RnR Marketing <audit@example.com>', hubspotToken: 'test_crm_key',
  hubspotReportProperty: 'rnr_audit_last_report', hubspotConsentProperty: 'rnr_audit_marketing_request', ...overrides,
});
const evidence = (value = 'Observed title and service wording') => [{ url: 'https://example.com/service?a=1&b=2', text: value }];
const report = (overrides = {}) => ({
  version: 1, url: 'https://example.com/', service: 'Water damage restoration', area: 'Austin, TX', generatedAt: '2026-11-05T12:00:00.000Z', score: 71,
  categories: [{ id: 'discovery', label: 'Discovery', score: 71, summary: 'One observable page signal needs review.' }],
  checks: [
    { id: 'title', category: 'discovery', label: 'Descriptive page title', status: 'pass', evidence: evidence(), recommendation: 'Keep the title accurate.' },
    { id: 'local', category: 'discovery', label: 'Service area wording', status: 'fail', evidence: evidence('No city wording observed'), recommendation: 'Review visible service-area information.' },
    { id: 'other', category: 'discovery', label: 'Unavailable page', status: 'unknown', evidence: [], recommendation: 'Verify the unavailable page manually.' },
  ],
  fixes: [1, 2, 3].map(n => ({ title: `Priority ${n}`, why: `Evidence-based reason ${n}`, action: `Recommended action ${n}`, evidence: evidence(`Fix evidence ${n}`) })),
  pages: [{ url: 'https://example.com/', status: 'checked' }, { url: 'https://example.com/other', status: 'unavailable', reason: 'Fetch unavailable' }],
  limitations: ['No Google Search Console, rankings, analytics, or AI citation measurements were available.'], ...overrides,
});
const input = (overrides = {}) => ({ email: 'owner@example.com', report: report(), reportUrl: 'https://audit.example.com/website-audit?report=secret-token', marketingConsent: false, requestId: 'request_12345678', ...overrides });
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
function provider(steps = [json(200, { id: '123' }), json(200, { id: '123' }), json(200, { id: 'email_123' })]) {
  const calls = [];
  const fetch = async (endpoint, options) => {
    calls.push({ endpoint, ...options, json: options.body ? JSON.parse(options.body) : undefined });
    assert.ok(steps.length, 'no unbudgeted provider call');
    const step = steps.shift();
    if (step instanceof Error) throw step;
    return typeof step === 'function' ? step(endpoint, options) : step;
  };
  return { fetch, calls };
}
async function rejectsCode(promise, code) {
  await assert.rejects(promise, error => error instanceof DeliveryError && error.code === code && !/owner@example|test_resend|test_crm|secret-token|private-provider-detail/.test(JSON.stringify(error) + error.message));
}

test('configuration fails closed before providers and rejects dangerous custom property names', async () => {
  assert.equal(validateDeliveryConfig(config()), true);
  for (const overrides of [
    { resendApiKey: '' }, { hubspotToken: undefined }, { emailFrom: 'injected@example.com\r\nBcc: victim@example.com' },
    { emailFrom: 'not a mailbox' }, { emailFrom: 'Name <not-mail>' }, { resendApiKey: 'key\nvalue' },
    { hubspotReportProperty: 'lifecyclestage' }, { hubspotReportProperty: 'rnr_audit_subscription' },
    { hubspotReportProperty: 'rnr_audit_deal_stage' }, { hubspotReportProperty: 'rnr_audit_hs_marketable_status' },
    { hubspotReportProperty: 'rnr_audit_last_report', hubspotConsentProperty: 'rnr_audit_last_report' },
    { hubspotConsentProperty: undefined },
  ]) {
    const p = provider([]);
    await rejectsCode(deliverReport(input(), { config: config(overrides), fetch: p.fetch }), 'CONFIG_INVALID');
    assert.equal(p.calls.length, 0);
  }
  assert.equal(isSafeAuditProperty('rnr_audit_report'), true);
  assert.equal(isSafeAuditProperty('hs_marketable_status'), false);
});

test('invalid details, report shape, and unsafe links never contact providers', async () => {
  for (const overrides of [
    { email: 'not an email' }, { email: 'owner@example.com\r\nBcc:other@example.com' },
    { email: '.owner@example.com' }, { email: 'owner..name@example.com' }, { email: 'owner@-example.com' },
    { requestId: 'request\r\nInjected-header' }, { requestId: 123456789 }, { marketingConsent: 'yes' },
    { reportUrl: 'javascript:alert(1)' }, { reportUrl: 'https://user:password@example.com/' },
    { report: report({ url: 'data:text/html,hello' }) }, { report: report({ score: 101 }) },
    { report: report({ score: NaN }) }, { report: report({ generatedAt: 'invalid-date' }) },
    { report: report({ fixes: [] }) }, { report: report({ fixes: Array(3) }) }, { report: report({ fixes: [...report().fixes, report().fixes[0]] }) },
    { report: report({ checks: [{ ...report().checks[0], evidence: [{ url: 'javascript:alert(1)', text: 'Unsafe source' }] }] }) },
    { report: report({ limitations: ['x'.repeat(12001)] }) },
  ]) {
    const p = provider([]);
    await rejectsCode(deliverReport(input(overrides), { config: config(), fetch: p.fetch }), 'INVALID_REQUEST');
    assert.equal(p.calls.length, 0);
  }
});

test('existing contacts get a partial update preserving unrelated fields and prior consent', async () => {
  const p = provider([json(200, { id: '123', properties: { firstname: 'Existing', lifecyclestage: 'customer', rnr_audit_marketing_request: 'prior-choice' } }), json(200, { id: '123' }), json(200, { id: 'email_123' })]);
  assert.deepEqual(await deliverReport(input(), { config: config(), fetch: p.fetch }), { delivered: true, providerId: 'email_123', contactId: '123' });
  assert.deepEqual(p.calls.map(call => call.method), ['GET', 'PATCH', 'POST']);
  assert.equal(p.calls[0].endpoint, `${CONTACTS}/owner%40example.com?idProperty=email&properties=email`);
  assert.equal(p.calls[1].endpoint, `${CONTACTS}/123`);
  const properties = p.calls[1].json.properties;
  assert.deepEqual(Object.keys(properties).sort(), ['email', 'rnr_audit_last_report']);
  const saved = JSON.parse(properties.rnr_audit_last_report);
  assert.equal(saved.reportUrl, input().reportUrl);
  assert.equal(saved.type, 'requested_website_audit_report');
  assert.equal(saved.requestId, input().requestId);
  assert.ok(Number.isFinite(Date.parse(saved.requestedAt)));
  assert.match(saved.summary, /71\/100.*Priority 1.*Priority 2.*Priority 3/);
  assert.ok(p.calls.every(call => call.redirect === 'error' && call.signal instanceof AbortSignal));
  assert.equal(p.calls[0].headers.Authorization, 'Bearer test_crm_key');
  assert.ok(p.calls.every(call => !/subscriptions|marketing|batch|notes|deals/.test(new URL(call.endpoint).pathname)));
});

test('only affirmative optional marketing requests write the dedicated consent property', async () => {
  const p = provider();
  await deliverReport(input({ marketingConsent: true }), { config: config(), fetch: p.fetch });
  const properties = p.calls[1].json.properties;
  assert.deepEqual(Object.keys(properties).sort(), ['email', 'rnr_audit_last_report', 'rnr_audit_marketing_request']);
  const consent = JSON.parse(properties.rnr_audit_marketing_request);
  assert.equal(consent.requested, true);
  assert.equal(consent.type, 'affirmative_marketing_follow_up_request');
  assert.equal(consent.requestedAt, JSON.parse(properties.rnr_audit_last_report).requestedAt);
  assert.match(p.calls[2].json.text, /requested marketing follow-up/);
  assert.match(p.calls[2].json.text, /does not change subscription status/);
});

test('a 404 creates only the submitted contact properties, without marketing enrollment', async () => {
  const p = provider([json(404, {}), json(201, { id: '456' }), json(200, { id: 'email_123' })]);
  const result = await deliverReport(input({ marketingConsent: undefined }), { config: config(), fetch: p.fetch });
  assert.equal(result.contactId, '456');
  assert.deepEqual(p.calls.map(call => [call.endpoint, call.method]), [[`${CONTACTS}/owner%40example.com?idProperty=email&properties=email`, 'GET'], [CONTACTS, 'POST'], [EMAILS, 'POST']]);
  assert.deepEqual(Object.keys(p.calls[1].json.properties).sort(), ['email', 'rnr_audit_last_report']);
});

test('an explicit create race resolves once by email and patches the known ID', async () => {
  const p = provider([json(404, {}), json(409, {}), json(200, { id: '789' }), json(200, { id: '789' }), json(200, { id: 'email_123' })]);
  const result = await deliverReport(input(), { config: config(), fetch: p.fetch });
  assert.equal(result.contactId, '789');
  assert.equal(p.calls.length, DELIVERY_LIMITS.maxProviderRequests);
  assert.deepEqual(p.calls.map(call => call.method), ['GET', 'POST', 'GET', 'PATCH', 'POST']);
  assert.equal(p.calls[3].endpoint, `${CONTACTS}/789`);
});

test('race-resolution failure stops within the request bound without sending email', async () => {
  const p = provider([json(404, {}), json(409, {}), json(404, {})]);
  await rejectsCode(deliverReport(input(), { config: config(), fetch: p.fetch }), 'CRM_FAILED');
  assert.equal(p.calls.length, 3);
  assert.ok(p.calls.every(call => call.endpoint.startsWith(CONTACTS)));
});

test('email is a single idempotent request with the complete escaped report and existing booking URL', async () => {
  const hostile = '<script>alert("bad")</script><img src=x onerror="alert(1)"> & \'single\'';
  const source = report({ service: hostile, area: hostile, limitations: [hostile] });
  source.categories[0].label = hostile;
  source.categories[0].summary = hostile;
  source.fixes[0] = { title: hostile, why: hostile, action: hostile, evidence: evidence(hostile) };
  source.checks[0] = { ...source.checks[0], label: hostile, evidence: evidence(hostile), recommendation: hostile };
  source.pages[1].reason = hostile;
  const p = provider();
  await deliverReport(input({ report: source }), { config: config(), fetch: p.fetch });
  const call = p.calls[2];
  assert.equal(call.endpoint, EMAILS);
  assert.equal(call.headers['Idempotency-Key'], 'audit-report/request_12345678');
  assert.equal(call.headers.Authorization, 'Bearer test_resend_key');
  assert.equal(call.json.subject, 'Your requested website audit report');
  assert.deepEqual(call.json.to, ['owner@example.com']);
  assert.ok(call.json.html.includes('&lt;script&gt;alert(&quot;bad&quot;)&lt;/script&gt;'));
  assert.ok(!call.json.html.includes('<script>'));
  assert.ok(!call.json.html.includes('<img src=x'));
  assert.ok(call.json.html.includes('&amp; &#39;single&#39;'));
  assert.ok(call.json.text.includes(hostile));
  for (const check of source.checks) for (const item of check.evidence) assert.ok(call.json.text.includes(item.text));
  for (const fix of source.fixes) { assert.ok(call.json.text.includes(fix.action)); assert.ok(call.json.text.includes(fix.why)); }
  assert.equal((call.json.html.match(/<ol>/g) ?? []).length, 1);
  assert.equal((call.json.html.match(/<li><h3>/g) ?? []).length, 3);
  assert.ok(call.json.text.includes(bookingUrl));
  assert.ok(call.json.text.includes('limited review of publicly fetched HTML'));
  assert.ok(call.json.text.includes('complete report is included in this email'));
  assert.ok(call.json.text.includes('may expire after 24 hours'));
  assert.ok(call.json.text.includes('Report delivery is separate from marketing consent'));
  assert.ok(call.json.text.includes('existing marketing preferences have not been changed'));
});

test('replaying the same report request produces a stable email payload and idempotency key', async () => {
  const first = provider(); const second = provider();
  await deliverReport(input(), { config: config(), fetch: first.fetch });
  await deliverReport(input(), { config: config(), fetch: second.fetch });
  assert.equal(first.calls[2].body, second.calls[2].body);
  assert.equal(first.calls[2].headers['Idempotency-Key'], second.calls[2].headers['Idempotency-Key']);
});

test('unavailable scores stay unscored in email and CRM summary', async () => {
  const p = provider();
  await deliverReport(input({ report: report({ score: null, categories: [{ id: 'local', label: 'Local', score: null, summary: 'Unavailable' }] }) }), { config: config(), fetch: p.fetch });
  assert.match(p.calls[2].json.text, /Not scored — insufficient observable HTML/);
  assert.doesNotMatch(p.calls[2].json.text, /null\/100|0\/100/);
  assert.match(JSON.parse(p.calls[1].json.properties.rnr_audit_last_report).summary, /Not scored/);
});

test('explicit email rejection is terminal with no resend retry and no provider detail in errors', async () => {
  for (const status of [400, 401, 429, 500, 503]) {
    const p = provider([json(200, { id: '123' }), json(200, { id: '123' }), json(status, { message: 'private-provider-detail owner@example.com' })]);
    await rejectsCode(deliverReport(input(), { config: config(), fetch: p.fetch }), 'DELIVERY_FAILED');
    assert.equal(p.calls.filter(call => call.endpoint === EMAILS).length, 1);
  }
});

test('email network failure and malformed success are uncertain without a retry', async () => {
  for (const step of [new Error('private-provider-detail owner@example.com'), json(200, {}), json(200, { id: '' }), new Response('not json', { status: 200 }), json(200, { id: 'email_123', padding: 'x'.repeat(33000) })]) {
    const p = provider([json(200, { id: '123' }), json(200, { id: '123' }), step]);
    await rejectsCode(deliverReport(input(), { config: config(), fetch: p.fetch }), 'DELIVERY_UNCERTAIN');
    assert.equal(p.calls.length, 3);
  }
});

test('email timeout aborts after five seconds even when fetch ignores abort, without retry', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let started;
  const emailStarted = new Promise(resolve => { started = resolve; });
  const p = provider([json(200, { id: '123' }), json(200, { id: '123' }), () => { started(); return new Promise(() => {}); }]);
  const result = deliverReport(input(), { config: config(), fetch: p.fetch });
  await emailStarted;
  const rejected = rejectsCode(result, 'DELIVERY_UNCERTAIN');
  context.mock.timers.tick(DELIVERY_LIMITS.timeoutMs);
  await rejected;
  assert.equal(p.calls.length, 3);
  assert.equal(p.calls[2].signal.aborted, true);
});

test('email timeout includes a stalled response body, not just response headers', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let started;
  let cancelled = false;
  const bodyStarted = new Promise(resolve => { started = resolve; });
  const p = provider([json(200, { id: '123' }), json(200, { id: '123' }), () => new Response(new ReadableStream({ start() { started(); }, cancel() { cancelled = true; } }), { status: 200 })]);
  const result = deliverReport(input(), { config: config(), fetch: p.fetch });
  await bodyStarted;
  const rejected = rejectsCode(result, 'DELIVERY_UNCERTAIN');
  context.mock.timers.tick(DELIVERY_LIMITS.timeoutMs);
  await rejected;
  assert.equal(p.calls.length, 3);
  assert.equal(p.calls[2].signal.aborted, true);
  assert.equal(cancelled, true);
});

test('CRM timeout aborts the attempt, skips email, and distinguishes an uncertain mutation', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  for (const mutation of [false, true]) {
    let started;
    const attemptStarted = new Promise(resolve => { started = resolve; });
    const hang = () => { started(); return new Promise(() => {}); };
    const p = provider(mutation ? [json(200, { id: '123' }), hang] : [hang]);
    const result = deliverReport(input(), { config: config(), fetch: p.fetch });
    await attemptStarted;
    const rejected = rejectsCode(result, mutation ? 'CRM_UNCERTAIN' : 'CRM_FAILED');
    context.mock.timers.tick(DELIVERY_LIMITS.timeoutMs);
    await rejected;
    assert.equal(p.calls.length, mutation ? 2 : 1);
    assert.equal(p.calls.at(-1).signal.aborted, true);
    assert.ok(p.calls.every(call => call.endpoint.startsWith(CONTACTS)));
  }
});

test('CRM rejection and lookup failures prevent any email attempt', async () => {
  for (const steps of [
    [json(401, {})], [json(429, {})], [new Error('private-provider-detail')], [json(200, { id: '../unsafe' })],
    [json(200, { id: '123' }), json(403, {})], [json(404, {}), json(500, {})],
  ]) {
    const p = provider(steps);
    await rejectsCode(deliverReport(input(), { config: config(), fetch: p.fetch }), 'CRM_FAILED');
    assert.ok(p.calls.every(call => call.endpoint.startsWith(CONTACTS)));
  }
});

test('unconfirmed CRM mutations prevent email and never retry mutation', async () => {
  for (const steps of [
    [json(200, { id: '123' }), new Error('private-provider-detail')],
    [json(404, {}), json(201, {})],
    [json(200, { id: '123' }), json(200, { id: '456' })],
  ]) {
    const p = provider(steps);
    await rejectsCode(deliverReport(input(), { config: config(), fetch: p.fetch }), 'CRM_UNCERTAIN');
    assert.equal(p.calls.length, 2);
    assert.ok(p.calls.every(call => call.endpoint.startsWith(CONTACTS)));
  }
});
