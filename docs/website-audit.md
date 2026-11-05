# Restoration website audit — local first version

The audit is integrated into the existing Astro site at `/website-audit/`, using
the shared site header/footer. It is linked from the desktop/mobile navigation,
footer and the first Resources entry. It remains `noindex` and excluded from the
sitemap while the live-service setup is incomplete. Existing booking and lead
flows are preserved; no marketing enrollment, deal creation or production setting
is changed.

## What works

- Responsive intake, queued/running/error states, an explicitly fictional sample,
  evidence, a readiness score, three next actions, and the existing booking link.
- HTML-only homepage review plus up to four relevant same-origin public pages.
  The scanner never runs page scripts, loads images/frames/CSS, clicks links,
  submits forms, calls phone numbers, or invokes AI. There are **zero AI tokens**.
- Evidence covers HTML call/contact paths, viewport markup, supplied service and
  location, visible trust wording, title/headings, and indexability
  hints. Unknown checks are excluded from scoring. Category scores have equal
  weight; this is a transparent readiness rubric, not a validated lead predictor.
- Optional full report email and HubSpot contact handoff adapters. The entire
  report is included in the email, including evidence and limits. A provider
  acceptance is described as accepted for delivery, never confirmed inbox receipt.

Visual mobile layout, actual button visibility, functional form submission, Core
Web Vitals, business legitimacy, certificate authenticity, rankings and lead
performance are not verified. Large, compressed-only, JavaScript-only or blocked
sites can return incomplete/unknown results. Strict same-host redirect scope can
also exclude a `www`/non-`www` redirect; the owner can enter the final hostname.

## Local review

```sh
npm run validate
npm run audit:preview
```

Open the printed localhost `/website-audit/` URL. The preview serves the built site with a functional local fixture API. Choose
one of three clearly fictional test sites: the real scanner reads up to five
local HTML pages, computes findings, queues/caches results, enforces persistent
quotas and saves complete reports to a local outbox. It never scans public
websites, sends email, writes to HubSpot or calls paid providers. No Docker,
cloud database, bot keys or email/CRM credentials are required.

Run `npm run audit:preview -- --fresh` for an independent fixture session, or
`npm run audit:preview:static` for the earlier sample-only server. The local
store writes only to a private OS temporary directory outside the checkout; its
path is printed. Production environments reject this adapter. See
[functional local preview](website-audit-local-preview.md) for transfer and Windows notes.

## Cost, concurrency and abuse boundary

The only production state adapter is PostgreSQL. Manually apply
[`schema.sql`](../netlify/functions/lib/audit/schema.sql) to a **dedicated** audit
database with an existing approved account. No database or paid resource has
been provisioned. The control-row `SELECT ... FOR UPDATE` transaction is intentional
at this pilot's volume: cache/deduplication, fresh quotas, queue admission and
worst-case daily/monthly budget reservation either commit together or fail.
There is no process-memory fallback. TLS certificate validation stays enabled.

Defaults are 3 fresh scans per IP and anonymous signed-cookie session per UTC
day, one active fresh job per session, 50 globally per UTC day, eight queued jobs
and two running jobs. Identical normalized website/service/area requests share
one queued/running job and reuse complete results for 24 hours. Cached reuse
does not consume another fresh-scan quota or reservation. IP/session quotas are
abuse controls, not proof of identity; changing networks or clearing cookies can
evade individual limits, while global limits still apply.

Submission endpoints additionally allow ten attempts/IP/minute, report endpoints
six attempts/IP/minute and three deliveries/IP/session per rolling 24 hours;
reads allow ninety/IP/minute. These limits are server-side and atomic. Only the
Netlify runtime `context.ip` is trusted; forwarded headers are not. Turnstile is
validated server-side for success, exact hostname, expected action, and freshness.
It must use actions `website_audit` and `audit_report`.

