---
applyTo: "**/*.tsx,features/**,navigation/**"
---

# Philosophie UX

## Identite

MyDailyBook est un carnet equestre moderne : doux, fiable, rapide. L'utilisateur doit sentir que l'app respecte son temps et ses donnees.

L'experience doit etre :
- claire : une hierarchie evidente ;
- calme : pas de surcharge visuelle ;
- premium : finitions sobres, glass/blur maitrise, micro-interactions utiles ;
- humaine : messages simples, jamais techniques ;
- debuggable : aucun etat bloque ou opaque.

## Regle de focus

Pour les flux de saisie, viser : une etape = une intention = une action principale.

Cela ne veut pas dire qu'une liste ou un dashboard ne peut avoir qu'un bouton. Cela veut dire :
- un CTA principal evident ;
- des actions secondaires visuellement calmes ;
- pas de menu de 8 actions sans regroupement ;
- pas de formulaire long impose d'un coup ;
- pas de double chemin pour la meme action.

## Listes et dashboards

Les ecrans de consultation peuvent afficher plusieurs informations si la hierarchie est nette :
- resume en haut ;
- contenu principal au centre ;
- actions secondaires dans un menu ou header ;
- empty state actionnable ;
- chargement par section si possible.

Ne jamais bloquer tout un ecran si une section secondaire charge ou echoue.

## Formulaires

- Maximum 3-4 champs visibles par etape pour les flux importants.
- Utiliser des wizards ou bottom sheets quand le formulaire est long.
- Les champs doivent avoir labels clairs, erreurs inline et valeurs preservees au retour.
- Le CTA doit decrire l'action : `Creer l'evenement`, `Enregistrer le soin`, `Inviter le membre`.
- Eviter `OK`, `Valider`, `Envoyer` quand le contexte peut etre plus precis.

## Chargement

- Bootstrap initial : spinner accepte.
- Liste, detail, dashboard : skeleton ou structure visible.
- Mutation : feedback local sur le bouton ou l'item concerne.
- Aucun spinner infini sans retry, message ou echappatoire.

## Feedback

- Succes : discret, court, non intrusif.
- Erreur : humaine, actionnable, sans details techniques.
- Suppression : confirmation claire avec le nom de l'objet si possible.
- Quota/offre : expliquer la limite et proposer la suite, ne pas culpabiliser.
- Haptics : selection, succes, erreur, pas sur chaque navigation.

## IA invisible et utile

Les fonctions IA doivent reduire l'effort :
- pre-remplir un formulaire ;
- reformuler une note ;
- resumer un historique ;
- extraire des informations depuis un texte ;
- suggerer une categorisation.

Elles doivent rester integrees a l'interface metier. Eviter les visuels de technologie, les mascottes, les emojis decoratifs et les labels qui donnent l'impression d'une app generique d'IA. Preferer une microcopie sobre : `Analyser le texte`, `Proposer un resume`, `Pre-remplir`.

## Navigation

- Tab bar : maximum 5 items.
- Les actions rarement utilisees vont dans Plus/Autre ou dans un menu contextuel.
- Le bouton flottant de creation doit mener a un flux clair, pas a une liste confuse de formulaires concurrents.
- Les routes doivent etre previsibles et typees.

## Accessibilite minimale

- Taille tactile minimum 44 dp.
- Texte lisible, pas de police sous 14sp pour du contenu.
- Contraste suffisant, surtout avec blur/glass.
- Toute icone sans texte visible a un `accessibilityLabel`.
- Ne jamais utiliser uniquement la couleur pour transmettre une information.

## Anti-patterns

- Spinner plein ecran pour une section secondaire.
- Modale bloquante avec trop d'actions.
- Menu de creation sans hierarchie.
- Formulaire dense sur mobile.
- Action destructive sans confirmation claire.
- Message technique utilisateur.
- Effet visuel sans role UX.
- Fonction IA presentee comme un produit separe au lieu d'une aide integree.
