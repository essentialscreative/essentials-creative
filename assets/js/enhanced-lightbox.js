// Enhanced Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Create lightbox HTML structure
    const lightboxHTML = `
        <div class="lightbox" id="lightbox">
            <div class="lightbox-content">
                <img class="lightbox-image" id="lightbox-image" alt="">
                <div class="lightbox-caption" id="lightbox-caption"></div>
            </div>
            <button class="lightbox-close" id="lightbox-close" aria-label="Close lightbox">&times;</button>
            <button class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Previous image">&#8249;</button>
            <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Next image">&#8250;</button>
        </div>
    `;
    
    // Add lightbox to document
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    // Get lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    // Get all lightbox triggers
    const triggers = document.querySelectorAll('.lightbox-trigger img, .gallery-item img');
    let currentIndex = 0;
    let images = [];
    
    // Populate images array
    triggers.forEach((img, index) => {
        images.push({
            src: img.src,
            alt: img.alt || 'Gallery Image'
        });
        
        // Add click event to trigger
        img.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(index);
        });
    });
    
    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Focus management for accessibility
        lightboxClose.focus();
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }
    
    // Update lightbox image
    function updateLightboxImage() {
        if (images[currentIndex]) {
            lightboxImage.src = images[currentIndex].src;
            lightboxImage.alt = images[currentIndex].alt;
            lightboxCaption.textContent = images[currentIndex].alt;
        }
        
        // Update navigation button states
        lightboxPrev.style.display = currentIndex > 0 ? 'block' : 'none';
        lightboxNext.style.display = currentIndex < images.length - 1 ? 'block' : 'none';
    }
    
    // Previous image
    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightboxImage();
        }
    }
    
    // Next image
    function showNext() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateLightboxImage();
        }
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
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
    
    // Add hover effects to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            item.addEventListener('mouseenter', function() {
                img.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', function() {
                img.style.transform = 'scale(1)';
            });
        }
    });
    
    // Intersection Observer for lazy loading
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
        
        // Observe images with data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});