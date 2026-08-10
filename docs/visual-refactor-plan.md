# Plan de refonte graphique Vasco

## But et état des lieux

Ce plan organise la refonte React Native/Expo en commençant par la bibliothèque réutilisable. Priorité : Figma Vasco, documentation produit, standards mobile, instructions du dépôt, puis code historique pour les données et règles métier.

Figma contient 24 pages, 7 collections de variables et les catalogues Actions, Forms, Navigation, Content, Feedback, Overlays et Patterns. Le code utilise Expo, React Native, Tamagui, React Navigation, React Query, Zustand et Reanimated. `shared/components/ui` contient déjà 14 composants, mais leurs API ne couvrent qu'une partie de Figma.

Des identifiants et la couverture Figma utilisent encore DailyBook/MyDailyBook : Vasco devient le seul nom visible ; les identifiants techniques seront migrés sans rupture.

## Principes

- Tokens avant composants, primitives avant compositions, compositions avant écrans.
- Une implémentation par comportement partagé ; aucune copie locale de JSX.
- API alignée sur Figma : `size`, `style`/`tone`, `state`, `material`, `selected`, `loading`.
- Light/Dark par tokens sémantiques ; Glass progressif avec fallback Solid de même géométrie.
- États default, pressed/focused, disabled, loading, empty, error, success et Premium selon le contexte.
- Cibles de 44 dp, labels accessibles, font scale 200 %, Reduce Motion/Transparency et contraste AA.

## Plan d'exécution

### P0 — Verrouiller le contrat design/code

- [x] **P0.a** Comparer valeurs et alias Figma à `theme/tokens.ts` et `theme/tamagui.config.ts`.
- [x] **P0.b** Capturer par famille Figma propriétés, variantes, dimensions, bindings et règles d'usage.
- [x] **P0.c** Produire la matrice Figma → composant React Native → statut (`réutiliser`, `refactorer`, `créer`, `retirer`).
- [x] **P0.d** Auditer les usages de `shared/components/ui` et les doublons des features.
- [x] **P0.e** Confirmer côté backend champs, limites, entitlements Premium et mutations sensibles.
- [x] **P0.f** Arbitrer : Figma pour UX/UI, backend pour métier, décision produit pour toute ambiguïté.

Sortie : inventaire versionné, écarts, API v1 gelée et backlog estimé.

### P1 — Aligner les fondations

- [x] **P1.a** Structurer `primitives`, `semantic light/dark`, `spacing`, `radius`, `typography`, `material` et `component`.
- [x] **P1.b** Éliminer les valeurs visuelles brutes récurrentes et aligner les noms avec Figma.
- [x] **P1.c** Centraliser les tokens Glass/Solid et les contraintes matérielles.
- [x] **P1.d** Définir Quicksand et les animations de fondation.
- [x] **P1.e** Utiliser uniquement les nouveaux contrats Vasco, sans compatibilité UI historique.
- [x] **P1.f** Tester Light/Dark et les contrats structurels/accessibilité.

### P2 — Construire les atomes

- [x] **P2.a** Registre d'icônes sémantiques : tailles, centrage, labels et états.
- [x] **P2.b** Buttons Primary/Secondary/Ghost, Destructive, Icon et Loading.
- [x] **P2.c** Checkbox, Radio, Switch et Chip.
- [x] **P2.d** Spinner, loader GIF de marque, Notification Badge et Status Badge. Le GIF historique remplace le Paw Loader Figma par décision produit.
- [x] **P2.e** Avatar, Divider et surfaces Card Solid/Glass.

### P3 — Construire les champs

- [x] **P3.a** Socle `Field` : label, aide, erreur, requis, slots et états.
- [x] **P3.b** Text Field, Text Area, Password et Search.
- [x] **P3.c** Select et Option Card.
- [x] **P3.d** Date/Time, Number Stepper et Slider.
- [x] **P3.e** Media Upload avec tous ses états async.
- [x] **P3.f** Adaptateurs React Hook Form/Zod sans couplage métier.

### P4 — Navigation, overlays et feedback composé

- [x] **P4.a** Top Bar, Bottom Bar Solid/Glass, Tab Bar et progressions.
- [x] **P4.b** Bottom Sheet avec coins inférieurs droits, scrim, safe area et politique de fermeture.
- [x] **P4.c** Dialog, confirmation destructive avec loading local, Action Menu et Action Sheet.
- [x] **P4.d** Selection Modal, Calendar/Time Picker et Media Viewer.
- [x] **P4.e** Snackbar, Banner, Empty/Error State, Skeleton et Premium Gate.
- [x] **P4.f** Reprise du catalogue Overlays : remplacer les anciens fonds `color/background` par `color/surface` sur Bottom Sheet, Dialog, Action Menu et Selection Modal ; réorganiser la page sans aucun chevauchement.
- [x] **P4.g** Réauditer toutes les instances d’overlays dans les écrans Light/Dark/Glass et dans les prototypes : surface, scrim, poignée, coins inférieurs droits, icônes centrées et zones tactiles.

### P5 — Contenu métier partagé

- [x] **P5.a** Card générique, List Item et Linked Animals.
- [x] **P5.b** Event, Animal, Objective, Note, Group, Contact, Wish et Notification cards.
- [x] **P5.c** File Item et Animal Selector Item.
- [x] **P5.d** Metric Card, Period Selector, Tooltip et Data Visualization dans tous leurs états.
- [x] **P5.e** Garder les cartes indépendantes de la navigation et du transport HTTP.

### P6 — Patterns d'écran

- [x] **P6.a** `Screen`, `RootScreen` et `DetailScreen` : safe areas, scroll, clavier et footer.
- [x] **P6.b** `ListExplorationPattern` : filtres, skeleton, empty, error, refresh, pagination et restauration scroll.
- [x] **P6.c** `GuidedFormPattern` : valeurs conservées, progression réelle, CTA long, aucune bottom bar.
- [x] **P6.d** `MultiSelectionPattern` et `AsyncStatesPattern`.
- [x] **P6.e** Menu global de création et parcours Premium contextualisé.

