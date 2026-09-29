---
applyTo: "tests/**,**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx"
---

# Tests Mobile

## Stack actuelle

- Jest avec `jest-expo`
- `@testing-library/react-native`
- Tests de hooks React Query dans `hooks/queries/__tests__/`
- Factories dans `tests/factories/`
- Maestro pour les flows E2E dans `e2e/flows/`

Verifier `package.json` et `jest.config.js` avant de citer une version exacte. Ne pas documenter une version qui n'est pas installee.

## Priorites

Tester en priorite :
- hooks purs et utils ;
- hooks de formulaire ;
- hooks React Query : success, error, invalidation, optimistic rollback ;
- composants shared avec branches `loading/error/empty/data`;
- flows critiques Maestro : login, creation animal, creation evenement, ecran Plus/Autre.

Ne pas multiplier les tests fragiles de screens complets si un hook ou composant peut etre teste plus simplement.

## Organisation

```text
features/{domain}/hooks/__tests__/
features/{domain}/components/__tests__/
hooks/queries/__tests__/
tests/factories/
tests/utils/
e2e/flows/
```

Les tests doivent suivre la structure du code teste. Les tests transverses vont dans `tests/`.

## React Query

Utiliser un QueryClient isole par test :

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});
```

Verifier :
- donnees rendues ;
- etat erreur ;
- invalidation ;
- optimistic update ;
- rollback ;
- absence de retry infini.

## Formulaires

Tester :
- valeurs initiales ;
- validation Zod ;
- submit create/update ;
- mapping des erreurs ;
- reset ;
- loading pendant submit.

## Flows E2E obligatoires pour les corrections a venir

Ajouter ou maintenir des flows Maestro pour :
- creation d'un animal ;
- creation d'un evenement via le wizard principal ;
- ecran Plus/Autre affichant les actions de base meme si les groupes chargent ou echouent ;
- login/logout ;
- consultation detail animal.

## Bugs connus ou sensibles

Quand une session corrige un bug de flux, ajouter au moins un test qui echoue avant la correction :
- double chemin de creation evenement ;
- spinner infini ;
- mutation optimistic sans rollback ;
- route non typee qui casse a l'execution ;
- permission refusee.

## Bonnes pratiques

- Nommer les tests par comportement utilisateur.
- Utiliser les factories plutot que des objets inline longs.
- Mock les services API au bord du test.
- Eviter les snapshots larges.
- Tester les messages visibles et callbacks importants.
- Garder les tests rapides et deterministes.
