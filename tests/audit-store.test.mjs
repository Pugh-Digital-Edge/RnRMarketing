import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MemoryAuditStore, PostgresAuditStore } from '../netlify/functions/lib/audit/store.mjs';

const DAY = 86_400_000;
const START = Date.UTC(2026, 10, 5, 12);
const config = (overrides = {}) => ({
  ipDaily: 3, sessionDaily: 3, globalDaily: 50,
  maxActive: 2, maxQueued: 8, cacheMs: DAY, leaseMs: 120_000,
  dailyBudgetMicros: 50_000, monthlyBudgetMicros: 1_000_000,
  maxScanCostMicros: 100, ...overrides,
});
const request = (n, overrides = {}) => ({
  key: `domain:${n}`, input: { website: `https://example${n}.com` },
  ipHash: `ip:${n}`, sessionHash: `session:${n}`, ...overrides,
});
function memory(overrides = {}) {
  let now = START;
  const store = new MemoryAuditStore({ config: config(overrides), clock: () => now });
  return { store, advance: (ms) => { now += ms; }, set: (value) => { now = value; } };
}
const rejectsCode = (promise, code) => assert.rejects(promise, (error) => error.code === code);
async function finish(store, result, cost = 100) {
  const lease = await store.claim(result.job.id);
  assert.ok(lease, 'a queued job can be claimed');
  return store.complete(result.job.id, { score: 88 }, { leaseToken: lease.leaseToken, actualCostMicros: cost });
}
async function fail(store, result) {
  const lease = await store.claim(result.job.id);
  assert.ok(lease);
  return store.fail(result.job.id, new Error('provider unavailable'), { leaseToken: lease.leaseToken });
}

test('simultaneous identical submissions create one job and reserve once', async () => {
  const { store } = memory({ dailyBudgetMicros: 100 });
  const results = await Promise.all(Array.from({ length: 20 }, (_, n) => store.submit(request(n, { key: 'same-domain' }))));
  assert.equal(new Set(results.map(({ job }) => job.id)).size, 1);
  assert.equal(results.filter(({ deduplicated }) => !deduplicated).length, 1);
  assert.ok(results.every(({ job }) => job.status === 'queued'));
  await rejectsCode(store.submit(request('new')), 'DAILY_BUDGET');
});

test('IP quota is atomic across distinct sessions and input keys', async () => {
  const { store } = memory();
  const results = await Promise.allSettled(Array.from({ length: 12 }, (_, n) => store.submit(request(n, { ipHash: 'same-ip' }))));
  assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 3);
  assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'IP_QUOTA'));
});

test('a session can have only one queued or running fresh job', async () => {
  const { store } = memory();
  const results = await Promise.allSettled([1, 2, 3].map((n) => store.submit(request(n, { sessionHash: 'same-session' }))));
  assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 1);
  assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'ACTIVE_SESSION'));
  const accepted = results.find(({ status }) => status === 'fulfilled').value;
  const lease = await store.claim(accepted.job.id);
  await rejectsCode(store.submit(request('running', { sessionHash: 'same-session' })), 'ACTIVE_SESSION');
  await store.fail(accepted.job.id, 'provider failure', { leaseToken: lease.leaseToken });
  assert.equal((await store.submit(request('later', { sessionHash: 'same-session' }))).job.status, 'queued');
});

test('session quota counts failures and does not race at its final allowance', async () => {
  const { store } = memory();
  for (const n of [1, 2]) await fail(store, await store.submit(request(n, { sessionHash: 'same-session' })));
  const results = await Promise.allSettled([3, 4].map((n) => store.submit(request(n, { sessionHash: 'same-session' }))));
  const accepted = results.filter(({ status }) => status === 'fulfilled');
  assert.equal(accepted.length, 1);
  assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => ['SESSION_QUOTA', 'ACTIVE_SESSION'].includes(reason.code)));
  await fail(store, accepted[0].value);
  await rejectsCode(store.submit(request(5, { sessionHash: 'same-session' })), 'SESSION_QUOTA');
});

test('global daily quota is atomic across different IPs and sessions', async () => {
  const { store } = memory({ globalDaily: 5 });
  const results = await Promise.allSettled(Array.from({ length: 12 }, (_, n) => store.submit(request(n))));
  assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 5);
  assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'GLOBAL_QUOTA'));
});

test('queue capacity is atomic and rejected requests do not reserve budget', async () => {
  const { store } = memory({ maxQueued: 2, dailyBudgetMicros: 300 });
  const results = await Promise.allSettled([1, 2, 3].map((n) => store.submit(request(n))));
  assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 2);
  assert.equal(results.find(({ status }) => status === 'rejected').reason.code, 'QUEUE_FULL');
  const first = results.find(({ status }) => status === 'fulfilled').value;
  await fail(store, first);
  assert.equal((await store.submit(request(4))).job.status, 'queued');
});

test('concurrent claims enforce the global running cap', async () => {
  const { store } = memory();
  const jobs = await Promise.all(Array.from({ length: 6 }, (_, n) => store.submit(request(n))));
  const claims = await Promise.all(jobs.map(({ job }) => store.claim(job.id)));
  assert.equal(claims.filter(Boolean).length, 2);
  assert.equal((await Promise.all(jobs.map(({ job }) => store.read(job.id)))).filter(({ status }) => status === 'running').length, 2);
});

