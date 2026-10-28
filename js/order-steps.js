(function () {
  'use strict';
  const form = document.getElementById('order-form');
  if (!form) return;
  const steps = Array.from(form.querySelectorAll('[data-order-step]'));
  const back = document.getElementById('previous-step');
  const next = document.getElementById('next-step');
  const submit = document.getElementById('submit-order');
  const progress = document.getElementById('step-status');
  const success = document.getElementById('order-success');
  let currentStep = 0;
  form.noValidate = true; 

  function showStep(index, moveFocus) {
    steps.forEach(function (step, stepIndex) { step.hidden = stepIndex !== index; });
    back.hidden = index === 0;
    next.hidden = index === steps.length - 1;
    submit.hidden = index !== steps.length - 1;
    progress.textContent = 'Step ' + (index + 1) + ' of ' + steps.length;
    if (moveFocus) steps[index].querySelector('input, select, textarea').focus();
  }

  function validateStep(index) {
    const fields = Array.from(steps[index].querySelectorAll('input, select, textarea'));
    for (const field of fields) {
      if (field.id === 'full-name') {
        field.setCustomValidity(field.value.trim().length >= 2 ? '' : 'Enter at least 2 characters.');
      }
      if (field.id === 'password') {
        field.setCustomValidity(field.value.length >= 12 ? '' : 'Use at least 12 characters.');
      }
      if (field.id === 'password-confirm') {
        field.setCustomValidity(field.value !== '' && field.value === form.querySelector('#password').value
          ? '' : 'Passwords must match.');
      }
      const valid = field.checkValidity();
      field.classList.toggle('is-invalid', !valid);
      if (!valid) {
        showStep(index, false);
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  function changeStep(direction, callback) {
    if (direction > 0 && !validateStep(currentStep)) return;
    currentStep = Math.max(0, Math.min(steps.length - 1, currentStep + direction));
    success.hidden = true;
    callback(currentStep, true);
  }
  next.addEventListener('click', function () { changeStep(1, showStep); });
  back.addEventListener('click', function () { changeStep(-1, showStep); });
  form.addEventListener('input', function (event) {
    event.target.setCustomValidity('');
    event.target.classList.remove('is-invalid');
    success.hidden = true;
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (currentStep < steps.length - 1) {
      changeStep(1, showStep);
      return;
    }
    for (let index = 0; index < steps.length; index += 1) {
      if (!validateStep(index)) {
        currentStep = index;
        return;
      }
    }
    success.textContent = 'Configuration completed. Demo only: no order has been sent.';
    success.hidden = false;
    success.focus();
  });

  document.getElementById('clear-order').addEventListener('click', function () { form.reset(); });
  form.addEventListener('reset', function (event) {
    event.preventDefault();
    form.querySelectorAll('input').forEach(function (input) {
      if (input.type === 'checkbox' || input.type === 'radio') input.checked = input.defaultChecked;
      else if (input.type === 'color') input.value = input.defaultValue;
      else input.value = '';
    });
    form.querySelectorAll('textarea').forEach(function (field) { field.value = ''; });
    form.querySelectorAll('select').forEach(function (select) {
      Array.from(select.options).forEach(function (option) { option.selected = option.defaultSelected; });
    });
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.setCustomValidity('');
      field.classList.remove('is-valid', 'is-invalid');
    });
    success.hidden = true;
    currentStep = 0;
    showStep(currentStep, true);
  });

  showStep(currentStep, false);
  function followBuildLink() {
    if (window.location.hash === '#build-type') {
      currentStep = 1;
      showStep(currentStep, true);
    }
  }
  followBuildLink();
  window.addEventListener('hashchange', followBuildLink);
})();