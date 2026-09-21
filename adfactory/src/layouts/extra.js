'use strict';
const { BRAND } = require('../brand');
const L = require('./index');
const { def, esc, shapeOf, footer, ctaPill, tick, headline } = L;

/* Vector capsule illustration — an honest illustration, not a simulated photo.
   If a real product cut-out is supplied it replaces this automatically. */
function capsuleSVG(scale = 1) {
  return `<svg viewBox="0 0 120 260" style="width:${scale*100}%;height:auto;overflow:visible">
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="currentColor" stop-opacity=".95"/>
        <stop offset="100%" stop-color="currentColor" stop-opacity=".62"/>
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="100" height="240" rx="50" fill="url(#cg)"/>
    <path d="M10 130 h100 v70 a50 50 0 0 1 -50 50 h0 a50 50 0 0 1 -50 -50 z" fill="currentColor" opacity=".28"/>
    <rect x="10" y="126" width="100" height="8" fill="currentColor" opacity=".18"/>
    <ellipse cx="38" cy="58" rx="12" ry="26" fill="#fff" opacity=".22"/>
  </svg>`;
}

/* 15 — Circular seal */
def('circleSeal', ['premium','editorial'], c => {
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3);align-items:center;text-align:center">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center;width:100%;position:relative">
      <div style="position:absolute;width:calc(var(--u)*56);height:calc(var(--u)*56);border:1px solid var(--line);border-radius:50%"></div>
      <div style="position:absolute;width:calc(var(--u)*46);height:calc(var(--u)*46);border:calc(var(--u)*.3) solid var(--accent);border-radius:50%;opacity:.5"></div>
      <div style="position:relative;max-width:56%">${headline(c,'text-align:center;font-size:calc(var(--u)*5.6)')}</div>
    </div>
    <div class="soft" style="font-size:calc(var(--u)*2.6);line-height:1.5;max-width:78%">${esc(c.subhead)}</div>
    <div style="width:100%">${footer(c)}</div>
  </div>`;
});

/* 16 — Numbered protocol steps */
def('numberedSteps', ['clinical','trust'], c => {
  const sh = shapeOf(c.fmt);
  const steps = c.timelineSteps;
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3.5)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    ${headline(c,`font-size:calc(var(--u)*${sh==='wide'?6.4:8})`)}
    <div style="margin-top:auto;display:flex;flex-direction:${sh==='wide'?'row':'column'};gap:calc(var(--u)*2)">
      ${steps.map((s,i)=>`<div style="flex:1;background:var(--tint);border-radius:calc(var(--u)*1.8);padding:calc(var(--u)*2.8);display:flex;gap:calc(var(--u)*2);align-items:center">
        <div style="flex:none;width:calc(var(--u)*5.4);height:calc(var(--u)*5.4);border-radius:50%;background:var(--accent);color:var(--onAccent);display:flex;align-items:center;justify-content:center;font-family:var(--ui);font-size:calc(var(--u)*2.4)">${i+1}</div>
        <div><div style="font-family:var(--ui);font-size:calc(var(--u)*2.5)">${esc(s.k)}</div>
        <div class="fine" style="font-size:calc(var(--u)*1.95)">${esc(s.v)}</div></div>
      </div>`).join('')}
    </div>
    ${footer(c)}
  </div>`;
});

/* 17 — Marquee band */
def('marquee', ['bold','any'], c => {
  const band = c.pick(c.facts, 4).join('  •  ');
  return `<div style="height:100%;display:flex;flex-direction:column">
    <div style="background:var(--accent);color:var(--onAccent);padding:calc(var(--u)*1.8) 0;overflow:hidden;white-space:nowrap">
      <div style="font-family:var(--ui);font-size:calc(var(--u)*2.3);letter-spacing:.16em;text-transform:uppercase">${esc(band)}  •  ${esc(band)}</div>
    </div>
    <div class="pad" style="flex:1;display:flex;flex-direction:column;gap:calc(var(--u)*3);justify-content:center">
      <div class="eyebrow">${esc(c.eyebrow)}</div>
      ${headline(c)}
      <div class="soft" style="font-size:calc(var(--u)*2.8);line-height:1.5;max-width:88%">${esc(c.subhead)}</div>
      ${ctaPill(c)}
    </div>
    <div style="background:var(--accent);color:var(--onAccent);padding:calc(var(--u)*1.8) 0;overflow:hidden;white-space:nowrap">
      <div style="font-family:var(--ui);font-size:calc(var(--u)*2.3);letter-spacing:.16em;text-transform:uppercase">${esc(band)}  •  ${esc(band)}</div>
    </div>
  </div>`;
});

