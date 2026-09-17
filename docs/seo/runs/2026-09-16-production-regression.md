# SEO/AEO Production Regression Check — 2026-09-16

- Run time: 2026-09-16T08:05:00-04:00 (2026-09-16T12:05:00Z).
- Run type: closed-loop SEO/AEO production health, parity, and due-measurement check.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `c8698c83f38291b660de3dc6efbc318663710e0a` (`c8698c8`), `Document Codex vs Grok Bot SEO ownership`.
- Previous checkpoint: [`2026-09-15-production-regression.md`](2026-09-15-production-regression.md).
- Guidance used: installed Canonry and Aero skills, Aero regression/orchestration/site-health guidance, Canonry CLI guidance, and the project SEO operating records.

## Outcome

No meaningful live SEO/AEO regression was found. The locked `npm run seo:check -- auto` selected full mode because the deployed build receipt advanced to current HEAD after the approved September 15 pipeline/documentation deployment. The full check passed with zero failures. The source and sitemap hashes are unchanged from the previous accepted artifact, and no source/content intervention was made.

The required `npm run seo:due` scan found all 13 Measuring items waiting on their recorded dates; no complete post-live measurement window exists today. The next due items are SEO-004 on 2026-09-18, SEO-003/SEO-006/SEO-013 on 2026-09-21, and SEO-001/SEO-005/SEO-007 on 2026-09-24. SEO-002's same-set indexing checkpoint remains no earlier than 2026-09-25.

No manual visibility sweep, probe, discovery run, indexing request, sitemap submission, connector mutation, deployment, purge, or source/content change was performed.

## Production and local parity

- Current HEAD and live `/build-info.json` receipt are both `c8698c8`.
- 99/99 sitemap URLs passed HTTP 200, non-empty title/description, one H1, absolute self-canonical, parseable JSON-LD, shared `LocalBusiness` identity, and indexability checks.
- 101 same-origin navigation targets passed; the expected POST-only lead-submit endpoint remains excluded from GET navigation verdicts.
- 99 advertised Markdown alternates passed, along with robots, `llms.txt`, `llms-full.txt`, sitemap, canonical redirects, expected noindex exclusions, 404 behavior, and representative normal/`CanonryBot/1.0` response parity.
- Local/build/live SEO signals and AI-access artifacts matched with zero failures after the checker’s normalization rules.
- The locked full check ran the single `npm run validate` gate successfully, including Astro check, 19 tests, production build, and bundled postbuild AEO validation.

## Canonry freshness and stored evidence

- GSC is connected with site-owner access. The native data-refresh completed 2026-09-16; data is current through 2026-09-13. Direct coverage is 58 indexed / 45 not indexed / 0 deindexed across 103 stored URLs, with inspection and sync timestamps on 2026-09-16.
- Relevant GSC states are provider-specific: `/resources/water-damage-restoration-marketing/` and `/resources/local-services-ads-for-restoration-companies/` are `Submitted and indexed`; `/resources/restoration-marketing-agency-vs-generalist/` and `/resources/mold-remediation-marketing/` are `URL is unknown to Google`. These samples do not establish full-sitemap coverage or justify an indexing mutation.
- Bing access is connected and verified. The fresh 2026-09-16 sample is 41 indexed / 0 known not-indexed / 1 unknown across 42 inspections. The newer agency-selection, LSA, and mold URLs are not represented; the older water-damage URL remains the unknown row.
- GA4 property `543995602` is connected by OAuth and synced 2026-09-16. The stored 30-day window is 2026-08-17 through 2026-09-16: 323 total sessions, 25 organic sessions, 111 direct sessions, 1 deduplicated AI session (organic AI 1, paid AI 0), and 0 social sessions. These are traffic observations, not lead or revenue outcomes; QA/test campaign filtering remains a known limitation.
- Technical AEO audit `0b89d1a7-73f3-48f0-858f-c25ba159057c` completed 2026-09-15 at 90/100 over 101 discovered/audited pages, with 0 skipped and 0 errored. Content Extractability remains the only partial cross-cutting factor.
- Latest completed comparable visibility run remains `dc0e5f1c-7708-4edc-90be-47474349f809` from 2026-09-10: 6/42 query-level Mention Coverage, 7/33 non-brand Mention Share, and 3/42 query-level Citation Coverage. The last-three-run pool is 61 mentions and 13 citations across 378 provider snapshots. No new visibility result was collected, and no outcome claim is made.
- Project doctor passed GSC, Bing, GA4, and freshness checks. Its single failure is the unconfigured GBP connection; missing GSC sitemap-write scope, no traffic/backlink source, and low winnability coverage remain integration limitations, not live regressions.

