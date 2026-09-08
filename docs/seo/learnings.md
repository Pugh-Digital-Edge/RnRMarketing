# SEO/AEO Learnings

Only completed, comparable interventions are promoted here. Pending hypotheses remain in the backlog or run records.

## Confirmed learnings

No intervention has a completed production before/after measurement window yet.

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
