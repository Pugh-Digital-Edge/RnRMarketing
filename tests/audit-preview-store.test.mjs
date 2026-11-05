import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createPreviewStore, PREVIEW_STORE_FILES, previewStorageCapabilities } from '../scripts/lib/audit-preview-store.mjs';

const DAY = 86_400_000;
const START = Date.UTC(2026, 10, 5, 12);
const config = (extra = {}) => ({
  ipDaily: 3, sessionDaily: 3, globalDaily: 50, maxActive: 2, maxQueued: 8,
  cacheMs: DAY, leaseMs: 120_000, dailyBudgetMicros: 5_000_000,
  monthlyBudgetMicros: 50_000_000, maxScanCostMicros: 0, maxReportCostMicros: 0, ...extra,
});
const request = (id, extra = {}) => ({
  key: `fixture:${id}`, input: { url: `https://fixture-${id}.example/`, service: 'Restoration', area: 'Fictional area' },
  ipHash: `pseudonymous-ip:${id}`, sessionHash: `pseudonymous-session:${id}`, ...extra,
});
const rejectsCode = (promise, code) => assert.rejects(promise, error => error.code === code);
async function fixture(context, options = {}) {
  const root = await fs.mkdtemp(join(tmpdir(), 'rnr-audit-store-test-'));
  const directory = join(root, 'private-state');
  const stores = [];
  const open = async (extra = {}) => {
    const store = await createPreviewStore({ directory, config: config({ ...options, ...extra }) });
    stores.push(store);
    return store;
  };
  context.after(async () => {
    for (const store of stores) await store.close().catch(() => {});
    await fs.rm(root, { recursive: true, force: true });
  });
  return { root, directory, open, stateFile: join(directory, PREVIEW_STORE_FILES.state), lockFile: join(directory, PREVIEW_STORE_FILES.lock) };
}
async function finish(store, admitted, cost = 0) {
  const claim = await store.claim(admitted.job.id);
  assert.ok(claim);
  return store.complete(admitted.job.id, { version: 1, score: 71, limitations: ['Fictional fixture only.'] }, { leaseToken: claim.leaseToken, actualCostMicros: cost });
}
async function fail(store, admitted) {
  const claim = await store.claim(admitted.job.id);
  assert.ok(claim);
  return store.fail(admitted.job.id, 'Fictional fixture failure.', { leaseToken: claim.leaseToken });
}

test('preview state, cache, IP quota, and rate buckets survive a clean restart with private permissions', async context => {
  context.mock.timers.enable({ apis: ['Date'], now: START });
  const f = await fixture(context, { ipDaily: 1 });
  const first = await f.open({ resendApiKey: 'never-save-this-key', emailFrom: 'never-save@example.com' });
  const admitted = await first.submit(request(1));
  await finish(first, admitted);
  assert.equal((await first.consumeRate({ scope: 'status', key: 'pseudonym', limit: 1, windowMs: 60_000 })).allowed, true);
  await first.close();
  const raw = await fs.readFile(f.stateFile, 'utf8');
  assert.doesNotMatch(raw, /never-save|resendApiKey|emailFrom/);
  if (previewStorageCapabilities().posixPermissions) {
    assert.equal((await fs.stat(f.directory)).mode & 0o777, 0o700);
    assert.equal((await fs.stat(f.stateFile)).mode & 0o777, 0o600);
  }
  await assert.rejects(fs.stat(f.lockFile), { code: 'ENOENT' });
  const second = await f.open();
  const cached = await second.submit(request(1));
  assert.equal(cached.cached, true);
  assert.equal(cached.job.id, admitted.job.id);
  assert.equal((await second.read(admitted.job.id)).report.score, 71);
  await rejectsCode(second.submit(request(2, { ipHash: request(1).ipHash })), 'IP_QUOTA');
  assert.equal((await second.consumeRate({ scope: 'status', key: 'pseudonym', limit: 1, windowMs: 60_000 })).allowed, false);
  context.mock.timers.tick(DAY + 1);
  await second.close();
  const third = await f.open();
  const fresh = await third.submit(request(1));
  assert.equal(fresh.cached, false);
  assert.notEqual(fresh.job.id, admitted.job.id);
  assert.equal((await third.consumeRate({ scope: 'status', key: 'pseudonym', limit: 1, windowMs: 60_000 })).allowed, true);
});

