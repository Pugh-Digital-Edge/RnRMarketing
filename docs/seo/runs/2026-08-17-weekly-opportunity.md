# Weekly SEO/AEO Opportunity Queue

## Run metadata

- Date: 2026-08-17
- Run type: closed-loop weekly SEO/AEO opportunity analysis using the latest available stored windows
- Production URL: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Workflows used: Canonry mention-first AEO analysis and indexing guidance; Aero weekly-review, content-gap, regression, and reporting guidance; Impeccable/browser guidance for live content and snippet verification
- Repository state: page-specific source changes are implemented locally; pre-existing untracked `.claude/` preserved
- External mutations performed after the initial analysis: GSC sync, Google/Bing sitemap inspection, and one fixed-basket Canonry visibility sweep attempt. The sweep was cancelled after Claude stalled at 20 of 42 queries; its 104 completed snapshots are not a comparable baseline. No indexing request, sitemap submission, deployment, CDN purge, backlink extraction, or GBP/GA4 connection was performed.

## Sources

- Canonry stored project overview, report, evidence, analytics gaps, visibility stats, technical score, GSC status/coverage/performance, Bing status/coverage/performance, backlink sources/list, GA4 status, traffic status, runs, and doctor output.
- Current live sitemap and direct live/browser checks of `/`, `/admin/`, `/services/ppc/`, `/services/seo/`, `/services/retargeting/`, `/services/web-design/`, `/services/social-media-marketing/`, and `/water-damage-restoration/ppc/`.
- Repository route/content metadata, generated-page template, service data, current `dist` internal links, and prior SEO run records.
- Durable strategy/backlog/learnings in `docs/seo/`.

## Baseline and deltas

### AI mention coverage and share — primary

- Latest completed visibility run: `595fca88-de9d-474e-8854-f7319346e0b5`, completed 2026-08-10.
- Query-level Mention Coverage: 27/42 (64%).
- Mention Share: 64% (49 project mentions of 76 project-plus-competitor mentions); the leading tracked competitor was `builtrightdigital.com` with five mention snapshots.
- Snapshot-level mention health: 49/126 checked query-provider pairs (38.9%). Provider mention rates were Claude 20/42 (47.6%), Gemini 15/42 (35.7%), and OpenAI 14/42 (33.3%).
- The historical 83% query-level mention coverage and 86% mention share used the earlier 12-query basket. It is not a valid before/after comparison with the 42-query run.

### Citation coverage — secondary and separate

- Query-level Citation Coverage: 4/42 (10%).
- Snapshot-level citation health: 5/126 query-provider pairs (4.0%). Provider cited rates were Claude 2/42, Gemini 1/42, and OpenAI 2/42.
- The historical 42% citation coverage used the 12-query basket and is not a valid delta against the current 42-query denominator.
- Canonry surfaces disagree on gap counts (`overview` reports 13 mention gaps; `analytics --feature gaps` returns 34). No per-query regression or content rewrite is justified from that disagreement without a comparable refresh.

### Search, indexing, technical, and other evidence

- Canonry report GSC period: 2026-07-12 through 2026-08-07; 13,929 impressions, 8 clicks, 0.057% CTR, average position 32.25. This is a stored window ending 10 days before the report date; the previous 28-day query-page window was absent from the local store, so no reliable search delta is claimed.
- Stored GSC inspection data was last synced/inspected 2026-08-10. Canonry's headline says 48 indexed / 47 not indexed, but URL-level reconciliation against today's 95-URL sitemap shows 21 `Submitted and indexed`, 25 `Crawled - currently not indexed`, 45 `URL is unknown to Google`, and four current case-study URLs with no stored inspection verdict.
- Latest technical baseline remains Canonry audit `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`: 89/100, 97 audited, zero errors, completed 2026-08-13. No technical regression was established today.
- Bing is connected and has 129 stored performance rows, but zero stored coverage inspections and no comparable period metadata in the read output.
- Backlink evidence is stale and sparse: Common Crawl release `cc-main-2026-apr-may-jun`, synced 2026-07-17, found three linking domains; Bing's stored backlink source found zero. No authority campaign is ranked from this incomplete baseline.
- GA4, GBP, and server-side traffic are not connected. Local-search, conversion, AI-referral, and crawler-log outcomes cannot be measured from Canonry today.

## Findings and diagnoses

1. The Canonry coverage headline masks three materially different URL-level states and a stale inspection-set mismatch. Classification: indexing plus measurement/parity defect.
2. Several indexed commercial pages have strong position proximity and zero clicks, with verified snippet/intent defects. Classification: search-intent/content gap, not technical/indexing.
3. Generic and specialist pages overlap for core agency/PPC queries. Classification: cannibalization risk and internal-link weakness.
4. Current AI mention/citation data is stale and internally inconsistent at the gap-count layer. Classification: AEO measurement defect; no substantive content rewrite is recommended from it.
5. No new production technical/parity regression was found in current spot checks; the live sitemap still has 95 URLs, representative canonicals/headings are present, and `/admin/` remains `noindex`.

