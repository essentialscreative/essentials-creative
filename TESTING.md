# Testing & Quality Assurance Guide
## Essentials Creative Website

**Version**: 1.0  
**Last Updated**: May 14, 2026  
**Test Coverage**: Functional, Visual, Performance, Accessibility, Security  

---

## 1. Testing Overview

This document outlines comprehensive testing procedures for the Essentials Creative website to ensure quality, performance, accessibility, and security across all pages and features.

### Testing Philosophy
- **User-First**: Focus on real user journeys and experiences
- **Cultural Sensitivity**: Ensure respectful representation
- **Accessibility**: Universal access for all users
- **Performance**: Fast loading on all connections
- **Cross-Platform**: Consistent experience across devices

---

## 2. Test Environment Setup

### Local Testing
```bash
# Install dependencies (if not already installed)
npm install

# Start local server
npm run serve
# Opens at http://localhost:8000

# Run automated checks
npm run lint          # Lint HTML, CSS, JS
npm run check:links   # Verify gallery links
```

### Browser Testing Matrix
| Browser | Version | Desktop | Mobile | Priority |
|---------|---------|---------|--------|----------|
| Chrome | Latest 2 | ✅ | ✅ | P0 |
| Safari | 14+ | ✅ | ✅ | P0 |
| Firefox | Latest 2 | ✅ | ✅ | P1 |
| Edge | Latest 2 | ✅ | ✅ | P1 |
| Samsung Internet | Latest | ❌ | ✅ | P2 |

### Device Testing
- **Mobile**: iPhone 12+, Samsung Galaxy S20+, Pixel 5+
- **Tablet**: iPad Pro, iPad Air, Samsung Tab
- **Desktop**: 1920x1080, 1440x900, 1366x768

---

## 3. Functional Testing

### 3.1 Navigation Testing
- [ ] Logo links to homepage
- [ ] All main nav items are clickable
- [ ] Dropdown menus open/close properly
- [ ] Mobile hamburger menu functions
- [ ] Active page highlighting works
- [ ] Keyboard navigation (Tab, Enter, Escape)

### 3.2 Homepage Testing
- [ ] Hero slideshow auto-advances
- [ ] All 10 hero images load properly
- [ ] Introduction text displays
- [ ] Service grid links work
- [ ] Footer newsletter form submits

### 3.3 Portfolio Pages Testing

#### Photography Page
- [ ] All gallery images load
- [ ] Lazy loading initiates on scroll
- [ ] Lightbox opens on click
- [ ] Arrow navigation in lightbox
- [ ] Escape closes lightbox
- [ ] Touch gestures on mobile

#### Design Page
- [ ] Project thumbnails display
- [ ] Hover effects work
- [ ] Links to project details
- [ ] Images have proper alt text

#### Video Page
- [ ] YouTube embeds load
- [ ] Videos play without autoplay
- [ ] Responsive video sizing
- [ ] Fallback for blocked embeds

#### Installations Page
- [ ] Gallery grid displays correctly
- [ ] Image captions visible
- [ ] Responsive layout adjusts
- [ ] High-res images load on demand

### 3.4 Project Pages Testing
- [ ] Rhizomatic page content loads
- [ ] Afterworld page displays
- [ ] Node page functions
- [ ] Plant Story Cards gallery works
- [ ] All project images load
- [ ] Project descriptions readable

### 3.5 Contact Form Testing
- [ ] Required fields validation
- [ ] Email format validation
- [ ] Project type dropdown works
- [ ] Form submission succeeds
- [ ] Success message displays
- [ ] Error handling works
- [ ] Honeypot field hidden
- [ ] Rate limiting after 3 submissions

### 3.6 About Page Testing
- [ ] Team member section displays
- [ ] "How We Work" content loads
- [ ] "What We Make" list visible
- [ ] Contact CTA functions

---

## 4. Visual Testing