test('claimNext picks oldest queued jobs and fences each lease', async () => {
  const { store, advance } = memory();
  const first = await store.submit(request(1));
  advance(1);
  const second = await store.submit(request(2));
  const leases = await Promise.all([store.claimNext(), store.claimNext(), store.claimNext()]);
  assert.deepEqual(leases.filter(Boolean).map(({ job }) => job.id), [first.job.id, second.job.id]);
  assert.ok(leases.filter(Boolean).every(({ leaseToken }) => typeof leaseToken === 'string' && leaseToken.length > 10));
  assert.notEqual(leases[0].leaseToken, leases[1].leaseToken);
});

test('daily budget reserves worst case atomically before workers start', async () => {
  const { store } = memory({ dailyBudgetMicros: 250 });
  const results = await Promise.allSettled([1, 2, 3, 4].map((n) => store.submit(request(n))));
  assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 2);
  assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'DAILY_BUDGET'));
});

test('monthly budget reserves worst case atomically', async () => {
  const { store } = memory({ monthlyBudgetMicros: 250 });
  const results = await Promise.allSettled([1, 2, 3, 4].map((n) => store.submit(request(n))));
  assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 2);
  assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'MONTHLY_BUDGET'));
});

test('verified actual cost releases only unused reservation', async () => {
  const { store } = memory({ dailyBudgetMicros: 150 });
  const first = await store.submit(request(1));
  await finish(store, first, 20);
  const second = await store.submit(request(2));
  await fail(store, second);
  await rejectsCode(store.submit(request(3)), 'DAILY_BUDGET');
});

test('provider failure and retry retain every full reservation', async () => {
  const { store } = memory({ dailyBudgetMicros: 200 });
  const first = await store.submit(request(1));
  await fail(store, first);
  const retry = await store.submit(request(1));
  assert.notEqual(retry.job.id, first.job.id);
  await fail(store, retry);
  await rejectsCode(store.submit(request(1)), 'DAILY_BUDGET');
});

test('completion without verified actual cost retains the full reservation', async () => {
  const { store } = memory({ dailyBudgetMicros: 150 });
  const first = await store.submit(request(1));
  const lease = await store.claim(first.job.id);
  const completed = await store.complete(first.job.id, { score: 90 }, { leaseToken: lease.leaseToken });
  assert.equal(completed.status, 'complete');
  await rejectsCode(store.submit(request(2)), 'DAILY_BUDGET');
});

test('invalid actual cost fails the job conservatively and keeps its reservation', async () => {
  for (const cost of [101, -1, 1.5, NaN, Infinity, '10']) {
    const { store } = memory({ dailyBudgetMicros: 100 });
    const first = await store.submit(request(1));
    const lease = await store.claim(first.job.id);
    await rejectsCode(store.complete(first.job.id, { score: 90 }, { leaseToken: lease.leaseToken, actualCostMicros: cost }), 'INVALID_COST');
    assert.equal((await store.read(first.job.id)).status, 'failed');
    await rejectsCode(store.submit(request(2)), 'DAILY_BUDGET');
  }
});

test('cache hits bypass quota and budget and expire after 24 hours', async () => {
  const { store, advance } = memory({ ipDaily: 1, sessionDaily: 1, dailyBudgetMicros: 100, monthlyBudgetMicros: 300 });
  const first = await store.submit(request(1));
  await finish(store, first);
  const cached = await store.submit(request(1));
  assert.equal(cached.cached, true);
  assert.equal(cached.job.id, first.job.id);
  assert.deepEqual(cached.job.report, { score: 88 });
  advance(DAY + 1);
  const fresh = await store.submit(request(1));
  assert.equal(fresh.cached, false);
  assert.notEqual(fresh.job.id, first.job.id);
});

test('daily counters reset without resetting the current monthly reservation', async () => {
  const { store, advance } = memory({ ipDaily: 1, sessionDaily: 1, dailyBudgetMicros: 100, monthlyBudgetMicros: 200 });
  await fail(store, await store.submit(request(1)));
  advance(DAY);
  await fail(store, await store.submit(request(1)));
  advance(DAY);
  await rejectsCode(store.submit(request(1)), 'MONTHLY_BUDGET');
});

test('monthly rollover permits new budget while preserving prior job history', async () => {
  const { store, set } = memory({ monthlyBudgetMicros: 100 });
  const old = await store.submit(request(1));
  await fail(store, old);
  set(Date.UTC(2026, 11, 1, 12));
  assert.equal((await store.submit(request(2))).job.status, 'queued');
});

test('expired worker is failed and late worker writes cannot overwrite the result', async () => {
  const { store, advance } = memory({ maxActive: 1, dailyBudgetMicros: 200 });
  const first = await store.submit(request(1));
  const lease = await store.claim(first.job.id);
  advance(120_001);
  assert.equal((await store.read(first.job.id)).status, 'failed');
  await rejectsCode(store.complete(first.job.id, { score: 99 }, { leaseToken: lease.leaseToken, actualCostMicros: 0 }), 'LEASE_LOST');
  await rejectsCode(store.fail(first.job.id, 'late failure', { leaseToken: lease.leaseToken }), 'LEASE_LOST');
  const next = await store.submit(request(2, { sessionHash: 'session:1' }));
  assert.ok(await store.claim(next.job.id));
  await rejectsCode(store.submit(request(3)), 'DAILY_BUDGET');
});

