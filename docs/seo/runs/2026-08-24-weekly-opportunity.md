# Weekly SEO/AEO Opportunity Queue

## Run metadata

- Run time: 2026-08-24T12:10:00-04:00 (America/New_York)
- Run type: read-only, approval-ready closed-loop SEO/AEO opportunity analysis
- Production URL: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Workflows used: Canonry stored-read baseline and AEO analysis; Aero weekly-review and content-gap orchestration; Impeccable clarify guidance for the one new page-copy candidate.
- Mutations not performed: Canonry sweep/probe/discovery/audit, GSC/Bing sync or inspection, indexing or sitemap submission, connector changes, deployment, CDN purge, source/content edits, commit, or push.

## Sources

- Canonry CLI 4.177.1 stored project overview, analytics gaps, report, visibility stats, runs, technical score, GSC status/coverage/performance, Bing status/coverage/performance, backlink sources/list, GA4 status, traffic status, and project doctor.
- Current direct production responses, 96-URL sitemap crawl, titles/descriptions/canonicals/H1/JSON-LD checks, robots/LLM files, and internal-link source counts.
- Repository strategy, backlog, learnings, recent SEO runs, article-implementation record, current route source, and read-only worktree diff.
- Current dirty service-template worktree changes were preserved and are not treated as approved, deployed, or attributable to this run.

## Baseline and deltas

### AI mention coverage and share — primary

- Latest completed visibility run remains `595fca88-de9d-474e-8854-f7319346e0b5`, completed 2026-08-10. No fresh visibility run exists after the previous weekly queue.
- Query-level Mention Coverage: 27/42 (64%).
- Non-brand Mention Share: 4 project mention snapshots out of 31 project-plus-competitor mention snapshots (13%). This is Canonry's current non-brand definition. The 64% Mention Share previously recorded used an older pooled definition and is not a performance delta.
- Snapshot-level mention health: 49/126 (38.89%) for the latest completed 42-query run. The pooled three-completed-run window contains 68/162 mentions (41.98%): Claude 26/54, Gemini 20/54, OpenAI 22/54.
- Current read surfaces remain internally inconsistent: `overview` scores report 2 mention gaps, while `analytics --feature gaps` returns 5 mention gaps and 33 not-mentioned queries. This prevents approval-ready per-query content conclusions from the stale run.

### Citation coverage — secondary and separate

- Query-level Citation Coverage: 4/42 (10%).
- Snapshot-level citation health on the latest completed run: 5/126 (3.97%). The pooled three-run window contains 11/162 citations (6.79%): Claude 2/54, Gemini 5/54, OpenAI 4/54.
- Citation evidence is still dated 2026-08-10. No citation gain, loss, or outcome is claimed.

### Search, indexing, technical, and production evidence

- Canonry report GSC period: 2026-07-16 through 2026-08-14; 15,439 impressions, 9 clicks, 0.0583% CTR, and average position 32.79. The detailed query-page rows omit/anonymize some clicks, so page-query rows showing zero clicks are not treated as a sitewide zero-click total.
- Strong current 28-day query-page opportunities: retargeting 104 impressions at position 2.91; water-damage PPC 142 at 9.77, 132 at 15.54, 120 at 18.76, and 42 at 12.10; web design 45 at 8.07; social-media advertising 40 at 17.68; social-media management 34 at 19.71 and 27 at 17.89. All listed rows have zero attributed clicks in the stored detailed data.
- Core intent remains distributed: `restoration marketing` spans 8 pages / 815 impressions; `restoration marketing agency` 6 / 619; `restoration digital marketing agency` 4 / 334; `restoration ppc services` 6 / 336; `water damage restoration ppc` 3 / 186.
- Stored GSC inspection remains dated 2026-08-17: 52 indexed / 47 not indexed across 99 stored URLs. Against the live 96-URL sitemap, 25 are stored `Submitted and indexed`, 25 `Crawled - currently not indexed`, 45 `URL is unknown to Google`, and the newly published `/resources/water-damage-restoration-marketing/` has no stored verdict. Four stored URLs are outside the live sitemap.
- Direct live verification found 96/96 sitemap URLs returning 200 with titles, descriptions, self-canonicals, one H1, and parseable JSON-LD. The newly published water-damage marketing article is live, indexable, canonical, and sitemap-listed. Canonry's latest stored technical audit remains `8341b64b-100f-49d8-8835-e8c27a91f446`, 89/100, 97 pages, 0 errors, completed 2026-08-20.
- Bing is connected, but coverage is only a 10-URL sample and performance has no comparable date window. Backlinks remain stale/sparse: three Common Crawl linking domains from the 2026 Apr–Jun release, last synced 2026-07-17; Bing stored zero.
- GA4, GBP, and server-side traffic are not connected. Conversion, AI-referral, local-search, review, and crawler-log outcomes are unavailable.

