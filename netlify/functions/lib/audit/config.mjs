import { validateDeliveryConfig } from './delivery.mjs';
import { APPROVED_SCAN_BUDGET, APPROVED_REPORT_MAX_METERED_COST_MICROS, HTML_SCAN_MAX_METERED_COST_MICROS } from './budget-policy.mjs';

// Approved ceilings are versioned; credentials and live enablement are not inferred.
const integer = (env, name, fallback, maximum = Number.MAX_SAFE_INTEGER) => {
  const raw = env[name] ?? fallback;
  if (!/^(0|[1-9]\d*)$/.test(String(raw ?? ''))) throw new Error(`Missing or invalid ${name}`);
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value > maximum) throw new Error(`Invalid ${name}`);
  return value;
};

export function loadConfig(env = process.env) {
  const disabled = { enabled: false, reportEnabled: false, mode: 'disabled', message: 'Live audits are being prepared. Explore the example report or book a call.' };
  if (env.AUDIT_ENABLED !== 'true' || env.AUDIT_LAUNCH_VERIFIED !== 'true') return disabled;
  try {
    const originUrl = new URL(env.AUDIT_ORIGIN);
    if (originUrl.protocol !== 'https:' || originUrl.username || originUrl.password || originUrl.pathname !== '/' || originUrl.search || originUrl.hash || originUrl.port) throw new Error('Invalid origin');
    if (!env.AUDIT_DATABASE_URL || !env.AUDIT_TURNSTILE_SECRET || !env.AUDIT_TURNSTILE_SITE_KEY || !env.AUDIT_SIGNING_SECRET || Buffer.byteLength(env.AUDIT_SIGNING_SECRET) < 32) throw new Error('Missing infrastructure');
    // PostgreSQL is the only production adapter. In-memory state is test-only.
    const config = {
      enabled: true, reportEnabled: false, mode: 'live', origin: originUrl.origin,
      botHostname: originUrl.hostname, botSiteKey: env.AUDIT_TURNSTILE_SITE_KEY,
      botSecret: env.AUDIT_TURNSTILE_SECRET, signingSecret: env.AUDIT_SIGNING_SECRET,
      databaseUrl: env.AUDIT_DATABASE_URL,
      ipDaily: integer(env, 'AUDIT_IP_DAILY', '3', 100),
      sessionDaily: integer(env, 'AUDIT_SESSION_DAILY', '3', 100),
      globalDaily: integer(env, 'AUDIT_GLOBAL_DAILY', '50', 10000),
      maxActive: integer(env, 'AUDIT_MAX_ACTIVE', '2', 2),
      maxQueued: integer(env, 'AUDIT_MAX_QUEUED', '8', 100),
      cacheMs: 86400000, leaseMs: 120000,
      dailyBudgetMicros: integer(env, 'AUDIT_DAILY_BUDGET_MICROS', APPROVED_SCAN_BUDGET.dailyBudgetMicros, APPROVED_SCAN_BUDGET.dailyBudgetMicros),
      monthlyBudgetMicros: integer(env, 'AUDIT_MONTHLY_BUDGET_MICROS', APPROVED_SCAN_BUDGET.monthlyBudgetMicros, APPROVED_SCAN_BUDGET.monthlyBudgetMicros),
      maxScanCostMicros: integer(env, 'AUDIT_MAX_SCAN_COST_MICROS', HTML_SCAN_MAX_METERED_COST_MICROS),
    };
    if (!config.ipDaily || !config.sessionDaily || !config.globalDaily || !config.maxActive || !config.maxQueued) throw new Error('Invalid limits');
    const safeProperty = value => /^rnr_audit_[a-z0-9_]{1,60}$/.test(value ?? '');
    if (env.AUDIT_REPORT_ENABLED === 'true' && env.AUDIT_REPORT_LAUNCH_VERIFIED === 'true' && env.AUDIT_RESEND_API_KEY && env.AUDIT_EMAIL_FROM && env.AUDIT_HUBSPOT_TOKEN && safeProperty(env.AUDIT_HUBSPOT_REPORT_PROPERTY) && safeProperty(env.AUDIT_HUBSPOT_CONSENT_PROPERTY)) {
      config.maxReportCostMicros = integer(env, 'AUDIT_MAX_REPORT_COST_MICROS', undefined, APPROVED_REPORT_MAX_METERED_COST_MICROS);
      config.reportEnabled = true;
      config.resendApiKey = env.AUDIT_RESEND_API_KEY;
      config.emailFrom = env.AUDIT_EMAIL_FROM;
      config.hubspotToken = env.AUDIT_HUBSPOT_TOKEN;
      config.hubspotReportProperty = env.AUDIT_HUBSPOT_REPORT_PROPERTY;
      config.hubspotConsentProperty = env.AUDIT_HUBSPOT_CONSENT_PROPERTY;
      validateDeliveryConfig(config);
    }
    return config;
  } catch {
    return disabled;
  }
}

export function publicConfig(config) {
  return config.enabled
    ? { enabled: true, reportEnabled: config.reportEnabled, mode: 'live', botSiteKey: config.botSiteKey }
    : { enabled: false, reportEnabled: false, mode: 'disabled', message: config.message };
}
