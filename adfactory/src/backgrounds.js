'use strict';
/* Generated backgrounds. Built, not borrowed — competitor photography is not
   ours to use. Each kind layers gradient light, form and grain so the ad reads
   as a photographed scene rather than a flat fill. */

function leafPath(){ return 'M50,2 C86,26 86,74 50,98 C14,74 14,26 50,2 Z'; }

/* Scattered botanical forms — the LEAF landing page's own signature. */
function botanicalForms(tint, n, seed){
  let s = seed, out = '';
  const r = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = 0; i < n; i++){
    const x = r()*120-10, y = r()*120-10, sc = .35 + r()*1.25, rot = r()*360, op = .05 + r()*.14;
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${sc.toFixed(2)})" opacity="${op.toFixed(3)}">
      <path d="${leafPath()}" fill="${tint}"/>
      <path d="M50,4 L50,96" stroke="${tint}" stroke-width="1.6" opacity=".55" fill="none"/>
    </g>`;
  }
  return out;
}

const GRAIN = `<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`;

const KINDS = {
  /* Deep botanical — LEAF's hero. Dark green, layered leaves, a shaft of light. */
  botanical(pal){
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">
      <defs>
        <linearGradient id="bgg" x1="0" y1="0" x2=".35" y2="1">
          <stop offset="0%" stop-color="#17493A"/><stop offset="55%" stop-color="#0E2F24"/><stop offset="100%" stop-color="#071A14"/>
        </linearGradient>
        <radialGradient id="shaft" cx="22%" cy="8%" r="78%">
          <stop offset="0%" stop-color="#8FD6A8" stop-opacity=".30"/><stop offset="60%" stop-color="#8FD6A8" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="vig" cx="50%" cy="46%" r="72%">
          <stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/>
        </radialGradient>
        ${GRAIN}
      </defs>
      <rect width="100" height="100" fill="url(#bgg)"/>
      ${botanicalForms('#0A2B20', 16, 7)}
      ${botanicalForms('#63B187', 7, 91)}
      <rect width="100" height="100" fill="url(#shaft)"/>
      <rect width="100" height="100" fill="url(#vig)"/>
      <rect width="100" height="100" filter="url(#gr)" opacity=".05"/>
    </svg>`;
  },
  /* Studio — a lit object on seamless dark ground, with a floor reflection. */
  studio(pal){
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1A1A1D"/><stop offset="52%" stop-color="#0C0C0E"/><stop offset="100%" stop-color="#161618"/>
        </linearGradient>
        <radialGradient id="spot" cx="50%" cy="38%" r="52%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="floor" cx="50%" cy="88%" r="42%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".07"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
        ${GRAIN}
      </defs>
      <rect width="100" height="100" fill="url(#sg)"/>
      <rect width="100" height="100" fill="url(#spot)"/>
      <rect width="100" height="100" fill="url(#floor)"/>
      <rect width="100" height="100" filter="url(#gr)" opacity=".06"/>
    </svg>`;
  },
  /* Warm light — sunlit paper. Cream ground, low warm sun, soft falloff. */
  warmLight(pal){
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">
      <defs>
        <linearGradient id="wg" x1=".1" y1="0" x2=".9" y2="1">
          <stop offset="0%" stop-color="#FFFDF7"/><stop offset="60%" stop-color="${pal.bg}"/><stop offset="100%" stop-color="#EFE7D6"/>
        </linearGradient>
        <radialGradient id="sun" cx="78%" cy="14%" r="62%">
          <stop offset="0%" stop-color="#F0B429" stop-opacity=".22"/><stop offset="100%" stop-color="#F0B429" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="wvig" cx="50%" cy="50%" r="76%">
          <stop offset="60%" stop-color="#6B5A3A" stop-opacity="0"/><stop offset="100%" stop-color="#6B5A3A" stop-opacity=".16"/>
        </radialGradient>
        ${GRAIN}
      </defs>
      <rect width="100" height="100" fill="url(#wg)"/>
      ${botanicalForms('#C9B78E', 9, 23)}
      <rect width="100" height="100" fill="url(#sun)"/>
      <rect width="100" height="100" fill="url(#wvig)"/>
      <rect width="100" height="100" filter="url(#gr)" opacity=".045"/>
    </svg>`;
  },
  /* Mist — soft atmospheric green, for the calmer angles. */
  mist(pal){
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2=".4" y2="1">
          <stop offset="0%" stop-color="#EAF2EC"/><stop offset="55%" stop-color="${pal.bg}"/><stop offset="100%" stop-color="#C6D6CB"/>
        </linearGradient>
        <radialGradient id="mlight" cx="26%" cy="16%" r="70%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
        ${GRAIN}
      </defs>
      <rect width="100" height="100" fill="url(#mg)"/>
      ${botanicalForms('#8FAE99', 12, 55)}
      <rect width="100" height="100" fill="url(#mlight)"/>
      <rect width="100" height="100" filter="url(#gr)" opacity=".04"/>
    </svg>`;
  },
  flat(pal){ return ''; },
};

/* A real photograph, when one is supplied, with a legibility scrim. */
function photo(src, scrim){
  const g = scrim === 'light'
    ? 'linear-gradient(180deg, rgba(255,255,255,.86) 0%, rgba(255,255,255,.62) 46%, rgba(255,255,255,.86) 100%)'
    : 'linear-gradient(180deg, rgba(6,14,10,.72) 0%, rgba(6,14,10,.46) 46%, rgba(6,14,10,.82) 100%)';
  return `<div style="position:absolute;inset:0;background-image:url('${src}');background-size:cover;background-position:center"></div>
          <div style="position:absolute;inset:0;background:${g}"></div>`;
}

const FOR_PALETTE = { leafDeep:'botanical', leafNoir:'studio', leafCream:'warmLight', sand:'warmLight', sage:'mist', mint:'mist' };

function render(c, pal){
  if (c.bgImage) return photo(c.bgImage, c.bgScrim || (pal.bg.match(/^#[0-3]/) ? 'dark' : 'light'));
  const kind = c.bg || FOR_PALETTE[c.palette] || 'flat';
  return (KINDS[kind] || KINDS.flat)(pal);
}

module.exports = { render, KINDS, FOR_PALETTE };
