# Before these ads run — verification checklist

Two things could not be confirmed from this environment, because
`leaf-pure.com`, `cdn.shopify.com` and `scontent.fbcdn.net` are all blocked by
the org egress policy (HTTP 403 at the proxy). Everything below is either
unverified or deliberately switched off. Nothing in the built set depends on
any of it.

## 1. Blocked — could not read

| What | Why it matters | How to resolve |
|---|---|---|
| Full Supplement Facts panel | The iron dose decides whether EFSA claims are usable | Read the label image or the LP |
| Landing page copy | Ad→LP message match drives conversion rate | Paste the LP copy and I'll align the hooks |
| Product photography | Every ad currently uses a vector capsule illustration | Drop a transparent PNG in and rebuild (below) |
| Review counts / ratings | The `SOCIAL_PROOF` angle is built but disabled | Supply real figures from the store |

## 2. Gated claims — OFF by default

`NUTRIENT_GAP` carries six EFSA-authorised iron wordings. They are **not in the
built set**. An EFSA claim is legal only if the product delivers **≥15 % of the
Nutrient Reference Value per serving** (NRV for iron = 14 mg, so ≥2.1 mg per
2-capsule serving).

Confirm the iron dose, then enable:

```js
compose({ enableGatedClaims: true })
```

The six wordings are in `src/copy/hooks-b.js` under `NUTRIENT_GAP.gatedClaims`.
Use them **verbatim** — paraphrasing an authorised claim voids its authorisation.

## 3. SOCIAL_PROOF — excluded by design

The angle exists with `{{RATING}}`, `{{COUNT}}`, `{{QUOTE}}`, `{{NAME}}`
placeholders and is flagged `requiresRealData: true`, so `compose()` skips it.
I did not invent ratings or testimonials — fabricated review figures are both a
Meta policy violation and an EU unfair-commercial-practices problem.

Supply real numbers and the linter's placeholder check will pass. Until then
the build throws rather than shipping a placeholder.

## 4. Adding the product shot

The `productSlot` layout has a real image slot. Put a transparent PNG at
`assets/lf1.png` and rebuild:

```bash
node src/render.js --productImage=../assets/lf1.png
```

Every `productSlot` ad picks it up; the vector capsule is the fallback only.

## 5. Claims actually made in the built set

Every line was generated against the linter in `src/copy/index.js`. The set
contains **no**:

- prescription brand or molecule names (Ozempic, Wegovy, Mounjaro, Zepbound,
  semaglutide, tirzepatide, …)
- treat / cure / prevent / heal / reverse / eliminate verbs
- weight-loss or outcome promises, numbers or timelines
- before/after or body imagery of any kind
- assertions about the viewer's health status
- invented statistics, ratings or testimonials

Numbers that do appear are product facts only: 60 capsules, 2 daily, 8
certifications, 30 mornings, €49, made in the USA.

## 6. Still your call

I am not your regulatory reviewer. Before spending money, have whoever signs
off on LEAF's claims read `out/manifest.csv` — every headline and subhead in
all 2,000 assets is in that one file, so a claims review is one pass over ~500
unique rows rather than 2,000 images.
