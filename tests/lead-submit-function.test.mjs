import test from 'node:test';
import assert from 'node:assert/strict';
import submit from '../netlify/functions/submit-lead.mjs';
const fields = { 'form-name': 'Schedule Lead Form', 'lead-stage': 'request', 'submission-id': 'submission-1234', name: 'QA Owner', company: 'QA Restoration', email: 'owner@example.test', phone: '(202) 555-0147', 'phone-country': 'US', 'service-area': 'QA territory', 'program-scope': 'not-sure', 'monthly-budget': '', gclid: 'QA-CLICK' };
const request = body => new Request('https://example.test/.netlify/functions/submit-lead', { method: 'POST', body: new URLSearchParams(body) });
test('server receipt follows documented provider HTTP success and preserves form routing, attribution and phone', async t => {
 let payload, target;
 t.mock.method(globalThis, 'fetch', async (url, options) => { target = url; payload = new URLSearchParams(options.body); return new Response('Netlify success HTML', { status: 200, headers: { 'content-type': 'text/html' } }); });
 const response = await submit(request(fields));
 assert.equal(new URL(target).pathname, '/');
 assert.deepEqual(await response.json(), { ok: true, stage: 'request_accepted', submissionId: 'submission-1234', receiptSource: 'netlify_http' });
 assert.equal(payload.get('form-name'), 'Schedule Lead Form'); assert.equal(payload.get('phone'), '+12025550147'); assert.equal(payload.get('gclid'), 'QA-CLICK'); assert.equal(payload.get('monthly-budget'), '');
 assert.equal(payload.has('phone-country'), false);
});
test('provider error, JSON error and network failure are retryable and never emit receipts', async t => {
 for (const mode of ['http', 'json', 'network']) {
  t.mock.method(globalThis, 'fetch', async () => { if (mode === 'network') throw Error('offline'); return new Response(mode, { status: mode === 'http' ? 500 : 200, headers: { 'content-type': mode === 'json' ? 'application/json' : 'text/html' } }); });
  const response = await submit(request(fields)); assert.equal(response.status, 502); assert.equal((await response.json()).stage, undefined);
  t.mock.restoreAll();
 }
});
test('identity remains identity, incomplete final requests fail, and bot/test payloads never forward', async t => {
 let calls = 0;
 t.mock.method(globalThis, 'fetch', async () => { calls++; return new Response('', { status: 200 }); });
 assert.deepEqual(await (await submit(request({ ...fields, 'lead-stage': 'identity', 'service-area': '' }))).json(), { ok: true });
 for (const patch of [{ 'submission-id': '' }, { email: 'invalid' }, { 'service-area': '' }]) assert.equal((await submit(request({ ...fields, ...patch }))).status, 422);
 assert.equal((await submit(request({ ...fields, 'bot-field': 'spam' }))).status, 200);
 assert.equal((await submit(request({ ...fields, 'test-flow': '1' }))).status, 200);
 assert.equal(calls, 1);
});

test('malformed request JSON is rejected before provider forwarding', async t => {
 t.mock.method(globalThis, 'fetch', async () => { throw Error('must not forward'); });
 const response = await submit(new Request('https://example.test/.netlify/functions/submit-lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{broken' }));
 assert.equal(response.status, 422);
});
