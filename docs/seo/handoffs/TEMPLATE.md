# Handoff brief

Copy this file into `pending/` (SEO gate already satisfied) or `review/` (waiting for Matt). See [README.md](README.md). Folder placement is not a launch signal and is not Done.

Material scope changes invalidate this approval. File a new brief revision and re-approve. This brief must not let the implementer change its own approval rules, allowed files, URLs, exclusions, or acceptance criteria.

## Identity and approval

- Stable intervention ID: `SEO-###` (reuse the existing `docs/seo/backlog.md` ID when this overlaps an open intervention)
- Brief revision:
- Notion URL:
- Approval reference:
- Approval date:
- Repo: `Pugh-Digital-Edge/RnRMarketing`
- Client:
- Source: Matt | Client request | Canonry evidence | Competitive research | Internal ops
- SEO gate: N/A | Needs review | Approved | Rejected
- Matt confirmed: yes | no | n/a
- Notion status: Ready | Implementing | PR review | Awaiting live verification | Measuring | Done | Cancelled | Delivery complete
- Evidence links:

## Allowed scope

- Allowed files:
- Allowed URLs:
- Exclusions:
- Acceptance criteria:

## Measurement

Required fields from [`../pipeline.md`](../pipeline.md). Codex checks active articles, existing-page work, open PRs, and measuring interventions before dispatch or merge.

- Classification:
- Dated baseline (date / window):
- Query / URL cohort:
- Hypothesis:
- Expected impact:
- Effort:
- Confidence:
- Accepted live date:
- Measurement due date:
- Verification method:

## Goal

What should change, for whom, and why. Stay inside this approved revision.

## Constraints

- Cloud Agent: PR only — never merge.
- Keep with Codex: weekly article selection/drafting, substantive marketing prose, strategic prioritization, measurement interpretation, and learning.
- Good Cloud Agent work: scoped technical fixes, components, accessibility, approved redirects/internal links, schema tied to visible content, PPC/local landing-page structure using **approved copy**.
- Preserve existing copy, or include an explicit copy diff. `npm run validate` cannot detect bland prose or invented claims.
- Live ad-budget/campaign changes, GBP edits, and connector config are separate workflows — not this brief.
- Do not expand the weekly article quota or rewrite `docs/seo` control-plane records unless this brief says to.
- Do not change this brief's approval rules or scope.

## Launch record

Deduplicate by repo + intervention ID + approved revision. Record the Cloud Agent run and PR **before** any retry. A timeout is reconciliation, not another launch. `pending/` alone must never mean launch again.

- Cloud Agent run:
- PR:

## Executable PR signals

- Label: `handoff`
- Title: `[handoff][SEO-###] Concrete change`
- Branch: `handoff/SEO-###-short-slug`
- Body: stable ID, Notion URL, this brief path/revision, evidence, scope, validation result

## Done when

- [ ] PR opened from this brief using the executable signals
- [ ] Codex reviewed against current main, validated, merged, and accepted live
- [ ] Required measurement completed (or fulfillment closed as Delivery complete with a separately linked open measurement item)
- [ ] Brief moved to `docs/seo/handoffs/done/` only after acceptance **and** required measurement
- [ ] Grok updated Notion from Codex's acceptance receipt
