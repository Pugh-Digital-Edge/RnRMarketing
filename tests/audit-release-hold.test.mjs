import test from 'node:test';
import assert from 'node:assert/strict';
import audit from '../netlify/functions/website-audit.mjs';
import report from '../netlify/functions/audit-report.mjs';
import worker from '../netlify/functions/audit-worker.mjs';
import { auditPreflight } from '../scripts/audit-preflight.mjs';

test('public release remains disabled even with operator launch flags; no provider/runtime call is needed', async t => {
  t.mock.method(globalThis, 'fetch', async () => assert.fail('A held release cannot call a provider.'));
  const prior = process.env.AUDIT_ENABLED;
  process.env.AUDIT_ENABLED = 'true';
  try {
    const request = new Request('https://remediationrestorationmarketing.com/.netlify/functions/website-audit');
    const configuration = await (await audit(request, {})).json();
    assert.equal(configuration.enabled, false);
    assert.equal(configuration.reportEnabled, false);
    assert.equal(configuration.mode, 'disabled');
    assert.equal((await audit(new Request(request.url, { method: 'POST', body: '{}' }), {})).status, 503);
    assert.equal((await report(new Request(request.url, { method: 'POST' }), {})).status, 503);
    assert.equal((await worker(new Request(request.url, { method: 'POST' }))).status, 403);
    assert.equal(auditPreflight({ AUDIT_ENABLED: 'true' }).publicReleaseHold, true);
  } finally { if (prior === undefined) delete process.env.AUDIT_ENABLED; else process.env.AUDIT_ENABLED = prior; }
});
