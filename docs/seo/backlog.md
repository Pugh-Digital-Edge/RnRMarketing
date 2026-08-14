# SEO/AEO Backlog

Last reconciled: 2026-08-14
Source run: [`2026-08-14-production-regression.md`](runs/2026-08-14-production-regression.md)

Status values: Candidate · Planned · In Progress · Deployed · Measuring · Validated · Rejected · Superseded

## Prioritized work

### SEO-001 — Resolve Canonry/live/source parity on the audited cluster

- Status: Validated
- Category: deployment / production parity; technical
- Scope: representative `/services/`, generated industry/service, `/resources/`, `/schedule/`, and `/thank-you/` routes, then the full affected cluster.
- Problem: the completed Canonry audit scored 50 pages at 28/100 even though direct live checks found the expected signals; the `/thank-you/` source/live mismatch also required deployment correction. Both are now resolved for current production measurement.
- Evidence: the 2026-08-14 live crawl found 95 unique sitemap URLs, no `/thank-you/` sitemap entry, live `/thank-you/` `noindex, nofollow`, 95/95 successful pages with self-canonicals, descriptions, one H1, valid JSON-LD, and the same LocalBusiness entity; 97 same-origin HTML targets had no broken links or redirects, including no remaining `/services` or `/resources` trailing-slash redirects; fresh Canonry audit `5b21a8cd-089c-44e6-adbc-a6d679aacb5a` audited 97 pages with 0 errors at 89/100, up 34 points from the stale 55/100 run; [`2026-08-14-production-regression.md`](runs/2026-08-14-production-regression.md).
- Expected impact: the conversion-confirmation page is excluded from production index signals and Canonry now measures the current production state instead of the stale 55/100 cluster.
- Recommended change: no generic content/schema rewrite and no further redirect fix. Continue monitoring; treat remaining content-extractability observations as a separate evidence-ranked opportunity.
- Effort: Medium
- Confidence: High
- Verification: live `/thank-you/` meta robots and sitemap membership, 95-page live crawl, 97-target internal-link crawl, normal-vs-crawler response comparison, `npm run build`, independent `scripts/postbuild-aeo.mjs`, repaired Canonry runtime, and completed audit `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`.

### SEO-002 — Improve intended index coverage after parity is stable

- Status: Candidate
- Category: indexing
- Scope: 51 URLs last reported not indexed out of 94 in the connected GSC property, plus intended exclusions that must not enter the sitemap.
- Problem: current stored coverage is 48 indexed / 47 not indexed (50.5% indexed), with all 47 not-indexed URLs grouped as `URL is unknown to Google`; individual verdicts still need classification before choosing remedies. The prior `/thank-you/` sitemap/indexability mismatch is resolved.
- Evidence: Canonry GSC read now reports 48 indexed / 47 not indexed of 95 (50.5%), last inspected/synced 2026-08-10, with all 47 grouped as `URL is unknown to Google`; current live sitemap contains 95 URLs and excludes `/thank-you/`, while live `/thank-you/` returns `noindex, nofollow`; [`2026-08-13-production-regression.md`](runs/2026-08-13-production-regression.md).
- Expected impact: increase eligible commercial/content pages available to organic and AI systems.
- Recommended change: classify the 47 URL-level GSC verdicts, keep `/thank-you/` and other intended exclusions separate, and obtain explicit operator approval before any sitemap resubmission or priority URL indexing requests.
- Effort: Medium
- Confidence: Medium
- Verification: Canonry/GSC coverage before/after over the normal recrawl window; record intended exclusions separately.

### SEO-003 — Re-run visibility baseline with the adopted query basket

- Status: Candidate
- Category: AEO / measurement
- Scope: the existing commercial query basket and provider set.
- Problem: the latest visibility run was still running when the 2026-08-10 plan was written, so it is not a valid new baseline.
- Evidence: prior plan explicitly excludes that incomplete run from claims; historical baseline has 83% query-level mention coverage, 42% citation coverage, and 86% mention share, but requires comparable follow-up checks.
- Expected impact: establish a trustworthy post-remediation mention/citation baseline and expose mention losses or citation gaps.
- Recommended change: after operator confirmation and deployment/parity verification, run the real sweep and report mention coverage/share before citation coverage; do not expand the query basket during this baseline.
- Effort: Low operator time / quota-consuming
- Confidence: High
- Verification: completed Canonry sweep ID, query-basket denominator, provider breakdown, and comparison with the last completed run.

### SEO-004 — Page-specific content improvements on verified weak templates

- Status: Candidate
- Category: content quality; search intent; entity/schema
- Scope: only routes that remain weak after parity is disproven as the cause.
- Problem: technical audit factors remain weak on parts of the site, including E-E-A-T, definition blocks, FAQ content, structured data, extractability, and freshness.
- Evidence: the 2026-08-10 audit reports the affected factors and explicitly says not to duplicate schema or generic copy before parity is resolved.
- Expected impact: improve qualified relevance and AI extractability on existing commercial pages.
- Recommended change: add or refine visible, page-specific answers, process steps, FAQs, authorship/trust context, and matching schema only where the content is truthful and useful.
- Effort: Medium–High
- Confidence: Medium
- Verification: rendered UI review, accessibility/responsive checks, build/artifact validation, live parity, and before/after Canonry page factors.

## Reconciled / not prioritized

- Generic sitewide audit-support copy: Rejected. Earlier browser review found duplication and unrelated content; native page-specific framework work is the safer direction.
- Net-new location pages, mass article expansion, backlink campaigns, and provider-specific citation campaigns: Candidate, deferred until search/visibility/conversion evidence identifies a distinct opportunity.
- Follow-up fix: normalized the two source links that caused the known `/services` and `/resources` trailing-slash redirects; deployment is now live-verified on 2026-08-14.
