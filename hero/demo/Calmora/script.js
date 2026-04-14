// ─── NAV BEHAVIOR ───────────────────────────────────────────
const nav = document.querySelector(".nav");
const philosophy = document.querySelector(".philosophy");

function updateNav() {
  const scrolled = window.scrollY > 40;
  const lightTrigger = philosophy ? philosophy.offsetTop - 100 : Infinity;
  const isLight = window.scrollY > lightTrigger;

  nav.classList.toggle("scrolled", scrolled);
}

window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

// ─── SCROLL REVEAL ──────────────────────────────────────────
const reveals = document.querySelectorAll(".reveal");

// Fallback: if IntersectionObserver never fires (e.g. hidden iframe),
// make everything visible after 2s
const fallbackTimer = setTimeout(() => {
  reveals.forEach((el) => el.classList.add("visible"));
}, 2000);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          clearTimeout(fallbackTimer);
          // small stagger based on position among siblings
          const siblings = [
            ...entry.target.parentElement.querySelectorAll(".reveal"),
          ];
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, idx * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
} else {
  // No IntersectionObserver support — show everything immediately
  reveals.forEach((el) => el.classList.add("visible"));
}

// ─── TESTIMONIAL CAROUSEL ───────────────────────────────────
const testimonials = document.querySelectorAll(".testimonial");
const dots = document.querySelectorAll(".dot");
let current = 0;
let autoTimer;

function goTo(index) {
  testimonials[current].classList.remove("active");
  dots[current].classList.remove("active");
  current = index;
  testimonials[current].classList.add("active");
  dots[current].classList.add("active");
}

function nextSlide() {
  goTo((current + 1) % testimonials.length);
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    clearInterval(autoTimer);
    goTo(parseInt(dot.dataset.index));
    autoTimer = setInterval(nextSlide, 5000);
  });
});

autoTimer = setInterval(nextSlide, 5000);

// ─── GALLERY PARALLAX ───────────────────────────────────────
const galleryItems = document.querySelectorAll(".gallery-item img");

window.addEventListener(
  "scroll",
  () => {
    galleryItems.forEach((img) => {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress =
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * 30;
        img.style.transform = `translateY(${offset}px) scale(1.08)`;
      }
    });
  },
  { passive: true },
);

// ─── SMOOTH SCROLL ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
