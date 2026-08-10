# Canonry audit and easy-remediation plan

Date: 2026-08-10  
Project: `remediation-restoration-marketing`  
Domain: `https://remediationrestorationmarketing.com`

This plan now records both the audit and the local remediation pass. The source changes below are implemented and verified in the working tree; production deployment, CDN purge, and Google indexing requests remain external follow-up actions.

## Verified baseline

Technical AEO audit:

- Run: `d519ac38-b993-403b-b929-7066103e0723`
- Scope: 91 discovered, 91 audited, 0 skipped, 0 errored
- Aggregate: **55/100**, flat versus the 2026-07-23 score of 55
- Distribution: **50 pages at 28/100**; the other 41 pages range from 71–93
- The 50-page cluster is 9 `/services/` pages, 5 `/resources/` pages, 35 generated industry/service pages, and `/schedule/`

Weakest factors:

| Factor | Average | Affected pages | Interpretation |
|---|---:|---:|---|
| E-E-A-T Signals | 36 | 50 below full score | Authorship/trust signals are weak on the failing cluster |
| Definition Blocks | 35 | 62 | Many pages lack direct-answer headings and procedural structure |
| FAQ Content | 39 | 59 | FAQ detection/content is incomplete or not seen consistently |
| Structured Data | 41 | 62 below full score | Schema is not being recognized consistently across route families |
| Content Extractability | 43 | 91 | Boilerplate is high relative to page-specific copy |
| Content Freshness | 45 | 50 below full score | Dates/lastmod signals are incomplete or stale on the failing cluster |
| Schema Completeness | 45 | 50 | Organization/business graph is not scoring consistently |
| Citations & Authority | 49 | 52 | External authority is limited on the affected pages |
| AI Access Files | 59 | 52 below full score | AI-file signals are not being recognized consistently |
| AI Crawler Access | 60 | 52 below full score | Verify crawler-facing responses after parity is fixed |

Passing or nearly passing factors should not be reworked first: schema validity and snippet eligibility are 100; technical SEO is 82 and currently marked passing.

Search Console coverage, synced 2026-08-10:

- 94 URLs in the connected property
- 43 indexed, 51 not indexed, 0 deindexed: **45.7% indexed**
- The current aggregate reason is `URL is unknown to Google`; older per-URL records also contained crawled-not-indexed states, so inspect individual URLs before choosing a remedy.
- The connected GSC sitemap is `sitemap-index.xml`; Canonry audits the discovered `sitemap.xml`, which currently redirects to the same sitemap index.

The separate visibility sweep (`595fca88-de9d-474e-8854-f7319346e0b5`) exceeded Canonry’s 10-minute CLI wait window and was still running when this plan was created. Its results are intentionally not used as a new baseline. Use the last completed visibility run only for historical comparison.

## Important parity finding

Direct live checks found signals that the fresh Canonry page scores do not appear to see consistently:

