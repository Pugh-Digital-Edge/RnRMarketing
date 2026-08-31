# SEO/AEO Backlog

Last reconciled: 2026-08-28
Source run: [`2026-08-24-weekly-opportunity.md`](runs/2026-08-24-weekly-opportunity.md)
Article implementation run: [`2026-08-24-weekly-article-implementation.md`](runs/2026-08-24-weekly-article-implementation.md)
Regression run: [`2026-08-24-production-regression.md`](runs/2026-08-24-production-regression.md)
Current regression run: [`2026-08-28-production-regression.md`](runs/2026-08-28-production-regression.md)
Weekly implementation run: [`2026-08-27-weekly-plan-implementation.md`](runs/2026-08-27-weekly-plan-implementation.md)

Status values: Candidate · Planned · In Progress · Deployed · Measuring · Validated · Rejected · Superseded

## Prioritized work

### SEO-001 — Resolve Canonry/live/source parity on the audited cluster

- Status: Measuring
- Category: deployment / production parity; technical
- Scope: representative `/services/`, generated industry/service, `/resources/`, `/schedule/`, `/thank-you/`, and `/restoration-marketing/` routes, then the full affected cluster.
- Problem: the prior `/thank-you/`, trailing-slash, four-page metadata, and PPC contextual-link parity defects are resolved in live production. The 2026-08-25 service-page refactor remains committed at `5429a0a`; its normalized SEO output matches live. The current HEAD `98edc6f` adds lead-phone handling and is also present on the checked `/contact/` and `/schedule/` live forms.
- Evidence: on 2026-08-28, 96/96 live sitemap URLs returned 200 with titles, descriptions, self-canonicals, one H1, parseable JSON-LD, and the same primary LocalBusiness entity; 98 unique same-origin HTML targets had no broken links or redirects. Live `/thank-you/` and `/restoration-marketing/` are 200 with `noindex, nofollow` and are not sitemap-listed; `/resources/water-damage-restoration-marketing/` remains live, canonical, indexable, and sitemap-listed. Live robots, `llms.txt`, `llms-full.txt`, and sitemap artifacts match the current local build after line-ending normalization. The eight refactored service pages have identical normalized visible text, headings, metadata, schema/entity signals, and link sets versus the local build; raw HTML byte sizes differ because the live artifact retains additional compiled styling/markup. The live `/services/ppc/` page contains the repaired approved contextual link to `/water-damage-restoration/ppc/`. Observed live deployment headers expose Netlify request IDs but no stable build ID. Canonry audit `8dd953a4-4c60-4527-b6d6-1e68fad32431` completed 2026-08-27 at 88/100 across 98 pages with 0 errors.
- Hypothesis: maintaining a stable, technically valid live artifact prevents deployment noise from contaminating search and AI measurement.
- Approval state: the weekly implementation was approved on 2026-08-27 and is deployed and production-verified.
- Deployment commit/build ID: `0bc7e2bb7133950e1a3a3aee5e7ab100ec9e87ae`; Netlify exposes no stable deployment build ID. `bab467b2b4b7eaef65e21c64b88d372740c62539` contains the article source.
- Expected impact: measure the intended snippet and intent changes against a live, stable artifact and avoid attributing stale-deployment effects to content.
- Recommended change: hold the production-verified `0bc7e2b` artifact stable and measure the scoped interventions. Treat raw HTML byte differences as artifact details unless they produce a rendered signal mismatch; do not open a broad technical or content rewrite from the one-point Canonry score change.
- Effort: Low, measurement/operator decision pending
- Confidence: High
- Verification: the post-deployment 96-URL crawl, 98-target internal-link crawl, local/live SEO-signal comparison, scoped desktop/mobile rendering, browser console, production build/postbuild checks, and fresh Canonry technical audit all passed their applicable gates. Measurement due 2026-09-24 for SEO-005/SEO-007; no search outcome is claimed yet.
- 2026-08-25 recheck: live remained 96/96 HTTP 200 with 98/98 internal same-origin targets returning 200 and no redirects; the eight dirty service-page H1/content differences and the local missing PPC contextual link remain pre-deployment only. No production regression or source mutation was introduced.
- 2026-08-27 post-deployment verification: commit `0bc7e2b` is live. All 96 sitemap pages passed the title, description, self-canonical, one-H1, JSON-LD, and indexability checks; local/live signal mismatches were 0; all 98 internal HTML targets returned 200 without redirects. Canonry technical audit `8dd953a4-4c60-4527-b6d6-1e68fad32431` completed at 88/100 across 98 pages with 0 skipped and 0 errored; the one-point aggregate decrease coincided with one additional audited page, while content extractability remains the only cross-cutting partial factor.
- 2026-08-28 recheck: the repaired `/services/ppc/` → `/water-damage-restoration/ppc/` link is present in current source, local build, and live HTML. All 96 sitemap pages and 98 internal HTML targets remain healthy; meaningful page-signal parity is 96/96 after normalizing HTML entities, and AI-access artifacts match after line-ending normalization. No new source-code, deployment, configuration, indexing, or content regression was found.

