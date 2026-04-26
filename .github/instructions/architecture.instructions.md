---
applyTo: "**/*.ts,**/*.tsx"
---

# Architecture — Mobile MyDailyBook

## Règle d'or
**Un fichier = une responsabilité.**
- Screens : orchestrent la navigation et composent les composants
- Components : affichent des données, émettent des events via props
- Hooks : contiennent toute la logique, le state et les side-effects
- Services : encapsulent les appels HTTP

## Structure d'une feature (gabarit obligatoire)

```
features/{domain}/
├── components/
│   ├── {Domain}Card.tsx           # Composant de présentation
│   ├── {Domain}List.tsx           # Liste avec états loading/error/empty
│   └── {Domain}FormDrawer.tsx     # Formulaire en bottom sheet
├── hooks/
│   ├── use{Domain}Form.ts         # Logique formulaire (RHF + Zod)
│   └── use{Domain}Actions.ts      # Actions locales à la feature
├── screens/
│   ├── {Domain}ListScreen.tsx
│   └── {Domain}DetailScreen.tsx
└── types.ts                       # Types spécifiques au domaine
```

## Hooks React Query — `hooks/queries/use{Domain}Queries.ts`

```typescript
export const use{Domain}List = () =>
  useQuery({
    queryKey: ['{domain}'],
    queryFn: {Domain}Service.getAll,
  });

export const use{Domain}ById = (id: number) =>
  useQuery({
    queryKey: ['{domain}', id],
    queryFn: () => {Domain}Service.getById(id),
    enabled: !!id,
  });

export const use{Domain}Create = () =>
  useMutation({
    mutationFn: {Domain}Service.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['{domain}'] }),
  });
```

## Services API — `services/api/{Domain}Service.ts`

```typescript
export const {Domain}Service = {
  getAll: () => httpClient.get<{Domain}[]>('/{domain}s'),
  getById: (id: number) => httpClient.get<{Domain}>(`/{domain}s/${id}`),
  create: (dto: Create{Domain}Dto) => httpClient.post<{Domain}>('/{domain}s', dto),
  update: (id: number, dto: Partial<{Domain}>) => httpClient.put<{Domain}>(`/{domain}s/${id}`, dto),
  delete: (id: number) => httpClient.delete(`/{domain}s/${id}`),
};
```

## Zustand stores — rules
- Uniquement pour : `useAuthStore`, `useThemeStore`, `use{UI}Store`
- JAMAIS pour de la donnée métier (c'est le rôle de React Query)
- Shape du store : `{ state, actions }` dans le même fichier
- Persister uniquement ce qui doit survivre au reload (SecureStore pour les données sensibles)

## Composants — règles
- Interface de props explicite au-dessus du composant
- Taille max ~150 lignes — au-delà, extraire des sous-composants ou un hook
- Pas de logique conditionnelle complexe dans le JSX — extraire dans une variable ou fonction helper
- Utiliser `React.memo()` uniquement si le composant est prouvablement coûteux (listes longues)

## Navigation
- Types centralisés dans `navigation/types.ts` (RootStackParamList, etc.)
- Typer les navigateurs : `useNavigation<NavigationProp<RootStackParamList>>()`
- Passer uniquement des primitives (IDs, strings) dans les paramètres de navigation
- La logique de navigation vit dans les screens, jamais dans les hooks métier — remonter via callback

## Types
- Types partagés entre plusieurs features → `models/`
- Types spécifiques à une feature → `features/{domain}/types.ts`
- DTOs de création/mise à jour → `Create{Domain}Dto`, `Update{Domain}Dto` définis dans le service ou types.ts
- Type de la réponse API → utiliser l'envelope `ApiResponse<T>` de `models/ApiResponse.ts`