/* 18 — Soft gradient hero */
def('gradientHero', ['premium','calm'], c => {
  return `<div style="height:100%;position:relative">
    <div style="position:absolute;inset:0;overflow:hidden">
      <div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 18% 8%, var(--tint) 0%, var(--bg) 62%)"></div>
      <div style="position:absolute;width:calc(var(--u)*52);height:calc(var(--u)*52);right:calc(var(--u)*-12);bottom:calc(var(--u)*-14);border-radius:50%;background:var(--accent);opacity:.14;filter:blur(calc(var(--u)*2))"></div>
    </div>
    <div class="pad" style="position:relative;height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3)">
      <div class="eyebrow">${esc(c.eyebrow)}</div>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:calc(var(--u)*3)">
        ${headline(c)}
        <div class="soft" style="font-size:calc(var(--u)*2.9);line-height:1.5;max-width:82%">${esc(c.subhead)}</div>
      </div>
      ${ctaPill(c)}
      ${footer(c)}
    </div>
  </div>`;
});

/* 19 — Sticky note */
def('stickyNote', ['warm','native'], c => {
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3);justify-content:center">
    <div style="background:var(--accent);color:var(--onAccent);border-radius:calc(var(--u)*1);padding:calc(var(--u)*5.5);transform:rotate(-1.6deg);box-shadow:0 calc(var(--u)*1.4) calc(var(--u)*3.4) rgba(0,0,0,.14);display:flex;flex-direction:column;gap:calc(var(--u)*2.6)">
      <div class="eyebrow" style="color:var(--onAccent);opacity:.7">${esc(c.eyebrow)}</div>
      ${headline(c,'font-size:calc(var(--u)*7.6)')}
      <div style="font-size:calc(var(--u)*2.6);line-height:1.5;opacity:.85">${esc(c.subhead)}</div>
    </div>
    <div style="margin-top:auto">${footer(c)}</div>
  </div>`;
});

/* 20 — Two-card pairing: the prescription and the companion */
def('prescriptionPair', ['clinical','trust'], c => {
  const sh = shapeOf(c.fmt);
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3.5)">
    ${headline(c,`font-size:calc(var(--u)*${sh==='wide'?6:7.6})`)}
    <div style="flex:1;display:flex;flex-direction:${sh==='xtall'?'column':'row'};gap:calc(var(--u)*2.4);align-items:${sh==='xtall'?'stretch':'stretch'};justify-content:center">
      <div style="flex:1;border:1px dashed var(--line);border-radius:calc(var(--u)*2);padding:calc(var(--u)*3.4);display:flex;flex-direction:column;gap:calc(var(--u)*1.4);justify-content:center">
        <div class="eyebrow" style="font-size:calc(var(--u)*2.4)">Your GLP-1</div>
        <div style="font-family:var(--ui);font-size:calc(var(--u)*3.4);line-height:1.3">Prescribed by your clinician</div>
        <div class="fine">LF-1 does not replace it.</div>
      </div>
      <div style="flex:none;display:flex;align-items:center;justify-content:center;color:var(--soft);font-size:calc(var(--u)*3.6)">+</div>
      <div style="flex:1;background:var(--tint);border:calc(var(--u)*.3) solid var(--accent);border-radius:calc(var(--u)*2);padding:calc(var(--u)*3.4);display:flex;flex-direction:column;gap:calc(var(--u)*1.4);justify-content:center">
        <div class="eyebrow accent" style="font-size:calc(var(--u)*2.4)">LF-1</div>
        <div style="font-family:var(--ui);font-size:calc(var(--u)*3.4);line-height:1.3">Daily digestive support</div>
        <div class="fine">${esc(BRAND.dose)} · ${esc(BRAND.capsules)}</div>
      </div>
    </div>
    ${footer(c)}
  </div>`;
});

/* 21 — Framed centred statement */
def('boxFrame', ['editorial','premium'], c => {
  return `<div class="pad" style="height:100%;display:flex">
    <div style="flex:1;border:1px solid var(--line);padding:calc(var(--u)*6);display:flex;flex-direction:column;gap:calc(var(--u)*3.5);align-items:center;text-align:center;justify-content:center">
      <div class="eyebrow">${esc(c.eyebrow)}</div>
      ${headline(c,'text-align:center')}
      <div class="rule" style="width:calc(var(--u)*12)"></div>
      <div class="soft" style="font-size:calc(var(--u)*2.7);line-height:1.55;max-width:84%">${esc(c.subhead)}</div>
      ${ctaPill(c)}
      <div style="margin-top:auto;width:100%">${footer(c)}</div>
    </div>
  </div>`;
});

