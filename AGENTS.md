# Agent instructions

## Scheduled SEO pipeline

For scheduled SEO/AEO work, read `docs/seo/pipeline.md` first. The user approved that bounded pipeline on 2026-09-15 and explicitly retained one new article per week. Its collection schedules, repair-sync limits and article publication authority are standing authorization; do not ask again for those exact operations. All repository-writing automations must acquire the shared SEO lock. Use the single `npm run validate` release gate. Broader mutations remain outside that authorization.

## SEO/AEO routing principle

SEO recommendations must be evidence-backed and opportunity-ranked. Do not recommend changes solely because they are SEO best practices.

Treat any request about SEO advice, ranking improvements, content optimization, technical SEO, internal linking, indexing, local SEO, AI-search visibility, citations, or search-performance analysis as an SEO/AEO task. This file is the routing and control layer; detailed methodology belongs in the installed `canonry` and `aero` skills and their referenced playbooks.

When this project is configured for Canonry:

1. Use the `canonry` skill to establish the current baseline before diagnosing or recommending substantive work. Prefer existing Google Search Console/Bing data and Canonry data; do not fabricate or infer missing measurements.
2. Use the `aero` skill and the closest relevant workflow/playbook before making substantive recommendations. Do not treat every SEO question as a generic audit.
3. Rank evidence approximately in this order: Google Search Console/Bing search data; Canonry technical/search/visibility data; AI citation and answer-engine evidence; existing site content and internal-link structure; analytics/conversion evidence; general SEO best practices.

If Canonry is not configured, say so and use the strongest available source-code, rendered-site, search, and analytics evidence. If Canonry, Aero, live production, or source-code evidence disagree, investigate the discrepancy—especially deployment and production parity—before optimizing toward an audit score.

## Aero routing map

Use the installed `aero` skill and route to the closest real workflow or reference. Read its detailed playbook when the intent matches:

| User intent | Aero capability to use |
| --- | --- |
| “Why aren’t we ranking?” | `aero` → `regression-playbook.md` for a loss; otherwise `orchestration.md` / its content-gap workflow for opportunity diagnosis |
| “What should we work on next?” | `aero` → `orchestration.md` prioritization and weekly-review workflow |
| “How can this page rank better?” | `aero` → `orchestration.md` content-gap workflow, with Canonry evidence |
| “How can we appear more in AI answers?” | `aero` → `regression-playbook.md` for a decline or `aeo-discovery.md` for query/citation discovery |
| “Should we create this page?” | `aero` → `aeo-discovery.md` when query-basket expansion is needed, then `orchestration.md` content-gap workflow |
| “Where should we add internal links?” | `aero` → `orchestration.md` content-gap workflow, validated against the site’s existing link structure |
| “Did these SEO changes work?” | `aero` → `regression-playbook.md` and before/after comparison against the pre-change baseline |

For technical SEO, indexing, structured data, sitemaps, robots, local AEO/GBP, or citation tracking, use the relevant `canonry` capability and references; use Aero to orchestrate diagnosis and prioritization. Do not invent a separate Aero skill name when the installed capability is the `aero` skill plus its playbooks.

## Diagnose before changing

Before recommending a fix, classify the problem where possible as one or more of:

- technical defect
- deployment or production-parity defect
- indexing problem
- internal-link weakness
- search-intent or content gap
- entity, citation, or AEO weakness
- local-search weakness
- authority or backlink weakness

Do not rewrite content to compensate for a technical, deployment, indexing, markup, or production-parity problem. Verify the deployed output, canonical/indexability signals, structured data, sitemap/robots behavior, and relevant search evidence first. Distinguish a content gap from a page that exists but is not crawlable, indexed, or served consistently.

Prioritize measurable opportunities on existing pages before proposing net-new content. Give particular weight to pages with impressions, positions near page one, commercial value, declining performance, or existing AI visibility. A new page requires evidence of a distinct query/intent opportunity that existing pages cannot serve well.

Express final recommendations as:

`Problem → Evidence → Expected impact → Recommended change → Effort → Confidence → Verification method`

Preserve user intent and conversion usefulness. Avoid keyword stuffing. Do not add FAQ content or schema solely to improve an audit score; add it only when it accurately represents useful visible content and has a supported purpose. For content or UI recommendations, use the `impeccable` skill and `browser` skill when rendered UI verification is needed.

## Verification after SEO-impacting changes

After code or configuration changes that may affect SEO/AEO, require all applicable checks:

- local SEO/AEO verification, including build output and relevant technical/search checks;
- a successful site build;
- production/live verification after deployment, including production parity;
- a relevant Canonry recheck;
- comparison with the pre-change baseline.

Do not claim that a change worked without stating what was verified and over what comparison window. Preserve unrelated repository changes and modify only files necessary for the requested task.


## Portfolio SEO workflow (2026-09-18)

For scheduled SEO work and Notion/Cloud Agent handoffs, read `docs/seo/portfolio-flow.md` first. Matt extended the Codex-owned weekly article and handoff flow to this website on 2026-09-18. Follow its project-specific evidence, release gate, approval, acceptance-receipt and desktop/laptop single-owner rules. It supersedes older handoff language that equates merge with Done or treats the local lock as cross-machine. Preserve the client-specific facts, voice, privacy and verification rules above. This rollout does not authorize new paid collections or connected-account mutations.

## Shared agent operations and cross-device continuity

Start each task at Matt's [Notion Agent Hub](https://app.notion.com/p/3e0d49a32caf81cb9594ed656e08cb19), then read the relevant client/task, decisions, approval scope and handoff history. Notion is the shared storehouse for context, priorities, ownership and durable summaries. Do not leave important decisions only in a chat.

The private [AgentOperations repository](https://github.com/Pugh-Digital-Edge/AgentOperations) owns the versioned automation registry, common policies and explicit project enrollment. Read its README.md, projects.json and automation-registry.json when setting up or changing automation. Locate a verified checkout by Git remote on this device; never assume another computer's paths or app IDs. Review the source revision and reconcile through supported automation tools. Do not treat a Git pull or this instruction as permission to activate schedules.

Repository-specific instructions, factual/client constraints and release checks still apply. Notion owns coordination; Git owns executable definitions/code/acceptance receipts; Canonry owns measurement; HubSpot owns deals. Link evidence and record summaries in Notion rather than maintaining contradictory copies. If these sources conflict, report the discrepancy and preserve existing authorization and stronger safety gates.

Only projects and roles explicitly enrolled in AgentOperations may run that registry's website automations. Presence of this section does not enroll this project or authorize article publication, paid collection, account changes or new workers. RestoPros remains excluded from website automation; Miracle remains removed/paused. Existing PPC mutation and privacy rules remain in force.

Keep machine bindings, credentials, active locks, owner records and runtime state out of Git and OneDrive. One designated host owns a project's writers. Laptop imports stay paused until the old host is confirmed paused/idle and Matt explicitly transfers ownership. A local Git lock does not coordinate machines. Cloud Agents receive scoped briefs and make PRs only; they do not become article authors or publishers.

Use the linked Agent Exchange contract for authorized inter-agent handoffs. Verify exact project, message ID, approval revision and prior receipts before acting; do not duplicate a request or turn ACK into completion. Grok owns routine Fulfillment synchronization from Codex receipts. On completion/blockage, preserve an artifact link, verified result, owner and next checkpoint. If Notion or the private operations repository is unavailable, report that dependency; continue only independently authorized work that does not rely on missing approval or coordination.
