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

// ============================================================
// Glitch foto profil: pemisahan kanal RGB + sobekan horizontal
// Durasi 1,5 detik | tiap ~3 detik | nilai diacak ulang tiap 110 ms
// ============================================================
(function () {
    var foto = document.querySelector('.cp-face');
    if (!foto) return;
    var gambar = foto.querySelector('img');
    if (!gambar) return;
    // URL dari <img> sudah absolut, jadi bebas dari masalah path relatif
    var sumber = 'url("' + (gambar.currentSrc || gambar.src) + '")';
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var DURASI = 1500;   // lama satu glitch (ms)
    var JEDA = 3000;     // jarak antar glitch (ms)
    var LANGKAH = 110;   // seberapa sering nilai diacak saat glitch

    function acak(a, b) { return Math.random() * (b - a) + a; }

    // --- bangun lapisan lewat JS, supaya kalau JS mati HTML tetap bersih ---
    // 2 lapisan pemisah kanal warna (memecah SELURUH isi gambar)
    var kanal = ['url(#cp-chan-r)', 'url(#cp-chan-gb)'].map(function (f) {
        var el = document.createElement('span');
        el.className = 'cp-face__ghost';
        el.style.backgroundImage = sumber;
        el.style.filter = f;
        el.style.mixBlendMode = 'screen';
        foto.appendChild(el);
        return el;
    });

    // 3 lapisan potongan horizontal yang tergeser (efek layar sobek)
    var sobek = [0, 1, 2].map(function () {
        var el = document.createElement('span');
        el.className = 'cp-face__ghost';
        el.style.backgroundImage = sumber;
        foto.appendChild(el);
        return el;
    });

    var statis = document.createElement('span');
    statis.className = 'cp-face__noise';
    statis.style.webkitMaskImage = sumber;
    statis.style.maskImage = sumber;
    foto.appendChild(statis);

    function acakkan() {
        // pemisahan kanal: merah ke satu arah, cyan ke arah berlawanan
        var d = acak(3, 11);
        kanal[0].style.transform = 'translate(' + (-d).toFixed(1) + 'px,' + acak(-2, 2).toFixed(1) + 'px)';
        kanal[1].style.transform = 'translate(' + d.toFixed(1) + 'px,' + acak(-2, 2).toFixed(1) + 'px)';
        kanal[0].style.opacity = kanal[1].style.opacity = acak(0.30, 0.60).toFixed(2);

        // potongan horizontal acak: posisi, tebal, dan jarak geser
        sobek.forEach(function (el) {
            if (Math.random() < 0.25) { el.style.opacity = 0; return; }  // kadang tidak muncul
            var atas = acak(2, 78);
            var tebal = acak(4, 18);
            el.style.clipPath = 'inset(' + atas.toFixed(1) + '% 0 ' +
                Math.max(0, 100 - atas - tebal).toFixed(1) + '% 0)';
            el.style.transform = 'translateX(' + acak(-28, 28).toFixed(1) + 'px)';
            el.style.opacity = acak(0.55, 0.85).toFixed(2);
        });

        statis.style.opacity = acak(0.15, 0.4).toFixed(2);
    }

    function bersihkan() {
        kanal.concat(sobek).forEach(function (el) {
            el.style.opacity = 0;
            el.style.transform = 'none';
            el.style.clipPath = 'none';
        });
        statis.style.opacity = 0;
    }

    function mulai() {
        acakkan();
        var jitter = setInterval(acakkan, LANGKAH);
        setTimeout(function () { clearInterval(jitter); bersihkan(); }, DURASI);
    }

    (function jadwalkan() {
        setTimeout(function () { mulai(); jadwalkan(); }, JEDA + acak(-600, 600));
    })();
})();
