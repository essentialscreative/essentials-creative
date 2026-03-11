# PROJECT STRUCTURE MANIFEST
**Essentials Creative Portfolio - Production Files**
**Version 2.0 - Post-Refactor**
**Date: February 14, 2026**

## 📁 Directory Structure Overview

```
DEPLOY_TO_NETLIFY/
├── assets/
│   ├── css/          [9 production files]
│   ├── js/           [6 production files]
│   ├── fonts/        [Apercu font family]
│   └── images/       [277 images including botanical heroes]
├── dev/              [86 archived test/backup files - EXCLUDED from deployment]
├── *.html            [Core HTML pages]
├── .gitignore        [Excludes dev/ and test files]
├── CSS_LOCK.md       [CSS variable documentation]
├── STRUCTURE_MANIFEST.md [This file]
└── DEPLOYMENT_CHECKLIST.md [Pre-deployment validation]
```

---

## 🎨 Production CSS Files (9 Core Files)

| File | Size | Purpose | Dependencies |
|------|------|---------|--------------|
| `navigation.css` | 3KB | Navigation component - MUST load first | None |
| `main.css` | 119KB | Core styles and layouts | navigation.css |
| `modern-enhancements.css` | 23KB | Progressive enhancements, animations | main.css |
| `enhanced-lightbox.css` | 14.6KB | Gallery lightbox functionality | main.css |
| `deferred.css` | 8KB | Non-critical homepage styles (async) | main.css |
| `streamlined.css` | 75KB | 404 error page styles | None |
| `search.css` | 11.6KB | Search page specific styles | streamlined.css |
| `unified.css` | 54KB | Shop/product page styles | main.css |
| `/optimized/` | (dir) | Minified versions (optional) | - |

**Total CSS**: ~308KB (before minification)

---

## 📜 Production JavaScript Files (6 Core Files)

| File | Size | Purpose | Used By |
|------|------|---------|---------|
| `critical.js` | 10.9KB | Critical homepage functionality | index.html |
| `enhanced-lightbox.js` | 14.9KB | Lightbox gallery functionality | Multiple pages |
| `main.js` | 6.4KB | Common functionality | search.html, 404.html |
| `scroll-animations.js` | 3.6KB | Scroll-triggered animations | shop.html |
| `unified.js` | 15.2KB | Shop/product functionality | Shop pages |
| `/optimized/` | (dir) | Minified versions | index.html |

**Total JS**: ~51KB (before minification)

---

## 📄 HTML Page Structure

### Main Navigation Pages
- `index.html` - Homepage with hero slideshow
- `rhizomatic.html` - Featured project showcase
- `projections.html` - Projection art portfolio
- `photography.html` - Photography gallery
- `design.html` - Design portfolio
- `installations.html` - Installation art gallery
- `about.html` - About the collective
- `contact.html` - Contact form and info

### Utility Pages
- `404.html` - Error page
- `search.html` - Search functionality
- `shop.html` - Product shop
- `tshirts.html` - T-shirt products
- `tapestry-designs.html` - Tapestry products
- `ec-grant-portfolio-2024.html` - Grant portfolio

### All Pages MUST Include:
```html
<link href="assets/css/navigation.css" rel="stylesheet"/>
<link href="assets/css/main.css" rel="stylesheet"/>
```

---

## 🚫 Excluded from Production (dev/ folder)

### Categories of Excluded Files (86 total):
- **Test HTML**: 30+ files (*-test.html, *-old.html, *-backup.html)
- **Backup CSS**: 15+ files (*-backup-*.css, *.old)
- **Unused JS**: 17 files (admin.js, login.js, form-validation.js, etc.)
- **Development CSS**: 12 files (admin.css, critical.css, hero-enhanced.css, etc.)

### Critical Exclusion Patterns (.gitignore):
```
/dev/
*-test*
*-backup-*
*-old-*
*-updated*
*-optimized.html
*-improved*
```

---

## 🔗 Critical Dependencies

### CSS Load Order (Required)
1. `navigation.css` ← **MUST be first**
2. `main.css`
3. Page-specific CSS
4. `modern-enhancements.css` (if needed)
5. `enhanced-lightbox.css` (if gallery present)

### Font Dependencies
- Apercu Regular (400)
- Apercu Medium (500)
- Apercu Bold (700)
- Apercu Mono (400)
- All fonts use WOFF2 format with `font-display: swap`

---

## 📊 File Statistics

| Category | Production | Archived (dev/) | Reduction |
|----------|------------|-----------------|-----------|
| HTML | 14 files | 30+ files | -68% |
| CSS | 9 files | 27 files | -67% |
| JavaScript | 6 files | 17 files | -65% |
| **Total** | **29 files** | **74+ files** | **-72%** |

---

## ⚠️ Critical Rules

1. **NEVER** move files from dev/ back to production
2. **NEVER** delete navigation.css or merge it into main.css
3. **ALWAYS** load navigation.css before main.css
4. **ALWAYS** exclude dev/ folder from deployment
5. **MAINTAIN** the 9 core CSS / 6 core JS file structure

---

## 🚀 Deployment Ready Files

### Include in deployment:
- All .html files in root (except test/backup patterns)
- `/assets/` directory (excluding dev subdirectories)
- `.htaccess` (if present)
- `robots.txt` (if present)
- `sitemap.xml` (if present)

### Exclude from deployment:
- `/dev/` directory and all contents
- `.git/` directory
- `*.md` documentation files
- `.gitignore`
- Any file matching test/backup patterns

---

## 📝 Maintenance Notes

- **Last Refactor**: February 14, 2026
- **Files Cleaned**: 86 moved to dev/
- **Space Saved**: ~72% file reduction
- **Performance**: Improved load time with consolidated CSS/JS

---

**Document Status**: LOCKED - Core structure defined