test('daily and monthly reservations persist across restarts without any provider work', async context => {
  context.mock.timers.enable({ apis: ['Date'], now: START });
  const f = await fixture(context, { dailyBudgetMicros: 100, monthlyBudgetMicros: 200, maxScanCostMicros: 100 });
  const first = await f.open();
  await fail(first, await first.submit(request(1)));
  await first.close();
  const second = await f.open();
  await rejectsCode(second.submit(request(2)), 'DAILY_BUDGET');
  await second.close();
  context.mock.timers.tick(DAY);
  const third = await f.open();
  await fail(third, await third.submit(request(2)));
  await third.close();
  context.mock.timers.tick(DAY);
  const fourth = await f.open();
  await rejectsCode(fourth.submit(request(3)), 'MONTHLY_BUDGET');
});

test('concurrent duplicate submissions and claims serialize through durable writes', async context => {
  const f = await fixture(context, { dailyBudgetMicros: 100, maxScanCostMicros: 100 });
  const first = await f.open();
  const results = await Promise.all(Array.from({ length: 16 }, (_, id) => first.submit(request(id, { key: 'same-fixture' }))));
  assert.equal(new Set(results.map(result => result.job.id)).size, 1);
  assert.equal(results.filter(result => !result.deduplicated).length, 1);
  const claims = await Promise.all(Array.from({ length: 8 }, () => first.claimNext()));
  assert.equal(claims.filter(Boolean).length, 1);
  const snapshot = JSON.parse(await fs.readFile(f.stateFile, 'utf8'));
  assert.equal(Object.keys(snapshot.jobs).length, 1);
  assert.equal(Object.values(snapshot.daily)[0].reservedMicros, 100);
  assert.equal(Object.values(snapshot.jobs)[0].status, 'running');
  assert.deepEqual((await fs.readdir(f.directory)).sort(), [PREVIEW_STORE_FILES.lock, PREVIEW_STORE_FILES.state].sort());
});

test('exclusive local lock refuses a second instance and never steals a stale lock', async context => {
  const f = await fixture(context);
  const first = await f.open();
  if (previewStorageCapabilities().posixPermissions) assert.equal((await fs.stat(f.lockFile)).mode & 0o777, 0o600);
  await assert.rejects(f.open(), error => error.code === 'STORE_UNAVAILABLE' && /locked.*new private temporary directory.*never stolen/i.test(error.message));
  await first.close();
  const stale = JSON.stringify({ owner: 'stale-owner', pid: 99999999, version: 1 });
  await fs.writeFile(f.lockFile, stale, { mode: 0o600 });
  await rejectsCode(f.open(), 'STORE_UNAVAILABLE');
  assert.equal(await fs.readFile(f.lockFile, 'utf8'), stale);
});

test('close waits for admitted operations, rejects new work, and supports clean reopening', async context => {
  const f = await fixture(context);
  const first = await f.open();
  const admitted = [first.submit(request(1)), first.submit(request(2)), first.submit(request(3))];
  const closing = first.close();
  await rejectsCode(first.submit(request(4)), 'STORE_UNAVAILABLE');
  const results = await Promise.all(admitted);
  await closing;
  assert.equal(first.close(), closing);
  await rejectsCode(first.ping(), 'STORE_UNAVAILABLE');
  const second = await f.open();
  for (const result of results) assert.equal((await second.read(result.job.id)).status, 'queued');
});

test('corrupt, incompatible, and invalid persisted state are not automatically reset', async context => {
  const f = await fixture(context);
  const first = await f.open();
  await first.close();
  const valid = JSON.parse(await fs.readFile(f.stateFile, 'utf8'));
  for (const corrupt of ['{broken', '', JSON.stringify({ ...valid, version: 99 }), JSON.stringify({ ...valid, daily: { invalid: {} } }), JSON.stringify({ ...valid, credentials: 'unexpected-field' })]) {
    await fs.writeFile(f.stateFile, corrupt, { mode: 0o600 });
    await assert.rejects(f.open(), error => error.code === 'STORE_UNAVAILABLE' && /invalid.*not reset/i.test(error.message));
    assert.equal(await fs.readFile(f.stateFile, 'utf8'), corrupt);
    await assert.rejects(fs.stat(f.lockFile), { code: 'ENOENT' });
  }
});

