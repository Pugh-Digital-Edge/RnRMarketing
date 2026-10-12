import test from 'node:test';
import assert from 'node:assert/strict';
import submit from '../netlify/functions/submit-lead.mjs';
import gate, { config } from '../netlify/edge-functions/validate-lead.js';

const fields = { 'form-name': 'Schedule Lead Form', 'lead-stage': 'request', 'submission-id': 'submission-1234', name: 'QA Owner', company: 'QA Restoration', email: 'owner@example.test', phone: '(202) 555-0147', 'phone-country': 'US', 'service-area': 'QA territory', 'program-scope': 'not-sure', 'landing-page': '/restoration-marketing/', gclid: 'QA-CLICK' };
const request = (fields, path = '/thank-you/', headers = {}) => new Request(`https://example.test${path}`, { method: 'POST', headers, body: new URLSearchParams(fields) });

test('all static paths are gated and invalid native POSTs cannot reach Netlify storage', async () => {
  assert.equal(config.path, '/*'); assert.equal(config.onError, 'fail');
  for (const path of ['/', '/thank-you/', '/restoration-marketing/', '/other/']) {
    let forwarded = 0;
    for (const patch of [Object.fromEntries(Object.keys(fields).filter(k => ['name', 'email', 'phone', 'company', 'service-area', 'program-scope'].includes(k)).map(k => [k, ''])),
      { name: ' ' }, { email: 'bad' }, { company: '' }, { 'service-area': ' ' }, { 'program-scope': 'unknown' }, { phone: '' }, { 'lead-stage': 'unknown' }, { 'lead-stage': '', 'program-scope': '' }]) {
      const response = await gate(request({ ...fields, ...patch }, path), { next() { forwarded++; } });
      assert.equal(response.status, 422);
    }
    assert.equal(forwarded, 0);
  }
});

test('valid direct POST passes with an untouched body, attribution and international phones', async () => {
  for (const patch of [{}, { phone: '+442079460018', 'phone-country': 'GB' }]) {
    const req = request({ ...fields, ...patch }); const expected = await req.clone().text();
    const response = await gate(req, { async next() { assert.equal(await req.text(), expected); return new Response('provider'); } });
    assert.equal(await response.text(), 'provider');
  }
});

test('stage tampering cannot weaken contact validation and identity never has a request receipt', async t => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; return new Response('provider'); });
  for (const patch of [{ 'lead-stage': 'identity', name: '' }, { 'lead-stage': 'identity', email: '' }, { 'lead-stage': 'identity', company: '' }, { 'lead-stage': 'identity', 'submission-id': '' }, { 'lead-stage': 'other' }]) {
    assert.equal((await submit(request({ ...fields, ...patch }))).status, 422);
  }
  assert.equal(calls, 0);
  assert.deepEqual(await (await submit(request({ ...fields, 'lead-stage': 'identity', 'service-area': '' }))).json(), { ok: true });
});

test('no-JavaScript browser POST validates, generates an ID and redirects only after provider success', async t => {
  let stored;
  t.mock.method(globalThis, 'fetch', async (_url, options) => { stored = new URLSearchParams(options.body); return new Response('provider', { headers: { 'content-type': 'text/html' } }); });
  const response = await submit(request({ ...fields, 'submission-id': '' }, '/.netlify/functions/submit-lead', { accept: 'text/html' }));
  assert.equal(response.status, 303); assert.equal(new URL(response.headers.get('location')).pathname, '/thank-you/');
  assert.match(stored.get('submission-id'), /^[a-f0-9-]{36}$/); assert.equal(stored.get('gclid'), 'QA-CLICK');
  assert.equal(stored.get('phone'), '+12025550147');
});

test('native validation and provider errors preserve input safely for retry and never redirect', async t => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; return new Response('failed', { status: 503 }); });
  for (const [patch, status] of [[{ name: '<script>QA</script>', 'service-area': '' }, 422], [{ name: '<script>QA</script>' }, 502]]) {
    const response = await submit(request({ ...fields, ...patch }, '/.netlify/functions/submit-lead', { accept: 'text/html' }));
    assert.equal(response.status, status); assert.equal(response.headers.get('location'), null);
    const html = await response.text(); assert.match(html, /role="alert"/); assert.match(html, /owner@example.test/);
    assert.match(html, /QA-CLICK/); assert.match(html, /&lt;script&gt;QA/); assert.doesNotMatch(html, /<script>QA/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.equal(calls, 1);
});

