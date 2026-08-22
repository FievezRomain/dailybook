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

- la recherche instantanée, les filtres de type et la sélection multiple d’animaux sont combinables et réinitialisables ; sélectionner une nouvelle date retire les filtres de type et d’animaux, sans effacer la recherche saisie sur la page ;
- tous les événements de la journée défilent naturellement, sans action `Voir plus` ;

- sélectionner une date met à jour la liste située sous le calendrier sans changer d’écran ;
- dans les sélecteurs de date des formulaires, toucher l’intitulé du mois et de l’année ouvre un accès direct au choix du mois et de l’année ;
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

Création guidée : entrée → type → champs spécifiques au type → animaux → options → mutation → retour Agenda. Aucun écran de succès intermédiaire ne demande de choisir une destination ou de créer une seconde entité.

Création IA : description → analyse → formulaire prérempli à vérifier → animaux/options → création.

Les champs diffèrent selon Soins, Rendez-vous, Balade, Entraînement, Concours, Dépense et Autre. Ne pas réduire tous les types à un formulaire générique.

Soins et Rendez-vous acceptent des documents PDF ou image à la fin de l’étape Détails pendant la création et la modification. Les nouveaux fichiers sont envoyés après l’enregistrement de l’événement puis apparaissent dans Santé > Documents médicaux pour les animaux associés. Les documents existants peuvent être conservés ou retirés depuis le même formulaire. Juste avant les documents, un interrupteur permet de choisir si l’événement apparaît dans le dossier médical ; il est activé par défaut.

Détail → `…` → Modifier, Dupliquer/Partager selon maquette, Supprimer. Modifier expose les mêmes informations que créer, préremplies.

Le détail Événement intègre le menu `…` dans la Top Bar. Son résumé affiche le type, l’état, la date et les animaux avec des avatars lisibles. Le suivi rapide affiche uniquement les champs proposés par le formulaire du type concerné, complétés par l’état et le compte rendu. Il utilise exactement deux cartes par ligne, puis la pleine largeur lorsqu’un élément reste seul. Une action Modifier unique ouvre une seule Form Sheet regroupant tous les champs rapides applicables. Les autres valeurs renseignées sont présentées en grille à deux colonnes lorsque leur longueur le permet afin d’exploiter la largeur de l’écran et de limiter le défilement.

## 6. Animaux

Le workspace conserve le sélecteur horizontal. À l’état initial, il montre uniquement les animaux présents, sans titres de groupe. `+ Voir plus`, placé à la fin, révèle ensuite les animaux sortis puis décédés ; `− Voir moins` masque de nouveau l’historique. Le cercle dégradé de sélection est espacé de la photo. Ce comportement est partagé par tous les écrans qui utilisent ce sélecteur.

Dans les formulaires de création ou modification qui proposent une sélection d’animaux, seuls les animaux présents sont visibles initialement. Le même contrôle `+ Voir plus` / `− Voir moins` révèle ou masque l’historique sans perdre les sélections déjà effectuées. Les lignes sélectionnables n’affichent pas de chevron droit : la case, l’anneau de sélection et le libellé suffisent à exprimer l’action.

Tabs internes : Informations, Physique, Santé. Changer de tab ne doit pas recréer l’écran ni perdre l’animal sélectionné. `Physique` regroupe les mesures et l’alimentation. `Santé` présente directement l’historique des soins et rendez-vous médicaux, sans intertitre `À surveiller`, puis les documents médicaux. La Galerie n’est plus une destination du workspace.

Création/modification : Profil → Dates → Identité → Origines → Corps et alimentation → Notes/vérification. La date de naissance accepte une saisie `JJ/MM/AAAA`, refuse les dates futures et reste accessible via le calendrier ; toute date optionnelle peut être effacée.

Actions : Modifier, signaler un départ, signaler un décès, supprimer. Le départ et le décès conservent l’historique selon la règle métier et demandent une date.

`Dernières mesures` affiche les dernières valeurs renseignées et leur date, jamais une moyenne.

Dans l’onglet Physique, `Ajouter une mesure` ouvre la Form Sheet partagée au-dessus du workspace courant. L’utilisateur choisit Poids ou Taille, renseigne une date et une valeur ; l’unité est déduite du type (`kg` ou `cm`). Après succès, la sheet se ferme, `Dernières mesures` est rafraîchi et une confirmation discrète est affichée. Un tap sur la carte Poids ou Taille ouvre son historique daté. Une entrée d’historique peut être modifiée ou supprimée, avec confirmation avant suppression. La saisie et l’historique brut restent accessibles gratuitement ; l’analyse statistique demeure Premium.

## 7. Objectifs et Statistiques

Objectifs : liste → détail → menu `…` → modifier, mettre à jour, dupliquer, supprimer. Le formulaire sépare Définition du cap → Animaux → Étapes → Vérification. Au moins une étape renseignée est obligatoire pour créer l’objectif. Les cartes affichent une seule fois les animaux liés et conservent la date de fin.

Statistiques : accès depuis Suivi. Périodes Mois, Année et 5 ans. Les graphiques utilisent les composants Chart et des tooltips accessibles. Toute courbe de détail affiche une abscisse temporelle et une ordonnée chiffrée ; une série réduite à une valeur affiche tout de même son point. Une heatmap mensuelle contient exactement une case par jour du mois sélectionné, les jours de la semaine en colonnes et une ligne par semaine. Une heatmap annuelle contient une case par jour de l’année sélectionnée, soit 365 ou 366 cases. La vue 5 ans conserve une agrégation mensuelle.

