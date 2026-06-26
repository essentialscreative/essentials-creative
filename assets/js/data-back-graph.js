/**
 * data-back-graph.js — renders window.DATA_BACK as a living rhizome: a centerless,
 * force-directed SVG node-graph that grows as the visitor scrolls the spine.
 *
 * Design commitments (see data-back-data.js header):
 *   - SVG, not canvas (free vector export, native a11y, crisp text).
 *   - Vanilla force-directed layout; no libraries. Settles, then freezes.
 *   - Uniform node sizes — size encodes NOTHING quantitative, so a ghosted
 *     projection can never read as a "big fact".
 *   - status drives treatment: verified = solid; projection/range/advocacy/
 *     contested = ghosted + dashed; contested also shows "PRELIMINARY".
 *   - Every node carries its source + caveat; hover/focus fills an aria-live panel.
 *   - prefers-reduced-motion → full static graph, all nodes shown, zero animation.
 *   - This piece visualizes extraction data only; it authors no cultural content.
 */
(function () {
  'use strict';

  var DATA = window.DATA_BACK;
  if (!DATA) { return; }

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smallScreen = window.matchMedia &&
    window.matchMedia('(max-width: 768px)').matches;
  var hasIO = 'IntersectionObserver' in window;

  var SVGNS = 'http://www.w3.org/2000/svg';
  var W = 1200, H = 800;                 // viewBox units
  var R = 30;                            // uniform node radius
  var GROUP_ORDER = ['intro', 'growth', 'power', 'water', 'transparency', 'returns'];

  /* ---- validate data (dev-time honesty guard) --------------------------- */
  DATA.nodes.forEach(function (n) {
    if (!n.attribution) {
      console.warn('[data-back] node "' + n.id + '" is missing an attribution — refusing to show a figure without its source.');
    }
  });

  /* ---- build node/edge runtime model ------------------------------------ */
  var nodeById = {};
  var nodes = DATA.nodes.map(function (n, i) {
    var angle = (i / DATA.nodes.length) * Math.PI * 2;
    // deterministic seed ring (reproducible layout; no Math.random)
    var jitter = ((i * 53) % 11 - 5) * 4;
    var m = {
      data: n,
      x: W / 2 + Math.cos(angle) * (260 + jitter),
      y: H / 2 + Math.sin(angle) * (220 + jitter),
      vx: 0, vy: 0,
      active: false,
      el: null, circle: null
    };
    nodeById[n.id] = m;
    return m;
  });
  var edges = DATA.edges.map(function (e) {
    return { data: e, source: nodeById[e.source], target: nodeById[e.target], el: null, len: 0 };
  }).filter(function (e) { return e.source && e.target; });

  /* ---- DOM scaffolding -------------------------------------------------- */
  var svg = document.getElementById('db-graph');
  if (!svg) { return; }
  var gEdges = svg.querySelector('.db-edges');
  var gNodes = svg.querySelector('.db-nodes');
  var panel = document.getElementById('db-attrib');

  function el(tag, attrs) {
    var node = document.createElementNS(SVGNS, tag);
    for (var k in attrs) { node.setAttribute(k, attrs[k]); }
    return node;
  }

  function showAttrib(n) {
    if (!panel) { return; }
    var d = n.data;
    var caveat = d.caveat ? '<p class="db-attrib__caveat">' + escapeHtml(d.caveat) + '</p>' : '';
    panel.innerHTML =
      '<p class="db-attrib__label">' + escapeHtml(d.label) + '</p>' +
      '<p class="db-attrib__source"><span class="db-attrib__tag db-type-' + d.type + ' db-status-' + d.status + '">' +
        escapeHtml(d.status) + ' · ' + escapeHtml(d.type) + '</span></p>' +
      '<p class="db-attrib__attr">' + escapeHtml(d.attribution) + '</p>' + caveat;
    panel.hidden = false;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---- render edges ----------------------------------------------------- */
  edges.forEach(function (e) {
    var line = el('line', { class: 'db-edge db-rel-' + e.data.rel });
    gEdges.appendChild(line);
    e.el = line;
  });

  /* ---- render nodes ----------------------------------------------------- */
  nodes.forEach(function (n) {
    var d = n.data;
    var g = el('g', {
      class: 'db-node db-type-' + d.type + ' db-status-' + d.status,
      tabindex: '0',
      role: 'button',
      'aria-label': d.label + ' — ' + d.source
    });
    var circle = el('circle', { r: R, cx: 0, cy: 0, class: 'db-node__dot' });
    var labelText = smallScreen && d.shortLabel ? d.shortLabel : (d.shortLabel || d.label);
    // label background (legibility) + label
    var label = el('text', { class: 'db-node__label', x: 0, y: R + 16, 'text-anchor': 'middle' });
    label.textContent = labelText;
    g.appendChild(circle);
    g.appendChild(label);
    // contested figures carry a baked-in PRELIMINARY tag
    if (d.status === 'contested') {
      var tag = el('text', { class: 'db-node__flag', x: 0, y: 4, 'text-anchor': 'middle' });
      tag.textContent = 'PRELIMINARY';
      g.appendChild(tag);
    }
    gNodes.appendChild(g);
    n.el = g; n.circle = circle;

    function reveal() { showAttrib(n); }
    g.addEventListener('mouseenter', reveal);
    g.addEventListener('focus', reveal);
    g.addEventListener('click', reveal);
    g.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); reveal(); }
    });
  });

  /* ---- force simulation ------------------------------------------------- */
  var K_REP = 90000;     // repulsion constant
  var K_SPRING = 0.02;   // spring stiffness
  var REST = 200;        // edge rest length
  var K_CENTER = 0.0016; // weak, UNIFORM pull (no node privileged → centerless)
  var DAMP = 0.9;
  var MIN_D = R * 2.4;
  var rafId = null;

  function step() {
    var active = nodes.filter(function (n) { return n.active; });
    // repulsion (active pairs only)
    for (var i = 0; i < active.length; i++) {
      for (var j = i + 1; j < active.length; j++) {
        var a = active[i], b = active[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d2 = dx * dx + dy * dy || 0.01;
        var d = Math.sqrt(d2);
        if (d < MIN_D) { d2 = MIN_D * MIN_D; }
        var f = K_REP / d2;
        var fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
      }
    }
    // springs (edges with both ends active)
    edges.forEach(function (e) {
      if (!e.source.active || !e.target.active) { return; }
      var dx = e.target.x - e.source.x, dy = e.target.y - e.source.y;
      var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      var f = K_SPRING * (d - REST);
      var fx = (dx / d) * f, fy = (dy / d) * f;
      e.source.vx += fx; e.source.vy += fy;
      e.target.vx -= fx; e.target.vy -= fy;
    });
    // weak uniform centering + integrate
    var energy = 0;
    active.forEach(function (n) {
      n.vx += (W / 2 - n.x) * K_CENTER;
      n.vy += (H / 2 - n.y) * K_CENTER;
      n.vx *= DAMP; n.vy *= DAMP;
      n.x += n.vx; n.y += n.vy;
      // keep on stage
      n.x = Math.max(R + 8, Math.min(W - R - 8, n.x));
      n.y = Math.max(R + 8, Math.min(H - R - 30, n.y));
      energy += n.vx * n.vx + n.vy * n.vy;
    });
    draw();
    if (energy > 0.4) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
      svg.dispatchEvent(new CustomEvent('db:settled'));
    }
  }

  function draw() {
    nodes.forEach(function (n) {
      if (n.el) { n.el.setAttribute('transform', 'translate(' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ')'); }
    });
    edges.forEach(function (e) {
      if (!e.el) { return; }
      e.el.setAttribute('x1', e.source.x.toFixed(1));
      e.el.setAttribute('y1', e.source.y.toFixed(1));
      e.el.setAttribute('x2', e.target.x.toFixed(1));
      e.el.setAttribute('y2', e.target.y.toFixed(1));
    });
  }

  function simulate() {
    if (reduce || smallScreen) { draw(); return; }   // static positions only
    if (rafId) { cancelAnimationFrame(rafId); }
    rafId = requestAnimationFrame(step);
  }

  /* ---- activation ------------------------------------------------------- */
  function activateGroup(group) {
    var changed = false;
    nodes.forEach(function (n) {
      if (n.active) { return; }
      if (n.data.group === group) { n.active = true; changed = true; markActive(n); }
    });
    // reveal edges whose endpoints are now both active
    edges.forEach(function (e) {
      if (e.source.active && e.target.active && e.el && !e.el.classList.contains('is-on')) {
        e.el.classList.add('is-on');
      }
    });
    if (changed) { simulate(); }
  }

  function markActive(n) { if (n.el) { n.el.classList.add('is-on'); } }

  // cumulative activation up to and including a section
  function activateUpTo(group) {
    var idx = GROUP_ORDER.indexOf(group);
    if (idx < 0) { idx = GROUP_ORDER.length - 1; }
    for (var i = 0; i <= idx; i++) { activateGroup(GROUP_ORDER[i]); }
  }

  function activateAll() {
    nodes.forEach(function (n) { n.active = true; markActive(n); });
    edges.forEach(function (e) { if (e.el) { e.el.classList.add('is-on'); } });
    simulate();
  }

  /* ---- scroll wiring ---------------------------------------------------- */
  function initScroll() {
    if (reduce || !hasIO) { activateAll(); return; }
    var steps = Array.prototype.slice.call(document.querySelectorAll('.db-step[data-db-section]'));
    if (!steps.length) { activateAll(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { activateUpTo(e.target.getAttribute('data-db-section')); }
      });
    }, { rootMargin: '0px 0px -45% 0px', threshold: 0.15 });
    steps.forEach(function (s) { io.observe(s); });
    // ensure intro group is on immediately
    activateUpTo('intro');
  }

  /* ---- export (reuses studio.html serialize→Blob→download pattern) ------ */
  function inlineStyles(clone, live) {
    // copy the computed presentation onto the clone so it travels standalone
    var liveEls = live.querySelectorAll('*');
    var cloneEls = clone.querySelectorAll('*');
    for (var i = 0; i < liveEls.length; i++) {
      var cs = getComputedStyle(liveEls[i]);
      var props = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-dasharray',
        'opacity', 'font-family', 'font-size', 'font-weight', 'letter-spacing', 'text-anchor'];
      var decl = '';
      props.forEach(function (p) {
        var v = cs.getPropertyValue(p);
        if (v) { decl += p + ':' + v + ';'; }
      });
      cloneEls[i].setAttribute('style', decl);
      cloneEls[i].removeAttribute('class');
    }
  }

  function buildStandaloneSVG() {
    var clone = svg.cloneNode(true);
    // drop nodes/edges that never activated so the still matches what's on screen
    inlineStyles(clone, svg);
    clone.setAttribute('xmlns', SVGNS);
    clone.setAttribute('width', W);
    clone.setAttribute('height', H + 60);
    clone.setAttribute('viewBox', '0 0 ' + W + ' ' + (H + 60));
    var bg = document.createElementNS(SVGNS, 'rect');
    bg.setAttribute('x', 0); bg.setAttribute('y', 0);
    bg.setAttribute('width', W); bg.setAttribute('height', H + 60);
    bg.setAttribute('fill', '#ffffff');
    clone.insertBefore(bg, clone.firstChild);
    var colo = document.createElementNS(SVGNS, 'text');
    colo.setAttribute('x', W / 2); colo.setAttribute('y', H + 38);
    colo.setAttribute('text-anchor', 'middle');
    colo.setAttribute('style', "font-family:'Apercu',sans-serif;font-size:18px;fill:#666;");
    colo.textContent = DATA.meta.title + ' — Essentials Creative — every figure cited; see source list';
    clone.appendChild(colo);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(clone);
  }

  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function stamp() {
    // no Date.now in deterministic contexts is fine here (browser runtime)
    try { return new Date().toISOString().slice(0, 10); } catch (e) { return 'still'; }
  }

  function exportSVG() {
    var svgStr = buildStandaloneSVG();
    download(new Blob([svgStr], { type: 'image/svg+xml' }), 'ec-data-back-rhizome-' + stamp() + '.svg');
  }

  function exportPNG() {
    var svgStr = buildStandaloneSVG();
    var scale = 2;
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = W * scale; canvas.height = (H + 60) * scale;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(function (blob) {
        if (blob) { download(blob, 'ec-data-back-rhizome-' + stamp() + '.png'); }
      }, 'image/png');
    };
    img.onerror = function () { console.warn('[data-back] PNG export failed to rasterize the SVG.'); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  }

  function initExport() {
    var btnSvg = document.getElementById('db-export-svg');
    var btnPng = document.getElementById('db-export-png');
    if (btnSvg) { btnSvg.addEventListener('click', exportSVG); }
    if (btnPng) {
      btnPng.addEventListener('click', function () {
        // gate PNG on the font being ready so labels rasterize in Apercu
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(exportPNG);
        } else { exportPNG(); }
      });
    }
  }

  /* ---- init ------------------------------------------------------------- */
  function init() {
    draw();           // place at seed ring first
    initScroll();
    initExport();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
