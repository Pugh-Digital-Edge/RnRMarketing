# AEO Audit Action Plan

Last audit reviewed: 2026-07-13  
Canonry project: `remediation-restoration-marketing`  
Audit run: `30a4e811-5f6b-47d2-b833-cd9c2970424f`  
Coverage: 93 pages, 93 audited, 0 errors  
Overall score: **57/100**

This file tracks implementation work from the latest Canonry technical AEO audit. The audit is site-wide, so repeated findings should be fixed in shared layout/data files before making page-by-page edits.

## Assessment

The strongest areas are technical SEO (89), snippet eligibility (99), schema completeness (85), named entities (77), and content depth (78). The largest opportunities are AI-access files, freshness, E-E-A-T, FAQ/definition structure, and extractability. The score is also being pulled down by `/admin/`, which was included in the sitemap audit despite being an editorial interface; verify that it is not publicly indexable and is excluded from the production sitemap.

The audit found no crawl errors. These are optimization and discoverability issues rather than evidence of a site outage.

## Priority 1 — shared, high-impact fixes

- [x] **Fix AI access files** (avg. 31/100; all 93 pages affected)
  - Added `public/llms.txt` and `public/llms-full.txt` with the business entity, services, audience, canonical domain, and important URLs.
  - Added document-head references to both files.
  - Added `OAI-SearchBot` access and a Content-Signal directive to `robots.txt`.
  - Per-page Markdown endpoints remain an optional follow-up because they require an Astro content-negotiation strategy.

- [x] **Improve freshness signals**
  - Added a shared editorial review date fallback for WebPage schema.
  - Added sitemap `<lastmod>` values through the Astro sitemap serializer.
  - Resource pages continue to override the fallback with their frontmatter modification date.

- [x] **Add authorship and trust signals** (avg. 22/100; all 93 pages affected)
  - Added a site-wide author meta tag for the identified site founder/editor, Matt Pugh.
  - Added a visible Matt Pugh profile anchor and linked Person schema on the About page.
  - Add Review/AggregateRating schema only if genuine, visible customer review data exists; do not manufacture ratings.

- [x] **Repair duplicate BreadcrumbList schema**
  - Removed the duplicate layout-generated block; `astro-breadcrumbs` remains the sole breadcrumb schema source.

- [x] **Strengthen entity consistency**
  - Shared layout and schema use `Remediation & Restoration Marketing`; generated page titles are now verified at 70 characters or fewer.
  - Mirrored the canonical Hanover address in visible contact content and linked it to the map location.

## Priority 2 — content structure and authority

- [x] **Add FAQ schema and conversational question headings** (avg. 15/100; 80 failing pages)
  - The shared `FAQ.astro` component already emits `FAQPage` JSON-LD from the same data used by its visible questions.
  - Reuse the existing FAQ content/components where questions and answers are visible.
  - Emit `FAQPage` JSON-LD only for FAQs present on the page.
  - Prioritize the homepage, service pages, and `/schedule/` (the audit identified it as the strongest existing FAQ page).

- [x] **Add definition and instructional blocks**
  - Added a concise page-specific “What is…” definition block to the shared `Landing.astro` component used by service and industry landing pages.
  - Add “How to…” sections and ordered steps where the page genuinely explains a process.
  - Use `HowTo` schema only for actual step-by-step instructional content.

- [x] **Improve extractability**
  - Added a focused 40–200 word direct-answer paragraph beneath the shared definition heading.
  - Existing page-specific content remains responsible for deeper, non-boilerplate expertise.
  - Reduce repeated boilerplate where it crowds out page-specific expertise.

- [x] **Improve citations and authority signals**
  - Replaced the generated service-page “Learn More” anchor with descriptive, service-specific text.
  - Converted the visible business address to a descriptive map link; existing legitimate social profiles remain in `sameAs`.

## Priority 3 — targeted cleanup

- [x] **Resolve the single missing-H1 page**
  - The only missing-H1 URL is `/admin/`, an intentionally `noindex` Decap CMS interface excluded from the production sitemap; public pages build with exactly one H1.

