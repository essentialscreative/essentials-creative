# Essentials Creative Website Testing Suite

## Overview

This comprehensive testing suite provides automated and manual testing tools to ensure the Essentials Creative website maintains professional standards, consistent design, and optimal user experience.

## Quick Start

### 1. Setup
```bash
cd testing-scripts
npm run setup
```

### 2. Run Tests
```bash
# Run all tests (recommended)
npm test

# Run specific tests
npm run test:links        # Link checker only
npm run test:performance  # Performance tests only
```

### 3. View Reports
```bash
npm run report  # Opens HTML reports
```

## What Gets Tested

### 🔗 Link Checker (`npm run test:links`)
- **Navigation consistency** across all pages
- **Critical issue detection**: `#video` links, Projects link inconsistencies
- **Broken link identification** and missing pages
- **Image validation** and alt text checking
- **Form functionality** verification
- **Mobile navigation** consistency

**Key Features:**
- Identifies specific known issues (Video/Film → projections.html)
- Checks navigation consistency (Projects → yanaguana.html)
- Validates all internal links and images
- Tests form configurations
- Generates detailed JSON reports

### ⚡ Performance Tester (`npm run test:performance`)
- **Core Web Vitals** compliance (LCP, FID, CLS)
- **Lighthouse audits** for performance, accessibility, SEO
- **Page load time** analysis
- **Image optimization** opportunities
- **Accessibility compliance** testing

**Key Features:**
- Google Core Web Vitals validation
- Performance scoring with specific thresholds
- Visual HTML reports with color-coded results
- Optimization recommendations
- Cross-page performance comparison

## Installation & Setup

### Prerequisites
- **Node.js 16+** (required)
- **Python 3** (for local server)
- **Chrome/Chromium** (for Lighthouse testing)

### Installation
```bash
# Navigate to testing directory
cd testing-scripts

# Install dependencies
npm install

# Create reports directory
mkdir -p reports
```

### Alternative Setup
```bash
# One-command setup
npm run setup
```

## Usage Examples

### Daily Testing (5 minutes)
```bash
# Quick link check
npm run test:links

# Check for critical issues in output
# Look for: "🚨 CRITICAL ISSUES DETECTED"
```

### Weekly Testing (20 minutes)
```bash
# Full test suite
npm test

# Review HTML performance report
npm run report
```

### Pre-Launch Testing (30 minutes)
```bash
# Start local server and run all tests
npm run test:full

# Review both reports thoroughly
npm run report
```

## Understanding Test Results

### Link Checker Results
```bash
📊 ESSENTIALS CREATIVE LINK CHECKER RESULTS
============================================================
Total Tests: 156
✅ Passed: 142
❌ Failed: 14
📈 Pass Rate: 91.0%

🚨 CRITICAL ISSUES:
❌ index.html: Video/Film links to #video instead of projections.html
   Navigation link "Video/Film" has broken href="#video"

📋 KNOWN ISSUE SUMMARY:
🔗 Pages with broken #video links: 3
   Files: index.html, about.html, contact.html
```

**What to do:**
- **Critical issues**: Fix immediately (broken navigation)
- **High priority**: Fix within 24 hours (broken links)
- **Medium/Low**: Schedule for next maintenance window

### Performance Test Results
```bash
📊 ESSENTIALS CREATIVE PERFORMANCE TEST RESULTS
======================================================================
📈 OVERALL SCORES:
Performance:     78/100
Accessibility:   95/100
Best Practices:  87/100
SEO:            92/100

⚡ CORE WEB VITALS:
✅ Passed: 7 pages
❌ Failed: 4 pages

🎯 RECOMMENDATIONS:
🟡 MODERATE: Performance can be improved (78/100)
   • Optimize images and implement modern formats (WebP/AVIF)
   • Remove unused CSS and JavaScript
```

## Common Issues & Solutions

### Navigation Issues

**Issue**: Video/Film links to `#video` instead of `projections.html`
```bash
# Found in: Multiple pages
# Fix: Update navigation href
- <a href="#video">Video/Film</a>
+ <a href="projections.html">Video/Film</a>
```

**Issue**: Projects links inconsistent between `rhizomatic.html` and `yanaguana.html`
```bash
# Standard: All Projects links should go to yanaguana.html
# Fix: Update navigation
- <a href="rhizomatic.html">Projects</a>
+ <a href="yanaguana.html">Projects</a>
```

### Performance Issues

**Issue**: Large image files slowing load times
```bash
# Solution: Optimize images
- Use WebP/AVIF formats when possible
- Compress JPEG images
- Implement lazy loading for gallery images
```

**Issue**: Core Web Vitals failing
```bash
# Focus areas:
- LCP (Largest Contentful Paint): Optimize hero images
- CLS (Cumulative Layout Shift): Set image dimensions
- FID (First Input Delay): Minimize JavaScript blocking
```

## File Structure

```
testing-scripts/
├── README.md                 # This file
├── package.json              # NPM configuration
├── link-checker.js           # Automated link testing
├── performance-test.js       # Performance & accessibility testing
└── reports/                  # Generated test reports
    ├── link-check-report.json
    ├── performance-report.json
    └── performance-report.html
```

## Scripts Reference

| Command | Description | Time |
|---------|-------------|------|
| `npm run setup` | Install dependencies and create directories | 2min |
| `npm run test:links` | Check all navigation and internal links | 1min |
| `npm run test:performance` | Full performance audit with Lighthouse | 5min |
| `npm test` | Run both link and performance tests | 6min |
| `npm run test:full` | Start server and run all tests | 7min |
| `npm run report` | Open HTML reports in browser | instant |
| `npm run clean` | Delete old report files | instant |

## Troubleshooting

### Common Errors

**Error**: `lighthouse: command not found`
```bash
# Solution: Install lighthouse globally
npm install -g lighthouse
```

**Error**: `Chrome not found`
```bash
# Solution: Install Chrome or set CHROME_PATH
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

**Error**: `python3: command not found`
```bash
# Solution: Install Python 3 or use alternative server
npm install -g http-server
# Then modify package.json to use: http-server -p 8000
```

**Error**: Performance tests failing to connect
```bash
# Solution: Ensure local server is running
cd ..
python3 -m http.server 8000
# In another terminal:
cd testing-scripts
npm run test:performance
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Website Testing
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd testing-scripts && npm install
      - run: cd testing-scripts && npm run test:links
      - run: cd testing-scripts && npm run test:full
```

## Customization

### Adding New Tests
1. Edit `link-checker.js` or `performance-test.js`
2. Add new test functions
3. Update expected results and thresholds
4. Test your changes with `npm test`

### Modifying Thresholds
```javascript
// In performance-test.js
this.thresholds = {
    lcp: 2.5,  // Largest Contentful Paint (seconds)
    fid: 0.1,  // First Input Delay (seconds)  
    cls: 0.1   // Cumulative Layout Shift
};
```

### Custom Page Expectations
```javascript
// In performance-test.js
this.pageExpectations = {
    'index.html': { loadTime: 3.0, description: 'Homepage' },
    'custom-page.html': { loadTime: 2.0, description: 'Custom page' }
};
```

## Support

For questions about the testing suite:

1. **Check this README** for common issues
2. **Review test reports** for specific error details
3. **Run tests with verbose output** for debugging
4. **Refer to main documentation** in `TESTING_SUITE.md`

## Contributing

When adding new pages or features to the website:

1. **Run tests** before and after changes
2. **Fix any critical or high-priority issues**
3. **Update test expectations** if needed
4. **Document any new testing requirements**

---

*Last Updated: February 2026*
*Testing Suite Version: 1.0*