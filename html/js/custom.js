// VitalPath Medical - shared custom JS
document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initCheckoutPage();
  initUpsellPage();
});

// SHARED: toggle the red/green validation border on any input or select.
// Usage on any page: setFieldValidity(el, true) for success, false for error,
// null to clear back to the neutral border.
function setFieldValidity(el, isValid) {
  el.classList.remove('vp-input-error', 'vp-input-success');
  if (isValid === true) el.classList.add('vp-input-success');
  if (isValid === false) el.classList.add('vp-input-error');
}

// LANDING + PRIVACY: FAQ accordion - one open at a time
function initFaqAccordion() {
  const items = document.querySelectorAll('.vp-faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.vp-faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('vp-faq-open');
      items.forEach((i) => i.classList.remove('vp-faq-open'));
      if (!isOpen) item.classList.add('vp-faq-open');
    });
  });
}

// CHECKOUT: payment method selection + countdown timer
function initCheckoutPage() {
  const methods = document.querySelectorAll('.vp-payment-method');
  const fieldGroups = document.querySelectorAll('[data-payment-fields]');
  if (methods.length) {
    const showFieldsFor = (method) => {
      fieldGroups.forEach((group) => {
        group.hidden = group.dataset.paymentFields !== method;
      });
    };
    methods.forEach((m) => {
      m.addEventListener('click', () => {
        methods.forEach((x) => x.classList.remove('vp-payment-method-active'));
        m.classList.add('vp-payment-method-active');
        showFieldsFor(m.dataset.method);
      });
    });
  }

  document.querySelectorAll('.vp-expiry-input').forEach((expiryEl) => {
    expiryEl.addEventListener('input', () => {
      let digits = expiryEl.value.replace(/\D/g, '').slice(0, 4);
      if (digits.length >= 3) {
        digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      }
      expiryEl.value = digits;
      setFieldValidity(expiryEl, null);
    });
    expiryEl.addEventListener('blur', () => {
      const match = expiryEl.value.match(/^(\d{2})\/(\d{2})$/);
      const month = match ? parseInt(match[1], 10) : 0;
      setFieldValidity(expiryEl, !!match && month >= 1 && month <= 12);
    });
  });

  document.querySelectorAll('.checkout-page input[required]:not(.vp-expiry-input), .checkout-page select[required]').forEach((field) => {
    field.addEventListener('blur', () => {
      setFieldValidity(field, field.value.trim() !== '');
    });
  });

  const timerEl = document.querySelector('.vp-countdown-timer');
  if (timerEl) {
    let timeLeft = 8 * 60 + 43;
    setInterval(() => {
      if (timeLeft <= 0) return;
      timeLeft--;
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      timerEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  }
}

// UPSELL: order-processing progress bar fill
function initUpsellPage() {
  const bar = document.querySelector('.vp-progress-fill');
  if (bar) {
    setTimeout(() => { bar.style.width = '92%'; }, 300);
  }
}
