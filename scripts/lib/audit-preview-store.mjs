import fs from 'node:fs/promises';
import { constants } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { AuditStoreError, MemoryAuditStore } from '../../netlify/functions/lib/audit/store.mjs';

export const PREVIEW_STORE_FILES = Object.freeze({ state: 'audit-state.json', lock: '.audit-preview.lock' });
// Windows relies on the existing private user-temp ACL. Node's POSIX modes and
// directory fsync are not Windows security/durability primitives. File sync and
// atomic replacement remain mandatory on every platform; failures are not bypassed.
export function previewStorageCapabilities(platform = process.platform) {
  return Object.freeze({ posixPermissions: platform !== 'win32', directorySync: platform !== 'win32', noFollow: platform !== 'win32', caseInsensitivePaths: platform === 'win32' });
}
const MAX_STATE_BYTES = 24 * 1024 * 1024;
const METHODS = ['ping', 'submit', 'read', 'claim', 'claimNext', 'complete', 'fail', 'consumeRate', 'reserveAuxiliary', 'finishAuxiliary'];
const STATE_KEYS = ['auxiliary', 'daily', 'jobs', 'monthly', 'rates', 'version'];
const unavailable = message => new AuditStoreError('STORE_UNAVAILABLE', message);
const storageFailure = () => unavailable('Preview persistence failed. Stop this preview and restart with a new private temporary directory. Further audit work is disabled.');
const corruptState = () => unavailable('Persisted preview state is invalid and was not reset. Restore a known-good snapshot or restart with a new private temporary directory.');

function requireLocal(config) {
  const markers = ['NETLIFY', 'CONTEXT', 'AWS_LAMBDA_FUNCTION_NAME', 'AWS_LAMBDA_RUNTIME_API', 'LAMBDA_TASK_ROOT'];
  if (process.env.NODE_ENV === 'production' || markers.some(key => process.env[key] !== undefined)
    || /AWS_Lambda/i.test(process.env.AWS_EXECUTION_ENV ?? '') || config?.production === true || config?.environment === 'production') {
    throw unavailable('Disk-backed audit preview storage is local-only and forbidden in production, Netlify, or AWS Lambda.');
  }
}

function privateTempPath(directory) {
  if (typeof directory !== 'string' || !isAbsolute(directory) || directory.includes('\0')) throw unavailable('Use a dedicated absolute directory inside the OS temporary directory for local preview storage.');
  const path = resolve(directory);
  const inside = relative(resolve(tmpdir()), path);
  if (!inside || inside.startsWith('..') || isAbsolute(inside)) throw unavailable('Use a dedicated directory inside the OS temporary directory, outside the checkout.');
  return path;
}

function ownedFile(stat, capabilities) {
  return stat.isFile() && stat.nlink === 1 && (!capabilities.posixPermissions || typeof process.getuid !== 'function' || stat.uid === process.getuid());
}

const identifiable = stat => Number.isSafeInteger(stat?.ino) && stat.ino > 0 && Number.isSafeInteger(stat.dev);
const sameIdentity = (first, second) => !identifiable(first) || !identifiable(second) || (first.dev === second.dev && first.ino === second.ino);

async function refuseGitCheckout(path) {
  const reject = () => unavailable('Preview storage cannot be inside a Git checkout. Use a new private temporary directory outside every checkout.');
  for (let ancestor = path; ; ancestor = dirname(ancestor)) {
    const marker = join(ancestor, '.git');
    let stat;
    try { stat = await fs.stat(marker); }
    catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error; }
    if (stat?.isDirectory()) {
      // An empty sandbox .git stub is not a checkout. HEAD distinguishes an
      // actual repository without blindly exempting any particular ancestor.
      try { if ((await fs.stat(join(marker, 'HEAD'))).isFile()) throw reject(); }
      catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error; }
    } else if (stat?.isFile()) {
      if (stat.size > 8192) throw reject();
      if (/^gitdir:\s*\S[^\r\n]*(?:\r?\n)?$/.test(await fs.readFile(marker, 'utf8'))) throw reject();
    }
    if (dirname(ancestor) === ancestor) return;
  }
}

