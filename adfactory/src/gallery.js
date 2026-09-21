'use strict';
const fs=require('fs'), path=require('path');
const m=require('../out/launch35.json');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const ANGLES=[...new Set(m.map(a=>a.angle))];
const LABEL={GI_SPECIFIC:'Digestive',FINALLY_NORMAL:'Relief',NUTRIENT_GAP:'Nutrient gap',COMPANION:'Companion',
  STAY_COURSE:'Retention',FIBER_FAILS:'Mechanism',CLEAN_LABEL:'Clean label',RITUAL:'Ritual',NO_MANUAL:'No manual',EURO_STANDARD:'Standards'};

const cards = m.map(a=>`
  <article class="card" data-angle="${a.angle}" data-n="${a.n}">
    <div class="shot"><img src="ads/${esc(a.file)}" alt="${esc(a.headline)}" loading="lazy" width="1080" height="1350"></div>
    <div class="meta">
      <div class="row"><span class="num">${String(a.n).padStart(2,'0')}</span><span class="chip">${esc(LABEL[a.angle]||a.angle)}</span></div>
      <p class="hl">${esc(a.headline)}</p>
      <p class="sub">${esc(a.subhead)}</p>
      <div class="row spread">
        <span class="mono">${esc(a.layout)} · ${esc(a.palette)}</span>
        <button class="mark" type="button" aria-label="Mark ad ${a.n}" data-n="${a.n}">Unmarked</button>
      </div>
    </div>
  </article>`).join('');

