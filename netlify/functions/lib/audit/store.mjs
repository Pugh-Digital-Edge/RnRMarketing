import { createHash, randomUUID } from 'node:crypto';
import { APPROVED_SCAN_BUDGET } from './budget-policy.mjs';

const DAY_MS = 86_400_000;
const SCHEMA_VERSION = 2;
const STATE_VERSION = 1;
const MAX_JOBS = 256;
const MAX_AUXILIARY = 4096;
const MAX_RATES = 4096;
const MAX_STATE_BYTES = 24 * 1024 * 1024;
const ACTIVE = new Set(['queued', 'running']);
const own = (object, key) => Object.hasOwn(object, key) ? object[key] : undefined;
const digest = (value) => createHash('sha256').update(value).digest('hex');

export class AuditStoreError extends Error {
  constructor(code, message = code, options) {
    super(message, options);
    this.name = 'AuditStoreError';
    this.code = code;
  }
}

const error = (code, message) => new AuditStoreError(code, message);
const clone = (value) => JSON.parse(JSON.stringify(value));

function integer(value, name, { minimum = 1, maximum = Number.MAX_SAFE_INTEGER } = {}) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw error('INVALID_CONFIG', `Invalid ${name}.`);
  }
  return value;
}

function configuration(config) {
  if (!config || typeof config !== 'object') throw error('INVALID_CONFIG');
  const result = {};
  for (const key of ['ipDaily', 'sessionDaily', 'globalDaily', 'maxActive', 'maxQueued', 'cacheMs', 'leaseMs']) {
    result[key] = integer(config[key], key);
  }
  for (const key of ['dailyBudgetMicros', 'monthlyBudgetMicros', 'maxScanCostMicros']) result[key] = integer(config[key], key, { minimum: 0 });
  for (const key of ['dailyBudgetMicros', 'monthlyBudgetMicros']) {
    if (result[key] > APPROVED_SCAN_BUDGET[key]) throw error('INVALID_CONFIG', 'Budget exceeds the approved scan-work ceiling.');
  }
  if (result.cacheMs > DAY_MS) throw error('INVALID_CONFIG', 'Cache lifetime exceeds 24 hours.');
  result.queueMs = integer(config.queueMs ?? 10 * 60_000, 'queueMs', { maximum: 10 * 60_000 });
  result.retentionMs = integer(config.retentionMs ?? 7 * DAY_MS, 'retentionMs', { minimum: result.cacheMs, maximum: 7 * DAY_MS });
  if (config.maxReportCostMicros !== undefined) result.maxReportCostMicros = integer(config.maxReportCostMicros, 'maxReportCostMicros', { minimum: 0 });
  return Object.freeze(result);
}

function initialState() {
  return { version: STATE_VERSION, jobs: {}, daily: {}, monthly: {}, rates: {}, auxiliary: {} };
}

const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
const nonnegative = (value) => Number.isSafeInteger(value) && value >= 0;
const storedString = (value) => typeof value === 'string' && value.length > 0 && value.length <= 512;
const databaseInteger = (value) => (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) && Number.isSafeInteger(Number(value)) ? Number(value) : NaN;
const validReservation = (value) => object(value) && /^\d{4}-\d{2}-\d{2}$/.test(value.day) && /^\d{4}-\d{2}$/.test(value.month) && value.day.slice(0, 7) === value.month && nonnegative(value.micros);

function assertJob(job, id) {
  if (!job || job.id !== id || !storedString(job.key) || !storedString(job.ipHash) || !storedString(job.sessionHash) || !nonnegative(job.createdAt) || !validReservation(job.reservation) || !['queued', 'running', 'complete', 'failed'].includes(job.status)) throw error('STORE_UNAVAILABLE', 'Invalid persisted audit job.');
  if (job.status === 'queued' && !nonnegative(job.queueExpiresAt)) throw error('STORE_UNAVAILABLE', 'Invalid persisted queue entry.');
  if (job.status === 'running' && (!storedString(job.leaseToken) || !nonnegative(job.leaseExpiresAt))) throw error('STORE_UNAVAILABLE', 'Invalid persisted worker lease.');
  if (!ACTIVE.has(job.status) && !nonnegative(job.finishedAt)) throw error('STORE_UNAVAILABLE', 'Invalid persisted audit result.');
}