### P7 — Migrer les écrans par vagues

- [x] **P7.a** Auth/Onboarding et Home comme pilotes.
  - [x] Auth : Welcome, connexion, choix d'inscription, identité, sécurité, vérification et mot de passe oublié.
  - [x] Onboarding d'entrée : Welcome et parcours Auth complet conformément aux écrans Figma disponibles.
  - [x] Home authentifié : données réelles, actions rapides, cartes, FAB, navigation principale et états Loading/Empty/Error.
  - [x] Variantes Home Default/Scrolled et contrat Solid/Glass avec fallback centralisé.
  - [x] Les destinations appartenant aux domaines Animaux/Suivi/Plus et Notifications/Compte restent affectées à P7.c/P7.d.
- [ ] **P7.b** Calendar/Events pour valider cartes, formulaires et overlays.
  - [ ] Reprendre les parcours de création et modification Event selon les nouvelles maquettes en bottom sheet.
    - [x] Extraire `Overlay/Form Sheet Surface` comme surface commune Solid/Glass pour tous les formulaires d'ajout et de modification.
    - [x] Afficher la création guidée et IA dans une unique Form Sheet au-dessus du contexte courant.
    - [x] Afficher la modification et la duplication dans la même Form Sheet, avec données préremplies.
    - [x] Conserver les valeurs entre étapes et confirmer la fermeture si des données non enregistrées seraient perdues.
    - [ ] Vérifier Light, Dark, Glass avec fallback Solid, clavier, scroll, accessibilité et parcours critique.
  - [x] Agenda Solid, calendrier inline, journée complète et ouverture du détail.
  - [x] Détail événement, menu `…`, marquage terminé et suppression avec confirmation explicite.
  - [x] Création guidée : entrée → type → détails spécifiques aux 7 types → animaux → rappels/partage → mutation → succès.
  - [x] Création IA Premium : description → analyse backend → normalisation → vérification/modification → animaux/options → création.
  - [x] Conservation des valeurs du wizard, absence de bottom bar et retour entre étapes.
  - [x] Connexion aux données réelles via React Query, services API et token Firebase.
  - [x] États chargement, vide et erreur sur Agenda, Home et sélection des animaux ; timeout HTTP global.
  - [x] Normalisation du contrat Notifications `{ notifications, unreadCount }` à la frontière API.
  - [x] Gate client basée sur l'abonnement `Free`/`Premium` retourné par le backend.
  - [x] Modification préremplie avec le même périmètre de champs que la création.
  - [x] Dupliquer et partager depuis le menu d'actions.
  - [x] Protection Premium des routes IA et Groupes côté backend.
  - [x] Vérification visuelle exhaustive Light/Dark, Glass avec fallback Solid et tailles d'écran.
  - [ ] Tests du parcours critique sur appareil/émulateur et scénario Maestro.
