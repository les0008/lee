# LF-1 landing page — risk review
Reviewed from the Instant.so builder screenshots of `1work LF-1`, the page all
2,000 ads point at. Ranked by how much damage each item can do.

I am not your lawyer or your regulatory reviewer. But I build the ads that point
here, Meta reviews this page when it reviews them, and several of these are the
kind of thing that ends an ad account rather than getting a single ad rejected.

---

## Tier 1 — stop and fix before spending

**1. Weight-loss amount claims.**
- `12+ lbs lost And better sleep — UP TO, IN 8 WEEKS`
- Testimonial: *"Down 18 lbs and still going."*

EU Regulation 1924/2006 **Article 12(b)** prohibits, without exception, health
claims that "make reference to the rate or amount of weight loss." There is no
substantiation that makes this legal for a food supplement sold in the EU. It is
also a straightforward Meta weight-loss-policy violation.

**2. "Safe to use with all medications."**

Nothing can claim this. LF-1 contains iron, which has well-documented absorption
interactions (levothyroxine, tetracycline and quinolone antibiotics, some
Parkinson's medication). The audience is by definition on a prescription drug.
This is a consumer-safety claim, not a marketing one, and it is the line most
likely to matter if anyone is ever harmed.

**3. "7-WEEK RANDOMIZED CONTROLLED TRIAL ON LEAF FORMULAS" — 95% / 85% / 80% / 75%.**

Also `No muscle or hair loss reported — DURING 8-WEEK STUDY` and `24
clinically-studied probiotic strains` and `Increases healthy bacteria ↑34x`.

If that trial exists, publish it under the footer's own "Clinical papers" link
and this becomes a genuine asset. If it does not, presenting invented trial
results as clinical evidence is a different category of problem from an
overclaim — it is fabricated evidence, and both the footer's "Transparency
report" and "Charter of Ethics" links point at it.

**4. "1 ACTION · 2 CAPSULE DAILY · 12 HEALTH PROBLEMS FIXED."**

"Fixed" is a cure claim, stated plainly. So is the FAQ's *"naturally triggers
your body's L-cells to release native satiety signals"* — claiming to trigger
endogenous GLP-1 secretion is a pharmacological mechanism claim, which in the EU
is the test for being an unauthorised **medicinal product by function**, not a
food supplement.

---

## Tier 2 — the page contradicts your own systems

**5. Price. The page and checkout disagree.**

| Source | Price |
|---|---|
| Shopify variant `57997150650750` (what checkout charges) | **€49.00** |
| Landing page | **€35.00** one-time / €28.50 subscribe |

A customer sees €35 and is charged €49. That is a chargeback engine and an EU
price-indication problem.

**Action taken:** every price has been removed from all 2,000 ads, and the
linter now blocks any currency string until the two agree. 80 assets previously
said €49. Tell me the real number and I will re-enable it in one build.

**6. Guarantee. The page and the policy page disagree.**

| Source | Terms |
|---|---|
| Landing page | **60-day money back guarantee, with no hassle** |
| Published Refund & Return Policy | **14 days, unopened, factory seal intact only** |

The page promises exactly what the policy refuses. This also corrects what I
told you earlier: I said you had no guarantee versus Zafira's 60-day. You
advertise 60-day — your policy page just won't honour it. Pick one and make both
pages say it.

**7. Dosage. Three different instructions.**

| Source | Instruction |
|---|---|
| Product label (via Shopify) | two (2) capsules daily, with 6–8 oz water |
| Landing page "How to Use" | "Take **2 or 3 capsule** daily **with food**" |
| Landing page routine block | "**2** CAPSULE DAILY" |

The label governs. Fix the page to match it. ("2 or 3 capsule" is also a typo.)

---

## Tier 3 — overclaims and credibility

**8. The Sleep & Mood section argues against itself.** The body text says
*"…but that doesn't establish that it improves sleep or stabilizes mood."* The
bullets directly beneath say `STABILIZED MOOD` and `DEEPER SLEEPING EXPERIENCE`.
Someone wrote the hedge and then undercut it.

**9. `IMPROVES NORMAL HAIR GROWTH`.** The EFSA-authorised wording for zinc and
biotin is "contributes to the **maintenance of** normal hair." Growth is a
different claim, and it is not authorised.

**10. `REDUCED CONSTIPATION`** names a condition. **`REDUCED FOOD NOISE`**,
"calmer food noise", "fewer cravings", "balanced appetite" are appetite claims,
restricted in the EU.

**11. `HSA/FSA eligible · Save an average of 30%`.** US HSA/FSA funds generally
do not cover dietary supplements without a Letter of Medical Necessity. Verify
before keeping this.

**12. Social-proof figures worth checking.** The page shows `4.9/5 · 12,847+
Reviews`, `50,000+ ORDERS DELIVERED`, `12,000+ HAPPY CUSTOMERS`, `98% WOULD
RECOMMEND`. The Shopify store record was created **2026-05-28** — under four
months ago — on the **Basic** plan, with LF-1 holding 10,000 units of inventory.
50,000 delivered orders in that window is worth reconciling against your actual
order count before a reviewer does it for you. If the numbers are real, nothing
here matters. If they are placeholder copy left in from a template, they should
come out.

**13. `100% organic`, `100% natural ingredients`** are regulated/absolute terms
requiring certification. `Most supplements don't have 100% natural ingredients —
LEAF™ does` is additionally a comparative claim about competitors.

---

## The positioning problem underneath all of it

The hero says **"We take care of your GLP-1 sides."** — companion to a
prescription. Almost everything below it — food noise, cravings, satiety
signals, 12+ lbs, "different from prescription GLP-1 injections" — sells a
**replacement** for the drug.

Those are two different products for two different buyers, and the replacement
half is where nearly every Tier 1 item lives. Committing to the hero — companion
— removes most of this page's legal exposure and matches both your Shopify
category (`Digestive Support`) and all 2,000 ads.

---

## What I took from the page

The writing is genuinely good in places, and the ads now use it:

- **"We take care of your GLP-1 sides."** — "sides" is better than any word I
  had for side effects. Now seeded through the relief angles.
- **"Whole ingredients. Zero compromise."** — into `CLEAN_LABEL`.
- **"No harsh laxatives."** — reframed as composition, not outcome:
  *"No laxatives in the formula."*
- **Injections and oral pills** — real audience breadth: *"Built for injections
  and oral GLP-1s alike."*
- **The three personas** (Wellness Curious / Plateau Breaker / Long Game) — a
  clean, non-medical segmentation that maps onto ad-set targeting.
- **`NUTRIENT_GAP` was validated.** I wrote *"Eating less doesn't mean needing
  less"* before seeing your page say *"Eating less can make it harder to get
  enough essential nutrients."* Same argument, arrived at independently. Give
  that angle disproportionate budget.

Not taken: food noise, cravings, appetite, weight, mood, sleep, hair growth,
trial percentages, and price. Those stay out of the ads whatever the page says.
