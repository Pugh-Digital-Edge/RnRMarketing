# SEO/AEO Backlog

Last reconciled: 2026-08-25
Source run: [`2026-08-24-weekly-opportunity.md`](runs/2026-08-24-weekly-opportunity.md)
Article implementation run: [`2026-08-24-weekly-article-implementation.md`](runs/2026-08-24-weekly-article-implementation.md)
Regression run: [`2026-08-24-production-regression.md`](runs/2026-08-24-production-regression.md)
Current regression run: [`2026-08-25-production-regression.md`](runs/2026-08-25-production-regression.md)

Status values: Candidate · Planned · In Progress · Deployed · Measuring · Validated · Rejected · Superseded

## Prioritized work

### SEO-001 — Resolve Canonry/live/source parity on the audited cluster

- Status: Measuring
- Category: deployment / production parity; technical
- Scope: representative `/services/`, generated industry/service, `/resources/`, `/schedule/`, `/thank-you/`, and `/restoration-marketing/` routes, then the full affected cluster.
- Problem: the prior `/thank-you/`, trailing-slash, and four-page metadata parity defects are resolved in live production. The current dirty worktree contains a separate service-template rewrite that is not deployed and must not be treated as a live regression.
- Evidence: on 2026-08-24, 96/96 live sitemap URLs returned 200 with titles, descriptions, self-canonicals, one H1, parseable JSON-LD, and the same primary LocalBusiness entity; 98 unique same-origin HTML targets had no broken links or redirects. Live `/thank-you/` and `/restoration-marketing/` are 200 with `noindex, nofollow` and are not sitemap-listed; `/resources/water-damage-restoration-marketing/` is now live, canonical, indexable, and sitemap-listed. Live robots, `llms.txt`, `llms-full.txt`, and sitemap artifacts match the current local build after line-ending normalization. The dirty local build differs from live on eight service pages in H1/schema/content output, and local `/services/ppc/` omits the deployed contextual link to `/water-damage-restoration/ppc/`; live retains that link. Observed live deployment headers expose Netlify/request IDs but no stable build ID. Canonry audit `8341b64b-100f-49d8-8835-e8c27a91f446` completed 2026-08-20 at 89/100 across 97 pages with 0 errors.
- Hypothesis: maintaining a stable, technically valid live artifact prevents deployment noise from contaminating search and AI measurement.
- Approval state: the current live artifact is deployed; the dirty service-template rewrite is Awaiting approval and must not be treated as production.
- Deployment commit/build ID: `e31b744` for the previously verified SEO-004/SEO-005 artifact; `bab467b2b4b7eaef65e21c64b88d372740c62539` contains the article source, but Netlify exposes no stable deployment build ID.
- Expected impact: measure the intended snippet and intent changes against a live, stable artifact and avoid attributing stale-deployment effects to content.
- Recommended change: no production or content change in this check. Review and approve the dirty service-template rewrite separately before deployment; preserve the live PPC contextual link and rerun full parity after any deployment. The previously local-only blog publication decision is now resolved by the live 96-URL sitemap; do not rewrite content or add schema to compensate for a resolved parity issue.
- Effort: Low, measurement/operator decision pending
- Confidence: High
- Verification: live recheck passed on 2026-08-24 for the 96-URL sitemap, excluded routes, full live crawl, internal links, normal-vs-crawler responses, Markdown alternates, `npm run build`, independent `scripts/postbuild-aeo.mjs`, and Canonry's completed audit state. Source/build parity is clean for the sitemap and AI-access artifacts but intentionally not clean for the eight uncommitted service-page rewrites; this is a pre-deployment source/live delta, not a live defect. Measurement due 2026-09-18 for the already-deployed artifact; no search/AEO outcome is claimed yet.
- 2026-08-25 recheck: live remained 96/96 HTTP 200 with 98/98 internal same-origin targets returning 200 and no redirects; the eight dirty service-page H1/content differences and the local missing PPC contextual link remain pre-deployment only. No production regression or source mutation was introduced.

### SEO-002 — Improve intended index coverage after parity is stable

