/* =============================================
   AURUM — Residences of Distinction
   main.js
   ============================================= */

(function () {
  "use strict";

  /* ── CUSTOM CURSOR ───────────────────────── */
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function animCursor() {
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animCursor);
  })();

  /* ── NAVIGATION SCROLL STATE ─────────────── */
  const nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── HERO KEN-BURNS ONLY (no parallax) ──── */
  const heroBg = document.getElementById("heroBg");
  window.addEventListener("load", () => {
    if (heroBg) heroBg.classList.add("loaded");
  });

  /* ── SCROLL REVEAL ───────────────────────── */
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 },
  );
  reveals.forEach((el) => revealObserver.observe(el));

  /* ── BROWSE FILTERS ──────────────────────── */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const browseCards = document.querySelectorAll(".browse-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      browseCards.forEach((card) => {
        const match = filter === "all" || card.dataset.type === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });

  /* ── TESTIMONIAL ROTATOR ─────────────────── */
  const testimonials = [
    {
      quote:
        "\"Moving into The Meridian didn't feel like buying a home. It felt like arriving at a version of ourselves we'd been working towards for years.\"",
      author: "Arjun & Meera Raghunathan",
      role: "The Meridian, Whitefield · 2023",
    },
    {
      quote:
        "\"Aurum's attention to what is left out is as impressive as what they include. Our home breathes. That's rare.\"",
      author: "Vikram Seshadri",
      role: "Halcyon Grove, Sarjapur · 2022",
    },
    {
      quote:
        '"Not once did we feel like customers. Every conversation was about what we actually needed, not what was available."',
      author: "Priya & Kiran Nambiar",
      role: "Atelier Sky, Indiranagar · 2024",
    },
  ];

  const tqEl = document.getElementById("testiQuote");
  const taEl = document.getElementById("testiAuthor");
  const trEl = document.getElementById("testiRole");
  const dotEls = document.querySelectorAll(".testi-dot");
  let currentTesti = 0;
  let testiTimer;

  function showTesti(i) {
    currentTesti = i;

    // Fade out
    [tqEl, taEl, trEl].forEach((el) => {
      el.style.opacity = "0";
    });

    setTimeout(() => {
      tqEl.textContent = testimonials[i].quote;
      taEl.textContent = testimonials[i].author;
      trEl.textContent = testimonials[i].role;
      // Fade in
      [tqEl, taEl, trEl].forEach((el) => {
        el.style.opacity = "1";
      });
    }, 350);

    dotEls.forEach((d, j) => d.classList.toggle("active", j === i));
  }

  function nextTesti() {
    showTesti((currentTesti + 1) % testimonials.length);
  }

  function resetTimer() {
    clearInterval(testiTimer);
    testiTimer = setInterval(nextTesti, 5500);
  }

  dotEls.forEach((dot) => {
    dot.addEventListener("click", () => {
      showTesti(Number(dot.dataset.i));
      resetTimer();
    });
  });

  resetTimer();

  /* ── CTA FORM (basic feedback) ───────────── */
  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".cta-input, .cta-select");
      let allFilled = true;
      inputs.forEach((inp) => {
        if (!inp.value.trim()) {
          inp.style.borderColor = "rgba(200,100,80,0.6)";
          allFilled = false;
        } else {
          inp.style.borderColor = "";
        }
      });
      if (allFilled) {
        ctaBtn.textContent = "Request Received — We'll be in touch.";
        ctaBtn.style.background = "rgba(200,169,126,0.4)";
        ctaBtn.disabled = true;
      }
    });
  }
})();
