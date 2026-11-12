-- Apply manually with live audit writers disabled. The application never creates
-- or repairs production tables. This transaction preserves a known private v1
-- ledger; ambiguous or unsupported layouts must be reconciled by an operator.
BEGIN;

CREATE SCHEMA IF NOT EXISTS rnr_audit;

DO $migration$
DECLARE
  fresh boolean := to_regclass('rnr_audit.audit_control_state') IS NULL;
  ledger_version integer;
  ledger jsonb;
  record_count bigint;
  entry record;
  counter record;
  value_number numeric;
BEGIN
  -- A new empty ledger beside an older public ledger would reset spend limits.
  IF to_regclass('public.audit_control_state') IS NOT NULL THEN
    RAISE EXCEPTION 'Legacy public audit ledger exists. Preserve and move it into rnr_audit before applying this migration; never reset its counters.';
  END IF;

  IF fresh AND (
    to_regclass('rnr_audit.audit_reports') IS NOT NULL
    OR to_regclass('rnr_audit.audit_rate_buckets') IS NOT NULL
    OR to_regclass('rnr_audit.audit_rate_control') IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Audit control ledger is missing beside existing normalized tables; refusing to seed an empty budget ledger.';
  END IF;

  IF fresh THEN
    CREATE TABLE rnr_audit.audit_control_state (
      id smallint PRIMARY KEY CHECK (id = 1),
      schema_version integer NOT NULL CONSTRAINT audit_control_state_schema_version_check CHECK (schema_version = 2),
      state jsonb NOT NULL CHECK (jsonb_typeof(state) = 'object'),
      updated_at timestamptz NOT NULL DEFAULT NOW()
    );
    INSERT INTO rnr_audit.audit_control_state (id, schema_version, state)
    VALUES (1, 2, '{"version":1,"jobs":{},"daily":{},"monthly":{},"rates":{},"auxiliary":{}}'::jsonb);
  END IF;

  -- Take the strongest lock first, avoiding a later lock upgrade while an old
  -- application is waiting on the singleton row. The migration is all-or-none.
  LOCK TABLE rnr_audit.audit_control_state IN ACCESS EXCLUSIVE MODE;
  SELECT count(*) INTO record_count FROM rnr_audit.audit_control_state;
  IF record_count <> 1 THEN
    RAISE EXCEPTION 'Audit ledger must contain exactly one existing singleton; refusing to seed or reset an incomplete ledger.';
  END IF;
  SELECT schema_version, state INTO ledger_version, ledger
  FROM rnr_audit.audit_control_state WHERE id = 1 FOR UPDATE;
  IF NOT FOUND OR ledger_version NOT IN (1, 2) OR ledger_version IS NULL THEN
    RAISE EXCEPTION 'Unsupported audit ledger schema version; an explicit preservation migration is required.';
  END IF;
  IF ledger->'version' IS DISTINCT FROM '1'::jsonb
     OR jsonb_typeof(ledger->'jobs') IS DISTINCT FROM 'object'
     OR jsonb_typeof(ledger->'daily') IS DISTINCT FROM 'object'
     OR jsonb_typeof(ledger->'monthly') IS DISTINCT FROM 'object'
     OR jsonb_typeof(ledger->'rates') IS DISTINCT FROM 'object'
     OR jsonb_typeof(ledger->'auxiliary') IS DISTINCT FROM 'object'
     OR ledger - ARRAY['version','jobs','daily','monthly','rates','auxiliary'] <> '{}'::jsonb THEN
    RAISE EXCEPTION 'Malformed or unsupported audit ledger layout; refusing to reset or discard its state.';
  END IF;
  IF (SELECT count(*) FROM jsonb_each(ledger->'jobs')) > 256
     OR (SELECT count(*) FROM jsonb_each(ledger->'rates')) > 4096
     OR (SELECT count(*) FROM jsonb_each(ledger->'auxiliary')) > 4096 THEN
    RAISE EXCEPTION 'Audit ledger exceeds supported retention or rate limits; preserve and reconcile it before migration.';
  END IF;

  -- Reject malformed budget/quota values rather than coercing them to zero.
  FOR entry IN SELECT key, value FROM jsonb_each(ledger->'daily') LOOP
    IF entry.key !~ '^\d{4}-\d{2}-\d{2}$'
       OR jsonb_typeof(entry.value) IS DISTINCT FROM 'object'
       OR jsonb_typeof(entry.value->'ips') IS DISTINCT FROM 'object'
       OR jsonb_typeof(entry.value->'sessions') IS DISTINCT FROM 'object' THEN
      RAISE EXCEPTION 'Malformed daily audit counters; refusing to reset reservations.';
    END IF;
    FOR counter IN SELECT value FROM jsonb_each(entry.value) WHERE key IN ('global', 'reservedMicros') LOOP
      IF jsonb_typeof(counter.value) IS DISTINCT FROM 'number' THEN
        RAISE EXCEPTION 'Malformed daily audit counter.';
      END IF;
      value_number := counter.value::text::numeric;
      IF value_number < 0 OR value_number > 9007199254740991 OR trunc(value_number) <> value_number THEN
        RAISE EXCEPTION 'Invalid daily audit counter.';
      END IF;
    END LOOP;
    IF NOT (entry.value ? 'global' AND entry.value ? 'reservedMicros') THEN
      RAISE EXCEPTION 'Missing daily audit counter; refusing to infer prior usage.';
    END IF;
    FOR counter IN
      SELECT value FROM jsonb_each(entry.value->'ips')
      UNION ALL SELECT value FROM jsonb_each(entry.value->'sessions')
    LOOP
      IF jsonb_typeof(counter.value) IS DISTINCT FROM 'number' THEN
        RAISE EXCEPTION 'Malformed IP or session audit quota.';
      END IF;
      value_number := counter.value::text::numeric;
      IF value_number < 0 OR value_number > 9007199254740991 OR trunc(value_number) <> value_number THEN
        RAISE EXCEPTION 'Invalid IP or session audit quota.';
      END IF;
    END LOOP;
  END LOOP;
  FOR entry IN SELECT key, value FROM jsonb_each(ledger->'monthly') LOOP
    IF entry.key !~ '^\d{4}-\d{2}$' OR jsonb_typeof(entry.value->'reservedMicros') IS DISTINCT FROM 'number' THEN
      RAISE EXCEPTION 'Malformed monthly audit reservation.';
    END IF;
    value_number := (entry.value->>'reservedMicros')::numeric;
    IF value_number < 0 OR value_number > 9007199254740991 OR trunc(value_number) <> value_number THEN
      RAISE EXCEPTION 'Invalid monthly audit reservation.';
    END IF;
  END LOOP;
  FOR entry IN SELECT key, value FROM jsonb_each(ledger->'jobs') LOOP
    IF jsonb_typeof(entry.value) IS DISTINCT FROM 'object'
       OR jsonb_typeof(entry.value->'id') IS DISTINCT FROM 'string'
       OR entry.value->>'id' <> entry.key
       OR length(entry.key) NOT BETWEEN 1 AND 512
       OR coalesce(entry.value->>'status', '') NOT IN ('queued','running','complete','failed') THEN
      RAISE EXCEPTION 'Malformed persisted audit job; preserve and reconcile it before migration.';
    END IF;
    IF ledger_version = 1 AND entry.value->>'status' = 'complete' AND NOT entry.value ? 'report' THEN
      RAISE EXCEPTION 'Completed v1 audit job is missing its report; refusing an incomplete migration.';
    END IF;
    IF ledger_version = 2 AND entry.value ? 'report' THEN
      RAISE EXCEPTION 'Version 2 audit ledger contains an inline report; refusing an unsupported mixed layout.';
    END IF;
  END LOOP;

  -- A v2 ledger missing its external tables is not a new database. Recreating
  -- empty stores could lose cached reports or reset request counters.
  IF NOT fresh AND ledger_version = 2 AND (
    to_regclass('rnr_audit.audit_reports') IS NULL
    OR to_regclass('rnr_audit.audit_rate_buckets') IS NULL
    OR to_regclass('rnr_audit.audit_rate_control') IS NULL
  ) THEN
    RAISE EXCEPTION 'Normalized audit tables are missing; refusing to recreate empty stores beside an existing ledger.';
  END IF;

  CREATE TABLE IF NOT EXISTS rnr_audit.audit_reports (
    job_id text PRIMARY KEY CHECK (length(job_id) BETWEEN 1 AND 512),
    -- JSON null/scalars remain valid, matching the original store contract.
    -- JSONB text adds whitespace; the application enforces 64 KiB compact JSON.
    report jsonb NOT NULL CHECK (octet_length(report::text) <= 131072)
  );
  CREATE TABLE IF NOT EXISTS rnr_audit.audit_rate_buckets (
    bucket_key text PRIMARY KEY CHECK (bucket_key ~ '^[a-f0-9]{64}$'),
    count bigint NOT NULL CHECK (count BETWEEN 0 AND 9007199254740991),
    reset_at bigint NOT NULL CHECK (reset_at BETWEEN 0 AND 9007199254740991),
    rate_limit bigint NOT NULL CHECK (rate_limit BETWEEN 1 AND 9007199254740991),
    window_ms bigint NOT NULL CHECK (window_ms BETWEEN 1 AND 86400000)
  );
  CREATE INDEX IF NOT EXISTS audit_rate_buckets_reset_at_idx
    ON rnr_audit.audit_rate_buckets (reset_at);
  CREATE TABLE IF NOT EXISTS rnr_audit.audit_rate_control (
    id smallint PRIMARY KEY CHECK (id = 1)
  );

  IF ledger_version = 1 THEN
    IF EXISTS (SELECT 1 FROM rnr_audit.audit_reports)
       OR EXISTS (SELECT 1 FROM rnr_audit.audit_rate_buckets) THEN
      RAISE EXCEPTION 'Version 1 ledger has nonempty external stores; reconcile this ambiguous layout before migration.';
    END IF;
    INSERT INTO rnr_audit.audit_reports (job_id, report)
    SELECT key, value->'report' FROM jsonb_each(ledger->'jobs') WHERE value ? 'report';

    -- Cast failures and table CHECK violations abort the entire transaction.
    -- No malformed bucket is discarded to create a fresh allowance.
    FOR entry IN SELECT key, value FROM jsonb_each(ledger->'rates') LOOP
      IF entry.key !~ '^[a-f0-9]{64}$'
         OR jsonb_typeof(entry.value) IS DISTINCT FROM 'object'
         OR jsonb_typeof(entry.value->'count') IS DISTINCT FROM 'number'
         OR jsonb_typeof(entry.value->'resetAt') IS DISTINCT FROM 'number'
         OR jsonb_typeof(entry.value->'limit') IS DISTINCT FROM 'number'
         OR jsonb_typeof(entry.value->'windowMs') IS DISTINCT FROM 'number' THEN
        RAISE EXCEPTION 'Malformed legacy audit rate bucket; refusing to discard its prior usage.';
      END IF;
      FOR counter IN SELECT value FROM jsonb_each(entry.value) WHERE key IN ('count','resetAt','limit','windowMs') LOOP
        value_number := counter.value::text::numeric;
        IF value_number < 0 OR value_number > 9007199254740991 OR trunc(value_number) <> value_number THEN
          RAISE EXCEPTION 'Invalid legacy audit rate bucket; refusing to infer prior usage.';
        END IF;
      END LOOP;
    END LOOP;
    INSERT INTO rnr_audit.audit_rate_buckets (bucket_key, count, reset_at, rate_limit, window_ms)
    SELECT key, (value->>'count')::bigint, (value->>'resetAt')::bigint,
      (value->>'limit')::bigint, (value->>'windowMs')::bigint
    FROM jsonb_each(ledger->'rates');

    ledger := jsonb_set(ledger, '{jobs}', coalesce((
      SELECT jsonb_object_agg(key, value - 'report') FROM jsonb_each(ledger->'jobs')
    ), '{}'::jsonb));
    ledger := jsonb_set(ledger, '{rates}', '{}'::jsonb);
    ALTER TABLE rnr_audit.audit_control_state
      DROP CONSTRAINT IF EXISTS audit_control_state_schema_version_check;
    UPDATE rnr_audit.audit_control_state
      SET schema_version = 2, state = ledger, updated_at = NOW() WHERE id = 1;
    ALTER TABLE rnr_audit.audit_control_state
      ADD CONSTRAINT audit_control_state_schema_version_check CHECK (schema_version = 2);
  ELSIF ledger->'rates' <> '{}'::jsonb THEN
    RAISE EXCEPTION 'Version 2 audit ledger contains inline rate buckets; refusing an unsupported mixed layout.';
  END IF;

  IF fresh OR ledger_version = 1 THEN
    INSERT INTO rnr_audit.audit_rate_control (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
  END IF;
  IF (SELECT count(*) FROM rnr_audit.audit_rate_control) <> 1
     OR NOT EXISTS (SELECT 1 FROM rnr_audit.audit_rate_control WHERE id = 1) THEN
    RAISE EXCEPTION 'Rate admission mutex is missing or malformed; refusing to reset its store.';
  END IF;
  IF (SELECT count(*) FROM rnr_audit.audit_rate_buckets) > 4096 THEN
    RAISE EXCEPTION 'Rate bucket store exceeds its cardinality ceiling; reconcile it before migration.';
  END IF;
END;
$migration$;

REVOKE ALL ON SCHEMA rnr_audit FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA rnr_audit FROM PUBLIC;

-- Existing Supabase API roles must not expose the internal control plane.
DO $permissions$
DECLARE role_name text;
BEGIN
  FOR role_name IN SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated') LOOP
    EXECUTE format('REVOKE ALL ON SCHEMA rnr_audit FROM %I', role_name);
    EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA rnr_audit FROM %I', role_name);
  END LOOP;
END;
$permissions$;

COMMIT;
