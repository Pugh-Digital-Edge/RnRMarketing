# SEO/AEO Production Regression Check

## Run metadata

- Date: 2026-08-17
- Live environment: https://remediationrestorationmarketing.com/
- Live check time: approximately 2026-08-17 12:18 EDT / 16:18 UTC
- Repository HEAD: `ad9e29b` (`Remove border and outline from contact form card`)
- Run type: closed-loop SEO/AEO production regression check
- Canonry project: `remediation-restoration-marketing`
- Workflows used: Aero regression-playbook detection/triage/diagnosis guidance; Canonry technical AEO, indexing, visibility, and integration read/check guidance
- Mutations intentionally not performed: Canonry sweep or probe, technical audit rerun, GSC/Bing sync or indexing submission, sitemap submission, deployment, CDN purge, or substantive site content/code change

## Outcome

No meaningful SEO/AEO production regression was found. The known-good parity state remains live: sitemap membership, indexability signals, metadata, canonical URLs, JSON-LD/entity consistency, internal links, redirects, AI access files, crawler parity, and representative recently affected routes all remain healthy. The stored Canonry technical baseline remains 89/100 with 97 audited pages and 0 errors. GSC and AI visibility measurements remain stale stored reads, so no new mention/citation regression is declared.

## Baseline comparison

Compared with [`2026-08-14-production-regression.md`](2026-08-14-production-regression.md) and the stored Canonry audit `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`:

- Live sitemap remains 95 unique URLs with 95 `<lastmod>` values; `/thank-you/` remains excluded.
- All 95 sitemap URLs still return HTTP 200 with the expected SEO/AEO signal set.
- `/thank-you/` remains HTTP 200, canonical to itself, and `noindex, nofollow`.
- The 2026-08-13 Canonry technical audit remains the latest completed audit: 89/100, 99 discovered, 97 audited, 0 skipped, 0 errored, up from the stale 55/100 baseline.
- Stored GSC coverage remains 48 indexed / 47 not indexed of 95 (50.5%), all 47 grouped as `URL is unknown to Google`, last inspected/synced 2026-08-10.
- Stored visibility remains 3 completed runs / 162 snapshots: 68 mentioned (41.98%) and 11 cited (6.79%), with the latest observations on 2026-08-10. This is not a fresh comparable window.
- The latest commits affecting the checked surface include the schedule/landing-page changes in `48de367`, thank-you conversion tracking in `922002c`, and contact styling in `ad9e29b`; `/schedule/`, `/contact/`, and `/thank-you/` were included in current build/live parity checks.

## Live production verification

### Sitemap, indexability, metadata, and entity signals

- `https://remediationrestorationmarketing.com/sitemap-index.xml`: HTTP 200, `application/xml`; references the child sitemap.
- `https://remediationrestorationmarketing.com/sitemap-0.xml`: HTTP 200, `application/xml`; 95 unique URLs and 95 `<lastmod>` values.
- All 95 sitemap URLs returned HTTP 200 and HTML content.
- All 95 pages had a title, meta description, exactly one self-referencing canonical, exactly one H1, and parseable JSON-LD.
- All 95 pages exposed the same primary LocalBusiness entity: `@id` `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`, URL `https://remediationrestorationmarketing.com`.
- No sitemap-listed page exposed `noindex`.
- `/thank-you/` returned HTTP 200 with canonical `https://remediationrestorationmarketing.com/thank-you/` and `noindex, nofollow`; it was absent from the live sitemap.

### Internal links, redirects, and response behavior

