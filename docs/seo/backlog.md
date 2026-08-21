# SEO/AEO Backlog

Last reconciled: 2026-08-21
Source run: [`2026-08-21-production-regression.md`](runs/2026-08-21-production-regression.md)

Status values: Candidate · Planned · In Progress · Deployed · Measuring · Validated · Rejected · Superseded

## Prioritized work

### SEO-001 — Resolve Canonry/live/source parity on the audited cluster

- Status: Measuring
- Category: deployment / production parity; technical
- Scope: representative `/services/`, generated industry/service, `/resources/`, `/schedule/`, `/thank-you/`, and `/restoration-marketing/` routes, then the full affected cluster.
- Problem: the prior `/thank-you/`, trailing-slash, and four-page metadata parity defects are resolved in live production. One local-only blog URL remains outside the live sitemap and still needs a separate publication decision.
- Evidence: on 2026-08-21, 95/95 live sitemap URLs returned 200 with titles, descriptions, self-canonicals, one H1, parseable JSON-LD, and the same primary LocalBusiness entity; 97 unique same-origin HTML targets had no broken links or redirects. Live `/thank-you/` and `/restoration-marketing/` are 200 with `noindex, nofollow` and are not sitemap-listed. The four SEO-004 pages now match the local page-specific titles/descriptions. Local `dist` has 96 sitemap URLs versus 95 live, with only `/resources/water-damage-restoration-marketing/` extra. Robots, `llms.txt`, `llms-full.txt`, and sitemap index artifacts match after line-ending normalization. Observed live source/deployment parity corresponds to local HEAD `e31b744`; Netlify exposed request IDs but no build ID. Canonry audit `8341b64b-100f-49d8-8835-e8c27a91f446` completed 2026-08-20 at 89/100 across 97 pages with 0 errors.
- Expected impact: measure the intended snippet and intent changes against a live, stable artifact and avoid attributing stale-deployment effects to content.
- Recommended change: no further source or content change for this defect. Begin the post-deployment measurement window and decide separately whether the local-only blog post is ready for publication; do not rewrite content or add schema to compensate for a resolved parity issue.
- Effort: Low, measurement/operator decision pending
- Confidence: High
- Verification: live recheck passed on 2026-08-21 for the four affected pages, local/live sitemap membership, `/thank-you/`, `/restoration-marketing/`, the full live crawl, internal links, normal-vs-crawler responses, Markdown alternates, `npm run build`, independent `scripts/postbuild-aeo.mjs`, and Canonry's completed audit state. Measurement due 2026-09-18 for a comparable 28-day GSC window; no search/AEO outcome is claimed yet.

### SEO-002 — Improve intended index coverage after parity is stable

- Status: Measuring
- Category: indexing
- Scope: the current 95-URL live sitemap, reconciled against stored URL-level GSC inspection verdicts and intended exclusions.
- Problem: Canonry's 52 indexed / 47 not-indexed headline spans 99 stored URLs, while the current live sitemap contains 95 URLs. Reconciled live-sitemap states are 25 `Submitted and indexed`, 25 `Crawled - currently not indexed`, and 45 `URL is unknown to Google`; the stored set also contains four URLs outside the current sitemap (`/tos/`, `/privacy/`, the obsolete `/water-damage-restoration/`, and intended-exclusion `/admin/`).
- Evidence: read-only Canonry coverage remains the 2026-08-17 read: 52 indexed / 47 not indexed across 99 stored URLs, with 0 deindexed rows. Reconciled to the current 95-URL live sitemap, the stored states remain 25 `Submitted and indexed`, 25 `Crawled - currently not indexed`, and 45 `URL is unknown to Google`; the four extra stored URLs are `/tos/`, `/privacy/`, obsolete `/water-damage-restoration/`, and intended-exclusion `/admin/`. All four SEO-004 target URLs remain stored as `Submitted and indexed` and `INDEXING_ALLOWED`. Bing remains only a limited stored sample and is not a full-site coverage result. [`2026-08-21-production-regression.md`](runs/2026-08-21-production-regression.md).
- Expected impact: increase eligible commercial/content pages available to organic and AI systems.
- Recommended change: keep the URL-level reconciliation as the current read-only baseline; with operator approval, refresh/inspect the current sitemap if current status is needed, then prioritize eligible commercial pages by demand/business value. Keep `/admin/`, `/thank-you/`, and other intended exclusions out of any submission batch. Do not rewrite pages merely because Canonry's summary bucket is misleading.
- Effort: Medium
- Confidence: High for the stored URL-level classification; Medium for current index status because the last sync/inspection is 2026-08-17 and coverage can change after the read.
- Verification: report exact URL-level verdict counts against the current live sitemap, intended exclusions, and a comparable post-recrawl delta. No sync, submission, or indexing request was run in this check.

### SEO-003 — Re-run visibility baseline with the adopted query basket