### SEO-002 — Improve intended index coverage after parity is stable

- Status: Measuring
- Category: indexing
- Scope: the current 96-URL live sitemap, reconciled against stored URL-level GSC inspection verdicts and intended exclusions.
- Problem: Canonry's stored whole-site 52/100 Google headline is stale and mixes current sitemap URLs with obsolete or intentionally excluded URLs; current URL-level evidence still shows concentrated Google coverage gaps on industry hubs.
- Evidence: a bounded fresh inspection on 2026-08-27 covered 23 commercially relevant URLs: Google returned 14 `Submitted and indexed`, 5 `Crawled - currently not indexed`, and 4 `URL is unknown to Google`; the stored whole-site rollup now reads 53 indexed / 47 not indexed / 0 deindexed across 100 URLs, up from 52/48 with no deindexed rows. All eight generic service pages, the homepage, `/services/`, the approved article, `/water-damage-restoration/ppc/`, and two representative generated pages were indexed. Five industry hubs were crawled-not-indexed; two industry hubs and two generated pages were unknown in the bounded sample. The article moved from the stale `URL is unknown to Google` state to `Submitted and indexed` in Google. Bing inspection now covers 38 URLs: 37 indexed and 1 unknown; the article remains the unknown URL. No sitemap submission, indexing request, or full-site sync was run.
- Hypothesis: current URL-level inspection will separate eligible pages needing indexing attention from stale summary buckets and intended exclusions.
- Approval state: the bounded read/inspection sample was approved and completed on 2026-08-27. No sync, sitemap submission, or indexing request was authorized or run.
- Deployment commit/build ID: not applicable to the stored coverage baseline; the article source is in `bab467b2b4b7eaef65e21c64b88d372740c62539`.
- Expected impact: increase eligible commercial/content pages available to organic and AI systems.
- Recommended change: treat the 23-URL sample as the current decision baseline. Prioritize evidence review for the five crawled-not-indexed industry hubs before considering content or submission work; keep unknown pages separate from crawled-not-indexed pages. Do not rewrite healthy indexed service pages or submit excluded routes.
- Effort: Medium
- Confidence: High for the fresh 23-URL sample; Medium for whole-site coverage because no full 96-URL inspection was run.
- Verification: repeat the same bounded set after a meaningful recrawl window and compare exact URL-level verdicts. No submission or indexing request should be made until the affected page's intent, internal links, and deployed signals are reviewed. Next checkpoint: 2026-09-25.

### SEO-003 — Re-run visibility baseline with the adopted query basket

