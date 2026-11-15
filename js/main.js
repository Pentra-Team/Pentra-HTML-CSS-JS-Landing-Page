// ---------- 1) تكبير وتصغير المجسم حسب عرضه ----------
const visual = document.getElementById('visual');
const stage = document.getElementById('stage');
const STAGE_WIDTH = 600;

function fitStage() {
  stage.style.transform = `scale(${visual.clientWidth / STAGE_WIDTH})`;
}
fitStage();
new ResizeObserver(fitStage).observe(visual);

// ---------- 2) قائمة الموبايل ----------
const menuBtn = document.getElementById('menuBtn');
const navLinksBox = document.getElementById('navLinks');

function closeMenu() {
  navLinksBox.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  const isOpen = navLinksBox.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

window.addEventListener('resize', () => {
  if (document.documentElement.clientWidth > 1023) closeMenu();
});

// ---------- 3) تبديل الرابط النشط ----------
const navLinks = document.querySelectorAll('.nav-link:not(.mobile-only)');
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
    closeMenu();
  });
});

// ---------- 4) ظل خفيف للنافبار عند النزول ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 8);
});