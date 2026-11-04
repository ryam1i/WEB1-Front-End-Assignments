
(function ($) {
  'use strict';

  var MAX_TOASTS = 4;
  var ICONS = { success: '\u2713', error: '\u2715', info: 'i', warning: '!' };
  var $box = null;

  function getBox() {
    if (!$box || !$box.length || !$.contains(document.body, $box[0])) {
      $box = $('<div id="m3-toast-box" aria-live="polite"></div>').appendTo('body');
    }
    return $box;
  }

  function remove() {
    $(this).remove();
  }

  function runLifecycle($toast, duration) {
    $toast
      .stop(true)
      .fadeIn(300)
      .delay(duration)
      .fadeOut(500, remove);
  }

  function show(message, options) {
    var opts = $.extend({ type: 'success', duration: 3000 }, options);
    var $container = getBox();

    var $existing = $container.children('.m3-toast');
    if ($existing.length >= MAX_TOASTS) {
      $existing.first().stop(true).remove();
    }

    var $toast = $('<div class="m3-toast" role="status"></div>')
      .addClass('m3-toast--' + opts.type)
      .append($('<span class="m3-toast__icon" aria-hidden="true"></span>').text(ICONS[opts.type] || ICONS.info))
      .append($('<span class="m3-toast__text"></span>').text(message))
      .append($('<button type="button" class="m3-toast__close" aria-label="Close notification">&times;</button>'))
      .hide()
      .appendTo($container);

    $toast.on('mouseenter', function () {
      $toast.stop(true).css('opacity', 1).show();
    });
    $toast.on('mouseleave', function () {
      $toast.stop(true).delay(1200).fadeOut(500, remove);
    });

    $toast.find('.m3-toast__close').on('click', function () {
      $toast.stop(true).fadeOut(200, remove);
    });

    runLifecycle($toast, opts.duration);
    return $toast;
  }

  window.AsnkiToast = { show: show };
  $.toast = show;
})(jQuery);


(function ($) {
  'use strict';

  
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var $ta = $('<textarea readonly aria-hidden="true"></textarea>')
        .val(text)
        .css({ position: 'fixed', top: 0, left: 0, opacity: 0 })
        .appendTo('body');
      $ta[0].select();
      $ta[0].setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      $ta.remove();
      if (ok) { resolve(); } else { reject(new Error('Copy command failed')); }
    });
  }

  function showCopied($btn, label) {
    var $tip = $btn.find('.m3-tooltip');
    $btn.addClass('is-copied');
    $tip.stop(true, true).fadeIn(150).delay(1600).fadeOut(200, function () {
      $btn.removeClass('is-copied');
    });
    $.toast(label + ' copied to clipboard', { type: 'success', duration: 2200 });
  }

  $(document).on('click', '.m3-copy-btn', function () {
    var $btn = $(this);
    var $snippet = $btn.closest('.m3-snippet');
    var text = $snippet.find('.m3-snippet__text').text().trim();
    var label = $snippet.find('.m3-snippet__label').text().trim() || 'Text';

    copyText(text).then(
      function () { showCopied($btn, label); },
      function () { $.toast('Could not copy automatically. Select the text and press Ctrl+C.', { type: 'error', duration: 4000 }); }
    );
  });

  $(document).on('copy', function () {
    var selection = window.getSelection();
    if (!selection || !selection.toString() || !selection.anchorNode) return;
    var $snippet = $(selection.anchorNode).closest('.m3-snippet');
    if ($snippet.length) {
      var label = $snippet.find('.m3-snippet__label').text().trim() || 'Text';
      $.toast(label + ' copied to clipboard', { type: 'success', duration: 2200 });
    }
  });
})(jQuery);


(function ($) {
  'use strict';

  var THRESHOLD = 150;   
  var THROTTLE_MS = 100;
  var $pending = $();
  var total = 0;
  var loaded = 0;
  var timer = null;

  function updateCounter() {
    $('#m3-lazy-count').text('Loaded ' + loaded + ' of ' + total + ' images');
  }

  function isNearViewport($img) {
    if (!$img.is(':visible')) return false;
    var viewportBottom = $(window).scrollTop() + $(window).height();
    return $img.offset().top < viewportBottom + THRESHOLD;
  }

  function loadImage($img) {
    $img
      .one('load', function () {
        loaded++;
        $img.closest('.m3-lazy-frame').addClass('is-loaded');
        $img.fadeTo(500, 1);
        updateCounter();
      })
      .one('error', function () {
        $img.closest('.m3-lazy-frame').addClass('is-error');
      })
      .attr('src', $img.attr('data-src'))   
      .removeAttr('data-src');
  }

  function check() {
    $pending.each(function () {
      var $img = $(this);
      if (isNearViewport($img)) {
        loadImage($img);
        $pending = $pending.not($img);
      }
    });
    if (!$pending.length) {
      $(window).off('.m3lazy');   
    }
  }

  function onScroll() {
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      check();
    }, THROTTLE_MS);
  }

  $(function () {
    $pending = $('img.m3-lazy[data-src]');
    total = $pending.length;
    if (!total) return;
    $pending.css('opacity', 0);
    updateCounter();
    $(window).on('scroll.m3lazy resize.m3lazy', onScroll);
    check();   
  });
})(jQuery);


$(document).ready(function () {
  'use strict';

  console.log('jQuery is ready!');

  function updateExtrasSummary() {
    var $added = $('.m3-add-extra.is-added');
    var total = 0;
    $added.each(function () { total += Number($(this).data('price')) || 0; });
    $('#m3-extras-count').text($added.length);
    $('#m3-extras-total').text('$' + total);
  }

  $('.m3-add-extra').on('click', function () {
    var $btn = $(this);
    var name = $btn.data('name');
    var added = $btn.toggleClass('is-added').hasClass('is-added');

    $btn.text(added ? 'Added \u2713' : 'Add to order').attr('aria-pressed', String(added));
    updateExtrasSummary();

    if (added) {
      $.toast(name + ' added to your order', { type: 'success' });
    } else {
      $.toast(name + ' removed from your order', { type: 'info' });
    }
  });

  $('#m3-track-form').on('submit', function (e) {
    e.preventDefault();
    var value = String($('#m3-track-input').val()).trim().toUpperCase();

    if (!value) {
      $.toast('Please enter your order number.', { type: 'warning' });
    } else if (!/^ASN-\d{6}$/.test(value)) {
      $.toast('Invalid format. Example: ASN-123456', { type: 'error', duration: 4000 });
    } else {
      $.toast('Request accepted! Order ' + value + ' is being prepared for courier pickup.', { type: 'success', duration: 4000 });
      this.reset();
    }
  });

  $('#m3-say-hello').on('click', function () {
    $.toast('Thanks for stopping by! We will get back to you soon.', { type: 'info' });
  });
});