- [ ] **P7.c** Animals, puis Performance/Objectives/Statistics.
  - [ ] **P7.c.1 — Finaliser le workspace Animaux.**
    - [x] Ouvrir la destination Animaux depuis la Bottom Bar sans retomber sur Home.
    - [x] Afficher le sélecteur horizontal replié sur les animaux présents, révéler l’historique avec `Voir plus` et conserver l’animal sélectionné entre les onglets.
    - [x] Ordonner les animaux : présents, partis, puis décédés.
    - [x] Implémenter Informations, Santé et Physique à partir des variantes Figma Light/Dark ; Galerie n’est plus une destination du workspace.
    - [x] Couvrir chargement, vide, erreur et rafraîchissement des données principales.
    - [x] Confirmer le contrat réel de `/animals/{id}/body-pictures` et construire les URL finales lorsque le backend renvoie uniquement un `filename`.
    - [ ] Vérifier sur appareil petits/grands écrans, Light, Dark, Glass et fallback Solid.
    - [x] Vérifier que le changement d’animal conserve l’onglet actif et que la disparition de l’animal sélectionné choisit un fallback cohérent.
  - [ ] **P7.c.2 — Terminer le Carnet.**
    - [x] Afficher l’historique des soins et rendez-vous médicaux liés à l’animal, du plus récent au plus ancien.
    - [x] Agréger les documents présents sur les événements liés.
    - [x] Confirmer les types d’événements qui alimentent l’historique médical et l’existence éventuelle d’une route médicale dédiée.
    - [x] Ouvrir une carte vers le détail Event et un document dans le Media Viewer.
    - [x] Connecter ajout, import, retry, ouverture et suppression d’un document médical avec confirmation.
    - [x] Aligner précisément les états vides et erreurs sur Figma.
    - Sous-lot lecture/navigation (2026-08-10) : variantes Carnet Light `253:785` et Dark `349:8528` relues ; aucun lien de prototype n’est défini sur le frame ou ses descendants. « À surveiller » est limité aux types médicaux `soins` et `rdv`; les documents sont agrégés avec leur `eventId`, ouverts via l’URL présignée de l’événement dans `MediaViewer`, et la carte ouvre le détail Event. Aucun endpoint animal supplémentaire n’est nécessaire pour la lecture. Typecheck et test ciblé `animalWorkspaceUtils` verts. L’ajout/import/retry/suppression reste ouvert : la suppression fichier générique efface S3 sans délier `event_document` et doit être rendue atomique avant branchement UI.
  - [x] **P7.c.3 — Terminer Corps et mesures.**
    - [x] Afficher poids, taille et alimentation issus de l’animal.
    - [x] Exposer le suivi visuel avec le composant partagé `MediaUpload`.
    - [x] Identifier et ajouter la lecture backend de l’historique poids/taille avec contrôle d’accès.
    - [x] Afficher la dernière valeur réelle et sa date, jamais une moyenne ; calculer une tendance uniquement avec deux mesures réelles.
    - [x] Connecter ajout/modification de poids, taille, alimentation et quantité/unité.
    - [x] Concevoir dans Figma le flux unifié Corps → ajout daté Poids/Taille → succès/erreur → historiques Poids/Taille, avec variantes Light/Dark/Glass et prototype raccordé.
    - [x] Connecter Image Picker, permissions, upload présigné puis payload JSON `addAnimalBodyPicture`, invalidation et retry de lecture.
    - [x] Connecter la suppression d’une photo de suivi avec confirmation explicite.
  - [x] **P7.c.4 — Terminer la Galerie, retirée ensuite de la navigation par décision produit.**
    - [x] Consommer `useAnimalBodyPicturesQuery` et couvrir loading/error/empty/grille.
    - [x] Connecter le CTA et le FAB d’ajout à Image Picker puis à la mutation d’upload.
    - [x] Ouvrir les photos dans le Media Viewer.
    - [x] Ajouter les actions prévues par Figma et confirmer toute suppression.
    - [x] Rafraîchir et conserver l’état d’écran après ajout ou suppression.
  - [ ] **P7.c.5 — Créer/modifier un animal dans une Form Sheet persistante unique.**
    - [x] Lire les écrans Figma Light/Dark et le prototype pour Profil → Dates → Identité → Origines → Corps et alimentation → Notes/vérification.
    - [x] Créer un store de wizard Vasco ou adapter proprement l’état métier existant sans dépendance à l’ancienne UI.
    - [x] Implémenter Profil : photo, nom, espèce et sexe.
    - [x] Implémenter Dates : naissance et arrivée.
    - [x] Implémenter Identité : race, couleur et identification. Le champ visuel Provenance a été retiré par décision produit pour ne pas le confondre avec le contrat API `provenance` (`owner`/`group`).
    - [x] Implémenter Origines : père et mère.
    - [x] Implémenter Corps et alimentation : poids, taille, nourriture, quantité et unité.
    - [x] Implémenter Notes/vérification : informations complémentaires, résumé et validation finale.
    - [x] Conserver les valeurs entre étapes, masquer la Bottom Bar et remplacer uniquement le contenu de la même sheet.
    - [x] Fermer directement une sheet intacte et confirmer l’abandon lorsqu’une modification serait perdue.
    - [x] Préremplir la totalité des champs en modification et réutiliser exactement le même parcours.
    - [x] Appeler `createAnimal`/`updateAnimal`, gérer JSON ou photo via l’upload présigné existant, enregistrer séparément les historiques physiques modifiés, puis sélectionner l’animal créé/modifié.
    - [x] Couvrir mutation en cours, erreur locale, timeout/404, erreur serveur et succès.
  - [ ] **P7.c.6 — Connecter les actions sensibles Animal.**
    - [x] Afficher le menu `…` avec Modifier, départ, décès et suppression.
    - [x] Raccorder Modifier au wizard complet prérempli.
    - [x] Implémenter « Signaler un départ » dans la bottom sheet Figma avec date obligatoire et conservation dans l’historique.
    - [x] Implémenter « Signaler un décès » dans la bottom sheet Figma avec date obligatoire et conservation dans l’historique.
    - [x] Implémenter la suppression via Dialog destructif et confirmation explicite.
    - [x] Bloquer la fermeture pendant une mutation sensible, afficher l’erreur dans l’overlay et choisir un autre animal après suppression.
  - [ ] **P7.c.7 — Valider Animaux.**
    - [ ] Tester sélection/onglet, création, modification, abandon intact/sale, départ, décès, suppression et photos.
    - [ ] Tester loading, empty, erreurs réseau/timeout/404/500 et restauration après retry.
    - [ ] Ajouter le scénario Maestro critique Animal et l’exécuter sur appareil/émulateur.
    - [ ] Vérifier VoiceOver/TalkBack, clavier, font scale 200 %, contrastes et tailles tactiles.
  - [ ] **P7.c.8 — Migrer Performance/Objectifs/Statistiques après clôture Animaux.**
    - [ ] Implémenter liste, détail, création/modification, progression, duplication et suppression des objectifs.
    - [ ] Implémenter la racine Suivi et les statistiques Jour, Mois, 1 an et 5 ans avec données backend réelles.
    - [ ] Raccorder graphiques et tooltips accessibles, états async et verrou Premium contextualisé avec comparatif Gratuit/Premium.
    - [ ] Valider Light/Dark, Glass/Solid, accessibilité et parcours critiques avant de clôturer P7.c.
- [ ] **P7.d** Notes/Wishes, Contacts/Groups, Notifications et Settings/Account.
- [ ] **P7.e** Valider chaque écran en Light, Dark, Glass/Solid, async, Premium et parcours Figma.
  - [ ] Revalider les écrans utilisant Bottom Sheet, Dialog, Action Menu et Selection Modal après la reprise P4.f–P4.g.

La présentation historique a été supprimée avant reconstruction. Les hooks, services, stores, types, validateurs et accès API ont été conservés.

### P8 — Validation et sortie

- [ ] **P8.a** Tests composants pour chaque API publique et état critique.
- [ ] **P8.b** Maestro : auth, création événement/animal/note, Premium et confirmation destructive.
- [ ] **P8.c** Comparaisons visuelles petits/grands écrans, Light/Dark et Glass/Solid.
  - [ ] Inclure une capture de chaque famille Overlay et un contrôle automatisé des chevauchements sur la page catalogue.
- [ ] **P8.d** Audit VoiceOver/TalkBack, clavier, font scale 200 %, contrastes et préférences système.
- [ ] **P8.e** Vérifier : aucun MyDailyBook visible, aucune valeur récurrente brute, aucun flux dupliqué.
- [ ] **P8.f** Publier le catalogue final et vérifier l'absence de dépendance à l'ancienne présentation.

## Ordre de dépendance

`tokens → icônes/texte/surface → boutons/sélections → fields → navigation/feedback → overlays → cards/charts → patterns → écrans`.

