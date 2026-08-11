# SEO/AEO Backlog

Last reconciled: 2026-08-11  
Source run: [`2026-08-11-production-regression.md`](runs/2026-08-11-production-regression.md)

Status values: Candidate · Planned · In Progress · Deployed · Measuring · Validated · Rejected · Superseded

## Prioritized work

### SEO-001 — Resolve Canonry/live/source parity on the audited cluster

- Status: Planned
- Category: deployment / production parity; technical
- Scope: representative `/services/`, generated industry/service, `/resources/`, `/schedule/`, and `/thank-you/` routes, then the full affected cluster.
- Problem: the completed Canonry audit scored 50 pages at 28/100 even though the 2026-08-11 live crawl found the expected signals on every sitemap URL. A separate concrete mismatch remains: live `/thank-you/` is indexable and included in the sitemap, while current source/build marks it `noindex, nofollow` and excludes it.
- Evidence: technical run `d519ac38-b993-403b-b929-7066103e0723`; all 96 live sitemap URLs returned 200 with self-canonicals, descriptions, one H1, and valid JSON-LD; tested Canonry-agent responses were byte-identical to normal HTML; [`2026-08-11-production-regression.md`](runs/2026-08-11-production-regression.md).
- Expected impact: restore reliable measurement and prevent a conversion-confirmation page from entering the index.
- Recommended change: deploy the already-present `/thank-you/` exclusion/noindex behavior through the normal operator-approved release path; then run a confirmed Canonry technical recheck to determine whether the old 28-point cluster was stale or parser-related.
- Effort: Medium
- Confidence: High
- Verification: live `/thank-you/` meta robots and sitemap membership, normal-vs-crawler response comparison, `npm run build`, then an operator-confirmed Canonry technical audit.

### SEO-002 — Improve intended index coverage after parity is stable

- Status: Candidate
- Category: indexing
- Scope: 51 URLs last reported not indexed out of 94 in the connected GSC property, plus intended exclusions that must not enter the sitemap.
- Problem: last recorded coverage is 43 indexed / 51 not indexed (45.7% indexed), with aggregate reason `URL is unknown to Google`; individual verdicts must be inspected before choosing remedies. Live `/thank-you/` is also currently indexable and in the 96-URL production sitemap despite being an intended exclusion in current source/build.
- Evidence: synced 2026-08-10 coverage recorded in the Canonry audit plan; live/source mismatch in [`2026-08-11-production-regression.md`](runs/2026-08-11-production-regression.md). Current Canonry/GSC reads were unavailable because the local Canonry service could not load its Node 24 `better-sqlite3` binding.
- Expected impact: increase eligible commercial/content pages available to organic and AI systems.
- Recommended change: first deploy and verify the intended `/thank-you/` exclusion; then export and classify representative GSC verdicts before any sitemap resubmission or priority URL indexing requests.
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
