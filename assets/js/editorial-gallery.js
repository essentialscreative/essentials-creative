/**
 * Editorial gallery renderer — shared across all gallery pages.
 *
 * renderEditorial(containerId, items)
 *   items: [{ src, alt }]  (same shape the legacy grids used)
 *
 * Lays images out in a repeating rhythm — full-width single, then two
 * two-up pairs — at natural aspect ratio, builds <picture>+webp like the
 * legacy renderers, tags each figure so the global lightbox
 * (unified-gallery-lightbox.js) picks it up, and reveals blocks on scroll.
 */
(function () {
    'use strict';

    function buildFigure(item, delayMs) {
        const fig = document.createElement('figure');
        fig.className = 'ed-figure lightbox-trigger reveal';
        if (delayMs) fig.style.setProperty('--reveal-delay', delayMs + 'ms');

        const frame = document.createElement('div');
        frame.className = 'ed-frame';

        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.srcset = item.src.replace(/\.(jpe?g|png)$/i, '.webp');
        source.type = 'image/webp';

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || '';
        img.loading = 'lazy';
        img.decoding = 'async';

        picture.append(source, img);
        frame.append(picture);
        fig.append(frame);
        return fig;
    }

    function renderEditorial(containerId, items) {
        const root = document.getElementById(containerId);
        if (!root || !Array.isArray(items)) return;

        root.classList.add('editorial');
        root.replaceChildren();

        const valid = items.filter((it) => it && it.src);
        let i = 0;

        const addFull = () => {
            const s = document.createElement('div');
            s.className = 'ed-block ed-full';
            s.appendChild(buildFigure(valid[i++]));
            root.appendChild(s);
        };
        const addPair = () => {
            const s = document.createElement('div');
            s.className = 'ed-block ed-pair';
            s.appendChild(buildFigure(valid[i++]));
            // Second image in a pair trails the first for a choreographed reveal
            if (i < valid.length) s.appendChild(buildFigure(valid[i++], 90));
            root.appendChild(s);
        };

        while (i < valid.length) {
            addFull();
            if (i < valid.length) addPair();
            if (i < valid.length) addPair();
        }

        // Scroll reveal
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
            root.querySelectorAll('.reveal').forEach((el) => io.observe(el));
        } else {
            root.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
        }

        // Hook the global lightbox to the freshly rendered figures
        if (window.initLightbox) window.initLightbox();
    }

    window.renderEditorial = renderEditorial;
})();