- Status: Measuring
- Category: AEO / measurement
- Scope: the existing commercial query basket and provider set.
- Problem: the first comparable 42-query refresh shows a large mention-coverage decline that must be confirmed against sampling volatility before it drives page changes.
- Evidence: completed run `30969b56-2bc9-49cc-bba3-4cee92a4e36e` used the same 42 queries, three providers, and served models as the 2026-08-10 baseline (126 snapshots; comparison marked comparable with no query-set change). Mention Coverage fell from 27/42 (64%) to 5/42 (12%); Canonry reports 22 lost-mentioned queries and no gained-mentioned queries. Non-brand Mention Share rose from 4/31 (13%) to 5/29 (17%), but the denominator contracted, so it does not offset the coverage loss. Citation Coverage moved from 4/42 (10%) to 3/42 (7%), with two gained and three lost citation queries. Current provider pairs: Claude 4 mentions/1 citation, OpenAI 1/1, Gemini 0/2. The same models were served in both runs. The technical audit, live crawl, and fresh indexing sample do not show a broad deployment or indexability failure. Under Aero's regression playbook, n=1 per provider is insufficient to call the loss durable.
- Hypothesis: one unchanged-basket sweep will restore a comparable mention-first baseline; a later basket review can improve business/query alignment without corrupting that comparison.
- Approval state: approved and completed on 2026-08-27. The first attempt `badc9ee5-71d6-41a2-92e9-0a9b083c30bd` failed when the local Canonry service restarted and is excluded; the completed retry is the valid comparison. No basket mutation occurred.
- Deployment commit/build ID: not applicable; measurement intervention only.
- Expected impact: establish a trustworthy post-remediation mention/citation baseline and expose mention losses or citation gaps.
- Recommended change: do not react with a broad rewrite. Flag the 22 mention losses for monitoring, preserve the fixed basket, and seek approval for one confirmation sweep after an appropriate cooldown/window. If losses persist, diagnose the highest-commercial queries first for competitor displacement and surface-specific gaps; keep mention loss primary and citation loss secondary.
- Effort: Low operator time / quota-consuming
- Confidence: High that the point-in-time decline is measured comparably; Low that it is durable because each query/provider has only two observations across the comparison window.
- Verification: repeat the unchanged basket after approval, then use per-query/provider mention rates and competitor mention-share displacement to confirm or dismiss the regression. Next checkpoint: 2026-09-04. The cancelled and failed partial attempts are not valid baselines.

### SEO-004 — Page-specific content improvements on verified weak templates

- Status: Measuring
- Category: content quality; search intent; entity/schema
- Scope: verified indexed commercial pages with measurable query proximity: `/water-damage-restoration/ppc/`, `/services/retargeting/`, `/services/web-design/`, and `/services/social-media-marketing/`.
- Problem: these pages had meaningful impressions at positions 2.8-19.3 but produced no GSC clicks in the stored 2026-07-12 to 2026-08-07 window. The reviewed page-specific metadata/intent intervention is deployed, but no comparable post-deployment search window exists yet; the current dirty worktree proposes a separate rewrite on two of these pages.
- Evidence: GSC baseline: water-damage PPC query clusters included 139 impressions at position 8.87, 124 at 15.35, and 109 at 19.96; retargeting had 99 impressions at 2.76; web design had 46 impressions at 7.50; social media had 108 impressions at 19.32. On 2026-08-24, live titles/descriptions for all four URLs still match the measured deployment, all remain indexable/canonical/one-H1/JSON-LD-valid, and stored GSC inspection still marks all four `Submitted and indexed`. The dirty local build changes H1/schema/content output on `/services/retargeting/` and `/services/social-media-marketing/` without changing live. Observed deployed source commit remains `e31b744` (including reviewed `abf7b7f` changes).
- Hypothesis: page-specific snippets and visible intent alignment can improve qualified CTR on already-visible, indexed pages without broad template rewrites.
- Approval state: approved and deployed for the `e31b744` artifact; additional dirty-worktree rewrites are Awaiting approval and excluded from the current measurement window.
- Deployment commit/build ID: observed source commit `e31b744`; Netlify build ID unavailable.
- Expected impact: improve click-through and ranking relevance on already-visible, indexed commercial pages before creating new content.
- Recommended change: make no additional content change in this check. Measure the already-deployed artifact; if the dirty rewrites are later approved and deployed, restart the post-deployment comparison window and verify the four pages again. Do not add FAQ/schema or rewrite whole templates for audit-score reasons.
- Effort: Medium–High
- Confidence: High for the snippet defects and search opportunity; Medium for ranking impact.
- Verification: pre/post GSC query-page CTR and position over comparable 28-day windows, rendered snippet/content review, build/artifact validation, live parity, and later Canonry mention/citation checks. Deployed artifact parity passed live on 2026-08-24; dirty local rewrite parity is pending approval/deployment. Measurement due 2026-09-18 only if the measured `e31b744` artifact remains unchanged; no search/AEO outcome is claimed yet.
- 2026-08-25 recheck: all four live SEO-004 URLs still serve the reviewed page-specific title/description and remain indexable, canonical, one-H1, JSON-LD-valid, and stored `Submitted and indexed`. Dirty local H1/content drift remains unapproved and undeployed; no post-deployment search outcome is claimed.