test('wrong or missing lease token cannot complete or fail a running job', async () => {
  const { store } = memory();
  const first = await store.submit(request(1));
  const lease = await store.claim(first.job.id);
  await rejectsCode(store.complete(first.job.id, { score: 99 }, { leaseToken: 'wrong', actualCostMicros: 0 }), 'LEASE_LOST');
  await rejectsCode(store.fail(first.job.id, 'failed', {}), 'LEASE_LOST');
  assert.equal((await store.read(first.job.id)).status, 'running');
  await store.complete(first.job.id, { score: 88 }, { leaseToken: lease.leaseToken, actualCostMicros: 100 });
  await rejectsCode(store.complete(first.job.id, { score: 99 }, { leaseToken: lease.leaseToken, actualCostMicros: 0 }), 'LEASE_LOST');
  assert.deepEqual((await store.read(first.job.id)).report, { score: 88 });
});

test('abandoned queue entries expire, free the session and retain reservation', async () => {
  const { store, advance } = memory({ dailyBudgetMicros: 200 });
  const first = await store.submit(request(1));
  advance(600_001);
  assert.equal((await store.read(first.job.id)).status, 'failed');
  assert.equal(await store.claim(first.job.id), null);
  assert.equal((await store.submit(request(2, { sessionHash: 'session:1' }))).job.status, 'queued');
  await rejectsCode(store.submit(request(3)), 'DAILY_BUDGET');
});

test('read and submit results cannot mutate persisted jobs or caller input', async () => {
  const { store } = memory();
  const input = request(1);
  const first = await store.submit(input);
  input.input.website = 'https://changed.example';
  first.job.input.website = 'https://other.example';
  const observed = await store.read(first.job.id);
  assert.equal(observed.input.website, 'https://example1.com');
  observed.status = 'complete';
  assert.equal((await store.read(first.job.id)).status, 'queued');
});

test('request rate limits are separate, atomic and reset after their window', async () => {
  const { store, advance } = memory();
  const results = await Promise.all(Array.from({ length: 20 }, () => store.consumeRate({ scope: 'status', key: 'same-ip', limit: 3, windowMs: 60_000 })));
  assert.equal(results.filter(({ allowed }) => allowed).length, 3);
  assert.ok(results.every(({ remaining, resetAt }) => remaining >= 0 && resetAt > START));
  assert.equal((await store.consumeRate({ scope: 'submit', key: 'same-ip', limit: 3, windowMs: 60_000 })).allowed, true);
  advance(60_001);
  assert.equal((await store.consumeRate({ scope: 'status', key: 'same-ip', limit: 3, windowMs: 60_000 })).allowed, true);
});

test('memory readiness works locally and production configurations reject memory storage', async () => {
  assert.equal(await memory().store.ping(), true);
  for (const overrides of [{ production: true }, { environment: 'production' }]) {
    assert.throws(() => new MemoryAuditStore({ config: config(overrides) }));
  }
});

test('memory storage rejects production process and hosting environments', () => {
  for (const name of ['NODE_ENV', 'CONTEXT']) {
    const original = process.env[name];
    try {
      process.env[name] = 'production';
      assert.throws(() => new MemoryAuditStore({ config: config() }), { code: 'STORE_UNAVAILABLE' });
    } finally {
      if (original === undefined) delete process.env[name];
      else process.env[name] = original;
    }
  }
});

