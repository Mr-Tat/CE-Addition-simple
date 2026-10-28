import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const launcher=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const game=readFileSync(new URL('../game-original.html',import.meta.url),'utf8');
test('Addition : vol XP actif même en réglage animations réduites',()=>{
 const from=launcher.indexOf('async function animateXpGain(xp)');
 const to=launcher.indexOf('function queueXpGain(xp)',from);
 assert.ok(from>=0 && to>from);
 const block=launcher.slice(from,to);
 assert.match(block,/if\(document\.hidden\)\{finish\(\);return\}/);
 assert.doesNotMatch(block,/if\(reducedMotion\(\)\|\|document\.hidden\)/);
 assert.doesNotMatch(block,/const stillCelebration=reducedMotion\(\)/);
 assert.match(block,/el\.textContent|el\.append\(amount,text\)/);
 assert.match(block,/el\.classList\.add\('open'\)/);
 assert.doesNotMatch(block,/if\(stillCelebration\)/);
 assert.match(block,/const movement=el\.animate/);
 assert.match(block,/renderXpMeter\(total,endLevel\)/);
});
test('Addition : moteur pédagogique conservé et animation activée malgré les mouvements réduits',()=>{
 assert.ok(game.length>650000);
 assert.match(game,/const reducedMotion=\(\)=>false;/);
 assert.match(launcher,/const reducedMotion=\(\)=>false;/);
 assert.doesNotMatch(game,/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/);
 assert.doesNotMatch(launcher,/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/);
 assert.match(launcher,/if\(data\.xp\.delta>0\)queueXpGain\(data\.xp\)/);
 assert.match(launcher,/pointer-events:none/);
});
