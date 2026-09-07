# Weekly Canonry Article Implementation

## Run metadata

- Run time: 2026-09-07T11:35:00-04:00 (America/New_York).
- Role: autonomous Canonry-evidence article implementation.
- Repository: `C:\Users\mpugh\Code\RnRMarketing` on `main`.
- Canonry project: `remediation-restoration-marketing` only.
- Stable backlog ID: SEO-010.
- Production URL: `https://remediationrestorationmarketing.com/resources/restoration-marketing-agency-vs-generalist/`.
- Workflows used: Canonry stored baseline, gap/evidence/content-target reads, and Aero weekly-review/content-gap prioritization.
- Quota/account boundary: no visibility sweep, probe, discovery session, technical audit, indexing request, provider sync, sitemap submission, or connected-account mutation was run.
- Exception: `cnry content brief remediation-restoration-marketing tgt_fe73v6 --format json` was invoked during evidence inspection and generated one fresh Claude brief (`costMillicents: 955`). The brief was not used as the evidence gate; selection relies on the stored target, stored per-query runs, stored gap views, stored GSC data, and repository coverage described below. No further generated Canonry operation was run.

## Outcome

Created, validated, committed, and pushed exactly one new article and its required cover image:

- `src/content/blog/restoration-marketing-agency-vs-generalist.md`
- `src/assets/images/blog/restoration-marketing-agency-vs-generalist.webp`
- Article/asset commit: `2fa365ec45451e323efbabab3a81c6b6734fd486` (`Add restoration agency comparison guide`).
- Push: successful to `origin/main` on 2026-09-07.
- Deployment expectation: the hosting pipeline should publish the exact production URL above from `main`; live verification remains the responsibility of the production-regression automation.
- Outcome status: deployed from source, not yet production-verified or measured. No ranking, traffic, lead, mention, citation, or conversion result is claimed.

## Canonry evidence and topic rationale

### Current baseline

- Latest completed visibility run: `30969b56-2bc9-49cc-bba3-4cee92a4e36e`, completed 2026-08-27.
- Mention Coverage: 5/42 (12%).
- Non-brand Mention Share: 5/29 (17%).
- Citation Coverage: 3/42 (7%).
- High/critical active insights: none.
- Stored 30-day and 90-day gap views are identical because both terminate at the same latest run; neither is presented as a fresh trend.

### Selected opportunity

- Target: `tgt_fe73v6`, query `should i use a niche restoration agency or a general marketing firm`.
- Winnability: `ownable`, score `1.0`; action confidence `medium`.
- Per-query visibility: four stored runs from 2026-08-10 through 2026-08-27 show 0 brand mentions and 0 owned-domain citations. Gemini and OpenAI have four stored observations each; Claude has two.
- Competitive surface: the stored gap evidence identifies PushLeads and Contractor Marketing Pros on the current cited/mentioned surface. The content target reports four cited competitors across its source history and names Contractor Marketing Pros' restoration-agency list article as the leading page.
- Search support: stored GSC query/page rows from 2026-07-12 through 2026-08-22 contain 861 impressions and 0 surfaced row clicks for `restoration marketing agency`, weighted average position 48.98 across seven pages. The homepage accounts for 444 impressions at 25.85; this is support for the broader selection journey, not proof of exact-query demand or a causal baseline.

### Cannibalization and classification

- Classification: search-intent/content gap; internal-link support; entity/citation/AEO weakness.
- The homepage remains the commercial target for `restoration marketing agency`.
- Existing resources cover lead generation, general marketing, water-damage marketing, fire-damage marketing, website performance, and Local Services Ads. None compares a niche restoration agency with a generalist firm.
- `docs/AEO-AUDIT-ACTION-PLAN.md` explicitly allows a distinct editorial agency-selection page when it links back to the homepage and does not compete with its commercial purpose.
- Decision: publish a balanced evaluation framework rather than a vendor list, pricing page, or homepage rewrite.

## Problem → Evidence → Expected impact → Recommended change → Effort → Confidence → Verification method

- Problem → restoration owners lacked a dedicated page for deciding between a niche restoration agency and a generalist firm.
- Evidence → Canonry target `tgt_fe73v6` is ownable at 1.0, medium confidence, and absent on both mention and citation signals across four stored runs; competitors own comparison/list surfaces; the broader GSC agency family has measurable impressions while the homepage retains commercial ownership.
- Expected impact → create a useful informational entry point and first-party citation surface that supports, rather than replaces, the commercial agency page.
- Recommended change → publish an operations-first comparison covering fit, restoration scenarios, measurement, claim accuracy, access, proposal scoring, red flags, and a 90-day selection/onboarding sequence.
- Effort → Medium.
- Confidence → Medium–High for the identified gap and intent separation; Medium for future search/AEO impact.
- Verification method → local schema/content/link/build checks, production-regression parity after deployment, then comparable GSC query/page measurement and a separately authorized fixed-basket Canonry run.

