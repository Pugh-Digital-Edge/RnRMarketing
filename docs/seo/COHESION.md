# Execution ownership (cohesion)

Approved direction: **Codex keeps running the closed-loop SEO jobs**. Grok Bot owns shared infrastructure so both sides stay aligned. Cursor Cloud Agents implement approved Notion Fulfillment briefs as **pull requests only**; Codex reviews, merges, accepts live, and interprets measurement. This is the same closed-loop brain as weekly articles, weekday health, and monthly learning — not a parallel publisher.

| Layer | Owner | Notes |
| --- | --- | --- |
| Measurement / AEO evidence | **Canonry** | Hosted `https://canonry.remediationrestorationmarketing.com` · project `remediation-restoration-marketing`. Measurement truth. |
| Fulfillment tracking | **Notion** | Mirrors execution status for approved work. Not a second backlog. |
| Intervention hypotheses + measurement checkpoints | **Repo backlog** | `docs/seo/backlog.md` retains IDs, hypotheses, baselines, due dates, and verification methods. |
| Prioritization, editorial judgment, release acceptance, learning | **Codex** | Weekly articles, weekday health, monthly learning, **and** handoff review/merge/acceptance. |
| Coordination | **Grok Bot** | Hosted Canonry spine, Notion ops, Cloud Agent launch **only after** the SEO gate and a complete launch contract. |
| Implementation | **Cursor Cloud Agent** | Isolated-branch PRs only. Never merge. Never change this brief's approval rules. |
| Repo contract | **This repo** | `AGENTS.md` + `docs/seo/pipeline.md` remain source of truth. Briefs live in `docs/seo/handoffs/`. |
| Hosting / DNS / MCP / backups | **Grok Bot** | VPS, Caddy, MCP wiring, deploy repo |
| Local Canonry daemon | **Do not use as primary** | Windows health task only checks hosted `/health` |

Notion **mirrors execution status**. The existing backlog retains intervention hypotheses and measurement checkpoints. They are not two competing queues. Reuse the existing backlog ID when a handoff overlaps an open intervention.

Desktop + laptop `~/.canonry/config.yaml` must keep `apiUrl` / `publicUrl` on the hosted HTTPS URL so Codex's installed Canonry/Aero skills hit the same DB as the dashboard and Grok MCP.

Do not run parallel Grok Bot routines that rewrite the same backlog/runs while Codex jobs are ACTIVE — that causes lock fights and duplicate articles. Cloud Agent implementation happens on isolated branches. Main-branch releases serialize on one designated Codex checkout under the existing SEO lock. That lock coordinates linked worktrees on that checkout; it does not coordinate independent Cloud Agent clones, a laptop, or the VPS.

## Keep with Codex vs good Cloud Agent work

**Keep with Codex:** weekly article selection and drafting, substantive marketing prose, strategic prioritization, measurement interpretation, and learning.

**Good Cloud Agent work:** scoped technical fixes, components, accessibility, approved redirects/internal links, schema tied to visible content, and PPC/local landing-page structure that uses **approved copy**.

Preserve existing copy, or include an explicit copy diff. `npm run validate` cannot detect bland prose or invented claims. Live ad-budget/campaign changes, GBP edits, and connector configuration are **separate workflows**, not this handoff lane. A brief must not let the implementer change its own approval rules, allowed files, URLs, exclusions, or acceptance criteria.

## Grok Bot in RRM fulfillment

- **Always on:** hosted Canonry, MCP for agents, HTTPS/DNS, backups, watchdog.
- **In fulfillment:** yes — as the **platform + specialist bots** (Site Delivery, SEO Ops coordination, Reporting digests, Client Ops), reading the same Canonry project and this repo's `docs/seo` control plane. Grok Bot updates Notion Fulfillment from Codex's acceptance receipt, writes approved briefs under `docs/seo/handoffs/`, and launches a Cloud Agent **only after** the SEO gate and launch-dedup contract.
- **Not:** a second publisher competing with Codex's weekly article / weekday health / monthly review crons. Grok Bot does not merge handoff PRs, does not accept live, and does not interpret measurement.

## Notion → Cloud Agent → Codex loop

Work is tracked in Notion Fulfillment under RRM HQ. Canonry remains measurement truth. This repo ships code. The implementer lane is Cloud Agent → PR; Codex owns prioritization, editorial judgment, release acceptance, and learning.

Lifecycle (Notion mirrors this; it is not a second queue):

`Ready → Implementing → PR review → Awaiting live verification → Measuring → Done`

1. Gate the work in Notion (`Source` + `SEO gate`).
2. Land the brief in `docs/seo/handoffs/pending/` (copy [`handoffs/TEMPLATE.md`](handoffs/TEMPLATE.md)). Evidence-sourced drafts start in `review/` until Matt Approves. Reuse the existing backlog ID when overlapping.
3. **Grok Bot launches a Cursor Cloud Agent** only when the launch contract is complete (identifiable approved revision, not `pending/` alone). The agent implements as a **PR only** (no merge) using the executable PR signals.
4. **Codex** discovers candidates, reviews against **current main**, runs `npm run validate` on the designated Codex checkout under the SEO lock, and merges only a complete contract. Invalidate validation if main or the PR head changes; refuse merge if the PR head moved.
5. After merge, status is **Awaiting live verification**. Codex records the acceptance receipt when the live artifact matches. Never treat merge as Done.
6. **Measuring** uses the backlog's dated baseline, query/URL cohort, due date, and verification method. Move the brief to `done/` only after **acceptance AND required measurement**.
7. **Grok Bot updates Notion from Codex's acceptance receipt.** If fulfillment must close at live acceptance, label **Delivery complete** and keep a separately linked open measurement item. Closed-unmerged work is **Cancelled** (`docs/seo/handoffs/cancelled/`), not Done.

### SEO gate (before any Cloud Agent)

Launch only when all of these are true: Notion status is Ready, the SEO gate matches Source, the brief revision is approved, and launch dedup allows a new run:

| Source | SEO gate required | Folder until gated |
| --- | --- | --- |
| Matt | N/A or Approved | `pending/` (launch still requires the full contract) |
| Client request | Matt confirmed, and gate N/A or Approved | hold until Matt confirmed; then `pending/` |
| Internal ops | Matt confirmed, and gate N/A or Approved | `review/` until that gate; then `pending/` |
| Canonry evidence | **Approved** (never Needs review) | start in `review/` |
| Competitive research | **Approved** (never Needs review) | start in `review/` |

Rejected briefs are not launched. `pending/` alone must never mean launch again. Cloud Agents never merge. Folder rules, launch dedup, and the brief template are in [`handoffs/README.md`](handoffs/README.md).
