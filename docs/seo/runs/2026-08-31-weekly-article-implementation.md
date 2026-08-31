# Weekly SEO Article Implementation

## Run metadata

- Run time: 2026-08-31T10:42:08.6938820-04:00 (America/New_York).
- Role: autonomous Canonry-evidence article implementation.
- Canonry project: `remediation-restoration-marketing` only.
- Backlog intervention: SEO-009.
- Repository branch: `main`.
- Pre-implementation HEAD: `2c7c54533009d284b65794b61b53303c1580da10`.
- Article implementation commit: `1b13b66e4d6f4483b9bbc15f466847fbb965d0ce`.
- Outcome: one new article validated, committed, and pushed; production verification remains assigned to the regression automation.

## Evidence gate

- Canonry runtime: Node `v24.18.0`, Canonry CLI `4.177.1`, configured project runtime available.
- Stored reads only: no visibility sweep, provider probe, discovery session, technical audit, GSC/Bing sync, indexing request, sitemap submission, or connected-account mutation was run.
- High-severity insights: 0 high and 0 critical active insights.
- Current stored 42-query overview from completed run `30969b56-2bc9-49cc-bba3-4cee92a4e36e`: Mention Coverage 5/42 (12%), non-brand Mention Share 5/29 (17%), and Citation Coverage 3/42 (7%). These remain separate measures.
- Exact Canonry target: `tgt_15i6eaw`, `how does local service ads work for damage restoration`.
- Winnability: `ownable`, score `1.0`, medium action confidence.
- Stored 30-day and 90-day evidence: 0/2 mentioned and 0/2 cited for the exact query in both windows. Canonry content gaps report a 100% miss rate and six cited competitor domains.
- Stored GSC demand through 2026-08-22: 34 impressions, 0 clicks, weighted average position 27.59 across `local service ads for restoration companies` and `restoration local service ads`. The rows were split between `/services/ppc/` and `/water-damage-restoration/ppc/`, which confirms demand but no dedicated informational target.
- Missing conversion, GA4, GBP, server-log, fresh indexing, and post-publication evidence are unavailable, not zero.

## Problem classification and topic rationale

Problem classification: search-intent/content gap; internal-link support; entity, citation, and AEO weakness.

The existing `/services/ppc/` and generated restoration/PPC pages serve commercial campaign-management intent. They do not provide a dedicated operator guide to LSA eligibility, verification, service-area controls, ranking inputs, lead handling, credits, and booked-job measurement. The new resource serves that informational decision intent and links naturally to the commercial pages rather than replacing them.

Repository review covered the five existing resource articles, eight service records, eight industry records, `src/content/config.ts`, `src/pages/resources/[...post].astro`, the SEO strategy/backlog/learnings, recent run records, and `docs/AEO-AUDIT-ACTION-PLAN.md`. No existing article adequately serves the exact LSA intent. The fire- and water-damage marketing guides mention paid acquisition but would become overbroad if expanded into a complete, cross-restoration LSA operating guide.

Auto-approval rationale: SEO-009 passed the stored query-evidence, ownability, nonduplication, article-suitability, primary-source, image, and local validation gates. Approval state is `Auto-approved by weekly article automation on 2026-08-31`.

## Competitor and source pattern

Canonry's stored grounding sources for the exact query were six restoration-specific LSA or paid-search guides:

- 12AM Agency: step-by-step restoration LSA guide, 2 stored citations.
- PushLeads: restoration LSA setup/cost/ROI guide, 2 stored citations.
- Restoration Inbound: restoration LSA lead guide, 2 stored citations.
- Water Restoration Marketing: restoration LSA explainer, 1 stored citation.
- Blue Corona: restoration LSA service/guide page, 2 stored citations.
- 7ten Marketing: broader restoration Google Ads guide, 1 stored citation.

The implementation follows the useful pattern—an industry-specific explanation with setup, controls, and measurement—but does not copy competitor wording, prices, benchmarks, claims, or structure. Material product claims use current Google first-party sources covering LSA eligibility, provider qualification, Business Profile affiliation, reach/job types, ranking inputs, lead management, and automated lead credits.

## Implemented article

- Source: `src/content/blog/local-services-ads-for-restoration-companies.md`.
- Production URL expectation: `https://remediationrestorationmarketing.com/resources/local-services-ads-for-restoration-companies/`.
- Title: `Local Services Ads for Restoration Companies: How They Work`.
- Author: Matt Pugh.
- Length: 1,966 words in the Markdown body.
- Structure: direct answer, channel comparison, eligibility and verification, operations-aligned configuration, ranking inputs, lead handling, charge/credit review, booked-job measurement, decision criteria, and a 30-day launch plan.
- FAQ behavior: four frontmatter FAQs feed exactly one visible FAQ block and one synchronized FAQPage schema source through the existing renderer.
- Body images: none.
- Primary sources: seven current Google Local Services/Advertising Help pages.

## Internal links

Nine unique internal destinations were validated:

- `/services/ppc/`
- `/services/lead-tracking/`
- `/services/web-design/`
- `/services/reputation-management/`
- `/services/seo/`
- `/services/retargeting/`
- `/services/social-media-advertising/`
- `/resources/water-damage-restoration-marketing/`
- `/resources/10-powerful-restoration-marketing-strategies-to-boost-your-business/`

All resolved in the production build. Commercial PPC ownership remains on `/services/ppc/`; the new resource is the informational target.

## Cover generation and image QA

- Tool path: built-in ImageGen, `photorealistic-natural` use case.
- Final project asset: `src/assets/images/blog/local-services-ads-restoration-companies.webp`.
- Dimensions and size: 1590×800 WebP, 96,484 bytes.
- Final prompt intent: a restoration-company owner and marketing strategist reviewing an unlabeled service-territory and lead-handling plan in a practical office, with all boards, papers, maps, and screens reduced to abstract geometric shapes.
- First output rejection: the initial wall workflow board contained text-like marks that could read as garbled labels.
- Final QA: passed after a targeted edit. The cover has no readable or garbled text, numbers, fake metrics, rankings, prices, logos, platform UI, badges, cleanup activity, restoration equipment, hazards, or visuals implying guaranteed results. Faces, hands, business setting, territory planning, and restrained lighting are credible.
- Alt text: `Restoration company owner and marketing strategist reviewing an unlabeled service territory and lead-handling plan`.

## Required implementation safeguard

The repository-wide `astro check` initially exposed 12 pre-existing image-prop type errors on pages that pass `getOptimizedImage()` into `Landing.astro`, including the resource renderer. Two minimal compatibility safeguards were included in the article commit:

- `src/libs/utils.js` now throws when no optimized image variant exists, narrowing the inferred return type and preventing an invalid runtime object.
- `src/components/Landing.astro` now declares the structural image fields it actually consumes instead of intersecting the helper result with a stricter Astro type.

No rendered markup, layout, routes, SEO copy, or image behavior changed. The fix reduced the repository-wide check from 12 errors to 0.

## Validation

- `npx astro check`: passed with 0 errors, 0 warnings, and 27 nonblocking hints.
- `npm run build`: passed; 102 pages built and `sitemap-index.xml` generated.
- Rendered resource: exactly one H1, one BlogPosting schema, one FAQPage schema, four visible FAQs, and four schema FAQs.
- FAQ synchronization: visible questions/answers exactly match the FAQPage source.
- Authorship: rendered BlogPosting author is Matt Pugh.
- Article body images: 0.
- Internal links: 9 unique destinations, 0 missing build targets.
- Sitemap: the new production URL is present.
- Cover: project asset opens successfully at 1590×800 and passed visual QA.
- `git diff --cached --check`: passed before commit.
- Unsupported-claim review: no rankings, lead volume, conversion rates, client results, case studies, testimonials, exclusivity, credentials, prices, or invented Canonry metrics were added.

## Intended and committed diff

Implementation commit `1b13b66e4d6f4483b9bbc15f466847fbb965d0ce` contains only:

- the new SEO-009 article;
- its required cover image;
- the `getOptimizedImage` empty-result guard; and
- the matching `Landing.astro` structural prop type.

Concurrent changes to `docs/seo/backlog.md` and `docs/seo/runs/2026-08-31-production-regression.md` were treated as user-owned and excluded from the article implementation commit.

## Commit, push, deployment expectation, and measurement

- Commit: `1b13b66e4d6f4483b9bbc15f466847fbb965d0ce` (`Add restoration Local Services Ads guide`).
- Branch: `main`.
- Push: succeeded to `origin/main` (`2c7c545..1b13b66`).
- Expected production URL: `https://remediationrestorationmarketing.com/resources/local-services-ads-for-restoration-companies/`.
- Deployment expectation: the repository's normal Netlify deployment should build from `origin/main`; no provider build ID is available in this run.
- Live verification: not claimed. The regression automation remains responsible for production HTTP, parity, canonical, indexability, schema, sitemap, and internal-link verification.
- Measurement due date: 28 days after verified production deployment; provisionally 2026-09-28 if live verification occurs on 2026-08-31.
- Outcome status: implemented and pushed, not yet production-verified or measured.

## Recommendation

Problem → Restoration LSA informational demand had no dedicated owned resource, while Canonry repeatedly cited six competitor domains and did not mention or cite this project.

Evidence → Ownable Canonry target `tgt_15i6eaw`, medium action confidence, 100% stored miss rate, 0/2 mentions and 0/2 citations in both 30- and 90-day views, plus 34 related stored GSC impressions split across two commercial PPC pages.

Expected impact → Establish a clearer informational target and route qualified owners to PPC and lead-tracking services; no search, lead, mention, citation, or revenue result is claimed.

Recommended change → Keep the new article stable, let the regression automation verify production, then measure the exact query/page and fixed Canonry basket after an appropriate window.

Effort → Medium.

Confidence → Medium–High for the gap and intent fit; Medium for outcome.

Verification method → Production parity/indexability/schema/link checks, comparable GSC query-page performance, and a later operator-approved Canonry run with mention and citation reported separately.