function assertState(state) {
  if (!state || state.version !== STATE_VERSION || ['jobs', 'daily', 'monthly', 'rates', 'auxiliary'].some((key) => !object(state[key]))) {
    throw error('STORE_UNAVAILABLE', 'Audit store schema is not ready.');
  }
  for (const [day, daily] of Object.entries(state.daily)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !daily || !nonnegative(daily.global) || !nonnegative(daily.reservedMicros) || !object(daily.ips) || !object(daily.sessions) || Object.values(daily.ips).some((count) => !nonnegative(count)) || Object.values(daily.sessions).some((count) => !nonnegative(count))) throw error('STORE_UNAVAILABLE', 'Invalid daily counters.');
  }
  for (const [month, monthly] of Object.entries(state.monthly)) {
    if (!/^\d{4}-\d{2}$/.test(month) || !monthly || !nonnegative(monthly.reservedMicros)) throw error('STORE_UNAVAILABLE', 'Invalid monthly counters.');
  }
  for (const [id, job] of Object.entries(state.jobs)) assertJob(job, id);
  for (const [id, record] of Object.entries(state.auxiliary)) {
    if (!record || record.id !== id || !nonnegative(record.createdAt) || !validReservation(record.reservation) || !['reserved', 'complete', 'failed'].includes(record.status)) throw error('STORE_UNAVAILABLE', 'Invalid persisted report reservation.');
  }
  for (const rate of Object.values(state.rates)) {
    if (!rate || !nonnegative(rate.count) || !nonnegative(rate.resetAt) || !Number.isSafeInteger(rate.limit) || rate.limit < 1 || !Number.isSafeInteger(rate.windowMs) || rate.windowMs < 1 || rate.windowMs > DAY_MS) throw error('STORE_UNAVAILABLE', 'Invalid persisted request counter.');
  }
  if (Object.keys(state.jobs).length > MAX_JOBS || Object.keys(state.auxiliary).length > MAX_AUXILIARY || Object.keys(state.rates).length > MAX_RATES) throw error('STORE_UNAVAILABLE', 'Audit store capacity exceeded.');
}

function identifier(value, label) {
  if (typeof value !== 'string' || value.length < 1 || value.length > 512) throw error('INVALID_INPUT', `Invalid ${label}.`);
  return value;
}

function jsonValue(value, maximumBytes) {
  let serialized;
  try { serialized = JSON.stringify(value); } catch { throw error('INVALID_INPUT', 'Data must be JSON.'); }
  if (!serialized || Buffer.byteLength(serialized) > maximumBytes) throw error('INVALID_INPUT', 'Data exceeds its storage allowance.');
  return JSON.parse(serialized);
}

const periods = (now) => {
  const date = new Date(now).toISOString();
  return { day: date.slice(0, 10), month: date.slice(0, 7) };
};

function markFailed(job, reason, now) {
  job.status = 'failed';
  job.error = reason;
  job.finishedAt = now;
  delete job.leaseToken;
  delete job.leaseExpiresAt;
}

