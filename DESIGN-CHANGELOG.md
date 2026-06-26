# Changelog · Essentials Creative Design System

All notable changes to this design system are recorded here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [SemVer](https://semver.org/).

The system itself is the broadside (`system.html`). The supplementary kit is `tokens.json`, `protocol.html`, `studio.html`, `decisions/`. This file is the printable folio insert for each riso run.

> Separate from the website's own `CHANGELOG.md` (which tracks `index.html`, `about.html`, etc.). This file tracks the design-system artifact only.

## [0.3.0] — 2026-05-28 · "the broadside"

### Added
- **`system.html` v0.3 (the broadside)** — single-page artifact, 12 panels, each a notan-tested kappa-zuri composition. Replaces the prior 7-page chapter architecture.
- **`tokens.json`** — DTCG-spec machine-readable token spine (ref/sys/comp three-tier).
- **`tokens.css`** — generated CSS equivalent (hand-maintained until Style Dictionary install).
- **`style-dictionary.config.json`** — build config for when `style-dictionary` is installed.
- **`protocol.html`** — the Hanga Protocol: contribution workflow grounded in sōsaku-hanga `jiga/jikoku/jizuri` + CARE Principles. Four license shapes; bright line on AI + Indigenous motifs.
- **`studio.html`** — matrix-cell → composition → print/SVG generator. The leap from chart to machine.
- **`DESIGN-CHANGELOG.md`** + **`decisions/`** — version history + ADR archive. Printed as folio insert each riso run.
- **Carved negative space (evenodd)** on Panel 11 motifs: mountain laurel, bat, cempasúchil, flame, spring.
- **Land-acknowledgment seal** on Panel 12 colophon (Tonkawa · Comanche · Lipan Apache · Coahuiltecan · Edwards Aquifer recharge zone).
- **Sketch-to-svg path note** in colophon naming `~/Tools/sketch-to-svg/` as the route from member hand-drawn marks to library entries.

### Changed
- **Grammar cap locked at 4 · 7 · 8 · 3** (4 operative concepts · 7 Zen disciplines · 8 procedural rules · 3 productive contradictions). The cap is the cap — see ADR-005.
- **The position statement** consolidated to the school sentence: *"a stencil-print school in the corridor, in the lineage from kappazuri through Mori Yoshitoshi and Takahashi Hiromitsu."*
- **Visual register** moved to a hybrid Mingei-catalogue × Edo-saijiki-almanac mitate — vertical reading rhythm, kanji folios, iki marginalia, datsuzoku rule-break per panel.

### Removed
- v0.2 chapter pages folded into the broadside. *Why:* see ADR-002 — Stripe Press / Walker prove the constraint *is* the brand.

### Honored absences (visible · waiting)
- Heritage motifs: Tenango · amate · maque · Sequoyah · Apache coil · Mon · Adinkra · Azulejo · Placa. Per Hanga Protocol Panel 06; replace via the four-step protocol when member-sourced and consented.

---

## [0.2.0] — 2026-05-27 · "synthesis · superseded by v0.3"

### Added
- 7-page chapter architecture: `system.html` spine + 6 chapters.
- Sōsaku-hanga · Mingei · Hisamatsu's 7 Zen disciplines · Ma · Iki · Notan · Mitate · the 3 productive contradictions · the Serizawa resolution.
- The 12 × 4 matrix · 48 cells.
- Kamon discipline applied to 24 motifs · 4 variations (basic / maru-ni / mitsu / chigai).

### Removed
- v0.1 pages.

---

## [0.1.0] — 2026-05-27 · "foundations · superseded"

### Added
- Initial palette · type pairing · 8 application recipes · 12×4 matrix · kamon library.

---

## Versioning policy

- **MAJOR** — fundamental shift in position, lineage, or technique. (Pre-1.0; major comes when the collective signs off in person.)
- **MINOR** — new motif, new ADR, panel-level addition, grammar refinement.
- **PATCH** — typographic fixes, motif carving improvements, copy edits.

## Cadence

The system is reviewed at each **solstice and equinox** (4× per year). Major changes batch to those dates; emergency patches anytime.

## How to amend (see ADR-006)

1. Open an issue · propose a change with reasoning.
2. ADR drafted if structural (touches grammar, lineage, technique, or protocol).
3. Collective review at next quarterly gather.
4. On acceptance: bump version, append here, commit ADR to `decisions/`, re-publish broadside.
