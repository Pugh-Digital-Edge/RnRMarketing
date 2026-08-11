# SEO Run

## Run Metadata

- Date: 2026-08-10
- Run type: initial operating-system setup / weekly opportunity baseline
- Production URL/environment: https://remediationrestorationmarketing.com/ (live production checked)
- Commit/deployment identifier: repository HEAD `068d543`; deployment identifier unavailable
- Canonry/Aero workflows used: Canonry new-client-baseline guidance; Aero orchestration weekly-review and content-gap guidance; no new quota-consuming sweep run
- Data sources used: repository source and existing docs; local build artifacts; live HTTP checks; existing Canonry technical audit and GSC coverage evidence documented in `docs/CANONRY-AUDIT-PLAN-2026-08-10.md`

## Baseline

- Existing completed technical audit: run `d519ac38-b993-403b-b929-7066103e0723`; 91 discovered/audited, aggregate 55/100, with 50 pages at 28/100.
- Existing synced index coverage: 43 indexed and 51 not indexed of 94 (45.7% indexed); aggregate reason recorded as `URL is unknown to Google`.
- Existing historical visibility evidence: 83% query-level Mention Coverage, 42% Citation Coverage, and 86% Mention Share for the adopted 12-query basket. A visibility run was incomplete when the prior plan was written and is excluded from the current baseline.
- Live checks on 2026-08-10: homepage, robots, sitemap index, and sitemap child returned 200; live HTML exposed canonical, Markdown alternate, JSON-LD/AI-file links; sitemap child contained 91 URLs with lastmod values.
- Source/build context: Astro site; `npm run build` is the required local verification command. Existing working-tree changes are preserved and not attributed to this run.

## Findings

1. Canonry’s 28-point cluster conflicts with direct live/source evidence on representative routes.
2. Index coverage is materially incomplete and requires URL-level verdict classification.
3. Visibility evidence is not fresh enough to claim post-remediation movement; mention and citation must remain separate.
4. The repository had no durable `docs/seo/` operating memory, so prior plans were not connected to a current backlog/run history.

## Diagnosis

- Finding 1: deployment / production parity or crawler-response discrepancy first; do not assume a content defect.
- Finding 2: indexing problem, pending URL-level diagnosis.
- Finding 3: measurement gap; not a ranking or AEO regression claim.
- Finding 4: process/documentation defect.

## Opportunities

- Resolve measurement/parity discrepancy before changing 50 pages. This outranks content expansion because it affects diagnosis of every downstream opportunity.
- Classify and improve the 51 not-indexed URLs after parity is stable.
- Run a confirmed visibility sweep using the existing query basket after the deployment baseline is trustworthy.
- Improve only verified weak templates with page-specific visible content and matching schema.
- Deferred: net-new content, backlinks, and broad citation campaigns because no distinct measured opportunity was established in this run.

## Prioritized Plan

See [`../backlog.md`](../backlog.md) for stable IDs. The order is SEO-001 parity, SEO-002 indexing, SEO-003 visibility baseline, then SEO-004 page-specific content.

## Changes Since Previous Run

- New findings: no new search-performance or AI-visibility findings were generated; the current run formalizes existing evidence.
- Resolved findings: none claimed.
- Improved findings: none claimed in production.
- Worsened findings: none established.
- Unchanged: the 28-point audit cluster, incomplete index coverage, and incomplete fresh visibility baseline remain open.

## Actions Taken

- Created `docs/seo/README.md`, `strategy.md`, `backlog.md`, `learnings.md`, and this dated run record.
- Reconciled existing Canonry remediation plans into stable backlog items without marking unimplemented recommendations as complete.
- Did not run a real Canonry sweep, request indexing, deploy, purge CDN, or modify site content.

## Verification

- Live production: homepage, robots.txt, sitemap-index.xml, and sitemap-0.xml returned HTTP 200 during this run.
- Source/build verification: `npm run build` passed on 2026-08-10; Astro built 99 pages and generated the sitemap. The build emitted existing non-blocking Browserslist/SVG optimizer warnings but exited 0.
- Production Canonry recheck: pending; requires parity investigation and operator-approved quota-consuming run.
- Before/after search or AI comparison: not available; no causal result claimed.

## Follow-Up

- Run the local build and post-build AEO validator.
- Perform normal-vs-Canonry-vs-Markdown response comparison for representative routes and compare with local `dist/`.
- After deployment/parity is confirmed, obtain operator approval for a real visibility sweep and refresh technical/index coverage evidence.
- Reconcile the backlog against the next dated run; promote learnings only after comparable production evidence exists.