function prune(state, config, now) {
  const { day, month } = periods(now);
  for (const key of Object.keys(state.daily)) if (key < day) delete state.daily[key];
  for (const key of Object.keys(state.monthly)) if (key < month) delete state.monthly[key];
  for (const job of Object.values(state.jobs)) {
    if (job.status === 'running' && job.leaseExpiresAt <= now) markFailed(job, 'Worker lease expired.', now);
    if (job.status === 'queued' && job.queueExpiresAt <= now) markFailed(job, 'Queue admission expired.', now);
    if (!ACTIVE.has(job.status) && (job.finishedAt ?? job.createdAt) + config.retentionMs <= now) delete state.jobs[job.id];
  }
  for (const [id, record] of Object.entries(state.auxiliary)) {
    // Never shorten the idempotency window when a scan result remains cached.
    if (record.createdAt + config.retentionMs <= now) delete state.auxiliary[id];
  }
  for (const [key, rate] of Object.entries(state.rates)) if (rate.resetAt <= now) delete state.rates[key];
}

function publicJob(job) {
  if (!job) return null;
  const result = clone(job);
  delete result.leaseToken;
  delete result.ipHash;
  delete result.sessionHash;
  return result;
}

function dayCounters(state, day) {
  return own(state.daily, day) ?? { global: 0, ips: {}, sessions: {}, reservedMicros: 0 };
}

function reserveBudget(state, config, now, micros) {
  const { day, month } = periods(now);
  const daily = dayCounters(state, day);
  const monthly = own(state.monthly, month) ?? { reservedMicros: 0 };
  // Subtraction avoids accepting an unsafe integer overflow during admission.
  if (micros > config.dailyBudgetMicros - daily.reservedMicros) throw error('DAILY_BUDGET');
  if (micros > config.monthlyBudgetMicros - monthly.reservedMicros) throw error('MONTHLY_BUDGET');
  daily.reservedMicros += micros;
  monthly.reservedMicros += micros;
  state.daily[day] = daily;
  state.monthly[month] = monthly;
  return { day, month, micros };
}

function releaseVerifiedRemainder(state, reservation, actualCostMicros) {
  const remainder = reservation.micros - actualCostMicros;
  // A job crossing midnight must settle its original periods, never today's.
  const daily = own(state.daily, reservation.day);
  const monthly = own(state.monthly, reservation.month);
  if (daily) daily.reservedMicros -= remainder;
  if (monthly) monthly.reservedMicros -= remainder;
}

function validCost(value, reservation) {
  return Number.isSafeInteger(value) && value >= 0 && value <= reservation.micros;
}

function requireLease(job, leaseToken, now) {
  if (!job || job.status !== 'running' || typeof leaseToken !== 'string' || job.leaseToken !== leaseToken || job.leaseExpiresAt <= now) throw error('LEASE_LOST');
}

class AuditStore {
  constructor({ config, clock = Date.now }) {
    this.config = configuration(config);
    if (typeof clock !== 'function') throw error('INVALID_CONFIG', 'Invalid clock.');
    this.clock = clock;
  }

  now() {
    const now = this.clock();
    if (!Number.isSafeInteger(now) || now < 0 || now > 253_402_300_799_999) throw error('STORE_UNAVAILABLE', 'Invalid store clock.');
    return now;
  }

  async ping() {
    return this.transact(() => true);
  }

