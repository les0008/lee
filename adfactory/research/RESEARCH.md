# LF-1 — Competitive & Demand Research
Source: **Meta Ad Library (live, first-party)**, pulled 2026-09-21, US + EU active ads.
TrendTrack was not connected to this session; the Ad Library is the same underlying
ad corpus TrendTrack indexes, queried directly.

## Method

Meta's Ad Library does not publish spend or conversion rates. The reliable public
proxy for "this creative is winning" is **duplicate count**: advertisers scaling a
creative broadcast it across many ad IDs simultaneously. A headline running as 14
concurrent ad IDs is being pushed; one running as a single ID is being tested.

Every headline below is verbatim from a live ad. Counts are concurrent ad IDs
observed in a single pull.

## The scaling ladder — who is spending

| Advertiser | Headline (verbatim) | Copies | Read |
|---|---|---|---|
| ColonBroom | `Skip the needle. Keep the results.` | **14** | Category's biggest bet |
| GLP-1 SOS Supplements | `Finally Feel Normal on Your GLP-1` | **16** | Highest single-headline volume found |
| ColonBroom | `Skip The Shot. Keep The Results.` | 10 | Same idea, title-case test |
| Katrina O'Brien | `The One a Dietitian Writes Down` | 9 | Authority + curiosity gap |
| ColonBroom | `Skip the injection. 70% OFF` | 8 | Same idea + discount |
| Jacob Nash | `In Europe they do this before every GLP-1 injection 👇` | 8 | Advertorial curiosity |
| Jacob Nash | `In Sweden this is standard care for GLP-1 patients. In the US? Nothing 👇` | 6 | Same play, geo-authority |
| Nicole Stanley / A. Gourney MD | `Reactivate your body.` | 8 | Practitioner-fronted |
| ColonBroom | `77% OFF your gut reset` | 5 | Pure offer |
| GLP-1 SOS | `Finally — Built for a GLP-1 Gut` | 4 | Category-of-one claim |

## The full headline corpus

**Relief / normalcy territory** (strongest emotional pull in category)
- `Finally Feel Normal on Your GLP-1` — GLP-1 SOS
- `Finally — Built for a GLP-1 Gut` — GLP-1 SOS
- `Feel normal on your GLP-1` — Madison Reyes
- `Made For GLP-1 Side Effects` — The GLP-1 Club
- `GLP-1 Constipation Relief ☝️` — Healthy Progress Daily
- `GLP-1 Digestive Ease` — IntimateRose
- `Promote Digestive Comfort on GLP-1s*` — Thorne *(note the compliance asterisk)*

**Companion / journey territory**
- `The All-In-One Supplement Built for Your GLP-1 Journey` — Vennique
- `Your GLP-1 Nutrition Sidekick` — BODi
- `Daily Support for Life on a GLP-1` — GLP-1 Wellness Journal
- `The 3-in-1 Companion Built From Clinically Studied Forms` — Joyvity Lab
- `GLP-1 Nutrition, Simplified` — BODi
- `Because GLP-1 Doesn't Come With a Manual` — Hugh & Grace
- `Master Your GLP-1 Weight Loss Journey` — GLP Monitor

**Mechanism / reframe territory**
- `GLP-1? Think Beyond Fiber.` — BODi
- `Why fiber and laxatives fail on a GLP-1` — Steady Mornings
- `Stuck on GLP-1? It might be cortisol, not the dose` — Katrina O'Brien
- `Track Muscle, Not Just Weight` — Summit Metabolic Health

**Replacement territory** *(ColonBroom owns this — see strategy note)*
- `Skip the needle. Keep the results.` / `Skip The Shot. Keep The Results.`
- `Skip the injection. 70% OFF`
- `Science-Backed GLP-1 That Works`
- `Effective Results – Zero Side Effects`

**Story / curiosity territory**
- `The Napkin She Keeps on Her Fridge` — Caroline Moore
- `She Went Back to the Hill. On Purpose.` — Caroline Moore
- `Let Your Mirror Catch Up` — The Gut Diaries
- `You Are Doing Everything Right` — IM8 Health
- `The One a Dietitian Writes Down` — Katrina O'Brien

**Proof territory**
- `4.8/5 ★★★★★ Rated by 3,000+ People on GLP-s` — Joyvity Lab
- `Clinically Studied Probiotic GI Support` — Thorne

## What the corpus proves

1. **Short parallel constructions dominate.** The two highest-volume headlines are
   both 5-6 words with a pivot: *Skip the needle / Keep the results*,
   *Finally / Feel Normal*. Nothing above 9 words is running at scale.

2. **"Finally" is the category's highest-volume opening word.** It presupposes a
   long, failed search — it does the emotional work of a paragraph in one word.

3. **Nobody names the drugs.** Zero ads in the corpus say Ozempic, Wegovy, Mounjaro
   or Zepbound. All say "GLP-1". This is trademark discipline and Meta-policy
   discipline, and LF-1 must match it.

4. **Specific side effects outperform vague wellness.** `GLP-1 Constipation Relief`
   and `Why fiber and laxatives fail on a GLP-1` are precise. Generic
   "wellness/vitality" ads (Eros Vitality, North Valley) run 1-2 copies — untested.

5. **The GI complaint is the category's open door.** Constipation/bloating is the
   most-named specific problem, and only ~325 active ads target it versus 2,340 for
   generic "GLP-1 support". High intent, lower competition.

6. **Practitioner-fronted and advertorial creative is being scaled hard** by
   affiliates (Jacob Nash, Katrina O'Brien, Caroline Moore, Nicole Stanley). These
   are native-looking, not product-looking.

## Strategic read for LF-1 — the one decision that matters

ColonBroom is spending heavily to own **replacement** — *skip the shot*. That
audience is people avoiding or quitting a GLP-1.

**LF-1 is a companion, not a replacement.** Its Shopify category is literally
`Digestive Support`. Competing on "skip the needle" would put a €49 companion
product against a funded competitor's core position, and would attract people who
do not want the thing LF-1 supports.

LF-1's opening is the territory GLP-1 SOS is proving with 16 concurrent ads and
almost nobody else is contesting at scale: **"Finally feel normal *while staying on*
your GLP-1."** Relief + GI specificity + staying-the-course. That is where the
angle set in `strategy/STRATEGY.md` is built.
