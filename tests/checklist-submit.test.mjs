import test from 'node:test';
import assert from 'node:assert/strict';
import submit from '../netlify/functions/submit-checklist.mjs';

const request = fields => new Request('https://example.test/.netlify/functions/submit-checklist', { method: 'POST', body: new URLSearchParams(fields) });
test('checklist rejects invalid emails and sales-form names without forwarding', async () => {
  for (const fields of [{ 'form-name': 'AI Checklist Form', email: 'invalid' }, { 'form-name': 'Schedule Lead Form', email: 'owner@example.test' }]) {
    assert.equal((await submit(request(fields))).status, 422);
  }
  assert.equal((await submit(new Request('https://example.test'))).status, 405);
});
test('checklist forwards only signup fields and accepts an email without a phone', async t => {
  let forwarded;
  t.mock.method(globalThis, 'fetch', async (url, options) => { forwarded = new URLSearchParams(options.body); return new Response('', { status: 200 }); });
  const response = await submit(request({ 'form-name': 'AI Checklist Form', email: ' owner@example.test ', phone: 'discard', 'utm-source': 'google', 'lead-stage': 'qualified' }));
  assert.equal(response.status, 200);
  assert.equal(forwarded.get('email'), 'owner@example.test');
  assert.equal(forwarded.get('utm-source'), 'google');
  assert.equal(forwarded.has('phone'), false);
  assert.equal(forwarded.has('lead-stage'), false);
});
test('checklist failure is retryable and a honeypot never reaches storage', async t => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; throw new Error('offline'); });
  assert.equal((await submit(request({ 'form-name': 'AI Checklist Form', email: 'owner@example.test' }))).status, 502);
  assert.equal((await submit(request({ 'form-name': 'AI Checklist Form', email: 'owner@example.test', 'bot-field': 'spam' }))).status, 200);
  assert.equal(calls, 1);
});
