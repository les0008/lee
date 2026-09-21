# LF-1 Ad Factory

2,000 Meta-ready static ads for **LF-1** (LEAF) — a GLP-1 companion supplement —
generated from live competitor research, a hand-written compliance-checked copy
bank, and a deterministic render pipeline.

```
500 unique creatives  ×  4 Meta placements  =  2,000 PNGs
```

## What's here

| Path | What it is |
|---|---|
| `research/RESEARCH.md` | Competitor teardown from the live Meta Ad Library, with scaling signals |
| `strategy/STRATEGY.md` | Positioning, the 14 angles, and the 3-jurisdiction compliance model |
| `strategy/VERIFY.md` | **Read before spending money.** What's unverified and what's switched off |
| `out/ads/` | The 2,000 PNGs |
| `out/manifest.csv` | One row per asset — every headline, angle, layout, placement |
| `out/qa/` | Contact sheets, one per format |
| `src/` | The generator |

## Naming

```
LF1_<ANGLE>_<layout>_<palette>_<creativeId>_<format>.png
LF1_GI_SPECIFIC_compare_forest_0087_4x5.png
```

Angle and format are in the filename, so you can build an ad set from a glob:

```bash
# every GI-side-effect ad in feed-portrait
cp out/ads/LF1_GI_SPECIFIC_*_4x5.png  launch/
# one palette across everything
cp out/ads/*_forest_*.png  launch/
```

## The four placements

| Format | Pixels | Where it serves |
|---|---|---|
| `1x1` | 1080×1080 | FB + IG feed |
| `4x5` | 1080×1350 | Feed, maximum mobile real estate |
| `9x16` | 1080×1920 | Stories / Reels |
| `191x1` | 1200×628 | Right column, Audience Network |

## Rebuilding

```bash
npm install
node src/render.js                      # all 2,000
node src/render.js --limit=20            # quick sample
node src/render.js --format=4x5          # one placement
node src/render.js --productImage=../assets/lf1.png   # composite a real product shot
node src/qa.js 1x1                       # contact sheet of all 23 layouts
```

Output is **deterministic** — the same seed produces the same 500 creatives, so
a rebuild after a copy tweak changes only what you changed.

## How it's built

1. **`src/copy/`** — 390 hand-written headlines across 13 angles, plus subheads,
   eyebrows and CTAs. Every string passes a compliance linter at generation
   time; a violation throws the build rather than shipping.
2. **`src/brand.js`** — 8 palettes × 6 type pairings. All dimensions are in a
   single `u` unit (= canvas width ÷ 100), so one layout renders correctly at
   every aspect ratio.
3. **`src/layouts/`** — 23 layout archetypes (big type, comparison, checklist,
   search-UI, notes-app, label panel, myth/fact, …).
4. **`src/compose.js`** — combines angle × headline × layout × palette × typeset
   under affinity constraints, dedupes on `headline+layout`, emits 500.
5. **`src/render.js`** — Chromium renders each creative at each size, runs a
   4-pass auto-fit so nothing can overflow, and palette-quantises the PNG
   (~35 KB average, 68 MB total).

### The auto-fit

Text length varies from 20 to 70 characters across 4 aspect ratios, so layouts
are fitted at render time rather than hand-tuned:

- **Pass 0** — on tall canvases, *grow* the base unit until the frame is filled.
- **Pass 1** — proportional scale-down (preserves hierarchy, so it goes first).
- **Pass 2** — shrink the headline, floored at 55 % so hierarchy survives.
- **Pass 3** — scale the system down further.
- **Pass 4** — hard fit. A cropped headline is a broken ad; a smaller one isn't.

Overflow is reported per build in `out/overflow.txt`. Current build: **0**.

## Compliance

Three rule sets are enforced simultaneously — Meta advertising policy, FDA/DSHEA
structure-function rules, and EU Regulation 1924/2006 (LEAF sells in EUR from
the Netherlands). The linter lives in `src/copy/index.js`.

No prescription brand names. No treat/cure/prevent claims. No weight-loss
promises. No before/after or body imagery. No assertions about the viewer's
health. No invented statistics or testimonials.

See `strategy/VERIFY.md` for what is gated off and why.
