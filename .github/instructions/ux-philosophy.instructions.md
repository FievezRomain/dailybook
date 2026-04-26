---
applyTo: "**/*.tsx,features/**,navigation/**"
---

# MyDailyBook — UX Philosophy (Mobile)

## Identité de l'expérience

MyDailyBook est à la fois un **carnet de vie intime** et un **outil professionnel sobre**. L'expérience doit évoquer :
- La **douceur du monde équestre** : matières chaudes, lumière naturelle, nature
- La **confiance d'un outil fiable** : rapide, lisible, jamais surprenant
- Le **plaisir de la trace** : chaque saisie doit sembler légère et valorisante

---

## Règle fondamentale : 1 écran = 1 question = 1 CTA

Chaque écran ne pose qu'une seule question à l'utilisateur et n'a qu'une seule action principale.

```tsx
// ✅ Correct — focus unique
<Screen>
  <HeroPhoto animal={animal} />
  <AnimalName>{animal.name}</AnimalName>
  <PrimaryButton onPress={addNote}>Ajouter une observation</PrimaryButton>
</Screen>

// ❌ Interdit — surcharge cognitive
<Screen>
  <AnimalCard />
  <QuickStats />
  <RecentNotesList />
  <UpcomingEventsList />
  <FloatingActionMenu items={[...8 actions]} />
</Screen>
```

---

## Ce que Copilot ne doit JAMAIS concevoir

| Interdit | Alternative |
|----------|------------|
| Formulaires à plus de 4 champs visibles simultanément | Formulaires multi-étapes avec progression |
| Messages d'erreur techniques (`Error 422`, stack traces) | Messages humains : "Quelque chose ne s'est pas passé comme prévu 🐴" |
| Modales bloquantes avec 3+ boutons | Bottom Sheet avec 1-2 actions claires |
| Tableaux de données brutes | Cards contextuelles avec données highlighted |
| Navigation avec plus de 5 items dans la tab bar | Tab bar 4 items + "Plus" si nécessaire |
| Loading spinners sans contexte | Skeleton screens avec forme approximative du contenu |
| Boutons `Annuler` / `Confirmer` sans contexte | Labels d'action : "Supprimer Éclair" / "Garder Éclair" |
| Alertes système natives (`Alert.alert`) pour du feedback | Toast / Snackbar avec haptic |
| Polices < 14sp sur mobile | 14sp minimum, 16sp recommandé pour le corps |
| Couleurs uniquement pour transmettre une information | Toujours doubler avec une icône ou un texte |

---

## Photo héros — Règle d'or

Chaque profil animal a une **photo héros plein-format** en haut de son écran de détail.
- Hauteur recommandée : 40% de l'écran
- Dégradé bas-en-haut depuis `rgba(0,0,0,0.6)` pour la lisibilité du nom
- Fallback : placeholder illustré (silhouette cheval, palette isabelle/alezan)
- Pas de texte sur la photo sans le dégradé de protection

```tsx
// ✅ Pattern photo héros
<ImageBackground source={{ uri: animal.photoUrl }} style={styles.hero}>
  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.gradient}>
    <Text style={styles.heroName}>{animal.name}</Text>
  </LinearGradient>
</ImageBackground>
```

---

## Onboarding — Composant Maison

L'onboarding mobile utilise un **composant maison** basé sur Reanimated 4 + `expo-blur`.
**Aucune librairie externe** (react-native-spotlight-tour ou similaires).

### Structure
```
features/onboarding/
├── components/
│   ├── OnboardingSpotlight.tsx   — spotlight + BlurView overlay
│   ├── OnboardingTooltip.tsx     — bulle de conseil animée
│   └── OnboardingStep.tsx        — étape avec progression
├── hooks/
│   └── useOnboarding.ts          — état, flag SecureStore, navigation entre étapes
└── types.ts
```

### Comportement
- **Flag de stockage** : `SecureStore.setItemAsync('onboarding_completed', 'true')`
- 4 étapes interactives maximum (pas de scroll infini)
- Skip disponible à tout moment (haut droite)
- Chaque étape highlight un seul élément UI via `measure()` + overlay avec trou
- Réactivable depuis les Settings : `SecureStore.deleteItemAsync('onboarding_completed')`

```typescript
// features/onboarding/hooks/useOnboarding.ts
export function useOnboarding() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('onboarding_completed').then(val => {
      if (!val) setIsVisible(true);
    });
  }, []);

  const complete = useCallback(async () => {
    await SecureStore.setItemAsync('onboarding_completed', 'true');
    setIsVisible(false);
  }, []);

  return { isVisible, complete };
}
```

### Animation du spotlight
- Entrée : `withSpring` (stiffness 150, damping 20)
- Transition entre étapes : `withTiming` 300ms ease-in-out
- Sortie : `withTiming` 200ms + `runOnJS(onComplete)()`

---

## Haptics — Retour physique systématique

