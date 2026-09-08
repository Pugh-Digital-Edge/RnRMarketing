# Weekly SEO/AEO Opportunity Queue

## Run metadata

- Run time: 2026-08-31T10:44:35-04:00 (America/New_York)
- Run type: read-only, approval-ready closed-loop SEO/AEO opportunity analysis
- Production URL: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Workflows used: Canonry stored-read baseline and AEO analysis; Aero weekly-review, content-gap, regression, and reporting guidance.
- Mutations not performed: Canonry sweep/probe/discovery/audit, Google/Bing sync or URL inspection, indexing or sitemap submission, connector changes, deployment, CDN purge, source/content edits, commit, or push.

## Sources

- Project control plane: `AGENTS.md`, `docs/seo/README.md`, `docs/seo/strategy.md`, `docs/seo/backlog.md`, `docs/seo/learnings.md`, automation memory, and recent records through `2026-08-31-production-regression.md`.
- Canonry CLI 4.177.1 stored project overview, report, visibility stats, 90-day gaps, Google performance/coverage/status, Bing performance/coverage, technical state, backlinks, GA4 status, traffic status, and project doctor.
- Current live responses for the homepage, ranked opportunity pages, approved article, robots, sitemap, and the noindex paid landing route; the concurrent production-regression run supplied the full 96-page/98-target parity result.
- Repository route/content/link inspection and a read-only link extraction across the 96 live sitemap pages.
- The downstream article automation concurrently created SEO-009 and committed it as `1b13b66`; it was preserved and excluded from this upstream queue's attribution and ranked recommendations.

## Baseline and deltas

### AI mention coverage and share — primary

- Latest completed visibility run remains `30969b56-2bc9-49cc-bba3-4cee92a4e36e`, completed 2026-08-27. No new sweep or probe exists after the last run.
- Mention Coverage is 5/42 (12%), down from 27/42 (64%) on the comparable 2026-08-10 run: 22 lost-mentioned queries and no gained-mentioned queries.
- Non-brand Mention Share is 5 project mentions out of 29 project-plus-competitor mentions (17%), versus 4/31 (13%). The denominator contracted, so the share increase does not offset the mention-coverage loss.
- Current mentions by provider are Claude 4/42, OpenAI 1/42, and Gemini 0/42. The same configured models and unchanged 42-query basket were used in both comparable runs.
- Four-run pooled visibility is 73 mentions across 288 checked snapshots (25.35%). This pooled rate is context, not a substitute for the fixed-basket point comparison.
- Aero's regression playbook requires more than one post-baseline observation per provider before calling the 22-query loss durable.

### Citation coverage — secondary and separate

- Citation Coverage is 3/42 (7%), down from 4/42 (10%). Two queries gained a citation and three lost one.
- Current citations by provider are Claude 1/42, OpenAI 1/42, and Gemini 2/42. Citation behavior is not used to infer mentions.
- Four-run pooled citation evidence is 15/288 (5.21%). No causal citation outcome is claimed.

### Google Search Console

- Canonry's latest stored report now covers 2026-07-24 through 2026-08-22: 14,637 impressions, 11 clicks, 0.075% CTR, and average position 34.36. The previous weekly report covered 2026-07-16 through 2026-08-14: 15,439 impressions, 9 clicks, 0.058% CTR, and position 32.79. These are overlapping rolling windows, so the apparent click/CTR change is not a causal intervention result.
- The detailed query-page rows still omit/anonymize some aggregate clicks; a surfaced row with zero clicks is not treated as proof of sitewide zero clicks.
- Exact current query-page opportunities: retargeting 122 impressions at position 2.47; water-damage restoration PPC 158 at 10.34, water-damage PPC 145 at 15.37, and restoration PPC experts 133 at 18.53; disaster restoration web design 45 at 9.44; fire-damage web design 24 at 4.04; social advertising 43 at 18.93; homepage restoration marketing plan 77 at 18.45. All surfaced exact rows have zero clicks.
- Core intent remains distributed: `restoration marketing` 8 pages / 809 impressions; `restoration marketing agency` 7 / 579; `restoration digital marketing agency` 4 / 338; `restoration ppc services` 6 / 340; `water damage restoration ppc` 3 / 188; `restoration marketing plan` 4 / 106.

