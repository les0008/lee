# LF-1 landing page — captured copy & gap analysis
Source: Instant.so page builder screenshots (`1work LF-1`), supplied 2026-09-21.
This is the page all 2,000 ads point at.

## The page, as written

**Nav** — HOME · SCIENCE · HOW IT WORKS · SHOP NOW

**Hero**
> # We take care of your GLP-1 sides.
> ## Whole ingredients. Zero compromise.
> The future of natural oral peptides in your hands.
>
> `GET LF-1 NOW`   `HOW DOES IT WORK?`

Product: white bottle, **yellow** label, "LF-1 / DIETARY SUPPLEMENT / 60 CAPSULES"
Badges: Gluten Free · Non-GMO · Hormone Free

**"The Big Tree Technology"**
> Most supplements don't have 100% natural ingredients — LEAF™ does.

**Capsule construction**
> OUTER CAPSULE — Shields probiotics from stomach acid in the digestive tract, while delivering prebiotics.
> INNER CAPSULE — Delivers 24 clinically-studied probiotic strains directly to the colon when they're needed most.
> ALL LEAF™ FORMULAS — Increases healthy bacteria **↑ 34x**

**What to expect with LF-1**
> **FIRST 4 HOURS** — Most people notice calmer food noise and less focus on snacking. LF-1's natural GLP-1 support helps appetite cues feel steadier and more manageable.
> **30 DAYS** — By the one-month mark, steadier appetite becomes a habit. Many report more consistent energy through the day and fewer cravings between meals.
> **60 DAYS** — After two months, LF-1 fits naturally into your routine — supporting balanced appetite, sustained energy, and a healthier relationship with food.

**How to Use** — "Take 2 or 3 capsule daily with food for best absorption."

**How does it work? — four pillars**

| Pillar | Body | Bullets |
|---|---|---|
| Digestive Health | digestive enzymes + vitamins and minerals; "support digestive comfort and help fill nutritional gaps when your appetite or eating routine changes" | REDUCED CONSTIPATION · SUPPORTS DIGESTION · REDUCED FOOD NOISE |
| Energy Support | "Eating less can make it harder to get enough essential nutrients. By providing nutrients involved in normal energy metabolism…" | IMPROVED ENERGY LEVELS · IMPROVED INTERNAL MOTIVATION |
| Sleep & Mood | "…provides nutrients involved in normal nervous system function, **but that doesn't establish that it improves sleep or stabilizes mood.**" | STABILIZED MOOD · DEEPER SLEEPING EXPERIENCE |
| Hair & Muscle | "supplies zinc and biotin to support the maintenance of normal hair… helps supplement nutrition when hunger is reduced" | IMPROVES NORMAL HAIR GROWTH · SUPPORT MUSCLE MAINTENANCE |

**Segmentation cards** — 01 THE WELLNESS CURIOUS · 02 THE PLATEAU BREAKER · (more below fold)

---

## What this changed about the product

I had modelled LF-1 from the Shopify record alone: iron-containing digestive
support. The page says it is a **probiotic + prebiotic + digestive enzyme +
vitamin/mineral** formula in a dual capsule, with zinc and biotin. The iron
inference from the label warning still stands, but iron is one input among many.

**The Supplement Facts panel is still not visible** in these screenshots, so the
EFSA iron claims remain gated. See `strategy/VERIFY.md`.

---

## Problem 1 — the dosage on the page contradicts the label

| Source | Instruction |
|---|---|
| Product label (via Shopify description) | "take **two (2) capsules** daily… with **6–8 oz of water**" |
| Landing page | "Take **2 or 3 capsule** daily **with food** for best absorption" |

Directions for use must match the label; the label is the authoritative
document. The ads follow the label (`Two capsules daily`), so **the page is the
thing to fix**, not the ads. ("2 or 3 capsule" is also a typo.)

---

## Problem 2 — the page contradicts itself on Sleep & Mood

The body text says, verbatim:

