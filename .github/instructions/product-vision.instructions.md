---
applyTo: "**/*.ts,**/*.tsx"
---

# Vision Produit Mobile

## Positionnement

MyDailyBook est un carnet de vie equestre : intime, fiable et utile au quotidien. Il doit servir aussi bien un proprietaire passionne qu'un usage semi-professionnel.

L'app aide a tracer, comprendre et partager :
- les animaux ;
- les evenements et soins ;
- les notes et observations ;
- les objectifs ;
- les contacts ;
- les groupes ;
- les statistiques.

## Principes produit

- Saisie rapide : une action courante doit demander le minimum d'effort.
- Confiance : l'utilisateur sait toujours ce qui est enregistre, en cours ou en erreur.
- Sobriete : l'app doit paraitre premium, pas surchargee.
- Flux unique : une action metier importante a un chemin principal.
- Evolution facile : une feature doit pouvoir etre modifiee sans casser les autres.
- Aide contextuelle : l'IA et les automatismes doivent reduire l'effort sans voler la scene.

## Segments

- Grand public : proprietaires, cavaliers amateurs, famille.
- Semi-pro / pro : enseignants, eleveurs, marchands, gestionnaires d'ecurie.

Les choix UX privilegient la clarte pour le grand public tout en gardant assez de structure pour un usage repete.

## Roles et offres

Documenter uniquement les roles reellement presents dans le token/backend. Ne pas inventer un champ `plan`, `tier` ou `subscription` cote mobile si la source de verite est ailleurs.

Quand un role ou une offre limite une action :
- afficher une explication claire ;
- proposer une action d'upgrade si le produit le permet ;
- ne pas faire passer une limite produit pour une erreur technique.

## Identite visuelle produit

Le produit doit evoquer :
- la chaleur du monde equestre ;
- la precision d'un outil fiable ;
- la douceur d'un carnet personnel ;
- la qualite d'un produit premium.

Les aides IA doivent etre integrees dans cette identite : vocabulaire sobre, icones metier, actions contextuelles, pas d'univers visuel separe.

## Arbitrages

En cas de tension, preferer :
- fiabilite a effet visuel ;
- lisibilite a densite ;
- flux court a exhaustivite immediate ;
- etat debuggable a logique implicite ;
- composant reutilisable a copie locale.

## Mesures de succes

Les implementations doivent favoriser :
- creation rapide d'une note ou d'un evenement ;
- faible taux d'erreur formulaire ;
- absence d'ecran bloque ;
- navigation comprehensible ;
- crash-free sessions eleve ;
- correction facile des bugs grace a des logs et etats clairs.
