# SEO/AEO Production Regression Check

## Run metadata

- Run time: 2026-09-01T10:25:24-04:00 (2026-09-01T14:25:24Z)
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Current repository: `75c5c2872b93d23bf4c35548b3c74d0decd81a03` (`Record weekly LSA article intervention`), `main` synchronized with `origin/main` before this run; pre-existing documentation changes were preserved.
- Previous known-good baseline: [`2026-08-31-production-regression.md`](2026-08-31-production-regression.md)
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Required guidance used: Canonry runtime/indexing/AEO guidance and Aero regression-playbook/orchestration guidance. Mention Coverage was read before Citation Coverage; no fresh visibility sweep was run.
- No deployment, CDN purge, Canonry sweep/probe/discovery, GSC/Bing sync or indexing request, sitemap submission, connector mutation, or substantive source/content change was performed.

## Outcome

No current live SEO/AEO regression was found. Production expanded from the 2026-08-31 96-URL sitemap to 97 URLs, and the Local Services Ads guide that was source-only/HTTP 404 at the prior upstream checkpoint is now live and production-verified. The new route matches the current build on the checked SEO signals and is included in the live sitemap.

The prior SEO-009 issue is classified as a resolved deployment/stale-artifact lag, not a content or indexing defect: commit `1b13b66` was present in source before the route became available in production, but the route now returns HTTP 200. No new source-code, deployment, configuration, indexing, content, redirect, or crawlability regression was observed.

## Baseline comparison

Compared with [`2026-08-31-production-regression.md`](2026-08-31-production-regression.md):

- Changed as expected: live and local sitemaps now contain 97 unique URLs, adding `/resources/local-services-ads-for-restoration-companies/`.
- Stable/healthy: all 97 sitemap URLs return HTTP 200; all have a title, meta description, absolute self-canonical, exactly one H1, parseable JSON-LD, the primary `LocalBusiness` entity `https://remediationrestorationmarketing.com/#localbusiness`, and no page-level `noindex` or `X-Robots-Tag` directive.
- Resolved: `/resources/local-services-ads-for-restoration-companies/` returns HTTP 200, is indexable, self-canonical, one-H1, exposes `BlogPosting` and synchronized `FAQPage` signals, and is sitemap-listed. It is linked once from `/resources/fire-damage-restoration-marketing/`.
- Stable/expanded: 99 unique same-origin HTML targets return HTTP 200, with zero broken targets and zero redirects.
- Stable: `/services/ppc/` links to `/water-damage-restoration/ppc/`, and the reverse specialist-to-generic PPC link remains present.
- Stable: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `<meta name=robots content="noindex, nofollow">` and are absent from the sitemap.
- Stable: robots, `llms.txt`, `llms-full.txt`, sitemap index/child, and six representative Markdown alternates are available. Robots allows the checked AI search crawlers, blocks CCBot, and carries `Content-Signal: search=yes, ai-input=yes, ai-train=no`.
- Stable: normal and `CanonryBot/1.0` response bodies were byte-identical on 14 representative routes, including the new article and the recently affected lead-capture route.

## Live production verification

### Sitemap, indexability, metadata, and entity signals

- `/sitemap-index.xml`: HTTP 200; points to `https://remediationrestorationmarketing.com/sitemap-0.xml`.
- `/sitemap-0.xml`: HTTP 200; 97 unique URLs.
- Sitemap pages: 97/97 HTTP 200; missing titles 0; missing descriptions 0; bad canonicals 0; pages with H1 count other than one 0; pages without parseable JSON-LD 0; sitemap pages with `noindex` 0; page-level `X-Robots-Tag` headers 0.
- JSON-LD/entity consistency: all 97 sitemap pages expose the same primary `LocalBusiness` identity `https://remediationrestorationmarketing.com/#localbusiness`, named `Remediation & Restoration Marketing`.
- SEO-009 article: title `Local Services Ads for Restoration Companies: How They Work`; description `Learn how Local Services Ads work for restoration companies, from eligibility and service areas to lead handling, ranking inputs, and booked-job tracking.`; canonical `https://remediationrestorationmarketing.com/resources/local-services-ads-for-restoration-companies/`; one H1; JSON-LD-valid; indexable.
- Excluded routes: `/thank-you/` and `/restoration-marketing/` are HTTP 200, `noindex, nofollow`, and not sitemap members.

### Internal links, redirects, and response behavior

