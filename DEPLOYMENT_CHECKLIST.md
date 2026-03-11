# 🚀 DEPLOYMENT CHECKLIST
**Essentials Creative - Pre-Deployment Validation**
**Version 2.0 - Neutral Redesign**

## ⚠️ CRITICAL: Complete ALL checks before deploying to production

---

## 📋 Pre-Deployment Validation

### 🎨 Design Consistency
- [ ] **No green colors** in navigation or buttons
  - Verify: `--color-primary: #44403c` (NOT #2c5f2d)
  - Check all buttons, links, and interactive elements
- [ ] **Hamburger menu** only visible on mobile (<768px width)
  - Desktop: Menu should be completely hidden
  - Mobile: Three-line hamburger should appear
- [ ] **No double lines** in navigation bar
  - Single clean shadow under header
  - No overlapping borders

### 📁 File Structure
- [ ] **/dev/ folder excluded** from deployment
  - Contains 86+ test/backup files
  - Verify .gitignore includes `/dev/`
- [ ] **Only 9 CSS files** in /assets/css/ (excluding /optimized/)
  - navigation.css, main.css, modern-enhancements.css, enhanced-lightbox.css
  - deferred.css, streamlined.css, search.css, unified.css
- [ ] **Only 6 JS files** in /assets/js/ (excluding /optimized/)
  - critical.js, enhanced-lightbox.js, main.js
  - scroll-animations.js, unified.js

### 🔗 HTML Page Validation
- [ ] **All pages include navigation.css**
  ```html
  <link href="assets/css/navigation.css" rel="stylesheet"/>
  ```
- [ ] **navigation.css loads BEFORE main.css** on all pages
- [ ] **No inline navigation CSS** in HTML files
- [ ] **Footer present** on all main pages

### 🖼️ Asset Verification
- [ ] **Botanical hero image** displays in Video & Motion section
  - File: botanical-hero-background-optimized.jpg
- [ ] **All image paths** are correct (no 404s)
- [ ] **Fonts loading** properly (Apercu family)

### ⚡ Performance Checks
- [ ] **No duplicate CSS** loading
- [ ] **No broken JavaScript** references
  - Removed: search.js reference from search.html
- [ ] **Optimized images** used where available (*-optimized.jpg)

### 🌐 Cross-Browser Testing
- [ ] **Chrome/Edge** - Layout correct, no console errors
- [ ] **Firefox** - Layout correct, no console errors
- [ ] **Safari** - Layout correct, no console errors
- [ ] **Mobile Safari (iOS)** - Touch targets 44px minimum
- [ ] **Chrome Mobile (Android)** - Navigation works correctly

### 📱 Responsive Design
- [ ] **Desktop (>1024px)** - Full navigation visible, no hamburger
- [ ] **Tablet (768-1024px)** - Hamburger menu appears
- [ ] **Mobile (<768px)** - Hamburger menu, single column layouts
- [ ] **Small Mobile (<480px)** - Content remains readable

---

## 🔍 Quick Validation Commands

### Check for green colors in CSS:
```bash
grep -r "#2c5f2d\|#4a7a4d\|#1e4220" assets/css/
# Should return NO results
```

### Verify dev folder is excluded:
```bash
ls -la dev/ | wc -l
# Should show 86+ files that won't be deployed
```

### Check navigation.css is linked:
```bash
grep -l "navigation.css" *.html | wc -l
# Should match total number of HTML pages
```

### Find any remaining test files:
```bash
ls -la | grep -E "test|backup|old|updated"
# Should return NO results in root directory
```

---

## 🚫 Common Issues to Avoid

1. **DO NOT deploy with green primary colors**
   - Will show green buttons/elements user wants removed
   
2. **DO NOT include /dev/ folder**
   - Contains 86+ unnecessary test files (increases deploy size)
   
3. **DO NOT remove navigation.css**
   - Will break consistent navigation across site
   
4. **DO NOT change CSS load order**
   - navigation.css must load before main.css

5. **DO NOT deploy without testing mobile**
   - Hamburger menu must work on mobile devices

---

## ✅ Final Deployment Steps

1. **Run all validation checks** above
2. **Test on local server** one final time
   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```
3. **Verify no console errors** in browser DevTools
4. **Check all main navigation links** work
5. **Test contact form** submission (if applicable)
6. **Clear browser cache** and test again

---

## 📊 Deployment Metrics

### Expected Results:
- **Total files**: ~29 production files (excluding dev/)
- **CSS files**: 9 core stylesheets
- **JS files**: 6 core scripts
- **Load time**: <3 seconds on 3G
- **No 404 errors** in console
- **No green elements** visible

---

## 🎉 Post-Deployment Verification

After deployment, verify:
- [ ] Site loads at production URL
- [ ] Navigation works on all pages
- [ ] Images display correctly
- [ ] No green colors visible
- [ ] Mobile menu works on phone
- [ ] Contact form submits properly

---

## 📝 Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| Designer | | | |
| Client | | | |

---

**Checklist Version**: 2.0
**Last Updated**: February 14, 2026
**Status**: ACTIVE - Use for all deployments