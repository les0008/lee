'use strict';
/* Photo-native layouts.

   The text-only layouts were composed for flat ground and fight a photograph:
   they fill the canvas edge to edge, so anything placed behind them either
   disappears under type or collides with it. These four are built the way
   LEAF's own ads are built — a text band, a clear zone the product owns, and a
   second text band — so the photograph and the product always have room that
   no auto-fit pass can take away.

   Every ad states its plate and whether the plate already contains the bottle;
   when it does, the product zone is left empty and the photograph shows
   through it. */

const { BRAND } = require('../brand');
const L = require('./index');
const { def, esc, txt, shapeOf, headline } = L;

const shapeVals = (sh, o) => o[sh] !== undefined ? o[sh] : o.tall;

/* The bottle cut-out, or nothing when the plate already carries the product. */
function bottle(c, hU, align = 'center') {
  if (!c.bottle) return '';
  // max-height is what keeps the cut-out inside its band: without it the
  // image overflows a squeezed flex box and lands on top of the type.
  return `<img src="${c.bottleSrc}" alt="" style="height:calc(var(--u)*${hU});max-height:100%;width:auto;display:block;
    align-self:${align};filter:drop-shadow(0 calc(var(--u)*1.6) calc(var(--u)*2.6) rgba(0,0,0,.45))">`;
}

/* Footer for photo ground: wordmark left, url right, both on the photo. */
function photoFooter(c, center = false) {
  return `<div style="display:flex;align-items:center;justify-content:${center ? 'center' : 'space-between'};
      gap:calc(var(--u)*3);opacity:.9">
    <div class="wordmark">${BRAND.brand} · ${BRAND.product}</div>
    ${center ? '' : `<div class="fine" style="text-align:right">${esc(BRAND.url)}</div>`}
  </div>`;
}

/* 1 — Centred: headline above, product owns the middle, offer below.
   This is LEAF's own composition and the one the supplied ads use. */
def('photoTop', ['photo'], c => {
  const sh = shapeOf(c.fmt);
  const hs = shapeVals(sh, { wide: 6.2, square: 8.2, tall: 9.2, xtall: 10 });
  return `<div style="height:100%;display:flex;flex-direction:column;text-align:center;
      padding:calc(var(--u)*${shapeVals(sh, { wide: 6, tall: 8 })}) calc(var(--u)*7) calc(var(--u)*7)">
    <div style="display:flex;flex-direction:column;gap:calc(var(--u)*2.6);align-items:center">
      <div class="eyebrow">${txt(c.eyebrow)}</div>
      <div style="max-width:92%">${headline(c, `text-align:center;font-size:calc(var(--u)*${hs})`)}</div>
    </div>
    <div style="flex:1 1 auto;min-height:calc(var(--u)*${shapeVals(sh, { wide: 16, square: 24, tall: 28, xtall: 32 })});
        display:flex;align-items:center;justify-content:center;padding:calc(var(--u)*3.5) 0">
      ${bottle(c, shapeVals(sh, { wide: 24, square: 33, tall: 38, xtall: 44 }))}</div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*3)">
      <div class="soft" style="font-size:calc(var(--u)*${shapeVals(sh, { wide: 2.4, tall: 2.9 })});line-height:1.45;max-width:84%">${txt(c.subhead)}</div>
      <div class="cta">${esc(c.cta)}</div>
      ${photoFooter(c, true)}
    </div>
  </div>`;
});

