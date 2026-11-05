# Audit setup, costs and authorization — 2026-11-05

Matt approved **USD $5/day and $50/month for scan metered work only**. These are
hard admission ceilings in `budget-policy.mjs`, checked by both configuration and
the atomic ledger. Overrides can lower them; higher values fail closed. The
current deterministic HTML scanner makes no AI/provider API calls and has a
verified metered-provider maximum of **$0/scan**. This does not make hosting free.
No live-work, purchase, subscription, credential, DNS, OAuth, deployment or email
send permission follows from that budget approval. Matt subsequently authorized
a production page/example release. Live scanning/delivery stays held in
`release-policy.mjs` independently of environment flags; credentials, provider
charges and live work remain unapproved.

## What is already available

| Service | Evidence available in this task | What remains unverified |
| --- | --- | --- |
| Existing Netlify site | Repository release receipt identifies the existing R&R Marketing project; the Astro/Functions integration is local and builds | Actual plan, legacy/current entitlements, team balance/recharge, edge rules, secret settings and authority to deploy |
| Existing HubSpot account | Connected R&R Marketing portal read successfully; CONTACT read/write access is available | Product subscription, custom-property slots, service-key creation rights, billing/workflow effects and website runtime credentials |
| HubSpot audit fields | Complete read-only property discovery returned 297 properties and no `rnr_audit_...` fields | Two new dedicated fields must be approved/created for the current adapter, which requires the `rnr_audit_` prefix |
| Existing business mailbox | Connected mailbox identity matches the site's business email | It is not a configured transactional website sender or a deployable website credential |
| Database, Turnstile, transactional sender | No audit credentials are configured in this execution environment; repository records no database provisioning | No existing approved account/project/widget/sender was established through available evidence |

A bounded provider billing/welcome-email search in the connected business mailbox
found no account-plan evidence. That is not proof that accounts do not exist.
There is no connected Netlify/Neon/Supabase/Resend/Cloudflare administration tool
here. Do not run interactive login or create an account to fill that gap without
separate authorization. HubSpot also reports onboarding incomplete; it was not
started and no record or account setting was changed.

## Current published provider costs

Prices below were checked against official sources on 2026-11-05. They are
public plan prices, not verified charges on Matt's existing accounts. Taxes,
contract terms and unrelated usage can change the actual invoice.

| Component | Suitable starting option | Published cost / limits | Boundary |
| --- | --- | --- | --- |
| PostgreSQL | Existing approved writable database, or proposed Neon Free | Neon Free: $0, 100 CU-hours/project/month, 1 GB storage, 5 GB public egress | Exhausted free quota suspends compute; free overages are not billed. Account/project creation still needs approval. |
| PostgreSQL alternative | Supabase Free | $0, 500 MB database, 5 GB egress, two active projects; low-activity projects may pause after seven days | Keep audit tables in the private `rnr_audit` schema, outside exposed Data API schemas. |
| Bot protection | Cloudflare Turnstile Free | $0; unlimited challenge/verification traffic; 20 widgets/account, 10 hostnames/widget | New widget/secret needs approval; no Cloudflare DNS migration or proxy is required. |
| Transactional report email | Existing approved sender, or proposed Resend Free | $0; 100 emails/day UTC and 3,000/month, shared with other account sending/receiving; three verified domains | Free overages unavailable; exhaustion returns 429. Do not buy an upgrade. |
| CRM contact handoff | Existing HubSpot contacts API | Contact read/write scopes are available on all accounts; no upgrade needed solely for these scopes | Existing subscription/contact limits and workflows still determine actual billing effects. |

