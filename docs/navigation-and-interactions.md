# Navigation et interactions Vasco

## 1. Principes

- La navigation principale donne accès aux domaines, pas aux actions de création.
- Le FAB centralise la création des entités.
- Un tap sur une carte ouvre son détail.
- Un tap sur `…` ouvre le menu d’actions de l’entité.
- Une flèche retour revient à l’écran précédent sans perdre l’état utile.
- Un changement de tab interne ne pousse pas une nouvelle route inutilement.
- Les paramètres de route contiennent des IDs, jamais un objet métier complet.

Le prototype Figma reste la référence précise pour les hotspots et transitions.

## 2. Navigation racine

| Origine | Action | Destination |
| --- | --- | --- |
| Bottom bar | Accueil | Home Overview |
| Bottom bar | Suivi | Objectifs / Statistiques |
| Bottom bar | Agenda | Calendar avec date sélectionnée et événements sous le calendrier |
| Bottom bar | Animaux | Workspace Animal |
| Bottom bar | Plus | Hub des modules secondaires |
| Top bar | Cloche | Liste des notifications |
| Top bar | Avatar | Réglages / profil |
| FAB | Tap | Menu global de création |

`Autre` est un hub racine distinct de `Compte et réglages`. Il présente directement Groupes, Contacts, Notes et Souhaits dans une grille de tuiles 2 × 2, sans intertitre redondant. Groupes reste visible et identifié Premium ; pour un compte gratuit, son ouverture utilise le parcours Premium contextualisé. Notifications et Compte/Réglages ne sont pas répétés dans ce hub : leurs accès globaux restent respectivement la cloche et l’avatar de la Top Bar.

## 3. Home et Agenda

Home sépare `Aujourd’hui`, `Prochains jours` et `Objectifs en cours`. Il n’affiche ni phrase d’introduction sous la salutation, ni bloc d’actions rapides. Un tap sur une Event Card ouvre le détail de l’événement. Un tap sur une Objective Card ouvre le détail de l’objectif.

Dans Agenda :

- la recherche instantanée et les filtres de type sont combinables et réinitialisables ;
- tous les événements de la journée défilent naturellement, sans action `Voir plus` ;

- sélectionner une date met à jour la liste située sous le calendrier sans changer d’écran ;
- les événements sont indiqués dans le calendrier par leurs couleurs ;
- si la date sélectionnée ne contient aucun événement, afficher `Aucun événement ce jour` et rappeler la date dans le texte secondaire ; le FAB reste le point d’entrée de création ;
- si la journée contient trop d’événements, `X autres · Voir plus` ouvre la liste complète du jour ;
- le FAB ouvre le menu global de création.

## 4. Menu global de création

| Option | Destination | Premium |
| --- | --- | --- |
| Événement | Choix création guidée ou IA | IA uniquement |
| Animal | Wizard Animal | Non |
| Objectif | Wizard Objectif | Non |
| Note | Choix note texte ou vocale | Voix uniquement |
| Contact | Wizard Contact | Non |
| Souhait | Wizard Souhait | Non |
| Groupe, depuis le module Groupes | Wizard Groupe | Oui |

Le menu est une bottom sheet enrichie, avec descriptions courtes et icônes sémantiques. Il ne doit pas devenir une grille vide ou un menu de boutons `+` génériques.

Chaque destination de création ou de modification s’ouvre au-dessus du contexte courant dans la bottom sheet de formulaire partagée. Les étapes suivantes remplacent le contenu de la même sheet, conservent les valeurs et la progression linéaire, sans afficher la bottom bar. La flèche revient à l’étape précédente ; la poignée ou un glissement vers le bas ferme le parcours. Une confirmation est obligatoire si des données non enregistrées seraient perdues.

## 5. Événements

Création guidée : entrée → type → champs spécifiques au type → animaux → options → vérification/succès.

Création IA : description → analyse → formulaire prérempli à vérifier → animaux/options → création.

Les champs diffèrent selon Soins, Rendez-vous, Balade, Entraînement, Concours, Dépense et Autre. Ne pas réduire tous les types à un formulaire générique.

Détail → `…` → Modifier, Dupliquer/Partager selon maquette, Supprimer. Modifier expose les mêmes informations que créer, préremplies.

## 6. Animaux

Le workspace conserve le sélecteur horizontal. À l’état initial, il montre uniquement les animaux présents, sans titres de groupe. `+ Voir plus`, placé à la fin, révèle ensuite les animaux sortis puis décédés ; `− Voir moins` masque de nouveau l’historique. Le cercle dégradé de sélection est espacé de la photo. Ce comportement est partagé par tous les écrans qui utilisent ce sélecteur.

