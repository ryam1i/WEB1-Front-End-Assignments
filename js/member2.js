$(document).ready(function () {
  'use strict';

  console.log("jQuery is ready! (Member 2)");

  initScrollProgressBar();
  initAnimatedCounters();
  initSubmitSpinner();

  function initScrollProgressBar() {
    var $progressBar = $('#scroll-progress-bar');
    var $progressContainer = $('#scroll-progress-container');

    if (!$progressBar.length) return;

    function updateProgress() {
      var scrollTop = $(window).scrollTop();
      var docHeight = $(document).height();
      var winHeight = $(window).height();
      var scrollable = docHeight - winHeight;

      var percent = 0;
      if (scrollable > 0) {
        percent = (scrollTop / scrollable) * 100;
      }

      percent = Math.min(100, Math.max(0, percent));

      $progressBar.css('width', percent + '%');
      $progressContainer.attr('aria-valuenow', Math.round(percent));
    }

    $(window).on('scroll resize', updateProgress);
    updateProgress();
  }

  function initAnimatedCounters() {
    var $statsSection = $('#stats-section');
    var $counters = $('.stat-number');

    if (!$statsSection.length || !$counters.length) return;

    var animated = false;

    function checkAndAnimate() {
      if (animated) return;

      var windowBottom = $(window).scrollTop() + $(window).height();
      var sectionTop = $statsSection.offset().top;

      if (windowBottom > sectionTop + 80) {
        animated = true;

        $counters.each(function () {
          var $counter = $(this);
          var target = parseInt($counter.attr('data-target'), 10) || 0;
          var prefix = $counter.attr('data-prefix') || '';
          var suffix = $counter.attr('data-suffix') || '';

          $({ countNum: 0 }).animate(
            { countNum: target },
            {
              duration: 2000,
              easing: 'swing',
              step: function () {
                $counter.text(prefix + Math.floor(this.countNum) + suffix);
              },
              complete: function () {
                $counter.text(prefix + target + suffix);
              }
            }
          );
        });
      }
    }

    $(window).on('scroll resize', checkAndAnimate);
    checkAndAnimate();
  }

  function initSubmitSpinner() {
    var $form = $('#order-form');
    var $submitBtn = $('#submit-order');
    var $successAlert = $('#order-success');

    if (!$form.length || !$submitBtn.length) return;

    $form.on('submit', function (e) {
      if ($submitBtn.prop('disabled')) {
        e.preventDefault();
        return;
      }

      if ($form.find('.is-invalid').length > 0) {
        return;
      }

      if ($submitBtn.is(':hidden')) {
        return;
      }

      var originalHtml = $submitBtn.html();
      var $navButtons = $('#previous-step, #clear-order');

      $successAlert.attr('hidden', true).hide();

      $submitBtn.prop('disabled', true);
      $navButtons.prop('disabled', true);

      $submitBtn.html(
        '<span class="m2-spinner" aria-hidden="true"></span> Please wait...'
      );

      setTimeout(function () {
        $submitBtn.prop('disabled', false);
        $submitBtn.html(originalHtml);
        $navButtons.prop('disabled', false);

        $successAlert
          .removeAttr('hidden')
          .hide()
          .html(
            '<strong>Order Submitted Successfully!</strong> Thank you for your custom PC request. ' +
            'Our system engineer will review your specs and contact you within 15 minutes.'
          )
          .fadeIn(400);

        if ($successAlert.length) {
          $('html, body').animate(
            { scrollTop: $successAlert.offset().top - 80 },
            300
          );
        }
      }, 2000);
    });
  }
});
