const nav = document.querySelector(".nav");
const philosophy = document.querySelector(".philosophy");

window.addEventListener("scroll", () => {
  const trigger = philosophy.offsetTop - 100;

  if (window.scrollY > trigger) {
    nav.classList.add("light");
  } else {
    nav.classList.remove("light");
  }

  nav.classList.toggle("scrolled", window.scrollY > 40);
});