// A transaction-aware fake checks SQL ordering, locking and rollback without credentials or a remote database.
class FakePool {
  constructor() {
    this.state = { version: 1, jobs: {}, daily: {}, monthly: {}, rates: {}, auxiliary: {} };
    this.schemaVersion = 2;
    this.reports = {};
    this.rateBuckets = {};
    this.missingRateControl = false;
    this.missingReportsTable = false;
    this.missingRateBucketsTable = false;
    this.missingRow = false;
    this.statements = [];
    this.tail = Promise.resolve();
    this.failUpdate = false;
    this.failConnect = false;
    this.failCommitAfterApply = false;
    this.failReportInsert = false;
    this.failRateWrite = false;
    this.destroyedClients = 0;
  }
  async connect() {
    if (this.failConnect) throw new Error('connection unavailable');
    const pool = this;
    let transactionData;
    let unlock;
    let inTransaction = false;
    const acquire = async () => {
      if (transactionData) return;
      const previous = pool.tail;
      pool.tail = new Promise((resolve) => { unlock = resolve; });
      await previous;
      transactionData = structuredClone({ state: pool.state, reports: pool.reports, rateBuckets: pool.rateBuckets });
    };
    const data = () => transactionData ?? pool;
    return {
      async query(sql, values = []) {
        const text = String(sql).replace(/\s+/g, ' ').trim();
        pool.statements.push(text);
        if (/^BEGIN\b/i.test(text)) {
          inTransaction = true;
          return { rows: [] };
        }
        if (/^COMMIT\b/i.test(text)) {
          assert.equal(inTransaction, true);
          if (transactionData) {
            pool.state = transactionData.state;
            pool.reports = transactionData.reports;
            pool.rateBuckets = transactionData.rateBuckets;
          }
          inTransaction = false;
          unlock?.();
          if (pool.failCommitAfterApply) {
            pool.failCommitAfterApply = false;
            throw new Error('commit response lost after database committed');
          }
          return { rows: [] };
        }
        if (/^ROLLBACK\b/i.test(text)) {
          inTransaction = false;
          transactionData = undefined;
          unlock?.();
          return { rows: [] };
        }
        if (/FROM rnr_audit\.audit_rate_control AS r/i.test(text)) {
          assert.equal(inTransaction, true);
          assert.match(text, /FOR UPDATE OF r/i);
          await acquire();
          return { rows: pool.missingRateControl || pool.missingRow ? [] : [{ id: 1, schema_version: pool.schemaVersion, state_version: String(data().state.version) }] };
        }
        if (/^SELECT\b/i.test(text) && /audit_control_state/i.test(text)) {
          if (/FOR UPDATE/i.test(text)) {
            assert.equal(inTransaction, true, 'state mutations must acquire the lock inside a transaction');
            await acquire();
          }
          if (pool.missingRow) return { rows: [] };
          if (/SELECT state, schema_version/i.test(text)) return { rows: [{ id: 1, schema_version: pool.schemaVersion, state: structuredClone(data().state) }] };
          // Metadata and one-job projections must not accidentally return the
          // complete control state or unrelated report payloads in this fake.
          const job = values.length ? data().state.jobs[values[0]] : undefined;
          const jsonType = (value) => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
          const hasReport = Boolean(job && Object.hasOwn(data().reports, job.id));
          return { rows: [{ id: 1, schema_version: pool.schemaVersion, state_version: String(data().state.version),
            jobs_type: jsonType(data().state.jobs), daily_type: jsonType(data().state.daily), monthly_type: jsonType(data().state.monthly), auxiliary_type: jsonType(data().state.auxiliary),
            rates_empty: JSON.stringify(data().state.rates) === '{}', rate_ready: !pool.missingRateControl, reports_ready: !pool.missingReportsTable, buckets_ready: !pool.missingRateBucketsTable,
            job: job ? structuredClone(job) : null, has_report: hasReport, report: hasReport ? structuredClone(data().reports[job.id]) : null }] };
        }
        if (/^UPDATE\b/i.test(text) && /audit_control_state/i.test(text)) {
          assert.equal(inTransaction, true, 'state mutations must be inside a transaction');
          assert.ok(transactionData, 'state mutations must hold the singleton lock');
          if (pool.failUpdate) throw new Error('write unavailable');
          const value = values.find((entry) => (typeof entry === 'object' && entry !== null) || (typeof entry === 'string' && entry.trim().startsWith('{')));
          transactionData.state = typeof value === 'string' ? JSON.parse(value) : structuredClone(value);
          return { rows: [], rowCount: 1 };
        }
        if (/audit_reports/i.test(text)) {
          if (pool.missingReportsTable) throw new Error('report table unavailable');
          if (/^SELECT\b/i.test(text)) return { rows: Object.hasOwn(data().reports, values[0]) ? [{ report: structuredClone(data().reports[values[0]]) }] : [] };
          assert.equal(inTransaction, true);
          assert.ok(transactionData, 'report writes share the control transaction');
          if (/^INSERT\b/i.test(text)) {
            if (pool.failReportInsert) throw new Error('report storage unavailable');
            transactionData.reports[values[0]] = typeof values[1] === 'string' ? JSON.parse(values[1]) : structuredClone(values[1]);
            return { rows: [], rowCount: 1 };
          }
          if (/^DELETE\b/i.test(text)) {
            const ids = Array.isArray(values[0]) ? values[0] : [values[0]];
            for (const id of ids) delete transactionData.reports[id];
            return { rows: [], rowCount: ids.length };
          }
        }
        if (/audit_rate_control/i.test(text)) {
          assert.equal(inTransaction, true);
          assert.match(text, /FOR UPDATE/i);
          await acquire();
          return { rows: pool.missingRateControl ? [] : [{ id: 1 }] };
        }
        if (/audit_rate_buckets/i.test(text)) {
          if (pool.missingRateBucketsTable) throw new Error('rate table unavailable');
          assert.equal(inTransaction, true);
          assert.ok(transactionData, 'rate mutations must hold their admission mutex');
          if (/^DELETE\b/i.test(text)) {
            let removed = 0;
            for (const [key, bucket] of Object.entries(transactionData.rateBuckets)) {
              // PostgreSQL's NULL comparison is unknown, so expiry does not
              // erase a malformed nullable value before its parser checks it.
              if (bucket.reset_at !== null && bucket.reset_at !== undefined && Number(bucket.reset_at) <= values[0]) { delete transactionData.rateBuckets[key]; removed += 1; }
            }
            return { rows: [], rowCount: removed };
          }
          if (/COUNT\(\*\)/i.test(text)) {
            const count = Object.keys(transactionData.rateBuckets).length;
            return { rows: [{ bucket_count: count, first_reset_at: count ? String(Math.min(...Object.values(transactionData.rateBuckets).map((bucket) => Number(bucket.reset_at)))) : null }] };
          }
          if (/^SELECT\b/i.test(text)) return { rows: Object.hasOwn(transactionData.rateBuckets, values[0]) ? [structuredClone(transactionData.rateBuckets[values[0]])] : [] };
          if (/^INSERT\b/i.test(text) || /^UPDATE\b/i.test(text)) {
            if (pool.failRateWrite) throw new Error('rate storage unavailable');
            if (/^INSERT\b/i.test(text)) {
              assert.match(text, /\(bucket_key, count, reset_at, rate_limit, window_ms\)/i);
              assert.equal(values.length, 5);
              transactionData.rateBuckets[values[0]] = { count: String(values[1]), reset_at: String(values[2]), rate_limit: String(values[3]), window_ms: String(values[4]) };
              return { rows: [], rowCount: 1 };
            }
            assert.match(text, /SET count = \$2 WHERE bucket_key = \$1/i);
            if (!Object.hasOwn(transactionData.rateBuckets, values[0])) return { rows: [], rowCount: 0 };
            transactionData.rateBuckets[values[0]].count = String(values[1]);
            return { rows: [], rowCount: 1 };
          }
        }
        throw new Error(`Unexpected SQL in store test fake: ${text}`);
      },
      release(destroy) {
        assert.equal(inTransaction, false, 'connection released after transaction ends');
        if (destroy) pool.destroyedClients += 1;
      },
    };
  }
  async query(sql, values) {
    const client = await this.connect();
    try { return await client.query(sql, values); }
    finally { client.release(); }
  }
}