- Status: Measuring
- Category: AEO / measurement
- Scope: the existing commercial query basket and provider set.
- Problem: the completed 2026-08-10 42-query run is now the latest baseline, but it is stale and cannot be compared directly with the earlier 12-query baseline. Canonry read surfaces also disagree on query-level gap counts, so per-query change claims need a comparable refresh.
- Evidence: the latest completed comparable window is still 3 runs / 162 snapshots through 2026-08-10, with 68 mentioned (41.98%) and 11 cited (6.79%); provider totals are Claude 26/54 mentioned and 2/54 cited, Gemini 20/54 and 5/54, OpenAI 22/54 and 4/54. The fixed-basket run `14ee1d3c-8670-4a3a-9138-d36105e15a77` remains cancelled and is not comparable. Do not infer a current mention or citation regression from stale or cancelled data; [`2026-08-21-production-regression.md`](runs/2026-08-21-production-regression.md).
- Expected impact: establish a trustworthy post-remediation mention/citation baseline and expose mention losses or citation gaps.
- Recommended change: after operator confirmation, run one real sweep with the fixed 42-query basket and current provider set. Report query-level Mention Coverage and Mention Share first, Citation Coverage second, and reconcile `overview`, `evidence`, and gap output before opening per-query content work.
- Effort: Low operator time / quota-consuming
- Confidence: High
- Verification: completed Canonry sweep ID, query-basket denominator, provider breakdown, and comparison with the last completed run. Fixed-basket run `14ee1d3c-8670-4a3a-9138-d36105e15a77` was cancelled after it stalled at 104/126 complete snapshots (Gemini 42/42, OpenAI 42/42, Claude 20/42). It is not a valid new baseline; resolve the Claude provider stall and rerun the unchanged basket before reporting deltas.

### SEO-004 — Page-specific content improvements on verified weak templates

- Status: Measuring
- Category: content quality; search intent; entity/schema
- Scope: verified indexed commercial pages with measurable query proximity: `/water-damage-restoration/ppc/`, `/services/retargeting/`, `/services/web-design/`, and `/services/social-media-marketing/`.
- Problem: these pages had meaningful impressions at positions 2.8-19.3 but produced no GSC clicks in the stored 2026-07-12 to 2026-08-07 window. The reviewed page-specific metadata/intent intervention is now deployed, but no comparable post-deployment search window exists yet.
- Evidence: GSC baseline: water-damage PPC query clusters included 139 impressions at position 8.87, 124 at 15.35, and 109 at 19.96; retargeting had 99 impressions at 2.76; web design had 46 impressions at 7.50; social media had 108 impressions at 19.32. On 2026-08-21, live titles/descriptions for all four URLs matched the local build, all remained indexable/canonical/one-H1/JSON-LD-valid, and stored GSC inspection still marks all four `Submitted and indexed`. Observed deployment/source commit: `e31b744` (includes the reviewed `abf7b7f` changes).
- Expected impact: improve click-through and ranking relevance on already-visible, indexed commercial pages before creating new content.
- Recommended change: make no additional content change now. Start the comparable post-deployment GSC measurement window, keeping the generic `/services/ppc/` page distinct from the water-damage PPC page. Do not add FAQ/schema or rewrite whole templates for audit-score reasons.
- Effort: Medium–High
- Confidence: High for the snippet defects and search opportunity; Medium for ranking impact.
- Verification: pre/post GSC query-page CTR and position over comparable 28-day windows, rendered snippet/content review, build/artifact validation, live parity, and later Canonry mention/citation checks. Source/build validation passed 2026-08-21; deployment and production parity passed live on 2026-08-21. Measurement due 2026-09-18; no search/AEO outcome is claimed yet.

The weekly queue tracks the four page-level candidates under this umbrella as SEO-004a (water-damage PPC), SEO-004b (retargeting), SEO-004c (web design), and SEO-004d (social-media marketing). These are report sub-items, not additional backlog records.

### SEO-005 — Consolidate core agency and PPC intent ownership

- Status: Measuring
- Category: search intent / cannibalization; internal-link weakness
- Scope: homepage, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, and supporting about/industry pages.
- Problem: core commercial queries surface across too many pages, diluting the clearest landing-page signal. This is a cannibalization risk, not proof that every secondary impression is harmful.
- Evidence: stored GSC window shows `restoration marketing` across six pages (794 impressions), `restoration marketing agency` across six pages (635), `restoration digital marketing agency` across four pages (353), `restoration ppc services` across six pages (328), and `water damage restoration ppc` across three pages (194). On 2026-08-21, the live generic PPC page links contextually to the water-damage PPC page and the specialist page links back; the full live crawl found 97 unique same-origin targets with no broken links or redirects.
- Expected impact: strengthen the homepage for agency intent and route generic PPC versus water-damage-specific PPC searches to clearer destinations without removing useful pages.
- Recommended change: retain the deployed primary landing-page map and contextual PPC links; make no additional link or redirect change until query-page behavior is remeasured. Avoid blanket redirects or deindexing.
- Effort: Medium
- Confidence: Medium
- Verification: GSC query-by-page distribution, impressions/clicks/position over a comparable 28-day window, internal-link crawl, and live canonical/indexability checks. Deployment and live-link verification passed 2026-08-21; measurement due 2026-09-18.

## Reconciled / not prioritized

- Generic sitewide audit-support copy: Rejected. Earlier browser review found duplication and unrelated content; native page-specific framework work is the safer direction.
- Net-new location pages, mass article expansion, backlink campaigns, and provider-specific citation campaigns: Candidate, deferred until search/visibility/conversion evidence identifies a distinct opportunity.
- Follow-up fix: normalized the two source links that caused the known `/services` and `/resources` trailing-slash redirects; deployment is now live-verified on 2026-08-14.
- Production regression monitoring: the 2026-08-21 check verified the SEO-004 metadata and SEO-005 PPC-link interventions live; SEO-001, SEO-004, and SEO-005 are now `Measuring` with a 2026-09-18 measurement due date. SEO-002 remains an indexing opportunity with the 2026-08-17 read-only URL-level reconciliation; SEO-003 remains non-comparable because the latest fixed-basket visibility attempt was cancelled. No new backlog ID was created.
