# Canonry AEO 100% Remediation Plan

Project: `remediation-restoration-marketing`

Domain: `remediationrestorationmarketing.com`

Plan refreshed: 2026-07-16

Technical audit: `d623322b-3b37-4857-bf97-8b193df318cb` (2026-07-14)

Visibility run: `8f42f5eb-3157-4877-b903-2c722711a8dd` (2026-07-14)

## Definition of done

This plan is complete only when all of the following are proven by new live evidence:

- [ ] Canonry Technical AEO aggregate score is **100/100**.
- [ ] Every in-scope sitemap URL scores **100/100**, with 0 partial, failed, errored, or skipped pages.
- [ ] Google indexes more than 80% of tracked URLs and every priority commercial/content URL is indexed; the working target is 100% of URLs that are intended to be indexed.
- [ ] Mention Coverage is **100%** for the adopted 12-query commercial basket.
- [ ] Citation Coverage is **100%** for that basket, with at least one citation from every tracked provider.
- [ ] Four comparable visibility checks exist before claiming a stable trend.
- [ ] Every content opportunity and every Canonry prioritized fix below is completed or explicitly rejected with documented evidence.

Technical score, mention coverage, citation coverage, and index coverage are different measures. A 100 technical score does not guarantee 100 mentions or citations, so each has its own gate.

## Current baseline

### Local remediation evidence — 2026-07-16

- Production build passes for all 93 generated routes and creates 93 page-level Markdown alternates.
- The audited sitemap contains 90 public URLs; `/admin/`, `/privacy/`, and `/tos/` are intentionally excluded.
- Rendered-page validation reports **0 public H1 failures** and **0 public canonical failures**. The shared banner renders a paragraph by default and becomes the sole H1 only on templates that explicitly opt in.
- A first pass reached a 96/100 local average by appending the same generic AEO support section to every page. Browser review rejected that implementation because it duplicated existing copy, repeated an unrelated testimonial and FAQs, and did not match the site's visual system. That block was removed rather than shipping audit-oriented filler.
- The browser-reviewed build now averages **76.26/100 locally** (minimum 68, maximum 86). This is the honest baseline for the design-safe implementation; remaining gains must come from page-specific content and schema attached to visible, relevant sections.
- Static Content Freshness remains partial because a filesystem audit cannot observe production `Last-Modified` headers or live sitemap freshness. The deployed `_headers` and sitemap supply those production signals.
- In-app browser checks cover the homepage, a service detail page, the services index, an industry page, a generated industry/service landing page, and a resource article. No generic support block remains, metadata reads naturally, and the existing FAQ design remains intact.
- The rejected audit copy has now been repurposed into a native `MarketingFramework` component on the 64 generated industry/service pages. It uses page-specific service and industry language, three process cards, compact metric definitions, three relevant FAQs, and a restrained primary-source note. Its HowTo and FAQ schema are generated from the same visible content.
- Browser review confirmed the component uses the site's existing muted section background, white cards, typography, spacing, borders, and primary color. The brittle class-name compressor that initially broke this styling was removed from the production build.
- After this design-safe component was added, all 64 generated pages score **91/100 locally** and the 90-page public average rose to **86.92/100**, without restoring the generic sitewide block.
- Canonry's current Content Extractability implementation has an apparent maximum raw factor score of 85 (its published subcriteria total 85), so a literal 100 on that individual factor is not attainable in this analyzer version. The site meets every non-ratio extractability subcriterion; the remaining optimization is reducing repeated rendered markup.
- A new live deploy and Canonry audit are still required before replacing the historical 50/100 production baseline or marking the definition-of-done gates complete.

### Technical audit

- Aggregate score: **50/100**, down 21 points from 71.
- Scope: 92 pages discovered and audited; 0 errors and 0 skipped.
- Sitemap audited: `https://remediationrestorationmarketing.com/sitemap.xml`.
- Page-score distribution: 48 pages at 28; remaining 44 pages range from 67 to 77. No page currently scores 100.
- Highest current page: homepage at 77.
- The uniform 28-point result on 48 pages indicates a shared render/deployment/parity failure, not 48 unrelated editorial defects.

### Visibility and indexing