  async submit({ key, input, ipHash, sessionHash }) {
    identifier(key, 'audit key');
    identifier(ipHash, 'IP hash');
    identifier(sessionHash, 'session hash');
    const safeInput = jsonValue(input, 8192);
    return this.transact((state, now) => {
      const jobs = Object.values(state.jobs);
      const existing = jobs.find((job) => job.key === key && ACTIVE.has(job.status))
        ?? jobs.filter((job) => job.key === key && job.status === 'complete' && job.finishedAt + this.config.cacheMs > now).sort((a, b) => b.finishedAt - a.finishedAt)[0];
      if (existing) return { job: publicJob(existing), cached: existing.status === 'complete', deduplicated: true };
      if (jobs.some((job) => job.sessionHash === sessionHash && ACTIVE.has(job.status))) throw error('ACTIVE_SESSION');
      const { day } = periods(now);
      const daily = dayCounters(state, day);
      const ipKey = digest(ipHash);
      const sessionKey = digest(sessionHash);
      if ((own(daily.ips, ipKey) ?? 0) >= this.config.ipDaily) throw error('IP_QUOTA');
      if ((own(daily.sessions, sessionKey) ?? 0) >= this.config.sessionDaily) throw error('SESSION_QUOTA');
      if (daily.global >= this.config.globalDaily) throw error('GLOBAL_QUOTA');
      if (jobs.filter((job) => job.status === 'queued').length >= this.config.maxQueued) throw error('QUEUE_FULL');
      if (jobs.length >= MAX_JOBS) {
        // Retain every usable cache entry. Older terminal results may be evicted
        // at capacity without changing the independent quota/budget ledgers.
        const disposable = jobs.filter((job) => !ACTIVE.has(job.status) && job.finishedAt + this.config.cacheMs <= now)
          .sort((a, b) => a.finishedAt - b.finishedAt || a.id.localeCompare(b.id))[0];
        if (!disposable) throw error('STORE_UNAVAILABLE', 'Audit result storage is full.');
        delete state.jobs[disposable.id];
      }
      const reservation = reserveBudget(state, this.config, now, this.config.maxScanCostMicros);
      // reserveBudget installs this counter if the UTC day has just begun.
      const counters = state.daily[day];
      counters.global += 1;
      counters.ips[ipKey] = (own(counters.ips, ipKey) ?? 0) + 1;
      counters.sessions[sessionKey] = (own(counters.sessions, sessionKey) ?? 0) + 1;
      const job = { id: randomUUID(), key, input: safeInput, ipHash, sessionHash, status: 'queued', createdAt: now, queueExpiresAt: now + this.config.queueMs, reservation };
      state.jobs[job.id] = job;
      return { job: publicJob(job), cached: false, deduplicated: false };
    });
  }

  async claim(jobId) {
    identifier(jobId, 'job ID');
    return this.transact((state, now) => this.claimInTransaction(state, now, own(state.jobs, jobId)));
  }

