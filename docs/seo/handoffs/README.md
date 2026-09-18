# SEO handoff briefs

Approved Notion Fulfillment work becomes a pull request through this folder, then Codex reviews, merges, accepts live, and measures. This is the same closed-loop SEO brain documented in [`../COHESION.md`](../COHESION.md) — not a parallel publisher.

Copy [`TEMPLATE.md`](TEMPLATE.md) into the correct folder below. Point the Notion row's **Codex brief path** at that file. Do not invent extra Notion IDs in the repo; the Notion URL on the brief is the durable pointer. Reuse the existing `docs/seo/backlog.md` intervention ID when the work overlaps.

Notion **mirrors execution status**. The backlog retains intervention hypotheses and measurement checkpoints. These folders are filing locations, not a second queue and not a launch signal.

## Folders

| Folder | Meaning | Who acts |
| --- | --- | --- |
| [`pending/`](pending/) | SEO gate already satisfied. Brief may be Ready through Measuring. | Implementers may work a **Ready** brief only after the launch contract. Folder presence is not permission to launch again. |
| [`review/`](review/) | Waiting for Matt's SEO gate. | Not actionable for implementers. Grok Bot does not launch. |
| [`done/`](done/) | Codex accepted live **and** required measurement finished. | Do not re-implement unless a new approved revision is filed. |
| [`cancelled/`](cancelled/) | Closed without merge. | Do not re-implement unless a new brief is filed. |

Suggested filename: `YYYY-MM-DD-SEO-###-short-slug.md`.

## Lifecycle (merge is not Done)

`Ready → Implementing → PR review → Awaiting live verification → Measuring → Done`

- Cloud Agents implement **Ready** briefs as PRs. Status then becomes **Implementing**, then **PR review**.
- Codex merge ships source. Status becomes **Awaiting live verification**, not Done.
- Codex records an **acceptance receipt** when the live artifact matches. Grok updates Notion from that receipt.
- **Measuring** uses the backlog checkpoint. Move the brief into `done/` only after acceptance **and** required measurement.
- If fulfillment must close at live acceptance, label Notion **Delivery complete** and keep a separately linked open measurement item. Do not file that brief under `done/` until measurement finishes.
- Closed-unmerged work is **Cancelled**; move the brief to `cancelled/`.

## SEO gate and launch contract (before any Cloud Agent)

Launch a Cloud Agent only when Notion status is **Ready**, the brief is in **`pending/`**, Source matches the gate table in [`../COHESION.md`](../COHESION.md), **and** the approval is bound to an identifiable scope (stable intervention ID, Notion URL, brief revision, approval reference/date, allowed files and URLs, exclusions, acceptance criteria).

- **Matt** (or **Client request** that Matt confirmed): SEO gate is **N/A** or **Approved**.
- **Canonry evidence** or **Competitive research**: SEO gate must be **Approved** by Matt. Those briefs **start in `review/`**, not `pending/`. After approval, move the file to `pending/` before launch.
- **Internal ops**: same as Client request (Matt confirmed, gate N/A or Approved). Keep in `review/` until that is true.
- Never launch while the gate is **Needs review** or **Rejected**.
- Material scope changes invalidate approval; file a new brief revision and re-approve.
- The brief must not let the implementer change its own approval rules.

### Launch deduplication

Deduplicate launches by **repo + intervention ID + approved revision**. Record the Cloud Agent run and PR on the brief **before** any retry. A timeout is **reconciliation**, not another launch. `pending/` alone must never mean launch again.

## Lock and isolated branches

`scripts/seo-lock.mjs` stores the lock in the **local Git common directory**. It coordinates **linked worktrees on that clone**, not independent Cloud Agent clones, a laptop, or the VPS.

- Cloud Agents work on **isolated branches**. Parallel implementation is OK.
- One designated **Codex checkout** serializes **main-branch releases** under the existing lock. Overlapping releases need serialization.
- Codex validates the proposed merge against **current main**. Invalid if either revision changes. Guard merge against a changed PR head.

Cloud Agents do not acquire that lock to coordinate with Codex; it cannot see their clones. They still must not merge.

## Executable PR discovery

Search using **any** of these signals. Labels and author identify **candidates** — they do not grant approval. Require the **complete contract** before merge.

| Signal | Value |
| --- | --- |
| Label | `handoff` |
| Title | `[handoff][SEO-###] Concrete change` |
| Branch | `handoff/SEO-###-short-slug` |
| PR body | Stable ID, Notion URL, approved brief path/revision, evidence, scope, validation result |

Weekday production automation **discovers** these PRs. The weekly coordinator does **bounded review** after this week's article is secured and after urgent regression handling. See [`../pipeline.md`](../pipeline.md).

## Roles

- **Cloud Agent:** implement the approved revision as a PR only. Never merge. Keep weekly article selection/drafting, substantive marketing prose, strategic prioritization, measurement interpretation, and learning with Codex. Good work is scoped technical fixes, components, accessibility, approved redirects/internal links, schema tied to visible content, and PPC/local landing-page structure using approved copy. Preserve existing copy or include an explicit copy diff. `npm run validate` cannot detect bland prose or invented claims. Live ad-budget/campaign changes, GBP edits, and connector config are separate workflows. Use the executable PR signals. Do not change the brief's approval rules.
- **Codex:** weekly articles, weekday health, monthly learning, **and** review/merge/live acceptance of these PRs on the designated checkout (lock + `npm run validate` against current main). Before dispatch or merge, check active articles, existing-page work, open PRs, and measuring interventions. A handoff PR is bounded review-to-merge work, not a second weekly-article run.
- **Grok Bot:** hosted Canonry spine, Notion ops, launch **only after** the SEO gate and launch-dedup contract, and Notion updates from Codex's acceptance receipt. Does not compete on article publishing and does not merge.

## After live acceptance

1. Codex merge is a ship-to-hosting signal, not Done. Status is **Awaiting live verification** until the acceptance receipt.
2. Grok updates Notion from that receipt (PR link, run, accepted live date).
3. Brief file stays out of `done/` until required measurement finishes (or sits with a linked open measurement item if fulfillment closed as **Delivery complete**).
4. Cancelled (closed unmerged) briefs belong in `cancelled/`.
