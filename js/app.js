/**
 * NUML Student Portal - Core App Logic
 * HCI Usability & Interactive State Manager
 */

// Initialize Demo Student Data
const DEFAULT_STUDENT = {
  name: "Hanzla Sohaib",
  rollNo: "21-BSCS-042",
  department: "Department of Computer Science",
  degree: "BS Computer Science (BSCS)",
  campus: "NUML Main Campus, Islamabad",
  semester: "7th Semester (Fall 2026)",
  cgpa: 3.68,
  sgpa: 3.75,
  creditsCompleted: 108,
  totalCredits: 134,
  attendanceRate: 88,
  avatarLetter: "H"
};

// State Manager
const AppState = {
  getStudent() {
    const data = localStorage.getItem('numl_student');
    return data ? JSON.parse(data) : DEFAULT_STUDENT;
  },
  setStudent(data) {
    localStorage.setItem('numl_student', JSON.stringify({ ...this.getStudent(), ...data }));
  },
  isLoggedIn() {
    return localStorage.getItem('numl_session') === 'active';
  },
  login(rollNo = "21-BSCS-042") {
    localStorage.setItem('numl_session', 'active');
    this.setStudent({ rollNo });
  },
  logout() {
    localStorage.removeItem('numl_session');
    window.location.href = 'login.html';
  }
};

// Theme Controller (Light / Dark Mode)
const ThemeController = {
  init() {
    const savedTheme = localStorage.getItem('numl_theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.applyTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  },
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('numl_theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
      if (typeof LucideIcons !== 'undefined') {
        icon.innerHTML = theme === 'dark' ? LucideIcons.sun : LucideIcons.moon;
      } else {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }
};

// Toast Notification System with 5-Second Undo Support (HCI: User Control & Freedom)
const ToastManager = {
  container: null,
  init() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    this.container = container;
  },
  show({ title, message, type = 'info', undoCallback = null, duration = 5000 }) {
    this.init();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');

    let iconSvg = 'ℹ️';
    if (typeof LucideIcons !== 'undefined') {
      const iconMap = {
        success: LucideIcons.checkCircle,
        warning: LucideIcons.alertCircle,
        danger: LucideIcons.shieldAlert,
        info: LucideIcons.fileText
      };
      iconSvg = iconMap[type] || LucideIcons.fileText;
    }

    let undoBtnHtml = '';
    if (undoCallback) {
      const undoIcon = typeof LucideIcons !== 'undefined' ? LucideIcons.rotateCcw : '↩';
      undoBtnHtml = `<button class="toast-action-btn" id="toast-undo-btn" style="display:inline-flex; align-items:center; gap:0.35rem;">${undoIcon} Undo (5s)</button>`;
    }

    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">
          <span style="display:flex; align-items:center;">${iconSvg}</span>
          <span>${title}</span>
        </div>
        <div class="toast-desc">${message}</div>
        <div class="toast-progress"><div class="toast-progress-bar"></div></div>
      </div>
      ${undoBtnHtml}
    `;

    this.container.appendChild(toast);

    let dismissed = false;
    let timer = setTimeout(() => {
      dismissToast();
    }, duration);

    const dismissToast = () => {
      if (dismissed) return;
      dismissed = true;
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    };

    if (undoCallback) {
      const undoBtn = toast.querySelector('#toast-undo-btn');
      if (undoBtn) {
        undoBtn.addEventListener('click', () => {
          clearTimeout(timer);
          dismissToast();
          undoCallback();
        });
      }
    }
  }
};

// Modal Dialog Helpers
const ModalHelper = {
  open(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  },
  close(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  }
};

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  ThemeController.init();
  ToastManager.init();

  // Populate dynamic student names if elements present
  const student = AppState.getStudent();
  const nameEls = document.querySelectorAll('.dynamic-student-name');
  nameEls.forEach(el => el.textContent = student.name);

  const rollEls = document.querySelectorAll('.dynamic-student-roll');
  rollEls.forEach(el => el.textContent = student.rollNo);

  const cgpaEls = document.querySelectorAll('.dynamic-student-cgpa');
  cgpaEls.forEach(el => el.textContent = student.cgpa.toFixed(2));

  // Global logout buttons
  const logoutBtns = document.querySelectorAll('.btn-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      AppState.logout();
    });
  });
});