  async claimNext() {
    return this.transact((state, now) => {
      const next = Object.values(state.jobs).filter((job) => job.status === 'queued').sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))[0];
      return this.claimInTransaction(state, now, next);
    });
  }

  claimInTransaction(state, now, job) {
    if (!job || job.status !== 'queued' || Object.values(state.jobs).filter((candidate) => candidate.status === 'running').length >= this.config.maxActive) return null;
    job.status = 'running';
    job.startedAt = now;
    job.leaseToken = randomUUID();
    job.leaseExpiresAt = now + this.config.leaseMs;
    return { job: publicJob(job), leaseToken: job.leaseToken };
  }

  async complete(jobId, report, { leaseToken, actualCostMicros } = {}) {
    identifier(jobId, 'job ID');
    const safeReport = jsonValue(report, 65_536);
    const result = await this.transact((state, now) => {
      const job = own(state.jobs, jobId);
      requireLease(job, leaseToken, now);
      if (actualCostMicros !== undefined && !validCost(actualCostMicros, job.reservation)) {
        markFailed(job, 'Unverified or excessive provider cost.', now);
        return { invalidCost: true };
      }
      if (actualCostMicros !== undefined) {
        releaseVerifiedRemainder(state, job.reservation, actualCostMicros);
        job.actualCostMicros = actualCostMicros;
      }
      job.status = 'complete';
      job.finishedAt = now;
      job.report = safeReport;
      delete job.leaseToken;
      delete job.leaseExpiresAt;
      return { job: publicJob(job) };
    });
    if (result.invalidCost) throw error('INVALID_COST');
    return result.job;
  }

  async fail(jobId, reason, { leaseToken } = {}) {
    identifier(jobId, 'job ID');
    return this.transact((state, now) => {
      const job = own(state.jobs, jobId);
      requireLease(job, leaseToken, now);
      const message = typeof reason === 'string' ? reason : reason?.message;
      markFailed(job, typeof message === 'string' ? message.slice(0, 512) : 'Audit failed.', now);
      return publicJob(job);
    });
  }

  async read(jobId) {
    identifier(jobId, 'job ID');
    return this.transact((state) => publicJob(own(state.jobs, jobId)));
  }

  async consumeRate({ scope, key, limit, windowMs }) {
    identifier(scope, 'rate scope');
    identifier(key, 'rate key');
    integer(limit, 'rate limit');
    integer(windowMs, 'rate window', { maximum: DAY_MS });
    const bucketKey = digest(`${scope}\0${key}`);
    return this.transact((state, now) => {
      let bucket = own(state.rates, bucketKey);
      if (!bucket && Object.keys(state.rates).length >= MAX_RATES) return { allowed: false, remaining: 0, resetAt: Math.min(...Object.values(state.rates).map((rate) => rate.resetAt)) };
      if (!bucket) bucket = { count: 0, resetAt: now + windowMs, limit, windowMs };
      // A caller changing a scope's policy must not reset an existing bucket.
      const effectiveLimit = Math.min(limit, bucket.limit);
      const allowed = bucket.count < effectiveLimit;
      if (allowed) bucket.count += 1;
      state.rates[bucketKey] = bucket;
      return { allowed, remaining: Math.max(0, effectiveLimit - bucket.count), resetAt: bucket.resetAt };
    });
  }

  async reserveAuxiliary({ id, maxCostMicros }) {
    identifier(id, 'auxiliary ID');
    integer(maxCostMicros, 'auxiliary maximum cost', { minimum: 0 });
    if (this.config.maxReportCostMicros !== undefined && maxCostMicros > this.config.maxReportCostMicros) throw error('INVALID_COST');
    const recordId = digest(id);
    return this.transact((state, now) => {
      const existing = own(state.auxiliary, recordId);
      if (existing) return { ...clone(existing), reserved: false };
      if (Object.keys(state.auxiliary).length >= MAX_AUXILIARY) throw error('STORE_UNAVAILABLE', 'Report reservation storage is full.');
      const reservation = reserveBudget(state, this.config, now, maxCostMicros);
      const record = { id: recordId, status: 'reserved', createdAt: now, reservation };
      state.auxiliary[recordId] = record;
      return { ...clone(record), reserved: true };
    });
  }

  async finishAuxiliary(id, { status, actualCostMicros } = {}) {
    identifier(id, 'auxiliary ID');
    if (!['complete', 'failed'].includes(status)) throw error('INVALID_INPUT');
    const result = await this.transact((state, now) => {
      const record = own(state.auxiliary, digest(id));
      if (!record) throw error('INVALID_INPUT', 'Unknown report reservation.');
      if (record.status !== 'reserved') return { record: clone(record) };
      if (actualCostMicros !== undefined && !validCost(actualCostMicros, record.reservation)) {
        record.status = 'failed';
        record.finishedAt = now;
        return { invalidCost: true };
      }
      if (status === 'complete' && actualCostMicros !== undefined) {
        releaseVerifiedRemainder(state, record.reservation, actualCostMicros);
        record.actualCostMicros = actualCostMicros;
      }
      record.status = status;
      record.finishedAt = now;
      return { record: clone(record) };
    });
    if (result.invalidCost) throw error('INVALID_COST');
    return result.record;
  }
}

/** Local/test adapter. Every mutation has the same serialized boundary as SQL. */
export class MemoryAuditStore extends AuditStore {
  constructor(options = {}) {
    if (process.env.NODE_ENV === 'production' || process.env.CONTEXT === 'production' || options.config?.environment === 'production' || options.config?.production === true) throw error('STORE_UNAVAILABLE', 'Memory audit storage is forbidden in production.');
    super(options);
    this.state = initialState();
    this.pending = Promise.resolve();
  }

