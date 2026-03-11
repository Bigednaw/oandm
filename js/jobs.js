// ===========================
//  O&M PROFESSIONALS
//  Job Data Store (jobs.js)
//  Shared between careers.html and admin.html
// ===========================

// ── CHANGE YOUR ADMIN PASSWORD HERE ──────────────────────
const ADMIN_PASSWORD = 'admin123';
// ─────────────────────────────────────────────────────────

const JOBS_KEY = 'oandm_jobs';

function getJobs() {
  try { return JSON.parse(localStorage.getItem(JOBS_KEY)) || []; }
  catch { return []; }
}

function saveJobs(jobs) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

function addJob(job) {
  const jobs = getJobs();
  job.id     = Date.now().toString();
  job.date   = new Date().toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' });
  job.status = job.status || 'open'; // default to open
  jobs.unshift(job);
  saveJobs(jobs);
  return job;
}

function deleteJob(id) {
  saveJobs(getJobs().filter(j => j.id !== id));
}

function updateJobStatus(id, status) {
  const jobs = getJobs().map(j => j.id === id ? { ...j, status } : j);
  saveJobs(jobs);
}

function formatSalary(s) {
  return s && s.trim() ? s.trim() : 'Competitive';
}

// ── STATUS BADGE ─────────────────────────────────────────
function statusBadge(s) {
  const map = {
    open:   ['status-open',   'Open'],
    filled: ['status-filled', 'Position Filled'],
    closed: ['status-closed', 'Closed'],
  };
  const [cls, label] = map[s] || map['open'];
  return `<span class="job-status ${cls}">${label}</span>`;
}

// ── CAREERS PAGE: Render job listings ────────────────────
function renderCareers() {
  const listEl  = document.getElementById('jobsList');
  const noJobs  = document.getElementById('noJobs');
  const filters = document.querySelectorAll('.filter-btn');
  if (!listEl) return;

  function render(filter) {
    const jobs     = getJobs();
    const filtered = filter === 'all' ? jobs : jobs.filter(j => j.type === filter);
    listEl.innerHTML = '';

    if (!filtered.length) {
      listEl.style.display = 'none';
      noJobs.style.display = 'flex';
      return;
    }

    listEl.style.display = 'grid';
    noJobs.style.display = 'none';

    filtered.forEach(job => {
      const isClosed = job.status === 'closed' || job.status === 'filled';
      const card = document.createElement('div');
      card.className = 'job-card fade-in' + (job.status === 'closed' ? ' is-closed' : job.status === 'filled' ? ' is-filled' : '');

      card.innerHTML = `
        <div class="job-card-top">
          <div class="job-meta">
            <span class="job-type-badge">${job.type}</span>
            ${job.dept ? `<span class="job-dept">${job.dept}</span>` : ''}
            ${statusBadge(job.status)}
          </div>
          <span class="job-date">Posted ${job.date}</span>
        </div>
        <h3 class="job-title">${job.title}</h3>
        <div class="job-details">
          <span class="job-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            ${job.location || 'Location TBD'}
          </span>
          <span class="job-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${job.type}
          </span>
          <span class="job-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            ${formatSalary(job.salary)}
          </span>
        </div>
        <p class="job-desc">${job.description}</p>
        ${!isClosed ? `
          <button class="btn-primary apply-btn" data-id="${job.id}" data-title="${job.title}">
            Apply Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>` : ''}
      `;

      listEl.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 50);
    });

    // Wire up Apply buttons
    document.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', () => openApplyModal(btn.dataset.id, btn.dataset.title));
    });
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });

  render('all');
}

// ── APPLICATION MODAL ─────────────────────────────────────
function openApplyModal(jobId, jobTitle) {
  document.getElementById('modalJobTitle').textContent = jobTitle;
  document.getElementById('applyJobId').value = jobId;
  document.getElementById('applyForm').style.display = '';
  document.getElementById('applySuccess').classList.remove('show');
  document.getElementById('modalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeApplyModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// Init careers page
if (document.getElementById('jobsList')) {
  document.addEventListener('DOMContentLoaded', () => {
    renderCareers();

    document.getElementById('modalClose')?.addEventListener('click', closeApplyModal);
    document.getElementById('modalBackdrop')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeApplyModal();
    });

    // File upload in apply form
    const drop  = document.getElementById('applyFileDrop');
    const input = document.getElementById('applyFiles');
    const list  = document.getElementById('applyFileList');
    let files   = [];

    drop?.addEventListener('dragover',  e => { e.preventDefault(); drop.classList.add('dragover'); });
    drop?.addEventListener('dragleave', () => drop.classList.remove('dragover'));
    drop?.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); addFiles(Array.from(e.dataTransfer.files)); });
    input?.addEventListener('change', () => { addFiles(Array.from(input.files)); input.value = ''; });

    function addFiles(newFiles) {
      newFiles.forEach(f => { if (!files.find(sf => sf.name === f.name)) files.push(f); });
      renderList();
    }
    function renderList() {
      if (!list) return;
      list.innerHTML = '';
      files.forEach((f, i) => {
        const size = f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+' MB' : (f.size/1024).toFixed(0)+' KB';
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `<span class="file-item-name">${f.name}</span><span class="file-item-size">${size}</span><button class="file-remove" data-idx="${i}">&times;</button>`;
        list.appendChild(item);
      });
      list.querySelectorAll('.file-remove').forEach(btn =>
        btn.addEventListener('click', () => { files.splice(parseInt(btn.dataset.idx),1); renderList(); })
      );
    }

    document.getElementById('applyForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('applyName').value.trim();
      const email = document.getElementById('applyEmail').value.trim();
      const cover = document.getElementById('applyCover').value.trim();
      if (!name || !email || !cover) { alert('Please fill in all required fields.'); return; }
      // TO CONNECT: send to Formspree or your backend here
      document.getElementById('applyForm').style.display = 'none';
      document.getElementById('applySuccess').classList.add('show');
    });
  });
}