const html = `<title>LF-1 Launch Set</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --bg:#FCFCF7; --surface:#FFFFFF; --ink:#14231C; --soft:#5E6B63; --line:#E6E2D6;
  --accent:#C8901A; --accentInk:#14231C; --keep:#2F6B4F; --cut:#A63D2F; --chip:#F1EDE1;
  --serif:'Instrument Serif',Georgia,serif; --sans:'Inter',system-ui,sans-serif; --mono:'IBM Plex Mono',ui-monospace,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#0F120F; --surface:#171B17; --ink:#F2F0E6; --soft:#9AA79D; --line:#262B26;
  --accent:#F0B429; --accentInk:#14231C; --keep:#6FBF8F; --cut:#E08472; --chip:#20261F;}}
:root[data-theme="dark"]{
  --bg:#0F120F; --surface:#171B17; --ink:#F2F0E6; --soft:#9AA79D; --line:#262B26;
  --accent:#F0B429; --accentInk:#14231C; --keep:#6FBF8F; --cut:#E08472; --chip:#20261F;}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:var(--sans);margin:0;padding-inline:20px;padding-block:0 56px;line-height:1.5}
.wrap{max-width:1360px;margin:0 auto}
header{padding-block:40px 20px;border-bottom:1px solid var(--line)}
.kicker{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--soft);margin:0 0 10px}
h1{font-family:var(--serif);font-weight:400;font-size:clamp(34px,6vw,54px);line-height:1.02;margin:0 0 12px;text-wrap:balance}
.lede{margin:0;max-width:62ch;color:var(--soft);font-size:15px}
.stats{display:flex;flex-wrap:wrap;gap:22px;margin-top:20px;font-family:var(--mono);font-size:12px;color:var(--soft)}
.stats b{color:var(--ink);font-weight:500;font-variant-numeric:tabular-nums}
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);border-bottom:1px solid var(--line);
  padding-block:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.f{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:6px 11px;border-radius:999px;
  border:1px solid var(--line);background:transparent;color:var(--soft);cursor:pointer}
.f[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.f:focus-visible,.mark:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:26px;padding-block:26px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:6px;overflow:hidden;display:flex;flex-direction:column}
.card[data-mark="keep"]{border-color:var(--keep);box-shadow:inset 0 0 0 1px var(--keep)}
.card[data-mark="cut"]{opacity:.5}
.shot{background:var(--chip)}
.shot img{display:block;width:100%;height:auto;max-width:100%}
.meta{padding:14px 15px 15px;display:flex;flex-direction:column;gap:9px;flex:1}
.row{display:flex;align-items:center;gap:9px}
.row.spread{justify-content:space-between;margin-top:auto;padding-top:4px}
.num{font-family:var(--mono);font-size:12px;color:var(--soft);font-variant-numeric:tabular-nums}
.chip{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;background:var(--chip);color:var(--soft);padding:3px 8px;border-radius:999px}
.hl{font-family:var(--serif);font-size:19px;line-height:1.18;margin:0;text-wrap:balance}
.sub{margin:0;font-size:12.5px;color:var(--soft);line-height:1.45}
.mono{font-family:var(--mono);font-size:10.5px;color:var(--soft)}
.mark{font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border-radius:999px;
  border:1px solid var(--line);background:transparent;color:var(--soft);cursor:pointer}
.mark[data-s="keep"]{color:var(--keep);border-color:var(--keep)}
.mark[data-s="cut"]{color:var(--cut);border-color:var(--cut)}
.note{margin-top:34px;padding:20px 22px;border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:4px;background:var(--surface)}
.note h2{font-family:var(--serif);font-weight:400;font-size:22px;margin:0 0 10px}
.note p{margin:0 0 9px;font-size:14px;color:var(--soft);max-width:70ch}
.note p:last-child{margin-bottom:0}
.note b{color:var(--ink);font-weight:500}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
<div class="wrap">
<header>
  <p class="kicker">LEAF · LF-1 · staged in Meta, paused</p>
  <h1>Thirty-five ads, one per ad set.</h1>
  <p class="lede">Each creative tests a single idea, so a winner points at an angle rather than a coincidence. Every line passed the compliance linter: no prescription brand names, no weight-loss claims, no price, no body imagery.</p>
  <div class="stats">
    <span><b>35</b> creatives</span><span><b>10</b> angles</span><span><b>19</b> layouts</span>
    <span><b>1080×1350</b> 4:5</span><span><b>0</b> compliance violations</span>
  </div>
</header>
<div class="bar" id="bar">
  <button class="f" data-a="all" aria-pressed="true">All 35</button>
  ${ANGLES.map(a=>`<button class="f" data-a="${a}" aria-pressed="false">${esc(LABEL[a]||a)}</button>`).join('')}
  <span class="mono" id="tally" style="margin-left:auto"></span>
</div>
<div class="grid" id="grid">${cards}</div>
<div class="note">
  <h2>Before these go live</h2>
  <p><b>Price is deliberately absent.</b> Shopify charges €49.00; the landing page shows €35.00. No ad states a price until those agree.</p>
  <p><b>Targeting is set to the United States</b>, matching the page's "free shipping only in USA" and the product shipping from the US. Change it if that's wrong.</p>
  <p><b>Everything is paused.</b> Nothing spends until you activate it.</p>
</div>
</div>
<script>
(function(){
  var KEY='lf1-marks-v1', marks={};
  try{ marks=JSON.parse(localStorage.getItem(KEY)||'{}')||{}; }catch(e){ marks={}; }
  var order=['none','keep','cut'], label={none:'Unmarked',keep:'Keep',cut:'Cut'};
  function paint(){
    var k=0,c=0;
    document.querySelectorAll('.card').forEach(function(card){
      var n=card.dataset.n, s=marks[n]||'none';
      var btn=card.querySelector('.mark');
      btn.textContent=label[s]; btn.dataset.s=s;
      if(s==='none'){card.removeAttribute('data-mark');}else{card.dataset.mark=s;}
      if(s==='keep')k++; if(s==='cut')c++;
    });
    document.getElementById('tally').textContent = (k||c) ? k+' keep · '+c+' cut' : '';
  }
  document.getElementById('grid').addEventListener('click',function(e){
    var b=e.target.closest('.mark'); if(!b)return;
    var n=b.dataset.n, s=marks[n]||'none';
    marks[n]=order[(order.indexOf(s)+1)%3];
    if(marks[n]==='none') delete marks[n];
    try{ localStorage.setItem(KEY,JSON.stringify(marks)); }catch(e){}
    paint();
  });
  document.getElementById('bar').addEventListener('click',function(e){
    var b=e.target.closest('.f'); if(!b)return;
    document.querySelectorAll('.f').forEach(function(x){x.setAttribute('aria-pressed', String(x===b));});
    var a=b.dataset.a;
    document.querySelectorAll('.card').forEach(function(c){ c.hidden = !(a==='all'||c.dataset.angle===a); });
  });
  paint();
})();
</script>`;
fs.writeFileSync(path.join(__dirname,'..','out','gallery.html'), html);
console.log('gallery.html written,', m.length, 'cards');
