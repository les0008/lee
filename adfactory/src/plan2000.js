'use strict';
/* Visual-treatment plan for the 2000-image set.

   Deterministic, not random per-run, so a re-render reproduces the same set.
   Every concept sits on one of the three supplied photographs, through a
   real colour-treatment variant -- never a substitute image, and never a
   flat/generated scene. A mixed 75/25 photo/generated split shipped first
   and was rejected outright: "they all need backgrounds. no solid colors." */
const { PANEL_SLOT } = require('./photo-plan');
const { GRADES, SOURCES } = require('./plate-variants');

const PHOTO_LAYOUTS = ['photoTop', 'photoLower', 'photoSide', 'photoPanel'];
const GRADE_KEYS = Object.keys(GRADES);
const BOTTLE_BGPOS = ['center 0%', 'center 35%', 'center 70%', 'center 100%'];

// mulberry32 -- deterministic, seedable
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

function planFor(c, i, assetPrefix) {
  const r = rng(0x9e3779b9 ^ i);

  // plateBase weighting: stone (empty, takes the bottle at any size/position)
  // is the most flexible, so it carries half the photo-mode volume.
  const roll = r();
  const plateBase = roll < 0.5 ? 'stone' : roll < 0.75 ? 'hero' : 'sand';
  const grade = GRADE_KEYS[Math.floor(r() * GRADE_KEYS.length)];
  const bottle = plateBase === 'stone';

  let photoLayout = PHOTO_LAYOUTS[Math.floor(r() * PHOTO_LAYOUTS.length)];
  if (photoLayout === 'photoPanel' && !PANEL_SLOT[c.layout]) {
    // this concept's text layout has no panel-slot mapping -- fall back to
    // a full-bleed photo layout instead of throwing at render time.
    photoLayout = PHOTO_LAYOUTS[Math.floor(r() * 3)];
  }

  const bgPos = plateBase === 'sand'
    ? 'center center' // capsule sits at the visual centre -- see photo-plan.js
    : BOTTLE_BGPOS[Math.floor(r() * BOTTLE_BGPOS.length)];

  return {
    mode: 'photo',
    photoLayout,
    plate: `${plateBase}-${grade}`,
    plateSrc: `${assetPrefix}plates/variants/${plateBase}-${grade}.png`,
    bottle,
    bottleSrc: `${assetPrefix}lf1-bottle.png`,
    bgPos,
    panelSlot: photoLayout === 'photoPanel' ? PANEL_SLOT[c.layout] : null,
  };
}

module.exports = { planFor, PHOTO_LAYOUTS, GRADE_KEYS };
