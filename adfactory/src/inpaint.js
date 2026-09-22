'use strict';
/* Push-pull inpainting.

   The brand's ad renders carry white type burnt into the photograph. The type
   is a thin, high-contrast overlay, so it is removed by masking the glyphs
   themselves rather than the band they sit in: a band fill would flatten the
   skin/background boundaries the type crosses, while a glyph fill only has to
   invent a few pixels either side of each stroke.

   The fill is a weighted image pyramid (pull: downsample valid pixels only;
   push: upsample coarse colour into the holes), then a few Jacobi relaxations
   so the result meets the hole boundary smoothly. This is stable for wide
   holes like the button pill, where plain Jacobi iteration converges far too
   slowly and leaves a visible flat plateau. */

function buildMask(rgb, W, H, C, rects, predicate) {
  const mask = new Uint8Array(W * H); // 1 = hole
  for (const r of rects) {
    for (let y = r.top; y < r.top + r.height; y++) {
      for (let x = r.left; x < r.left + r.width; x++) {
        const i = y * W + x, o = i * C;
        if (predicate(rgb[o], rgb[o + 1], rgb[o + 2], x, y, r)) mask[i] = 1;
      }
    }
  }
  return mask;
}

function dilate(mask, W, H, r) {
  // separable box dilation
  const tmp = new Uint8Array(W * H), out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0;
    for (let k = -r; k <= r && !v; k++) { const xx = x + k; if (xx >= 0 && xx < W && mask[y * W + xx]) v = 1; }
    tmp[y * W + x] = v;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = 0;
    for (let k = -r; k <= r && !v; k++) { const yy = y + k; if (yy >= 0 && yy < H && tmp[yy * W + x]) v = 1; }
    out[y * W + x] = v;
  }
  return out;
}

function pyramidFill(rgb, W, H, C, mask) {
  // pull
  const levels = [{ w: W, h: H, col: new Float32Array(W * H * C), wt: new Float32Array(W * H) }];
  for (let i = 0; i < W * H; i++) {
    const valid = mask[i] ? 0 : 1;
    levels[0].wt[i] = valid;
    for (let c = 0; c < C; c++) levels[0].col[i * C + c] = valid ? rgb[i * C + c] : 0;
  }
  while (levels[levels.length - 1].w > 2 && levels[levels.length - 1].h > 2) {
    const p = levels[levels.length - 1];
    const w = Math.ceil(p.w / 2), h = Math.ceil(p.h / 2);
    const col = new Float32Array(w * h * C), wt = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let sw = 0; const sc = new Float64Array(C);
      for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
        const sx = x * 2 + dx, sy = y * 2 + dy;
        if (sx >= p.w || sy >= p.h) continue;
        const si = sy * p.w + sx, ww = p.wt[si];
        sw += ww;
        for (let c = 0; c < C; c++) sc[c] += p.col[si * C + c] * ww;
      }
      const di = y * w + x;
      wt[di] = Math.min(1, sw);
      if (sw > 0) for (let c = 0; c < C; c++) col[di * C + c] = sc[c] / sw;
    }
    levels.push({ w, h, col, wt });
  }

  // push
  for (let l = levels.length - 2; l >= 0; l--) {
    const f = levels[l], c0 = levels[l + 1];
    for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) {
      const di = y * f.w + x;
      if (f.wt[di] >= 1) continue;
      const ci = Math.min(c0.h - 1, y >> 1) * c0.w + Math.min(c0.w - 1, x >> 1);
      const a = f.wt[di];
      for (let c = 0; c < C; c++)
        f.col[di * C + c] = f.col[di * C + c] * a + c0.col[ci * C + c] * (1 - a);
      f.wt[di] = 1;
    }
  }

  const out = Buffer.alloc(W * H * C);
  for (let i = 0; i < W * H * C; i++) out[i] = Math.max(0, Math.min(255, Math.round(levels[0].col[i])));
  return out;
}

function relax(buf, W, H, C, mask, iters) {
  let a = Float32Array.from(buf), b = new Float32Array(a.length);
  for (let it = 0; it < iters; it++) {
    b.set(a);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (!mask[i]) continue;
      for (let c = 0; c < C; c++) {
        b[i * C + c] = 0.25 * (a[(i - 1) * C + c] + a[(i + 1) * C + c] +
                               a[(i - W) * C + c] + a[(i + W) * C + c]);
      }
    }
    const t = a; a = b; b = t;
  }
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) out[i] = Math.max(0, Math.min(255, Math.round(a[i])));
  return out;
}

function inpaint(rgb, W, H, C, mask, relaxIters = 60) {
  return relax(pyramidFill(rgb, W, H, C, mask), W, H, C, mask, relaxIters);
}

module.exports = { buildMask, dilate, pyramidFill, relax, inpaint };
