# Livraison design mobile Vasco

## 1. Objectif du document

Ce document explique comment transformer les maquettes Vasco en application sans perdre les décisions UX/UI validées. Il s’adresse aux développeurs et aux agents IA.

Fichier de référence : https://www.figma.com/design/y3EnZKYhqQju194UkyLoO7/Untitled

Le code mobile historique sert uniquement à identifier :

- les entités et champs disponibles ;
- les règles métier ;
- les appels API ;
- les permissions et limitations techniques.

Il ne faut pas reprendre son organisation visuelle, ses modales, ses espacements ou ses anciens flux si les maquettes les remplacent.

## 2. Organisation du fichier Figma

| Page | Contenu |
| --- | --- |
| Cover / Getting Started | contexte et règles de lecture |
| Foundations | couleurs, typographie, espacements, rayons et matériaux |
| Actions | boutons, FAB et icônes |
| Forms | champs et sélections |
| Navigation | top bar, bottom bar, tabs et progression |
| Content | cartes, listes, animaux liés et graphiques |
| Feedback | loaders, skeletons, banners, badges et messages |
| Overlays | bottom sheets, dialogues, menus et pickers |
| Patterns | compositions réutilisables et documentation |
| Auth à Settings | écrans par domaine, Light/Dark/Glass et états |
| Prototypes | parcours cliquables et index des journeys |

Toujours inspecter la page de composants avant de coder un élément visible dans plusieurs écrans.

## 3. Direction visuelle

Vasco doit être moderne, chaleureux, calme et précis. La personnalité vient de touches de la palette de marque, pas d’une coloration permanente de grandes surfaces.

- Fond Light : dégradé très léger entre blanc cassé et neutre froid/chaud clair, jamais blanc pur uniforme imposé partout.
- Fond Dark : neutre sombre contemporain. Les titres utilisent un blanc cassé, pas le brun historique.
- Texte Light : noir non pur pour le contenu principal, neutre secondaire pour les aides.
- Couleurs de marque : CTA, sélection, accent, icônes métier et éléments ponctuels.
- Cartes : surfaces sobres, hiérarchie par spacing, bordure et ombre légère.
- Glass : réservé aux surfaces où la profondeur est utile, jamais au détriment du contraste.

## 4. Thèmes et matériaux

### Light et Dark

Tous les composants utilisent des tokens sémantiques. Un composant ne reçoit pas une couleur différente au cas par cas pour simuler le Dark.

Le thème système est la valeur par défaut. L’utilisateur peut choisir Light, Dark ou système depuis Réglages > Apparence.

### Glass et fallback

Le Glass est une amélioration progressive :

- l’utiliser sur les appareils et versions système supportant correctement blur, transparence et contraste ;
- utiliser la variante Solid sur les anciens appareils ou lorsque `Reduce transparency` est actif ;
- ne jamais conditionner une fonctionnalité à la disponibilité du Glass ;
- conserver exactement la même géométrie, navigation et hiérarchie entre Glass et Solid ;
- tester sur Android et iOS, avec notamment un appareil ancien de type iPhone 11.

Le choix du matériau doit être centralisé dans le thème ou un composant, jamais dispersé dans les écrans.

## 5. Composants partagés obligatoires

Réutiliser les familles Figma correspondantes et leur équivalent applicatif :

- boutons Primary, Secondary, Destructive, Icon et Loading ;
- FAB et menu global de création ;
- top bar Root/Detail et bottom bar Solid/Glass ;
- progression linéaire ;
- champs texte, texte long, sélection, date/heure, slider, stepper et média ;
- cartes Event, Objective, Note, Animal, Group, Contact et Wish ;
- `Content/Linked Animals` pour les animaux liés ;
- Snackbar, Banner, Status Badge, Empty State et Skeleton ;
- Bottom Sheet, Dialog, Action Sheet et confirmation ;
- `Feedback/Premium Gate` pour les fonctionnalités verrouillées.

Une évolution d’un composant partagé doit mettre à jour toutes ses utilisations. Ne jamais copier son JSX et le faire diverger localement.

## 6. Navigation principale

La bottom bar contient au maximum cinq destinations :

- Accueil ;
- Suivi ;
- Agenda ;
- Animaux ;
- Plus.

`Suivi` regroupe Objectifs et Statistiques. `Autre` donne accès aux modules secondaires : Groupes, Contacts, Notes et Souhaits selon la structure montrée dans les maquettes. Notifications et Réglages restent accessibles depuis la Top Bar.

La bottom bar est une surface flottante superposée au contenu scrollable. Sur une largeur de référence de 390 px, elle mesure 358 px, conserve 16 px de marge latérale et reste à 16 px au-dessus de la safe area basse. Le contenu peut défiler derrière elle, mais son padding de fin doit permettre au dernier élément de remonter entièrement au-dessus de la barre. Solid et Glass utilisent exactement la même géométrie ; le fallback Solid remplace seulement le matériau.

