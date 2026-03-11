// ===========================
//  O&M PROFESSIONALS
//  Admin Dashboard (admin.js)
// ===========================

document.addEventListener('DOMContentLoaded', () => {

  const loginScreen = document.getElementById('loginScreen');
  const adminWrap   = document.getElementById('adminWrap');
  const loginBtn    = document.getElementById('loginBtn');
  const logoutBtn   = document.getElementById('logoutBtn');
  const loginError  = document.getElementById('loginError');
  const passInput   = document.getElementById('adminPass');
  const SESSION_KEY = 'oandm_admin_session';

  function isLoggedIn()  { return sessionStorage.getItem(SESSION_KEY) === 'true'; }
  function showDashboard() { loginScreen.style.display = 'none'; adminWrap.style.display = 'block'; renderAdminJobs(); }
  function showLogin()     { loginScreen.style.display = 'flex'; adminWrap.style.display = 'none'; }

  if (isLoggedIn()) showDashboard();

  loginBtn.addEventListener('click', () => {
    if (passInput.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      loginError.style.display = 'none';
      passInput.value = '';
      showDashboard();
    } else {
      loginError.style.display = 'block';
      passInput.value = '';
      passInput.focus();
    }
  });
  passInput.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });
  logoutBtn.addEventListener('click', () => { sessionStorage.removeItem(SESSION_KEY); showLogin(); });

  // ── POST JOB FORM ─────────────────────────────────────
  const jobForm        = document.getElementById('jobForm');
  const jobPostSuccess = document.getElementById('jobPostSuccess');

  jobForm?.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('jTitle').value.trim();
    const desc  = document.getElementById('jDesc').value.trim();
    if (!title || !desc) { alert('Please fill in at least the Job Title and Description.'); return; }

    addJob({
      title,
      location: document.getElementById('jLocation').value.trim(),
      type:     document.getElementById('jType').value,
      salary:   document.getElementById('jSalary').value.trim(),
      description: desc,
      dept:     document.getElementById('jDept').value.trim(),
      status:   'open',
    });

    jobForm.reset();
    jobPostSuccess.classList.add('show');
    setTimeout(() => jobPostSuccess.classList.remove('show'), 4000);
    renderAdminJobs();
  });

  // ── RENDER ADMIN JOB LIST ─────────────────────────────
  function renderAdminJobs() {
    const container = document.getElementById('adminJobsList');
    if (!container) return;
    const jobs = getJobs();

    if (!jobs.length) {
      container.innerHTML = '<p style="color:var(--muted);font-size:0.9rem;">No jobs posted yet.</p>';
      return;
    }

    container.innerHTML = '';
    jobs.forEach(job => {
      const row = document.createElement('div');
      row.className = 'admin-job-row';
      row.innerHTML = `
        <div class="admin-job-info">
          <div class="admin-job-title">${job.title}</div>
          <div class="admin-job-meta">
            <span class="job-type-badge" style="font-size:0.65rem;">${job.type}</span>
            <span style="color:var(--muted);font-size:0.8rem;">${job.location || 'No location'}</span>
            <span style="color:var(--muted);font-size:0.8rem;">Posted ${job.date}</span>
          </div>
        </div>
        <div class="admin-job-actions">
          <select class="status-select" data-id="${job.id}" title="Change job status">
            <option value="open"   ${job.status === 'open'   ? 'selected' : ''}>🟢 Open</option>
            <option value="filled" ${job.status === 'filled' ? 'selected' : ''}>🟡 Position Filled</option>
            <option value="closed" ${job.status === 'closed' ? 'selected' : ''}>🔴 Closed</option>
          </select>
          <button class="delete-btn" data-id="${job.id}" title="Delete this job">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Remove
          </button>
        </div>
      `;
      container.appendChild(row);
    });

    // Status change handlers
    container.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        updateJobStatus(sel.dataset.id, sel.value);
        renderAdminJobs();
      });
    });

    // Delete handlers
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Remove this job posting? This cannot be undone.')) {
          deleteJob(btn.dataset.id);
          renderAdminJobs();
        }
      });
    });
  }

});
