export function validateField(input, formType) {
  const value = input.value.trim();
  const name = input.name;
  if (input.required && (input.type === 'checkbox' ? !input.checked : !value)) {
    return input.type === 'checkbox' ? 'Please agree to be contacted about your application.' : 'Please complete this field.';
  }
  if (!value || input.type === 'checkbox') return '';
  const maxLength = input.maxLength > 0 ? input.maxLength : 200;
  if (Array.from(value).length > maxLength) return `Please use no more than ${maxLength} characters.`;
  if (name !== 'message' && /[\u0000-\u001f\u007f]/u.test(value)) return 'Please enter this field on a single line.';
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
  if (name === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (!/^\+?[0-9() .-]+$/.test(value) || digits.length < 7 || digits.length > 15 || /^0+$/.test(digits)) {
      return 'Enter a phone number containing 7 to 15 digits, with an optional leading +.';
    }
  }
  if (input.tagName === 'SELECT' && ![...input.options].some(option => option.value === value)) return 'Please select a valid option.';
  return '';
}

function validateForm(form) {
  const formType = form.elements.namedItem('formType').value;
  for (const input of form.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
    if (input.name === 'website') continue;
    if (input.type !== 'checkbox') input.value = input.value.trim();
    input.setCustomValidity(validateField(input, formType));
  }
  return form.reportValidity();
}

function refreshCaptcha(form) {
  const image = form.querySelector('[data-captcha-image]');
  const url = new URL(image.dataset.captchaSrc, window.location.href);
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
  url.searchParams.set('id', id);
  form.querySelector('[name="captchaId"]').value = id;
  image.dataset.ready = 'false';
  url.searchParams.set('refresh', `${Date.now()}-${Math.random()}`);
  form.querySelector('[name="captcha"]').value = '';
  form.querySelector('[data-captcha-error]').textContent = '';
  image.src = url.href;
}

export function setupCaptchas() {
  document.querySelectorAll('[data-email-form]').forEach(form => {
    if (!form.querySelector('[name="captchaId"]').value) refreshCaptcha(form);
  });
}

export function submitToSalesforce(submission) {
  const endpoint = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DdN00000f3iwB';
  if (!submission || submission.action !== endpoint || !submission.fields
      || typeof submission.fields !== 'object' || Array.isArray(submission.fields)
      || Object.values(submission.fields).some(value => typeof value !== 'string')) {
    throw new Error('Unable to connect to the enquiry service. Please try again later.');
  }
  // A normal browser POST matches the original site and does not require CORS or PHP mail.
  const outgoing = document.createElement('form');
  outgoing.method = 'POST';
  outgoing.action = endpoint;
  outgoing.acceptCharset = 'UTF-8';
  outgoing.hidden = true;
  for (const [name, value] of Object.entries(submission.fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    outgoing.appendChild(input);
  }
  document.body.appendChild(outgoing);
  try {
    HTMLFormElement.prototype.submit.call(outgoing);
  } catch (error) {
    outgoing.remove();
    throw error;
  }
}

export function setupForms() {
  document.addEventListener('input', (event) => {
    const input = event.target;
    if (input.closest('[data-email-form]') && typeof input.setCustomValidity === 'function') {
      input.setCustomValidity('');
    }
  });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-captcha-refresh]');
    if (button && button.closest('form').dataset.submitting !== 'true') refreshCaptcha(button.closest('form'));
  });
  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement && event.target.matches('[data-captcha-image]')) {
      event.target.dataset.ready = 'false';
      event.target.closest('form').querySelector('[data-captcha-error]').textContent =
        'Security code could not load. Select the refresh icon to retry, or email marketing@eaplworld.com.';
    }
  }, true);
  document.addEventListener('load', (event) => {
    if (event.target instanceof HTMLImageElement && event.target.matches('[data-captcha-image]')) {
      event.target.dataset.ready = 'true';
      event.target.closest('form').querySelector('[data-captcha-error]').textContent = '';
    }
  }, true);
  document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches('[data-email-form]')) return;
    event.preventDefault();
    if (form.dataset.submitting === 'true' || !validateForm(form)) return;

    if (form.querySelector('[data-captcha-image]').dataset.ready !== 'true') {
      form.querySelector('[data-captcha-error]').textContent = 'Wait for the security code to load, or select refresh to retry.';
      return;
    }
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('[type="submit"]');
    const originalLabel = button.innerHTML;
    const data = new FormData(form);
    form.dataset.submitting = 'true';
    form.setAttribute('aria-busy', 'true');
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = 'Sending your enquiry…';
    status.dataset.state = 'pending';
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: data, headers: { Accept: 'application/json' },
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || 'Unable to submit. Please try again later.');
      }
      if (result.next !== 'salesforce') {
        throw new Error('The enquiry service is outdated. Please refresh the page and try again.');
      }
      status.textContent = 'Connecting to submit your enquiry…';
      status.dataset.state = 'pending';
      submitToSalesforce(result.submission);
    } catch (error) {
      status.textContent = error instanceof SyntaxError || error instanceof TypeError
        ? 'Unable to reach the enquiry service. Please try again later or email marketing@eaplworld.com.'
        : error.message;
      status.dataset.state = 'error';
    } finally {
      refreshCaptcha(form);
      delete form.dataset.submitting;
      form.removeAttribute('aria-busy');
      button.disabled = false;
      button.innerHTML = originalLabel;
    }
  });
}
