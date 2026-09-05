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
// ============================================================
// Animasi muncul saat scroll (IntersectionObserver, tanpa library)
// ============================================================
(function () {
    var root = document.documentElement;
    var els = document.querySelectorAll('.cp-reveal');

    // Kalau browser tidak mendukung, atau pengguna minta kurangi animasi:
    // batalkan penyembunyian supaya konten tetap terlihat penuh.
    var kurangiGerak = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window) || kurangiGerak || !els.length) {
        root.classList.remove('cp-reveal-on');
        return;
    }

    // Beri jeda bertahap untuk elemen bersaudara (kartu muncul berurutan)
    var hitung = {};
    els.forEach(function (el) {
        var kunci = el.parentElement ? el.parentElement.className : 'x';
        hitung[kunci] = (hitung[kunci] || 0) + 1;
        var urutan = hitung[kunci] - 1;
        if (urutan > 0) el.style.transitionDelay = (urutan * 90) + 'ms';
    });

    var pengamat = new IntersectionObserver(function (entri) {
        entri.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('cp-in');
                pengamat.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { pengamat.observe(el); });

    // Jaring pengaman: kalau setelah 4 detik masih ada elemen yang sudah
    // berada di dalam layar tapi belum muncul, tampilkan paksa.
    setTimeout(function () {
        document.querySelectorAll('.cp-reveal:not(.cp-in)').forEach(function (el) {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('cp-in');
            }
        });
    }, 4000);
})();