test('PostgreSQL store locks singleton state and commits concurrent deduplication once', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const results = await Promise.all([1, 2, 3].map((n) => store.submit(request(n, { key: 'same' }))));
  assert.equal(new Set(results.map(({ job }) => job.id)).size, 1);
  assert.ok(pool.statements.some((sql) => /SELECT.*FOR UPDATE/i.test(sql)));
  assert.equal(pool.statements.filter((sql) => /^BEGIN\b/i.test(sql)).length, 3);
  assert.equal(pool.statements.filter((sql) => /^COMMIT\b/i.test(sql)).length, 3);
  assert.equal(await store.ping(), true);
});

test('PostgreSQL errors fail closed and roll back reservations', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config({ dailyBudgetMicros: 100 }), clock: () => START });
  pool.failUpdate = true;
  await rejectsCode(store.submit(request(1)), 'STORE_UNAVAILABLE');
  assert.ok(pool.statements.some((sql) => /^ROLLBACK\b/i.test(sql)));
  pool.failUpdate = false;
  assert.equal((await store.submit(request(2))).job.status, 'queued');
  await rejectsCode(store.submit(request(3)), 'DAILY_BUDGET');
  pool.failConnect = true;
  await rejectsCode(store.read('missing'), 'STORE_UNAVAILABLE');
  await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
});

test('expired job retention cannot erase a current month budget reservation', async () => {
  const { store, advance } = memory({ monthlyBudgetMicros: 100 });
  const first = await store.submit(request(1));
  await fail(store, first);
  advance(8 * DAY);
  assert.equal(await store.read(first.job.id), null);
  await rejectsCode(store.submit(request(2)), 'MONTHLY_BUDGET');
});

test('auxiliary outbox reservation deduplicates atomically and uses shared spend caps', async () => {
  const { store } = memory({ dailyBudgetMicros: 150 });
  const results = await Promise.all(Array.from({ length: 12 }, () => store.reserveAuxiliary({ id: 'email:one', maxCostMicros: 100 })));
  assert.equal(results.filter(({ reserved }) => reserved).length, 1);
  await rejectsCode(store.reserveAuxiliary({ id: 'email:two', maxCostMicros: 100 }), 'DAILY_BUDGET');
  await rejectsCode(store.submit(request(1)), 'DAILY_BUDGET');
});

test('auxiliary provider failure retains a full reservation and never retries spend', async () => {
  const { store } = memory({ dailyBudgetMicros: 100 });
  await store.reserveAuxiliary({ id: 'email:one', maxCostMicros: 100 });
  const failed = await store.finishAuxiliary('email:one', { status: 'failed' });
  assert.equal(failed.status, 'failed');
  assert.equal((await store.reserveAuxiliary({ id: 'email:one', maxCostMicros: 100 })).reserved, false);
  await rejectsCode(store.reserveAuxiliary({ id: 'email:two', maxCostMicros: 100 }), 'DAILY_BUDGET');
});

test('verified auxiliary actual cost releases only unused reservation', async () => {
  const { store } = memory({ dailyBudgetMicros: 150 });
  await store.reserveAuxiliary({ id: 'email:one', maxCostMicros: 100 });
  const finished = await store.finishAuxiliary('email:one', { status: 'complete', actualCostMicros: 20 });
  assert.equal(finished.status, 'complete');
  assert.equal((await store.reserveAuxiliary({ id: 'email:two', maxCostMicros: 100 })).reserved, true);
  await rejectsCode(store.submit(request(1)), 'DAILY_BUDGET');
});

test('PostgreSQL readiness rejects missing migration or incompatible singleton state', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  pool.missingRow = true;
  await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
  pool.missingRow = false;
  pool.schemaVersion = 1;
  await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
  pool.schemaVersion = 3;
  await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
  pool.schemaVersion = 2;
  pool.state.version = 2;
  await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
});

