# SEO/AEO Production Regression Check — 2026-09-22

- Run time: 2026-09-22T12:07:20Z (2026-09-22T08:07:20-04:00).
- Run type: closed-loop SEO/AEO production health, parity, and due-measurement check.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `ca7478029155f430e643ea3c51ba6a4a766f0c65` (`ca74780`), equal to `origin/main`.
- Previous checkpoint: [`2026-09-21-production-regression.md`](2026-09-21-production-regression.md).
- Guidance used: the installed Canonry and Aero operations guide, Aero regression/site-health guidance, the project pipeline and portfolio contracts, and the shared Agent Hub/Agent Exchange startup context.
- Shared lock: acquired as `seo-production-check-20260922-ffa7d0b0433b446694902811f2c96324` for checks, then `seo-production-record-20260922-5a1f8c5f06a94bd8be8d0fd65c868905` for this record; both were released successfully.

## Outcome

The run found no confirmed live crawlability, indexability, metadata, redirect, schema-type, or AI-access regression on the deployed 99-URL artifact. The locked `npm run seo:check -- auto` selected full mode. Its integrated `npm run validate` gate passed with 0 Astro errors, 26 tests, a 106-page build, and the bundled postbuild AEO check.

The full checker passed 99/99 sitemap pages, 101 same-origin navigation targets, 99 Markdown alternates, expected exclusions/404 behavior, and representative normal/`CanonryBot/1.0` response parity. It failed the deployed-revision gate because live `/build-info.json` still reports `c8698c83f38291b660de3dc6efbc318663710e0a` while the checkout is `ca7478029155f430e643ea3c51ba6a4a766f0c65`, and it reported 12 local/live SEO-signal mismatches on the same committed-but-not-yet-live routes as the prior run. A focused signal comparison showed the mismatches are schema payloads only; title, description, canonical, H1, robots/indexability, and schema counts match. This is deployment/production-parity lag, not evidence that the live pages are broken. No deployment, merge, purge, source/content edit, indexing action, provider mutation, or new sweep/probe was performed.

The scheduled RnR weekly coordinator task for September 21 is not verified: its Codex task ended with a system error stating that the selected model was at capacity. This is an unattended-coordinator execution blocker, not evidence of an article or production failure. The September 14–20 article obligation remains satisfied by SEO-012; no second article was created.

`npm run seo:due` found all 13 interventions still `Measuring`. SEO-003, SEO-004, SEO-006, and SEO-013 are past calendar due dates but retain their recorded evidence gates or execution blocker; no incomplete or mixed result was promoted to `Done` or `Validated`.

## Production and local parity

- Live `/build-info.json`: `c8698c83f38291b660de3dc6efbc318663710e0a`.
- Current checkout/origin: `ca7478029155f430e643ea3c51ba6a4a766f0c65`.
- Failed parity routes: `/`, `/about/`, `/industries/`, `/resources/`, `/schedule/`, `/services/`, `/services/lead-tracking/`, `/services/ppc/`, `/services/reputation-management/`, `/services/seo/`, and `/services/social-media-advertising/`.
- On the homepage, the live and local signal objects differ only in `FAQPage` payload; canonical, metadata, H1, robots, and schema count are equal. The live page has the older FAQ answers while the current build contains the committed offer/FAQ revision. This confirms the mismatch is unreleased source content/schema, not a failed live technical signal.
- Direct live checks for `/`, `/about/`, `/services/ppc/`, and `/services/social-media-advertising/` returned HTTP 200. No source or deployment action was taken by this health role.

## Canonry freshness and stored evidence

- Google scheduled refresh `5920ad84-f871-41bb-b494-6d3e540dc9ac` completed 2026-09-22 at 10:00Z. Coverage is 58 indexed / 45 not indexed / 0 deindexed across 103 inspected URLs; last inspected/synced at 10:02:40Z. GSC performance data is current through 2026-09-20.
- GA4 scheduled refresh `f26b51dd-810a-4a56-9c36-ff475e901c18` completed 2026-09-22 at 10:00Z. Property `543995602` is connected and synced at 10:00:06Z. The stored 30-day window is 2026-08-23 through 2026-09-22: 225 total sessions, 20 organic sessions, 69 direct sessions, 2 deduplicated organic AI sessions, and 0 paid-AI sessions. These are traffic observations, not lead or revenue outcomes; QA/test filtering remains a limitation.
- Bing's scheduled sitemap inspection `375d54fd-42eb-46c6-993b-248c41c3bd72` is partial after sustained failures left 89 of 99 pages uninspected. Do not infer whole-site Bing coverage or retry it from this run.
- The scheduled fixed-basket visibility run `3e87f272-07c8-40eb-af7a-e30b75e60a19` completed 2026-09-20 with 42 queries × 3 providers = 126 snapshots. Query-level Mention Coverage is 7/42 and Citation Coverage is 4/42; provider-snapshot totals are 7/126 mentioned and 5/126 cited. Non-brand Mention Share is 7/40 (18%). Keep query-level and provider-snapshot denominators separate.
- Technical audit `6866ca71-5f2d-4a18-b52b-f4642543fe50` completed 2026-09-20 at 90/100 over 101 pages, 0 skipped and 0 errored. Content Extractability remains the only cross-cutting partial factor, affecting 94/101 pages at an average factor score of 58.

