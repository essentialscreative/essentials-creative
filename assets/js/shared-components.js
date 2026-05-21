/**
 * Shared Components for Essentials Creative Website
 * Standardized HTML structures and utilities
 */

// Standard meta tag configuration
const standardMeta = {
    viewport: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, viewport-fit=cover',
    themeColorLight: '#ffffff',
    themeColorDark: '#1a1a1a',
    favicons: {
        icon: 'assets/images/favicon.png',
        appleTouchIcon: 'assets/images/favicon.png',
        shortcut: 'assets/images/favicon.png'
    }
};

// Standard CSS files and versions
const standardCSS = [
    { href: 'assets/css/navigation.css?v=4.2', rel: 'stylesheet' },
    { href: 'assets/css/main.css?v=4.1', rel: 'stylesheet' },
    { href: 'assets/css/design-system.css?v=2.0', rel: 'stylesheet' },
    { href: 'assets/css/mobile-optimization.css?v=1.0', rel: 'stylesheet' }
];

// Standard JavaScript files
const standardJS = [
    'assets/js/navigation.js?v=4.3',
    'assets/js/main.js',
    'assets/js/unified-gallery-lightbox.js'
];

// Standard navigation structure
const navigationStructure = {
    logo: {
        href: 'index.html',
        src: 'assets/images/Essentials-Creative_Logo.png',
        alt: 'Essentials Creative logo',
        width: 180,
        height: 45,
        ariaLabel: 'Essentials Creative - Home'
    },
    mainNav: [
        { href: 'index.html', text: 'Home', class: 'nav-link' }
    ],
    services: [
        { href: 'photography.html', text: 'Photography' },
        { href: 'design.html', text: 'Design' },
        { href: 'video.html', text: 'Video' },
        { href: 'projections.html', text: 'Projections' },
        { href: 'installations.html', text: 'Installations' }
    ],
    projects: [
        { href: 'afterworld.html', text: 'Afterworld' },
        { href: 'node.html', text: 'Node' },
        { href: 'rhizomatic.html', text: 'Rhizomatic' },
        { href: 'plant-story-cards.html', text: 'Plant Story Cards' }
    ],
    secondaryNav: [
        { href: 'about.html', text: 'About', class: 'nav-link' },
        { href: 'contact.html', text: 'Contact', class: 'nav-link' }
    ]
};

// Standard footer structure
const footerStructure = {
    newsletter: {
        title: 'Stay Connected',
        description: 'Get updates about new work and collaborations.',
        formAction: 'https://formspree.io/f/mblyvvyn',
        inputPlaceholder: 'Enter your email',
        submitText: 'Subscribe'
    },
    about: {
        title: 'Essentials Creative',
        description: 'We make installations, projections, video, photography, and design for cultural organizations, gardens, and community spaces — grounded in Indigenous, Latinx, and Asian stories.'
    },
    services: {
        title: 'Services',
        links: [
            { href: 'photography.html', text: 'Photography' },
            { href: 'design.html', text: 'Design' },
            { href: 'video.html', text: 'Video' },
            { href: 'node.html', text: 'Node' },
            { href: 'projections.html', text: 'Projections' },
            { href: 'installations.html', text: 'Installations' }
        ]
    },
    connect: {
        title: 'Connect',
        links: [
            { 
                href: 'https://www.instagram.com/essentialscreative/', 
                text: 'Instagram',
                external: true,
                ariaLabel: 'Instagram (opens in new window)'
            },
            { 
                href: 'https://www.youtube.com/channel/UCmhlzjngU5_WX6n1mvtY2Bw', 
                text: 'YouTube',
                external: true,
                ariaLabel: 'YouTube (opens in new window)'
            },
            { href: 'contact.html', text: 'Contact' }
        ]
    },
    copyright: '© 2026 Essentials Creative. All rights reserved.'
};

