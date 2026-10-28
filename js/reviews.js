(function () {
  'use strict';

  var reviewsData = [
    {
      author: 'Daniyar K.',
      build: 'pro',
      buildName: 'Pro Build ($1,599)',
      rating: 5,
      date: '2026-10-15',
      comment: 'Runs Cyberpunk 2077 on ultra with DLSS at steady 120 FPS. Cable management is spotless.',
      getStars: function () {
        return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
      }
    },
    {
      author: 'Madina S.',
      build: 'starter',
      buildName: 'Starter Build ($899)',
      rating: 5,
      date: '2026-10-18',
      comment: 'Perfect for CS2 and Valorant. Boot time is under 8 seconds. Very quiet fans even under load.',
      getStars: function () {
        return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
      }
    },
    {
      author: 'Arman T.',
      build: 'ultra',
      buildName: 'Ultra Build ($3,499)',
      rating: 5,
      date: '2026-10-21',
      comment: 'Absolute beast for 4K video rendering in Premiere and gaming in 144Hz. Worth every single dollar.',
      getStars: function () {
        return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
      }
    },
    {
      author: 'Alikhan B.',
      build: 'starter',
      buildName: 'Starter Build ($899)',
      rating: 4,
      date: '2026-10-24',
      comment: 'Great value for money. Delivery was fast, packed very securely in double foam.',
      getStars: function () {
        return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
      }
    },
    {
      author: 'Sofiya M.',
      build: 'pro',
      buildName: 'Pro Build ($1,599)',
      rating: 5,
      date: '2026-10-26',
      comment: 'Super clean assembly and excellent temperatures. The RGB sync looks awesome in dark room.',
      getStars: function () {
        return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
      }
    },
    {
      author: 'Yerassyl N.',
      build: 'ultra',
      buildName: 'Ultra Build ($3,499)',
      rating: 5,
      date: '2026-10-27',
      comment: 'Liquid cooling keeps the CPU under 65C during heavy blender loads. Top-notch craftsmanship.',
      getStars: function () {
        return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
      }
    }
  ];

  var container = document.getElementById('reviews-container');
  var filterGroup = document.getElementById('reviews-filter');
  if (!container || !filterGroup) return;

  function renderReviews(filter) {
    container.innerHTML = '';

    var filtered = reviewsData.filter(function (item) {
      if (filter === 'all') return true;
      if (filter === '5') return item.rating === 5;
      return item.build === filter;
    });

    var cardsHtml = filtered.map(function (item) {
      return (
        '<article class="card review-card p-3 p-lg-4">' +
          '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<strong class="fs-5 review-author">' + item.author + '</strong>' +
            '<span class="badge bg-success">' + item.buildName + '</span>' +
          '</div>' +
          '<div class="text-warning fs-5 mb-2">' + item.getStars() + '</div>' +
          '<p class="mb-3 review-comment">' + item.comment + '</p>' +
          '<small class="review-date mt-auto">' + item.date + '</small>' +
        '</article>'
      );
    });

    var wrapper = document.createElement('div');
    cardsHtml.forEach(function (cardString) {
      wrapper.innerHTML = cardString;
      container.appendChild(wrapper.firstElementChild);
    });
  }

  var buttons = filterGroup.querySelectorAll('button');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filterValue = btn.getAttribute('data-filter');
      renderReviews(filterValue);
    });
  });

  renderReviews('all');
})();
