---
applyTo: "**/*.ts,**/*.tsx"
---

# MyDailyBook — Product Vision (Mobile)

## Positionnement produit

MyDailyBook est un **journal de vie équestre** destiné à deux segments :
- **Grand public** : propriétaires de chevaux, cavaliers amateurs, passionnés, famille
- **Semi-pro / Pro** : moniteurs, éleveurs, marchands de chevaux, gestionnaires d'écurie

L'application permet de **tracer, comprendre et partager** la vie d'un cheval : santé, entraînements, événements vétérinaires, objectifs, observations quotidiennes.

---

## Rôles et RBAC

### Définition des rôles
```
free       — compte gratuit, accès limité (quota notes, 1 animal)
premium    — abonné individuel, accès complet mono-profil
pro        — accès multi-animaux, stats avancées, IA
manager    — gestion d'une structure (écurie, club hippique)
admin      — administration transverse, pas exposé côté UI
```

### Règles d'application côté mobile
- Le token Firebase contient les **custom claims** : `{ internal_id: UUID, roles: string[] }`
- Accéder aux rôles via `useCurrentUser()` qui expose `.roles: string[]`
- Utiliser le helper `hasRole(role: string): boolean` pour le rendu conditionnel
- Ne JAMAIS hard-coder une vérification de rôle en dehors du hook `useCurrentUser`
- Les fonctionnalités verrouillées pour `free` affichent un **prompt d'upgrade** (non une erreur)

```tsx
// ✅ Correct
const { hasRole } = useCurrentUser();
if (!hasRole('premium')) return <UpgradePrompt feature="stats" />;

// ❌ Interdit
if (user.plan !== 'premium') return null;
```

- Ne jamais inventer de champ `plan`, `tier` ou `subscription` — la source de vérité est `roles[]`

---

## Pattern d'identité — Vendor Independence Auth

### Structure du token (custom claims Firebase)
```json
{
  "internal_id": "uuid-v4-stable",
  "roles": ["premium"],
  "email": "user@example.com"
}
```

### Règle absolue
- **`internal_id`** : UUID interne, stable, indépendant du provider — c'est la clé utilisée dans toute la logique applicative
- **`provider_uid`** : UID Firebase — sert uniquement à l'adapter auth, JAMAIS propagé dans les features
- Changer de provider d'authentification = réécrire uniquement `services/auth/AuthService.ts`
- Les appels API incluent le token JWT ; le backend extrait `internal_id` depuis les custom claims

```typescript
// ✅ Utiliser internal_id pour toute logique métier
const { internal_id } = useCurrentUser();
await AnimalService.create({ owner_id: internal_id, ... });

// ❌ Ne jamais utiliser provider_uid (uid Firebase) en dehors de l'auth service
import { getAuth } from 'firebase/auth'; // INTERDIT hors services/auth/
```

---

## Vendor Independence Universelle

**Règle : tout outil externe est encapsulé derrière une interface.**

| Outil externe | Interface (Service) | Implémentation | Fichier |
|--------------|--------------------|--------------------|---------|
| Firebase Auth | `IAuthService` | `FirebaseAuthService` | `services/auth/AuthService.ts` |
| AWS S3 | `IFileStorageService` | `S3FileStorageService` | `services/storage/FileStorageService.ts` |
| OpenAI / Whisper | `IAIService` | `OpenAIService` | `services/ai/AIService.ts` |
| Push notifications | `INotificationService` | `ExpoNotificationService` | `services/notifications/` |

- JAMAIS d'import direct de `firebase/auth`, `@aws-sdk/*`, ou SDK tiers dans les features ou hooks
- La migration d'un outil = remplacer une implémentation, jamais modifier les features

---

## Fonctionnalités IA — Roadmap

### Intégrations planifiées
| Feature | Modèle | Déclencheur |
|---------|--------|-------------|
| Assistant formulaire | GPT-4o mini | Bouton micro / aide contextuelle |
| Transcription notes vocales | Whisper API | Enregistrement audio |
| Détection de race | Vision API (GPT-4o) | Photo cheval lors création |
| Recherche sémantique | pgvector (backend) | Barre de recherche notes |

### Règles d'implémentation IA
- Toute intégration IA passe par `services/ai/AIService.ts` (interface `IAIService`)
- Les appels IA transitent par le BFF backend — JAMAIS d'appel direct à OpenAI depuis mobile
- Afficher un indicateur de chargement adapté (`ActivityIndicator` ou skeleton animé) pendant les appels
- Gérer explicitement les cas d'erreur et de timeout (5s max d'attente avant fallback)
- Les données envoyées à l'IA sont **minimalistes** : pas de PII inutile, anonymisation si possible

---

## Nouvelles Technologies à Surveiller

Être force de proposition sur les évolutions suivantes :

### Déjà en production
- Expo Background Fetch — synchronisation hors-ligne silencieuse
- JSI (JavaScript Interface) — accès natif haute performance pour capteurs

### À surveiller (2026)
- **Expo DOM Components** — composants web dans RN (Expo SDK 54+) : évaluer pour éditeurs rich-text
- **React Native New Architecture** — JSI + Fabric + TurboModules : migrer prop par prop
- **Tamagui v2 stable** — surveiller la release de v2.0.0 (actuellement RC) avant migration
- **Expo EAS Update** — OTA updates ciblées par segment (rôle, version)
- **Hermes + Static Hermes** — compiler-time optimizations, activer dès que disponible via Expo

### Règle de veille
- Avant d'intégrer une nouvelle lib : vérifier licence (MIT / Apache 2 uniquement), stars GitHub, dernière release, alternatives. Documenter le choix dans `docs/tech-decisions.md`
- Ne jamais intégrer une lib en RC/beta en production sans validation explicite

---

## Métriques de succès produit

Copilot DOIT orienter les implémentations vers ces objectifs :

| Indicateur | Cible |
|------------|-------|
| Rétention J7 | > 40% |
| Temps création note | < 30 secondes |
| Disponibilité offline | 100% lecture, 95% écriture |
| Erreurs crash-free | > 99.5% sessions |
| Conversion free → premium | > 8% à 30 jours |

Ces métriques guident les arbitrages UX : **privilégier la vitesse et la fiabilité** sur le nombre de fonctionnalités.
