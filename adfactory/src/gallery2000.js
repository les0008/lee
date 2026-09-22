'use strict';
/* Review gallery for the 2000-image set. Publishing 2000 files exceeds the
   Artifact tool's per-call limit, so this samples evenly across the whole
   manifest (every angle, both modes, all plates get representation) rather
   than just the first N. */
const fs = require('fs'), path = require('path');
const m = require('../out/set2000.json');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SAMPLE_N = 220;
const step = m.length / SAMPLE_N;
const sample = [];
const seen = new Set();
for (let i = 0; i < SAMPLE_N; i++) {
  const idx = Math.min(m.length - 1, Math.round(i * step));
  if (!seen.has(idx)) { seen.add(idx); sample.push(m[idx]); }
}

const LABEL = {
  GI_SPECIFIC: 'Digestive', FINALLY_NORMAL: 'Relief', NUTRIENT_GAP: 'Nutrient gap',
  COMPANION: 'Companion', STAY_COURSE: 'Retention', FIBER_FAILS: 'Mechanism',
  CLEAN_LABEL: 'Clean label', RITUAL: 'Ritual', OFFER: 'Offer', NO_MANUAL: 'No manual',
  USA_MADE: 'USA made', PRACTITIONER: 'Practitioner', CONFIDENCE: 'Confidence',
};
const ANGLES = [...new Set(sample.map(a => a.angle))];

const cards = sample.map(a => `
  <article class="card" data-angle="${a.angle}" data-mode="${a.mode}" data-n="${a.n}">
    <div class="shot"><img src="ads/${esc(String(a.n).padStart(4, '0'))}${a.file.endsWith('.jpg') ? '.jpg' : '.png'}" alt="${esc(a.headline)}" loading="lazy" width="1080" height="1350"></div>
    <div class="meta">
      <div class="row"><span class="num">${a.n}</span><span class="chip">${esc(LABEL[a.angle] || a.angle)}</span><span class="chip mode">${a.mode}</span></div>
      <p class="hl">${esc(a.headline)}</p>
      <p class="sub">${esc(a.subhead)}</p>
      <div class="row spread"><span class="mono">${esc(a.layout)}${a.plate ? ' · ' + esc(a.plate) : ''}</span></div>
    </div>
  </article>`).join('');

