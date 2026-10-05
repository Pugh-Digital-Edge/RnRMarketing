# Weekly SEO coordinator — 2026-10-05

## Scope and controls

- Role: Monday opportunity ranking, weekly article delivery, due-intervention reconciliation, and bounded live acceptance for `Pugh-Digital-Edge/RnRMarketing`.
- Host/checkout: `MATT-GAMING-PC`, `C:\Users\mpugh\Code\RnRMarketing`; `.git/seo-execution-owner.json` matched this host and checkout before mutation.
- Lock: acquired as `weekly-coordinator-20261005-0059`; all repository writes, builds, and checks ran under that owner.
- Coordination: read the Agent Hub, operating model, RnR client page, Agent Exchange contract and schema, and all 32 rows in the Agent Exchange view. No new actionable `To=Codex` or `To=PORTFOLIO` request was present. Existing deployment-parity threads remain unresolved.
- Weekly obligation: no article dated or delivered in the October 5–11 Eastern week existed before this run. SEO-017 was selected under the standing one-article-per-week authorization. No second article was created.

## Evidence freshness and baseline

- GSC: scheduled sync completed October 5; stored performance is available through October 3, within the four-day threshold.
- GA4: property `543995602` synced at `2026-10-05T10:00:05.541Z`, within the two-day threshold.
- Visibility: scheduled run `6a8c6186-cdcd-476c-8b1c-ef06ee10fa57` completed October 4 with 126/126 provider snapshots. Query coverage was 4/42 mentioned and 7/42 cited. Non-brand Mention Share was 4 project mentions versus 14 competitor mentions, or 22.22%. These query and provider-snapshot denominators are not interchangeable.
- Technical audit: scheduled audit `10032af0-79a2-443c-8357-58b1a179dc3b` completed October 4 at 90/100 across 101 audited pages, with zero errors and zero skips; the score was flat versus September 27.
- Google coverage: 57 indexed / 46 not indexed / 0 deindexed across 103 stored URLs as of October 5. Bing's scheduled inspection remains partial with 89 of 99 live sitemap URLs uninspected; unavailable URLs were not treated as not indexed.
- No manual visibility sweep, query-basket change, extra probe, indexing request, account mutation, or paid collection was run.

## Existing-page opportunity ranking

These are recommendations only. Latest stored 30-day GSC family reads were used, with clicks and weighted position kept separate from AI visibility.

1. Retargeting service — Problem: high near-page-one visibility is producing no clicks. Evidence: 127 impressions, 0 clicks, weighted position 6.86; 96 impressions belong to `/services/retargeting/`. Expected impact: the best near-term CTR opportunity. Recommended change: inspect query-country quality and live snippet ownership after parity is restored. Effort: Small. Confidence: High in the opportunity, Medium in snippet impact. Verification method: equal query/page GSC window and live metadata parity.
2. Lead tracking — Problem: page-one impressions are not converting to search clicks. Evidence: 17 impressions, 0 clicks, weighted position 7.65, all on `/services/lead-tracking/`. Expected impact: modest but commercially aligned CTR gain. Recommended change: inspect exact queries and snippet fit before editing. Effort: Small. Confidence: Medium. Verification method: exact query/page comparison with qualified-lead events kept separate.
3. Water-damage PPC — Problem: substantial demand remains mostly on page two while several pages overlap. Evidence: 183 impressions, 0 clicks, weighted position 19.22; 153 impressions on the intended specialist page. Expected impact: clearer intent ownership and better commercial reach. Recommended change: diagnose cannibalization and internal-link ownership after deployment parity. Effort: Medium. Confidence: Medium–High. Verification method: page distribution plus equal GSC windows.
4. Restoration website design — Problem: relevant impressions sit beyond page two. Evidence: 69 impressions, 0 clicks, weighted position 22.68; 63 impressions on `/services/web-design/`. Expected impact: improve an existing commercial page before adding content. Recommended change: compare query intent with the current live title, answer depth, and internal links. Effort: Small–Medium. Confidence: Medium. Verification method: exact page/query window and live render review.
5. Homepage agency intent — Problem: the largest commercial family has weak average position and leakage to services/resources pages. Evidence: 370 impressions, 2 clicks, weighted position 42.87; 233 impressions and both clicks on the homepage. Expected impact: better entity and commercial-intent consolidation. Recommended change: defer content edits until production parity and overdue measurements are resolved, then inspect query/page ownership. Effort: Medium. Confidence: Medium. Verification method: page distribution, CTR, and comparable query/page windows.