Budgets use integer **USD millionths**: 1 USD = 1,000,000 micros. Matt approved
**$5/day and $50/month for scan metered work** on 2026-11-05. Both configuration
and the ledger enforce those hard ceilings; overrides can only lower them.
The current non-AI HTML scanner has a verified metered-provider maximum of zero.
An email maximum is separately required when
delivery is enabled. Worst-case reservations precede work and include every
configured provider attempt. Email uses at most four CRM requests and one send,
with no automatic retry; reserve its entire worst-case cost. Provider acceptance
is not a cost receipt, so its full reservation remains spent against the caps.
The HTML scanner settles verified metered API cost at zero. Failed, ambiguous or
expired jobs keep their full reservation. There is no new paid-work path when
the store or budget cannot be verified.

**These are application API-spend limits, not an all-in hosting invoice cap.**
Netlify requests (including unauthenticated background invocations), database
transactions, traffic, email/CRM plan fees, and storage can have separate billing.
Before enabling, verify current provider plan support for background functions,
function execution limits (delivery can take about 25 seconds plus store time),
edge request limits, usage caps/alerts and a way to disable the pilot without
affecting the main site. If its hosting plan cannot isolate/cap this traffic,
move the audit endpoints to a separately capped project before public promotion.
Do not mark launch verified based only on unit tests.

Workers have signed short-lived invocation tokens and fenced 120-second leases.
They drain admitted jobs for up to 90 seconds. Each scan is capped at five pages,
twelve HTTP requests, three redirects per page, 400 KB/page, 1.5 MB total,
four seconds/request and fifteen seconds total. Unstarted queue admissions expire
after ten minutes; expired workers fail rather than retry. Later submissions
can wake remaining admitted work. Dispatch/provider errors never fall back to
unreserved inline work. An accepted queue entry is not a promise that a scan
will complete.

## Public fetching and personal details

Only HTTP(S) domain homepages are accepted; IP literals, explicit ports,
credentials and local/reserved hosts are rejected. Every connection and redirect
checks **all** DNS answers, rejects nonpublic ranges, then pins a validated address
while retaining the original TLS hostname. Secondary pages stay on the accepted
origin. There is no browser and therefore no uncontrolled browser subrequests.
Page text is data, never an instruction or generated HTML. Findings are rendered
through text nodes; email HTML escapes page text and validates link protocols.

Cache/control state contains audit inputs, public findings, HMAC IP/session
identifiers, and opaque delivery IDs, never prospect email addresses or consent.
Completed results are cached for 24 hours; control records have bounded capacity
and at most seven days' retention (expired results can be evicted sooner). Budget
counters outlive the relevant current accounting period. The cookie is signed,
Secure, HttpOnly and SameSite=Strict. Report reads require a signed capability.
Email links carry the capability in a fragment which is removed in the document
head before analytics; capabilities expire and should not be logged or shared.

Email details go directly to the configured email and CRM adapters only after
the visitor explicitly requests the report. Only a contact is created/updated;
unrelated properties and existing name/consent values are preserved. No deals,
subscriptions or workflows are invoked. Audit writes use **dedicated custom
properties** named `rnr_audit_...`; existing portal workflows must be checked to
ensure contact/property updates do not trigger undesired enrollment. An unchecked
marketing box makes no marketing request and does not revoke earlier consent.
An affirmative box records a request separately; it does not subscribe anyone.
Existing privacy documentation must be reviewed for these processors and retention
before launch. No legal-policy text has been silently changed.

## Configuration and launch gates

See [`website-audit.env.example`](website-audit.env.example). Supply values through
the host's separately approved secret settings; never commit real credentials or set them in
public Astro variables. The existing connected HubSpot tool is not a deployed
site credential and has not been treated as one. No persistent key was created.

1. The scan-work caps are approved at $5/day and $50/month. Confirm the separate
   infrastructure/hosting isolation, provider costs and any additional spend
   authorization. Budget approval does not approve purchases, credentials,
   deployment, live work or email sends. See [current setup/cost evidence](website-audit-setup.md).
2. Manually migrate dedicated PostgreSQL; restrict the app role to the audit table.
   Verify TLS, schema readiness, transaction locking with two real connections,
   commit-loss behavior and provider outage handling in a private staging setup.
3. Configure a production Turnstile widget restricted to the exact pilot hostname,
   a server secret and a random signing secret of at least 32 bytes. Verify replay,
   expiry, hostname/action mismatch and direct API bypass denial in staging.