## Findings and classification

### No confirmed production regression

**Problem** → None found across the current 99-URL sitemap, 101 navigation targets, 99 Markdown alternates, metadata/indexability/schema/entity signals, AI-access artifacts, redirects, crawler parity, or normalized source/build/live parity.

**Evidence** → Full locked check passed with 99/99 sitemap pages, 101 navigation targets, 99 alternates, current build receipt, and zero failures. The source and sitemap hashes are unchanged from the prior accepted artifact.

**Expected impact** → The deployed artifact remains crawlable and technically eligible for organic and AI retrieval. The approved pipeline deployment did not introduce a detected technical, deployment, configuration, indexing, or content regression.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, CDN, or configuration change from this check. Hold the verified 99-URL artifact stable through the existing measurement windows.

**Effort** → None for regression remediation.

**Confidence** → High for the checked live/build surface; medium for future search/AEO outcomes because visibility and outcome windows remain separate and limited.

**Verification method** → Repeat the full parity surface after the next SEO-impacting deployment; use the native Sunday audit/visibility schedules and the authorized same-set indexing checkpoint on or after 2026-09-25. Report Mention Coverage/Share separately from Citation Coverage and do not infer outcomes from parity.

**Classification** → No confirmed source-code regression, deployment/stale-artifact defect, configuration defect, indexing loss, or content regression.

### Fresh provider samples — measurement context, not regression

**Problem** → GSC/Bing provider samples changed through the authorized daily data-refresh, while several newer article URLs remain unknown or absent from the respective samples.

**Evidence** → GSC now reads 58/103 indexed and 45/103 not indexed with 2026-09-16 inspection/sync; water-damage and LSA guides are indexed, while the agency-selection and mold guides are unknown. Bing reads 41/42 indexed and 1/42 unknown, without the newer agency, LSA, or mold URLs in the sample.

**Expected impact** → Fresh samples improve the evidence available for the upcoming indexing checkpoint, but they do not establish a full-site or intervention outcome.

**Recommended change** → Keep SEO-002 Measuring and retain the exact 23-URL bounded recheck for no earlier than 2026-09-25. Do not submit URLs, request indexing, expand the cohort, or rewrite pages from these samples alone.

**Effort** → Low for monitoring; medium for the later bounded comparison.

**Confidence** → High that the returned provider states and denominators are current stored evidence; medium for their applicability to the full 99-URL live sitemap.

**Verification method** → Compare the identical approved URL cohort after the required recrawl window, retaining provider-specific denominators and unknown states.

## Backlog reconciliation

- Updated `docs/seo/backlog.md` with the current regression pointer, the clean 2026-09-16 full parity checkpoint, fresh GSC/Bing sample evidence, and the partial SEO-013 unattended-cycle evidence.
- SEO-001 remains Measuring; the current 99-page/101-target/99-alternate full parity check is clean.
- SEO-002 remains Measuring; the daily refresh is recorded as a fresh provider sample, but the authorized identical 23-URL checkpoint remains gated for 2026-09-25.
- SEO-003 through SEO-012 remain Measuring with no outcome inferred. SEO-013 remains Measuring until the first unattended weekly coordinator acceptance checkpoint on 2026-09-21.
- No duplicate IDs were created and `docs/seo/learnings.md` was not promoted because no intervention has a completed comparable outcome window.

## Verification status and limitations

- **Live/build parity:** complete for the current 99-URL sitemap, 101 navigation targets, 99 Markdown alternates, metadata/indexability/schema/entity signals, redirects, robots/AI-access files, crawler parity, exclusions, and 404 behavior.
- **Canonry:** GSC/Bing/GA4 freshness is current through the dates above; technical audit is current through 2026-09-15; AI visibility is current only through the completed 2026-09-10 run.
- **Unavailable/not claimed:** full current indexing verdicts for all live URLs, current GSC performance rows, causal search/AEO impact, qualified leads, revenue, stable hosting build ID, and live server crawler logs.
- **Pending:** keep the verified artifact stable; observe the first unattended weekly coordinator cycle on 2026-09-21; measure only complete windows and preserve separate mention, citation, query, and provider-snapshot denominators.
