/**
 * NUML Student Portal - Interactive HCI Heuristic Inspector & Audit Matrix
 * Built specifically for HCI Course Lab Presentation & Evaluation
 */

const HCIInspector = {
  state: false,

  init() {
    this.createFloatingBar();
    this.createReportModal();
    this.restoreState();
  },

  createFloatingBar() {
    const bar = document.createElement('aside');
    bar.className = 'hci-floating-bar';
    bar.setAttribute('aria-label', 'HCI Usability Evaluation Bar');
    bar.innerHTML = `
      <span class="hci-badge-tag">HCI Evaluation</span>
      <span style="font-size:0.78rem;">Inspector</span>
      <label class="hci-switch" title="Toggle Heuristic Pin Overlays">
        <input type="checkbox" id="hci-toggle-switch">
        <span class="hci-slider"></span>
      </label>
      <button class="hci-report-btn" id="hci-open-report-btn" title="Open Nielsen Heuristics Evaluation Matrix">
        📊 Matrix Report
      </button>
    `;
    document.body.appendChild(bar);

    const toggle = document.getElementById('hci-toggle-switch');
    toggle.addEventListener('change', (e) => {
      this.toggleMode(e.target.checked);
    });

    const reportBtn = document.getElementById('hci-open-report-btn');
    reportBtn.addEventListener('click', () => {
      ModalHelper.open('hci-report-dialog');
    });
  },

  toggleMode(enable) {
    this.state = enable;
    localStorage.setItem('numl_hci_mode', enable ? '1' : '0');
    if (enable) {
      document.body.classList.add('hci-inspector-active');
      ToastManager.show({
        title: 'HCI Inspector Active',
        message: 'Highlighting Nielsen Usability Heuristics & Error Prevention markers across the interface.',
        type: 'info'
      });
    } else {
      document.body.classList.remove('hci-inspector-active');
    }
  },

  restoreState() {
    const saved = localStorage.getItem('numl_hci_mode') === '1';
    const toggle = document.getElementById('hci-toggle-switch');
    if (toggle && saved) {
      toggle.checked = true;
      this.toggleMode(true);
    }
  },

  createReportModal() {
    const dialog = document.createElement('dialog');
    dialog.id = 'hci-report-dialog';
    dialog.className = 'modal hci-modal-dialog';
    dialog.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.65rem;">
            <div style="font-size:1.5rem;">🎓</div>
            <div>
              <h2 class="modal-title" style="font-size:1.25rem;">HCI Heuristic Evaluation & Usability Matrix</h2>
              <p style="font-size:0.75rem; color:var(--text-muted);">NUML Student Portal • Course: CS-413 HCI & Computer Graphics</p>
            </div>
          </div>
          <button class="icon-btn" onclick="ModalHelper.close('hci-report-dialog')" aria-label="Close modal">✕</button>
        </div>

        <div class="modal-body" style="max-height: 70vh; overflow-y: auto; padding-right: 0.5rem;">
          
          <!-- Core Evaluation Pillars -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border-left:4px solid #1e40af;">
              <span class="pill-core pill-learn">Pillar 1: Learnability</span>
              <h4 style="margin:0.4rem 0 0.2rem; font-size:0.92rem;">Easy to Learn</h4>
              <p style="font-size:0.78rem; color:var(--text-muted);">
                Recognition over recall, intuitive NUML academic metaphors (Challan, CGPA, Credits), breadcrumbs, and pre-filled demo accounts.
              </p>
            </div>

            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border-left:4px solid #166534;">
              <span class="pill-core pill-use">Pillar 2: Efficiency</span>
              <h4 style="margin:0.4rem 0 0.2rem; font-size:0.92rem;">Easy to Use</h4>
              <p style="font-size:0.78rem; color:var(--text-muted);">
                High visual hierarchy, quick launchpads, dark/light themes, instant search/filter, and interactive "What-If" GPA Simulator.
              </p>
            </div>

            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border-left:4px solid #991b1b;">
              <span class="pill-core pill-error">Pillar 3: Error Prevention</span>
              <h4 style="margin:0.4rem 0 0.2rem; font-size:0.92rem;">Less Error</h4>
              <p style="font-size:0.78rem; color:var(--text-muted);">
                CSS3 <code>:user-invalid</code> (no premature alerts), Caps-Lock indicator, modal confirmation on payments, and 5-sec Undo Toast.
              </p>
            </div>
          </div>

          <!-- Jakob Nielsen 10 Heuristics Table -->
          <h3 style="font-size:1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
            <span>📋</span> Jakob Nielsen's 10 Usability Heuristics Compliance Audit
          </h3>
          <div class="table-container">
            <table class="hci-matrix-table">
              <thead>
                <tr>
                  <th style="width:25%;">Heuristic</th>
                  <th style="width:55%;">Implementation in NUML Portal</th>
                  <th style="width:20%;">Evaluation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="heuristic-code">H1</span> <strong>Visibility of System Status</strong></td>
                  <td>Active semester timeline bar (Week 8/16), countdown badges, real-time payment status pills, and instant toast alerts.</td>
                  <td><span class="badge badge-success">✓ Fully Met</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H2</span> <strong>Match Between System & Real World</strong></td>
                  <td>Uses authentic NUML Pakistani university terms: "Challan", "1Link / Kuickpay", "Midterms", "Grade Points", "CS-413 HCI".</td>
                  <td><span class="badge badge-success">✓ Fully Met</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H3</span> <strong>User Control & Freedom</strong></td>
                  <td>5-second Undo Toast on simulated fee payments, cancel buttons in modal dialogs, and reset button in GPA Simulator.</td>
                  <td><span class="badge badge-success">✓ Fully Met</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H4</span> <strong>Consistency & Standards</strong></td>
                  <td>Uniform navigation bar across all 4 pages, standardized green/red/amber status pills, consistent button hierarchy.</td>
                  <td><span class="badge badge-success">✓ Fully Met</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H5</span> <strong>Error Prevention</strong></td>
                  <td>Modern <code>:user-invalid</code> prevents annoying red errors before typing; roll number format masking; confirmation before payment.</td>
                  <td><span class="badge badge-success">✓ Exceeds</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H6</span> <strong>Recognition Rather Than Recall</strong></td>
                  <td>Visual course cards, breadcrumb trail on all pages, password peek toggle, and "Fill Demo Student" button on login.</td>
                  <td><span class="badge badge-success">✓ Fully Met</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H7</span> <strong>Flexibility & Efficiency</strong></td>
                  <td>Interactive What-If GPA Simulator allowing prospective grade changes; quick filters by semester; printable slips.</td>
                  <td><span class="badge badge-success">✓ Exceeds</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H8</span> <strong>Aesthetic & Minimalist Design</strong></td>
                  <td>Uncluttered card layout, generous whitespace, subtle glassmorphism, curated NUML navy & emerald color scheme.</td>
                  <td><span class="badge badge-success">✓ Fully Met</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H9</span> <strong>Help Users Recognize & Recover</strong></td>
                  <td>Plain-English error explanations with corrective instructions (e.g. format: 21-BSCS-042) and live password rule checklists.</td>
                  <td><span class="badge badge-success">✓ Fully Met</span></td>
                </tr>
                <tr>
                  <td><span class="heuristic-code">H10</span> <strong>Help & Documentation</strong></td>
                  <td>Contextual hints above inputs, fee payment helpline info, course code guides, and built-in HCI inspector.</td>
                  <td><span class="badge badge-success">✓ Fully Met</span></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" onclick="ModalHelper.close('hci-report-dialog')">Done Reviewing</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  HCIInspector.init();
});
