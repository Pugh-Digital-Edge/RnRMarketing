// Matt approved these scan-work ceilings on 2026-11-05. This is a ceiling,
// not permission to purchase infrastructure, provision keys, deploy, or run
// paid work. Raising either value requires a new recorded approval/code review.
export const APPROVED_SCAN_BUDGET = Object.freeze({
  currency: 'USD',
  dailyBudgetMicros: 5_000_000,
  monthlyBudgetMicros: 50_000_000,
  approvedOn: '2026-11-05',
});

// Current scanner is bounded native HTTP + deterministic HTML checks only.
export const HTML_SCAN_MAX_METERED_COST_MICROS = 0;

// No email/CRM spending was approved. Zero-cost provider plans still need their
// own account, credential, workflow and send authorization before launch.
export const APPROVED_REPORT_MAX_METERED_COST_MICROS = 0;