The weekly queue tracks the four page-level candidates under this umbrella as SEO-004a (water-damage PPC), SEO-004b (retargeting), SEO-004c (web design), and SEO-004d (social-media marketing). These are report sub-items, not additional backlog records.

### SEO-005 — Consolidate core agency and PPC intent ownership

- Status: Measuring
- Category: search intent / cannibalization; internal-link weakness
- Scope: homepage, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, and supporting about/industry pages.
- Problem: core commercial queries surface across too many pages, diluting the clearest landing-page signal, and the previously observed generic-to-specialist PPC contextual-link omission required repair. The link is now restored; the remaining item is measurement of intent ownership and query-page distribution.
- Evidence: stored GSC window shows `restoration marketing` across six pages (794 impressions), `restoration marketing agency` across six pages (635), `restoration digital marketing agency` across four pages (353), `restoration ppc services` across six pages (328), and `water damage restoration ppc` across three pages (194). The 2026-08-25 known-good run recorded the live `/services/ppc/` → `/water-damage-restoration/ppc/` link; the 2026-08-27 omission was repaired in deployed commit `0bc7e2b`. On 2026-08-28, the link is present in current source, local build, and live HTML; the specialist page still links back, and the full live crawl remains 98 unique same-origin targets with no broken links or redirects.
- Hypothesis: clearer primary-page ownership and contextual linking will concentrate broad agency and generic-versus-specialist PPC relevance without removing useful routes.
- Approval state: approved, deployed, and production-verified on 2026-08-27.
- Deployment commit/build ID: `0bc7e2bb7133950e1a3a3aee5e7ab100ec9e87ae`; Netlify build ID unavailable.
- Expected impact: strengthen the homepage for agency intent and route generic PPC versus water-damage-specific PPC searches to clearer destinations without removing useful pages.
- Recommended change: hold the verified one-link repair stable and make no additional link, redirect, deindexing, or broad content change until query-page behavior is remeasured.
- Effort: Medium
- Confidence: Medium
- Verification: the link is present exactly once in source, local production build, and live HTML. The production crawl passed 96/96 sitemap pages and 98/98 internal HTML targets with zero redirects or failures; local/live SEO-signal mismatches were zero. Measure GSC query-by-page distribution, impressions/clicks/position over a comparable 28-day window. Measurement due: 2026-09-24.
- 2026-08-25 recheck: live `/services/ppc/` still links to `/water-damage-restoration/ppc/`, while the dirty local build still omits that link. Preserve the live intervention before any approved deployment.
- 2026-08-27 deployment: commit `0bc7e2b` restored the contextual link through the shared service component. Desktop/mobile rendering, followability, browser console, production crawl, canonical/indexability, and local/live parity all passed.
- 2026-08-28 recheck: the SEO-005 link remains present in source, local build, and live HTML. No further change is recommended; keep the repaired artifact stable through the 2026-09-24 measurement date.

### SEO-006 — Reconcile water-damage marketing article publication

