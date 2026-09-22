'use strict';
/* Colour-treatment variants of the three supplied plates.

   The brief is "all ad images use the backgrounds I gave you" — at 2000
   images that can't mean 2000 identical crops of 3 files, so the variety
   comes from real photographic treatment of the same three source photos
   (grade, contrast, vignette strength), not from substituting other images.
   Every variant traces back to one of the three plates. */
const sharp = require('sharp');
const fs = require('fs');

const SOURCES = ['stone', 'hero', 'sand'];

// name -> sharp .modulate()/.linear()/tint options. Kept photographic --
// no colour that would misrepresent the product (yellow label, white bottle).
const GRADES = {
  true:    { modulate: { brightness: 1.00, saturation: 1.00 } },
  warm:    { modulate: { brightness: 1.04, saturation: 1.08 }, tint: '#fff3e0' },
  cool:    { modulate: { brightness: 0.98, saturation: 0.92 }, tint: '#eef3f7' },
  deep:    { modulate: { brightness: 0.82, saturation: 1.05 } },
  lifted:  { modulate: { brightness: 1.14, saturation: 0.88 } },
  contrast:{ modulate: { brightness: 0.96, saturation: 1.15 }, linear: [1.18, -14] },
};

async function buildVariants() {
  fs.mkdirSync('assets/plates/variants', { recursive: true });
  const manifest = [];
  for (const src of SOURCES) {
    for (const [grade, opt] of Object.entries(GRADES)) {
      let img = sharp(`assets/plates/${src}.png`).modulate(opt.modulate);
      if (opt.linear) img = img.linear(opt.linear[0], opt.linear[1]);
      if (opt.tint) img = img.tint(opt.tint);
      const out = `assets/plates/variants/${src}-${grade}.png`;
      await img.png().toFile(out);
      manifest.push({ base: src, grade, file: `plates/variants/${src}-${grade}.png` });
    }
  }
  fs.writeFileSync('assets/plates/variants/manifest.json', JSON.stringify(manifest, null, 2));
  console.log(`built ${manifest.length} plate variants from ${SOURCES.length} source photos`);
  return manifest;
}

module.exports = { buildVariants, SOURCES, GRADES };
if (require.main === module) buildVariants();
