# SEO/AEO Production Regression Check — 2026-09-23

- Run time: 2026-09-23T12:05:37Z (2026-09-23T08:05:37-04:00).
- Run type: closed-loop SEO/AEO production health, parity, and due-measurement check.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `ca7478029155f430e643ea3c51ba6a4a766f0c65` (`ca74780`), equal to `origin/main`.
- Previous checkpoint: [`2026-09-22-production-regression.md`](2026-09-22-production-regression.md).
- Shared startup: Notion Agent Hub, operating model, client mapping, Agent Exchange contract/view, AgentOperations enrollment, repository records, and Canonry/Aero guidance were read. The complete Agent Exchange view contained no new actionable RnR-specific message; portfolio and other-repository traffic was skipped per contract. Owner record matched `MATT-GAMING-PC` and this checkout.
- Shared lock: acquired for the check and a separate record-writing owner, then released successfully.

## Outcome

The run found no confirmed live crawlability, indexability, metadata, redirect, schema-type, or AI-access regression on the deployed 99-URL artifact. The locked `npm run seo:check -- auto` selected full mode. Its integrated `npm run validate` gate passed with 0 Astro errors, 26 tests, a 106-page build, and the bundled postbuild AEO check.

The full checker passed 99/99 sitemap pages, 101 same-origin navigation targets, and 99 Markdown alternates. It failed only because live `/build-info.json` still reports `c8698c83f38291b660de3dc6efbc318663710e0a` while the checkout is `ca7478029155f430e643ea3c51ba6a4a766f0c65`, plus the same 12 local/live SEO-signal mismatches on the committed-but-not-live route cluster. The mismatches remain schema payloads only; title, description, canonical, H1, robots/indexability, schema counts, HTTP behavior, expected exclusions, 404 behavior, and representative normal/`CanonryBot/1.0` responses passed. Classify this as deployment/production-parity lag, not a confirmed live regression. No deployment, merge, purge, source/content edit, indexing action, provider mutation, or new visibility sweep/probe was performed.

## Canonry freshness and stored evidence

- Google scheduled refresh: coverage is 59 indexed / 44 not indexed / 0 deindexed across 103 inspected URLs; last inspected/synced at 2026-09-23T10:02:43Z. Search-performance rows remain current through 2026-09-20.
- GA4 property `543995602`: connected and synced at 2026-09-23T10:00:05Z. No conversion or revenue claim is made from the traffic store.
- Bing scheduled inspection: 41 indexed / 0 known not-indexed / 1 unknown across 42 inspected URLs; last inspected at 2026-09-23T10:00:26Z. This replaces the prior partial-inspection state for the recorded 42-URL sample, not the full 99-URL sitemap.
- Latest completed fixed-basket visibility remains run `3e87f272-07c8-40eb-af7a-e30b75e60a19` from 2026-09-20: query-level Mention Coverage 7/42, Citation Coverage 4/42, and non-brand Mention Share 7/40 (18%); provider-snapshot totals are 7/126 mentioned and 5/126 cited. Mention and citation remain separate signals and no new sweep was run.
- Technical audit `6866ca71-5f2d-4a18-b52b-f4642543fe50` remains 90/100 over 101 pages from 2026-09-20, with Content Extractability partial on 94/101 pages at average factor score 58. This is stored readiness evidence, not proof of a visibility cause.

## Due measurements

- `npm run seo:due` found all 13 interventions still `Measuring`; it exited successfully.
- SEO-003 retains the September 20 fixed-basket result; a single completed run does not establish durable recovery or causal impact.
- SEO-004 retains the complete August 22–September 17 versus July 25–August 20 comparison: 0 clicks in all four cohorts and mixed impression/position movement. Keep Measuring and preserve the deployment-parity confounder.
- SEO-006 retains the sparse exact-query observation for `/resources/water-damage-restoration-marketing/` (1 impression, 1 click, position 94 in the stored post-live read); this is insufficient for an outcome claim.
- SEO-013 remains Measuring because the September 21 coordinator task ended with `Selected model is at capacity. Please try a different model.` The next checkpoint is a successful coordinator run followed by live parity verification.
- No bounded repair sync was needed: GSC performance is within the four-day target, GA4 sync is within the two-day target, and visibility/audit evidence is within the eight-day target.

## Required owner actions and limitations

**Deployment/parity lag** → **Evidence:** current `origin/main` is `ca74780`, live is `c8698c8`, and the full checker reports 12 schema-only mismatches while core live SEO signals pass. **Expected impact:** committed source changes are not yet represented in production, so affected interventions cannot be accepted or measured against the current checkout. **Recommended change:** the release owner should complete the normal hosting deployment for `ca74780`, then rerun the locked full checker and exact live verification. **Effort:** Low for deployment/recheck. **Confidence:** High for the diagnosis; no search/AEO outcome is claimed. **Verification:** live `/build-info.json` equals `ca74780` and the full checker has zero failures.

The weekly coordinator execution blocker remains external to this health role. Do not create a duplicate weekly article or start measurement from a push alone. Bing's 42-URL inspection result is not a whole-sitemap verdict; missing or unknown provider data remains unavailable, not zero.

## Checks and next checkpoint

- `npm run seo:check -- auto`: full mode; validation/build/parity completed; exit 1 only for the recorded deployment/parity failures.
- `npm run seo:due`: exit 0; all items remain Measuring.
- Next checkpoint: normal hosting deployment/recheck for `ca74780`, a successful weekly coordinator run, and then the existing SEO-002 same-set indexing gate on or after 2026-09-25. Preserve the current live artifact and do not run duplicate sweeps, probes, submissions, or source/content changes from this health job.
