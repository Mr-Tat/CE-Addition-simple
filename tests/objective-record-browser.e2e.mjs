import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

// Véritable navigateur, mais page 100 % isolée sans identité ni crédit Connect.
const url='http://127.0.0.1:8123/essai-mode-score-3-vies.html';
const android='Mozilla/5.0 (Linux; Android 14; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
test('menu et démarrage des trois vies sur Chromium PC et téléphone',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:320,height:650}:{width:1440,height:900},
    ...(mobile?{isMobile:true,hasTouch:true,userAgent:android}:{}),reducedMotion:'reduce'});
   const supabase=[];
   page.on('request',r=>{if(/supabase\.co/.test(r.url()))supabase.push(r.url())});
   await page.goto(url,{waitUntil:'domcontentloaded'});
   const frame=page.frameLocator('#game');
   await frame.locator('#startThreeLives').waitFor({timeout:25000});
   assert.equal(await frame.locator('#startSudden').count(),1);
   assert.equal(await frame.locator('#menuScreen .classic-count-btn[data-count]').count(),3);
   const left=await frame.locator('#startThreeLives').boundingBox();
   const right=await frame.locator('#startSudden').boundingBox();
   assert.ok(left&&right);
   assert.ok(left.x+left.width<=right.x+2,'Boutons qui se chevauchent à cette résolution');
   await page.locator('#xp-preview-mode').selectOption('free');
   assert.equal(await frame.locator('.classic-xp-remaining').count(),0);
   await frame.locator('#startThreeLives').click();
   await frame.locator('#threeLivesHud .demo-heart').first().waitFor({timeout:25000});
   assert.equal(await frame.locator('#threeLivesHud .demo-heart').count(),3);
   assert.equal(await frame.locator('#threeLivesHud').getAttribute('hidden'),null);
   assert.match(await frame.locator('#sessionMode').textContent(),/3 vies/);
   // Essai de clavier sur le premier calcul, moteur réel.
   const target=frame.locator('#gameScreen input:not([disabled])').first();
   if(await target.count()){await target.focus();await page.keyboard.press('1')}
   assert.deepEqual(supabase,[]);
   await page.close();
  }
 }finally{await browser.close()}
});
