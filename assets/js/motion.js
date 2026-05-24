/**
 * motion.js — site-wide motion (Phase 2: "Expressive").
 *
 *   1. Reveal        — [data-reveal] elements animate in on scroll.
 *   2. Headlines     — eligible plain-text headings reveal word-by-word
 *                      behind a clip mask.
 *   3. Lenis         — smooth-scroll inertia (loaded from CDN before this
 *                      file; exposed as window.lenis). Native scroll if absent.
 *   4. Scroll FX     — gentle hero parallax + top progress bar.
 *   5. Cursor        — a lagging accent ring with a "View" label on art tiles
 *                      (desktop / fine-pointer only; native cursor kept).
 *   6. Count-ups     — .stat-number values count up when scrolled into view.
 *
 * Everything is disabled or made instant under prefers-reduced-motion, and
 * degrades gracefully if Lenis / IntersectionObserver are unavailable.
 */
(function () {
    'use strict';

    var reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function $all(sel, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    }

    /* ---- 2. Headline word reveal (run before reveal observer) ------------- */
    var HEAD_SEL = '.hero-content h1, .hero-content h2, .hero-title, .section-title, .home-head h2';
    function splitHeadlines() {
        if (reduce) return;
        $all(HEAD_SEL).forEach(function (el) {
            if (el.dataset.split || el.children.length) return; // plain text only
            var text = el.textContent.replace(/\s+/g, ' ').trim();
            if (!text) return;
            el.dataset.split = '1';
            el.setAttribute('aria-label', text);
            el.classList.add('split-head');
            el.classList.remove('rise');          // word reveal replaces the simple rise
            el.textContent = '';
            text.split(' ').forEach(function (word, idx) {
                var mask = document.createElement('span');
                mask.className = 'split-mask';
                mask.setAttribute('aria-hidden', 'true');
                var inner = document.createElement('span');
                inner.className = 'split-word';
                inner.style.setProperty('--i', idx);
                inner.textContent = word;
                mask.appendChild(inner);
                el.appendChild(mask);
                el.appendChild(document.createTextNode(' '));
            });
            el.setAttribute('data-reveal', '');
        });
    }

    /* ---- 1. Reveal -------------------------------------------------------- */
    function initReveal() {
        if (reduce || !('IntersectionObserver' in window)) {
            $all('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        $all('[data-reveal]').forEach(function (el) { io.observe(el); });
    }

    /* ---- 3. Lenis smooth scroll ------------------------------------------ */
    function initLenis() {
        if (reduce || typeof Lenis === 'undefined') return null;
        try {
            var lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
            window.lenis = lenis;
            function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
            return lenis;
        } catch (err) { return null; }
    }

    /* ---- 4. Scroll effects: parallax + progress bar ---------------------- */
    function initScrollFx(lenis) {
        var heroes = $all('section.hero').filter(function (h) {
            return /background-image/.test(h.getAttribute('style') || '');
        });
        var smallScreen = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
        var doParallax = !reduce && !smallScreen && heroes.length > 0;

        var progress = null;
        if (!reduce) {
            progress = document.createElement('div');
            progress.id = 'ec-progress';
            progress.setAttribute('aria-hidden', 'true');
            document.body.appendChild(progress);
        }
        if (!doParallax && !progress) return;

        var ticking = false;
        function update() {
            ticking = false;
            var y = window.pageYOffset || 0;
            if (progress) {
                var docH = document.documentElement.scrollHeight - window.innerHeight;
                progress.style.transform = 'scaleX(' + (docH > 0 ? Math.min(y / docH, 1) : 0).toFixed(4) + ')';
            }
            if (doParallax) {
                heroes.forEach(function (h) {
                    if (h.getBoundingClientRect().bottom < -100) return;
                    var offset = Math.min(y * 0.15, 120);
                    h.style.backgroundPosition = 'center calc(50% + ' + offset.toFixed(1) + 'px)';
                });
            }
        }
        function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

        if (lenis && lenis.on) lenis.on('scroll', schedule);
        else window.addEventListener('scroll', schedule, { passive: true });
        update();
    }

    /* ---- 6. Stat count-ups ----------------------------------------------- */
    function initCounters() {
        var els = $all('.stat-number');
        if (!els.length || reduce || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                io.unobserve(e.target);
                countUp(e.target);
            });
        }, { threshold: 0.6 });
        els.forEach(function (el) { io.observe(el); });
    }
    function countUp(el) {
        var m = el.textContent.trim().match(/^(\d[\d,]*)(.*)$/);
        if (!m) return;
        var target = parseInt(m[1].replace(/,/g, ''), 10);
        var suffix = m[2] || '', dur = 1200, start = null;
        (function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
        })(performance.now ? performance.now() : Date.now());
    }

    /* ---- init ------------------------------------------------------------- */
    function init() {
        splitHeadlines();
        initReveal();
        var lenis = initLenis();
        initScrollFx(lenis);
        initCounters();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();