## Findings and diagnoses

1. AI visibility is a measurement defect first: the baseline is stale, the last fixed-basket attempt was cancelled, Mention Share's definition changed, and mention-gap surfaces disagree.
2. Indexing remains a stale-measurement/indexing problem, now including one live article with no stored verdict; live technical eligibility is clean.
3. The already-deployed SEO-004 page changes still have strong pre-deployment query proximity, but the post-deployment 28-day window is not due until 2026-09-18. Rewriting them now would contaminate measurement.
4. Core agency/PPC intent remains distributed, and the current dirty `/services/ppc/` source omits the approved live specialist link. This is a pre-deployment parity risk, not a live internal-link defect.
5. `/services/social-media-advertising/` is the only new existing-page candidate supported strongly enough to enter the queue: measurable page-two demand plus a directly verified truncated/cross-service live description. The user's uncommitted refactor already changes this route, so any SEO copy work must be coordinated rather than duplicated.
6. The water-damage marketing article is live and technically valid, closing the production-verification portion of SEO-006. Retrospective approval and measurement remain open; no success is claimed.

## Ranked opportunities

Priority approximates visibility potential × ranking proximity × business value × confidence ÷ effort. Existing measured pages and measurement integrity outrank net-new content.

### 1. SEO-003 — Restore a comparable AI visibility baseline

- URL/query: unchanged 42-query commercial basket and current provider set.
- Problem classification: entity/citation/AEO measurement defect.
- Evidence: 64% Mention Coverage, 13% non-brand Mention Share, then 10% Citation Coverage, all from the 2026-08-10 run; `overview` reports 2 mention gaps while analytics returns 5; the fixed-basket attempt remains cancelled.
- Expected impact: distinguish real mention-share/citation opportunities from reporting and denominator artifacts.
- Recommended action: after explicit operator approval, run one real unchanged-basket sweep; label Mention Coverage and non-brand Mention Share separately, then Citation Coverage. Do not change the basket before the comparison run.
- Effort: Low operator time; quota-consuming.
- Confidence: High.
- Verification method: completed run ID, unchanged query/provider denominator, provider and query evidence, mention-first deltas, citation deltas second, and reconciliation of overview/evidence/gaps.

### 2. SEO-002 — Refresh current-sitemap URL-level index evidence

- URL/query: current 96-URL sitemap, prioritizing eligible commercial/proof pages and the new water-damage article.
- Problem classification: indexing; stale measurement.
- Evidence: stored 2026-08-17 verdicts reconcile to 25 indexed, 25 crawled-not-indexed, 45 unknown, and one live URL with no stored verdict; live technical eligibility passes 96/96.
- Expected impact: identify eligible pages that truly need indexing attention while excluding stale/out-of-sitemap records and intentional noindex routes.
- Recommended action: with explicit operator approval, inspect the current sitemap before any submission decision. Do not rewrite pages from the 52/47 headline.
- Effort: Medium.
- Confidence: High for reconciliation; Medium for current Google state.
- Verification method: fresh URL-level verdict table against all 96 live URLs, exact state deltas, intended exclusions, and a later comparable recrawl window.

