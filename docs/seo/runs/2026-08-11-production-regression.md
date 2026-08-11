# SEO/AEO Production Regression Check

## Run metadata

- Date: 2026-08-11
- Live environment: https://remediationrestorationmarketing.com/
- Repository HEAD: `068d543`
- Run type: closed-loop production regression check
- Canonry project: `remediation-restoration-marketing`
- Workflows: Canonry technical/indexing guidance and Aero regression playbook
- Mutations intentionally not performed: Canonry sweep, indexing submission, sitemap submission, deployment, CDN purge, or site code/content change

## Baseline comparison

Latest known-good/recorded evidence came from the 2026-08-10 weekly run and audit plan:

- Completed Canonry technical run `d519ac38-b993-403b-b929-7066103e0723`: 91 pages audited, aggregate 55/100, including 50 pages at 28/100.
- Last recorded GSC coverage: 43 indexed and 51 not indexed of 94 (45.7% indexed). This was not refreshed in this run.
- Historical adopted 12-query basket: 83% query-level Mention Coverage, 86% Mention Share, and 42% Citation Coverage. No new visibility sweep was run, so these remain historical values rather than current measurements.
- Direct live checks on 2026-08-10 found canonical, JSON-LD, Markdown alternates, sitemap/robots, and AI files despite the low Canonry page scores.
- The 2026-08-10 live sitemap count was recorded as 91. Production now exposes 96 sitemap URLs.

## Live production verification

Checked at approximately 2026-08-11 10:45 EDT (14:45 UTC).

### Crawl, indexability, and metadata

- `/sitemap-index.xml` returned 200 and referenced `/sitemap-0.xml`; `/sitemap.xml` returned an expected 301 to `/sitemap-index.xml`.
- The production child sitemap contains 96 unique URLs and 96 `lastmod` values, all `2026-08-10T00:00:00.000Z`.
- All 96 sitemap URLs returned 200.
- All 96 had a self-referencing canonical, title, meta description, exactly one H1, at least one JSON-LD block, and no invalid JSON-LD block.
- No sitemap URL exposed a `noindex` directive.
- Representative sitemap membership was confirmed for `/`, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, `/resources/`, and `/schedule/`.

### JSON-LD and entity consistency

- Every sitemap page exposed the shared `LocalBusiness` entity.
- All 96 used the same primary entity values: `@id` `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`, and URL `https://remediationrestorationmarketing.com`.
- Representative pages exposed page-appropriate schema including `WebPage`, `WebSite`, `Organization`, `LocalBusiness`, `FAQPage`, `HowTo`, `Service`, and breadcrumb types where applicable.

### Crawler, Markdown, and AI access

