'use strict';
const A = require('./hooks-a');
const B = require('./hooks-b');
const ANGLES = [...A, ...B];

const CTAS = [
  'Shop LF-1','See the formula','Read the label','Start with one month',
  'Learn more','View LF-1','Get LF-1','See what’s in it','Shop now','Explore LF-1',
];

/* Factual, verifiable product statements only. No invented numbers. */
const FACTS = [
  '60 capsules',
  'Two capsules daily',
  'Vegetarian capsules',
  'Non-GMO',
  'Gluten-free',
  'Lactose-free',
  'Allergen-free',
  'Antibiotic-free',
  'Hormone-free',
  'Alcohol-free',
  'Made in the USA',
  'One month supply',
  '€49',
  'Digestive Support',
];

const DISCLAIMER_SHORT = 'Food supplement. Not a substitute for a varied diet or your prescribed treatment.';
const DISCLAIMER_FDA = 'These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.';

/* ---------------- Compliance linter ----------------
   Runs on every emitted string. A violation throws the build. */

const BANNED = [
  // prescription brand + molecule names (trademark + Meta policy)
  { re:/\b(ozempic|wegovy|mounjaro|zepbound|saxenda|victoza|trulicity|rybelsus)\b/i, why:'prescription brand name' },
  { re:/\b(semaglutide|tirzepatide|liraglutide|dulaglutide)\b/i, why:'prescription molecule name' },
  // disease claims (FDA / EFSA)
  { re:/\b(cure|cures|cured|treats?|treating|heals?|healing)\b/i, why:'disease claim verb' },
  { re:/\b(prevents?|preventing|reverses?|reversing)\b/i, why:'disease claim verb' },
  { re:/\b(eliminates?|eradicates?)\b/i, why:'absolute claim' },
  { re:/\bdiagnos(e|es|ing|is)\b/i, why:'diagnostic claim' },
  // outcome / weight promises
  { re:/\blose \d+|\b\d+\s?(kg|lbs?|pounds)\b/i, why:'weight-loss outcome claim' },
  { re:/\b(guaranteed results|guarantees? weight|melt|burn fat|shred)\b/i, why:'outcome promise' },
  { re:/\bmiracle|magic|instant results?\b/i, why:'unsubstantiated superlative' },
  // Meta personal-attribute assertion
  { re:/\byou (?:are|'re) (?:overweight|obese|constipated|suffering)\b/i, why:'asserts personal health status' },
  { re:/\bdo you (?:suffer|struggle) (?:from|with)\b/i, why:'asserts personal health status' },
  { re:/\byour (?:obesity|constipation|illness|disease|condition)\b/i, why:'asserts personal health status' },
];

/* Placeholders that must be substituted before render. */
const PLACEHOLDER = /\{\{[A-Z_]+\}\}/;

function lint(text, ctx = '') {
  if (typeof text !== 'string') return;
  for (const b of BANNED) {
    if (b.re.test(text)) {
      throw new Error(`COMPLIANCE [${b.why}] in ${ctx}: "${text}"`);
    }
  }
  if (PLACEHOLDER.test(text)) {
    throw new Error(`UNSUBSTITUTED PLACEHOLDER in ${ctx}: "${text}"`);
  }
}

function lintAll(strings, ctx) { strings.filter(Boolean).forEach(s => lint(s, ctx)); }

/* Self-test the entire bank at load time, excluding placeholder angles. */
function auditBank() {
  const problems = [];
  for (const a of ANGLES) {
    if (a.requiresRealData) continue;
    for (const list of ['eyebrows','headlines','subheads']) {
      for (const s of (a[list] || [])) {
        try { lint(s, `${a.code}.${list}`); }
        catch (e) { problems.push(e.message); }
      }
    }
  }
  [...CTAS, ...FACTS].forEach(s => { try { lint(s,'shared'); } catch(e){ problems.push(e.message); } });
  return problems;
}

module.exports = { ANGLES, CTAS, FACTS, DISCLAIMER_SHORT, DISCLAIMER_FDA, lint, lintAll, auditBank, BANNED };