- Status: Measuring
- Category: indexing
- Scope: the current 96-URL live sitemap, reconciled against stored URL-level GSC inspection verdicts and intended exclusions.
- Problem: Canonry's 52 indexed / 47 not-indexed headline spans 99 stored URLs, while the current live sitemap contains 96 URLs. The newly live article is not represented in the stale stored inspection set.
- Evidence: Canonry's stored sitemap inspection completed 2026-08-24T18:50:29Z: 52 indexed / 48 not indexed / 0 deindexed across 100 stored URLs. Reconciled directly against the current 96-URL live sitemap, 25 URLs are `Submitted and indexed`, 25 `Crawled - currently not indexed`, and 46 `URL is unknown to Google`; the new `/resources/water-damage-restoration-marketing/` URL is stored as `URL is unknown to Google`. Four stored URLs are outside the live sitemap (`/tos/`, `/privacy/`, obsolete `/water-damage-restoration/`, and intended-exclusion `/admin/`). All four SEO-004 target URLs remain stored as `Submitted and indexed` and `INDEXING_ALLOWED`. Bing is a limited 16-URL stored sample, all indexed, and is not a full-site coverage result. [`2026-08-24-weekly-opportunity.md`](runs/2026-08-24-weekly-opportunity.md).
- Hypothesis: current URL-level inspection will separate eligible pages needing indexing attention from stale summary buckets and intended exclusions.
- Approval state: Awaiting operator approval for fresh GSC/Bing inspection; no sync, submission, or indexing request is approved.
- Deployment commit/build ID: not applicable to the stored coverage baseline; the article source is in `bab467b2b4b7eaef65e21c64b88d372740c62539`.
- Expected impact: increase eligible commercial/content pages available to organic and AI systems.
- Recommended change: keep the URL-level reconciliation as the current read-only baseline; with operator approval, refresh/inspect the current sitemap if current status is needed, then prioritize eligible commercial pages by demand/business value. Keep `/admin/`, `/thank-you/`, and other intended exclusions out of any submission batch. Do not rewrite pages merely because Canonry's summary bucket is misleading.
- Effort: Medium
- Confidence: High for the stored URL-level classification; Medium for current index status because the last sync/inspection is 2026-08-17 and coverage can change after the read.
- Verification: report exact URL-level verdict counts against the current 96-URL live sitemap, intended exclusions, and a comparable post-recrawl delta. Measurement due date: 2026-09-25 if inspection is approved by 2026-08-28; otherwise reset when approved. No sync, submission, or indexing request was run in this check.

### SEO-003 — Re-run visibility baseline with the adopted query basket

- Status: Measuring
- Category: AEO / measurement
- Scope: the existing commercial query basket and provider set.
- Problem: the completed 2026-08-10 42-query run is still the latest visibility baseline and cannot be compared directly with the earlier 12-query baseline. Current Canonry surfaces disagree on mention-gap counts, and Mention Share now uses a non-brand denominator, so per-query change claims need a comparable refresh with explicit labels.
- Evidence: query-level Mention Coverage remains 27/42 (64%). Current non-brand Mention Share is 4 project mentions out of 31 project-plus-competitor mentions (13%); the prior 64% share figure used an older pooled definition and is not a performance delta. Citation Coverage remains 4/42 (10%). Snapshot history remains 3 completed runs / 162 snapshots through 2026-08-10, with 68 mentioned (41.98%) and 11 cited (6.79%). `overview` reports 2 mention gaps while `analytics --feature gaps` returns 5. The fixed-basket run `14ee1d3c-8670-4a3a-9138-d36105e15a77` remains cancelled and is not comparable. Canonry's report also lists 33 tracked queries without a stored GSC match and 20 high-volume GSC queries outside the basket; basket revision is a later governance decision, not permission to change the comparison basket now.
- Hypothesis: one unchanged-basket sweep will restore a comparable mention-first baseline; a later basket review can improve business/query alignment without corrupting that comparison.
- Approval state: Awaiting operator approval for one quota-consuming fixed-basket sweep; no sweep or basket mutation is approved.
- Deployment commit/build ID: not applicable; measurement intervention only.
- Expected impact: establish a trustworthy post-remediation mention/citation baseline and expose mention losses or citation gaps.
- Recommended change: after operator confirmation, run one real sweep with the fixed 42-query basket and current provider set. Report query-level Mention Coverage and Mention Share first, Citation Coverage second, and reconcile `overview`, `evidence`, and gap output before opening per-query content work.
- Effort: Low operator time / quota-consuming
- Confidence: High
- Verification: completed Canonry sweep ID, unchanged 42-query denominator, provider breakdown, query-level Mention Coverage and non-brand Mention Share first, Citation Coverage second, and comparison with the last completed run. Measurement due date: 2026-09-04 if approved by 2026-08-28; otherwise reset when approved. The cancelled fixed-basket attempt is not a valid baseline.

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
- Problem: core commercial queries surface across too many pages, diluting the clearest landing-page signal. This is a cannibalization risk, not proof that every secondary impression is harmful.
- Evidence: stored GSC window shows `restoration marketing` across six pages (794 impressions), `restoration marketing agency` across six pages (635), `restoration digital marketing agency` across four pages (353), `restoration ppc services` across six pages (328), and `water damage restoration ppc` across three pages (194). On 2026-08-24, the live generic PPC page still links contextually to the water-damage PPC page and the specialist page links back; the full live crawl found 98 unique same-origin targets with no broken links or redirects. The dirty local `/services/ppc/` build omits the generic-to-specialist link, so deployment of that artifact would regress the approved internal-link intervention.
- Hypothesis: clearer primary-page ownership and contextual linking will concentrate broad agency and generic-versus-specialist PPC relevance without removing useful routes.
- Approval state: approved and deployed for the live contextual-link intervention; the dirty PPC rewrite is Awaiting approval and must preserve the link before deployment.
- Deployment commit/build ID: observed source commit `e31b744`; Netlify build ID unavailable.
- Expected impact: strengthen the homepage for agency intent and route generic PPC versus water-damage-specific PPC searches to clearer destinations without removing useful pages.
- Recommended change: retain the deployed primary landing-page map and contextual PPC links; do not deploy the current dirty PPC artifact until the missing link is reviewed/restored. Make no additional link or redirect change until query-page behavior is remeasured. Avoid blanket redirects or deindexing.
- Effort: Medium
- Confidence: Medium
- Verification: GSC query-by-page distribution, impressions/clicks/position over a comparable 28-day window, internal-link crawl, and live canonical/indexability checks. Live-link verification passed 2026-08-24; local/build link parity is a pre-deployment warning on `/services/ppc/`. Measurement due 2026-09-18 for the current live artifact.
- 2026-08-25 recheck: live `/services/ppc/` still links to `/water-damage-restoration/ppc/`, while the dirty local build still omits that link. Preserve the live intervention before any approved deployment.

