#!/usr/bin/env node
// Opt-in, disposable local fixture. Normal npm test never starts Docker.
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { chmod, lstat, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import pg from 'pg';

const IMAGE = 'postgres:17-alpine';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCKER_HOST = '--host=unix:///var/run/docker.sock';
const dockerEnvironment = { ...process.env };
for (const key of ['DOCKER_HOST', 'DOCKER_CONTEXT', 'DOCKER_TLS', 'DOCKER_TLS_VERIFY', 'DOCKER_CERT_PATH']) delete dockerEnvironment[key];

// Never accept a connection URL, remote host, existing fixture, or image override.
if (process.argv.length !== 2) throw new Error('Usage: node scripts/audit-test-postgres.mjs');
for (const key of ['DATABASE_URL', 'AUDIT_DATABASE_URL', 'PGHOST', 'PGHOSTADDR', 'PGDATABASE', 'PGUSER', 'PGPORT', 'PGPASSWORD', 'PGSERVICE', 'PGSERVICEFILE', 'PGPASSFILE', 'PGOPTIONS', 'RNR_AUDIT_PG_FIXTURE', 'RNR_AUDIT_PG_NONCE']) {
  if (process.env[key]) throw new Error(`Refusing external database or fixture configuration: ${key}.`);
}

function command(file, args, { env = process.env, inherit = false, timeoutMs = 120_000 } = {}) {
  return new Promise((accept, reject) => {
    const child = spawn(file, args, { cwd: ROOT, env, stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let overflow = false;
    const collect = (existing, chunk) => {
      const result = existing + chunk.toString();
      if (result.length > 1_048_576) { overflow = true; child.kill('SIGTERM'); }
      return result.slice(-1_048_576);
    };
    child.stdout?.on('data', (chunk) => { stdout = collect(stdout, chunk); });
    child.stderr?.on('data', (chunk) => { stderr = collect(stderr, chunk); });
    const timeout = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.once('error', (cause) => { clearTimeout(timeout); reject(cause); });
    child.once('close', (code, signal) => {
      clearTimeout(timeout);
      if (code === 0 && !overflow) accept({ stdout: stdout.trim(), stderr: stderr.trim() });
      else reject(new Error(`${file} ${args[0] ?? ''} failed (${signal ?? code}): ${(stderr || stdout).trim().slice(-8000)}`));
    });
  });
}

const docker = (args, options = {}) => command('docker', [DOCKER_HOST, ...args], { ...options, env: dockerEnvironment });

let directory;
let containerName;
let containerId;
let fixtureNonce;
let childTests;
let cleanupPromise;

async function cleanup() {
  if (cleanupPromise) return cleanupPromise;
  cleanupPromise = (async () => {
    let cleanupFailure;
    if (containerName) {
      try {
        // A failed run response can still mean Docker created the container.
        // Inspect our unique name and label before removing only this fixture.
        let inspected;
        try { inspected = JSON.parse((await docker(['inspect', containerName], { timeoutMs: 5000 })).stdout)[0]; }
        catch (cause) {
          if (!/No such (object|container)/i.test(cause.message)) throw cause;
        }
        if (inspected) {
          if (inspected.Config.Labels?.['audit.fixture'] !== fixtureNonce || (containerId && inspected.Id !== containerId)) throw new Error('Refusing to remove a container with an unexpected fixture identity.');
          await docker(['rm', '--force', '--volumes', inspected.Id], { timeoutMs: 20_000 });
        }
      } catch (cause) { cleanupFailure = cause; }
    }
    if (directory) {
      try { await rm(directory, { recursive: true, force: true }); }
      catch (cause) { cleanupFailure ??= cause; }
    }
    if (cleanupFailure) throw new Error(`Disposable PostgreSQL cleanup failed: ${cleanupFailure.message}`);
  })();
  return cleanupPromise;
}

for (const [signal, status] of [['SIGINT', 130], ['SIGTERM', 143]]) {
  process.once(signal, () => {
    childTests?.kill('SIGTERM');
    cleanup().then(() => process.exit(status), (cause) => { console.error(cause.message); process.exit(1); });
  });
}

try {
  await docker(['info', '--format', '{{.ServerVersion}}']);
  try { await docker(['image', 'inspect', IMAGE]); }
  catch {
    console.log(`Pulling ${IMAGE} through the configured Docker daemon proxy.`);
    await docker(['pull', IMAGE], { inherit: true, timeoutMs: 180_000 });
  }
  const inspectedImage = JSON.parse((await docker(['image', 'inspect', IMAGE])).stdout)[0];
  directory = await mkdtemp('/tmp/rnr-audit-pg-');
  await chmod(directory, 0o700);
  const socketDir = join(directory, 'socket');
  await mkdir(socketDir, { mode: 0o777 });
  // Different container UID; the private 0700 parent restricts host traversal.
  await chmod(socketDir, 0o777);
  const nonce = randomUUID();
  fixtureNonce = nonce;
  containerName = `rnr-audit-pg-${nonce}`;
  const start = await docker([
    'run', '--detach', '--name', containerName, '--label', `audit.fixture=${nonce}`,
    '--network', 'none', '--read-only', '--user', 'postgres', '--cap-drop', 'ALL',
    '--security-opt', 'no-new-privileges', '--pids-limit', '64', '--memory', '512m', '--cpus', '1',
    '--tmpfs', '/var/lib/postgresql/data:rw,nosuid,noexec,size=512m,mode=1777',
    '--tmpfs', '/tmp:rw,nosuid,noexec,size=16m,mode=1777',
    '--mount', `type=bind,src=${socketDir},dst=/audit-socket`,
    '--entrypoint', '/bin/sh', IMAGE, '-ec',
    'initdb -D /var/lib/postgresql/data/pgdata --username=postgres --auth-local=trust --auth-host=reject --no-instructions >/tmp/audit-initdb.log; exec postgres -D /var/lib/postgresql/data/pgdata -c listen_addresses= -c unix_socket_directories=/audit-socket -c unix_socket_permissions=0777 -c max_connections=20 -c shared_buffers=16MB -c max_wal_size=64MB -c min_wal_size=32MB -c idle_in_transaction_session_timeout=5000 -c statement_timeout=4000 -c lock_timeout=2000',
  ]);
  containerId = start.stdout;
  if (!/^[a-f0-9]{64}$/.test(containerId)) throw new Error('Docker did not return a disposable container ID.');
  const fixture = { version: 1, nonce, ownerPid: process.pid, socketDir, containerName, containerId, image: IMAGE, imageDigest: inspectedImage.RepoDigests?.[0] ?? inspectedImage.Id };
  const fixturePath = join(directory, 'fixture.json');
  await writeFile(fixturePath, JSON.stringify(fixture), { mode: 0o600, flag: 'wx' });

  const connection = { host: socketDir, database: 'postgres', user: 'postgres', password: '', port: 5432, ssl: false, connectionTimeoutMillis: 1000, query_timeout: 2000, max: 1 };
  const deadline = Date.now() + 60_000;
  let ready = false;
  while (Date.now() < deadline) {
    const pool = new pg.Pool(connection);
    pool.on('error', () => {});
    try {
      await pool.query('SELECT 1');
      const socket = await lstat(join(socketDir, '.s.PGSQL.5432'));
      if (!socket.isSocket()) throw new Error('Fixture did not create a Unix socket.');
      ready = true;
      break;
    } catch { await delay(250); }
    finally { await pool.end(); }
  }
  if (!ready) {
    const logs = await docker(['logs', '--tail', '30', containerId]);
    throw new Error(`Disposable PostgreSQL did not become ready: ${logs.stderr || logs.stdout}`);
  }

  const isolation = JSON.parse((await docker(['inspect', containerId])).stdout)[0];
  if (isolation.HostConfig.NetworkMode !== 'none' || Object.keys(isolation.HostConfig.PortBindings ?? {}).length !== 0 || isolation.Config.Labels?.['audit.fixture'] !== nonce) throw new Error('Disposable database isolation check failed.');
  console.log(`Local PostgreSQL fixture ready (${fixture.imageDigest}); private Unix socket, no network, tmpfs data.`);
  const childEnvironment = { ...process.env, RNR_AUDIT_PG_FIXTURE: fixturePath, RNR_AUDIT_PG_NONCE: nonce };
  for (const key of Object.keys(childEnvironment)) if (key.startsWith('PG')) delete childEnvironment[key];
  await new Promise((accept, reject) => {
    childTests = spawn(process.execPath, ['--test', '--test-isolation=none', 'tests/audit-postgres.integration.test.mjs'], { cwd: ROOT, env: childEnvironment, stdio: 'inherit' });
    const deadlineTimer = setTimeout(() => childTests.kill('SIGTERM'), 180_000);
    childTests.once('error', (cause) => { clearTimeout(deadlineTimer); reject(cause); });
    childTests.once('close', (code, signal) => {
      clearTimeout(deadlineTimer);
      if (code === 0) accept();
      else reject(new Error(`PostgreSQL integration tests failed (${signal ?? code}).`));
    });
  });
} catch (cause) {
  console.error(cause.message);
  process.exitCode = 1;
} finally {
  try {
    await cleanup();
    console.log('Disposable PostgreSQL container and task directory removed.');
  } catch (cause) {
    console.error(cause.message);
    process.exitCode = 1;
  }
}
