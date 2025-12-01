const body = document.body;
const toggle = document.getElementById('themeToggle');
const navToggle = document.getElementById('navToggle');
const navRail = document.getElementById('primaryNav');
const navLinks = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function setTheme(mode) {
  const isLight = mode === 'light';

  body.classList.toggle('theme-light', isLight);
  body.classList.toggle('theme-dark', !isLight);
  document.documentElement.classList.toggle('light', isLight);

  if (toggle) {
    toggle.textContent = isLight ? 'Dark mode' : 'Light mode';
  }

  localStorage.setItem('theme', mode);
}

const saved = localStorage.getItem('theme');
setTheme(saved || 'dark');

if (toggle) {
  toggle.addEventListener('click', () => {
    const current = body.classList.contains('theme-light') ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  });
}

// simple focus style support for keyboard navigation
function handleFirstTab(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
  }
}
window.addEventListener('keydown', handleFirstTab);

// mobile nav toggle
if (navToggle && navRail) {
  navToggle.addEventListener('click', () => {
    const isOpen = navRail.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navRail.classList.contains('open')) {
        navRail.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// contact form validation & mock submission
function setStatus(message, type = 'info') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`.trim();
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!contactForm) return;

  const data = new FormData(contactForm);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const message = (data.get('message') || '').toString().trim();

  if (!name || !email || !message) {
    setStatus('Please fill out all fields before sending.', 'error');
    return;
  }

  setStatus('Sending...', 'info');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus('Message queued! Paulo will reply via email soon.', 'success');
    contactForm.reset();
  } catch (err) {
    console.error(err);
    setStatus('Something went wrong. Please try again or use the email button.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send';
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', handleSubmit);
}

// section observer for active nav link feedback
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => observer.observe(section));
