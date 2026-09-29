# Règles métier Vasco

Ce document centralise les règles qui doivent rester identiques entre le backend, l’application mobile et le front web. Il complète Figma et la documentation UX sans définir la présentation visuelle.

## Principes transverses

- **En tant qu’équipe produit**, je souhaite que le backend soit la source de vérité des autorisations, dates, projections et règles partagées afin que tous les clients appliquent les mêmes décisions.
- **En tant que client Vasco**, je souhaite consommer des résultats métier typés sans recalculer localement les autorisations afin d’éviter les divergences entre plateformes.
- **En tant qu’utilisateur**, je souhaite que toute mutation soit contrôlée côté backend même si l’action est masquée dans l’interface afin qu’un appel direct ne contourne jamais une règle.
- **En tant qu’utilisateur Gratuit**, je souhaite voir les fonctionnalités Premium avec une explication contextualisée afin de comprendre leur valeur et le moyen d’y accéder.
- **En tant qu’utilisateur**, je souhaite confirmer explicitement toute suppression ou mutation sensible afin d’éviter une perte involontaire.

## Animaux

### Profil et propriété

- **En tant qu’utilisateur**, je souhaite créer un animal afin d’en devenir le propriétaire direct et de centraliser ses informations.
- **En tant que propriétaire**, je souhaite consulter, modifier et supprimer mon animal afin de maintenir son profil à jour.
- **En tant que propriétaire**, je souhaite signaler le départ ou le décès de mon animal afin que sa présence soit représentée correctement sans perdre son historique.
- **En tant que propriétaire**, je souhaite gérer la photo de profil, les mesures, documents et données corporelles de mon animal afin de conserver un suivi complet.
- **En tant que propriétaire**, je souhaite créer, consulter, modifier et supprimer les entrées d’historique de mon animal afin de corriger ou compléter son suivi.
- **En tant qu’utilisateur**, je souhaite que les dates animales soient converties en vraies dates de contrat avant la couche SQL afin que leur enregistrement soit fiable.

### Accès à un animal partagé

- **En tant que membre d’un groupe actif**, je souhaite consulter un animal accepté dans ce groupe afin d’utiliser les informations que son propriétaire partage avec moi.
- **En tant que membre**, je souhaite voir `provenance = "group"` et un indicateur accessible dans les sélecteurs afin d’identifier un animal qui ne m’appartient pas.
- **En tant que membre**, je souhaite consulter la photo de profil d’un animal partagé afin de l’identifier visuellement.
- **En tant que propriétaire**, je souhaite rester le seul à pouvoir modifier, supprimer ou enrichir mon animal partagé afin que le partage ne transfère aucun droit de propriété.
- **En tant que propriétaire**, je souhaite que le backend vérifie l’accès actif et le rattachement du nom de fichier avant de signer une photo privée afin que les médias de mon animal restent protégés.

### Carnet et synthèse médicale

- **En tant que propriétaire ou membre autorisé**, je souhaite consulter dans le dossier médical les événements `soins` et `rdv` dont `todisplay` vaut `true` ou est absent afin d’obtenir un résumé pertinent.
- **En tant qu’auteur d’un soin ou rendez-vous**, je souhaite choisir sa présence dans le dossier médical, avec `true` par défaut, afin de contrôler ce résumé sans masquer l’événement dans l’Agenda ou l’accueil.
- **En tant qu’utilisateur**, je souhaite que seule la racine d’une série récurrente apparaisse dans le résumé médical afin d’éviter les doublons d’occurrences.
- **En tant qu’utilisateur**, je souhaite retrouver dans le dossier médical les documents attachés aux soins et rendez-vous éligibles afin de réunir les pièces utiles.
- **En tant que propriétaire**, je souhaite exporter une « Synthèse du dossier médical » afin de partager un PDF temporaire contenant les données et images médicales disponibles.
- **En tant qu’utilisateur**, je souhaite que l’export identifie chaque image JPEG/PNG avec son événement et conserve commentaires, traitements et spécialistes dans le même encadré afin que le document reste compréhensible.
- **En tant qu’utilisateur**, je souhaite que les PDF joints ne soient pas fusionnés tant que toutes les pièces ne sont pas intégrées afin que le titre « Synthèse » reste honnête.
- **En tant qu’exploitant**, je souhaite limiter un export à 20 images et 30 Mo de sources, puis supprimer les fichiers temporaires sans conserver le PDF sur S3 afin de maîtriser les coûts et les données résiduelles.