- [x] **Review low-scoring pages and sitemap scope**
  - `/admin/` is disallowed in `robots.txt` and is now explicitly excluded from the Astro sitemap.
  - Review generated/legacy service URLs for useful content, canonical URLs, and accidental thin pages.

- [x] **Maintain schema parity**
  - Ensure newly generated service, industry, and resource pages receive the same appropriate Organization/Service/Article/Breadcrumb schema patterns.
  - Shared layout emits Organization, LocalBusiness, WebSite, and WebPage schema; page-specific Service, Article, FAQ, and HowTo blocks remain scoped to relevant pages.

## Canonry follow-up

- [x] Implement Priority 1 shared fixes.
- [x] Rebuild and confirm the production sitemap, robots.txt, and rendered JSON-LD.
- [x] Run a new technical audit and compare the score/factor deltas.
  - Latest live audit completed 2026-07-14: `01a27e4d-174a-4891-8bb0-f25c3a0d24d0`.
  - The installed CLI exposes completion and indexing status but not the factor-level score payload for this run; retain the 57/100 baseline until the detailed audit report is available.
- [x] Re-check the lowest-scoring URLs, especially `/admin/` and generated service pages.
- [x] Run a real visibility sweep after the site changes had time to be indexed.
  - Completed 2026-07-14 as run `8f42f5eb-3157-4877-b903-2c722711a8dd` across Gemini, OpenAI, and Claude.
  - Result: **Mention Coverage 83% (10/12)**; **Citation Coverage 42% (5/12)**. These are separate signals; citation is the trailing opportunity.

  **Deployment gate cleared:** live verification now shows the new `dateModified`, one breadcrumb block on `/services/seo/`, and 92 sitemap `<lastmod>` entries.

## Latest live Canonry findings — 2026-07-14

### Visibility sweep findings

- [x] **Close the lead-generation visibility gap — content update complete**
  - Added a direct, brand-attributed lead tracking and ROI answer to `/services/lead-tracking/` and reusable specialized-service answer blocks to generated industry/service pages.
  - Re-run the sweep after deployment/indexing to measure whether `restoration lead generation services` moves from 0/3 providers.
- [x] **Turn citations into mentions for ROI content — content update complete**
  - Added a visible opening answer that explicitly identifies Remediation & Restoration Marketing and explains how booked-job attribution measures ROI.
  - Local build contains the answer, but live verification on `/services/lead-tracking/` does not yet; deploy the current content before re-running the sweep.
- [x] **Improve cross-provider retrieval for core service queries — content update complete**
  - `water damage restoration marketing` was mentioned by OpenAI but not Gemini or Claude; `fire damage restoration marketing` was mentioned/cited by OpenAI only; `digital marketing for restoration companies` was mentioned by Claude only.
  - Added reusable direct-answer blocks with named-entity associations to generated industry/service pages; re-run after deployment/indexing.
- [x] **Increase domain citation coverage — authority content update complete**
  - Five of 12 queries cited the domain: restoration marketing agency, restoration SEO services, fire damage restoration marketing, restoration marketing ROI, and restoration website design.
  - Added descriptive links to official Google Analytics key-event and Google Ads conversion-tracking documentation on the lead-tracking page, alongside a clearer booked-job attribution explanation.
  - Deploy and re-run the sweep to measure whether the six mentioned-but-uncited queries gain citations.

- [ ] **Raise indexing coverage before expanding content**
  - Latest GSC coverage evidence: 43 of 94 URLs indexed (45.7%); 51 URLs are `URL is unknown to Google`, with the remainder primarily `Crawled - currently not indexed`.
  - Corrected Canonry’s configured sitemap to `https://remediationrestorationmarketing.com/sitemap-index.xml` and completed a full GSC sync (`ec23363a-4acf-4655-a649-11dc4248d934`).
  - Priority indexing requests were submitted for the water damage, fire damage, and mold remediation industry pages and lead-tracking pages; Google’s request-indexing wait timed out, so acceptance must be verified in the next inspection.
  - Export the remaining unknown/not-indexed URL list from GSC, prioritize core industry/service pages, and resubmit after confirming sitemap discovery.
  - Success target: more than 80% of tracked URLs indexed, with all priority money pages eligible.
