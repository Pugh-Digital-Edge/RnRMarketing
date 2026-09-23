# Weekly SEO Coordinator — 2026-09-23

## Outcome

The Monday September 21 coordinator run failed before delivery because the selected model was at capacity. This Wednesday recovery resumed the same weekly obligation, auto-approved SEO-014, and pushed the completed Google Ads guide in commit `0b970144783f817f176803cf177215158ac284ac`. `npm run validate` passed, but the live site still reports deployed revision `c8698c83f38291b660de3dc6efbc318663710e0a`; the article URL is 404 and absent from the live sitemap. SEO-014 therefore remains **In Progress — Awaiting live verification**. Friday recovery must verify this same article and must not create another article for the September 21–27 Eastern week.

The Agent Exchange view was consumed in full. No new RnRMarketing request was actionable. The previously pending PORTFOLIO Agent Hub adoption thread was verified from its ACK and RESULT events and resolved to Grok with the deterministic receipt `codex:grok-result-codex-agent-hub-adoption-20260919-002800:resolve:verified-20260923`.

## Evidence freshness and baseline

- GSC performance is current through 2026-09-20, within the four-day gate.
- GA4 property `543995602` synced on 2026-09-23, within the two-day gate.
- Fixed-basket visibility run `3e87f272-07c8-40eb-af7a-e30b75e60a19` completed on 2026-09-20: query-level Mention Coverage 7/42 (17%), Citation Coverage 4/42 (10%), and non-brand Mention Share 7/40 (18%). Provider-snapshot totals, reported separately, are 7/126 mentioned and 5/126 cited.
- Technical audit `6866ca71-5f2d-4a18-b52b-f4642543fe50` completed on 2026-09-20 at 90/100 across 101 pages; content extractability was partial on 94/101 pages.
- The evidence was fresh, so no repair sync, duplicate visibility sweep, probe, discovery run, indexing request, or connected-account mutation was performed.
- `npm run seo:due` passed. Thirteen existing interventions remain Measuring; no complete evidence supported advancing them to Validated.

## Weekly article decision

**Problem →** The site had commercial PPC pages and an LSA guide but no operator-focused resource explaining how restoration companies should structure Google Ads, control service territory, assess search terms and calls, and connect spend to qualified and booked work.

**Evidence →** Canonry's latest gap analysis for `Google Ads for restoration companies` reported 0/5 mentions and 0/5 citations with five cited competitor domains. Across the four latest completed runs, reported with the separate provider-snapshot denominator, the query was mentioned in 3/12 snapshots and cited in 0/12. GSC for 2026-08-22 through 2026-09-20 showed 50 impressions, 0 clicks, and weighted position 36.38 for the `google ads` family across four URLs; the exact query had 1 impression at position 16 on `/services/ppc/`. Existing-page review confirmed that no current article served the distinct informational intent.

**Expected impact →** Create a useful first-party answer source and a clearer path into PPC and lead-tracking services. No ranking, lead, or revenue outcome is promised.

**Recommended change →** Publish SEO-014, “Google Ads for Restoration Companies: A Practical Campaign Framework,” using current Google Ads primary documentation for location options, search terms, call reporting, and conversion measurement. Resume the same ID until live acceptance; do not create a second article this week.

**Effort →** Medium.

**Confidence →** Medium–High that the content gap is distinct; Medium for organic/AEO impact.

**Verification method →** `npm run validate`, scoped render/link/image/schema checks, exact live HTTP 200, sitemap inclusion, canonical/indexability, deployed-revision parity, and a later equal-scope exact query/page window beginning only after accepted live verification.

## Implementation and verification

- Added `src/content/blog/google-ads-for-restoration-companies.md`, dated 2026-09-23 and authored by Matt Pugh.
- Added one repository-compatible 1590×800 WebP cover image at `src/assets/images/blog/google-ads-restoration-companies.webp`; visual QA found a credible restoration owner and paid-search strategist with abstract, unreadable planning artifacts and no logos, rankings, metrics, or promised results.
- Render QA found one H1, one BlogPosting source, one FAQPage source matching four visible FAQs, zero body images, four valid internal destinations, and local sitemap inclusion.
- `npm run validate` passed: zero Astro errors, 26/26 tests, a successful 107-page build, and successful postbuild checks.
- Article and image were committed and pushed as `0b970144783f817f176803cf177215158ac284ac`.
- The locked post-push `npm run seo:check -- full` passed validation and checked the existing 99-page live surface, 101 internal targets, and 99 Markdown alternates, but correctly failed the deployed-revision gate. At the live checkpoint, `/build-info.json` still reported `c8698c83f38291b660de3dc6efbc318663710e0a`, the article URL returned 404, and it was absent from the live sitemap.
- A manual deployment was not forced because the revisions between the accepted live artifact and SEO-014 include broader unrelated site work in `6e177d8`. Publishing that larger scope is outside this focused article recovery. The article remains Awaiting live verification.

## Existing-page opportunity ranking

This ranking is separate from article candidates and uses the current 2026-08-22 through 2026-09-20 GSC window. It does not authorize edits while deployment parity and existing measurements remain open.

1. Water-damage PPC page — 1,326 impressions, 0 clicks, weighted position 21.27. Highest observable demand; keep SEO-004 measurement and parity confounders explicit before another change.
2. Retargeting page — 200 impressions, 0 clicks, weighted position 24.72. Nearer relevance opportunity, but the existing intervention has mixed early evidence and remains Measuring.
3. Agency-selection query family — 534 impressions, 0 clicks, weighted position 47.90. Commercially relevant but lower position and overlapping with recently published SEO-010.
4. Web-design page — 873 impressions, 1 click, weighted position 35.58. Meaningful demand, but the completed equal-window comparison weakened and does not support an immediate rewrite.
5. Social-ads page — 76 impressions, 0 clicks, weighted position 45.12. Lower volume and lower expected impact than the four items above.

## Reserve article briefs

- SEO-015 remains the first reserve: email marketing platforms for restoration companies. Its evidence is weaker and should be revalidated before a future weekly selection.
- SEO-016 is the second reserve: CRM selection for restoration business management. Canonry reports 0/4 mentions, 0/4 citations, 0.8407 winnability, and Medium action confidence; the four-run provider-snapshot denominator is 1/12 mentioned and 0/12 cited. The GSC `crm` read returned no rows, so organic demand is unavailable rather than zero.

## Next checkpoint

On Friday, 2026-09-25, verify whether `0b97014` is the accepted live revision or included in an approved deployment. Require the exact article URL to return 200, appear in the sitemap, remain canonical/indexable, and match local SEO signals before moving SEO-014 to Measuring and starting its 28-day clock. If it is still 404, report the unresolved weekly delivery failure with the same intervention ID; do not draft another article.
