# SEO pipeline contract

Approved by Matt on 2026-09-15: apply the pipeline assessment fixes, retaining **one new article every calendar week**. Weeks run Mondayâ€“Sunday in America/New_York. This contract supersedes older automation wording that requires fresh approval for the bounded operations below. It does not approve fabricated evidence or unrelated changes.

## Ownership and cadence

| Owner | Schedule (Eastern) | Responsibility |
| --- | --- | --- |
| Canonry data-refresh | Daily 06:00 | Refresh connected search and analytics integrations. |
| Canonry answer-visibility | Sunday 18:00 | One fixed-basket sweep: 42 existing queries Ã— Gemini/OpenAI/Claude. No query/provider expansion. |
| Canonry site-audit | Sunday 19:00 | One bounded technical audit, no dead-link option. |
| Production and measurement automation | Weekdays 08:00 | Lightweight live checks; full validation/parity on source or sitemap change or after seven days. Measure due interventions with fresh evidence. |
| Weekly coordinator | Monday, Wednesday, Friday 09:30 | Rank opportunities, deliver this week's one article, verify deployment, and measure due work. Wednesday/Friday are recovery/checkpoint runs, not extra article quotas. |
| Monthly learning review | First day 10:30 | Synthesize already-measured outcomes and adjust strategy. |

The former separate opportunity job is paused. Its responsibility belongs to the coordinator, immediately upstream of article selection. All repository-writing roles share one lock. Canonry collection jobs write only Canonry state.

## Lock and release

Before editing, building, running the production checker, or committing, create a unique owner token and run:

```powershell
$seoOwner = 'seo-' + [guid]::NewGuid().ToString('N')
node scripts/seo-lock.mjs acquire $seoOwner
```

Only exit code 0 with `acquired: true` grants ownership. A busy lock means no writes or builds. Retry at most ten times, 30 seconds apart; then report contention once and defer to the next scheduled checkpoint. Do not steal an old lock automatically. If abandoned, inspect task state and release using its recorded owner only after confirming the owning run ended. The lock lives in the Git common directory, so linked worktrees share it.

Use a PowerShell `try/finally` around bounded command batches. For agent work spanning tool calls, retain the token and release before returning, including on failures:

```powershell
$env:SEO_LOCK_OWNER = $seoOwner
npm run seo:check -- auto
node scripts/seo-lock.mjs release $seoOwner
Remove-Item Env:SEO_LOCK_OWNER -ErrorAction SilentlyContinue
```

The production checker requires the matching environment token. Never stage a whole dirty checkout. Inspect changed files and stage only the intervention and its records. Preserve pre-existing backlog edits; use a selective patch or leave those edits uncommitted with an explicit record.

## Weekly article delivery

1. Read AGENTS.md, this contract, strategy, backlog, learnings, recent runs and automation memory. Check the current week in article frontmatter, Git history and live URLs; a deployed article from any authorized task satisfies the week. Never publish a second article solely because a recovery run fired.
2. Refresh/read the baseline and rank existing-page work separately from article opportunities. Retain up to five evidence-backed candidates; return fewer if evidence supports fewer. Do not force unrelated changes to fill a quota.
3. Select an eligible existing article ID, or create a stable ID. Require attributable Canonry query/citation/competitor evidence, primary-source factual support and a distinct intent not adequately covered by an existing page. Store the source date/window and freshness limitation. Maintain two reserve topic briefs in the backlog when sufficient evidence exists; they are not extra articles.
4. Explicitly auto-approve and implement exactly one new B2B restoration-marketing article each week. No separate approval is needed for its article, cover, directly relevant contextual links, validation, focused commit and push. Keep Matt Pugh authorship and current Astro conventions. Cover imagery must depict credible marketing/business work without fabricated metrics, logos or outcomes. No body images. Add FAQs only when useful, with one visible block and one synchronized schema source.
5. If the first candidate fails, try the next qualified candidate. Fallback angles must stay B2B: agency selection, channel tradeoffs, attribution, lead quality/intake, territory planning, website conversion, budgeting without invented prices, and marketing measurement. Do not fall back to consumer cleanup, health, insurance-claim or remediation instructions.
6. A real factual, image, validation or overlapping-change blocker prevents unsafe publication, but does not silently cancel the weekly obligation. Preserve the draft, identify the exact blocker/owner/next checkpoint, and resume the same ID Wednesday/Friday. Do not generate a duplicate draft. Friday unresolved delivery is a meaningful failure requiring notification.
7. Existing-page improvements have a separate queue. The coordinator may execute a previously approved small item only after article delivery is secured; otherwise present the strongest specific change for approval. An article never substitutes for technical, indexing or deployment repairs.

## Evidence freshness and collection authority

- Daily `data-refresh`, weekly fixed-basket visibility and weekly technical audit schedules are authorized. Do not run duplicate manual sweeps, probes or discovery sessions. No automatic basket/provider changes, indexing requests, sitemap submissions, outreach, paid campaigns, or connected-account configuration changes.
- Before planning, read GSC data-through date (not just sync time), GA4 last sync/data window, latest completed full visibility run and audit time. Targets: GSC data through within four days, connected GA4 sync within two days, visibility/audit within eight days. These are operational alerts, not fabricated zeros or ranking judgments.
- If GSC or connected GA4 is stale and no equivalent collection is running or completed today, one project-scoped repair sync per source per day is authorized. Record its run ID and outcome in the dated record to prevent repeats. Stop and report persistent failures; do not loop quota-consuming retries. Daily refresh may also update indexing samples; preserve the distinct URL-inspection date and sample denominator.
- Preserve SEO-002's same-set indexing checkpoint: at or after 2026-09-25, one bounded read-only Google/Bing inspection pass over the existing recorded 23-URL set is authorized. Do not submit URLs or expand the set. Skip URLs already freshly inspected by the scheduled data refresh and retain comparable cohort results.
- Canonry remains the project measurement source. Repository records store intervention hypotheses, approvals, deployment checkpoints and evidence references; they must not become an independently invented measurement database.
- Current GA4 stream: `G-4K4H62DJ77`, verified property `543995602`, connected and initially synced on 2026-09-15. Attribute organic/AI sessions and verified lead events separately from all-channel totals. `phone_call_click` is a click, not a qualified call. `generate_lead` is an event, not proven revenue. Exclude identified QA/test campaigns from business conclusions and explain unavailable filtering. No synthetic lead submissions on production.

