(function () {
  'use strict';

  const USERS_KEY = 'asnkipc-users';
  const SESSION_KEY = 'asnkipc-session';
  const ORDERS_KEY = 'asnkipc-orders';
  const SEARCH_KEY = 'asnkipc-catalog-search';

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function getUsers() {
    const users = readJson(USERS_KEY, []);
    return Array.isArray(users) ? users : [];
  }

  function normalizeEmail(email) {
    return String(email).trim().toLowerCase();
  }

  function findUser(email) {
    const wanted = normalizeEmail(email);
    return getUsers().find(function (user) { return user.email === wanted; }) || null;
  }

  function currentUser() {
    try {
      const email = localStorage.getItem(SESSION_KEY);
      return email ? findUser(email) : null;
    } catch (error) {
      return null;
    }
  }

  function signUp(details) {
    if (findUser(details.email)) return { ok: false, error: 'An account with this email already exists.' };
    const users = getUsers();
    users.push({
      name: details.name.trim(),
      email: normalizeEmail(details.email),
      phone: details.phone.trim(),
      password: details.password,
      createdAt: new Date().toISOString()
    });
    if (!writeJson(USERS_KEY, users)) return { ok: false, error: 'Your browser blocked local storage, so the account could not be saved.' };
    return { ok: true };
  }

  function logIn(email, password) {
    const user = findUser(email);
    if (!user) return { ok: false, field: 'email', error: 'No account found with this email. Sign up first.' };
    if (user.password !== password) return { ok: false, field: 'password', error: 'Incorrect password. Please try again.' };
    try {
      localStorage.setItem(SESSION_KEY, user.email);
    } catch (error) {
      return { ok: false, error: 'Your browser blocked local storage, so you could not be logged in.' };
    }
    return { ok: true };
  }

  function logOut() {
    try { localStorage.removeItem(SESSION_KEY); } catch (error) { return; }
  }

  function saveOrder(order) {
    const orders = readJson(ORDERS_KEY, []);
    const list = Array.isArray(orders) ? orders : [];
    const user = currentUser();
    list.push(Object.assign({ owner: user ? user.email : null, createdAt: new Date().toISOString() }, order));
    writeJson(ORDERS_KEY, list);
  }

  function ordersFor(email) {
    const orders = readJson(ORDERS_KEY, []);
    return (Array.isArray(orders) ? orders : []).filter(function (order) { return order.owner === email; });
  }

  function updateNavigation() {
    const user = currentUser();
    document.querySelectorAll('[data-auth="guest"]').forEach(function (item) { item.hidden = Boolean(user); });
    document.querySelectorAll('[data-auth="user"]').forEach(function (item) { item.hidden = !user; });
    document.querySelectorAll('[data-auth-name]').forEach(function (item) {
      item.textContent = user ? user.name.split(' ')[0] : '';
    });
  }

  function bindLogout() {
    document.querySelectorAll('[data-auth-logout]').forEach(function (button) {
      button.addEventListener('click', function () {
        logOut();
        window.location.href = 'index.html';
      });
    });
  }

  function formatDate(iso) {
    const date = new Date(iso);
    return isNaN(date) ? '' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function initSignUp() {
    const form = document.getElementById('signup-form');
    if (!form) return;
    const V = window.AsnkiValidate;
    const fields = {
      name: document.getElementById('signup-name'),
      email: document.getElementById('signup-email'),
      phone: document.getElementById('signup-phone'),
      password: document.getElementById('signup-password'),
      confirm: document.getElementById('signup-confirm')
    };
    const checks = {
      name: function () { return V.name(fields.name.value); },
      email: function () { return V.email(fields.email.value); },
      phone: function () { return V.phone(fields.phone.value, false); },
      password: function () { return V.password(fields.password.value); },
      confirm: function () { return V.confirm(fields.confirm.value, fields.password.value); }
    };
    Object.keys(fields).forEach(function (key) { V.bind(fields[key], checks[key]); });
    fields.password.addEventListener('input', function () {
      if (fields.confirm.value) V.apply(fields.confirm, checks.confirm());
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let firstInvalid = null;
      Object.keys(fields).forEach(function (key) {
        if (!V.apply(fields[key], checks[key]()) && !firstInvalid) firstInvalid = fields[key];
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      const result = signUp({
        name: fields.name.value,
        email: fields.email.value,
        phone: fields.phone.value,
        password: fields.password.value
      });
      if (!result.ok) {
        V.show(fields.email, result.error);
        fields.email.focus();
        return;
      }
      window.location.href = 'login.html?registered=1';
    });
  }

  function initLogIn() {
    const form = document.getElementById('login-form');
    if (!form) return;
    const V = window.AsnkiValidate;
    const emailField = document.getElementById('login-email');
    const passwordField = document.getElementById('login-password');
    const notice = document.getElementById('login-notice');

    if (new URLSearchParams(window.location.search).get('registered') === '1') {
      notice.hidden = false;
    }

    V.bind(emailField, function () { return V.email(emailField.value); });
    V.bind(passwordField, function () { return passwordField.value ? '' : 'Password is required.'; });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const emailOk = V.apply(emailField, V.email(emailField.value));
      const passwordOk = V.apply(passwordField, passwordField.value ? '' : 'Password is required.');
      if (!emailOk) { emailField.focus(); return; }
      if (!passwordOk) { passwordField.focus(); return; }
      const result = logIn(emailField.value, passwordField.value);
      if (!result.ok) {
        const target = result.field === 'password' ? passwordField : emailField;
        V.show(target, result.error);
        target.focus();
        return;
      }
      window.location.href = 'profile.html';
    });
  }

  function textItem(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function initProfile() {
    const card = document.getElementById('profile-card');
    if (!card) return;
    const user = currentUser();
    if (!user) {
      window.location.replace('login.html');
      return;
    }
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-phone').textContent = user.phone;
    document.getElementById('profile-since').textContent = formatDate(user.createdAt);
    document.getElementById('profile-avatar').textContent = user.name.trim().charAt(0).toUpperCase();
    document.title = user.name + ' — Profile | AsnkiPC';

    const search = readJson(SEARCH_KEY, null);
    const searchBox = document.getElementById('profile-search');
    if (search && (search.query || (search.price && search.price !== 'all'))) {
      searchBox.textContent = (search.query ? 'Query "' + search.query + '"' : 'No text query') +
        ' · price filter: ' + (search.price || 'all');
    } else {
      searchBox.textContent = 'No saved catalog search yet.';
    }

    const list = document.getElementById('profile-orders');
    const orders = ordersFor(user.email);
    list.textContent = '';
    if (!orders.length) {
      list.appendChild(textItem('li', 'You have not sent any build requests yet.', 'list-group-item'));
    } else {
      orders.slice().reverse().forEach(function (order) {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.appendChild(textItem('strong', order.buildType + ' build'));
        item.appendChild(document.createTextNode(
          (order.budget ? ' · budget $' + order.budget : '') +
          ' · ' + order.delivery + ' · ' + formatDate(order.createdAt)
        ));
        list.appendChild(item);
      });
    }

    document.getElementById('clear-saved-data').addEventListener('click', function () {
      try { localStorage.removeItem(SEARCH_KEY); } catch (error) { return; }
      searchBox.textContent = 'No saved catalog search yet.';
    });
  }

  function init() {
    updateNavigation();
    bindLogout();
    initSignUp();
    initLogIn();
    initProfile();
  }

  window.AsnkiAuth = {
    currentUser: currentUser,
    saveOrder: saveOrder
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
