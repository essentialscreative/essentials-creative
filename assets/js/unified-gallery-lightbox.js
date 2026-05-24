/**
 * Unified Gallery Lightbox System — "Editorial morph"
 * Native <dialog> + View Transitions API.
 *
 * - Clicked thumbnail morphs into the full image (View Transitions); graceful
 *   fade fallback where unsupported or when prefers-reduced-motion is set.
 * - Native dialog.showModal() gives focus-trap, Esc, and inert background for free;
 *   focus returns to the triggering thumbnail on close.
 * - Counter, caption, keyboard nav, touch swipe, click/tap-to-zoom, neighbour preload.
 * - Styling lives in assets/css/enhanced-lightbox.css (single source of truth).
 *
 * Works across all gallery pages; supports dynamic content via MutationObserver.
 */

(function () {
    'use strict';

    const VT_NAME = 'lb-active';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let dialog = null;
    let imgEl = null;
    let captionEl = null;
    let counterEl = null;
    let prevBtn = null;
    let nextBtn = null;
    let stageEl = null;

    let items = [];          // [{ el: <img>, src, alt }]
    let currentIndex = 0;
    let lastTrigger = null;  // element to return focus to
    let zoomed = false;

    // ---- Build the dialog once ---------------------------------------------
    function createLightbox() {
        if (document.getElementById('unified-lightbox')) return;

        const html = `
            <dialog class="lightbox" id="unified-lightbox" aria-label="Image viewer">
                <div class="lightbox-counter" id="unified-lightbox-counter" aria-hidden="true"></div>
                <div class="lightbox-stage" id="unified-lightbox-stage">
                    <img class="lightbox-image" id="unified-lightbox-image" alt="">
                </div>
                <p class="lightbox-caption" id="unified-lightbox-caption"></p>
                <button class="lightbox-close" id="unified-lightbox-close" type="button" aria-label="Close (Esc)">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
                </button>
                <button class="lightbox-nav lightbox-prev" id="unified-lightbox-prev" type="button" aria-label="Previous image">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg>
                </button>
                <button class="lightbox-nav lightbox-next" id="unified-lightbox-next" type="button" aria-label="Next image">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg>
                </button>
            </dialog>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        dialog = document.getElementById('unified-lightbox');
        imgEl = document.getElementById('unified-lightbox-image');
        captionEl = document.getElementById('unified-lightbox-caption');
        counterEl = document.getElementById('unified-lightbox-counter');
        prevBtn = document.getElementById('unified-lightbox-prev');
        nextBtn = document.getElementById('unified-lightbox-next');
        stageEl = document.getElementById('unified-lightbox-stage');

        bindEvents();
    }

    function bindEvents() {
        document.getElementById('unified-lightbox-close').addEventListener('click', close);
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

        // Click the image to toggle zoom; click the empty stage/backdrop to close.
        imgEl.addEventListener('click', (e) => { e.stopPropagation(); toggleZoom(e); });
        imgEl.addEventListener('mousemove', panZoom);
        stageEl.addEventListener('click', (e) => { if (e.target === stageEl) close(); });

        // Native dialog: backdrop click + Esc.
        dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
        dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); }); // Esc

        document.addEventListener('keydown', (e) => {
            if (!dialog.open) return;
            if (e.key === 'ArrowRight') showNext();
            else if (e.key === 'ArrowLeft') showPrev();
        });

        // Touch swipe.
        let startX = 0, startY = 0;
        dialog.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX; startY = e.touches[0].clientY;
        }, { passive: true });
        dialog.addEventListener('touchend', (e) => {
            if (zoomed) return;
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                dx < 0 ? showNext() : showPrev();
            } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
                close(); // swipe down to dismiss
            }
        }, { passive: true });
    }

    // ---- Collect gallery images --------------------------------------------
    function initLightbox() {
        createLightbox();
        items = [];

        const selectors = [
            '.lightbox-trigger img',
            '.gallery-item img',
            '.gallery-item-with-caption img',
            '[onclick*="openLightbox"]'
        ];
        const triggers = document.querySelectorAll(selectors.join(', '));

        triggers.forEach((element) => {
            const img = element.tagName === 'IMG' ? element : element.querySelector('img');
            const container = element.tagName === 'IMG' ? element.parentElement : element;
            if (!img) return;

            const index = items.length;
            items.push({ el: img, src: img.currentSrc || img.src || img.getAttribute('src'), alt: img.alt || '' });

            if (container.hasAttribute('onclick')) container.removeAttribute('onclick');
            container.style.cursor = 'zoom-in';

            if (container.dataset.lbBound === '1') return; // avoid double-binding on re-init
            container.dataset.lbBound = '1';
            container.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                open(index, img);
            });
        });
    }

    // ---- Open / close with morph -------------------------------------------
    function canMorph() {
        return typeof document.startViewTransition === 'function' && !reduceMotion.matches;
    }

    function open(index, triggerImg) {
        if (!dialog || !items.length) return;
        currentIndex = Math.max(0, Math.min(index, items.length - 1));
        lastTrigger = triggerImg || items[currentIndex].el;
        setZoom(false);

        const mount = () => {
            applyImage();
            dialog.showModal();
            document.body.classList.add('lightbox-open');
        };

        if (canMorph() && lastTrigger) {
            lastTrigger.style.viewTransitionName = VT_NAME;
            const t = document.startViewTransition(() => {
                lastTrigger.style.viewTransitionName = '';
                mount();
                imgEl.style.viewTransitionName = VT_NAME;
            });
            t.finished.finally(() => { imgEl.style.viewTransitionName = ''; });
        } else {
            mount();
        }
        // Move focus to the close control without scrolling.
        requestAnimationFrame(() => dialog.querySelector('.lightbox-close')?.focus({ preventScroll: true }));
    }

    function close() {
        if (!dialog || !dialog.open) return;
        setZoom(false);
        const target = items[currentIndex]?.el || lastTrigger;

        const unmount = () => {
            dialog.close();
            document.body.classList.remove('lightbox-open');
        };

        if (canMorph() && target) {
            imgEl.style.viewTransitionName = VT_NAME;
            const t = document.startViewTransition(() => {
                imgEl.style.viewTransitionName = '';
                unmount();
                target.style.viewTransitionName = VT_NAME;
            });
            t.finished.finally(() => { target.style.viewTransitionName = ''; });
        } else {
            unmount();
        }
        // Return focus to the originating thumbnail.
        (target || lastTrigger)?.focus?.({ preventScroll: true });
    }

    // ---- Image state --------------------------------------------------------
    function applyImage() {
        const item = items[currentIndex];
        if (!item) return;
        imgEl.src = item.src;
        imgEl.alt = item.alt;
        // Captions are intentionally not displayed; alt is kept on the <img>
        // for accessibility and SEO only.
        captionEl.textContent = '';
        captionEl.style.display = 'none';
        counterEl.textContent = pad(currentIndex + 1) + ' / ' + pad(items.length);
        prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
        nextBtn.style.display = currentIndex < items.length - 1 ? 'flex' : 'none';
        preloadNeighbours();
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function preloadNeighbours() {
        [currentIndex + 1, currentIndex - 1].forEach((i) => {
            if (items[i]) { const im = new Image(); im.src = items[i].src; }
        });
    }

    function step(delta) {
        const next = currentIndex + delta;
        if (next < 0 || next > items.length - 1) return;
        currentIndex = next;
        setZoom(false);
        // Quick cross-fade between slides (separate from the open/close morph).
        imgEl.classList.add('is-swapping');
        const pre = new Image();
        pre.onload = () => {
            applyImage();
            requestAnimationFrame(() => imgEl.classList.remove('is-swapping'));
        };
        pre.src = items[next].src;
    }
    function showNext() { step(1); }
    function showPrev() { step(-1); }

    // ---- Click-to-zoom ------------------------------------------------------
    function toggleZoom(e) { setZoom(!zoomed, e); }
    function setZoom(on, e) {
        zoomed = on;
        imgEl.classList.toggle('is-zoomed', on);
        imgEl.style.cursor = on ? 'zoom-out' : 'zoom-in';
        if (on && e) panZoom(e); else imgEl.style.transformOrigin = 'center center';
    }
    function panZoom(e) {
        if (!zoomed) return;
        const r = imgEl.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        imgEl.style.transformOrigin = `${x}% ${y}%`;
    }

    // ---- Public API ---------------------------------------------------------
    window.initLightbox = initLightbox;
    window.openLightbox = (i) => open(i, items[i]?.el);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }

    // Re-initialise when galleries inject content dynamically.
    const observer = new MutationObserver((mutations) => {
        const added = mutations.some(m =>
            m.type === 'childList' && [...m.addedNodes].some(n =>
                n.nodeType === 1 && (
                    n.classList?.contains('gallery-item') ||
                    n.querySelector?.('.gallery-item') ||
                    n.querySelector?.('img')
                )
            )
        );
        if (added) setTimeout(initLightbox, 100);
    });
    document.querySelectorAll(
        '#photography-gallery, #design-gallery, #videoGrid, .gallery-grid, .installations-grid, #rhizomatic-home-gallery'
    ).forEach((c) => c && observer.observe(c, { childList: true, subtree: true }));

})();
