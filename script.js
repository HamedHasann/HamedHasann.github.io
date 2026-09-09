// =========================================================
// Hamed Hasan — Portfolio
// Shared behaviour across all pages
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  markActiveNavLink();
  setupMobileNav();
  setupContactForm();
});

// Highlight the current page in both the sidebar and mobile nav
function markActiveNavLink() {
  const current = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
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
