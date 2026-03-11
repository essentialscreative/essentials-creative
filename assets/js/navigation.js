// Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (hamburgerToggle && hamburgerMenu) {
        hamburgerToggle.addEventListener('click', function() {
            const isActive = hamburgerMenu.classList.contains('active');
            
            if (isActive) {
                hamburgerMenu.classList.remove('active');
                hamburgerToggle.classList.remove('active');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
            } else {
                hamburgerMenu.classList.add('active');
                hamburgerToggle.classList.add('active');
                hamburgerToggle.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburgerToggle.contains(event.target) && !hamburgerMenu.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                hamburgerToggle.classList.remove('active');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && hamburgerMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                hamburgerToggle.classList.remove('active');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
                hamburgerToggle.focus();
            }
        });
    }
    
    // Active link highlighting based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .hamburger-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
});

// Utility function for lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    // Observe all images with data-src attribute
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}