### 3. SEO-004b — Measure the deployed retargeting snippet intervention

- URL/query: `/services/retargeting/`; `retargeting for restoration companies`.
- Problem classification: high-impression weak CTR; search-intent gap, currently measuring.
- Evidence: 104 impressions, zero detailed-row clicks, average position 2.91 through 2026-08-14; the page is stored indexed and its page-specific metadata is live. The dirty worktree proposes a separate rewrite that is not deployed.
- Expected impact: highest CTR-capture potential by ranking proximity.
- Recommended action: make no additional content change before the 2026-09-18 measurement gate. If the dirty rewrite is approved/deployed, restart the 28-day window.
- Effort: Low for measurement.
- Confidence: High for the opportunity; outcome pending.
- Verification method: comparable pre/post query-page CTR, impressions, and position plus live parity.

### 4. SEO-004a — Measure the deployed water-damage PPC intervention

- URL/query: `/water-damage-restoration/ppc/`; water-damage PPC/LSA cluster.
- Problem classification: high-impression weak CTR; search-intent/cannibalization risk, currently measuring.
- Evidence: zero detailed-row clicks with 142 impressions at position 9.77, 132 at 15.54, 120 at 18.76, 42 at 12.10, and 30 at 7.00. Live metadata is complete and page-specific.
- Expected impact: largest measured near-page-one commercial cluster.
- Recommended action: preserve the deployed page and wait for the comparable post-deployment window; keep generic PPC ownership distinct.
- Effort: Low for measurement.
- Confidence: High for opportunity; Medium for ranking/CTR outcome.
- Verification method: 28-day query-page GSC comparison, live/build parity, and later fixed-basket mention/citation evidence.

### 5. SEO-005 — Protect and measure primary agency/PPC intent ownership

- URL/query: homepage, `/services/`, `/services/ppc/`, and `/water-damage-restoration/ppc/`.
- Problem classification: cannibalization risk; pre-deployment internal-link/parity risk.
- Evidence: the five core query clusters span 3–8 pages and 186–815 impressions. Live generic/specialist PPC links are healthy, but the dirty local `/services/ppc/` rewrite omits the approved generic-to-specialist link.
- Expected impact: retain clearer generic-versus-specialist ownership and prevent regression before measurement.
- Recommended action: require review/approval of the dirty template refactor and preserve the live contextual PPC link before any deployment; do not add redirects or deindex pages.
- Effort: Low review / Medium measurement.
- Confidence: High for the link parity risk; Medium for cannibalization impact.
- Verification method: source/build/live link crawl and comparable query-by-page distribution after a stable 28-day window.

### 6. SEO-004c — Measure restoration web-design relevance

- URL/query: `/services/web-design/`; `disaster restoration web design`.
- Problem classification: high-impression weak CTR; search-intent gap, currently measuring.
- Evidence: 45 impressions, zero detailed-row clicks, average position 8.07; Bing also has sparse page-one related-query samples. Live metadata is page-specific and the page is stored indexed.
- Expected impact: page-one CTR/relevance opportunity with cross-engine support.
- Recommended action: hold the deployed artifact stable until 2026-09-18; do not stack another rewrite onto the open measurement window.
- Effort: Low for measurement.
- Confidence: Medium–High.
- Verification method: comparable GSC/Bing query performance, rendered/live parity, and conversion evidence when analytics becomes available.

### 7. SEO-007 — Clarify social-media advertising intent and snippet

- URL/query: `/services/social-media-advertising/`; `facebook ads for fire damage restoration`.
- Problem classification: high-impression weak CTR; search-intent/content-quality gap.
- Evidence: 40 impressions, zero detailed-row clicks, average position 17.68. Live title is generic and the description ends with cross-service/truncated wording. The current user worktree already refactors the page body but is unapproved and undeployed.
- Expected impact: improve relevance and qualified click capture for an existing discrete service page.
- Recommended action: after the active refactor is reviewed, approve a narrow page-specific title/description and visible mechanism/proof pass. Preserve factual claims and conversion usefulness; do not overwrite the user's work or add schema without matching visible content.
- Effort: Low–Medium.
- Confidence: Medium–High for the defect; Medium for outcome.
- Verification method: reviewed diff, build/AEO checks, rendered desktop/mobile review, live metadata/parity after deployment, and 28-day query-page GSC comparison.

