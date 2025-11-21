// MOBILE MENU
const menuBtn = document.querySelector(".mobile-btn");
const mobileMenu = document.querySelector(".mobile-menu");
const closeBtn = document.querySelector(".close-mobile");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("show");
});

document.querySelectorAll(".m-link").forEach(link => {
    link.addEventListener("click", () => mobileMenu.classList.remove("show"));
});

// ACTIVE NAV ON SCROLL
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            navLinks.forEach(link => link.classList.remove("active"));
            document.querySelector(".nav a[href='#" + sec.id + "']").classList.add("active");
        }
    });
});

// FOOTER YEAR
document.getElementById("year").textContent = new Date().getFullYear();