## SEO-017 article decision and implementation

- Problem: the site had no dedicated operator guide for tying restoration marketing cost to qualified leads, booked jobs, collected revenue, and gross profit.
- Evidence: the `restoration marketing ROI` GSC family produced 14 impressions, 0 clicks, and weighted position 15.29 over 60 days, split mainly between lead tracking and water-damage PPC. Across the latest four scheduled fixed-basket runs, the tracked query had 0/12 mentions and 1/12 citations; the October 4 run was 0/3 mentioned and 1/3 cited. Existing coverage contained only a short FAQ answer, not the distinct calculation and measurement intent.
- Expected impact: create a first-party measurement reference and a natural route into lead tracking, PPC, SEO, web design, reputation, and retargeting services. No ranking, lead, or revenue outcome is promised.
- Recommended change: one B2B guide, `How to Measure Restoration Marketing ROI Without Guessing`, at `/resources/restoration-marketing-roi/`.
- Effort: Medium. Confidence: Medium–High for the distinct content gap; Medium for search/AEO impact.
- Implementation: `src/content/blog/restoration-marketing-roi.md` and one 1590×800 WebP cover image, committed and pushed as `53800b0367d5239f50b9c268f20d226d33b5748f`. The cover depicts an owner and strategist evaluating a lead-to-job funnel with no readable metrics, logos, rankings, or unsupported outcomes.
- Sources: current official Google Ads guidance for conversion values, offline conversion imports, and Data Manager, plus official GA4 key-event guidance. No invented prices, results, credentials, or client claims were used.
- Local verification: `npm run validate` passed with zero Astro errors, 39/39 tests, a successful 109-page build, and postbuild AEO checks. Scoped render QA found one H1, one BlogPosting source, one FAQPage source matching four visible FAQs, seven internal links, four official-source links, zero body images, a canonical/indexable local page, and local sitemap inclusion.
- Live checkpoint at `2026-10-05T17:39:50Z`: `npm run seo:check -- full` failed the deployment-revision and local/live parity gates because production still reports `c8698c83f38291b660de3dc6efbc318663710e0a` rather than `53800b0`. The exact SEO-017 URL returns 404 and is absent from the live sitemap. Status remains **In Progress — Awaiting live verification**; the 28-day measurement clock has not started.
- Next checkpoint: Wednesday, October 7, or immediately after an explicit hosting deployment receipt. Deployment/release ownership must provide an accepted scope because the live-to-main range contains unrelated work beyond this article.

## Reserve and due work

- SEO-016 remains the only evidence-supported reserve. The latest four scheduled runs now show 0/12 mentions and 0/12 citations for the CRM query; current GSC `crm` demand is unavailable. No second reserve was promoted from overlapping or unsupported intent.
- `npm run seo:due` still reports SEO-001, SEO-002, SEO-003, SEO-004, SEO-005, SEO-006, SEO-007, SEO-009, and SEO-013 due. Their exact comparable windows or acceptance prerequisites remain incomplete, so no result was claimed. SEO-010 is due October 6; SEO-008 October 8; SEO-011 October 9; SEO-012 October 13.
- No handoff PR was reviewed: the weekly article remains unresolved live, and GitHub CLI PR discovery was unavailable on this host. This does not imply that no PR exists.

## Verification method

After a deployment receipt, reacquire the shared lock, rerun `npm run seo:check -- full`, require the exact URL to return 200 with canonical/indexable output and sitemap inclusion, compare the accepted deployed revision to source, and only then start the 28-day exact query/page measurement window.
