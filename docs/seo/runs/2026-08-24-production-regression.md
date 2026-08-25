# SEO/AEO Production Regression Check

## Run metadata

- Run date: 2026-08-24
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Current repository HEAD: `bab467b` (`origin/main` matches HEAD)
- Worktree state: eight modified service-page files and two untracked service components were present before this check; they were preserved and not edited.
- Previous known-good production baseline: [`2026-08-21-production-regression.md`](2026-08-21-production-regression.md), which recorded the deployed SEO-004/SEO-005 artifact against `e31b744`.
- Observed deployment identifier: no stable Netlify build ID was exposed. The live site contains the article committed in `bab467b`, so that commit is an observed source inference only, not a provider build-ID claim. Representative headers exposed `Server: Netlify`, `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT`, `Cache-Status: "Netlify Edge"; hit`, and request ID `01M0T7SQG68MQEX6XJEVCHH0XJ`.
- Workflows used: Canonry read-only technical/indexing/visibility checks; Aero regression-playbook guidance for comparable mention/citation transitions and cause ordering.
- Mutations not performed: Canonry sweep/probe/discovery, GSC/Bing sync or inspection, indexing or sitemap submission, deployment, CDN purge, connector/configuration change, or substantive source/content change.

## Outcome

No meaningful live production SEO/AEO regression was found on the checked live surface. The live deployment is healthy and has expanded from the prior 95-URL sitemap to 96 URLs by publishing `/resources/water-damage-restoration-marketing/`. The prior SEO-004 metadata and SEO-005 PPC-link interventions remain live.

A separate pre-deployment source/build parity risk was found: the dirty worktree rewrites eight service pages, and the resulting local `/services/ppc/` artifact omits the deployed contextual link to `/water-damage-restoration/ppc/`. This is classified as unpublished source-code/deployment drift, not a current production defect. No content rewrite or deployment action is recommended from this check.

## Baseline comparison

Compared with the 2026-08-21 known-good run:

- Live sitemap: 96 unique URLs and 96 `<lastmod>` values, up from 95; the added URL is `/resources/water-damage-restoration-marketing/`.
- Live page health: 96/96 sitemap URLs returned HTTP 200 and passed title, meta description, canonical, one-H1, JSON-LD, and primary-entity checks.
- Internal links: 98 unique same-origin HTML targets, all HTTP 200 with 0 broken targets and 0 redirects, versus 97 targets in the prior run.
- Exclusions remain correct: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `noindex, nofollow`, self-canonicals, and are absent from the live sitemap.
- The prior four SEO-004 pages still serve the reviewed `e31b744` metadata and remain indexable. The live generic PPC page still links to `/water-damage-restoration/ppc/`, and the specialist page links back.
- Local and live sitemap, sitemap-index, `robots.txt`, `llms.txt`, and `llms-full.txt` artifacts matched after line-ending normalization. The current local build and live sitemap both contain 96 URLs.

## Live production verification

### Indexability, metadata, headings, schema, and entity

- `sitemap-index.xml`: HTTP 200, `application/xml`, references the child sitemap.
- `sitemap-0.xml`: HTTP 200, `application/xml`, 96 unique URLs and 96 `<lastmod>` values.
- All 96 sitemap URLs had a title, meta description, one self-referencing canonical, exactly one H1, parseable JSON-LD, and the same primary LocalBusiness entity: `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`, URL `https://remediationrestorationmarketing.com`.
- No sitemap-listed URL exposed a `noindex` meta directive.
- `/resources/water-damage-restoration-marketing/`: HTTP 200, self-canonical, one H1, parseable JSON-LD, no `noindex`, and present in the sitemap.
- `/thank-you/`: HTTP 200, canonical to itself, `noindex, nofollow`, one H1, and absent from the sitemap.
- `/restoration-marketing/`: HTTP 200, canonical to itself, `noindex, nofollow`, one H1, and absent from the sitemap.
- Representative current metadata remained healthy on `/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, `/services/retargeting/`, `/services/web-design/`, and `/services/social-media-marketing/`.

### Internal links, redirects, and response behavior

- The live crawl found 98 unique same-origin HTML targets; every target returned HTTP 200, with no broken links and no redirects.
- `/services/ppc/` links to `/water-damage-restoration/ppc/`; the specialist page links back to `/services/ppc/`.
- `http://remediationrestorationmarketing.com/` → canonical HTTPS non-`www`, HTTP 301.
- `https://www.remediationrestorationmarketing.com/` → canonical HTTPS non-`www`, HTTP 301.
- `/sitemap.xml` → `/sitemap-index.xml`, HTTP 301.
- A deliberately nonexistent route returned HTTP 404.
- Representative HTML responses had no `X-Robots-Tag`; page-level meta controls the intended exclusions.
- Normal and `CanonryBot/1.0` response bodies were byte-identical on 11 representative routes, including the current article, both excluded routes, the four SEO-004 pages, `/services/ppc/`, `/schedule/`, and `/contact/`.

