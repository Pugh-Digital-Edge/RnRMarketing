# UI component standards

The site uses native Astro components and CSS rather than adding a React component runtime.

## Selected patterns

- **shadcn/ui:** semantic tokens, consistent control sizing, restrained radii, surface borders, and visible `:focus-visible` states. This is the foundation for buttons, fields, cards, and navigation.
- **beUI:** spring-like press and hover feedback. Applied selectively to actions and interactive surfaces so motion communicates state instead of becoming decoration.
- **transitions.dev:** origin-aware disclosure motion. Applied to the existing native FAQ/details pattern and the navigation dropdown so the interaction remains accessible and progressively enhanced.
- **beautifului.dev:** use as a visual reference for polished marketing composition, not as a global component source.
- **Rare UI:** reserve distinctive effects for product-specific moments. Avoid applying novelty effects to a conversion site where they would compete with proof and calls to action.

## Reusable vocabulary

- `.cs-button-solid`: primary action primitive.
- `.ui-card`: shared surface primitive for proof, service, article, and case-study collections.
- `.ui-link-arrow`: compact directional link primitive.
- `input`, `select`, `textarea`: shared control primitive with a 52px touch target, semantic focus ring, placeholder contrast, and disabled state.
- `details > summary`: accessible disclosure primitive with shared open-state and entrance motion.

The component language preserves the existing Cobalt Tile Hall brand: cobalt for action and proof, chalk surfaces for explanation, ink navy for structure, and mustard only as directional signal.
