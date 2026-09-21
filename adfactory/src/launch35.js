'use strict';
/* The 35 launch creatives — one per ad set, each a distinct testable hypothesis.
   Hand-picked rather than sampled: every line is chosen for the angle it tests. */
const COPY = require('./copy');

const KICKER = {
  digestive: 'Daily digestive support · 60 capsules',
  companion: 'A companion to your GLP-1 · never a replacement',
  routine:   'Two capsules daily · one month per bottle',
  label:     'Non-GMO · Vegetarian · Allergen-free',
  made:      'Made in the USA · sold by LEAF',
};

const ADS = [
  // ---- GI_SPECIFIC : the least-contested, highest-intent territory ----
  { angle:'GI_SPECIFIC', layout:'centeredHero', palette:'leafDeep',
    h:'Built for a GLP-1 gut.', s:KICKER.digestive, e:'Digestive support', cta:'Shop LF-1' },
  { angle:'GI_SPECIFIC', layout:'bigType', palette:'leafCream',
    h:'We take care of your GLP-1 sides.', s:'LF-1 is daily digestive support made for people on a GLP-1.', e:'Daily digestive support', cta:'Shop LF-1' },
  { angle:'GI_SPECIFIC', layout:'mythFactPill', palette:'leafNoir',
    h:'Built for GLP-1 digestion, not general wellness.', s:'Two capsules daily. 60 per bottle.', e:'Digestive support',
    myth:{myth:'A GLP-1 gut is the same as any other.'}, cta:'See the formula' },
  { angle:'GI_SPECIFIC', layout:'contrastPanel', palette:'leafCream',
    h:'No laxatives in the formula.', s:'Digestive Support · two capsules daily.', e:'What’s in it, what isn’t', cta:'Read the label',
    cmp:{aTitle:'A general gut fix', a:['A single lever','Powder, scoop, shaker','Built for the average gut'],
         bTitle:'LF-1', b:['A daily formulation','Two capsules, no mixing','Built for GLP-1 routines']} },
  { angle:'GI_SPECIFIC', layout:'labelPanel', palette:'leafDeep',
    h:'Digestive support that fits the protocol.', s:'Category: Digestive Support. Dose: two capsules daily.', e:'LF-1 at a glance', cta:'See the formula' },
  { angle:'GI_SPECIFIC', layout:'ruleStack', palette:'leafCream',
    h:'Made for how a GLP-1 actually works.', s:'Designed around slower gastric emptying, not general gut health.', e:'Gut-first formulation', cta:'Learn more' },
  { angle:'GI_SPECIFIC', layout:'quoteCard', palette:'sage',
    h:'Your gut is on this journey too.', s:'Daily digestive support for people on a GLP-1.', e:'Digestive support', cta:'Shop LF-1' },

  // ---- FINALLY_NORMAL : the proven emotional territory ----
  { angle:'FINALLY_NORMAL', layout:'bigType', palette:'leafNoir',
    h:'Finally, a GLP-1 morning that feels normal.', s:'Built around the routine, not around the scale.', e:'For life on a GLP-1', cta:'Shop LF-1' },
  { angle:'FINALLY_NORMAL', layout:'splitPanel', palette:'leafDeep',
    h:'Your GLP-1 is doing its job. LF-1 handles the rest.', s:'A daily digestive companion for the part nobody briefs you on.', e:'The companion capsule', cta:'Get LF-1' },
  { angle:'FINALLY_NORMAL', layout:'centeredHero', palette:'leafCream',
    h:'Feel like yourself again.', s:KICKER.companion, e:'For life on a GLP-1', cta:'Shop LF-1' },
  { angle:'FINALLY_NORMAL', layout:'stickyNote', palette:'leafDeep',
    h:'The companion your GLP-1 came without.', s:'Two capsules each morning. 60 per bottle.', e:'The companion capsule', cta:'Shop LF-1' },
  { angle:'FINALLY_NORMAL', layout:'quoteCard', palette:'leafCream',
    h:'The missing half of your GLP-1 routine.', s:'One simple daily step alongside your GLP-1.', e:'The companion capsule', cta:'Learn more' },

  // ---- NUTRIENT_GAP : the differentiated argument, validated by the LP ----
  { angle:'NUTRIENT_GAP', layout:'bigType', palette:'leafCream',
    h:'Eating less doesn’t mean needing less.', s:'A GLP-1 reduces appetite — and everything that comes in with food.', e:'The intake question', cta:'See the formula' },
  { angle:'NUTRIENT_GAP', layout:'contrastPanel', palette:'leafNoir',
    h:'Smaller plates. Same requirements.', s:'Formulated for people eating substantially less than before.', e:'Smaller plates, same needs', cta:'Learn more',
    cmp:{aTitle:'What changed', a:['Portions got smaller','Meals got fewer','Appetite dropped'],
         bTitle:'What didn’t', b:['Your daily requirements','Your body’s workload','The need to cover the gap']} },
  { angle:'NUTRIENT_GAP', layout:'statBlock', palette:'leafDeep',
    h:'Your appetite dropped. Your needs didn’t.', s:'Two capsules daily, taken alongside your routine.', e:'The intake question', cta:'Shop LF-1',
    stat:{n:'2', label:'capsules daily'} },
  { angle:'NUTRIENT_GAP', layout:'mythFactPill', palette:'leafCream',
    h:'A GLP-1 changes intake. Plan for it.', s:'Daily support for people eating far less than before.', e:'The intake question',
    myth:{myth:'Eating less means your body needs less.'}, cta:'Learn more' },
  { angle:'NUTRIENT_GAP', layout:'faqCard', palette:'sage',
    h:'The maths nobody does on a GLP-1.', s:'When portions shrink, everything that comes in with food shrinks too.', e:'The intake question', cta:'See the formula' },

  // ---- COMPANION : the positioning that keeps this legal and on-strategy ----
  { angle:'COMPANION', layout:'prescriptionPair', palette:'leafCream',
    h:'A companion, never a replacement.', s:'LF-1 does not replace your GLP-1. It sits alongside it.', e:'Your GLP-1 companion', cta:'Learn more' },
  { angle:'COMPANION', layout:'contrastPanel', palette:'leafDeep',
    h:'Built for injections and oral GLP-1s alike.', s:'One daily companion, whichever route you’re on.', e:'Your GLP-1 companion', cta:'Shop LF-1',
    cmp:{aTitle:'Your GLP-1', a:['Prescribed by your clinician','Weekly or daily','Handles appetite'],
         bTitle:'LF-1', b:['Chosen by you','Every morning','Daily digestive support']} },
  { angle:'COMPANION', layout:'centeredHero', palette:'leafNoir',
    h:'Purpose-built to complement, not compete.', s:KICKER.companion, e:'The companion capsule', cta:'Shop LF-1' },
  { angle:'COMPANION', layout:'indexCard', palette:'sand',
    h:'The other half of the protocol.', s:'A companion to your GLP-1 — never a replacement for it.', e:'The companion capsule', cta:'Learn more' },

  // ---- STAY_COURSE : retention, uncontested in the corpus ----
  { angle:'STAY_COURSE', layout:'timeline', palette:'leafCream',
    h:'Month one is easy. LF-1 is for month four.', s:'Built for the long stretch, not the first week.', e:'Built for the long stretch', cta:'Start with one month' },
  { angle:'STAY_COURSE', layout:'mythFactPill', palette:'leafDeep',
    h:'Support the course you already committed to.', s:'Made for people who intend to finish.', e:'For the full course',
    myth:{myth:'People stop because they lose motivation.'}, cta:'Learn more' },
  { angle:'STAY_COURSE', layout:'boxFrame', palette:'leafNoir',
    h:'Built for people who don’t quit.', s:'A daily habit for a long commitment.', e:'Month three and beyond', cta:'Shop LF-1' },

  // ---- FIBER_FAILS : mechanism reframe ----
  { angle:'FIBER_FAILS', layout:'bigType', palette:'leafDeep',
    h:'GLP-1? Think beyond fiber.', s:'A GLP-1 slows gastric emptying — support should account for that.', e:'A different approach', cta:'See the formula' },
  { angle:'FIBER_FAILS', layout:'contrastPanel', palette:'leafCream',
    h:'Why a generic fiber scoop isn’t built for this.', s:'Purpose-built rather than general-purpose.', e:'Not another fiber scoop', cta:'Learn more',
    cmp:{aTitle:'More fiber', a:['A single lever','Volume-based','Not routine-specific'],
         bTitle:'LF-1', b:['A daily formulation','Capsule format','Made for this routine']} },
  { angle:'FIBER_FAILS', layout:'mythFactPill', palette:'leafNoir',
    h:'Built for the mechanism, not the symptom.', s:'Designed around how a GLP-1 behaves.', e:'Mechanism matters',
    myth:{myth:'More fiber is the whole answer.'}, cta:'Learn more' },

  // ---- CLEAN_LABEL : trust, and the LP’s own line ----
  { angle:'CLEAN_LABEL', layout:'centeredHero', palette:'leafCream',
    h:'Whole ingredients. Zero compromise.', s:KICKER.label, e:'Read the label', cta:'Read the label' },
  { angle:'CLEAN_LABEL', layout:'badgeGrid', palette:'leafDeep',
    h:'Eight things LF-1 isn’t.', s:'Everything on the label, nothing behind it.', e:'Plainly labelled', cta:'Read the label' },
  { angle:'CLEAN_LABEL', layout:'labelPanel', palette:'leafNoir',
    h:'Read the label. That’s the pitch.', s:'60 vegetarian capsules. Two daily.', e:'Plainly labelled', cta:'See the formula' },

  // ---- RITUAL ----
  { angle:'RITUAL', layout:'numberedSteps', palette:'leafCream',
    h:'Two capsules. Every morning. That’s it.', s:'Capsule format. No powder, no shaker, no flavour to tolerate.', e:'The daily step', cta:'Shop LF-1' },
  { angle:'OFFER', layout:'statBlock', palette:'sage',
    h:'A month of support for \u20ac35.', s:'60 capsules. Two daily. Available at leaf-pure.com.', e:'\u20ac35 \u00b7 60 capsules', cta:'Start with one month',
    stat:{n:'\u20ac35', label:'one month, 60 capsules'} },

  // ---- NO_MANUAL ----
  { angle:'NO_MANUAL', layout:'notesApp', palette:'sand',
    h:'Because a GLP-1 doesn’t come with a manual.', s:'Made for people already on a GLP-1 and figuring out the rest.', e:'What nobody mentioned', cta:'Learn more' },
  { angle:'NO_MANUAL', layout:'quoteCard', palette:'leafDeep',
    h:'Everybody covers week one. Nobody covers week nine.', s:'Support for the months after the first appointment.', e:'The missing instructions', cta:'Learn more' },

  // ---- EURO_STANDARD ----
  { angle:'EURO_STANDARD', layout:'circleSeal', palette:'leafCream',
    h:'Regulated market. Honest label.', s:'LEAF is a Netherlands-based brand. LF-1 is manufactured in the USA.', e:'European labelling standards', cta:'Learn more' },
];

