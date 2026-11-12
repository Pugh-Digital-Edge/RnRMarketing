import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { lstat, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { promisify } from 'node:util';

const FIXTURE_PATH = process.env.RNR_AUDIT_PG_FIXTURE;
const DAY = 86_400_000;
const START = Date.UTC(2026, 10, 5, 12);
const TABLE = 'rnr_audit.audit_control_state';
const REPORTS = 'rnr_audit.audit_reports';
const RATES = 'rnr_audit.audit_rate_buckets';
const emptyState = () => ({ version: 1, jobs: {}, daily: {}, monthly: {}, rates: {}, auxiliary: {} });
const config = (overrides = {}) => ({
  ipDaily: 3, sessionDaily: 3, globalDaily: 50, maxActive: 2, maxQueued: 8,
  cacheMs: DAY, leaseMs: 120_000, dailyBudgetMicros: 5_000_000,
  monthlyBudgetMicros: 50_000_000, maxScanCostMicros: 1_000_000, ...overrides,
});
const request = (id, overrides = {}) => ({
  key: `synthetic:${id}`, input: { url: `https://example.test/${id}` },
  ipHash: `synthetic-ip:${id}`, sessionHash: `synthetic-session:${id}`, ...overrides,
});
const rejectsCode = (promise, code) => assert.rejects(promise, (error) => error.code === code);

const execFileAsync = promisify(execFile);
function docker(args) {
  const env = { ...process.env };
  for (const key of ['DOCKER_HOST', 'DOCKER_CONTEXT', 'DOCKER_TLS', 'DOCKER_TLS_VERIFY', 'DOCKER_CERT_PATH']) delete env[key];
  return execFileAsync('docker', ['--host=unix:///var/run/docker.sock', ...args], { env, timeout: 15_000, maxBuffer: 1024 * 1024 });
}

async function fixture() {
  const directory = path.dirname(FIXTURE_PATH);
  assert.match(directory, /^\/tmp\/rnr-audit-pg-[A-Za-z0-9]{6}$/, 'Only the harness private /tmp directory is accepted.');
  assert.equal(FIXTURE_PATH, path.join(directory, 'fixture.json'));
  assert.equal(await realpath(directory), directory, 'The fixture directory cannot be redirected by a symlink.');
  const directoryStat = await lstat(directory);
  assert.ok(directoryStat.isDirectory());
  assert.equal(directoryStat.uid, process.getuid());
  assert.equal(directoryStat.mode & 0o777, 0o700);
  const fileStat = await lstat(FIXTURE_PATH);
  assert.ok(fileStat.isFile() && !fileStat.isSymbolicLink());
  assert.equal(fileStat.uid, process.getuid());
  assert.equal(fileStat.mode & 0o777, 0o600);
  const value = JSON.parse(await readFile(FIXTURE_PATH, 'utf8'));
  assert.equal(value.version, 1);
  assert.equal(typeof value.nonce, 'string');
  assert.match(value.nonce, /^[0-9a-f-]{36}$/);
  assert.equal(value.nonce, process.env.RNR_AUDIT_PG_NONCE);
  assert.equal(value.ownerPid, process.ppid, 'Run through the harness with --test-isolation=none.');
  assert.equal(value.socketDir, path.join(directory, 'socket'));
  assert.equal(await realpath(value.socketDir), value.socketDir);
  assert.ok((await lstat(path.join(value.socketDir, '.s.PGSQL.5432'))).isSocket());
  assert.equal(value.image, 'postgres:17-alpine');
  assert.match(value.containerName, /^rnr-audit-pg-[a-z0-9-]+$/);
  assert.match(value.containerId, /^[a-f0-9]{64}$/);
  const { stdout } = await docker(['inspect', value.containerId]);
  const [container] = JSON.parse(stdout);
  assert.equal(container.Id, value.containerId);
  assert.equal(container.Name, `/${value.containerName}`);
  assert.equal(container.Config.Labels?.['audit.fixture'], value.nonce);
  assert.equal(container.HostConfig.NetworkMode, 'none');
  assert.ok(!container.HostConfig.PortBindings || Object.keys(container.HostConfig.PortBindings).length === 0);
  assert.ok(container.Mounts.some((mount) => mount.Type === 'bind' && mount.Source === value.socketDir && mount.Destination === '/audit-socket'));
  assert.ok(container.HostConfig.Tmpfs?.['/var/lib/postgresql/data'], 'The database must be stored in tmpfs.');
  return value;
}

if (!FIXTURE_PATH) {
  test('real PostgreSQL audit integration (opt in with node scripts/audit-test-postgres.mjs)', { skip: true }, () => {});
} else {
  test('real PostgreSQL audit store on an isolated temporary Unix socket', { timeout: 180_000 }, async (t) => {
    // Validate the harness and exact local container BEFORE loading pg or opening
    // a database connection. No connection URL or PG* environment setting is used.
    const local = await fixture();
    const { Pool } = await import('pg');
    const { PostgresAuditStore } = await import('../netlify/functions/lib/audit/store.mjs');
    const pools = new Set();
    const makePool = (user = 'audit_runtime', extra = {}) => {
      const pool = new Pool({
        host: local.socketDir, port: 5432, database: 'postgres', user,
        password: '', ssl: false, options: '', application_name: 'rnr_audit_local_integration',
        connectionTimeoutMillis: 2000, query_timeout: 4000,
        statement_timeout: 4000, lock_timeout: 2000, idle_in_transaction_session_timeout: 5000,
        max: 2, ...extra,
      });
      // Stopping this fixture intentionally invalidates idle client sockets.
      pool.on('error', () => {});
      pools.add(pool);
      return pool;
    };
    t.after(async () => {
      await Promise.allSettled([...pools].map((pool) => pool.end()));
    });
    const admin = makePool('postgres');
    t.diagnostic(`PostgreSQL ${String((await admin.query('SHOW server_version')).rows[0].server_version)}; local Unix socket only.`);
    assert.equal((await admin.query('SHOW listen_addresses')).rows[0].listen_addresses, '');
    assert.equal((await admin.query('SELECT inet_server_addr() AS address')).rows[0].address, null);
    const migration = await readFile(new URL('../netlify/functions/lib/audit/schema.sql', import.meta.url), 'utf8');

    await t.test('manual migration refuses an existing public ledger without changing its reservations', async () => {
      await admin.query("CREATE TABLE public.audit_control_state (id integer PRIMARY KEY, state jsonb NOT NULL); INSERT INTO public.audit_control_state VALUES (1, '{\"reservedMicros\":123456}'::jsonb)");
      await assert.rejects(admin.query(migration), /legacy|public|migrat/i);
      await admin.query('ROLLBACK');
      assert.equal((await admin.query('SELECT state FROM public.audit_control_state')).rows[0].state.reservedMicros, 123456);
      assert.equal((await admin.query("SELECT to_regclass('rnr_audit.audit_control_state') AS name")).rows[0].name, null);
      await admin.query('DROP TABLE public.audit_control_state');
    });

    await t.test('manual migration creates only the private ledger and revokes API-role access', async () => {
      await admin.query('CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN');
      await admin.query(migration);
      await admin.query(`GRANT USAGE ON SCHEMA rnr_audit TO anon, authenticated; GRANT SELECT, UPDATE ON ${TABLE}, ${REPORTS}, ${RATES}, rnr_audit.audit_rate_control TO anon, authenticated`);
      await admin.query(migration);
      assert.equal((await admin.query("SELECT to_regclass('public.audit_control_state') AS name")).rows[0].name, null);
      for (const role of ['anon', 'authenticated']) {
        for (const table of [TABLE, REPORTS, RATES, 'rnr_audit.audit_rate_control']) {
          const { rows: [access] } = await admin.query('SELECT has_schema_privilege($1, $2, $3) AS schema_access, has_table_privilege($1, $4, $5) AS table_access', [role, 'rnr_audit', 'USAGE', table, 'SELECT']);
          assert.equal(access.schema_access, false);
          assert.equal(access.table_access, false);
        }
      }
      await admin.query('CREATE ROLE audit_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT; CREATE ROLE audit_denied LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT');
      await admin.query(`GRANT CONNECT ON DATABASE postgres TO audit_runtime, audit_denied; GRANT USAGE ON SCHEMA rnr_audit TO audit_runtime; GRANT SELECT, UPDATE ON ${TABLE}, rnr_audit.audit_rate_control TO audit_runtime; GRANT SELECT, INSERT, DELETE ON ${REPORTS} TO audit_runtime; GRANT SELECT, INSERT, UPDATE, DELETE ON ${RATES} TO audit_runtime`);
      await admin.query('CREATE TABLE rnr_audit.unrelated_private (value text)');
    });

    await t.test('known private v1 migration extracts reports and rates without resetting reservations', async () => {
      await admin.query('CREATE DATABASE audit_legacy_fixture');
      const legacy = makePool('postgres', { database: 'audit_legacy_fixture' });
      try {
        const saved = emptyState();
        saved.jobs['legacy-job'] = {
          id: 'legacy-job', key: 'synthetic-legacy', input: { url: 'https://example.test/legacy' },
          ipHash: 'synthetic-legacy-ip', sessionHash: 'synthetic-legacy-session',
          status: 'complete', createdAt: START, finishedAt: START, queueExpiresAt: START + 600_000,
          reservation: { day: '2026-11-05', month: '2026-11', micros: 1_000_000 }, report: { score: 87 },
        };
        saved.daily['2026-11-05'] = { global: 1, ips: {}, sessions: {}, reservedMicros: 1_000_000 };
        saved.monthly['2026-11'] = { reservedMicros: 1_000_000 };
        saved.rates['a'.repeat(64)] = { count: 2, resetAt: START + 60_000, limit: 10, windowMs: 60_000 };
        await legacy.query('CREATE SCHEMA rnr_audit; CREATE TABLE rnr_audit.audit_control_state (id smallint PRIMARY KEY CHECK (id = 1), schema_version integer NOT NULL CHECK (schema_version = 1), state jsonb NOT NULL CHECK (jsonb_typeof(state) = \'object\'), updated_at timestamptz NOT NULL DEFAULT NOW())');
        await legacy.query(`INSERT INTO ${TABLE} (id, schema_version, state) VALUES (1, 1, $1::jsonb)`, [JSON.stringify(saved)]);
        await legacy.query(migration);
        const { rows: [result] } = await legacy.query(`SELECT schema_version, state FROM ${TABLE}`);
        assert.equal(result.schema_version, 2);
        assert.equal(result.state.version, 1);
        assert.deepEqual(result.state.daily, saved.daily);
        assert.deepEqual(result.state.monthly, saved.monthly);
        assert.equal(result.state.jobs['legacy-job'].report, undefined);
        assert.deepEqual(result.state.rates, {});
        assert.deepEqual((await legacy.query(`SELECT report FROM ${REPORTS} WHERE job_id = 'legacy-job'`)).rows[0].report, { score: 87 });
        const bucket = (await legacy.query(`SELECT count, reset_at, rate_limit, window_ms FROM ${RATES} WHERE bucket_key = $1`, ['a'.repeat(64)])).rows[0];
        assert.equal(Number(bucket.count), 2);
        assert.equal(Number(bucket.reset_at), START + 60_000);
        assert.equal(Number(bucket.rate_limit), 10);
        assert.equal(Number(bucket.window_ms), 60_000);
        await legacy.query(migration);
        assert.deepEqual((await legacy.query(`SELECT state FROM ${TABLE}`)).rows[0].state, result.state);
      } finally {
        await legacy.end();
        pools.delete(legacy);
        await admin.query('DROP DATABASE audit_legacy_fixture');
      }
    });

    await t.test('unsupported private ledger versions are refused without creating a replacement', async () => {
      await admin.query('CREATE DATABASE audit_unsupported_fixture');
      const unsupported = makePool('postgres', { database: 'audit_unsupported_fixture' });
      try {
        const saved = emptyState();
        saved.daily['2026-11-05'] = { global: 0, ips: {}, sessions: {}, reservedMicros: 3_000_000 };
        saved.monthly['2026-11'] = { reservedMicros: 3_000_000 };
        await unsupported.query('CREATE SCHEMA rnr_audit; CREATE TABLE rnr_audit.audit_control_state (id smallint PRIMARY KEY, schema_version integer NOT NULL, state jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT NOW())');
        await unsupported.query(`INSERT INTO ${TABLE} (id, schema_version, state) VALUES (1, 99, $1::jsonb)`, [JSON.stringify(saved)]);
        await assert.rejects(unsupported.query(migration), /unsupported|schema|version|migrat/i);
        await unsupported.query('ROLLBACK');
        const row = (await unsupported.query(`SELECT schema_version, state FROM ${TABLE}`)).rows[0];
        assert.equal(row.schema_version, 99);
        assert.deepEqual(row.state, saved);
        assert.equal((await unsupported.query("SELECT to_regclass('rnr_audit.audit_reports') AS name")).rows[0].name, null);
      } finally {
        await unsupported.end();
        pools.delete(unsupported);
        await admin.query('DROP DATABASE audit_unsupported_fixture');
      }
    });

    await t.test('orphan normalized tables cannot cause migration to create an empty spending ledger', async () => {
      await admin.query('CREATE DATABASE audit_orphan_fixture');
      const orphan = makePool('postgres', { database: 'audit_orphan_fixture' });
      try {
        const preserved = { synthetic: true, reservedMicros: 4_000_000 };
        await orphan.query('CREATE SCHEMA rnr_audit; CREATE TABLE rnr_audit.audit_reports (job_id text PRIMARY KEY, report jsonb NOT NULL)');
        await orphan.query(`INSERT INTO ${REPORTS} (job_id, report) VALUES ($1, $2::jsonb)`, ['synthetic-orphan', JSON.stringify(preserved)]);
        await assert.rejects(orphan.query(migration), /orphan|control|ledger|migrat|missing|schema/i);
        await orphan.query('ROLLBACK');
        assert.equal((await orphan.query("SELECT to_regclass('rnr_audit.audit_control_state') AS name")).rows[0].name, null);
        assert.deepEqual((await orphan.query(`SELECT report FROM ${REPORTS} WHERE job_id = 'synthetic-orphan'`)).rows[0].report, preserved);
      } finally {
        await orphan.end();
        pools.delete(orphan);
        await admin.query('DROP DATABASE audit_orphan_fixture');
      }
    });

    const firstPool = makePool();
    const secondPool = makePool();
    let now = START;
    const stores = (overrides = {}) => [firstPool, secondPool].map((pool) => new PostgresAuditStore({ pool, config: config(overrides), clock: () => now }));
    const reset = async () => {
      now = START;
      await admin.query(`DELETE FROM ${REPORTS}; DELETE FROM ${RATES}`);
      await admin.query(`UPDATE ${TABLE} SET state = $1::jsonb WHERE id = 1`, [JSON.stringify(emptyState())]);
    };
    const state = async () => (await admin.query(`SELECT state FROM ${TABLE} WHERE id = 1`)).rows[0].state;

    await t.test('runtime role can transact but cannot alter, delete, insert or access unrelated data', async () => {
      const [store] = stores();
      assert.equal(await store.ping(), true);
      for (const sql of [
        `DELETE FROM ${TABLE}`, `INSERT INTO ${TABLE} (id, schema_version, state) VALUES (1, 1, '{}'::jsonb)`,
        `DROP TABLE ${TABLE}`, 'CREATE TABLE rnr_audit.unauthorized (id integer)',
        'SELECT * FROM rnr_audit.unrelated_private',
      ]) await assert.rejects(firstPool.query(sql), (error) => error.code === '42501');
      const deniedPool = makePool('audit_denied');
      const denied = new PostgresAuditStore({ pool: deniedPool, config: config(), clock: () => now });
      await rejectsCode(denied.ping(), 'STORE_UNAVAILABLE');
      assert.equal(await store.ping(), true);
    });

    await t.test('empty normalized tables are ready but missing tables or mutex rows fail closed', async () => {
      await reset();
      const [store] = stores();
      assert.equal(await store.ping(), true);
      assert.equal(await store.read('synthetic-absent-job'), null);
      await admin.query('DELETE FROM rnr_audit.audit_rate_control WHERE id = 1');
      try {
        await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
        await rejectsCode(store.consumeRate({ scope: 'missing-mutex', key: 'synthetic', limit: 1, windowMs: 60_000 }), 'STORE_UNAVAILABLE');
        assert.equal((await admin.query(`SELECT count(*)::int AS count FROM ${RATES}`)).rows[0].count, 0);
      } finally {
        await admin.query('INSERT INTO rnr_audit.audit_rate_control (id) VALUES (1)');
      }
      await admin.query(`ALTER TABLE ${REPORTS} RENAME TO audit_reports_unavailable_fixture`);
      try {
        await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
        await rejectsCode(store.read('synthetic-absent-job'), 'STORE_UNAVAILABLE');
      } finally {
        await admin.query('ALTER TABLE rnr_audit.audit_reports_unavailable_fixture RENAME TO audit_reports');
      }
      assert.equal(await store.ping(), true);
    });

    await t.test('two real pools simultaneously deduplicate before one budget reservation', async () => {
      await reset();
      const pair = stores();
      const results = await Promise.all(Array.from({ length: 20 }, (_, index) => pair[index % 2].submit(request(index, { key: 'same-fingerprint' }))));
      assert.equal(new Set(results.map(({ job }) => job.id)).size, 1);
      assert.equal(results.filter(({ deduplicated }) => !deduplicated).length, 1);
      const saved = await state();
      assert.equal(Object.keys(saved.jobs).length, 1);
      assert.equal(saved.daily['2026-11-05'].reservedMicros, 1_000_000);
      assert.equal(saved.monthly['2026-11'].reservedMicros, 1_000_000);
    });

    await t.test('a real competing transaction waits for the singleton row lock', async () => {
      await reset();
      const [store] = stores();
      const lock = await admin.connect();
      let waiting;
      try {
        await lock.query('BEGIN');
        await lock.query(`SELECT id FROM ${TABLE} WHERE id = 1 FOR UPDATE`);
        waiting = store.submit(request('blocked-by-row-lock'));
        // Attach a rejection handler while observing contention so a timeout
        // cannot create an unhandled promise while the lock is released.
        waiting.catch(() => {});
        let blocked = false;
        for (let attempt = 0; attempt < 50 && !blocked; attempt += 1) {
          const result = await admin.query("SELECT count(*)::int AS count FROM pg_stat_activity WHERE application_name = 'rnr_audit_local_integration' AND wait_event_type = 'Lock' AND query LIKE '%rnr_audit.audit_control_state%'");
          blocked = result.rows[0].count > 0;
          if (!blocked) await delay(10);
        }
        assert.equal(blocked, true, 'PostgreSQL observes the runtime transaction waiting on a real lock');
        await lock.query('COMMIT');
      } finally {
        await lock.query('ROLLBACK');
        lock.release();
      }
      assert.equal((await waiting).job.status, 'queued');
      assert.equal((await state()).daily['2026-11-05'].reservedMicros, 1_000_000);
    });

    await t.test('completed cache hits across pools do not consume an exhausted spending allowance', async () => {
      await reset();
      const pair = stores({ dailyBudgetMicros: 1_000_000 });
      const admitted = await pair[0].submit(request('cached'));
      const lease = await pair[0].claim(admitted.job.id);
      await pair[0].complete(admitted.job.id, { score: 88 }, { leaseToken: lease.leaseToken, actualCostMicros: 1_000_000 });
      const results = await Promise.all(Array.from({ length: 8 }, (_, index) => pair[index % 2].submit(request(`viewer-${index}`, { key: 'synthetic:cached' }))));
      assert.ok(results.every((result) => result.cached && result.deduplicated && result.job.id === admitted.job.id));
      await rejectsCode(pair[1].submit(request('not-cached')), 'DAILY_BUDGET');
      assert.equal(Object.keys((await state()).jobs).length, 1);
    });

    await t.test('report reservations deduplicate across pools and share the scan spending ledger', async () => {
      await reset();
      const pair = stores({ maxReportCostMicros: 1_000_000 });
      const reports = await Promise.all(Array.from({ length: 12 }, (_, index) => pair[index % 2].reserveAuxiliary({ id: 'synthetic-report-id', maxCostMicros: 1_000_000 })));
      assert.equal(reports.filter(({ reserved }) => reserved).length, 1);
      await Promise.all(Array.from({ length: 4 }, (_, index) => pair[index % 2].submit(request(`scan-with-report-${index}`))));
      await rejectsCode(pair[0].reserveAuxiliary({ id: 'other-synthetic-report-id', maxCostMicros: 1_000_000 }), 'DAILY_BUDGET');
      await pair[1].finishAuxiliary('synthetic-report-id', { status: 'failed' });
      await rejectsCode(pair[0].submit(request('after-report-failure')), 'DAILY_BUDGET');
      assert.equal((await state()).daily['2026-11-05'].reservedMicros, 5_000_000);
    });

    await t.test('two real pools cannot race past IP, session, global or running-job limits', async () => {
      await reset();
      let pair = stores({ maxScanCostMicros: 0 });
      let results = await Promise.allSettled(Array.from({ length: 12 }, (_, index) => pair[index % 2].submit(request(index, { ipHash: 'shared-ip' }))));
      assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 3);
      assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'IP_QUOTA'));
      await reset();
      results = await Promise.allSettled(Array.from({ length: 8 }, (_, index) => pair[index % 2].submit(request(index, { sessionHash: 'shared-session' }))));
      assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 1);
      assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'ACTIVE_SESSION'));
      await reset();
      pair = stores({ maxScanCostMicros: 0, globalDaily: 3 });
      results = await Promise.allSettled(Array.from({ length: 8 }, (_, index) => pair[index % 2].submit(request(index))));
      assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 3);
      assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'GLOBAL_QUOTA'));
      await reset();
      pair = stores({ maxScanCostMicros: 0 });
      const queued = await Promise.all(Array.from({ length: 8 }, (_, index) => pair[index % 2].submit(request(index))));
      const claims = await Promise.all(queued.map(({ job }, index) => pair[index % 2].claim(job.id)));
      assert.equal(claims.filter(Boolean).length, 2);
      assert.equal(Object.values((await state()).jobs).filter(({ status }) => status === 'running').length, 2);
    });

    await t.test('the approved five-dollar daily budget is reserved before any work under contention', async () => {
      await reset();
      const pair = stores();
      const results = await Promise.allSettled(Array.from({ length: 12 }, (_, index) => pair[index % 2].submit(request(index))));
      assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 5);
      assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'DAILY_BUDGET'));
      const saved = await state();
      assert.equal(saved.daily['2026-11-05'].reservedMicros, 5_000_000);
      assert.equal(saved.monthly['2026-11'].reservedMicros, 5_000_000);
      assert.ok(Object.values(saved.jobs).every(({ status }) => status === 'queued'));
    });

    await t.test('the approved fifty-dollar monthly budget cannot race past its final allowance', async () => {
      await reset();
      const pair = stores();
      for (let day = 0; day < 10; day += 1) {
        now = START + day * DAY;
        const count = day < 9 ? 5 : 3;
        await Promise.all(Array.from({ length: count }, (_, index) => pair[index % 2].submit(request(`prime-${day}-${index}`))));
      }
      assert.equal((await state()).monthly['2026-11'].reservedMicros, 48_000_000);
      now = START + 10 * DAY;
      const results = await Promise.allSettled(Array.from({ length: 8 }, (_, index) => pair[index % 2].submit(request(`final-${index}`))));
      assert.equal(results.filter(({ status }) => status === 'fulfilled').length, 2);
      assert.ok(results.filter(({ status }) => status === 'rejected').every(({ reason }) => reason.code === 'MONTHLY_BUDGET'));
      const saved = await state();
      assert.equal(saved.monthly['2026-11'].reservedMicros, 50_000_000);
      assert.equal(Object.values(saved.jobs).filter(({ status }) => status === 'queued').length, 2);
    });

    await t.test('quota exceptions roll back and SQL failures cannot commit partial reservations', async () => {
      await reset();
      const [store] = stores({ dailyBudgetMicros: 1_000_000 });
      await store.submit(request('first'));
      const before = await state();
      await rejectsCode(store.submit(request('over-budget')), 'DAILY_BUDGET');
      assert.deepEqual(await state(), before);
      await admin.query(`REVOKE UPDATE ON ${TABLE} FROM audit_runtime`);
      try {
        const [writableStore] = stores();
        await rejectsCode(writableStore.submit(request('permission-refused')), 'STORE_UNAVAILABLE');
        assert.deepEqual(await state(), before);
      } finally {
        await admin.query(`GRANT UPDATE ON ${TABLE} TO audit_runtime`);
      }
      await admin.query(`CREATE FUNCTION rnr_audit.reject_fixture_update() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Synthetic fixture write refusal' USING ERRCODE = '23514'; END; $$; CREATE TRIGGER reject_fixture_update BEFORE UPDATE ON ${TABLE} FOR EACH ROW EXECUTE FUNCTION rnr_audit.reject_fixture_update()`);
      try {
        const [writableStore] = stores();
        await rejectsCode(writableStore.submit(request('write-fails-after-reserving')), 'STORE_UNAVAILABLE');
        assert.deepEqual(await state(), before, 'an UPDATE failure cannot retain tentative quotas, budgets or rate counters');
      } finally {
        await admin.query(`DROP TRIGGER reject_fixture_update ON ${TABLE}`);
      }
      await admin.query(`CREATE CONSTRAINT TRIGGER reject_fixture_commit AFTER UPDATE ON ${TABLE} DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION rnr_audit.reject_fixture_update()`);
      try {
        const [writableStore] = stores();
        await rejectsCode(writableStore.submit(request('write-fails-at-commit')), 'STORE_UNAVAILABLE');
        assert.deepEqual(await state(), before, 'a deferred COMMIT failure rolls back the actual SQL UPDATE');
      } finally {
        await admin.query(`DROP TRIGGER reject_fixture_commit ON ${TABLE}`);
      }
      await admin.query(`CREATE CONSTRAINT TRIGGER reject_fixture_rate_commit AFTER INSERT OR UPDATE ON ${RATES} DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION rnr_audit.reject_fixture_update()`);
      try {
        await rejectsCode(store.consumeRate({ scope: 'rollback-rate-at-commit', key: 'synthetic', limit: 1, windowMs: 60_000 }), 'STORE_UNAVAILABLE');
        assert.equal((await admin.query(`SELECT count(*)::int AS count FROM ${RATES}`)).rows[0].count, 0);
        assert.deepEqual(await state(), before);
      } finally {
        await admin.query(`DROP TRIGGER reject_fixture_rate_commit ON ${RATES}; DROP FUNCTION rnr_audit.reject_fixture_update()`);
      }
      assert.equal(await store.ping(), true, 'rolled-back clients remain usable');
    });

    await t.test('report insertion, completion status and verified cost refund commit atomically', async () => {
      await reset();
      const [store] = stores({ dailyBudgetMicros: 1_000_000 });
      const admitted = await store.submit(request('atomic-report'));
      const lease = await store.claim(admitted.job.id);
      const report = { score: 92, synthetic: true };
      await admin.query(`CREATE FUNCTION rnr_audit.reject_fixture_report_commit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Synthetic report commit refusal' USING ERRCODE = '23514'; END; $$; CREATE CONSTRAINT TRIGGER reject_fixture_report_commit AFTER INSERT ON ${REPORTS} DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION rnr_audit.reject_fixture_report_commit()`);
      try {
        await rejectsCode(store.complete(admitted.job.id, report, { leaseToken: lease.leaseToken, actualCostMicros: 0 }), 'STORE_UNAVAILABLE');
        const saved = await state();
        assert.equal(saved.jobs[admitted.job.id].status, 'running');
        assert.equal(saved.jobs[admitted.job.id].leaseToken, lease.leaseToken);
        assert.equal(saved.jobs[admitted.job.id].actualCostMicros, undefined);
        assert.equal(saved.daily['2026-11-05'].reservedMicros, 1_000_000);
        assert.equal(saved.monthly['2026-11'].reservedMicros, 1_000_000);
        assert.equal((await admin.query(`SELECT count(*)::int AS count FROM ${REPORTS} WHERE job_id = $1`, [admitted.job.id])).rows[0].count, 0);
        await rejectsCode(store.submit(request('cannot-use-rolled-back-refund')), 'DAILY_BUDGET');
      } finally {
        await admin.query(`DROP TRIGGER reject_fixture_report_commit ON ${REPORTS}; DROP FUNCTION rnr_audit.reject_fixture_report_commit()`);
      }
      const completed = await store.complete(admitted.job.id, report, { leaseToken: lease.leaseToken, actualCostMicros: 0 });
      assert.equal(completed.status, 'complete');
      assert.deepEqual(completed.report, report);
      const saved = await state();
      assert.equal(saved.jobs[admitted.job.id].status, 'complete');
      assert.equal(saved.jobs[admitted.job.id].report, undefined);
      assert.equal(saved.daily['2026-11-05'].reservedMicros, 0);
      assert.equal(saved.monthly['2026-11'].reservedMicros, 0);
      assert.deepEqual((await admin.query(`SELECT report FROM ${REPORTS} WHERE job_id = $1`, [admitted.job.id])).rows[0].report, report);
      assert.equal((await store.submit(request('verified-refund-is-available'))).job.status, 'queued');
    });

    await t.test('missing or oversized durable reports fail closed while valid scalar JSON remains supported', async () => {
      await reset();
      const [store] = stores({ maxScanCostMicros: 0 });
      const admitted = await store.submit(request('report-validation'));
      const lease = await store.claim(admitted.job.id);
      await store.complete(admitted.job.id, null, { leaseToken: lease.leaseToken, actualCostMicros: 0 });
      assert.equal((await store.read(admitted.job.id)).report, null);
      await admin.query(`DELETE FROM ${REPORTS} WHERE job_id = $1`, [admitted.job.id]);
      await rejectsCode(store.read(admitted.job.id), 'STORE_UNAVAILABLE');
      await admin.query(`INSERT INTO ${REPORTS} (job_id, report) VALUES ($1, $2::jsonb)`, [admitted.job.id, JSON.stringify('x'.repeat(65_536))]);
      await rejectsCode(store.read(admitted.job.id), 'STORE_UNAVAILABLE');
      await admin.query(`DELETE FROM ${REPORTS} WHERE job_id = $1`, [admitted.job.id]);
      await admin.query(`INSERT INTO ${REPORTS} (job_id, report) VALUES ($1, '42'::jsonb)`, [admitted.job.id]);
      assert.equal((await store.read(admitted.job.id)).report, 42);
      assert.equal((await state()).jobs[admitted.job.id].report, undefined);
    });

    await t.test('normalized rate buckets enforce limits and reject malformed persisted values', async () => {
      await reset();
      const pair = stores();
      const input = { scope: 'normalized-rate', key: 'synthetic', limit: 3, windowMs: 60_000 };
      const results = await Promise.all(Array.from({ length: 20 }, (_, index) => pair[index % 2].consumeRate(input)));
      assert.equal(results.filter(({ allowed }) => allowed).length, 3);
      const bucketKey = createHash('sha256').update(`${input.scope}\0${input.key}`).digest('hex');
      assert.equal(Number((await admin.query(`SELECT count FROM ${RATES} WHERE bucket_key = $1`, [bucketKey])).rows[0].count), 3);
      assert.deepEqual((await state()).rates, {});
      await assert.rejects(admin.query(`UPDATE ${RATES} SET count = -1 WHERE bucket_key = $1`, [bucketKey]), (error) => error.code === '23514');
      const constraints = (await admin.query("SELECT conname, pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conrelid = 'rnr_audit.audit_rate_buckets'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%reset_at%'" )).rows;
      const quote = (value) => `"${value.replaceAll('"', '""')}"`;
      try {
        for (const constraint of constraints) await admin.query(`ALTER TABLE ${RATES} DROP CONSTRAINT ${quote(constraint.conname)}`);
        await admin.query(`UPDATE ${RATES} SET reset_at = 9007199254740992 WHERE bucket_key = $1`, [bucketKey]);
        await rejectsCode(pair[0].consumeRate(input), 'STORE_UNAVAILABLE');
        assert.equal(Number((await admin.query(`SELECT count FROM ${RATES} WHERE bucket_key = $1`, [bucketKey])).rows[0].count), 3);
      } finally {
        await admin.query(`UPDATE ${RATES} SET reset_at = $1 WHERE bucket_key = $2`, [START + 60_000, bucketKey]);
        for (const constraint of constraints) await admin.query(`ALTER TABLE ${RATES} ADD CONSTRAINT ${quote(constraint.conname)} ${constraint.definition}`);
      }
    });

    await t.test('two pools cannot race past 4096 rate buckets and expired buckets are reclaimed', async () => {
      await reset();
      const pair = stores();
      const existing = { scope: 'cardinality-existing', key: 'synthetic', limit: 3, windowMs: 60_000 };
      const digest = (value) => createHash('sha256').update(value).digest('hex');
      const existingKey = digest(`${existing.scope}\0${existing.key}`);
      const seeded = Array.from({ length: 4095 }, (_, index) => ({
        bucket_key: index === 0 ? existingKey : digest(`synthetic-seeded-bucket-${index}`),
        count: index === 0 ? 3 : 1, reset_at: START + 60_000, rate_limit: 3, window_ms: 60_000,
      }));
      await admin.query(`INSERT INTO ${RATES} (bucket_key, count, reset_at, rate_limit, window_ms)
        SELECT value->>'bucket_key', (value->>'count')::bigint, (value->>'reset_at')::bigint,
          (value->>'rate_limit')::bigint, (value->>'window_ms')::bigint
        FROM jsonb_array_elements($1::jsonb)`, [JSON.stringify(seeded)]);
      const results = await Promise.all(Array.from({ length: 20 }, (_, index) => pair[index % 2].consumeRate({
        scope: `cardinality-new-scope-${index}`, key: `synthetic-identity-${index}`, limit: 3, windowMs: 60_000,
      })));
      assert.equal(results.filter(({ allowed }) => allowed).length, 1);
      assert.equal((await admin.query(`SELECT count(*)::int AS count FROM ${RATES}`)).rows[0].count, 4096);
      assert.equal((await pair[1].consumeRate(existing)).allowed, false, 'an existing exhausted bucket remains denied at capacity');
      assert.equal(Number((await admin.query(`SELECT count FROM ${RATES} WHERE bucket_key = $1`, [existingKey])).rows[0].count), 3);
      now += 60_001;
      assert.equal((await pair[0].consumeRate({ scope: 'after-expiry', key: 'synthetic', limit: 3, windowMs: 60_000 })).allowed, true);
      assert.equal((await admin.query(`SELECT count(*)::int AS count FROM ${RATES}`)).rows[0].count, 1);
      assert.deepEqual((await state()).rates, {});
    });

    await t.test('expired worker leases reject stale writes and retain their worst-case reservation', async () => {
      await reset();
      const [first, second] = stores();
      const admitted = await first.submit(request('expired'));
      const lease = await first.claim(admitted.job.id);
      assert.ok(lease?.leaseToken);
      now += 120_001;
      assert.equal((await second.read(admitted.job.id)).status, 'failed');
      await rejectsCode(first.complete(admitted.job.id, { score: 100 }, { leaseToken: lease.leaseToken, actualCostMicros: 0 }), 'LEASE_LOST');
      await rejectsCode(first.fail(admitted.job.id, 'late failure', { leaseToken: lease.leaseToken }), 'LEASE_LOST');
      assert.equal((await state()).monthly['2026-11'].reservedMicros, 1_000_000);
      assert.equal((await second.read(admitted.job.id)).report, undefined);
    });

    await t.test('normalized reads, rate checks and claims avoid transferring all retained reports', async (measurement) => {
      await reset();
      const [source] = stores({ maxScanCostMicros: 0 });
      const admitted = await source.submit(request('benchmark-template'));
      const lease = await source.claim(admitted.job.id);
      await source.complete(admitted.job.id, { score: 80 }, { leaseToken: lease.leaseToken, actualCostMicros: 0 });
      const seeded = await state();
      const template = Object.values(seeded.jobs)[0];
      assert.equal(template.report, undefined, 'durable reports must not live in the control ledger');
      seeded.jobs = {};
      const reports = [];
      now = START + 4 * DAY;
      for (let index = 0; index < 250; index += 1) {
        const id = randomUUID();
        const createdAt = START + Math.floor(index / 50) * DAY;
        seeded.jobs[id] = {
          ...structuredClone(template), id, key: `benchmark-${index}`,
          ipHash: `synthetic-benchmark-ip-${index}`, sessionHash: `synthetic-benchmark-session-${index}`,
          createdAt, startedAt: createdAt, finishedAt: createdAt,
          queueExpiresAt: createdAt + 600_000,
          reservation: { day: new Date(createdAt).toISOString().slice(0, 10), month: '2026-11', micros: 0 },
        };
        reports.push({ job_id: id, report: { score: 80, syntheticPayload: randomBytes(12_288).toString('base64') } });
      }
      seeded.daily = { '2026-11-09': { global: 50, ips: {}, sessions: {}, reservedMicros: 0 } };
      seeded.monthly = { '2026-11': { reservedMicros: 0 } };
      await admin.query(`UPDATE ${TABLE} SET state = $1::jsonb WHERE id = 1`, [JSON.stringify(seeded)]);
      await admin.query(`DELETE FROM ${REPORTS}`);
      await admin.query(`INSERT INTO ${REPORTS} (job_id, report) SELECT value->>'job_id', value->'report' FROM jsonb_array_elements($1::jsonb)`, [JSON.stringify(reports)]);
      const { rows: [sizes] } = await admin.query(`SELECT pg_column_size(state) AS stored_bytes, octet_length(state::text) AS json_text_bytes FROM ${TABLE} WHERE id = 1`);
      const { rows: [reportSizes] } = await admin.query(`SELECT count(*)::int AS count, sum(pg_column_size(report))::bigint AS stored_bytes, sum(octet_length(report::text))::bigint AS json_text_bytes FROM ${REPORTS}`);
      const measuredPool = makePool('audit_runtime', { max: 1 });
      const measuredStore = new PostgresAuditStore({ pool: measuredPool, config: config({ maxScanCostMicros: 0 }), clock: () => now });
      const measure = async (operation, afterEach = async () => {}) => {
        const samples = [];
        let walBytes = 0;
        for (let index = 0; index < 5; index += 1) {
          const initialLsn = (await admin.query('SELECT pg_current_wal_lsn() AS value')).rows[0].value;
          const client = await measuredPool.connect();
          const stream = client.connection.stream;
          const beforeBytes = stream.bytesRead;
          client.release();
          const start = performance.now();
          const result = await operation(index);
          const milliseconds = performance.now() - start;
          const after = await measuredPool.connect();
          assert.equal(after, client, 'measurement reuses the same physical PostgreSQL connection');
          samples.push({ milliseconds, wireBytes: after.connection.stream.bytesRead - beforeBytes });
          after.release();
          walBytes += Number((await admin.query('SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), $1::pg_lsn) AS bytes', [initialLsn])).rows[0].bytes);
          await afterEach(result);
        }
        return {
          samples: samples.length,
          meanWireBytes: Math.round(samples.reduce((sum, sample) => sum + sample.wireBytes, 0) / samples.length),
          meanMilliseconds: Number((samples.reduce((sum, sample) => sum + sample.milliseconds, 0) / samples.length).toFixed(2)),
          maxMilliseconds: Number(Math.max(...samples.map((sample) => sample.milliseconds)).toFixed(2)),
          walBytes,
        };
      };
      const read = await measure(async () => {
        const job = await measuredStore.read(Object.keys(seeded.jobs)[249]);
        assert.ok(job.report?.syntheticPayload);
        return job;
      });
      const rate = await measure(() => measuredStore.consumeRate({ scope: 'benchmark', key: 'synthetic-rate', limit: 10, windowMs: 60_000 }));
      const ping = await measure(() => measuredStore.ping());
      now += DAY;
      const queued = [];
      for (let index = 0; index < 5; index += 1) queued.push(await measuredStore.submit(request(`benchmark-claim-${index}`)));
      const claim = await measure(
        (index) => measuredStore.claim(queued[index].job.id),
        async (claimed) => {
          assert.ok(claimed?.leaseToken);
          await measuredStore.fail(claimed.job.id, 'Synthetic benchmark cleanup.', { leaseToken: claimed.leaseToken });
        },
      );
      assert.ok(read.meanWireBytes < 100_000, 'one report read must not transfer all 250 reports');
      assert.equal(read.walBytes, 0, 'report reads must not rewrite the control ledger');
      assert.ok(rate.meanWireBytes < 16_384, 'rate checks must not return control state or reports');
      assert.ok(ping.meanWireBytes < 2048, 'readiness checks return only small metadata');
      assert.equal(ping.walBytes, 0);
      assert.ok(claim.meanWireBytes < 1_000_000, 'lease transactions may transfer metadata but must exclude retained reports');
      measurement.diagnostic(JSON.stringify({
        fixture: '250 synthetic reports with 16KiB payloads; local Unix socket, no TLS or provider',
        schemaVersion: 2, reportCount: reportSizes.count,
        controlStoredBytes: sizes.stored_bytes, controlJsonTextBytes: sizes.json_text_bytes,
        reportStoredBytes: Number(reportSizes.stored_bytes), reportJsonTextBytes: Number(reportSizes.json_text_bytes),
        read, rate, ping, claim,
        inferredDatabaseEgressBytesFor1000ReportReads: read.meanWireBytes * 1000,
      }));
    });

    await t.test('an ended real pg pool fails closed without an in-memory fallback', async () => {
      const endedPool = makePool();
      await endedPool.query('SELECT 1');
      await endedPool.end();
      pools.delete(endedPool);
      const store = new PostgresAuditStore({ pool: endedPool, config: config(), clock: () => now });
      await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
      await rejectsCode(store.submit(request('ended-pool')), 'STORE_UNAVAILABLE');
    });

    await t.test('stopping only the verified fixture server makes the store fail closed', async () => {
      // Recheck the immutable ID and ownership label immediately before stopping.
      const { stdout } = await docker(['inspect', local.containerId]);
      const [container] = JSON.parse(stdout);
      assert.equal(container.Name, `/${local.containerName}`);
      assert.equal(container.Config.Labels?.['audit.fixture'], local.nonce);
      assert.equal(container.HostConfig.NetworkMode, 'none');
      await docker(['stop', '--time', '2', local.containerId]);
      const [store] = stores();
      await rejectsCode(store.ping(), 'STORE_UNAVAILABLE');
      await rejectsCode(store.submit(request('server-stopped')), 'STORE_UNAVAILABLE');
    });
  });
}
