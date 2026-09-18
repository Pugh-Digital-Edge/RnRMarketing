# SEO/AEO Production Regression Check — 2026-09-18

- Run time: 2026-09-18T11:30:46-04:00 (2026-09-18T15:30:46Z).
- Run type: closed-loop SEO/AEO production health, parity, and due-measurement check.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `6e177d8db6062c775dc282582387d449717e1897` (`6e177d8`), `Align restoration landing page offer and SEO pipeline documentation`.
- Previous checkpoint: [`2026-09-16-production-regression.md`](2026-09-16-production-regression.md).
- Guidance used: installed Canonry and Aero skills, Aero regression/orchestration/site-health guidance, and the project SEO operating records.
- Shared lock: acquired as `seo-production-record-20260918-9ae7f8cd674e` after two busy-lock retries; released after the record update.

## Outcome

The required locked `npm run seo:check -- auto` escalated to full mode because the repository changed after the last accepted checkpoint. Validation/build passed, but the parity result failed because live production still serves `c8698c8` while the current repository is `6e177d8`. The current commit is already on `origin/main`; this health run did not deploy, push, or alter source/content.

The check covered 99/99 live sitemap pages, 101 same-origin navigation targets, and 99 Markdown alternates. The 12 reported local/live SEO-signal mismatches are schema-payload differences on the new source artifact across the homepage, about, industries, resources, schedule, services overview, PPC, SEO, reputation-management, lead-tracking, and social-advertising routes. The affected routes retain matching title, description, self-canonical, one H1, robots/indexability, schema types, sitemap presence, and HTTP behavior. Classify this as deployment/production-parity lag, not a confirmed live technical, indexing, or content regression.

`npm run seo:due` found all 13 interventions still Measuring. SEO-004 is due today, but the complete intended post-live GSC window through 2026-09-17 is unavailable because stored performance data ends 2026-09-15. No outcome was inferred; the item remains Measuring with the next checkpoint after the next native refresh, no earlier than 2026-09-21.

No manual visibility sweep, probe, discovery run, repair sync, indexing request, sitemap submission, connector mutation, deployment, purge, or source/content change was performed.

## Production and local parity

- Live `/build-info.json` reports `c8698c83f38291b660de3dc6efbc318663710e0a`; local HEAD is `6e177d8db6062c775dc282582387d449717e1897`.
- The full checker passed its single `npm run validate` gate and checked 99/99 sitemap URLs, 101 navigation targets, and 99 Markdown alternates.
- The checker failures were one deployment-revision mismatch plus 12 local/live schema-payload mismatches. The local build is newer than production; the live artifact was not judged broken merely because it differs from the unreleased source.
- The live sitemap remains 99 URLs. The new source-only checklist routes are excluded from the sitemap by the current `astro.config.mjs`; no live sitemap expansion was observed.
- No failure established a Google indexing, ranking, conversion, or AI-visibility outcome.

## Canonry freshness and stored evidence

- The native data-refresh completed September 18. GSC coverage is 58 indexed / 45 not indexed / 0 deindexed across 103 stored inspections, with last inspected/synced timestamps on 2026-09-18. Current Search Console performance data is through 2026-09-15.
- GA4 property `543995602` is connected by OAuth and synced 2026-09-18. The current stored 30-day window is 2026-08-19 through 2026-09-18: 263 total sessions, 25 organic sessions, 2 deduplicated AI sessions, and 0 social sessions. These are traffic observations, not lead or revenue outcomes; QA/test filtering remains a limitation.
- Technical AEO audit `0b89d1a7-73f3-48f0-858f-c25ba159057c` completed 2026-09-15 at 90/100 over 101 audited pages, with 0 skipped and 0 errored. Content Extractability remains the only partial cross-cutting factor.
- Latest completed comparable visibility run remains `dc0e5f1c-7708-4edc-90be-47474349f809` from 2026-09-10: 6/42 query-level Mention Coverage, 7/33 non-brand query-level Mention Share, and 3/42 query-level Citation Coverage. The latest provider-snapshot overview is 7/126 mentioned and 4/126 cited; these provider-snapshot denominators are separate from the query-level figures. No new visibility result was collected.
- The fixed-basket answer-visibility and site-audit schedules are next due Sunday September 20 at 18:00 and 19:00 Eastern. No duplicate collection was run.

## Findings and classification

### Deployment/parity lag — required user action

**Problem** → The current source/build artifact is not live: production serves `c8698c8`, while `6e177d8` is the current `origin/main` revision.

**Evidence** → The locked full check passed validation and all live route/target checks, but reported one deployed-revision mismatch and 12 schema-payload mismatches on affected routes. Titles, descriptions, canonicals, H1s, robots/indexability, schema types, sitemap coverage, and HTTP responses remain aligned.

**Expected impact** → Until the current revision is deployed and rechecked, production does not reflect the source offer/landing-page and shared-schema changes. This blocks accepting the current source as a verified SEO-impacting deployment; it does not prove a live SEO loss.

**Recommended change** → Owner of the already-pushed `6e177d8` deployment should complete the normal hosting deployment, then rerun the locked full checker and exact live verification. Do not start measurement from the push alone.

**Effort** → Low for deployment/recheck; source changes are outside this run’s authority.

**Confidence** → High that the mismatch is deployment lag; high that the checked live artifact remains technically eligible on the reported signals; low for any search/AEO outcome until a post-live window exists.

**Verification method** → Confirm live `/build-info.json` equals `6e177d8`, rerun `npm run seo:check -- full` under the shared lock, require zero failures, and retain the resulting accepted live date before measuring affected interventions.

**Classification** → Deployment/production-parity defect; not a confirmed source, indexing, or live-content regression.

### SEO-004 due checkpoint — incomplete measurement

**Problem** → SEO-004’s intended 27-day post-live GSC comparison is due by calendar date, but the source data does not cover the entire post-live window through 2026-09-17.

**Evidence** → `cnry google performance-daily` reports `latestDataDate=2026-09-15` and `daysSinceLatestData=3`. The original SEO-004 baseline and approved `e31b744` artifact remain the comparison target; current dirty rewrites remain unapproved and undeployed.

**Expected impact** → A partial window could understate clicks, CTR, impressions, or position and would not support a causal before/after conclusion.

**Recommended change** → Keep SEO-004 Measuring. Re-run the exact query/page comparison after the next native GSC refresh covers 2026-09-17; do not rewrite the four pages or interpret incomplete rows as zero.

**Effort** → Low for the later read; no implementation change authorized.

**Confidence** → High that the window is incomplete; high that no outcome should be claimed today.

**Verification method** → Use equal-length before/after windows, exact URL/query cohorts, the original baseline, and known confounders; report clicks/CTR/position only when the complete data-through date is available.

**Classification** → Measuring; unavailable/incomplete GSC evidence, not a failed intervention.

## Backlog reconciliation and limitations

- Updated only changed backlog facts: current regression pointer and the deployment/parity lag. The concurrent coordinator record already reconciled SEO-004’s incomplete window and next checkpoint.
- All 13 due items remain Measuring; no learning was promoted.
- Live/build parity is incomplete for the current source revision because deployment receipt and local HEAD differ. The live artifact itself passed route eligibility checks.
- Unavailable/not claimed: current ranking outcome, causal search/AEO impact, qualified leads, revenue, full current indexing verdicts for all live URLs, and a fresh visibility result.
- Required next actions: deploy/verify `6e177d8` if authorized by the deployment owner; let the native Sunday collections run; recheck SEO-004 after GSC covers 2026-09-17; keep Mention Coverage/Share separate from Citation Coverage and query-level from provider-snapshot denominators.
