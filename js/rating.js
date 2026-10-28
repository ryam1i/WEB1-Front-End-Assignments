
(function () {
  'use strict';

  const STORAGE_KEY = 'asnkipc-ratings';

  // object: rating value -> message shown to the user
  const MESSAGES = {
    1: 'Not for me',
    2: 'Could be better',
    3: 'Good',
    4: 'Great choice!',
    5: 'Perfect — thank you!'
  };

  const groups = document.querySelectorAll('.rating');   
  if (groups.length === 0) return;                       

  let saved = loadRatings();                           

  function loadRatings() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return data && typeof data === 'object' ? data : {};
    } catch (e) {
      return {};
    }
  }
  function saveRatings() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (e) {}
  }

  
  function paintStars(stars, value) {
    stars.forEach(function (star) {
      star.classList.toggle('is-active', Number(star.dataset.value) <= value);
    });
  }

  function renderRating(group, value) {
    const stars = group.querySelectorAll('.star');
    const message = group.querySelector('.rating-message');

    group.dataset.rating = value;
    paintStars(stars, value);

    stars.forEach(function (star) {
      star.setAttribute('aria-pressed', String(Number(star.dataset.value) === value));
    });

    message.textContent = `You rated ${group.dataset.build}: ${value}/5 — ${MESSAGES[value]}`;
    message.classList.add('is-rated');
  }

  function updateSummary() {
    const summary = document.getElementById('rating-summary');
    if (!summary) return;

    const values = Object.values(saved);
    if (values.length === 0) {
      summary.textContent = 'You have not rated any builds yet.';
      return;
    }
    const total = values.reduce(function (sum, v) { return sum + v; }, 0);
    const average = (total / values.length).toFixed(1);

    summary.innerHTML =
      `You rated <strong>${values.length} of ${groups.length}</strong> builds. ` +
      `Your average score: <strong>${average} ★</strong>`;
  }

  function setRating(group, value) {
    renderRating(group, value);
    saved[group.dataset.build] = value;
    saveRatings();
    updateSummary();
  }

  function setupGroup(group) {
    const stars = group.querySelectorAll('.star');
    const starBox = group.querySelector('.rating-stars');

    stars.forEach(function (star) {
      const value = Number(star.dataset.value);

      star.addEventListener('click', function () {
        setRating(group, value);

        star.classList.add('is-popped');
        star.addEventListener('animationend', function () {
          star.classList.remove('is-popped');
        }, { once: true });
      });

      star.addEventListener('mouseenter', function () { paintStars(stars, value); });
    });

    starBox.addEventListener('mouseleave', function () {
      paintStars(stars, Number(group.dataset.rating) || 0);
    });

    const old = Number(saved[group.dataset.build]);
    if (old >= 1 && old <= 5) renderRating(group, old);
  }

  groups.forEach(setupGroup);
  updateSummary();
})();
