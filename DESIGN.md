---
name: Remediation & Restoration Marketing
description: A proof-led visual system for restoration companies that want a clearer path from visibility to booked work.
colors:
  primary: "#0b4aa2"
  primary-light: "#23c6d5"
  primary-dark: "#071a42"
  signal: "#efb43f"
  surface: "#fbfcf8"
  surface-muted: "#edf2f5"
  text: "#42516a"
  border: "rgba(8,22,50,.16)"
typography:
  display:
    fontFamily: "Poppins, Arial, sans-serif"
    fontSize: "clamp(3rem, 7vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Poppins, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Poppins, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Poppins, Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  sm: "0.35rem"
  md: "0.65rem"
  lg: "1.1rem"
spacing:
  sm: "0.75rem"
  md: "1.5rem"
  lg: "clamp(4.5rem, 8vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "1.15rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.sm}"
    padding: "1.15rem 1.5rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "1.5rem"

# Design System: Remediation & Restoration Marketing

## Overview

**Creative North Star: "Cobalt Tile Hall"**

The site treats restoration marketing like a working signal system: cobalt fields carry the promise, chalk surfaces carry the explanation, and mustard marks show where to act. A fine tile-seam grid gives the pages a repeatable material language without turning the interface into a decorative pattern exercise.

The system is confident, direct, and evidence-led. Large Poppins headlines create the first read; compact uppercase labels create orientation; rectangular actions and framed proof panels make the next step feel concrete. The visual world is intentionally distinct from a generic blue-agency card wall while preserving the existing content, routes, forms, and conversion paths.

**Key Characteristics:**

- Cobalt-first hero fields with quiet grout-line geometry.
- Chalk-white reading surfaces and ink-navy typography.
- Mustard used as a scarce directional signal.
- Whole-tile transitions, rectangular controls, and proof-led framing.

## Colors

The palette is a high-contrast blue-and-chalk system with a cyan lift for active moments and a restrained mustard signal for navigation and section punctuation.

### Primary

