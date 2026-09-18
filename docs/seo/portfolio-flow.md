# Remediation & Restoration Marketing: portfolio SEO operating contract

- Repo: Pugh-Digital-Edge/RnRMarketing
- Site: https://remediationrestorationmarketing.com/
- Canonry project: remediation-restoration-marketing
- Canonry primary: https://canonry.remediationrestorationmarketing.com
- Notion client: https://app.notion.com/p/3dfd49a32caf81fab5f6d5ce7a5b2719
- Fulfillment: https://app.notion.com/p/cfc797444a604b00a23bed31534824c7
- Local release gate: npm run validate. Also perform scoped content/render checks and applicable live verification; never call an absent npm script.
- Editorial context: B2B restoration marketing for business owners; preserve Matt Pugh authorship, no consumer remediation guidance.

## Portfolio scope and authority

Matt requested this workflow for active/internal Notion website projects on 2026-09-18. Included: RnRMarketing, FirstResponseRestoration, MoldHunters, KaylaPughAstro, KristyHicksAstro, TwoEaglesRestoration. RestoPros is explicitly excluded. Miracle Restoration is churned/removed and stays paused. This rollout authorizes workflow setup and one evidence-qualified weekly article per included website, with the bounded article implementation below. It does not approve paid campaigns, account changes, new provider sweeps, indexing submissions, or unrelated site redesigns.

This file is the current portfolio handoff/automation contract. Preserve client-specific AGENTS.md rules and existing stronger technical checks. RnRMarketing's pipeline.md retains its specific collection/repair authority; never copy its 42-query basket, GA4 property, historical IDs or repair permissions to another client.

## Ownership and machine handover

Codex owns topic selection, substantive prose, prioritization, review/merge, live acceptance, measurement and learning. Grok owns hosted Canonry infrastructure, Cloud Agent dispatch and Notion synchronization. Cloud Agents implement tightly scoped technical/structural work on isolated branches, PR only. No weekly articles, marketing rewrites, self-approval, merge or publication in that lane.

Only one desktop/laptop clone is the active writer for this project. Local owner record: resolve git rev-parse --git-common-dir and read seo-execution-owner.json. Require its host and checkout to match this machine before scheduled writes/builds/releases. Missing/mismatched owner record means read-only work and a clear blocker. This file is an operational designation, not a distributed lock.

To transfer: pause all three old-host writer schedules; verify any in-flight jobs ended and released locks; push/reconcile focused records; record old host pause/idle confirmation; synchronize the new checkout; explicitly designate the new host and create its owner record; activate only its three jobs. Keep laptop imports paused until this completes. Reverse the process when returning. OneDrive, Notion fields, and a sleeping machine do not provide atomic cross-host ownership.

Before repo writes, builds or commits, acquire node scripts/seo-lock.mjs acquire <unique-owner>. Require acquired:true. Busy means no writes/builds; bounded retries, at most ten 30-second attempts, then defer. Never steal old locks. Release the identical token in finally. This lock coordinates linked worktrees of one clone only. Preserve unrelated dirty files and never stage a whole checkout.

## Three jobs, one weekly obligation

- Weekly coordinator: Monday delivery; Wednesday/Friday resume the same incomplete article, verify deployment and measure due work. Exactly one new article per Monday-Sunday America/New_York week, not one per invocation. A live article from another authorized task counts. Keep up to two evidence-supported reserve briefs. The old separate opportunity job is paused; opportunity ranking now belongs here.
- Weekday health: lightweight production checks, handoff PR discovery, live acceptance and due measurement. No routine content rewrites or merges. Preserve existing site-specific verification behavior; do not invent scripts that the repo lacks.
- Monthly learning: synthesize measured outcomes, reconcile backlog and strategy when warranted. No routine article, dispatch, merge or additional measurement collection.
- Quiet unchanged/non-actionable runs; report article delivery, meaningful regressions, failed scheduled obligations, completed measurements or user decisions. Local jobs require an awake computer and running app. Eastern week accounting applies when traveling.

## Evidence and editorial rules

Read current Canonry project data, AGENTS.md, this contract, strategy/backlog/learnings, recent runs, relevant approved Notion briefs and current PRs. Use installed Canonry and Aero skills; prefer stored GSC/Bing evidence, then technical/visibility evidence, then site structure and analytics. Missing/null/stale evidence is unavailable, not zero. Preserve mention coverage/share separately from citation coverage, with dates, provider/query cohorts and denominators.