test('PostgreSQL corruption cannot reset counters or bypass admission gates', async () => {
  for (const mutate of [
    (state) => { state.daily['2026-11-05'] = { global: 0, reservedMicros: -100, ips: {}, sessions: {} }; },
    (state) => { state.monthly['2026-11'] = { reservedMicros: -100 }; },
    (state) => { state.daily['2026-11-05'] = { global: 0, reservedMicros: 0, ips: { corrupted: -1 }, sessions: {} }; },
  ]) {
    const pool = new FakePool();
    mutate(pool.state);
    const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
    await rejectsCode(store.submit(request(1)), 'STORE_UNAVAILABLE');
    assert.equal(Object.keys(pool.state.jobs).length, 0);
    assert.ok(pool.statements.includes('ROLLBACK'));
    assert.ok(!pool.statements.some((sql) => /^UPDATE/i.test(sql)));
  }
});

test('old-period cost settlement cannot release a new day reservation', async () => {
  const { store, advance, set } = memory({ dailyBudgetMicros: 150, monthlyBudgetMicros: 500 });
  set(Date.UTC(2026, 10, 5, 23, 59, 30));
  const old = await store.submit(request('old'));
  const lease = await store.claim(old.job.id);
  advance(60_000);
  await store.submit(request('new-day'));
  await store.complete(old.job.id, { score: 80 }, { leaseToken: lease.leaseToken, actualCostMicros: 20 });
  await rejectsCode(store.submit(request('third')), 'DAILY_BUDGET');
});

test('old-month settlement cannot release a new month reservation', async () => {
  const { store, advance, set } = memory({ dailyBudgetMicros: 500, monthlyBudgetMicros: 150 });
  set(Date.UTC(2026, 10, 30, 23, 59, 30));
  const old = await store.submit(request('old'));
  const lease = await store.claim(old.job.id);
  advance(60_000);
  await store.submit(request('new-month'));
  await store.complete(old.job.id, { score: 80 }, { leaseToken: lease.leaseToken, actualCostMicros: 20 });
  await rejectsCode(store.submit(request('third')), 'MONTHLY_BUDGET');
});

test('safe terminal results past their cache window are evicted before capacity blocks new work', async () => {
  const { store, advance } = memory();
  const oldest = [];
  for (let day = 0; day < 6; day += 1) {
    for (let n = 0; n < 50; n += 1) {
      const result = await store.submit(request(`${day}:${n}`));
      if (day === 0) oldest.push(result);
      await finish(store, result);
    }
    advance(DAY);
  }
  assert.equal((await store.submit(request('after-capacity'))).job.status, 'queued');
  const retained = await Promise.all(oldest.map(({ job }) => store.read(job.id)));
  assert.ok(retained.filter((job) => job === null).length >= 45);
});

test('auxiliary invalid cost keeps the reservation and terminal settlement is idempotent', async () => {
  const { store } = memory({ dailyBudgetMicros: 100 });
  await store.reserveAuxiliary({ id: 'email:one', maxCostMicros: 100 });
  await rejectsCode(store.finishAuxiliary('email:one', { status: 'complete', actualCostMicros: 101 }), 'INVALID_COST');
  assert.equal((await store.reserveAuxiliary({ id: 'email:one', maxCostMicros: 100 })).status, 'failed');
  await store.finishAuxiliary('email:one', { status: 'complete', actualCostMicros: 0 });
  await rejectsCode(store.submit(request(1)), 'DAILY_BUDGET');
});

test('PostgreSQL clients share quotas and leases across store instances', async () => {
  const pool = new FakePool();
  const first = new PostgresAuditStore({ pool, config: config({ globalDaily: 3 }), clock: () => START });
  const second = new PostgresAuditStore({ pool, config: config({ globalDaily: 3 }), clock: () => START });
  const results = await Promise.allSettled([1, 2, 3, 4, 5, 6].map((n) => (n % 2 ? first : second).submit(request(n))));
  const accepted = results.filter(({ status }) => status === 'fulfilled');
  assert.equal(accepted.length, 3);
  assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'GLOBAL_QUOTA'));
  const claims = await Promise.all([first.claimNext(), second.claimNext(), first.claimNext()]);
  assert.equal(claims.filter(Boolean).length, 2);
  assert.equal(new Set(claims.filter(Boolean).map(({ job }) => job.id)).size, 2);
});

test('lost COMMIT response fails closed and retry deduplicates committed reservation', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config({ dailyBudgetMicros: 100 }), clock: () => START });
  pool.failCommitAfterApply = true;
  await rejectsCode(store.submit(request(1)), 'STORE_UNAVAILABLE');
  assert.equal(Object.keys(pool.state.jobs).length, 1, 'the test database committed before the response was lost');
  assert.equal(pool.statements.filter((sql) => /^BEGIN\b/i.test(sql)).length, 1, 'uncertain commits must not trigger an automatic retry');
  const retry = await store.submit(request(1));
  assert.equal(retry.deduplicated, true);
  await rejectsCode(store.submit(request(2)), 'DAILY_BUDGET');
});

