import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {Script} from 'node:vm';
const engine=readFileSync(new URL('../game-original.html',import.meta.url),'utf8');
const launcher=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const assets=['logo-m.png','logo-mot.webp','illustration.webp'];

test('local artwork can survive removal of the old Github Pages site',()=>{
  for(const asset of assets){
    assert.ok(statSync(new URL('../'+asset,import.meta.url)).size>1000,asset);
    assert.ok(launcher.includes('https://mr-tat.github.io/CE-Addition-simple/'+asset));
  }
  assert.ok(!launcher.includes('https://mr-tat.github.io/Addition-ecrite-simple/'));
});
test('classic and Connect launcher preserve separate storage and score bridge',()=>{
  assert.match(launcher,/const scopedBootstrap=/);
  assert.match(launcher,/window\.MathasPilotBridge/);
  assert.match(launcher,/expectedResetEpoch:resetEpoch/);
  assert.match(launcher,/ce-addition\.pending\./);
});
test('guided hints, position observers and layout anchors remain in the engine',()=>{
  for(const token of ['function showMathasHintOverlay','mathas-p120-guided-rail-js','mathas-p120-guided-bubble-js','getBoundingClientRect','new MutationObserver(sync)','ResizeObserver'])
    assert.ok(engine.includes(token),token);
});
test('no background DOM polling while a tab is hidden',()=>{
  for(const token of [
    'setInterval(()=>{if(!document.hidden)refresh()},600)',
    'setInterval(()=>{if(!document.hidden)watchSuddenMilestones()},135)',
    'setInterval(()=>{if(!document.hidden)watch()},650)',
    "setInterval(()=>{if(document.hidden)return;const m=document.getElementById('menuScreen')"
  ]) assert.ok(engine.includes(token),token);
});
test('all original inline JavaScript chunks still parse',()=>{
  const scripts=[...engine.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length>=25);
  scripts.forEach((match,i)=>assert.doesNotThrow(()=>new Script(match[1],{filename:'engine-script-'+i+'.js'}),'script '+i));
});