### Suivi visuel

- **En tant qu’utilisateur Premium**, je souhaite ajouter une photo de suivi corporel pour le mois courant ou l’un des onze mois précédents afin de visualiser l’évolution de mon animal.
- **En tant qu’utilisateur Premium**, je souhaite enregistrer au maximum une photo par animal et par mois calendaire afin de conserver une chronologie cohérente.
- **En tant qu’utilisateur**, je souhaite que les mois futurs soient refusés et que la limite mensuelle soit garantie en concurrence par le backend afin d’éviter des données impossibles ou dupliquées.
- **En tant que propriétaire Premium**, je souhaite remplacer ou supprimer une photo mensuelle après confirmation afin de corriger mon suivi sans action accidentelle.
- **En tant qu’utilisateur**, je souhaite voir les photos de la plus récente à la plus ancienne afin de lire naturellement l’évolution.
- **En tant que membre Premium**, je souhaite consulter en lecture seule le suivi visuel d’un animal partagé par un groupe actif afin de suivre son évolution sans modifier les données du propriétaire.
- **En tant qu’utilisateur redevenu Gratuit**, je souhaite retrouver l’explication Premium sans chargement des photos afin que les restrictions d’abonnement soient cohérentes.

## Événements

### Création, modification et consultation

- **En tant qu’utilisateur**, je souhaite créer un événement pour un animal possédé ou accessible via un groupe actif afin d’alimenter son agenda.
- **En tant qu’auteur**, je souhaite modifier, dupliquer, partager nativement et supprimer mon événement afin de gérer son cycle de vie.
- **En tant qu’auteur d’une série**, je souhaite choisir explicitement entre cette occurrence, cette occurrence et les suivantes ou toute la série afin de maîtriser la portée d’une modification ou suppression.
- **En tant qu’utilisateur**, je souhaite voir dans le détail toutes les informations métier valorisées que le formulaire du type d’événement permet de saisir afin de ne perdre aucune donnée utile ni afficher un champ étranger à ce type.
- **En tant qu’utilisateur**, je souhaite voir le créateur de chaque nouvel événement et, lorsqu’il est terminé, l’utilisateur qui l’a réalisé afin d’identifier les responsabilités indépendamment du type d’événement.
- **En tant qu’auteur**, je souhaite modifier rapidement la note, le classement, la dépense ou le compte rendu depuis le détail afin de compléter l’événement sans reprendre tout le formulaire.
- **En tant qu’utilisateur**, je souhaite que les identifiants techniques comme `id` et `idparent` restent absents du détail afin de ne voir que des informations compréhensibles.
- **En tant qu’auteur**, je souhaite enregistrer une dépense facultative sur tout type d’événement afin d’associer le coût à son contexte réel.
- **En tant qu’auteur d’un événement Dépense**, je souhaite catégoriser ce montant afin de l’analyser dans les statistiques.
- **En tant qu’auteur d’une balade, d’un entraînement ou d’un concours**, je souhaite attribuer une note entière facultative de 1 à 5 étoiles et pouvoir l’effacer afin d’évaluer l’activité sans valeur obligatoire.

### État, rappels et récurrence

- **En tant qu’auteur**, je souhaite qu’un événement passé soit proposé `completed` et qu’un événement présent ou futur soit proposé `pending` afin d’obtenir un état initial pertinent.
- **En tant qu’auteur**, je souhaite pouvoir remplacer explicitement cet état proposé pendant la création ou la modification afin de conserver le dernier mot.
- **En tant qu’utilisateur**, je souhaite marquer un événement comme terminé ou à faire depuis son détail afin de mettre son suivi à jour rapidement.
- **En tant qu’auteur**, je souhaite définir une répétition pour les types compatibles afin de créer une série sans ressaisie manuelle.
- **En tant qu’auteur**, je souhaite configurer les rappels disponibles afin d’être averti au moment prévu.
- **En tant qu’utilisateur**, je souhaite que le backend calcule les rappels et notifications à partir des données de l’événement afin que les clients ne divergent pas.

