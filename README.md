# Nugroho Agung Wibisono — Portfolio

Personal portfolio of Nugroho Agung Wibisono, a final-year Informatics Engineering
student at Universitas Mercu Buana. A single static page with a Cyberpunk 2077–inspired
look, built without a framework.

**Live:** https://anugroho186.github.io/portfolio-nugroho-aw/

![Preview of the portfolio](src/img/og-image.jpg)

## Highlights

- **Boot screen** with a glitching 3D `[NAW]` logo, played on every page load and
  skippable with a click, tap, scroll or key press. It waits until the page is actually
  visible, so browsers that pre-render the page in the background still show it.
- **3D hologram** drawn by hand on a 2D `<canvas>` with a manual 3D projection — no
  WebGL and no libraries — from the model in `src/model/`.
- **Case-file portfolio**: duotone screenshots in HUD frames that regain their colour
  on hover.
- **Skills terminal** where every category links to the project or certificate that
  backs it up.
- **Certificate gallery** with sorting, a category filter and a lightbox, rendered from
  a small data list in `src/js/script.js`.
- **Scroll position kept on refresh**, restored behind the boot screen.
- Respects `prefers-reduced-motion`, and every change is checked at widths from
  320 px to 1440 px.

## Built with

- HTML, hand-written CSS and vanilla JavaScript — no framework, no bundler
- [Tailwind CSS](https://v3.tailwindcss.com/) 3.4 (CLI) for layout utilities
- Google Fonts: Orbitron, JetBrains Mono and Oxygen
- Hosted on GitHub Pages

## Project structure

```
index.html            all page markup
src/input.css         Tailwind source  ->  src/output.css (generated, do not edit)
src/cyberpunk.css     themed effects, organised as numbered blocks
src/style.css         extra component styles
src/js/script.js      scroll reveal, certificates, navigation, scroll restore
src/js/boot.js        boot screen timing
src/js/hologram.js    canvas hologram renderer (geometry data in holo-geo.js)
src/img/              images (certificates in cert/thumb and cert/full)
src/model/            source geometry for the hologram
```

## Run locally

It is a static site, so any static file server works:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

After changing Tailwind class names in `index.html`, rebuild the stylesheet:

```bash
npm install
node node_modules/tailwindcss/lib/cli.js -i ./src/input.css -o ./src/output.css
```

## Contact

- Email: nugroho.a.wibisono@gmail.com
- LinkedIn: https://www.linkedin.com/in/nugroho-agung-wibisono-48aa1b2b4/
- GitHub: https://github.com/ANugroho186
