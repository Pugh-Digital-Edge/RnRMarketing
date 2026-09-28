# SEO/AEO Production Regression Check — 2026-09-21

- Run time: 2026-09-21T08:05:30-04:00 (2026-09-21T12:05:30Z).
- Run type: closed-loop SEO/AEO production health, parity, and due-measurement check.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `ca7478029155f430e643ea3c51ba6a4a766f0c65` (`ca74780`), equal to `origin/main`.
- Previous checkpoint: [`2026-09-18-production-regression.md`](2026-09-18-production-regression.md).
- Guidance used: the installed Canonry and Aero operations guide, Aero regression/orchestration/site-health guidance, the project pipeline and portfolio contracts, and the shared Agent Hub/Agent Exchange startup context.

## Outcome

The run found no confirmed live crawlability, indexability, metadata, redirect, schema, or AI-access regression on the deployed 99-URL artifact. The shared lock was acquired and released successfully. `npm run seo:check -- auto` selected full mode because the prior accepted full record was failed; the integrated `npm run validate` gate passed with 0 Astro errors, 26 tests, a 106-page build, and the bundled postbuild AEO check.

The full checker passed 99/99 sitemap pages, 101 same-origin navigation targets, 99 Markdown alternates, expected exclusions/404 behavior, representative normal/`CanonryBot/1.0` response parity, and the normalized live technical surface. It failed the deployed-revision gate because live `/build-info.json` still reports `c8698c83f38291b660de3dc6efbc318663710e0a` while the checkout is `ca7478029155f430e643ea3c51ba6a4a766f0c65`, and it reported 12 local/live SEO-signal mismatches on routes changed in committed but not-yet-live source work. This is deployment/production-parity lag, not evidence that the live pages are broken. No deployment, merge, purge, source/content edit, indexing action, provider mutation, or new sweep/probe was performed.

## Production and local parity

- Live `/build-info.json`: `c8698c8`; current checkout/origin: `ca74780`.
- Live checker surface: 99/99 sitemap pages, 101 internal targets, 99 advertised Markdown alternates; the page-level technical checks passed.
- Failed parity routes: `/`, `/about/`, `/industries/`, `/resources/`, `/schedule/`, `/services/`, `/services/lead-tracking/`, `/services/ppc/`, `/services/reputation-management/`, `/services/seo/`, and `/services/social-media-advertising/`.
- The current source contains the AI-visibility checklist and other committed offer/form/service changes absent from the deployed receipt. Preserve them for the owning coordinator/release process; this health role does not deploy or rewrite them.
- Canonry technical audit `6866ca71-5f2d-4a18-b52b-f4642543fe50` completed 2026-09-20 at 90/100 over 101 pages, 0 skipped and 0 errored; the only cross-cutting partial remains Content Extractability.

## Canonry freshness and stored evidence

- GSC coverage refresh completed 2026-09-21: 58 indexed / 45 not indexed / 0 deindexed across 103 inspected URLs. GSC performance data is current through 2026-09-19.
- GA4 property `543995602` is connected and synced 2026-09-21. The stored 31-day window is 2026-08-22 through 2026-09-21: 232 total sessions, 20 organic sessions, 73 direct sessions, 2 deduplicated organic AI sessions, and 0 paid-AI sessions. These are traffic observations, not lead or revenue outcomes; QA/test filtering remains a limitation.
- Bing is connected, but the September 21 scheduled sitemap inspection is partial: it stopped after sustained failures with 89 of 99 pages not inspected. Do not infer full Bing coverage from the prior 41/42 sample.
- The scheduled fixed-basket visibility run `3e87f272-07c8-40eb-af7a-e30b75e60a19` completed 2026-09-20 with 42 queries × 3 providers = 126 snapshots. Query-level Mention Coverage is 7/42, Citation Coverage is 4/42, and non-brand Mention Share is 7/40 (18%); provider-snapshot totals are 7/126 mentioned and 5/126 cited. Mention and citation remain separate signals.

## Due measurements