### Robots, sitemap, and AI access

- `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap all returned HTTP 200.
- `robots.txt` allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot; blocks CCBot; declares `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and references the sitemap index.
- Direct Markdown alternates returned HTTP 200 `text/markdown` for `/index.md`, `/services/ppc/index.md`, `/water-damage-restoration/ppc/index.md`, `/resources/index.md`, `/schedule/index.md`, and `/restoration-marketing/index.md`.
- `Accept: text/markdown` on representative HTML routes continues to return HTML; the advertised direct Markdown endpoints are healthy.

## Local build and production/source parity

- `npm run build` passed on current HEAD plus the pre-existing dirty worktree. It built 101 Astro pages, generated a 96-URL local sitemap, and completed the package postbuild hook.
- Independent `node scripts/postbuild-aeo.mjs` passed with exit code 0.
- The local `dist` contained 101 generated HTML pages; 96 are sitemap-listed by design.
- Local/live page signal comparison was clean for sitemap membership, title/description/canonical/indexability on the stable surface, but the eight dirty service-page rewrites differ from live in H1/schema/content output:
  - `/services/lead-tracking/`
  - `/services/ppc/`
  - `/services/reputation-management/`
  - `/services/retargeting/`
  - `/services/seo/`
  - `/services/social-media-advertising/`
  - `/services/social-media-marketing/`
  - `/services/web-design/`
- Seven of those local pages have a different JSON-LD block count from live; `/services/seo/` also has different local title and meta description. The differences are attributable to the uncommitted `ServiceHero`/`ServiceDepth` rewrite, not a live deployment regression.
- Local `/services/ppc/` has no contextual link to `/water-damage-restoration/ppc/`, while live does. If the dirty artifact were deployed unchanged, it could regress the approved SEO-005 internal-link intervention.
- Local build internal-link validation found 98 unique same-origin targets and no non-200 responses when checked against live.
- Existing non-blocking build warnings remain: stale Browserslist data, SVG `clip-rule` normalization messages, and duplicate SVG id `Star-1`; they did not fail the build or AEO validator.

## Canonry evidence

Read-only commands used included:

```text
cnry project show remediation-restoration-marketing --format json
cnry technical-aeo score remediation-restoration-marketing --format json
cnry technical-aeo trend remediation-restoration-marketing --format json
cnry google coverage remediation-restoration-marketing --format json
cnry google deindexed remediation-restoration-marketing --format json
cnry bing status remediation-restoration-marketing --format json
cnry bing coverage remediation-restoration-marketing --format json
cnry runs remediation-restoration-marketing --limit 10 --format json
cnry visibility-stats remediation-restoration-marketing --last-runs 5 --by-provider --format json
cnry overview remediation-restoration-marketing --format json
cnry analytics remediation-restoration-marketing --feature gaps --format json
cnry doctor --project remediation-restoration-marketing --format json
```

- Latest completed technical audit: `8341b64b-100f-49d8-8835-e8c27a91f446`, completed 2026-08-20, score 89/100, 97 pages audited, 0 skipped, 0 errored, flat versus the prior 89/100 audit.
- GSC stored read: 52 indexed / 47 not indexed / 0 deindexed across 99 stored URLs, last synced/inspected 2026-08-17. The old 95-URL reconciliation is stale relative to the current 96-URL live sitemap; no current 96-URL verdict is claimed.
- Bing connection/site access is healthy, but stored coverage remains a limited sample rather than a full-site result.
- Visibility remains 3 completed runs / 162 snapshots through 2026-08-10: 68 mentioned (41.98%) and 11 cited (6.79%). Mention and citation are kept separate. The fixed-basket run `14ee1d3c-8670-4a3a-9138-d36105e15a77` remains cancelled/non-comparable; no AI regression is declared.
- Doctor warnings remain for missing GSC sitemap-write scope, no GA4/server-side traffic/backlink source, low winnability coverage, and unconfigured GBP OAuth. These are measurement/integration limitations, not reproduced live-page defects.

## Findings and classification

### 1. Live production surface is clean

Problem → A production regression would be a degraded live technical, indexability, response, or comparable AEO signal.

Evidence → 96/96 sitemap URLs pass; 98/98 internal targets pass; metadata, canonicals, headings, JSON-LD/entity consistency, robots/AI access, redirects, 404 behavior, and crawler parity pass. The latest Canonry technical audit remains 89/100 with 0 errors.

Expected impact → No current live SEO/AEO loss is evidenced.

Recommended change → No source, content, deployment, indexing, or Canonry mutation in response to the live checks.

Effort → None.

Confidence → High for live technical production; Medium for search/AEO outcomes because stored measurement is stale.