Dans les formulaires de création ou modification qui proposent une sélection d’animaux, seuls les animaux présents sont visibles initialement. Le même contrôle `+ Voir plus` / `− Voir moins` révèle ou masque l’historique sans perdre les sélections déjà effectuées. Les lignes sélectionnables n’affichent pas de chevron droit : la case, l’anneau de sélection et le libellé suffisent à exprimer l’action.

Tabs internes : Informations, Physique, Santé. Changer de tab ne doit pas recréer l’écran ni perdre l’animal sélectionné. `Physique` regroupe les mesures et l’alimentation. `Santé` présente directement l’historique des soins et rendez-vous médicaux, sans intertitre `À surveiller`, puis les documents médicaux. La Galerie n’est plus une destination du workspace.

Création/modification : Profil → Dates → Identité → Origines → Corps et alimentation → Notes/vérification.

Actions : Modifier, signaler un départ, signaler un décès, supprimer. Le départ et le décès conservent l’historique selon la règle métier et demandent une date.

`Dernières mesures` affiche les dernières valeurs renseignées et leur date, jamais une moyenne.

Dans l’onglet Physique, `Ajouter une mesure` ouvre la Form Sheet partagée au-dessus du workspace courant. L’utilisateur choisit Poids ou Taille, renseigne une date et une valeur ; l’unité est déduite du type (`kg` ou `cm`). Après succès, la sheet se ferme, `Dernières mesures` est rafraîchi et une confirmation discrète est affichée. Un tap sur la carte Poids ou Taille ouvre son historique daté. Une entrée d’historique peut être modifiée ou supprimée, avec confirmation avant suppression. La saisie et l’historique brut restent accessibles gratuitement ; l’analyse statistique demeure Premium.

## 7. Objectifs et Statistiques

Objectifs : liste → détail → menu `…` → modifier, mettre à jour, dupliquer, supprimer. Les cartes affichent une seule fois les animaux liés et conservent la date de fin.

Statistiques : accès depuis Suivi. Périodes Jour, Mois, 1 an et 5 ans. Les graphiques utilisent les composants Chart et des tooltips accessibles.

Pour un compte gratuit, l’accès Statistiques ouvre `Premium Required — Statistiques` puis le comparatif.

## 8. Notes et Souhaits

Notes : liste → détail → menu d’actions → modifier/partager/supprimer.

Le `+` de Notes ouvre un choix :

- écrire une note ;
- enregistrer une note vocale, si Premium.

Voix : autorisation micro → enregistrement → traitement → vérification du texte → création. L’utilisateur doit pouvoir annuler et corriger la transcription.

Souhait : liste → détail → menu d’actions. Création/modification en trois étapes : Informations → Options → Vérification. Prix, lien et destinataire sont optionnels. Aucune bottom bar dans ce wizard.

La liste Souhaits utilise une grille décalée à deux colonnes dont les cartes s’adaptent au contenu sans troncature. Les états vides de Contacts, Groupes, Notes et Souhaits ne dupliquent pas l’action du FAB.

Le menu global du FAB suit toujours cet ordre : Événement, Animal, Objectif, Note, Contact, Groupe, Souhait. Groupe conserve son contrôle Premium et Souhait utilise l’icône cœur.

## 9. Contacts et Groupes

Contact : liste → détail → `…` → modifier/supprimer. Création/modification en trois étapes : Identité → Coordonnées → Vérification. Aucune bottom bar dans ce wizard.

Groupes est Premium. Pour un compte gratuit, ouvrir l’explication Premium avant toute liste ou création.

Compte Premium : liste → détail Animaux/Membres. Actions : modifier le groupe, gérer un membre, ajouter/retirer un animal partagé, invitation et suppression. Création/modification en quatre étapes : Informations → Membres → Animaux → Vérification.

## 10. Notifications et Réglages

Cloche → liste. Une invitation ouvre ses actions Accepter/Refuser. Les autres notifications ouvrent l’entité associée lorsqu’elle existe.

Un compte Gratuit peut accepter ou refuser une invitation, rejoindre un groupe et consulter les groupes dont il fait partie. La création d’un groupe et les actions d’ajout de membres ou d’animaux restent Premium et ouvrent le parcours contextualisé.

Avatar/Plus → Réglages : Profil, Apparence, Notifications, Sécurité, Données et confidentialité, Abonnement et support.

`Données et confidentialité` expose uniquement l’action de suppression du compte prévue par la maquette. Abonnement ouvre l’overview avec le type d’offre visible puis le comparatif.

## 11. Overlays et retours

- Tap sur scrim ou geste descendant : fermer uniquement si l’action n’est pas sensible et si aucune donnée non sauvegardée ne serait perdue.
- Bouton Annuler : ferme sans mutation.
- Confirmation destructive : reste ouverte pendant la mutation, affiche loading local, puis succès/erreur.
- Android Back et geste iOS doivent reproduire la flèche retour.
- Un retour depuis une liste filtrée restaure filtre, scroll et sélection quand raisonnable.
