import pg from 'pg';
import { loadConfig } from './config.mjs';
import { PostgresAuditStore } from './store.mjs';
import { scanWebsite } from './scanner.mjs';
import { deliverReport } from './delivery.mjs';
import { createAuditHandlers, createDispatcher } from './handlers.mjs';

let runtime;
export function getRuntime() {
  if (runtime) return runtime;
  const config = loadConfig();
  let store;
  if (config.enabled) {
    const connection = new URL(config.databaseUrl);
    if (!['postgres:', 'postgresql:'].includes(connection.protocol)) throw new Error('Invalid audit database configuration.');
    // Strip DSN TLS options so they cannot weaken certificate verification.
    for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) connection.searchParams.delete(key);
    const pool = new pg.Pool({
      connectionString: connection.href, ssl: { rejectUnauthorized: true },
      max: 2, connectionTimeoutMillis: 3000, idleTimeoutMillis: 10000,
      query_timeout: 5000, statement_timeout: 4000, lock_timeout: 3000,
      application_name: 'rnr-website-audit',
    });
    pool.on('error', () => { /* Each operation fails closed; never log credentials. */ });
    store = new PostgresAuditStore({ pool, config });
  }
  runtime = createAuditHandlers({ config, store, scan: scanWebsite, deliver: deliverReport, dispatch: config.enabled ? createDispatcher(config) : undefined });
  return runtime;
}
