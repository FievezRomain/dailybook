---
applyTo: "**/*.tsx,features/**,theme/**,shared/components/**"
---

# Design System Et Direction UI

## Direction

Vasco doit paraitre moderne, chaleureux et premium. L'interface couvre tous les animaux sans devenir thematique ou decorative : tons naturels, matieres douces, lisibilite et profondeur subtile. Les maquettes Figma Vasco et `docs/design-handoff.md` constituent la reference visuelle.

La modernite vient de la precision :
- glass/blur quand il aide a separer les plans ;
- surfaces legeres ;
- ombres douces ;
- transitions courtes ;
- iconographie metier coherente ;
- feedback tactile discret.

Elle ne vient pas d'effets gratuits, de visuels generiques d'IA, d'emojis decoratifs, de gradients artificiels ou de pictogrammes technologiques hors contexte.

## Stack UI officielle

- Tamagui pour la couche UI cible.
- Tokens maison dans `theme/tokens.ts`.
- Theme Tamagui dans `theme/tamagui.config.ts`.
- Acces theme via `theme/useAppTheme.ts`.
- Composants applicatifs dans `shared/components/ui`.

Tout nouveau composant doit utiliser ces couches au lieu de valeurs brutes.

## Palette historique et semantique

La palette brute vit dans `theme/tokens.ts` et ne doit pas etre utilisee directement dans les composants. Certains noms de primitives sont historiques ; ils ne signifient pas que l'interface doit adopter une direction equestre.

Couleurs de reference :
- baie : brun-roux principal ;
- alezan : accent chaud ;
- isabelle : beige dore ;
- aubere : neutre rose/gris ;
- rouan : fond clair ;
- baieBrun : texte fort ;
- baieCerise : danger/destructif ;
- palomino : fond doux.

Les couleurs froides pures sont reservees aux graphiques ou statuts clairement justifies et doivent passer par des tokens semantiques dedies.

## Tokens

Utiliser les tokens pour :
- couleurs ;
- spacing ;
- radius ;
- typographie ;
- ombres ;
- intensite de blur ;
- overlays ;
- tailles recurrentes.

Exemple attendu :
```tsx
const { colors, tokens } = useAppTheme();

<View
  style={{
    backgroundColor: colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
  }}
/>
```

## Effets modernes autorises

Glass/blur :
- bottom sheets ;
- overlays sur photo ;
- headers flottants ;
- menus contextuels ;
- tab bar.

Conditions :
- contraste lisible ;
- pas sur un contenu dense ;
- pas sur les CTA principaux si cela nuit a l'accessibilite ;
- toujours avec fallback Android si necessaire.

Profondeur :
- ombres faibles et coherentes ;
- elevation utile pour distinguer interaction ou plan ;
- pas d'empilement de cartes dans des cartes.

Animations :
- 150-300 ms pour transitions simples ;
- spring doux pour feedback tactile ;
- pas d'animation qui retarde une action ;
- Reanimated pour les interactions importantes ;
- haptics sur validation, selection, succes ou erreur quand utile.

## Iconographie

Utiliser un set stable, prioritairement `@expo/vector-icons` avec une famille coherente par surface.

Les icones doivent representer l'action ou le domaine :
- calendrier ;
- animal ;
- note ;
- soin ;
- objectif ;
- contact ;
- groupe ;
- document.

Eviter les pictos de technologie, les mascottes, les symboles spectaculaires et les visuels generiques pour les fonctions IA. Une aide IA peut utiliser une icone sobre comme `edit` ou `text-search` uniquement si elle reste coherente avec la marque et validee produit ; preferer souvent une action textuelle claire.

## Exceptions admises

Les valeurs brutes sont admises uniquement pour :
- gradients de protection sur photo hero ;
- overlays `rgba` standardises ;
- couleurs de chart passees par tokens de chart ;
- valeurs imposees par une librairie externe ;
- prototypes temporaires marques clairement.

Quand une exception devient recurrente, creer un token.

## Migration

Pour le legacy :
- ne pas tout refondre dans une PR fonctionnelle ;
- ne pas ajouter de nouveau hardcode ;
- convertir les styles proches du code touche ;
- deplacer les patterns reutilisables dans `shared/components/ui`;
- supprimer les alias de couleurs legacy quand plus aucun composant ne les utilise.