### SEO-006 — Reconcile water-damage marketing article publication

- Status: In Progress
- Approval state: Awaiting retrospective approval; not eligible for automated implementation or success claims.
- Category: search-intent/content gap; entity, citation, and AEO weakness.
- Scope: query `water damage restoration marketing`; source article and expected production URL `/resources/water-damage-restoration-marketing/`; supporting industry, service, and resource links.
- Problem: Canonry and GSC support a distinct operator-focused water-damage restoration marketing resource, but the article and cover entered `origin/main` in a mixed-scope commit without an explicitly approved backlog item. Production verification is now complete, but the closed-loop approval and measurement stages remain incomplete.
- Evidence baseline: stored Canonry 30-day and 90-day gap reads on 2026-08-24 both use latest visibility run `595fca88-de9d-474e-8854-f7319346e0b5` from 2026-08-10. The query was mentioned in 0/1 recent 30-day runs and 0/2 available 90-day runs, and cited in 0/1 and 0/2 respectively. Competitor citations included PushLeads, Water Restoration Marketing, and Brown Bull Marketing. Canonry target `tgt_en8r3s` remains ownable with medium action confidence; stored GSC evidence is 155 impressions, 0 clicks, and average position 48.21 for `/industries`. On 2026-08-25 the exact production URL remained 200, self-canonical, one H1, parseable JSON-LD, no `noindex`, and present in the 96-URL sitemap; the fresh stored GSC inspection marks it `URL is unknown to Google`. No high or critical Canonry insights were available. Missing post-publication search/AEO outcomes are unavailable, not zero.
- Hypothesis: a dedicated B2B guide can better serve informational intent than the thin commercial industry hub while supporting qualified restoration-marketing decisions and avoiding duplication with the vertical services page.
- Expected impact: create a clearer organic and AI-answer source for the query and route readers to relevant water-damage, lead-tracking, PPC, SEO, website, reputation, retargeting, and social-advertising services. No outcome is claimed.
- Recommended change: obtain retrospective operator approval for the article intervention, record the completed 2026-08-24 production verification, and begin measurement. If approval is withheld, decide whether a separate authorized rollback is required; do not auto-delete or consolidate it.
- Effort: Low for review and verification; Medium if revision is requested.
- Confidence: Medium because the query evidence is strong and the exact URL is now live-verified, but the latest comparable Canonry run is stale and retrospective approval is still missing.
- Implementation ID: `bab467b2b4b7eaef65e21c64b88d372740c62539` on `main`; `origin/main` contained the commit on 2026-08-24. The commit includes unrelated files, so it is not treated as an automation-scoped article commit.
- Deployment expectation: `https://remediationrestorationmarketing.com/resources/water-damage-restoration-marketing/` is live-verified on 2026-08-24 and appears consistent with repository commit `bab467b`; Netlify exposed no stable provider build ID.
- Measurement due date: 2026-09-21 only if retrospective approval is granted and this 2026-08-24 production verification is accepted as the baseline; otherwise measurement remains pending.
- Verification method: approval record; production HTTP/indexability/canonical/render/schema and source-parity checks; exactly one visible FAQ block and one synchronized FAQPage schema source; internal-link resolution; comparable GSC query/page window; and a later operator-approved fixed-basket Canonry sweep reporting Mention Coverage/Share separately from Citation Coverage.