- 240 unique same-origin HTML link targets were discovered across the 95 sitemap pages.
- All 240 targets returned HTTP 200; 0 broken targets and 0 redirects.
- No remaining internal `/services` or `/resources` non-trailing-slash targets were found in source or `dist`.
- HTTP canonical-origin redirect: `http://remediationrestorationmarketing.com/` → HTTPS non-`www`, HTTP 301.
- `https://www.remediationrestorationmarketing.com/` → HTTPS non-`www`, HTTP 301.
- `/sitemap.xml` → `/sitemap-index.xml`, HTTP 301.
- Deliberately nonexistent URL returned HTTP 404.
- Sample production headers identify Netlify delivery; representative HTML was cache-served with `cache-control: public,max-age=0,must-revalidate`.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/sitemap-index.xml`, and `/sitemap-0.xml` returned HTTP 200.
- `robots.txt` contains the expected GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot, and CCBot directives; it blocks CCBot, allows the other checked crawlers, declares `Content-Signal: search=yes, ai-input=yes, ai-train=no`, and references the sitemap.
- Normal and `CanonryBot/1.0` responses were byte-identical on `/`, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, `/resources/`, `/schedule/`, and `/thank-you/`.
- Advertised Markdown alternates returned HTTP 200 with `text/markdown` for `/index.md`, `/services/ppc/index.md`, `/water-damage-restoration/ppc/index.md`, `/resources/index.md`, and `/schedule/index.md`.
- `Accept: text/markdown` was used for the alternate checks; the primary HTML routes remain HTML responses.

## Local build and production/source parity

- `npm run build` passed. It built 99 Astro pages, generated the 95-URL sitemap, and ran `scripts/postbuild-aeo.mjs`.
- `node scripts/postbuild-aeo.mjs` passed independently.
- The build emitted existing non-blocking Browserslist staleness, SVG `clip-rule`, and duplicate SVG id `Star-1` warnings; none failed the build or AEO validator.
- Local `dist/sitemap-0.xml` contains 95 URLs and 95 `<lastmod>` values and excludes `/thank-you/`; local `dist/thank-you/index.html` contains `noindex, nofollow`.
- Local `dist` contains 99 generated HTML pages, while 95 are intentionally sitemap-listed.
- Live and local artifacts for `llms.txt`, `llms-full.txt`, `sitemap-index.xml`, and `sitemap-0.xml` matched after line-ending normalization; `robots.txt` also matched after normalization.
- Representative local/live signal sets matched on `/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, `/resources/`, `/schedule/`, `/contact/`, and `/thank-you/`: title, description, canonical, one H1, JSON-LD, Markdown alternate, and `/llms.txt` link.
- Raw HTML hashes and byte lengths differ because Netlify transforms/compresses the deployed HTML. The checked SEO/AEO signal set and crawler behavior matched; this is not a production regression.
- No substantive source or content changes were made. Pre-existing worktree changes, including `.claude/`, the untracked blog asset/content, and the already-present 2026-08-17 weekly opportunity/backlog work, were preserved.

## Canonry evidence

Read-only Canonry commands completed for `remediation-restoration-marketing`:

```text
cnry project show remediation-restoration-marketing --format json
cnry technical-aeo score remediation-restoration-marketing --format json
cnry technical-aeo trend remediation-restoration-marketing --format json
cnry technical-aeo pages remediation-restoration-marketing --sort score-asc --format json
cnry google status remediation-restoration-marketing --format json
cnry google coverage remediation-restoration-marketing --format json
cnry google deindexed remediation-restoration-marketing --format json
cnry bing status remediation-restoration-marketing --format json
cnry bing coverage remediation-restoration-marketing --format json
cnry runs remediation-restoration-marketing --limit 10 --format json
cnry visibility-stats remediation-restoration-marketing --last-runs 5 --by-provider --format json
cnry insights remediation-restoration-marketing --limit 20 --format json
cnry sources remediation-restoration-marketing --rank --format json
cnry doctor --project remediation-restoration-marketing --format json
```

Current stored/read evidence:

- Technical score: 89/100, run `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`, completed 2026-08-13 15:36:51 UTC; 99 discovered, 97 audited, 0 skipped, 0 errored; delta +34 from 55/100.
- Technical trend remains 57, 71, 50, 56, 55, 55, 55, then 89 across the completed audits; the 89 run is still the latest.
- GSC connection/property access is healthy. Coverage remains 48 indexed / 47 not indexed / 0 deindexed of 95, last inspected/synced 2026-08-10. No deindexed rows were returned.
- Bing connection/site access is healthy, but Bing coverage has no stored inspection data (`0` total; no inspection timestamps); this is a measurement limitation, not evidence that no Bing pages are indexed.
- Visibility-stats across the last five runs still include only 3 completed visibility runs / 162 snapshots: Claude 26/54 mentioned and 2/54 cited; Gemini 20/54 mentioned and 5/54 cited; OpenAI 22/54 mentioned and 4/54 cited.
- Active insights are historical gains and competitor-gained observations from the 2026-08-10 run; no newer completed visibility run exists to support a regression claim.
- Canonry Doctor reports GSC and Bing connectivity OK; warnings remain for missing GSC sitemap-write scope, no GA4 connection, no backlink source, and low cited-surface winnability coverage. The single failure is the unconfigured GBP OAuth connection. These are integration/configuration limitations, not reproduced production defects.

