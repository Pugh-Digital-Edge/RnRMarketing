import { pathToFileURL } from 'node:url';
import { APPROVED_SCAN_BUDGET, HTML_SCAN_MAX_METERED_COST_MICROS } from '../netlify/functions/lib/audit/budget-policy.mjs';
import { loadConfig } from '../netlify/functions/lib/audit/config.mjs';
import { PUBLIC_AUDIT_RELEASE } from '../netlify/functions/lib/audit/release-policy.mjs';

/** Shape/presence checks only. Never connects, prints secrets or changes state. */
export function auditPreflight(env = process.env) {
  const reportRequested = env.AUDIT_REPORT_ENABLED === 'true';
  const required = ['AUDIT_ORIGIN', 'AUDIT_DATABASE_URL', 'AUDIT_SIGNING_SECRET', 'AUDIT_TURNSTILE_SITE_KEY', 'AUDIT_TURNSTILE_SECRET'];
  if (reportRequested) required.push('AUDIT_MAX_REPORT_COST_MICROS', 'AUDIT_RESEND_API_KEY', 'AUDIT_EMAIL_FROM', 'AUDIT_HUBSPOT_TOKEN', 'AUDIT_HUBSPOT_REPORT_PROPERTY', 'AUDIT_HUBSPOT_CONSENT_PROPERTY');
  const missing = required.filter(key => typeof env[key] !== 'string' || !env[key].trim());
  const config = loadConfig(env);
  const shape = loadConfig({ ...env, AUDIT_ENABLED: 'true', AUDIT_LAUNCH_VERIFIED: 'true', AUDIT_REPORT_ENABLED: 'false', AUDIT_REPORT_LAUNCH_VERIFIED: 'false' });
  const reportShape = reportRequested ? loadConfig({ ...env, AUDIT_ENABLED: 'true', AUDIT_LAUNCH_VERIFIED: 'true', AUDIT_REPORT_ENABLED: 'true', AUDIT_REPORT_LAUNCH_VERIFIED: 'true' }).reportEnabled : null;
  const manual = [
    'Verify the existing Netlify plan, background entitlement, team billing and infrastructure isolation without risking the main site.',
    'Approve database/account choice, provision separately authorized credentials and manually apply the private-schema migration.',
    'Verify real database TLS, row locking, rollback, outage behavior and realistic state/egress usage in private staging.',
    'Authorize/configure the hostname-scoped Turnstile widget and signing secret; verify direct API bypass/replay denial.',
    'Obtain explicit publishing/live-work approval after the private staging evidence is reviewed.',
  ];
  if (env.AUDIT_REPORT_ENABLED === 'true') manual.push('Separately approve/verify email account and sender/DNS, HubSpot scoped key/properties/workflow effects, and an exact pilot recipient before sending.');
  return {
    check: 'local configuration only; no provider readiness or launch approval implied',
    approvedScanBudget: { currency: APPROVED_SCAN_BUDGET.currency, dailyUsd: 5, monthlyUsd: 50, approvedOn: APPROVED_SCAN_BUDGET.approvedOn },
    currentScannerMaxMeteredCostMicros: HTML_SCAN_MAX_METERED_COST_MICROS,
    liveScanEnabled: config.enabled && PUBLIC_AUDIT_RELEASE.liveScanningAuthorized,
    reportEnabled: config.reportEnabled && PUBLIC_AUDIT_RELEASE.reportDeliveryAuthorized,
    publicReleaseHold: !PUBLIC_AUDIT_RELEASE.liveScanningAuthorized,
    configurationShapeValid: shape.enabled && (!reportRequested || reportShape === true),
    reportConfigurationShapeValid: reportShape,
    missingVariables: missing,
    ...(shape.enabled ? { effectiveDailyMicros: shape.dailyBudgetMicros, effectiveMonthlyMicros: shape.monthlyBudgetMicros } : {}),
    manualGates: manual,
    safeToLaunch: false,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = auditPreflight();
  console.log(JSON.stringify(report, null, 2));
  if (!report.configurationShapeValid) process.exitCode = 2;
}
