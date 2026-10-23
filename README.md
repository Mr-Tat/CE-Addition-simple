# CE-Addition-simple — pilote Math’as Connect

**État : pilote fonctionnel, corrections de fiabilité V1 intégrées le 23 octobre 2026.**

## Liens
- Jeu Connect : https://mr-tat.github.io/CE-Addition-simple/
- Ancien jeu V6.0.2 : https://mr-tat.github.io/Addition-ecrite-simple/
- HUB : https://mr-tat.github.io/Mathas-Connect/
- Contrat actuel : https://github.com/Mr-Tat/Mathas-Connect/blob/main/docs/CONNECT_V1_ETAT_REEL_2026-10-23.md

## Fichiers
- `game-original.html` : copie **intégrale et inchangée** de l'ancienne V6.0.2 (source Git blob `764335bdde1558de6caf362cbcc6239c12321d41`).
- `index.html` : chargeur Classique/Connecté, identifiant élève, cloisonnement localStorage, synchronisation, file locale hors ligne, gestion Master et bandeau.
- `legacy-import.js` : récupération volontaire des anciens records, points, trophées et déblocages vers Connecté.

## Données
- Ancienne V6.0.2 : stockage navigateur d'origine conservé intact.
- Nouvelle version Mode Classique : stockage isolé `mathas.ce-addition.libre.v1:`.
- Mode Connecté : stockage `mathas.ce-addition.connect.<authUserId>.v1:` et Supabase `app_key=addition-ecrite-simple`.
- File différée : `ce-addition.pending.<authUserId>.v1`, événement UUID conservé jusqu'à confirmation.
- Les noms GitHub et `app_key` Supabase sont indépendants.
- Le même domaine `mr-tat.github.io` implique la même origine de stockage pour tous les dépôts Pages, d'où l'isolation explicite.

## Fonctionnalités
- Séries classiques et Mort subite synchronisées et validées par les tests LBIDT/FOPA/Ju Tat.
- Import depuis l'ancienne version réellement testé et confirmé, sans créer de fausses parties récentes.
- Collection de trophées envoyée et restaurée depuis Connect.
- HARD de cinq calculs : record `hardThree` synchronisé, sans points gamification (moteur V6.0.2 inchangé).
- La file offline reprend lors du retour réseau, de l'activation d'onglet ou de l'ouverture du jeu.
- Deux remises à zéro Master : en Connecté elles passent par l'API avec `resetEpoch` ; en Classique elles utilisent les règles locales de V6.0.2.
- En cas d'échec d'authentification, le joueur doit choisir de réessayer ou de passer explicitement au Mode Classique.

## Recette encore nécessaire
Les **nouvelles** protections de file hors ligne, de resets Master et de records HARD n'ont pas encore été validées par des parcours de navigateur de bout en bout. Utiliser des profils de test pour les remises à zéro : **ne pas effacer Eleve.A**.

## Dépendance de migration
Les images `logo-m.png`, `logo-mot.webp`, `illustration.webp` sont actuellement chargées depuis l'ancien dépôt. **Ne pas supprimer ni rendre privé l'ancien repository avant de les rapatrier** ; il sert également aux imports historiques jusqu'à migration de tous les élèves.

## Lignes rouges
- Ne jamais modifier `Mr-Tat/Addition-ecrite-simple` lors de la migration.
- Jamais de fichier de sauvegarde privé avec les noms d'élèves dans GitHub public.
- Pas de réécriture du jeu pédagogique pour une amélioration de Connect.
- Pour les nouveaux jeux, discuter le nom du repository et ses règles de résultats avant l'adaptation.
