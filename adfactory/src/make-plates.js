'use strict';
/* Build clean photographic background plates from the brand's own ad renders.
   Both scenes are horizon-banded: sky, ledge and blurred foreground all run
   horizontally, so a masked region is rebuilt by copying the same rows from a
   clean span to its left rather than by diffusing inward, which would smear
   the horizon line vertically. */
const sharp = require('sharp');
const fs = require('fs');
const { buildMask, dilate, inpaint } = require('./inpaint');

// Rebuild `box` by pasting rows from an equally wide clean span `srcLeft`.
function patchRows(buf, W, H, C, box, srcLeft, feather) {
  const { left, top, width, height } = box;
  const out = Buffer.from(buf);
  for (let y = top; y < top + height; y++) {
    for (let k = 0; k < width; k++) {
      const dx = left + k, sx = srcLeft + k;
      // feather horizontally so the seam at either edge dissolves
      let a = 1;
      if (k < feather) a = k / feather;
      else if (k >= width - feather) a = (width - 1 - k) / feather;
      const vy = (y - top);
      if (vy < feather) a = Math.min(a, vy / feather);
      else if (vy >= height - feather) a = Math.min(a, (height - 1 - vy) / feather);
      const di = (y * W + dx) * C, si = (y * W + sx) * C;
      for (let c = 0; c < C; c++) out[di + c] = Math.round(buf[di + c] * (1 - a) + buf[si + c] * a);
    }
  }
  return out;
}

// Rebuild `box` from the vertical gradient alone: each row is replaced by a
// horizontally-constant colour averaged from clean pixels either side of it.
function patchGradient(buf, W, H, C, box, pad, feather) {
  const { left, top, width, height } = box;
  const out = Buffer.from(buf);
  for (let y = top; y < top + height; y++) {
    const avg = new Float64Array(C);
    let n = 0;
    for (let x = Math.max(0, left - pad); x < left; x++, n++)
      for (let c = 0; c < C; c++) avg[c] += buf[(y * W + x) * C + c];
    for (let x = left + width; x < Math.min(W, left + width + pad); x++, n++)
      for (let c = 0; c < C; c++) avg[c] += buf[(y * W + x) * C + c];
    for (let c = 0; c < C; c++) avg[c] /= n;
    for (let k = 0; k < width; k++) {
      let a = 1;
      if (k < feather) a = k / feather;
      else if (k >= width - feather) a = (width - 1 - k) / feather;
      const vy = y - top;
      if (vy < feather) a = Math.min(a, vy / feather);
      else if (vy >= height - feather) a = Math.min(a, (height - 1 - vy) / feather);
      const di = (y * W + left + k) * C;
      for (let c = 0; c < C; c++) out[di + c] = Math.round(buf[di + c] * (1 - a) + avg[c] * a);
    }
  }
  return out;
}

// Rebuild `box` row by row from a clean reference column span to its left.
// Used where the right-hand neighbours are another subject (the coral) and
// would be dragged into the fill by a two-sided interpolation.
// Rebuild `box` row by row from a clean reference span to its left. Both the
// two-sided variant and an inward diffusion fail here: the coral immediately
// right of the bottle bleeds a bright wedge back across the fill, and the
// scene's horizontal banding would be smeared vertically. Sampling one side
// keeps the bands; the right edge is feathered back into the original so the
// coral survives untouched.
function patchFromLeft(buf, W, H, C, box, refPad, featherL, featherR, featherV) {
  const { left, top, width, height } = box;
  const out = Buffer.from(buf);
  const avg = new Float64Array(C);
  for (let y = top; y < top + height; y++) {
    avg.fill(0);
    let n = 0;
    for (let x = Math.max(0, left - refPad); x < left; x++, n++)
      for (let c = 0; c < C; c++) avg[c] += buf[(y * W + x) * C + c];
    for (let c = 0; c < C; c++) avg[c] /= n;
    for (let k = 0; k < width; k++) {
      let a = 1;
      if (k < featherL) a = k / featherL;
      else if (k >= width - featherR) a = (width - 1 - k) / featherR;
      const vy = y - top;
      if (vy < featherV) a = Math.min(a, vy / featherV);
      else if (vy >= height - featherV) a = Math.min(a, (height - 1 - vy) / featherV);
      const di = (y * W + left + k) * C;
      for (let c = 0; c < C; c++) out[di + c] = Math.round(buf[di + c] * (1 - a) + avg[c] * a);
    }
  }
  return out;
}

// Re-add fine sensor grain so the rebuilt areas are not suspiciously clean.
function grain(buf, W, H, C, amt) {
  for (let i = 0; i < W * H; i++) {
    const n = (Math.random() - 0.5) * 2 * amt;
    for (let c = 0; c < C; c++) {
      const v = buf[i * C + c] + n;
      buf[i * C + c] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
  }
  return buf;
}

module.exports = { patchRows, patchGradient, patchFromLeft, grain };

if (require.main === module) (async () => {
  fs.mkdirSync('assets/plates', { recursive: true });

  // --- stone: the dark ledge scene, emptied of both type and product -------
  {
    const { data, info } = await sharp('assets/src/12.webp').removeAlpha()
      .raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    let buf = Buffer.from(data);
    // headline band sits wholly inside the smooth sky gradient
    buf = patchGradient(buf, W, H, C, { left: 180, top: 95, width: 740, height: 215 }, 90, 24);
    // bottle and its contact shadow
    buf = patchFromLeft(buf, W, H, C, { left: 430, top: 470, width: 228, height: 435 }, 30, 18, 26, 14);
    grain(buf, W, H, C, 2.2);
    await sharp(buf, { raw: { width: W, height: H, channels: C } })
      .png().toFile('assets/plates/stone.png');
    console.log('assets/plates/stone.png', W, H);
  }

  // --- hero: the skin/linen scene with the product left in place -----------
  // Only the type is removed. The ground behind the bottle is a skin-to-shadow
  // boundary that no local fill reconstructs convincingly, so this plate keeps
  // the brand's own product placement and layouts are composed around it.
  {
    const { data, info } = await sharp('assets/src/13.webp').removeAlpha()
      .raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    const rects = [
      { left: 60, top: 90, width: 960, height: 210 },   // headline
      { left: 40, top: 1100, width: 1000, height: 160 } // body copy + button
    ];
    const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const mask = dilate(buildMask(data, W, H, C, rects, (r, g, b) => lum(r, g, b) > 150), W, H, 3);
    const buf = inpaint(data, W, H, C, mask, 80);
    grain(buf, W, H, C, 2.0);
    await sharp(buf, { raw: { width: W, height: H, channels: C } })
      .png().toFile('assets/plates/hero.png');
    console.log('assets/plates/hero.png', W, H);
  }

  // --- sand: the botanical/skin scene. Only 500x375 is available, so the
  // type is removed and the clean right-hand two thirds are upscaled; the
  // softness reads as depth of field behind a scrim and type.
  {
    const { data, info } = await sharp('assets/src/11.png').removeAlpha()
      .raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const rects = [{ left: 8, top: 88, width: 254, height: 200 }];
    const mask = dilate(buildMask(data, W, H, C, rects, (r, g, b) => lum(r, g, b) > 165), W, H, 2);
    const buf = inpaint(data, W, H, C, mask, 60);
    await sharp(buf, { raw: { width: W, height: H, channels: C } })
      .extract({ left: 200, top: 0, width: 300, height: 375 })
      .resize(1080, 1350, { kernel: 'lanczos3' })
      .png().toFile('assets/plates/sand.png');
    console.log('assets/plates/sand.png', 1080, 1350);
  }
})();
