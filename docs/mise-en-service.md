# Mise en service de Vasco Mobile

Ce document décrit le lancement local de l’application Expo, les builds de recette, les mises à jour EAS Update et les livraisons Android/iOS via les stores.

Le mobile n’est pas déployé dans un conteneur Docker : Docker peut héberger l’API, mais l’application finale est un binaire Android/iOS signé. EAS Build produit ces binaires dans le cloud et EAS Submit les transfère aux stores.

## Architecture de livraison

Une application Expo possède deux couches :

```text
Binaire natif installé depuis le store
  + runtime natif, permissions, plugins, SDK Expo, bibliothèques natives
  + bundle JavaScript et assets embarqués

EAS Update
  -> peut remplacer le JavaScript et les assets compatibles
  -> ne peut pas ajouter ou modifier le code natif déjà installé
```

Le projet utilise :

- Expo SDK 54 ;
- `expo-updates` ;
- les canaux `development`, `preview` et `production` ;
- `runtimeVersion.policy = appVersion` ;
- `appVersionSource = remote` pour les numéros techniques de build.

Une update n’est reçue que par un binaire utilisant le même canal et une runtime compatible.

## Prérequis

- Node.js 20 LTS, comme dans la CI mobile ;
- npm ;
- Android Studio/SDK pour Android local ;
- macOS et Xcode pour un simulateur ou build iOS local ;
- un compte Expo autorisé sur le projet `riujin/dailybook` ;
- les comptes Google Play Console et Apple Developer/App Store Connect pour publier ;
- un backend Vasco joignable depuis l’appareil ou l’émulateur.

EAS peut être utilisé sans installation globale : les commandes ci-dessous emploient `npx eas-cli@latest`.

## Configuration locale

Créer `.env` depuis l’exemple :

```powershell
Copy-Item .env.example .env
```

Sous Linux ou macOS :

```bash
cp .env.example .env
```

Renseigner :

- `EXPO_PUBLIC_API_URL_DEV` et `EXPO_PUBLIC_API_URL_PROD`, avec le suffixe `/api/v1` ;
- les variables Firebase publiques ;
- les identifiants clients OAuth Google ;
- `EXPO_PUBLIC_SENTRY_DSN` pour les builds de production.

Les variables `EXPO_PUBLIC_*` sont incorporées dans l’application et sont lisibles par l’utilisateur final. Ne jamais y placer de clé privée, mot de passe, credential de signature ou clé de service.

Adresses usuelles de l’API locale :

| Cible | `EXPO_PUBLIC_API_URL_DEV` |
| --- | --- |
| iOS Simulator | `http://localhost:8080/api/v1` |
| Android Emulator standard | `http://10.0.2.2:8080/api/v1` |
| Appareil physique | `http://IP_LAN_DU_POSTE:8080/api/v1` |

Pour un appareil physique, le téléphone et le poste doivent être sur le même réseau, le pare-feu doit autoriser le port 8080 et Uvicorn doit écouter sur `0.0.0.0`.

## Installation et lancement local

```bash
npm ci --legacy-peer-deps
npm run start
```

Commandes directes :

```bash
npm run android
npm run ios
npm run web
```

L’application utilise des modules natifs tels que React Native Firebase et Google Sign-In. Pour une recette fonctionnelle complète, utiliser un **development build** plutôt qu’Expo Go :

```bash
npx eas-cli@latest login
npx eas-cli@latest whoami
npx eas-cli@latest build --platform android --profile development
# ou
npx eas-cli@latest build --platform ios --profile development
```

Installer le binaire généré, puis lancer Metro pour ce client :

```bash
npx expo start --dev-client --clear
```

Alternative locale, si la chaîne native est installée :

```bash
npx expo run:android
npx expo run:ios
```

## Vérification avant livraison

```bash
npx eslint . --ext .ts,.tsx --max-warnings 0
npm run typecheck
npm test -- --runInBand
npx expo export --platform all --dev false --output-dir dist --clear
npm audit --audit-level=high
```

Avec un simulateur ou appareil préparé :

```bash
npm run test:e2e
```

La recette mobile couvre au minimum : connexion/déconnexion, synchronisation, agenda, formulaires, animaux, fichiers, notifications, Premium, deep links et comportement hors connexion.

## Build interne de recette

Le profil `preview` produit une distribution interne et écoute le canal EAS Update `preview` :

```bash
npx eas-cli@latest build --platform android --profile preview --message "Recette <version>"
npx eas-cli@latest build --platform ios --profile preview --message "Recette <version>"
```

Pour lancer les deux plateformes :

```bash
npx eas-cli@latest build --platform all --profile preview --message "Recette <version>"
```

Consulter les builds et leurs logs :

```bash
npx eas-cli@latest build:list
```

Une build `preview` ne remplace pas la recette TestFlight/Google Play sur le binaire exact destiné aux stores, mais elle accélère la validation en amont.

## Choisir entre EAS Update et une livraison store

| Changement | EAS Update possible | Nouveau binaire store requis |
| --- | --- | --- |
| Correction TypeScript/JavaScript | Oui, si runtime compatible | Non |
| Ajustement graphique ou texte | Oui, si runtime compatible | Non |
| Asset chargé par le bundle | Généralement oui | Non |
| Nouvelle dépendance purement JavaScript | Oui, après vérification | Parfois |
| Ajout/mise à jour d’un module natif | Non | Oui |
| Mise à jour Expo SDK / React Native | Non | Oui |
| Plugin Expo, permission, entitlement, Firebase natif | Non | Oui |
| Icône, splash natif, package/bundle ID ou signature | Non | Oui |
| Nouvelle version majeure de l’application | Non pour la première diffusion | Oui |

