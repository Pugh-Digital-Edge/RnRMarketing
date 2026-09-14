# Weekly Canonry SEO Article Implementation — 2026-09-14

## Run metadata

- Run time: 2026-09-14T10:42:56-04:00 (2026-09-14T14:42:56Z).
- Role: autonomous Canonry-evidence article implementation.
- Repository: `C:\Users\mpugh\Code\RnRMarketing`.
- Source HEAD and `origin/main`: `858a02d9b1bc45ef275c137fad7495a68fa6d6bc`.
- Canonry project: `remediation-restoration-marketing` only.
- Canonry CLI: 4.179.2; Node: v24.18.0.
- Mutations not performed: no visibility sweep, probe, discovery, technical audit, provider sync, URL inspection, sitemap/indexing submission, connected-account mutation, deployment, CDN purge, commit, or push.

## Outcome

SEO-012 was auto-approved and drafted, but it was not committed or pushed because the repository-wide Astro validation gate failed outside the article scope. The draft article, cover asset, 16 repository tests, 104-page production build/postbuild, and scoped rendered checks passed. `npx astro check` failed with 11 pre-existing errors in `src/components/starwind/Accordion.astro`; changing that unrelated wrapper is outside this automation's article-only commit authority.

The uncommitted draft and asset remain at:

- `src/content/blog/mold-remediation-marketing.md`
- `src/assets/images/blog/mold-remediation-marketing.webp`

No production or measurement window has begun.

## Canonry evidence and topic rationale

- Current stored baseline from completed run `dc0e5f1c-7708-4edc-90be-47474349f809` (2026-09-10): Mention Coverage 6/42 (14%), non-brand Mention Share 7/33 (21%), and Citation Coverage 3/42 (7%). Mention and citation signals remain separate.
- Active high/critical Canonry insights: 0. The opportunity ladder therefore continued to ownable targets and query-level gaps.
- Selected target: `tgt_nk1nf3`, `mold remediation marketing`.
- Winnability: `ownable`, 0.99. Action confidence: medium. Demand source: stored GSC plus competitor evidence.
- Visibility evidence: five nonfailed stored snapshots from 2026-07-14 through 2026-09-10; 0 mentions and 0 citations for the exact query. Both 30-day and 90-day gap views classify the query as not mentioned and as a competitor-citation gap.
- Search evidence: 10 stored GSC rows from 2026-08-06 through 2026-08-18 total 16 impressions, 0 clicks, and weighted average position 51.94. All rows mapped to `/industries/`, not to a dedicated informational page.
- Cannibalization review: `/industries/mold-remediation/` is a short commercial hub description. No existing resource provides an owner/operator guide to mold-marketing channel selection, intake, territory, technical-content boundaries, reputation, and booked-work measurement. The new resource retains informational intent and links back to the commercial hub.

### Problem → Evidence → Expected impact → Recommended change → Effort → Confidence → Verification method

**Problem** → The site lacks a dedicated informational resource for mold-remediation marketing decisions.

**Evidence** → Ownable Canonry target `tgt_nk1nf3` (0.99), medium action confidence, 0/5 mentions, 0/5 citations, six cited competitor pages, and 16 stored GSC impressions at position 51.94 on the generic industries index.

**Expected impact** → Establish one canonical informational target, support the mold commercial hub and service pages, and improve eligibility for organic retrieval, brand mentions, and citations. No ranking, traffic, lead, mention, citation, or revenue outcome is claimed.

**Recommended change** → Publish the drafted 2,480-word source file with one cover, one four-question FAQ data source, primary sources, and ten internal links after the unrelated repository type-check baseline is repaired.

**Effort** → Medium.

**Confidence** → Medium–High for the distinct intent and content gap; Medium for organic/AEO impact.

**Verification method** → Repair or otherwise establish a passing repository-wide `astro check`; rerun tests, production build/postbuild, and the scoped render checks; make a focused commit/push; verify the exact production URL and parity; then compare exact GSC query/page data after 28 days and use a separately authorized fixed-basket Canonry run for mention/citation outcomes.

## Cited competitor/source pattern

Canonry's stored source set for `mold remediation marketing` contains six direct-competitor pages:

- Clicks Geek, `Mold Remediation Businesses Marketing` — 4 stored citations.
- Built Right Digital, `Mold Remediation Marketing` — 3 stored citations.
- Restoration Inbound, `Marketing Your Mold Remediation Business: The Ultimate Guide` — 3 stored citations.
- Water Restoration Marketing, `Mold Remediation Marketing` — 2 stored citations.
- Built Right Digital, `Mold Remediation Lead Generation Cost` — 1 stored citation.
- PushLeads, `Mold Removal Marketing: How Remediation Companies Get Found First` — 1 stored citation.

The modeled pattern is a dedicated vertical guide combining channel selection, local visibility, lead generation, and operating considerations. The draft does not copy competitor language, publish competitor pricing, invent benchmarks, or claim results.