- Status: Measuring
- Approval state: retrospectively approved on 2026-08-27 through the operator's instruction to complete the weekly plan. The 2026-08-24 production verification is the accepted baseline; no search/AEO outcome is claimed yet.
- Category: search-intent/content gap; entity, citation, and AEO weakness.
- Scope: query `water damage restoration marketing`; source article and expected production URL `/resources/water-damage-restoration-marketing/`; supporting industry, service, and resource links.
- Problem: Canonry and GSC support a distinct operator-focused water-damage restoration marketing resource, but the article and cover entered `origin/main` in a mixed-scope commit without an explicitly approved backlog item. Production verification is now complete, but the closed-loop approval and measurement stages remain incomplete.
- Evidence baseline: stored GSC evidence is 155 impressions, 0 clicks, and average position 48.21 for the prior `/industries` target. The article is live, self-canonical, one-H1, JSON-LD-valid, indexable, sitemap-listed, and source-parity verified. Fresh Google inspection on 2026-08-27 moved the exact article URL from `URL is unknown to Google` to `Submitted and indexed`; Bing remained unconfirmed (`inIndex: null`). In completed comparable Canonry run `30969b56-2bc9-49cc-bba3-4cee92a4e36e`, `water damage restoration marketing` remained unmentioned and uncited across all three providers. That immediate point-in-time result is not a causal outcome of publication and does not justify rewriting the article.
- Hypothesis: a dedicated B2B guide can better serve informational intent than the thin commercial industry hub while supporting qualified restoration-marketing decisions and avoiding duplication with the vertical services page.
- Expected impact: create a clearer organic and AI-answer source for the query and route readers to relevant water-damage, lead-tracking, PPC, SEO, website, reputation, retargeting, and social-advertising services. No outcome is claimed.
- Recommended change: keep the approved article stable through the measurement window. Monitor the exact query/page in GSC and the fixed Canonry basket; do not rewrite, duplicate, or request indexing merely because the first comparable AEO run remains zero.
- Effort: Low for review and verification; Medium if revision is requested.
- Confidence: Medium because intent and indexing evidence are strong, but no post-publication search or AEO improvement is established.
- Implementation ID: `bab467b2b4b7eaef65e21c64b88d372740c62539` on `main`; `origin/main` contained the commit on 2026-08-24. The commit includes unrelated files, so it is not treated as an automation-scoped article commit.
- Deployment expectation: `https://remediationrestorationmarketing.com/resources/water-damage-restoration-marketing/` is live-verified on 2026-08-24 and appears consistent with repository commit `bab467b`; Netlify exposed no stable provider build ID.
- Measurement due date: 2026-09-21, using the accepted 2026-08-24 production verification as the baseline.
- Verification method: approval record; production HTTP/indexability/canonical/render/schema and source-parity checks; exactly one visible FAQ block and one synchronized FAQPage schema source; internal-link resolution; comparable GSC query/page window; and a later operator-approved fixed-basket Canonry sweep reporting Mention Coverage/Share separately from Citation Coverage.

### SEO-007 — Clarify social-media advertising intent and snippet

- Status: Measuring
- Approval state: approved, deployed, and production-verified on 2026-08-27.
- Category: search intent / content quality; high-impression weak CTR.
- Scope: `/services/social-media-advertising/`; query `facebook ads for fire damage restoration` and closely matching restoration paid-social intent.
- Problem: the page has a measurable page-two opportunity, but live metadata uses a generic title and a truncated description that pivots into unrelated services. The visible live page also retains generic conclusion/FAQ framing.
- Evidence baseline: stored GSC data through 2026-08-14 shows 40 impressions, 0 detailed-row clicks, and average position 17.68 for `facebook ads for fire damage restoration` on this URL. Direct live review on 2026-08-24 found title `Restoration Social Media Advertising | R&R Marketing` and description `Convert emergency water, fire, and mold damage leads with targeted Facebook and Instagram ads. Explore SEO, PPC, web design, and lead tracking built.` The dirty user worktree already contains an uncommitted `ServiceHero`/`ServiceDepth` refactor for this route; it is preserved and not treated as approved or deployed.
- Hypothesis: a complete, service-specific snippet and visible paid-social mechanism/proof path can improve query relevance and qualified CTR without changing page ownership or adding unsupported claims.
- Expected impact: improve page-two relevance and click capture for a discrete existing service page; the measured impression base is smaller than SEO-004a/b.
- Recommended change: hold the deployed narrow snippet/hero alignment stable. Do not expand into a broad rewrite or add schema without supported visible content; measure the exact query/page over a comparable 28-day window.
- Effort: Low–Medium after the existing refactor settles.
- Confidence: Medium–High for the snippet/intent defect; Medium for ranking or CTR impact.
- Deployment commit/build ID: `0bc7e2bb7133950e1a3a3aee5e7ab100ec9e87ae`; Netlify build ID unavailable.
- Measurement due date: 2026-09-24.
- Verification method: reviewed diff; successful production build and postbuild AEO check; desktop/mobile rendered review with no overflow; no browser console warnings/errors; exact live title and 152-character description; self-canonical/indexable/one-H1/JSON-LD-valid output; zero local/live signal mismatches; fresh Google state `Submitted and indexed`. Measure comparable 28-day query-page GSC performance before claiming impact.

### SEO-009 — Publish a Local Services Ads guide for restoration companies