## Article and source pattern

- Title: `Restoration Marketing Agency vs. Generalist: How to Choose`.
- Author: Matt Pugh.
- Length: approximately 2,400 words, excluding frontmatter.
- Direct answer appears in the opening paragraph.
- Modeled pattern: competitor pages demonstrate that AI engines cite long-form restoration-agency list/comparison content. The implementation uses a differentiated decision-framework format and does not copy competitor wording, vendor rankings, or unsupported benchmarks.
- Primary factual sources:
  - Google Ads geographic targeting documentation.
  - Google Business Profile service-area guidance.
  - Google Ads call-reporting documentation.
  - Google Analytics key-event and conversion guidance.
  - Federal Trade Commission consumer review/testimonial guidance.
  - IICRC standards overview.
- Unsupported claims excluded: rankings, lead volume, conversion rates, client results, case studies, testimonials, exclusivity, credentials, universal costs, and guarantees.

## Internal links

Nine unique internal destinations passed the rendered-link check:

- `/industries/water-damage-restoration/`
- `/industries/fire-damage-restoration/`
- `/services/ppc/`
- `/services/seo/`
- `/services/web-design/`
- `/services/reputation-management/`
- `/services/lead-tracking/`
- `/resources/restoration-marketing-tips-for-your-restoration-company/`
- `/resources/local-services-ads-for-restoration-companies/`

## FAQ behavior

- The resource renderer already creates the visible FAQ and `FAQPage` schema from frontmatter.
- The article body contains no second FAQ block.
- Rendered output contains exactly one visible FAQ block with four questions and one `FAQPage` schema source with the same four answers.
- Rendered output also contains exactly one `BlogPosting` schema and one H1.

## Cover image and QA

- Final asset: 1590×800 WebP, 95,356 bytes.
- Built-in ImageGen prompt: a photorealistic restoration-company owner and marketing strategist comparing two approaches in a business planning meeting, with an unlabeled service-territory map and abstract analytics, and explicit prohibitions on text, metrics, rankings, logos, branded UI, cleanup scenes, hazards, and implied results.
- Visual QA passed after project crop: credible owner/strategist planning scene; realistic hands and posture; territory/decision context; abstract unreadable screen shapes; no words, numbers, logos, rankings, prices, badges, testimonials, restoration equipment, disaster scene, unsafe work, or unsupported result cues.
- Alt text: `Restoration company owner and marketing strategist comparing two campaign plans beside an unlabeled service territory map`.

## Intended and committed diff

- Add one Markdown article with repository-compatible frontmatter, Matt Pugh authorship, four frontmatter FAQs, primary-source citations, and no body images.
- Add one repository-local WebP cover referenced by the article.
- Add SEO-010 to the control plane and this append-only run record in a separate documentation commit after the article push.
- No existing page, renderer, configuration, service, industry, component, dependency, or unrelated documentation content was changed by the article implementation.

## Validation

- `npx astro check`: passed with 0 errors and 27 existing hints.
- `npm run build`: passed; Astro built 103 pages and `scripts/postbuild-aeo.mjs` completed. Existing Browserslist and SVG/icon warnings remained non-blocking.
- Rendered checks: one H1; one `BlogPosting`; one `FAQPage`; four matching visible/schema FAQ entries; Matt Pugh byline; zero article-body images; nine unique internal destinations; zero missing internal targets; sitemap inclusion confirmed.
- `git diff --check`: passed for the focused article and asset.
- Article/asset commit: `2fa365ec45451e323efbabab3a81c6b6734fd486`.
- Push: successful, `75c5c28..2fa365e main -> main`.

## Measurement and handoff

- Approval state: Auto-approved by weekly article automation on 2026-09-07.
- Production verification: pending; do not treat the successful push or local build as a live result.
- Measurement due date: provisionally 2026-10-05 if accepted production verification occurs on 2026-09-07; otherwise 28 days after the accepted live checkpoint.
- GSC verification: compare the exact decision query and related agency-selection query/page rows without overwriting homepage commercial ownership.
- Canonry verification: only after separate authorization, compare Mention Coverage and non-brand Mention Share first, Citation Coverage second, using the unchanged basket and explicit denominators.