test('explicit zero budgets permit zero-cost work and reject any positive reservation', async () => {
  const { store } = memory({ dailyBudgetMicros: 0, monthlyBudgetMicros: 0, maxScanCostMicros: 0, maxReportCostMicros: 0 });
  const audit = await store.submit(request(1));
  assert.equal((await finish(store, audit, 0)).status, 'complete');
  assert.equal((await store.reserveAuxiliary({ id: 'free-email', maxCostMicros: 0 })).reserved, true);
  assert.equal((await store.finishAuxiliary('free-email', { status: 'complete', actualCostMicros: 0 })).status, 'complete');
  await rejectsCode(store.reserveAuxiliary({ id: 'paid-email', maxCostMicros: 1 }), 'INVALID_COST');
  const uncappedReport = memory({ dailyBudgetMicros: 0, monthlyBudgetMicros: 0, maxScanCostMicros: 0 }).store;
  await rejectsCode(uncappedReport.reserveAuxiliary({ id: 'paid-email', maxCostMicros: 1 }), 'DAILY_BUDGET');
});

test('fresh completed cached results are retained when the bounded store is full', async () => {
  const { store } = memory({ globalDaily: 300 });
  let first;
  for (let n = 0; n < 256; n += 1) {
    const result = await store.submit(request(n));
    if (!first) first = result;
    await finish(store, result);
  }
  await rejectsCode(store.submit(request('over-capacity')), 'STORE_UNAVAILABLE');
  assert.equal((await store.submit(request(0))).job.id, first.job.id);
  assert.equal((await store.read(first.job.id)).status, 'complete');
});

test('rate storage denies new identities at capacity and prunes expired buckets', async () => {
  const pool = new FakePool();
  for (let n = 0; n < 4096; n += 1) pool.rateBuckets[n.toString(16).padStart(64, '0')] = { count: 1, reset_at: String(START + 1000), rate_limit: 1, window_ms: '1000' };
  let now = START;
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => now });
  assert.equal((await store.consumeRate({ scope: 'status', key: 'new-identity', limit: 1, windowMs: 1000 })).allowed, false);
  assert.equal(Object.keys(pool.rateBuckets).length, 4096);
  assert.deepEqual(pool.state.rates, {}, 'rate storage stays outside the quota ledger');
  now += 1001;
  assert.equal((await store.consumeRate({ scope: 'status', key: 'new-identity', limit: 1, windowMs: 1000 })).allowed, true);
  assert.equal(Object.keys(pool.rateBuckets).length, 1);
});

test('PostgreSQL reports are atomic external rows while cache and read contracts remain intact', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config({ dailyBudgetMicros: 100 }), clock: () => START });
  const submitted = await store.submit(request('external-report'));
  const claimed = await store.claim(submitted.job.id);
  const report = { score: 88, findings: ['A single cached report is fetched when needed.'] };
  const complete = await store.complete(submitted.job.id, report, { leaseToken: claimed.leaseToken, actualCostMicros: 100 });
  assert.deepEqual(complete.report, report);
  assert.equal(Object.hasOwn(pool.state.jobs[submitted.job.id], 'report'), false);
  assert.deepEqual(pool.reports[submitted.job.id], report);
  assert.deepEqual((await store.read(submitted.job.id)).report, report);
  const cached = await store.submit(request('external-report'));
  assert.equal(cached.cached, true);
  assert.equal(cached.job.id, submitted.job.id);
  assert.deepEqual(cached.job.report, report);
  await rejectsCode(store.submit(request('fresh')), 'DAILY_BUDGET');
});

test('PostgreSQL report write failures roll back the job and verified cost release together', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config({ dailyBudgetMicros: 100 }), clock: () => START });
  const submitted = await store.submit(request('failed-report'));
  const claimed = await store.claim(submitted.job.id);
  const before = structuredClone(pool.state);
  pool.failReportInsert = true;
  await rejectsCode(store.complete(submitted.job.id, { score: 88 }, { leaseToken: claimed.leaseToken, actualCostMicros: 0 }), 'STORE_UNAVAILABLE');
  assert.deepEqual(pool.state, before);
  assert.deepEqual(pool.reports, {});
  await rejectsCode(store.submit(request('no-refund')), 'DAILY_BUDGET');
  pool.failReportInsert = false;
  assert.equal((await store.complete(submitted.job.id, { score: 88 }, { leaseToken: claimed.leaseToken, actualCostMicros: 0 })).status, 'complete');
});

test('PostgreSQL read and ping project metadata without rewriting or fetching every report', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const submitted = await store.submit(request('readonly'));
  await finish(store, submitted);
  pool.statements = [];
  assert.equal((await store.read(submitted.job.id)).status, 'complete');
  assert.equal(await store.ping(), true);
  assert.equal(await store.read('missing'), null);
  assert.ok(pool.statements.length > 0);
  assert.ok(pool.statements.every((sql) => !/^(UPDATE|INSERT|DELETE)\b/i.test(sql)), 'readiness and reads must not generate writes');
  assert.ok(pool.statements.every((sql) => !/SELECT state, schema_version/i.test(sql)), 'readiness and reads must not transfer the complete control JSON');
});

test('PostgreSQL completed metadata without its external report fails closed', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const submitted = await store.submit(request('missing-report'));
  await finish(store, submitted);
  delete pool.reports[submitted.job.id];
  await rejectsCode(store.read(submitted.job.id), 'STORE_UNAVAILABLE');
  await rejectsCode(store.submit(request('missing-report')), 'STORE_UNAVAILABLE');
  assert.equal(Object.keys(pool.state.jobs).length, 1);
});