// Utility functions
const utils = {
    // Generate meta tags
    generateMetaTags: function(pageConfig) {
        const metaTags = [];
        
        // Basic meta tags
        metaTags.push(`<meta charset="utf-8"/>`);
        metaTags.push(`<meta content="${standardMeta.viewport}" name="viewport"/>`);
        metaTags.push(`<meta content="${standardMeta.themeColorLight}" media="(prefers-color-scheme: light)" name="theme-color"/>`);
        metaTags.push(`<meta content="${standardMeta.themeColorDark}" media="(prefers-color-scheme: dark)" name="theme-color"/>`);
        
        // Page-specific meta
        if (pageConfig.title) metaTags.push(`<title>${pageConfig.title}</title>`);
        if (pageConfig.description) metaTags.push(`<meta content="${pageConfig.description}" name="description"/>`);
        if (pageConfig.keywords) metaTags.push(`<meta content="${pageConfig.keywords}" name="keywords"/>`);
        
        // Open Graph meta
        if (pageConfig.og) {
            if (pageConfig.og.title) metaTags.push(`<meta content="${pageConfig.og.title}" property="og:title"/>`);
            if (pageConfig.og.description) metaTags.push(`<meta content="${pageConfig.og.description}" property="og:description"/>`);
            if (pageConfig.og.type) metaTags.push(`<meta content="${pageConfig.og.type}" property="og:type"/>`);
            if (pageConfig.og.url) metaTags.push(`<meta content="${pageConfig.og.url}" property="og:url"/>`);
            if (pageConfig.og.image) metaTags.push(`<meta content="${pageConfig.og.image}" property="og:image"/>`);
            if (pageConfig.og.imageAlt) metaTags.push(`<meta content="${pageConfig.og.imageAlt}" property="og:image:alt"/>`);
        }
        
        // Favicons
        metaTags.push(`<link href="${standardMeta.favicons.icon}" rel="icon" sizes="32x32" type="image/png"/>`);
        metaTags.push(`<link href="${standardMeta.favicons.appleTouchIcon}" rel="apple-touch-icon" sizes="180x180"/>`);
        metaTags.push(`<link href="${standardMeta.favicons.shortcut}" rel="shortcut icon"/>`);
        
        // Preload critical font
        metaTags.push(`<link rel="preload" href="assets/fonts/apercu/apercu_regular_pro.woff2" as="font" type="font/woff2" crossorigin>`);
        
        return metaTags.join('\n');
    },
    
    // Generate CSS links
    generateCSSLinks: function(additionalCSS = []) {
        const cssLinks = [...standardCSS, ...additionalCSS];
        return cssLinks.map(css => `<link href="${css.href}" rel="stylesheet"/>`).join('\n');
    },
    
    // Generate JS script tags
    generateJSScripts: function(additionalJS = []) {
        const jsFiles = [...standardJS, ...additionalJS];
        return jsFiles.map(js => `<script src="${js}" defer></script>`).join('\n');
    },
    
    // Generate skip links
    generateSkipLinks: function() {
        return `
<div class="skip-links skip-links--bar">
<a href="#main-content" class="skip-link">Skip to main content</a>
<a href="#main-navigation" class="skip-link">Skip to navigation</a>
</div>`;
    },
    
    // Generate header navigation
    generateHeader: function(currentPage = '') {
        const nav = navigationStructure;
        
        return `
<header class="header" role="banner">
<div class="nav-container">
<div class="logo">
<a href="${nav.logo.href}" aria-label="${nav.logo.ariaLabel}">
<img alt="${nav.logo.alt}" src="${nav.logo.src}" width="${nav.logo.width}" height="${nav.logo.height}"/>
</a>
</div>
<nav id="main-navigation" class="nav-links" role="navigation" aria-label="Main navigation">
<a class="nav-link${currentPage === 'index.html' ? ' active' : ''}" href="index.html">Home</a>
<div class="nav-dropdown">
<button type="button" class="nav-dropdown-toggle${nav.services.some(s => s.href === currentPage) ? ' active' : ''}" id="nav-services-toggle" aria-expanded="false" aria-haspopup="true" aria-controls="nav-services-menu">Services <span class="nav-dropdown-arrow" aria-hidden="true">▼</span></button>
<div class="nav-dropdown-menu" id="nav-services-menu" role="group" aria-label="Services">
${nav.services.map(service => `<a href="${service.href}" class="nav-dropdown-item${currentPage === service.href ? ' active' : ''}">${service.text}</a>`).join('\n')}
</div>
</div>
<div class="nav-dropdown">
<button type="button" class="nav-dropdown-toggle${nav.projects.some(p => p.href === currentPage) ? ' active' : ''}" id="nav-projects-toggle" aria-expanded="false" aria-haspopup="true" aria-controls="nav-projects-menu">Projects <span class="nav-dropdown-arrow" aria-hidden="true">▼</span></button>
<div class="nav-dropdown-menu" id="nav-projects-menu" role="group" aria-label="Projects">
${nav.projects.map(project => `<a href="${project.href}" class="nav-dropdown-item${currentPage === project.href ? ' active' : ''}">${project.text}</a>`).join('\n')}
</div>
</div>
<a class="nav-link${currentPage === 'about.html' ? ' active' : ''}" href="about.html">About</a>
<a class="nav-link${currentPage === 'contact.html' ? ' active' : ''}" href="contact.html">Contact</a>
</nav>
<div class="hamburger-nav">
<button type="button" class="hamburger-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-menu">
<span class="hamburger-line"></span>
<span class="hamburger-line"></span>
<span class="hamburger-line"></span>
</button>
<div class="hamburger-menu" id="mobile-menu">
<a href="index.html" class="hamburger-link${currentPage === 'index.html' ? ' active' : ''}">Home</a>
<div class="hamburger-section">
<span class="hamburger-section-title">Services</span>
${nav.services.map(service => `<a href="${service.href}" class="hamburger-link${currentPage === service.href ? ' active' : ''}">${service.text}</a>`).join('\n')}
</div>
<div class="hamburger-section">
<span class="hamburger-section-title">Projects</span>
${nav.projects.map(project => `<a href="${project.href}" class="hamburger-link${currentPage === project.href ? ' active' : ''}">${project.text}</a>`).join('\n')}
</div>
<a href="about.html" class="hamburger-link${currentPage === 'about.html' ? ' active' : ''}">About</a>
<a href="contact.html" class="hamburger-link${currentPage === 'contact.html' ? ' active' : ''}">Contact</a>
</div>
</div>
</div>
</header>`;
    },
    
    // Generate footer
    generateFooter: function() {
        const footer = footerStructure;
        
        return `
<footer class="footer" role="contentinfo" style="background: #f8f8f8; padding: 3rem 2rem 2rem; text-align: center; margin-top: 4rem;">
<div style="max-width: 1200px; margin: 0 auto;">
<!-- Newsletter -->
<div style="margin-bottom: 3rem;">
<h3 style="margin-bottom: 1rem; color: #333;">${footer.newsletter.title}</h3>
<p style="color: #666; margin-bottom: 2rem;">${footer.newsletter.description}</p>
<form action="${footer.newsletter.formAction}" method="POST" style="display: flex; gap: 1rem; max-width: 400px; margin: 0 auto; flex-wrap: wrap;">
<label for="footer-email" class="sr-only">Email for newsletter</label>
<input id="footer-email" type="email" name="email" placeholder="${footer.newsletter.inputPlaceholder}" required autocomplete="email" style="flex: 1; min-width: 200px; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"/>
<input type="hidden" name="_subject" value="Newsletter Subscription"/>
<button type="submit" style="padding: 0.75rem 1.5rem; background: #1a1a1a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">${footer.newsletter.submitText}</button>
</form>
</div>

<!-- Footer Content -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
<div>
<h4 style="margin-bottom: 1rem; color: #333;">${footer.about.title}</h4>
<p style="color: #666;">${footer.about.description}</p>
</div>
<div>
<h4 style="margin-bottom: 1rem; color: #333;">${footer.services.title}</h4>
<div style="display: flex; flex-direction: column; gap: 0.5rem;">
${footer.services.links.map(link => `<a href="${link.href}" style="color: #666; text-decoration: none;">${link.text}</a>`).join('\n')}
</div>
</div>
<div>
<h4 style="margin-bottom: 1rem; color: #333;">${footer.connect.title}</h4>
<div style="display: flex; flex-direction: column; gap: 0.5rem;">
${footer.connect.links.map(link => {
    const external = link.external ? ' target="_blank" rel="noopener"' : '';
    const ariaLabel = link.ariaLabel ? ` aria-label="${link.ariaLabel}"` : '';
    return `<a href="${link.href}"${external}${ariaLabel} style="color: #666; text-decoration: none;">${link.text}</a>`;
}).join('\n')}
</div>
</div>
</div>

<div style="border-top: 1px solid #ddd; padding-top: 2rem; color: #666; font-size: 0.9rem;">
<p>${footer.copyright}</p>
</div>
</div>
</footer>`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { standardMeta, standardCSS, standardJS, navigationStructure, footerStructure, utils };
}

// Global availability for browser use
if (typeof window !== 'undefined') {
    window.SharedComponents = { standardMeta, standardCSS, standardJS, navigationStructure, footerStructure, utils };
}