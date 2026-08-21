# Standards d’implémentation mobile Vasco

## 1. Architecture

Respecter l’architecture feature-based décrite dans `.github/instructions/architecture.instructions.md`.

- `screens` composent et naviguent ;
- `components` affichent et émettent des événements ;
- hooks de feature orchestrent les formulaires ;
- React Query gère le server state ;
- services API gèrent HTTP et DTO ;
- Zustand gère uniquement l’état global ou persistant approprié.

## 2. Layout : flex et flux naturel

Construire la structure avec Flexbox, Tamagui stacks, `gap`, padding, `flex`, `minWidth`, `maxWidth` et scroll containers.

Interdit pour la structure principale :

- positionner les champs avec `position: 'absolute'` ;
- placer un CTA à une coordonnée fixe ;
- calculer manuellement la hauteur d’un formulaire à partir de l’écran ;
- superposer titre, aide et contenu avec des offsets arbitraires ;
- utiliser des marges négatives pour corriger un composant mal structuré.

`absolute` est admis uniquement pour un overlay réel : scrim, badge, FAB, tooltip, décor non interactif ou élément flottant explicitement montré dans Figma.

Exemple de squelette :

```tsx
<EntityFormSheet
  open={open}
  dirty={formState.isDirty}
  onRequestClose={requestClose}
  confirmDiscard
>
  <DetailHeader title="Créer un contact" onBack={goToPreviousStep} />
  <Progress current={step} total={3} />
  <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <FormSection gap="$md">...</FormSection>
  </KeyboardAwareScrollView>
  <ActionFooter>
    <AppButton fullWidth>Continuer</AppButton>
  </ActionFooter>
</EntityFormSheet>
```

`EntityFormSheet` gère la safe area, le clavier, le scrim, la poignée et le geste de glissement vers le bas. Le footer ne doit pas dépendre d’une bottom bar cachée sous le formulaire. La structure interne reste en flex/auto-layout ; ne pas construire la sheet ou le formulaire avec `position: 'absolute'`.

## 3. Responsive mobile

- Utiliser la largeur disponible, pas une largeur d’iPhone codée en dur.
- Appliquer les safe areas.
- Tester petits écrans, grands écrans, orientation si autorisée et font scale 200 %.
- Les textes passent à la ligne sans chevauchement.
- Une action ne doit pas devenir un bouton sur trois lignes.
- Les listes utilisent virtualization et clés stables.
- Le clavier ne masque ni le champ courant ni le CTA.

## 4. Tokens et composants

Utiliser `theme/tokens.ts`, `theme/tamagui.config.ts`, `useAppTheme` et `shared/components/ui`.

Créer un token lorsque la même valeur visuelle apparaît plusieurs fois. Ne pas utiliser directement la palette primitive dans un écran.

Les variantes visuelles doivent appartenir au composant : `tone`, `size`, `state`, `material`, `selected`, `loading`. Éviter les props vagues comme `customColor`.

## 5. Animations

Les animations expliquent un changement d’état. Elles ne retardent pas l’utilisateur.

| Interaction | Recommandation |
| --- | --- |
| Navigation simple | 220–300 ms, ease-out |
| Bottom sheet | spring doux, vélocité du geste conservée |
| Scrim | fade 150–220 ms |
| Sélection | 150–200 ms, couleur + légère échelle |
| Carte vers détail | transition courte, pas d’effet spectaculaire |
| Snackbar | entrée/sortie 180–250 ms |
| Skeleton | shimmer lent et discret |
| Loader coussinet | remplissage séquentiel, boucle calme d’environ 2 s |
| Enregistrement vocal | pulsation contrôlée, jamais agressive |

Utiliser Reanimated pour les interactions continues et gestes. Utiliser l’animation native la plus simple pour les fades non critiques.

Respecter `Reduce Motion` : supprimer les déplacements/échelles non essentiels et conserver un fade court ou un changement instantané.

Ne pas lancer une animation infinie hors écran. Arrêter timers, audio et animations au blur/unmount.

## 6. Gestes et haptics

- Haptic léger : sélection significative.
- Haptic succès : création ou sauvegarde terminée.
- Haptic erreur : échec bloquant, une seule fois.
- Aucun haptic sur chaque navigation.
- Les gestures possèdent toujours une alternative accessible par bouton.

## 7. Accessibilité