test('duplicate and non-string fields are rejected, honeypot/test attempts never reach storage', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw Error('must not forward'); });
  const duplicate = new URLSearchParams(fields); duplicate.append('lead-stage', 'identity');
  assert.equal((await submit(request(duplicate))).status, 422);
  assert.equal((await gate(request(duplicate), { next() { throw Error('must not store'); } })).status, 422);
  const malformed = new Request('https://example.test/', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...fields, name: ['QA'] }) });
  assert.equal((await submit(malformed)).status, 422);
  for (const patch of [{ 'bot-field': 'bot' }, { 'test-flow': '1' }]) {
    const response = await gate(request({ ...fields, ...patch }), { next() { throw Error('must not store'); } });
    assert.deepEqual(await response.json(), { ok: true, stage: 'ignored' });
  }
});

test('GETs, function routes and existing non-lead forms retain their handlers', async () => {
  const context = { next() { throw Error('unexpected next'); } };
  assert.equal(await gate(new Request('https://example.test/'), context), undefined);
  assert.equal(await gate(request(fields, '/.netlify/functions/submit-lead'), context), undefined);
  assert.equal(await gate(request({ 'form-name': 'Newsletter Form', email: 'qa@example.test' }), context), undefined);
});

test('legacy schedule request preserves required service details and receives the same acceptance contract', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('provider'));
  const legacy = { ...fields, 'primary-service': 'Mold Remediation', 'landing-page': '/schedule/' };
  delete legacy['program-scope'];
  assert.equal((await submit(request({ ...legacy, 'primary-service': '' }))).status, 422);
  const response = await submit(request(legacy));
  assert.equal((await response.json()).stage, 'request_accepted');
});

test('native error can be corrected and retried with the same attribution; success alone redirects', async t => {
  let fail = true, stored = 0;
  t.mock.method(globalThis, 'fetch', async () => { if (fail) return new Response('retry', { status: 503 }); stored++; return new Response('provider'); });
  const headers = { accept: 'text/html' };
  assert.equal((await submit(request(fields, '/.netlify/functions/submit-lead', headers))).status, 502);
  fail = false;
  assert.equal((await submit(request(fields, '/.netlify/functions/submit-lead', headers))).status, 303);
  assert.equal(stored, 1);
});

test('native form multipart data uses the same validation and cannot weaken required fields', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('provider'));
  for (const valid of [false, true]) {
    const body = new FormData(); Object.entries({ ...fields, name: valid ? 'QA Owner' : '' }).forEach(([key, value]) => body.set(key, value));
    const response = await submit(new Request('https://example.test/.netlify/functions/submit-lead', { method: 'POST', body, headers: { accept: 'text/html' } }));
    assert.equal(response.status, valid ? 303 : 422);
  }
});

test('contact page optional ZIP remains optional and supplied ZIP is validated', async t => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; return new Response('provider'); });
  const contact = { 'form-name': 'Contact Form', name: 'QA Owner', email: 'owner@example.test', phone: '+12025550147', Message: 'QA goals' };
  assert.equal((await submit(request(contact))).status, 200);
  assert.equal((await submit(request({ ...contact, zip: '12345' }))).status, 200);
  assert.equal((await submit(request({ ...contact, zip: 'bad' }))).status, 422);
  assert.equal(calls, 2);
});

test('native contact/chat recovery retains multiline messages in escaped textareas', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('provider failure', { status: 503 }));
  for (const [form, field] of [['Contact Form', 'Message'], ['Chat Widget Submission', 'message']]) {
    const response = await submit(request({ 'form-name': form, name: 'QA', email: 'qa@example.test', phone: '+12025550147', [field]: 'First line\n</textarea><script>QA</script>' }, '/.netlify/functions/submit-lead', { accept: 'text/html' }));
    const html = await response.text();
    assert.match(html, /First line\n&lt;\/textarea&gt;&lt;script&gt;QA/);
    assert.ok(html.includes(`<textarea required name="${field}">`));
    assert.doesNotMatch(html, /<script>QA/);
    if (form === 'Contact Form') assert.match(html, /<input type="text" name="zip"/);
  }
});
