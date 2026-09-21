'use strict';
/* LF-1 / LEAF — design tokens.
   Every dimension is expressed in `u` units where 1u = canvasWidth/100.
   That makes a single layout render correctly at 1:1, 4:5, 9:16 and 1.91:1. */

const FONT_DIR = 'node_modules/@fontsource';

// family key -> [package, file basename]
const FONTS = {
  anton:     ['anton', 'anton-latin-400-normal'],
  archivoBk: ['archivo', 'archivo-latin-700-normal'],
  archivoMd: ['archivo', 'archivo-latin-500-normal'],
  bebas:     ['bebas-neue', 'bebas-neue-latin-400-normal'],
  serif:     ['instrument-serif', 'instrument-serif-latin-400-normal'],
  serifIt:   ['instrument-serif', 'instrument-serif-latin-400-italic'],
  fraunces:  ['fraunces', 'fraunces-latin-600-normal'],
  inter:     ['inter', 'inter-latin-400-normal'],
  interMd:   ['inter', 'inter-latin-500-normal'],
  interSb:   ['inter', 'inter-latin-600-normal'],
  interBd:   ['inter', 'inter-latin-700-normal'],
  manrope:   ['manrope', 'manrope-latin-500-normal'],
  manropeBd: ['manrope', 'manrope-latin-800-normal'],
  dmsans:    ['dm-sans', 'dm-sans-latin-500-normal'],
};

function fontFaceCSS() {
  return Object.entries(FONTS).map(([k, [pkg, file]]) =>
    `@font-face{font-family:'${k}';src:url('${FONT_DIR}/${pkg}/files/${file}.woff2') format('woff2');font-display:block;}`
  ).join('\n');
}

/* ---- Palettes -------------------------------------------------------------
   Each: bg, ink (primary text), soft (secondary text), accent (highlight/CTA),
   onAccent, line (hairlines), tint (panel fill).
   `mood` drives which type pairings the composer will allow.             */
const PALETTES = [
  /* Pulled from the live LF-1 landing page: cream #FCFCF7 section fill,
     deep botanical green, and the yellow used on every CTA and the bottle. */
  { id:'leafCream', mood:'editorial',bg:'#FCFCF7', ink:'#14231C', soft:'#5E6B63', accent:'#F0B429', onAccent:'#14231C', line:'#E6E2D6', tint:'#F3EFE3' },
  { id:'leafDeep',  mood:'premium',  bg:'#0E2F24', ink:'#F7F5EC', soft:'#A6C0B1', accent:'#F0B429', onAccent:'#14231C', line:'#1F4737', tint:'#16382B' },
  { id:'leafNoir',  mood:'bold',     bg:'#0B0B0C', ink:'#FAFAF8', soft:'#989894', accent:'#F0B429', onAccent:'#0B0B0C', line:'#232326', tint:'#141416' },
  { id:'forest',    mood:'premium',  bg:'#0E3B2E', ink:'#F5F2E8', soft:'#A9C4B5', accent:'#D8F24E', onAccent:'#0E3B2E', line:'#2A5A49', tint:'#17493A' },
  { id:'bone',      mood:'editorial',bg:'#F2EFE4', ink:'#14231C', soft:'#5C6B62', accent:'#0E3B2E', onAccent:'#F5F2E8', line:'#D9D3C2', tint:'#E8E3D3' },
  { id:'sage',      mood:'calm',     bg:'#DCE5D8', ink:'#1B2F25', soft:'#556A5C', accent:'#0E3B2E', onAccent:'#F5F2E8', line:'#C3D0BD', tint:'#CEDAC9' },
  { id:'clay',      mood:'warm',     bg:'#E9DCCB', ink:'#33241A', soft:'#6E5B4A', accent:'#B4552D', onAccent:'#FBF6EF', line:'#D6C4AE', tint:'#DFCDB7' },
  { id:'ink',       mood:'bold',     bg:'#12141A', ink:'#F4F5F2', soft:'#9AA0A6', accent:'#D8F24E', onAccent:'#12141A', line:'#2A2E38', tint:'#1C1F27' },
  { id:'clinical',  mood:'clinical', bg:'#FFFFFF', ink:'#101820', soft:'#5A6672', accent:'#0E7C5A', onAccent:'#FFFFFF', line:'#E3E7EA', tint:'#F3F6F5' },
  { id:'sand',      mood:'warm',     bg:'#F0E7D8', ink:'#23302A', soft:'#63705F', accent:'#0E3B2E', onAccent:'#F5F2E8', line:'#DDD1BC', tint:'#E6DAC7' },
  { id:'mint',      mood:'calm',     bg:'#E4F0E9', ink:'#0F2A20', soft:'#4E6B5E', accent:'#116B4C', onAccent:'#FFFFFF', line:'#CBE0D4', tint:'#D6E8DD' },
];
const PALETTE_BY_ID = Object.fromEntries(PALETTES.map(p => [p.id, p]));

