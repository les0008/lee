'use strict';
/* Renders the 2000-image set: compose() for copy/angle/layout variety,
   plan2000() for the background treatment, one shared HTML builder for both
   modes so a photo-mode ad and a generated-background ad share type,
   spacing and the fit pass. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const sharp = require('sharp');
require('./layouts/extra');
require('./layouts/photo');
const { LAYOUTS } = require('./layouts');
const { PALETTE_BY_ID, TYPESETS, FORMATS, baseCSS } = require('./brand');
const { compose } = require('./compose');
const { planFor } = require('./plan2000');
const { SCRIM, PHOTO_PALETTE } = require('./photo-plan');
const BG = require('./backgrounds');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = path.join(__dirname, '..'), BUILD = path.join(ROOT, 'build'), OUT = path.join(ROOT, 'out', 'set2000');
const FIT = fs.readFileSync(path.join(__dirname, 'render.js'), 'utf8').match(/const FIT_SCRIPT = `([\s\S]*?)`;/)[1];

const TS = TYPESETS.find(t => t.id === 'clean'); // one medium-weight sans across the whole set

function html(c, plan, fmt) {
  if (plan.mode === 'generated') {
    const pal = PALETTE_BY_ID[c.palette];
    const ctx = Object.assign({}, c, { fmt, pal, ts: TS, pick: (a, n) => a.slice(0, n) });
    const inner = LAYOUTS[c.layout].fn(ctx);
    const bg = BG.render(c, pal);
    const css = baseCSS(fmt, pal, TS).replace(/node_modules\/@fontsource/g, '../node_modules/@fontsource')
      + `.bglayer{position:absolute;inset:0;z-index:0;overflow:hidden}
         .content{position:relative;z-index:1;height:100%;display:flex;flex-direction:column}`;
    return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>`
      + `<div class="canvas"><div class="bglayer">${bg}</div><div class="content">${inner}</div></div></body></html>`;
  }

  // photo mode
  const panel = plan.photoLayout === 'photoPanel';
  const pal = panel ? PALETTE_BY_ID[c.palette] : PHOTO_PALETTE;
  const ctx = Object.assign({}, c, plan, { fmt, pal, ts: TS, pick: (a, n) => a.slice(0, n) });
  const inner = LAYOUTS[plan.photoLayout].fn(ctx);
  const scrim = SCRIM[plan.photoLayout] || null;
  const bg = panel ? '' : `
    <div style="position:absolute;inset:0;background-image:url('${plan.plateSrc}');background-size:cover;background-position:${plan.bgPos}"></div>
    ${plan.plate.startsWith('sand') ? `<div style="position:absolute;inset:0;background:rgba(18,13,6,.18)"></div>` : ''}
    <div style="position:absolute;inset:0;background:${scrim}"></div>`;
  const css = baseCSS(fmt, pal, TS).replace(/node_modules\/@fontsource/g, '../node_modules/@fontsource')
    + `.bglayer{position:absolute;inset:0;z-index:0;overflow:hidden}
       .content{position:relative;z-index:1;height:100%;display:flex;flex-direction:column}
       .cta{box-shadow:0 calc(var(--u)*.6) calc(var(--u)*2) rgba(0,0,0,.28)}`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>`
    + `<div class="canvas"><div class="bglayer">${bg}</div><div class="content">${inner}</div></div></body></html>`;
}

async function main() {
  const fmt = FORMATS.find(f => f.id === (process.argv[2] || '4x5'));
  const startAt = Number(process.argv[3] || 0);
  const endAt = Number(process.argv[4] || 2000);

  for (const f of ['assets/lf1-bottle.png', 'assets/plates/variants/manifest.json'])
    if (!fs.existsSync(path.join(ROOT, f))) throw new Error(`missing ${f}`);

  fs.mkdirSync(BUILD, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });

  const concepts = compose({ total: 2000 });
  const b = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--font-render-hinting=none', '--force-color-profile=srgb'] });
  const p = await b.newPage({ deviceScaleFactor: 1 });
  await p.setViewportSize({ width: fmt.w, height: fmt.h });

  const manifestPath = path.join(ROOT, 'out', 'set2000.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath)) : [];
  let over = 0;

  for (let i = startAt; i < Math.min(endAt, concepts.length); i++) {
    const c = concepts[i];
    const plan = planFor(c, i, '../assets/');
    const hp = path.join(BUILD, `set2000-${i % 8}.html`); // small round-robin to dodge fs races if parallelised later
    fs.writeFileSync(hp, html(c, plan, fmt));
    await p.goto('file://' + hp, { waitUntil: 'load' });
    await p.evaluate('document.fonts.ready');
    await p.evaluate(`Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; })))`);
    const st = await p.evaluate('(' + FIT + ')(' + JSON.stringify(fmt.id) + ')');
    if (st === 'OVERFLOW') over++;
    const name = `LF1_${String(i + 1).padStart(4, '0')}_${c.angle}_${plan.mode === 'photo' ? plan.photoLayout : c.layout}_${fmt.id}.png`;
    await sharp(await p.screenshot({ type: 'png' }))
      .png({ palette: true, colours: 180, effort: 6, dither: .6 })
      .toFile(path.join(OUT, name));
    manifest[i] = {
      n: i + 1, file: name, angle: c.angle, mode: plan.mode,
      layout: plan.mode === 'photo' ? plan.photoLayout : c.layout,
      plate: plan.mode === 'photo' ? plan.plate : null,
      palette: c.palette, headline: c.headline, subhead: c.subhead, eyebrow: c.eyebrow, cta: c.cta,
    };
    if ((i + 1) % 50 === 0) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`  ${i + 1}/${concepts.length} rendered, ${over} overflow so far`);
    }
  }
  await b.close();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`done: ${Math.min(endAt, concepts.length) - startAt} rendered [${startAt}..${Math.min(endAt, concepts.length)}), ${over} overflow -> out/set2000/`);
}

main().catch(e => { console.error(e); process.exit(1); });
