
(function () {
  'use strict';

  const STORAGE_KEY = 'asnkipc-bg';
  const THEME_KEY = 'asnkipc-bg-theme';   

  const PALETTES = {
    dark: [
      { name: 'Default',       value: '' },
      { name: 'Midnight Blue', value: '#0b1d3a' },
      { name: 'Deep Purple',   value: '#24123f' },
      { name: 'Forest',        value: '#0f2a20' },
      { name: 'Crimson',       value: '#3a0f1a' },
      { name: 'Slate',         value: '#1f2a37' },
      { name: 'Teal',          value: '#0c2f33' },
      { name: 'Graphite',      value: '#1c1c1e' }
    ],
    light: [
      { name: 'Default',  value: '' },
      { name: 'Mint',     value: '#dff3e6' },
      { name: 'Sky',      value: '#dbeafe' },
      { name: 'Lavender', value: '#e9e1fb' },
      { name: 'Peach',    value: '#fde6d8' },
      { name: 'Lemon',    value: '#fbf3c9' },
      { name: 'Rose',     value: '#fbe1e8' },
      { name: 'Cloud',    value: '#e8edf2' }
    ]
  };

  let index = 0;
  let button, randomButton, label;

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function palette() {
    return PALETTES[currentTheme()];
  }

  function readSaved(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      localStorage.setItem(THEME_KEY, currentTheme());
    } catch (e) { /* storage blocked */ }
  }

  function applyColor(value, name) {
    [document.documentElement, document.body].forEach(function (el) {
      if (value) {

        el.style.setProperty('background', value, 'important');
      } else {
        el.style.removeProperty('background');
      }
    });
    if (label) label.textContent = name + (value ? ' (' + value + ')' : '');
    save(value);
  }

  function randomThemeColor() {
    const hue = Math.floor(Math.random() * 360);
    if (currentTheme() === 'light') {
      const s = 55 + Math.floor(Math.random() * 25);   
      const l = 88 + Math.floor(Math.random() * 7);    
      return 'hsl(' + hue + ', ' + s + '%, ' + l + '%)';
    }
    const s = 35 + Math.floor(Math.random() * 30);     
    const l = 12 + Math.floor(Math.random() * 12);     
    return 'hsl(' + hue + ', ' + s + '%, ' + l + '%)';
  }

  function nextColor() {
    const colors = palette();
    index = (index + 1) % colors.length;
    applyColor(colors[index].value, colors[index].name);
  }
  function randomColor() {
    applyColor(randomThemeColor(), 'Random');
  }
  function resetColor() {
    index = 0;
    applyColor('', 'Default');
  }

  function buildUI() {
    button = document.getElementById('bg-color-btn');
    randomButton = document.getElementById('bg-random-btn');
    label = document.getElementById('bg-color-label');
    if (button) return;                    

    const box = document.createElement('div');
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
    document.addEventListener('themechange', resetColor);

    document.documentElement.classList.add('js-bg-transition');
    document.body.classList.add('js-bg-transition');

    const saved = readSaved(STORAGE_KEY);
    if (saved && readSaved(THEME_KEY) === currentTheme()) {
      const found = palette().findIndex(function (c) { return c.value === saved; });
      if (found !== -1) index = found;
      applyColor(saved, found !== -1 ? palette()[found].name : 'Random');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();