/* 2 — Product high, argument low. Left-aligned, for the longer lines. */
def('photoLower', ['photo'], c => {
  const sh = shapeOf(c.fmt);
  const hs = shapeVals(sh, { wide: 6, square: 7.6, tall: 8.6, xtall: 9.4 });
  return `<div style="height:100%;display:flex;flex-direction:column;padding:calc(var(--u)*7)">
    <div style="flex:1 1 auto;min-height:calc(var(--u)*${shapeVals(sh, { wide: 14, square: 22, tall: 26, xtall: 30 })});
        display:flex;align-items:flex-start;justify-content:center;padding-top:calc(var(--u)*2)">
      ${bottle(c, shapeVals(sh, { wide: 22, square: 32, tall: 36, xtall: 42 }), 'flex-start')}
    </div>
    <div style="display:flex;flex-direction:column;gap:calc(var(--u)*3)">
      <div class="eyebrow">${txt(c.eyebrow)}</div>
      <div style="max-width:94%">${headline(c, `font-size:calc(var(--u)*${hs})`)}</div>
      <div class="soft" style="font-size:calc(var(--u)*${shapeVals(sh, { wide: 2.4, tall: 2.9 })});line-height:1.45;max-width:86%">${txt(c.subhead)}</div>
      <div><span class="cta">${esc(c.cta)}</span></div>
      ${photoFooter(c)}
    </div>
  </div>`;
});

/* 3 — Type left, product right. Reads as a product shot rather than a poster. */
def('photoSide', ['photo'], c => {
  const sh = shapeOf(c.fmt);
  const hs = shapeVals(sh, { wide: 5.2, square: 6.2, tall: 6.8, xtall: 7.4 });
  return `<div style="height:100%;display:flex;flex-direction:column;padding:calc(var(--u)*7)">
    <div style="flex:1;min-height:0;display:flex;align-items:center;gap:calc(var(--u)*5)">
      <div style="flex:1.5;min-width:0;padding-right:calc(var(--u)*1.5);display:flex;flex-direction:column;gap:calc(var(--u)*3)">
        <div class="eyebrow">${txt(c.eyebrow)}</div>
        ${headline(c, `font-size:calc(var(--u)*${hs})`)}
        <div class="soft" style="font-size:calc(var(--u)*${shapeVals(sh, { wide: 2.3, tall: 2.7 })});line-height:1.45">${txt(c.subhead)}</div>
        <div><span class="cta">${esc(c.cta)}</span></div>
      </div>
      <div style="flex:.85;min-width:0;display:flex;justify-content:center">
        ${bottle(c, shapeVals(sh, { wide: 30, square: 42, tall: 48, xtall: 54 }))}
      </div>
    </div>
    ${photoFooter(c)}
  </div>`;
});

/* 4 — Photograph on top, an opaque brand panel below.
   Carries the ads whose argument needs structure: a comparison, a myth, a
   figure, a set of steps. Those never read well over a photograph. */
