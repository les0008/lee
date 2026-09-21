'use strict';
const fs=require('fs'), path=require('path');
const { chromium } = require('playwright');
const sharp = require('sharp');
require('./layouts/extra');
const { LAYOUTS } = require('./layouts');
const { PALETTE_BY_ID, TYPESETS, FORMATS, baseCSS } = require('./brand');
const { build } = require('./launch35');
const BG = require('./backgrounds');

const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT=path.join(__dirname,'..'), BUILD=path.join(ROOT,'build'), OUT=path.join(ROOT,'out','launch35');
const FIT = fs.readFileSync(path.join(__dirname,'render.js'),'utf8').match(/const FIT_SCRIPT = `([\s\S]*?)`;/)[1];

// deterministic typeset per palette mood
const TS_FOR = { leafCream:'editorial', leafDeep:'editorial', leafNoir:'grotesk', sage:'humanist', sand:'luxe' };

function html(c, fmt){
  const pal = PALETTE_BY_ID[c.palette];
  const ts  = TYPESETS.find(t=>t.id===(TS_FOR[c.palette]||'grotesk'));
  const ctx = Object.assign({}, c, { fmt, pal, ts, pick:(a,n)=>a.slice(0,n) });
  const inner = LAYOUTS[c.layout].fn(ctx);
  const bg = BG.render(c, pal);
  const css = baseCSS(fmt,pal,ts).replace(/node_modules\/@fontsource/g,'../node_modules/@fontsource')
    + `.bglayer{position:absolute;inset:0;z-index:0;overflow:hidden}
       .content{position:relative;z-index:1;height:100%;display:flex;flex-direction:column}`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="canvas"><div class="bglayer">${bg}</div><div class="content">${inner}</div></div></body></html>`;
}

(async()=>{
  const fmt = FORMATS.find(f=>f.id===(process.argv[2]||'4x5'));
  fs.mkdirSync(BUILD,{recursive:true}); fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
  const ads = build();
  const b = await chromium.launch({executablePath:CHROME,args:['--no-sandbox','--font-render-hinting=none','--force-color-profile=srgb']});
  const p = await b.newPage({deviceScaleFactor:1});
  const manifest=[]; let over=0;
  for(const c of ads){
    const hp = path.join(BUILD,'launch.html');
    fs.writeFileSync(hp, html(c,fmt));
    await p.setViewportSize({width:fmt.w,height:fmt.h});
    await p.goto('file://'+hp,{waitUntil:'load'});
    await p.evaluate('document.fonts.ready');
    const st = await p.evaluate('('+FIT+')('+JSON.stringify(fmt.id)+')');
    if(st==='OVERFLOW'){ over++; console.log('  OVERFLOW', c.id, c.layout); }
    const name = `LF1_${c.id}_${c.angle}_${c.layout}_${c.palette}_${fmt.id}.png`;
    const buf = await p.screenshot({type:'png'});
    await sharp(buf).png({palette:true,colours:160,effort:8,dither:.6}).toFile(path.join(OUT,name));
    manifest.push({n:Number(c.id), file:name, angle:c.angle, layout:c.layout, palette:c.palette,
                   headline:c.headline, subhead:c.subhead, eyebrow:c.eyebrow, cta:c.cta});
  }
  await b.close();
  fs.writeFileSync(path.join(ROOT,'out','launch35.json'), JSON.stringify(manifest,null,2));
  console.log(`rendered ${manifest.length} at ${fmt.id}, ${over} overflow -> out/launch35/`);
})().catch(e=>{console.error(e);process.exit(1);});