### Indexing, technical, live, and repository evidence

- Google stored coverage remains 53 indexed / 47 not indexed / 0 deindexed across 100 URLs; last inspection 2026-08-27 and last sync 2026-08-24. The current whole-site read groups all 47 not-indexed rows as unknown, while the accepted bounded 23-URL record distinguishes five crawled-not-indexed industry hubs and four unknown URLs. This discrepancy is a measurement/reconciliation limitation, not a page-state claim.
- Bing remains 37 indexed / 1 unknown across 38 inspections. Bing performance is sparse, duplicate-prone, and has no comparable date window.
- Latest technical audit remains 88/100 across 98 pages with 0 skipped and 0 errors. Content Extractability is the only cross-cutting partial factor; it does not support a broad rewrite.
- The 2026-08-31 production-regression run passed 96/96 sitemap pages and 98/98 internal HTML targets, with zero meaningful local/build/live SEO-signal mismatches, at commit `2c7c545`. During this queue, the downstream article automation advanced HEAD to `1b13b66`; the new LSA article returned HTTP 404 at 10:44 ET and the live sitemap remained at 96 URLs, so that newer commit is not production-verified.
- The fire-damage specialist web-design page is live, stored indexed, and receives 11 live inbound links versus 115 for the generic web-design page. The fire-damage marketing guide currently links to the generic page, creating one specific intent-aligned linking opportunity.

### Analytics, local, authority, and crawler evidence

- GA4, Google Business Profile, and server-side traffic are not connected. Conversion, AI-referral, local-search, review, and crawler-log outcomes are unavailable, not zero.
- Backlinks remain stale and sparse: three Common Crawl linking domains from the 2026 Apr–Jun release, last queried 2026-07-17; no connected backlink source. This is insufficient to prioritize a campaign over measured existing-page work.
- Canonry winnability coverage is 60 of 279 cited-surface domains (22%) and the project lacks an ICP for discovery. Discovery would be quota-consuming and was not run.

## Findings and diagnoses

1. The largest AI movement is still a measurement-first regression: 22 mention losses on one comparable post-baseline sweep, with no broad production, indexing, or model-set defect found.
2. Existing indexed pages near positions 2–19 remain the highest-confidence organic opportunities, but most are already inside active measurement windows; stacking new content changes would contaminate attribution.
3. Google indexing evidence has a stored-source discrepancy between the current rollup and the accepted bounded inspection. It must be reconciled with the same URL set before page rewrites or submissions.
4. Core commercial intent remains distributed across multiple pages. The repaired PPC link is healthy, so the next step is measurement, not redirects, deindexing, or broad rewriting.
5. One new existing-page opportunity is supported: the indexed fire-damage web-design specialist is near position 4 and has materially less contextual support than the generic page, while a fire-specific guide links generically.
6. The approved water-damage article is live and indexed but remains unmentioned and uncited in the only post-publication fixed-basket observation; elapsed time and sample size do not support a rewrite.

## Ranked opportunities

Priority approximates visibility potential × ranking proximity × business value × confidence ÷ effort. Existing measured pages and measurement integrity outrank net-new content.

### 1. SEO-003 — Confirm the AI mention regression