## Ranked opportunities

The queue favors existing-page visibility, ranking proximity, business value, confidence, and lower effort. No net-new page is recommended.

### 1. SEO-002 — Reconcile and improve current-sitemap index coverage

- URL/query: current 95-URL sitemap; especially 25 crawled-not-indexed pages, 45 unknown pages, and four uninspected case studies.
- Problem classification: indexing; measurement/parity defect.
- Evidence: only 21 current sitemap URLs carry stored `Submitted and indexed` verdicts; 25 are `Crawled - currently not indexed`; 45 are unknown; four current case studies are missing from the inspection set. Four stored URLs are outside today's sitemap.
- Expected impact: make more eligible commercial and proof pages available to organic and AI systems, while avoiding submissions for intended exclusions.
- Recommended action: with operator approval, refresh/inspect the current sitemap first; then prioritize eligible commercial pages and case studies by demand and value. Keep `/admin/` and `/thank-you/` excluded. Do not treat the 48/47 summary as the URL-level truth.
- Effort: Medium.
- Confidence: High on stored classification; Medium on current status because the data is one week old.
- Verification method: fresh URL-level GSC verdict table against the live sitemap, followed by a comparable recrawl window and exact state-count delta.

### 2. SEO-004a — Fix the water-damage PPC snippet and clarify page ownership

- URL/query: `/water-damage-restoration/ppc/`; `water damage restoration ppc`, `water damage ppc`, `restoration ppc experts`, `ppc company for restoration companies`.
- Problem classification: search intent/content gap; cannibalization risk.
- Evidence: 139 impressions at position 8.87, 124 at 15.35, 109 at 19.96, and 33 at 12.00, all with zero clicks. The live meta description ends mid-thought (`...grow your.`). Related PPC intent also appears on `/services/ppc/` and `/`.
- Expected impact: highest near-term click opportunity in the measured set and clearer separation between generic PPC/LSA service intent and water-damage-specific intent.
- Recommended action: repair the generated description, make the title/snippet explicitly water-damage PPC + LSA, and differentiate the visible opening/process from `/services/ppc/`. Add only a few relevant contextual links to this specialist page.
- Effort: Low-Medium.
- Confidence: High for CTR/snippet opportunity; Medium for ranking movement.
- Verification method: rendered snippet review, build/live parity, query-page GSC CTR/position over a comparable 28-day window, and internal-link crawl.

### 3. SEO-004b — Improve retargeting SERP message before changing body depth

- URL/query: `/services/retargeting/`; `retargeting for restoration companies`.
- Problem classification: high-impression weak CTR; search-intent gap.
- Evidence: 99 impressions at average position 2.76 and zero clicks. The live description shifts from retargeting into unrelated SEO, PPC, web design, and lead tracking language.
- Expected impact: improve click capture from an already top-three query without requiring a broad page rewrite.
- Recommended action: replace the description with a specific retargeting value proposition for restoration companies and align the title/first visible answer with visitor qualification and use cases. Do not add generic FAQ/schema.
- Effort: Low.
- Confidence: High.
- Verification method: pre/post query CTR over comparable 28-day windows; confirm title/description in rendered live output and search snippets.

### 4. SEO-004c — Strengthen restoration web-design relevance and proof

- URL/query: `/services/web-design/`; `disaster restoration web design`, plus Bing `damage restoration website design`, `property manager focused restoration websites`, and `water damage restoration business website conversion`.
- Problem classification: search-intent/content gap.
- Evidence: GSC shows 46 impressions at position 7.50 and zero clicks. Bing independently shows four-impression samples at positions 3-6 for related website/conversion queries. The live title is the generic `Restoration Web Design | Remediation & Restoration Marketing`.
- Expected impact: improve CTR and relevance on an existing commercial page with cross-engine page-one evidence.
- Recommended action: make the title/description more outcome- and audience-specific, then surface truthful restoration-site proof and conversion requirements already supported by the site/case studies.
- Effort: Low-Medium.
- Confidence: Medium-High.
- Verification method: GSC and Bing query CTR/position, rendered page review, live/build parity, and conversion tracking once analytics is available.

### 5. SEO-004d — Refocus the social-media page on management intent

- URL/query: `/services/social-media-marketing/`; `restoration social media`, `restoration social media management`, `social media management for restoration companies`.
- Problem classification: search-intent/content quality gap.
- Evidence: 108 impressions at position 19.32, 26 at 17.35, and 21 at 14.10, all with zero clicks; Bing also shows `social media for restoration companies` at position 17. The live page uses generic `Conclusion` and sitewide restoration-marketing FAQ framing rather than a distinctive management deliverable/proof path.
- Expected impact: improve page-two proximity and qualified click relevance for a discrete service.
- Recommended action: tighten title/description for social-media management, replace generic conclusion/FAQ framing with a visible service-specific process, deliverables, boundaries, and truthful proof. Add matching schema only if the visible content warrants it.
- Effort: Medium.
- Confidence: Medium.
- Verification method: GSC/Bing query movement and CTR, rendered accessibility/responsive review, build/live parity, and page-factor recheck.

