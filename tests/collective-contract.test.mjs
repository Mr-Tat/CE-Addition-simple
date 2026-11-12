import test from 'node:test';
import assert from 'node:assert/strict';
import {validOperation,validSession,mayMoveForward,entryPage,resultOf,incomingCarries} from '../collective-contract.mjs';
const pages=[[{a:'247',b:'35'},{a:'98',b:'13'}],[{a:'38',b:'64'},{a:'230',b:'75'}]];
const session=()=>({ok:true,active:true,sessionId:'f7d3f280-726e-4e61-86d2-13256aac1746',revision:1,pages,pageIndex:1,requiredPages:[false,false]});
test('Deux additions par page et résultats exacts',()=>{
 assert.equal(validOperation({a:'247',b:'35'}),true);
 assert.equal(validOperation({a:'0',b:'5'}),false);
 assert.equal(resultOf(pages[0][0]),'282');
 assert.equal(validSession(session()),true);
});
test('Retenues entrantes dans les colonnes, sans remplir les cases',()=>{
 assert.deepEqual(incomingCarries({a:'247',b:'35'}),[0,1,0]);
 assert.deepEqual(incomingCarries({a:'95',b:'17'}),[0,1]);
});
test('Page ordinaire : départ autorisé sans réussite',()=>{
 assert.equal(mayMoveForward({session:session(),from:0,to:1,isFinished:()=>false}),true);
});
test('Page obligatoire : blocage puis correction acceptée',()=>{
 const s=session();s.requiredPages[0]=true;
 assert.equal(mayMoveForward({session:s,from:0,to:1,isFinished:()=>false}),false);
 assert.equal(mayMoveForward({session:s,from:0,to:1,isFinished:()=>true}),true);
});
test('Arrivée tardive : première page obligatoire non réussie',()=>{
 const s=session();s.requiredPages[0]=true;
 assert.equal(entryPage(s,()=>false),0);
 assert.equal(entryPage(s,()=>true),1);
});
