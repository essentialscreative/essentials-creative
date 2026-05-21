/* ==========================================================================
   Plant Story Cards - JavaScript Utilities
   ========================================================================== */

// Navigation system
class PlantStoriesNav {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '');
    }

    createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'site-nav';
        nav.innerHTML = `
            <div class="nav-container">
                <a href="index.html" class="nav-logo">Plant Story Cards</a>
                <ul class="nav-links">
                    <li><a href="index.html" class="nav-link ${this.currentPage === 'index' ? 'active' : ''}">Overview</a></li>
                    <li><a href="plant_database.html" class="nav-link ${this.currentPage === 'plant_database' ? 'active' : ''}">Plants</a></li>
                    <li><a href="cultural_stories.html" class="nav-link ${this.currentPage === 'cultural_stories' ? 'active' : ''}">Stories</a></li>
                    <li><a href="locations_map.html" class="nav-link ${this.currentPage === 'locations_map' ? 'active' : ''}">Places</a></li>
                    <li><a href="detailed_synthesis.html" class="nav-link ${this.currentPage === 'detailed_synthesis' ? 'active' : ''}">Analysis</a></li>
                    <li><a href="autoplay_slideshow.html" class="nav-link primary ${this.currentPage === 'autoplay_slideshow' ? 'active' : ''}">Presentation</a></li>
                </ul>
                <button class="mobile-menu-btn" aria-label="Toggle navigation menu">☰</button>
            </div>
        `;
        
        // Insert at the beginning of body
        document.body.insertBefore(nav, document.body.firstChild);
        
        // Add mobile menu functionality
        const mobileBtn = nav.querySelector('.mobile-menu-btn');
        const navLinks = nav.querySelector('.nav-links');
        
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
        
        // Close mobile menu when clicking a link
        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navLinks.classList.remove('show');
            }
        });
    }

    createBreadcrumbs() {
        const breadcrumbMap = {
            'index': [{ text: 'Home', href: 'index.html' }],
            'plant_database': [
                { text: 'Home', href: 'index.html' },
                { text: 'Plant Database', href: 'plant_database.html' }
            ],
            'cultural_stories': [
                { text: 'Home', href: 'index.html' },
                { text: 'Cultural Stories', href: 'cultural_stories.html' }
            ],
            'locations_map': [
                { text: 'Home', href: 'index.html' },
                { text: 'Austin Places', href: 'locations_map.html' }
            ],
            'detailed_synthesis': [
                { text: 'Home', href: 'index.html' },
                { text: 'Detailed Analysis', href: 'detailed_synthesis.html' }
            ],
            'autoplay_slideshow': [
                { text: 'Home', href: 'index.html' },
                { text: 'Presentation', href: 'autoplay_slideshow.html' }
            ],
            'slideshow': [
                { text: 'Home', href: 'index.html' },
                { text: 'Manual Slideshow', href: 'slideshow.html' }
            ]
        };

        const breadcrumbs = breadcrumbMap[this.currentPage];
        if (!breadcrumbs || breadcrumbs.length <= 1) return;

        const container = document.querySelector('.container') || document.body;
        const breadcrumbNav = document.createElement('nav');
        breadcrumbNav.className = 'breadcrumbs';
        breadcrumbNav.setAttribute('aria-label', 'Breadcrumb navigation');
        
        const breadcrumbList = document.createElement('ol');
        breadcrumbList.className = 'breadcrumb-list';
        
        breadcrumbs.forEach((crumb, index) => {
            const li = document.createElement('li');
            
            if (index === breadcrumbs.length - 1) {
                // Last item - current page
                li.textContent = crumb.text;
                li.setAttribute('aria-current', 'page');
            } else {
                // Link to previous pages
                const link = document.createElement('a');
                link.href = crumb.href;
                link.textContent = crumb.text;
                li.appendChild(link);
                
                // Add separator
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = '→';
                separator.setAttribute('aria-hidden', 'true');
                li.appendChild(separator);
            }
            
            breadcrumbList.appendChild(li);
        });
        
        breadcrumbNav.appendChild(breadcrumbList);
        container.insertBefore(breadcrumbNav, container.firstChild);
    }

    init() {
        this.createNavigation();
        this.createBreadcrumbs();
    }
}

// Search functionality
class SearchManager {
    constructor() {
        this.searchData = [];
        this.init();
    }

    async loadSearchData() {
        // This would typically load from a JSON file or API
        // For now, we'll populate with static data
        this.searchData = [
            { title: 'Bluebonnets', type: 'plant', url: 'plant_database.html#bluebonnets', content: 'Texas state flower, native wildflower' },
            { title: 'Mountain Laurel', type: 'plant', url: 'plant_database.html#mountain-laurel', content: 'Grape soda scent, native Texas' },
            { title: 'Nopal', type: 'plant', url: 'plant_database.html#nopal', content: 'Prickly pear cactus, traditional food' },
            { title: 'Rice', type: 'plant', url: 'plant_database.html#rice', content: 'Staple food across many cultures' },
            { title: 'Chili Pequin', type: 'plant', url: 'plant_database.html#chili-pequin', content: 'Native Texas pepper, traditional spice' },
            { title: 'Deep Eddy', type: 'place', url: 'locations_map.html#deep-eddy', content: 'Historic Austin swimming hole' },
            { title: 'Barton Springs', type: 'place', url: 'locations_map.html#barton-springs', content: 'Natural springs, community gathering place' },
            { title: 'Elder Teachings', type: 'story', url: 'cultural_stories.html#elder-teachings', content: 'Wisdom passed down through generations' },
            { title: 'Food Traditions', type: 'story', url: 'cultural_stories.html#food-traditions', content: 'Cultural recipes and celebrations' }
        ];
    }

    createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="search" class="search-input" placeholder="Search plants, places, or stories..." aria-label="Search content">
            <div class="search-results" aria-live="polite"></div>
        `;

        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(searchContainer, container.children[1] || container.firstChild);
        }

        const searchInput = searchContainer.querySelector('.search-input');
        const searchResults = searchContainer.querySelector('.search-results');

        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value, searchResults);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    performSearch(query, resultsContainer) {
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        const results = this.searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );

        this.displayResults(results, resultsContainer);
    }

    displayResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-result">No results found</div>';
        } else {
            container.innerHTML = results.map(result => `
                <div class="search-result" data-url="${result.url}">
                    <strong>${result.title}</strong>
                    <br><small>${result.content}</small>
                    <span class="result-type">${result.type}</span>
                </div>
            `).join('');
        }

        container.style.display = 'block';

        // Add click handlers to results
        container.querySelectorAll('.search-result[data-url]').forEach(result => {
            result.addEventListener('click', () => {
                window.location.href = result.dataset.url;
            });
        });
    }

    async init() {
        await this.loadSearchData();
        this.createSearchInterface();
    }
}

// Back to top functionality
class BackToTop {
    constructor() {
        this.createButton();
        this.setupScrollListener();
    }

    createButton() {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Back to top');
        button.setAttribute('title', 'Back to top');
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.body.appendChild(button);
        this.button = button;
    }

    setupScrollListener() {
        let throttleTimer = null;
        
        window.addEventListener('scroll', () => {
            if (throttleTimer) return;
            
            throttleTimer = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 300) {
                    this.button.classList.add('show');
                } else {
                    this.button.classList.remove('show');
                }
                
                throttleTimer = null;
            }, 100);
        });
    }
}

// Filter functionality for lists
class FilterManager {
    constructor(containerSelector, itemSelector) {
        this.container = document.querySelector(containerSelector);
        this.itemSelector = itemSelector;
        this.activeFilters = new Set(['all']);
        this.init();
    }

    extractFilterCategories() {
        if (!this.container) return [];
        
        const items = this.container.querySelectorAll(this.itemSelector);
        const categories = new Set(['all']);
        
        items.forEach(item => {
            const itemCategories = item.dataset.categories?.split(',') || ['other'];
            itemCategories.forEach(cat => categories.add(cat.trim()));
        });
        
        return Array.from(categories);
    }

    createFilterInterface() {
        const categories = this.extractFilterCategories();
        if (categories.length <= 2) return; // Only 'all' and one other category
        
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = `filter-btn ${category === 'all' ? 'active' : ''}`;
            button.dataset.filter = category;
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            
            button.addEventListener('click', () => {
                this.toggleFilter(category);
            });
            
            filterContainer.appendChild(button);
        });
        
        this.container.parentNode.insertBefore(filterContainer, this.container);
    }

    toggleFilter(category) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        if (category === 'all') {
            this.activeFilters.clear();
            this.activeFilters.add('all');
            filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });
        } else {
            this.activeFilters.delete('all');
            
            if (this.activeFilters.has(category)) {
                this.activeFilters.delete(category);
            } else {
                this.activeFilters.add(category);
            }
            
            // If no filters active, activate 'all'
            if (this.activeFilters.size === 0) {
                this.activeFilters.add('all');
            }
            
            filterBtns.forEach(btn => {
                const btnCategory = btn.dataset.filter;
                btn.classList.toggle('active', this.activeFilters.has(btnCategory));
            });
        }
        
        this.applyFilters();
    }

    applyFilters() {
        if (!this.container) return;
        
        const items = this.container.querySelectorAll(this.itemSelector);
        
        items.forEach(item => {
            const itemCategories = item.dataset.categories?.split(',').map(c => c.trim()) || ['other'];
            const shouldShow = this.activeFilters.has('all') || 
                             itemCategories.some(cat => this.activeFilters.has(cat));
            
            item.style.display = shouldShow ? '' : 'none';
        });
    }

    init() {
        if (this.container) {
            this.createFilterInterface();
        }
    }
}

// Initialize all utilities when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PlantStoriesNav();
    new SearchManager();
    new BackToTop();
    
    // Initialize filters if there are filterable elements
    if (document.querySelector('[data-categories]')) {
        new FilterManager('.plant-grid, .story-grid, .location-grid', '[data-categories]');
    }
});

// Export for use in other files
window.PlantStoriesUtils = {
    PlantStoriesNav,
    SearchManager,
    BackToTop,
    FilterManager
};