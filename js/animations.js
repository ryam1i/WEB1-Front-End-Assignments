(function () {
  'use strict';

  function applyCardHoverEffects() {
    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
      if (card.dataset.hasAnim) return;
      card.dataset.hasAnim = 'true';

      card.style.transition = 'transform 0.25s ease, box-shadow 0.25s ease';

      card.addEventListener('mouseenter', function () {
        card.style.transform = 'translateY(-6px) scale(1.015)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  function createToastContainer() {
    var box = document.getElementById('toast-notification-box');
    if (box) return box;

    box = document.createElement('div');
    box.id = 'toast-notification-box';
    box.style.position = 'fixed';
    box.style.bottom = '24px';
    box.style.left = '50%';
    box.style.transform = 'translateX(-50%) translateY(100px)';
    box.style.opacity = '0';
    box.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
    box.style.zIndex = '9999';
    box.style.pointerEvents = 'none';
    box.style.background = '#0b7d36';
    box.style.color = '#ffffff';
    box.style.padding = '12px 24px';
    box.style.borderRadius = '30px';
    box.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
    box.style.fontWeight = '600';
    box.style.fontSize = '0.95rem';

    document.body.appendChild(box);
    return box;
  }

  var toastTimer = null;
  function showToast(text) {
    var box = createToastContainer();
    box.textContent = text;
    box.style.opacity = '1';
    box.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      box.style.opacity = '0';
      box.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2400);
  }

  function init() {
    applyCardHoverEffects();

    var observer = new MutationObserver(function () {
      applyCardHoverEffects();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('button, .btn');
      if (!btn) return;

      btn.style.transition = 'transform 0.12s ease';
      btn.style.transform = 'scale(0.95)';
      setTimeout(function () {
        btn.style.transform = 'scale(1)';
      }, 120);

      if (btn.classList.contains('star')) {
        showToast('Rating recorded! Thank you for your feedback.');
      } else if (btn.getAttribute('data-filter')) {
        showToast('Filter updated: ' + btn.textContent.trim());
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
