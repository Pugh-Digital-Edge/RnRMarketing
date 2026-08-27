# Weekly SEO/AEO Plan Implementation and Verification

## Run metadata

- Date: 2026-08-27 (America/New_York)
- Site: `https://remediationrestorationmarketing.com/`
- Canonry project: `remediation-restoration-marketing`
- Deployment commit: `0bc7e2bb7133950e1a3a3aee5e7ab100ec9e87ae`
- Scope: SEO-005 PPC contextual-link repair, SEO-006 retrospective article approval/measurement gate, SEO-007 social-advertising snippet and visible-intent alignment, production parity, bounded Google/Bing inspection, and one unchanged-basket Canonry visibility comparison.

## Outcome

The weekly site work is implemented, deployed, and production-verified. The PPC generic-to-specialist contextual link is restored, the social-media advertising page has a complete Facebook/fire-damage-focused snippet and matching hero explanation, and the water-damage marketing article is retrospectively approved and now confirmed indexed by Google.

The deployed site remains technically healthy: 96/96 sitemap pages passed the checked SEO signals, 98/98 internal HTML targets returned 200 without redirects, and local/live signal mismatches were zero. The fresh Canonry technical audit completed at 88/100 across 98 pages with no skipped or errored pages. A comparable 42-query visibility sweep exposed a large point-in-time mention decline; under Aero's regression playbook, it requires a confirmation run before broad content action because each query/provider has only one observation per run.

## Implemented changes

### SEO-005 — PPC contextual-link repair

**Problem →** Commit `5429a0a` removed the previously approved visible link from `/services/ppc/` to `/water-damage-restoration/ppc/` during a shared-component refactor.

**Evidence →** The link was absent in source, local build, and live HTML on the pre-change August 27 regression check while the specialist page still linked back.

**Expected impact →** Restore the intended generic-versus-specialist relevance and navigation path without changing URLs, redirects, indexability, or broad page ownership.

**Recommended change →** One contextual, followable link was added through the shared PPC service guide in `src/components/ServiceDepth.astro`.

**Effort →** Low.

**Confidence →** High that the regression is repaired; Medium for downstream search impact.

**Verification method →** The link is present exactly once in source, local production output, and live HTML. It has no `nofollow`; desktop/mobile rendering passed; the live internal-link crawl has zero failures or redirects.

### SEO-006 — Article governance and measurement

**Problem →** The live water-damage marketing article lacked an explicit approval record, blocking a clean measurement state.

**Evidence →** The article was already live, canonical, indexable, sitemap-listed, schema-valid, and internally linked. A fresh Google inspection on August 27 now returns `Submitted and indexed`, improving from the August 24 stored `URL is unknown to Google` state. Bing does not yet confirm the article (`inIndex: null`). The current Canonry run still shows no mention or citation for `water damage restoration marketing` across the three providers.

**Expected impact →** Preserve a distinct, evidence-supported informational target and allow measurement without an unnecessary rewrite.

**Recommended change →** The operator's instruction to complete the weekly plan is recorded as retrospective approval. Keep the article stable through the September 21 checkpoint.

**Effort →** Low governance/documentation effort.

**Confidence →** Medium; indexing is now confirmed, but no post-publication search or AEO improvement is established.

**Verification method →** Source/live route, canonical/indexability, sitemap membership, Article and FAQ schema, visible/schema-synchronized FAQs, internal links, Google inspection, Bing inspection, and the comparable Canonry query result were checked.

### SEO-007 — Social-advertising snippet and intent alignment

**Problem →** `/services/social-media-advertising/` had a generic title and incomplete description despite a measured page-two query opportunity for `facebook ads for fire damage restoration`.

**Evidence →** Stored GSC baseline: 40 impressions, 0 detailed-row clicks, average position 17.68. The old live snippet was generic and truncated.

**Expected impact →** Improve snippet clarity and query relevance on an existing indexed commercial page without unsupported proof claims.

**Recommended change →** Deployed title: `Facebook Ads for Fire Damage Restoration Companies | R&R Marketing`. Deployed description: `Facebook and Instagram advertising for restoration companies seeking fire damage leads, with focused audiences, clear offers, and measurable next steps.` The visible hero now explains the appropriate awareness/remarketing role of Facebook and Instagram without presenting paid social as a substitute for urgent search demand.

**Effort →** Low–Medium.

**Confidence →** Medium–High for the snippet defect; Medium for CTR/ranking impact.

**Verification method →** Source review, production build, AEO postbuild checks, desktop/mobile rendering, overflow check, browser console review, live metadata/parity, canonical/indexability, and fresh Google inspection all passed. Measure the exact query/page through September 24 before claiming impact.

## Local verification

- `npm run build`: passed; Astro built 101 pages and `scripts/postbuild-aeo.mjs` passed.
- `git diff --check`: passed.
- Impeccable detector: no findings (`[]`).
- Browser review: desktop 1440×900 and mobile 390×844; no horizontal overflow on either changed page.
- Browser console: no warnings or errors on `/services/ppc/` or `/services/social-media-advertising/`.
- `npx astro check`: reported 14 errors in unrelated, pre-existing files; neither changed component nor the changed social-advertising page was implicated. These errors remain outside this scoped SEO change.
- Existing non-blocking build warnings remain: stale Browserslist data, SVG normalization, and duplicate SVG id `Star-1`.

## Production verification