- Zone tactile minimale 44 × 44 dp.
- Contenu courant au moins 14sp, sauf caption justifiée.
- Contraste WCAG AA autant que possible.
- Ne jamais transmettre un état uniquement par couleur.
- `accessibilityLabel`, rôle et état sur toute icône interactive.
- Ordre de focus conforme à l’ordre visuel.
- Les erreurs de champ sont annoncées et liées au champ.
- Après navigation, placer le focus sur le titre pertinent.
- Charts : fournir résumé, valeurs et période sous forme accessible.
- Bottom sheet : piéger le focus, annoncer son titre et restaurer le focus à la fermeture.

## 8. Formulaires

- Schéma de validation partagé avec les types métier.
- Validation inline après blur ou tentative de continuation.
- Ne pas effacer une valeur invalide.
- Prévenir avant de quitter un formulaire modifié si la perte est réelle.
- Autosave uniquement si indiqué ; afficher alors son état.
- Désactiver le double submit.
- Le bouton affiche son loading sans bloquer les champs non concernés.
- Dates et heures respectent locale, fuseau et accessibilité clavier/picker.
- L’application déclare explicitement le français comme langue native supportée afin que les contrôles système, menus d’édition et sélecteurs utilisent la locale française lorsque la plateforme l’autorise. Les menus Copier/Couper/Coller restent rendus par iOS/Android et suivent en dernier ressort la langue configurée pour l’application ou le système.

## 9. Premium et sécurité côté client

Le client améliore l’UX mais ne sécurise pas un droit commercial. Le backend doit vérifier l’entitlement pour les statistiques, groupes, IA et voix.

Centraliser les droits :

```ts
type PremiumFeature = 'statistics' | 'groups' | 'aiCreation' | 'voiceNotes';

const canUse = (feature: PremiumFeature, entitlements: Entitlements) =>
  entitlements.premiumFeatures.includes(feature);
```

Ne pas disperser des comparaisons de chaînes comme `role === 'premium'` dans les écrans. Utiliser un hook/provider unique et testable.

Si le backend refuse un droit expiré, rafraîchir les entitlements et ouvrir le message Premium approprié. Ne pas présenter l’erreur brute.

## 10. Données, erreurs et offline

- React Query pour cache, retry contrôlé et invalidation.
- Optimistic update uniquement avec rollback.
- Une erreur de section ne bloque pas les sections indépendantes.
- Les mutations sensibles ne sont pas rejouées automatiquement sans contrôle.
- Les messages utilisateur ne contiennent ni stack, code HTTP ni détail interne.
- Journaliser route, action et identifiant minimal, jamais les notes privées ou données sensibles complètes.

## 11. Performance

- Virtualiser les longues listes.
- Mémoïser seulement après mesure.
- Redimensionner et compresser les médias avant upload.
- Charger les graphiques lourds à la demande.
- Éviter les rerenders globaux pendant la saisie.
- Précharger raisonnablement l’écran suivant d’un wizard sans lancer sa mutation.
- Tester le fallback Solid sur appareils moins puissants.

## 12. Tests exigés

### Unitaires

- validation de chaque wizard ;
- mapping DTO ↔ modèle ;
- calcul des entitlements ;
- reducers/stores de progression ;
- helpers de thème et fallback Glass.

### Composants

- états Default, Loading, Error et Disabled ;
- Light et Dark ;
- tailles de texte augmentées ;
- labels accessibles ;
- Premium Gate et comparaison.

### Intégration / E2E

- création et modification de chaque entité ;
- retour entre étapes avec valeurs préservées ;
- ouverture FAB → choix → création ;
- actions `…` et confirmations ;
- compte gratuit bloqué proprement sur les quatre fonctionnalités ;
- compte Premium accédant aux quatre fonctionnalités ;
- changement de thème ;
- fermeture/retour des bottom sheets ;
- erreurs réseau et retry.

## 13. Definition of Done UI

- comparaison visuelle avec Figma effectuée ;
- aucune structure en position absolue ;
- aucun hardcode récurrent ;
- aucune bottom bar dans les wizards ;
- interactions entrantes/sortantes vérifiées ;
- états async et Premium couverts ;
- Light/Dark et Glass/Solid validés ;
- accessibilité testée ;
- tests critiques verts ;
- ancienne implémentation concurrente retirée.