const SLOTS = {
  plain: c => `<div class="soft" style="font-size:calc(var(--u)*2.8);line-height:1.5">${txt(c.subhead)}</div>`,

  compare: c => {
    const p = c.comparePair;
    // Capped at 2 rows a side regardless of source length -- 3 sentence-length
    // bullets a side was the single biggest driver of the "too much text"
    // feedback on the first photo round.
    const col = (title, items, accent) => `<div style="flex:1;display:flex;flex-direction:column;gap:calc(var(--u)*1.6)">
      <div style="font-family:var(--ui);font-size:calc(var(--u)*2.2);letter-spacing:.1em;text-transform:uppercase;
        color:${accent ? 'var(--accent)' : 'var(--soft)'}">${txt(title)}</div>
      ${items.slice(0, 2).map(i => `<div style="font-size:calc(var(--u)*2.3);line-height:1.35;${accent ? '' : 'opacity:.72'}">${txt(i)}</div>`).join('')}
    </div>`;
    return `<div style="display:flex;gap:calc(var(--u)*4)">
      ${col(p.aTitle, p.a, false)}
      <div style="width:1px;background:var(--line)"></div>
      ${col(p.bTitle, p.b, true)}
    </div>`;
  },

  myth: c => `<div style="display:flex;flex-direction:column;gap:calc(var(--u)*2)">
    <div style="font-size:calc(var(--u)*2.5);line-height:1.35;opacity:.55;text-decoration:line-through">${txt(c.mythPair.myth)}</div>
    <div style="display:flex;gap:calc(var(--u)*2);align-items:flex-start">
      <div style="flex:none;width:calc(var(--u)*1);align-self:stretch;background:var(--accent);border-radius:calc(var(--u)*.5)"></div>
      <div style="font-size:calc(var(--u)*2.7);line-height:1.4">${txt(c.subhead)}</div>
    </div>
  </div>`,

  stat: c => `<div style="display:flex;align-items:baseline;gap:calc(var(--u)*3)">
    <div class="display accent" style="font-size:calc(var(--u)*11);line-height:.9">${txt(c.stat.n)}</div>
    <div style="font-size:calc(var(--u)*2.5);line-height:1.35;max-width:60%">${txt(c.stat.label)}</div>
  </div>`,

  steps: c => `<div style="display:flex;flex-direction:column;gap:calc(var(--u)*1.6)">
    ${c.timelineSteps.map((s, i) => `<div style="display:flex;gap:calc(var(--u)*2);align-items:baseline">
      <div style="flex:none;font-family:var(--ui);font-size:calc(var(--u)*2.1);color:var(--accent)">${String(i + 1).padStart(2, '0')}</div>
      <div style="font-size:calc(var(--u)*2.4);line-height:1.35"><b style="font-family:var(--ui);font-weight:400">${txt(s.k)}</b> · ${txt(s.v)}</div>
    </div>`).join('')}
  </div>`,

  badges: c => `<div style="display:flex;flex-wrap:wrap;gap:calc(var(--u)*1.4)">
    ${BRAND.certs.map(t => `<div style="font-family:var(--ui);font-size:calc(var(--u)*2);padding:calc(var(--u)*1.1) calc(var(--u)*2.2);
      border:1px solid var(--line);border-radius:calc(var(--u)*6)">${txt(t)}</div>`).join('')}
  </div>`,

  label: c => {
    const rows = [['Category', 'Digestive Support'], ['Dose', BRAND.dose], ['Bottle', BRAND.capsules], ['Form', 'Vegetarian capsule']];
    return `<div style="display:flex;flex-direction:column">
      ${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:calc(var(--u)*3);
        padding:calc(var(--u)*1.5) 0;border-top:1px solid var(--line);font-size:calc(var(--u)*2.3)">
        <span style="opacity:.6">${txt(k)}</span><span style="font-family:var(--ui)">${txt(v)}</span></div>`).join('')}
    </div>`;
  },
};

def('photoPanel', ['photo'], c => {
  const sh = shapeOf(c.fmt);
  const photoPct = shapeVals(sh, { wide: 40, square: 44, tall: 46, xtall: 50 });
  const hs = shapeVals(sh, { wide: 4.8, square: 5.8, tall: 6.4, xtall: 7 });
  const slot = (SLOTS[c.panelSlot] || SLOTS.plain)(c);
  // The photo box owns its own plate rather than sitting on the full-bleed
  // layer: only the top band is visible, so each ad picks the part of the
  // frame it shows through `bgPos` instead of all of them sharing one crop.
  return `<div style="height:100%;display:flex;flex-direction:column">
    <div style="height:${photoPct}%;flex:none;position:relative;overflow:hidden;
        background-image:url('${c.plateSrc}');background-size:cover;background-position:${c.bgPos || 'center'}">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,12,9,.42) 0%,rgba(6,12,9,.10) 55%,rgba(6,12,9,.28) 100%)"></div>
      <div style="position:relative;height:100%;display:flex;align-items:flex-end;justify-content:center;
          padding:calc(var(--u)*5) calc(var(--u)*7) 0">
        ${bottle(c, shapeVals(sh, { wide: 26, square: 32, tall: 37, xtall: 41 }), 'flex-end')}
      </div>
    </div>
    <div class="panel" style="flex:1;background:var(--bg);color:var(--ink);padding:calc(var(--u)*6) calc(var(--u)*7);
        display:flex;flex-direction:column;gap:calc(var(--u)*2.8)">
      <div class="eyebrow">${txt(c.eyebrow)}</div>
      ${headline(c, `font-size:calc(var(--u)*${hs})`)}
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center">${slot}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:calc(var(--u)*3);flex-wrap:wrap">
        <span class="cta">${esc(c.cta)}</span>
        <span class="wordmark" style="opacity:.75">${BRAND.url}</span>
      </div>
    </div>
  </div>`;
});

module.exports = { SLOTS };