- Status: In Progress
- Approval state: **Auto-approved by weekly article automation on 2026-08-31** after the stored-evidence, winnability, duplication, factual-support, image, and validation gates passed.
- Category: search-intent/content gap; internal-link support; entity, citation, and AEO weakness.
- Scope: queries `how does local service ads work for damage restoration`, `local service ads for restoration companies`, and `restoration local service ads`; new canonical resource `/resources/local-services-ads-for-restoration-companies/`; supporting PPC, lead-tracking, web-design, reputation, SEO, retargeting, social-advertising, water-damage, and lead-generation pages.
- Problem: the site has commercial PPC/LSA service pages but no dedicated operator-focused resource explaining LSA eligibility, verification, service-area controls, ranking inputs, lead handling, credits, and booked-job measurement. Canonry consistently finds competitor sources for the informational query while the project is neither mentioned nor cited.
- Evidence baseline: stored Canonry target `tgt_15i6eaw` from completed run `30969b56-2bc9-49cc-bba3-4cee92a4e36e` is `ownable` with winnability `1.0` and medium action confidence. The 30-day and 90-day stored views both show 0/2 mentioned and 0/2 cited for the exact query; Canonry content gaps report a 100% miss rate with six cited competitor domains. Stored GSC rows through 2026-08-22 show 34 impressions, 0 clicks, and weighted average position 27.59 across the related `local service ads for restoration companies` and `restoration local service ads` family, split between `/services/ppc/` and `/water-damage-restoration/ppc/`. Missing conversion and fresh post-publication evidence are unavailable, not zero.
- Hypothesis: a distinct, primary-source-backed educational guide can satisfy informational LSA intent without replacing the commercial PPC service pages, consolidate supporting internal links, and create a more useful owned source for organic and answer-engine retrieval.
- Expected impact: establish one clear informational target for restoration LSA questions, help owners evaluate operational fit, and route qualified readers to PPC and lead-tracking services. No ranking, lead, mention, citation, or revenue outcome is claimed.
- Recommended change: publish the 1,966-word article with Matt Pugh authorship, one cover image, one synchronized four-question FAQ block/schema source, Google primary-source citations, and natural internal links. Keep commercial management intent on `/services/ppc/` and avoid a second near-duplicate LSA article.
- Effort: Medium.
- Confidence: Medium–High for the content and citation gap; Medium for organic/AEO impact because exact-query GSC demand is sparse and no post-publication comparison exists.
- Deployment commit/build ID: article and required implementation safeguards committed as `1b13b66e4d6f4483b9bbc15f466847fbb965d0ce` on `main` and pushed to `origin/main` on 2026-08-31; Netlify build ID and live deployment verification remain unavailable.
- Measurement due date: 28 days after production verification; provisionally 2026-09-28 if the URL is verified live on 2026-08-31.
- Verification method: successful `astro check` and production build; rendered one-H1, BlogPosting, visible FAQ/FAQPage synchronization, author, image, sitemap, and internal-link checks; regression-automation production parity and indexability verification; then comparable GSC query/page results and a later operator-approved fixed-basket Canonry run with Mention Coverage/Share reported separately from Citation Coverage.

## Reconciled / not prioritized

- Generic sitewide audit-support copy: Rejected. Earlier browser review found duplication and unrelated content; native page-specific framework work is the safer direction.
- Net-new location pages, mass article expansion, backlink campaigns, and provider-specific citation campaigns: Candidate, deferred until search/visibility/conversion evidence identifies a distinct opportunity.
- Follow-up fix: normalized the two source links that caused the known `/services` and `/resources` trailing-slash redirects; deployment is now live-verified on 2026-08-14.
- Production regression monitoring: commit `0bc7e2b` is production-verified. The live 96-URL surface and 98-target internal crawl are healthy with zero local/live SEO-signal mismatches. SEO-005 and SEO-007 are now `Measuring`; no search-performance outcome is claimed.
- Weekly opportunity reconciliation: SEO-006 is approved, Google-indexed, and measuring from the accepted August baseline. SEO-002 now has a fresh bounded 23-URL sample. SEO-003 has a completed comparable sweep showing a large point-in-time mention loss that requires confirmation before content action. No duplicate page/content IDs were created, and no sitemap submission or indexing request was made.
