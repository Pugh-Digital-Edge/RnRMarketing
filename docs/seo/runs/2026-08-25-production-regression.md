# Production Regression Check — 2026-08-25

## Run metadata

- Run time: 2026-08-25T12:01:40-04:00 (2026-08-25T16:01:40Z)
- Run type: closed-loop SEO/AEO production regression and deployment verification
- Site: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Previous known-good baseline: `2026-08-24-production-regression.md`
- Current source HEAD: `bab467b` (`main` matches `origin/main`); Netlify exposes request IDs but no stable deployment/build ID
- Worktree: dirty before and during this run, including the service-template rewrite and other unrelated files; all user changes were preserved and not treated as deployed

## Result

No meaningful live production SEO/AEO regression was found. The live artifact remains healthy and matches the prior 96-URL known-good surface. The only parity finding is a pre-deployment source/build risk: the dirty local rewrite differs from live on eight service-page H1/content outputs, changes title/description/H1 on `/services/seo/`, and omits the deployed PPC-to-specialist contextual link. This is classified as source-code/deployment parity risk, not a live regression or content-rewrite trigger.

## Live verification

### Sitemap, response, indexability, and metadata

- `/sitemap-index.xml`: HTTP 200, `application/xml`; references `/sitemap-0.xml`.
- `/sitemap-0.xml`: HTTP 200, `application/xml`; 96 unique URLs, unchanged from 2026-08-24.
- Sitemap pages: 96/96 HTTP 200; no non-200 responses.
- All 96 sitemap pages had a title, meta description, absolute self-canonical, exactly one H1, and parseable JSON-LD.
- All 96 pages contained the same primary `LocalBusiness` identity (`Remediation & Restoration Marketing`, canonical origin) and matching `Organization` identity. The two entity types are intentional and consistent; this is not a schema/entity regression.
- `/thank-you/` and `/restoration-marketing/`: HTTP 200, `noindex, nofollow`, self-canonical, absent from the live sitemap.
- `/resources/water-damage-restoration-marketing/`: HTTP 200, indexable, self-canonical, one H1, valid JSON-LD, and sitemap-listed.

### Links, redirects, and error behavior

- 98 unique same-origin HTML link targets were discovered from the sitemap pages; all returned HTTP 200, with 0 broken targets and 0 redirects.
- The live `/services/ppc/` page still links to `/water-damage-restoration/ppc/`; the specialist page retains its reciprocal link.
- `https://www.remediationrestorationmarketing.com/` and `http://remediationrestorationmarketing.com/` each return 301 to the canonical HTTPS host.
- `/sitemap.xml` returns the expected 301 to `/sitemap-index.xml`.
- A nonexistent path returns the expected HTTP 404.

### Crawler and AI access signals

- Normal and `CanonryBot/1.0` response bodies were byte-identical on 12 representative routes: homepage, services index, PPC pages, SEO-004 pages, the published article, schedule, contact, and both excluded routes.
- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index, and child sitemap all return HTTP 200.
- `robots.txt` allows the checked search/AI crawlers, blocks `CCBot`, declares `Content-Signal: search=yes, ai-input=yes, ai-train=no`, and references the sitemap index.
- Advertised Markdown endpoints returned HTTP 200 with `text/markdown` on the homepage, published article, and `/services/ppc/`. The current HTML response behavior and Markdown alternates remain consistent with the prior baseline.
- Live headers identify Netlify and expose request IDs; no stable provider build ID was available. The canonical response uses `cache-control: public,max-age=0,must-revalidate`.

## Source and local build verification

- `npm run build`: pass on retry. The first attempt hit a local Windows `EPERM` while Vite refreshed `node_modules/.vite/deps` and left stale Node processes; after terminating those stale build processes, the retry completed successfully and built 101 Astro pages. The build includes `scripts/postbuild-aeo.mjs`.
- `node scripts/postbuild-aeo.mjs`: pass independently.
- `git diff --check`: no whitespace errors; only existing LF/CRLF warnings were emitted.
- Local `dist/sitemap-0.xml` contains the same 96 URLs as live. Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap match after line-ending normalization.
- Local/live SEO signal comparison found eight page-level differences, all attributable to the pre-existing dirty service rewrite:
  - H1 differences: `/services/lead-tracking/`, `/services/ppc/`, `/services/reputation-management/`, `/services/retargeting/`, `/services/social-media-advertising/`, `/services/social-media-marketing/`, and `/services/web-design/`.
  - H1 plus title/description differences: `/services/seo/`.
  - Local `/services/ppc/` omits the live `/water-damage-restoration/ppc/` contextual link.
- Excluded-route source/local behavior matches live for `/thank-you/` and `/restoration-marketing/`.
- Other unrelated dirty files were not included in the SEO parity conclusion and were not modified.

## Canonry and stored search/AEO evidence

All Canonry commands below were read/check commands only. No sweep, probe, discovery, sync, indexing request, sitemap submission, connector change, deployment, or purge was run.

