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
 assert.match(preview,/essai « Objectif record »/);
 assert.doesNotMatch(preview,/XP et bonus présentés à titre indicatif dans cet essai/);
 assert.doesNotMatch(preview,/50 % des XP/);
 assert.match(preview,/Sans trophée/);
 assert.doesNotMatch(preview,/100 % des XP/);
 assert.match(preview,/\+20 % de points/);
 assert.match(preview,/#startThreeLives\{/);
 assert.match(preview,/#startSudden\{/);
 assert.match(preview,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(preview,/linear-gradient\(165deg,#754287 0%,#502963 100%\)/);
 assert.match(preview,/border:1\.5px solid #a77cbe!important/);
 assert.match(preview,/linear-gradient\(165deg,#a32b47/);
 assert.match(preview,/styles de fin/);
 // Le texte natif est encore le motif recherché pour la transformation ;
 // les assertions sur `output` ci-dessous vérifient les gardes effectivement injectés.
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
 // Les 3 cœurs sont dans le bandeau de session, à l'emplacement indiqué
 // entre le menu et les pastilles de score sur écran large.
 assert.match(output,/<div class="session-pill" id="sessionScore">Score : 0 \/ 10<\/div><div id="threeLivesHud" hidden aria-label="Trois vies au départ"><\/div>/);
 assert.match(output,/#gameScreen \.session-bar\{position:relative!important\}/);
 assert.match(output,/#gameScreen #threeLivesHud\{position:absolute!important;left:43%!important;top:50%!important/);
 assert.match(output,/#gameScreen #threeLivesHud\[hidden\]\{display:none!important\}/);
 assert.match(output,/@media\(max-width:1399px\)\{html:not\(\.mathas-handheld-portrait\) #gameScreen #threeLivesHud\{position:static!important/);
 assert.match(output,/html\.mathas-handheld-portrait #gameScreen #threeLivesHud\{position:static!important/);
 assert.match(output,/grid-area:2\/1\/3\/7!important/);
 assert.match(output,/hud\.hidden=session\.mode!=="three-lives"/);
 assert.match(output,/hud\.innerHTML=demoHeartHtml\(\)\.repeat\(3\)/);
 assert.match(output,/session\.hearts--/);
 assert.match(output,/heart\.classList\.add\("breaking"\)/);
 assert.match(output,/heart\.classList\.add\("lost"\)/);
 assert.match(output,/mode-card sudden/);
 assert.match(output,/<h3 class="mode-title"><span class="score-mode-cup" aria-hidden="true">🏆<\/span> Objectif record<\/h3>/);
 assert.match(output,/<p class="mode-description">Deux façons de marquer un gros score\.<\/p>/);
 assert.match(output,/id="startThreeLives"[\s\S]*?<span class="score-mode-name">3 vies<\/span>/);
 assert.match(output,/id="startSudden"[\s\S]*?<span class="score-mode-name">Mort subite<\/span>/);

 // Les deux lignes secondaires ont été inversées selon le montage professeur,
 // et occupent chacune un petit cadre discret à l'intérieur du vrai bouton.
 const livesButton=output.match(/<button[^>]*id="startThreeLives"[\s\S]*?<\/button>/)?.[0];
 const suddenButton=output.match(/<button[^>]*id="startSudden"[\s\S]*?<\/button>/)?.[0];
 assert.ok(livesButton && suddenButton);
 // Ce prototype tourne uniquement hors Connect : les montants XP ne doivent jamais apparaître.
 assert.doesNotMatch(output,/Reste\\s+\\d+\\s*XP/);
 assert.doesNotMatch(output,/50 % des XP|100 % des XP/);
 assert.ok(livesButton.includes('<span class="score-mode-meta"><span class="score-mode-foot">Sans trophée</span></span>'));
 assert.ok(suddenButton.includes('<span class="score-mode-meta"><span class="score-mode-foot score-mode-bonus">+20 % de points</span></span>'));
 assert.match(output,/#menuScreen \.mode-card\.sudden #startThreeLives \.score-mode-meta\{background:rgba\(17,8,30,\.32\)!important/);
 assert.match(output,/#gameScreen #threeLivesHud\{position:absolute!important;[\s\S]*?border:1\.5px solid #73569c!important/);
 assert.match(output,/\.score-mode-meta\{display:flex!important;[\s\S]*?border:1px solid rgba\(255,234,246,\.24\)!important/);
 assert.doesNotMatch(livesButton,/score-mode-detail/);
 assert.doesNotMatch(suddenButton,/score-mode-detail/);
 assert.match(output,/\.score-mode-meta\{position:relative!important;display:flex!important/);
 assert.match(output,/\.score-mode-meta:has\(>\.score-mode-detail\)\{padding-bottom:24px!important;min-height:55px!important\}/);
 assert.match(output,/\.score-mode-detail\{position:absolute!important;right:6px!important;bottom:5px!important;[\s\S]*?text-align:right!important;[\s\S]*?font-size:clamp\(\.65rem,\.8vw,\.74rem\)!important/);
 assert.match(output,/\.classic-count-btn\[data-count\]:has\(>\.classic-xp-remaining\)\{position:relative!important;[\s\S]*?padding-bottom:24px!important/);
 assert.match(output,/\.classic-count-btn\[data-count\]>.classic-xp-remaining\{position:absolute!important;right:7px!important;bottom:5px!important;[\s\S]*?text-align:right!important/);
 assert.match(output,/\.score-mode-foot:not\(\.score-mode-bonus\)\{font-size:clamp\(\.65rem,\.8vw,\.74rem\)!important;[\s\S]*?font-weight:450!important;[\s\S]*?opacity:\.66!important/);
 assert.match(output,/\.score-mode-bonus\{opacity:1!important;display:inline-flex!important;[\s\S]*?border:1px solid rgba\(255,210,144,\.70\)!important;border-radius:999px!important/);
 // Le rappel provisoire est retiré de l'affichage sans toucher à l'isolation XP.
 assert.doesNotMatch(output,/XP et bonus présentés à titre indicatif dans cet essai/);
 assert.doesNotMatch(output,/score-mode-tip/);
 assert.match(output,/aria-label="Objectif record"/);
 assert.match(output,/#menuScreen \.mode-card\.sudden\{align-content:start!important;row-gap:5px!important\}/);
 assert.match(output,/#menuScreen \.mode-card\.sudden \.mode-settings\{min-width:0!important;width:100%!important;margin-top:0!important;padding-top:0!important\}/);
 assert.match(output,/margin:4px 0 0!important;grid-column:1\/-1!important/);
 assert.doesNotMatch(output,/Défis de score/);

 // Le moteur d'origine réécrit parfois son premier span pour gérer les verrous :
 // réserver une cible masquée évite de détruire le texte et l'icône du bouton.
 assert.match(output,/id="startSudden"[\s\S]*?<span class="mathas-lock-target" aria-hidden="true" hidden>Mort subite<\/span>/);
 assert.match(output,/\.mathas-lock-target\{display:none!important\}/);
 assert.ok(output.lastIndexOf('id="three-lives-preview-style"')>output.indexOf('id="mathas-p100-portrait-menu"'));
 // Anciens styles natifs : le bouton Mort subite était forcé sur deux colonnes.
 // La page d'essai impose explicitement un choix par colonne.
 assert.match(output,/#startThreeLives\{grid-column:1!important;grid-row:1!important/);
 assert.match(output,/#startSudden\{grid-column:2!important;grid-row:1!important/);
 assert.match(output,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 // Un autre script natif remplaçait la phrase et tout le contenu du bouton.
 assert.match(output,/if\(suddenDesc&&!window\.__mathasThreeLivesDemo\)suddenDesc\.textContent/);
 assert.match(output,/if\(suddenBtn&&!window\.__mathasThreeLivesDemo\)suddenBtn\.textContent/);
 assert.match(output,/suddenBtn\.addEventListener\('click',syncMaxBeforeSave,true\)/);
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


test('aperçu fictif Connect : reste XP, zéro et aucune mention hors connexion',async()=>{
 const loader=preview.match(/<script>([\s\S]*?)<\/script>/)?.[1]?.trim();
 assert.ok(loader);
 const listeners={},selector={value:'connected',addEventListener:(type,fn)=>listeners['select:'+type]=fn};
 const makeLine=()=>({className:'',textContent:'',removed:false,remove(){this.removed=true}});
 const meta=()=>({line:null,querySelector(){return this.line&&!this.line.removed?this.line:null},appendChild(value){this.line=value}});
 const left=meta(),right=meta();
 const classicCounts=['4','10','20'];
 const classics=classicCounts.map(count=>({
   count,line:null,getAttribute(name){assert.equal(name,'data-count');return this.count},
   querySelector(){return this.line&&!this.line.removed?this.line:null},
   appendChild(element){this.line=element}
 }));
 const dom={
  querySelector(sel){return sel==='#startThreeLives .score-mode-meta'?left:sel==='#startSudden .score-mode-meta'?right:null},
  querySelectorAll(sel){
    assert.equal(sel,'#menuScreen button.classic-count-btn[data-count]');
    return classics;
  },
  createElement(tag){assert.equal(tag,'span');return makeLine()}
 };
 const frame={hidden:false,srcdoc:'',contentDocument:dom,addEventListener(type,fn){listeners['frame:'+type]=fn}};
 const status={textContent:'',removed:false,remove(){this.removed=true}};
 const doc={getElementById:id=>id==='state'?status:id==='game'?frame:id==='xp-preview-mode'?selector:null};
 const loaderFn=new Function('document','fetch','return '+loader);
 await loaderFn(doc,async()=>({ok:true,text:async()=>native}));
 assert.equal(status.textContent,'');
 assert.equal(status.removed,true);
 assert.ok(frame.srcdoc.length>native.length);
 assert.match(preview,/Exemples fictifs · aucun compte élève consulté/);
 assert.match(preview,/const classicFullXp=\{'4':22,'10':36,'20':60\}/);
 assert.match(preview,/\.classic-count-btn\[data-count\]>.classic-xp-remaining/);
 assert.match(preview,/Réseau désactivé dans cet essai/);
 assert.equal(typeof listeners['frame:load'],'function');
 assert.equal(typeof listeners['select:change'],'function');
 listeners['frame:load']();
 assert.equal(left.line.textContent,'Reste 10 XP');
 assert.equal(right.line.textContent,'Reste 20 XP');
 assert.deepEqual(classics.map(btn=>btn.line.textContent),['Reste 22 XP','Reste 36 XP','Reste 60 XP']);
 assert.deepEqual(classics.map(btn=>btn.line.className),['classic-xp-remaining','classic-xp-remaining','classic-xp-remaining']);
 selector.value='zero';listeners['select:change']();
 assert.equal(left.line.textContent,'Reste 0 XP');
 assert.equal(right.line.textContent,'Reste 0 XP');
 assert.deepEqual(classics.map(btn=>btn.line.textContent),['Reste 0 XP','Reste 0 XP','Reste 0 XP']);
 selector.value='free';listeners['select:change']();
 assert.equal(left.querySelector('.score-mode-detail'),null);
 assert.equal(right.querySelector('.score-mode-detail'),null);
 assert.ok(classics.every(btn=>btn.querySelector('.classic-xp-remaining')===null));
 selector.value='connected';listeners['select:change']();
 assert.equal(left.querySelector('.score-mode-detail').textContent,'Reste 10 XP');
 assert.equal(right.querySelector('.score-mode-detail').textContent,'Reste 20 XP');
 assert.deepEqual(classics.map(btn=>btn.querySelector('.classic-xp-remaining').textContent),['Reste 22 XP','Reste 36 XP','Reste 60 XP']);
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
