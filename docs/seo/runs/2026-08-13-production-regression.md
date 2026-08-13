# SEO/AEO Production Regression Check

## Run metadata

- Date: 2026-08-13
- Live environment: https://remediationrestorationmarketing.com/
- Live check time: approximately 2026-08-13 10:54 EDT / 14:54 UTC
- Repository HEAD: `4f61cd9`
- Run type: closed-loop SEO/AEO production regression check
- Canonry project: `remediation-restoration-marketing`
- Workflows used: Aero regression-playbook guidance; Canonry technical AEO and indexing read/check guidance
- Mutations intentionally not performed: Canonry sweep or probe, indexing submission, sitemap submission, deployment, CDN purge, or site content/code change

## Baseline comparison

The latest known-good/recorded production evidence was [`2026-08-11-production-regression.md`](2026-08-11-production-regression.md):

- Production exposed 96 sitemap URLs; all returned 200 and carried the expected canonical, title, description, one H1, and valid JSON-LD.
- The concrete regression was `/thank-you/`: production returned it as indexable and included it in the sitemap, while source/build applied `noindex, nofollow` and excluded it.
- Normal and `CanonryBot/1.0` responses were byte-identical on representative routes; the prior crawl found no broken targets among 100 internal HTML targets and two known trailing-slash redirects.
- Completed Canonry technical run `d519ac38-b993-403b-b929-7066103e0723` reported 91 audited pages, aggregate 55/100, with 50 pages at 28/100. That result had not been reconciled to direct live evidence.
- Last recorded GSC coverage remained 43 indexed / 51 not indexed of 94 (45.7% indexed); no newer coverage or visibility baseline was available.

## Live production verification

### Sitemap, indexability, and response behavior

Checked these live URLs:

- `https://remediationrestorationmarketing.com/sitemap-index.xml` — 200; references `https://remediationrestorationmarketing.com/sitemap-0.xml`.
- `https://remediationrestorationmarketing.com/sitemap-0.xml` — 200; 95 unique URLs and 95 `lastmod` values, all `2026-08-10T00:00:00.000Z`.
- `https://remediationrestorationmarketing.com/sitemap.xml` — 301 to `/sitemap-index.xml`.
- Representative routes: `/`, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, `/resources/`, `/schedule/`, and `/thank-you/`.

Results:

- All 95 sitemap URLs returned HTTP 200.
- All 95 had a title, meta description, self-referencing canonical, exactly one H1, at least one valid JSON-LD block, and no `noindex` directive.
- `/thank-you/` is absent from the production sitemap and returns HTTP 200 with `<meta name="robots" content="noindex, nofollow">`; it has no `X-Robots-Tag` header. This is the intended exclusion and resolves the prior production mismatch.
- All 95 pages exposed the same primary LocalBusiness entity: `@id` `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`, URL `https://remediationrestorationmarketing.com`.
- Normal and `CanonryBot/1.0` responses were byte-identical on all seven representative routes.
- `Accept: text/markdown` on the HTML routes returned the normal HTML response. Each representative route advertised an absolute `text/markdown` alternate whose `index.md` endpoint returned 200 with `text/markdown`; this is not a production regression.

### Internal links, redirects, and error behavior

