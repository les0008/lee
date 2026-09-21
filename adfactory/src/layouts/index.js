'use strict';
const { BRAND } = require('../brand');

/* Helpers ------------------------------------------------------------------ */
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// shape buckets drive per-format layout decisions
const shapeOf = f => f.id === '191x1' ? 'wide' : f.id === '9x16' ? 'xtall' : f.id === '4x5' ? 'tall' : 'square';

// Standard footer: wordmark + fine print. Kept tiny and consistent.
function footer(c, opts = {}) {
  const fine = opts.fine || BRAND.url;
  return `<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:calc(var(--u)*3)">
    <div class="wordmark">${BRAND.brand} · ${BRAND.product}</div>
    <div class="fine" style="text-align:right;max-width:52%">${esc(fine)}</div>
  </div>`;
}

function ctaPill(c) {
  return `<div class="cta">${esc(c.cta)} <span style="font-size:.85em;opacity:.8">→</span></div>`;
}

const tick = `<svg viewBox="0 0 24 24" width="1em" height="1em" style="flex:none"><path d="M4 12.5l5.2 5.2L20 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* Display size baseline per shape, in u. Auto-fit shrinks from here. */
const H1 = { wide: 7.4, square: 9.6, tall: 11.0, xtall: 12.5 };

function headline(c, extra = '') {
  const sh = shapeOf(c.fmt);
  return `<div class="display fit" data-max="${H1[sh]}" style="font-size:calc(var(--u)*${H1[sh]});${extra}">${esc(c.headline)}</div>`;
}

/* -------------------------------------------------------------------------
   Layout registry. Each returns the inner HTML of .canvas.
   Every layout must work at wide / square / tall / xtall.
   ------------------------------------------------------------------------- */
const LAYOUTS = {};
const def = (id, tags, fn) => { LAYOUTS[id] = { id, tags, fn }; };

/* 1 — Big type statement */
def('bigType', ['bold','any'], c => {
  const sh = shapeOf(c.fmt);
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:calc(var(--u)*3.2)">
      ${headline(c)}
      <div class="soft" style="font-size:calc(var(--u)*${sh==='wide'?2.6:3});line-height:1.4;max-width:${sh==='wide'?'70%':'88%'}">${esc(c.subhead)}</div>
    </div>
    <div style="display:flex;align-items:center;gap:calc(var(--u)*3);flex-wrap:wrap">${ctaPill(c)}</div>
    ${footer(c)}
  </div>`;
});

/* 2 — Horizontal split, accent block */
def('splitPanel', ['bold','any'], c => {
  const sh = shapeOf(c.fmt);
  const vertical = sh === 'wide';
  return `<div style="height:100%;display:flex;flex-direction:${vertical?'row':'column'}">
    <div style="flex:${vertical?'1.15':'1.25'};background:var(--accent);color:var(--onAccent);padding:calc(var(--u)*7);display:flex;flex-direction:column;justify-content:space-between;gap:calc(var(--u)*3)">
      <div class="eyebrow" style="color:var(--onAccent);opacity:.72">${esc(c.eyebrow)}</div>
      ${headline(c)}
    </div>
    <div style="flex:1;padding:calc(var(--u)*7);display:flex;flex-direction:column;justify-content:space-between;gap:calc(var(--u)*3)">
      <div style="font-size:calc(var(--u)*${sh==='wide'?2.7:3.1});line-height:1.45">${esc(c.subhead)}</div>
      <div style="display:flex;flex-direction:column;gap:calc(var(--u)*3)">${ctaPill(c)}${footer(c)}</div>
    </div>
  </div>`;
});