### SEO-007 — Clarify social-media advertising intent and snippet

- Status: Candidate
- Approval state: Awaiting approval; coordinate with the existing uncommitted service-template refactor before implementation.
- Category: search intent / content quality; high-impression weak CTR.
- Scope: `/services/social-media-advertising/`; query `facebook ads for fire damage restoration` and closely matching restoration paid-social intent.
- Problem: the page has a measurable page-two opportunity, but live metadata uses a generic title and a truncated description that pivots into unrelated services. The visible live page also retains generic conclusion/FAQ framing.
- Evidence baseline: stored GSC data through 2026-08-14 shows 40 impressions, 0 detailed-row clicks, and average position 17.68 for `facebook ads for fire damage restoration` on this URL. Direct live review on 2026-08-24 found title `Restoration Social Media Advertising | R&R Marketing` and description `Convert emergency water, fire, and mold damage leads with targeted Facebook and Instagram ads. Explore SEO, PPC, web design, and lead tracking built.` The dirty user worktree already contains an uncommitted `ServiceHero`/`ServiceDepth` refactor for this route; it is preserved and not treated as approved or deployed.
- Hypothesis: a complete, service-specific snippet and visible paid-social mechanism/proof path can improve query relevance and qualified CTR without changing page ownership or adding unsupported claims.
- Expected impact: improve page-two relevance and click capture for a discrete existing service page; the measured impression base is smaller than SEO-004a/b.
- Recommended change: after the in-progress refactor is reviewed, approve a narrow copy/snippet pass that stays specific to Facebook/Instagram advertising for restoration companies, removes cross-service truncation, and preserves truthful proof and conversion usefulness. Do not overwrite the user's current changes; add schema only if matching visible content warrants it.
- Effort: Low–Medium after the existing refactor settles.
- Confidence: Medium–High for the snippet/intent defect; Medium for ranking or CTR impact.
- Deployment commit/build ID: none; candidate is not deployed.
- Measurement due date: 2026-09-25 if deployed by 2026-08-28; otherwise reset to 28 days after verified deployment.
- Verification method: reviewed diff, successful site build and AEO checks, rendered desktop/mobile review, live metadata/parity after approved deployment, and comparable 28-day query-page GSC performance.

## Reconciled / not prioritized

- Generic sitewide audit-support copy: Rejected. Earlier browser review found duplication and unrelated content; native page-specific framework work is the safer direction.
- Net-new location pages, mass article expansion, backlink campaigns, and provider-specific citation campaigns: Candidate, deferred until search/visibility/conversion evidence identifies a distinct opportunity.
- Follow-up fix: normalized the two source links that caused the known `/services` and `/resources` trailing-slash redirects; deployment is now live-verified on 2026-08-14.
- Production regression monitoring: the 2026-08-24 check verified the 96-URL live sitemap, SEO-004 metadata, and SEO-005 PPC-link intervention live; it also identified uncommitted service-template/source drift that is not deployed, including a missing local PPC contextual link. SEO-001, SEO-004, and SEO-005 remain `Measuring` with a 2026-09-18 measurement due date. SEO-002 remains an indexing opportunity with stale stored coverage; SEO-003 remains non-comparable because the latest fixed-basket visibility attempt was cancelled.
- Weekly opportunity reconciliation: SEO-006 is live-verified but still awaits retrospective approval and measurement. SEO-007 is the only new candidate and must be coordinated with the user's current uncommitted service refactor. No duplicate page/content IDs were created.
