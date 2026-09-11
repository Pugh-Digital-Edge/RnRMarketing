# Starwind UI integration

Implemented September 11, 2026.

## Installation

Installed `@starwind-ui/astro@1.2.1` and its matching Runtime through npm. These are the official Starwind UI primitives, styled by the local wrappers in `src/components/starwind`. This follows the [primitive-package installation](https://starwind.dev/docs/getting-started/primitives/), rather than the Tailwind 4 styled-component registry setup.

Starwind requires Astro 5 or newer. Updated Astro to 5.18.2, the existing Tailwind integration to 6.0.2, and astro-breadcrumbs to 3.4.2 for compatible peer dependencies. Kept Tailwind 3 and the existing Less theme. There is no React dependency or new global CSS reset.

## Selected and implemented components

| Component | Why it fits | Where implemented |
| --- | --- | --- |
| Accordion | Long FAQ lists benefit from clear disclosure states, accessible heading/button relationships, and keyboard navigation. | Shared FAQ component, including home and service pages. Uses existing questions, answers, and schema source. |
| Input | Repeated lead fields need consistent focus and invalid states while preserving native form semantics. | Homepage territory form, contact page, and chat form: name, email, phone, ZIP where applicable. |
| Button | Shared submit controls need consistent focus, disabled, and busy states. | All three forms above. Submission announces sending and clears busy state afterward. |

Wrappers use the site's existing color and typography tokens. Native links remain links. Native country selects and textareas retain their existing behavior. Dialogs, carousels, and tabs were not selected: these flows do not need additional overlays or hidden service content.

## Behavior and maintenance

- Starwind owns accordion expansion, panel visibility, and ARIA state. The local wrapper adds optional arrow/Home/End focus navigation; Tab and Enter remain native.
- FAQ answers remain present and visible in server-rendered HTML before JavaScript initializes. The first answer is expanded on initialization, and multiple answers can stay open.
- Input and Button wrappers forward native props and existing CSS classes to the actual elements.
- Existing form names, field names, honeypots, phone validation, and submission endpoint are preserved. The chat status element now exposes the shared form-status hook.
- Runtime and adapter updates come through npm. These custom wrappers are maintained in the repository; they are not CLI-generated styled components.

## Verification

- Build: 103 pages; 98 sitemap URLs.
- Existing regression suite: 13/13 passing. Async-submit test now also verifies disabled and busy state.
- Local technical scan: 98 pages and 100 internal links checked, no errors; canonical, indexability, structured-data and sitemap checks pass.
- Browser: desktop 1410px and mobile 390px inspected; no horizontal overflow on checked home/contact routes.
- FAQ: click/Enter toggle, ArrowDown focus movement, End navigation, expanded/hidden state verified.
- Forms: invalid phone shows error and disables submission; valid phone clears error state and enables submission. No real lead was submitted.
- No production deployment or live ranking-impact claim. Production parity must be checked after deployment.
