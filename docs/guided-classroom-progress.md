# Guidé collectif — Addition écrite simple (chantier en cours)

## Source réellement publiée
Le catalogue Supabase `connect_apps` du 12/11/2026 associe `addition-ecrite-simple` à `https://mr-tat.github.io/CE-Addition-simple/`. Le dépôt actuel est donc `Mr-Tat/CE-Addition-simple` (distinct de `Mr-Tat/Addition-ecrite-simple`, source historique à ne pas écraser).

## Audit du moteur
- `index.html` : hôte Connect, authentification et contrôle `connect-results`, chargement natif `game-original.html`.
- `game-original.html` : `startSession('training')`, `makePair()` avec deux états de `generateAddition(maxDigits)`. État : `a,b,result,count,answerCount,carryExpected,outgoing,answerValues,carryValues,wrongHistory,carryWrong,firstTry,solved`.
- Les champs de réponse et de retenues sont manipulés via pavé natif, `readonly` ; corriger seulement par affichage additionnel.
- Aucune Edge/table collective propre à Addition simple constatée dans Supabase ; `connect-guided-multiplication` v3 seule référence collective actuellement disponible.

## Décisions
Comportement identique au pilote Multiplication simple et optimisation #295 : recherche de séance sur clic, progression élèves sur clic, Précédente locale, pas de polling, rendu événementiel, sauvegarde temporaire groupée. Classes isolées, pages obligatoires rétroactives, arrivée tardive, reprise F5, explication des retenues sous cases sans modifier le moteur. XP, trophées, scores : SANS OBJET.

## Tranche créée
- `collective-contract.mjs` : deux additions par page, contrat de séance, progression, arrivée tardive, résultats et retenues entrantes calculées sans toucher aux champs.
- `tests/collective-contract.test.mjs` : cinq tests.
- **Pas encore branché au moteur, à l'interface ni au backend.**

## Étapes avant fusion
1. Pont natif pour imposer `a,b`, restaurer `answerValues/carryValues` et les corrections, lire la véritable réussite.
2. Corrigé visuel sous cases, retenues alignées et confirmation Oui/Non.
3. Hôte/contrôleur et F5 local ; autorisations prof/élève côté Edge ; classes réelles/test sans extension d'accès.
4. SQL/RLS et lease serveur ; tests moteur/Chromium 320,390,1160 ; CI et non-régression ; Pages + Edge + recette hébergée avec profils fictifs.

**Statut :** initialisation technique seulement, aucune publication ni modification de scores/données réelles.

## État d'implémentation (12/11/2026)
- Hôte `index.html` : module guidé exclusivement Connect, chargement natif optionnel, appels Auth `connect-guided-written` avec `appKey`, absence de polling élève.
- Pont `collective-native-bridge.js` : pages de deux additions, validation et reports natifs, réponses et corrections locales, bouton natif Suivant intercepté.
- `collective-ui.mjs` et `collective-draft.mjs` : interface du pilote #295, classe, pages obligatoires, sauvegarde F5 locale à l'onglet.
- Tests contrats et syntaxe : CI isolée verte. Chromium natif à deux profils, page obligatoire et copie identique : vert après alignement sur le vrai sélecteur `trainingChoiceBtn` et niveaux 3/5/7. Scénario F5 avec pavé réel ajouté, validation CI en cours.
- Supabase : backend proposé dans Mathas-Connect PR #299, migration et Edge non déployées ; pas de recette hébergée authentifiée ni de fusion.
- Les cinq nouvelles fonctions n'envoient aucun XP/score/trophée collectif, ne modifient pas `game-original.html`.

## Retours de recette renforcée — 12 novembre 2026
- Chromium natif, profils simulés professeur/élève : calculs communs, obligation, corrections réelles après erreur, navigation arrière, numéros stables, résultat professeur non injecté et F5 élève/enseignant OK ([exécution Addition simple](https://github.com/Mr-Tat/CE-Addition-simple/actions/runs/43271800955)).
- L'état « réussi » restauré ne peut plus se baser sur un résultat juste avec une retenue exigée manquante ; tests dédiés de faux brouillons.
- Le contrôleur reste calqué sur le pilote #295 (aucune requête automatique élève).
- Le guidé ne donne ni XP, ni trophée, ni score.
- **Blocage livraison** : Auth/Edge réels + profils fictifs approuvés, publication Pages et contrôle des autres jeux NON EXÉCUTÉS.

## Optimisation contrôlée avant recette réelle — 12/11/2026
- Élève : aucune minuterie réseau, seules les actions « Rejoindre » et « Suivant / Vérifier la suite » font un `status` ; les touches et la page précédente ne font aucun appel. Vérifié dans le Chromium à deux rôles par comptage des appels.
- Saisies F5 : écritures `sessionStorage` regroupées après 300 ms, immédiates à la sortie/navigation, sans contenu élève sur Supabase.
- Enseignant : un seul heartbeat toutes les 25 s **si une séance existe** ; aucun minuteur au repos ni après « Terminer ». Vérifié dans le Chromium, y compris après F5.
- Portée : seulement Connect, moteur `game-original.html` intact ; aucune publication de cette branche au 12/11.

## Correctif 17/11/2026 — collectif strictement dans Exercice guidé
- L'audit du portage a révélé le défaut déjà corrigé sur Multiplication : le bandeau utilisait `joined` même quand l'écran natif n'était plus en mode `training`; le pont pouvait conserver `active` en dehors du guidé.
- Contrôles ajoutés : affichage du bandeau uniquement si `gameScreen` est visible **et** la session native est `training` ; entrée/lancement impossibles hors guidé ; détachement de l'onglet au changement de mode avec sauvegarde des saisies privées, sans arrêter la séance du professeur ; interception du bouton natif restreinte au guidé visible.
- Test Chromium de régression ajouté : quitter un guidé collectif actif, ouvrir successivement les séries 4/10/20 et Mort subite sans bandeau ni commande de classe, conserver la séance côté professeur, puis rejoindre volontairement le collectif à l'intérieur d'Exercice guidé.
- **Travail sur la branche de la PR candidate uniquement.** Les clients dépendent encore du service partagé PR #299 non déployé au dernier audit. Aucun droit de classe, migration SQL/Edge, résultats ni barèmes modifiés dans ce correctif. Séparer validations CI, déploiement GitHub Pages, Edge/SQL et recette authentifiée.

## Reprise enseignant après fermeture d'onglet — 17/11/2026
- Aligné sur Multiplication #325 et #326 : « Reprendre la séance » déclenche, après confirmation si le contrôle appartient à un autre onglet, le transfert explicite du verrou au **même enseignant authentifié**. L'ancien onglet n'a plus le droit de changer les pages ni de terminer la séance.
- Le contrôleur rafraîchit réellement le statut après `session_owned_by_other_tab` ; auparavant `poll()` était ignoré sous `busy=true`. Le guidé reste l'unique endroit où démarrer/rejoindre.
- La PR de service partagé #299 contient `takeover` avec `app_key`, classe, enseignant, IDs de page, révision et comparaison atomique de l'ancien propriétaire. Les enseignants d'autres classes et tous les élèves ne peuvent pas reprendre.
- Tests supplémentaires : les séries 4/10/20 n'affichent pas le collectif même en présence d'une séance ; Mort subite reste individuel s'il est débloqué, et reste verrouillé lorsque le barème natif ne l'autorise pas.
- **Candidat uniquement : aucune publication Pages / SQL / Edge de cette application**. La recette Auth réelle avec profils fictifs reste une condition distincte.