/* 3 — Checklist of product facts */
def('checklist', ['trust','any'], c => {
  const items = c.pick(c.facts, 4);
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*4)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    ${headline(c)}
    <div style="display:flex;flex-direction:column;gap:calc(var(--u)*2.2);margin-top:auto">
      ${items.map(i=>`<div style="display:flex;align-items:center;gap:calc(var(--u)*2);font-family:var(--ui);font-size:calc(var(--u)*3.2)">
        <span class="accent" style="display:flex">${tick}</span><span>${esc(i)}</span></div>`).join('')}
    </div>
    <div class="rule"></div>
    ${footer(c)}
  </div>`;
});

/* 4 — Editorial pull quote */
def('quoteCard', ['editorial','premium'], c => {
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;justify-content:center;gap:calc(var(--u)*4);text-align:center;align-items:center">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    <div class="accent" style="font-family:var(--display);font-size:calc(var(--u)*14);line-height:.6">“</div>
    ${headline(c,'text-align:center;max-width:92%')}
    <div class="rule" style="width:calc(var(--u)*14)"></div>
    <div class="soft" style="font-size:calc(var(--u)*2.8);line-height:1.5;max-width:80%">${esc(c.subhead)}</div>
    <div style="margin-top:auto;width:100%">${footer(c)}</div>
  </div>`;
});

/* 5 — Search-bar UI mimic */
def('searchBar', ['native','ui'], c => {
  const q = c.searchQuery;
  const rows = c.searchSuggestions;
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*4)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    <div style="background:var(--tint);border:1px solid var(--line);border-radius:calc(var(--u)*9);padding:calc(var(--u)*2.6) calc(var(--u)*3.4);display:flex;align-items:center;gap:calc(var(--u)*2)">
      <svg viewBox="0 0 24 24" style="width:calc(var(--u)*3);height:calc(var(--u)*3);flex:none;opacity:.55"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <span style="font-family:var(--ui);font-size:calc(var(--u)*2.9)">${esc(q)}</span>
      <span style="width:2px;height:calc(var(--u)*3.2);background:var(--accent);margin-left:2px"></span>
    </div>
    <div style="display:flex;flex-direction:column;gap:calc(var(--u)*1.6);padding-left:calc(var(--u)*1)">
      ${rows.map(r=>`<div class="soft" style="font-size:calc(var(--u)*2.4);display:flex;gap:calc(var(--u)*1.6);align-items:center">
        <span style="opacity:.45">↱</span>${esc(r)}</div>`).join('')}
    </div>
    <div class="rule"></div>
    <div style="flex:1;display:flex;align-items:center">${headline(c)}</div>
    ${ctaPill(c)}
    ${footer(c)}
  </div>`;
});

/* 6 — Notes-app aesthetic */
def('notesApp', ['native','ui'], c => {
  const items = c.pick(c.facts, 3);
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3)">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div class="eyebrow">${esc(c.eyebrow)}</div>
      <div class="fine">${esc(c.noteDate)}</div>
    </div>
    <div style="background:var(--tint);border-radius:calc(var(--u)*2.5);border:1px solid var(--line);padding:calc(var(--u)*5);display:flex;flex-direction:column;gap:calc(var(--u)*3);flex:1">
      ${headline(c)}
      <div class="soft" style="font-size:calc(var(--u)*2.7);line-height:1.5">${esc(c.subhead)}</div>
      <div style="margin-top:auto;display:flex;flex-direction:column;gap:calc(var(--u)*1.8)">
        ${items.map(i=>`<div style="display:flex;gap:calc(var(--u)*1.8);align-items:center;font-size:calc(var(--u)*2.5)">
          <span style="width:calc(var(--u)*2.4);height:calc(var(--u)*2.4);border:2px solid var(--accent);border-radius:calc(var(--u)*.6);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:calc(var(--u)*1.7)">✓</span>
          ${esc(i)}</div>`).join('')}
      </div>
    </div>
    ${footer(c)}
  </div>`;
});

