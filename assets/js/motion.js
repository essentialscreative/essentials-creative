/**
 * motion.js — site-wide subtle motion (vanilla, no dependencies).
 *
 * 1. Reveal: adds `.in` to any [data-reveal] element when it scrolls into
 *    view (pairs with the `.rise` CSS class in main.css and `.reveal` blocks).
 * 2. Parallax: gently drifts the background of single-image `.hero` sections.
 *
 * Fully respects prefers-reduced-motion and degrades gracefully without
 * IntersectionObserver. Loaded with `defer` on every content page.
 */
(function () {
    'use strict';

    var reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealAll() {
        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            el.classList.add('in');
        });
    }

    // --- Reveal -------------------------------------------------------------
    function initReveal() {
        // Reduced motion or no IO support: show everything immediately.
        if (reduce || !('IntersectionObserver' in window)) {
            revealAll();
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            io.observe(el);
        });
    }

    // --- Hero parallax ------------------------------------------------------
    function initParallax() {
        if (reduce) return;
        // Only single-image hero sections (skip the index slideshow).
        var heroes = Array.prototype.filter.call(
            document.querySelectorAll('section.hero'),
            function (h) { return /background-image/.test(h.getAttribute('style') || ''); }
        );
        if (!heroes.length) return;
        // Pointer-capable / larger screens only — avoid mobile jank.
        if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return;

        var FACTOR = 0.15;   // drift rate relative to scroll
        var MAX = 120;       // px cap
        var ticking = false;

        function update() {
            ticking = false;
            var y = window.pageYOffset || 0;
            heroes.forEach(function (h) {
                var rect = h.getBoundingClientRect();
                // Skip work once the hero is well above the viewport.
                if (rect.bottom < -100) return;
                var offset = Math.min(y * FACTOR, MAX);
                h.style.backgroundPosition = 'center calc(50% + ' + offset.toFixed(1) + 'px)';
            });
        }
        function onScroll() {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        update();
    }

    function init() { initReveal(); initParallax(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
