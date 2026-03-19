gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=3000",
    scrub: 2,
    pin: true,
  },
});

/* PARTICLE PARALLAX */

tl.to(
  ".hero-bg",
  {
    y: -120,
    scale: 1.1,
    ease: "none",
    duration: 6,
  },
  0,
);

/* SLIDE 1 TEXT */

tl.to(
  ".s1",
  {
    y: 0,
    opacity: 1,
    stagger: 0.8,
    duration: 2,
    ease: "power3.out",
  },
  0.5,
);

/* FADE SLIDE 1 */

tl.to(
  ".slide1",
  {
    opacity: 0,
    duration: 1.5,
  },
  3,
);

/* DIAMOND APPEAR */

tl.to(
  ".diamond",
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 2,
    ease: "power3.out",
  },
  4,
);

/* SLIDE 2 TEXT */

tl.to(
  ".s2",
  {
    y: 0,
    opacity: 1,
    stagger: 0.8,
    duration: 2,
    ease: "power3.out",
  },
  4.6,
);
