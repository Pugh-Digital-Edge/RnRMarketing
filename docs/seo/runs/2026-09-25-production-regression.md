# SEO/AEO Production Regression Check — 2026-09-25

- Run time: 2026-09-25T08:04:30-04:00 (2026-09-25T12:04:30Z).
- Run type: closed-loop SEO/AEO production health, parity, and due-measurement check.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD/origin: `43004bfcac16d7ae804594f6a2cbc03bed420c5b` (`43004bf`).
- Shared startup: Agent Hub sign-in was required, so the live Notion Agent Hub/Exchange view could not be read in this run. The local Agent Exchange state and Git receipts were preserved; no coordination-dependent mutation was attempted. The local owner record matched `MATT-GAMING-PC` and this checkout.
- Shared lock: acquired for the checker and released with the identical owner token.

## Outcome

No confirmed live crawlability, indexability, metadata, redirect, schema-type, or AI-access regression was found on the deployed 99-URL artifact. The locked `npm run seo:check -- auto` selected full mode and passed the integrated `npm run validate` gate: 0 Astro errors, 26 tests, a successful 107-page build, and bundled postbuild AEO checks.

The full checker passed 99/99 live sitemap pages, 101 same-origin navigation targets, 99 Markdown alternates, expected exclusions/404 behavior, and representative normal/`CanonryBot/1.0` response parity. It failed the deployed-revision gate because live `/build-info.json` remains `c8698c83f38291b660de3dc6efbc318663710e0a` while source is `43004bfcac16d7ae804594f6a2cbc03bed420c5b`. It also reported the same 12 schema-only local/live mismatches on the committed-but-not-live route cluster and a local/live sitemap inventory mismatch: local build 100 URLs versus live 99. The missing live URL is SEO-014, `/resources/google-ads-for-restoration-companies/`, which returned 404 and is absent from the live sitemap. This is deployment/production-parity lag, not a confirmed live technical failure. No deployment, merge, purge, source/content edit, provider mutation, sweep, probe, submission, or indexing request was performed.

## Canonry freshness and stored evidence

- Google scheduled refresh completed 2026-09-25T10:02:41Z: 59 indexed / 44 not indexed / 0 deindexed across 103 stored URLs. This is a provider sample, not a full current-sitemap verdict.
- GSC performance is available through 2026-09-22. GA4 property `543995602` synced at 2026-09-25T10:00:05Z. No ranking, lead, revenue, or conversion outcome is claimed.
- The scheduled Google sitemap inspection completed for the current 99-URL live sitemap on 2026-09-25T10:02:41Z. Because the approved 23-URL SEO-002 cohort is contained in this refreshed current sitemap, no duplicate inspection was run; the exact cohort comparison remains unavailable from the aggregate rollup and SEO-002 stays Measuring.
- Bing's scheduled inspection again stopped after sustained failures with 89 of 99 pages uninspected. The last complete stored Bing sample remains 41 indexed / 0 known not-indexed / 1 unknown across 42 URLs from 2026-09-23; missing provider rows remain unavailable, not zero.
- Latest completed fixed-basket visibility remains the scheduled 2026-09-20 run: query-level Mention Coverage 7/42, Citation Coverage 4/42, non-brand Mention Share 7/40 (18%); provider-snapshot totals 7/126 mentioned and 5/126 cited. No new sweep was run.
- Latest technical audit remains `6866ca71-5f2d-4a18-b52b-f4642543fe50`, completed 2026-09-20 at 90/100 over 101 pages; Content Extractability remains partial on 94/101 pages. This is stored readiness evidence, not proof of a visibility cause.

## Due measurements

- `npm run seo:due` passed and found all 13 interventions still `Measuring`.
- SEO-002 is due today, but the exact 23-URL before/after verdict comparison is not available as a distinct cohort result. The scheduled current-sitemap inspection was reused as fresh provider evidence without claiming a cohort outcome.
- SEO-003 retains the 2026-09-20 fixed-basket result; one additional run does not establish durable recovery or causal impact.
- SEO-004 retains the complete August 22–September 17 versus July 25–August 20 comparison with 0 clicks across all four cohorts and mixed position/impression movement; deployment parity remains a confounder.
- SEO-005 and SEO-007 are past their calendar due dates, but the source/live parity gap and current GSC data-through date prevent a clean comparable outcome claim. SEO-006 remains sparse and insufficient for an outcome claim. SEO-013 remains Measuring because the September 21 coordinator task failed before completion and SEO-014 has not reached live acceptance.

## Findings and required owner action

**Problem** → The checkout contains committed site/article changes not represented in production.

**Evidence** → Source/origin `43004bf`; live build receipt `c8698c8`; local sitemap 100 URLs versus live 99; SEO-014 returns 404; the full checker reports 12 schema-only mismatches while core live metadata, canonical, H1, robots/indexability, schema counts, HTTP behavior, and crawler parity pass.

**Expected impact** → The current checkout cannot be accepted as the production baseline, and SEO-014's measurement clock cannot start. Search/AEO outcomes must continue to use the accepted live artifact and disclose the source/live confounder.

**Recommended change** → The hosting/release owner should deploy the intended approved scope, then Codex should rerun the locked full checker and verify the exact SEO-014 URL, sitemap inclusion, canonical/indexability, and local/live signal parity. Do not force a broad deployment from this health role.

**Effort** → Low for deployment/recheck; owner-dependent.

**Confidence** → High for deployment/parity diagnosis and the checked live technical surface; low for causal search/AEO interpretation until live parity is accepted.

**Verification method** → Confirm live `/build-info.json` equals the accepted revision, require zero full-checker failures, verify SEO-014 returns HTTP 200 and appears in the live sitemap, then begin equal-window measurement. Keep Mention Coverage/Share separate from Citation Coverage and query-level denominators separate from provider-snapshot totals.

## Limitations and next checkpoint

- Notion Agent Hub/Exchange live reads were blocked by interactive sign-in; local exchange state shows the pending SEO-014 thread and prior parity blocker, with no new receipt inferred.
- Bing's partial inspection is not a whole-sitemap indexing verdict.
- No new Canonry visibility sweep, probe, audit, discovery, repair sync, deployment, purge, source/content change, submission, or indexing request was run.
- Next checkpoint: hosting deployment/recheck and successful Friday coordinator live acceptance for SEO-014; keep the one-article-per-Eastern-week rule and do not create a second article.
