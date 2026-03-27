/**
 * ════════════════════════════════════════════════════════════════
 * LUMIÈRE SPA — script.js
 * All interactions: navbar, hero, scroll reveal, parallax,
 * gallery/lightbox, booking form, hamburger menu
 * ════════════════════════════════════════════════════════════════
 */

"use strict";

/* ─────────────────────────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────────────────────────────
   1. SCROLL PROGRESS INDICATOR
───────────────────────────────────────────────────────────────── */
const scrollBar = $("#scrollProgress");

function updateScrollProgress() {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
  scrollBar.style.width = `${pct}%`;
}

/* ─────────────────────────────────────────────────────────────────
   2. NAVBAR — transparent → scrolled (glassmorphism)
───────────────────────────────────────────────────────────────── */
const navbar = $("#navbar");
const SCROLL_THRESHOLD = 60;

function updateNavbar() {
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/* ─────────────────────────────────────────────────────────────────
   3. HAMBURGER MENU
───────────────────────────────────────────────────────────────── */
const hamburger = $("#hamburger");
const navLinks = $("#navLinks");

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("active");
  hamburger.setAttribute("aria-expanded", isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? "hidden" : "";
});

// Close menu when a link is clicked
$$(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    document.body.style.overflow = "";
  });
});

/* ─────────────────────────────────────────────────────────────────
   4. HERO IMAGE — Ken Burns / parallax on scroll
───────────────────────────────────────────────────────────────── */
const heroBg = $("#heroBg");
const heroImg = heroBg ? heroBg.querySelector(".hero-img") : null;

// Trigger ken-burns after load
if (heroImg) {
  if (heroImg.complete) {
    heroImg.classList.add("loaded");
  } else {
    heroImg.addEventListener("load", () => heroImg.classList.add("loaded"));
  }
}

// Parallax: shift hero background on scroll
function parallaxHero() {
  if (!heroBg) return;
  const scrolled = window.scrollY;
  const heroH = heroBg.offsetHeight;
  if (scrolled < heroH) {
    const shift = scrolled * 0.2;
    heroBg.style.transform = `translateY(${shift}px)`;
  }
}

/* ─────────────────────────────────────────────────────────────────
   5. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────────────────────────────── */
const revealEls = $$(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Don't unobserve — keeps the element visible
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  },
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ─────────────────────────────────────────────────────────────────
   6. GALLERY LIGHTBOX
───────────────────────────────────────────────────────────────── */
const lightbox = $("#lightbox");
const lbImg = $("#lbImg");
const lbClose = $("#lbClose");
const lbPrev = $("#lbPrev");
const lbNext = $("#lbNext");
const galleryItems = $$(".gallery-item");

let currentIndex = 0;
const galleryImages = galleryItems
  .map((item) => item.getAttribute("data-src"))
  .filter(Boolean);

function openLightbox(index) {
  currentIndex = index;
  lbImg.src = galleryImages[currentIndex];
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  // Delay clearing src for smooth fade-out
  setTimeout(() => {
    if (!lightbox.classList.contains("active")) lbImg.src = "";
  }, 400);
}

function showPrev() {
  currentIndex =
    (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lbImg.style.opacity = "0";
  setTimeout(() => {
    lbImg.src = galleryImages[currentIndex];
    lbImg.style.opacity = "1";
  }, 200);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lbImg.style.opacity = "0";
  setTimeout(() => {
    lbImg.src = galleryImages[currentIndex];
    lbImg.style.opacity = "1";
  }, 200);
}

// Set up gallery click listeners
galleryItems.forEach((item, i) => {
  item.addEventListener("click", () => openLightbox(i));
});

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  showPrev();
});
lbNext.addEventListener("click", (e) => {
  e.stopPropagation();
  showNext();
});

// Close on backdrop click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

// Smooth lightbox image transition
if (lbImg) {
  lbImg.style.transition = "opacity 0.2s ease";
}

/* ─────────────────────────────────────────────────────────────────
   7. BOOKING FORM
───────────────────────────────────────────────────────────────── */
const bookingForm = $("#bookingForm");
const bookingSuccess = $("#bookingSuccess");

