# Execution ownership (cohesion)

Approved direction: **Codex keeps running the closed-loop SEO jobs**. Grok Bot owns shared infrastructure so both sides stay aligned. Cursor Cloud Agents implement approved Notion Fulfillment briefs as **pull requests only**; Codex reviews and merges those PRs. This is the same closed-loop brain as weekly articles, weekday health, and monthly learning — not a parallel publisher.

| Layer | Owner | Notes |
| --- | --- | --- |
| Article + weekday health + monthly learning | **Codex automations** | Same prompts/schedules in `~/.codex/automations` |
| Review/merge of Cloud Agent handoff PRs | **Codex** | Shared SEO lock + `npm run validate`. Merge is Codex-only. |
| Implement approved handoffs as PRs | **Cursor Cloud Agent** | Never merge. Never auto-publish articles outside the brief. |
| Measurement / AEO evidence | **Hosted Canonry** | `https://canonry.remediationrestorationmarketing.com` · project `remediation-restoration-marketing` |
| Repo contract | **This repo** | `AGENTS.md` + `docs/seo/pipeline.md` remain source of truth. Briefs live in `docs/seo/handoffs/`. |
| Hosting / DNS / MCP / backups | **Grok Bot** | VPS, Caddy, MCP wiring, deploy repo |
| Notion ops + Cloud Agent launch | **Grok Bot** | Launch Cloud Agents only after the SEO gate. |
| Local Canonry daemon | **Do not use as primary** | Windows health task only checks hosted `/health` |

Desktop + laptop `~/.canonry/config.yaml` must keep `apiUrl` / `publicUrl` on the hosted HTTPS URL so Codex's installed Canonry/Aero skills hit the same DB as the dashboard and Grok MCP.

Do not run parallel Grok Bot routines that rewrite the same backlog/runs while Codex jobs are ACTIVE — that causes lock fights and duplicate articles. Cloud Agent implementation PRs take the same shared SEO lock; they do not bypass Codex cadence or the weekly article quota.

## Grok Bot in RRM fulfillment

- **Always on:** hosted Canonry, MCP for agents, HTTPS/DNS, backups, watchdog.
- **In fulfillment:** yes — as the **platform + specialist bots** (Site Delivery, SEO Ops coordination, Reporting digests, Client Ops), reading the same Canonry project and this repo's `docs/seo` control plane. Grok Bot updates Notion Fulfillment, writes approved briefs under `docs/seo/handoffs/`, and launches a Cloud Agent **only after** the SEO gate.
- **Not:** a second publisher competing with Codex's weekly article / weekday health / monthly review crons. Grok Bot does not merge handoff PRs and does not auto-publish weekly articles.

## Notion → Cloud Agent → Codex loop

Work is tracked in Notion Fulfillment under RRM HQ. Canonry remains measurement truth. This repo ships code. The implementer lane is Cloud Agent → PR; the closer is Codex.

1. Gate the work in Notion (`Source` + `SEO gate`).
2. Land the approved brief in `docs/seo/handoffs/pending/` (copy [`handoffs/TEMPLATE.md`](handoffs/TEMPLATE.md)). Evidence-sourced drafts start in `review/` until Matt Approves.
3. **Grok Bot launches a Cursor Cloud Agent**, which implements the pending brief as a **PR only** (no merge).
4. **Codex reviews and merges** that PR (acquire the SEO lock, run `npm run validate`) — same owner as articles, weekday health, and monthly learning.
5. Notion Fulfillment → Done with the PR link; the brief file moves to `docs/seo/handoffs/done/`.

### SEO gate (before any Cloud Agent)

Launch only when all of these are true: Notion status is Ready, the brief is under `pending/`, and the gate matches Source:

| Source | SEO gate required | Folder until gated |
| --- | --- | --- |
| Matt | N/A or Approved | `pending/` (may launch) |
| Client request | Matt confirmed, and gate N/A or Approved | hold until Matt confirmed; then `pending/` |
| Internal ops | Matt confirmed, and gate N/A or Approved | `review/` until that gate; then `pending/` |
| Canonry evidence | **Approved** (never Needs review) | start in `review/` |
| Competitive research | **Approved** (never Needs review) | start in `review/` |

Rejected briefs are not launched. Cloud Agents never merge. Folder rules and the brief template are in [`handoffs/README.md`](handoffs/README.md).