4. Confirm authenticated Netlify background dispatch and queue draining, two-worker
   concurrency, lease expiry and daily/month budget saturation on that plan. Test
   mobile/desktop and a small set of owned/authorized sites. Do not submit forms
   or create test leads on third-party sites.
5. For email, verify an approved sender and existing Resend account; provide a
   scoped HubSpot contact credential, manually create two distinct multiline
   `rnr_audit_...` properties for report context and affirmative marketing request,
   and verify no portal workflow/deal/enrollment side effects. Confirm request
   consent, transactional wording and delivery using an authorized test recipient.
6. Only after those checks set `AUDIT_LAUNCH_VERIFIED=true` and `AUDIT_ENABLED=true`.
   Email additionally needs its own two enable/verified flags. Remove pilot
   noindex/sitemap exclusion and review promotional wording only in a separately
   reviewed launch change. Navigation and Resources links already expose the
   safely disabled page and its sample report in the local source. No deployment
   is part of this task.

If delivery times out or its final store acknowledgement is lost, the opaque
request remains reserved/failed and the same email/job is not sent again. Use the
Resend idempotency key `audit-report/<opaque request ID>` and provider logs to
reconcile it manually before any operator-authorized retry. Do not clear the
reservation or manufacture a successful delivery receipt.

## Existing-site integration — 2026-11-05

The tool is part of this repository, not a separate hosted site or Windows-only
application. The reported Windows compatibility error was in the Library transfer
helper's use of `os.setxattr`; the Astro page does not rely on that API.

The audit now uses the shared site header/footer, with a direct Website Audit
link in the desktop/mobile header, footer, navigation data, and first Resources
entry. The earlier standalone conversion header/footer was removed. Desktop
link spacing and audit header/scroll offsets were adjusted for the shared fixed
header. Existing `/schedule/` navigation and Google booking links are unchanged.

`npm run validate` passes with 175 tests, zero Astro errors and a successful
build. Local Chromium navigation from Home to the audit passed at 1440, 1280,
1024, 390 and 320 pixels. Resources and footer entry paths also passed. The
audit has one shared header/footer, an active navigation link, no horizontal
overflow, and report headings remain below the fixed header. The sample and
existing booking destination still work; scan/report endpoints remain disabled.
No third-party site, email, CRM or metered service was invoked.

Safest release sequence: review these local changes, then obtain explicit
approval before deploying them to the existing Netlify site. A first deployment
may keep all live flags false and show the sample. Enabling real scans requires
the approved budgets, dedicated database, bot protection and private staging
checks above; email/HubSpot additionally requires its separate provider and
consent setup. Do not enable a paid provider or create credentials as part of
source integration. No production deployment or configuration change occurred.

## Verification recorded for this build

On 2026-11-05, `ASTRO_TELEMETRY_DISABLED=1 npm run validate` passed: Astro check
had zero errors, all 175 tests passed, and the static build completed. Existing
unused/import/type hints remain outside this feature. Local Chromium review
passed seven flows: successful simulated scan/delivery, quota denial, email
failure, private report-link resume, and disabled/sample use at 1440px, 390px
and 320px widths. No horizontal overflow or page JavaScript errors were observed.
The browser's external requests were intercepted or blocked; no test lead,
email, paid scan or production request was created.

The accompanying tests cover hostile URLs/redirects/DNS rebinding, resource
ceilings, scoring/unknowns, concurrent cache/deduplication, quota and reservation
races, two workers, lease fencing, date boundaries, store unavailability/uncertain
commit, bot rejection, authorization, delivery consent and provider failures.
PostgreSQL protocol tests use injected clients; they are not a substitute for
the real database/Netlify staging checks above. Browser QA uses local pages and
intercepted test responses, never real CRM leads or emails.

Provider references: [Netlify background functions](https://docs.netlify.com/build/functions/background-functions/),
[Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/),
[HubSpot contacts](https://developers.hubspot.com/docs/api-reference/2026-03/crm/objects/contacts/guide),
[Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).