test('atomic rename failure makes the instance unavailable and preserves the prior disk snapshot', async context => {
  const f = await fixture(context);
  const first = await f.open();
  const before = await fs.readFile(f.stateFile, 'utf8');
  const rename = context.mock.method(fs, 'rename', async () => { throw Object.assign(new Error('injected disk failure'), { code: 'EIO' }); });
  const firstAttempt = first.submit(request(1));
  const queuedAttempt = first.submit(request(2));
  await rejectsCode(firstAttempt, 'STORE_UNAVAILABLE');
  await rejectsCode(queuedAttempt, 'STORE_UNAVAILABLE');
  rename.mock.restore();
  await rejectsCode(first.ping(), 'STORE_UNAVAILABLE');
  assert.equal(await fs.readFile(f.stateFile, 'utf8'), before);
  assert.deepEqual((await fs.readdir(f.directory)).sort(), [PREVIEW_STORE_FILES.lock, PREVIEW_STORE_FILES.state].sort());
  await first.close();
  const second = await f.open();
  assert.equal((await second.submit(request(1))).deduplicated, false);
});

test('a directory-sync failure after rename is uncertain and disables further operations', { skip: !previewStorageCapabilities().directorySync }, async context => {
  const f = await fixture(context);
  const first = await f.open();
  const sample = await fs.open(f.stateFile, 'r');
  const prototype = Object.getPrototypeOf(sample);
  const original = prototype.sync;
  await sample.close();
  let calls = 0;
  const sync = context.mock.method(prototype, 'sync', function () {
    calls += 1;
    if (calls === 2) throw Object.assign(new Error('injected directory sync failure'), { code: 'EIO' });
    return original.call(this);
  });
  await rejectsCode(first.submit(request(1)), 'STORE_UNAVAILABLE');
  sync.mock.restore();
  await rejectsCode(first.ping(), 'STORE_UNAVAILABLE');
  assert.equal(Object.keys(JSON.parse(await fs.readFile(f.stateFile, 'utf8')).jobs).length, 1);
  await first.close();
  const second = await f.open();
  assert.equal((await second.submit(request(1))).deduplicated, true);
});

test('failed-job mutations followed by INVALID_COST remain durable across restart', async context => {
  const f = await fixture(context, { maxScanCostMicros: 100 });
  const first = await f.open();
  const admitted = await first.submit(request(1));
  const claim = await first.claim(admitted.job.id);
  await rejectsCode(first.complete(admitted.job.id, { score: 88 }, { leaseToken: claim.leaseToken, actualCostMicros: 101 }), 'INVALID_COST');
  await first.close();
  const second = await f.open();
  assert.equal((await second.read(admitted.job.id)).status, 'failed');
  const snapshot = JSON.parse(await fs.readFile(f.stateFile, 'utf8'));
  assert.equal(Object.values(snapshot.daily)[0].reservedMicros, 100);
});

test('opaque auxiliary reservations survive restart, including committed invalid-cost failure', async context => {
  const f = await fixture(context);
  const first = await f.open();
  assert.equal((await first.reserveAuxiliary({ id: 'opaque-delivery-one', maxCostMicros: 0 })).reserved, true);
  await rejectsCode(first.finishAuxiliary('opaque-delivery-one', { status: 'complete', actualCostMicros: 1 }), 'INVALID_COST');
  await first.close();
  const second = await f.open();
  const existing = await second.reserveAuxiliary({ id: 'opaque-delivery-one', maxCostMicros: 0 });
  assert.equal(existing.reserved, false);
  assert.equal(existing.status, 'failed');
  assert.equal((await second.reserveAuxiliary({ id: 'opaque-delivery-two', maxCostMicros: 0 })).reserved, true);
  assert.equal((await second.finishAuxiliary('opaque-delivery-two', { status: 'complete', actualCostMicros: 0 })).status, 'complete');
  assert.doesNotMatch(await fs.readFile(f.stateFile, 'utf8'), /opaque-delivery-one|opaque-delivery-two/);
});

test('close refuses to remove a replacement lock owned by another writer', async context => {
  const f = await fixture(context);
  const first = await f.open();
  await fs.unlink(f.lockFile);
  const replacement = JSON.stringify({ version: 1, owner: 'someone-else', pid: process.pid });
  await fs.writeFile(f.lockFile, replacement, { mode: 0o600 });
  await rejectsCode(first.close(), 'STORE_UNAVAILABLE');
  assert.equal(await fs.readFile(f.lockFile, 'utf8'), replacement);
});

