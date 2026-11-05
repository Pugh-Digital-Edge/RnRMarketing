import test from 'node:test';
import assert from 'node:assert/strict';
import { APPROVED_SCAN_BUDGET } from '../netlify/functions/lib/audit/budget-policy.mjs';
import { loadConfig } from '../netlify/functions/lib/audit/config.mjs';
import { MemoryAuditStore, PostgresAuditStore } from '../netlify/functions/lib/audit/store.mjs';

const DAY = 86400000;
const config = (extra = {}) => ({ ipDaily: 3, sessionDaily: 3, globalDaily: 50, maxActive: 2, maxQueued: 8, cacheMs: DAY, leaseMs: 120000,
  dailyBudgetMicros: APPROVED_SCAN_BUDGET.dailyBudgetMicros, monthlyBudgetMicros: APPROVED_SCAN_BUDGET.monthlyBudgetMicros,
  maxScanCostMicros: 1_000_000, ...extra });
const input = id => ({ key: `simulation-${id}`, input: { url: `https://example-${id}.com/` }, ipHash: `ip-${id}`, sessionHash: `session-${id}` });

test('approved policy is exactly USD 5/day and USD 50/month; both store adapters reject higher caps', () => {
  assert.equal(APPROVED_SCAN_BUDGET.currency, 'USD');
  assert.equal(APPROVED_SCAN_BUDGET.dailyBudgetMicros, 5_000_000);
  assert.equal(APPROVED_SCAN_BUDGET.monthlyBudgetMicros, 50_000_000);
  assert.equal(Object.isFrozen(APPROVED_SCAN_BUDGET), true);
  for (const extra of [{ dailyBudgetMicros: 5_000_001 }, { monthlyBudgetMicros: 50_000_001 }]) {
    assert.throws(() => new MemoryAuditStore({ config: config(extra) }), { code: 'INVALID_CONFIG' });
    let connections = 0;
    assert.throws(() => new PostgresAuditStore({ config: config(extra), pool: { connect() { connections++; } } }), { code: 'INVALID_CONFIG' });
    assert.equal(connections, 0);
  }
});

test('concurrent synthetic USD 1 reservations stop atomically at the approved USD 5 daily ceiling', async () => {
  const store = new MemoryAuditStore({ config: config() });
  const results = await Promise.allSettled(Array.from({ length: 6 }, (_, id) => store.submit(input(id))));
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 5);
  assert.equal(results.find(result => result.status === 'rejected').reason.code, 'DAILY_BUDGET');
  assert.equal(Object.values(store.state.daily)[0].reservedMicros, 5_000_000);
  // These are ledger simulations only: no scanner/provider is invoked.
});

test('reservations across UTC days stop at the approved USD 50 monthly ceiling', async () => {
  const start = Date.UTC(2026, 10, 1, 12);
  let now = start;
  const store = new MemoryAuditStore({ config: config(), clock: () => now });
  for (let day = 0; day < 10; day++) {
    now = start + day * DAY;
    for (let number = 0; number < 5; number++) {
      const { job } = await store.submit(input(`${day}-${number}`));
      const { leaseToken } = await store.claim(job.id);
      await store.fail(job.id, 'Synthetic ambiguous provider outcome.', { leaseToken });
    }
  }
  now += DAY;
  await assert.rejects(store.submit(input('next-day')), { code: 'MONTHLY_BUDGET' });
  assert.equal(store.state.monthly['2026-11'].reservedMicros, 50_000_000);
});

test('lower operator limits remain valid; the approval alone never enables scanning or delivery', () => {
  assert.equal(loadConfig({}).enabled, false);
  const env = { AUDIT_ENABLED: 'true', AUDIT_LAUNCH_VERIFIED: 'true', AUDIT_ORIGIN: 'https://agency.example', AUDIT_DATABASE_URL: 'postgresql://local/audit',
    AUDIT_TURNSTILE_SECRET: 'test-only', AUDIT_TURNSTILE_SITE_KEY: 'test-only', AUDIT_SIGNING_SECRET: 'test-only-secret-at-least-thirty-two-bytes',
    AUDIT_DAILY_BUDGET_MICROS: '1000000', AUDIT_MONTHLY_BUDGET_MICROS: '10000000' };
  const settings = loadConfig(env);
  assert.equal(settings.dailyBudgetMicros, 1_000_000);
  assert.equal(settings.monthlyBudgetMicros, 10_000_000);
  assert.equal(settings.maxScanCostMicros, 0);
  assert.equal(settings.reportEnabled, false);
  assert.equal(loadConfig({ ...env, AUDIT_LAUNCH_VERIFIED: 'false' }).enabled, false);
  assert.equal(loadConfig({ ...env, AUDIT_SIGNING_SECRET: '' }).enabled, false);
});

test('scan approval cannot authorize paid report delivery through the shared ledger', () => {
  const env = { AUDIT_ENABLED: 'true', AUDIT_LAUNCH_VERIFIED: 'true', AUDIT_ORIGIN: 'https://agency.example', AUDIT_DATABASE_URL: 'postgresql://local/audit',
    AUDIT_TURNSTILE_SECRET: 'test-only', AUDIT_TURNSTILE_SITE_KEY: 'test-only', AUDIT_SIGNING_SECRET: 'test-only-secret-at-least-thirty-two-bytes',
    AUDIT_REPORT_ENABLED: 'true', AUDIT_REPORT_LAUNCH_VERIFIED: 'true', AUDIT_RESEND_API_KEY: 'test-only', AUDIT_EMAIL_FROM: 'audit@example.com',
    AUDIT_HUBSPOT_TOKEN: 'test-only', AUDIT_HUBSPOT_REPORT_PROPERTY: 'rnr_audit_report_context', AUDIT_HUBSPOT_CONSENT_PROPERTY: 'rnr_audit_marketing_request',
    AUDIT_MAX_REPORT_COST_MICROS: '1' };
  assert.equal(loadConfig(env).reportEnabled, false);
  assert.equal(loadConfig({ ...env, AUDIT_MAX_REPORT_COST_MICROS: '0' }).reportEnabled, true);
});
