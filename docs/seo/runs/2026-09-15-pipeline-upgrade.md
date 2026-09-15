# SEO pipeline upgrade — 2026-09-15

## Authorization and scope

Matt requested implementation of the pipeline assessment fixes and explicitly retained one new article per week. SEO-013 records this operational intervention. The mold-remediation guide, accepted live September 15, satisfies the September 14–20 article obligation; this upgrade does not publish another article or change page copy.

## Baseline

- Four independent project jobs: weekday production check, Monday opportunity queue, Monday article and monthly review. September 14 records showed overlapping writers.
- No native Canonry data-refresh, answer-visibility or site-audit schedule for remediation-restoration-marketing.
- GSC data ended August 22; GA4 was disconnected. Latest visibility remained September 10, 6/42 query-level Mention Coverage, 7/33 non-brand Mention Share and 3/42 query-level Citation Coverage. Latest technical score was 90/100 over 100 audited pages; no new sweep or audit was needed for today's workflow setup.
- The article validation gate had failed on 11 Accordion import/type errors. Production had 99 technically healthy sitemap pages.

## Changes applied

| Component | Result |
| --- | --- |
| Native data-refresh | Enabled daily 06:00 Eastern; ID 2bada63e-b9bb-4c96-8d80-47facef8c2e8. |
| Native answer visibility | Enabled Sunday 18:00 Eastern, existing 42-query basket and Gemini/OpenAI/Claude; ID e26e00cf-4d51-4076-865a-3ed7c845150e. |
| Native technical audit | Enabled Sunday 19:00 Eastern; ID 6790f69e-abe7-48ba-9ea4-9985e0c6f2f5. |
| Weekly coordinator/article | Existing article automation retained and updated; Monday/Wednesday/Friday 09:30 Eastern. Exactly one new article per calendar week, with recovery runs and no duplicate publication. Opportunity selection and handoff now occur within this job. |
| Standalone opportunity queue | Paused; responsibility moved to the coordinator. |
| Daily health/measurement | Existing weekday 08:00 job updated to use auto smoke/full verification and due-date measurements. No repetitive full-crawl reports on unchanged days. |
| Monthly review | Retained first-of-month 10:30 schedule; synthesizes measurements already performed when due. |
| Daemon availability | Current-user Windows task `Codex Canonry Health` at logon and every 15 minutes. Checks health and starts only if unavailable. Old daily LLM `serve` job paused. |
| GA4 | User completed analytics.readonly OAuth. Verified RnRMarketing property 543995602 from the user's Analytics UI and connected it; stream G-4K4H62DJ77. |
| Repository coordination | Shared Git-common-directory lock with unique owner token and no automatic stale-lock stealing. All writing automation prompts use it. |
| Validation | Aliased the imported Starwind Accordion to remove its name collision with the wrapper. Added one `npm run validate` gate; rendering and disclosure behavior are unchanged. |
| Deployment identity | Postbuild now emits a source-commit receipt at `/build-info.json`, with no-store and noindex headers. The checker records the deployed commit and rejects missing or mismatched site/build revisions; documentation-only commits are compared by their unchanged site inputs. |

The Analytics Admin property-list endpoint returned 403 after OAuth, while the UI verified the exact property and the Analytics Data API accepted that property's connection and sync. No credential changes or broader scopes were used. Property-list enumeration remains a limitation, but the selected property's data reads work.

## Immediate verification

- GSC repair sync `45dbb4c1-a2d2-40d4-9cf3-bbe30374151a` completed. Stored data now ends **September 13**, two days before this run. The current 30-day property window is August 15–September 13: 12,773 impressions and 9 clicks. This is a fresh baseline, not a comparison proving the upgrade improved traffic.
- GA4 initial 60-day sync completed at 15:58:04 UTC: 322 traffic rows, 12 AI-referral rows and 2 social-referral rows. Acquisition and landing-page-attributed lead datasets both report ready. Counts are stored rows, not sessions or leads. QA/test campaigns are visible in Analytics and must be excluded from business conclusions where filtering supports it.
- `npm run validate` passed: **zero Astro errors, 19 passing tests**, production build and bundled postbuild AEO checks passed. Existing hints/SVG warnings remain non-blocking.
- Tests cover exclusive concurrent lock acquisition, wrong-owner release rejection, canonical/robots/H1/schema regression detection, equivalent HTML entity encoding, and due-date selection that ignores old historical checkpoints.
- Full checker completed at **16:03:36 UTC**: **99/99 sitemap pages**, 101 normalized same-origin navigation targets, 99 advertised Markdown alternates, matching local/live SEO signals and access artifacts, canonical redirects, expected noindex exclusions, 404 behavior and representative normal/CanonryBot response parity. Zero failures.
- The checker initially reported 15 description differences caused only by `&#38;` versus `&amp;`. HTML-entity decoding resolved the false positives; a regression assertion covers this case. It does not discard genuine title/description differences.
- Auto checker completed at **16:04:46 UTC** in smoke mode: **5 representative pages**, no rebuild, zero failures. Full baseline only advances after a passing full check.
- Windows watchdog executed successfully with `LastTaskResult=0`; a healthy daemon was left running. Startup from a stopped daemon was not forced because restarting a healthy service is unnecessary.
- Due-date scan correctly identifies September 18/21 work. Added explicit current dates to SEO-002 (September 25) and SEO-003 (September 21), preserving historical notes.

## Records and boundaries

The authoritative workflow is [pipeline.md](../pipeline.md). Original automation prompts and the pre-existing dirty backlog were backed up under the local Git common directory's `seo-pipeline/` folder. Runtime checks also live there; they are not published site content.

Pre-existing September 15 production-regression/backlog changes are preserved separately. A focused commit contains only this upgrade's files and backlog additions. No indexing submission, sitemap submission, discovery, extra visibility sweep, synthetic lead, advertising mutation or page-copy rewrite occurred.

## Acceptance checkpoint

Keep SEO-013 Measuring until the first unattended cycle is observed on **September 21**: daily sources remain fresh, September 20 sweep/audit complete, one article is delivered for the new week, due measurements use complete post-live windows, and no competing writer acquires the lock. The manual checks above establish immediate functionality, not future scheduler reliability or SEO impact.
