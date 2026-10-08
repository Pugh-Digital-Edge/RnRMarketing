# SEO/AEO Learnings

Only completed, comparable interventions are promoted here. Pending hypotheses remain in the backlog or run records.

## Confirmed learnings

Complete comparisons now exist for SEO-004/005/006/007/009, but none supports a confirmed causal search or lead improvement. See the [October 8 exact-cohort receipt](runs/2026-10-08-overdue-measurements.md); mixed and low-data hypotheses remain Measuring.

## Evidence-backed working observations

### A pushed source artifact is not a production result

- Intervention evidence: SEO-009 was committed and pushed as `1b13b66` on 2026-08-31, but the expected URL still returned 404 and was absent from the 96-URL live sitemap at the upstream queue checkpoint. On 2026-09-01, the URL returned 200, appeared in the 97-URL sitemap, and matched the current local build on title, canonical, indexability, H1 count, `BlogPosting`, and `FAQPage` signals.
- Observed result: source completion and production availability occurred at different checkpoints; the measurement window could not honestly begin until the live artifact passed verification.
- Limitation: no stable Netlify build ID was exposed, and this observation says nothing about search, mention, citation, or conversion impact.
- Implication: record deployment/live verification separately from commit and push status, and start outcome measurement from the accepted production checkpoint.

### Native, page-specific structure is preferable to generic audit copy

- Intervention: replaced a generic sitewide AEO support block with the existing page-specific `MarketingFramework` pattern on generated industry/service pages.
- Original hypothesis: useful, relevant visible answer/process content may improve extractability and schema signals without harming conversion UX.
- Observed result: local audit notes report generated pages at 91/100 and a 90-page local average of 86.92/100 after the native implementation; generic copy was rejected in browser review for duplication and irrelevance.
- Limitation: this is local evidence, not a production search or AI visibility result; it is not promoted to a confirmed ranking/citation learning.
- Implication: prefer truthful page-specific improvements and verify production parity before scaling.

### Equal-window results must remain page-specific when the cohort moves in different directions

- Intervention evidence: SEO-004's complete equal 27-day comparison retained zero clicks across all four page cohorts. Weighted position improved for water-damage PPC (24.06 to 21.26) and retargeting (27.07 to 25.46), while web design worsened (27.80 to 36.36) and social-media marketing worsened (28.47 to 30.50).
- Observed result: the shared intervention did not produce one consistent directional outcome or measurable click benefit.
- Limitation: current source/live deployment lag and overlapping SEO-011 changes limit causal attribution; zero-click samples also constrain CTR interpretation.
- Implication: diagnose and decide page by page. Do not scale a batch rewrite, declare a batch win, or compensate with new content from an aggregate label.

### Focused validation does not remove the need for release isolation

- Intervention evidence: SEO-014 and SEO-015 each passed `npm run validate` and focused render/schema/link/image checks, but the accepted live artifact remained `c8698c8`; both exact article URLs returned 404 and were absent from the live sitemap on 2026-10-01.
- Observed result: both source artifacts were ready, but neither satisfied weekly live delivery or started its measurement clock because the release range also contained broader unaccepted changes.
- Limitation: this is a delivery-system observation, not evidence about rankings, mentions, citations, traffic, or leads.
- Implication: preserve a deployable, explicitly accepted release scope for bounded weekly work. Continue to separate source-ready, pushed, deployed, accepted-live, and measured states.

### Fresh scheduled evidence is necessary but does not complete the closed loop

- Intervention evidence: SEO-013 restored daily GSC/GA4 refreshes, weekly fixed-basket sweeps, technical audits, shared locking, and a passing validation path. The September 21 coordinator still failed on model capacity, overdue measurements remained without clean receipts, and SEO-014/SEO-015 remained undeployed.
- Observed result: evidence freshness improved materially, while delivery and measurement closure remained incomplete.
- Limitation: this evaluates pipeline reliability, not search or AI performance.
- Implication: judge the pipeline by accepted delivery plus Git-addressable measurement receipts, not by schedule presence or fresh dashboards alone.

### One citation trough did not persist in the next comparable scheduled run

- Evidence: unchanged 42-query × three-provider scheduled runs on September 27 and October 4; complete 126-pair captures and matching served models. Query Citation Coverage rose 0/42 → 7/42, while Mention Coverage moved 3/42 → 4/42. October 4 has nine cited provider snapshots, not nine cited queries.
- Limitation: one following run establishes neither a durable recovery nor a content intervention effect; non-brand Mention Share needs its own verified competitor denominator.
- Implication: track mention and citation separately and confirm a sustained loss before proposing broad content changes. Original query/provider sets remain fixed. [Exact receipt](runs/2026-10-08-overdue-measurements.md).