La bottom bar est visible sur les écrans racine et certaines listes. Elle est absente :

- des wizards de création et modification ;
- des écrans d’authentification ;
- des confirmations sensibles ;
- des écrans focus comme l’enregistrement vocal ;
- des écrans ouverts en modal plein écran lorsque la maquette ne l’affiche pas.

## 7. Formulaires guidés

Les créations et modifications d’Événement, Animal, Objectif, Souhait, Contact et Groupe utilisent le même squelette :

1. bottom sheet de formulaire ancrée en bas, avec coins supérieurs arrondis et coins inférieurs droits ;
2. poignée centrée et fermeture par glissement vers le bas ;
3. top bar Detail avec flèche retour ;
4. progression linéaire avec nombre réel d’étapes ;
5. titre et aide courte ;
6. trois à quatre champs visibles au maximum ;
7. bouton principal long en bas ;
8. écran de vérification avant une création complexe ;
9. aucune bottom bar.

Les retours entre étapes préservent les données. Le bouton final emploie un verbe précis : `Créer le souhait`, `Créer le contact`, `Enregistrer les modifications`.

Un glissement vers le bas ferme immédiatement une sheet intacte. Si une valeur a été saisie ou modifiée, afficher une confirmation `Abandonner les modifications ?` avant fermeture. La hauteur s’adapte au clavier et au contenu sans positionnement absolu de la structure.

Les formulaires de modification exposent l’ensemble des informations modifiables, pas un sous-ensemble arbitraire.

## 8. Menus et actions

Une entité détaillée présente une seule action principale contextuelle et un menu `…` pour le reste. Ne pas afficher simultanément plusieurs CTA ayant une intention similaire.

Quand le menu est ouvert :

- le contenu arrière est assombri par un scrim ;
- le bouton `…` appartient au plan assombri ;
- la bottom sheet est ancrée en bas ;
- le handle est centré ;
- les coins inférieurs sont droits ;
- chaque action possède une icône sémantique centrée ;
- une action destructive est séparée et clairement identifiée.

Les suppressions, départs, décès, retraits de membre et suppression de compte demandent confirmation. Le départ et le décès d’un animal demandent une date.

## 9. États asynchrones et feedback

Chaque liste ou écran distant doit prévoir :

- skeleton pendant la lecture initiale ;
- rafraîchissement local sans bloquer tout l’écran ;
- état vide contextualisé sans bouton redondant avec le FAB ;
- Agenda avec recherche et filtres combinables, date toujours visible sur les cartes et heure facultative ;
- suivi visuel Animal visible mais verrouillé par une explication Premium contextualisée pour un compte Gratuit ;
- menu global ordonné Événement, Animal, Objectif, Note, Contact, Groupe, Souhait.
- état erreur humain avec `Réessayer` ;
- feedback local pendant une mutation ;
- snackbar ou confirmation discrète après succès.

Le loader de marque utilise le coussinet Vasco avec animation séquentielle. Les boutons Loading réutilisent le même composant source.

## 10. Premium

Fonctionnalités réservées : Statistiques, Groupes, création par IA et notes vocales.

Comportement d’un compte gratuit :

1. l’entrée reste visible avec l’indication Premium ;
2. un clic ouvre l’écran contextualisé `Premium Required` ;
3. le message explique concrètement ce que la fonction apporte ;
4. `Comparer les offres` ouvre la plaquette Gratuit/Premium ;
5. l’utilisateur peut revenir ou continuer gratuitement ;
6. le CTA Premium mène à la gestion de l’abonnement.

Ne pas utiliser un simple bouton disabled, un tooltip isolé ou une erreur après soumission.

La plaquette de référence indique :

| Fonctionnalité | Gratuit | Premium |
| --- | --- | --- |
| Animaux, événements, objectifs, notes, souhaits et contacts | Oui | Oui |
| Statistiques | Non | Oui |
| Groupes | Non | Oui |
| Création assistée par IA | Non | Oui |
| Notes vocales | Non | Oui |

Toute modification commerciale nécessite une validation produit et une mise à jour simultanée de cette table, du backend d’entitlements et des maquettes.

## 11. Checklist par écran

- [ ] Frame Figma et thème identifiés.
- [ ] Route entrante et sortie identifiées.
- [ ] Top bar et bottom bar conformes.
- [ ] Composants partagés utilisés.
- [ ] Default, loading, empty, error et success traités.
- [ ] État Premium traité si nécessaire.
- [ ] Keyboard, safe areas et scroll testés.
- [ ] Light, Dark, Glass/Solid testés.
- [ ] Textes longs et tailles dynamiques testés.
- [ ] VoiceOver/TalkBack et zones de 44 dp testés.
- [ ] Captures comparées aux maquettes.