- [x] **Create a real visibility baseline — query basket created**
  - Canonry currently has zero tracked queries and no completed provider checks, so mention coverage and citation coverage are unavailable—not zero performance.
  - Added 12 relevant high-intent queries: `restoration marketing agency`, `restoration SEO services`, `water damage restoration marketing`, `fire damage restoration marketing`, `mold remediation marketing`, `restoration website design`, `Google Ads for restoration companies`, `local SEO for restoration companies`, `how to generate restoration leads`, `restoration lead generation services`, `restoration marketing ROI`, and `digital marketing for restoration companies`.
  - The discovery session was reviewed; low-fit software, directory, coupon, and competitor-comparison queries were not promoted.
  - Next: run the first real multi-provider sweep after confirming indexing priorities.
- [x] **Connect Google Search Console**
  - GSC is now connected to the Canonry project; use its coverage data to diagnose the 50 non-indexed URLs and correlate query/page performance.
- [x] **Keep sitemap discovery resilient**
  - An initial scheduled inspection attempted `/sitemap.xml` and received 404 before a later manual inspection followed the robots.txt sitemap index successfully.
  - Canonry’s GSC sitemap configuration now points directly to `sitemap-index.xml`; added a Netlify compatibility redirect from `/sitemap.xml` to `/sitemap-index.xml` for crawlers that use the default path.
- [ ] **Deploy the visibility-gap content update**
  - Live `/services/lead-tracking/` currently lacks the new “How does restoration lead tracking improve marketing ROI?” answer even though the local build contains it.
  - Deploy the current working tree, verify the answer and generated industry/service blocks live, then rerun the visibility sweep.

## Separate discovery finding

Canonry also reports one medium-severity discovery finding: 30 representative queries were tested, with 1 cited result and 29 aspirational queries. This is not a technical defect. Review the discovery session before promoting any queries:

`429000e8-1ced-4236-a198-e368be88ca22`

Promote only queries that match the business's services and audience; do not expand the tracked basket indiscriminately.

## Completed work log

| Date | Work | Result |
|---|---|---|
| 2026-07-13 | Reviewed Canonry technical AEO audit | Baseline recorded: 57/100, 93 pages, no crawl errors |
| 2026-07-14 | Implemented shared AEO fixes | Added freshness dates and sitemap lastmod, removed duplicate breadcrumbs, standardized inline JSON-LD, and improved descriptive links |
| 2026-07-14 | Re-audited live deployment | New site audit completed; indexing is 43/93 (46%), with zero tracked visibility queries at audit time; GSC was subsequently connected |
| 2026-07-14 | Added initial Canonry query basket | Added 12 commercial, service-aligned queries; excluded low-fit discovery candidates; verified project list |
| 2026-07-14 | Ran first real visibility sweep | 83% mention coverage (10/12), 42% citation coverage (5/12); prioritized lead-generation, ROI, and cross-provider retrieval gaps |
| 2026-07-14 | Implemented visibility-gap content updates | Added brand-attributed ROI/lead-tracking answer and reusable specialized service answer blocks; build passed across 93 pages |
| 2026-07-14 | Corrected GSC sitemap and synced coverage | Set Canonry/GSC sitemap to `sitemap-index.xml`, completed full sync, and submitted six priority indexing requests |
| 2026-07-14 | Rechecked live content and GSC | Live ROI answer is not deployed; GSC now reports 43/94 indexed (45.7%) and 51 URLs unknown to Google |
| 2026-07-14 | Added sitemap compatibility redirect | Added `public/_redirects` rule from `/sitemap.xml` to the canonical sitemap index |
| 2026-07-14 | Added authority citations to lead tracking | Linked to official GA4 and Google Ads conversion documentation and tied the guidance to booked-job attribution |