### Partage avec des groupes

- **En tant qu’auteur**, je souhaite partager un événement avec un ou plusieurs groupes actifs afin que leurs membres puissent le consulter.
- **En tant qu’auteur**, je souhaite voir uniquement les groupes dans lesquels tous les animaux sélectionnés sont acceptés afin de ne jamais exposer un animal à un groupe qui n’y a pas accès.
- **En tant qu’auteur sélectionnant plusieurs animaux**, je souhaite que les groupes proposés soient l’intersection de leurs groupes communs afin que chaque destinataire accède à l’ensemble de l’événement.
- **En tant que membre**, je souhaite créer et partager au groupe d’origine un événement associé à un animal partagé avec moi afin de contribuer à son suivi sans en devenir propriétaire.
- **En tant qu’auteur modifiant un événement partagé**, je souhaite ne voir que les animaux acceptés dans tous les groupes destinataires et être informé de cette restriction afin de préserver un partage valide.
- **En tant qu’utilisateur**, je souhaite que le backend refuse atomiquement un payload dont un groupe ne contient pas tous les animaux afin qu’aucune mutation partielle ne subsiste.
- **En tant que propriétaire**, je souhaite que l’association d’un animal partagé à un événement n’autorise jamais son repartage vers un autre groupe afin de conserver le contrôle de sa diffusion.

### Documents et événements marquants

- **En tant qu’utilisateur Premium**, je souhaite joindre un PDF, JPEG ou PNG à un soin ou rendez-vous afin d’enrichir le dossier médical.
- **En tant qu’utilisateur Gratuit**, je souhaite voir l’action document avec son explication Premium sans pouvoir obtenir un ticket d’upload ni rattacher le fichier afin que le verrou soit informatif et sécurisé.
- **En tant qu’utilisateur autorisé**, je souhaite ouvrir et supprimer un document seulement après contrôle de mon accès à l’événement afin de protéger les pièces privées.
- **En tant qu’utilisateur**, je souhaite voir dans l’Agenda l’anniversaire annuel d’un animal accessible, présent et doté d’une date de naissance afin de ne pas oublier cette date.
- **En tant qu’utilisateur**, je souhaite voir le rappel situé un an après un événement configuré avec `rappelnotification = "Annee"` afin de retrouver les échéances annuelles.
- **En tant qu’utilisateur**, je souhaite qu’un anniversaire du 29 février soit projeté au 28 février les années non bissextiles afin que l’événement reste visible chaque année.
- **En tant que client Vasco**, je souhaite consommer `GET /api/v1/events/highlights?year=AAAA` sans recalculer l’éligibilité afin de conserver des résultats identiques sur toutes les plateformes.

## Groupes

### Création, activité et gestion

- **En tant qu’utilisateur Premium**, je souhaite créer un groupe dont je deviens gestionnaire afin d’organiser des membres et des animaux partagés.
- **En tant que gestionnaire Premium**, je souhaite renommer ou supprimer mon groupe afin de gérer son cycle de vie.
- **En tant que gestionnaire**, je souhaite gérer les invitations, demandes d’animaux, membres et animaux acceptés afin d’administrer le groupe.
- **En tant que membre**, je souhaite que l’activité du groupe dépende uniquement d’un gestionnaire possédant un abonnement Premium non expiré afin que la règle soit stable pour tous.
- **En tant que membre**, je souhaite qu’un groupe sans gestionnaire Premium actif devienne inaccessible sans suppression de ses données, puis redevienne accessible au renouvellement afin de préserver son historique.

### Invitations et membres

