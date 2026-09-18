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

## Notion Fulfillment handoffs (Cloud Agent → Codex)

Approved work from Notion Fulfillment is implemented through `docs/seo/handoffs/`, not a parallel SEO publisher. Folder rules and the brief template live there; ownership is in `docs/seo/COHESION.md`. Notion mirrors execution status; `docs/seo/backlog.md` retains intervention hypotheses and measurement checkpoints — not two competing queues.

Lifecycle: `Ready → Implementing → PR review → Awaiting live verification → Measuring → Done`. Merge is not Done. Move briefs to `done/` only after live acceptance **and** required measurement. Closed-unmerged work is `cancelled/`. If fulfillment must close at live acceptance, label **Delivery complete** and keep a separately linked open measurement item. Grok updates Notion from Codex's acceptance receipt.

- **Scan:** `review/` waits for Matt's SEO gate. `pending/` is gate-satisfied filing, not a launch signal. `done/` is accepted-and-measured. `cancelled/` is closed unmerged.
- **Keep with Codex:** weekly article selection/drafting, substantive marketing prose, strategic prioritization, measurement interpretation, and learning. Briefs must not let the implementer change their own approval rules.
- **Cloud Agent:** implement the approved revision as a pull request only. Never merge. Good work is scoped technical fixes, components, accessibility, approved redirects/internal links, schema tied to visible content, and PPC/local landing-page structure using approved copy. Preserve existing copy or include an explicit copy diff. `npm run validate` cannot detect bland prose or invented claims. Live ad-budget/campaign changes, GBP edits, and connector config are separate workflows.
- **Codex:** discover and review handoff PRs (weekday discovery; coordinator bounded review after article delivery and urgent regressions). Before dispatch or merge, check active articles, existing-page work, open PRs, and measuring interventions. Validate the proposed merge against **current main** on the designated Codex checkout under the SEO lock; invalidate if either revision changes; refuse merge if the PR head moved. Codex remains the closed-loop owner of weekly articles, weekday health, monthly learning, **and** these releases.
- **Grok Bot:** launches Cloud Agents only after the SEO gate **and** launch dedup (repo + intervention ID + approved revision, with the Cloud Agent run and PR recorded before retries). `pending/` alone must never mean launch again. A timeout is reconciliation, not another launch. Does not compete on article publishing and does not merge.

SEO gate: Source Matt (or a Client request Matt confirmed) may launch when the gate is N/A or Approved. Source Canonry evidence or Competitive research must be Approved by Matt; those briefs start in `review/`, not `pending/`. Material scope changes invalidate approval.

Executable PR discovery (any signal identifies a **candidate**; none grants approval). Require the complete contract before merge:

- Label: `handoff`
- Title: `[handoff][SEO-###] Concrete change`
- Branch: `handoff/SEO-###-short-slug`
- PR body: stable ID, Notion URL, approved brief path/revision, evidence, scope, validation result

`scripts/seo-lock.mjs` coordinates linked worktrees on one clone. Cloud Agents work on isolated branches; one designated Codex checkout serializes main-branch releases. Parallel implementation is OK; overlapping releases need serialization.