/**
 * One local process owns one private temporary directory. This is a development
 * fixture adapter, never distributed storage or a PostgreSQL fallback. Only the
 * memory store's public audit findings and pseudonymous control state are saved;
 * runtime configuration, delivery recipients and credentials are not serialized.
 */
export async function createPreviewStore({ directory, config } = {}) {
  requireLocal(config);
  const capabilities = previewStorageCapabilities();
  const path = privateTempPath(directory);
  // Validate policy before touching disk; MemoryAuditStore enforces the approved
  // scan ceilings and rejects production configuration itself as well.
  const memory = new MemoryAuditStore({ config });
  const statePath = join(path, PREVIEW_STORE_FILES.state);
  const lockPath = join(path, PREVIEW_STORE_FILES.lock);
  const owner = randomUUID();
  let directoryHandle;
  let lockHandle;
  let lockIdentity;
  let directoryIdentity;
  let canonicalDirectory;
  let failed;
  let closed = false;
  let closing = false;
  let closePromise;
  let pending = Promise.resolve();
  const readFlags = constants.O_RDONLY | (capabilities.noFollow ? constants.O_NOFOLLOW : 0);
  const samePath = (first, second) => capabilities.caseInsensitivePaths ? first.toLowerCase() === second.toLowerCase() : first === second;
  const syncDirectory = () => capabilities.directorySync ? directoryHandle.sync() : Promise.resolve();

  async function requireOwnedLock() {
    const currentDirectory = await fs.lstat(path);
    if (!currentDirectory.isDirectory() || currentDirectory.isSymbolicLink() || !sameIdentity(currentDirectory, directoryIdentity) || !samePath(await fs.realpath(path), canonicalDirectory)) throw storageFailure();
    let observed;
    try {
      const before = await fs.lstat(lockPath);
      if (!ownedFile(before, capabilities) || !sameIdentity(before, lockIdentity) || before.size > 4096) throw storageFailure();
      observed = await fs.open(lockPath, readFlags);
      const stat = await observed.stat();
      if (!ownedFile(stat, capabilities) || !sameIdentity(stat, before) || !sameIdentity(stat, lockIdentity) || stat.size > 4096) throw storageFailure();
      const content = JSON.parse(await observed.readFile('utf8'));
      // Windows can report zero or nonportable inode/device IDs. The private
      // random token is always checked; metadata is an additional check when usable.
      if (content.owner !== owner || content.pid !== process.pid || content.version !== 1) throw storageFailure();
    } finally { await observed?.close().catch(() => {}); }
  }

  async function releaseLock() {
    if (!lockHandle) return;
    try {
      await requireOwnedLock();
      await lockHandle.close();
      lockHandle = undefined;
      await fs.unlink(lockPath);
      await syncDirectory();
    } catch (error) {
      if (error.code !== 'ENOENT') throw storageFailure();
    } finally {
      await lockHandle?.close().catch(() => {});
      lockHandle = undefined;
    }
  }

  async function persist() {
    await requireOwnedLock();
    const serialized = JSON.stringify(memory.state);
    if (Buffer.byteLength(serialized) > MAX_STATE_BYTES) throw storageFailure();
    const temporary = join(path, `.audit-state-${owner}-${randomUUID()}.tmp`);
    let handle;
    try {
      handle = await fs.open(temporary, 'wx', 0o600);
      if (capabilities.posixPermissions) await handle.chmod(0o600);
      await handle.writeFile(serialized, 'utf8');
      await handle.sync();
      await handle.close();
      handle = undefined;
      await fs.rename(temporary, statePath);
      await syncDirectory();
    } finally {
      await handle?.close().catch(() => {});
      await fs.unlink(temporary).catch(() => {});
    }
  }

  try {
    const expected = resolve(await fs.realpath(tmpdir()), relative(resolve(tmpdir()), path));
    // Check the existing parent before mkdir, so an interior symlink cannot
    // redirect even the initial directory creation outside its intended location.
    if (!samePath(await fs.realpath(dirname(path)), dirname(expected))) throw storageFailure();
    await refuseGitCheckout(expected);
    try { await fs.mkdir(path, { mode: 0o700 }); } catch (error) { if (error.code !== 'EEXIST') throw error; }
    const directoryStat = await fs.lstat(path);
    // Allow an OS temp root's normal canonical alias (e.g. macOS /var), while
    // refusing symlink/junction redirection anywhere underneath that root.
    canonicalDirectory = await fs.realpath(path);
    if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink() || (capabilities.posixPermissions && typeof process.getuid === 'function' && directoryStat.uid !== process.getuid()) || !samePath(canonicalDirectory, expected)) throw storageFailure();
    directoryIdentity = directoryStat;
    if (capabilities.posixPermissions) await fs.chmod(path, 0o700);
    if (capabilities.directorySync) directoryHandle = await fs.open(path, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
    try { lockHandle = await fs.open(lockPath, 'wx', 0o600); }
    catch (error) {
      if (error.code === 'EEXIST') throw unavailable('Preview storage is locked. Stop the other preview cleanly, or restart with a new private temporary directory. Stale locks are never stolen or removed automatically.');
      throw error;
    }
    lockIdentity = await lockHandle.stat();
    if (capabilities.posixPermissions) await lockHandle.chmod(0o600);
    await lockHandle.writeFile(JSON.stringify({ version: 1, owner, pid: process.pid }), 'utf8');
    await lockHandle.sync();
    await syncDirectory();

    let snapshot;
    try {
      const before = await fs.lstat(statePath);
      if (!ownedFile(before, capabilities)) throw corruptState();
      snapshot = await fs.open(statePath, readFlags);
      const stat = await snapshot.stat();
      if (!ownedFile(stat, capabilities) || !sameIdentity(stat, before) || stat.size > MAX_STATE_BYTES || stat.size === 0) throw corruptState();
      memory.state = JSON.parse(await snapshot.readFile('utf8'));
      if (!memory.state || typeof memory.state !== 'object' || Object.keys(memory.state).sort().join(',') !== STATE_KEYS.join(',')) throw corruptState();
      if (capabilities.posixPermissions) await snapshot.chmod(0o600);
    } catch (error) {
      if (error.code !== 'ENOENT') throw corruptState();
    } finally { await snapshot?.close().catch(() => {}); }
    try { await memory.ping(); } catch { throw corruptState(); }
    await persist();
  } catch (error) {
    try { await releaseLock(); } catch { /* Never remove a replacement lock. */ }
    await directoryHandle?.close().catch(() => {});
    if (error instanceof AuditStoreError) throw error;
    throw storageFailure();
  }

  function invoke(method, args) {
    if (closing || closed || failed) return Promise.reject(failed ?? unavailable('Preview storage is closed. Restart the local preview before submitting work.'));
    const execute = async () => {
      if (failed) throw failed;
      let result;
      let operationError;
      try { result = await memory[method](...args); } catch (error) { operationError = error; }
      try {
        // A method can commit a failed job before throwing INVALID_COST. Save
        // its resulting state even on rejection, then preserve the original error.
        await persist();
      } catch {
        failed = storageFailure();
        throw failed;
      }
      if (operationError) throw operationError;
      return result;
    };
    const operation = pending.then(execute);
    pending = operation.catch(() => {});
    return operation;
  }

  function close() {
    if (closePromise) return closePromise;
    closing = true;
    closePromise = (async () => {
      await pending;
      let closeError;
      if (!failed) {
        try { await persist(); } catch { failed = storageFailure(); closeError = failed; }
      }
      try { await releaseLock(); } catch (error) { closeError ??= error; }
      finally {
        closed = true;
        await directoryHandle?.close().catch(() => {});
      }
      if (closeError) throw closeError;
    })();
    return closePromise;
  }

  return Object.freeze(Object.fromEntries([...METHODS.map(method => [method, (...args) => invoke(method, args)]), ['close', close]]));
}
