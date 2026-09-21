'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const sharp = require('sharp');
const { compose, FORMATS, LAYOUTS, layoutForFormat } = require('./compose');
const { PALETTE_BY_ID, TYPESETS, baseCSS, BRAND } = require('./brand');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const OUT = path.join(ROOT, 'out', 'ads');

const TS_BY_ID = Object.fromEntries(TYPESETS.map(t => [t.id, t]));

/* Auto-fit: largest font-size (in u) at or below data-max that does not
   overflow the canvas. Binary search, 7 iterations => ~0.1u precision. */
const FIT_SCRIPT = `(FMT) => {
  const canvas = document.querySelector('.canvas');
  const root = document.documentElement;
  const baseU = parseFloat(getComputedStyle(root).getPropertyValue('--u'));
  // Canvas-level overflow, plus element-level horizontal overflow of any text
  // block — a single long word can break out without moving canvas.scrollWidth.
  const texts = () => document.querySelectorAll('.display, .cta, .eyebrow, .wordmark');
  const over = () => {
    if (canvas.scrollHeight > canvas.clientHeight + 1) return true;
    if (canvas.scrollWidth  > canvas.clientWidth + 1)  return true;
    for (const e of texts()) if (e.scrollWidth > e.clientWidth + 1) return true;
    return false;
  };
  const setU = k => root.style.setProperty('--u', (baseU * k) + 'px');

  // Pass 0 — tall canvases (4:5, 9:16) leave voids when content is short.
  // Grow the base unit until the frame is properly filled.
  if (!over() && (FMT === '9x16' || FMT === '4x5')) {
    let lo = 1.0, hi = FMT === '9x16' ? 1.45 : 1.28;
    setU(hi);
    if (!over()) { return 'ok'; }
    for (let i = 0; i < 9; i++) {
      const mid = (lo + hi) / 2;
      setU(mid);
      if (over()) hi = mid; else lo = mid;
    }
    setU(lo);
    return 'ok';
  }

  // Nothing to do.
  if (!over()) return 'ok';

  // Pass 1 — proportional scale. Shrinking the whole design system preserves
  // the type hierarchy, so it is always the better first move.
  let scale = 1;
  {
    let hi = 1.0, lo = 0.74;
    setU(lo);
    if (over()) { scale = lo; }            // still tight: pass 2 will handle it
    else {
      // invariant: lo fits, hi overflows -> converge on the largest fitting scale
      for (let i = 0; i < 8; i++) {
        const mid = (hi + lo) / 2;
        setU(mid);
        if (over()) hi = mid; else lo = mid;
      }
      scale = lo; setU(scale);
      return over() ? 'OVERFLOW' : 'ok';
    }
  }

  // Pass 2 — the headline itself is the problem. Shrink it, but never below
  // 55% of its authored size or the creative loses its hierarchy.
  for (const el of document.querySelectorAll('.fit')) {
    if (!over()) break;
    const authored = parseFloat(el.dataset.max || '9');
    const floor = authored * 0.55;
    let hi = authored, lo = floor;
    for (let i = 0; i < 8; i++) {
      const mid = (hi + lo) / 2;
      el.style.fontSize = 'calc(var(--u)*' + mid.toFixed(3) + ')';
      if (over()) hi = mid; else lo = mid;
    }
    el.style.fontSize = 'calc(var(--u)*' + lo.toFixed(3) + ')';
  }

  // Pass 3 — scale the system further down.
  if (over()) {
    let hi = scale, lo = 0.5;
    for (let i = 0; i < 8; i++) {
      const mid = (hi + lo) / 2;
      setU(mid);
      if (over()) hi = mid; else lo = mid;
    }
    setU(lo);
  }

  // Pass 4 — hard fit. A cropped headline or a missing footer is a broken ad;
  // a smaller headline is not. Drop the hierarchy floor and guarantee it fits.
  if (over()) {
    for (const el of document.querySelectorAll('.fit')) {
      let hi = parseFloat(getComputedStyle(el).fontSize) / parseFloat(getComputedStyle(root).getPropertyValue('--u'));
      let lo = 1.4;
      for (let i = 0; i < 9; i++) {
        const mid = (hi + lo) / 2;
        el.style.fontSize = 'calc(var(--u)*' + mid.toFixed(3) + ')';
        if (over()) hi = mid; else lo = mid;
      }
      el.style.fontSize = 'calc(var(--u)*' + lo.toFixed(3) + ')';
      if (!over()) break;
    }
  }
  if (over()) {
    let hi = 0.5, lo = 0.34;
    for (let i = 0; i < 8; i++) {
      const mid = (hi + lo) / 2;
      setU(mid);
      if (over()) hi = mid; else lo = mid;
    }
    setU(lo);
  }
  return over() ? 'OVERFLOW' : 'ok';
}`;

