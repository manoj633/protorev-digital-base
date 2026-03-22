/**
 * AURUM LUXURY REAL ESTATE — script.js
 * Handles: Navbar, Ken Burns, Parallax, Scroll Reveal,
 *          Stats Counter, Testimonial Carousel, Lightbox,
 *          Contact Form, Scroll Progress, Hamburger Menu
 */

/* ──────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ──────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
────────────────────────────────────────────────────── */
const scrollBar = qs('#scrollProgress');
function updateScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollBar.style.width = `${progress}%`;
}

/* ──────────────────────────────────────────────────────
   NAVBAR — transparent → scrolled
────────────────────────────────────────────────────── */
const navbar = qs('#navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

/* ──────────────────────────────────────────────────────
   HAMBURGER MENU
────────────────────────────────────────────────────── */
const hamburger = qs('#hamburger');
const navLinks  = qs('#navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click
qsa('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ──────────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // For section children that are not pre-tagged
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

// Tag pre-marked reveals
qsa('.reveal').forEach(el => revealObserver.observe(el));

// Auto-observe section children
const autoRevealSections = qsa(
  '.properties-section, .about-section, .collections-section, ' +
  '.testimonials-section, .gallery-section, .agents-section, .contact-section'
);

autoRevealSections.forEach(section => {
  qsa('.property-card, .collection-card, .testimonial-card, .gal-item, .agent-card, .pillar, .contact-item, .stat', section)
    .forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(36px)';
      el.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s`;
      revealObserver.observe(el);
    });
});

// Generic reveal for any section header children
qsa('.section-header, .about-content, .cta-content, .contact-info, .contact-form').forEach(el => {
  qsa('.section-eyebrow, .section-title, .section-desc, .about-body, h2, p, .btn', el).forEach((child, i) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(24px)';
    child.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
    revealObserver.observe(child);
  });
});

// Override IntersectionObserver callback to also handle opacity/transform reset
const masterRevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('visible');
        masterRevealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Apply to everything with inline opacity: 0
document.querySelectorAll('[style*="opacity: 0"]').forEach(el => {
  masterRevealObserver.observe(el);
});
// Also cover class-based reveals
qsa('.reveal').forEach(el => masterRevealObserver.observe(el));

/* ──────────────────────────────────────────────────────
   HERO PARALLAX
────────────────────────────────────────────────────── */
const heroBg = qs('#heroBg');
function updateParallax() {
  if (!heroBg) return;
  const scrolled = window.scrollY;
  heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
}

/* ──────────────────────────────────────────────────────
   CTA BAND PARALLAX
────────────────────────────────────────────────────── */
const ctaBg = qs('.cta-bg');
function updateCtaParallax() {
  if (!ctaBg) return;
  const band = ctaBg.closest('.cta-band');
  if (!band) return;
  const rect   = band.getBoundingClientRect();
  const center = rect.top + rect.height / 2 - window.innerHeight / 2;
  ctaBg.style.transform = `translateY(${center * 0.2}px)`;
}

/* ──────────────────────────────────────────────────────
   STATS COUNTER ANIMATION
────────────────────────────────────────────────────── */
let statsAnimated = false;
const statNums = qsa('.stat-num');

function animateStats() {
  if (statsAnimated) return;
  const heroStats = qs('.hero-stats');
  if (!heroStats) return;
  const rect = heroStats.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    statsAnimated = true;
    statNums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3); // ease out cubic

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(ease(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
}

/* ──────────────────────────────────────────────────────
   TESTIMONIAL CAROUSEL (mobile)
────────────────────────────────────────────────────── */
const testimonialsTrack = qs('#testimonialsTrack');
const dots = qsa('.dot');
let activeTestimonial = 0;
const testimonialCards = qsa('.testimonial-card');

function showTestimonial(index) {
  if (window.innerWidth > 900) return; // desktop shows all
  testimonialCards.forEach((c, i) => {
    c.style.display = i === index ? 'block' : 'none';
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  activeTestimonial = index;
}

dots.forEach(dot => {
  dot.addEventListener('click', () => showTestimonial(parseInt(dot.dataset.index, 10)));
});

// Auto-rotate on mobile
let testimonialInterval = setInterval(() => {
  if (window.innerWidth <= 900) {
    showTestimonial((activeTestimonial + 1) % testimonialCards.length);
  }
}, 5000);

/* ──────────────────────────────────────────────────────
   LIGHTBOX
────────────────────────────────────────────────────── */
const lightbox     = qs('#lightbox');
const lightboxImg  = qs('#lightboxImg');
const lightboxClose = qs('#lightboxClose');

qsa('.gal-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.dataset.src;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ──────────────────────────────────────────────────────
   CONTACT FORM
────────────────────────────────────────────────────── */
const contactForm = qs('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enquiry Received ✓';
    btn.style.background = 'var(--gold-dark)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 4000);
  });
}

/* ──────────────────────────────────────────────────────
   LAZY LOADING — native + Intersection fallback
────────────────────────────────────────────────────── */
if ('IntersectionObserver' in window) {
  const lazyImgs = qsa('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });
  lazyImgs.forEach(img => imgObserver.observe(img));
}

/* ──────────────────────────────────────────────────────
   PROPERTY CARD — shimmer glow on hover
────────────────────────────────────────────────────── */
qsa('.property-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

/* ──────────────────────────────────────────────────────
   COLLECTION CARDS — subtle depth tilt
────────────────────────────────────────────────────── */
qsa('.collection-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / rect.width * 2;
    const dy   = (e.clientY - cy) / rect.height * 2;
    card.style.transform = `scale(1.02) rotateY(${dx * 3}deg) rotateX(${-dy * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
  });
});

/* ──────────────────────────────────────────────────────
   SCROLL EVENT (throttled via rAF)
────────────────────────────────────────────────────── */
let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateNavbar();
      updateParallax();
      updateCtaParallax();
      animateStats();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ──────────────────────────────────────────────────────
   RESIZE
────────────────────────────────────────────────────── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    // Reset mobile testimonial display
    testimonialCards.forEach(c => c.style.display = '');
  } else {
    showTestimonial(activeTestimonial);
  }
});

/* ──────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────── */
(function init() {
  updateNavbar();
  updateScrollProgress();
  // Trigger first-pass reveals
  masterRevealObserver.takeRecords?.();
})();