### 4.1 Design Consistency
- [ ] Colors match design system (#1a1a1a primary)
- [ ] Typography consistent (Apercu font loads)
- [ ] Spacing follows 8px grid system
- [ ] Icons display correctly
- [ ] Images maintain aspect ratios

### 4.2 Responsive Design
- [ ] Mobile layout (<768px)
- [ ] Tablet layout (768-1024px)
- [ ] Desktop layout (>1024px)
- [ ] Text remains readable at all sizes
- [ ] Images scale appropriately
- [ ] No horizontal scroll on mobile

### 4.3 Cross-Browser Rendering
- [ ] CSS Grid fallbacks work
- [ ] Flexbox displays correctly
- [ ] Custom properties have fallbacks
- [ ] Fonts render consistently
- [ ] Animations smooth

---

## 5. Performance Testing

### 5.1 Page Load Times
Target: <3 seconds on 3G connection

| Page | Target | Desktop | Mobile 4G | Mobile 3G |
|------|--------|---------|-----------|-----------|
| Home | <3s | <1s | <2s | <3s |
| Photography | <3s | <1.5s | <2.5s | <3s |
| Contact | <2s | <0.8s | <1.5s | <2s |

### 5.2 Lighthouse Scores
Run in Chrome DevTools → Lighthouse

**Target Scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

### 5.3 Core Web Vitals
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

### 5.4 Resource Optimization
- [ ] Images use WebP with JPEG fallback
- [ ] Images have explicit width/height
- [ ] CSS is minified
- [ ] JavaScript is deferred
- [ ] Fonts are preloaded
- [ ] Lazy loading works

---

## 6. Accessibility Testing

### 6.1 WCAG 2.1 AA Compliance
- [ ] Color contrast ratio ≥4.5:1 for text
- [ ] Color contrast ratio ≥3:1 for UI elements
- [ ] Focus indicators visible
- [ ] Skip links functional
- [ ] Headings in logical order (h1→h2→h3)

### 6.2 Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter activates buttons/links
- [ ] Escape closes modals/dropdowns
- [ ] No keyboard traps
- [ ] Focus order logical

### 6.3 Screen Reader Testing
Test with NVDA (Windows) or VoiceOver (Mac/iOS)
- [ ] Page titles announced
- [ ] Headings navigable
- [ ] Images have alt text
- [ ] Form labels associated
- [ ] Error messages announced
- [ ] ARIA labels present

### 6.4 Tools & Validation
```bash
# Automated testing
- axe DevTools extension
- WAVE browser extension
- Lighthouse accessibility audit

# Manual testing
- Keyboard-only navigation
- Screen reader testing
- Color contrast analyzer
```

---

## 7. Security Testing

### 7.1 Form Security
- [ ] Honeypot field prevents bot submissions
- [ ] Rate limiting blocks spam (3/5min)
- [ ] Input sanitization prevents XSS
- [ ] No SQL injection possible (static site)
- [ ] CSRF protection via Formspree

### 7.2 Content Security
- [ ] CSP headers configured in netlify.toml
- [ ] HTTPS enforced
- [ ] No mixed content warnings
- [ ] External links use rel="noopener"
- [ ] No sensitive data in client code

### 7.3 Third-Party Security
- [ ] Formspree integration secure
- [ ] YouTube embeds use privacy mode
- [ ] No tracking without consent
- [ ] Dependencies up to date

---

## 8. SEO Testing

### 8.1 Meta Tags
- [ ] Unique title tags (<60 chars)
- [ ] Meta descriptions (<160 chars)
- [ ] Open Graph tags present
- [ ] Canonical URLs set
- [ ] Language declared

### 8.2 Content Structure
- [ ] H1 tags on all pages (one per page)
- [ ] Semantic HTML used
- [ ] Schema.org markup present
- [ ] Sitemap.xml exists
- [ ] Robots.txt configured

### 8.3 Performance SEO
- [ ] Mobile-friendly (Google test)
- [ ] Fast page loads
- [ ] Images optimized
- [ ] No broken links
- [ ] 404 page exists

---

## 9. User Journey Testing

### 9.1 New Visitor Journey
1. Land on homepage
2. View hero slideshow
3. Navigate to Photography
4. View gallery images
5. Go to About page
6. Submit contact form
7. Receive confirmation

### 9.2 Returning Client Journey
1. Direct link to Contact
2. Fill project inquiry
3. Select project type
4. Submit form
5. View success message

### 9.3 Mobile User Journey
1. Open on mobile device
2. Use hamburger menu
3. Navigate to project
4. View images
5. Contact via form

---

## 10. Regression Testing Checklist

Run before each deployment:

### Quick Smoke Test (5 min)
- [ ] Homepage loads
- [ ] Navigation works
- [ ] One gallery page loads
- [ ] Contact form displays
- [ ] Mobile menu functions

### Full Regression (30 min)
- [ ] All pages load without errors
- [ ] All images display
- [ ] All links work
- [ ] Forms submit successfully
- [ ] Responsive layouts work
- [ ] No console errors
- [ ] Performance acceptable

---

## 11. Bug Reporting Template

```markdown
### Bug Title
[Clear, concise description]

### Environment
- Browser: [Chrome 115]
- Device: [iPhone 14]
- Page: [/photography.html]

### Steps to Reproduce
1. Navigate to...
2. Click on...
3. Observe...

### Expected Result
[What should happen]

### Actual Result
[What actually happens]

### Screenshots
[Attach if applicable]

### Priority
- P0: Blocker
- P1: Major
- P2: Minor
```

---

## 12. Test Automation Opportunities

### Current Automation
- Link checking (daily-gallery-checker.js)
- HTML/CSS/JS linting
- Image optimization scripts

### Future Automation
- Visual regression testing (Percy, BackstopJS)
- E2E testing (Playwright, Cypress)
- Performance monitoring (SpeedCurve)
- Accessibility scanning (Pa11y)
- SEO auditing (Screaming Frog)

---

## 13. Testing Schedule

### Pre-Deployment
- [ ] Run full regression suite
- [ ] Check all user journeys
- [ ] Validate on 3+ devices
- [ ] Review in 3+ browsers

### Post-Deployment
- [ ] Smoke test production site
- [ ] Check analytics tracking
- [ ] Monitor error logs
- [ ] Verify form submissions

### Monthly
- [ ] Full accessibility audit
- [ ] Performance review
- [ ] SEO checkup
- [ ] Security scan

---

## Testing Sign-off

| Test Type | Status | Tester | Date |
|-----------|--------|--------|------|
| Functional | ✅ Pass | Team | 05/14/26 |
| Visual | ✅ Pass | Team | 05/14/26 |
| Performance | ✅ Pass | Team | 05/14/26 |
| Accessibility | ✅ Pass | Team | 05/14/26 |
| Security | ✅ Pass | Team | 05/14/26 |

**Overall Status**: Ready for Production ✅

---

**Document maintained by**: Essentials Creative Development Team  
**Questions**: Contact development@essentialscreative.com