- 99 unique same-origin HTML link targets were discovered across the sitemap pages.
- 0 targets returned 4xx/5xx.
- Two targets still 301 because source links omit the trailing slash: `/services` → `/services/` and `/resources` → `/resources/`. This matches the prior run and is minor link hygiene, not a newly observed regression.
- `http://remediationrestorationmarketing.com/` and `https://www.remediationrestorationmarketing.com/` redirect to the canonical HTTPS non-`www` origin.
- A deliberately nonexistent URL returned 404.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, and `/sitemap-index.xml` returned 200.
- `robots.txt` allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot; blocks CCBot; declares `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and references the sitemap index.
- Live `/llms.txt`, `/llms-full.txt`, `/sitemap-index.xml`, and `/sitemap-0.xml` matched the local build artifacts byte-for-byte.

## Local build and source verification

- `npm run build` exited 0, built 99 Astro pages, generated the sitemap, and ran `scripts/postbuild-aeo.mjs`.
- `node scripts/postbuild-aeo.mjs` independently exited 0.
- The build emitted existing non-blocking warnings: stale Browserslist data, SVG `clip-rule` normalization, and duplicate SVG id `Star-1`; none failed the build or AEO validator.
- Current source explicitly excludes `/thank-you/` in `astro.config.mjs` and passes `noindex` from `src/pages/thank-you.astro` to `src/layouts/BaseLayout.astro`.
- Local `dist/sitemap-0.xml` contains 95 URLs and excludes `/thank-you/`; local `dist/thank-you/index.html` contains `noindex, nofollow`.
- Representative local/live metadata and entity signals matched for `/`, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, `/resources/`, `/schedule/`, and `/thank-you/`.
- Raw HTML hashes differ between local `dist` and live production on the representative routes, consistent with production transformation/minification. The SEO/AEO signal comparison matched; no source/build parity defect was found.
- `public/robots.txt` and live `robots.txt` differed only in line-ending normalization (CRLF locally versus LF live); directives and signals matched semantically.

## Canonry evidence

Read-only commands attempted for `remediation-restoration-marketing`:

```text
cnry project show remediation-restoration-marketing --format json
cnry technical-aeo score remediation-restoration-marketing --format json
cnry technical-aeo trend remediation-restoration-marketing --format json
cnry technical-aeo pages remediation-restoration-marketing --sort score-asc --format json
cnry google status remediation-restoration-marketing --format json
cnry google coverage remediation-restoration-marketing --format json
cnry google coverage-history remediation-restoration-marketing --format jsonl
cnry runs remediation-restoration-marketing --limit 10 --format jsonl
cnry visibility-stats remediation-restoration-marketing --last-runs 5 --by-provider --format json
cnry insights remediation-restoration-marketing --format json
```

All returned a connection error because the local Canonry server was not running. A direct retry of `cnry serve --host 127.0.0.1 --port 4100` failed with a missing `better-sqlite3` native binding for Node `24.18.0` / `node-v137-win32-x64`. No package reinstall or configuration change was attempted.

Therefore:

- No current Canonry technical score, trend, GSC coverage, visibility-stats, insight, or run-list value is claimed.
- The old technical audit and historical 43/51 GSC coverage remain recorded baselines, not current measurements.
- No mention or citation regression is declared because no comparable current visibility data was available.

## Findings and classification

### 1. Prior `/thank-you/` production mismatch is resolved

Problem → The conversion-confirmation page was previously indexable and sitemap-listed in production despite source/build exclusion behavior.

Evidence → Current source HEAD `4f61cd9` includes the exclusion and `noindex`; local build contains both; live sitemap has 95 URLs with no `/thank-you/`; live `/thank-you/` returns `noindex, nofollow`; all representative crawler/normal responses match.

Expected impact → Prevent the low-value confirmation page from entering search indexes and align production with intended sitemap/indexability controls. The intended technical correction is live.

Recommended change → No further code or content change. Keep the item in measurement until Canonry can be re-read and compared with `d519ac38-b993-403b-b929-7066103e0723`.

Effort → Completed deployment verification; remaining Canonry runtime/recheck is operator/tooling work.

Confidence → High.

Verification method → Live sitemap membership and robots directive, local `dist`, normal-vs-crawler comparison, `npm run build`, and independent AEO validator.

Classification: deployment/stale artifact defect resolved, with indexing impact remediated.

### 2. Prior low Canonry page-score cluster remains a measurement discrepancy

Problem → The completed Canonry technical run reported a 28-point cluster that direct production and local artifact checks do not reproduce.

Evidence → Current live crawl found 95/95 successful pages with the expected metadata, JSON-LD, entity, and crawler parity; current Canonry reads are blocked by the local native binding failure.

Expected impact → Avoid content/schema rewrites based on stale or parser-incompatible evidence; restore a trustworthy measurement baseline first.

Recommended change → Repair the local Canonry runtime and obtain operator confirmation before any fresh technical audit or visibility sweep. Do not change page content to compensate for this unresolved measurement issue.

Effort → Low-to-medium tooling repair plus operator-confirmed Canonry recheck.

Confidence → High that current live HTML is healthy for the tested signals; medium on the cause of the old Canonry score.

Verification method → Compare a new completed Canonry technical run with `d519ac38-b993-403b-b929-7066103e0723`, including the former 50-page cluster.

Classification: Canonry measurement/tooling discrepancy; exact cause unknown.

## Backlog reconciliation

- Updated stable item SEO-001 in place to `Measuring`: the concrete `/thank-you/` parity defect is live-resolved; Canonry recheck remains pending.
- Updated stable item SEO-002 in place to remove the resolved `/thank-you/` mismatch from its active problem statement while retaining the stale 43/51 GSC baseline and need for URL-level classification.
- SEO-003 remains Candidate; no quota-consuming visibility sweep was authorized.
- SEO-004 remains Candidate; no content defect was established after parity verification.
- No duplicate backlog items were created.

## Limitations and verification status

- Live production verification: complete for the checks listed above.
- Local build/postbuild verification: complete and passing.
- Production/source/build parity: complete for sitemap, AI text assets, metadata/entity signals, and representative crawler behavior; raw HTML differs due transform/minification; robots bytes differ only by line endings.
- Current Canonry technical/indexing/visibility evidence: unavailable because the local server cannot load its Node 24 native binding.
- Search/AI outcome comparison: unavailable; no fresh GSC or mention/citation window was run.
- Pending operator-confirmed actions: repair/restart Canonry runtime, then authorize any Canonry technical recheck or visibility sweep; no indexing submissions, deployment, or CDN purge were performed.

## Follow-up fix pass

Requested fixes were applied after the initial report:

- Updated `src/components/Articles.astro` so “View All” links to `/resources/` instead of `/resources`.
- Updated `src/components/ServicesDisplay.astro` so “View All Services” links to `/services/` instead of `/services`.
- Rebuilt Canonry’s installed `better-sqlite3` native binding for Node `24.18.0` and verified an in-memory SQLite query succeeds.

Verification:

- `npm run build` passed and built 99 pages; `node scripts/postbuild-aeo.mjs` passed independently.
- Local source and `dist` contain no exact internal `href="/services"` or `href="/resources"` links.
- Live `/services` and `/resources` still return 301 to their slash URLs because the source fix has not been deployed. No deployment was performed.
- Canonry project, technical score/trend, GSC status/coverage, visibility-stats, runs, insights, and doctor reads now execute.
- Current stored GSC coverage is 48 indexed / 47 not indexed of 95 (50.5%), last inspected/synced 2026-08-10; all 47 not-indexed URLs are grouped as `URL is unknown to Google`.
- Current stored visibility window is 3 completed runs / 162 provider snapshots: 68 mentioned (41.98%) and 11 cited (6.79%). This is not a new comparable sweep, so no regression or causal improvement is claimed.
- Canonry’s stored technical score remains 55/100 from 2026-08-10, auditing the older 96-page state. Direct live verification still shows current metadata/entity/JSON-LD health; no generic content/schema rewrite was made.
- `cnry doctor` now reaches the project and reports one configuration failure: no GBP OAuth connection. GSC and Bing connections are healthy; GA4, backlink, and traffic integrations are unconfigured or warning-only. No connector setup was attempted.

Remaining operator actions:

- Deploy the two trailing-slash link fixes, then repeat the live internal-link crawl.
- Review the 47 current GSC “URL is unknown to Google” URLs and explicitly approve any sitemap/indexing submissions. No indexing mutation was run in this pass.
- If desired, run a fresh Canonry technical audit after deployment to compare against `d519ac38-b993-403b-b929-7066103e0723`; the existing technical audit is not a current production baseline.

### Fresh Canonry technical recheck

After repairing the local native binding, a non-LLM HTTP audit was run against the current live site:

- Command: `cnry technical-aeo run remediation-restoration-marketing --wait --format json`
- Run ID: `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`
- Completed: `2026-08-13T15:36:51.786Z`
- 99 pages discovered, 97 audited, 0 skipped, 0 errored.
- Aggregate score: 89/100, up from the stale 55/100 audit on 2026-08-10 (`deltaScore: 34`).
- Structured data 92, schema completeness 100, schema validity 100, AI access files 100, AI crawler access 100, entity consistency 88, and technical SEO 97.
- The only remaining partial factor is content extractability at 59/100; this is an optimization opportunity, not evidence of the former deployment/parser defect. No generic content rewrite was made.

This recheck resolves the former Canonry/live measurement discrepancy for the current production state. The remaining indexing gap is separate: GSC’s last stored read is 48 indexed / 47 not indexed of 95, all 47 grouped as `URL is unknown to Google`.

This follow-up supersedes the initial pass’s pending Canonry-runtime and technical-recheck notes above. The remaining pending items are deployment of the two source link fixes and explicit approval for any indexing mutation.
