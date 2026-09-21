# LF-1 — Creative Strategy & Compliance Model

## Product truth (verified from Shopify, not assumed)

| Field | Value | Source |
|---|---|---|
| Name | LF-1 | Shopify product `16080583917950` |
| Brand | LEAF | vendor field |
| Price | **€49.00** | variant `57997150650750` |
| SKU | JTP32GLP1 | variant |
| Category | **Digestive Support** | `productType` |
| Size | 60 capsules / 47 g | description |
| Dose | **2 capsules daily** with 6–8 oz water | description |
| Origin | Manufactured USA | description |
| Contains | **Iron** | inferred from mandatory FDA iron-overdose warning |
| Certifications | Non-GMO, Gluten-free, Lactose-free, Allergen-free, Antibiotic-free, Hormone-free, Alcohol-free, Vegetarian | label badges |
| Store | leaf-pure.com, Netherlands, EUR | shop info |

**Not verified — must be confirmed before these ads run.** The landing page
(`leaf-pure.com`) and the Shopify CDN are blocked by this environment's egress
policy, so the full Supplement Facts panel could not be read. Every claim-bearing
line in the copy bank is tagged `needsVerify` and listed in `strategy/VERIFY.md`.

## Positioning

> **LF-1 is the companion to the GLP-1 journey — not a replacement for it.**

ColonBroom is spending heavily to own *"skip the needle"*. That is replacement
positioning, aimed at people avoiding the drug. LF-1 is a €49 digestive-support
companion; fighting for that position means fighting a funded competitor for an
audience that does not want what LF-1 supports.

LF-1's opening — proven by GLP-1 SOS running 16 concurrent ads, contested by almost
nobody else at scale:

> **Finally feel normal *while staying on* your GLP-1.**

Three pillars, mapping to the three stated desires:

1. **Side effects** → GI comfort, regularity, the unglamorous daily reality.
2. **Journey support** → the half of the protocol nobody handed you.
3. **Specific problems** → eating far less means taking in far less. Nutrient gap.

## The 14 angles

| # | Code | Territory | Core tension | Evidence |
|---|---|---|---|---|
| 1 | `FINALLY_NORMAL` | Relief | "I want to feel like myself again" | GLP-1 SOS × 16 |
| 2 | `GI_SPECIFIC` | Side effects | Constipation, bloat, regularity | Only ~325 active ads vs 2,340 generic |
| 3 | `STAY_COURSE` | Retention | "I don't want to quit over side effects" | Uncontested |
| 4 | `FIBER_FAILS` | Mechanism | "Fiber and laxatives aren't built for this" | Steady Mornings, BODi |
| 5 | `COMPANION` | Journey | "The other half of the protocol" | Vennique, BODi, Joyvity |
| 6 | `NO_MANUAL` | Gap in care | "Nobody told me what to expect" | Hugh & Grace |
| 7 | `EURO_STANDARD` | Authority | European standard of care | Jacob Nash × 8 — and **authentic for LEAF (NL)** |
| 8 | `RITUAL` | Simplicity | Two capsules, every morning | Category-wide |
| 9 | `CLEAN_LABEL` | Trust | 8 certifications, vegetarian | Product truth |
| 10 | `PRACTITIONER` | Authority | "The one a dietitian writes down" | Katrina O'Brien × 9 |
| 11 | `SOCIAL_PROOF` | Proof | Ratings, reviews, counts | Joyvity Lab |
| 12 | `NUTRIENT_GAP` | Specific problem | **Eating less = absorbing less** | LF-1 contains iron — this is the *why* |
| 13 | `CONFIDENCE` | Emotional | Re-entering life, plans, mornings | The Gut Diaries, IM8 |
| 14 | `OFFER` | Conversion | €49, guarantee, risk reversal | ColonBroom offer ads |

Angle 12 is LF-1's strongest *differentiated* story. A GLP-1 suppresses appetite
dramatically; intake falls with it. An iron-containing daily companion has a real,
defensible reason to exist that "gut health" alone does not give it.

Angle 7 is a credibility asset competitors are faking. Jacob Nash's *"In Sweden this
is standard care"* is an affiliate's invention. LEAF **is** a Netherlands company.
LF-1 can make European framing truthfully.

## Compliance model — the binding constraint

These ads run on Meta, for a supplement, sold in EUR from the Netherlands. Three
rule sets apply simultaneously. The copy engine enforces all three at generation
time; nothing that violates them can be emitted.

### 1. Meta advertising policy

- **No implying personal health status.** Meta rejects ads that suggest knowledge of
  the viewer's condition.
  - ✗ `Struggling with constipation on your GLP-1?`
  - ✓ `Built for GLP-1 mornings.`
- **No before/after imagery, no body close-ups, no idealised bodies, no negative
  self-perception.** Zero body imagery in this entire set — by design.
- **No guaranteed or dramatic outcome claims**, no weight/number promises.
- **No implying the product is a medication** or substitutes prescription treatment.
- **No prescription brand names.** Never Ozempic / Wegovy / Mounjaro / Zepbound /
  semaglutide / tirzepatide. Only "GLP-1". The entire competitor corpus observes
  this — so does every line in this set.

### 2. FDA / DSHEA (US-facing structure-function)

- Permitted verbs: **supports, helps maintain, promotes, contributes to.**
- Forbidden verbs: treat, cure, prevent, heal, fix, eliminate, reverse, reduce the
  risk of [disease].
- Structure-function claims carry the disclaimer:
  *These statements have not been evaluated by the Food and Drug Administration.
  This product is not intended to diagnose, treat, cure, or prevent any disease.*

### 3. EU Regulation 1924/2006 — the strict one

LF-1 sells in EUR from the Netherlands, so EFSA rules bind. Only **authorised**
health claims may be made, in substance. Unauthorised weight-loss claims are
prohibited outright.

This is an advantage, not just a restriction. Because LF-1 contains iron, a set of
**pre-approved EU claim wordings** is available — legally safe *and* more credible
than invented marketing language:

- Iron contributes to **normal oxygen transport** in the body
- Iron contributes to the **reduction of tiredness and fatigue**
- Iron contributes to **normal energy-yielding metabolism**
- Iron contributes to **normal formation of red blood cells and haemoglobin**
- Iron contributes to **normal cognitive function**
- Iron contributes to the **normal function of the immune system**

⚠️ **Conditional.** An EFSA claim may only be used if the product delivers ≥15 % of
the Nutrient Reference Value per serving. LF-1's iron dose could not be read from
the blocked label image. These lines are gated behind `needsVerify` and are **off by
default** in the build — see `strategy/VERIFY.md`.

## Format & placement plan

Every creative renders in four Meta-native sizes:

| Ratio | Pixels | Placement |
|---|---|---|
| 1:1 | 1080 × 1080 | Feed (FB + IG) |
| 4:5 | 1080 × 1350 | Feed, max mobile real estate |
| 9:16 | 1080 × 1920 | Stories / Reels |
| 1.91:1 | 1200 × 628 | Right column, Audience Network |

**500 unique creatives × 4 placements = 2,000 static assets.**

This is deliberate and it is how a real studio ships this volume. 2,000 *unrelated*
ideas would be 2,000 pieces of noise — and Meta's delivery system does not reward
it. 500 genuinely distinct creatives (unique angle + hook + layout + palette),
each correctly sized for the placement it will serve, is a testable library. The
manifest lets you filter to any slice — e.g. all `GI_SPECIFIC` 4:5 — and launch it.
