# P0 — Audit design system Vasco

Date : 8 août 2026. Périmètre : Figma Vasco, client mobile et API Python. Aucun composant ni écran n'a été modifié.

## P0.a — Fondations Figma ↔ code

Figma possède 135 variables réparties en 7 collections : Primitives 38, Color 36 (Light/Dark), Spacing 6, Radius 8, Typography 17, Material 8 et Component 22.

### Aligné

- Palette de marque, couleurs événement, spacing 4/8/16/24/32/48, rayons 4/8/12/16/20/24/50/999, tailles typo 11–30 et line heights 18/22/26/32.
- Couleurs sémantiques principales, surfaces, bordures, overlays et Glass.
- Quicksand et ses cinq graisses.

### Écarts à corriger en P1

| Sujet | Figma | Code mobile | Décision proposée |
| --- | --- | --- | --- |
| Texte Light principal | neutre `#262524` | brun `#694233` | Figma gagne |
| Texte Light secondaire | neutre `#676460` | aubère `#BAA89B` | Figma gagne |
| Texte Dark principal | neutre `#F2F1EF` | palomino `#F6E6CE` | Figma gagne |
| Texte Dark secondaire | neutre `#B8B5B1` | aubère `#BAA89B` | Figma gagne |
| Surface d'erreur | primitives Light/Dark dans Figma | absentes | Ajouter au thème |
| Material | touch 44, tab bar 60, icônes 16/20/24/32 dans Figma | seuls blur 80/18 présents | Ajouter au thème |
| Component tokens | hauteurs/paddings boutons, fields, spinner, switch | valeurs locales dans composants | Ajouter au thème |
| Noms techniques | `dailybook` / `DailyBook*` | idem | Alias Vasco puis migration |

Qualité Figma à traiter : 6 nouvelles primitives et 14 Component tokens utilisent `ALL_SCOPES` ou n'ont pas de code syntax. Le style `SemiBold` doit être vérifié contre le nom de fonte réellement chargé. Les variables historiques ont une syntaxe web alors que le client cible React Native ; les syntaxes iOS/Android restent utiles comme contrat de nommage.

## P0.b — Contrats Figma

### Actions

- `Button` : Size 3 × Style Primary/Secondary/Ghost × State Default/Pressed/Disabled = 27.
- `Button/Destructive` : Size 3 × State 3 = 9.
- `Button/Icon` : Size 3 × Style 3 × State 3 = 27, label accessible obligatoire.
- `FAB` : Size Regular/Large × Material Solid/Glass × State 3 = 12.
- `Button/Loading` : Size 3 × Style 3 = 9.
- `Text Link` : Size 3 × State 3 = 9.
- `Chip` : Size 2 × Style Filled/Outlined/Tonal × State Default/Pressed/Selected/Disabled = 24.

### Forms

Text Field, Text Area, Select et Password partagent Default/Focused/Filled/Error/Disabled. S'ajoutent Search, Date/Time, Stepper, Slider, Media Upload, Checkbox, Radio, Switch et Option Card. Le socle commun doit porter label, helper, erreur et slots d'icônes ; les contrôles spécialisés restent des composants séparés.

### Navigation, Content, Feedback, Overlays

- Navigation : Bottom Bar Solid/Glass avec 5 destinations, Top Bar Root/Detail, Tabs et progressions.
- Content : 16 familles dont les 7 cartes métier, Linked Animals, listes, fichiers et graphiques.
- Feedback : Spinner, Paw Loader, Snackbar, Banner, Status Badge, Empty State, Skeleton et Premium Gate.
- Overlays : Bottom Sheet, Dialog, Action Menu, Action Sheet, sélections, pickers et media viewer.
- Patterns documentés : List Exploration, Guided Form, Multi Selection et Async States.

## P0.c — Matrice Figma → React Native

| Famille | Existant principal | Statut P1–P6 |
| --- | --- | --- |
| Button / Destructive / Loading | `AppButton` + ancien `Button` | Refactorer, garder adaptateur legacy temporaire |
| Icon Button | `AppIconButton` | Refactorer |
| Icons | `AppIcon` + imports Expo directs | Refactorer en registre sémantique |
| FAB / Text Link | dispersés | Créer |
| Chip | `AppChip` | Refactorer |
| Checkbox/Radio/Switch/Option Card | bibliothèques ou local | Créer wrappers Vasco |
| Fields | `AppInput` + nombreux inputs locaux | Scinder en socle Field + composants spécialisés |
| Top Bar | `AppHeader` + headers locaux | Refactorer |
| Bottom/Tab/Progress | navigation et écrans locaux | Créer/refactorer |
| Surface/Card | `AppCard` | Refactorer Material Solid/Glass |
| Cartes métier | plusieurs composants feature | Refactorer une famille à la fois |
| Feedback | Empty/Error/Skeleton partiels | Compléter ; créer Paw Loader, Snackbar, Banner, Premium Gate |
| Bottom Sheet | `AppSheet` utilisé largement | Refactorer sans casser les 25 usages détectés |
| Dialog/menus/actions | nombreuses modales feature | Créer primitives puis migrer |
| Charts | composants Statistics historiques | Reconstruire derrière une API commune |
| Patterns | wizards/listes dupliqués | Créer après composants |

