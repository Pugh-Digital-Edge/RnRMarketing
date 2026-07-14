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
- [ ] Run a new technical audit and compare the score/factor deltas.
- [x] Re-check the lowest-scoring URLs, especially `/admin/` and generated service pages.
- [ ] Run a real visibility sweep after the site changes have had time to be indexed; use probes only for isolated verification.

  **Deployment gate:** the public site still serves the pre-change build (verified 2026-07-14: `/services/seo/` still has two `BreadcrumbList` blocks and no `dateModified`; live sitemap has no `<lastmod>` values). Deploy the current build before running the new audit or visibility sweep.

## Separate discovery finding

Canonry also reports one medium-severity discovery finding: 30 representative queries were tested, with 1 cited result and 29 aspirational queries. This is not a technical defect. Review the discovery session before promoting any queries:

`429000e8-1ced-4236-a198-e368be88ca22`

Promote only queries that match the business's services and audience; do not expand the tracked basket indiscriminately.

## Completed work log

| Date | Work | Result |
|---|---|---|
| 2026-07-13 | Reviewed Canonry technical AEO audit | Baseline recorded: 57/100, 93 pages, no crawl errors |
| 2026-07-14 | Implemented shared AEO fixes | Added freshness dates and sitemap lastmod, removed duplicate breadcrumbs, standardized inline JSON-LD, and improved descriptive links |
