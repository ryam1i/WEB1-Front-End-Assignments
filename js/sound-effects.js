(function () {
  'use strict';

  var STORAGE_KEY = 'asnkipc-sound';
  var audioCtx = null;
  var isSoundEnabled = readSoundSetting();

  function readSoundSetting() {
    try { return localStorage.getItem(STORAGE_KEY) !== 'off'; } catch (e) { return true; }
  }

  function saveSoundSetting(value) {
    try { localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off'); } catch (e) { /* storage blocked */ }
  }

  function getAudioContext() {
    if (!isSoundEnabled) return null;
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, gainValue) {
    if (!isSoundEnabled) return;
    var ctx = getAudioContext();
    if (!ctx) return;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainValue || 0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function playClick() {
    playTone(700, 'triangle', 0.04, 0.08);
  }

  function playSuccess() {
    playTone(523.25, 'sine', 0.12, 0.08);
    setTimeout(function () {
      playTone(659.25, 'sine', 0.18, 0.08);
    }, 90);
  }

  var ICON_ON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor"/><path d="m16 9 6 6"/><path d="m22 9-6 6"/></svg>';

  function renderSoundButton(btn) {
    btn.innerHTML = isSoundEnabled ? ICON_ON : ICON_OFF;
    btn.setAttribute('aria-pressed', String(!isSoundEnabled));
    var label = isSoundEnabled ? 'Mute sound effects' : 'Unmute sound effects';
    btn.setAttribute('aria-label', label);
    btn.title = label;
    btn.classList.toggle('is-muted', !isSoundEnabled);
  }

  function setSoundEnabled(value, btn) {
    isSoundEnabled = value;
    saveSoundSetting(value);
    if (!value && audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
    renderSoundButton(btn);
  }

  function setupSoundButton() {
    var nav = document.querySelector('#mainNavbar .navbar-nav');
    if (!nav || document.getElementById('sound-toggle-btn')) return;

    var li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = '<button type="button" id="sound-toggle-btn" class="nav-link sound-toggle"></button>';
    nav.appendChild(li);

    var btn = li.querySelector('#sound-toggle-btn');
    renderSoundButton(btn);

    btn.addEventListener('click', function () {
      setSoundEnabled(!isSoundEnabled, btn);
      if (isSoundEnabled) playClick();
    });

    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) {
        isSoundEnabled = readSoundSetting();
        renderSoundButton(btn);
      }
    });
  }

  function init() {
    setupSoundButton();

    document.addEventListener('click', function (e) {
      var target = e.target.closest('button, .btn, .nav-link, .star, .card');
      if (!target) return;

      if (target.id === 'sound-toggle-btn') return;

      if (target.classList.contains('star') || target.type === 'submit' || target.getAttribute('data-filter')) {
        playSuccess();
      } else {
        playClick();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