Database sources: [Neon plans](https://neon.com/docs/introduction/plans),
[Neon free quota behavior](https://neon.com/faqs/free-plan-limits-and-quotas),
[Supabase pricing](https://supabase.com/pricing).
Bot/email/CRM sources: [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/),
[Resend pricing](https://resend.com/pricing),
[Resend production use](https://resend.com/docs/knowledge-base/does-resend-require-production-approval),
[Resend quotas](https://resend.com/docs/knowledge-base/account-quotas-and-limits),
[HubSpot scopes](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/scopes).

Paid alternatives are **not authorized**: Neon Launch lists $0.106/CU-hour plus
$0.35/GB-month storage; 0.25 CU continuously active for 30 days calculates to
$19.08 compute before storage/other charges. Supabase Pro starts at $25/month
for one Micro project. Resend Pro starts at $20/month, with optional paid
overages. HubSpot transactional email is an unnecessary $600/month add-on
requiring an eligible paid Marketing Hub plan. These are alternatives for later
review, not selected services. [Neon pricing](https://neon.com/pricing),
[Supabase pricing](https://supabase.com/pricing), [Resend pricing](https://resend.com/pricing),
[HubSpot add-ons](https://legal.hubspot.com/hubspot-product-and-services-catalog/add-ons).

## Existing Netlify hosting is a separate decision

Current standard credit plans list Free $0/300 credits, Personal $9/month/1,000
credits, and Pro base $20/month/3,000 credits. Metering is 10 credits/GB-hour
compute, 2 credits/10,000 web requests, 20 credits/GB bandwidth and 15 credits
for a successful production deployment. Account-specific pricing may differ.
[Pricing](https://www.netlify.com/pricing.md),
[metering](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/).

Credit-plan background functions are supported, with a 15-minute limit; the
synchronous default is 60 seconds at 1 GB. Official legacy-plan documentation
conflicts about legacy Pro background support, so check actual account
entitlement before selecting that execution path.
[Background functions](https://docs.netlify.com/build/functions/background-functions/),
[current usage/billing](https://docs.netlify.com/build/functions/usage-and-billing/),
[legacy table](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-legacy-plans/legacy-pricing-plans/).

Auto-recharge and credit exhaustion apply to the **team**, not just one audit
project. Turning recharge off can pause every project, including the main site,
when credits run out. A second project on the same team is not billing isolation.
Ordinary edge rate limits are per IP/domain and can lag; alerts are not hard
dollar stops. Do not present the app's $5/$50 ledger as a total Netlify cap.
Verify isolation and acceptable main-site risk before enabling any public audit
traffic. [Billing FAQ](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/),
[recharge](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/configure-auto-recharge/),
[rate limits](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/).

## Concrete setup proposal, still requiring scoped authorization

1. **Hosting/account review:** inspect only the existing R&R Netlify project's
   plan, background entitlement, team usage/recharge and edge protections. No
   cost or setting change is authorized. Resolve isolation before deployment.
2. **Database:** reuse an approved suitable database if one is identified;
   otherwise propose **Neon Free, $0, no paid upgrade**. Separate approval is
   needed to create its persistent project and restricted runtime role/connection
   secret. It will hold public audit inputs/results and pseudonymous abuse/budget
   state, not prospect email/consent. Use the pooled TCP `pg` endpoint, verified
   TLS and the manual private-schema migration. Interactive transactions are
   required; do not substitute unrelated single HTTP queries.
3. **Turnstile:** propose Free on the exact main hostname, with a separate private
   staging hostname. Approval is needed for account/widget/key creation and
   server-side secret configuration. Cloudflare receives bot/device signals and
   the submitted remote IP for verification. Enforce hostname plus
   `website_audit`/`audit_report` action, freshness and single-use checks.
4. **Email:** propose Resend Free with an approved sender such as
   `R&R Marketing <audit@reports.remediationrestorationmarketing.com>`. This is a
   proposal, not a configured address. Approval is needed for the sender domain,
   exact provider-generated SPF/DKIM DNS records, and a domain-restricted Sending
   key. Never invent DNS values. Resend would receive the requested recipient
   email and report content. Keep paid overages/upgrades off and reject sends
   when the free account quota is exhausted.
5. **HubSpot:** use an existing appropriately scoped supported key if approved;
   otherwise the current simple REST option is a **Service Key**, not creation
   of a legacy private app (creation sunset October 26, 2026). Approve only
   `crm.objects.contacts.read` and `crm.objects.contacts.write` for this runtime.
   Separately approve creation of two distinct string/textarea fields:
   `rnr_audit_report_context` (latest requested report context) and
   `rnr_audit_marketing_request` (affirmative optional request only). Check
   available property slots first. No deal, subscription, schema-write or
   marketing permission belongs in the runtime key. The destination is the
   existing R&R Marketing portal and the person who explicitly requests a report.
6. **Pilot send:** only after the account, DNS, credentials and workflow checks
   pass, request approval for one report to the exact authorized pilot recipient
   and the corresponding create/update of that contact. Do not assume that an
   owner's email is permission to create a test lead or send a message. A Free
   sender can have $0 incremental message cost once its actual plan is verified;
   HubSpot downstream marketing/workflow billing still needs confirmation.
7. **Release:** separately approve publishing to the existing site, actual hosting
   charges and live work. Keep all launch flags false until the complete private
   staging evidence is reviewed. Do not publish a page presented as functional
   while the scan service is unavailable.

Key/sender sources: [Service Keys](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys),
[legacy private-app sunset](https://developers.hubspot.com/changelog/legacy-private-app-creation-sunset),
[Resend domain verification](https://resend.com/docs/add-a-domain),
[restricted sending keys](https://resend.com/docs/create-an-api-key).

API-created HubSpot contacts default to non-marketing, but existing workflows
or non-HubSpot form capture can change that and trigger billing/enrollment.
No `hs-scripts`, `hbspt` or `hsforms` embed was found in the inspected source;
production tag-manager/account behavior is still unverified. These effects must
be checked before any pilot, not assumed absent from API behavior alone.
[Default status](https://knowledge.hubspot.com/records/default-marketing-statuses-for-created-contacts),
[marketing-contact billing](https://knowledge.hubspot.com/account/understand-marketing-contacts-billing).

## Private staging preparation

`npm run audit:preflight` is a local presence/shape report. It prints variable
names and approved limits, never secret values, and makes no network calls.
Exit code 2 means required audit configuration is missing or invalid, including requested report configuration. It never
certifies provider readiness or permission to launch.

`node scripts/audit-test-postgres.mjs` is opt-in real PostgreSQL testing. It uses
an ephemeral local Docker database with no TCP/network exposure, private Unix
socket and temporary memory-backed data. It accepts no arbitrary remote database
URL and removes its own fixture afterward. This does not create a provider
account or persistent credential. Normal `npm test` skips that fixture-only suite.

Before enabling, staging must prove: real row-lock races and rollbacks; hard
daily/monthly admission saturation; duplicate/cache behavior; worker fencing and
outage handling; measured database/hosting resource usage; bot expiry/replay and
direct API bypass denial; no secrets or personal details in cached/public output;
then one explicitly approved email/CRM pilot with separate consent semantics.
No provider test, collection, send or deployment is authorized by this document.

## Measured PostgreSQL preparation

The opt-in harness passed 24 real PostgreSQL 17.11 checks. It uses local-only
Unix sockets, no container network/TCP exposure, and disposable in-memory data.
All fixture containers and state were removed afterward.

The original 250 × 16 KiB report fixture transferred 4,232,530 protocol bytes
per report read and generated 23,329,640 WAL bytes over five reads. Normalizing
reports and rate buckets reduced that report read to 17,122 bytes (99.6% less),
with zero WAL. A rate check transferred 442 bytes, readiness check 413 bytes,
and worker claim 127,361 bytes in this fixture. These are local measured
protocol sizes, not a cloud invoice or a future traffic forecast.

Schema version 2 uses private `rnr_audit` tables for control state, reports, rate
control and rate buckets. The migration atomically preserves known private v1
budgets/results, and refuses public legacy, orphaned or unknown layouts. Runtime
needs schema USAGE, SELECT/UPDATE on the two control tables, SELECT/INSERT/DELETE
on reports and SELECT/INSERT/UPDATE/DELETE on rate buckets. It needs no DDL or
control-row INSERT/DELETE. PUBLIC and existing anon/authenticated API roles have
no access. Never reset or restore old budget state without reconciling spending.

The local preview instead uses a single-process disk fixture store with normal
restart persistence; it is not distributed storage and cannot be used publicly.
Its development substitutions are documented in website-audit-local-preview.md.