Confirmed client questions, objections and approved Notion research can inform topic selection; task existence is not evidence of search demand. Diagnose technical, deployment, indexing, internal-link, content/intent, entity/AEO, local or authority problems before prescribing content. Prioritize measurable existing-page opportunities separately from the weekly article. Do not write an article to compensate for a broken deployment.

Weekly article authority: select an eligible stable backlog ID (or create one), record Auto-approved by weekly article automation with dated evidence, research, draft, review, generate one accurate cover, validate, focused commit/push, and verify live. No separate weekly approval required. No extra articles on recovery days. Resume existing drafts. If evidence is wholly unavailable, claims cannot be supported, coverage is duplicative, image QA fails, or safe validation/release is blocked, preserve work and record the exact owner/next checkpoint. Notify if the weekly obligation remains unresolved Friday.

Use the site's own audience, author, article/frontmatter/layout and voice. Never propagate Matt Pugh authorship or RRM's B2B positioning to clients. Ground material medical, safety, insurance, financial and legal claims in current primary sources; do not fabricate prices, leads, credentials, ratings, guarantees or client outcomes. No body images. Inspect FAQ rendering; add FAQ content only if useful, with at most one visible block and one matching schema source. No score-only FAQ padding. Image objects/actions must match the precise subject.

## Approval and dispatch contract

Notion Fulfillment mirrors status; docs/seo/backlog.md owns hypotheses/checkpoints; Canonry owns measurement. Match this client's Notion row, domain, repository and Canonry project before acting.

Handoff approval: Matt requests or Matt-confirmed client/internal requests require attributable bounded scope; Source is not an unlimited authorization. Canonry-evidence/competitive-research briefs require Matt approval of the exact revision. Drafts stay review/; approved briefs use pending/. Scope changes invalidate approval. Unavailable or conflicting approval evidence blocks dispatch/merge, not read-only work.

Deduplication key: repository + intervention ID + approved revision. Grok records a launch claim before dispatch and the returned Cloud Agent run ID/PR as soon as known. On timeout reconcile external state; never treat a missing ID as permission to launch again. A single dispatcher or atomic external claim is required; Notion read-then-write alone is not mutual exclusion. Check overlapping articles, backlog IDs, active PRs and measuring cohorts. A pending file or new label never triggers a second launch.

Good Cloud Agent work: approved components, accessibility, redirects/internal links, schema reflecting visible content, PPC/local page structure with approved copy. Preserve prose or show explicit copy diff. Paid-account, GBP and connector changes use separately authorized workflows.

## PR discovery and review

Discover candidates from any of: handoff label, [handoff][SEO-###] title, handoff/SEO-###-slug branch, handoff brief path, or known implementation origin. Match repository first. Require the complete contract before merge: stable ID, Notion URL, approved brief revision/reference/date, allowed files/URLs, exclusions, acceptance criteria, evidence and validation.

Coordinator reviews at most one eligible handoff per checkpoint after article delivery is secured and urgent regressions are handled. Validate a clean proposed merge against current main under the local lock. Record base and head; if either changes, invalidate validation. Guard merge against head changes. Never approve the implementer's own scope expansion. Do not merge PR #2 in RnRMarketing merely because it provided reference material for this rollout; it still needs its own release review.

## Delivery, acceptance and learning

Ready -> Implementing -> PR review -> Awaiting live verification -> Measuring -> Done.
Merge is not Done. Verify exact live URLs, HTTP status, canonical/robots, sitemap, rendered schema, relevant links and source/live parity. Where the repo emits build-info, verify the deployed revision. Otherwise use available hosting receipt plus affected output comparison and state revision-proof limitations. Bound deployment waiting to ten attempts over ten minutes; retain Awaiting live verification if delayed.

Create a dated committed acceptance receipt with repo, ID, approved revision, PR/head/merge commit, live revision or its limitation, accepted-live timestamp, checks/results, baseline/cohort, measurement window/due date, next checkpoint and disposition. Grok stores its Git URL in Notion Acceptance receipt and updates Notion; Codex does not introduce a competing routine status writer.

Live acceptance may be Delivery complete with a separately linked open measurement item. Done and handoffs/done/ require accepted delivery plus required measurement, or an explicitly justified measurement-not-applicable disposition for non-SEO work. Closed-unmerged is Cancelled/cancelled/. Incomplete data stays Measuring. Compare equal windows on the same cohort and disclose confounders; do not equate deployment, audit scores or accepted indexing requests with search impact.

No new paid/quota-consuming collection or connection/account changes from this rollout. Read native collection history before proposing work. Use relevant scheduled Canonry rechecks or separately bounded authorization; report stale/missing evidence and required next action. Monthly learning uses completed measurements, not an invented measurement database.