  async transact(operation) {
    const execute = async () => {
      const state = clone(this.state);
      assertState(state);
      const now = this.now();
      prune(state, this.config, now);
      const result = operation(state, now);
      assertState(state);
      if (Buffer.byteLength(JSON.stringify(state)) > MAX_STATE_BYTES) throw error('STORE_UNAVAILABLE', 'Audit store byte capacity exceeded.');
      this.state = state;
      return clone(result);
    };
    const transaction = this.pending.then(execute, execute);
    this.pending = transaction.catch(() => {});
    return transaction;
  }
}

/**
 * Inject a pg Pool with bounded connection/query timeouts. The singleton row lock
 * serializes quotas, reservations and leases across all serverless instances.
 * There is deliberately no in-process fallback when PostgreSQL is unavailable.
 */
export class PostgresAuditStore extends AuditStore {
  constructor({ pool, ...options } = {}) {
    super(options);
    if (!pool || typeof pool.connect !== 'function') throw error('INVALID_CONFIG', 'A PostgreSQL pool is required.');
    this.pool = pool;
  }

  async withClient(operation, { transaction = true } = {}) {
    let client;
    let inTransaction = false;
    let destroyClient = false;
    try {
      client = await this.pool.connect();
      if (transaction) {
        await client.query('BEGIN');
        inTransaction = true;
      }
      const result = await operation(client);
      if (transaction) {
        await client.query('COMMIT');
        inTransaction = false;
      }
      return clone(result);
    } catch (cause) {
      if (client && inTransaction) {
        try { await client.query('ROLLBACK'); } catch { destroyClient = true; }
      }
      if (cause instanceof AuditStoreError) throw cause;
      throw new AuditStoreError('STORE_UNAVAILABLE', 'Audit control storage is unavailable.', { cause });
    } finally {
      if (client) client.release(destroyClient);
    }
  }

  assertMetadata(row) {
    if (!row || row.schema_version !== SCHEMA_VERSION || String(row.state_version) !== String(STATE_VERSION)) throw error('STORE_UNAVAILABLE', 'Audit store migration is required.');
  }

  async report(client, jobId) {
    const selected = await client.query('SELECT report FROM rnr_audit.audit_reports WHERE job_id = $1', [jobId]);
    if (selected.rows?.length !== 1) throw error('STORE_UNAVAILABLE', 'Completed audit report is missing.');
    try { return jsonValue(selected.rows[0].report, 65_536); }
    catch { throw error('STORE_UNAVAILABLE', 'Invalid persisted audit report.'); }
  }

  async transact(operation) {
    return this.withClient(async (client) => {
      const selected = await client.query('SELECT state, schema_version FROM rnr_audit.audit_control_state WHERE id = 1 FOR UPDATE');
      if (selected.rows?.length !== 1 || selected.rows[0].schema_version !== SCHEMA_VERSION) throw error('STORE_UNAVAILABLE', 'Audit store migration is required.');
      const state = clone(selected.rows[0].state);
      assertState(state);
      if (Object.keys(state.rates).length || Object.values(state.jobs).some((job) => Object.hasOwn(job, 'report'))) throw error('STORE_UNAVAILABLE', 'Audit store normalization is required.');
      const previous = JSON.stringify(state);
      const previousIds = Object.keys(state.jobs);
      const now = this.now();
      prune(state, this.config, now);
      const result = operation(state, now);
      // Only the newly completed report crosses this connection. It is written
      // in the same transaction as the fenced complete status and cost release.
      for (const job of Object.values(state.jobs)) {
        if (Object.hasOwn(job, 'report')) {
          await client.query('INSERT INTO rnr_audit.audit_reports (job_id, report) VALUES ($1, $2::jsonb)', [job.id, JSON.stringify(job.report)]);
          delete job.report;
        }
      }
      assertState(state);
      const serialized = JSON.stringify(state);
      if (Buffer.byteLength(serialized) > MAX_STATE_BYTES) throw error('STORE_UNAVAILABLE', 'Audit store byte capacity exceeded.');
      if (serialized !== previous) {
        const updated = await client.query('UPDATE rnr_audit.audit_control_state SET state = $1::jsonb, updated_at = NOW() WHERE id = 1', [serialized]);
        if (updated.rowCount !== 1) throw error('STORE_UNAVAILABLE', 'Audit store singleton disappeared.');
      }
      const removed = previousIds.filter((id) => !Object.hasOwn(state.jobs, id));
      if (removed.length) await client.query('DELETE FROM rnr_audit.audit_reports WHERE job_id = ANY($1::text[])', [removed]);
      if (result?.job?.status === 'complete' && !Object.hasOwn(result.job, 'report')) result.job.report = await this.report(client, result.job.id);
      return result;
    });
  }