/* ---- Type pairings -------------------------------------------------------- */
const TYPESETS = [
  { id:'impact',    moods:['bold','premium','clinical'], display:'anton',     dTrack:'-0.005em', dCase:'uppercase', body:'inter',   ui:'interSb' },
  { id:'grotesk',   moods:['bold','clinical','calm'],    display:'archivoBk', dTrack:'-0.025em', dCase:'none',      body:'inter',   ui:'interSb' },
  { id:'editorial', moods:['editorial','premium','warm'],display:'serif',     dTrack:'-0.015em', dCase:'none',      body:'inter',   ui:'interMd' },
  { id:'luxe',      moods:['premium','warm','editorial'],display:'fraunces',  dTrack:'-0.02em',  dCase:'none',      body:'manrope', ui:'interMd' },
  { id:'condensed', moods:['bold','clinical'],           display:'bebas',     dTrack:'0.01em',   dCase:'uppercase', body:'dmsans',  ui:'interSb' },
  { id:'humanist',  moods:['calm','clinical','editorial'],display:'manropeBd',dTrack:'-0.02em',  dCase:'none',      body:'inter',   ui:'interMd' },
];

/* ---- Canvas formats ------------------------------------------------------- */
const FORMATS = [
  { id:'1x1',   w:1080, h:1080, label:'Feed square',     placement:'facebook_feed,instagram_feed' },
  { id:'4x5',   w:1080, h:1350, label:'Feed portrait',   placement:'facebook_feed,instagram_feed' },
  { id:'9x16',  w:1080, h:1920, label:'Story / Reel',    placement:'instagram_story,facebook_story,instagram_reels' },
  { id:'191x1', w:1200, h:628,  label:'Right column',    placement:'facebook_right_column,audience_network' },
];

const BRAND = {
  product: 'LF-1',
  brand: 'LEAF',
  url: 'leaf-pure.com',
  price: '€49',
  capsules: '60 capsules',
  dose: '2 capsules daily',
  fdaDisclaimer: 'These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.',
  certs: ['Non-GMO','Gluten-free','Lactose-free','Allergen-free','Antibiotic-free','Hormone-free','Alcohol-free','Vegetarian'],
};

/* Base stylesheet shared by every layout. */
function baseCSS(fmt, pal, ts) {
  const u = fmt.w / 100;
  return `
${fontFaceCSS()}
*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
:root{
  --u:${u}px; --w:${fmt.w}px; --h:${fmt.h}px;
  --bg:${pal.bg}; --ink:${pal.ink}; --soft:${pal.soft};
  --accent:${pal.accent}; --onAccent:${pal.onAccent};
  --line:${pal.line}; --tint:${pal.tint};
  --display:'${ts.display}'; --body:'${ts.body}'; --ui:'${ts.ui}';
  --dTrack:${ts.dTrack};
}
html,body{width:var(--w);height:var(--h);overflow:hidden}
body{background:var(--bg);color:var(--ink);font-family:var(--body);position:relative}
.canvas{width:var(--w);height:var(--h);position:relative;overflow:hidden;display:flex;flex-direction:column}
/* very subtle paper grain so flat fills don't read as digital emptiness */
.canvas::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:${process.env.LF1_GRAIN?'.035':'0'};display:${process.env.LF1_GRAIN?'block':'none'};
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");}
.display{font-family:var(--display);letter-spacing:var(--dTrack);line-height:.96;text-transform:${ts.dCase};overflow-wrap:normal;hyphens:none;word-break:normal}
.pad{padding:calc(var(--u)*7)}
.soft{color:var(--soft)}
.accent{color:var(--accent)}
.rule{height:1px;background:var(--line);width:100%}
.eyebrow{font-family:var(--ui);font-size:calc(var(--u)*2.5);letter-spacing:.14em;text-transform:uppercase;color:var(--soft)}
.cta{display:inline-flex;align-items:center;gap:calc(var(--u)*1.4);background:var(--accent);color:var(--onAccent);
  font-family:var(--ui);font-size:calc(var(--u)*3.3);letter-spacing:.01em;
  padding:calc(var(--u)*2.4) calc(var(--u)*4.2);border-radius:calc(var(--u)*10)}
.wordmark{font-family:var(--ui);font-size:calc(var(--u)*2.7);letter-spacing:.24em;text-transform:uppercase;white-space:nowrap}
.fine{font-family:var(--body);font-size:calc(var(--u)*1.45);line-height:1.35;color:var(--soft);opacity:.85}
.stars{color:var(--accent);letter-spacing:.06em}
.spacer{flex:1}
`;
}

module.exports = { FONTS, FONT_DIR, fontFaceCSS, PALETTES, PALETTE_BY_ID, TYPESETS, FORMATS, BRAND, baseCSS };
