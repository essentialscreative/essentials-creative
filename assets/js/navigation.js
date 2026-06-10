// Navigation and Core JavaScript - Consolidated
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('Essentials Creative site initialized');
    
    // Mobile menu toggle
    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    if (hamburgerToggle && hamburgerMenu) {
        function setMenuOpen(open) {
            if (open) {
                // Clear legacy inline hides (they beat .hamburger-menu.active { display: block })
                hamburgerMenu.style.removeProperty('display');
                hamburgerMenu.style.removeProperty('visibility');
                hamburgerMenu.classList.add('active');
                hamburgerToggle.classList.add('active');
                hamburgerToggle.setAttribute('aria-expanded', 'true');
                document.body.classList.add('menu-open');
            } else {
                hamburgerMenu.classList.remove('active');
                hamburgerToggle.classList.remove('active');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
                // collapse accordion sections so the menu reopens compact
                hamburgerMenu.querySelectorAll('.hamburger-section.open').forEach(function (sec) {
                    sec.classList.remove('open');
                    var t = sec.querySelector('.hamburger-section-title');
                    if (t) t.setAttribute('aria-expanded', 'false');
                });
            }
        }

        hamburgerToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            setMenuOpen(!hamburgerMenu.classList.contains('active'));
        });

        document.addEventListener('click', function (event) {
            if (!hamburgerMenu.classList.contains('active')) return;
            var t = event.target;
            if (hamburgerToggle.contains(t) || hamburgerMenu.contains(t)) return;
            setMenuOpen(false);
        });

        const hamburgerLinks = document.querySelectorAll('.hamburger-link');
        hamburgerLinks.forEach(link => {
            link.addEventListener('click', function() {
                setMenuOpen(false);
            });
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && hamburgerMenu.classList.contains('active')) {
                setMenuOpen(false);
                hamburgerToggle.focus();
            }
        });

        // Accordion: tap a section title to expand/collapse its links
        hamburgerMenu.querySelectorAll('.hamburger-section-title').forEach(function (title) {
            title.setAttribute('role', 'button');
            title.setAttribute('tabindex', '0');
            title.setAttribute('aria-expanded', 'false');
            function toggleSection() {
                var sec = title.closest('.hamburger-section');
                if (!sec) return;
                var open = sec.classList.toggle('open');
                title.setAttribute('aria-expanded', open ? 'true' : 'false');
            }
            title.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleSection();
            });
            title.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection();
                }
            });
        });
    }
    
    // Core functionality from main.js - Smooth scrolling
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        if (button.getAttribute('href')?.startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    if (window.lenis) {
                        window.lenis.scrollTo(targetElement, { offset: -80 });
                    } else {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    });
    
    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Form validation for newsletter
    const newsletterForms = document.querySelectorAll('form[action*="formspree"]');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && !emailInput.value.includes('@')) {
                e.preventDefault();
                alert('Please enter a valid email address');
            }
        });
    });

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

    // Dropdowns (not tied to IntersectionObserver — must run in all supported browsers)
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    function setDropdownOpen(dropdown, open) {
        dropdown.classList.toggle('open', open);
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
    }

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        const menu = dropdown.querySelector('.nav-dropdown-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const willOpen = !dropdown.classList.contains('open');
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        setDropdownOpen(otherDropdown, false);
                    }
                });

                setDropdownOpen(dropdown, willOpen);
            });

            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    setDropdownOpen(dropdown, false);
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    setDropdownOpen(dropdown, false);
                }
            });

            const dropdownItems = menu.querySelectorAll('.nav-dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function() {
                    setDropdownOpen(dropdown, false);
                });
            });
        }
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item');

    dropdownItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        if (itemPath === currentPage) {
            item.classList.add('active');
            const parentDropdown = item.closest('.nav-dropdown');
            if (parentDropdown) {
                const dropdownToggle = parentDropdown.querySelector('.nav-dropdown-toggle');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('active');
                }
            }
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
                    if (window.lenis) {
                        window.lenis.scrollTo(targetElement, { offset: -80 });
                    } else {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});

// Lazy loading images (optional API)
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

    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}
