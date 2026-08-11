# SEO/AEO Operating System

This directory is the durable record for SEO and answer-engine optimization work on Remediation & Restoration Marketing.

## Operating loop

`Measure → Diagnose → Prioritize → Improve → Deploy → Verify → Measure → Learn`

Every substantive run must read the current strategy, backlog, learnings, and recent run records before making recommendations. Findings must be evidence-backed and opportunity-ranked. Existing pages with measurable search, indexing, visibility, or conversion opportunity take priority over net-new content.

## Evidence rules

- Canonry is the source of truth for project-scoped AEO state. Use the `remediation-restoration-marketing` project.
- Read mention coverage and mention share before citation coverage. These are independent signals.
- Do not fabricate or infer missing Google Search Console, Bing, analytics, or AI visibility measurements.
- Distinguish source, local build, and production evidence. A production mismatch is a deployment/parity problem first.
- Do not run quota-consuming Canonry sweeps without explicit operator confirmation. Use existing completed runs for baselines and probes only for investigation.

## Documents

- [`strategy.md`](strategy.md) — durable business, measurement, and prioritization context.
- [`backlog.md`](backlog.md) — current actionable work with stable IDs and statuses.
- [`learnings.md`](learnings.md) — conclusions promoted only after before/after evidence.
- [`runs/`](runs/) — dated, append-only run records.

## Recommendation format

Each substantive recommendation records: Problem, Evidence, Expected impact, Recommended change, Effort, Confidence, and Verification method.

## Verification gate

SEO-impacting code changes require local build and technical checks, production verification after deployment, a relevant Canonry recheck, and comparison with the pre-change baseline. A source-only success is not a production result.
