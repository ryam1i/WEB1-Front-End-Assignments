(function () {
  'use strict';

  var form = document.getElementById('order-form');
  var nameInput = document.getElementById('full-name');
  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');
  var confirmInput = document.getElementById('password-confirm');
  var successBox = document.getElementById('order-success');

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName() {
    var val = nameInput.value.trim();
    if (val.length < 2) {
      nameInput.classList.add('is-invalid');
      nameInput.classList.remove('is-valid');
      return false;
    }
    nameInput.classList.remove('is-invalid');
    nameInput.classList.add('is-valid');
    return true;
  }

  function validateEmail() {
    var val = emailInput.value.trim();
    if (!emailRegex.test(val)) {
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-valid');
      return false;
    }
    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');
    return true;
  }

  function validatePassword() {
    var val = passwordInput.value;
    if (val.length < 12) {
      passwordInput.classList.add('is-invalid');
      passwordInput.classList.remove('is-valid');
      return false;
    }
    passwordInput.classList.remove('is-invalid');
    passwordInput.classList.add('is-valid');
    return true;
  }

  function validateConfirm() {
    if (confirmInput.value !== passwordInput.value || confirmInput.value === '') {
      confirmInput.classList.add('is-invalid');
      confirmInput.classList.remove('is-valid');
      return false;
    }
    confirmInput.classList.remove('is-invalid');
    confirmInput.classList.add('is-valid');
    return true;
  }

  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', function () {
    validatePassword();
    if (confirmInput.value !== '') validateConfirm();
  });
  confirmInput.addEventListener('input', validateConfirm);

  form.addEventListener('reset', function () {
    var fields = [nameInput, emailInput, passwordInput, confirmInput];
    fields.forEach(function (el) {
      el.classList.remove('is-valid', 'is-invalid');
    });
    successBox.classList.add('d-none');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var ok = true;
    if (!validateName()) ok = false;
    if (!validateEmail()) ok = false;
    if (!validatePassword()) ok = false;
    if (!validateConfirm()) ok = false;

    if (!ok) return;

    successBox.classList.remove('d-none');
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    form.reset();
  });
})();
