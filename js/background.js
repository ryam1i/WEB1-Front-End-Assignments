
(function () {
  'use strict';

  var STORAGE_KEY = 'asnkipc-bg';

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

  function readSaved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function applyColor(value, name) {
    var targets = [document.documentElement, document.body];
    targets.forEach(function (el) {
      if (value) {
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
    var s = 35 + Math.floor(Math.random() * 30);   
    var l = 12 + Math.floor(Math.random() * 12);   
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }


  function nextColor() {
    index = (index + 1) % PALETTE.length;
    applyColor(PALETTE[index].value, PALETTE[index].name);
  }
  function randomColor() {
    applyColor(randomDarkColor(), 'Random');
  }


  function buildUI() {
    button = document.getElementById('bg-color-btn');
    randomButton = document.getElementById('bg-random-btn');
    label = document.getElementById('bg-color-label');
    if (button) return;                 

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

    document.documentElement.classList.add('js-bg-transition');
    document.body.classList.add('js-bg-transition');

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
