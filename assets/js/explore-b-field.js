/* explore-b-field.js — generative neon "living systems" for the three-returns
   exploration (Direction B). Vanilla canvas, no libraries. One particle field
   that changes behavior per section: a mycelial rhizome that becomes soil
   (accreting), water (flowing + clearing), and data (gathering, some erased). */
(function () {
  'use strict';
  var canvas = document.getElementById('field');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W, H, DPR;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  var N = 170;
  var P = [];
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function seed() {
    P = [];
    for (var i = 0; i < N; i++) {
      P.push({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-0.3, 0.3), vy: rnd(-0.3, 0.3),
               r: rnd(1.4, 3.2), life: 1, gone: false });
    }
  }

  // accent per mode (neon)
  var MODES = {
    rhizome: { c: [30, 91, 255],  link: true,  bg: 0.10 },   // blue
    land:    { c: [255, 106, 0],  link: false, bg: 0.06 },   // orange
    water:   { c: [0, 229, 255],  link: false, bg: 0.05 },   // cyan
    data:    { c: [255, 61, 154], link: true,  bg: 0.05 },   // pink
    exit:    { c: [255, 212, 0],  link: true,  bg: 0.08 }     // yellow
  };
  var mode = 'rhizome';
  var col = MODES.rhizome.c.slice();

  function lerp(a, b, t) { return a + (b - a) * t; }

  function stepParticle(p) {
    if (mode === 'rhizome') {
      p.vx += rnd(-0.05, 0.05); p.vy += rnd(-0.05, 0.05);
      p.vx += (W / 2 - p.x) * 0.00012; p.vy += (H / 2 - p.y) * 0.00012;
    } else if (mode === 'land') {
      p.vy += 0.05;                                   // gravity → accretes at the floor
      if (p.y > H - 6) { p.y = H - rnd(2, 8); p.vy *= -0.18; p.vx *= 0.7; }
    } else if (mode === 'water') {
      p.vx += 0.04 + Math.sin((p.y + performance.now() * 0.02) * 0.03) * 0.05; // flow + waves
      if (p.x > W + 10) { p.x = -10; }                // recirculate (the loop)
      p.life = Math.min(1, p.life + 0.004);           // comes back clearer
    } else if (mode === 'data') {
      var cx = W / 2, cy = H * 0.5;
      p.vx += (cx - p.x) * 0.0009; p.vy += (cy - p.y) * 0.0009; // gather into a field
      if (!p.gone && Math.random() < 0.0016) { p.gone = true; } // some are erased
      if (p.gone) { p.life -= 0.04; if (p.life <= 0) { p.x = rnd(0, W); p.y = rnd(0, H); p.life = 1; p.gone = false; } }
    } else if (mode === 'exit') {
      p.vy -= 0.03; p.vx += rnd(-0.04, 0.04);         // rise + disperse
      if (p.y < -10) { p.y = H + 10; }
    }
    p.vx *= 0.96; p.vy *= 0.96;
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
    if (p.y < -20 && mode !== 'exit') p.y = H + 20; if (p.y > H + 40 && mode !== 'land') p.y = -20;
  }

  function frame() {
    var m = MODES[mode] || MODES.rhizome;
    for (var k = 0; k < 3; k++) col[k] = lerp(col[k], m.c[k], 0.04);
    var cr = Math.round(col[0]), cg = Math.round(col[1]), cb = Math.round(col[2]);

    // fade-trail background (dark) — different persistence per mode
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(11,11,15,' + m.bg + ')';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter';        // additive neon glow

    // links (mycelial network) for rhizome/data/exit modes
    if (m.link) {
      ctx.lineWidth = 1;
      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < i + 9 && j < N; j++) {
          var a = P[i], b = P[j];
          var dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 13000) {
            var al = (1 - d / 13000) * 0.5 * Math.min(a.life, b.life);
            ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + al.toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
    }
    // particles
    for (var n = 0; n < N; n++) {
      var p = P[n];
      stepParticle(p);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (0.7 * p.life).toFixed(3) + ')';
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  var raf = null;
  function setMode(m) { if (MODES[m]) mode = m; }
  window.__setFieldMode = setMode;

  function init() {
    resize(); seed();
    window.addEventListener('resize', function () { resize(); seed(); });
    // section → mode
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) setMode(e.target.getAttribute('data-mode')); });
      }, { threshold: 0.5 });
      document.querySelectorAll('[data-mode]').forEach(function (s) { io.observe(s); });
    }
    if (reduce) {
      // settle a calm rhizome into a single static frame, no animation loop
      for (var i = 0; i < 120; i++) frame();   // frame() won't reschedule under reduce
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
