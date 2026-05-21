# Uniform gallery format

All image grids that should look consistent use **`gallery-uniform.css`** plus the class **`gallery-uniform`** on the same element as **`gallery-grid`**.

## Markup

```html
<link href="assets/css/gallery-uniform.css" rel="stylesheet" />

<section
  class="gallery-grid gallery-uniform"
  id="photography-gallery"
>
  <!-- .gallery-item.lightbox-trigger × N -->
</section>
```

## Defaults

| Token | Value |
|--------|--------|
| Max width | 1200px |
| Min column | 300px |
| Gap | 1.5rem |
| Tile aspect | **4:3** |
| Image fit | `cover` (fills tile) |
| Radius | 12px |

## Modifiers

Add next to `gallery-uniform`:

- **`gallery-uniform--natural`** — No cropping; card height follows image (e.g. NODE projection portfolio).
- **`gallery-uniform--square`** — **1:1** tiles instead of 4:3.

## Pages using this system

- `photography.html`, `design.html`, `rhizomatic.html`, **`node.html`** — standard **4:3** grid (uniform tile size; mixed orientations are cropped with `cover` for a clean grid).
- `video.html` — embed-based video sections (not the uniform image grid); other gallery pages use standard **4:3** for stills.
- **`installations.html`** — image-only **4:3** grid (badges / card copy removed).
- Optional **`gallery-uniform--natural`** — only if you want variable tile heights and no cropping (can look uneven with mixed portrait/landscape).

## Files

- Stylesheet: `assets/css/gallery-uniform.css`
- Legacy rules in `main.css` (`.gallery-grid` / `.gallery-item`) still apply on pages **without** `gallery-uniform`; uniform pages override via higher specificity.