## Findings and classification

### 1. No current production regression

Problem → A regression would be a degraded live technical/indexing signal or a comparable lost mention/citation.  
Evidence → 95/95 sitemap pages pass; 240/240 internal HTML targets pass; representative normal/crawler responses are byte-identical; AI access files and Markdown alternates pass; the build and independent AEO validator pass; no new visibility window exists.  
Expected impact → No current production SEO/AEO loss is evidenced.  
Recommended change → No source, content, deployment, indexing, or Canonry mutation. Continue the same monitoring checks after future deployments.  
Effort → None.  
Confidence → High for the checked live technical surface; Medium for AI visibility because its stored measurement is stale.  
Verification method → Repeat the live sitemap/internal-link/crawler parity checks and obtain an operator-approved comparable visibility sweep before making mention/citation claims.

Classification: no meaningful regression; prior deployment/stale-artifact parity defect remains resolved in production.

### 2. Index coverage remains an open stale-measurement opportunity

Problem → Stored GSC coverage reports 47 not-indexed URLs, but the last inspection is 2026-08-10 and Bing has no stored inspection data.  
Evidence → Live sitemap remains current and indexable; `/thank-you/` is intentionally excluded and no live page defect was reproduced; no deindexed rows were returned.  
Expected impact → A fresh URL-level inspection could distinguish eligible commercial pages from intended exclusions.  
Recommended change → Keep SEO-002 as Candidate. Obtain explicit operator approval before GSC/Bing sync, inspection, sitemap submission, or indexing requests; do not rewrite content to compensate for stale coverage buckets.  
Effort → Medium, operator-dependent.  
Confidence → Medium.  
Verification method → Fresh URL-level GSC/Bing reads against the current 95-URL sitemap, with `/admin/`, `/thank-you/`, and other intended exclusions recorded separately.

Classification: indexing opportunity / stale stored measurement, not a demonstrated production regression.

### 3. AI visibility regression cannot be assessed from current stored data

Problem → The latest visibility observations are from 2026-08-10 and only 3 completed runs are available in the last-five-run window.  
Evidence → 68/162 mentioned and 11/162 cited snapshots remain the stored aggregate; no new comparable run or provider transition exists.  
Expected impact → Avoids a false Aero regression escalation from stale or non-comparable samples.  
Recommended change → Keep SEO-003 as Candidate and request operator confirmation before a real fixed-basket sweep.  
Effort → Low operator time / quota-consuming.  
Confidence → High.  
Verification method → Compare the completed sweep ID, fixed query basket, provider set, mention coverage/share, and citation coverage with the prior valid baseline.

Classification: measurement pending; no mention or citation regression declared.

## Backlog reconciliation

- Stable IDs were preserved; no duplicate backlog item was created.
- SEO-001 remains `Validated`; its current production parity and 89/100 Canonry evidence are reconfirmed in this run.
- SEO-002 remains `Candidate`; live indexability is healthy, but stored GSC is stale and no indexing mutation or sync was run.
- SEO-003 remains `Candidate`; no quota-consuming visibility sweep was authorized and no regression claim was made.
- SEO-004 and SEO-005 remain `Candidate`; current evidence does not justify content changes as part of a production regression response.
- The backlog already contained a same-date weekly opportunity reconciliation in the worktree; this run updated the existing SEO-001/SEO-002 records in place to reference the production verification without replacing that broader opportunity record.

## Commands and verification status

- Live verification: complete for sitemap membership, status, metadata, canonical, headings, JSON-LD/entity consistency, internal links, redirects, robots, AI access files, crawler parity, Markdown alternates, `/thank-you/`, canonical-origin behavior, and 404 behavior.
- Local/build verification: complete and passing with `npm run build` and independent `node scripts/postbuild-aeo.mjs`.
- Canonry verification: read/check commands complete; latest stored technical audit is current as of 2026-08-13. GSC and visibility reads remain stale as of 2026-08-10; Bing has no stored coverage inspection data.
- Production/source/build parity: complete for the checked SEO/AEO signal set and AI access artifacts; raw HTML byte differences are expected after Netlify transformation.
- No deployment, CDN purge, indexing submission, sitemap submission, GSC/Bing sync, Canonry sweep, or probe was performed.
- Pending operator-confirmed actions: optionally authorize a fresh fixed-basket visibility sweep and current GSC/Bing inspection/sync; separately address Canonry integration warnings if desired.