## Draft and internal-link scope

- Title: `Mold Remediation Marketing: A Practical Growth Guide`.
- Author: Matt Pugh.
- Format: direct answer near the top, operational definitions, customer/referral paths, channel table, local SEO and paid-search controls, website and technical-review boundaries, intake steps, booked-work measurement, reputation, supporting paid channels, weekly scorecard, and a 90-day sequence.
- FAQ behavior: four frontmatter FAQs; the existing renderer supplies exactly one visible FAQ block and one matching `FAQPage` schema source.
- Article-body images: 0.
- Primary sources: Google Business Profile service-area guidance, Google Ads geographic-targeting guidance, the U.S. EPA mold-remediation guide for schools and commercial buildings, and the Federal Trade Commission consumer-review/testimonial rule.
- Internal links: `/industries/mold-remediation/`, `/services/seo/`, `/services/ppc/`, `/services/web-design/`, `/services/lead-tracking/`, `/services/reputation-management/`, `/services/retargeting/`, `/services/social-media-advertising/`, `/resources/10-powerful-restoration-marketing-strategies-to-boost-your-business/`, and `/resources/restoration-marketing-tips-for-your-restoration-company/`.

## Cover-image production and QA

- Built-in ImageGen was used with the `photorealistic-natural` use case.
- Final asset: 1590×800 WebP, 127,096 bytes.
- Final prompt: a restoration-company owner and marketing strategist reviewing an unlabeled service-territory map, call-routing sketch, and abstract campaign cards in a clean office; natural editorial photography; no logos, brand marks, trademarked platform UI, readable words or metrics, rankings, dramatic-result charts, visible mold, remediation activity, unsafe work, disaster-cleanup scene, or watermark.
- Visual QA passed: the image communicates restoration marketing and territory-aware lead planning. It contains abstract icons only, plausible office props, no readable values, no fake performance claim, no cleanup activity, and no unsafe scene.

## Intended focused diff

The publishable intervention was intended to contain only:

- new article `src/content/blog/mold-remediation-marketing.md`;
- new cover `src/assets/images/blog/mold-remediation-marketing.webp`;
- SEO-012 control-plane entry in `docs/seo/backlog.md`; and
- this append-only implementation record.

During the run, a concurrent opportunity process created `docs/seo/runs/2026-09-14-weekly-opportunity.md`, added SEO-011 and other reconciliation edits to `docs/seo/backlog.md`, and documented an existing untracked `%SystemDrive%/` cache tree. Those user-owned changes were preserved and were not staged or committed by this run.

## Validation

- `git diff --check`: passed; only the existing LF-to-CRLF notice appeared for the backlog.
- `npm test`: passed, 16 tests, 0 failures.
- `npm run build`: passed; Astro built 104 pages and `scripts/postbuild-aeo.mjs` completed successfully. Existing SVG warnings remained non-blocking.
- Scoped rendered article check: passed with exactly 1 H1, 1 `BlogPosting`, 1 `FAQPage`, 1 visible FAQ block, 4 visible FAQ entries, 4 schema entries, synchronized question/answer text, Matt Pugh authorship, 0 body images, 10 unique internal links, 0 missing internal targets, sitemap inclusion, and the expected image alt text.
- `npx astro check`: failed with 11 errors and 21 hints. All 11 errors are in the tracked, pre-existing `src/components/starwind/Accordion.astro` wrapper (`Accordion` import/local declaration conflict and missing `Root`, `Item`, `Header`, `Trigger`, and `Panel` properties). The new article produced no diagnostic.

## Commit, push, and deployment

- Commit: not created because the required repository validation gate failed.
- Push: not attempted.
- Expected production URL after a future validated push: `https://remediationrestorationmarketing.com/resources/mold-remediation-marketing/`.
- Deployment expectation: Netlify should build from `main` after a future focused push; no build ID or live state exists for this draft.
- Measurement due date: not started. Provisionally 28 days after the regression automation accepts the first live production checkpoint; 2026-10-12 only if accepted on 2026-09-14.

## Exact blocker and fallback attempts

Hard blocker: repository-wide validation fails on unrelated tracked code, and this article automation is not authorized to bundle an unrelated Starwind component repair into its focused content commit.

Fallbacks attempted:

1. Confirmed the article itself has no `astro check` diagnostic.
2. Ran all repository tests; 16/16 passed.
3. Ran the production-safe build and postbuild AEO validation; both passed.
4. Ran a separate rendered-article verifier; all article/schema/link/image gates passed.
5. Confirmed source HEAD equals `origin/main`, so the failure is not caused by an unpushed branch divergence.
6. Preserved all concurrent and unrelated worktree changes without staging, deleting, or rewriting them.

The next safe action is to repair the shared Accordion type errors in a separately authorized change, then rerun the full article validation and focused commit/push flow.
