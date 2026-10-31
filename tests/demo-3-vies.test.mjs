import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const file=(path)=>readFileSync(new URL(path,import.meta.url),'utf8');
const preview=file('../essai-mode-score-3-vies.html');
const native=file('../game-original.html');

test('essai 3 vies : prépare le véritable moteur sans changer le jeu connecté',async()=>{
 assert.match(preview,/Moteur original/);
 assert.match(preview,/Storage\.prototype\.setItem=function\(key,value\)/);
 assert.match(preview,/Réseau désactivé dans cet essai/);
 assert.match(preview,/Deux façons de marquer un gros score\./);
 assert.match(preview,/50 % des XP/);
 assert.match(preview,/Sans trophée/);
 assert.match(preview,/100 % des XP/);
 assert.match(preview,/\+20 % de points/);
 assert.match(preview,/#startThreeLives\{/);
 assert.match(preview,/#startSudden\{/);
 assert.match(preview,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(preview,/linear-gradient\(165deg,#2a9489/);
 assert.match(preview,/linear-gradient\(165deg,#a32b47/);
 assert.match(preview,/styles de fin/);
 assert.doesNotMatch(preview,/Continue jusqu’à la première erreur\./);
 const js=preview.match(/<script>([\s\S]*?)<\/script>/)?.[1]?.trim();
 assert.ok(js);
 new Script(js);
 const status={textContent:'',removed:false,remove(){this.removed=true}};
 const frame={hidden:false,srcdoc:''};
 const doc={getElementById:(id)=>id==='state'?status:frame};
 const load=new Function('document','fetch','return '+js);
 await load(doc,async()=>({ok:true,text:async()=>native}));
 assert.equal(status.textContent,'');
 assert.equal(status.removed,true);
 assert.equal(frame.srcdoc.length>native.length,true);
 const output=frame.srcdoc;
 assert.match(output,/function verifyPair\(\)/);
 assert.match(output,/function demoHeartHtml\(\)/);
 assert.match(output,/function loseDemoHeart\(\)/);
 assert.match(output,/session\.hearts===0/);
 assert.match(output,/startSession\('three-lives'\)/);
 assert.match(output,/states\[i\]\.solved=true;states\[i\]\.firstTry=false/);
 assert.match(output,/rgba?\(/);
 assert.match(output,/fill="#303540"/);
 assert.match(output,/@keyframes heartLoss/);
 assert.match(output,/mode-card sudden/);
 assert.match(output,/<h3 class="mode-title"><span class="score-mode-cup" aria-hidden="true">🏆<\/span> Défis de score<\/h3>/);
 assert.match(output,/<p class="mode-description">Deux façons de marquer un gros score\.<\/p>/);
 assert.match(output,/id="startThreeLives"[\s\S]*?<span class="score-mode-name">3 vies<\/span>/);
 assert.match(output,/id="startSudden"[\s\S]*?<span class="score-mode-name">Mort subite<\/span>/);
 // Le moteur d'origine réécrit parfois son premier span pour gérer les verrous :
 // réserver une cible masquée évite de détruire le texte et l'icône du bouton.
 assert.match(output,/id="startSudden"[\s\S]*?<span class="mathas-lock-target" aria-hidden="true" hidden>Mort subite<\/span>/);
 assert.match(output,/\.mathas-lock-target\{display:none!important\}/);
 assert.ok(output.lastIndexOf('id="three-lives-preview-style"')>output.indexOf('id="mathas-p100-portrait-menu"'));
 assert.match(output,/class="classic-count-btn" data-count="4"/);
 assert.match(output,/class="classic-count-btn" data-count="10"/);
 assert.match(output,/class="classic-count-btn" data-count="20"/);
 const special=output.match(/if\(session.mode==='three-lives'\)\{([\s\S]*?)\n    \}\n    if\(session.mode==='sudden'\)/)?.[1];
 assert.ok(special,'La branche 3 vies doit rester distincte de Mort subite');
 assert.doesNotMatch(special,/markErrorsForCorrection|saveSuddenBest|enregistrerResultatMathas|updateTrophies/);
 const scripts=[...output.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
 assert.ok(scripts.length>=30);
 for(const [index,match] of scripts.entries()){
   assert.doesNotThrow(()=>new Script(match[1]),'Script invalide '+index);
 }
});

test('essai 3 vies : impossible d’appliquer silencieusement une modification sur un autre moteur',async()=>{
 const js=preview.match(/<script>([\s\S]*?)<\/script>/)?.[1]?.trim();
 const status={textContent:'',removed:false,remove(){this.removed=true}};
 const frame={hidden:false,srcdoc:''};
 const doc={getElementById:(id)=>id==='state'?status:frame};
 const load=new Function('document','fetch','return '+js);
 await load(doc,async()=>({ok:true,text:async()=>'<html>mauvais moteur</html>'}));
 assert.equal(frame.hidden,true);
 assert.equal(frame.srcdoc,'');
 assert.match(status.textContent,/Moteur incorrect/);
});
