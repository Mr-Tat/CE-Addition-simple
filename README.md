# CE-Addition-simple — Math’as Connect (pilote)

Version de jeu : **copie intégrale de la V6.0.2**, conservée dans `game-original.html` et provenant de `Mr-Tat/Addition-ecrite-simple` (Git blob d’origine : `764335bdde1558de6caf362cbcc6239c12321d41`).

## Accès au pilote
- https://mr-tat.github.io/CE-Addition-simple/?class=4bf3400d-a315-4ea4-a2f3-afaca24dc9b9
- Ouvrir dans un navigateur ayant été approuvé par un enseignant dans Math’as Connect.
- Si le HUB est en **Mode libre** ou si le profil Connect n'est pas autorisé, le jeu utilise uniquement ses sauvegardes locales.
- Le professeur consulte les résultats dans Math’as Connect → Résultats des élèves → Addition écrite simple.

## Architecture
- `game-original.html` : copie source figée, moteur pédagogique V6.0.2 non modifié.
- `index.html` : chargeur de pilote ; sélection libre/Connect, initialisation du stockage privé, contrôle API, iframe du jeu, enregistrement de fin de partie.
- Dans le navigateur, les clés historiques du jeu sont préfixées par `mathas.ce-addition.libre.v1:` ou `mathas.ce-addition.connect.<authUserId>.v1:`, afin de ne jamais modifier les sauvegardes de l'application classique ni celles d'un autre élève.
- En Connect, un seul appel de lecture au démarrage, puis une écriture **par exercice terminé** (aucun appel par chiffre saisi). En cas de conflit de révision, relecture et nouvel essai, sans écraser l'autre appareil.
- Les résultats de laboratoire existants, utilisant `app_key=connect-lab`, restent distincts ; l'application pilote emploie `app_key=addition-ecrite-simple`.

## Limites à vérifier avant ouverture aux élèves
- **Pilote non validé par des parcours navigateur réels.** La syntaxe du chargeur a été vérifiée ; synchronisation, modes de jeu, Master Mode, reset et changement d'identité nécessitent des tests utilisateurs.
- L'iframe est une enveloppe technique et n'est pas une réécriture du jeu. Certains éléments, notamment le plein écran ou les événements d'interface, doivent être testés.
- Le connecteur récupère les parties à partir de l'événement `__setLastWork` : les résultats Classic, Mort subite et HARD restent à vérifier au regard des règles de génération de points. Les défis HARD à cinq calculs ne sont pas encore envoyés, conformément au contrat du pilote.
- Les **trois ressources graphiques** (`logo-m.png`, `logo-mot.webp`, `illustration.webp`) sont actuellement référencées depuis GitHub Pages de l'ancienne application. Les copier dans ce nouveau repository avant d'archiver ou supprimer l'ancien dépôt. Ne pas supprimer l'ancien dépôt avant ce rapatriement.
- Les trophées et médailles restent un affichage et un stockage propres au jeu ; seul le progrès synthétique et les scores sélectionnés sont envoyés au suivi du professeur. La synchronisation de la collection des trophées entre appareils reste à étudier pour garantir une copie fonctionnelle fidèle.
- Les erreurs réseau d'enregistrement nécessitent encore une interface de reprise ; ne pas diffuser le pilote à des élèves avant validation.
- Le jeu public `Mr-Tat/Addition-ecrite-simple` n'a pas été modifié.

## Contrat versionné
La version pilote du backend de résultats est la fonction Supabase `connect-results` V3. Le code source du backend est maintenu dans `Mr-Tat/Mathas-Connect`.

## Nomenclature adoptée
`CE` = Calculs écrits. Les noms des repositories sont indépendants du type de connexion. Chaque migration vers Connect inclut une réflexion sur le nom.
