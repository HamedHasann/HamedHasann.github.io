// =========================================================
// Hamed Hasan — Portfolio
// Shared behaviour across all pages
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  markActiveNavLink();
  setupMobileNav();
  setupContactForm();
});

// Light/dark theme toggle. Defaults to the visitor's OS preference,
// then remembers whatever they pick via localStorage.
function setupTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  });
}

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

// Contact form: validates client-side, then submits to Formspree
// (https://formspree.io/f/mljeokpq) so messages are emailed directly.
function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const msg = form.querySelector(".form-msg");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    msg.classList.remove("success", "error");

    if (!name || !email || !message) {
      msg.textContent = "Please fill in every field before sending.";
      msg.classList.add("error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      msg.textContent = "That email address doesn't look right.";
      msg.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    msg.textContent = "Sending…";
    msg.classList.remove("success", "error");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        msg.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
        msg.classList.add("success");
        form.reset();
      } else {
        msg.textContent = "Something went wrong. Please email me directly at hamed2002273@gmail.com.";
        msg.classList.add("error");
      }
    } catch (err) {
      msg.textContent = "Something went wrong. Please email me directly at hamed2002273@gmail.com.";
      msg.classList.add("error");
    } finally {
      submitBtn.disabled = false;
    }
  });
}