  async ping() {
    return this.withClient(async (client) => {
      const selected = await client.query(`SELECT schema_version, state->>'version' AS state_version,
        jsonb_typeof(state->'jobs') AS jobs_type, jsonb_typeof(state->'daily') AS daily_type,
        jsonb_typeof(state->'monthly') AS monthly_type, jsonb_typeof(state->'auxiliary') AS auxiliary_type,
        state->'rates' = '{}'::jsonb AS rates_empty,
        EXISTS (SELECT 1 FROM rnr_audit.audit_rate_control WHERE id = 1) AS rate_ready,
        to_regclass('rnr_audit.audit_reports') IS NOT NULL AS reports_ready,
        to_regclass('rnr_audit.audit_rate_buckets') IS NOT NULL AS buckets_ready
        FROM rnr_audit.audit_control_state WHERE id = 1`);
      if (selected.rows?.length !== 1) throw error('STORE_UNAVAILABLE');
      const row = selected.rows[0];
      this.assertMetadata(row);
      if (['jobs_type', 'daily_type', 'monthly_type', 'auxiliary_type'].some((key) => row[key] !== 'object') || row.rates_empty !== true || row.rate_ready !== true || row.reports_ready !== true || row.buckets_ready !== true) throw error('STORE_UNAVAILABLE', 'Audit store schema is not ready.');
      return true;
    }, { transaction: false });
  }

  async read(jobId) {
    identifier(jobId, 'job ID');
    return this.withClient(async (client) => {
      const selected = await client.query(`SELECT c.schema_version, c.state->>'version' AS state_version,
        jsonb_typeof(c.state->'jobs') AS jobs_type, c.state->'jobs'->$1 AS job,
        r.job_id IS NOT NULL AS has_report, r.report
        FROM rnr_audit.audit_control_state AS c
        LEFT JOIN rnr_audit.audit_reports AS r ON r.job_id = $1 WHERE c.id = 1`, [jobId]);
      if (selected.rows?.length !== 1) throw error('STORE_UNAVAILABLE');
      const row = selected.rows[0];
      this.assertMetadata(row);
      if (row.jobs_type !== 'object') throw error('STORE_UNAVAILABLE');
      if (row.job === null || row.job === undefined) return null;
      const job = clone(row.job);
      assertJob(job, jobId);
      if (Object.hasOwn(job, 'report')) throw error('STORE_UNAVAILABLE', 'Audit store normalization is required.');
      const now = this.now();
      // Reads report lease expiry without mutating the ledger. The next control
      // transaction persists expiry before using concurrency/session capacity.
      if (job.status === 'running' && job.leaseExpiresAt <= now) markFailed(job, 'Worker lease expired.', now);
      if (job.status === 'queued' && job.queueExpiresAt <= now) markFailed(job, 'Queue admission expired.', now);
      if (!ACTIVE.has(job.status) && job.finishedAt + this.config.retentionMs <= now) return null;
      if (job.status === 'complete') {
        if (row.has_report !== true) throw error('STORE_UNAVAILABLE', 'Completed audit report is missing.');
        try { job.report = jsonValue(row.report, 65_536); }
        catch { throw error('STORE_UNAVAILABLE', 'Invalid persisted audit report.'); }
      }
      return publicJob(job);
    }, { transaction: false });
  }

