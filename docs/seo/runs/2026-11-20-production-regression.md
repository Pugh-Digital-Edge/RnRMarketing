# Production regression and due-measurement receipt — 2026-11-20

## Scope and execution

- Repository: `Pugh-Digital-Edge/RnRMarketing`
- Role: scheduled production health and due measurements
- Native invocation: `Pugh-Digital-Edge/RnRMarketing:health:01a1f990-90e2-7fc0-bb82-be5a5c3e507e`
- Native thread: `01a1f990-90e2-7fc0-bb82-be5a5c3e507e`
- Started: `2026-11-20T15:26:04.028Z`
- Finished: `2026-11-20T15:39:26.6410235Z`
- AgentOperations source inspected: `a392c9094e1a022a3994e8d8465e7531f6b2b76d`
- SEO lock: acquired and released by this run; no lock theft or contention
- Worker result: completed; coverage remains partial because smoke mode does not certify whole-site parity and dependent measurements remain open

## Search freshness

The exact-project, GSC-only guard completed for this invocation against `https://canonry.remediationrestorationmarketing.com`.

- Provider run: `91e175f9-6950-47f0-925f-9ae3421ba4d9`
- GSC property: `sc-domain:remediationrestorationmarketing.com`
- Window: `2026-10-20` through `2026-11-18`
- Actual daily rows: 30; missing dates: none; duplicate dates: none
- `latestDataDate`: `2026-11-18`; actual final row: `2026-11-18`
- Pacific lag: 2 days; operational maximum: 4 days
- Guard result: `fresh=true`, `complete=true`, `usable=true`
- Scope limitation: GSC only; Bing, GA4 fan-out and paid/AI visibility collection were not part of this refresh

Safety evidence was renewed read-only at `2026-11-20T15:34:25.139Z` for Canonry `7.108.3` / commit `42321b563bf8f0b576ed77b3494681ed1728b5a6`. The reviewed source chain confirms the dedicated GSC route and completion path remain GSC-only, with `paid_ai_followup=false`, `audit_followup=false`, and `provider_fanout=false`.

## Production and stored evidence

- `npm run seo:check -- auto`: smoke passed at `2026-11-20T15:34:58.708Z`; 108 sitemap pages, 5 smoke pages, zero failures.
- Live build-info reports `eed1a96e4b3ebe8471cb0fbe1bfb3be8c90ba888`; local `HEAD` is `068081a9e91eb8c6eb4816bb0268b973c7e8bc43`. The two local commits are receipt-only documentation, with no source or sitemap input changes. Smoke mode therefore does not claim whole-site parity.
- `npm run seo:due`: passed; all 16 listed interventions remain `Measuring`, including overdue `SEO-016`.
- Native GA4 status: property `543995602`, last updated `2026-11-20T11:00:17.396Z`; no separate GA4 refresh was initiated by this run.
- Latest stored answer-visibility run: `94042599-0f9c-43ae-8f20-bc01e09dcc2c`, measured `2026-11-15`; 4/126 provider snapshots mentioned and 5/126 cited. These are descriptive stored results, not a causal intervention outcome.
- Latest stored site-health run: `bf1826d3-4575-4119-ae19-869aaa2e629c`, measured `2026-11-16`; score 87, 109 pages discovered/fetched, 107 eligible, 4,352 internal edges, zero crawl errors/skips. A new audit is due because material source changed after that scan; execution remains held on missing fresh exact-scope zero-charge/resource and proactive-Aero evidence.
- Bing scheduled coverage remains partial/throttled. Desktop Canonry is `7.24.0` while the deployed server is `7.108.3`; the official monitor recorded Node compatibility as unverified and no upgrade was attempted.

## Due-work disposition

No exact-cohort outcome was promoted. The read-only measurement followthrough queue was empty; the priorities assessment returned `BOUNDED_EXISTING_CHECKPOINT_REQUIRED`. Existing intervention dates, baselines, approvals, acceptance receipts and `Measuring` states were preserved. The next existing health checkpoint is `2026-11-23T13:00:00Z`.

## Internal reconciliation

- The existing Fulfillment projection queue was consumed and returned empty; no duplicate task, acceptance replay, Exchange event or Grok relay was created.
- No article, source/content, deployment, indexing submission, provider fan-out, account, advertising, credential or live-setting mutation occurred.
- Remaining owners/checkpoints: hosting/release owner for any whole-site parity decision; Canonry host/resource owner for audit readiness; Codex for exact-cohort measurement when the stored plan and comparable evidence permit it; next health checkpoint `2026-11-23T13:00:00Z`.