- 99 unique same-origin HTML targets were discovered from sitemap pages; all returned HTTP 200 with no redirects.
- SEO-005: live `/services/ppc/` contains a followable link to `/water-damage-restoration/ppc/`; the specialist page links back to `/services/ppc/`.
- SEO-009 support: `/resources/fire-damage-restoration-marketing/` contains one link to the new LSA guide.
- Canonical-host behavior: `http://remediationrestorationmarketing.com/` and `https://www.remediationrestorationmarketing.com/` return HTTP 301 to `https://remediationrestorationmarketing.com/`.
- `/sitemap.xml` returns HTTP 301 to `/sitemap-index.xml`.
- Deliberately nonexistent URL `/definitely-not-found-20260901/` returns HTTP 404.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all six checked Markdown alternates return HTTP 200.
- Markdown alternates use `text/markdown; charset=UTF-8`.
- Normal and `CanonryBot/1.0` response bodies were byte-identical on `/`, `/services/`, both PPC pages, the four SEO-004 pages, social advertising, resources, both article routes, `/schedule/`, `/contact/`, and `/restoration-marketing/`.
- Representative live headers identify Netlify (`server: Netlify`) and expose `x-nf-request-id: 01M1ENKSQMQ6GY4D525PRPNEJ5`; `Last-Modified` remains `Thu, 16 Jul 2026 18:00:00 GMT`. No stable Netlify deployment/build ID was exposed, so the request ID is not treated as a deployment identifier.

## Local build and production/source parity

