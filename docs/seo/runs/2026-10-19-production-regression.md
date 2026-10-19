# Production SEO/AEO health and due measurements — 2026-10-19

## Outcome

The bounded health checkpoint completed under the designated `MATT-GAMING-PC` owner and the shared SEO lock. The exact-project search freshness guard completed successfully, and the locked production checker ran its full path. No source, content, deployment, indexing-request, provider-configuration, query-basket, account, or Notion mutation was performed.

The checker found one actionable technical/indexability defect introduced by the October 17 source change: `/campaign-manager-privacy/` is intentionally `noindex, follow` but is included in the generated and live sitemap, and its standalone `WebPage` JSON-LD does not contain the shared `LocalBusiness` entity expected by the checker. Source, local build, live HTML, and live sitemap are consistent, so this is not a deployment-parity mismatch. The route should remain noindex; the sitemap exclusion and checker contract require a separately authorized implementation decision.

## Freshness and stored evidence

- AgentOperations was fetched safely at `efefd77b26281219eda595b50b4616fddf7af187`; the reviewed `canonry_search_sync.py` source hash was `11890b8746d831ce53401ab4502c81cee13b3c27`.
- The bounded guard completed exact-project GSC run `b73a3142-5a9d-4aa2-9a1b-0fd5d0320065` in coalesced mode. Property coverage is `sc-domain:remediationrestorationmarketing.com`; 30 actual daily rows cover `2026-09-18`–`2026-10-17`; the actual latest row is `2026-10-17`; the Pacific lag is two calendar days against the four-day operational limit. Bing remains a separate observed coverage source; no Bing performance sync was used.
- GA4 property `543995602` remains connected and synced at `2026-10-19T10:00:06.966Z`. Stored traffic reads 729 total sessions, 65 organic sessions, 338 direct sessions, and 6 deduplicated organic-AI sessions; these are aggregate traffic observations, not qualified leads or outcomes.
- The latest completed fixed-basket visibility run is `db033929-b2b9-48ae-bb13-cf12173fbeaf` from `2026-10-18T22:00:00.003Z`: 3/42 query-level Mention Coverage, 4/42 query-level Citation Coverage, 3/26 non-brand Mention Share (11.5%), and 3/126 versus 4/126 provider snapshots. Compared with October 11, mentions moved 2/42 → 3/42 while citations moved 7/42 → 4/42; this is one scheduled observation and does not establish a durable regression or causal effect.
- The latest complete exact-domain technical audit is `b061dbd7-1108-45b4-b2f1-69d349ec880d`, completed `2026-10-18T23:00:13.646Z` with engine/schema versions `7.4.1`/`2.0`, 107 pages discovered/fetched, 105 eligible, 2 noindex exclusions, 4,120 edges, zero crawl findings/errors/skips, and score 87/100. The score changed from 90/100 on October 11, but the audited population and factor results changed; no causal SEO outcome is inferred. The reviewed maintenance helper reused this fresh complete run and did not execute a duplicate audit because the required zero-charge/resource and proactive-Aero owner receipt remains unavailable.

## Production checker and defect diagnosis

The full `npm run seo:check -- auto` receipt at `2026-10-19T16:04:39.128Z` passed the single validation gate and checked 104/104 sitemap pages, 106 internal targets, and 104 Markdown alternates. Local HEAD and deployed `/build-info.json` both identify `88c7834da3fb881e79904b796867443b51bccad6`. The sole failure is:

`https://remediationrestorationmarketing.com/campaign-manager-privacy/` → `unexpected noindex; missing shared entity`.

Evidence:

- `src/pages/campaign-manager-privacy.astro` explicitly emits `<meta name="robots" content="noindex, follow" />` and only a `WebPage` JSON-LD block.
- The local build and live HTML both contain that noindex directive and the same privacy page content.
- Both local and live sitemaps include `/campaign-manager-privacy/`.
- The live route is HTTP 200 with a self-canonical. This is an intended utility/privacy page shape, but the sitemap inclusion contradicts its noindex state and the current checker’s sitemap-page entity expectation.

Disposition: technical/indexability defect, not content demand, AEO evidence, or deployment parity. No source fix was applied in this health role.

## Due measurements

`npm run seo:due` passed and retains all 16 interventions as `Measuring` or waiting. The overdue measurement checkpoints are SEO-002, SEO-003, SEO-008, SEO-011, SEO-012, and SEO-013. Freshness does not make them complete:

- SEO-002: the exact 23-URL Google cohort and partial Bing cohort remain the authoritative comparison; no submission or rewrite is justified.
- SEO-003: October 18 is one additional fixed-basket observation; preserve the basket and wait for the existing comparable checkpoint.
- SEO-008 and SEO-011: existing comparisons remain sparse, mixed, or zero-click; no outcome is promoted.
- SEO-012: the exact article/page family still lacks a valid pre-live baseline; post-live rows cannot establish lift.
- SEO-013: no independent terminal scheduler receipt is correlated to the adopted prompt, repository, and run; fresh data and a passing checker do not prove unattended execution.

All other accepted interventions retain their existing future checkpoints, including SEO-016 through `2026-11-09` and SEO-014/015/017 through `2026-11-03`. No article was created or replayed.

## Recommendations and next checkpoints

Sitemap/indexability consistency → the privacy page is noindex in source and production but present in both sitemaps, and the checker reports the expected missing shared entity → remove the noindex utility route from sitemap generation while retaining its privacy-page noindex state, subject to the existing implementation/release authorization → low effort → high confidence → run `npm run validate`, the locked full checker, and exact live verification of HTTP 200, noindex, self-canonical, absence from both sitemap artifacts, and source/live parity.

Measurement closure → the exact GSC window is fresh, but affected cohorts remain incomplete, sparse, mixed, or lack independent scheduler proof → keep the named interventions Measuring and preserve their existing owners and checkpoints → low effort → high confidence → reread the same frozen cohorts and scheduler evidence at the next existing checkpoint.

Canonry maintenance → the October 18 audit is fresh and complete, while the desktop CLI is 7.24.0 and the live server/official npm package are 7.47.1 → do not launch another audit or install an update from this run; retain the missing owner/resource/review evidence and catch up the desktop only through the existing verified installation owner → medium effort → high confidence → record the required review, rollback, compatibility, and post-install health evidence before any supported update.

No recommendation here authorizes source changes, a new audit, indexing submission, visibility sweep, provider mutation, account change, or schedule change.
