# Vasco Mobile — Instructions impératives pour les agents

Ce dépôt implémente l’application mobile **Vasco**. Le front existant est un inventaire fonctionnel et technique. Il ne constitue pas une référence visuelle à reproduire.

## Ordre des sources de vérité

En cas de conflit, respecter cet ordre :

1. Les maquettes validées dans le fichier Figma Vasco.
2. `docs/design-handoff.md` et `docs/navigation-and-interactions.md`.
3. `docs/mobile-implementation-standards.md`.
4. Les instructions dans `.github/instructions/`.
5. Le code existant, uniquement pour connaître les fonctionnalités, les données et les contraintes backend.

Figma : https://www.figma.com/design/y3EnZKYhqQju194UkyLoO7/Untitled

Ne jamais modifier volontairement l’UX, la hiérarchie, les composants, les interactions ou les thèmes des maquettes sans décision produit explicite.

## Avant toute implémentation d’écran

L’agent doit :

1. Identifier l’écran source Light dans Figma.
2. Vérifier sa variante Dark.
3. Vérifier l’éventuelle variante Glass et son fallback Solid.
4. Lire le parcours correspondant dans `docs/navigation-and-interactions.md`.
5. Identifier tous les états : défaut, chargement, vide, erreur, succès, verrou Premium et confirmation.
6. Réutiliser les composants de `shared/components/ui` et les tokens du thème.
7. Vérifier le prototype Figma pour les destinations, retours et overlays.

Une capture isolée ne suffit pas : un écran doit être compris dans son parcours complet.

## Règles non négociables

- Utiliser le nom visible **Vasco**. Ne pas réintroduire MyDailyBook dans l’interface.
- Respecter les maquettes Light, Dark, Glass et fallback Solid.
- Ne pas afficher la bottom bar dans les parcours guidés de création ou modification.
- Présenter toute création ou modification d’entité dans une bottom sheet de formulaire, refermable par glissement vers le bas. Si le formulaire est modifié, demander confirmation avant de perdre les valeurs.
- Une étape de formulaire correspond à une intention, avec un CTA principal long.
- Conserver les valeurs lorsqu’un utilisateur revient à l’étape précédente.
- Les actions d’entité utilisent le menu `…`, un scrim et une bottom sheet.
- Les bottom sheets touchant le bas de l’écran ont des coins inférieurs droits.
- Les icônes doivent être sémantiques, centrées optiquement et accompagnées d’un label accessible.
- Ne pas utiliser `position: 'absolute'` pour construire la structure d’un écran ou d’un formulaire.
- Ne pas coder de couleur, spacing, radius, typographie, ombre ou blur récurrent en valeur brute.
- Ne pas créer une seconde implémentation d’un flux déjà existant.
- Ne pas masquer une fonctionnalité Premium : la laisser visible, l’identifier et expliquer comment y accéder.
- Ne jamais déclencher une mutation sensible sans confirmation explicite.

## Fonctionnalités Premium

Les fonctionnalités suivantes nécessitent un abonnement Premium :

- statistiques ;
- groupes ;
- création assistée par IA ;
- notes vocales.

Pour un compte gratuit, utiliser le composant et le parcours Premium documentés. Une action verrouillée ouvre une explication contextualisée puis le comparatif Gratuit/Premium. Elle ne doit être ni inactive sans explication, ni supprimée de l’interface.

## Critère de livraison

Une tâche UI n’est terminée que si :

- l’écran correspond visuellement aux maquettes ;
- les interactions entrantes et sortantes fonctionnent ;
- Light et Dark sont vérifiés ;
- Glass possède un fallback ;
- les états async et Premium sont couverts ;
- VoiceOver/TalkBack, tailles tactiles et contrastes sont vérifiés ;
- les tests du parcours critique existent.
