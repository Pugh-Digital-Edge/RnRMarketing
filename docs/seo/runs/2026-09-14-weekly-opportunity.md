# Weekly SEO/AEO Opportunity Queue — 2026-09-14

## Run metadata

- Run time: 2026-09-14T10:30:00-04:00 (America/New_York; evidence reads occurred between 14:20 and 14:30 UTC).
- Run type: read-only, approval-ready closed-loop SEO/AEO opportunity analysis.
- Production URL: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`.
- Workflows used: Canonry stored-read baseline and AEO analysis; Aero weekly-review and content-gap orchestration.
- Mutations not performed: Canonry visibility sweep, probe, discovery, technical audit, GSC/Bing/GA4/traffic/backlink sync, URL inspection, sitemap or indexing submission, deployment, CDN purge, source/content edit, commit, or push.

## Outcome

No meaningful new approval-ready source/content opportunity is supported by fresher measurement. AI visibility is current only through the September 10 fixed-basket run, while GSC performance is still current only through August 22 and stored Google/Bing inspections only through August 27. The strongest work is therefore the existing measurement queue and the already-gated September 25 indexing recheck.

One closed-loop reconciliation was necessary: the September 11 competitor-review intervention was committed and pushed as `858a02d`, and its homepage/services/contact markers are now live, but it had no stable backlog ID. It is now SEO-011 with status `Measuring`, a September 11 live baseline, and an October 9 measurement date. This run did not authorize or perform that implementation.

## Sources

- Control plane: `AGENTS.md`, `docs/seo/README.md`, `docs/seo/strategy.md`, `docs/seo/backlog.md`, `docs/seo/learnings.md`, this automation's memory, and recent run records through September 11.
- Canonry CLI 4.179.2 stored reads: project overview/report, gap analytics, technical score, Google coverage/performance, Bing coverage, GA4 status, traffic status, and project doctor.
- Repository state: `HEAD` and `origin/main` both `858a02d9b1bc45ef275c137fad7495a68fa6d6bc`. Existing untracked `%SystemDrive%/ProgramData/Microsoft/Windows/Caches/` artifacts were preserved. Concurrent downstream work created untracked `src/assets/images/blog/mold-remediation-marketing.webp` and `src/content/blog/mold-remediation-marketing.md` after this queue's evidence review; they were not read, ranked, approved, edited, or treated as part of this run.
- Live site: read-only checks of the homepage, services, contact, and child sitemap. The sitemap contains 98 URLs; the new homepage results link/hero image, services starting-point/budget content, and contact territory copy are present.
- Unavailable evidence: current GA4/conversion and AI-referral data, Google Business Profile/local-search data, server-side crawler/referral traffic, a current backlink source, fresher GSC performance, fresher Google/Bing URL verdicts, and a stable Netlify build ID.

## Baseline and deltas

### AI mention coverage and share — primary

- Latest completed comparable visibility run: `dc0e5f1c-7708-4edc-90be-47474349f809`, completed 2026-09-10 with 42 queries × 3 providers = 126 snapshots.
- Mention Coverage: **6/42 (14%)**, up from 5/42 (12%) on August 27 but far below 27/42 (64%) on August 10. One August 27 query gained a mention; none lost a then-current mention. All 22 August 10-to-August 27 lost-mentioned queries remain absent.
- Non-brand Mention Share: **7/33 (21%)**, versus 5/29 (17%) on August 27 and 4/31 (13%) on August 10. The competitive denominator changed, so the percentage is not a coverage recovery.
- Provider mention counts: Claude 4/42, Gemini 2/42, OpenAI 1/42. Provider counts can overlap at query level and are not the headline denominator.
- Gap analytics: 6 mentioned queries, 7 mention gaps where competitors are named and the project is not, and 29 other not-mentioned queries. The seven mention gaps include retainer costs, restoration SEO services, agency pricing, restoration CPL, exclusive lead packages, BBB-accredited lead services, and mold-remediation SEO importance.

### Citation coverage — secondary and separate

- Citation Coverage: **3/42 (7%)**, unchanged at query level from August 27 and down from 4/42 (10%) on August 10.
- September 10 gained a citation for `book a consultation for restoration website design` and lost a Claude citation for `monthly retainer costs for restoration marketing services`; the retainer query retained a project mention in that provider row but remains a query-level mention gap because a competitor is named while the project is not consistently named.
- Gap analytics: 3 cited queries, 33 competitor-citation gaps, and 6 other uncited queries. Citation state is not used to infer mention state.

### Search, indexing, technical, and live evidence

- GSC property totals remain 14,637 impressions, 11 clicks, 0.075% CTR, and average position 34.36 for 2026-07-24 through 2026-08-22. The detailed rows do not surface all property clicks and are used for query/page ranking evidence, not property totals.
- Highest stored near-page-one zero-click query/page rows remain water-damage PPC (158 impressions at 10.34; 145 at 15.37; 133 at 18.53), homepage `restoration marketing plan` (77 at 18.45), generic web design (45 at 9.44), social advertising (43 at 18.93), and fire-damage web design (24 at 4.04). Retargeting remains the exceptional high-proximity row from the same stored window: 122 impressions at position 2.47 with zero surfaced row clicks.
- Google stored coverage remains 53 indexed / 47 not indexed / 0 deindexed across 100 records, last inspected August 27 and last synced August 24. The accepted bounded sample remains 14 submitted/indexed, 5 crawled-not-indexed, and 4 unknown. The current aggregate is stale and lossy, not a current verdict for every live URL.
- Bing remains 37 indexed / 1 unknown across 38 inspections, last inspected August 27; the unknown row is the water-damage marketing guide. This partial sample is not comparable to the 98-URL live sitemap.
- Stored technical audit `638de6d0-fea9-4ad4-996a-fb1f2bd320bb` is 90/100 across 100 audited pages, with 0 skipped and 0 errored. The prior 88/100 audit covered 98 pages; the two-point difference is not attributed to an intervention because inventory and timing differ.
- The current live child sitemap contains 98 URLs. Bounded reads confirm the September 11 decision-support changes are live. The most recent full production regression check predates commit `858a02d`, so this run claims only bounded live presence, not a new full-site parity certification.

### Analytics, local, authority, and crawler evidence

- GA4 is not connected; conversion and AI-referral outcomes are unavailable, not zero.
- Google Business Profile still fails the project connection check; no local-search or review opportunity is ranked from missing data.
- Server-side traffic has no connected sources; current crawler/referral evidence is unavailable.
- The backlink source is unconnected and current authority evidence is unavailable; no outreach campaign is promoted over measured existing-page work.
- Canonry project doctor reports 5 passing, 4 warning, 1 failing, and 24 skipped checks. The warnings/failure concern missing scopes/connections and 21% winnability coverage, not a demonstrated live production defect.

## Findings and diagnoses

1. The 22-query historical mention loss remains the largest AEO risk, but the September 10 confirmation does not identify a broad technical, deployment, indexing, or page-content cause. Classification: entity/AEO source-selection weakness with causal mechanism unresolved.
2. Near-page-one GSC opportunities remain on already-indexed commercial pages. Their next valid action is measurement at the recorded checkpoints, not another rewrite. Classification: high-impression weak CTR/search-intent opportunity currently measuring.
3. The Google whole-site index headline remains stale and loses URL-level verdict detail. Classification: indexing measurement limitation, not a new indexability defect.
4. Commit `858a02d` changes internal discovery and decision-support content on core routes and is live. Classification: search-intent/content-quality and internal-link intervention already deployed; it must be measured and treated as a confounder, not duplicated.
5. No new technical or production-parity defect was found in the bounded live checks. The September 11 full regression record remains the last complete crawl/parity certification.
6. Missing analytics, local, traffic, and current backlink data prevent conversion, local, crawler, and authority prioritization. Missing evidence is not scored as zero.

## Ranked opportunities

Priority approximates visibility potential × ranking proximity × business value × confidence ÷ effort. Existing measured pages and measurement integrity outrank net-new content.

### 1. SEO-003 — Preserve and evaluate the fixed AI basket

- URL/query: existing 42-query commercial basket across Claude, Gemini, and OpenAI.
- Problem classification: entity/AEO source-selection weakness; persistent mention regression with unresolved cause.
- Problem → Evidence: Mention Coverage is 6/42 versus 5/42 on August 27 and 27/42 on August 10; Mention Share is 7/33; Citation Coverage is separately 3/42. All 22 historical lost-mentioned queries remain absent, but current technical/live checks and the August bounded Google sample do not demonstrate a broad site failure.
- Expected impact: protect attribution and avoid broad edits that respond to provider variance instead of a supported mechanism.
- Recommended change: keep the fixed basket and deployed pages stable through their measurement dates. Do not run another sweep or rewrite pages now. A later fixed-basket comparison requires a separate approval after the intervention windows mature.
- Effort: Low measurement effort; quota-consuming if a later sweep is approved.
- Confidence: High in the stored observations; Low–Medium in any causal explanation.
- Approval state: September 10 confirmation completed; no new sweep is approved.
- Verification method: compare only completed runs with unchanged query/provider/model/location sets; lead with Mention Coverage/Share, then Citation Coverage; reconcile exact query-page and source evidence.

### 2. SEO-004 — Measure the strongest near-page-one commercial pages

- URL/query: `/water-damage-restoration/ppc/` PPC cluster; `/services/retargeting/`; `/services/web-design/`; `/services/social-media-marketing/`.
- Problem classification: high-impression weak CTR; search intent; existing-page opportunity currently measuring.
- Problem → Evidence: the water-damage PPC page holds 158 impressions at position 10.34, 145 at 15.37, and 133 at 18.53; retargeting has 122 at 2.47; generic web design has 45 at 9.44. Surfaced rows have zero clicks, and stored inspections mark the pages indexed.
- Expected impact: determine whether the deployed page-specific snippet/intent work improved click capture without resetting the window.
- Recommended change: make no additional copy, schema, title, or page-ownership change before the September 18 comparison. Record September 11's SEO-011 deployment as a possible cross-site confounder.
- Effort: Low for measurement.
- Confidence: High for opportunity; Medium for outcome attribution.
- Approval state: measurement authorized; further page changes await the result.
- Verification method: exact query/page impressions, clicks/CTR, and weighted position over comparable windows, plus live artifact continuity.

### 3. SEO-006 — Evaluate the indexed water-damage marketing guide

- URL/query: `/resources/water-damage-restoration-marketing/`; `water damage restoration marketing`.
- Problem classification: search-intent/content gap; entity/citation/AEO weakness currently measuring.
- Problem → Evidence: the article is live and was `Submitted and indexed` in the August 27 Google sample; the prior target carried 155 GSC impressions at position 48.21. The September 10 basket still shows no project mention or citation for the exact query, which is not a same-window causal verdict.
- Expected impact: determine whether a dedicated indexed guide begins owning informational demand without duplicating the industry hub.
- Recommended change: keep the article stable through September 21; do not rewrite or request indexing from the current AI zero.
- Effort: Low for measurement.
- Confidence: Medium.
- Approval state: approved and measuring; additional article work is not approved.
- Verification method: exact query/page GSC comparison, live/indexability continuity, and a later separately approved fixed-basket AI comparison.

### 4. SEO-005 and SEO-007 — Measure PPC ownership and social-ad intent

- URL/query: homepage, `/services/ppc/`, `/water-damage-restoration/ppc/`, and `/services/social-media-advertising/`; core PPC clusters and `facebook ads for fire damage restoration`.
- Problem classification: search-intent/cannibalization and high-impression weak CTR; repaired link/snippet interventions currently measuring.
- Problem → Evidence: the water-damage PPC cluster is the largest near-page-one opportunity; the social-ad page has 43 impressions at position 18.93. The generic-to-specialist PPC link and the social-ad snippet/hero alignment are deployed and live-verified in the prior records.
- Expected impact: show whether clearer generic-versus-specialist ownership and paid-social relevance improve query/page concentration and click capture.
- Recommended change: hold links, page ownership, copy, and schema stable through September 24.
- Effort: Low for measurement.
- Confidence: High for the measured opportunity; Medium for intervention impact.
- Approval state: measurement authorized; no additional intervention is approved.
- Verification method: comparable query-by-page distribution and exact query/page CTR/position, with source/build/live checks if the artifact changes.

### 5. SEO-002 — Approve the same-set indexing recheck after the gate

- URL/query: accepted 23-URL Google inspection set, especially the five crawled-not-indexed industry hubs and four unknown URLs.
- Problem classification: indexing measurement limitation.
- Problem → Evidence: the accepted sample is 14 submitted/indexed, 5 crawled-not-indexed, and 4 unknown, while the stale aggregate compresses 100 records into 53 indexed / 47 not indexed. The live sitemap now contains 98 URLs, and recent articles are missing from the stored provider samples.
- Expected impact: identify which eligible URLs still need intent/internal-link review and which were merely stale/unknown before any submission or rewrite.
- Recommended change: after explicit approval and no earlier than September 25, repeat exactly the same 23-URL inspection set. Do not run a broad sync, sitemap submission, or indexing request from this report.
- Effort: Medium.
- Confidence: High for the measurement discrepancy; Medium for current provider state.
- Approval state: **Awaiting approval**, executable no earlier than 2026-09-25; inspection only.
- Verification method: URL-by-URL verdict comparison preserving `Submitted and indexed`, `Crawled - currently not indexed`, and `URL is unknown to Google`.

### 6. SEO-009 — Measure the restoration LSA guide

- URL/query: `/resources/local-services-ads-for-restoration-companies/`; restoration LSA query family.
- Problem classification: search-intent/content gap; entity/citation/AEO weakness currently measuring.
- Problem → Evidence: the stored Canonry target is ownable with winnability 1.0 and 0/2 mention/citation coverage before publication; related GSC rows total 34 impressions at weighted position 27.59. The guide is live and technically verified, but no post-publication GSC or AI comparison exists.
- Expected impact: establish a useful owned informational source and support PPC/lead-tracking conversion paths.
- Recommended change: keep the guide stable through September 29; avoid a second LSA article or pricing/eligibility claims unsupported by primary sources.
- Effort: Low for measurement.
- Confidence: Medium–High for the gap; Medium for outcome.
- Approval state: approved and measuring; additional content work is not approved.
- Verification method: exact query/page GSC results and a later separately approved fixed-basket mention/citation comparison.

### 7. SEO-010 — Measure the agency-selection guide

- URL/query: `/resources/restoration-marketing-agency-vs-generalist/`; agency-selection query and supporting `restoration marketing agency` family.
- Problem classification: search-intent/content gap; internal-link and entity/citation/AEO weakness currently measuring.
- Problem → Evidence: the ownable target had four stored runs with no mentions or citations, while the supporting GSC family had 861 impressions across seven pages and the homepage owned 444 at position 25.85. The guide is live, but current GSC/AI outcomes are unavailable.
- Expected impact: own the informational decision intent without replacing the homepage's commercial agency intent.
- Recommended change: keep the guide and homepage ownership stable through October 6.
- Effort: Low for measurement.
- Confidence: Medium–High for the distinct intent; Medium for outcome.
- Approval state: approved and measuring; additional content work is not approved.
- Verification method: exact query/page GSC comparison, query-page distribution, and later separately approved mention/citation measurement.

### 8. SEO-008 — Measure the fire-guide contextual link

- URL/query: `/fire-damage-restoration/web-design/`; `web design for fire damage restoration`; source `/resources/fire-damage-restoration-marketing/`.
- Problem classification: internal-link weakness/search intent, repaired and measuring.
- Problem → Evidence: the specialist had 24 impressions at position 4.04 and only 11 extracted inbound links versus 115 to generic web design before the change. The one contextual specialist link is now deployed and production-verified.
- Expected impact: reinforce exact specialist intent with low architectural risk.
- Recommended change: preserve the one-link change and generic service ownership through October 8.
- Effort: Low.
- Confidence: Medium–High for intent fit; Medium for search impact.
- Approval state: approved and measuring; no sitewide link expansion is approved.
- Verification method: exact query/page GSC comparison after 28 days and continued source/build/live followability.

### 9. SEO-011 — Measure the deployed decision-support intervention

- URL/query: homepage, `/services/`, `/contact/`; service-choice, retainer-cost, restoration SEO, case-study, and consultation paths.
- Problem classification: search intent/content quality; internal-link weakness; conversion-support information architecture.
- Problem → Evidence: prior review found proof below the form, dead-end homepage service summaries, eight undifferentiated service choices, and budget/commitment answers only in the FAQ. September 10 AI gaps include retainer-cost and restoration-SEO queries; stored GSC includes 77 homepage impressions at position 18.45 for `restoration marketing plan`. Commit `858a02d` is on `origin/main`, and bounded September 14 live reads confirm the new results link, service starting points/budget section, contact territory copy, and hero image.
- Expected impact: improve discovery of existing service/case-study pages and create clearer owned decision-support answers; conversion impact remains unmeasured because analytics is unavailable.
- Recommended change: preserve the live September 11 artifact through October 9. Do not stack more overview copy, schema, pricing packages, or page creation onto it.
- Effort: Low for measurement.
- Confidence: High for deployed/live state; Medium for organic/AEO impact; Low for conversion impact without analytics.
- Approval state: previously authorized, deployed, and now reconciled as Measuring; no further change is approved.
- Verification method: comparable GSC query/page results; consultation-link clicks and qualified submissions only if analytics becomes available; later separately authorized fixed-basket mention/citation comparison; full parity check after any intervening deployment.

## Actions taken

- Read the required control files, automation memory, installed Canonry/Aero guidance, and recent SEO run records.
- Performed stored Canonry, GSC, Bing, integration, repository, and bounded live reads only.
- Reconciled the backlog through SEO-011 without duplicating a page/content opportunity.
- Added SEO-011 to give the already-executed September 11 intervention a stable ID, baseline, hypothesis, deployment commit, measurement due date, and verification method.
- Updated the current weekly-run pointer and September evidence-ranked order.
- Preserved unrelated repository state, including the untracked `%SystemDrive%/` cache artifacts and the concurrently created mold-remediation article/image files.

## Limitations

- AI visibility has no completed run after September 10; no new sweep was authorized.
- GSC performance has no data after August 22, so September 18–October 9 checkpoints may still lack a complete post-change window when reached.
- Google/Bing inspections are stale after August 27 and omit recent URLs.
- The Google aggregate disagrees with the overview headline (53/100 versus 52/100); the explicit coverage dataset is used, and the discrepancy remains recorded.
- The latest full production regression crawl predates commit `858a02d`; this run verified bounded live markers and the 98-URL sitemap only.
- GA4/conversions, AI referrals, GBP/local data, server traffic, and current backlink evidence are unavailable.
- A stable Netlify build ID is unavailable.
- Concurrent downstream article files appeared after the ranked analysis; their evidence gates and stable-ID reconciliation belong to that workflow and are not retroactively approved here.

## Verification status

- Baseline freshness and stored-source timestamps: verified.
- Mention Coverage/Share and Citation Coverage separation: verified.
- Exact 2026-07-24 through 2026-08-22 query/page aggregation: reproduced from all 10,255 stored dimension rows; property totals were taken from the property-level report, not dimension-row sums.
- Current repository/origin commit and bounded live SEO content markers: verified.
- Backlog stable-ID and approval-gate reconciliation: verified through SEO-011.
- Full local build/test, full live crawl/parity, fresh technical audit, fresh URL inspection, fresh visibility sweep, deployment, and outcome measurement: not run in this approval-queue role.
