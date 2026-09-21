# LF-1 — 35-ad launch set

## Status

| Step | State |
|---|---|
| 35 creatives designed, rendered, compliance-checked | **Done** — `out/launch35/` |
| Review gallery published | **Done** — https://claude.ai/artifact/TPmP9Yov2PbemjGpP7pF3k |
| Meta campaign created (PAUSED) | **Done** — `120248995119370567` |
| Ad sets created (PAUSED) | **6 of 35** — blocked, see below |
| Images uploaded to Meta | **Blocked** — see below |
| Ads created | **Not started** — depends on images |

**Nothing can spend.** The campaign and every ad set are PAUSED, and no ad exists yet.

## The campaign

- Account: `1042719695363303` ("leaf camp")
- Campaign: **LF-1 | Creative Test | 35 x 1 ad | Sep 2026** — `120248995119370567`
- Objective: OUTCOME_SALES, optimising OFFSITE_CONVERSIONS / PURCHASE
- Pixel: `26675682312092213` ("Leaf pixel", last fired the day this was built)
- Page: `1196689700184436` ("LEAF supplements")
- Structure: ABO — one ad set per creative, so a winner points at one idea
- Budget: **€5.00/day per ad set** — a placeholder. 35 × €5 = €175/day if all are switched on.
- Targeting: **United States**, 25–65, Advantage+ Audience on
- Attribution: 7-day click, 1-day view

Ad sets created so far: 01, 02, 03, 04, 05, 08.

## Two blockers

### 1. Images cannot leave this container

Every route needs bytes POSTed to an external host, and the org egress policy
denies all of them:

| Route | Result |
|---|---|
| `rupload.facebook.com` (Meta's own upload endpoint) | 403 at the proxy |
| `ads_creative_upload_media` URL fetch | "not rolled out" on both ad accounts |
| `ads_create_creative` with `image_url` | Meta: *"Image Wasn't Downloaded"* — the gallery is private |
| Figma `upload_assets` / Shopify staged uploads | same POST-to-external-host problem |

**The fix takes about ten seconds:** open the gallery, Share → anyone with the
link. Meta can then fetch all 35 by URL and I can create every creative and ad
in one pass. Alternatively, download the PNGs and drag them into Ads Manager.

### 2. The permission classifier is gating ad-set creation

Creating ad sets is flagged as a real-world transaction. Six went through, the
rest were denied. I stopped rather than route around it. Either approve those
calls when they appear, or say the word and I'll continue.

## Decisions I made that you should check

- **US targeting**, because the landing page says "free shipping only in USA",
  the product ships from the US, and the whole competitive set is US. The store
  prices in EUR, so if you're selling into the EU this is wrong — tell me.
- **€5/day per ad set** is a placeholder, not a recommendation.
- **No price in any ad.** Shopify charges €49.00, the landing page shows €35.00.
- **No weight, appetite, food-noise or body imagery** anywhere, which is where
  the Evolv reference ads live. See `strategy/LANDING-PAGE-RISK.md`.

## The 35

Ten angles, nineteen layouts, 1080×1350. Full copy in `out/launch35.json`.
