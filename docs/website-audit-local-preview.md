# Functional local preview

The existing Astro/Netlify stack supports the audit. Astro serves the page and
client UI; Node-based Netlify Functions run the scanner and job APIs. Production
needs durable shared state and verified provider/account settings, not a different
frontend stack. The current page/example production release is held from live
scanning and delivery by a versioned server policy, independent of environment
flags. No production provider setup follows from the $5/day/$50/month cap approval.

## Run from the repository

```sh
npm run build
npm run audit:preview
```

Open the printed `http://127.0.0.1:4322/website-audit/` URL. Stop with Ctrl+C.
Use `npm run audit:preview -- --fresh` for a new independent fixture session,
preserving the old one, or `--port 4323` when another preview uses the port.

## Run independently on Matt's PC

The transferable bundle includes the compiled page/assets and one bundled Node
server. Download the native Library ZIP in the authenticated browser and extract
it into a **new folder outside the existing checkout**. With Node installed:

```sh
node preview/start-preview.mjs
```

Windows can instead double-click `preview/start-preview.cmd`. No `npm install`,
Docker, cloud database, keys, subscriptions or account changes are needed to run
the bundle. Node 22+ is recommended. The Windows storage branch has tests; native
Windows execution has not been verified from the Linux cloud environment.

The earlier Windows Library transfer helper failed because it used the POSIX
`os.setxattr` API. That is not an Astro/Netlify compatibility issue. This preview
does not call that API or require the helper. Direct native Library download and
normal ZIP extraction are a supported transfer option. The helper was not patched
and its error was not ignored. A download/extraction on Matt's computer is still
required unless an independently authorized supported desktop transfer is used.

## What is real, and what is substituted

| Flow | Local behavior |
| --- | --- |
| Page, inputs, queue, cache, quotas, scoring and evidence | Actual client/server implementation |
| Website retrieval | Three explicitly fictional sites whose local HTML is fed through the real bounded scanner; no internet/DNS retrieval |
| Input effects | Changing service/area changes the actual checks against fixed fixture text; report findings are computed |
| Persistence | Private disk snapshot outside the checkout; cache/quota/reservation state survives normal restart |
| Bot protection | Host/Origin/CSRF checks for a loopback-only app; no claim of real Turnstile verification |
| Full report | Saved locally as a complete outbox report; never described as an email delivery |
| Email, HubSpot and marketing | No external call, send, contact mutation or enrollment |
| Production database | Separately tested on disposable real PostgreSQL; no provider database has been created |

The ready fixture scores 100 from its observed HTML, the gaps fixture scores 52,
and the restricted fixture is unscored because some categories cannot be checked.
Unknown/public URLs are rejected. This preview cannot audit an arbitrary business
website; enabling that production path still requires the documented gates.

The server binds only to `127.0.0.1` and rejects alternate Host/Origin and missing
CSRF tokens. Browser external scripts/connections are blocked. Public pages cannot
use the local UI mode; the disk adapter rejects production/Netlify/Lambda. It is
not a fallback for missing PostgreSQL. Local fixture signing state is private
runtime data, not a provider credential, and is excluded from Git and the bundle.

The local store is one process at a time, with an exclusive lock and atomic file
replacement. Corrupt/uncertain state is never silently reset. Windows uses file
sync/replace and user-temp ACLs without POSIX directory operations; POSIX uses
additional directory sync/mode checks. Use a fresh fixture session after an
unclean shutdown/stale lock rather than deleting unknown state or stealing locks.

To create a fresh independent bundle after building:

```sh
npm run audit:package-local
```

It writes a new review directory outside the checkout and prints its path. No
production, provider or account operation is performed by packaging.