### 6. SEO-005 — Consolidate core agency and PPC intent ownership

- URL/query: `/`, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`; core `restoration marketing`, `restoration marketing agency`, and PPC variants.
- Problem classification: cannibalization risk; internal-link weakness.
- Evidence: `restoration marketing` appears across six pages (794 impressions), `restoration marketing agency` across six (635), `restoration digital marketing agency` across four (353), `restoration ppc services` across six (328), and `water damage restoration ppc` across three (194). The generic service routes receive sitewide links from nearly every built page; the specialist water-damage PPC route has nine inbound-page sources in the current build.
- Expected impact: concentrate broad agency intent on the homepage and route generic versus specialist PPC searches to clearer landing pages.
- Recommended action: document an intent map, strengthen contextual anchors to the primary page for each cluster, and reduce ambiguous PPC/agency messaging on secondary pages. Do not redirect or deindex pages without a measured follow-up.
- Effort: Medium.
- Confidence: Medium; multiple page impressions are a risk signal, not conclusive cannibalization by themselves.
- Verification method: query-by-page GSC distribution and position/CTR over a comparable 28-day window, plus internal-link and canonical crawl.

### 7. SEO-003 — Establish a comparable AI mention/citation baseline

- URL/query: fixed 42-query commercial basket; current provider set.
- Problem classification: entity/citation/AEO measurement defect.
- Evidence: latest query-level Mention Coverage is 64% and Mention Share 64%; Citation Coverage is 10%. The prior 12-query metrics are not comparable, and Canonry gap surfaces disagree on whether there are 13 or 34 mention gaps.
- Expected impact: separate real mention-share opportunities from reporting artifacts and prevent unsupported content work.
- Recommended action: after explicit operator approval, run one real sweep without changing the query basket; lead with mention coverage/share, then citation coverage, and reconcile overview/evidence/gap output.
- Effort: Low operator time; quota-consuming.
- Confidence: High that measurement is needed; no claim that the metric will improve.
- Verification method: completed sweep ID, fixed denominator, provider breakdown, per-query evidence, and explicit comparison with the 2026-08-10 run.

## Actions taken

- Reconciled raw GSC URL verdicts against the current live sitemap and corrected the SEO-002 evidence record; the initial reconciliation did not submit or sync anything.
- Ranked seven existing-page/measurement opportunities and split the four SEO-004 page opportunities into traceable sub-items (SEO-004a–d).
- Added SEO-005 only for the newly evidenced cross-page intent/internal-link problem; no duplicate content item was created.
- Performed read-only live/browser checks and repository/internal-link analysis.
- Implemented the SEO-004 source changes: unique titles/descriptions and intent copy for retargeting, web-design, and social-media pages; water-damage PPC title/description and specialist positioning; and removal of generic FAQ blocks from the three affected service pages.
- Implemented the SEO-005 PPC-link ownership change: generic PPC now links contextually to the water-damage PPC page, and the specialist page links back to generic PPC.
- Built the site successfully: 100 pages and all post-build AEO artifacts generated.
- Refreshed GSC through 2026-08-14 and inspected the four changed production URLs: all are `Submitted and indexed`, indexable, and successfully fetched. Bing's sitemap inspection stopped after 10 URLs because the API returned HTTP 429 throttle responses; no Bing coverage conclusion was made from the partial batch.

## Limitations

- GSC performance and inspection data ends 2026-08-07/2026-08-10; the local store has no prior 28-day query-page window for a reliable delta.
- AI visibility last ran 2026-08-10; query-basket history is not comparable and current gap outputs conflict.
- Bing coverage is empty and its performance read does not expose a comparable date window.
- GA4, GBP, and server-side traffic are unavailable; no conversion, local-search, AI-referral, or crawler-log conclusion is made.
- Backlink data is sparse/stale and not strong enough to rank a campaign above the measured existing-page opportunities.
- Today's production check was targeted, not a new full 95-page crawl; the validated 2026-08-14 production baseline remains the full-crawl reference.

## Verification status

- Canonry/GSC/Bing/backlink/integration reads: completed without mutation.
- Live targeted page/snippet/canonical checks: completed.
- Live sitemap reconciliation: completed; 95 URLs.
- Technical production regression: not found in targeted checks; latest full validation remains 2026-08-14 and Canonry technical score remains 89/100 from 2026-08-13.
- Build/test: not run because no substantive code/content change was made.
- Search/AI outcome change: not claimed; requires comparable future measurement windows and operator-approved refreshes.