- **En tant que gestionnaire Premium d’un groupe actif**, je souhaite inviter un membre afin de lui proposer de rejoindre le groupe.
- **En tant qu’invité**, je souhaite accepter ou refuser une invitation en attente afin de choisir mon appartenance.
- **En tant qu’invité**, je souhaite qu’aucun accès ne soit accordé avant mon acceptation afin qu’une invitation ne vaille pas consentement.
- **En tant que membre**, je souhaite quitter moi-même un groupe à tout moment, même Gratuit ou non gestionnaire, afin de ne jamais dépendre d’un tiers pour mettre fin à ma participation.
- **En tant que membre sortant**, je souhaite que mon départ retire mon appartenance, mes partages d’animaux et leurs associations aux événements du groupe sans supprimer mes données d’origine afin de nettoyer uniquement les liens de partage.
- **En tant que gestionnaire**, je souhaite retirer un autre membre après confirmation afin de maintenir la composition du groupe.

### Partage d’animaux

- **En tant que membre d’un groupe actif**, je souhaite proposer l’un de mes propres animaux même avec un compte Gratuit afin de participer au groupe tant que son gestionnaire reste Premium.
- **En tant que propriétaire**, je souhaite que les animaux accessibles via un autre groupe soient exclus des nouvelles propositions afin d’empêcher tout repartage indirect.
- **En tant que propriétaire**, je souhaite que le backend valide la propriété de tous les animaux avant de créer le moindre partage afin d’éviter une mutation partielle.
- **En tant que gestionnaire**, je souhaite qu’une proposition que je fais puisse être acceptée selon les règles du groupe et qu’une proposition d’un autre membre reste `pending` jusqu’à ma décision afin de contrôler les nouveaux accès.
- **En tant que propriétaire**, je souhaite retirer mon propre animal du groupe à tout moment, même Gratuit ou non gestionnaire, afin de mettre fin au partage sans dépendre du gestionnaire.
- **En tant que gestionnaire**, je souhaite retirer l’animal d’un autre membre afin d’administrer le contenu du groupe.
- **En tant que membre non gestionnaire**, je souhaite être empêché de retirer l’animal d’un autre propriétaire afin de respecter ses droits.
- **En tant que propriétaire**, je souhaite que le retrait supprime le partage et les associations aux événements du groupe sans supprimer l’animal, son carnet ou ses données d’origine afin de conserver mon historique.
- **En tant qu’utilisateur**, je souhaite que les propositions `pending` et les animaux `accepted` restent dans des compartiments distincts afin de comprendre leur état réel.

### Notifications liées au groupe

- **En tant que gestionnaire**, je souhaite recevoir une notification persistante lorsqu’un membre propose un animal afin de pouvoir accepter ou refuser la demande.
- **En tant que gestionnaire**, je souhaite que cette notification s’intitule « Nouvelle demande d’ajout d’un animal » et mentionne le demandeur, l’animal et le groupe afin d’identifier clairement la demande.
- **En tant qu’utilisateur Vasco invité**, je souhaite recevoir une notification persistante d’invitation afin de pouvoir agir depuis l’application.
- **En tant qu’utilisateur ayant autorisé les notifications et disposant d’un token Expo valide**, je souhaite recevoir également un push afin d’être averti hors de l’application.
- **En tant que personne invitée sans compte Vasco**, je souhaite recevoir un email et retrouver la notification si je crée ensuite un compte avec cette adresse afin de ne pas perdre l’invitation.

## Contacts

- **En tant qu’utilisateur**, je souhaite créer et lister mes contacts avec leur nom, profession, téléphone, email et adresse disponibles afin de retrouver mes interlocuteurs utiles.
- **En tant que propriétaire d’un contact**, je souhaite le modifier ou le supprimer afin de maintenir mon carnet à jour.
- **En tant qu’utilisateur**, je souhaite que chaque lecture et mutation soit filtrée par le propriétaire authentifié afin que connaître l’identifiant d’un contact tiers ne donne aucun accès.

## Objectifs

