'use strict';
const fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const sharp=require('sharp');
const {compose,FORMATS,LAYOUTS,layoutForFormat}=require('./compose');
const {buildHTML}=require('./render');
const ROOT=path.join(__dirname,'..'),BUILD=path.join(ROOT,'build'),QA=path.join(ROOT,'out','qa');
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FIT=fs.readFileSync(path.join(__dirname,'render.js'),'utf8').match(/const FIT_SCRIPT = `([\s\S]*?)`;/)[1];

(async()=>{
  const fmtId=process.argv[2]||'1x1';
  const fmt=FORMATS.find(f=>f.id===fmtId);
  const all=compose();
  // one creative per layout
  const picks=[]; const seen=new Set();
  for(const c of all){ if(!seen.has(c.layout)){seen.add(c.layout);picks.push(c);} }
  fs.mkdirSync(BUILD,{recursive:true}); fs.mkdirSync(QA,{recursive:true});
  const b=await chromium.launch({executablePath:CHROME,args:['--no-sandbox','--font-render-hinting=none']});
  const p=await b.newPage();
  const tiles=[];
  for(const c of picks){
    const hp=path.join(BUILD,'qa.html');
    fs.writeFileSync(hp,buildHTML(c,fmt));
    await p.setViewportSize({width:fmt.w,height:fmt.h});
    await p.goto('file://'+hp,{waitUntil:'load'});
    await p.evaluate('document.fonts.ready');
    await p.evaluate('('+FIT+')('+JSON.stringify(fmtId)+')');
    const buf=await p.screenshot({type:'png'});
    tiles.push({layout:layoutForFormat(c.layout,fmt.id),buf});
  }
  await b.close();

  // contact sheet: 5 across
  const COLS=5, TW=360, TH=Math.round(TW*fmt.h/fmt.w), PADT=26, GAP=10;
  const rows=Math.ceil(tiles.length/COLS);
  const W=COLS*TW+(COLS+1)*GAP, H=rows*(TH+PADT)+(rows+1)*GAP;
  const comps=[];
  for(let i=0;i<tiles.length;i++){
    const cx=i%COLS, cy=Math.floor(i/COLS);
    const x=GAP+cx*(TW+GAP), y=GAP+cy*(TH+PADT+GAP);
    comps.push({input:await sharp(tiles[i].buf).resize(TW,TH).png().toBuffer(),left:x,top:y+PADT});
    const label=Buffer.from(`<svg width="${TW}" height="${PADT}"><text x="0" y="16" font-family="monospace" font-size="15" fill="#111">${i+1}. ${tiles[i].layout}</text></svg>`);
    comps.push({input:label,left:x,top:y});
  }
  const out=path.join(QA,`contact-${fmtId}.png`);
  await sharp({create:{width:W,height:H,channels:3,background:'#ffffff'}}).composite(comps).png().toFile(out);
  console.log('contact sheet:',out,`${tiles.length} layouts`);
})();