- URL/query: unchanged 42-query commercial basket across Claude, OpenAI, and Gemini.
- Problem classification: entity/citation/AEO measurement defect; possible mention regression.
- Evidence: Mention Coverage 27/42 (64%) → 5/42 (12%) with 22 losses and no gains; non-brand Mention Share 4/31 (13%) → 5/29 (17%); Citation Coverage 4/42 (10%) → 3/42 (7%). Query set and configured models are comparable, but there is only one post-baseline observation per provider.
- Expected impact: distinguish a durable category-visibility loss from provider sampling noise before any page change.
- Recommended action: after explicit operator approval and on or after 2026-09-04, run one real unchanged-basket confirmation sweep. Preserve the query/provider set and report Mention Coverage and non-brand Mention Share first, Citation Coverage second.
- Effort: Low operator time; quota-consuming.
- Confidence: High that the point decline is measured; Low that it is durable.
- Approval state: **Awaiting approval**; no sweep is authorized by this report.
- Measurement due date: next eligible checkpoint 2026-09-04.
- Verification method: completed run ID; unchanged basket/provider/model continuity; per-query/provider mention rates and sample sizes; competitor mention-share displacement; citation deltas separately.

### 2. SEO-004b — Preserve and measure retargeting CTR opportunity

- URL/query: `/services/retargeting/`; `retargeting for restoration companies`.
- Problem classification: high-impression weak CTR; search-intent opportunity currently measuring.
- Evidence: exact row moved from 113 impressions at position 2.81 in the overlapping window ending 2026-08-14 to 122 at 2.47 through 2026-08-22, with zero surfaced clicks. The page is stored indexed and live-valid.
- Expected impact: highest click-capture potential by ranking proximity.
- Recommended action: make no content change before the 2026-09-18 gate; compare the deployed intervention over a non-overlapping or otherwise controlled 28-day window.
- Effort: Low.
- Confidence: High for opportunity; outcome pending.
- Approval state: measurement authorized under SEO-004; additional content work is not approved.
- Measurement due date: 2026-09-18.
- Verification method: exact query-page impressions, clicks/CTR, and weighted position; live/source parity; restart the window if the page changes.

### 3. SEO-004a — Preserve and measure water-damage PPC cluster

- URL/query: `/water-damage-restoration/ppc/`; water-damage PPC/LSA query cluster.
- Problem classification: high-impression weak CTR; search intent; cannibalization risk currently measuring.
- Evidence: latest exact rows show 158 impressions at position 10.34 for `water damage restoration ppc`, 145 at 15.37 for `water damage ppc`, and 133 at 18.53 for `restoration ppc experts`, all with zero surfaced clicks. The URL is stored indexed; the live generic-to-specialist link is healthy.
- Expected impact: largest measured near-page-one commercial cluster.
- Recommended action: keep the page and repaired contextual link stable through the current measurement gate; do not merge, redirect, or broadly rewrite PPC pages.
- Effort: Low for measurement.
- Confidence: High for opportunity; Medium for CTR/ranking outcome.
- Approval state: measurement authorized; additional PPC content/link changes are not approved.
- Measurement due date: 2026-09-18 for SEO-004 and 2026-09-24 for SEO-005 ownership.
- Verification method: exact query-page GSC comparison, query distribution across the generic/specialist pages, live parity, then later fixed-basket mention/citation evidence.

### 4. SEO-002 — Reconcile intended index coverage on the same bounded set

- URL/query: the approved 23-URL sample, especially the seven industry hubs and four representative generated pages.
- Problem classification: indexing; stored measurement reconciliation defect.
- Evidence: accepted 2026-08-27 sample recorded 14 indexed, 5 crawled-not-indexed, and 4 unknown. The current whole-site read reports 53/47/0 and groups all 47 not-indexed rows as unknown. Live technical eligibility is healthy.
- Expected impact: separate pages needing content/internal-link review from unknown/stale records and intentional exclusions.
- Recommended action: at the 2026-09-25 checkpoint and after explicit approval, repeat exactly the same bounded URL set. Do not sync/submit broadly or rewrite from the aggregate headline.
- Effort: Medium.
- Confidence: High for the discrepancy and live eligibility; Medium for current URL-level Google state.
- Approval state: **Awaiting approval** for the same-set inspection; no submission or indexing request is approved.
- Measurement due date: 2026-09-25.
- Verification method: URL-by-URL state table against the accepted 23-URL baseline, preserving crawled-not-indexed versus unknown and excluding intentional noindex routes.

