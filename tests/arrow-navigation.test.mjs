import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {Script,runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../game-original.html',import.meta.url),'utf8');
const start=src.indexOf('  function mathasArrowTarget('),end=src.indexOf('  window.mathasArrowTarget=mathasArrowTarget;',start);
assert.ok(start>0&&end>start);
const fn=runInNewContext(src.slice(start,end)+'\nmathasArrowTarget');
const cell=(x,y)=>({disabled:false,getBoundingClientRect:()=>({left:x,top:y,width:20,height:20})});
test('arrows follow the visible grid without changing values',()=>{
 const middle=cell(100,100),left=cell(70,100),right=cell(130,100),top=cell(100,65),bottom=cell(100,135);
 const c=[middle,left,right,top,bottom];
 assert.equal(fn(middle,'ArrowLeft',c),left);
 assert.equal(fn(middle,'ArrowRight',c),right);
 assert.equal(fn(middle,'ArrowUp',c),top);
 assert.equal(fn(middle,'ArrowDown',c),bottom);
});
test('disabled cells are skipped and borders never wrap',()=>{
 const a=cell(100,100),b=cell(130,100);b.disabled=true;
 assert.equal(fn(a,'ArrowRight',[a,b]),null);
 assert.equal(fn(a,'ArrowLeft',[a,b]),null);
});
test('the old numeric, backspace and enter controls remain intact',()=>{
 assert.match(src,/if\(mathasMoveArrow\(e\)\)return;/);
 assert.match(src,/if\(e.key==='Backspace'\|\|e.key==='Delete'\)/);
 assert.match(src,/if\(e.key==='Enter'\)/);
 assert.match(src,/e.target.matches\('input\[data-kind\]'\)/);
});
test('all embedded scripts still compile',()=>{
 const blocks=[...src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
 for(const [i,m] of blocks.entries())assert.doesNotThrow(()=>new Script(m[1]),'block '+i);
});
