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
        window.cpRevealAmati = function () {};   // versi kosong, aman dipanggil
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

    // Elemen yang dibuat JavaScript SETELAH ini (misalnya kartu sertifikat)
    // tidak ikut terdaftar di atas. Fungsi ini dipakai untuk mendaftarkannya,
    // kalau tidak, elemen itu akan tersembunyi permanen di opacity 0.
    window.cpRevealAmati = function (baru) {
        Array.prototype.forEach.call(baru, function (el, i) {
            if (i > 0) el.style.transitionDelay = (i * 90) + 'ms';
            pengamat.observe(el);
        });
    };

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

// ============================================================
// SECTION SERTIFIKAT
//
// >>> CARA MENAMBAH SERTIFIKAT BARU <<<
// 1. Simpan gambarnya dua ukuran:
//      src/img/cert/thumb/<nama-file>.jpg   (lebar 600 px, untuk kartu)
//      src/img/cert/full/<nama-file>.jpg    (lebar 1500 px, untuk perbesar)
// 2. Salin satu blok { ... } di bawah, letakkan di mana saja dalam daftar.
//    Urutannya diatur otomatis dari tanggal terbaru, jadi tidak perlu
//    dipindah-pindah sendiri.
// 3. Simpan file ini. Selesai - tidak perlu menyentuh index.html.
//
// Keterangan kolom:
//    berkas   : nama file tanpa .jpg (harus sama di folder thumb dan full)
//    judul    : nama sertifikatnya
//    penerbit : lembaga yang mengeluarkan
//    tanggal  : format YYYY-MM-DD (dipakai untuk mengurutkan)
//    kategori : bebas, misalnya Akademik / Profesi / Kursus
// ============================================================
var DAFTAR_SERTIFIKAT = [
    {
        berkas: 'hackerrank-swe-2026',
        judul: 'Software Engineer',
        penerbit: 'HackerRank',
        tanggal: '2026-07-01',
        kategori: 'Profesi'
    },
    {
        berkas: 'bnsp-swe-2026',
        judul: 'Sertifikat Kompetensi - Perekayasa Perangkat Lunak',
        penerbit: 'BNSP - LSP Universitas Mercu Buana',
        tanggal: '2026-01-07',
        kategori: 'Profesi'
    },
    {
        berkas: 'udemy-feature-eng-2025',
        judul: 'Feature Engineering For Machine Learning 101',
        penerbit: 'Udemy',
        tanggal: '2025-11-22',
        kategori: 'Kursus'
    },
    {
        berkas: 'phkm-inotech-2025',
        judul: 'Peserta PHKM - INOTECH 40',
        penerbit: 'Fakultas Ilmu Komputer, Universitas Mercu Buana',
        tanggal: '2025-07-18',
        kategori: 'Akademik'
    },
    {
        berkas: 'pkm-umb-2025',
        judul: 'Lolos Seleksi Internal PKM 2025',
        penerbit: 'Universitas Mercu Buana',
        tanggal: '2025-02-26',
        kategori: 'Akademik'
    },
    {
        berkas: 'hackerrank-react-2024',
        judul: 'Frontend Developer (React)',
        penerbit: 'HackerRank',
        tanggal: '2024-10-19',
        kategori: 'Profesi'
    },
    {
        berkas: 'cisco-ccna-2023',
        judul: 'CCNAv7: Introduction to Networks',
        penerbit: 'Cisco Networking Academy',
        tanggal: '2023-07-10',
        kategori: 'Kursus'
    }
];