/* 7 — Routine timeline (habit, never results) */
def('timeline', ['trust','any'], c => {
  const steps = c.timelineSteps;
  const sh = shapeOf(c.fmt);
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*4)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    ${headline(c)}
    <div style="margin-top:auto;display:flex;flex-direction:${sh==='wide'?'row':'column'};gap:calc(var(--u)*${sh==='wide'?3:2.4})">
      ${steps.map((s,i)=>`<div style="flex:1;display:flex;gap:calc(var(--u)*2.2);align-items:flex-start;border-top:1px solid var(--line);padding-top:calc(var(--u)*2)">
        <div class="accent" style="font-family:var(--ui);font-size:calc(var(--u)*2.2);letter-spacing:.1em">0${i+1}</div>
        <div><div style="font-family:var(--ui);font-size:calc(var(--u)*2.6)">${esc(s.k)}</div>
        <div class="fine" style="font-size:calc(var(--u)*2)">${esc(s.v)}</div></div>
      </div>`).join('')}
    </div>
    ${footer(c)}
  </div>`;
});

/* 8 — Large statistic / single fact */
def('statBlock', ['bold','any'], c => {
  const s = c.stat;
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:calc(var(--u)*1.5)">
      <div class="display accent fit" data-max="26" style="font-size:calc(var(--u)*26);line-height:.86">${esc(s.n)}</div>
      <div style="font-family:var(--ui);font-size:calc(var(--u)*3.2);letter-spacing:.02em">${esc(s.label)}</div>
    </div>
    <div class="rule"></div>
    ${headline(c,'font-size:calc(var(--u)*5.4)')}
    ${footer(c)}
  </div>`;
});

/* 9 — Supplement-facts panel aesthetic */
def('labelPanel', ['trust','clinical'], c => {
  const rows = c.pick(c.facts, 5);
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3.5)">
    ${headline(c)}
    <div style="border:calc(var(--u)*.45) solid var(--ink);padding:calc(var(--u)*3);display:flex;flex-direction:column;gap:calc(var(--u)*1.2)">
      <div style="font-family:var(--ui);font-size:calc(var(--u)*2.9);letter-spacing:.02em;border-bottom:calc(var(--u)*.3) solid var(--ink);padding-bottom:calc(var(--u)*1.2)">LF-1 — at a glance</div>
      ${rows.map(r=>`<div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:calc(var(--u)*1) 0;font-size:calc(var(--u)*2.3)">
        <span>${esc(r)}</span><span class="accent">${tick}</span></div>`).join('')}
      <div class="fine" style="padding-top:calc(var(--u)*1.2)">${esc(c.disclaimerShort)}</div>
    </div>
    <div style="margin-top:auto;display:flex;flex-direction:column;gap:calc(var(--u)*3)">${ctaPill(c)}${footer(c)}</div>
  </div>`;
});

/* 10 — Certification badge grid */
def('badgeGrid', ['trust','any'], c => {
  const sh = shapeOf(c.fmt);
  const certs = BRAND.certs.slice(0, sh==='wide'?6:8);
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*4)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    ${headline(c)}
    <div style="margin-top:auto;display:grid;grid-template-columns:repeat(${sh==='wide'?3:2},1fr);gap:calc(var(--u)*1.8)">
      ${certs.map(x=>`<div style="border:1px solid var(--line);border-radius:calc(var(--u)*1.4);padding:calc(var(--u)*1.8) calc(var(--u)*2);font-family:var(--ui);font-size:calc(var(--u)*2.15);display:flex;align-items:center;gap:calc(var(--u)*1.4)">
        <span class="accent" style="display:flex;font-size:calc(var(--u)*2)">${tick}</span>${esc(x)}</div>`).join('')}
    </div>
    ${footer(c)}
  </div>`;
});