Lorsqu’un animal sélectionné est accessible via un groupe et que l’utilisateur n’en est pas propriétaire, les statistiques issues des événements agrègent uniquement les événements créés par cet utilisateur ou explicitement partagés avec lui via un groupe actif. Un bandeau informatif visible sur l’aperçu et le détail précise que les données peuvent être partielles.

Pour un compte gratuit, l’accès Statistiques ouvre `Premium Required — Statistiques` puis le comparatif.

## 8. Notes et Souhaits

Notes : liste → détail → menu d’actions → modifier/partager/supprimer.

Le `+` de Notes ouvre une première étape de formulaire cohérente avec celle des événements, puis propose :

- écrire une note ;
- enregistrer une note vocale, si Premium.

Voix : autorisation micro → enregistrement → traitement → vérification du texte → création. L’utilisateur doit pouvoir annuler et corriger la transcription.

Souhait : liste → détail → menu d’actions. Création/modification en trois étapes : Informations → Options → Vérification. Prix, lien et destinataire sont optionnels. Aucune bottom bar dans ce wizard.

La liste Souhaits utilise une grille décalée à deux colonnes dont les cartes s’adaptent au contenu sans troncature. Les états vides de Contacts, Groupes, Notes et Souhaits ne dupliquent pas l’action du FAB.

Le menu global du FAB suit toujours cet ordre : Événement, Animal, Objectif, Note, Contact, Souhait, Groupe. Groupe conserve son contrôle Premium et apparaît en dernier ; Souhait utilise l’icône cœur.

## 9. Contacts et Groupes

Contact : liste → détail → `…` → modifier/supprimer. Création/modification en trois étapes : Identité → Coordonnées → Vérification. Aucune bottom bar dans ce wizard.

Groupes est Premium. Pour un compte gratuit, ouvrir l’explication Premium avant toute liste ou création.

Un membre déjà accepté dans un groupe actif peut continuer à partager un événement avec ce groupe même si son propre compte est Gratuit. Un groupe est proposé dans le formulaire Événement uniquement si tous les animaux associés à l’événement y sont partagés avec le statut `accepted`.

Lorsqu’un événement est déjà partagé avec plusieurs groupes, son étape Animaux propose uniquement les animaux acceptés dans tous ces groupes. Cela inclut un animal accessible via l’un de ces groupes lorsque tous les groupes destinataires y ont accès. Son pictogramme de provenance reste affiché. Cette association à un événement ne donne pas le droit de proposer l’animal à un nouveau groupe.

Si cette règle réduit la liste pendant une modification, un message informatif précise que seuls les animaux liés à tous les groupes avec lesquels l’événement est partagé sont affichés.

L’activité d’un groupe dépend de l’abonnement de son gestionnaire. Si le gestionnaire ne possède plus d’abonnement Premium actif, le groupe devient indisponible pour tous ses membres : il disparaît des listes et sélecteurs, ne donne plus accès aux événements partagés et ne peut plus recevoir de nouveaux partages. Les données ne sont pas supprimées ; elles redeviennent accessibles si le droit Premium du gestionnaire est rétabli.

Compte Premium : liste → détail Animaux/Membres. Actions : modifier le groupe, gérer un membre, ajouter/retirer un animal partagé, invitation et suppression. Création/modification en quatre étapes : Informations → Membres → Animaux → Vérification.

## 10. Notifications et Réglages

Cloche → liste. La cloche devient pleine et porte le nombre de notifications non lues ; ce même nombre est synchronisé avec le badge de l’icône native. Les invitations de membres et les propositions d’animaux en attente présentent les actions Accepter/Refuser. Les autres notifications ouvrent l’entité associée lorsqu’elle existe. Un appui sur une notification push ouvre l’application directement sur cette liste.

Une invitation de membre crée toujours une notification dans Vasco pour un compte existant et déclenche un push seulement si la permission système et un token Expo valide sont disponibles. Sans compte Vasco correspondant, l’invitation est envoyée par email. La proposition d’un animal par un non-gestionnaire notifie selon les mêmes conditions le gestionnaire, qui doit la valider avant que le partage soit accepté.

Un compte Gratuit peut accepter ou refuser une invitation, rejoindre et consulter un groupe actif, puis proposer au partage ses propres animaux. La création d’un groupe et l’ajout de membres restent Premium et ouvrent le parcours contextualisé. Proposer un animal ne dépend pas de l’abonnement du membre ; le backend vérifie son appartenance au groupe actif et la propriété directe de chaque animal proposé.

Avatar/Plus → Réglages : Profil, Apparence, Notifications, Sécurité, Données et confidentialité, Abonnement et support.

`Données et confidentialité` expose uniquement l’action de suppression du compte prévue par la maquette. Abonnement ouvre l’overview avec le type d’offre visible puis le comparatif.

## 11. Overlays et retours

- Tap sur scrim ou geste descendant : fermer uniquement si l’action n’est pas sensible et si aucune donnée non sauvegardée ne serait perdue.
- Bouton Annuler : ferme sans mutation.
- Confirmation destructive : reste ouverte pendant la mutation, affiche loading local, puis succès/erreur.
- Android Back et geste iOS doivent reproduire la flèche retour.
- Un retour depuis une liste filtrée restaure filtre, scroll et sélection quand raisonnable.