const TIMELINE = [{k:'Every morning',v:'Two capsules with water'},{k:'Every day',v:'Same time, no thinking'},{k:'Every month',v:'One bottle, 60 capsules'}];

function build() {
  if (ADS.length !== 35) throw new Error(`expected 35 ads, got ${ADS.length}`);
  return ADS.map((a, i) => {
    const c = {
      id: String(i + 1).padStart(2, '0'),
      angle: a.angle, angleName: a.angle, desire: '', layout: a.layout, palette: a.palette,
      typeset: null,
      headline: a.h, subhead: a.s, eyebrow: a.e, cta: a.cta,
      facts: COPY.FACTS.slice(0, 6),
      searchQuery: 'glp-1 daily support', searchSuggestions: ['glp-1 daily companion supplement'],
      timelineSteps: TIMELINE,
      stat: a.stat || { n: '60', label: 'capsules per bottle' },
      comparePair: a.cmp || { aTitle:'A general gut fix', a:['A single lever'], bTitle:'LF-1', b:['Built for this routine'] },
      mythPair: a.myth || { myth:'Every gut supplement works the same way.' },
      noteDate: 'Tue 07:40',
      disclaimerShort: COPY.DISCLAIMER_SHORT,
      productImage: null, gatedClaim: null,
    };
    COPY.lintAll([c.headline, c.subhead, c.eyebrow, c.cta, c.mythPair.myth, c.stat.label,
                  ...c.comparePair.a, ...c.comparePair.b, c.comparePair.aTitle, c.comparePair.bTitle], `launch ${c.id}`);
    return c;
  });
}

module.exports = { build, ADS };

if (require.main === module) {
  const cs = build();
  const byA = {}, byL = {}, byP = {};
  cs.forEach(c => { byA[c.angle]=(byA[c.angle]||0)+1; byL[c.layout]=(byL[c.layout]||0)+1; byP[c.palette]=(byP[c.palette]||0)+1; });
  console.log('ads:', cs.length, '| compliance: PASS');
  console.log('angles:', byA);
  console.log('layouts:', Object.keys(byL).length, byL);
  console.log('palettes:', byP);
}
