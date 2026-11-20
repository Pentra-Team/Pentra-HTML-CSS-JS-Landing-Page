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

// ---------- تبديل الرابط النشط + النقل للسيكشن ----------
const navLinks = document.querySelectorAll('.nav-link:not(.mobile-only)');
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
    closeMenu();

    const target = link.getAttribute('href');
    if (target && target.length > 1) {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
// ---------- 4) ظل خفيف للنافبار عند النزول ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 8);
});

// ---------- ظهور العناصر تدريجياً عند النزول ----------
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

// ---------- Journey: الشريط والبانر ----------
const STEPS = [
  { label: 'أنشئ حسابك',            desc: 'سجّل بياناتك الأساسية وفعّل حسابك بخطوات بسيطة.' },
  { label: 'اكتشف التخصص والدورة',  desc: 'تصفّح التخصصات واختر الدورة الأنسب لاهتمامك.' },
  { label: 'سجّل وأكمل الدفع',      desc: 'أكّد تسجيلك في الدورة وأتمم الدفع بأمان.' },
  { label: 'اختبر مستواك',          desc: 'أكمل اختبار التخصص الإلزامي قبل المحتوى.' },
  { label: 'ابدأ التعلم',           desc: 'ابدأ دروسك وفق المسار المناسب لمستواك.' },
  { label: 'تابع تقدمك',            desc: 'راقب إنجازك وتقدمك في كل وحدة بسهولة.' },
  { label: 'احصل على شهادتك',       desc: 'أنهِ المسار واحصل على شهادة توثّق إنجازك.' },
];

const stepperEl = document.getElementById('stepper');
const sbNum = document.getElementById('sbNum');
const sbText = document.getElementById('sbText');
const sbTitle = document.getElementById('sbTitle');
const sbDesc = document.getElementById('sbDesc');
const prevStep = document.getElementById('prevStep');
const nextStep = document.getElementById('nextStep');

let currentStep = 4;   // الخطوة الافتراضية زي التصميم

const pad = (n) => String(n).padStart(2, '0');
const CYAN = [34, 211, 238];
const BLUE = [88, 101, 242];
const mixColor = (t) =>
  `rgb(${CYAN.map((c, i) => Math.round(c + (BLUE[i] - c) * t)).join(',')})`;

const CHECK_SVG =
  '<svg class="step-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.3 8.3l3 2.9 6.4-6.4"/></svg>';

// بناء الخطوات
STEPS.forEach((step, i) => {
  const li = document.createElement('li');
  li.className = 'step';
  li.innerHTML = `
    <button type="button" class="step-btn" data-step="${i + 1}">
      <span class="step-dot">
        <span class="step-num">${pad(i + 1)}</span>
        ${CHECK_SVG}
      </span>
      <span class="step-label">${step.label}</span>
    </button>`;
  stepperEl.appendChild(li);
});
const stepEls = Array.from(stepperEl.children);

function updateJourney(animate) {
  const total = STEPS.length;
  const todoSegments = total - currentStep;   // عدد الخطوط الزرقاء

  stepEls.forEach((li, i) => {
    const n = i + 1;
    li.classList.toggle('is-done', n < currentStep);
    li.classList.toggle('is-current', n === currentStep);
    li.classList.toggle('seg-todo', n >= currentStep);   // الخط بين n و n+1

    if (n >= currentStep && todoSegments > 0) {
      const k = n - currentStep;
      li.style.setProperty('--c1', mixColor(k / todoSegments));
      li.style.setProperty('--c2', mixColor((k + 1) / todoSegments));
    }

    li.querySelector('.step-btn').setAttribute('aria-current', n === currentStep ? 'step' : 'false');
  });

  const step = STEPS[currentStep - 1];
  sbNum.textContent = pad(currentStep);
  sbTitle.textContent = step.label;
  sbDesc.textContent = step.desc;
  prevStep.disabled = currentStep === 1;
  nextStep.disabled = currentStep === total;

  if (animate) {
    [sbNum, sbText].forEach((el) => {
      el.classList.remove('swap');
      void el.offsetWidth;          // لإعادة تشغيل الحركة
      el.classList.add('swap');
    });
  }
}

stepperEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.step-btn');
  if (!btn) return;
  currentStep = Number(btn.dataset.step);
  updateJourney(true);
});

// بالـ RTL: الخطوات بتمشي من اليمين لليسار، فالسهم الأيسر = التالي
prevStep.addEventListener('click', () => {
  if (currentStep > 1) { currentStep--; updateJourney(true); }
});
nextStep.addEventListener('click', () => {
  if (currentStep < STEPS.length) { currentStep++; updateJourney(true); }
});

updateJourney(false);

// ---------- Paths: تكبير وتصغير المجسم حسب عرضه ----------
const pathsVisual = document.getElementById('pathsVisual');
const pathsStage = document.getElementById('pathsStage');
const PATHS_STAGE_WIDTH = 661.25;

function fitPathsStage() {
  pathsStage.style.transform = `scale(${pathsVisual.clientWidth / PATHS_STAGE_WIDTH})`;
}
fitPathsStage();
new ResizeObserver(fitPathsStage).observe(pathsVisual);

// ---------- About: تكبير وتصغير المجسم حسب عرضه ----------
const aboutVisual = document.getElementById('aboutVisual');
const aboutStage = document.getElementById('aboutStage');
const ABOUT_STAGE_WIDTH = 560;

function fitAboutStage() {
  aboutStage.style.transform = `scale(${aboutVisual.clientWidth / ABOUT_STAGE_WIDTH})`;
}
fitAboutStage();
new ResizeObserver(fitAboutStage).observe(aboutVisual);

// ---------- Contact: فحص النموذج ----------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const checks = {
  name:    (v) => v.trim().length >= 2,
  email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  message: (v) => v.trim().length >= 5,
};

function setInvalid(fieldName, invalid) {
  const field = contactForm.querySelector(`[data-field="${fieldName}"]`);
  if (field) field.classList.toggle('invalid', invalid);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formStatus.textContent = '';

  let valid = true;
  Object.keys(checks).forEach((name) => {
    const ok = checks[name](contactForm.elements[name].value);
    setInvalid(name, !ok);
    if (!ok) valid = false;
  });
  if (!valid) return;

  // مؤقتاً: ما في إرسال فعلي لأنو النموذج لسا مش مربوط بقناة تواصل رسمية.
  // لما تجهز القناة، ابعتي البيانات هون بـ fetch.
  const data = Object.fromEntries(new FormData(contactForm).entries());
  console.log('Contact form data:', data);

  formStatus.textContent = 'شكرًا لك! سنفعّل الإرسال فور ربط النموذج بقنوات التواصل الرسمية.';
  contactForm.reset();
});

// شيل علامة الخطأ أول ما المستخدم يكتب
contactForm.querySelectorAll('input, textarea').forEach((el) => {
  el.addEventListener('input', () => {
    const field = el.closest('.field');
    if (field) field.classList.remove('invalid');
  });
});


// ---------- Footer: العودة للأعلى ----------
document.getElementById('toTop').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});