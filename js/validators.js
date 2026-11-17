(function () {
  'use strict';

  const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  const PHONE_PATTERN = /^\+?[0-9][0-9\s\-()]{8,17}$/;
  const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s'.-]*$/;

  function isEmpty(value) {
    return String(value).trim() === '';
  }

  function checkRequired(value, label) {
    return isEmpty(value) ? label + ' is required.' : '';
  }

  function checkName(value) {
    const text = String(value).trim();
    if (!text) return 'Full name is required.';
    if (text.length < 2) return 'Name must contain at least 2 characters.';
    if (!NAME_PATTERN.test(text)) return 'Name may contain only letters, spaces, dots, hyphens and apostrophes.';
    return '';
  }

  function checkEmail(value) {
    const text = String(value).trim();
    if (!text) return 'Email is required.';
    if (!EMAIL_PATTERN.test(text)) return 'Enter a valid email, for example name@example.com.';
    return '';
  }

  function checkPhone(value, optional) {
    const text = String(value).trim();
    if (!text) return optional ? '' : 'Phone number is required.';
    const digits = text.replace(/\D/g, '');
    if (!PHONE_PATTERN.test(text) || digits.length < 10 || digits.length > 15) {
      return 'Enter a phone number with 10 to 15 digits, for example +7 700 123 4567.';
    }
    return '';
  }

  function checkPassword(value) {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter.';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter.';
    if (!/[0-9]/.test(value)) return 'Password must contain a digit.';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain a special character.';
    return '';
  }

  function checkConfirm(value, original) {
    if (!value) return 'Please repeat your password.';
    if (value !== original) return 'Passwords do not match.';
    return '';
  }

  function checkBudget(value, minimum) {
    const text = String(value).trim();
    if (!text) return '';
    if (!/^\d+(\.\d{1,2})?$/.test(text)) return 'Budget must be a positive number.';
    if (Number(text) < minimum) return 'Budget must be at least $' + minimum + '.';
    return '';
  }

  function checkPattern(value, pattern, emptyMessage, invalidMessage) {
    const text = String(value).trim();
    if (!text) return emptyMessage;
    return pattern.test(text) ? '' : invalidMessage;
  }

  function feedbackFor(field) {
    const anchor = field.closest('.input-group') || field;
    const candidates = [field.nextElementSibling, anchor.nextElementSibling];
    let box = candidates.find(function (item) {
      return item && item.classList.contains('invalid-feedback');
    });
    if (!box) {
      box = document.createElement('div');
      box.className = 'invalid-feedback';
      anchor.insertAdjacentElement('afterend', box);
    }
    box.id = field.id + '-error';
    box.setAttribute('role', 'alert');
    return box;
  }

  function showError(field, message) {
    const box = feedbackFor(field);
    box.textContent = message;
    box.classList.add('d-block');
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', box.id);
  }

  function clearError(field, markValid) {
    const box = feedbackFor(field);
    box.textContent = '';
    box.classList.remove('d-block');
    field.classList.remove('is-invalid');
    field.classList.toggle('is-valid', Boolean(markValid) && !isEmpty(field.value));
    field.removeAttribute('aria-invalid');
  }

  function applyResult(field, message) {
    if (message) {
      showError(field, message);
      return false;
    }
    clearError(field, true);
    return true;
  }

  function resetForm(form) {
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      if (field.id) clearError(field, false);
      field.classList.remove('is-valid');
    });
  }

  function bindLiveValidation(field, check) {
    field.addEventListener('input', function () {
      applyResult(field, check());
    });
    field.addEventListener('blur', function () {
      if (!isEmpty(field.value)) applyResult(field, check());
    });
  }

  window.AsnkiValidate = {
    required: checkRequired,
    name: checkName,
    email: checkEmail,
    phone: checkPhone,
    password: checkPassword,
    confirm: checkConfirm,
    budget: checkBudget,
    pattern: checkPattern,
    show: showError,
    clear: clearError,
    apply: applyResult,
    reset: resetForm,
    bind: bindLiveValidation
  };
})();
