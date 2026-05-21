/**
 * Lazy Loading Implementation for Images
 * Supports native lazy loading with IntersectionObserver fallback
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    rootMargin: '50px 0px',
    threshold: 0.01,
    loadedClass: 'lazy-loaded',
    loadingClass: 'lazy-loading',
    errorClass: 'lazy-error'
  };

  // Check for native lazy loading support
  const hasNativeLazyLoad = 'loading' in HTMLImageElement.prototype;

  /**
   * Load image and handle WebP fallback
   */
  function loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    const webpSrc = img.dataset.webp;
    
    if (!src) return;

    img.classList.add(config.loadingClass);

    // Try WebP first if available and supported
    if (webpSrc && supportsWebP()) {
      const webpImg = new Image();
      webpImg.onload = function() {
        img.src = webpSrc;
        handleImageLoad(img);
      };
      webpImg.onerror = function() {
        // Fallback to original format
        loadOriginalImage(img, src, srcset);
      };
      webpImg.src = webpSrc;
    } else {
      loadOriginalImage(img, src, srcset);
    }
  }

  /**
   * Load original image format
   */
  function loadOriginalImage(img, src, srcset) {
    const tempImg = new Image();
    
    tempImg.onload = function() {
      if (srcset) img.srcset = srcset;
      img.src = src;
      handleImageLoad(img);
    };
    
    tempImg.onerror = function() {
      handleImageError(img);
    };
    
    tempImg.src = src;
  }

  /**
   * Handle successful image load
   */
  function handleImageLoad(img) {
    img.classList.remove(config.loadingClass);
    img.classList.add(config.loadedClass);
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
    img.removeAttribute('data-webp');
    
    // Trigger custom event
    img.dispatchEvent(new CustomEvent('lazyloaded', {
      detail: { img },
      bubbles: true
    }));
  }

  /**
   * Handle image load error
   */
  function handleImageError(img) {
    img.classList.remove(config.loadingClass);
    img.classList.add(config.errorClass);
    
    // Set fallback image if available
    const fallback = img.dataset.fallback;
    if (fallback) {
      img.src = fallback;
    }
    
    // Trigger error event
    img.dispatchEvent(new CustomEvent('lazyerror', {
      detail: { img },
      bubbles: true
    }));
  }

  /**
   * Check WebP support
   */
  function supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
  }

  /**
   * IntersectionObserver setup
   */
  function setupIntersectionObserver() {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, config);

    return imageObserver;
  }

  /**
   * Initialize lazy loading
   */
  function init() {
    const images = document.querySelectorAll('img[data-src], img.lazy');
    
    if (images.length === 0) return;

    if (hasNativeLazyLoad) {
      // Use native lazy loading
      images.forEach(function(img) {
        if (img.dataset.src) {
          img.loading = 'lazy';
          
          // WebP support with native lazy loading
          if (img.dataset.webp && supportsWebP()) {
            img.src = img.dataset.webp;
          } else {
            img.src = img.dataset.src;
          }
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          handleImageLoad(img);
        }
      });
    } else if ('IntersectionObserver' in window) {
      // Use IntersectionObserver
      const observer = setupIntersectionObserver();
      images.forEach(function(img) {
        observer.observe(img);
      });
    } else {
      // Fallback: load all images immediately
      images.forEach(function(img) {
        loadImage(img);
      });
    }
  }

  /**
   * Public API
   */
  window.LazyLoad = {
    init: init,
    load: loadImage,
    config: config
  };

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize on dynamic content changes
  document.addEventListener('contentChanged', init);

})();