- `/services/ppc/` and `/water-damage-restoration/ppc/` returned 200 with one H1, JSON-LD, canonical, `/llms.txt` and per-page Markdown links.
- Their per-page Markdown endpoints (`.../index.md`) returned 200 with `text/markdown`.
- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/sitemap-index.xml`, and `/sitemap-0.xml` returned successfully; the sitemap contained 91 URLs and 91 `<lastmod>` values.
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, and Bingbot, and includes a `Content-Signal` policy.
- `llms.txt` contains 157 words and `llms-full.txt` contains 424 words.

Because Canonry still scored representative pages at 28, this is a deployment/CDN/crawler-parity issue until disproven. Do not add duplicate schema or generic copy to all 50 pages before a Canonry request is confirmed to be reading the current deployment.

## Implemented locally

- Shared `dateModified` and sitemap `<lastmod>` now use the 2026-08-10 site-wide AEO refresh date.
- Canonical and per-page Markdown links are absolute, the footer brand typo is corrected, the logo alt text is descriptive, and the duplicated roof-damage entity name is fixed.
- The post-build validator now recognizes quoted and minified HTML attributes and checks canonical, Markdown, `/llms.txt`, JSON-LD, robots, and global AI-file output.
- The existing `MarketingFramework` is reused on the services hub and all nine manual service pages without duplicating their existing FAQ schema.
- The assessment page now generates its visible process steps, HowTo schema, visible FAQs, and FAQPage schema from shared arrays.
- The resource hub now includes the existing FAQ component, and the two previously FAQ-less articles now have page-specific FAQs and reviewed dates.
- `npm run build` passed; the independent artifact check covered 98 public HTML pages with 0 failures, 99 Markdown files, 96 sitemap URLs/lastmods, and reachable robots/llms files. `npx astro check` reported 0 errors.

## Remediation plan, ordered by ease and confidence

### P0 — resolve measurement and shared-render parity first

1. Capture the same representative URLs with a normal browser user agent, Canonry’s user agent, and `Accept: text/markdown`. Compare status, `ETag`, `Age`, content type, canonical, JSON-LD types, FAQ/HowTo markup, and body length.
2. Compare the deployed Netlify artifact with the local `dist/` output for `/services/ppc/`, one good generated landing page, one 28-point generated landing page, `/resources/`, and `/schedule/`.
3. Purge/redeploy the affected static routes if the CDN is serving an older HTML variant. Keep the existing Markdown endpoints and AI files; they are already reachable.
4. Harden `scripts/postbuild-aeo.mjs` so its canonical/alternate-link checks accept valid minified HTML attributes as well as quoted attributes. Add a rendered-page regression check for exactly one canonical, one H1, JSON-LD, `/llms.txt`, and the page-specific `.md` endpoint.
5. Re-run the technical audit and confirm whether the 50-page/28-point signature disappears. If it does not, treat the remaining result as a real template/content gap and proceed to P1.

### P1 — small, truthful code fixes

1. Correct the visible footer typo `Remediaton & Restoration Marketing` to `Remediation & Restoration Marketing` in `src/components/Footer.astro`.
2. Change the footer logo alt text from the generic `logo` to a descriptive brand label, or make it explicitly decorative if that is the intended accessibility choice.
3. Remove the duplicated `Restoration` in the `knowsAbout` value `Roof Damage Restoration Restoration Marketing` in `src/layouts/BaseLayout.astro`.
4. Keep the already-present `meta author`, canonical, shared entity graph, `/llms.txt` links, per-page Markdown generation, and crawler policy. Validate them in rendered HTML instead of adding a second implementation.
5. Make the freshness source explicit: use truthful page/content review dates for `dateModified` and make sitemap `<lastmod>` derive from the same data. Do not reset every page’s date merely to improve a score.

### P2 — reuse existing components on the actual failing templates

Only do this after P0 confirms the audit is reading the current HTML.

1. Reuse `MarketingFramework.astro` or a smaller shared equivalent on the 9 manual service pages and `/schedule/` where the content is genuinely instructional. It should provide a concise answer, three visible process steps, three relevant FAQs, and matching HowTo/FAQ schema from the same data—not generic filler.
2. For resource articles, use the existing frontmatter author/date/FAQ data to render page-specific FAQs and a visible reviewed/updated treatment where the source data supports it.
3. Do not add FAQPage or HowTo schema to legal/utility pages without matching visible content. Keep `/privacy/` and `/tos/` outside the sitemap, as the current Astro sitemap filter already does.
4. Preserve the generated landing pages’ existing page-specific framework; the source already includes it, so first verify deployment parity instead of duplicating it.

### P3 — indexing operations after the site is stable

1. Export the 51 not-indexed URLs and inspect representative examples from each current Google verdict.
2. Prioritize the homepage, `/services/`, the 9 service pages, industry hubs, the 35 low-scoring generated pages, and the 5 resources. Exclude `/admin/` and any URL intentionally removed from the sitemap.
3. After the parity/template fixes are deployed, submit the corrected sitemap and request indexing for priority URLs through Canonry/GSC. Do not spend indexing quota on pages whose deployed HTML has not yet been verified.
4. Recheck coverage after Google’s normal recrawl window and record the before/after counts.

## Defer as non-quick work

These are valid longer-term opportunities, but they require editorial or external evidence and should not be used as the first fix list: acquiring genuine reviews or credentials, adding 1,200-word expansions to every page, building eight-source authority sections, earning third-party backlinks, and provider-specific citation campaigns. The incomplete visibility sweep must also finish before changing the query basket or claiming new mention/citation performance.

## Verification gates

```text
npm run build
cnry technical-aeo run remediation-restoration-marketing --wait
cnry technical-aeo score remediation-restoration-marketing --format json
cnry technical-aeo pages remediation-restoration-marketing --sort score-asc --limit 200 --format json
cnry google coverage remediation-restoration-marketing --format json
cnry analytics remediation-restoration-marketing --feature gaps --window all --format json
```

Success for the easy-remediation phase means: the 28-point cluster is either gone or explained by a documented content gap; the rendered build checks pass; the sitemap/robots/Markdown endpoints remain reachable; and the next indexing/visibility read uses fresh completed evidence.
