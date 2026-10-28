(function () {
  'use strict';

  const menu = document.querySelector('#mainNavbar .navbar-nav');
  if (menu) {
    menu.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const links = Array.from(menu.querySelectorAll('a.nav-link'));
      const current = links.indexOf(document.activeElement);
      if (current === -1) return;
      let next = current;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown': next = (current + 1) % links.length; break;
        case 'ArrowLeft':
        case 'ArrowUp': next = (current - 1 + links.length) % links.length; break;
        case 'Home': next = 0; break;
        case 'End': next = links.length - 1; break;
        default: return;
      }
      event.preventDefault();
      links[next].focus();
    });
  }

  const timeButton = document.getElementById('show-time');
  if (timeButton) {
    timeButton.addEventListener('click', function () {
      document.getElementById('current-time').textContent = new Date().toLocaleTimeString();
    });
  }

  const grid = document.getElementById('product-grid');
  if (!grid) return; // На остальных страницах работает только меню.
  const filter = document.getElementById('price-filter');
  const count = document.getElementById('product-count');
  const loadButton = document.getElementById('load-products');
  const loadStatus = document.getElementById('load-status');

  function matchesPrice(price, category) {
    switch (category) {
      case 'budget': return price < 1000;
      case 'mid': return price >= 1000 && price < 2000;
      case 'premium': return price >= 2000;
      default: return true;
    }
  }

  function filterProducts() {
    let visible = 0;
    grid.querySelectorAll('[data-price]').forEach(function (card) {
      card.hidden = !matchesPrice(Number(card.dataset.price), filter.value);
      if (!card.hidden) visible += 1;
    });
    count.textContent = visible ? 'Builds shown: ' + visible : 'No builds in this price range.';
  }
  filter.addEventListener('change', filterProducts);
  filterProducts();

  function createProduct(product) {
    const card = document.createElement('article');
    card.className = 'card p-3 p-lg-4';
    card.dataset.price = product.price;
    const title = document.createElement('h3');
    title.className = 'tier-title mb-1';
    title.textContent = product.name;
    const price = document.createElement('p');
    price.className = 'tier-price mb-3';
    price.textContent = 'Starting at $' + product.price.toLocaleString('en-US');
    const imageWrap = document.createElement('div');
    imageWrap.className = 'card-img-wrap p-2 mx-auto mb-3';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name + ' custom PC';
    imageWrap.appendChild(image);
    const description = document.createElement('p');
    description.textContent = product.description;
    const orderLink = document.createElement('a');
    orderLink.className = 'btn btn-primary mt-auto';
    orderLink.href = 'order.html#build-type';
    orderLink.textContent = 'Configure & Order';
    card.append(title, price, imageWrap, description, orderLink);
    return card;
  }

  loadButton.addEventListener('click', async function () {
    loadButton.disabled = true;
    loadStatus.textContent = 'Loading more builds...';
    try {
      const response = await fetch('data/products.json');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const products = await response.json();
      if (!Array.isArray(products) || !products.every(function (product) {
        return typeof product.name === 'string' && Number.isFinite(product.price) &&
          product.price >= 0 && typeof product.image === 'string' &&
          typeof product.description === 'string';
      })) throw new Error('Invalid product data');
      const fragment = document.createDocumentFragment();
      products.forEach(function (product) { fragment.appendChild(createProduct(product)); });
      grid.appendChild(fragment);
      filterProducts(); // Текущий фильтр применяется и к новым карточкам.
      loadStatus.textContent = 'All extra builds loaded. The selected price filter still applies.';
      loadButton.textContent = 'All builds loaded';
    } catch (error) {
      loadStatus.textContent = 'Could not load builds. Open the site with Live Server and try again.';
      loadButton.disabled = false;
    }
  });
})();