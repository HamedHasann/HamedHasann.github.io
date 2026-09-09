// =========================================================
// Hamed Hasan — Portfolio
// Shared behaviour across all pages
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  markActiveNavLink();
  setupMobileNav();
  setupContactForm();
});

// Highlight the nav link matching whichever section is in view (scrollspy),
// since this is now a single-page site with in-page anchors.
function markActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav a");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  setActive(sections[0].id);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Toggle the mobile menu open/closed
function setupMobileNav() {
  const btn = document.querySelector(".menu-btn");
  const menu = document.querySelector(".mobile-nav");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

// Front-end only contact form: validates and shows a confirmation message.
// Replace this handler with a real submission (e.g. Formspree, EmailJS,
// or your own backend) when you're ready to receive messages.
function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const msg = form.querySelector(".form-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      msg.textContent = "Please fill in every field before sending.";
      msg.classList.remove("success");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      msg.textContent = "That email address doesn't look right.";
      msg.classList.remove("success");
      return;
    }

    // No backend is wired up yet — this only confirms the form works.
    msg.textContent = "Message ready to send — connect a form backend (see comment in script.js) to deliver it.";
    msg.classList.add("success");
    form.reset();
  });
}