- **En tant qu’utilisateur**, je souhaite créer, consulter, modifier, dupliquer et supprimer mes objectifs afin de planifier et suivre un résultat attendu.
- **En tant qu’utilisateur**, je souhaite associer un objectif à des animaux possédés ou accessibles via un groupe actif afin de suivre aussi les animaux partagés avec moi.
- **En tant qu’utilisateur**, je souhaite que le backend valide mon accès à tous les animaux avant la création ou modification afin qu’un identifiant étranger ne puisse être associé.
- **En tant qu’utilisateur**, je souhaite renseigner au moins une sous-étape utile afin que mon objectif soit actionnable.
- **En tant qu’utilisateur**, je souhaite que les sous-étapes vides ne soient pas persistées et que les étapes ajoutées, modifiées ou retirées soient synchronisées lors d’une modification afin de conserver exactement mon plan courant.
- **En tant qu’utilisateur**, je souhaite mettre à jour séparément l’état d’une sous-étape de mon propre objectif afin de suivre ma progression rapidement.
- **En tant qu’utilisateur**, je souhaite que la duplication crée un nouvel objectif sans transférer de propriété sur les animaux associés afin de copier la structure uniquement.

## Notes

### Gestion et format

- **En tant qu’utilisateur**, je souhaite créer, lister, consulter, modifier, épingler, partager nativement et supprimer mes propres notes afin de gérer mes informations personnelles.
- **En tant qu’utilisateur**, je souhaite que toutes les lectures et mutations de notes soient limitées à mon compte afin de préserver leur confidentialité.
- **En tant qu’utilisateur**, je souhaite écrire avec un éditeur visuel sans manipuler la syntaxe Markdown afin de mettre en forme facilement titres, emphases, listes et liens.
- **En tant qu’utilisateur**, je souhaite que seuls les liens `http`, `https`, `mailto` et `tel` soient rendus et que HTML brut, scripts, styles, contenus embarqués et images distantes soient refusés afin d’éviter les contenus dangereux.

### Notes vocales et migration

- **En tant qu’utilisateur Premium**, je souhaite téléverser et transcrire une note vocale en brouillon afin de capturer une information sans la saisir.
- **En tant qu’utilisateur Premium**, je souhaite pouvoir annuler le fichier ou corriger le brouillon avant validation afin qu’une transcription ne devienne jamais une note sans mon accord explicite.
- **En tant qu’exploitant**, je souhaite sauvegarder les anciennes notes HTML dans `model.note_legacy_backup` avant conversion afin de conserver leur contenu original.
- **En tant qu’exploitant**, je souhaite qu’une conversion réussie produise du Markdown et qu’une conversion échouée conserve intact le format `legacy_html` sans mutation à la lecture afin de rendre la migration sûre et rejouable.
- **En tant qu’exploitant**, je souhaite supprimer la sauvegarde historique uniquement par une migration explicite validée après production afin d’éviter une perte prématurée.

## Souhaits

- **En tant qu’utilisateur**, je souhaite créer, lister, modifier et supprimer mes souhaits avec nom, lien, prix, destinataire et image afin d’organiser mes envies.
- **En tant qu’utilisateur**, je souhaite marquer un souhait « À prévoir » lorsque `acquis = false` ou « Acquis » lorsque `acquis = true` afin de suivre son acquisition.
- **En tant qu’utilisateur**, je souhaite qu’aucun état « Archivé » ne soit inventé sans évolution explicite du contrat afin que tous les clients partagent les mêmes deux états.
- **En tant que propriétaire**, je souhaite que mon droit soit validé avant le remplacement, retrait ou nettoyage de l’image afin qu’un tiers ne puisse modifier mon souhait.

## Statistiques

