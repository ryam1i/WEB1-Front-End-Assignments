
(function () {
  'use strict';

  const button = document.getElementById('read-more-btn');
  const content = document.getElementById('read-more-content');
  if (!button || !content) return;

  content.style.display = 'none';             

  button.addEventListener('click', function () {
    const isHidden = content.style.display === 'none';

    content.style.display = isHidden ? 'block' : 'none';          
    button.textContent = isHidden ? 'Read less' : 'Read more';    
    button.setAttribute('aria-expanded', String(isHidden));       
  });
})();