/* 11 — FAQ card */
def('faqCard', ['native','ui'], c => {
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3.5)">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:calc(var(--u)*3)">
      <div style="display:flex;gap:calc(var(--u)*2.2)">
        <div class="accent" style="font-family:var(--display);font-size:calc(var(--u)*4.4);line-height:1">Q</div>
        ${headline(c,'font-size:calc(var(--u)*6.2)')}
      </div>
      <div class="rule"></div>
      <div style="display:flex;gap:calc(var(--u)*2.2)">
        <div class="soft" style="font-family:var(--display);font-size:calc(var(--u)*4.4);line-height:1">A</div>
        <div style="font-size:calc(var(--u)*2.9);line-height:1.5">${esc(c.subhead)}</div>
      </div>
    </div>
    ${ctaPill(c)}
    ${footer(c)}
  </div>`;
});

/* 12 — Generic vs built-for comparison */
def('compare', ['bold','clinical'], c => {
  const sh = shapeOf(c.fmt);
  const L = c.comparePair;
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3.5)">
    ${headline(c,`font-size:calc(var(--u)*${sh==='wide'?6:7.4})`)}
    <div style="flex:1;display:flex;flex-direction:${sh==='xtall'?'column':'row'};gap:calc(var(--u)*2.4);margin-top:calc(var(--u)*1);justify-content:center">
      <div style="flex:1;border:1px solid var(--line);border-radius:calc(var(--u)*2);padding:calc(var(--u)*3.4);display:flex;flex-direction:column;gap:calc(var(--u)*1.6);opacity:.8;background:var(--tint)">
        <div class="eyebrow">${esc(L.aTitle)}</div>
        ${L.a.map(x=>`<div style="font-size:calc(var(--u)*2.4);display:flex;gap:calc(var(--u)*1.4)"><span style="opacity:.5">—</span>${esc(x)}</div>`).join('')}
      </div>
      <div style="flex:1;border:calc(var(--u)*.35) solid var(--accent);border-radius:calc(var(--u)*2);padding:calc(var(--u)*3.4);display:flex;flex-direction:column;gap:calc(var(--u)*1.6);background:var(--tint)">
        <div class="eyebrow accent">${esc(L.bTitle)}</div>
        ${L.b.map(x=>`<div style="font-size:calc(var(--u)*2.4);display:flex;gap:calc(var(--u)*1.4)"><span class="accent" style="display:flex">${tick}</span>${esc(x)}</div>`).join('')}
      </div>
    </div>
    ${footer(c)}
  </div>`;
});

/* 13 — Index card with ruled lines */
def('indexCard', ['native','warm'], c => {
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*3)">
    <div style="flex:1;background:var(--tint);border-radius:calc(var(--u)*1.6);border:1px solid var(--line);position:relative;overflow:hidden;padding:calc(var(--u)*5);display:flex;flex-direction:column;gap:calc(var(--u)*3)">
      <div style="position:absolute;left:calc(var(--u)*3.4);top:0;bottom:0;width:1.5px;background:var(--accent);opacity:.35"></div>
      <div class="eyebrow">${esc(c.eyebrow)}</div>
      ${headline(c)}
      <div class="soft" style="font-size:calc(var(--u)*2.7);line-height:1.6">${esc(c.subhead)}</div>
      <div style="margin-top:auto">${ctaPill(c)}</div>
    </div>
    ${footer(c)}
  </div>`;
});

/* 14 — Typographic rule stack */
def('ruleStack', ['editorial','premium'], c => {
  const items = c.pick(c.facts, 3);
  return `<div class="pad" style="height:100%;display:flex;flex-direction:column">
    <div class="eyebrow" style="padding-bottom:calc(var(--u)*2.4)">${esc(c.eyebrow)}</div>
    <div class="rule"></div>
    <div style="flex:1;display:flex;align-items:center;padding:calc(var(--u)*4) 0">${headline(c)}</div>
    <div class="rule"></div>
    <div style="display:flex;justify-content:space-between;gap:calc(var(--u)*2);padding:calc(var(--u)*2.6) 0">
      ${items.map(i=>`<div class="fine" style="font-size:calc(var(--u)*2.1);flex:1">${esc(i)}</div>`).join('')}
    </div>
    <div class="rule"></div>
    <div style="padding-top:calc(var(--u)*2.6);display:flex;flex-direction:column;gap:calc(var(--u)*3)">
      <div class="soft" style="font-size:calc(var(--u)*2.7);line-height:1.5">${esc(c.subhead)}</div>
      ${footer(c)}
    </div>
  </div>`;
});

module.exports = { LAYOUTS, def, esc, shapeOf, footer, ctaPill, tick, headline, H1 };