Utiliser `expo-haptics` pour renforcer les interactions clés :

```typescript
import * as Haptics from 'expo-haptics';

// Confirmation d'action (note sauvegardée, animal ajouté)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Sélection dans une liste, tap sur un item
Haptics.selectionAsync();

// Erreur de validation
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// Long press, drag & drop
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
```

- Toujours wrapper dans un `try/catch` silencieux (certains appareils/simulateurs ne supportent pas)
- Ne pas ajouter de haptic sur les navigations ou les modales

---

## Optimistic UI — Règle

Pour toutes les mutations (création, mise à jour, suppression) :
- Mettre à jour le cache React Query **immédiatement** avant la réponse serveur
- Rollback automatique si la mutation échoue
- Afficher un indicateur subtil (couleur atténuée, opacité 0.6) pendant la synchronisation

```typescript
// hooks/queries/useNotesMutations.ts
const createNote = useMutation({
  mutationFn: NoteService.create,
  onMutate: async (newNote) => {
    await queryClient.cancelQueries({ queryKey: ['notes'] });
    const previous = queryClient.getQueryData(['notes']);
    queryClient.setQueryData(['notes'], (old) => [{ ...newNote, id: 'temp', syncing: true }, ...old]);
    return { previous };
  },
  onError: (_, __, context) => {
    queryClient.setQueryData(['notes'], context.previous);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
  onSuccess: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  },
});
```

---

## Design Émotionnel — Nature & Bien-être

### Palette de référence (tokens)
- Baie `#956540` — action principale, liens, boutons CTA
- Alezan `#CE9871` — surface secondaire, cartes, tags
- Isabelle `#C9B69F` — fond léger, zones de repos visuel
- Baie-cerise `#B07161` — hover, états actifs
- Palomino `#F6E6CE` — fond très clair, mode jour

### Règles visuelles
- **Zéro couleur froide pure** (bleu cobalt, vert vif, rouge sang) sans justification produit
- Les surfaces **respirent** : `padding` généreux (minimum 16px), espaces blancs assumés
- Les **animations** imitent la nature : spring physics (`withSpring`), pas de linear
- Préférer les **arrondis prononcés** : `borderRadius: 16` pour les cards, `24` pour les modales
- **Glassmorphism** sur les overlays uniquement : `expo-blur` + `backgroundColor: rgba(white, 0.15)`

### Micro-copie — Ton chaleureux

| Situation | ❌ Interdit | ✅ Recommandé |
|-----------|------------|--------------|
| Note sauvegardée | "Enregistré" | "Observation ajoutée ✓" |
| Champ vide | "Ce champ est requis" | "Le nom de votre cheval ?" |
| Erreur réseau | "Network error 503" | "Impossible de rejoindre le serveur. On réessaie ?" |
| Aucun animal | "Aucun résultat" | "Votre premier cheval vous attend 🐴" |
| Suppression | "Êtes-vous sûr ?" | "Supprimer Éclair définitivement ?" |
| Quota atteint (free) | "Plan limit reached" | "Vous avez atteint la limite du plan gratuit. Voir les offres →" |
| Note créée (optimistic) | (spinner) | Ajout instantané, petit badge "•" syncing |
| Photo uploadée | "Upload success" | "Belle photo ! 📸" |
| Connexion rétablie | "Online" | "De retour en ligne ✓" |
| Chargement initial | (blanc) | Skeleton animé en tons isabelle |
| Objectif atteint | "Goal completed" | "Objectif atteint ! Bravo 🏆" |
| Session expirée | "401 Unauthorized" | "Votre session a expiré. Reconnectez-vous" |
| Partage | "Share" | "Partager le profil d'Éclair" |
| Ajout contact | "Add" | "Inviter à suivre Éclair" |
| Profil incomplet | "Complete profile" | "Ajoutez une photo pour personnaliser le profil" |
| Calendrier vide | "No events" | "Aucun événement prévu. Planifiez une sortie ?" |
| Export réussi | "Done" | "Fichier prêt à partager" |
| Dark mode activé | "Dark mode on" | (changement silencieux, pas de toast) |
| Biométrie activée | "Enabled" | "Connexion rapide activée ✓" |
| Rappel créé | "Reminder set" | "Je vous rappelle le {date} 🔔" |

---

## Anti-patterns UX stricts

- `ActivityIndicator` en plein écran sans skeleton → NON (except premier boot)
- Scroll horizontal caché sans indicateur visuel → NON
- Bouton "Retour" dans une modale bottom sheet → NON (swipe down suffit)
- Texte d'action générique ("OK", "Valider", "Envoyer") → NON (toujours contextuel)
- Formulaire qui réinitialise à la navigation retour → NON (persister avec `useRef` ou Zustand)
- Notifications push sans opt-in explicite et justifié → NON
- Accès caméra/micro sans explication préalable dans l'UI → NON (avant le prompt système)