## Due measurements

### SEO-003 — fixed-basket visibility

The latest completed run remains the September 20 scheduled result: 7/42 query-level Mention Coverage, 4/42 Citation Coverage, and 7/40 non-brand Mention Share (18%); provider-snapshot totals are 7/126 mentioned and 5/126 cited. Compared with September 10, this is 6/42 to 7/42 Mention Coverage, 3/42 to 4/42 Citation Coverage, and 7/33 to 7/40 non-brand share. The changed non-brand denominator and one additional run do not establish durable recovery or a causal page result. Keep Measuring and preserve the fixed basket.

### SEO-004 — page-specific search window

The complete comparable window remains August 22–September 17 against July 25–August 20. All four cohorts recorded 0 clicks: water-damage PPC moved from 1,633 impressions / position 24.06 to 1,221 / 21.26; retargeting from 168 / 27.07 to 175 / 25.46; web design from 776 / 27.80 to 811 / 36.36; and social-media marketing from 452 / 28.47 to 454 / 30.50. The result is mixed and the current checkout/live parity lag is a confounder. Keep Measuring and hold further rewrites pending coordinator review.

### SEO-006 — water-damage marketing article

The exact query `water damage restoration marketing` on `/resources/water-damage-restoration-marketing/` remains sparse at 1 impression, 1 click, and position 94 in the August 25–September 21 post-live read. There is no pre-live article-page row. This is insufficient for an outcome claim; keep Measuring and do not rewrite, duplicate, or request indexing.

### SEO-013 — pipeline reliability

The September 20 visibility run, September 20 technical audit, and September 22 GSC/GA4 refresh are present. The September 21 weekly coordinator task did not complete because its selected model was at capacity, so unattended coordinator acceptance and no-duplicate execution remain unverified. Keep Measuring. Next checkpoint: the next successful coordinator run, then live parity verification against `ca74780`.

## Findings and classification

### Deployment/parity lag — required owner action

**Problem** → The current source/build artifact is not live: production serves `c8698c8`, while `ca74780` is the current `origin/main` revision.

**Evidence** → The locked full check passed validation and all live route/target checks, but reported one deployed-revision mismatch and 12 schema-only local/live signal mismatches. Direct live route reads remained HTTP 200 with matching title, description, canonical, H1, robots/indexability, and schema counts.

**Expected impact** → Production does not yet reflect the committed offer/FAQ/service changes, so the current source cannot be accepted as a verified SEO-impacting deployment. This does not prove a live search or crawlability loss.

**Recommended change** → The owning release process should complete the normal hosting deployment for the already-pushed `ca74780`, then rerun the locked full checker and exact live verification. Do not start a new measurement window from the push alone.

**Effort** → Low for deployment/recheck; source and hosting changes are outside this health run's authority.

**Confidence** → High that this is deployment/parity lag; high that the checked live artifact remains technically eligible on the reported signals; low for any search/AEO outcome until live parity is accepted.

**Verification method** → Confirm live `/build-info.json` equals `ca74780`, rerun `npm run seo:check -- full` under the shared lock, require zero failures, and retain the accepted-live timestamp before measuring affected interventions.

### Coordinator execution blocker — next scheduled run required

**Problem** → The September 21 weekly coordinator task did not execute to completion.

**Evidence** → The Codex task status is `systemError` with the message `Selected model is at capacity. Please try a different model.` No new coordinator run record or article delivery receipt exists after September 18.

**Expected impact** → Opportunity ranking, weekly checkpoint reconciliation, and unattended acceptance remain unverified; the already-satisfied prior week is not duplicated by this health run.

**Recommended change** → Retry on the next scheduled coordinator checkpoint or restore model capacity/selection. Preserve the one-article-per-Eastern-week rule and do not interpret the failed task as permission for a second September 14–20 article.

**Effort** → Low for retry; external scheduler/model availability is the blocker.

**Confidence** → High that the task failed before completion; no claim is made about work that did not run.

**Verification method** → A successful coordinator task with a dated run record, lock receipt, article-week check, `npm run seo:due`, and any required live/measurement receipt.

## Limitations and next checkpoints

- No new visibility sweep, probe, discovery run, provider mutation, repair sync, indexing submission/request, sitemap submission, deployment, purge, or source/content change was performed.
- The Canonry CLI reported version `5.2.1` with an available `5.9.0` update; no upgrade was performed during this run.
- Bing's partial sitemap inspection is unavailable evidence for the 89 uninspected URLs, not a sitewide indexing verdict.
- The live hosting receipt exposes `c8698c8` but no stable hosting build ID beyond `/build-info.json`.
- Next health checkpoint: rerun after the owning deployment or on the next scheduled cadence; retain the current `ca74780` parity blocker and coordinator execution blocker until verified.
