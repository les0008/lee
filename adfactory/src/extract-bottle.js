'use strict';
/* Cut the LF-1 bottle out of the supplied ad image (assets/src/12.webp):
   a bright bottle on a dark ground, the cleanest separation available.
   Background is flood-filled inward from the crop border over dark pixels, so
   the mask follows the real silhouette rather than a global threshold, which
   would punch holes in the shadowed left edge. */
const sharp = require('sharp');
const fs = require('fs');

const SRC  = 'assets/src/12.webp';
const BOX  = { left: 425, top: 500, width: 210, height: 380 };
const DARK = 95;

(async () => {
  const src = sharp(SRC).extract(BOX).removeAlpha();
  const { data: rgb, info } = await src.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  if (C !== 3) throw new Error(`expected 3 channels, got ${C}`);

  const lum = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const o = i * 3;
    lum[i] = 0.2126 * rgb[o] + 0.7152 * rgb[o + 1] + 0.0722 * rgb[o + 2];
  }

  const bg = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (bg[i] || lum[i] > DARK) return;
    bg[i] = 1; stack.push(i);
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const i = stack.pop(), x = i % W, y = (i / W) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }

  const mask = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) mask[i] = bg[i] ? 0 : 255;

  // Soften the edge. sharp expands a 1-channel raw input to RGB during blur,
  // so normalise back to one plane instead of trusting the channel count.
  const blurred = await sharp(mask, { raw: { width: W, height: H, channels: 1 } })
    .blur(1.0).raw().toBuffer({ resolveWithObject: true });
  const bc = blurred.info.channels;
  if (blurred.info.width !== W || blurred.info.height !== H) {
    throw new Error(`mask changed size: ${blurred.info.width}x${blurred.info.height}`);
  }
  const alpha = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) alpha[i] = blurred.data[i * bc];

  fs.mkdirSync('assets', { recursive: true });

  // Tight-crop to the alpha bounding box. sharp's .trim() ignores a joined
  // alpha channel here, so compute the box directly from the mask.
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (alpha[y * W + x] > 8) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) throw new Error('mask is empty');

  // Two pipelines on purpose: an .extract() chained onto a raw joinChannel
  // pipeline is applied against the input geometry and silently drops out.
  const rgba = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } })
    .png()
    .toBuffer();

  await sharp(rgba)
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toFile('assets/lf1-bottle.png');

  const m = await sharp('assets/lf1-bottle.png').metadata();
  console.log(`cutout ${m.width}x${m.height}  (crop was ${W}x${H})`);
})();
