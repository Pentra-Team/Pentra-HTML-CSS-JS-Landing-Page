// ---------- 1) تصغير لوحة الهيرو تلقائياً لو الشاشة أصغر من 1440 ----------
const hero = document.getElementById('hero');
const heroInner = document.getElementById('heroInner');
const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 800;

function fitHero() {
  const scale = Math.min(1, document.documentElement.clientWidth / DESIGN_WIDTH);
  heroInner.style.transform = `scale(${scale})`;
  hero.style.height = `${DESIGN_HEIGHT * scale}px`;
}
fitHero();
window.addEventListener('resize', fitHero);

// ---------- 2) تبديل الرابط النشط بالنافبار ----------
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// ---------- 3) ظل خفيف للنافبار عند النزول ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 8);
});