- Adopted query basket: 12 commercial queries.
- Query-level Mention Coverage: **83% (10/12)**.
- Query-level Citation Coverage: **42% (5/12)**.
- Provider-pair results: Gemini 4/12 citations, OpenAI 2/12, Claude 0/12.
- Mention Share: 86% (19 of 22 tracked brand mentions).
- Google index coverage: **46% (43/94)**; 51 URLs not indexed.
- Trend confidence is incomplete: Canonry requires four comparable checks.
- The downloadable report also pools a larger 42-query report/discovery set and reports 24% mentions and 12% citations. Do not mix that denominator with the adopted 12-query baseline.
- The report says Search Console is not connected even though index coverage is present. Treat this as a connection/sync health issue until `cnry google` status and a fresh sync prove otherwise.

## Canonry prioritized-fix traceability

Every item in Canonry's `prioritizedFixes` array is mapped below so none can disappear during deduplication.

| Canonry prioritized fix | Reported scope | Plan coverage |
|---|---:|---|
| E-E-A-T Signals | 19/100; 92 pages | P1.4 |
| Content Freshness | 33/100; 88 pages in prioritized output | P1.5 |
| Content Extractability | 46/100; 92 pages | P1.6 |
| Entity Consistency | 56/100; 92 pages in prioritized output | P1.10 |
| AI Access Files | 60/100; 92 pages in prioritized output | P1.13 |
| AI Crawler Access | 61/100; output incorrectly says 0 pages; factor table shows 51 affected | P1.14 |
| Citations & Authority Signals | 47/100; 50 pages | P1.12 |
| Content Depth | 56/100; 91 pages in prioritized output | P1.7 |
| Structured Data | 37/100; 92 pages in prioritized output | P1.1 |
| Schema Completeness | 48/100; 48 pages | P1.2 |
| Named Entities | 69/100; 60 pages in prioritized output | P1.11 |
| Technical SEO | 81/100; 82 pages in prioritized output | P1.15 |
| Definition Blocks | present on 41 pages; best reported page 54/100 | P1.9 |
| FAQ Content | present on 3 pages; best reported page 46/100 | P1.8 |

## P0 — repair the 48-page shared failure

All 48 URLs below score 28 and share the same factor signature: no structured data, no schema completeness, no FAQ/definition structure, no E-E-A-T, weak entity/contact signals, weak content depth/extractability/citations, and only 30/100 AI-crawler access. Fix the shared layout/build/deployment path before page-by-page writing.

Affected scope:

- [ ] `/privacy/` (1 page).
- [ ] `/resources/` and all three `/resources/{post}/` pages (4 pages).
- [ ] All eight `/roof-damage-restoration/{service}/` pages.
- [ ] `/schedule/` (1 page).
- [ ] `/services/` and all eight `/services/{service}/` pages (9 pages).
- [ ] All eight `/sewage-cleanup/{service}/` pages.
- [ ] All eight `/storm-damage-cleanup/{service}/` pages.
- [ ] `/tos/` (1 page).
- [ ] All eight `/water-damage-restoration/{service}/` pages.

Actions:

- [ ] Fetch representative live HTML from every affected route family and compare it with the local production build. Confirm that the full `<head>`, shared JSON-LD, footer trust links, visible contact data, FAQ/direct-answer blocks, and body copy are present in the initial HTML response without client-side execution.
- [ ] Confirm every route uses `BaseLayout.astro` and that no alternate template, stale deploy artifact, edge cache, redirect, content negotiation, or partial build bypasses it.
- [ ] Verify `public/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, and `/sitemap-index.xml` return 200 with the same valid body for normal requests and `Accept: text/markdown` requests.
- [ ] Purge/redeploy the production build and invalidate any CDN cache after parity is fixed.
- [ ] Run a local sitemap audit against the built site, then a new live Canonry technical audit. Do not mark this gate complete until all 48 pages lose the 28-point signature.

## P1 — satisfy every technical factor

The checklist below combines every cross-cutting issue, every prioritized fix, and the analyzer’s full-score conditions. Apply shared fixes in `BaseLayout.astro`, shared components, content collections, and sitemap configuration wherever possible.

### 1. Structured Data (JSON-LD) — 37/100; 48 failing

- [ ] Ensure valid JSON-LD is present in the server-rendered HTML of all in-scope pages.
- [ ] Emit a canonical, stable `@id` graph with Organization/ProfessionalService, WebSite, WebPage, BreadcrumbList, and Person entities on every relevant page.
- [ ] Add page-appropriate Service, Article/BlogPosting, FAQPage, and HowTo entities only when the matching content is visible.
- [ ] Give each top-level entity at least eight useful properties where possible.
- [ ] Maintain schema parity automatically for every new service, industry, generated landing, and resource page.
- [ ] Literal 100 caveat: Canonry’s structured-data factor awards full points only when LocalBusiness, FAQPage, Service, and HowTo are all detected. Add them only where truthful. Exclude non-target utility/legal URLs from the audited sitemap instead of publishing misleading schema solely to game the score.

### 2. Schema Completeness — 48/100; 48 failing

- [ ] Organization: populate at least five of `name`, `logo`, `contactPoint`, `sameAs`, `foundingDate`, `url`, and `description`; target all seven.
- [ ] ProfessionalService/LocalBusiness: populate at least six of `name`, `address`, `telephone`, `openingHours`, `priceRange`, `image`, `url`, and `geo`; target all eight.
- [ ] FAQPage: include at least three visible Question/Answer pairs, each answer at least 15 words.
- [ ] HowTo: include at least three visible, descriptive steps.
- [ ] Verify schema values match visible content and do not create unsupported ratings, reviews, locations, credentials, or claims.

### 3. Schema Validity — 100/100

- [ ] Preserve valid JSON syntax and one canonical block for each singleton type: FAQPage, HowTo, Article/BlogPosting, BreadcrumbList, and other singleton schemas.
- [ ] Add automated tests that fail the build on empty JSON-LD, parse errors, duplicate singleton types, or schema/content mismatch.

### 4. E-E-A-T Signals — 19/100; all 92 affected

- [ ] Add a visible author/byline or reviewed-by treatment to editorial and expert content.
- [ ] Add `<meta name="author" content="Matt Pugh">` on applicable pages.
- [ ] Expand Matt Pugh Person schema with truthful `jobTitle`, `knowsAbout`, `sameAs`, and any verifiable `alumniOf` or `hasCredential` data.
- [ ] Link Organization/ProfessionalService schema to Matt with `founder` or `employee` and stable `@id` references.
- [ ] Ensure every page links visibly to About, Privacy, and Terms.
- [ ] Add visible customer reviews and matching Review/AggregateRating schema only when genuine source data exists. Obtain and display real review data if a literal 100 is required; never manufacture ratings.
- [ ] Add an editorial policy, fact-check/review process, and last-reviewed disclosure to YMYL-adjacent marketing claims where relevant.

### 5. Content Freshness — 33/100; all 92 affected

- [ ] Add accurate, recent `dateModified` to WebPage, Article/BlogPosting, and other relevant page entities.
- [ ] Emit a matching `<lastmod>` for every audited canonical URL, including generated pages, in the sitemap actually consumed by Canonry.
- [ ] Serve a valid recent HTTP `Last-Modified` header for static pages if the hosting layer supports it.
- [ ] Keep the footer copyright year current.
- [ ] Use real review/update dates from content data; do not reset every page’s date on every build without substantive review.
- [ ] Add a scheduled quarterly content-review workflow so `dateModified` and sitemap freshness remain within Canonry’s three-month full-score window.

### 6. Content Extractability — 46/100; all 92 affected

- [ ] Raise visible-text-to-HTML ratio above 30% by reducing repeated markup and boilerplate and by adding useful page-specific text.
- [ ] Put a concise one-to-three-sentence answer directly after at least three H2/H3 headings per page.
- [ ] Include at least five focused paragraphs of 40–200 words per page.
- [ ] Keep primary content server-rendered, ungated, and free of paywall/login signals.
- [ ] Keep ad elements at zero or minimal.
- [ ] Ensure shared answer blocks are page-specific and not repeated boilerplate across dozens of URLs.

### 7. Content Depth — 56/100; 48 failing, 1 partial

- [ ] Give each commercial/content page at least 1,200 words of useful, non-duplicative topical coverage where the search intent supports it.
- [ ] Use exactly one H1.
- [ ] Use at least three H2s and two H3s with a logical hierarchy.
- [ ] Include at least eight substantive paragraphs.
- [ ] Include at least one useful bullet or numbered list.
- [ ] Cover intent-specific questions, selection criteria, process, deliverables, proof, expected timeline, measurement, common mistakes, and next steps.
- [ ] Consolidate or remove thin/duplicative generated pages that cannot justify unique value.

### 8. FAQ Content — 11/100; all 92 affected

- [ ] Add at least three visible, page-specific FAQ items to every in-scope commercial/content page.
- [ ] Render each FAQ as a `<details><summary>` question/answer pair; the question must end with `?`.
- [ ] Emit one matching FAQPage schema block from the same data source.
- [ ] Keep answers substantive, accurate, and at least 15 words.
- [ ] Do not add FAQPage schema to legal or utility pages unless genuine visible FAQs belong there; remove such pages from the audited sitemap if they are not AEO targets.

### 9. Definition Blocks — 24/100; all 92 affected

- [ ] Add at least two natural definition-style headings per target page beginning with “What is,” “How to,” or “Why.”
- [ ] Follow each with a direct answer.
- [ ] Include at least one ordered list containing three or more real procedural steps.
- [ ] Add matching HowTo schema with at least three visible steps when the page is genuinely instructional.
- [ ] Add a useful `<dl>` definition list for terms, deliverables, metrics, or service components.

### 10. Entity Consistency — 56/100; 84 affected

- [ ] Use `Remediation & Restoration Marketing` as the canonical business name across title, `og:title`, visible copy, and JSON-LD.
- [ ] Keep every title at 70 characters or fewer.
- [ ] Emit a self-referencing absolute canonical on every indexable page.
- [ ] Add `email` and `telephone` to Organization/ProfessionalService/contactPoint schema.
- [ ] Mirror the exact email or telephone visibly on every page so schema and page content overlap.
- [ ] Keep the Hanover address, service area, URL, logo, and social/profile URLs identical across visible content and schema.

### 11. Named Entities — 69/100; 48 failing/60 prioritized

- [ ] Mention the canonical brand name naturally at least three times in visible page content.
- [ ] Add truthful `knowsAbout` and founder/person associations to the entity graph.
- [ ] Name relevant services, industry verticals, platforms, standards, people, and locations explicitly rather than relying on pronouns or generic terms.
- [ ] Target at least 8% useful proper-noun density without keyword stuffing.

### 12. Citations & Authority Signals — 47/100; 50 affected

- [ ] Add at least eight relevant external sources on deep informational pages where appropriate.
- [ ] Include at least one authoritative `.gov`, `.edu`, or Wikipedia source where it directly supports the content.
- [ ] Use descriptive external anchor text averaging at least three words; replace “learn more,” “click here,” and bare URLs.
- [ ] Add at least three legitimate `sameAs` URLs to the entity schema (for example verified social, directory, or business profiles).
- [ ] Cite primary sources for Google Ads, Analytics, Search Console, platform specifications, industry statistics, and regulatory claims.
- [ ] Build third-party authority on the sources AI already trusts: pursue accurate inclusion, quotes, profiles, partnerships, or contributed expertise on relevant independent sites and industry media. Do not buy or fabricate citations.

### 13. AI Access Files (llms.txt, sitemap) — 60/100; 51 affected

- [ ] Keep `/llms.txt` reachable and above 100 useful words.
- [ ] Keep `/llms-full.txt` reachable and above 200 useful words; cover all services, industries, FAQs, entity facts, proof, and service area.
- [ ] Keep `/robots.txt` and the canonical sitemap reachable with 200 responses.
- [ ] Add a document-head link to `/llms.txt` on every page.
- [ ] Expose a real Markdown representation for every audited page and advertise it with `<link rel="alternate" type="text/markdown" href="...">` or an equivalent Link header. A link to the global `llms.txt` does not satisfy this requirement.
- [ ] Ensure content negotiation never redirects `.txt` resources to missing `.md` variants.

### 14. AI Crawler Access — 61/100; 51 affected

- [ ] Make robots.txt consistently retrievable for every audited request/path.
- [ ] Explicitly allow GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, and Google-Extended on all public target paths.
- [ ] Keep an explicit `Sitemap:` directive pointing to the working canonical sitemap.
- [ ] Keep a machine-readable `Content-Signal: search=yes, ai-input=yes, ai-train=no` directive (or the business-approved policy).
- [ ] Verify no CDN/WAF/bot-management rule, redirect loop, rate limit, or path rule blocks any of the five crawlers.

### 15. Technical SEO — 81/100; 82 pages in prioritized-fix output

- [ ] Exactly one H1 per indexable page.
- [ ] Give every content image a descriptive `alt`; use empty `alt` only for truly decorative images.
- [ ] Write a unique 120–160-character meta description for every page; use 150–160 as the editorial target.
- [ ] Add one correct absolute self-canonical per page.
- [ ] Check titles, descriptions, canonicals, H1s, and image alt text in the rendered production HTML, not only source templates.

### 16. Snippet Eligibility — 100/100

- [ ] Preserve the absence of `noindex`, `nosnippet`, `none`, and `max-snippet:0` on target pages.
- [ ] Use `max-snippet:-1` or no restrictive cap.
- [ ] Keep utility/admin pages outside the sitemap and confirm their directives do not leak into public templates.

## P2 — indexing remediation

- [ ] Export all 51 not-indexed URLs with their Google inspection verdicts.
- [ ] Classify each as unknown, discovered-not-indexed, crawled-not-indexed, duplicate/canonicalized, blocked, soft-404, redirect, or server error.
- [ ] Confirm Canonry and GSC use the same canonical sitemap. Resolve the report’s `/sitemap.xml` versus configured `sitemap-index.xml` ambiguity.
- [ ] Reconnect or repair Search Console access and complete a fresh sync; the report currently says it is not connected.
- [ ] Fix sitemap membership, self-canonicals, internal links, thin/duplicate content, status codes, and rendering before resubmission.
- [ ] Prioritize homepage, `/services/`, eight service pages, eight industry pages, the 64 industry/service landing pages, and the three resources.
- [ ] Submit corrected priority URLs through Google and submit the sitemap; send Bing IndexNow batches as well.
- [ ] Recheck inspection acceptance after 24–72 hours and weekly thereafter.
- [ ] Do not expand the content program until all priority money pages are index-eligible and overall coverage exceeds 80%.

## P3 — all Canonry report opportunities

Canonry currently reports two ranked, ownable opportunities and zero formal content gaps. Both have low confidence because Search Console demand data is unavailable in the report, so validate mapping before creating duplicate pages.

### Opportunity 1: fire damage restoration marketing (`tgt_rp3h5r`)

- [ ] First map the query to the existing `/industries/fire-damage-restoration/` page and the eight `/fire-damage-restoration/{service}/` pages. Canonry says “no existing page,” but the repository contains the topic; fix discovery/indexing/canonical mapping before creating a duplicate.
- [ ] If the industry page matches intent, strengthen it as the canonical hub with a direct brand-attributed answer, unique depth, FAQ, process, proof, internal links, authoritative citations, and complete schema.
- [ ] Compare its coverage and format with the cited Clicks Geek page, without copying it.
- [ ] Create a new page only if the existing page cannot satisfy the query without intent conflict.
- [ ] Success: the canonical owned page is indexed, mentioned, and cited across providers for the query.

### Opportunity 2: restoration marketing agency (`tgt_b0jkj7`)

- [ ] Map this query to the homepage first. Canonry says “no existing page,” but the homepage title and current OpenAI citation already target the phrase; fix target detection/indexing rather than creating a competing duplicate.
- [ ] Strengthen the homepage’s opening answer, agency differentiation, services summary, founder expertise, evidence, comparison criteria, FAQ, and entity/schema graph.
- [ ] Consider an editorial “how to choose a restoration marketing agency” page only if it serves a distinct informational intent and canonically links to the homepage.
- [ ] Analyze the cited Thrive list page and pursue legitimate third-party agency-list inclusion where editorially possible.
- [ ] Success: the homepage remains the canonical commercial target and gains repeatable mentions/citations across providers.

## P4 — close every visibility gap in the 12-query basket

### Not mentioned (primary priority)

- [ ] `restoration lead generation services`: build or strengthen the lead-tracking/lead-generation hub, explicitly name the brand in the direct answer, explain channels and booked-job attribution, and link from relevant industry pages.
- [ ] `restoration marketing ROI`: strengthen the lead-tracking/ROI content so the brand is named in the visible answer. The domain was cited by Gemini without a brand mention, so this is a citation-to-mention conversion task.

### Mentioned but not cited

- [ ] `digital marketing for restoration companies`.
- [ ] `Google Ads for restoration companies`.
- [ ] `how to generate restoration leads`.
- [ ] `local SEO for restoration companies`.
- [ ] `mold remediation marketing`.
- [ ] `water damage restoration marketing`.

For each query above:

- [ ] Assign exactly one canonical target URL.
- [ ] Ensure the target is indexed and linked from the homepage, services hub, and relevant industry hubs.
- [ ] Add a 40–200-word direct answer, explicit brand attribution, supporting proof, primary-source citations, FAQ, and matching schema.
- [ ] Compare provider source pages and cover missing subtopics/formats with original content.
- [ ] Monitor for a citation without assuming deployment will force one.

### Already cited but not universal

- [ ] Preserve and expand citations for `fire damage restoration marketing`, `restoration marketing agency`, `restoration marketing ROI`, `restoration SEO services`, and `restoration website design`.
- [ ] Diagnose Claude’s 0/12 result by reviewing its cited domains and formats. Its recurring sources include Docusketch, The RMG, YouTube, Restoration Inbound, Clicks Geek, Thrive, PushLeads, and Water Restoration Marketing.
- [ ] Add provider-relevant evidence formats: original guides, definitions, process pages, comparative criteria, measurable case studies, and useful video/transcript content.
- [ ] Run probes for diagnosis; use real scheduled sweeps only for measurement.

## P5 — measurement and query governance

- [ ] Reconcile the 12 adopted commercial queries with the report’s 42-query pooled/discovery set; archive or leave unpromoted low-fit directory, software, coupon, and comparison queries.
- [ ] Restore GSC query data before accepting new content recommendations.
- [ ] Maintain 8–12 high-intent core queries until indexing and base visibility are stable.
- [ ] Run weekly multi-provider visibility checks and weekly technical audits.
- [ ] Build four comparable checks before calling a trend.
- [ ] Track mention first, citation second, and never treat an unchecked/null mention as a miss.
- [ ] Monitor the five first citations from the baseline run to confirm persistence.
- [ ] Correlate changes with deployments, indexing status, GA4 AI referrals, and server-side crawler activity once connected.

## Implementation order

1. **Audit scope and deployment parity:** fix the 48-page 28-score signature; remove non-target utility/legal URLs from the audited sitemap where appropriate.
2. **Shared technical layer:** schema graph, contacts, authorship, trust links, freshness, canonicals, crawler access, AI files, and per-page Markdown.
3. **Shared content components:** direct answers, FAQs, definitions, ordered steps, definition lists, citations, and page-specific entity copy.
4. **Page-level depth:** make every target unique and useful; consolidate thin/duplicative generated pages.
5. **Indexing:** repair GSC connection, resolve all 51 cases, submit priority URLs, and verify eligibility.
6. **Opportunity mapping:** optimize existing fire-damage and homepage targets before creating new pages.
7. **Visibility gaps:** fix the two non-mentions, seven uncited queries, and Claude’s zero-citation provider gap.
8. **Verification:** local audit, rendered-HTML QA, live deploy QA, new Canonry technical audit, then recurring visibility checks.

## Final verification commands

```bash
npm run build
cnry technical-aeo run remediation-restoration-marketing --wait
cnry technical-aeo score remediation-restoration-marketing --format json
cnry technical-aeo pages remediation-restoration-marketing --sort score-asc --limit 200 --format json
cnry google coverage remediation-restoration-marketing
cnry analytics remediation-restoration-marketing --feature gaps
cnry evidence remediation-restoration-marketing --format json
cnry report remediation-restoration-marketing --format json
```

Final acceptance audit:

- [ ] Aggregate score is 100, all factor averages are 100, and every audited page is 100.
- [ ] No Canonry cross-cutting issue or prioritized fix remains.
- [ ] No opportunity, action-plan item, diagnostic warning, indexing issue, mention gap, citation gap, or zero-citation provider remains unaddressed.
- [ ] Schema is truthful and matches visible content; the score was not achieved with fabricated reviews, credentials, ratings, locations, or irrelevant markup.
- [ ] The final report is saved with run IDs and before/after factor deltas.