- **Cobalt Signal** (#0b4aa2): Primary action, active navigation, gradients, and the core brand field.
- **Cyan Lift** (#23c6d5): Button hover, proof numerals, and the energetic edge of the system.
- **Ink Navy** (#071a42): Header strip, footer, dark content sections, and deep text contrast.

### Secondary

- **Mustard Signal** (#efb43f): Active underlines, hero rules, and small directional accents only.

### Neutral

- **Chalk White** (#fbfcf8): Main reading surfaces and light cards.
- **Mist Surface** (#edf2f5): Quiet section contrast and input fields.
- **Slate Text** (#42516a): Body copy and supporting content.
- **Soft Border** (rgba(8,22,50,.16)): Structural framing for cards, fields, and proof panels.

### Named Rules

**The Signal Scarcity Rule.** Mustard is a directional signal, not a fill color for whole sections.

**The Cobalt Field Rule.** Dark cobalt is reserved for promises, proof, and decisive conversion moments.

## Typography

**Display Font:** Poppins (with Arial, sans-serif fallback)

**Body Font:** Poppins (with Arial, sans-serif fallback)

**Character:** A heavy geometric display voice gives restoration operators a decisive first read. Generous body leading and compact labels keep the density practical rather than theatrical.

### Hierarchy

- **Display** (800, `clamp(3rem, 7vw, 6.5rem)`, 0.96): Hero promises and proof-led headlines.
- **Headline** (800, `clamp(2.25rem, 5vw, 4.5rem)`, 1.05): Section introductions and major page titles.
- **Title** (700–800, responsive): Cards, forms, and route-level subheads.
- **Body** (400, 1rem, 1.75): Explanations and supporting proof; keep lines comfortably readable.
- **Label** (700, 0.72rem, 0.16em, uppercase): Eyebrows, metadata, and section orientation.

### Named Rules

**The Big Promise Rule.** Let the first viewport state the value plainly before secondary explanation begins.

**The Label-as-Coordinate Rule.** Uppercase labels should identify the panel or evidence window, not compete with the headline.

## Layout

The page grid uses a centered max-width container with generous vertical section rhythm. Heroes are full-bleed fields with internal alignment; reading sections use light surfaces, framed cards, and two-column compositions that collapse to one column at mobile widths. The tile seam background is a quiet alignment cue: it should remain subordinate to text and imagery.

Desktop pages use wide asymmetry where proof benefits from a separate evidence board. Mobile pages center the reading order, stack panels, keep actions full-width when useful, and preserve the dark hero field without forcing horizontal scroll. Navigation becomes a compact header control at the existing breakpoint.

## Elevation & Depth

Depth is a hybrid of tonal layering and restrained structural shadows. Dark cobalt fields create the main depth shift; borders define evidence surfaces; shadows lift cards only enough to separate them from chalk backgrounds. Hover states add a small upward movement and a stronger shadow rather than relying on glow.

### Shadow Vocabulary

- **Quiet lift** (`0 0.35rem 1.2rem rgba(8,22,50,.10)`): Resting cards and forms.
- **Active lift** (`0 1rem 2rem rgba(8,22,50,.18)`): Hovered cards and conversion surfaces.
- **Inset seam** (`inset 0 0 0 1px rgba(255,255,255,.12)`): Dark proof boards and hero framing.

### Named Rules

**The Structural Lift Rule.** Shadows support hierarchy; they do not turn every component into a floating pill.

## Shapes

Controls and cards use gently squared corners: 0.35rem for actions, 0.65rem for normal cards, and 1.1rem for large feature surfaces. Borders are thin and quiet on light surfaces, brighter on dark proof boards. Rectangular buttons carry the system's working, operational tone; pill-shaped controls are reserved for the existing chat affordance.

## Components

### Buttons

- **Shape:** Gently squared corners (0.35rem), uppercase labels, tracked text.
- **Primary:** Cobalt-to-cyan gradient with chalk text; generous touch padding and a clear arrow or action phrase.
- **Hover / Focus:** Cyan lift, slight upward movement, stronger shadow, and a visible keyboard focus ring.
- **Secondary:** Framed or transparent actions remain subordinate to the primary assessment path.

### Cards / Containers

- **Corner Style:** 0.65rem for standard cards; 1.1rem for feature surfaces.
- **Background:** Chalk or mist on light sections; transparent/framed on cobalt sections.
- **Shadow Strategy:** Quiet lift at rest, active lift on hover.
- **Border:** Soft structural border; brighter single-pixel frame on dark proof panels.
- **Internal Padding:** 1.5rem baseline, expanding with the section rhythm.
- **Service Grid Exception:** The homepage service panel owns the frame; its interior service cards stay borderless and rely on spacing, icon blocks, and hover lift for separation.

### Inputs / Fields

- **Style:** Mist or chalk field, soft border, 0.35rem corner, practical label above.
- **Focus:** Cobalt border with a restrained outer ring.
- **Error / Disabled:** Preserve native semantic states and never rely on color alone.

### Navigation

The header is a chalk navigation band below an ink-navy information strip. Links use ink navy, active links use cobalt plus a mustard underline, and the assessment button stays rectangular and high contrast. Mobile collapses into the existing menu control while preserving the same active-state colors.

### Proof Panels

Case studies use an evidence-board composition: oversized reported metrics, a compact reporting-window label, framed charts, and explicit “reported, not promised” context. Whole panels recompose at mobile rather than squeezing columns into unreadable fragments.

## Do's and Don'ts

### Do:

- **Do** use dark cobalt to introduce a promise, mechanism, or proof moment.
- **Do** keep actions rectangular, specific, and easy to find.
- **Do** use mustard sparingly as the page's directional punctuation.
- **Do** frame metrics and reporting windows so the proof reads as accountable.
- **Do** center mobile reading order and preserve comfortable touch targets.

### Don't:

- **Don't** turn every surface into a card or every action into a pill.
- **Don't** use decorative imagery that competes with the restoration-specific message.
- **Don't** let the tile grid overpower copy, evidence, or form completion.
- **Don't** introduce a second accent color without a clear signal role.
- **Don't** remove the existing routes, forms, analytics, or accessibility behavior when extending the system.