En cas de doute, considérer le changement comme natif et produire une nouvelle build. Une update incompatible peut appeler du code absent du binaire installé.

## Prochaine grosse mise à jour via les stores

La refonte majeure doit être distribuée comme une nouvelle version Android/iOS, et non comme une simple update OTA.

### 1. Préparer la version

1. figer le commit candidat et créer une branche/tag de release ;
2. choisir la version visible dans les stores, par exemple `2.0.0`, puis modifier `expo.version` dans `app.json` ;
3. vérifier que le changement de `expo.version` crée bien une nouvelle runtime avec la politique `appVersion` ;
4. synchroniser les numéros techniques Android/iOS avec ceux déjà présents dans les stores.

Le projet utilise les versions techniques distantes EAS. Pour initialiser ou corriger la valeur distante :

```bash
npx eas-cli@latest build:version:set
```

La configuration actuelle ne contient pas `autoIncrement`. Deux stratégies sont possibles :

- stratégie recommandée : ajouter `autoIncrement: true` au profil `production`, initialiser chaque plateforme avec le dernier numéro déjà publié, puis laisser EAS produire le numéro suivant ;
- sans auto-incrément : exécuter `build:version:set` avant chaque release et saisir directement un numéro encore jamais envoyé, strictement supérieur au dernier numéro du store.

Ne pas lancer une production build tant que ce choix et les deux valeurs distantes n’ont pas été vérifiés.

### 2. Valider le candidat

1. exécuter toutes les vérifications locales ;
2. produire les builds `preview` ;
3. réaliser la recette sur appareils Android et iOS réels ;
4. vérifier les variables EAS de production, Firebase, OAuth, notifications, Sentry et l’URL d’API ;
5. confirmer que le backend est déjà compatible avec l’ancienne et la nouvelle app.

### 3. Construire les binaires de production

```bash
npx eas-cli@latest build --platform all --profile production --message "Vasco <version>"
```

Les artefacts attendus sont un AAB Android et un IPA iOS signés. Le profil `production` est relié au canal EAS Update `production`.

### 4. Envoyer aux stores

```bash
npx eas-cli@latest submit --platform android --profile production
npx eas-cli@latest submit --platform ios --profile production
```

EAS Submit transfère les binaires mais ne remplace pas les étapes de publication des stores :

- Android : vérifier la fiche, les déclarations, le track et lancer de préférence un déploiement progressif dans Play Console ;
- iOS : valider d’abord dans TestFlight, compléter la fiche, sélectionner la build puis demander l’App Review dans App Store Connect.

Une soumission iOS arrive dans TestFlight ; elle n’est pas automatiquement publiée sur l’App Store.

### 5. Après publication

- vérifier installation neuve et mise à jour depuis la version précédente ;
- contrôler connexion, données existantes, notifications, documents et abonnement ;
- surveiller Sentry, les métriques stores et les retours utilisateurs ;
- conserver commit, tag Git, IDs EAS Build et numéros des deux stores dans le compte rendu de release.

## Mises à jour OTA après la version store

Une fois le nouveau binaire installé et sa runtime disponible, publier d’abord sur `preview` depuis le commit exact à valider :

```bash
npx eas-cli@latest update \
  --channel preview \
  --message "Correctif <description>" \
  --environment preview
```

Après recette, publier le même commit sur `production` :

```bash
npx eas-cli@latest update \
  --channel production \
  --message "Correctif <description>" \
  --environment production
```

Contrôler le canal et son historique :

```bash
npx eas-cli@latest channel:view production
npx eas-cli@latest update:list --branch production
```

Les builds de release téléchargent l’update compatible en arrière-plan ; elle est généralement appliquée après fermeture et réouverture de l’application.

Pour une exposition progressive, utiliser `--rollout-percentage` puis surveiller les erreurs avant d’augmenter le pourcentage.

## Retour arrière

### Update OTA

Pour republier une update antérieure, utiliser l’assistant de sélection :

```bash
npx eas-cli@latest update:republish --channel production
```

Pour revenir explicitement au bundle embarqué dans le binaire :

```bash
npx eas-cli@latest update:roll-back-to-embedded --channel production --message "Retour au bundle embarqué"
```

Après rollback, refaire une recette courte sur les deux plateformes.

### Binaire store

Un binaire déjà publié ne se remplace pas instantanément :

- interrompre un déploiement progressif Android si possible ;
- suspendre la publication iOS si elle n’est pas terminée ;
- corriger puis soumettre une nouvelle build avec un numéro technique supérieur ;
- utiliser EAS Update uniquement si le correctif est compatible avec la runtime déjà installée.

## Credentials et sécurité

- ne jamais committer `.env`, clés Apple `.p8/.p12`, keystores Android ou comptes de service ;
- ne pas transmettre les credentials dans les messages de commit ou les logs ;
- utiliser la gestion de credentials EAS ou un coffre d’entreprise ;
- restreindre les clés Firebase aux package/bundle IDs et APIs nécessaires ;
- révoquer immédiatement toute clé privée exposée, même si le fichier est ensuite supprimé de Git.

## Références officielles

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Versions d’application](https://docs.expo.dev/build-reference/app-versions/)
- [EAS Update et runtimes](https://docs.expo.dev/eas-update/runtime-versions/)
- [Déploiement des updates](https://docs.expo.dev/eas-update/deployment/)
- [EAS Submit](https://docs.expo.dev/deploy/submit-to-app-stores/)
- [Rollback EAS Update](https://docs.expo.dev/eas-update/rollbacks/)