Les premiers lots sont P0, P1, puis P2.a–P2.b. La migration d'écrans ne commence qu'après validation des composants et patterns nécessaires.

## Definition of Done d'un composant

API conforme à Figma, variantes utiles couvertes, propriétés tokenisées, Light/Dark et Glass/Solid validés, états interactifs/async testés, accessibilité vérifiée et exemple d'usage documenté.

## Risques suivis

- divergence Vasco/DailyBook dans les identifiants et contenus ;
- doublons historiques dans les features ;
- explosion de variantes si les états métier descendent dans les atomes ;
- Glass non homogène entre plateformes et appareils anciens ;
- migration d'écrans avant stabilisation des patterns ;
- couverture visuelle React Native insuffisante.

Les tickets, PR et comptes rendus conservent les identifiants P0.a à P8.f.

## Journal d'avancement

### 9 août 2026 — P7.a/P7.b

- Nouvelle arborescence UI Vasco utilisée par Auth, Home, Agenda et Events ; les anciens écrans de présentation correspondants ont été supprimés.
- Parcours événement guidé et IA raccordés aux stores, queries et mutations conservés de la couche métier.
- Correction de la stabilité du sélecteur Zustand de choix des animaux afin d'éviter `Maximum update depth exceeded`.
- Correction de l'URL API locale, ajout d'un timeout Axios de 10 secondes et exposition des états d'erreur après échec réseau.
- Contrat Notifications aligné sur l'API Python et sécurisé contre les réponses/caches mal formés.
- Contrôles exécutés au fil des lots : TypeScript, tests unitaires des utilitaires Events/Notifications et `git diff --check`.
- À cette étape, P7.b restait ouvert pour l'édition, les actions Dupliquer/Partager, la protection Premium backend et la validation visuelle/E2E.

### 9 août 2026 — clôture P7.a

- Audit du répertoire Figma : aucun onboarding produit distinct des écrans Auth n'est défini ; le parcours Welcome/Auth constitue l'onboarding d'entrée de P7.a.
- Variante Home Scrolled raccordée au déplacement réel du contenu via `RootScreen`, sans modifier les destinations des vagues suivantes.
- Variantes Home Loading, Empty et Error raccordées aux états React Query ; timeout HTTP et normalisation Notifications validés.
- P7.a est clos fonctionnellement. La validation exhaustive multi-thème, multi-matériau et multi-device reste centralisée en P7.e/P8, conformément au plan.

### 9 août 2026 — P7.b édition événement

- Le menu `Modifier` hydrate le wizard existant avec l'événement courant puis réutilise les étapes Détails → Animaux → Options, conformément à la maquette Figma `Events/Edit — Soins` et au parcours documenté.
- La dernière étape appelle la mutation de mise à jour, revient au détail avec une confirmation et conserve les champs métier non réaffichés, notamment l'état, le parent et la récurrence.
- Validation effectuée : `npm run typecheck` et 4 tests unitaires ciblés via `npx jest --runInBand --coverage=false tests/unit/components/eventCreationUtils.test.ts`.
- À la clôture de ce sous-lot, P7.b restait ouvert pour Dupliquer/Partager, la protection Premium backend et les validations visuelles/E2E prévues dans les sous-tâches suivantes.

### 9 août 2026 — P7.b duplication et partage

- `Dupliquer` hydrate une copie indépendante dans le wizard existant, préfixe son intitulé, remet son état à `pending` et ne reprend ni parent ni groupes partagés.
- Le parcours de duplication conserve les retours vers l'événement source, réutilise Détails → Animaux → Options, puis appelle la mutation de création et affiche le succès existant.
- `Partager` ouvre la feuille native iOS/Android avec un résumé localisé de l'événement et affiche un état d'erreur actionnable si le système refuse l'ouverture.
- Validation effectuée : `npm run typecheck`, 6 tests unitaires ciblés et `git diff --check`.
- À la clôture de ce sous-lot, P7.b restait ouvert pour la protection Premium backend puis les validations visuelles/E2E.

### 9 août 2026 — P7.b protection Premium backend

- Une dépendance FastAPI centralisée vérifie l'abonnement actif après authentification et lève l'erreur métier `PremiumRequiredError` pour tout compte non Premium.
- La garde est appliquée aux routeurs IA et Groupes complets ; les appels directs hors application mobile ne peuvent donc plus contourner les restrictions client.
- Le repository en mémoire respecte désormais l'abonnement injecté afin de tester fidèlement les deux niveaux d'accès.
- Validation backend effectuée : 18 tests E2E passants, dont refus Free sur IA/Groupes et accès Premium sur les deux, Ruff ciblé et `git diff --check`.
- À cette étape, P7.b restait ouvert pour la vérification visuelle exhaustive puis le scénario critique sur appareil/émulateur et Maestro.

### 9 août 2026 — P7.b vérification visuelle

- Comparaison des écrans Agenda/Événements avec les nœuds Figma `Events/Calendar — Solid`, `Events/Calendar — Glass`, `Events/Detail` et `Events/Create Options`, complétée par les écrans de création et d'édition déjà contrôlés dans les sous-lots précédents.
- La variante `material` de l'Agenda est propagée à la Top Bar, Bottom Bar, FAB et feuille de création ; `useResolvedMaterial` garantit le fallback Solid avec la même géométrie lorsque le Glass est indisponible ou que la réduction de transparence est active.
- La bottom bar devient fluide sous 390 px sans dépasser sur les petits écrans, tout en conservant la largeur maximale Figma sur les grands écrans ; l'instance écran de `EventCard` peut atteindre les 358 px de la maquette.
- Light et Dark utilisent exclusivement les tokens sémantiques pour ces écrans ; aucun coloris récurrent brut n'a été détecté dans le périmètre Events.
- Validation effectuée : `npm run typecheck`, 14 tests ciblés thème/matériau/écran/Agenda et bundle Expo Web de production généré avec succès.
- P7.b reste ouvert uniquement pour les tests du parcours critique sur appareil/émulateur et le scénario Maestro.

