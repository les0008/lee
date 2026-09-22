'use strict';
/* Geo targeting for the LF-1 launch, exactly as specified:
   13 whole states, plus Atlanta and Los Angeles as metro radii only —
   Georgia and California are NOT targeted statewide. */

/* Meta US state region keys run alphabetically from 3843 (Alabama) to 3893
   (Wyoming), 51 entries including DC. There is no targeting-search tool on
   this MCP server to resolve names -> keys, so these are asserted, not
   looked up. VERIFY ON FIRST USE: the ad-set create response echoes the
   resolved targeting spec with region names. Read them back before the
   second ad set is created. */
const US_REGION_KEYS = {
  Alabama:'3843', Alaska:'3844', Arizona:'3845', Arkansas:'3846', California:'3847',
  Colorado:'3848', Connecticut:'3849', Delaware:'3850', 'District of Columbia':'3851',
  Florida:'3852', Georgia:'3853', Hawaii:'3854', Idaho:'3855', Illinois:'3856',
  Indiana:'3857', Iowa:'3858', Kansas:'3859', Kentucky:'3860', Louisiana:'3861',
  Maine:'3862', Maryland:'3863', Massachusetts:'3864', Michigan:'3865', Minnesota:'3866',
  Mississippi:'3867', Missouri:'3868', Montana:'3869', Nebraska:'3870', Nevada:'3871',
  'New Hampshire':'3872', 'New Jersey':'3873', 'New Mexico':'3874', 'New York':'3875',
  'North Carolina':'3876', 'North Dakota':'3877', Ohio:'3878', Oklahoma:'3879',
  Oregon:'3880', Pennsylvania:'3881', 'Rhode Island':'3882', 'South Carolina':'3883',
  'South Dakota':'3884', Tennessee:'3885', Texas:'3886', Utah:'3887', Vermont:'3888',
  Virginia:'3889', Washington:'3890', 'West Virginia':'3891', Wisconsin:'3892', Wyoming:'3893',
};

const STATES = ['Alabama','Florida','Kentucky','Louisiana','Maine','Massachusetts',
  'Mississippi','New Jersey','New York','Oklahoma','Rhode Island','West Virginia','Wisconsin'];

/* Metro radii use custom_locations (lat/lon + radius) rather than city keys.
   No city-key lookup exists on this server, and coordinates are unambiguous. */
const METROS = [
  { name:'Atlanta, Georgia',       latitude:33.7490, longitude:-84.3880,  radius:40 },
  { name:'Los Angeles, California',latitude:34.0522, longitude:-118.2437, radius:61 },
];

function targeting() {
  return {
    geo_locations: {
      regions: STATES.map(s => ({ key: US_REGION_KEYS[s] })),
      custom_locations: METROS.map(m => ({
        latitude: m.latitude, longitude: m.longitude,
        radius: m.radius, distance_unit: 'kilometer', name: m.name,
      })),
      location_types: ['home', 'recent'],
    },
    age_min: 25,
    age_max: 65,
  };
}

module.exports = { targeting, STATES, METROS, US_REGION_KEYS };

if (require.main === module) {
  const missing = STATES.filter(s => !US_REGION_KEYS[s]);
  if (missing.length) { console.error('unmapped:', missing); process.exit(1); }
  const keys = Object.values(US_REGION_KEYS).map(Number);
  console.log('region key range:', Math.min(...keys), '-', Math.max(...keys),
              '| entries:', keys.length, '| contiguous:', Math.max(...keys)-Math.min(...keys)+1===keys.length);
  console.log('states targeted:', STATES.length);
  console.log('Georgia statewide?', STATES.includes('Georgia'), '| California statewide?', STATES.includes('California'));
  console.log('metros:', METROS.map(m=>m.name+' +'+m.radius+'km').join(', '));
  console.log('\nspec:\n' + JSON.stringify(targeting()));
}
