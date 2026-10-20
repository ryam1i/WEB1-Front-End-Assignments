/* Task 4 — Change background colour with JavaScript
   Author: <your name> — replace with the team member who owns this task
   - "Next colour" cycles through a predefined palette (+ the original look)
   - "Random" picks a random dark colour (low lightness keeps text readable)
   - The choice is remembered between pages via localStorage                 */
(function () {
  'use strict';

  var STORAGE_KEY = 'asnkipc-bg';

  // Predefined palette. The first item resets to the site's original background.
  var PALETTE = [
    { name: 'Default',      value: '' },
    { name: 'Midnight Blue', value: '#0b1d3a' },
    { name: 'Deep Purple',   value: '#24123f' },
    { name: 'Forest',        value: '#0f2a20' },
    { name: 'Crimson',       value: '#3a0f1a' },
    { name: 'Slate',         value: '#1f2a37' },
    { name: 'Teal',          value: '#0c2f33' },
    { name: 'Graphite',      value: '#1c1c1e' }
  ];

  var index = 0;
  var button, randomButton, label;

  /* ---------- helpers ---------- */
  function readSaved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage blocked */ }
  }

  function applyColor(value, name) {
    var targets = [document.documentElement, document.body];
    targets.forEach(function (el) {
      if (value) {
        // "background" shorthand also clears any gradient/image set in the CSS
        el.style.setProperty('background', value, 'important');
      } else {
        el.style.removeProperty('background');
      }
    });
    if (label) label.textContent = name + (value ? ' (' + value + ')' : '');
    save(value);
  }

  function randomDarkColor() {
    var h = Math.floor(Math.random() * 360);
    var s = 35 + Math.floor(Math.random() * 30);   // 35–65 %
    var l = 12 + Math.floor(Math.random() * 12);   // 12–24 % (dark => readable text)
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  /* ---------- handlers ---------- */
  function nextColor() {
    index = (index + 1) % PALETTE.length;
    applyColor(PALETTE[index].value, PALETTE[index].name);
  }
  function randomColor() {
    applyColor(randomDarkColor(), 'Random');
  }

  /* ---------- UI (uses existing elements if the page already has them) ---------- */
  function buildUI() {
    button = document.getElementById('bg-color-btn');
    randomButton = document.getElementById('bg-random-btn');
    label = document.getElementById('bg-color-label');
    if (button) return;                      // markup provided in HTML

    var box = document.createElement('div');
    box.className = 'js-bg-widget';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Background colour');
    box.innerHTML =
      '<button type="button" id="bg-color-btn" class="js-btn">🎨 Change background</button>' +
      '<button type="button" id="bg-random-btn" class="js-btn js-btn-secondary">🎲 Random</button>' +
      '<span id="bg-color-label" class="js-bg-label" aria-live="polite">Default</span>';
    document.body.appendChild(box);

    button = box.querySelector('#bg-color-btn');
    randomButton = box.querySelector('#bg-random-btn');
    label = box.querySelector('#bg-color-label');
  }

  function init() {
    buildUI();
    button.addEventListener('click', nextColor);
    if (randomButton) randomButton.addEventListener('click', randomColor);

    // smooth fade between colours
    document.documentElement.classList.add('js-bg-transition');
    document.body.classList.add('js-bg-transition');

    // restore previous choice
    var saved = readSaved();
    if (saved) {
      var found = PALETTE.findIndex(function (c) { return c.value === saved; });
      if (found !== -1) index = found;
      applyColor(saved, found !== -1 ? PALETTE[found].name : 'Random');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
