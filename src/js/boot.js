// ============================================================
// LAYAR PEMBUKA: boot log + logo [NAW]
//
// Tampil atau tidaknya diputuskan skrip kecil di <head> (sekali per sesi
// tab, tidak untuk prefers-reduced-motion) dengan memasang cp-boot-on di
// <html>. File ini hanya mengatur waktunya; animasinya di CSS blok 31.
//   0. kalau ada cp-boot-tunggu (halaman dimuat selagi tak terlihat), tunggu
//      sampai skrip <head> melepasnya, yaitu saat halaman benar-benar tampil;
//   1. tunggu font logo (Orbitron) siap, paling lama 800 ms, supaya logo
//      tidak berganti font di tengah animasi;
//   2. cp-boot-jalan  -> animasi masuk, ~2,1 detik;
//   3. cp-boot-keluar -> isi layar padam & panel membelah, ~0,65 detik;
//   4. semua kelas dilepas dan elemennya dibuang dari DOM.
// Klik, ketuk, scroll, atau tombol apa pun langsung melompat ke langkah 3.
// ============================================================
(function () {
    var root = document.documentElement;
    var layar = document.getElementById('cp-boot');
    if (!layar) return;

    if (!root.classList.contains('cp-boot-on')) {
        layar.parentNode.removeChild(layar);
        return;
    }

    var LAMA_MASUK = 2100;   // ms dari mulai jalan sampai mulai keluar
    var LAMA_KELUAR = 700;   // ms, sedikit di atas animasi keluar terpanjang (640 ms)
    var BATAS_FONT = 800;    // ms, batas menunggu Orbitron

    var PEMICU_LEWATI = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    var sudahJalan = false, sudahKeluar = false, idMasuk = 0;

    function jalan() {
        if (sudahJalan || sudahKeluar) return;
        sudahJalan = true;
        root.classList.add('cp-boot-jalan');
        idMasuk = setTimeout(keluar, LAMA_MASUK);
    }

    function keluar() {
        if (sudahKeluar) return;
        sudahKeluar = true;
        clearTimeout(idMasuk);
        PEMICU_LEWATI.forEach(function (p) { window.removeEventListener(p, keluar, true); });
        root.classList.add('cp-boot-keluar');
        setTimeout(bereskan, LAMA_KELUAR);
    }

    function bereskan() {
        root.classList.remove('cp-boot-on', 'cp-boot-jalan', 'cp-boot-keluar');
        if (layar.parentNode) layar.parentNode.removeChild(layar);
    }

    function siap() {
        PEMICU_LEWATI.forEach(function (p) {
            window.addEventListener(p, keluar, { capture: true, passive: true });
        });

        var idTunggu = setTimeout(jalan, BATAS_FONT);
        if (document.fonts && document.fonts.load) {
            document.fonts.load('900 1em Orbitron').then(function () {
                clearTimeout(idTunggu);
                jalan();
            }, function () {});
        } else {
            clearTimeout(idTunggu);
            jalan();
        }
    }

    if (!root.classList.contains('cp-boot-tunggu')) {
        siap();
        return;
    }

    // Pendengar milik skrip <head> dipasang lebih dulu pada dokumen yang sama,
    // jadi selalu jalan lebih dulu dan sudah melepas cp-boot-tunggu di sini.
    function cekTampil() {
        if (root.classList.contains('cp-boot-tunggu')) return;
        document.removeEventListener('visibilitychange', cekTampil);
        document.removeEventListener('prerenderingchange', cekTampil);
        siap();
    }
    document.addEventListener('visibilitychange', cekTampil);
    document.addEventListener('prerenderingchange', cekTampil);
})();
