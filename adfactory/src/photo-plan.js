'use strict';
/* Which photograph each of the 35 launch creatives is built on, and how.

   Assigned by hand rather than rotated. The plate decides what the product
   zone may contain: `hero` already holds the bottle at the exact height the
   centred layout leaves clear, `sand` holds the capsule there, and `stone` is
   empty, so only `stone` takes the cut-out bottle at any size or position.
   Panel creatives show one band of their plate, so they also choose which band
   through `bgPos` — that is what keeps fifteen panel ads from looking alike. */

const PLATES = {
  stone: { src: 'plates/stone.png', empty: true  },  // ledge scene, no product
  hero:  { src: 'plates/hero.png',  empty: false },  // product in frame
  sand:  { src: 'plates/sand.png',  empty: false },  // capsule in frame
};

/* Structured arguments do not survive being set over a photograph; they go in
   the opaque panel, and the slot says which structure to draw. */
const PANEL_SLOT = {
  contrastPanel: 'compare',
  mythFactPill:  'myth',
  statBlock:     'stat',
  labelPanel:    'label',
  timeline:      'steps',
  numberedSteps: 'steps',
  badgeGrid:     'badges',
};

/* id -> [layout, plate, bottle, bgPos]. bgPos applies to panel ads only. */
const PLAN = {
  '01': ['photoTop',   'hero',  false], '02': ['photoTop',   'stone', true ],
  '03': ['photoPanel', 'stone', true,  'center 0%'  ],
  '04': ['photoPanel', 'sand',  false, 'center 30%' ],
  '05': ['photoPanel', 'stone', true,  'center 70%' ],
  '06': ['photoSide',  'stone', true ], '07': ['photoTop',   'sand',  false],
  '08': ['photoLower', 'stone', true ], '09': ['photoSide',  'stone', true ],
  '10': ['photoTop',   'hero',  false], '11': ['photoLower', 'stone', true ],
  '12': ['photoTop',   'sand',  false], '13': ['photoSide',  'stone', true ],
  '14': ['photoPanel', 'sand',  false, 'center 60%' ],
  '15': ['photoPanel', 'stone', true,  'center 0%'  ],
  '16': ['photoPanel', 'stone', true,  'center 35%' ],
  '17': ['photoLower', 'sand',  false], '18': ['photoSide',  'stone', true ],
  '19': ['photoPanel', 'sand',  false, 'center 30%' ],
  '20': ['photoTop',   'stone', true ], '21': ['photoTop',   'sand',  false],
  '22': ['photoPanel', 'stone', true,  'center 70%' ],
  '23': ['photoPanel', 'sand',  false, 'center 60%' ],
  '24': ['photoLower', 'stone', true ],
  '25': ['photoTop',   'stone', true ],
  '26': ['photoPanel', 'stone', true,  'center 0%'  ],
  '27': ['photoPanel', 'stone', true,  'center 35%' ],
  '28': ['photoTop',   'stone', true ],
  '29': ['photoPanel', 'sand',  false, 'center 30%' ],
  '30': ['photoPanel', 'stone', true,  'center 70%' ],
  '31': ['photoPanel', 'sand',  false, 'center 60%' ],
  '32': ['photoPanel', 'stone', true,  'center 0%'  ],
  '33': ['photoLower', 'stone', true ], '34': ['photoLower', 'sand',  false],
  '35': ['photoTop',   'sand',  false],
};

/* Full-bleed scrims. Each darkens exactly where its layout puts type and lets
   the photograph come back where the product sits. */
const SCRIM = {
  photoTop:   'linear-gradient(180deg,rgba(5,11,8,.70) 0%,rgba(5,11,8,.30) 34%,rgba(5,11,8,.34) 64%,rgba(5,11,8,.82) 100%)',
  photoLower: 'linear-gradient(180deg,rgba(5,11,8,.32) 0%,rgba(5,11,8,.15) 38%,rgba(5,11,8,.70) 66%,rgba(5,11,8,.93) 100%)',
  photoSide:  'linear-gradient(100deg,rgba(5,11,8,.88) 0%,rgba(5,11,8,.66) 46%,rgba(5,11,8,.26) 76%,rgba(5,11,8,.40) 100%)',
};

/* White type on photographic ground, with the brand yellow kept for the CTA. */
const PHOTO_PALETTE = {
  id: 'photo', mood: 'premium',
  bg: '#0B1410', ink: '#FFFFFF', soft: 'rgba(255,255,255,.82)',
  accent: '#F0B429', onAccent: '#14231C',
  line: 'rgba(255,255,255,.30)', tint: 'rgba(255,255,255,.10)',
};

/* Apply the plan to a built creative, in place. */
function apply(c, assetPrefix) {
  const row = PLAN[c.id];
  if (!row) throw new Error(`no photo plan for ad ${c.id}`);
  const [layout, plateId, bottle, bgPos] = row;
  const plate = PLATES[plateId];
  if (bottle && !plate.empty) throw new Error(`ad ${c.id}: ${plateId} already holds a product`);

  c.photoLayout = layout;
  c.plate = plateId;
  c.plateSrc = assetPrefix + plate.src;
  c.bottle = bottle;
  c.bottleSrc = assetPrefix + 'lf1-bottle.png';
  c.bgPos = bgPos || 'center';
  c.scrim = SCRIM[layout] || null;
  c.panelSlot = layout === 'photoPanel' ? (PANEL_SLOT[c.layout] || 'plain') : null;
  if (layout === 'photoPanel' && !PANEL_SLOT[c.layout])
    throw new Error(`ad ${c.id}: panel layout without a slot (from ${c.layout})`);
  return c;
}

module.exports = { PLAN, PLATES, PANEL_SLOT, SCRIM, PHOTO_PALETTE, apply };
