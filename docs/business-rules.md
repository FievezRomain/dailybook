# Règles métier Vasco

Ce document centralise les décisions produit qui doivent rester identiques entre le backend, l’application mobile et le front web. Il complète les maquettes et la documentation UX : il ne définit pas la présentation visuelle.

## Répartition des responsabilités

- Le backend est la source de vérité pour les autorisations, classifications, calculs de dates, projections et règles qui doivent être partagés par plusieurs clients.
- Les fronts consomment les résultats métier typés et choisissent uniquement leur représentation selon leur plateforme et les maquettes validées.
- Une règle métier ne doit pas être dupliquée dans plusieurs composants ou clients. Un calcul local provisoire doit être identifié comme dette de migration et couvert par des tests de contrat.
- Les validations indispensables sont répétées côté backend même lorsqu’un front masque déjà l’action.

## Animaux partagés

- `provenance = "group"` identifie un animal accessible grâce à un groupe.
- Un animal partagé est consultable, mais seul son propriétaire peut le modifier, signaler son départ ou son décès, le supprimer, ou modifier ses mesures, documents et photos.
- Les sélecteurs signalent visuellement et de manière accessible la provenance groupe.

## Groupes, membres et partages d’animaux

- Le rôle de gestionnaire autorise la modification ou la suppression du groupe, la gestion des invitations et le retrait des autres membres ou des animaux partagés.
- Tout membre peut quitter lui-même un groupe à tout moment, même s’il n’est pas gestionnaire et même si son abonnement Premium n’est plus actif. Un utilisateur ne doit jamais dépendre d’un gestionnaire pour mettre fin à sa propre participation.
- Quitter un groupe retire l’accès et l’appartenance du membre ainsi que tous les partages de ses propres animaux dans ce groupe.
- Ce nettoyage est automatique : il retire les liaisons de partage et les associations de ces animaux avec les événements du groupe. Les animaux, carnets et données d’origine restent conservés.
- Le propriétaire d’un animal peut mettre fin au partage de cet animal à tout moment, même s’il n’est pas gestionnaire du groupe et même si son abonnement Premium n’est plus actif.
- Un membre non gestionnaire ne peut pas retirer l’animal d’un autre propriétaire. Le backend vérifie que l’appelant est soit gestionnaire du groupe, soit propriétaire de l’animal ciblé.
- Retirer un animal d’un groupe supprime le partage et ses liaisons avec les événements du groupe, mais ne supprime ni l’animal, ni son carnet, ni ses données d’origine.
- Les invitations de membres et les propositions de partage d’animaux conservent un état `pending` distinct de l’état `accepted`. Les clients ne doivent pas fusionner ces compartiments.
- Les départs de membre et retraits d’animaux sont des mutations sensibles : le client demande une confirmation explicite et le backend applique toujours les contrôles d’autorisation.

## Carnet médical

- L’historique médical contient les événements `soins` et `rdv` associés à l’animal.
- Pour une série récurrente, seule l’occurrence racine (`idparent` absent) est présentée dans ce résumé.
- Les documents médicaux sont les documents attachés à ces événements.

## Notes et format Markdown

- Les nouvelles notes sont stockées au format `markdown`. La syntaxe technique n’est jamais demandée à l’utilisateur : le mobile fournit un éditeur visuel avec une barre de mise en forme.
- Le Markdown autorisé couvre les titres, le gras, l’italique, les listes à puces ou numérotées et les liens utilisant uniquement `http`, `https`, `mailto` ou `tel`.
- Le HTML brut, les scripts, styles, contenus embarqués et images distantes ne sont ni stockés pour les nouvelles notes ni rendus par le client.
- La migration `009_note_markdown.sql` marque les notes préexistantes comme `legacy_html` et sauvegarde leur contenu original dans `model.note_legacy_backup` avant toute conversion.
- La conversion HTML vers Markdown est exécutée au déploiement par le runner de migrations. Une conversion réussie remplace `note` par le Markdown et passe `content_format` à `markdown`.
- Une note dont la conversion échoue reste intacte en `legacy_html` et sera retentée explicitement ; un simple appel de lecture ne déclenche jamais de mutation.
- La table de sauvegarde historique ne peut être supprimée que par une migration ultérieure explicite, après validation de la conversion en production.

## Souhaits

- Un souhait possède exactement deux états métier : `À prévoir` lorsque `acquis = false`, et `Acquis` lorsque `acquis = true`.
- Aucun état d’archivage n’existe dans le contrat actuel. Les clients ne doivent donc afficher ni rubrique ni état `Archivé` sans nouvelle décision produit et évolution backend explicite.

## Fichiers et maîtrise des coûts

- Les photos sont redimensionnées, converties en JPEG et compressées sur l’appareil avant tout transfert ; le backend ne sert pas de relais binaire.
- Les plafonds sont de 500 Ko pour un profil ou un animal, 750 Ko pour un souhait et 1 Mo pour une photo de suivi corporel. Les PDF d’événement sont limités à 3 Mo et les notes vocales à 10 Mo.
- S3 reçoit les fichiers par autorisation signée valable cinq minutes, limitée à une clé générée par le serveur, un type MIME exact et une taille maximale.
- Après transfert, le backend contrôle la taille stockée, le type déclaré et la signature binaire. Tout fichier invalide est supprimé immédiatement.
- Une autorisation d’upload exige l’authentification et l’accès à la ressource cible. L’upload lui-même n’est pas une fonctionnalité Premium.
- Les images affichées utilisent un cache mémoire et disque local. Les URL signées sont mutualisées pendant leur courte durée de validité afin d’éviter les requêtes répétées.

## Suivi visuel

- Le suivi visuel est réservé aux comptes Premium.
- Un animal ne peut recevoir qu’une seule photo de suivi par mois calendaire.
- Le backend garantit cette limite, y compris lors de requêtes concurrentes. Les clients indiquent que la photo du mois est déjà enregistrée et ne proposent un nouvel ajout qu’au mois suivant.

## Événements marquants de l’Agenda

Le backend expose `GET /api/v1/events/highlights?year=AAAA`. Il calcule actuellement :

1. l’anniversaire annuel de chaque animal accessible qui possède une date de naissance et n’a ni date de départ ni date de décès ;
2. le rappel situé exactement un an après un événement dont `rappelnotification = "Annee"`.

Le 29 février est projeté au 28 février lorsque l’année cible n’est pas bissextile.

Le contrat retourne pour chaque élément : un identifiant stable, la date projetée, le type, le libellé, les animaux associés et, pour un rappel annuel, l’identifiant de l’événement source.

Les fronts affichent un indicateur discret sur le calendrier et la liste des événements marquants du jour sélectionné. Ils ne recalculent pas l’éligibilité.

## Évolution d’une règle

Toute nouvelle catégorie d’événement marquant ou modification d’éligibilité doit mettre à jour, dans cet ordre :

1. ce document et la décision produit associée ;
2. le contrat et le calcul backend ;
3. les tests métier backend ;
4. les types et tests de contrat des clients ;
5. la représentation UI propre à chaque client.