### 9 août 2026 — P7.b préparation Maestro

- Le flow de connexion utilise désormais les libellés Vasco actuels et attend explicitement l'arrivée sur l'accueil.
- Le scénario critique Events couvre Agenda → création guidée → type Soins → détails/date → premier animal → options → mutation → succès → retour Agenda.
- Un identifiant stable `event-animal-*` et le CTA `event-animals-continue` rendent la sélection d'un animal déterministe sans dépendre de son nom ou de son identifiant backend.
- Validation effectuée : `npm run typecheck` et parsing réussi des 7 fichiers YAML E2E.
- Exécution tentée via `npm run test:e2e` mais impossible dans l'environnement courant : la commande `maestro` n'est pas installée et aucun outil `adb`/émulateur n'est disponible. La sous-tâche et P7.b restent donc ouverts jusqu'à une exécution réelle sur appareil ou simulateur avec les identifiants de test.

### 9 août 2026 — clôture P4.g

- Les composants Bottom Sheet, Dialog, Action Menu et Selection Modal utilisent désormais le token sémantique `surface` en Solid et `glassBackground` en Glass, conformément aux composants source Figma.
- L'audit confirme l'emploi du scrim sémantique, la poignée 40 × 5, les coins inférieurs droits du Bottom Sheet, les icônes centrées et des lignes d'action tactiles de 48 à 56 px.
- La résolution de surface est centralisée et couverte pour Light, Dark, Solid et Glass par un test unitaire dédié.
- Validation effectuée : `npm run typecheck` et 11 tests ciblés overlays passants.

### 9 août 2026 — clôture P5.e

- Toutes les cartes partagées de `shared/components/ui/content` et `shared/components/ui/charts` ont été auditées : elles reçoivent leurs données et actions par props et n'importent ni navigation, ni routeur, ni service, ni client HTTP, ni query hook.
- Un test d'architecture parcourt désormais les sources `*Card.tsx` et empêche la réintroduction de ces dépendances interdites.
- Validation effectuée : `npm run typecheck` et 16 tests ciblés cartes/overlays passants.
- P4 et P5 sont entièrement clos. Le prochain point ouvert dans l'ordre du plan reste l'exécution réelle du parcours P7.b sur appareil ou émulateur avec Maestro.

### 9 août 2026 — reprise Form Sheet des événements

- Le composant Figma `Overlay/Form Sheet Surface` est implémenté comme surface commune Solid/Glass et alimente désormais le Bottom Sheet partagé.
- Une enveloppe `FormSheet` centralise la hauteur adaptative, la Top Bar, le contenu scrollable, le footer long et la confirmation d'abandon des données non enregistrées.
- Entrée, type, détails spécifiques, animaux, options, description IA et vérification IA utilisent cette enveloppe ; création, modification et duplication conservent respectivement l'Agenda/Home ou le détail événement en arrière-plan.
- Le succès reste volontairement un écran complet, conformément au nœud Figma `Events/Create — Success`.
- Validation effectuée : `npm run typecheck`, 16 tests unitaires ciblés Events/overlays et `git diff --check`.
- La sous-tâche reste ouverte pour la vérification réelle Light/Dark, Glass/Solid, clavier, scroll, accessibilité et appareil/émulateur.

### 9 août 2026 — ajustement de la Form Sheet

- La hauteur des formulaires est ramenée à 88 % de la fenêtre, plafonnée à 760 px, afin de conserver le CTA inférieur visible sur les écrans courants tout en laissant le contenu défiler.
- La poignée des Form Sheets dispose d'une zone dédiée de 24 px et d'un indicateur gris 48 × 5 plus visible ; les Bottom Sheets standards conservent leur poignée compacte.
- Validation effectuée : `npm run typecheck` et `git diff --check`.

### 9 août 2026 — corrections d'intégration Form Sheet

- Le FAB Solid conserve désormais son fond primaire : la surface de navigation ne peut plus l'écraser avec `color/surface`. Sa variante Glass conserve le blur et le fond Glass prévus.
- Les étapes successives d'un formulaire utilisent le comportement `replace` de Gorhom : une seule Bottom Sheet reste dans la pile et l'abandon de l'étape courante ferme donc tout le parcours après confirmation.
- Le corps de la Bottom Sheet est contraint à la hauteur réelle du snap point, poignée déduite ; le footer et son CTA restent dans la zone visible tandis que le contenu central défile.
- Validation effectuée : `npm run typecheck`, 7 tests ciblés actions/matériaux/overlays et `git diff --check`.

### 9 août 2026 — correction portail et pile des Form Sheets

- `useAppTheme` ne dépend plus du hook Tamagui `useTheme`, dont le contexte n'était pas garanti dans le portail Gorhom et provoquait `No theme found` à l'ouverture du menu du FAB.
- Toutes les étapes Event partagent l'identité modale `vasco-form-sheet` et chaque instance appelle explicitement `dismiss()` lors de son démontage ; une ancienne étape ne peut plus rester enregistrée derrière l'étape courante.
- Validation effectuée : `npm run typecheck`, 3 tests ciblés overlays et `git diff --check`.

### 9 août 2026 — correction de transition Form Sheet

- L'identité modale commune a été retirée : le démontage de l'étape précédente fermait la nouvelle instance portant le même nom lors de la transition Entrée → Type.
- Chaque instance conserve son nettoyage explicite au démontage, qui cible désormais uniquement l'ancienne sheet et permet à l'étape suivante de s'ouvrir.
- Validation effectuée : `npm run typecheck`.

### 9 août 2026 — Form Sheet persistante du parcours Event

