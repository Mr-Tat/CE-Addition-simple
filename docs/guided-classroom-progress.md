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