/* 22 — Product slot. Uses a real cut-out when supplied, vector capsule otherwise. */
def('productSlot', ['any','premium'], c => {
  const sh = shapeOf(c.fmt);
  const art = c.productImage
    ? `<img src="${esc(c.productImage)}" style="max-width:100%;max-height:100%;object-fit:contain;position:relative"/>`
    : `<div class="accent" style="height:72%;display:flex;align-items:center;position:relative">
         <svg viewBox="0 0 120 260" style="height:100%;width:auto;overflow:visible">
           <rect x="10" y="10" width="100" height="240" rx="50" fill="currentColor" opacity=".92"/>
           <path d="M10 130 h100 v70 a50 50 0 0 1 -50 50 h0 a50 50 0 0 1 -50 -50 z" fill="currentColor" opacity=".3"/>
           <rect x="10" y="126" width="100" height="8" fill="currentColor" opacity=".2"/>
           <ellipse cx="38" cy="58" rx="12" ry="26" fill="#fff" opacity=".22"/>
         </svg></div>`;
  return `<div style="height:100%;display:flex;flex-direction:${sh==='wide'?'row':'column'}">
    <div style="flex:${sh==='wide'?'0 0 42%':'0 0 44%'};background:var(--tint);display:flex;align-items:center;justify-content:center;padding:calc(var(--u)*4);position:relative;overflow:hidden">
      <div style="position:absolute;width:calc(var(--u)*40);height:calc(var(--u)*40);border-radius:50%;background:var(--accent);opacity:.1"></div>
      ${art}
    </div>
    <div class="pad" style="flex:1;display:flex;flex-direction:column;gap:calc(var(--u)*2.6);justify-content:center;min-height:0">
      <div class="eyebrow">${esc(c.eyebrow)}</div>
      ${headline(c,`font-size:calc(var(--u)*${sh==='wide'?6:7.4})`)}
      <div class="soft" style="font-size:calc(var(--u)*2.7);line-height:1.5">${esc(c.subhead)}</div>
      ${ctaPill(c)}
      ${footer(c)}
    </div>
  </div>`;
});

/* 23 — Myth vs fact */
def('mythFact', ['clinical','bold'], c => {
  const m = c.mythPair;
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3.5)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:calc(var(--u)*3)">
      <div style="display:flex;gap:calc(var(--u)*2.2);align-items:flex-start;opacity:.6">
        <div style="flex:none;font-family:var(--ui);font-size:calc(var(--u)*2.1);letter-spacing:.14em;text-transform:uppercase;padding-top:calc(var(--u)*.5)">Myth</div>
        <div style="font-size:calc(var(--u)*4);line-height:1.3;text-decoration:line-through;text-decoration-thickness:2px">${esc(m.myth)}</div>
      </div>
      <div class="rule"></div>
      <div style="display:flex;gap:calc(var(--u)*2.2);align-items:flex-start">
        <div class="accent" style="flex:none;font-family:var(--ui);font-size:calc(var(--u)*2.1);letter-spacing:.14em;text-transform:uppercase;padding-top:calc(var(--u)*.5)">Fact</div>
        ${headline(c,'font-size:calc(var(--u)*6.2)')}
      </div>
    </div>
    ${ctaPill(c)}
    ${footer(c)}
  </div>`;
});

module.exports = L;

/* ---- Benchmark-grade layouts, modelled on the restraint of the reference ads:
   centred wordmark, one idea, enormous negative space, small-caps kicker. ---- */

function capsuleArt(scale) {
  return `<svg viewBox="0 0 120 300" style="height:${scale};width:auto;overflow:visible">
    <defs><linearGradient id="cp" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="currentColor" stop-opacity=".95"/>
      <stop offset="100%" stop-color="currentColor" stop-opacity=".55"/></linearGradient></defs>
    <rect x="12" y="8" width="96" height="284" rx="48" fill="url(#cp)"/>
    <path d="M12 150 h96 v94 a48 48 0 0 1 -48 48 h0 a48 48 0 0 1 -48 -48 z" fill="currentColor" opacity=".26"/>
    <rect x="12" y="146" width="96" height="7" fill="currentColor" opacity=".16"/>
    <ellipse cx="40" cy="62" rx="11" ry="28" fill="#fff" opacity=".2"/>
  </svg>`;
}

/* 24 — Centred hero. One line, one object, nothing else. */
def('centeredHero', ['premium','any'], c => {
  const sh = shapeOf(c.fmt);
  const art = c.productImage
    ? `<img src="${esc(c.productImage)}" style="max-height:100%;max-width:70%;object-fit:contain"/>`
    : `<div class="accent" style="display:flex;height:100%;align-items:center">${capsuleArt('100%')}</div>`;
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;gap:calc(var(--u)*3)">
    <div class="wordmark" style="font-size:calc(var(--u)*2.9);letter-spacing:.3em">${esc(BRAND.brand)}</div>
    ${headline(c, `font-weight:400;max-width:${sh==='wide'?'70%':'94%'};text-align:center`)}
    <div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;width:100%;padding:calc(var(--u)*2) 0">${art}</div>
    <div style="font-family:var(--ui);font-size:calc(var(--u)*2.1);letter-spacing:.2em;text-transform:uppercase;line-height:1.7;color:var(--soft)">${esc(c.subhead)}</div>
    <div class="fine" style="opacity:.7">${esc(BRAND.url)}</div>
  </div>`;
});