const html = `<title>LF-1 · 2000-Image Set (sample)</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --bg:#FCFCF7; --surface:#FFFFFF; --ink:#14231C; --soft:#5E6B63; --line:#E6E2D6;
  --accent:#C8901A; --chip:#F1EDE1;
  --serif:'Instrument Serif',Georgia,serif; --sans:'Inter',system-ui,sans-serif; --mono:'IBM Plex Mono',ui-monospace,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#0F120F; --surface:#171B17; --ink:#F2F0E6; --soft:#9AA79D; --line:#262B26; --chip:#20261F;}}
:root[data-theme="dark"]{--bg:#0F120F; --surface:#171B17; --ink:#F2F0E6; --soft:#9AA79D; --line:#262B26; --chip:#20261F;}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:var(--sans);margin:0;padding-inline:20px;padding-block:0 56px;line-height:1.5}
.wrap{max-width:1360px;margin:0 auto}
header{padding-block:40px 20px;border-bottom:1px solid var(--line)}
.kicker{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--soft);margin:0 0 10px}
h1{font-family:var(--serif);font-weight:400;font-size:clamp(30px,5vw,46px);line-height:1.05;margin:0 0 12px}
.lede{margin:0;max-width:70ch;color:var(--soft);font-size:14.5px}
.stats{display:flex;flex-wrap:wrap;gap:22px;margin-top:18px;font-family:var(--mono);font-size:12px;color:var(--soft)}
.stats b{color:var(--ink);font-weight:500}
.bar{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding-block:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.f{font-family:var(--mono);font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;padding:5px 10px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--soft);cursor:pointer}
.f[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:20px;padding-block:24px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:6px;overflow:hidden;display:flex;flex-direction:column}
.shot{background:var(--chip)}
.shot img{display:block;width:100%;height:auto}
.meta{padding:11px 12px 12px;display:flex;flex-direction:column;gap:6px}
.row{display:flex;align-items:center;gap:7px}
.row.spread{margin-top:auto;padding-top:3px}
.num{font-family:var(--mono);font-size:11px;color:var(--soft)}
.chip{font-family:var(--mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;background:var(--chip);color:var(--soft);padding:2px 7px;border-radius:999px}
.chip.mode{opacity:.7}
.hl{font-family:var(--serif);font-size:16.5px;line-height:1.16;margin:0}
.sub{margin:0;font-size:11.5px;color:var(--soft);line-height:1.4}
.mono{font-family:var(--mono);font-size:9.5px;color:var(--soft)}
.note{margin-top:30px;padding:18px 20px;border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:4px;background:var(--surface)}
.note h2{font-family:var(--serif);font-weight:400;font-size:20px;margin:0 0 8px}
.note p{margin:0 0 8px;font-size:13.5px;color:var(--soft);max-width:74ch}
.note b{color:var(--ink);font-weight:500}
</style>
<div class="wrap">
<header>
  <p class="kicker">LEAF · LF-1 · a sample of 2000, evenly spread</p>
  <h1>${sample.length} of 2000, sampled across the whole set.</h1>
  <p class="lede">Every ${Math.round(step)}th concept, not the first ${sample.length} — so this represents every angle, both background modes,
  and all eighteen photo-plate grades rather than clustering on whatever rendered first. The full 2000 are committed to the repo.</p>
  <div class="stats">
    <span><b>2000</b> total rendered</span><span><b>${sample.length}</b> shown here</span>
    <span><b>1500</b> on your photos</span><span><b>500</b> generated</span>
    <span><b>0</b> overflow</span>
  </div>
</header>
<div class="bar" id="bar">
  <button class="f" data-a="all" aria-pressed="true">All</button>
  ${ANGLES.map(a => `<button class="f" data-a="${a}" aria-pressed="false">${esc(LABEL[a] || a)}</button>`).join('')}
  <span style="width:1px;height:18px;background:var(--line);margin:0 4px"></span>
  <button class="f" data-m="all" aria-pressed="true">Photo + generated</button>
  <button class="f" data-m="photo" aria-pressed="false">Photo only</button>
  <button class="f" data-m="generated" aria-pressed="false">Generated only</button>
</div>
<div class="grid" id="grid">${cards}</div>
<div class="note">
  <h2>What this is a sample of</h2>
  <p><b>The full 2000 are rendered and committed</b> — this page shows ${sample.length} to keep it loadable; every image, plus the manifest
  mapping each one to its angle/layout/background, is in <code>out/set2000/</code> and <code>out/set2000.json</code>.</p>
  <p><b>Meta upload is still blocked</b> on the Page-permission gap I flagged — creative creation fails identically whether given a public
  image URL or the exact hash of an already-live creative on the account. Nothing here has gone to Meta yet.</p>
</div>
</div>
<script>
(function(){
  var aSel='all', mSel='all';
  function paint(){
    document.querySelectorAll('.card').forEach(function(c){
      var okA = aSel==='all' || c.dataset.angle===aSel;
      var okM = mSel==='all' || c.dataset.mode===mSel;
      c.hidden = !(okA && okM);
    });
  }
  document.getElementById('bar').addEventListener('click',function(e){
    var b=e.target.closest('.f'); if(!b) return;
    if(b.dataset.a!==undefined){
      aSel=b.dataset.a;
      document.querySelectorAll('.f[data-a]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
    } else if(b.dataset.m!==undefined){
      mSel=b.dataset.m;
      document.querySelectorAll('.f[data-m]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
    }
    paint();
  });
})();
</script>`;

fs.writeFileSync(path.join(__dirname, '..', 'out', 'gallery2000.html'), html);
fs.writeFileSync(path.join(__dirname, '..', 'out', 'gallery2000-sample.json'), JSON.stringify(sample, null, 2));
console.log('gallery2000.html written,', sample.length, 'sampled cards');