if (bookingForm) {
  // Set date input min to today
  const dateInput = $("#date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = bookingForm.querySelector(".btn-primary");
    const btnText = btn.querySelector(".btn-text");
    const originalText = btnText.textContent;

    // Validate
    const required = bookingForm.querySelectorAll("[required]");
    let valid = true;
    required.forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = "rgba(200, 122, 107, 0.6)";
        setTimeout(() => (field.style.borderColor = ""), 2500);
      }
    });
    if (!valid) return;

    // Loading state
    btn.disabled = true;
    btnText.textContent = "Processing…";

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));

    // Show success
    bookingForm.style.opacity = "0";
    bookingForm.style.transform = "translateY(10px)";
    bookingForm.style.transition = "all 0.4s ease";

    setTimeout(() => {
      bookingForm.style.display = "none";
      bookingSuccess.classList.add("show");
      bookingSuccess.style.opacity = "0";
      bookingSuccess.style.transform = "translateY(10px)";
      bookingSuccess.style.transition = "all 0.5s ease";
      setTimeout(() => {
        bookingSuccess.style.opacity = "1";
        bookingSuccess.style.transform = "translateY(0)";
      }, 50);
    }, 400);
  });

  // Live validation feedback
  bookingForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      field.style.borderColor = "";
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   8. LAZY LOADING — native + fallback
───────────────────────────────────────────────────────────────── */
if ("IntersectionObserver" in window) {
  const lazyImages = $$('img[loading="lazy"]');
  // Native lazy loading is set via HTML attribute; this is additional insurance
  const imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // If native lazy loading hasn't fired, nudge it
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imgObserver.unobserve(img);
        }
      });
    },
    { rootMargin: "200px" },
  );

  lazyImages.forEach((img) => imgObserver.observe(img));
}

/* ─────────────────────────────────────────────────────────────────
   9. SMOOTH SCROLL for internal anchors
───────────────────────────────────────────────────────────────── */
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ─────────────────────────────────────────────────────────────────
   10. STATS — count-up animation
───────────────────────────────────────────────────────────────── */
function animateCountUp(el, target, suffix, duration = 1800) {
  const isFloat = target % 1 !== 0;
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isFloat
      ? current.toFixed(1) + suffix
      : Math.floor(current) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statsSection = $(".stats-band");
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        const statNums = $$(".stat-number");
        const data = [
          { val: 15, suffix: "+" },
          { val: 40, suffix: "K+" },
          { val: 28, suffix: "" },
          { val: 98, suffix: "%" },
        ];
        statNums.forEach((el, i) => {
          const d = data[i];
          if (d) setTimeout(() => animateCountUp(el, d.val, d.suffix), i * 120);
        });
      }
    });
  },
  { threshold: 0.4 },
);

if (statsSection) statsObserver.observe(statsSection);

/* ─────────────────────────────────────────────────────────────────
   11. MAIN SCROLL HANDLER (batched / rAF throttled)
───────────────────────────────────────────────────────────────── */
let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateNavbar();
      parallaxHero();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });

/* ─────────────────────────────────────────────────────────────────
   12. INIT
───────────────────────────────────────────────────────────────── */
(function init() {
  // Run on load to set correct initial states
  updateNavbar();
  updateScrollProgress();

  // Accessibility: set correct aria-expanded
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-controls", "navLinks");
})();

/* ─────────────────────────────────────────────────────────────────
   13. TOUCH SWIPE for lightbox
───────────────────────────────────────────────────────────────── */
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

lightbox.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showNext() : showPrev();
    }
  },
  { passive: true },
);

/* ─────────────────────────────────────────────────────────────────
   14. CTA BUTTON — subtle glow pulse
───────────────────────────────────────────────────────────────── */
$$(".btn-primary").forEach((btn) => {
  // Add ripple effect on click
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transform: scale(0);
      animation: rippleAnim 0.6s linear;
      pointer-events: none;
    `;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    btn.appendChild(ripple);

    if (!document.querySelector("#rippleStyle")) {
      const style = document.createElement("style");
      style.id = "rippleStyle";
      style.textContent = `@keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }`;
      document.head.appendChild(style);
    }

    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

/* ─────────────────────────────────────────────────────────────────
   15. CARD TILT micro-interaction (service cards)
───────────────────────────────────────────────────────────────── */
$$(".service-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const maxTilt = 5;
    card.style.transform = `translateY(-8px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
    card.style.transition = "transform 0.1s ease";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition =
      "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  });
});
