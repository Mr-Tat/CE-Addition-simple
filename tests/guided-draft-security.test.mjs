import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../collective-native-bridge.js',import.meta.url),'utf8');
const digitsRTL=(value,length)=>Array.from({length},(_,c)=>Math.floor(value/10**c)%10);
function makeBridge(){const w={};runInNewContext(src,{window:w,digitsRTL});return w.MathasGuidedBridge}
const sessionId='f7d3f280-726e-4e61-86d2-13256aac1746';
function snapshot(page,states,overrides={}){return {sessionId,pages:[page],borrowMethod:'takeTop',...overrides,states}}
const page=[{a:'999',b:'111'},{a:'999',b:'111'}];
const n=String(999+111).split('').reverse();
const good=()=>({answerValues:n,carryValues:['','1','1'],wrongHistory:Array(n.length).fill(''),carryWrong:['','',''],firstTry:true,solved:true});
test('F5 valide : résultat et retenues effectivement fournis',()=>{
 const bridge=makeBridge();bridge.useSession(sessionId);
 assert.equal(bridge.restoreSnapshot([{index:0,operations:page,states:[good(),good()]}],snapshot(page)),1);
 assert.equal(bridge.finishedAt(0),true);
});
test('F5 falsifié : une retenue nécessaire manquante ne débloque pas la page',()=>{
 const bridge=makeBridge();bridge.useSession(sessionId);
 const invalid=good();invalid.carryValues[1]='';
 assert.equal(bridge.restoreSnapshot([{index:0,operations:page,states:[invalid,good()]}],snapshot(page)),1);
 assert.equal(bridge.finishedAt(0),false);
});
test('F5 : nouvelle séance ou opération différente ne reprend aucune réussite',()=>{
 const bridge=makeBridge();bridge.useSession(sessionId);
 const other=[{a:'991',b:'112'},page[1]];
 assert.equal(bridge.restoreSnapshot([{index:0,operations:page,states:[good(),good()]}],snapshot(other)),0);
 bridge.useSession('a7d3f280-726e-4e61-86d2-13256aac1746');
 assert.equal(bridge.finishedAt(0),false);
});
