// ============================================================
// HOLOGRAM LEMPENGAN 3D - proyektor wireframe tanpa library
//
// Geometri berasal dari sketsa asli (Nugroho A.W.) yang di-scan,
// konturnya ditelusuri, lalu diberi ketebalan pada sumbu Z sehingga
// menjadi lempengan tipis - bukan gambar, melainkan verteks 3D betulan.
// Data konturnya ada di holo-geo.js (var HOLO_KONTUR).
// File 3D versi utuh: src/model/skull-plate.obj
// ============================================================
(function () {
    var kanvas = document.querySelector('#holo');
    if (!kanvas || typeof HOLO_KONTUR === 'undefined') return;
    var ctx = kanvas.getContext('2d');
    var kurangiGerak = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var TEBAL = 0.06;      // setengah ketebalan lempengan
    var LANGKAH_TEPI = 2;  // rusuk penghubung depan-belakang tiap n titik

    // ---------- susun verteks & rusuk dari kontur ----------
    var V = [], E = [];
    (function bangun() {
        for (var k = 0; k < HOLO_KONTUR.length; k++) {
            var c = HOLO_KONTUR[k], n = c.length / 2, awal = V.length;
            var i;
            for (i = 0; i < n; i++) V.push([c[i * 2], c[i * 2 + 1],  TEBAL]);  // sisi depan
            for (i = 0; i < n; i++) V.push([c[i * 2], c[i * 2 + 1], -TEBAL]);  // sisi belakang
            for (i = 0; i < n; i++) {
                var j = (i + 1) % n;
                E.push([awal + i, awal + j]);              // garis muka depan
                E.push([awal + n + i, awal + n + j]);      // garis muka belakang
                if (i % LANGKAH_TEPI === 0) E.push([awal + i, awal + n + i]);  // dinding tepi
            }
        }
    })();

    // batas model, dipakai supaya penempatan tidak perlu ditebak
    var yMin = Infinity, yMaks = -Infinity, rMaks = 0;
    for (var i = 0; i < V.length; i++) {
        var p = V[i];
        if (p[1] < yMin) yMin = p[1];
        if (p[1] > yMaks) yMaks = p[1];
        var r = Math.sqrt(p[0] * p[0] + p[2] * p[2]);
        if (r > rMaks) rMaks = r;
    }
    var yTengah = (yMaks + yMin) / 2, setengahTinggi = (yMaks - yMin) / 2;

    // ---------- render ----------
    var LAPIS = 7;                       // jumlah tingkat kepekatan
    var jalur = new Array(LAPIS);
    var sudut = 0.6, waktuTerakhir = 0, kedip = 1;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var p2 = new Float32Array(V.length * 3);

    function ukur() {
        var r = kanvas.getBoundingClientRect();
        kanvas.width = Math.max(1, Math.round(r.width * DPR));
        kanvas.height = Math.max(1, Math.round(r.height * DPR));
    }
    ukur();
    window.addEventListener('resize', ukur);

    function gambar(ts) {
        var dt = waktuTerakhir ? Math.min(0.05, (ts - waktuTerakhir) / 1000) : 0;
        waktuTerakhir = ts;
        if (!kurangiGerak) sudut += dt * 0.5;

        var W = kanvas.width, H = kanvas.height;
        ctx.clearRect(0, 0, W, H);

        var skala = Math.min(W * 0.48 / (rMaks * 1.12), H * 0.48 / (setengahTinggi * 1.12));
        var cx = W / 2, cy = H / 2 + yTengah * skala;
        var cos = Math.cos(sudut), sin = Math.sin(sudut);
        var miring = 0.13, cosM = Math.cos(miring), sinM = Math.sin(miring);

        var j, x, y, z, d;
        for (j = 0; j < V.length; j++) {
            var v = V[j];
            x = v[0] * cos - v[2] * sin;
            z = v[0] * sin + v[2] * cos;
            y = v[1] * cosM - z * sinM;
            z = v[1] * sinM + z * cosM;
            d = 4.6 / (4.6 + z);
            p2[j * 3]     = cx + x * skala * d;
            p2[j * 3 + 1] = cy - y * skala * d;
            p2[j * 3 + 2] = z;
        }

        // Kumpulkan rusuk ke beberapa tingkat kepekatan, lalu gambar sekali
        // per tingkat. Tanpa ini, ribuan panggilan stroke akan sangat berat.
        for (j = 0; j < LAPIS; j++) jalur[j] = new Path2D();
        for (j = 0; j < E.length; j++) {
            var a = E[j][0] * 3, b = E[j][1] * 3;
            var zr = (p2[a + 2] + p2[b + 2]) / 2;
            var t = 1 - (zr + 1.05) / 2.1;                 // depan = 1, belakang = 0
            var lap = t <= 0 ? 0 : t >= 1 ? LAPIS - 1 : (t * LAPIS) | 0;
            var pth = jalur[lap];
            pth.moveTo(p2[a], p2[a + 1]);
            pth.lineTo(p2[b], p2[b + 1]);
        }

        ctx.lineWidth = Math.max(1, DPR * 0.85);
        ctx.lineCap = 'round';
        for (j = 0; j < LAPIS; j++) {
            var op = (0.13 + 0.62 * (j / (LAPIS - 1))) * kedip;
            ctx.strokeStyle = 'rgba(6,207,206,' + op.toFixed(3) + ')';
            ctx.stroke(jalur[j]);
        }
        // sapuan pendar tipis pada lapisan terdepan
        ctx.strokeStyle = 'rgba(140,255,255,' + (0.30 * kedip).toFixed(3) + ')';
        ctx.lineWidth = Math.max(1, DPR * 0.4);
        ctx.stroke(jalur[LAPIS - 1]);

        kedip = Math.random() < 0.012 ? 0.5 : (kedip < 1 ? Math.min(1, kedip + 0.12) : 1);

        if (berjalan) idFrame = requestAnimationFrame(gambar);
    }

    // ---------- hemat tenaga: berhenti saat tidak terlihat ----------
    var berjalan = false, idFrame = null;
    function mulai() { if (!berjalan) { berjalan = true; waktuTerakhir = 0; idFrame = requestAnimationFrame(gambar); } }
    function henti() { berjalan = false; if (idFrame) cancelAnimationFrame(idFrame); }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) {
            e[0].isIntersecting ? mulai() : henti();
        }, { threshold: 0.05 }).observe(kanvas);
    } else { mulai(); }

    document.addEventListener('visibilitychange', function () {
        document.hidden ? henti() : mulai();
    });
})();
