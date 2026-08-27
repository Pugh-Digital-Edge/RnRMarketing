# Weekly SEO/AEO Action Plan

**Site:** Remediation & Restoration Marketing  
**Execution window:** August 27-28, 2026  
**Measurement horizon:** September 4-25, 2026  
**Prepared from:** SEO backlog reconciled August 27, Canonry stored evidence, and the August 27 production regression check

## Executive decision

This week should focus on repairing one confirmed internal-link regression and closing the approval and measurement gaps that block reliable SEO/AEO decisions. Do not start a sitewide content rewrite or create additional pages. Production is broadly healthy: 96/96 sitemap URLs passed the live technical checks, 98/98 internal HTML targets returned 200, and the latest completed Canonry technical audit scored 89/100 with no skipped or errored pages. The weak points are measurement quality and incomplete Google index coverage, not a broad crawlability or schema failure.

## Current baseline

| Signal | Current evidence | Interpretation |
|---|---|---|
| Technical AEO | 89/100; 97 pages audited; 0 skipped; 0 errors; completed August 20 | Stable technical foundation; content extractability is the only partial cross-cutting factor, but it is not this week's highest-evidence opportunity. |
| Live production | 96/96 sitemap URLs and 98/98 internal HTML targets healthy on August 27 | No broad technical or deployment regression. |
| Mention Coverage | 27/42 queries, 64%; latest valid visibility run August 10 | Stale and not comparable with the earlier 12-query basket. Use as a baseline, not a trend claim. |
| Mention Share | 4 of 31 non-brand competitive mentions, 13% | Category visibility is weak; the denominator is non-brand and must not be compared with the older pooled 64% figure. |
| Citation Coverage | 4/42 queries, 10% | Secondary AEO signal; also stale pending a comparable sweep. |
| Google coverage | Stored 100-URL set: 52 indexed, 48 not indexed. Current 96-URL sitemap reconciliation: 25 submitted/indexed, 25 crawled-not-indexed, 46 unknown | URL-level status needs a bounded current review before content or submission decisions. |
| Analytics | GA4 not connected in Canonry | Conversion and AI-referral impact cannot be measured in Canonry this week. Treat as a measurement limitation, not a page defect. |

## This week's ranked action items

### 1. Restore the generic-to-specialist PPC contextual link

**Priority:** P0 - ship this week  
**Backlog item:** SEO-005  
**Owner:** Developer, with site owner approval  
**Target:** `/services/ppc/` linking contextually to `/water-damage-restoration/ppc/`

**Problem ->** The approved contextual link was removed during the shared service-page refactor, weakening the intended generic-versus-specialist PPC path.

**Evidence ->** The August 25 known-good run recorded the link. The August 27 live page, local build, and source all omit it; commit `5429a0a` removed the paragraph. The specialist page still links back, and the rest of the internal crawl is healthy.

**Expected impact ->** Restore the intended relevance and navigation path without changing ownership, redirects, indexability, or page copy broadly. Search impact is plausible but not yet measurable.

**Recommended change ->** Add one natural, followable contextual link in the generic PPC page's visible copy. Keep the specialist URL unchanged. Do not add redirects, deindex either page, or rewrite the template to compensate.

**Effort ->** 1-2 hours implementation; 1-2 hours verification.  
**Confidence ->** High that the defect exists; Medium for downstream ranking impact.

**Verification method ->**

- Confirm the exact link in source and the local production build.
- Run `npm run build` and the existing postbuild AEO validation.
- After deployment, confirm the link in live HTML and rerun the 98-target internal-link crawl.
- Reconfirm both PPC pages are 200, self-canonical, indexable, one-H1, and JSON-LD-valid.
- Record the deployment commit and reset the SEO-005 28-day measurement window.

**Definition of done ->** The link is present in source, build, and live HTML; build/AEO checks pass; the live crawl has zero broken links or redirects; the backlog records the verified deployment reference.

### 2. Close the water-damage marketing article approval gate

**Priority:** P0 - owner decision this week  
**Backlog item:** SEO-006  
**Owner:** Site owner  
**Target:** `/resources/water-damage-restoration-marketing/`

