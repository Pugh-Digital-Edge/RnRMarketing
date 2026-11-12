import test from 'node:test';
import assert from 'node:assert/strict';
import { auditPreflight } from '../scripts/audit-preflight.mjs';

test('preflight reports approved caps and concrete missing gates without enabling anything', () => {
  const result = auditPreflight({});
  assert.deepEqual(result.approvedScanBudget, { currency: 'USD', dailyUsd: 5, monthlyUsd: 50, approvedOn: '2026-11-05' });
  assert.equal(result.liveScanEnabled, false);
  assert.equal(result.reportEnabled, false);
  assert.equal(result.safeToLaunch, false);
  assert.ok(result.missingVariables.includes('AUDIT_DATABASE_URL'));
});

test('preflight never treats configuration shape as staging proof or exposes secret values', () => {
  const secret = 'example-sensitive-value-not-a-real-key';
  const result = auditPreflight({ AUDIT_ORIGIN: 'https://agency.example', AUDIT_DATABASE_URL: `postgresql://name:${secret}@db.example/audit`,
    AUDIT_SIGNING_SECRET: secret, AUDIT_TURNSTILE_SITE_KEY: 'public-example', AUDIT_TURNSTILE_SECRET: secret });
  assert.equal(result.configurationShapeValid, true);
  assert.equal(result.liveScanEnabled, false);
  assert.equal(result.safeToLaunch, false);
  assert.doesNotMatch(JSON.stringify(result), new RegExp(secret));
});

test('a requested report configuration cannot pass preflight with missing delivery prerequisites', () => {
  const result = auditPreflight({ AUDIT_ORIGIN: 'https://agency.example', AUDIT_DATABASE_URL: 'postgresql://local/audit',
    AUDIT_SIGNING_SECRET: 'example-sensitive-value-not-a-real-key', AUDIT_TURNSTILE_SITE_KEY: 'public-example', AUDIT_TURNSTILE_SECRET: 'example',
    AUDIT_REPORT_ENABLED: 'true' });
  assert.equal(result.configurationShapeValid, false);
  assert.equal(result.reportConfigurationShapeValid, false);
  assert.ok(result.missingVariables.includes('AUDIT_HUBSPOT_TOKEN'));
  assert.ok(result.missingVariables.includes('AUDIT_MAX_REPORT_COST_MICROS'));
});
