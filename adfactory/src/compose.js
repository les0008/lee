'use strict';
require('./layouts/extra');
const { LAYOUTS } = require('./layouts');
const { PALETTES, TYPESETS, FORMATS, BRAND } = require('./brand');
const COPY = require('./copy');

/* Deterministic RNG (mulberry32) so builds are reproducible. */
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const pickOne = (r, arr) => arr[Math.floor(r() * arr.length)];
function sample(r, arr, n) {
  const c = arr.slice();
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
  return c.slice(0, Math.min(n, c.length));
}

/* ---- Layout-specific content banks (factual / compliant only) ---- */

const SEARCH_QUERIES = [
  'glp-1 daily support','what to take alongside a glp-1','glp-1 digestive support',
  'companion supplement for glp-1','glp-1 routine what else to take','daily capsule for glp-1 routine',
  'glp-1 gut support supplement','supplement to take with glp-1','glp-1 morning routine',
  'digestive support glp-1 europe',
];
const SEARCH_SUGGESTIONS = [
  ['glp-1 daily companion supplement','digestive support for glp-1 routines','what to take with a glp-1'],
  ['glp-1 gut support capsules','daily supplement glp-1 journey','glp-1 routine support eu'],
  ['best companion for glp-1 plan','glp-1 digestive support vegetarian','two capsule daily glp-1'],
  ['glp-1 support non-gmo','supplement alongside glp-1','glp-1 companion netherlands'],
];
const TIMELINES = [
  [{k:'Every morning',v:'Two capsules with water'},{k:'Every day',v:'Same time, no thinking'},{k:'Every month',v:'One bottle, 60 capsules'}],
  [{k:'Step one',v:'Keep your GLP-1 routine'},{k:'Step two',v:'Add two capsules daily'},{k:'Step three',v:'Keep going'}],
  [{k:'Wake up',v:'6–8 oz of water'},{k:'Take two',v:'Vegetarian capsules'},{k:'Carry on',v:'That’s the whole routine'}],
  [{k:'Morning',v:'LF-1, two capsules'},{k:'Routine',v:'Unchanged otherwise'},{k:'Bottle',v:'30 mornings per bottle'}],
];
/* Every stat is a verifiable product fact. No invented performance numbers. */
const STATS = [
  {n:'60', label:'capsules per bottle'},
  {n:'2',  label:'capsules daily'},
  {n:'8',  label:'clean-label certifications'},
  {n:'30', label:'mornings per bottle'},
  {n:'€49', label:'for a full month'},
  {n:'1',  label:'step added to your routine'},
  {n:'0',  label:'added hormones or antibiotics'},
  {n:'10s',label:'to take, every morning'},
];
const COMPARE_PAIRS = [
  { aTitle:'A general gut supplement', a:['Built for the average routine','Powder, scoop, shaker','Broad, non-specific purpose'],
    bTitle:'LF-1', b:['Built for GLP-1 routines','Two capsules, no mixing','Digestive Support, specifically'] },
  { aTitle:'More fiber', a:['A single lever','Volume-based approach','Not routine-specific'],
    bTitle:'LF-1', b:['A daily formulation','Capsule format','Made for this routine'] },
  { aTitle:'Guesswork', a:['Different thing each week','Advice from a forum','No fixed routine'],
    bTitle:'LF-1', b:['One daily step','Plainly labelled','Same two capsules, daily'] },
  { aTitle:'Replacing your plan', a:['Stopping what works','Starting over','Losing momentum'],
    bTitle:'Supporting your plan', b:['Keep your GLP-1','Add daily support','Keep your momentum'] },
];
/* A myth must actually oppose the fact it sits above, so myths are mapped to
   angles rather than drawn at random. */