- Technical audit: run `8341b64b-100f-49d8-8835-e8c27a91f446`, completed 2026-08-20; 89/100, 97 discovered/audited, 0 skipped, 0 errors, flat versus the prior 89. AI access files, crawler access, schema validity/completeness, entity consistency, and technical SEO pass in the stored audit; content extractability remains partial and is not treated as a production defect without a comparable outcome signal.
- Google coverage: stored sitemap inspection completed 2026-08-24T18:50:29Z; 100 stored URLs, 52 indexed, 48 not indexed, 0 deindexed. Reconciled to the current live sitemap: 25 `Submitted and indexed`, 25 `Crawled - currently not indexed`, and 46 `URL is unknown to Google`. Four stored URLs are outside live sitemap scope: `/tos/`, `/privacy/`, obsolete `/water-damage-restoration/`, and `/admin/`. The published article is currently stored as `URL is unknown to Google`; this is an indexing opportunity, not proof of a live crawl or content defect.
- Bing coverage: last stored inspection 2026-08-24; 16/16 sampled URLs indexed. This is a limited stored sample, not full-site coverage.
- Visibility: latest completed comparable visibility run remains `595fca88-de9d-474e-8854-f7319346e0b5` from 2026-08-10. The adopted 42-query read is 27/42 Mention Coverage (64%), 4/42 Citation Coverage (10%), and 13% non-brand Mention Share (4 of 31 brand mentions). Mention remains primary and citation secondary. The prior 12-query comparison is not comparable to the 42-query basket, so no current mention/citation regression is declared. Provider pooled stats last observed 2026-08-10; no fresh sweep was authorized.
- Canonry doctor: GSC and Bing access pass; GSC sitemap-write scope is unavailable; GBP OAuth fails because it is unconfigured; GA4, traffic, and backlinks are not connected; winnability coverage is low. These are integration/data limitations, not live production regressions.

## Baseline comparison and classification

### 1. Live technical surface — clean

Problem → A production regression would degrade a previously healthy live status, indexability, canonical, metadata, schema/entity, link, redirect, crawler, or AI-access signal.

Evidence → 96/96 sitemap pages pass; 98/98 internal targets pass; 12 representative normal/crawler pairs are identical; excluded routes remain correctly noindexed; robots/AI files, Markdown alternates, canonical redirects, and 404 behavior pass.

Expected impact → No observed negative production impact.

Recommended change → No production or content change in this check.

Effort → None.

Confidence → High for the checked live surface.

Verification method → Repeat the same live crawl after any deployment and compare against this report and the 2026-08-24 baseline.

Classification: no meaningful live production regression.

### 2. Dirty source/build parity — pending review, not live

Problem → The current local service-template rewrite is not the deployed artifact and would change visible page intent/H1 output; the local PPC page also drops an approved contextual link.

Evidence → Local build differs from live on eight service routes; live remains healthy and current worktree changes are uncommitted. The local PPC link is absent while the live link is present.

Expected impact → Deploying without review could replace measured live copy and weaken the approved generic-to-specialist PPC route relationship.

Recommended change → Keep the dirty rewrite out of production until operator review restores/preserves the PPC link and approves the page-level changes. Do not rewrite healthy live content to compensate for a source/deployment mismatch.

Effort → Low for review; medium if the rewrite is revised.

Confidence → High that this is a pre-deployment parity risk.

Verification method → After any approved deployment, rerun the full live crawl, local/live signal diff, build/postbuild checks, and relevant Canonry recheck before measurement.

Classification: source-code/deployment parity risk; no deployed regression.

### 3. Stored indexing gap — pending operator action

Problem → 46 current live sitemap URLs are stored as `URL is unknown to Google`, 25 are crawled but not indexed, and the new article is unknown.

Evidence → Fresh stored GSC inspection from 2026-08-24, reconciled to the 96-URL live sitemap; live pages themselves return 200, are indexable, canonical, and sitemap-listed where intended.

Expected impact → Eligible pages that are not indexed cannot reliably contribute organic or AI visibility.

Recommended change → Keep the current read-only baseline. With explicit operator approval, prioritize eligible commercial/article URLs for inspection or submission; exclude `/admin/`, `/thank-you/`, and other intended exclusions. Do not rewrite pages solely because of the coverage bucket.

Effort → Medium.

Confidence → High for the stored classification; medium for future status because coverage changes after inspection.

Verification method → Approved URL inspection/submission, then a dated post-recrawl coverage comparison and later approved AEO measurement.

Classification: indexing opportunity / stale-versus-current measurement boundary, not a demonstrated production defect.

## Backlog reconciliation

- Updated existing stable IDs in place; no duplicate IDs created.
- SEO-001, SEO-004, and SEO-005 remain `Measuring`; their live interventions are healthy and the dirty rewrite remains unapproved/undeployed.
- SEO-002 remains `Measuring`; its evidence now uses the 2026-08-24 stored inspection reconciled to the current 96-URL sitemap.
- SEO-003 remains `Measuring`; no fresh 42-query visibility sweep was authorized, so no AEO outcome is claimed.
- SEO-006 remains `In Progress`; the article is live and technically healthy, but retrospective approval and post-publication measurement remain pending. Its current stored Google state is unknown, not zero.
- No substantive source, content, UI, connector, deployment, purge, indexing, or Canonry measurement mutation was made.

## Verification status and limitations

- Live verification: complete for sitemap membership, HTTP status, indexability, canonical URLs, metadata, headings, JSON-LD/entity consistency, internal links, broken links, redirects, robots, `llms.txt`, `llms-full.txt`, crawler parity, Markdown alternates, excluded routes, canonical-host behavior, response headers, and 404 behavior.
- Local/build verification: complete; `npm run build` and independent postbuild validation pass after the local EPERM retry. Source/live parity is intentionally incomplete because of preserved dirty worktree changes.
- Canonry verification: complete for stored technical audit, GSC coverage, Bing sample, visibility baseline, and doctor checks. No quota-consuming sweep/probe/sync/submission was run.
- Current measurement outcome: unavailable for post-deployment search/AEO impact. Existing Mention Coverage/Share and Citation Coverage are separate signals with no fresh comparable window.
