---
applyTo: "**/*.tsx,features/**,theme/**"
---

# Design System & UI/UX — Mobile MyDailyBook

## Charte graphique — Palette équestre
La charte est basée sur les robes de chevaux. Tonalités chaudes, naturelles, terrestres.

```
Palette brute (ne pas utiliser directement dans les composants)
  baie         #956540   ← brun-roux, couleur primaire
  alezan       #CE9871   ← cuivré clair, accent chaud
  isabelle     #C9B69F   ← beige doré, surfaces
  aubere       #BAA89B   ← gris rosé, neutres
  rouan        #D3CCC9   ← gris clair, fonds
  baie-brun    #694233   ← brun foncé, textes forts
  baie-cerise  #B07161   ← rouge-brun, erreurs/destructif
  palomino     #F6E6CE   ← crème, fonds secondaires
```

## Design tokens — `theme/tokens.ts` (source unique de vérité)

```typescript
// theme/tokens.ts

// Niveau 1 — Palette brute
export const palette = {
  baie:        '#956540',
  alezan:      '#CE9871',
  isabelle:    '#C9B69F',
  aubere:      '#BAA89B',
  rouan:       '#D3CCC9',
  baieBrun:    '#694233',
  baieCerise:  '#B07161',
  palomino:    '#F6E6CE',
  white:       '#FFFFFF',
  black:       '#1E1E1E',
  transparent: 'transparent',
} as const;

// Niveau 2 — Tokens sémantiques (SEULS utilisables dans les composants)
export const semantic = {
  // Couleurs
  primary:          palette.baie,
  primaryLight:     palette.alezan,
  primaryDark:      palette.baieBrun,
  surface:          palette.rouan,
  surfaceVariant:   palette.isabelle,
  background:       palette.white,
  backgroundPaper:  palette.palomino,
  textPrimary:      palette.black,
  textSecondary:    palette.aubere,
  error:            palette.baieCerise,
  success:          palette.alezan,

  // Typographie
  fontBody:    'Quicksand-Regular',
  fontMedium:  'Quicksand-Medium',
  fontBold:    'Quicksand-Bold',

  // Spacing (multiple de 4)
  spaceXs:  4,
  spaceSm:  8,
  spaceMd:  16,
  spaceLg:  24,
  spaceXl:  32,
  space2xl: 48,

  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 20,
  radiusFull: 999,

  // Élévations / ombres
  shadowSm: { shadowColor: palette.baieBrun, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  shadowMd: { shadowColor: palette.baieBrun, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
} as const;
```

`theme/lightTheme.ts` et `theme/darkTheme.ts` importent **uniquement** depuis `tokens.ts` pour configurer React Native Paper.

## Règle absolue
**JAMAIS de valeur brute dans les composants ou StyleSheet.**
```typescript
// ❌ Interdit
const styles = StyleSheet.create({ container: { backgroundColor: '#956540', padding: 16 } });

// ✅ Correct
const { colors, spacing } = useAppTheme();
const styles = StyleSheet.create({ container: { backgroundColor: colors.primary, padding: spacing.md } });
```

## Effets visuels modernes

### Glassmorphism (modales, drawers, cartes en overlay)
```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={18} tint="light" style={styles.glassCard}>
  {children}
</BlurView>

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: semantic.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
});
```
Utiliser sur : les modales d'action, les cartes en overlay sur image, les headers de section.

### Neumorphisme léger (cartes, badges, boutons de profil)
```typescript
const styles = StyleSheet.create({
  neuCard: {
    backgroundColor: semantic.backgroundPaper,
    borderRadius: semantic.radiusMd,
    // Ombre claire en haut à gauche
    shadowColor: palette.white,
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    // Combiner avec une ombre sombre en bas à droite via une View imbriquée
  },
});
```
Utiliser avec parcimonie : cartes profil, badges de statut. Jamais sur les éléments interactifs principaux (problème d'accessibilité).

### Micro-animations — react-native-reanimated 4

**Transitions de liste :**
```typescript
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

// Chaque item de la liste
<Animated.View entering={FadeInDown.delay(index * 60).springify()} layout={LinearTransition}>
  <AnimalCard animal={animal} />
</Animated.View>
```

**Boutons — feedback tactile :**
```typescript
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);
const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

const onPressIn = () => { scale.value = withSpring(0.96) };
const onPressOut = () => { scale.value = withSpring(1) };
```

**Transitions d'écran :** utiliser les animations natives React Navigation — ne pas réinventer.

**Apparition d'écran (skeleton → contenu) :**
```typescript
import { FadeIn } from 'react-native-reanimated';

<Animated.View entering={FadeIn.duration(300)}>
  <ScreenContent />
</Animated.View>
```

## Composants UI — bonnes pratiques
- Utiliser les composants React Native Paper en priorité (Button, Card, TextInput, FAB, Chip...)
- Override le style via le système de thème Paper (`theme.colors.primary`) — jamais via style inline
- Bottom sheet via `@gorhom/bottom-sheet` pour tous les formulaires et actions contextuelles
- Les icônes viennent uniquement de `@expo/vector-icons` (MaterialCommunityIcons en priorité pour la cohérence)
- Images distantes : toujours via les URLs signées de l'API, jamais d'URL S3 directe

## Accessibilité minimale
- `accessibilityLabel` sur TOUS les éléments pressables sans texte visible
- `accessibilityRole` sur les boutons, titres, images
- Contraste minimum 4.5:1 entre texte et fond
- Taille tactile minimum 44x44 dp

## Responsive
- Utiliser `Dimensions.get('window')` uniquement si vraiment nécessaire
- Préférer les `flex` et `percentage` pour les layouts
- Tester sur iPhone SE (375px) et iPhone 15 Pro Max (430px) comme extrêmes