- L'architecture à une modal par étape est supprimée au profit de `FormSheetHost`, une unique `BottomSheetModal` qui reste montée pendant tout le parcours.
- Entrée, Type, Détails, Animaux, Options et les étapes IA remplacent uniquement le contenu, le titre, la progression et le footer de cette même sheet.
- Création, modification et duplication utilisent le même mécanisme ; fermer ou abandonner la sheet ne peut donc plus révéler une étape précédente.
- Les écrans d'étape conservent leur API autonome et s'enregistrent comme contenu lorsqu'ils sont rendus dans le host, ce qui permet de réutiliser le pattern pour les futurs formulaires.
- Validation effectuée : `npm run typecheck`, 16 tests ciblés Events/overlays et `git diff --check`.

### 9 août 2026 — contexte Safe Area des overlays

- `SafeAreaProvider` enveloppe désormais `BottomSheetModalProvider` dans `App.tsx`, afin que les contenus rendus par le portail Gorhom disposent toujours des insets.
- Cette correction supprime l'erreur `No safe area value available` lors de l'ouverture du parcours Event depuis le menu du FAB.
- Validation effectuée : `npm run typecheck`.

### 9 août 2026 — transition menu FAB vers formulaire

- Le menu global de création mémorise désormais la destination sélectionnée, se ferme entièrement, puis déclenche la navigation depuis son callback `onDismiss`.
- La Form Sheet Event n'est donc plus présentée pendant que la Bottom Sheet du menu FAB est encore enregistrée dans le portail Gorhom.
- Validation effectuée : `npm run typecheck`, tests ciblés `globalCreateMenu` et `bottomSheetUtils`, puis `git diff --check`.

### 9 août 2026 — démontage du portail du menu FAB

- Après son callback `onDismiss`, le menu global est désormais retiré de l'arbre React ; le portail Gorhom précédent ne reste plus monté avec seulement `open=false`.
- La destination sélectionnée est déclenchée après deux frames, une fois le démontage du menu commité, afin qu'une seule surface puisse être présente lors de l'ouverture de la Form Sheet Event.
- Validation effectuée : `npm run typecheck` et tests ciblés `globalCreateMenu`/`bottomSheetUtils`.

### 9 août 2026 — purge du registre Gorhom avant création

- Le doublon persistant provenait du registre interne de `BottomSheetModalProvider` : le portail du menu pouvait rester référencé après sa fermeture React et être restauré lors de la présentation suivante.
- `MainNavigator` appelle désormais `dismissAll()` avant toute entrée dans la création Event, puis présente la Form Sheet au frame suivant. Le registre Gorhom est donc vide avant le montage du host unique.
- Validation effectuée : `npm run typecheck` et tests ciblés `globalCreateMenu`/`bottomSheetUtils`.

### 9 août 2026 — cause racine du doublon Form Sheet

- Le titre visible `Formulaire` a permis d'identifier la modal du host, tandis que `Nouvel événement` provenait de la modal autonome de l'étape enfant.
- Cause racine : `FormSheetHostContext.Provider` entourait la modal Gorhom ; son contenu rendu dans le portail ne recevait pas ce contexte, donc l'étape enfant se croyait autonome et ouvrait une seconde modal.
- Le provider est désormais rendu à l'intérieur du contenu de `FormSheetModal`, donc dans le même portail que l'étape. L'enfant s'enregistre auprès du host et ne rend plus sa propre Bottom Sheet.
- Le contournement `dismissAll()` et le démontage temporisé du menu FAB ont été retirés.
- Validation effectuée : `npm run typecheck`, 4 tests ciblés menu/overlays et `git diff --check`.

### 9 août 2026 — sections vides de l'accueil