- `npm run build` passed on HEAD `75c5c28`; Astro built 102 pages, including the new article, and generated a 97-URL sitemap. Existing Browserslist freshness, SVG attribute, and duplicate SVG ID warnings remain non-blocking because the build completed successfully.
- Independent `node scripts/postbuild-aeo.mjs` passed.
- A normalized comparison of title, description, canonical, H1 count, JSON-LD count/entity, indexability, and internal link sets found 0 mismatches across all 97 live sitemap URLs.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap-index.xml`, and `sitemap-0.xml` matched after line-ending normalization.
- The new SEO-009 article’s live/local signal set matched, including its `BlogPosting`/`FAQPage` schema signals, author presence, visible FAQ structure, canonical, H1, and indexability. Raw HTML byte identity is not required; normalized SEO signals and artifacts are the parity gate.

## Canonry evidence

- Runtime preflight: Node `v24.18.0`; Canonry `4.177.1`; configured project and database present.
- Project-scoped doctor: GSC OAuth/property access and Bing connection/site access pass. The read-only GSC scope lacks sitemap-write permission; GBP has no connection; GA4, server-side traffic, and backlink sources are unavailable; winnability coverage is 22% (60/279 cited-surface domains recognized). These are integration/data limitations, not live regressions.
- Technical AEO: stored audit `8dd953a4-4c60-4527-b6d6-1e68fad32431` remains 88/100 across 98 pages, 0 skipped, 0 errored, completed 2026-08-27. The one-point decrease from 89/100 coincided with a larger audited scope and was not refreshed in this run.
- Google coverage: stored rollup remains 53 indexed / 47 not indexed / 0 deindexed across 100 URLs; last inspection 2026-08-27 and last sync 2026-08-24. The accepted bounded 2026-08-27 inspection distinguished indexed, crawled-not-indexed, and unknown states; the lossy rollup still groups all 47 not-indexed rows as `URL is unknown to Google`. No deindexed rows are present.
- Representative stored Google verdicts remain indexed for the water-damage article, PPC service page, and fire-damage web-design page. The new SEO-009 route is not in the current stored Google coverage set, so its current provider verdict is unavailable, not zero.
- Bing coverage: stored sample remains 37 indexed / 1 unknown across 38 inspections, last inspected 2026-08-27; the unknown is the water-damage marketing article. The new SEO-009 route is not in that stored sample.
- AI visibility, mention first: latest completed comparable run `30969b56-2bc9-49cc-bba3-4cee92a4e36e` remains 42 queries/126 snapshots from 2026-08-27, with 5/42 Mention Coverage (12%), 5/29 non-brand Mention Share (17%), and 3/42 Citation Coverage (7%). The 22 lost-mentioned queries versus the 2026-08-10 27/42 baseline remain a point-in-time result with only two observations per query/provider; Aero’s regression guidance does not support declaring it durable without an approved unchanged-basket confirmation sweep. No fresh sweep or probe was run.
- No new organic performance, traffic, conversion, AI-referral, mention, or citation outcome is claimed for SEO-009 or any other intervention.

## Classification and response

### Resolved deployment/stale-artifact lag — SEO-009

**Problem** → The committed LSA guide was HTTP 404 and absent from the live sitemap at the 2026-08-31 upstream checkpoint.

**Evidence** → On 2026-09-01 the same expected URL returned HTTP 200, appeared in the 97-URL live sitemap, passed canonical/indexability/H1/JSON-LD/entity checks, matched the local production build, and was linked from the fire-damage marketing guide. Netlify exposed no stable build ID, so the exact provider deployment cannot be identified beyond artifact parity and response-level request evidence.

**Expected impact** → The guide is now available for crawling and potential organic/AI retrieval; no ranking, mention, citation, traffic, or conversion impact is established.

**Recommended change** → Keep the production-verified article and current 97-URL artifact stable through the SEO-009 measurement date. Do not rewrite, duplicate, submit, or run a visibility probe solely because the prior 404 occurred.

**Effort** → Low for monitoring; Medium if later revision is approved.

**Confidence** → High that the deployment gate is now passed; Medium for any future search/AEO impact.

**Verification method** → Repeat production status/sitemap/indexability/schema/link parity, then compare exact GSC query/page data after the 2026-09-29 measurement date and use a later operator-approved fixed-basket Canonry run. Keep Mention Coverage/Share separate from Citation Coverage.

**Classification** → Deployment/stale artifact, resolved live; measurement pending.

### Stored indexing limitation — SEO-002

**Problem** → Stored provider coverage does not yet represent the current 97-URL live sitemap completely.

**Evidence** → Google’s stored 53/47/0 rollup covers 100 URLs and is last inspected 2026-08-27; Bing’s 37/1 sample covers 38 URLs and is last inspected 2026-08-27. The new SEO-009 URL is live but absent from both stored samples.

**Expected impact** → Current provider state for the new page is unavailable; no indexing loss is evidenced.

**Recommended change** → Keep SEO-002 Measuring and preserve the approved 2026-09-25 gate for repeating the bounded URL set. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the stored sample; Medium for whole-site coverage.

**Verification method** → Repeat the approved URL-level inspection set after the recrawl window and compare exact verdicts; do not use the lossy aggregate as a current page verdict.

**Classification** → Indexing opportunity/measurement limitation, not a confirmed production regression.

## Backlog reconciliation

- **SEO-001** remains `Measuring`; updated with the 97-URL/99-target clean production parity result and resolved SEO-009 deployment lag.
- **SEO-002** remains `Measuring`; stored provider coverage is unchanged and incomplete relative to the new live sitemap. No indexing mutation was performed.
- **SEO-003** remains `Measuring`; no fresh sweep was run and the 2026-08-27 fixed-basket mention decline remains unconfirmed for durability.
- **SEO-004** remains `Measuring`; all four target pages remain technically valid and no comparable post-deployment search outcome is available.
- **SEO-005** remains `Measuring`; the repaired PPC contextual link remains present in source, build, and live output through its 2026-09-24 measurement date.
- **SEO-006** remains `Measuring`; the water-damage article remains live, indexable, canonical, and sitemap-listed without a new outcome claim.
- **SEO-007** remains `Measuring`; the approved social-advertising page remains technically valid without a new outcome claim.
- **SEO-008** remains `Candidate` and awaiting approval; no source or live change was made.
- **SEO-009** remains `Measuring`; its deployment gate is now passed on 2026-09-01 and its measurement due date is 2026-09-29.
- No duplicate backlog IDs were created.

## Commands and results

- Control-plane reads: `AGENTS.md`, `docs/seo/README.md`, `docs/seo/strategy.md`, `docs/seo/backlog.md`, `docs/seo/learnings.md`, recent SEO runs including `2026-08-31-production-regression.md` and `2026-09-01-monthly-review.md`, and automation memory.
- Canonry reads/checks: `cnry --version`, `cnry doctor --format json`, `cnry doctor --project remediation-restoration-marketing --format json`, `cnry overview remediation-restoration-marketing --format json`, `cnry technical-aeo score remediation-restoration-marketing --format json`, `cnry technical-aeo trend remediation-restoration-marketing --format json`, `cnry google coverage remediation-restoration-marketing --format json`, `cnry google deindexed remediation-restoration-marketing --format json`, `cnry bing status remediation-restoration-marketing --format json`, `cnry bing coverage remediation-restoration-marketing --format json`, and `cnry visibility-stats remediation-restoration-marketing --format json`.
- Local verification: `npm run build` and independent `node scripts/postbuild-aeo.mjs` passed.
- Live verification: read-only Node/Fetch checks covered sitemap membership, HTTP status, titles/descriptions, canonicals, H1 counts, JSON-LD/entity consistency, indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, 404 behavior, and SEO-005/SEO-009 link presence.
- No mutation or quota-consuming operation was run.

## Verification status and limitations

- **Live production:** complete for the current 97-URL sitemap, 99-target internal crawl, representative metadata/indexability/schema/entity signals, SEO-009 article availability, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, headers, and 404 behavior.
- **Local/build:** complete; `npm run build` and `scripts/postbuild-aeo.mjs` passed. Existing warnings are non-blocking.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts. The current live artifact matches the current build on 97/97 normalized page signals and all checked AI-access artifacts.
- **Canonry:** technical audit current through 2026-08-27; Google URL inspection current through 2026-08-27 with stored sync through 2026-08-24; Bing inspection current through 2026-08-27; visibility outcome data current through the 2026-08-27 completed sweep.
- **Unavailable/not claimed:** current provider verdict for SEO-009, current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, current backlink data, stable Netlify build ID, and causal search/AEO impact of any intervention.
- **Pending operator-confirmed action:** keep approved artifacts stable through their measurement dates; authorize the unchanged-basket confirmation sweep on or after 2026-09-04 and bounded indexing recheck on or after 2026-09-25 only if desired. No such action was authorized by this run.
