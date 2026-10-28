
(function () {
  'use strict';

  function format(d) {
    var date = d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    var time = d.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', second: '2-digit'
    });
    return date + ', ' + time;
  }

  function init() {
    var out = document.getElementById('datetime');

    if (!out) {
  
      var wrap = document.createElement('div');
      wrap.className = 'js-datetime';
      wrap.innerHTML = '<span class="js-datetime-label">Current date &amp; time:</span> ' +
                       '<time id="datetime"></time>';
      var host = document.querySelector('#site-footer .footer-inner') ||
                 document.querySelector('footer') || document.body;
      host.appendChild(wrap);
      out = wrap.querySelector('#datetime');
    }

    function tick() {
      var now = new Date();
      out.textContent = format(now);
      out.setAttribute('datetime', now.toISOString());
    }

    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