const MYTHS_BY_ANGLE = {
  COMPANION:     [{myth:'Support means replacing your GLP-1.'},{myth:'You only need the one thing.'}],
  NUTRIENT_GAP:  [{myth:'Eating less means your body needs less.'},{myth:'A smaller appetite is the whole story.'}],
  FIBER_FAILS:   [{myth:'More fiber is the whole answer.'},{myth:'Every gut supplement works the same way.'}],
  GI_SPECIFIC:   [{myth:'You just have to put up with it.'},{myth:'A GLP-1 gut is the same as any other.'}],
  FINALLY_NORMAL:[{myth:'You just have to put up with it.'},{myth:'Feeling off is part of the deal.'}],
  STAY_COURSE:   [{myth:'The first month is the hard part.'},{myth:'People stop because they lose motivation.'}],
  NO_MANUAL:     [{myth:'The leaflet tells you everything.'},{myth:'A prescription is a plan.'}],
  RITUAL:        [{myth:'Support has to be complicated.'},{myth:'Another powder to mix every morning.'}],
  CLEAN_LABEL:   [{myth:'Longer ingredient lists work better.'},{myth:'You need a chemistry degree to read the label.'}],
  EURO_STANDARD: [{myth:'Every supplement is held to the same standard.'},{myth:'Claims on a label are just marketing.'}],
  PRACTITIONER:  [{myth:'There is nothing worth asking about.'},{myth:'You should just work it out yourself.'}],
  CONFIDENCE:    [{myth:'You have to plan your day around it.'},{myth:'Progress means putting life on hold.'}],
  OFFER:         [{myth:'Support has to cost a fortune.'},{myth:'You have to commit to a subscription.'}],
};
const MYTH_FALLBACK = [{myth:'Every gut supplement works the same way.'}];
const NOTE_DATES = ['Mon 08:12','Tue 07:40','Wed 08:05','Thu 07:22','Fri 08:31','Sat 09:10','Sun 08:48'];

/* ---- Angle -> layout affinity ---- */
const AFFINITY = {
  FINALLY_NORMAL:['bigType','gradientHero','quoteCard','boxFrame','splitPanel','circleSeal','stickyNote','marquee'],
  GI_SPECIFIC:   ['bigType','compare','searchBar','faqCard','splitPanel','mythFact','gradientHero','ruleStack'],
  STAY_COURSE:   ['bigType','timeline','numberedSteps','boxFrame','quoteCard','marquee','indexCard'],
  FIBER_FAILS:   ['compare','mythFact','statBlock','bigType','ruleStack','faqCard','splitPanel'],
  COMPANION:     ['prescriptionPair','compare','productSlot','bigType','splitPanel','circleSeal','numberedSteps'],
  NO_MANUAL:     ['notesApp','indexCard','quoteCard','faqCard','stickyNote','bigType','boxFrame'],
  EURO_STANDARD: ['labelPanel','ruleStack','circleSeal','boxFrame','badgeGrid','quoteCard','bigType'],
  RITUAL:        ['timeline','numberedSteps','notesApp','statBlock','checklist','indexCard','productSlot'],
  CLEAN_LABEL:   ['badgeGrid','labelPanel','checklist','ruleStack','marquee','statBlock','boxFrame'],
  PRACTITIONER:  ['quoteCard','faqCard','notesApp','indexCard','boxFrame','stickyNote','ruleStack'],
  NUTRIENT_GAP:  ['statBlock','compare','mythFact','bigType','splitPanel','gradientHero','ruleStack','faqCard'],
  CONFIDENCE:    ['gradientHero','quoteCard','stickyNote','bigType','circleSeal','boxFrame','marquee'],
  OFFER:         ['statBlock','marquee','bigType','productSlot','boxFrame','splitPanel','checklist'],
};

/* Target creative count per angle -> 500 total. Weighted by strategic priority. */
const TARGETS = {
  GI_SPECIFIC:65, FINALLY_NORMAL:60, NUTRIENT_GAP:50, COMPANION:45,
  STAY_COURSE:40, FIBER_FAILS:40, RITUAL:35, CLEAN_LABEL:35, NO_MANUAL:35,
  EURO_STANDARD:30, PRACTITIONER:25, CONFIDENCE:25, OFFER:15,
};