- **En tant qu’utilisateur Premium**, je souhaite consulter les statistiques des animaux auxquels j’ai accès afin d’analyser leur suivi.
- **En tant qu’utilisateur**, je souhaite sélectionner exactement un animal pour le poids, la taille et l’alimentation afin de ne pas mélanger des mesures individuelles.
- **En tant qu’utilisateur**, je souhaite agréger plusieurs animaux accessibles pour les statistiques issues des événements afin d’analyser une activité collective.
- **En tant que membre ayant accès à un animal via un groupe sans en être propriétaire**, je souhaite que ses statistiques issues des événements utilisent uniquement les événements que j’ai créés ou qui me sont partagés via un groupe actif afin de ne jamais agréger des informations auxquelles je n’ai pas accès.
- **En tant que membre consultant les statistiques d’un animal partagé dont je ne suis pas propriétaire**, je souhaite être informé du caractère partiel des données afin d’interpréter correctement les résultats.
- **En tant qu’utilisateur**, je souhaite naviguer par mois, année ou période de cinq ans afin d’adapter la profondeur de l’analyse.
- **En tant qu’utilisateur**, je souhaite voir les valeurs d’abscisse et d’ordonnée sur chaque courbe afin d’interpréter les données.
- **En tant qu’utilisateur**, je souhaite voir un point lorsqu’une courbe ne contient qu’une valeur afin que la mesure ne paraisse pas absente sans inventer de tendance.
- **En tant qu’utilisateur**, je souhaite une heatmap mensuelle avec les jours lundi à dimanche en colonnes, une ligne par semaine et exactement une case par date réelle afin de lire le mois comme un calendrier.
- **En tant qu’utilisateur**, je souhaite une heatmap annuelle de 365 ou 366 cases et une vue cinq ans agrégée par mois afin que chaque granularité reste pertinente.

## Notifications et badges

- **En tant qu’utilisateur**, je souhaite retrouver une notification persistante dans Vasco même si aucun push ne peut être envoyé afin que l’information ne dépende pas des permissions système.
- **En tant qu’utilisateur ayant autorisé les pushes**, je souhaite qu’un push soit envoyé uniquement si un token Expo valide est disponible afin d’éviter les tentatives impossibles.
- **En tant qu’utilisateur**, je souhaite qu’un appui sur un push ouvre Vasco sur la liste des notifications afin d’accéder directement au contexte.
- **En tant qu’utilisateur**, je souhaite que le nombre non lu alimente la cloche, son état plein et le badge de l’icône native afin de voir immédiatement les notifications en attente.
- **En tant qu’utilisateur**, je souhaite que lire, accepter, refuser ou tout marquer comme lu resynchronise tous les badges afin qu’ils reflètent toujours l’état réel.

## Fichiers et stockage

- **En tant qu’utilisateur**, je souhaite que mes photos soient redimensionnées, converties en JPEG et compressées sur l’appareil avant transfert afin de réduire la consommation réseau et stockage.
- **En tant qu’exploitant**, je souhaite limiter les profils et animaux à 500 Ko, les souhaits à 750 Ko, le suivi corporel à 1 Mo, les documents d’événement à 3 Mo et les notes vocales à 10 Mo afin de maîtriser les coûts.
- **En tant qu’utilisateur autorisé**, je souhaite recevoir une autorisation S3 signée cinq minutes, limitée à une clé serveur, un type MIME et une taille exacte afin de transférer directement un fichier privé.
- **En tant qu’utilisateur**, je souhaite que le backend contrôle taille, type déclaré et signature binaire après transfert puis supprime immédiatement tout objet invalide afin que le stockage reste sain.
- **En tant qu’utilisateur**, je souhaite que l’upload exige mon authentification et mon accès à la ressource sans constituer à lui seul une fonctionnalité Premium afin de séparer stockage et droit fonctionnel.
- **En tant qu’utilisateur**, je souhaite que les images et URL signées soient mises en cache localement et mutualisées pendant leur validité afin d’éviter les téléchargements répétés.
- **En tant qu’utilisateur**, je souhaite que la nouvelle référence d’une image de profil, d’animal ou de souhait soit enregistrée avant la suppression de l’ancien objet afin qu’un échec ne supprime jamais mon image actuelle.

## Évolution d’une règle

- **En tant qu’équipe produit**, je souhaite documenter toute nouvelle règle ou modification d’éligibilité avant l’implémentation afin de conserver une décision explicite.
- **En tant qu’équipe technique**, je souhaite mettre à jour successivement le contrat et le calcul backend, les tests métier, les types et tests clients, puis la représentation UI afin que la source de vérité se propage dans le bon ordre.