- `/sitemap-index.xml`: 200; one child sitemap.
- Sitemap URLs: 96.
- Page failures: 0 across status, title, description, self-canonical, one H1, indexability, and JSON-LD presence.
- Local/live signal mismatches: 0 across title, description, canonical, H1 count, robots state, and JSON-LD count.
- Same-origin HTML targets: 98; failures or redirects: 0.
- `/services/ppc/` contains exactly one contextual link to `/water-damage-restoration/ppc/`.
- `/services/social-media-advertising/` serves the intended title and complete 152-character description.

## Canonry technical recheck

- Audit ID: `8dd953a4-4c60-4527-b6d6-1e68fad32431`.
- Result: 88/100, 98 pages audited, 0 skipped, 0 errored.
- Previous: 89/100, 97 pages audited.
- Interpretation: the aggregate moved down one point while crawl scope increased by one page. Structured data, schema completeness/validity, snippet eligibility, AI access files, crawler access, and technical SEO remain passing factors. Content extractability remains the only cross-cutting partial factor (58 average; 93/98 pages affected). This is not evidence for a broad rewrite.

## Bounded index inspection

The approved read-only sample covered 23 URLs: homepage, service hub, eight generic service pages, eight industry hubs, the approved article, and four representative generated commercial pages.

### Google

- `Submitted and indexed`: 14/23.
- `Crawled - currently not indexed`: 5/23.
- `URL is unknown to Google`: 4/23.
- All eight generic service pages, the homepage, service hub, article, water-damage PPC page, and two representative generated pages are indexed.
- The five crawled-not-indexed results are industry hubs. Two other industry hubs and two generated pages are unknown.
- No sitemap submission, indexing request, or full-site sync was run.

### Bing

- Confirmed `inIndex: true`: 22/23.
- Unconfirmed: the approved article (`inIndex: null`, no API error).
- The API reports `httpCode: 0` on indexed results; this is a Bing inspection response-field limitation, not a live HTTP failure. Direct production checks returned 200.

## Comparable AEO visibility sweep

- Valid completed run: `30969b56-2bc9-49cc-bba3-4cee92a4e36e`.
- Basket/provider parity: 42 unchanged queries × OpenAI, Gemini, and Claude = 126 completed snapshots; comparison marked comparable; no query added or removed.
- Models were stable across the August 10 and August 27 runs: `gpt-5.4-mini-2026-03-17`, `gemini-3.1-flash-lite`, and `claude-sonnet-4-6`.
- Mention Coverage: 27/42 (64%) → 5/42 (12%). Canonry reports 22 lost-mentioned queries and 0 gained-mentioned queries.
- Non-brand Mention Share: 4/31 (13%) → 5/29 (17%). The smaller denominator means this is not evidence that the coverage decline was offset.
- Citation Coverage: 4/42 (10%) → 3/42 (7%). Gained citation queries: `how to track ROI for fire damage marketing campaigns` and `monthly retainer costs for restoration marketing services`. Lost citation queries: `digital marketing for restoration companies`, `restoration SEO services`, and `restoration marketing agency pricing packages`.
- Current provider pairs: Claude 4 mentions/1 citation; OpenAI 1/1; Gemini 0/2.
- Current mentioned queries: `best marketing agencies for water damage contractors`, `restoration marketing agency`, `best website builders for damage restoration companies`, `restoration website design`, and `top lead generation services for restoration businesses 2026`.
- Current cited queries: `how to track ROI for fire damage marketing campaigns`, `restoration marketing agency`, and `monthly retainer costs for restoration marketing services`.

The first attempt, `badc9ee5-71d6-41a2-92e9-0a9b083c30bd`, was marked failed when the local Canonry server restarted and is excluded from comparison. The completed retry is the only valid August 27 baseline.

## Regression diagnosis and next action

**Problem →** Mention Coverage declined sharply on a technically healthy, comparable 42-query sweep.

**Evidence →** Same query set, provider set, and served models; 22 query-level mention losses; no broad live crawl, local/live parity, or sampled indexing failure; current per-query/provider sample size is only two observations across the two comparison runs.

**Expected impact →** If persistent, weaker AI recommendation visibility across commercial restoration-marketing queries. No search-traffic or conversion impact is established because GA4 is not connected in Canonry and the run is point-in-time.

**Recommended change →** Do not rewrite the site from this single sweep. Preserve the basket, monitor the 22 losses, and request approval for one unchanged confirmation sweep after a suitable interval. If the loss persists, prioritize high-commercial queries for competitor mention displacement and source-surface diagnosis; mention loss remains primary, citation loss secondary.

**Effort →** Low for confirmation; Medium for query-specific diagnosis if confirmed.

**Confidence →** High in the point-in-time comparable measurement; Low that the decline is durable at n=1 per provider per run.

**Verification method →** Repeat the unchanged 42-query basket, inspect per-query/provider mention rates, compare competitor mention share before citation displacement, and correlate with GSC page/query data. Next checkpoint: September 4, 2026.

## Guardrails and limitations

- No sitemap submission, indexing request, redirect, deindexing, basket mutation, or broad content/schema change was performed.
- No ranking, CTR, lead, conversion, or durable AI-visibility improvement is claimed from same-day deployment.
- GA4 remains disconnected in Canonry, so conversion and AI-referral outcomes are unavailable.
- The working tree was clean after the deployment commit before this verification record was added.
