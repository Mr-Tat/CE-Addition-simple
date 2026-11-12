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
