/**
 * NUML Student Portal - Form Validation & Error Prevention
 * Fulfills HCI Principles: Less Error & Learnability
 * Benchmarked against:
 * - alphagov/govuk-frontend (Error Summary pattern & accessible focus redirection)
 * - modern-web-guidance (:user-invalid and :user-valid)
 */

const GovUkErrorSummary = {
  render(form, errors = []) {
    let summaryBox = form.querySelector('.govuk-error-summary');
    if (!summaryBox) {
      summaryBox = document.createElement('div');
      summaryBox.className = 'govuk-error-summary';
      summaryBox.setAttribute('role', 'alert');
      summaryBox.setAttribute('tabindex', '-1');
      form.prepend(summaryBox);
    }

    if (errors.length === 0) {
      summaryBox.style.display = 'none';
      return;
    }

    let itemsHtml = '';
    errors.forEach(err => {
      itemsHtml += `
        <li>
          <a href="#${err.fieldId}" data-target-field="${err.fieldId}">
            ${err.message}
          </a>
        </li>
      `;
    });

    summaryBox.innerHTML = `
      <div class="govuk-error-summary__title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        <span>There is a problem with your submission</span>
      </div>
      <ul class="govuk-error-summary__list">
        ${itemsHtml}
      </ul>
    `;

    summaryBox.style.display = 'block';
    summaryBox.focus();

    // Clicking an error anchor scrolls & focuses the corresponding input
    summaryBox.querySelectorAll('a[data-target-field]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const fieldId = link.getAttribute('data-target-field');
        const targetInput = document.getElementById(fieldId);
        if (targetInput) {
          targetInput.focus();
          targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  },

  clear(form) {
    const summaryBox = form.querySelector('.govuk-error-summary');
    if (summaryBox) {
      summaryBox.style.display = 'none';
      summaryBox.innerHTML = '';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Sync ARIA states with :user-invalid and :user-valid
  const syncAria = (el) => {
    if (!el || typeof el.matches !== 'function') return;
    if (el.matches(':user-invalid')) {
      el.setAttribute('aria-invalid', 'true');
    } else if (el.matches(':user-valid')) {
      el.setAttribute('aria-invalid', 'false');
    }
  };

  document.addEventListener('blur', (e) => syncAria(e.target), true);
  document.addEventListener('input', (e) => {
    if (e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) {
      syncAria(e.target);
    }
  });

  // Caps Lock Warning Detector (HCI: Error Prevention)
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    const capslockAlert = input.closest('.form-group')?.querySelector('.capslock-alert');
    if (!capslockAlert) return;

    input.addEventListener('keyup', (e) => {
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        capslockAlert.style.display = 'flex';
      } else {
        capslockAlert.style.display = 'none';
      }
    });

    input.addEventListener('blur', () => {
      capslockAlert.style.display = 'none';
    });
  });

  // Password Visibility Toggle with Lucide Vector Icons (HCI: Recognition over Recall)
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    // Initial icon
    if (typeof LucideIcons !== 'undefined') {
      btn.innerHTML = LucideIcons.eye;
    }

    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      
      if (typeof LucideIcons !== 'undefined') {
        btn.innerHTML = isPassword ? LucideIcons.eyeOff : LucideIcons.eye;
      }
    });
  });

  // Live Password Strength Checklist
  const loginPassInput = document.getElementById('login-password');
  if (loginPassInput) {
    const rulesList = document.getElementById('password-rules-list');
    loginPassInput.addEventListener('input', () => {
      const val = loginPassInput.value;
      if (!rulesList) return;

      const ruleLength = rulesList.querySelector('[data-rule="length"]');
      const ruleUpper = rulesList.querySelector('[data-rule="upper"]');
      const ruleNumber = rulesList.querySelector('[data-rule="number"]');

      if (ruleLength) {
        const isValid = val.length >= 6;
        ruleLength.className = isValid ? 'valid' : 'invalid';
        ruleLength.querySelector('.rule-icon').textContent = isValid ? '✓' : '•';
      }
      if (ruleUpper) {
        const isValid = /[A-Z]/.test(val);
        ruleUpper.className = isValid ? 'valid' : 'invalid';
        ruleUpper.querySelector('.rule-icon').textContent = isValid ? '✓' : '•';
      }
      if (ruleNumber) {
        const isValid = /\d/.test(val);
        ruleNumber.className = isValid ? 'valid' : 'invalid';
        ruleNumber.querySelector('.rule-icon').textContent = isValid ? '✓' : '•';
      }
    });
  }

  // Roll Number Formatter (Masking to prevent formatting typos, e.g. 21-BSCS-042)
  const rollInput = document.getElementById('login-roll');
  if (rollInput) {
    rollInput.addEventListener('input', (e) => {
      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
      e.target.value = val;
    });
  }
});