function compose({ seed = 20260921, total = 500, productImage = null, enableGatedClaims = false } = {}) {
  const r = rng(seed);
  const angles = COPY.ANGLES.filter(a => !a.requiresRealData);
  const creatives = [];
  const seen = new Set();

  for (const angle of angles) {
    const want = TARGETS[angle.code] || 20;
    const prefer = AFFINITY[angle.code] || Object.keys(LAYOUTS);
    const others = Object.keys(LAYOUTS).filter(k => !prefer.includes(k));
    let hi = 0, made = 0, guard = 0;

    while (made < want && guard++ < want * 40) {
      // round-robin headlines for maximum coverage of the bank
      const headline = angle.headlines[hi % angle.headlines.length]; hi++;
      // 80% preferred layout, 20% wildcard for variety
      const layoutId = r() < 0.8 ? pickOne(r, prefer) : pickOne(r, others.length ? others : prefer);
      const key = `${headline}||${layoutId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const pal = pickOne(r, PALETTES);
      const tsPool = TYPESETS.filter(t => t.moods.includes(pal.mood));
      const ts = pickOne(r, tsPool.length ? tsPool : TYPESETS);

      creatives.push({
        id: String(creatives.length + 1).padStart(4, '0'),
        angle: angle.code,
        angleName: angle.name,
        desire: angle.desire,
        layout: layoutId,
        palette: pal.id,
        typeset: ts.id,
        headline,
        subhead: pickOne(r, angle.subheads),
        eyebrow: pickOne(r, angle.eyebrows),
        cta: pickOne(r, COPY.CTAS),
        facts: sample(r, COPY.FACTS, 6),
        searchQuery: pickOne(r, SEARCH_QUERIES),
        searchSuggestions: pickOne(r, SEARCH_SUGGESTIONS),
        timelineSteps: pickOne(r, TIMELINES),
        stat: pickOne(r, STATS),
        comparePair: pickOne(r, COMPARE_PAIRS),
        mythPair: pickOne(r, MYTHS_BY_ANGLE[angle.code] || MYTH_FALLBACK),
        noteDate: pickOne(r, NOTE_DATES),
        disclaimerShort: COPY.DISCLAIMER_SHORT,
        productImage,
        gatedClaim: (enableGatedClaims && angle.gatedClaims) ? pickOne(r, angle.gatedClaims).text : null,
      });
      made++;
    }
  }

  // Trim/pad to exactly `total`
  const out = creatives.slice(0, total);
  out.forEach((c, i) => { c.id = String(i + 1).padStart(4, '0'); });

  // Lint every emitted string
  for (const c of out) {
    COPY.lintAll([c.headline, c.subhead, c.eyebrow, c.cta, c.stat.label, c.mythPair.myth, c.searchQuery], `creative ${c.id}`);
  }
  return out;
}

/* Dense, vertically-stacked layouts do not read at 1200x628. Rather than
   crushing them to fit, substitute a wide-friendly layout for that placement
   only. The manifest records the layout actually rendered. */
const WIDE_UNSUITABLE = {
  checklist:'badgeGrid', notesApp:'indexCard', marquee:'splitPanel',
  searchBar:'bigType',   labelPanel:'ruleStack',
};
function layoutForFormat(layoutId, fmtId) {
  if (fmtId === '191x1' && WIDE_UNSUITABLE[layoutId]) return WIDE_UNSUITABLE[layoutId];
  return layoutId;
}

module.exports = { compose, FORMATS, LAYOUTS, layoutForFormat, WIDE_UNSUITABLE };

if (require.main === module) {
  const cs = compose();
  const byAngle = {}, byLayout = {}, byPal = {};
  cs.forEach(c => { byAngle[c.angle]=(byAngle[c.angle]||0)+1; byLayout[c.layout]=(byLayout[c.layout]||0)+1; byPal[c.palette]=(byPal[c.palette]||0)+1; });
  console.log('creatives:', cs.length, '| x', FORMATS.length, 'formats =', cs.length*FORMATS.length, 'assets');
  console.log('unique headlines used:', new Set(cs.map(c=>c.headline)).size);
  console.log('by angle:', byAngle);
  console.log('layouts used:', Object.keys(byLayout).length, byLayout);
  console.log('palettes:', byPal);
}