### 5. SEO-008 — Add one fire-guide-to-specialist web-design link

- URL/query: `/fire-damage-restoration/web-design/`; `web design for fire damage restoration`; source `/resources/fire-damage-restoration-marketing/`.
- Problem classification: internal-link weakness; search intent.
- Evidence: exact specialist row has 24 impressions at position 4.04 versus 14 at 3.86 in the overlapping earlier window; zero surfaced clicks. The page is stored indexed and live-valid. Live extraction found 11 inbound links to the specialist versus 115 to generic web design, and the fire guide currently links to the generic page.
- Expected impact: reinforce the exact specialist already near the top of page one with minimal page-body or architecture risk.
- Recommended action: after approval, change or add one natural fire-specific contextual link from the fire guide to the specialist. Preserve the generic page elsewhere; do not expand links sitewide.
- Effort: Low.
- Confidence: Medium–High for opportunity/intent match; Medium for search impact.
- Approval state: **Awaiting approval**; candidate only.
- Measurement due date: 28 days after an approved deployment and live verification.
- Verification method: reviewed one-link diff, build/postbuild, source/build/live followability, unchanged SEO signals, full internal crawl, then exact query-page 28-day comparison.

### 6. SEO-005 — Measure core agency/PPC intent ownership

- URL/query: homepage, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`; core agency/PPC clusters plus `restoration marketing plan`.
- Problem classification: search-intent/cannibalization; internal-link weakness already repaired.
- Evidence: six reviewed clusters span 3–8 pages and 106–809 impressions. The homepage owns 77 of 106 `restoration marketing plan` impressions at position 18.45. The approved PPC contextual link remains present in source/build/live, and the full internal crawl is healthy.
- Expected impact: concentrate relevance on intended landing pages without deleting useful routes.
- Recommended action: hold the deployed link and content stable through 2026-09-24. Reassess query-page distribution before proposing any ownership copy/link change; do not redirect or deindex pages.
- Effort: Low measurement / Medium if a later scoped change is supported.
- Confidence: High for distributed intent; Medium for cannibalization impact.
- Approval state: current measurement authorized; any new ownership/link intervention is **Awaiting approval** after the checkpoint.
- Measurement due date: 2026-09-24.
- Verification method: comparable query-by-page impressions, clicks/CTR, and position; source/build/live link parity and full internal crawl.

### 7. SEO-004c — Preserve and measure generic web-design relevance

- URL/query: `/services/web-design/`; `disaster restoration web design`.
- Problem classification: high-impression weak CTR; search-intent opportunity currently measuring.
- Evidence: 45 impressions at position 9.44 through 2026-08-22 versus 47 at 7.62 in the overlapping prior window, with zero surfaced clicks. The page is stored indexed and live-valid; sparse Bing samples support related page-one visibility but lack a date window.
- Expected impact: page-one CTR/relevance opportunity on an existing indexed service page.
- Recommended action: hold the page stable through 2026-09-18; keep generic ownership distinct from the proposed fire-specific link in SEO-008.
- Effort: Low.
- Confidence: Medium–High for opportunity; outcome pending.
- Approval state: measurement authorized; additional generic-page content change is not approved.
- Measurement due date: 2026-09-18.
- Verification method: exact query-page GSC comparison, bounded Bing support only, and live/source parity.

### 8. SEO-007 — Preserve and measure social-advertising intent

- URL/query: `/services/social-media-advertising/`; `facebook ads for fire damage restoration`.
- Problem classification: high-impression weak CTR; search-intent/content-quality intervention currently measuring.
- Evidence: 43 impressions at position 18.93 through 2026-08-22 versus 42 at 17.48 in the overlapping prior window, with zero surfaced clicks. The approved title/description and hero alignment remain live, indexed, and parity-verified.
- Expected impact: page-two relevance and qualified click capture.
- Recommended action: make no additional copy or schema change through 2026-09-24; the small overlapping-window movement is not an outcome call.
- Effort: Low.
- Confidence: Medium–High for opportunity; Medium for outcome.
- Approval state: measurement authorized; additional content/schema work is not approved.
- Measurement due date: 2026-09-24.
- Verification method: exact query-page 28-day comparison, live metadata/content parity, and later mention/citation evidence if the fixed basket includes the intent.

### 9. SEO-006 — Keep the water-damage marketing article in measurement

- URL/query: `/resources/water-damage-restoration-marketing/`; `water damage restoration marketing`.
- Problem classification: search-intent/content gap; entity/citation/AEO weakness currently measuring.
- Evidence: the article is live, sitemap-listed, stored indexed, and technically valid. The latest fixed-basket run still has 0/3 mentions and 0/3 citations for the query; the pre-publication GSC baseline was 155 impressions at position 48.21 on `/industries`.
- Expected impact: establish a distinct informational source without duplicating or rewriting it before systems have had a meaningful recrawl/measurement window.
- Recommended action: keep the approved article stable through 2026-09-21. Do not rewrite, duplicate, or request indexing from the first zero AEO observation.
- Effort: Low measurement.
- Confidence: Medium.
- Approval state: approved and measuring; additional article work is not approved.
- Measurement due date: 2026-09-21.
- Verification method: exact query/page GSC comparison, stable live/source parity, and a later separately approved fixed-basket sweep reporting mention first and citation second.

## Actions taken

- Read the required project control files, automation memory, recent weekly/implementation/regression records, and the concurrent 2026-08-31 production-regression record.
- Performed stored Canonry, GSC, Bing, integration, backlink, repository, and direct live reads only.
- Reconciled existing SEO-002 through SEO-007 records with the advanced GSC window and explicit approval gates.
- Added SEO-008 as the only new stable candidate introduced by this upstream queue; no duplicate content/page item was created.
- Preserved concurrent repository/article work without modification. SEO-009 was committed by the downstream article automation during this run and remains a separate in-progress intervention, not an upstream queue recommendation.

## Limitations

- AI visibility is current only through 2026-08-27; confirmation requires explicit operator approval and quota.
- GSC performance is stored only through 2026-08-22; compared windows overlap and are not causal. Detailed rows do not expose all aggregate clicks.
- Google full-site coverage is stale and internally coarser than the accepted bounded inspection record; no fresh inspection or sync was authorized.
- Bing performance has no comparable date window and duplicate query rows; it is supporting evidence only.
- GA4, GBP, and server traffic are unavailable. Backlinks are stale/sparse and no source is connected.
- The live-link counts include repeated template/navigation links and are comparative, not counts of unique source pages.
- The repository changed concurrently through other tasks. The production-regression baseline covers `2c7c545`, while downstream article commit `1b13b66` was not yet live at the 10:44 ET read; its URL returned 404 and production verification remains pending.

## Verification status

- Canonry runtime/configuration: available; Node 24.18.0, Canonry 4.177.1, config present. Doctor reached the project; GSC/Bing access passed, while GBP remains unconnected and GA4/traffic/backlink-source gaps remain limitations.
- Current verified production technical baseline: passed by the 2026-08-31 regression run at `2c7c545` (96/96 sitemap pages, 98/98 internal targets, source/build/live parity). The later `1b13b66` article commit is source-only until production verification.
- Ranked-page live checks: HTTP 200, one H1, indexable, and current titles present on the sampled opportunity pages; stored indexing passed for the exact ranked URLs.
- Search/AEO outcomes: not claimed.
- Quota-consuming or external mutations: none.
