# Bug Report Template - Essentials Creative Website

## Bug Information

**Bug ID:** [AUTO-GENERATED or ASSIGNED]  
**Date:** [DATE]  
**Reporter:** [YOUR NAME]  
**Severity:** [Critical/High/Medium/Low]

---

## Summary

**Title:** [Brief, descriptive title of the issue]

**Description:**
[Detailed description of the bug/issue. Be specific about what's wrong and how it affects the user experience.]

---

## Reproduction Steps

**Steps to Reproduce:**
1. [First step - be specific about where to click, what to type, etc.]
2. [Second step]
3. [Third step]
4. [Continue as needed...]

**Expected Result:**
[What should happen when following the steps above]

**Actual Result:**
[What actually happens - describe the bug behavior]

---

## Environment Details

**Browser:** [Chrome/Safari/Firefox/Edge]  
**Browser Version:** [e.g., Chrome 119.0.6045.105]  
**Device:** [Desktop/Mobile/Tablet]  
**Operating System:** [macOS/Windows/iOS/Android + version]  
**Screen Resolution:** [e.g., 1920x1080, iPhone 14 Pro]  
**Page URL:** [Exact URL where bug occurs]

---

## Test Results (if applicable)

**Link Checker Results:**
- [ ] Navigation test passed/failed
- [ ] Specific error: [Error message from automated tests]
- [ ] Pass rate: [X/Y tests passed]

**Performance Test Results:**
- [ ] Core Web Vitals passed/failed
- [ ] Performance score: [X/100]
- [ ] Specific metrics: LCP: [X]s, CLS: [X], FID: [X]ms

---

## Visual Evidence

**Screenshots:**
[Attach screenshots showing the bug. Mark important areas with arrows or highlights.]

**Screen Recording:** [If applicable, link to video showing the bug]

**Console Errors:** [Include any JavaScript errors from browser console]

---

## Impact Assessment

**User Impact:** [How does this affect website visitors?]
- [ ] Blocks core functionality
- [ ] Degrades user experience
- [ ] Minor visual issue
- [ ] Accessibility concern

**Business Impact:** [How does this affect Essentials Creative?]
- [ ] Prevents conversions/contact
- [ ] Affects SEO/search rankings
- [ ] Damages professional image
- [ ] Minor issue

**Affected Pages:**
- [ ] Homepage (index.html)
- [ ] Photography page
- [ ] Design page
- [ ] Installations page
- [ ] Video/Film page
- [ ] Projects pages (Yanaguana, Afterworld, Rhizomatic)
- [ ] About page
- [ ] Contact page
- [ ] Shop page
- [ ] All pages
- [ ] Other: [specify]

---

## Additional Information

**Workaround:** [If there's a temporary way to avoid the issue]

**Related Issues:** [Link to any related bugs or tickets]

**Additional Notes:**
[Any other relevant information, context, or observations]

---

## Severity Classification

### Critical 🚨
- Site completely down or inaccessible
- Navigation completely broken
- Forms not submitting (contact, newsletter)
- Major security vulnerability
- **SLA: Fix within 1-2 hours**

### High ⚠️
- Individual pages not loading
- Broken navigation links
- Gallery/lightbox not working
- Mobile navigation broken
- Accessibility violations
- Performance severely degraded
- **SLA: Fix within 24 hours**

### Medium 🟡
- Visual inconsistencies
- Missing images or alt text
- Minor navigation issues
- SEO meta tag problems
- Performance moderately affected
- Non-critical form issues
- **SLA: Fix within 72 hours**

### Low 🟢
- Color scheme refinements
- Text improvements
- Minor visual tweaks
- Feature enhancements
- Documentation updates
- **SLA: Schedule for next maintenance window**

---

## Testing Validation

**Before Marking as Fixed:**
- [ ] Bug reproduced by developer
- [ ] Fix implemented and deployed
- [ ] Original reproduction steps no longer trigger the bug
- [ ] Related functionality still works correctly
- [ ] Automated tests pass (run `npm test` in testing-scripts/)
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed (if applicable)
- [ ] Performance impact assessed
- [ ] SEO/accessibility impact verified

**Testing Commands to Run:**
```bash
# Navigate to testing directory
cd testing-scripts

# Run automated tests
npm run test:links
npm run test:performance

# Generate reports
npm run report
```

---

## Developer Notes

**Priority Assignment:** [To be filled by development team]  
**Estimated Fix Time:** [To be filled by development team]  
**Assigned To:** [Developer name]  
**Related Code Files:** [List relevant files that may need updates]

**Fix Applied:**
[Description of the solution implemented]

**Commit Hash:** [Git commit reference]  
**Deployment Date:** [When fix was deployed]  
**Verified By:** [Who verified the fix]  
**Verification Date:** [When fix was verified]

---

## Examples of Well-Reported Bugs

### Example 1: Critical Navigation Issue
```
Title: Video/Film navigation links broken on multiple pages
Severity: Critical
Description: Multiple pages link to #video which doesn't exist, causing navigation to fail
Steps to Reproduce:
1. Visit index.html
2. Click "Video/Film" in navigation
3. Observe page doesn't navigate anywhere
Expected: Should navigate to projections.html
Actual: Page stays on same URL, no navigation occurs
Environment: Chrome 119, macOS, Desktop
Test Results: Link checker shows 4 pages with broken #video links
```

### Example 2: Performance Issue
```
Title: Gallery pages loading slowly on mobile
Severity: High
Description: Photography and installations pages take >6 seconds to load on mobile
Steps to Reproduce:
1. Visit photography.html on iPhone
2. Time page load
Expected: Page loads within 4 seconds
Actual: Takes 6+ seconds, images load slowly
Environment: Safari iOS 17, iPhone 14 Pro
Test Results: Performance score 45/100, LCP 4.2s (should be <2.5s)
```

### Example 3: Visual Consistency Issue
```
Title: Logo sizing inconsistent across project pages
Severity: Medium
Description: yanaguana.html and afterworld.html have different logo sizes than main pages
Steps to Reproduce:
1. Visit index.html - note logo size
2. Visit yanaguana.html - compare logo size
Expected: Logo should be 65px height on all pages
Actual: Project pages have smaller logos
Environment: Chrome 119, macOS, Desktop 1920x1080
```

---

## Quick Reference - Common Issues

### Navigation Problems
- Links to `#video` instead of `projections.html`
- Projects links inconsistent (`rhizomatic.html` vs `yanaguana.html`)
- Active states not highlighting correctly
- Mobile hamburger menu not working

### Performance Issues  
- Core Web Vitals failing (LCP >2.5s, CLS >0.1, FID >100ms)
- Images not optimized (large file sizes)
- Unused CSS/JavaScript
- Slow server response times

### Accessibility Issues
- Missing alt text on images
- Poor color contrast
- Keyboard navigation not working
- Screen reader compatibility problems

### Visual Inconsistencies
- Hero typography not matching (should be 4rem, 800 weight)
- Logo sizing wrong (should be 65px height)
- Footer design differences between pages
- Gallery aspect ratios inconsistent

---

*Template Version: 1.0*  
*Last Updated: February 2026*