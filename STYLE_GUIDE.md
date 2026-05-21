# Essentials Creative - Style Guide & Code Standards

**Version 5.0** | Updated: 2026-05-14

## Table of Contents

1. [Overview](#overview)
2. [Design System](#design-system)
3. [HTML Standards](#html-standards)
4. [CSS Architecture](#css-architecture)
5. [JavaScript Patterns](#javascript-patterns)
6. [Component Library](#component-library)
7. [Performance Guidelines](#performance-guidelines)
8. [Accessibility Standards](#accessibility-standards)
9. [Security Practices](#security-practices)
10. [Maintenance & Testing](#maintenance--testing)

---

## Overview

This style guide documents the standards, patterns, and best practices for the Essentials Creative website. It ensures consistency across all pages and components while maintaining the site's cultural sensitivity and artistic integrity.

### Core Principles

- **Cultural Respect**: All content honors Indigenous, Latinx, and Asian stories and traditions
- **Accessibility First**: WCAG 2.1 AA compliance minimum
- **Performance**: Fast loading across all devices and connections
- **Sustainability**: Minimal environmental impact through efficient code
- **Modularity**: Reusable components and maintainable architecture

---

## Design System

### Color Palette

```css
/* Primary Colors */
--color-primary: #1a1a1a;        /* Primary text/headers */
--color-secondary: #333;         /* Secondary text */
--color-accent: #059669;         /* Links/CTAs */
--color-accent-dark: #047857;    /* Hover states */

/* Neutral Colors */
--color-background: #ffffff;     /* Page background */
--color-background-alt: #f8f8f8; /* Section backgrounds */
--color-background-section: #f9f9f9; /* Alternate sections */
--color-border: #ddd;           /* Borders */
--color-border-light: rgba(0,0,0,0.05); /* Subtle borders */

/* Text Colors */
--color-text: #333;             /* Primary text */
--color-text-light: #666;       /* Secondary text */
--color-text-muted: #999;       /* Muted text */
```

### Typography

#### Font Family
- **Primary**: Apercu (400, 500, 700 weights)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

#### Typography Scale
```css
--font-size-xs: 0.875rem;   /* 14px */
--font-size-sm: 1rem;       /* 16px */
--font-size-md: 1.125rem;   /* 18px */
--font-size-lg: 1.25rem;    /* 20px */
--font-size-xl: 1.5rem;     /* 24px */
--font-size-2xl: 2rem;      /* 32px */
--font-size-3xl: 2.5rem;    /* 40px */
```

#### Line Heights
```css
--line-height-tight: 1.2;
--line-height-normal: 1.6;
--line-height-loose: 1.8;
```

### Spacing System

```css
--spacing-xs: 0.5rem;    /* 8px */
--spacing-sm: 1rem;      /* 16px */
--spacing-md: 2rem;      /* 32px */
--spacing-lg: 3rem;      /* 48px */
--spacing-xl: 4rem;      /* 64px */
--spacing-2xl: 6rem;     /* 96px */
```

### Border Radius

```css
--border-radius-sm: 6px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-xl: 16px;
```

---

## HTML Standards

### Document Structure

Every HTML page should follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, viewport-fit=cover" name="viewport"/>
    <!-- Theme colors -->
    <meta content="#ffffff" media="(prefers-color-scheme: light)" name="theme-color"/>
    <meta content="#1a1a1a" media="(prefers-color-scheme: dark)" name="theme-color"/>
    
    <!-- Page title and meta -->
    <title>Page Title - Essentials Creative</title>
    <meta content="Page description" name="description"/>
    <meta content="relevant, keywords" name="keywords"/>
    
    <!-- Open Graph meta tags -->
    <!-- Favicons -->
    <!-- Preload critical fonts -->
    <!-- CSS files -->
    <!-- Page-specific styles -->
</head>
<body>
    <!-- Skip links for accessibility -->
    <!-- Header with navigation -->
    <!-- Main content -->
    <!-- Footer -->
    <!-- JavaScript files -->
</body>
</html>
```

### Semantic HTML Guidelines

#### Use Proper Semantic Elements
```html
<!-- Good -->
<article class="project-card">
    <header>
        <h2>Project Title</h2>
    </header>
    <section class="project-content">
        <p>Project description...</p>
    </section>
</article>

<!-- Bad -->
<div class="project-card">
    <div class="project-header">
        <div class="project-title">Project Title</div>
    </div>
    <div class="project-content">
        <p>Project description...</p>
    </div>
</div>
```

#### Accessibility Attributes
```html
<!-- Required accessibility attributes -->
<button type="button" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-menu">
<nav role="navigation" aria-label="Main navigation">
<main id="main-content">
<img alt="Descriptive alt text" src="image.jpg" width="400" height="300"/>
```

---

## CSS Architecture

### File Organization

```
assets/css/
├── main-improved.css         # Core styles with CSS variables
├── navigation.css            # Navigation components
├── design-system.css         # Design tokens and utilities
├── mobile-optimization.css   # Mobile-specific optimizations
├── gallery-uniform.css       # Gallery layouts
├── enhanced-lightbox.css     # Lightbox functionality
├── lazy-loading.css         # Lazy loading styles
└── [page-specific].css      # Individual page styles
```

### CSS Methodology

#### BEM-inspired Class Naming
```css
/* Block */
.service-card { }

/* Element */
.service-card__image { }
.service-card__content { }
.service-card__title { }

/* Modifier */
.service-card--featured { }
.service-card__image--lazy { }
```

#### CSS Custom Properties Usage
```css
/* Use variables consistently */
.hero {
    padding: var(--spacing-2xl) var(--spacing-md);
    background: var(--color-background);
    border-radius: var(--border-radius-lg);
    font-size: var(--font-size-lg);
}

/* Responsive variables */
@media (max-width: 768px) {
    :root {
        --spacing-xl: 3rem;
        --font-size-3xl: 2rem;
    }
}
```

### Component Patterns

#### Card Component
```css
.card {
    background: white;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}
```

#### Grid Layouts
```css
.grid {
    display: grid;
    gap: var(--spacing-md);
}

.grid--auto {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.grid--4 {
    grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
    .grid--4 {
        grid-template-columns: 1fr;
    }
}
```

---

## JavaScript Patterns

### Module Structure

```javascript
// Module pattern with IIFE
(function() {
    'use strict';
    
    const ModuleName = {
        config: {
            // Configuration options
        },
        
        state: {
            // Module state
        },
        
        init() {
            // Initialization logic
            this.bindEvents();
            this.setupFeatures();
        },
        
        bindEvents() {
            // Event listeners
        },
        
        // Public methods
        publicMethod() {
            // Implementation
        },
        
        // Private methods
        _privateMethod() {
            // Implementation
        }
    };
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ModuleName.init());
    } else {
        ModuleName.init();
    }
    
    // Expose globally
    window.ModuleName = ModuleName;
})();
```

### Error Handling

```javascript
// Always wrap in try-catch
handleUserAction() {
    try {
        // Action logic
    } catch (error) {
        this.handleError(error, 'handleUserAction');
    }
}

handleError(error, context = 'Unknown') {
    console.error(`[ModuleName] Error in ${context}:`, error);
    // Optional: send to error tracking service
}
```

### Event Delegation

```javascript
// Use event delegation for dynamic content
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn')) {
        this.handleButtonClick(e);
    }
    
    if (e.target.closest('.card')) {
        this.handleCardClick(e);
    }
});
```

---

## Component Library

### Navigation Component

#### HTML Structure
```html
<header class="header" role="banner">
    <div class="nav-container">
        <div class="logo">
            <a href="index.html" aria-label="Essentials Creative - Home">
                <img alt="Essentials Creative logo" src="assets/images/Essentials-Creative_Logo.png" width="180" height="45"/>
            </a>
        </div>
        <nav id="main-navigation" class="nav-links" role="navigation" aria-label="Main navigation">
            <!-- Navigation items -->
        </nav>
        <div class="hamburger-nav">
            <!-- Mobile menu -->
        </div>
    </div>
</header>
```

#### Required CSS Classes
- `.header` - Main header container
- `.nav-container` - Navigation wrapper
- `.nav-links` - Desktop navigation
- `.hamburger-nav` - Mobile menu container
- `.active` - Active link state

### Card Component

#### HTML Structure
```html
<article class="card">
    <div class="card-image" style="background-image: url('image.jpg')">
        <div class="card-overlay">
            <span class="view-work">View Work →</span>
        </div>
    </div>
    <div class="card-content">
        <h3>Card Title</h3>
        <p>Card description...</p>
        <div class="service-tags">
            <span class="service-tag">Tag</span>
        </div>
    </div>
</article>
```

### Form Component

#### HTML Structure
```html
<form action="https://formspree.io/f/form-id" method="POST" data-secure="true">
    <div class="form-group">
        <label for="email" class="form-label">Email Address</label>
        <input id="email" type="email" name="email" class="form-input" required>
    </div>
    <div class="form-group">
        <label for="message" class="form-label">Message</label>
        <textarea id="message" name="message" class="form-textarea" required></textarea>
    </div>
    <button type="submit" class="btn">Send Message</button>
    
    <!-- Honeypot added automatically by FormSecurity module -->
</form>
```

---

## Performance Guidelines

### Image Optimization

#### Lazy Loading
```html
<!-- Use data-src for lazy loading -->
<img data-src="image.jpg" 
     data-webp-src="image.webp" 
     alt="Description" 
     class="lazy-image responsive-image"/>

<!-- Background images -->
<div data-bg-src="bg-image.jpg" 
     data-webp-bg-src="bg-image.webp" 
     class="hero-section"></div>
```

#### Responsive Images
```html
<!-- Use picture element for WebP support -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.jpg" type="image/jpeg">
    <img src="image.jpg" alt="Description" class="responsive-image">
</picture>

<!-- Lazy loading with picture -->
<picture>
    <source data-srcset="image.webp" type="image/webp">
    <source data-srcset="image.jpg" type="image/jpeg">
    <img data-src="image.jpg" alt="Description" class="lazy-image">
</picture>
```

### CSS Performance

#### Critical CSS
- Inline critical above-the-fold CSS in `<style>` tags
- Load non-critical CSS asynchronously
- Use CSS variables for consistent theming

#### File Organization
- Combine related CSS into modules
- Use versioning in file names for cache busting
- Minimize CSS file size through optimization

### JavaScript Performance

#### Module Loading
```javascript
// Use defer for non-critical scripts
<script src="assets/js/main.js" defer></script>

// Use async for independent modules
<script src="assets/js/analytics.js" async></script>
```

#### Event Optimization
```javascript
// Debounce expensive operations
const debouncedResize = this.debounce(() => {
    this.handleResize();
}, 100);

window.addEventListener('resize', debouncedResize, { passive: true });
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast
- Text: Minimum 4.5:1 ratio against background
- Large text (18pt+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

#### Keyboard Navigation
```css
/* Visible focus indicators */
.btn:focus,
.nav-link:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}

/* Skip to content links */
.skip-link:focus {
    position: static;
    transform: none;
}
```

#### Screen Reader Support
```html
<!-- Descriptive headings -->
<h1>Photography - Essentials Creative</h1>
<h2>Portrait Photography</h2>
<h3>Recent Projects</h3>

<!-- Alt text for images -->
<img src="portrait.jpg" alt="Portrait of artist in natural light, captured for exhibition catalog">

<!-- Form labels -->
<label for="email">Email Address</label>
<input id="email" type="email" name="email" required aria-describedby="email-help">
<div id="email-help">We'll never share your email address</div>
```

### Responsive Design

#### Breakpoints
```css
/* Mobile First Approach */
/* Base styles: 0px and up */

@media (min-width: 768px) {
    /* Tablet styles */
}

@media (min-width: 1024px) {
    /* Desktop styles */
}

@media (min-width: 1200px) {
    /* Large desktop styles */
}
```

#### Touch Targets
```css
/* Minimum 44px touch targets */
.btn,
.nav-link,
button,
[role="button"] {
    min-height: 44px;
    min-width: 44px;
}
```

---

## Security Practices

### Form Security

#### Required Security Features
1. **Honeypot fields** - Automatically added by FormSecurity module
2. **Rate limiting** - 3 submissions per 5 minutes per form
3. **Content validation** - Blocks suspicious patterns
4. **CSRF protection** - Through Formspree integration
5. **Input sanitization** - Server-side validation

#### Implementation
```javascript
// Forms with data-secure="true" get automatic security
<form action="https://formspree.io/f/form-id" method="POST" data-secure="true">
```

### Content Security

#### CSP Headers
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

#### Input Validation
```javascript
// Validate all user inputs
const blockedPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
];

function validateInput(input) {
    return !blockedPatterns.some(pattern => pattern.test(input));
}
```

---

## Maintenance & Testing

### Code Quality

#### HTML Validation
- Validate HTML using W3C Markup Validator
- Ensure semantic structure
- Check accessibility with axe-core

#### CSS Quality
- Use CSS linting tools
- Validate CSS syntax
- Check for unused selectors

#### JavaScript Quality
- Use ESLint for code quality
- Test in multiple browsers
- Check console for errors

### Performance Testing

#### Tools
- **PageSpeed Insights** - Google's performance tool
- **WebPageTest** - Detailed performance analysis
- **Lighthouse** - Built into Chrome DevTools

#### Metrics to Monitor
- **First Contentful Paint (FCP)** - < 1.8s
- **Largest Contentful Paint (LCP)** - < 2.5s
- **First Input Delay (FID)** - < 100ms
- **Cumulative Layout Shift (CLS)** - < 0.1

### Browser Support

#### Target Browsers
- **Chrome/Edge**: Last 2 versions
- **Firefox**: Last 2 versions
- **Safari**: Last 2 versions
- **Mobile Safari**: iOS 12+
- **Chrome Mobile**: Android 8+

#### Progressive Enhancement
```javascript
// Feature detection
if ('IntersectionObserver' in window) {
    // Use Intersection Observer
} else {
    // Fallback implementation
}

if (CSS.supports('display', 'grid')) {
    // Use CSS Grid
} else {
    // Fallback layout
}
```

---

## Deployment Checklist

### Pre-Launch
- [ ] Validate all HTML pages
- [ ] Check CSS for errors and unused rules
- [ ] Test JavaScript in all target browsers
- [ ] Run accessibility audit (axe-core or WAVE)
- [ ] Test form functionality
- [ ] Verify image optimization and lazy loading
- [ ] Check mobile responsiveness
- [ ] Test performance (Lighthouse score >90)

### Launch
- [ ] Update robots.txt
- [ ] Submit sitemap to search engines
- [ ] Set up monitoring and analytics
- [ ] Configure CDN and caching
- [ ] Test production environment
- [ ] Monitor for errors

### Post-Launch
- [ ] Monitor performance metrics
- [ ] Check error logs
- [ ] Gather user feedback
- [ ] Plan regular maintenance updates

---

## Component Implementation Examples

### Creating a New Card Component

1. **HTML Structure**
```html
<article class="featured-card">
    <div class="featured-card__image">
        <img data-src="image.jpg" alt="Description" class="lazy-image">
    </div>
    <div class="featured-card__content">
        <h3 class="featured-card__title">Title</h3>
        <p class="featured-card__description">Description</p>
        <a href="#" class="featured-card__link btn">Learn More</a>
    </div>
</article>
```

2. **CSS Styles**
```css
.featured-card {
    background: var(--color-background);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    transition: transform var(--transition-normal);
}

.featured-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

.featured-card__image {
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.featured-card__content {
    padding: var(--spacing-md);
}

.featured-card__title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
}
```

3. **JavaScript Interaction**
```javascript
// Initialize lazy loading for new cards
document.addEventListener('cardAdded', (e) => {
    const card = e.detail.card;
    const lazyImage = card.querySelector('.lazy-image');
    
    if (lazyImage) {
        LazyLoader.observeImage(lazyImage);
    }
});
```

---

This style guide should be updated with each major release and reviewed quarterly for best practices and emerging standards.

**Last Updated**: 2026-05-14  
**Version**: 5.0  
**Next Review**: 2026-08-14