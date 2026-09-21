# NUML Student Academic Portal - HCI & Computer Graphics (CS-413)

A high-fidelity web application prototype developed for the **National University of Modern Languages (NUML)**, Islamabad. This project fulfills the midterm lab assignment for **Human-Computer Interaction (HCI) & Computer Graphics**, focusing on:

- **Easy to Learn (Learnability)**
- **Easy to Use (Efficiency & Usability)**
- **Less Error (Error Prevention & Recovery)**
- **Jakob Nielsen's 10 Usability Heuristics** with an interactive on-screen **HCI Inspector Mode**.

---

## 🚀 Features & 4 Main Pages

1. **Gateway Hub (`index.html`)**:
   - Central entry point linking all 4 modules.
   - Project overview and quick access to the evaluation matrix.

2. **Page 1: Student Login (`login.html`)**:
   - **Error Prevention (H5)**: Format hint and auto-validation for student roll number (`21-BSCS-042`) using `:user-invalid` (no premature error states).
   - **Password Visibility (H6)**: Peek/Hide button with accessible ARIA state.
   - **Caps-Lock Alert (H9)**: Real-time notification when Caps-Lock is active.
   - **Live Password Criteria Checklist**: Real-time feedback for character length, uppercase, and numbers.
   - **Demo Auto-Fill**: One-click demo credentials for quick academic testing.

3. **Page 2: Student Dashboard (`dashboard.html`)**:
   - **Visibility of System Status (H1)**: Active semester timeline progress bar (Week 8 of 16 - Midterm phase).
   - **Real-World University Schedule (H2)**: Highlights **CS-413: HCI & Computer Graphics** (11:00 AM - 01:00 PM, Lab 3) with "Next Up" indicator.
   - **Key Metrics (H1, H8)**: CGPA (3.68), Attendance (88%), Degree Credits (108/134), and Fee Status.
   - **Quick Action Launchpad**: Direct shortcuts to Fee Stats and Transcript.

4. **Page 3: Fee Stats & Billing Records (`fee-stats.html`)**:
   - **Financial KPIs**: Total billed, total paid, and outstanding balance status.
   - **Semester Challans**: Interactive table with tuition, graphics lab charges, and exam dues.
   - **3-Copy Bank Challan Slip**: Authentic printable slip (Bank, University, and Student copies).
   - **Payment Modal (H5)**: Modal review before payment authorization.
   - **5-Second Undo Toast Notification (H3)**: Allows immediate cancellation of simulated transactions.

5. **Page 4: Academic Transcript & GPA Simulator (`transcript.html`)**:
   - **Course Breakdown**: Comprehensive semester-by-semester courses (Semesters 1–7) with grades and grade points.
   - **Subject Spotlight**: CS-413 HCI & Computer Graphics midterm & lab evaluation.
   - **Interactive "What-If" GPA Calculator (H7, H3)**: Test prospective grades in real-time with dynamic CGPA recalculation and 1-click reset.
   - **Search & Filters**: Instant course code/title search and semester filters.

6. **🎓 Interactive HCI Heuristic Inspector Mode**:
   - Available on all pages via the top-right floating pill.
   - Highlights on-screen UI components matching Nielsen's heuristics (H1–H10).
   - Built-in **Matrix Report** modal detailing compliance with Learnability, Usability, and Error Prevention.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic document structure and native `<dialog>` modals.
- **CSS3**: Vanilla CSS with custom properties (NUML Navy `#002855`, Emerald `#059669`, Gold `#d97706`), Plus Jakarta Sans typography, light/dark themes, and `:user-invalid` constraint validation.
- **JavaScript (ES6+)**: Pure client-side logic, `localStorage` state persistence, and real-time GPA calculations. Zero dependencies.

---

## 💻 How to Run Locally

Simply clone the repository and open `index.html` in any modern web browser:

```bash
# Clone repository
git clone git@github.com:hanzlasohaib/hci-and-computer-graphics.git

# Navigate into folder
cd "1. Mids/Lec1Lab"

# (Optional) Run with Python local server
python -m http.server 8000
```
Open [http://localhost:8000/index.html](http://localhost:8000/index.html) in your browser.