function buildHTML(c, fmt) {
  const pal = PALETTE_BY_ID[c.palette];
  const ts = TS_BY_ID[c.typeset];
  const layoutId = layoutForFormat(c.layout, fmt.id);
  const layout = LAYOUTS[layoutId];
  const ctx = Object.assign({}, c, {
    fmt, pal, ts, layout: layoutId,
    pick: (arr, n) => arr.slice(0, n),
  });
  const inner = layout.fn(ctx);
  // font paths are relative to build/ -> ../node_modules/...
  const css = baseCSS(fmt, pal, ts).replace(/node_modules\/@fontsource/g, '../node_modules/@fontsource');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head>
<body><div class="canvas">${inner}</div></body></html>`;
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('='); return [k, v === undefined ? true : v];
  }));
  const total = parseInt(args.total || '500', 10);
  const limit = args.limit ? parseInt(args.limit, 10) : null;   // debug: first N creatives
  const workers = parseInt(args.workers || '8', 10);
  const formats = args.format ? FORMATS.filter(f => f.id === args.format) : FORMATS;

  fs.mkdirSync(BUILD, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });

  let creatives = compose({ total, productImage: args.productImage || null });
  if (limit) creatives = creatives.slice(0, limit);

  // Flat job list: creative x format
  const jobs = [];
  for (const c of creatives) for (const f of formats) jobs.push({ c, f });
  console.log(`Rendering ${jobs.length} assets (${creatives.length} creatives x ${formats.length} formats) on ${workers} workers`);

  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  const manifest = [];
  let done = 0, failed = 0;
  const overflowed = [];
  const t0 = Date.now();

  async function worker(wi) {
    const ctxBrowser = await browser.newContext({ deviceScaleFactor: 1 });
    const page = await ctxBrowser.newPage();
    const htmlPath = path.join(BUILD, `r${wi}.html`);
    for (let i = wi; i < jobs.length; i += workers) {
      const { c, f } = jobs[i];
      const renderedLayout = layoutForFormat(c.layout, f.id);
      const name = `LF1_${c.angle}_${renderedLayout}_${c.palette}_${c.id}_${f.id}.png`;
      try {
        fs.writeFileSync(htmlPath, buildHTML(c, f));
        await page.setViewportSize({ width: f.w, height: f.h });
        await page.goto('file://' + htmlPath, { waitUntil: 'load' });
        await page.evaluate('document.fonts.ready');
        const fitState = await page.evaluate('(' + FIT_SCRIPT + ')(' + JSON.stringify(f.id) + ')');
        if (fitState === 'OVERFLOW') overflowed.push(name);
        const buf = await page.screenshot({ type: 'png' });
        // palette-quantise: flat design survives this near-losslessly at ~1/3 the bytes
        await sharp(buf).png({ palette: true, colours: 128, effort: 8, dither: 0.6 })
          .toFile(path.join(OUT, name));
        manifest.push({
          file: name, creativeId: c.id, angle: c.angle, angleName: c.angleName, desire: c.desire,
          layout: renderedLayout, palette: c.palette, typeset: c.typeset, format: f.id,
          width: f.w, height: f.h, placements: f.placement,
          headline: c.headline, subhead: c.subhead, eyebrow: c.eyebrow, cta: c.cta,
        });
      } catch (e) {
        failed++; console.error('FAIL', name, e.message);
      }
      if (++done % 100 === 0) {
        const el = (Date.now() - t0) / 1000;
        console.log(`  ${done}/${jobs.length}  ${el.toFixed(0)}s  (${(done/el).toFixed(1)}/s)`);
      }
    }
    await ctxBrowser.close();
  }

  await Promise.all(Array.from({ length: workers }, (_, i) => worker(i)));
  await browser.close();

  manifest.sort((a, b) => a.file.localeCompare(b.file));
  fs.writeFileSync(path.join(ROOT, 'out', 'manifest.json'), JSON.stringify(manifest, null, 2));

  const csvEsc = s => `"${String(s).replace(/"/g, '""')}"`;
  const cols = ['file','creativeId','angle','angleName','desire','layout','palette','typeset','format','width','height','placements','headline','subhead','eyebrow','cta'];
  const csv = [cols.join(',')].concat(manifest.map(m => cols.map(k => csvEsc(m[k])).join(','))).join('\n');
  fs.writeFileSync(path.join(ROOT, 'out', 'manifest.csv'), csv);

  const el = (Date.now() - t0) / 1000;
  console.log(`\nDone. ${manifest.length} assets, ${failed} failed, ${overflowed.length} overflow, ${el.toFixed(0)}s`);
  fs.writeFileSync(path.join(ROOT,'out','overflow.txt'), overflowed.join('\n'));
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { buildHTML };