## Consistent validation and production checks

- One release gate: `npm run validate` (Astro check, all tests, production build and postbuild AEO checks). Every required command must pass; hints alone do not fail the gate. Repair small in-scope baseline blockers or record them; never bypass a failure because another command passed.
- `npm run seo:check -- auto` uses smoke checks on unchanged days. Full mode validates/builds and compares live metadata, canonicals, H1s, parsed schema, indexability, sitemap and AI-access artifacts, internal targets and representative normal/crawler responses. Force `full` immediately after a deployment. Full failures never advance the last-good checkpoint. It does not claim Google indexing or real crawler retrieval.
- A source push is `Awaiting live verification`. Verify the exact article URL and affected URLs after deployment. Allow bounded deployment polling, no more than ten attempts over ten minutes, and retain the pending state if hosting is delayed. Never start measurement from a push alone.
- The build emits `/build-info.json` with the source Git commit, served without caching and with noindex headers. The checker records that deployed revision and compares it with the local source; documentation-only commits may skip a hosting build when the site/build inputs are identical. Missing receipts or unresolved revision differences are deployment failures, not content gaps.
- The daily job detects source/sitemap changes even when it misses the deployment window. For failures, diagnose deployment/parity before content. Do not claim an unchanged smoke result verifies the whole site.
- Quiet successful smoke checks stay in the local runtime record. Write an append-only repository run for a full deployment checkpoint, meaningful failure/change, completed measurement or weekly/monthly summary. Deduplicate unchanged alerts using the last record and automation memory.

## Due measurements and learning

Run `npm run seo:due` in daily and coordinator runs, not just monthly. Check missing-date items and due items against the backlog; do not reinterpret an old historical date as the current gate.

Each intervention retains ID, affected URLs/query cohort, classification, baseline dates/window, hypothesis, expected impact, effort, confidence, authorization, commit, accepted live date, due date and verification method. Current status fields summarize the latest state; older dated observations remain historical.

Measure only when the data-through date covers the entire intended post-live window. Compare equal-length before/after windows, using the exact URL/query cohort, deployment date and known confounders. Do not mix all-channel GA4 with organic results or partial provider baskets with completed fixed-basket runs. Label low sample size and separate correlation from causality. Record mention coverage/share separately from citation coverage and identify query-level versus provider-snapshot denominators.

If a window is not complete, leave Measuring and record the missing source plus a concrete next checkpoint (normally the next daily run after the expected data lag). If complete, record the measured result in the dated run and update that item; promote a learning only when supported. Monthly review summarizes these observations instead of waiting a month to start measuring.

## Runtime availability

The current-user Windows scheduled task **Codex Canonry Health** runs at logon and every 15 minutes, using `C:\Users\mpugh\.codex\automations\daily-canonry-serve\ensure-canonry.ps1`. It checks health first and calls `cnry start` only if unavailable; it never stops or restarts a healthy daemon. The old daily Codex `serve` task is paused. Local repository automations still require this computer and the Codex desktop app to be on; Canonry collection requires the computer and daemon. Staggered clock times alone do not guarantee repository job ordering. If a scheduled collection was missed, check native run history before attempting a bounded repair; do not assume catch-up succeeded.

## Shared primary (hosted Canonry)

As of 2026-09-16 the Canonry primary is hosted at `https://canonry.remediationrestorationmarketing.com`. Codex SEO automations and local `cnry`/Canonry skills must use that `apiUrl` (see `docs/seo/COHESION.md`). The Windows **Codex Canonry Health** task only verifies hosted health; it must not start a second local primary. Repository-writing automations still need this computer + Codex desktop app online.

## Cloud Agent handoff PRs (Codex review/merge)

Approved Notion Fulfillment work may be implemented by a Cursor Cloud Agent as a pull request. That lane is **not** a second article publisher and does **not** change the one-article-per-week obligation. Ownership stays with Codex: weekly articles, weekday health, monthly learning, **and** review/merge of these PRs.

When Codex sees a PR labeled `handoff`, opened from a Cloud Agent, or referencing `docs/seo/handoffs/`:

1. Treat it as **review-to-merge** work, not as a competing weekly-article run.
2. Acquire the shared SEO lock. Run `npm run validate`. Merge only if the PR matches the brief, stays inside its constraints, and the SEO gate is satisfied.
3. Do not merge if the brief is still in `review/`, the SEO gate is Needs review or Rejected, or the change publishes an article outside the brief or the weekly article rules.
4. After merge, Notion Fulfillment is Done (PR link) and the brief belongs in `docs/seo/handoffs/done/`.

When scanning `docs/seo/handoffs/`, only `pending/` is actionable for implementers. `review/` waits for Matt's SEO gate. Cloud Agents never merge. Grok Bot launches Cloud Agents only after that gate (see `docs/seo/COHESION.md`).

