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

---

# Addendum — findings from the LEAF policy pages

The LF-1 landing page itself is still unreadable from here (the page-builder
content is not exposed via the Admin API), but the store's **policy pages were**
readable through the authenticated Shopify connector. Three things came out of
them that affect the ads and the funnel.

## 1. Corrected: two false claims were in the first build

LEAF's shipping policy states **"ALL PRODUCTS ARE SHIPPING FROM THE US"**, and
the product description states manufacture in the USA. The first build contained
copy that contradicted both:

| Was (wrong) | Now |
|---|---|
| `Sixty capsules, shipped from the EU.` | `Sixty capsules, shipped free to the US.` |
| `Ships within the EU. Priced in euro.` | `Ships from the USA. Priced in euro.` |
| `Ships from the EU` (eyebrow) | `Free US shipping` |
| `Formulated to European standards.` | `Sold under European labelling standards.` |
| `Formulated under European regulation.` | `Claims held to European regulation.` |
| `European formulation, global routine.` | `European brand, global routine.` |
| `European formulation standards` (eyebrow) | `European labelling standards` |

The linter now carries **origin-accuracy rules**, so a false origin or
fulfilment claim throws the build rather than reaching an asset. `EURO_STANDARD`
is now strictly a *brand and market* claim (LEAF is Dutch; LF-1 is sold into the
EU under EU labelling rules) and never an origin claim.

## 2. The returns policy undercuts the offer

**14 days, unopened and factory-sealed only.** No refund once a bottle is
opened.

Zafira Organics — the closest direct competitor, same companion positioning —
runs a **60-day money-back guarantee**. For a €49 supplement bought by someone
already spending money on a prescription, a sealed-only return is effectively no
trial at all.

No ad in the set promises a guarantee, a refund or a risk-free trial, so nothing
shipped is inconsistent with the policy. But this is a conversion ceiling that
creative cannot lift. An opened-bottle guarantee would likely move CVR more than
any headline in this library.

## 3. Landing-page quality is an ad-account risk

Meta reviews destination pages for supplement advertisers. The policy pages
currently contain:

- unfilled template placeholders: `[all payment methods]`, `[cut-off time, e.g.
  2:00 PM]`, `[5–15] business days`, `[Mon–Fri, 9:00–17:00 CET]`,
  `[the FDA / relevant authority]`, `[Shipping Policy]`
- `Last updated: Last week` as literal published text
- **three different support addresses** across three pages
  (`leaf.customerservice.store@`, `leaf.customerservice@`,
  `leaf.customer.service@`) plus a fourth on the shop record with a typo
  (`leaf.costumerservice.store@`)
- leaked editor CSS classes in the page HTML (`font-claude-response-body`,
  `text-text-100`) from content pasted straight out of a chat window

Fixing these is cheap and materially lowers the odds of a policy review going
badly. One working support address, used everywhere, is the single highest-value
fix.

## 4. Competitive read (via search; both sites are egress-blocked)

**Zafira Organics — "Recovery Foundation".** The direct competitor. Same
companion-to-GLP-1 positioning. Targets three named side effects — brain fog,
hair loss, digestive — with saffron, copper, zinc, magnesium, B12, L-theanine
and ginger. 60-day money-back guarantee. Note their trust exposure: multiple
lookalike domains (`zafiraorganics-us.shop`, `myzafiraorganics.store`,
`zafiraorganicsofficial.store`) and a circulating "EXPOSED / red flags" video.
That is LF-1's opening — plain labelling and a real company is a differentiator
against a competitor with a credibility problem.

**Evolv GLP-1 — `evolvlife.com`.** Not a competitor for the same buyer.
~$148/30 tablets, "biomimetic" EV1 yeast-derived peptide positioned as a
*natural alternative* to the drugs. That is replacement positioning at 3× the
price. It validates the split: Evolv and ColonBroom fight over replacement;
Zafira and LF-1 are in companion.

**Implication for LF-1.** Zafira covers three side effects; LF-1 is Digestive
Support only. Narrower is fine — it is a sharper claim — but the `NUTRIENT_GAP`
angle is what closes the gap, because it explains *why* a companion exists at
all. That angle should get disproportionate test budget.
