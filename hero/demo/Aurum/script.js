/**
 * AURUM LUXURY REAL ESTATE — script.js
 * Clean, reliable reveal system with hero-first animation
 */

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────────────────
   1. HERO ENTRANCE — CSS animation only, no JS needed
      We drive hero reveals via CSS keyframes on load
───────────────────────────────────────────────────── */
function runHeroEntrance() {
  const heroReveals = qsa('.hero-content .reveal');
  heroReveals.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 1s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.18}s,
                           transform 1s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.18}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ─────────────────────────────────────────────────────
   2. SCROLL PROGRESS
───────────────────────────────────────────────────── */
const scrollBar = qs('#scrollProgress');
function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
}

/* ─────────────────────────────────────────────────────
   3. NAVBAR
───────────────────────────────────────────────────── */
const navbar = qs('#navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

/* ─────────────────────────────────────────────────────
   4. HAMBURGER
───────────────────────────────────────────────────── */
const hamburger = qs('#hamburger');
const navLinks  = qs('#navLinks');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
qsa('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────────────────
   5. SECTION SCROLL REVEALS
───────────────────────────────────────────────────── */
function prepareScrollReveal(selector, baseDelay, increment) {
  qsa(selector).forEach((el, i) => {
    el.dataset.revealDelay = baseDelay + i * increment;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${el.dataset.revealDelay}s,
                           transform 0.85s cubic-bezier(0.16,1,0.3,1) ${el.dataset.revealDelay}s`;
  });
}

prepareScrollReveal('.section-header .section-eyebrow', 0, 0.12);
prepareScrollReveal('.section-header .section-title', 0.08, 0.12);
prepareScrollReveal('.section-header .section-desc', 0.18, 0.12);
prepareScrollReveal('.property-card', 0, 0.08);
prepareScrollReveal('.collection-card', 0, 0.08);
prepareScrollReveal('.testimonial-card', 0, 0.1);
prepareScrollReveal('.gal-item', 0, 0.06);
prepareScrollReveal('.agent-card', 0, 0.1);
prepareScrollReveal('.pillar', 0, 0.12);
prepareScrollReveal('.about-body', 0, 0.1);
prepareScrollReveal('.contact-item', 0, 0.1);
prepareScrollReveal('.about-badge', 0.2, 0);
prepareScrollReveal('.cta-content .section-eyebrow, .cta-content h2, .cta-content p, .cta-content .btn', 0, 0.12);
prepareScrollReveal('.contact-info .section-eyebrow, .contact-info .section-title, .contact-info .contact-desc', 0, 0.1);
prepareScrollReveal('.form-group', 0, 0.06);

const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      scrollRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

qsa('[data-reveal-delay]').forEach(el => scrollRevealObserver.observe(el));

/* ─────────────────────────────────────────────────────
   6. PARALLAX
───────────────────────────────────────────────────── */
const heroImg = qs('.hero-img');
const ctaBg   = qs('.cta-bg');

function updateParallax() {
  const sy = window.scrollY;
  if (heroImg) {
    heroImg.style.transform = `scale(1.12) translateY(${sy * 0.08}px)`;
  }
  if (ctaBg) {
    const band = ctaBg.closest('.cta-band');
    if (band) {
      const rect = band.getBoundingClientRect();
      ctaBg.style.transform = `translateY(${rect.top * 0.12}px)`;
    }
  }
}

/* ─────────────────────────────────────────────────────
   7. STATS COUNTER
───────────────────────────────────────────────────── */
let statsAnimated = false;
function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  qsa('.stat-num').forEach(el => {
    const target  = parseInt(el.dataset.target, 10);
    const start   = performance.now();
    const dur     = 2000;
    const ease    = t => 1 - Math.pow(1 - t, 3);
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(ease(p) * target);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}

const statsBar = qs('.hero-stats');
if (statsBar) {
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { setTimeout(animateStats, 500); obs.disconnect(); }
  }, { threshold: 0.4 }).observe(statsBar);
}

/* ─────────────────────────────────────────────────────
   8. TESTIMONIAL CAROUSEL (mobile)
───────────────────────────────────────────────────── */
const dots             = qsa('.dot');
const testimonialCards = qsa('.testimonial-card');
let activeIdx          = 0;

function showCard(i) {
  if (window.innerWidth > 900) return;
  testimonialCards.forEach((c, j) => (c.style.display = j === i ? 'block' : 'none'));
  dots.forEach((d, j) => d.classList.toggle('active', j === i));
  activeIdx = i;
}
dots.forEach(d => d.addEventListener('click', () => showCard(+d.dataset.index)));
setInterval(() => {
  if (window.innerWidth <= 900) showCard((activeIdx + 1) % testimonialCards.length);
}, 5000);

/* ─────────────────────────────────────────────────────
   9. LIGHTBOX
───────────────────────────────────────────────────── */
const lightbox      = qs('#lightbox');
const lightboxImg   = qs('#lightboxImg');
const lightboxClose = qs('#lightboxClose');

qsa('.gal-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => (lightboxImg.src = ''), 400);
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => e.target === lightbox && closeLightbox());
document.addEventListener('keydown', e => e.key === 'Escape' && closeLightbox());

/* ─────────────────────────────────────────────────────
   10. CONTACT FORM
───────────────────────────────────────────────────── */
const contactForm = qs('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Enquiry Received ✓';
    btn.style.background = 'var(--gold-dark)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Private Enquiry';
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 4000);
  });
}

/* ─────────────────────────────────────────────────────
   11. COLLECTION CARD TILT
───────────────────────────────────────────────────── */
qsa('.collection-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / r.width;
    const dy = (e.clientY - (r.top  + r.height / 2)) / r.height;
    card.style.transform = `scale(1.025) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    card.style.transition = 'transform 0.1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
  });
});

/* ─────────────────────────────────────────────────────
   12. SCROLL LOOP
───────────────────────────────────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateNavbar();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) testimonialCards.forEach(c => (c.style.display = ''));
  else showCard(activeIdx);
});

/* ─────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────── */
function init() {
  updateNavbar();
  updateScrollProgress();
  runHeroEntrance();
  updateParallax();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