### 8. SEO-006 — Close article approval and measurement governance

- URL/query: `/resources/water-damage-restoration-marketing/`; `water damage restoration marketing`.
- Problem classification: search-intent/AEO gap; approval/governance defect.
- Evidence: the article is now live, canonical, indexable, sitemap-listed, and internally linked; stored query evidence is 0/2 mentions and 0/2 citations, with 155 GSC impressions at position 48.21 on `/industries`. It entered `origin/main` without an explicit approved backlog intervention.
- Expected impact: establish an auditable baseline and avoid duplicate article creation; organic/AEO outcome remains unproven.
- Recommended action: approve or reject SEO-006 retrospectively. If approved, record the 2026-08-24 live verification and begin measurement; if rejected, require a separate authorized rollback decision.
- Effort: Low for governance/measurement.
- Confidence: High for the governance issue; Medium for content impact.
- Verification method: approval record, live/source parity on a stable worktree, comparable GSC query/page window, and later operator-approved fixed-basket mention/citation comparison.

### 9. SEO-004d — Measure social-media management intent

- URL/query: `/services/social-media-marketing/`; management query cluster.
- Problem classification: search-intent/content-quality gap, currently measuring.
- Evidence: 34 impressions at position 19.71 and 27 at 17.89 with zero detailed-row clicks; the broader `restoration social media` query has 120 impressions at 22.85. The deployed title/description are page-specific; a separate dirty rewrite is not deployed.
- Expected impact: page-two relevance and qualified CTR improvement.
- Recommended action: preserve the measured live artifact through 2026-09-18 unless the dirty rewrite is explicitly approved; then restart measurement.
- Effort: Low for measurement.
- Confidence: Medium.
- Verification method: comparable GSC query performance, live parity, and rendered content review.

## Actions taken

- Read and reconciled the current SEO control plane, including the concurrently added 2026-08-24 article implementation record.
- Performed only stored Canonry/search/integration reads and direct read-only production checks.
- Reconciled the 96th live URL against stale GSC inspection data.
- Added SEO-007 as the only new candidate; all other findings update existing stable IDs/sub-items.
- Verified the production state of SEO-006 without claiming search or AEO success.
- Preserved all unrelated dirty service-page/component changes; no source/content implementation was made.

## Limitations

- AI visibility ends 2026-08-10; the fixed-basket rerun requires explicit approval.
- GSC performance ends 2026-08-14 and inspection ends 2026-08-17; no current sync/inspection was authorized.
- Query-page rows do not expose all nine aggregate GSC clicks, so detailed zero-click evidence is limited to those surfaced rows.
- Bing performance lacks a comparable date window and coverage is a 10-URL sample.
- Backlink data is stale and sparse; no authority campaign is prioritized.
- GA4, GBP, and server-side traffic are unavailable, so conversion, local-search, AI-referral, and crawler-log impact cannot be ranked.
- Search-engine cached render data lagged direct production on some titles; direct HTTP production responses were used for current parity.
- The worktree contains uncommitted user changes across service pages/components. No source/live comparison is attributed to this automation.

## Verification status

- Canonry runtime/configuration and stored reads: completed; doctor reports healthy GSC/Bing access, no GBP/GA4/traffic source, no connected backlink source, and low winnability coverage.
- Live sitemap/technical eligibility: passed for 96/96 URLs.
- SEO-006 article production state: live-verified; approval and outcome measurement pending.
- SEO-007: evidence-backed candidate only; implementation/deployment not performed.
- Search/AEO outcomes: not claimed.
- Quota-consuming or external mutations: none.