**Problem ->** The article is live and technically valid but entered `main` without an explicit approval record, so measurement and success claims remain blocked.

**Evidence ->** The URL is live, self-canonical, indexable, sitemap-listed, and technically verified. Canonry's last two available runs showed 0/2 mentions and 0/2 citations for the query, while competitors were cited. Stored GSC evidence showed 155 impressions, 0 clicks, and average position 48.21 on the prior industry target. The new URL remains `URL is unknown to Google` in the August 24 inspection.

**Expected impact ->** Establish governance for an already-live, evidence-supported resource and allow a clean measurement window without unnecessary rewriting.

**Recommended change ->** Approve the existing article retrospectively and record August 24 as the production baseline. If approval is withheld, open a separate rollback decision; do not delete or rewrite it automatically.

**Effort ->** 30-60 minutes owner review and documentation.  
**Confidence ->** Medium; the intent opportunity is supported, but current search and AI outcomes are not yet available.

**Verification method ->** Record the approval decision, source commit `bab467b`, live verification date, canonical/indexability state, sitemap membership, and measurement start date.

**Definition of done ->** A written approve/reject decision exists. If approved, SEO-006 moves to Measuring with a September 21 checkpoint; if rejected, a separately authorized rollback decision is logged.

### 3. Restore decision-grade measurement without changing the site

**Priority:** P1 - approve this week; execute only with explicit authorization  
**Backlog items:** SEO-002 and SEO-003  
**Owner:** SEO/AEO operator and site owner

**Problem ->** The latest valid AI visibility run is from August 10, the August 17 fixed-basket attempt was cancelled, and the current 42-query results cannot be treated as a trend against the earlier 12-query basket. Google coverage also mixes a 100-URL stored set with a current 96-URL sitemap.

**Evidence ->** Mention Coverage is 27/42, non-brand Mention Share is 13%, and Citation Coverage is 4/42, but all derive from the stale August 10 run. Canonry returns five mention gaps in detailed gap analytics while the overview reports two. Current sitemap reconciliation shows 25 submitted/indexed, 25 crawled-not-indexed, and 46 unknown URLs.

**Expected impact ->** Replace ambiguous baselines with evidence that can support page-level prioritization, while avoiding changes based on stale or non-comparable metrics.

**Recommended change ->** Approve two bounded measurement actions:

1. One real Canonry sweep using the unchanged 42-query basket and current provider set, after the PPC repair is live and stable.
2. A bounded GSC/Bing inspection of the current sitemap, prioritizing the homepage, service hub, eight service pages, eight industry hubs, the new water-damage article, and representative generated route families before expanding to all 96 URLs.

These are quota-consuming or live provider reads and require explicit operator approval. Do not mutate the query basket, submit URLs, or request indexing as part of the read-only measurement pass.

**Effort ->** Low operator time; provider quota and inspection limits apply.  
**Confidence ->** High that the measurement gap blocks reliable prioritization.

**Verification method ->**

- Record the completed sweep ID, query count, provider set, capture status, and basket revision.
- Report Mention Coverage and non-brand Mention Share first; report Citation Coverage separately.
- Reconcile overview, evidence, and gap counts before opening page-level content work.
- Report URL-level indexing states against the current 96-URL sitemap and separate intended exclusions.

**Definition of done ->** Approval is recorded; the run/inspection completes without a partial or cancelled state; the backlog contains comparable denominators and exact URL-level counts. If approval is not granted this week, retain the current evidence as stale and make no trend claim.

### 4. Prepare the social-media advertising snippet intervention

**Priority:** P2 - review and approve this week; deploy only if the PPC repair is complete  
**Backlog item:** SEO-007  
**Owner:** SEO/content lead with developer review  
**Target:** `/services/social-media-advertising/`

**Problem ->** The page has a measurable page-two query opportunity, but its description truncates into unrelated services and its framing is more generic than the paid-social intent.