> "…but that doesn't establish that it improves sleep or stabilizes mood."

Directly beneath it, as the section's bullets:

> • STABILIZED MOOD   • DEEPER SLEEPING EXPERIENCE

Someone wrote a careful regulatory hedge and then undercut it with unhedged
bullets. As published, the page states the claim it just disclaimed. This is the
single most quotable thing on the page for a regulator or a Meta reviewer.

---

## Problem 3 — claims on the page that the ads deliberately do not make

Every line below would be blocked by the ad linter. They are all live on the page.

| Claim | Issue |
|---|---|
| `REDUCED CONSTIPATION` | Names a condition. Not an authorised EU claim. |
| `Increases healthy bacteria ↑ 34x` | Quantified efficacy claim — needs the study, the strain and the comparator |
| `IMPROVES NORMAL HAIR GROWTH` | EFSA wording for zinc/biotin is "**contributes to the maintenance of** normal hair". "Improves… growth" is an overclaim |
| `IMPROVED INTERNAL MOTIVATION` | Not a permissible claim in any jurisdiction |
| `STABILIZED MOOD` / `DEEPER SLEEPING EXPERIENCE` | Contradicted by the page's own text |
| `REDUCED FOOD NOISE` / "calmer food noise" | Appetite-suppression claim. Weight/appetite claims are restricted in the EU |
| `Most people notice…` / `Many report…` | Efficacy claims requiring substantiation |
| `LF-1's natural GLP-1 support` | Implies GLP-1 pharmacological activity — closest thing here to an implied drug claim |
| `The future of natural oral peptides` | Peptide activity claim |
| `Most supplements don't have 100% natural ingredients — LEAF™ does` | Comparative claim about competitors + "100% natural" absolute |
| `24 clinically-studied probiotic strains` | Fine **if** the studies exist and are on these strains at these doses |

**Why this matters to the ads.** Meta reviews the destination page for
supplement advertisers. Compliant ads pointing at a page like this can still
draw a rejection or an account-quality action — and the page, not the ad, is
what gets quoted. The 2,000 ads are currently *more conservative than the thing
they link to*, which is the wrong way round.

---

## Problem 4 — the page argues two different positionings at once

- **"We take care of your GLP-1 sides."** → companion to a prescription.
- **"LF-1's natural GLP-1 support helps appetite cues feel steadier"**,
  "calmer food noise", "fewer cravings", "balanced appetite" → the product
  produces the appetite effect itself. That is *replacement* positioning — the
  same territory as ColonBroom ("Skip the needle") and Evolv.

These attract different buyers. The companion buyer already has a prescription
and wants side-effect relief. The replacement buyer wants to avoid the drug.
A page that promises both reads as less credible to each.

The ads are built entirely on **companion**, which matches the hero headline and
the Shopify category. Recommend the page follows the hero and drops the
appetite-effect language — which also removes most of Problem 3.

---

## What matched, and what I'm taking from the page

**Validated.** The `NUTRIENT_GAP` angle was written before I saw this page:

> Ad: *"Eating less doesn't mean needing less."*
> Page: *"Eating less can make it harder to get enough essential nutrients."*

Same argument, independently. That angle should get disproportionate budget.

**Adopted into the copy bank** — the page's own compliant language:

- **"GLP-1 sides"** — the hero's term for side effects. Better than anything I
  wrote. Now seeded through the relief angles.
- **"Whole ingredients. Zero compromise."** — into `CLEAN_LABEL`.
- **"when your appetite or eating routine changes"** — compliant framing of the
  nutrient-gap argument.
- **"help fill nutritional gaps"** — same.
- **Dual-capsule construction + 24 strains + prebiotics** — a real formulation
  differentiator I did not have. New `DELIVERY_TECH` angle.
- **The 4-hour / 30-day / 60-day structure** — reused as a *routine* timeline,
  never as a results timeline.

**Not adopted:** food-noise, appetite, craving, mood, sleep and hair-growth
claims. Those stay out of the ads regardless of what the page says.
