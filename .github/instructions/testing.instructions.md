---
applyTo: "tests/**,**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx"
---

# Tests — Mobile MyDailyBook

## Stack de test
- **Unit / Component** : Jest 30 + @testing-library/react-native
- **E2E** : Maestro (fichiers `.yaml` dans `e2e/`)
- Coverage minimum : 70% (lignes, fonctions, branches, statements) — configuré dans `jest.config.js`

## Où écrire les tests
- Tests unitaires/composants : co-localisés dans le dossier de la feature
  ```
  features/animals/
  ├── components/AnimalCard.tsx
  ├── components/__tests__/AnimalCard.test.tsx   ← ici
  ├── hooks/useAnimalForm.ts
  └── hooks/__tests__/useAnimalForm.test.ts      ← ici
  ```
- Tests de hooks React Query : dans `hooks/queries/__tests__/`
- Tests E2E Maestro : dans `e2e/flows/` à la racine du projet

## Tests de composants — pattern
```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AnimalCard } from '../AnimalCard';

describe('AnimalCard', () => {
  it('affiche le nom de l\'animal', () => {
    render(<AnimalCard animal={mockAnimal} />);
    expect(screen.getByText('Tornado')).toBeTruthy();
  });

  it('appelle onPress avec l\'id correct', () => {
    const onPress = jest.fn();
    render(<AnimalCard animal={mockAnimal} onPress={onPress} />);
    fireEvent.press(screen.getByTestId('animal-card'));
    expect(onPress).toHaveBeenCalledWith(mockAnimal.id);
  });
});
```

## Tests de hooks React Query — pattern
```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { useAnimalList } from '../useAnimalQueries';

jest.mock('../../../services/api/AnimalsService');

describe('useAnimalList', () => {
  it('retourne les animaux', async () => {
    (AnimalsService.getAll as jest.Mock).mockResolvedValue([mockAnimal]);
    const { result } = renderHook(() => useAnimalList(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });
});
```

Créer `tests/utils/queryWrapper.tsx` :
```typescript
export const createQueryWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
```

## Mocks — conventions
- Mock Firebase dans `__mocks__/firebase.ts` (auto-mock Jest)
- Mock services dans chaque test avec `jest.mock('../../services/api/XService')`
- Mock navigateur : `jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: jest.fn() }) }))`
- Données de test : factories dans `tests/factories/{domain}.factory.ts`

```typescript
// tests/factories/animal.factory.ts
export const createMockAnimal = (overrides?: Partial<Animal>): Animal => ({
  id: 1,
  name: 'Tornado',
  race: 'Cheval de sport',
  ...overrides,
});
```

## E2E Maestro — installation & conventions
Installer : `npm install -D @maestro-team/cli`

Structure des flows :
```
e2e/
├── flows/
│   ├── auth/
│   │   ├── login.yaml
│   │   └── logout.yaml
│   ├── animals/
│   │   ├── create-animal.yaml
│   │   └── view-animal.yaml
│   └── events/
│       └── create-event.yaml
└── config.yaml
```

Pattern d'un flow Maestro :
```yaml
# e2e/flows/animals/create-animal.yaml
appId: com.mydailybook.mobile
---
- launchApp
- tapOn: "Se connecter"
- inputText:
    id: "email-input"
    text: ${MAESTRO_EMAIL}
- tapOn: "Créer un cheval"
- assertVisible: "Mon cheval"
```

Lancer les tests E2E : `npx maestro test e2e/flows/`

## Ce qu'il faut tester (priorités)
1. Composants avec branches de rendu conditionnelles (loading, error, empty, data)
2. Hooks de formulaire (validation, submit, reset)
3. Hooks React Query (succès, erreur, invalidation de cache)
4. Utils purs dans `utils/` (100% de coverage)
5. Flows E2E critiques : login, création animal, création événement

## Ce qu'on ne teste PAS avec Jest
- Les screens (trop dépendants du contexte navigation) → couvrir avec Maestro E2E
- Les adapters Firebase (mockés, pas testables unitairement)
- Les thèmes/tokens visuels (tests visuels hors scope pour l'instant)
