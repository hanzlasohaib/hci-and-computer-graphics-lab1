/**
 * NUML Student Portal - Form Validation & Error Prevention
 * Fulfills HCI Principles: Less Error & Learnability
 * Based on modern-web-guidance: :user-invalid and :user-valid
 */

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

  // Password Visibility Toggle (HCI: Recognition over Recall & Less Error)
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.textContent = isPassword ? '👁️‍🗨️' : '👁️';
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
        ruleLength.className = val.length >= 6 ? 'valid' : 'invalid';
        ruleLength.querySelector('.rule-icon').textContent = val.length >= 6 ? '✓' : '•';
      }
      if (ruleUpper) {
        ruleUpper.className = /[A-Z]/.test(val) ? 'valid' : 'invalid';
        ruleUpper.querySelector('.rule-icon').textContent = /[A-Z]/.test(val) ? '✓' : '•';
      }
      if (ruleNumber) {
        ruleNumber.className = /\d/.test(val) ? 'valid' : 'invalid';
        ruleNumber.querySelector('.rule-icon').textContent = /\d/.test(val) ? '✓' : '•';
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
