/* explore-d-ritual.js — Direction D. The visitor ARC made interactive:
   give (soil/water/word) → Land → Water → Data (Take/Hear/Gift/Erase, real) →
   receive. A small state machine; no libraries. Prototype. */
(function () {
  'use strict';
  var state = { word: '', soil: false, water: false, presses: 0, clarity: 0, choice: null };

  var steps = ['threshold', 'land', 'water', 'data', 'exit'];
  var i = 0;
  function $(id) { return document.getElementById(id); }
  function show(id) {
    steps.forEach(function (s) { var el = $('step-' + s); if (el) el.hidden = (s !== id); });
    var bar = $('progress'); if (bar) bar.style.setProperty('--p', (steps.indexOf(id) / (steps.length - 1)));
    var dots = document.querySelectorAll('.pg-dot');
    dots.forEach(function (d, n) { d.classList.toggle('on', n <= steps.indexOf(id)); });
    window.scrollTo(0, 0);
  }
  function next() { i = Math.min(i + 1, steps.length - 1); show(steps[i]); }

  function toast(msg, color) {
    var t = $('toast'); if (!t) return;
    t.textContent = msg; t.style.color = color || '#fff';
    t.classList.add('show'); clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function init() {
    // ---- threshold: give three things ----
    var wordInput = $('give-word');
    function checkThreshold() {
      var ready = state.word.trim() && state.soil && state.water;
      $('to-land').disabled = !ready;
    }
    wordInput.addEventListener('input', function () { state.word = wordInput.value; checkThreshold(); });
    $('give-soil').addEventListener('click', function () {
      state.soil = true; this.classList.add('given'); this.textContent = '✓ soil in hand'; checkThreshold();
    });
    $('give-water').addEventListener('click', function () {
      state.water = true; this.classList.add('given'); this.textContent = '✓ water poured ready'; checkThreshold();
    });
    $('to-land').addEventListener('click', function () { toast('Token issued — anonymous, no name, no email.', '#FFD400'); next(); });

    // ---- land: press soil into the bed ----
    var bed = $('bed');
    bed.addEventListener('click', function (e) {
      var r = bed.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var dot = document.createElement('span');
      dot.className = 'soil-dot';
      dot.style.left = x + 'px'; dot.style.top = y + 'px';
      bed.appendChild(dot);
      state.presses++;
      $('press-count').textContent = state.presses;
      $('to-water').disabled = state.presses < 3;
    });
    $('to-water').addEventListener('click', next);

    // ---- water: pour → clears ----
    var pourBtn = $('pour'), bar = $('clarity-bar'), pct = $('clarity-pct');
    pourBtn.addEventListener('click', function () {
      pourBtn.disabled = true;
      var iv = setInterval(function () {
        state.clarity = Math.min(100, state.clarity + 4);
        bar.style.width = state.clarity + '%';
        pct.textContent = state.clarity + '%';
        if (state.clarity >= 100) {
          clearInterval(iv);
          $('water-note').textContent = 'Clearer than you poured it. Real ecology, not a video.';
          $('to-data').disabled = false;
        }
      }, 40);
    });
    $('to-data').addEventListener('click', next);

    // ---- data: the four choices, real ----
    $('data-word').textContent = '“' + (state.word.trim() || 'gift') + '”';
    function choose(kind) {
      state.choice = kind;
      var wordEl = $('data-word');
      if (kind === 'erase') {
        wordEl.classList.add('erased');
        $('data-status').textContent = 'Deleted on screen, in front of you. Nothing kept.';
        toast('Erased. Deletion is the norm here.', '#FF3D9A');
      } else if (kind === 'hear') {
        $('data-status').textContent = 'Read back into the room.';
        try {
          var u = new SpeechSynthesisUtterance(state.word.trim() || 'gift');
          window.speechSynthesis.speak(u);
        } catch (e) {}
        toast('Heard.', '#00E5FF');
      } else if (kind === 'take') {
        $('data-status').textContent = 'Printed — yours to carry out.';
        toast('Taken.', '#FF6A00');
      } else if (kind === 'gift') {
        $('data-status').textContent = 'Gifted to the collective archive — the only path to retention.';
        toast('Gifted. Retention is the exception you chose.', '#FFD400');
      }
      // reflect chosen state on exit summary
      $('exit-word').textContent = state.word.trim() ? '“' + state.word.trim() + '”' : 'a word';
      $('exit-choice').textContent = kind;
      $('to-exit').disabled = false;
    }
    document.querySelectorAll('[data-choice]').forEach(function (b) {
      b.addEventListener('click', function () { choose(b.getAttribute('data-choice')); });
    });
    $('to-exit').addEventListener('click', next);

    $('restart').addEventListener('click', function () {
      state = { word: '', soil: false, water: false, presses: 0, clarity: 0, choice: null };
      // reset UI
      wordInput.value = '';
      $('give-soil').className = ''; $('give-soil').textContent = 'take a handful of soil';
      $('give-water').className = ''; $('give-water').textContent = 'pour a cup of water';
      $('to-land').disabled = true;
      bed.querySelectorAll('.soil-dot').forEach(function (d) { d.remove(); });
      $('press-count').textContent = '0'; $('to-water').disabled = true;
      pourBtn.disabled = false; bar.style.width = '0%'; pct.textContent = '0%';
      $('water-note').textContent = ''; $('to-data').disabled = true;
      var w = $('data-word'); w.classList.remove('erased'); $('data-status').textContent = '';
      $('to-exit').disabled = true;
      i = 0; show('threshold');
    });

    show('threshold');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
