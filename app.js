/* ==========================================================================
   Plant Story Cards - Consolidated JavaScript
   Combines utils.js and scripts.js functionality
   ========================================================================== */

(function() {
    'use strict';

    /* ==========================================================================
       Core Application Module
       ========================================================================== */
    
    const PlantStoryCards = {
        // Configuration
        config: {
            searchMinLength: 2,
            scrollThreshold: 300,
            debounceDelay: 300
        },
        
        // Search data storage
        searchData: [],
        
        // Initialize application
        init: function() {
            // Core initialization
            this.setupMobileMenu();
            this.setupBackToTop();
            this.setupSearch();
            this.setupFilters();
            this.setupTags();
            this.buildSearchIndex();
            this.setupSmoothScroll();
            this.setupKeyboardNavigation();
            
            // Page-specific features
            this.initPlantDatabase();
            this.initStoriesPage();
        }
    };

    /* ==========================================================================
       Navigation & UI Components
       ========================================================================== */
    
    PlantStoryCards.setupMobileMenu = function() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (!mobileMenuBtn || !navLinks) return;
        
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                mobileMenuBtn.focus();
            }
        });
    };
    
    PlantStoryCards.setupBackToTop = function() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', debounce(function() {
            if (window.pageYOffset > PlantStoryCards.config.scrollThreshold) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.removeAttribute('hidden');
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.setAttribute('hidden', '');
            }
        }, 100));
        
        // Scroll to top on click
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    /* ==========================================================================
       Search Functionality
       ========================================================================== */
    
    PlantStoryCards.setupSearch = function() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        if (!searchInput || !searchResults) return;
        
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < PlantStoryCards.config.searchMinLength) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                return;
            }
            
            const results = PlantStoryCards.searchData.filter(item =>
                item.text.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
            
            PlantStoryCards.displaySearchResults(results.slice(0, 10), searchResults);
        }, PlantStoryCards.config.debounceDelay));
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    };
    
    PlantStoryCards.displaySearchResults = function(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-result">No results found</div>';
        } else {
            container.innerHTML = results.map(result =>
                `<div class="search-result" data-category="${result.category}" tabindex="0">
                    <strong>${result.category}</strong>: ${result.text}
                </div>`
            ).join('');
            
            // Add click handlers
            container.querySelectorAll('.search-result').forEach(result => {
                result.addEventListener('click', function() {
                    PlantStoryCards.highlightSearchResult(this.dataset.category, this.textContent);
                    container.classList.remove('active');
                    document.getElementById('search-input').value = '';
                });
            });
        }
        
        container.classList.add('active');
    };
    
    PlantStoryCards.highlightSearchResult = function(category, text) {
        const allTags = document.querySelectorAll('.tag');
        const textToFind = text.split(': ')[1] || text;
        
        allTags.forEach(tag => {
            if (tag.textContent.trim() === textToFind.trim()) {
                tag.scrollIntoView({ behavior: 'smooth', block: 'center' });
                tag.classList.add('active');
                setTimeout(() => tag.classList.remove('active'), 2000);
                tag.focus();
            }
        });
    };
    
    PlantStoryCards.buildSearchIndex = function() {
        // Index all tags
        document.querySelectorAll('.tag').forEach(tag => {
            const category = tag.closest('.theme-section')?.querySelector('h3')?.textContent || 'General';
            this.searchData.push({
                text: tag.textContent.trim(),
                category: category,
                element: tag
            });
        });
        
        // Index section titles
        document.querySelectorAll('.theme-section h3').forEach(heading => {
            this.searchData.push({
                text: heading.textContent.trim(),
                category: 'Section',
                element: heading
            });
        });
        
        // Index insights
        document.querySelectorAll('.insight-card h3').forEach(heading => {
            this.searchData.push({
                text: heading.textContent.trim(),
                category: 'Insight',
                element: heading.parentElement
            });
        });
    };

    /* ==========================================================================
       Filter & Tag Functionality
       ========================================================================== */
    
    PlantStoryCards.setupFilters = function() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns.length === 0) return;
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                
                // Filter content
                PlantStoryCards.filterContent(filter);
            });
        });
    };
    
    PlantStoryCards.filterContent = function(filter) {
        const sections = document.querySelectorAll('.theme-section, .story-card, .wisdom-card');
        
        sections.forEach(section => {
            if (filter === 'all') {
                section.style.display = '';
            } else {
                const category = section.dataset.category;
                section.style.display = (category === filter) ? '' : 'none';
            }
        });
    };
    
    PlantStoryCards.setupTags = function() {
        const tags = document.querySelectorAll('.tag');
        
        tags.forEach(tag => {
            tag.addEventListener('click', function() {
                this.classList.toggle('active');
                
                // Optional: Show notification
                const tagText = this.textContent.trim();
                console.log(`Tag selected: ${tagText}`);
            });
            
            // Keyboard support
            tag.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    };

    /* ==========================================================================
       Page-Specific Features
       ========================================================================== */
    
    PlantStoryCards.initPlantDatabase = function() {
        if (!document.querySelector('.plant-grid')) return;
        
        const plantCards = document.querySelectorAll('.plant-card');
        
        plantCards.forEach(card => {
            card.addEventListener('click', function() {
                // Could open a modal or navigate to detail page
                const plantName = this.querySelector('.plant-name')?.textContent;
                console.log(`Plant selected: ${plantName}`);
            });
        });
    };
    
    PlantStoryCards.initStoriesPage = function() {
        if (!document.querySelector('.story-grid')) return;
        
        const storyCards = document.querySelectorAll('.story-card');
        
        storyCards.forEach(card => {
            card.addEventListener('click', function() {
                // Add animation effect
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    };

    /* ==========================================================================
       Smooth Scrolling & Navigation
       ========================================================================== */
    
    PlantStoryCards.setupSmoothScroll = function() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL
                    history.pushState(null, null, targetId);
                    
                    // Focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    };

    /* ==========================================================================
       Keyboard Navigation
       ========================================================================== */
    
    PlantStoryCards.setupKeyboardNavigation = function() {
        // Skip to main content
        const skipNav = document.querySelector('.skip-nav');
        if (skipNav) {
            skipNav.addEventListener('click', function(e) {
                e.preventDefault();
                const main = document.getElementById('main-content');
                if (main) {
                    main.setAttribute('tabindex', '-1');
                    main.focus();
                }
            });
        }
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.focus();
            }
            
            // ? for help
            if (e.key === '?' && !isInputFocused()) {
                e.preventDefault();
                PlantStoryCards.showHelp();
            }
        });
    };
    
    PlantStoryCards.showHelp = function() {
        console.log('Keyboard Shortcuts:');
        console.log('Ctrl/Cmd + K: Focus search');
        console.log('?: Show this help');
        console.log('Escape: Close modals/menus');
    };

    /* ==========================================================================
       Utility Functions
       ========================================================================== */
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement.tagName === 'INPUT' ||
               activeElement.tagName === 'TEXTAREA' ||
               activeElement.isContentEditable;
    }

    /* ==========================================================================
       Progressive Enhancement
       ========================================================================== */
    
    // Check for JavaScript support
    document.documentElement.classList.add('js-enabled');
    
    // Lazy load images if present
    if ('IntersectionObserver' in window) {
        const lazyLoadImages = () => {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        };
        
        document.addEventListener('DOMContentLoaded', lazyLoadImages);
    }

    /* ==========================================================================
       Initialize Application
       ========================================================================== */
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PlantStoryCards.init());
    } else {
        PlantStoryCards.init();
    }
    
    // Export for potential external use
    window.PlantStoryCards = PlantStoryCards;

})();