- La variante Figma `Home/Overview — Sections Empty` est raccordée aux données réelles sans confondre cet état avec l'accueil entièrement vide d'un nouveau compte.
- Aujourd'hui affiche `Rien de prévu aujourd'hui`, Prochains jours affiche `Aucun événement à venir` et Objectifs affiche `Aucun objectif en cours`, avec les descriptions exactes des maquettes.
- `SectionEmptyMessage` centralise la surface variant, la hauteur 76 px, le rayon et la typographie en Light/Dark/Glass ; les actions de section sont masquées lorsqu'il n'y a aucun contenu.
- Validation effectuée : `npm run typecheck`, 7 tests ciblés Home/états async et `git diff --check`.

### 9 août 2026 — safe areas des bars et erreurs Event

- `RootScreen` laisse désormais les conteneurs Top Bar et Bottom Bar peindre respectivement les safe areas haute et basse ; leur couleur Solid/Glass se prolonge jusqu'aux bords physiques de l'écran.
- La position du FAB inclut l'inset inférieur afin de conserver le même écart visuel au-dessus de la Bottom Bar sur les appareils avec indicateur d'accueil.
- L'enregistrement Event classe l'erreur avec `parseApiError` : timeout/absence de réponse et 404 affichent le conseil réseau demandé, tandis qu'une erreur 500 indique un problème de notre côté sans incriminer la connexion de l'utilisateur.
- Validation effectuée : `npm run typecheck`, 24 tests ciblés erreurs/écrans/Events et `git diff --check`.

### 9 août 2026 — barre système Android inférieure

- La zone inférieure restante a été identifiée comme la barre de navigation native Android, située hors de l’arbre React Native et donc hors de portée de la seule `SafeAreaView`.
- `expo-navigation-bar` synchronise désormais sa couleur de fond et le contraste de ses boutons avec le thème Vasco actif ; la configuration native Light est aussi déclarée dans `app.json` pour le démarrage de l’application.
- Validation effectuée : `npm run typecheck` et `git diff --check`.

### 9 août 2026 — fond natif sous l’indicateur d’accueil iOS

- La correction Android précédente ne pouvait pas agir sur iOS. La safe area React était déjà couverte, mais la vue racine native conservait son fond implicite sous l’indicateur d’accueil.
- La racine de `VascoApplication` peint désormais explicitement `color/surface` sur toute la fenêtre et suit le thème Light/Dark, afin que la Bottom Bar et la zone système inférieure forment une surface continue sur iOS.
- Validation effectuée : `npm run typecheck`, `npx expo config --type public` et `git diff --check`.

### 9 août 2026 — démarrage P7.c Animaux

- La destination `Animaux` de la Bottom Bar ouvre désormais le workspace réel au lieu de retomber sur Home.
- Le premier écran `Animals/Workspace — Infos` suit les sources Figma Light `253:619`, Dark `349:8438` et Glass `256:1248` : Top/Bottom Bar, sélecteur horizontal séparant Présents et Historique, onglets internes, informations de l’animal sélectionné et menu `…`.
- Le workspace consomme `useAnimalsQuery`, conserve la sélection lorsque les données se mettent à jour et couvre chargement, erreur, vide et rafraîchissement. L’ordre métier reste présents, départs, décès.
- P7.c reste ouvert pour raccorder Carnet, Corps, Galerie, puis le parcours complet de création/modification et les actions sensibles.
- Validation effectuée : `npm run typecheck`, 2 tests unitaires ciblés Animaux et `git diff --check`.

### 9 août 2026 — P7.c workspace Animaux complet

- Les volets Figma Carnet `253:785`/`349:8528`, Corps `253:942`/`349:8639` et Galerie `253:1099`/`349:8741` remplacent les contenus temporaires tout en conservant l’animal sélectionné et le même écran racine.
- Carnet filtre les événements à venir de l’animal et agrège leurs documents médicaux avec les composants partagés `EventCard` et `FileItem`.
- Corps affiche les dernières valeurs poids/taille, l’alimentation réelle et le point d’entrée du suivi visuel via `MetricCard` et `MediaUpload`.
- Galerie consomme `/animals/{id}/body-pictures`, normalise défensivement la réponse et couvre chargement, erreur, vide et grille de souvenirs. Les FAB contextuels exposent les futures actions d’ajout sans dupliquer leur logique.
- P7.c reste ouvert pour le parcours Animal Profil → Dates → Identité → Origines → Corps et alimentation → Vérification, puis les actions départ/décès/suppression.
- Validation effectuée : `npm run typecheck`, 3 tests unitaires ciblés workspace/galerie Animaux et `git diff --check`.

### 10 août 2026 — mesures animales et Bottom Bar flottante

- `Navigation/Bottom Bar` conserve ses cinq destinations mais devient une surface flottante 358 × 72 px, centrée avec 16 px de marge latérale et basse ; Solid et Glass partagent la même géométrie.
- Les 175 instances visibles des pages Home à Settings et Prototypes ont été repositionnées ; audit final : 0 anomalie de taille ou de position.
- L’onglet Corps expose un CTA `Ajouter une mesure`. Le flux partagé saisit Poids ou Taille, date et valeur dans une Form Sheet, avec états Light, Dark, Glass, Error et Success.
- Deux historiques gratuits Poids/Taille réutilisent les graphiques et listes existants ; les analyses avancées de Suivi restent Premium.
- Les entrées depuis le CTA Corps, les cartes de mesure et le menu `…` sont raccordées au prototype.
- Un checkpoint réversible est conservé sur la page Figma `99 — Rollback · 2026-08-10 · Floating Bar & Measurements` et dans `.codex/figma-rollback-floating-bar-measurements-20260810.json`.
- Validation Figma : 0 chevauchement supérieur entre nouveaux écrans, 0 police hors Quicksand et variantes Solid/Glass contrôlées visuellement.
- Implémentation mobile/backend : la Bottom Bar est désormais flottante avec l’espace de scroll sûr correspondant ; le CTA Corps ouvre la Form Sheet de saisie Poids/Taille et les cartes ouvrent leur historique brut, alimenté par `GET /animals/{animal_id}/history/{item}`. Les mutations invalident la liste Animaux et l’historique ciblé.
- Tests ciblés ajoutés pour le contrat de lecture des mesures, son contrôle d’accès et les dimensions de la Bottom Bar. P7.c.3 reste ouvert pour les dates/tendances des cartes et la modification des mesures/alimentation ; P7.c reste ouvert.
- Sous-lot suivant : les cartes Corps utilisent maintenant la mesure réellement la plus récente, affichent sa date et ne déterminent une hausse/baisse qu’avec deux relevés. Chaque ligne d’historique expose Modifier/Supprimer ; la modification cible l’identifiant de la ligne via `PUT /animals/{animal_id}/history/{item}/{history_id}` au lieu d’insérer un doublon. P7.c.3 reste ouvert pour l’alimentation et la quantité/unité.
- Finalisation P7.c.3 : conformément à Figma, alimentation et quantité/unité restent dans l’étape `Corps & alimentation` du formulaire Animal et alimentent leur historique lors d’une création ou d’une modification. Un changement d’unité seul crée désormais le relevé de quantité attendu. P7.c.3 est terminé ; P7.c global reste ouvert.
- Validation Animaux, sous-lot P7.c.7 : correction du point d’entrée manquant pour créer un animal lorsque le workspace n’est pas vide (`animals-infos-add`) et protection du bouton Retour contre la perte de valeurs dans les Form Sheets Animal, mesure, départ et décès. Les anciens flows Maestro de l’UI supprimée ont été remplacés par les parcours Vasco `create-animal.yaml` (abandon propre/sale puis création complète) et `view-animal.yaml` (Corps → mesure → historique). Leur exécution réelle reste ouverte faute d’appareil/émulateur pilotable ; P7.c.7 n’est pas terminé.

### 10 août 2026 — simplification Home, Agenda et workspace Animaux

- Maquettes Figma : suppression de la phrase d’introduction et des actions rapides de Home, sans modifier les sections Aujourd’hui, Prochains jours et Objectifs.
- Agenda possède désormais un état explicite pour une date sans événement en Light, Dark et Glass, avec FAB de création conservé.
- Le sélecteur partagé affiche d’abord les animaux présents sans séparation visuelle, puis révèle l’historique via `Voir plus` (`Selection/Animal Selector More`, `458:23853`).
- Le workspace Animaux est ramené à Informations, Physique et Santé. Santé affiche l’historique médical puis les documents médicaux ; Galerie est retirée de la navigation.
- Les déclencheurs `…` utilisent un bouton fantôme de 44 × 44 px : aucune pastille au repos, surface discrète uniquement dans les états d’interaction.
- La Bottom Bar conserve sa géométrie flottante et adopte l’ordre Accueil, Suivi, Agenda, Animaux, Plus.
- Le lot Figma est sauvegardé sur la page rollback `455:2`; aucune implémentation mobile n’est déclarée terminée par cette mise à jour de maquettes.
- Affinage validé du sélecteur : le chevron de divulgation est remplacé par `+` à l’état replié et `−` à l’état déplié. Les formulaires Événements, Objectifs et Groupes appliquent la même divulgation progressive ; les chevrons décoratifs des lignes de sélection Événements sont supprimés. Sauvegarde dédiée : page rollback `469:4130`.
- Implémentation mobile du sous-lot : Home n’affiche plus l’introduction ni les actions rapides ; Agenda utilise l’état vide contextualisé Light/Dark/Glass et conserve le FAB ; la Bottom Bar suit l’ordre Accueil, Suivi, Agenda, Animaux, Plus. Le sélecteur partagé de `AnimalsWorkspaceScreen` et `TrackingScreen` montre les présents puis révèle les départs/décès via `Voir plus`. Le workspace expose Informations, Santé et Physique ; Santé affiche tout l’historique `soins`/`rdv` du plus récent au plus ancien puis les documents médicaux. Les déclencheurs `…` Animaux sont désormais des boutons fantômes de 44 px sans pastille au repos. Validation : typecheck, 8 tests ciblés Agenda/navigation/Animaux et `git diff --check` verts. Les validations visuelles et d’accessibilité sur appareil restent ouvertes.
- Validation async/accessibilité P7.c.7 : le workspace, la galerie et les historiques conservent désormais leurs données lors d’une erreur de rafraîchissement et présentent un bandeau non bloquant ; loading, erreur bloquante sans cache et vide restent distincts via `resolveAsyncState`. Les cartes Poids/Taille n’exposent plus deux cibles VoiceOver/TalkBack imbriquées. Les validations manuelles appareil (lecteur d’écran, clavier, font scale 200 %) restent ouvertes.
- Démarrage P7.c.8 : lecture Figma des vues `Performance/Objectifs Overview` (`263:2`), `Statistics Overview` (`263:124`), `Objective Detail` (`263:476`) et `Create Objective Details` (`265:322`). La destination Bottom Bar `Suivi` affiche maintenant la racine Objectifs alimentée par React Query, le sélecteur Animal/Tous, les cartes de progression et les états loading/empty/error. Pour un compte Free, Statistiques ouvre `Premium Required — Statistiques`. Détail, actions et Form Sheet Objectif restent ouverts ; P7.c.8 et P7.c global ne sont pas terminés.
- P7.c.8 détail Objectif : lecture des étapes Figma Animaux (`265:383`), Vérification (`265:442`), Actions (`274:4148`) et Modification (`274:4218`). Le détail réutilisable affiche progression, étapes tactiles et animaux liés ; une étape met à jour le payload complet, la duplication retire les identifiants de sous-étapes et réinitialise leur état, et la suppression passe par une confirmation destructive. Les utilitaires contractuels sont testés. Le raccordement navigateur et la Form Sheet persistante restent le prochain sous-lot ; P7.c.8 reste ouvert.
- Alignement transversal Figma du 10 août : `AnimalSelectorMore` utilise désormais `+ / Voir plus` et `− / Voir moins`, tandis que la sélection Animaux du formulaire Event applique la même divulgation sans chevrons et révèle automatiquement un animal historique déjà sélectionné en modification. Le contour de sélection partagé est le dégradé Vasco. `RootScreen` propage l’état scrollé à la Top Bar commune afin d’afficher son séparateur sur tous les écrans scrollables. Agenda force les libellés français et un en-tête mois/année sans heure ; son vide contextualisé reprend la maquette. Enfin, les FAB Suivi et Animaux ouvrent le menu global de création, indépendamment de l’onglet interne, et leurs Top Bars exposent à nouveau cloche et profil. Le formulaire Objectif n’étant pas encore implémenté, il réutilisera `AnimalHistoryToggle` dans le prochain sous-lot P7.c.8 au lieu de créer une variante. Validation : `npm run typecheck`, 8 tests ciblés Agenda/Animaux et `git diff --check` verts. P7.c.8 et P7.c global restent ouverts.
- Reprise ordonnée P7.c.2/P7.c.5 : Santé propose désormais l’ajout d’un soin lorsque l’historique est vide et l’import PDF/image vers un soin ou rendez-vous existant. L’import expose l’état en cours, conserve localement le fichier en erreur pour un retry sans nouvelle sélection, puis invalide les Events après liaison. Ouverture et menu `…` utilisent la route Event ; la suppression est confirmée et atomique côté backend (S3 puis métadonnée). Une route dédiée `POST /events/{id}/documents/{filename}` lie le fichier après upload avec contrôle d’accès, sans réécrire l’événement. Les vides et erreurs Santé reprennent les composants et la hiérarchie du frame Health Light `253:785` / Dark `349:8528`; aucun frame vide/erreur autonome ni interaction de prototype supplémentaire n’est défini sur ces sources. Le formulaire Animal distingue validation/permission locale, échec photo, timeout/réseau, 404, erreur serveur et affiche un succès dismissible au retour dans le workspace ; les valeurs restent conservées en erreur et le CTA expose l’état de mutation. Validation : typecheck vert, 12 tests frontend ciblés et 15 tests backend Event verts. Les validations appareil de P7.c.1/P7.c.7 restent ouvertes ; P7.c global n’est pas terminé.
