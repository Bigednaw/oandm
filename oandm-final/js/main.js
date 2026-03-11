// ===========================
//  O&M PROFESSIONALS - JS
// ===========================
document.addEventListener('DOMContentLoaded', () => {

  // ---- YEAR ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- HAMBURGER ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

  // ---- SLIDER (home only) ----
  const slides   = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn  = document.getElementById('prevSlide');
  const nextBtn  = document.getElementById('nextSlide');
  if (slides.length) {
    let current = 0, autoTimer = null;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap?.appendChild(dot);
    });
    function goTo(idx) {
      slides[current].classList.remove('active');
      dotsWrap?.querySelectorAll('.dot')[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dotsWrap?.querySelectorAll('.dot')[current]?.classList.add('active');
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5500);
    }
    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    let touchStartX = 0;
    const sliderEl = document.getElementById('slider');
    sliderEl?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderEl?.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  // ---- FILE UPLOAD ----
  const fileDrop  = document.getElementById('fileDrop');
  const fileInput = document.getElementById('files');
  const fileList  = document.getElementById('fileList');
  let selectedFiles = [];
  if (fileDrop) {
    fileDrop.addEventListener('dragover', e => { e.preventDefault(); fileDrop.classList.add('dragover'); });
    fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('dragover'));
    fileDrop.addEventListener('drop', e => { e.preventDefault(); fileDrop.classList.remove('dragover'); addFiles(Array.from(e.dataTransfer.files)); });
    fileInput?.addEventListener('change', () => { addFiles(Array.from(fileInput.files)); fileInput.value = ''; });
  }
  function addFiles(newFiles) {
    newFiles.forEach(f => { if (!selectedFiles.find(sf => sf.name === f.name && sf.size === f.size)) selectedFiles.push(f); });
    renderFileList();
  }
  function renderFileList() {
    if (!fileList) return;
    fileList.innerHTML = '';
    selectedFiles.forEach((f, i) => {
      const size = f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+' MB' : (f.size/1024).toFixed(0)+' KB';
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `<span class="file-item-name">${f.name}</span><span class="file-item-size">${size}</span><button class="file-remove" data-idx="${i}">&times;</button>`;
      fileList.appendChild(item);
    });
    fileList.querySelectorAll('.file-remove').forEach(btn => btn.addEventListener('click', () => { selectedFiles.splice(parseInt(btn.dataset.idx),1); renderFileList(); }));
  }

  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name    = contactForm.querySelector('#name')?.value.trim();
    const email   = contactForm.querySelector('#email')?.value.trim();
    const message = contactForm.querySelector('#message')?.value.trim();
    if (!name || !email || !message) { alert('Please fill in all required fields.'); return; }
    // TO CONNECT A REAL BACKEND: replace below with a fetch() to Formspree or your API
    contactForm.style.display = 'none';
    formSuccess?.classList.add('show');
  });

  // ---- SCROLL ANIMATIONS ----
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-card, .project-card, .about-grid, .contact-wrap, .page-hero-inner').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

});
