/**
 * NUML Student Portal - Command Palette Component
 * Inspired by pacocoursey/cmdk & shadcn/ui Command Component
 * Provides instant keyboard-driven search & action execution (Ctrl+K / Cmd+K)
 */

const CommandPalette = {
  dialog: null,
  input: null,
  list: null,
  selectedIndex: 0,
  visibleItems: [],

  commands: [
    // Navigation
    { id: 'nav-dashboard', category: 'Pages', title: 'Go to Student Dashboard', subtitle: 'Academic timetable, CGPA, milestones', icon: 'layoutDashboard', action: () => window.location.href = 'dashboard.html', shortcut: 'G D' },
    { id: 'nav-fee', category: 'Pages', title: 'Go to Fee Stats & Challans', subtitle: 'Pay tuition, download vouchers, billing records', icon: 'creditCard', action: () => window.location.href = 'fee-stats.html', shortcut: 'G F' },
    { id: 'nav-transcript', category: 'Pages', title: 'Go to Academic Transcript', subtitle: 'Grades, credits breakdown, GPA simulator', icon: 'fileText', action: () => window.location.href = 'transcript.html', shortcut: 'G T' },
    { id: 'nav-login', category: 'Pages', title: 'Go to Portal Login', subtitle: 'Student sign-in screen', icon: 'lock', action: () => window.location.href = 'login.html' },

    // Courses
    { id: 'course-hci', category: 'Courses & Grades', title: 'CS-413: HCI & Computer Graphics', subtitle: 'Fall 2026 • Theory (2 Cr) + Lab (1 Cr) • Midterm: 27/30', icon: 'bookOpen', action: () => window.location.href = 'transcript.html#cs413', badge: 'Next Class' },
    { id: 'course-sqe', category: 'Courses & Grades', title: 'CS-415: Software Quality Engineering', subtitle: 'Fall 2026 • 3 Credit Hours • Grade: A-', icon: 'bookOpen', action: () => window.location.href = 'transcript.html' },
    { id: 'course-mad', category: 'Courses & Grades', title: 'CS-418: Mobile Application Development', subtitle: 'Fall 2026 • 3 Credit Hours • Grade: A', icon: 'bookOpen', action: () => window.location.href = 'transcript.html' },
    { id: 'course-fyp', category: 'Courses & Grades', title: 'CS-498: Final Year Project - I', subtitle: 'Fall 2026 • 3 Credit Hours • Grade: A', icon: 'bookOpen', action: () => window.location.href = 'transcript.html' },

    // Actions & Tools
    { id: 'action-theme', category: 'Actions & Tools', title: 'Toggle Light / Dark Mode', subtitle: 'Switch color theme', icon: 'sun', action: () => ThemeController.toggle(), shortcut: 'Theme' },
    { id: 'action-hci-mode', category: 'Actions & Tools', title: 'Toggle HCI Heuristic Inspector', subtitle: 'Show on-screen Nielsen usability badges', icon: 'sparkles', action: () => {
      const toggle = document.getElementById('hci-toggle-switch');
      if (toggle) {
        toggle.checked = !toggle.checked;
        toggle.dispatchEvent(new Event('change'));
      }
    }, shortcut: 'HCI' },
    { id: 'action-hci-matrix', category: 'Actions & Tools', title: 'View HCI Evaluation Matrix Report', subtitle: 'Learnability, Usability, Error Prevention table', icon: 'graduationCap', action: () => ModalHelper.open('hci-report-dialog') },
    { id: 'action-pay-fee', category: 'Actions & Tools', title: 'Pay / Simulate Fee Challan', subtitle: 'Online payment via Kuickpay / 1Link', icon: 'creditCard', action: () => {
      if (window.location.pathname.includes('fee-stats.html')) {
        ModalHelper.open('payment-modal');
      } else {
        window.location.href = 'fee-stats.html';
      }
    }},
    { id: 'action-gpa-calc', category: 'Actions & Tools', title: 'Open "What-If" GPA Calculator', subtitle: 'Simulate prospective 7th & 8th semester grades', icon: 'sparkles', action: () => {
      if (window.location.pathname.includes('transcript.html')) {
        document.querySelector('.simulator-container')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'transcript.html';
      }
    }},
    { id: 'action-print', category: 'Actions & Tools', title: 'Print / Save Current View as PDF', subtitle: 'Printable layout', icon: 'printer', action: () => window.print(), shortcut: 'Ctrl P' }
  ],

  init() {
    this.createPaletteDOM();
    this.attachEventListeners();
  },

  createPaletteDOM() {
    const dialog = document.createElement('dialog');
    dialog.className = 'cmdk-dialog';
    dialog.id = 'cmdk-modal';
    dialog.setAttribute('aria-label', 'Command Palette');

    dialog.innerHTML = `
      <div class="cmdk-box">
        <div class="cmdk-header">
          <span style="color: var(--text-muted); display:flex;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input 
            type="text" 
            class="cmdk-search-input" 
            id="cmdk-input" 
            placeholder="Type a command, course name, or search action..." 
            autocomplete="off"
            spellcheck="false"
          >
          <kbd class="cmdk-kbd">ESC</kbd>
        </div>

        <div class="cmdk-list" id="cmdk-list" role="listbox">
          <!-- Dynamically populated -->
        </div>

        <div class="cmdk-footer">
          <div class="cmdk-footer-shortcuts">
            <span><kbd class="cmdk-kbd">↑</kbd> <kbd class="cmdk-kbd">↓</kbd> Navigate</span>
            <span><kbd class="cmdk-kbd">↵</kbd> Select</span>
            <span><kbd class="cmdk-kbd">ESC</kbd> Close</span>
          </div>
          <span>NUML Command Hub</span>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);
    this.dialog = dialog;
    this.input = dialog.querySelector('#cmdk-input');
    this.list = dialog.querySelector('#cmdk-list');
  },

  attachEventListeners() {
    // Global Keyboard Shortcut: Ctrl+K or Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      }
    });

    // Close on backdrop click
    this.dialog.addEventListener('click', (e) => {
      const box = this.dialog.querySelector('.cmdk-box');
      if (!box.contains(e.target)) {
        this.close();
      }
    });

    // Input filter
    this.input.addEventListener('input', () => {
      this.filter(this.input.value);
    });

    // Keyboard navigation inside input
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectPrev();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    // Attach to any `.command-trigger-btn` in header
    document.querySelectorAll('.command-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });
  },

  open() {
    this.input.value = '';
    this.filter('');
    this.dialog.showModal();
    setTimeout(() => this.input.focus(), 50);
  },

  close() {
    this.dialog.close();
  },

  filter(query) {
    const q = query.toLowerCase().trim();
    const filtered = this.commands.filter(cmd => {
      return cmd.title.toLowerCase().includes(q) || 
             cmd.category.toLowerCase().includes(q) ||
             (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q));
    });

    this.renderItems(filtered);
  },

  renderItems(items) {
    this.visibleItems = items;
    this.selectedIndex = 0;

    if (items.length === 0) {
      this.list.innerHTML = `
        <div class="cmdk-empty">
          <span>🔍 No matching commands, courses, or actions found.</span>
        </div>
      `;
      return;
    }

    // Group items by category
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    let html = '';
    let globalIndex = 0;

    for (const [category, catItems] of Object.entries(grouped)) {
      html += `<div class="cmdk-group-label">${category}</div>`;
      catItems.forEach(item => {
        const isSelected = globalIndex === this.selectedIndex;
        const iconSvg = LucideIcons[item.icon] || LucideIcons.fileText;
        const badgeHtml = item.badge ? `<span class="cmdk-item-badge">${item.badge}</span>` : 
                          item.shortcut ? `<kbd class="cmdk-kbd">${item.shortcut}</kbd>` : '';

        html += `
          <div class="cmdk-item ${isSelected ? 'selected' : ''}" data-index="${globalIndex}" data-id="${item.id}" role="option" aria-selected="${isSelected}">
            <div class="cmdk-item-left">
              <span class="cmdk-item-icon">${iconSvg}</span>
              <div>
                <div style="font-weight: 600;">${item.title}</div>
                ${item.subtitle ? `<div style="font-size: 0.74rem; color: var(--text-muted);">${item.subtitle}</div>` : ''}
              </div>
            </div>
            <div>${badgeHtml}</div>
          </div>
        `;
        globalIndex++;
      });
    }

    this.list.innerHTML = html;

    // Attach click events
    this.list.querySelectorAll('.cmdk-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        this.selectedIndex = idx;
        this.executeSelected();
      });
    });
  },

  selectNext() {
    if (this.visibleItems.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.visibleItems.length;
    this.updateSelectionVisuals();
  },

  selectPrev() {
    if (this.visibleItems.length === 0) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.visibleItems.length) % this.visibleItems.length;
    this.updateSelectionVisuals();
  },

  updateSelectionVisuals() {
    const items = this.list.querySelectorAll('.cmdk-item');
    items.forEach((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      item.classList.toggle('selected', isSelected);
      item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      if (isSelected) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  },

  executeSelected() {
    const selected = this.visibleItems[this.selectedIndex];
    if (selected && typeof selected.action === 'function') {
      this.close();
      selected.action();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CommandPalette.init();
});
