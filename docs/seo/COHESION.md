# Execution ownership (cohesion)

Approved direction: **Codex keeps running the closed-loop SEO jobs**. Grok Bot owns shared infrastructure so both sides stay aligned.

| Layer | Owner | Notes |
| --- | --- | --- |
| Article + weekday health + monthly learning | **Codex automations** | Same prompts/schedules in `~/.codex/automations` |
| Measurement / AEO evidence | **Hosted Canonry** | `https://canonry.remediationrestorationmarketing.com` · project `remediation-restoration-marketing` |
| Repo contract | **This repo** | `AGENTS.md` + `docs/seo/pipeline.md` remain source of truth |
| Hosting / DNS / MCP / backups | **Grok Bot** | VPS, Caddy, MCP wiring, deploy repo |
| Local Canonry daemon | **Do not use as primary** | Windows health task only checks hosted `/health` |

Desktop + laptop `~/.canonry/config.yaml` must keep `apiUrl` / `publicUrl` on the hosted HTTPS URL so Codex's installed Canonry/Aero skills hit the same DB as the dashboard and Grok MCP.

Do not run parallel Grok Bot routines that rewrite the same backlog/runs while Codex jobs are ACTIVE — that causes lock fights and duplicate articles.
## Grok Bot in RRM fulfillment

- **Always on:** hosted Canonry, MCP for agents, HTTPS/DNS, backups, watchdog.
- **In fulfillment:** yes — as the **platform + specialist bots** (Site Delivery, SEO Ops coordination, Reporting digests, Client Ops), reading the same Canonry project and this repo's `docs/seo` control plane.
- **Not:** a second publisher competing with Codex's weekly article / weekday health / monthly review crons.