test('PostgreSQL oversized external reports fail closed on read and cache lookup', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const submitted = await store.submit(request('oversized-report'));
  await finish(store, submitted);
  pool.reports[submitted.job.id] = { corruptedPayload: 'x'.repeat(65_536) };
  const before = structuredClone(pool.state);
  await rejectsCode(store.read(submitted.job.id), 'STORE_UNAVAILABLE');
  await rejectsCode(store.submit(request('oversized-report')), 'STORE_UNAVAILABLE');
  assert.deepEqual(pool.state, before);
});

test('PostgreSQL retention pruning deletes associated reports without resetting spend', async () => {
  const pool = new FakePool();
  let now = START;
  const store = new PostgresAuditStore({ pool, config: config({ retentionMs: DAY }), clock: () => now });
  const submitted = await store.submit(request('expired-report'));
  await finish(store, submitted);
  now += DAY + 1;
  assert.equal(await store.read(submitted.job.id), null);
  assert.ok(Object.hasOwn(pool.reports, submitted.job.id), 'a read does not write retention cleanup');
  await store.submit(request('after-retention'));
  assert.equal(Object.hasOwn(pool.state.jobs, submitted.job.id), false);
  assert.equal(Object.hasOwn(pool.reports, submitted.job.id), false);
  assert.equal(pool.state.monthly['2026-11'].reservedMicros, 200);
});

test('PostgreSQL no-op control transactions keep locking but skip state updates', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const submitted = await store.submit(request('same-queued'));
  const before = structuredClone(pool.state);
  pool.statements = [];
  assert.equal((await store.submit(request('same-queued'))).job.id, submitted.job.id);
  assert.equal(await store.claim('not-a-job'), null);
  assert.deepEqual(pool.state, before);
  assert.equal(pool.statements.filter((sql) => /SELECT state, schema_version.*FOR UPDATE/i.test(sql)).length, 2);
  assert.ok(pool.statements.every((sql) => !/^UPDATE rnr_audit\.audit_control_state/i.test(sql)));
  assert.equal(pool.statements.filter((sql) => /^COMMIT$/i.test(sql)).length, 2);
});

test('PostgreSQL projected reads reject malformed persisted job metadata', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const submitted = await store.submit(request('corrupt-projection'));
  pool.state.jobs[submitted.job.id].status = 'unrecognized-status';
  await rejectsCode(store.read(submitted.job.id), 'STORE_UNAVAILABLE');
  assert.equal(pool.state.jobs[submitted.job.id].status, 'unrecognized-status', 'readiness must not silently repair corrupt state');
});

test('PostgreSQL rate buckets remain atomic and separate from report and budget data', async () => {
  const pool = new FakePool();
  const first = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const second = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const before = structuredClone(pool.state);
  const results = await Promise.all(Array.from({ length: 20 }, (_, index) => (index % 2 ? first : second).consumeRate({ scope: 'read', key: 'same-ip', limit: 3, windowMs: 60_000 })));
  assert.equal(results.filter(({ allowed }) => allowed).length, 3);
  assert.deepEqual(pool.state, before);
  assert.equal(Object.keys(pool.rateBuckets).length, 1);
  assert.ok(pool.statements.every((sql) => !/SELECT state, schema_version/i.test(sql)), 'rates must not fetch the report/control singleton');
});

test('PostgreSQL rate errors roll back and missing rate control fails closed', async () => {
  const pool = new FakePool();
  const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
  const rate = { scope: 'read', key: 'same-ip', limit: 1, windowMs: 60_000 };
  pool.failRateWrite = true;
  await rejectsCode(store.consumeRate(rate), 'STORE_UNAVAILABLE');
  assert.deepEqual(pool.rateBuckets, {});
  pool.failRateWrite = false;
  assert.equal((await store.consumeRate(rate)).allowed, true);
  pool.missingRateControl = true;
  await rejectsCode(store.consumeRate({ ...rate, key: 'other' }), 'STORE_UNAVAILABLE');
  assert.equal(Object.keys(pool.rateBuckets).length, 1);
});

test('PostgreSQL malformed rate rows cannot reset or bypass a consumed allowance', async () => {
  for (const mutate of [
    (bucket) => { bucket.count = -1; },
    (bucket) => { bucket.count = null; },
    (bucket) => { bucket.count = 2; },
    (bucket) => { bucket.reset_at = 'not-a-timestamp'; },
    (bucket) => { bucket.reset_at = null; },
    (bucket) => { bucket.rate_limit = 0; },
    (bucket) => { bucket.rate_limit = null; },
    (bucket) => { bucket.window_ms = '0'; },
    (bucket) => { bucket.window_ms = null; },
  ]) {
    const pool = new FakePool();
    const store = new PostgresAuditStore({ pool, config: config(), clock: () => START });
    const rate = { scope: 'read', key: 'same-ip', limit: 1, windowMs: 60_000 };
    assert.equal((await store.consumeRate(rate)).allowed, true);
    const key = Object.keys(pool.rateBuckets)[0];
    mutate(pool.rateBuckets[key]);
    const before = structuredClone(pool.rateBuckets);
    await rejectsCode(store.consumeRate(rate), 'STORE_UNAVAILABLE');
    assert.deepEqual(pool.rateBuckets, before);
  }
});
