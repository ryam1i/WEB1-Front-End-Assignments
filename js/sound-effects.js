(function () {
  'use strict';

  var audioCtx = null;
  var isSoundEnabled = true;

  function getAudioContext() {
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

  function setupSoundButton() {
    var nav = document.querySelector('#mainNavbar .navbar-nav');
    if (!nav) return;

    var li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = '<button type="button" id="sound-toggle-btn" class="nav-link btn btn-link py-1 px-2" style="font-size:1.1rem; text-decoration:none;" title="Toggle Sound Effects">🔊</button>';
    nav.appendChild(li);

    var btn = li.querySelector('#sound-toggle-btn');
    btn.addEventListener('click', function () {
      isSoundEnabled = !isSoundEnabled;
      btn.textContent = isSoundEnabled ? '🔊' : '🔇';
      if (isSoundEnabled) playClick();
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