/* 25 — Myth / Fact. The fact is the ad; the myth is the setup. */
def('mythFactPill', ['bold','any'], c => {
  const m = c.mythPair;
  const pill = (label, dim) => `<div style="display:inline-flex;align-items:center;justify-content:center;
    border:calc(var(--u)*.26) solid ${dim?'var(--soft)':'var(--accent)'};color:${dim?'var(--soft)':'var(--accent)'};
    border-radius:calc(var(--u)*10);padding:calc(var(--u)*1.3) calc(var(--u)*4);
    font-family:var(--ui);font-size:calc(var(--u)*2.5);letter-spacing:.2em;text-transform:uppercase">${label}</div>`;
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;gap:calc(var(--u)*2.5)">
    <div class="wordmark" style="font-size:calc(var(--u)*2.9);letter-spacing:.3em">${esc(BRAND.brand)}</div>
    <div style="flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--u)*4);width:100%">
      <div style="display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*2.2);width:100%">
        ${pill('Myth', true)}
        <div class="soft" style="font-size:calc(var(--u)*4);line-height:1.25;max-width:88%;text-decoration:line-through;text-decoration-thickness:calc(var(--u)*.14);text-decoration-color:var(--soft)">${esc(m.myth)}</div>
      </div>
      <div style="width:calc(var(--u)*10);height:1px;background:var(--line)"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*2.2);width:100%">
        ${pill('Fact', false)}
        ${headline(c, 'font-size:calc(var(--u)*6.4);text-align:center;max-width:92%')}
      </div>
    </div>
    <div style="font-family:var(--ui);font-size:calc(var(--u)*2.1);letter-spacing:.18em;text-transform:uppercase;color:var(--soft);line-height:1.6">${esc(c.subhead)}</div>
    <div class="fine" style="opacity:.7">${esc(BRAND.url)}</div>
  </div>`;
});

/* 26 — Two-panel contrast, without the organ diagrams. */
def('contrastPanel', ['bold','clinical'], c => {
  const L = c.comparePair;
  const col = (title, items, on) => `<div style="flex:1;display:flex;flex-direction:column;gap:calc(var(--u)*1.8);
    padding:calc(var(--u)*3.2);border-radius:calc(var(--u)*2);
    ${on?'background:var(--tint);border:calc(var(--u)*.28) solid var(--accent)':'border:1px solid var(--line);opacity:.72'}">
    <div class="eyebrow" style="${on?'color:var(--accent)':''}">${esc(title)}</div>
    ${items.map(x=>`<div style="font-size:calc(var(--u)*2.35);line-height:1.35;display:flex;gap:calc(var(--u)*1.3)">
      <span style="${on?'color:var(--accent)':'opacity:.5'};flex:none">${on?'✓':'—'}</span>${esc(x)}</div>`).join('')}
  </div>`;
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3.2)">
    ${headline(c, 'font-size:calc(var(--u)*' + (shapeOf(c.fmt)==='wide' ? 6 : 7.6) + ')')}
    <div style="flex:1;display:flex;gap:calc(var(--u)*2.2);align-items:stretch">
      ${col(L.aTitle, L.a, false)}${col(L.bTitle, L.b, true)}
    </div>
    ${footer(c)}
  </div>`;
});
