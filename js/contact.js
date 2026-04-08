/* =============================================
   MUZO MARKET — contact.js
   Contact form validation & submission
   ============================================= */

'use strict';

/* ================================================
   FORM VALIDATION
   ================================================ */

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\d\s\+\-\(\)]{7,}$/.test(phone);
}

function showError(input, message) {
  clearError(input);
  input.style.borderColor = '#ef4444';
  input.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
  const err = document.createElement('span');
  err.className = 'field-error';
  err.style.cssText = 'display:block;color:#ef4444;font-size:12px;margin-top:5px;';
  err.textContent = message;
  input.parentNode.appendChild(err);
}

function clearError(input) {
  input.style.borderColor = '';
  input.style.boxShadow = '';
  const err = input.parentNode.querySelector('.field-error');
  err?.remove();
}

function clearAllErrors(form) {
  form.querySelectorAll('.field-error').forEach(e => e.remove());
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  });
}

function validateForm(form) {
  let valid = true;

  const name = form.querySelector('#contact-name');
  if (name && name.value.trim().length < 2) {
    showError(name, 'Numele trebuie să aibă minim 2 caractere.');
    valid = false;
  } else if (name) clearError(name);

  const email = form.querySelector('#contact-email');
  if (email && !validateEmail(email.value.trim())) {
    showError(email, 'Introdu o adresă de email validă.');
    valid = false;
  } else if (email) clearError(email);

  const phone = form.querySelector('#contact-phone');
  if (phone && phone.value.trim() && !validatePhone(phone.value.trim())) {
    showError(phone, 'Număr de telefon invalid.');
    valid = false;
  } else if (phone) clearError(phone);

  const message = form.querySelector('#contact-message');
  if (message && message.value.trim().length < 10) {
    showError(message, 'Mesajul trebuie să aibă minim 10 caractere.');
    valid = false;
  } else if (message) clearError(message);

  return valid;
}


/* ================================================
   FORM SUBMISSION (simulated)
   ================================================ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit');
  const formBody = document.getElementById('form-body');
  const successMsg = document.getElementById('form-success');

  // Live validation on blur
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('blur', () => {
      if (el.value.trim()) clearError(el);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(form);

    if (!validateForm(form)) return;

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Se trimite...`;
    submitBtn.style.opacity = '0.8';

    // Simulate async send
    await new Promise(resolve => setTimeout(resolve, 1800));

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    submitBtn.style.opacity = '';

    // Show success
    if (formBody && successMsg) {
      formBody.style.display = 'none';
      successMsg.classList.add('show');
    } else {
      Toast.show('Mesaj trimis cu succes! Te contactăm în curând. ✉️', 4000);
      form.reset();
    }
  });

  // "Send another" button
  document.querySelector('.send-another')?.addEventListener('click', () => {
    if (formBody && successMsg) {
      formBody.style.display = '';
      successMsg.classList.remove('show');
      form.reset();
    }
  });
}


/* ================================================
   SPIN ANIMATION (for loading indicator)
   ================================================ */

const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }
`;
document.head.appendChild(spinStyle);


/* ================================================
   FAQ ACCORDION (Despre page)
   ================================================ */

function initAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
        openItem.querySelector('.faq-answer').style.paddingBottom = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.paddingBottom = '20px';
      }
    });
  });
}


/* ================================================
   INIT
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initAccordion();
});
