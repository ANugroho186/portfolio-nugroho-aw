// Navbar fixed
window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add('navbar-fixed');
    } else {
        header.classList.add("bg-transparent");
        header.classList.remove('navbar-fixed');

    }
});

// Hamburger menu
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');

hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');
});