**Evidence ->** Stored GSC data shows 40 impressions, 0 detailed-row clicks, and average position 17.68 for `facebook ads for fire damage restoration`. The live title is relevant, but the description ends with an incomplete cross-service list. The service refactor is now in source, so the proposed copy should be reviewed against the current shared component rather than an older page template.

**Expected impact ->** Improve snippet clarity and paid-social relevance on an already indexed service page. The opportunity is smaller than the four deployed SEO-004 interventions.

**Recommended change ->** Draft a narrow title/description and visible-copy diff focused on Facebook and Instagram advertising for restoration companies, the lead mechanism, and a truthful next step. Preserve the page's existing ownership, proof constraints, accessibility, and conversion path. Do not add FAQ or schema unless matching visible content has a user purpose.

**Effort ->** 2-4 hours for brief, copy diff, build, and review.  
**Confidence ->** Medium-High for the snippet defect; Medium for CTR/ranking impact.

**Verification method ->** Review the diff, build successfully, run AEO checks, inspect desktop/mobile rendering, and verify live metadata/source parity after an approved deployment. Start a new 28-day measurement window only after deployment verification.

**Definition of done ->** An approved, page-specific diff is ready. Deployment is optional this week and must not displace the PPC repair or contaminate existing SEO-004 measurement.

## Execution schedule

| When | Action | Owner | Output |
|---|---|---|---|
| Thursday morning | Approve SEO-005 repair, decide SEO-006 article status, and authorize or decline the two measurement reads | Site owner | Three explicit decisions recorded |
| Thursday afternoon | Implement and locally verify the PPC contextual link | Developer | Reviewed diff, successful build, postbuild AEO pass |
| Friday morning | Deploy PPC repair and run source/build/live parity plus internal-link verification | Developer / SEO | Deployment reference and verification record |
| Friday midday | If approved, run the unchanged-basket Canonry sweep and bounded indexing inspection | SEO/AEO operator | Sweep ID, capture status, mention-first baseline, URL-level index report |
| Friday afternoon | Reconcile backlog statuses and prepare the SEO-007 copy brief | SEO/content lead | Updated backlog and review-ready narrow diff/brief |

## Guardrails for this week

- Do not rewrite the four SEO-004 pages while their deployed intervention is being measured; the current checkpoint remains September 18 if the artifact stays unchanged.
- Do not launch a sitewide content-extractability rewrite solely because Canonry scores that factor 59/100 across 93 pages. Tie any later work to GSC, AI-answer, conversion, or page-level evidence first.
- Do not create new pages, mass location pages, or broad FAQ/schema blocks this week.
- Do not change the 42-query basket before the comparable sweep completes.
- Do not claim ranking, CTR, mention, or citation improvement until a comparable post-change window exists.
- Keep `/admin/`, `/thank-you/`, and other intended exclusions out of any indexing batch.

## End-of-week scorecard

| Outcome | Target |
|---|---|
| Confirmed regression repaired | PPC contextual link verified in source, build, and production |
| Governance closed | SEO-006 has a written approve/reject decision |
| Measurement authorized | Explicit yes/no recorded for one fixed-basket sweep and one bounded indexing inspection |
| Measurement quality | Any completed run is non-partial, uses 42 unchanged queries, and reports mention and citation separately |
| Backlog integrity | SEO-001 through SEO-007 reflect current status, deployment reference, owner, and next verification date |
| Scope control | No broad rewrite, duplicate page, unsupported schema, or unapproved indexing mutation |

## Evidence sources

- `docs/seo/backlog.md`, reconciled August 27, 2026.
- `docs/seo/runs/2026-08-27-production-regression.md`.
- Canonry overview and gap analytics for `remediation-restoration-marketing`, read August 27, 2026.
- Canonry technical audit `8341b64b-100f-49d8-8835-e8c27a91f446`, completed August 20, 2026.
- Canonry visibility run `595fca88-de9d-474e-8854-f7319346e0b5`, completed August 10, 2026; cancelled comparison attempt `14ee1d3c-8670-4a3a-9138-d36105e15a77` excluded.
- Canonry GSC inspection snapshot completed August 24, 2026.

