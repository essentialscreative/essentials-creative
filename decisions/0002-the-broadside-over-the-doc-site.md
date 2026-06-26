# ADR-0002 · The broadside over the docs site

- **Status:** Accepted
- **Date:** 2026-05-27
- **Supersedes:** ADR-0002-v0.2 (implied · the 7-chapter architecture)
- **Superseded by:** —

## Context

v0.1 produced 6 pages (`brand.html` · `language.html` · `kamon.html` · `matrix.html` · `templates.html` · `motifs.html`). v0.2 consolidated to 7 pages with a spine + 6 chapters. Both versions described the system without being it. They were design-system documentation, not design-system artifacts.

Research surfaced a pattern: the strongest identities (Stripe Press · Walker Art Center · Pentagram/MIT Media Lab · Sagmeister/Jewish Museum · Hanafuda itself) treat **constraint as identity**. The format of the documentation *is* the brand. Fragmenting kills the artifact.

## Decision

Replace the multi-page architecture with **one single-file artifact**: `system.html` — the broadside — twelve panels, each a notan-tested kappa-zuri composition delivering one piece of the system. Mitate-borrowed from the register of a 1920s Mingei catalogue × Edo *saijiki* almanac. Print-CSS outputs a 12-page A4 riso zine.

Supplementary working tools (`tokens.json` · `protocol.html` · `studio.html` · `decisions/`) live as separate files but **do not fragment the broadside itself**.

## Consequences

- The system is recognizable at a glance: one document, twelve panels, one continuous reading.
- Print and web are the same artifact in two media (web scroll = book scroll).
- Future principle drops must fold into the broadside, not spawn new pages.
- The cap is the cap: 12 panels matches the 12 months of the matrix — adding a 13th panel breaks the structural rhyme.

## What we considered and rejected

- **Multi-page docs site (IBM Carbon-style):** rejected — too generic, kills the print-object soul.
- **A Figma / Storybook component library:** rejected for now — not a product UI, no need for live component instances.
- **Splitting protocol into the broadside as a 13th panel:** rejected — protocol is governance, not visual identity; deserves its own document with the same discipline.

## Sources

- Stripe Press · [press.stripe.com](https://press.stripe.com/) · [Tyler Lasicki's homage](https://www.buildingsomethingold.tylerlasicki.com/p/stripe-press-an-homage-to-printed)
- Walker Art Center identity · Andrew Blauvelt · [andrewblauvelt.com/walker-art-center](https://www.andrewblauvelt.com/walker-art-center)
- Pentagram for MIT Media Lab · [designboom](https://www.designboom.com/design/the-new-mit-media-lab-identity-by-pentagram/)