test('local persistence refuses deployment markers and production config before creating files', async context => {
  const f = await fixture(context);
  for (const [key, value] of [
    ['NODE_ENV', 'production'], ['NETLIFY', 'true'], ['CONTEXT', 'deploy-preview'],
    ['AWS_LAMBDA_FUNCTION_NAME', 'function'], ['AWS_LAMBDA_RUNTIME_API', 'localhost:9001'], ['AWS_EXECUTION_ENV', 'AWS_Lambda_nodejs24.x'], ['LAMBDA_TASK_ROOT', '/var/task'],
  ]) {
    const previous = process.env[key];
    process.env[key] = value;
    try { await rejectsCode(f.open(), 'STORE_UNAVAILABLE'); }
    finally { if (previous === undefined) delete process.env[key]; else process.env[key] = previous; }
  }
  await rejectsCode(f.open({ production: true }), 'STORE_UNAVAILABLE');
  await rejectsCode(f.open({ environment: 'production' }), 'STORE_UNAVAILABLE');
  await assert.rejects(fs.stat(f.directory), { code: 'ENOENT' });
});

test('path guards refuse checkout paths, the shared temp root, and symlink destinations', async context => {
  const f = await fixture(context);
  for (const directory of ['relative/path', process.cwd(), tmpdir()]) await rejectsCode(createPreviewStore({ directory, config: config() }), 'STORE_UNAVAILABLE');
  // Windows symlink creation can require a separate OS privilege. Native file
  // persistence is still exercised there; this privilege is not bypassed.
  if (process.platform === 'win32') return;
  const actual = join(f.root, 'actual');
  const symbolic = join(f.root, 'symbolic');
  await fs.mkdir(actual, { mode: 0o700 });
  await fs.symlink(actual, symbolic);
  await rejectsCode(createPreviewStore({ directory: symbolic, config: config() }), 'STORE_UNAVAILABLE');
  await rejectsCode(createPreviewStore({ directory: join(symbolic, 'redirected-child'), config: config() }), 'STORE_UNAVAILABLE');
  assert.deepEqual(await fs.readdir(actual), []);
});

test('Windows policy uses inherited temp ACL and file durability without POSIX-only directory operations', () => {
  assert.deepEqual(previewStorageCapabilities('win32'), { posixPermissions: false, directorySync: false, noFollow: false, caseInsensitivePaths: true });
  for (const platform of ['linux', 'darwin']) assert.deepEqual(previewStorageCapabilities(platform), { posixPermissions: true, directorySync: true, noFollow: true, caseInsensitivePaths: false });
  assert.equal(Object.isFrozen(previewStorageCapabilities('win32')), true);
});

test('factory rejects Git repositories and worktree pointers under OS temp before writing any preview files', async context => {
  const f = await fixture(context);
  for (const kind of ['repository', 'worktree']) {
    const checkout = join(f.root, kind);
    await fs.mkdir(checkout, { mode: 0o700 });
    if (kind === 'repository') {
      await fs.mkdir(join(checkout, '.git'), { mode: 0o700 });
      await fs.writeFile(join(checkout, '.git', 'HEAD'), 'ref: refs/heads/main\n');
    } else {
      await fs.writeFile(join(checkout, '.git'), `gitdir: ${join(f.root, 'private-git-metadata')}\n`);
    }
    const before = await fs.readdir(checkout);
    for (const directory of [checkout, join(checkout, 'preview-data')]) {
      await assert.rejects(createPreviewStore({ directory, config: config() }), error => error.code === 'STORE_UNAVAILABLE' && /inside a Git checkout/.test(error.message));
    }
    assert.deepEqual(await fs.readdir(checkout), before);
    await assert.rejects(fs.stat(join(checkout, 'preview-data')), { code: 'ENOENT' });
    for (const file of Object.values(PREVIEW_STORE_FILES)) await assert.rejects(fs.stat(join(checkout, file)), { code: 'ENOENT' });
  }
});

test('an empty sandbox Git stub does not block a private temporary directory', async context => {
  const f = await fixture(context);
  await fs.mkdir(join(f.root, '.git'), { mode: 0o700 });
  const store = await f.open();
  assert.equal(await store.ping(), true);
  await store.close();
  assert.deepEqual(await fs.readdir(join(f.root, '.git')), []);
});