- Normal and `CanonryBot/1.0` requests were byte-identical on all six representative routes: same 200 status, content type, body length, and body hash.
- Sending `Accept: text/markdown` to the HTML route returned the same HTML, not negotiated Markdown. This is not a break because every representative page advertised an absolute `text/markdown` alternate.
- Each advertised per-page `index.md` endpoint returned 200 with `text/markdown`.
- `/robots.txt`, `/llms.txt`, and `/llms-full.txt` returned 200.
- `robots.txt` allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot; blocks CCBot; declares `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and references the sitemap index.
- Live and local `llms.txt`, `llms-full.txt`, and `sitemap-index.xml` matched exactly by SHA-256 prefix.

### Internal links, redirects, and response behavior

- 100 unique same-origin HTML link targets discovered across the 96 sitemap pages were fetched; none returned 4xx/5xx.
- Two internal targets use non-trailing-slash forms (`/services` and `/resources`) and 301 to their slash URLs. This is minor link hygiene, not a newly established production regression.
- HTTP and `www` requests 301 to the canonical HTTPS non-`www` origin.
- A deliberately nonexistent URL returned 404.

## Local build and source verification

- `npm run build` exited 0, built 99 pages, created the sitemap, and ran `scripts/postbuild-aeo.mjs`.
- Running `node scripts/postbuild-aeo.mjs` independently also exited 0 with no validation failures.
- The build emitted a non-blocking SVG optimizer message, `Error parsing flag: Error: Duplicate id "Star-1"`; it did not fail the build or AEO validator.
- Local `dist/sitemap-0.xml` contains 95 URLs and 95 `lastmod` values. The only membership difference from production is live `/thank-you/`.
- Current source passes `noindex` to the `/thank-you/` layout and excludes `/thank-you/` from the Astro sitemap. The local artifact contains `<meta name="robots" content="noindex, nofollow">`.
- Production `/thank-you/` returns 200 without meta robots or `X-Robots-Tag` and is present in the sitemap. This is a verified source/build-versus-production mismatch.
- Raw HTML hashes differ for all 96 live/local pages, consistent with build/deployment transformation and current uncommitted source changes. Critical metadata counts and values match on representative routes; visible text matched exactly on `/` and `/resources/` but differed on `/services/ppc/`, `/water-damage-restoration/ppc/`, and `/schedule/`. Those broader differences are not classified as regressions because the working tree contains pre-existing uncommitted changes and no deployment identifier was available.

## Canonry evidence

- Read-only commands attempted: `cnry technical-aeo score`, `technical-aeo trend`, `google status`, `google coverage`, `google coverage-history`, `runs`, and `visibility-stats --last-runs 5 --by-provider`.
- The Canonry service was unavailable. `cnry serve` failed because the installed `better-sqlite3` package has no native binding for active Node `24.18.0` (`node-v137-win32-x64`). No current Canonry or GSC values were returned.
- No package reinstall, Canonry configuration change, sweep, probe, sync, or other quota-consuming operation was attempted.
- Consequently, the old 28-point cluster is not declared resolved in Canonry, and no mention/citation regression claim is made. Raw production evidence currently contradicts the old low-page-score signature.

## Findings and classification

### 1. `/thank-you/` intended exclusion is not live

Problem → A conversion-confirmation page is indexable and listed in production.  
Evidence → Live `/thank-you/` has no robots directive or `X-Robots-Tag` and is in the 96-URL sitemap; current source/build applies `noindex, nofollow` and excludes it.  
Expected impact → Prevent low-value confirmation content from entering search indexes and keep sitemap membership aligned with intended public landing pages.  
Recommended change → Use the normal operator-approved deployment path for the already-present source behavior; do not rewrite page content.  
Effort → Low deployment effort.  
Confidence → High; direct live/source/build mismatch.  
Verification method → After deployment, require live meta robots `noindex, nofollow`, absence from `/sitemap-0.xml`, successful build/postbuild, and a later non-mutating coverage check.

Classification: deployment/stale artifact with indexing impact.

### 2. Previous Canonry 28-point cluster is not reproduced in live HTML

Problem → Existing Canonry measurements conflict with current production signals.  
Evidence → All 96 sitemap pages expose the expected canonical, description, H1, JSON-LD, and shared entity; tested crawler responses equal normal responses.  
Expected impact → Avoid unnecessary sitewide content/schema work based on stale or parser-incompatible evidence.  
Recommended change → Restore the local Canonry runtime, then obtain operator confirmation for a fresh technical audit; make no content rewrite before that comparison.  
Effort → Low-to-medium tooling repair plus quota-confirmed recheck.  
Confidence → High for live HTML health; medium for the cause of the old Canonry score until rechecked.  
Verification method → Compare a new completed technical run with `d519ac38-b993-403b-b929-7066103e0723`, including page-factor details for the prior 50-page cluster.

Classification: Canonry measurement/tooling discrepancy; exact cause remains unknown.

## Backlog reconciliation

- SEO-001 updated in place to include the verified `/thank-you/` production mismatch and the current live-vs-Canonry evidence. Status remains Planned because deployment and Canonry recheck are pending operator action.
- SEO-002 updated in place to distinguish intended exclusions from the stale 43/51 GSC coverage baseline. Status remains Candidate because current URL-level coverage could not be read.
- SEO-003 unchanged: a real visibility sweep remains quota-consuming and was not authorized.
- SEO-004 unchanged: no page-specific content defect was established after live technical verification.
- No duplicate backlog items were created.

## Limitations and verification status

- Live production verification: complete for the checks listed above.
- Local build/postbuild verification: complete and passing.
- Production/source parity: key SEO/AEO signals verified on representative routes; `/thank-you/` mismatch confirmed; broader raw artifact differences remain unattributed because the worktree is dirty and no deployment identifier is available.
- Current Canonry technical/indexing/visibility evidence: blocked by the local native binding failure.
- Search/AI outcome comparison: not available; no fresh sweep or comparable measurement window was run.
- Pending operator-confirmed actions: deployment/CDN workflow, indexing/sitemap submissions, and any quota-consuming Canonry recheck.
