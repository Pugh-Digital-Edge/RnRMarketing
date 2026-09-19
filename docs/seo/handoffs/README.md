# SEO handoff briefs

Approved Notion Fulfillment work becomes a pull request through this folder, then Codex reviews and merges. This is the same closed-loop SEO brain documented in [`../COHESION.md`](../COHESION.md) — not a parallel publisher.

Copy [`TEMPLATE.md`](TEMPLATE.md) into the correct folder below. Point the Notion row's **Codex brief path** at that file. Do not invent extra Notion IDs in the repo; the Notion URL on the brief is the durable pointer.

## Folders

| Folder | Meaning | Who acts |
| --- | --- | --- |
| [`pending/`](pending/) | Gate already satisfied. Actionable for implementers. | Grok Bot may launch a Cloud Agent. Cloud Agents implement as a PR. |
| [`review/`](review/) | Waiting for Matt's SEO gate. | Not actionable for implementers. Grok Bot does not launch. |
| [`done/`](done/) | Merged (or closed without merge). Historical. | Do not re-implement unless a new brief is filed. |

When scanning this tree, **only `pending/` is actionable for implementers**. `review/` waits for Matt. After Codex merges, move the brief into `done/` (the implementing PR may include that move).

Suggested filename: `YYYY-MM-DD-short-slug.md`.

## SEO gate (before any Cloud Agent)

Launch a Cloud Agent only when Notion status is **Ready**, the brief is in **`pending/`**, and Source matches:

- **Matt** (or **Client request** that Matt confirmed): SEO gate is **N/A** or **Approved** → may kick.
- **Canonry evidence** or **Competitive research**: SEO gate must be **Approved** by Matt. Those briefs **start in `review/`**, not `pending/`. After approval, move the file to `pending/` before launch.
- **Internal ops**: same as Client request (Matt confirmed, gate N/A or Approved). Keep in `review/` until that is true.

Never launch while the gate is **Needs review** or **Rejected**.

## Roles

- **Cloud Agent:** implement the pending brief as a PR only. Never merge. Never auto-publish articles outside the brief. Acquire the shared SEO lock. Label the PR `handoff` and link this brief path.
- **Codex:** weekly articles, weekday health, monthly learning, **and** review/merge of these PRs (lock + `npm run validate`). A handoff PR is review-to-merge work, not a second weekly-article run.
- **Grok Bot:** hosted Canonry spine, Notion ops, and Cloud Agent launch **only after** the SEO gate. Does not compete on article publishing and does not merge.

## After merge

1. Codex merge is the ship signal (validate + SEO lock passed).
2. Brief file belongs in `done/`.
3. Notion Fulfillment status → Done, with the PR link.
