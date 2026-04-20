// Nav scroll effect
window.addEventListener("scroll", () => {
  document
    .getElementById("mainNav")
    .classList.toggle("scrolled", window.scrollY > 20);
});

// Mobile menu
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

// Scroll animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".fade-in, .fade-in-left")
  .forEach((el) => observer.observe(el));

// Slider
let currentSlide = 0;
function getVisible() {
  if (window.innerWidth < 480) return 1.2;
  if (window.innerWidth < 768) return 2;
  if (window.innerWidth < 1024) return 3;
  return 4;
}
function slide(dir) {
  const track = document.getElementById("sliderTrack");
  const cards = track.querySelectorAll(".slide-card");
  const visible = getVisible();
  const maxSlide = Math.ceil(cards.length - Math.floor(visible));
  currentSlide = Math.max(0, Math.min(currentSlide + dir, maxSlide));
  const cardW = track.querySelector(".slide-card").offsetWidth + 1.5;
  track.style.transform = `translateX(-${currentSlide * cardW}px)`;
}
window.addEventListener("resize", () => {
  currentSlide = 0;
  slide(0);
});

// Trigger hero fades immediately
document.querySelectorAll(".hero .fade-in").forEach((el, i) => {
  setTimeout(() => el.classList.add("visible"), i * 120 + 200);
});
