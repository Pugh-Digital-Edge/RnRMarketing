# SEO pipeline contract

Approved by Matt on 2026-09-15: apply the pipeline assessment fixes, retaining **one new article every calendar week**. Weeks run Mondayâ€“Sunday in America/New_York. This contract supersedes older automation wording that requires fresh approval for the bounded operations below. It does not approve fabricated evidence or unrelated changes.

## Ownership and cadence

| Owner | Schedule (Eastern) | Responsibility |
| --- | --- | --- |
| Canonry data-refresh | Daily 06:00 | Refresh connected search and analytics integrations. |
| Canonry answer-visibility | Sunday 18:00 | One fixed-basket sweep: 42 existing queries Ã— Gemini/OpenAI/Claude. No query/provider expansion. |
| Canonry site-audit | Sunday 19:00 | One bounded technical audit, no dead-link option. |
| Production and measurement automation | Weekdays 08:00 | Lightweight live checks; full validation/parity on source or sitemap change or after seven days. Measure due interventions with fresh evidence. Discover handoff PRs using the executable signals in this contract (candidates only; discovery does not grant approval). |
| Weekly coordinator | Monday, Wednesday, Friday 09:30 | Rank opportunities, deliver this week's one article, verify deployment, and measure due work. Wednesday/Friday are recovery/checkpoint runs, not extra article quotas. After the article is secured and urgent regressions are handled, bounded review of complete handoff PRs. |
| Monthly learning review | First day 10:30 | Synthesize already-measured outcomes and adjust strategy. |

The former separate opportunity job is paused. Its responsibility belongs to the coordinator, immediately upstream of article selection. Main-branch writers on the designated Codex checkout share one lock. Canonry collection jobs write only Canonry state.

## Lock and release

Before editing, building, running the production checker, or committing, create a unique owner token and run:

```powershell
$seoOwner = 'seo-' + [guid]::NewGuid().ToString('N')
node scripts/seo-lock.mjs acquire $seoOwner
```

Only exit code 0 with `acquired: true` grants ownership. A busy lock means no writes or builds. Retry at most ten times, 30 seconds apart; then report contention once and defer to the next scheduled checkpoint. Do not steal an old lock automatically. If abandoned, inspect task state and release using its recorded owner only after confirming the owning run ended.

`scripts/seo-lock.mjs` stores the lock in this clone's Git common directory. It coordinates **linked worktrees on that clone**, not independent Cloud Agent clones, a laptop checkout, or the VPS. Cloud Agents work on isolated branches; parallel implementation is OK. One designated Codex checkout serializes **main-branch releases** under this lock. Overlapping releases need serialization. Validate a proposed merge against **current main**; invalidate that validation if either revision changes; refuse merge if the PR head moved.

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

Hosted Canonry is the primary. The current-user Windows scheduled task **Codex Canonry Health** runs at logon and every 15 minutes, using `C:\Users\mpugh\.codex\automations\daily-canonry-serve\ensure-canonry.ps1`. It only verifies hosted `/health`; it must not start a second local primary. The old daily Codex `serve` task is paused. Repository-writing automations still need this computer and the Codex desktop app online. Staggered clock times alone do not guarantee repository job ordering. If a scheduled collection was missed, check native run history before attempting a bounded repair; do not assume catch-up succeeded.

## Shared primary (hosted Canonry)

As of 2026-09-16 the Canonry primary is hosted at `https://canonry.remediationrestorationmarketing.com`. Codex SEO automations and local `cnry`/Canonry skills must use that `apiUrl` (see `docs/seo/COHESION.md`). The Windows **Codex Canonry Health** task only verifies hosted health; it must not start a second local primary. Repository-writing automations still need this computer + Codex desktop app online.

## Cloud Agent handoff PRs (Codex review/merge)

Approved Notion Fulfillment work may be implemented by a Cursor Cloud Agent as a pull request. That lane is **not** a second article publisher and does **not** change the one-article-per-week obligation. Ownership stays with Codex: weekly articles, weekday health, monthly learning, **and** review, merge, live acceptance, and measurement of these PRs.

Keep with Codex: weekly article selection/drafting, substantive marketing prose, strategic prioritization, measurement interpretation, and learning. Good Cloud Agent work: scoped technical fixes, components, accessibility, approved redirects/internal links, schema tied to visible content, and PPC/local landing-page structure using approved copy. Preserve existing copy or include an explicit copy diff. `npm run validate` cannot detect bland prose or invented claims. Live ad-budget/campaign changes, GBP edits, and connector config are separate workflows. A brief must not let the implementer change its own approval rules.

### Executable discovery

Search using **any** of these signals. Labels and author identify candidates; they do not grant approval. Require the complete contract before merge.

| Signal | Value |
| --- | --- |
| Label | `handoff` |
| Title | `[handoff][SEO-###] Concrete change` |
| Branch | `handoff/SEO-###-short-slug` |
| PR body | Stable ID, Notion URL, approved brief path/revision, evidence, scope, validation result |

The weekday 08:00 job **discovers** matching PRs and records candidates. The Mon/Wed/Fri coordinator performs **bounded review** only after this week's article is secured and after urgent regression handling. Automation prompts live in `~/.codex/automations` (outside this repo) and must stay aligned with this contract.

Before dispatch or merge, Codex must check active articles, existing-page work, open PRs, and measuring interventions. Reuse the existing backlog ID when a handoff overlaps. Notion mirrors execution status; the backlog retains hypotheses and measurement checkpoints — not two competing queues.

### Review, merge, and Done

When Codex sees a complete handoff candidate:

1. Treat it as **bounded review-to-merge** work, not as a competing weekly-article run.
2. On the designated Codex checkout, acquire the shared SEO lock. Validate the proposed merge against **current main**. Run `npm run validate`. Merge only if the PR matches the approved brief revision, stays inside allowed files/URLs, and the SEO gate is satisfied.
3. Invalidate that validation if main or the PR head changes. Do not merge a moved PR head. Do not merge if the brief is still in `review/`, the SEO gate is Needs review or Rejected, scope drifted from the approved revision, or the change takes weekly-article/prose/prioritization/measurement work that stays with Codex.
4. Merge is **Awaiting live verification**, not Done. After the live artifact matches, record the acceptance receipt. Grok updates Notion from that receipt. Status becomes **Measuring** using the backlog checkpoint. Move the brief to `docs/seo/handoffs/done/` only after acceptance **and** required measurement. Closed-unmerged work is **Cancelled**. If fulfillment must close at live acceptance, label **Delivery complete** and keep a separately linked open measurement item.

Grok Bot launches Cloud Agents only after the SEO gate **and** launch dedup by repo + intervention ID + approved revision, with the Cloud Agent run and PR recorded before retries. `pending/` alone must never mean launch again. A timeout is reconciliation, not another launch. Cloud Agents never merge. Details: `docs/seo/COHESION.md` and `docs/seo/handoffs/README.md`.

