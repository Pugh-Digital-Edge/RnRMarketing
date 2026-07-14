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

- [ ] **Improve freshness signals** (avg. 17/100; all 93 pages affected)
  - Add meaningful `dateModified` values to Article/Service/WebPage structured data where applicable.
  - Add sitemap `<lastmod>` values for content pages.
  - Establish a content-maintenance convention so dates reflect real editorial updates, not build time.

- [x] **Add authorship and trust signals** (avg. 22/100; all 93 pages affected)
  - Added a site-wide author meta tag for the identified site founder/editor, Matt Pugh.
  - Added a visible Matt Pugh profile anchor and linked Person schema on the About page.
  - Add Review/AggregateRating schema only if genuine, visible customer review data exists; do not manufacture ratings.

- [ ] **Repair duplicate BreadcrumbList schema** (schema validity affected 77 pages)
  - Locate the duplicate breadcrumb JSON-LD generation, likely across `src/layouts/BaseLayout.astro` and page/component-level schema.
  - Keep one canonical BreadcrumbList per page and verify the rendered JSON-LD after the change.

- [ ] **Strengthen entity consistency** (avg. 60/100; 75 partial pages)
  - Use `Remediation & Restoration Marketing` consistently in titles, Open Graph fields, visible headings, and JSON-LD.
  - Mirror the same canonical contact details in visible content and JSON-LD.
  - Keep page titles at 70 characters or fewer where possible.

## Priority 2 — content structure and authority

- [x] **Add FAQ schema and conversational question headings** (avg. 15/100; 80 failing pages)
  - The shared `FAQ.astro` component already emits `FAQPage` JSON-LD from the same data used by its visible questions.
  - Reuse the existing FAQ content/components where questions and answers are visible.
  - Emit `FAQPage` JSON-LD only for FAQs present on the page.
  - Prioritize the homepage, service pages, and `/schedule/` (the audit identified it as the strongest existing FAQ page).

- [ ] **Add definition and instructional blocks** (avg. 20/100; 88 failing pages)
  - Add concise “What is…” definitions to service and industry pages.
  - Add “How to…” sections and ordered steps where the page genuinely explains a process.
  - Use `HowTo` schema only for actual step-by-step instructional content.

- [ ] **Improve extractability** (avg. 55/100; 90 affected pages)
  - Break dense copy into focused 40–200 word paragraphs.
  - Add direct-answer paragraphs beneath key H2/H3 headings.
  - Reduce repeated boilerplate where it crowds out page-specific expertise.

- [ ] **Improve citations and authority signals** (avg. 51/100; 92 affected pages)
  - Replace generic external link labels such as “click here” with descriptive anchor text.
  - Add relevant `sameAs` references for legitimate business profiles/directories.
  - Cite authoritative third-party sources where claims, standards, or guidance warrant support.

## Priority 3 — targeted cleanup

- [ ] **Resolve the single missing-H1 page**
  - Identify the page in the page-level audit output and add exactly one descriptive H1.

- [x] **Review low-scoring pages and sitemap scope**
  - `/admin/` is disallowed in `robots.txt` and is now explicitly excluded from the Astro sitemap.
  - Review generated/legacy service URLs for useful content, canonical URLs, and accidental thin pages.

- [ ] **Maintain schema parity**
  - Ensure newly generated service, industry, and resource pages receive the same appropriate Organization/Service/Article/Breadcrumb schema patterns.
  - Add Organization schema where the audit reports it missing, but avoid adding irrelevant schema types to every page.

## Canonry follow-up

- [ ] Implement Priority 1 shared fixes.
- [ ] Rebuild and confirm the production sitemap, robots.txt, and rendered JSON-LD.
- [ ] Run a new technical audit and compare the score/factor deltas.
- [ ] Re-check the lowest-scoring URLs, especially `/admin/` and generated service pages.
- [ ] Run a real visibility sweep after the site changes have had time to be indexed; use probes only for isolated verification.

## Separate discovery finding

Canonry also reports one medium-severity discovery finding: 30 representative queries were tested, with 1 cited result and 29 aspirational queries. This is not a technical defect. Review the discovery session before promoting any queries:

`429000e8-1ced-4236-a198-e368be88ca22`

Promote only queries that match the business's services and audience; do not expand the tracked basket indiscriminately.

## Completed work log

| Date | Work | Result |
|---|---|---|
| 2026-07-13 | Reviewed Canonry technical AEO audit | Baseline recorded: 57/100, 93 pages, no crawl errors |
