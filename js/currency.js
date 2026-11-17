(function () {
  'use strict';

  const API_URL = 'https://open.er-api.com/v6/latest/USD';
  const CURRENCY_KEY = 'asnkipc-currency';
  const grid = document.getElementById('product-grid');
  const select = document.getElementById('currency-select');
  const status = document.getElementById('currency-status');
  if (!grid || !select || !status) return;

  let rates = null;
  let updatedLabel = '';

  function readSaved() {
    try { return localStorage.getItem(CURRENCY_KEY); } catch (error) { return null; }
  }

  function saveCurrency(code) {
    try { localStorage.setItem(CURRENCY_KEY, code); } catch (error) { return; }
  }

  function formatPrice(usd, code) {
    const rate = code === 'USD' ? 1 : rates[code];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0
    }).format(usd * rate);
  }

  function renderPrices() {
    const code = select.value;
    grid.querySelectorAll('article.card[data-price]').forEach(function (card) {
      const label = card.querySelector('.tier-price');
      if (label) label.textContent = 'Starting at ' + formatPrice(Number(card.dataset.price), code);
    });
  }

  async function loadRates() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Unexpected API response');
    rates = data.rates;
    updatedLabel = new Date(data.time_last_update_utc).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  async function changeCurrency(code) {
    if (code === 'USD') {
      status.textContent = 'Showing prices in US dollars.';
      renderPrices();
      saveCurrency(code);
      return;
    }
    if (!rates) {
      select.disabled = true;
      status.textContent = 'Loading exchange rates...';
      try {
        await loadRates();
      } catch (error) {
        select.value = 'USD';
        select.disabled = false;
        status.textContent = 'Could not load exchange rates. Prices are shown in US dollars; please try again later.';
        renderPrices();
        return;
      }
      select.disabled = false;
    }
    if (!rates[code]) {
      select.value = 'USD';
      status.textContent = 'This currency is not available right now.';
      renderPrices();
      return;
    }
    renderPrices();
    saveCurrency(code);
    status.textContent = '1 USD = ' + rates[code].toLocaleString('en-US', { maximumFractionDigits: 2 }) +
      ' ' + code + ' (rates updated ' + updatedLabel + ').';
  }

  select.addEventListener('change', function () { changeCurrency(select.value); });
  document.addEventListener('productsloaded', renderPrices);

  const saved = readSaved();
  if (saved && Array.from(select.options).some(function (option) { return option.value === saved; })) {
    select.value = saved;
    if (saved !== 'USD') changeCurrency(saved);
  }
})();
