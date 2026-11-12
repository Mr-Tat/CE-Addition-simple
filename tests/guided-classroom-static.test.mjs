import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const base=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,base),'utf8');
test('Le moteur source reste distinct de son pont collectif',()=>{
 const native=read('game-original.html'),host=read('index.html');
 const hook="primaryBtn.addEventListener('click',handlePrimary);";
 assert.equal(native.split(hook).length,2);
 assert.match(native,/function generateAddition\(maxDigits\)/);
 assert.match(host,/if\(mode==='connected'\)\{/);
 assert.match(host,/collective-native-bridge\.js/);
 assert.match(host,/connect-guided-written/);
 assert.match(host,/guidedCollective\?\.mount\(\)/);
 assert.doesNotMatch(native,/MathasGuidedBridge/);
});
test('Contrat, pont et contrôleur ont une syntaxe JavaScript valide',()=>{
 for(const p of ['collective-contract.mjs','collective-native-bridge.js','collective-draft.mjs','collective-ui.mjs'])
  execFileSync(process.execPath,['--check',new URL(p,base).pathname]);
});
test('Le script hôte reste un module JS valide et passe son app_key en lecture serveur',()=>{
 const host=read('index.html');
 const body=host.split('<script type="module">')[1]?.split('</script></body></html>')[0];
 assert.ok(body&&body.length>1000);
 assert.match(body,/appKey:APP/);
 const dir=mkdtempSync(join(tmpdir(),'guided-add-static-'));
 try{
  const file=join(dir,'host.mjs');writeFileSync(file,body);
  execFileSync(process.execPath,['--check',file]);
 }finally{rmSync(dir,{recursive:true,force:true})}
});