(function () {
    var wadah = document.querySelector('#cert-grid');
    if (!wadah) return;

    var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    function tanggalTampil(iso) {
        var p = iso.split('-');
        return parseInt(p[2], 10) + ' ' + BULAN[parseInt(p[1], 10) - 1] + ' ' + p[0];
    }

    function amankan(t) {
        return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // urutkan dari yang terbaru
    var daftar = DAFTAR_SERTIFIKAT.slice().sort(function (a, b) {
        return b.tanggal.localeCompare(a.tanggal);
    });

    wadah.innerHTML = daftar.map(function (s) {
        return '<div class="cert-item cp-reveal">' +
               '<button type="button" class="cert-card"' +
               ' data-full="src/img/cert/full/' + amankan(s.berkas) + '.jpg"' +
               ' data-judul="' + amankan(s.judul) + '"' +
               ' data-penerbit="' + amankan(s.penerbit) + '"' +
               ' data-tanggal="' + amankan(tanggalTampil(s.tanggal)) + '">' +
                 '<span class="cert-card__shot">' +
                   '<span class="cert-card__tag">' + amankan(s.kategori) + '</span>' +
                   '<img src="src/img/cert/thumb/' + amankan(s.berkas) + '.jpg" loading="lazy"' +
                   ' alt="Sertifikat ' + amankan(s.judul) + ' dari ' + amankan(s.penerbit) + '">' +
                 '</span>' +
                 '<span class="cert-card__body">' +
                   '<span class="cert-card__title">' + amankan(s.judul) + '</span>' +
                   '<span class="cert-card__org">' + amankan(s.penerbit) + '</span>' +
                   '<span class="cert-card__date">' + amankan(tanggalTampil(s.tanggal)) + '</span>' +
                 '</span>' +
                 '<span class="cert-card__zoom">[ klik perbesar ]</span>' +
               '</button>' +
               '</div>';
    }).join('');

    // Daftarkan kartu yang baru dibuat ke pengamat animasi scroll
    if (typeof window.cpRevealAmati === 'function') {
        window.cpRevealAmati(wadah.querySelectorAll('.cp-reveal'));
    }

    // ---- jendela perbesar ----
    var box = document.querySelector('#cert-box');
    var boxImg = box.querySelector('.cert-box__img');
    var boxCap = box.querySelector('.cert-box__cap');
    var pemicuTerakhir = null;

    function buka(tombol) {
        pemicuTerakhir = tombol;
        boxImg.src = tombol.getAttribute('data-full');
        boxImg.alt = 'Sertifikat ' + tombol.getAttribute('data-judul');
        boxCap.innerHTML = '<b>' + tombol.getAttribute('data-judul') + '</b><br>' +
                           tombol.getAttribute('data-penerbit') + ' &middot; ' +
                           tombol.getAttribute('data-tanggal');
        box.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        box.querySelector('.cert-box__close').focus();
    }

    function tutup() {
        box.classList.remove('is-open');
        document.body.style.overflow = '';
        boxImg.removeAttribute('src');
        if (pemicuTerakhir) pemicuTerakhir.focus();
    }

    wadah.addEventListener('click', function (e) {
        var t = e.target.closest('.cert-card');
        if (t) buka(t);
    });

    box.addEventListener('click', function (e) {
        // klik latar atau tombol tutup
        if (e.target === box || e.target.closest('.cert-box__close')) tutup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && box.classList.contains('is-open')) tutup();
    });
})();

// ============================================================
// NAVIGASI AKTIF + TOMBOL KEMBALI KE ATAS
// ============================================================
(function () {
    // ---------- 1) Menandai section yang sedang dibuka ----------
    var tautan = document.querySelectorAll('#nav-menu a[href^="#"]');
    var peta = {}, adaSection = false;
    Array.prototype.forEach.call(tautan, function (a) {
        var id = a.getAttribute('href').slice(1);
        var sec = id && document.getElementById(id);
        if (sec) { peta[id] = a; adaSection = true; }
    });

    if (adaSection && 'IntersectionObserver' in window) {
        function bersihkan() {
            Array.prototype.forEach.call(tautan, function (a) { a.classList.remove('is-active'); });
        }
        // Pita setebal 1 baris tepat di tengah layar: hanya section yang
        // sedang melintasi tengah yang dianggap aktif, jadi tidak pernah
        // ada dua penanda menyala bersamaan.
        var pengamat = new IntersectionObserver(function (entri) {
            entri.forEach(function (e) {
                if (e.isIntersecting) {
                    bersihkan();
                    var a = peta[e.target.id];
                    if (a) a.classList.add('is-active');
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

        Object.keys(peta).forEach(function (id) {
            pengamat.observe(document.getElementById(id));
        });
    }

    // ---------- 2) Tombol kembali ke atas ----------
    var tombol = document.querySelector('#ke-atas');
    if (tombol) {
        // Perilaku sembunyi-muncul hanya aktif kalau JavaScript berjalan;
        // tanpa JS tombolnya tetap tampil dan tetap berfungsi sebagai anchor.
        document.documentElement.classList.add('js-atas');

        var AMBANG = 600, tampil = false, menunggu = false;

        function periksa() {
            var perlu = window.scrollY > AMBANG;
            if (perlu !== tampil) {
                tampil = perlu;
                tombol.classList.toggle('terlihat', perlu);
            }
            menunggu = false;
        }

        window.addEventListener('scroll', function () {
            if (!menunggu) { menunggu = true; requestAnimationFrame(periksa); }
        }, { passive: true });

        periksa();
    }
})();