Décision de réutilisation Figma : les composants Vasco locaux sont la source. Material 3 et les kits externes sont seulement des références de comportement plateforme ; ne pas les importer dans la bibliothèque Vasco. La recherche de bibliothèque n'a retourné aucun actif directement réutilisable pour le contrat Vasco.

## P0.d — Usages et dette mobile

Usages indicatifs détectés : `AppSheet` 25, `AppIconButton` 10, `AppIcon` 8, `AppInput` 7, `AppEmptyState` 7, `AppErrorState` 8, alors que `AppButton` n'apparaît que dans 4 fichiers. Une seconde famille historique `Button` reste très utilisée avec `type`, `isLong`, `optionalStyle` et `isUppercase`.

Zones de duplication prioritaires :

- formulaires et champs codés dans chaque modal métier ;
- headers/progressions/footer recréés dans les wizards Animal, Event et Objectif ;
- menus `ModalSubMenu*` par entité ;
- cartes métier avec rayons, ombres et spacing bruts ;
- sept composants Statistics fortement similaires ;
- couleurs `#fff`/`rgba(...)`, paddings 10/20 et rayons 5/10/15/20 répétés.

La migration doit commencer par des adaptateurs, jamais par une suppression globale des composants historiques.

## P0.e — Backend, Premium et mutations sensibles

### Premium

La documentation produit réserve Statistiques, Groupes, création IA et notes vocales au Premium. L'API expose bien `Free`/`Premium` et l'erreur structurée `FEATURE_UNAVAILABLE`, mais le contrôle Premium n'est actuellement appliqué qu'à l'upload de fichiers. Les routes Statistics, Groups et AI vérifient l'authentification, pas l'abonnement.

Conséquence : le `Premium Gate` côté mobile est nécessaire mais insuffisant. Une tâche backend doit protéger les cas d'usage concernés pour éviter le contournement client. La voix ne possède pas encore de contrat backend dédié identifié.

### Confirmations obligatoires côté UI

Les suppressions Event, Animal, Objectif, Note, Wish, Contact, Group et File sont exposées par l'API. S'ajoutent retrait de membre, refus/retrait de partage animal, suppression d'historique et de photo. Le Dialog/Action Sheet doit donc supporter : confirmation explicite, loading non fermable, erreur locale et succès.

Le modèle Animal possède `datedepart` et `datedeces` ; les parcours départ/décès doivent demander une date comme prévu par Figma. Aucune route de suppression de compte n'a été identifiée dans les routes utilisateur actuelles : dépendance backend avant l'écran final.

## P0.f — Décisions proposées pour geler l'API v1

1. Figma gagne sur les quatre couleurs de texte divergentes.
2. Les composants publics utilisent les noms Figma en anglais ; les labels restent traduits via i18n.
3. Tailles publiques : `small | medium | large`. Les valeurs historiques `s | m | l` restent acceptées uniquement par l'adaptateur legacy.
4. `loading` et `disabled` sont des états contrôlés par props ; `pressed`/`focused` restent internes.
5. `material: 'solid' | 'glass'` est résolu centralement avec fallback automatique.
6. Les cartes ne naviguent pas et n'appellent pas l'API ; elles émettent des événements.
7. Les erreurs backend `FEATURE_UNAVAILABLE` ouvrent le parcours Premium contextualisé.
8. Les gates Premium doivent aussi être implémentées côté backend avant livraison des modules concernés.
9. Les syntaxes de variables passent progressivement de `DailyBook*` à `Vasco*`, avec alias de compatibilité pendant la refonte.
10. La couverture Figma `MyDailyBook` doit devenir `Vasco` lors d'une tâche Figma dédiée.

## Sortie P0

P0 est terminé. La décision produit prise après l'audit est une reconstruction complète de la présentation, sans adaptateur UI historique. Les deux dépendances produit/backend majeures restent la protection serveur des fonctionnalités Premium et la suppression de compte.
