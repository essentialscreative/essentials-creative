# Magnificent Monstera — poster comps

Four 18 × 24 in directions for a *Monstera deliciosa* print. Not site content —
`/design-source/*` is 404'd in `netlify.toml` and disallowed in `robots.txt`.

| Artboard | Direction | Register |
| --- | --- | --- |
| `Main.dc.html` | A · Kappazuri | base notan — sumi + aijiro, shu spark |
| `DirectionB.dc.html` | B · Rhizo Land | `[data-theme="rhizo-land"]` — devotional frame |
| `DirectionC.dc.html` | C · Rhizo Water | `[data-theme="rhizo-water"]` — botanical plate |
| `DirectionD.dc.html` | D · Kira Kira | `[data-theme="kirakira"]` — prismatic |

All four share one leaf drawing so they differ on register, not draughtsmanship.

## Rebuilding the leaf

`gen-leaf.mjs` emits the blade outline, the fenestration cuts and the venation
as SVG path data. The cuts ride an SVG `<mask>`, so a marginal split's mouth can
open past the blade edge without painting anything outside it.

```
node gen-leaf.mjs > leaf.json
```

The paths are then inlined in each `.dc.html`. To change the leaf, edit the
`splits` / `windows` tables in `gen-leaf.mjs`, regenerate, and replace the four
`d="..."` values in each artboard (blade, cuts, veins, petiole).

## Notes

- Copy is real botany. Anything in `[brackets]` is a placeholder — edition size,
  paper, plate number.
- Type is Space Grotesk / Archivo Black / Instrument Serif / Bricolage Grotesque
  standing in for **Apercu**, which the canvas environment cannot load. Swap to
  Apercu (`tokens.css`) before any real output.
- Canvas: https://claude.ai/code/artifact/aeadaee5-c85f-4b3d-8dd1-0149a656b431
