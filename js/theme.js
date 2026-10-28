
(function () {
  'use strict';

  const STORAGE_KEY = 'asnkipc-theme';
  const root = document.documentElement;       // the <html> element
  let button = null;

  function readTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage blocked */ }
  }


  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateNavbar(theme) {

    const navbar = document.querySelector('#main-header .navbar');
    if (navbar) navbar.setAttribute('data-bs-theme', theme);
  }

  function updateButton(theme) {
    if (!button) return;
    const isDark = theme === 'dark';

    button.textContent = isDark ? '☀️ Day mode' : '🌙 Night mode';
    button.setAttribute('aria-label', isDark ? 'Switch to day mode' : 'Switch to night mode');
    button.setAttribute('aria-pressed', String(!isDark));
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    updateNavbar(theme);
    updateButton(theme);
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';

    root.classList.add('theme-transition');
    window.setTimeout(function () { root.classList.remove('theme-transition'); }, 450);

    applyTheme(next);
    saveTheme(next);

    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }

  function createButton() {
    button = document.createElement('button');
    button.type = 'button';
    button.id = 'theme-toggle';
    button.className = 'theme-toggle';
    button.addEventListener('click', toggleTheme);

    const host = document.querySelector('#main-header .container') ||
                 document.querySelector('header') || document.body;
    host.appendChild(button);
  }

  root.setAttribute('data-theme', readTheme() === 'light' ? 'light' : 'dark');

  function init() {
    createButton();
    applyTheme(currentTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