  async consumeRate({ scope, key, limit, windowMs }) {
    identifier(scope, 'rate scope');
    identifier(key, 'rate key');
    integer(limit, 'rate limit');
    integer(windowMs, 'rate window', { maximum: DAY_MS });
    const bucketKey = digest(`${scope}\0${key}`);
    return this.withClient(async (client) => {
      // A separate one-row mutex bounds total cardinality across all instances
      // without loading reports or serializing scan admissions behind polling.
      const locked = await client.query(`SELECT r.id, c.schema_version, c.state->>'version' AS state_version
        FROM rnr_audit.audit_rate_control AS r CROSS JOIN rnr_audit.audit_control_state AS c
        WHERE r.id = 1 AND c.id = 1 FOR UPDATE OF r`);
      if (locked.rows?.length !== 1) throw error('STORE_UNAVAILABLE', 'Rate control singleton is missing.');
      this.assertMetadata(locked.rows[0]);
      const now = this.now();
      await client.query('DELETE FROM rnr_audit.audit_rate_buckets WHERE reset_at <= $1', [now]);
      const selected = await client.query('SELECT count, reset_at, rate_limit, window_ms FROM rnr_audit.audit_rate_buckets WHERE bucket_key = $1', [bucketKey]);
      if (selected.rows?.length > 1) throw error('STORE_UNAVAILABLE');
      let bucket;
      if (selected.rows?.length === 1) {
        const row = selected.rows[0];
        bucket = { count: databaseInteger(row.count), resetAt: databaseInteger(row.reset_at), limit: databaseInteger(row.rate_limit), windowMs: databaseInteger(row.window_ms) };
        if (!nonnegative(bucket.count) || !nonnegative(bucket.resetAt) || !Number.isSafeInteger(bucket.limit) || bucket.limit < 1 || !Number.isSafeInteger(bucket.windowMs) || bucket.windowMs < 1 || bucket.windowMs > DAY_MS || bucket.count > bucket.limit || bucket.resetAt <= now) throw error('STORE_UNAVAILABLE', 'Invalid persisted request counter.');
      } else {
        const capacity = await client.query('SELECT COUNT(*)::integer AS bucket_count, MIN(reset_at) AS first_reset_at FROM rnr_audit.audit_rate_buckets');
        const row = capacity.rows?.[0];
        const count = databaseInteger(row?.bucket_count);
        if (!nonnegative(count) || count > MAX_RATES) throw error('STORE_UNAVAILABLE', 'Request counter capacity exceeded.');
        if (count === MAX_RATES) {
          const resetAt = databaseInteger(row.first_reset_at);
          if (!nonnegative(resetAt) || resetAt <= now) throw error('STORE_UNAVAILABLE');
          return { allowed: false, remaining: 0, resetAt };
        }
        bucket = { count: 0, resetAt: now + windowMs, limit, windowMs };
      }
      const effectiveLimit = Math.min(limit, bucket.limit);
      const allowed = bucket.count < effectiveLimit;
      if (allowed) bucket.count += 1;
      if (selected.rows.length === 0) {
        await client.query('INSERT INTO rnr_audit.audit_rate_buckets (bucket_key, count, reset_at, rate_limit, window_ms) VALUES ($1, $2, $3, $4, $5)', [bucketKey, bucket.count, bucket.resetAt, bucket.limit, bucket.windowMs]);
      } else if (allowed) {
        const updated = await client.query('UPDATE rnr_audit.audit_rate_buckets SET count = $2 WHERE bucket_key = $1', [bucketKey, bucket.count]);
        if (updated.rowCount !== 1) throw error('STORE_UNAVAILABLE');
      }
      return { allowed, remaining: Math.max(0, effectiveLimit - bucket.count), resetAt: bucket.resetAt };
    });
  }
}
