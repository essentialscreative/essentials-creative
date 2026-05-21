/**
 * Unified Gallery Lightbox System
 * Provides consistent lightbox functionality across all gallery pages
 * Supports dynamic content and re-initialization
 */

(function() {
    'use strict';
    
    let lightbox = null;
    let lightboxImage = null;
    let lightboxCaption = null;
    let lightboxClose = null;
    let lightboxPrev = null;
    let lightboxNext = null;
    let currentIndex = 0;
    let images = [];
    
    // Create lightbox HTML structure
    function createLightbox() {
        // Check if lightbox already exists
        if (document.getElementById('unified-lightbox')) {
            return;
        }
        
        const lightboxHTML = `
            <div class="lightbox" id="unified-lightbox">
                <div class="lightbox-content">
                    <img class="lightbox-image" id="unified-lightbox-image" alt="">
                    <div class="lightbox-caption" id="unified-lightbox-caption"></div>
                </div>
                <button class="lightbox-close" id="unified-lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-nav lightbox-prev" id="unified-lightbox-prev" aria-label="Previous image">&#8249;</button>
                <button class="lightbox-nav lightbox-next" id="unified-lightbox-next" aria-label="Next image">&#8250;</button>
            </div>
        `;
        
        // Add lightbox to document
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        // Add CSS if not already present
        if (!document.querySelector('#unified-lightbox-styles')) {
            const styles = `
                <style id="unified-lightbox-styles">
                    .lightbox {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.95);
                        z-index: 9999;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .lightbox.active {
                        display: flex;
                    }
                    
                    .lightbox-content {
                        max-width: 90%;
                        max-height: 90%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .lightbox-image {
                        max-width: 100%;
                        max-height: 85vh;
                        object-fit: contain;
                        border-radius: 8px;
                    }
                    
                    .lightbox-caption {
                        display: none;
                    }
                    
                    .lightbox-close {
                        position: absolute;
                        top: 20px;
                        right: 40px;
                        font-size: 3rem;
                        color: white;
                        background: none;
                        border: none;
                        cursor: pointer;
                        transition: opacity 0.3s;
                        z-index: 10000;
                    }
                    
                    .lightbox-close:hover {
                        opacity: 0.7;
                    }
                    
                    .lightbox-nav {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                        border: none;
                        padding: 1rem;
                        font-size: 3rem;
                        cursor: pointer;
                        transition: background 0.3s;
                        z-index: 10000;
                        border-radius: 4px;
                    }
                    
                    .lightbox-nav:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    
                    .lightbox-prev {
                        left: 20px;
                    }
                    
                    .lightbox-next {
                        right: 20px;
                    }
                    
                    body.lightbox-open {
                        overflow: hidden;
                    }
                    
                    @media (max-width: 768px) {
                        .lightbox-close {
                            top: 10px;
                            right: 20px;
                            font-size: 2rem;
                        }
                        
                        .lightbox-nav {
                            font-size: 2rem;
                            padding: 0.5rem;
                        }
                        
                        .lightbox-prev {
                            left: 10px;
                        }
                        
                        .lightbox-next {
                            right: 10px;
                        }
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
        
        // Get lightbox elements
        lightbox = document.getElementById('unified-lightbox');
        lightboxImage = document.getElementById('unified-lightbox-image');
        lightboxCaption = document.getElementById('unified-lightbox-caption');
        lightboxClose = document.getElementById('unified-lightbox-close');
        lightboxPrev = document.getElementById('unified-lightbox-prev');
        lightboxNext = document.getElementById('unified-lightbox-next');
        
        // Setup event listeners
        setupEventListeners();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        if (!lightbox) return;
        
        // Close button
        lightboxClose.addEventListener('click', closeLightbox);
        
        // Navigation buttons
        lightboxPrev.addEventListener('click', showPrevious);
        lightboxNext.addEventListener('click', showNext);
        
        // Close on background click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevious();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
            }
        });
    }
    
    // Initialize lightbox for gallery images
    function initLightbox() {
        // Create lightbox if it doesn't exist
        createLightbox();
        
        // Clear existing images array
        images = [];
        
        // Find all gallery images
        const selectors = [
            '.lightbox-trigger img',
            '.gallery-item img',
            '.gallery-item-with-caption img',
            '[onclick*="openLightbox"]'
        ];
        
        const triggers = document.querySelectorAll(selectors.join(', '));
        
        // Populate images array and add click handlers
        triggers.forEach((element, index) => {
            let img = element;
            let container = element;
            
            // Handle different element types
            if (element.tagName !== 'IMG') {
                img = element.querySelector('img');
                container = element;
            } else {
                container = element.parentElement;
            }
            
            if (img) {
                images.push({
                    src: img.src || img.getAttribute('src'),
                    alt: img.alt || img.getAttribute('alt') || ''
                });
                
                // Remove existing onclick if present
                if (container.hasAttribute('onclick')) {
                    container.removeAttribute('onclick');
                }
                
                // Add click event
                container.style.cursor = 'pointer';
                container.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openLightbox(index);
                });
            }
        });
        
        console.log(`Lightbox initialized with ${images.length} images`);
    }
    
    // Open lightbox
    function openLightbox(index) {
        if (!lightbox || !images.length) return;
        
        currentIndex = Math.max(0, Math.min(index, images.length - 1));
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Focus management for accessibility
        lightboxClose.focus();
    }
    
    // Close lightbox
    function closeLightbox() {
        if (!lightbox) return;
        
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }
    
    // Update lightbox image
    function updateLightboxImage() {
        if (!images[currentIndex]) return;
        
        lightboxImage.src = images[currentIndex].src;
        lightboxImage.alt = images[currentIndex].alt;
        lightboxCaption.textContent = images[currentIndex].alt;
        
        // Update navigation button visibility
        lightboxPrev.style.display = currentIndex > 0 ? 'block' : 'none';
        lightboxNext.style.display = currentIndex < images.length - 1 ? 'block' : 'none';
    }
    
    // Show previous image
    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightboxImage();
        }
    }
    
    // Show next image
    function showNext() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateLightboxImage();
        }
    }
    
    // Make functions globally accessible
    window.initLightbox = initLightbox;
    window.openLightbox = openLightbox;
    
    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        // DOM is already loaded
        initLightbox();
    }
    
    // Re-initialize when new content is added (for dynamic galleries)
    const observer = new MutationObserver(function(mutations) {
        let shouldReinit = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (
                        node.classList?.contains('gallery-item') ||
                        node.querySelector?.('.gallery-item') ||
                        node.querySelector?.('img')
                    )) {
                        shouldReinit = true;
                    }
                });
            }
        });
        
        if (shouldReinit) {
            setTimeout(initLightbox, 100);
        }
    });
    
    // Observe gallery containers for changes
    const galleryContainers = document.querySelectorAll(
        '#photography-gallery, #design-gallery, #videoGrid, .gallery-grid, .installations-grid, #rhizomatic-home-gallery'
    );
    
    galleryContainers.forEach(container => {
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        }
    });
    
})();