### SEO-003 — fixed-basket visibility

The September 20 scheduled result is comparable to the September 10 fixed basket: Mention Coverage moved from 6/42 to 7/42, Citation Coverage from 3/42 to 4/42, and non-brand Mention Share from 7/33 to 7/40. Canonry reports three gains and two losses since September 10. This is one additional observation with changed non-brand denominator, not durable recovery or a causal page result. Keep Measuring and preserve the existing basket.

### SEO-004 — page-specific search window

The complete comparable post-live window is August 22–September 17, against the 27-day pre-live window July 25–August 20. All four cohorts recorded 0 clicks. Full query/page aggregates were:

| Cohort | Pre impressions / weighted position | Post impressions / weighted position |
| --- | ---: | ---: |
| Water-damage PPC | 1,633 / 24.06 | 1,221 / 21.26 |
| Retargeting | 168 / 27.07 | 175 / 25.46 |
| Web design | 776 / 27.80 | 811 / 36.36 |
| Social-media marketing | 452 / 28.47 | 454 / 30.50 |

Water-damage PPC and retargeting improved in weighted position, while web design and social-media marketing worsened; impressions were stable-to-lower except web design. The mixed result and the current checkout/live parity lag prevent a causal success or failure claim. Keep Measuring and hold additional rewrites pending the coordinator's review.

### SEO-006 — water-damage marketing article

The complete post-live GSC read through September 19 is sparse: the exact query `water damage restoration marketing` on the article URL produced 1 impression, 1 click, and position 94 from August 25–September 21. There is no pre-live article-page row because the URL did not exist then. This does not establish an outcome; keep Measuring for the later comparable search/AEO checkpoint and do not rewrite or request indexing.

### SEO-013 — pipeline reliability

The September 20 scheduled visibility run, September 20 technical audit, and September 21 GSC/GA4 refresh are present. The health run occurred before the September 21 09:30 Eastern weekly-coordinator checkpoint, so article delivery, coordinator acceptance, and no-duplicate execution are not yet verified. Keep Measuring until that checkpoint is observed.

## Findings and classification

**Problem** → The checkout has advanced site-affecting commits that are not represented in the live build receipt, causing the checker to reject the current revision and report 12 local/live SEO-signal mismatches.

**Evidence** → Live receipt `c8698c8` versus current `ca74780`; full checker passed the 99-page technical surface and failed only the revision/parity assertions. Canonry's 90/100 audit and scheduled visibility run completed successfully; the live sitemap and internal-target checks remain healthy.

**Expected impact** → Until the current source is deliberately released and accepted, local output cannot be used as a production-parity baseline. Search/AEO measurements should continue to use the accepted live artifact and disclose the source/live confounder.

**Recommended change** → The owning coordinator/release process should reconcile the committed checklist/offer/form/service changes, then deploy and rerun the locked full checker. This health run should not merge, publish, or rewrite those changes.

**Effort** → Medium for release reconciliation and live acceptance; none for additional health remediation today.

**Confidence** → High that the failure is deployment/parity lag; high for the checked live technical surface; low-to-medium for causal search/AEO interpretation because current source and live output differ.

**Verification method** → After an authorized release, confirm `/build-info.json` matches the accepted commit, run the locked `npm run validate`/full checker, recheck all affected routes and normalized local/live signals, then compare due cohorts using complete equal windows. Keep mention coverage/share separate from citation coverage and query-level denominators separate from provider-snapshot totals.

## Next checkpoint and limitations

- Observe the September 21 weekly coordinator run for SEO-013; do not treat this pre-coordinator health run as acceptance.
- Keep SEO-003, SEO-004, and SEO-006 Measuring; no durable visibility recovery, page-level causal outcome, lead outcome, or revenue outcome is claimed.
- Bing's partial inspection is a provider freshness limitation, not a full-site indexing verdict; no manual Bing repair or indexing action was run.
- The current live artifact remains the measurement baseline until the committed checkout changes are intentionally released and accepted.
