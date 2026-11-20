// Direct Addition simple: actual native guided/classic engine, SDK unavailable.
// This test uses only fictitious UUIDs and a local HTTP fixture.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,extname,sep} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const classId='4bf3400d-a315-4ea4-a2f3-afaca24dc9b9';
function serve(){
 const http=createServer((req,res)=>{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=resolve(root,'.'+(path==='/'?'/index.html':path));
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return}
  try{
   const bytes=readFileSync(file),ext=extname(file);
   const type=ext==='.html'?'text/html; charset=utf-8':ext==='.js'||ext==='.mjs'?'text/javascript; charset=utf-8':ext==='.png'?'image/png':ext==='.webp'?'image/webp':'application/octet-stream';
   res.writeHead(200,{'content-type':type,'cache-control':'no-store'}).end(bytes);
  }catch{res.writeHead(404).end('Not found')}
 });
 return http;
}
async function open(browser,url,query){
 const page=await browser.newPage({viewport:{width:1024,height:800}});
 const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{
  const target=route.request().url();
  if(target.startsWith(url+'/'))return route.continue();
  external.push(target);return route.abort('internetdisconnected');
 });
 await page.goto(url+'/'+query,{waitUntil:'domcontentloaded'});
 return {page,errors,external};
}
async function playGuidedAndClassic(page){
 const game=page.frameLocator('iframe');
 await game.locator('#menuScreen').waitFor({state:'visible',timeout:16000});
 await game.locator('#trainingChoiceBtn').click();
 await game.locator('#gameScreen').waitFor({state:'visible'});
 assert.ok(await game.locator('#calculationsPair .calc-box').count()>0,'no guided calculations');
 await game.locator('#menuBtn').click();
 await game.locator('#menuScreen').waitFor({state:'visible'});
 await game.locator('.classic-count-btn[data-count="4"]').click();
 await game.locator('#gameScreen').waitFor({state:'visible'});
 assert.ok(await game.locator('#calculationsPair .calc-box').count()>0,'no classic calculations');
}
test('Addition simple: URL libre avec/sans classe, vrai guidé et classique sans SDK', {timeout:120000},async()=>{
 const http=serve();await new Promise(ok=>http.listen(0,'127.0.0.1',ok));
 const url='http://127.0.0.1:'+http.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
 try{
  for(const query of ['?libre=1','?libre=1&class='+classId]){
   const {page,errors,external}=await open(browser,url,query);
   try{
    await playGuidedAndClassic(page);
    assert.equal(external.some(v=>v.includes('supabase')),false,'a free game should not load Supabase');
    assert.deepEqual(errors,[]);
   }finally{await page.close()}
  }
 }finally{await browser.close();await new Promise(ok=>http.close(ok))}
});
test('Addition simple: absence de SDK refuse la certification, repli libre volontaire', {timeout:120000},async()=>{
 const http=serve();await new Promise(ok=>http.listen(0,'127.0.0.1',ok));
 const url='http://127.0.0.1:'+http.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
 try{
  for(const query of ['?class='+classId,'?class='+classId+'&requireConnect=1']){
   const {page,errors}=await open(browser,url,query);
   try{
    const free=page.getByRole('button',{name:'Jouer sans synchronisation'});
    await free.waitFor({state:'visible',timeout:16000});
    assert.equal(await page.locator('iframe').count(),0,'no unverified official game');
    await free.click();
    await page.frameLocator('iframe').locator('#menuScreen').waitFor({state:'visible',timeout:16000});
    const changed=new URL(page.url());
    assert.equal(changed.searchParams.get('class'),classId);
    assert.equal(changed.searchParams.get('libre'),'1');
    assert.equal(changed.searchParams.has('requireConnect'),false);
    assert.equal(await page.evaluate(()=>localStorage.getItem('mathas.connect.mode-libre.v1')),null,
     'the fallback must not disconnect other apps');
    await playGuidedAndClassic(page);
    assert.deepEqual(errors,[]);
   }finally{await page.close()}
  }
 }finally{await browser.close();await new Promise(ok=>http.close(ok))}
});
