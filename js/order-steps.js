(function () {
  'use strict';

  const form = document.getElementById('order-form');
  if (!form) return;

  const V = window.AsnkiValidate;
  const steps = Array.from(form.querySelectorAll('[data-order-step]'));
  const back = document.getElementById('previous-step');
  const next = document.getElementById('next-step');
  const submit = document.getElementById('submit-order');
  const progress = document.getElementById('step-status');
  const success = document.getElementById('order-success');
  const MIN_BUDGET = 899;
  let currentStep = 0;

  const rules = {
    'full-name': function (field) { return V.name(field.value); },
    'email': function (field) { return V.email(field.value); },
    'phone': function (field) { return V.phone(field.value, false); },
    'budget': function (field) { return V.budget(field.value, MIN_BUDGET); },
    'password': function (field) { return V.password(field.value); },
    'password-confirm': function (field) { return V.confirm(field.value, form.elements.password.value); }
  };

  function showStep(index, moveFocus) {
    steps.forEach(function (step, stepIndex) { step.hidden = stepIndex !== index; });
    back.hidden = index === 0;
    next.hidden = index === steps.length - 1;
    submit.hidden = index !== steps.length - 1;
    progress.textContent = 'Step ' + (index + 1) + ' of ' + steps.length;
    if (moveFocus) steps[index].querySelector('input, select, textarea').focus();
  }

  function validateStep(index) {
    let firstInvalid = null;
    steps[index].querySelectorAll('input, select, textarea').forEach(function (field) {
      const rule = rules[field.id];
      if (!rule) return;
      if (!V.apply(field, rule(field)) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function changeStep(direction) {
    if (direction > 0 && !validateStep(currentStep)) return;
    currentStep = Math.max(0, Math.min(steps.length - 1, currentStep + direction));
    success.hidden = true;
    showStep(currentStep, true);
  }

  Object.keys(rules).forEach(function (id) {
    const field = document.getElementById(id);
    if (!field) return;
    V.bind(field, function () { return rules[id](field); });
  });
  document.getElementById('password').addEventListener('input', function () {
    const confirm = document.getElementById('password-confirm');
    if (confirm.value) V.apply(confirm, rules['password-confirm'](confirm));
  });

  next.addEventListener('click', function () { changeStep(1); });
  back.addEventListener('click', function () { changeStep(-1); });
  form.addEventListener('input', function () { success.hidden = true; });

  function collectOrder() {
    const buildSelect = form.elements['build-type'];
    const delivery = form.querySelector('input[name="delivery"]:checked');
    return {
      buildType: buildSelect.options[buildSelect.selectedIndex].text.split(' (')[0],
      budget: form.elements.budget.value.trim(),
      delivery: delivery ? delivery.nextElementSibling.textContent.trim() : ''
    };
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (currentStep < steps.length - 1) {
      changeStep(1);
      return;
    }
    for (let index = 0; index < steps.length; index += 1) {
      if (!validateStep(index)) {
        currentStep = index;
        showStep(currentStep, false);
        validateStep(index);
        return;
      }
    }
    if (window.AsnkiAuth) window.AsnkiAuth.saveOrder(collectOrder());
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
    V.reset(form);
    success.hidden = true;
    currentStep = 0;
    showStep(currentStep, true);
  });

  function prefillFromAccount() {
    const user = window.AsnkiAuth && window.AsnkiAuth.currentUser();
    if (!user) return;
    form.elements['full-name'].value = user.name;
    form.elements.email.value = user.email;
    form.elements.phone.value = user.phone;
  }

  function followBuildLink() {
    if (window.location.hash === '#build-type') {
      currentStep = 1;
      showStep(currentStep, true);
    }
  }

  prefillFromAccount();
  showStep(currentStep, false);
  followBuildLink();
  window.addEventListener('hashchange', followBuildLink);
})();
