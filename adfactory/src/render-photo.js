'use strict';
/* Renders the 35 launch creatives on the brand's own photography. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const sharp = require('sharp');
require('./layouts/extra');
require('./layouts/photo');
const { LAYOUTS } = require('./layouts');
const { PALETTE_BY_ID, TYPESETS, FORMATS, baseCSS } = require('./brand');
const { build } = require('./launch35');
const PLAN = require('./photo-plan');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = path.join(__dirname, '..'), BUILD = path.join(ROOT, 'build'), OUT = path.join(ROOT, 'out', 'photo35');
const FIT = fs.readFileSync(path.join(__dirname, 'render.js'), 'utf8').match(/const FIT_SCRIPT = `([\s\S]*?)`;/)[1];

// One typeset across the whole set: a medium-weight sans, not a display face.
// The reference ads (GLP-1 SOS, Zafira, Evolv) never run a loud headline font
// on a photograph — it fights the image. Varying the typeset per palette was
// what made several of these read as too bold.
const TS = TYPESETS.find(t => t.id === 'clean');

function html(c, fmt) {
  // Full-bleed layouts run white-on-photo; the panel layout keeps the ad's own
  // palette, because its type sits on an opaque block rather than the picture.
  const panel = c.photoLayout === 'photoPanel';
  const pal = panel ? PALETTE_BY_ID[c.palette] : PLAN.PHOTO_PALETTE;
  const ts = TS;
  const ctx = Object.assign({}, c, { fmt, pal, ts, pick: (a, n) => a.slice(0, n) });
  const inner = LAYOUTS[c.photoLayout].fn(ctx);

  const bg = panel ? '' : `
    <div style="position:absolute;inset:0;background-image:url('${c.plateSrc}');background-size:cover;background-position:${c.bgPos}"></div>
    ${c.plate === 'sand' ? `<div style="position:absolute;inset:0;background:rgba(18,13,6,.18)"></div>` : ''}
    <div style="position:absolute;inset:0;background:${c.scrim}"></div>`;

  const css = baseCSS(fmt, pal, ts).replace(/node_modules\/@fontsource/g, '../node_modules/@fontsource')
    + `.bglayer{position:absolute;inset:0;z-index:0;overflow:hidden}
       .content{position:relative;z-index:1;height:100%;display:flex;flex-direction:column}
       .cta{box-shadow:0 calc(var(--u)*.6) calc(var(--u)*2) rgba(0,0,0,.28)}`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>`
    + `<div class="canvas"><div class="bglayer">${bg}</div><div class="content">${inner}</div></div></body></html>`;
}

(async () => {
  const fmt = FORMATS.find(f => f.id === (process.argv[2] || '4x5'));
  for (const f of ['assets/lf1-bottle.png', 'assets/plates/stone.png', 'assets/plates/hero.png', 'assets/plates/sand.png'])
    if (!fs.existsSync(path.join(ROOT, f))) throw new Error(`missing ${f} — run src/extract-bottle.js and src/make-plates.js`);

  fs.mkdirSync(BUILD, { recursive: true });
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const ads = build().map(c => PLAN.apply(c, '../assets/'));
  const b = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--font-render-hinting=none', '--force-color-profile=srgb'] });
  const p = await b.newPage({ deviceScaleFactor: 1 });
  const manifest = []; let over = 0;

  for (const c of ads) {
    const hp = path.join(BUILD, 'photo.html');
    fs.writeFileSync(hp, html(c, fmt));
    await p.setViewportSize({ width: fmt.w, height: fmt.h });
    await p.goto('file://' + hp, { waitUntil: 'load' });
    await p.evaluate('document.fonts.ready');
    await p.evaluate(`Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; })))`);
    const st = await p.evaluate('(' + FIT + ')(' + JSON.stringify(fmt.id) + ')');
    if (st === 'OVERFLOW') { over++; console.log('  OVERFLOW', c.id, c.photoLayout, c.plate); }
    const name = `LF1_${c.id}_${c.angle}_${c.photoLayout}_${c.plate}_${fmt.id}.png`;
    await sharp(await p.screenshot({ type: 'png' }))
      .png({ palette: true, colours: 200, effort: 8, dither: .7 })
      .toFile(path.join(OUT, name));
    manifest.push({
      n: Number(c.id), file: name, angle: c.angle, layout: c.photoLayout, plate: c.plate,
      slot: c.panelSlot, palette: c.palette, headline: c.headline, subhead: c.subhead,
      eyebrow: c.eyebrow, cta: c.cta,
    });
  }
  await b.close();
  fs.writeFileSync(path.join(ROOT, 'out', 'photo35.json'), JSON.stringify(manifest, null, 2));
  console.log(`rendered ${manifest.length} at ${fmt.id}, ${over} overflow -> out/photo35/`);
})().catch(e => { console.error(e); process.exit(1); });
