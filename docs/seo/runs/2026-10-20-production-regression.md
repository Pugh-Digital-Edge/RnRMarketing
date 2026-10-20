# Production SEO/AEO health and due measurements — 2026-10-20

## Outcome

The bounded health checkpoint completed read-only after the required freshness gate stopped on repository divergence. No GSC POST, provider sync, visibility sweep, indexing submission, source/content fix, deployment, account mutation, or Notion write was performed.

The locked production checker ran its full path and retained two failures:

- **Deployment/production-parity boundary:** local checkout `1d508ddd5a98db65c7ca1761666fc244ed460dbf` is one commit ahead and one behind `origin/main`; live `/build-info.json` reports deployed commit `fd521650e90fc8ff50a161ae595da4c209d9bdfd`. The incoming remote range contains source/test changes, while the local checkout contains prior documentation/run work. The guard correctly refused to merge, reset, or silently adopt either side.
- **Sitemap/indexability consistency:** `/campaign-manager-privacy/` is HTTP 200 and parity-consistent with the checked source and live artifact, but it is intentionally `noindex, follow` while remaining in the local/live sitemap and lacking the checker-required shared entity. This persists as a technical/indexability defect; no source fix was authorized in the health role.

The full checker validated 104/104 sitemap pages, 106 internal targets, and 104 Markdown alternates before reporting those failures. The single `npm run seo:due` scan passed.

## Freshness and stored evidence

- AgentOperations was fetched safely and remained clean/current at `6ba5cf854d41fc74b10a0f023ad279ce054f0473`. The reviewed `canonry_search_sync.py` source is the current helper; its SHA-256 is `1396CD56CD08A395EA0CA258317F5682651E9CE5B62BA55B0FFA0712B1EC0E94`.
- The existing exact-project GSC receipt `b73a3142-5a9d-4aa2-9a1b-0fd5d0320065` is 26.1 hours old at this checkpoint. The bounded guard stopped before any provider mutation with `REPOSITORY_UPDATE_REQUIRES_RECONCILIATION`; no newer search watermark is claimed. The required independent current server-side sync-safety receipt was not used because reconciliation stopped first.
- The technical-audit helper reused complete exact-domain audit `b061dbd7-1108-45b4-b2f1-69d349ec880d`, observed October 18 at 23:00:13Z: engine `7.4.1`, schema `2.0`, 107 discovered/fetched, 105 eligible, 4,120 edges, zero findings/errors/skips, score 87/100. It is 37.1 hours old and within the eight-day age bound. A new audit remains held by the missing exact zero-charge/resource and proactive-follow-up owner evidence.
- The shared Canonry version receipt was refreshed October 20 at 12:08:08Z: live server `7.47.1`, official npm latest `7.48.0`, installed desktop `@canonry/canonry` `7.24.0` on Node `24.18.0`. Desktop catch-up to the exact running-server version remains required at the next connected existing checkpoint; no installation or server update was attempted.

## Due measurements

`npm run seo:due` passed. All 16 tracked interventions remain `Measuring` or waiting. The six overdue items—SEO-002, SEO-003, SEO-008, SEO-011, SEO-012, and SEO-013—were not promoted:

- SEO-002 remains limited by the partial exact 23-URL comparison and unavailable fresh-data barrier.
- SEO-003 remains one point-in-time fixed-basket observation without durable or causal evidence.
- SEO-008 remains extremely sparse and inconclusive.
- SEO-011 remains mixed, zero-click, sparse, and overlapping other interventions.
- SEO-012 lacks a valid pre-live baseline; post-live rows remain sparse.
- SEO-013 still lacks an independent terminal scheduler receipt correlated to the adopted prompt, exact repository, run ID, and terminal result. Prompt installation is not execution proof.

The offline measurement priorities assessment ranked the privacy sitemap regression first and the six overdue measurement blockers next. It recorded no collection, submission, publication, or measurement-ledger write.

## Recommendations and next checkpoints

Repository divergence → local `1d508dd` and remote/live `fd521650` have different one-commit histories, with unrelated local documentation changes preserved → reconcile the checkout with the designated owner before the next freshness guard or source-dependent decision → low effort / high confidence → safe fast-forward or explicit branch reconciliation, then rerun the bounded freshness guard.

Sitemap/indexability consistency → the privacy utility route is noindex in source and production but sitemap-listed and fails the checker’s sitemap-page entity contract → obtain the existing implementation/release decision to exclude the utility route from sitemap generation while retaining noindex → low effort / high confidence → `npm run validate`, locked full checker, and exact live verification of HTTP 200, noindex, self-canonical, sitemap exclusion, and source/live parity.

Measurement closure → exact cohorts are partial, sparse, mixed, or missing independent scheduler proof, and today’s freshness gate did not certify a new usable watermark → retain all named interventions as Measuring with their owners and existing checkpoints → low effort / high confidence → reconcile repository state, consume the next authorized exact-source receipt, and review only complete frozen cohorts.

Canonry maintenance → the stored audit is fresh and complete, while desktop/server/latest versions are not aligned → reuse the audit and retain the catch-up/review dependency; do not create another audit or update path → medium effort / high confidence → verified package/integrity, compatibility, rollback, supported install, and post-install exact-project reads.

No recommendation here authorizes source changes, a new audit, indexing submission, visibility sweep, provider mutation, account change, schedule change, or article publication.
