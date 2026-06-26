# ADR-0005 · The AI bright line

- **Status:** Accepted
- **Date:** 2026-05-28
- **Supersedes:** —
- **Superseded by:** —

## Context

By 2026 Q2, AI vector-generation tools have matured: Recraft V4 produces real SVG output with editable Béziers; Adobe Firefly Design, Figma AI's Make/First Draft, Galileo, and Vectorizer.AI are all production-ready. These could plausibly accelerate motif library growth.

But the library includes (and will include more of) **Indigenous-attributed motifs** that are subject to CARE Principles for Indigenous Data Governance — particularly **Authority to Control**: the right of Indigenous peoples to control how data and visual material from their nations is created, used, and circulated.

An AI trained on scraped Tenango embroideries, amate cuts, or any Indigenous visual tradition cannot consent to its training; the originating nations cannot consent to their likeness becoming a stylistic option in a tool.

## Decision

**The bright line:**

- **AI is permitted as a tool** for: sketch-to-SVG vectorization of contributor's hand-drawn marks; composition stubs (layouts, scale, halftone fields); abstract pattern fills; font discovery; color-pair contrast checking; background removal. Always with a human at the carve step.

- **AI is forbidden as an author** for: any Indigenous-attributed motif (Otomí · Purépecha · Apache · Cherokee · Tejano · Tonkawa · Coahuiltecan · Comanche · Lipan Apache · Mexica · Maya · or any Indigenous tradition). "In the style of" prompts targeting any Indigenous tradition. Any sacred or ceremonial form, from any tradition, ever.

This is documented in `protocol.html` Panel 05.

## Consequences

- Motif library growth on Indigenous-attributed cells is **gated by member contribution** — the SLOTS fill only via the Hanga Protocol's four steps.
- Motif library growth on system-original, abstract, and Tejas-native (place-based) cells *can* use AI assistance at the vectorize/refine step.
- This restricts the system's growth speed and that's the point — speed is not the value; consented relationship is.

## What we considered and rejected

- **"Cite the source training data"** — rejected; doesn't solve consent.
- **"Use only AI tools trained on permissively licensed data"** — rejected; few tools document training data with sufficient specificity, and CARE Authority-to-Control is a higher bar than CC licensing.
- **"Distinguish by 'sacred' vs 'decorative'"** — rejected; that distinction is not ours to make for someone else's tradition.

## Sources

- CARE Principles for Indigenous Data Governance · GIDA (2020) · [datascience.codata.org/articles/dsj-2020-043](https://datascience.codata.org/articles/dsj-2020-043)
- Indigenous Data Sovereignty Network · [usindigenousdata.org](https://usindigenousdata.org/)
- "Making Kin with the Machines" · Lewis, Arista, Pechawis, Kite (2018) · [jods.mitpress.mit.edu/pub/lewis-arista-pechawis-kite](https://jods.mitpress.mit.edu/pub/lewis-arista-pechawis-kite)