Verification method → Repeat the live parity surface after any deployment and obtain comparable operator-approved GSC/Canonry measurements before claiming outcome changes.

Classification → No meaningful production regression.

### 2. Dirty service rewrite creates a pre-deployment parity risk

Problem → The current local artifact does not match the live artifact on eight service pages and omits the deployed generic-PPC-to-specialist contextual link.

Evidence → The worktree contains eight modified service pages plus new `ServiceHero.astro` and `ServiceDepth.astro`; local build output changes H1/schema/content and local `/services/ppc/` lacks the link that live exposes.

Expected impact → If deployed unchanged, the rewrite could change measured page intent/schema and weaken the approved SEO-005 internal-link path. No live impact is shown today.

Recommended change → Review the dirty rewrite and restore/retain the PPC contextual link before deployment; rerun full build/live parity after any approved deployment. Do not optimize the live site or rewrite additional content from this check.

Effort → Medium–High review and verification.

Confidence → High that the delta exists; Medium for eventual search impact.

Verification method → Deploy only an approved artifact, then compare all eight pages, internal links, sitemap membership, indexability, and the measured SEO-004/SEO-005 baseline.

Classification → Source-code/deployment parity risk, not a current production regression.

### 3. Article publication is live-verified, but approval and measurement remain pending

Problem → The water-damage marketing article is live in the sitemap, while SEO-006 still lacks retrospective operator approval and comparable post-publication measurement.

Evidence → The exact URL returns 200, self-canonical, one H1, parseable JSON-LD, no `noindex`, and is present in the 96-URL sitemap. The stale Canonry query read is not a post-publication outcome.

Expected impact → A distinct informational resource may improve query coverage, but no effect is claimed.

Recommended change → Obtain retrospective approval for SEO-006, then measure the query/page window. Do not run a sweep or make content changes without approval.

Effort → Low for review; Medium if revision is requested.

Confidence → Medium.

Verification method → Approval record, comparable GSC query/page window, and later operator-approved fixed-basket Canonry sweep with Mention Coverage/Share separate from Citation Coverage.

Classification → Publication-control and measurement pending; not a demonstrated regression.

### 4. Stored indexing and AI visibility data are unavailable for current regression claims

Problem → Canonry GSC and visibility data do not cover the current live state with a fresh comparable window.

Evidence → GSC last read is 2026-08-17 and predates the 96-URL sitemap; latest visibility data is 2026-08-10, and the newer fixed-basket attempt was cancelled/non-comparable.

Expected impact → Avoids false indexing, mention, or citation-loss claims.

Recommended change → Keep SEO-002 and SEO-003 as measurement items. Obtain explicit operator confirmation before any sync, inspection, sweep, probe, or submission.

Effort → Operator-dependent.

Confidence → High that current outcome claims are unsupported.

Verification method → Fresh URL-level GSC/Bing reads and one unchanged fixed-basket Canonry run, with separate mention and citation denominators.

Classification → Indexing/AEO measurement pending, not a confirmed regression.

## Backlog reconciliation

- SEO-001 remains `Measuring`: live surface clean; the eight-page dirty source delta is recorded as pre-deployment parity risk. No duplicate ID created.
- SEO-002 remains `Measuring`: stored GSC coverage is stale relative to the current 96-URL sitemap; no sync or indexing action was run.
- SEO-003 remains `Measuring`: no comparable visibility run; no mention or citation regression declared.
- SEO-004 remains `Measuring`: the four measured pages remain live on the `e31b744` artifact; the dirty retargeting/social-media rewrite is not included in the measurement window unless later deployed.
- SEO-005 remains `Measuring`: live contextual PPC links pass; local dirty build omits one approved link and must be reviewed before deployment.
- SEO-006 remains `In Progress` with retrospective approval pending: the article is now live-verified, but no publication outcome is claimed.
- No new backlog IDs or duplicate records were created.

## Verification status and limitations

- Live verification: complete for the current 96-URL sitemap, page signals, excluded routes, internal links, redirects, robots, AI access files, Markdown alternates, crawler parity, headers, and 404 behavior.
- Local/build verification: `npm run build` passed; independent `node scripts/postbuild-aeo.mjs` passed; local internal-link checks passed.
- Production/source/build parity: clean for the current sitemap and AI-access artifacts; not clean for the eight uncommitted service-page rewrites by design. This is recorded as a pre-deployment risk.
- Canonry: read/check commands completed; technical audit is current through 2026-08-20, while GSC/Bing/visibility outcome reads are stale or partial.
- No deployment, CDN purge, indexing request, sitemap submission, GSC/Bing sync, Canonry sweep/probe/discovery, or connector mutation was performed.
- Pending operator-confirmed actions: approve or reject SEO-006 retrospectively; review the dirty service rewrite and PPC contextual link before deployment; authorize fresh GSC/Bing inspection and/or the fixed-basket Canonry sweep if current measurement is required.
