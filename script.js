// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Highlight active section in both the header nav and the side progress rail
const sections = document.querySelectorAll("main section[id]");
const railLinks = document.querySelectorAll(".rail a");
const navLinks = document.querySelectorAll(".nav a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");

      railLinks.forEach((l) => l.classList.remove("active"));
      const railLink = document.querySelector(`.rail a[href="#${id}"]`);
      if (railLink) railLink.classList.add("active");

      navLinks.forEach((l) => l.classList.remove("active"));
      const navLink = document.querySelector(`.nav a[href="#${id}"]`);
      if (navLink) navLink.classList.add("active");
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));
