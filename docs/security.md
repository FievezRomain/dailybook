# Security and Workspace Hygiene

This document keeps the mobile workspace clean without exposing local secrets.

## Local-only files

Do not commit files that contain credentials or machine-specific output:

- `.env`, `.env.*`, `.env.dev`, `.env.prod`
- `credentials.json`, `credentials/`
- Apple keys and provisioning files: `*.p8`, `*.p12`, `*.mobileprovision`
- Android signing files: `*.jks`, `*.keystore`
- AWS generated config: `aws-exports.js`, `aws-exports.txt`
- generated caches and reports: `.expo/`, `.tamagui/`, `dist/`, `coverage/`

Keep `.env.example` committed with placeholders only.

## Firebase client files

`google-services.json` and `GoogleService-Info.plist` are currently tracked on purpose. They contain Firebase client identifiers, which are not private keys, but they still need Google Cloud and Firebase restrictions.

Recommended controls:

- restrict API keys to the expected Android package, iOS bundle ID, and web origins;
- enable only the APIs required by the app;
- review Firebase rules before production releases;
- rotate identifiers if a file was committed with unintended production scope.

## Removing a tracked sensitive file

If a file is already tracked and should become local-only, remove it from Git tracking without deleting the local copy:

```sh
git rm --cached path/to/file
git commit -m "chore: stop tracking local credential file"
```

If the file contains a real secret, also rotate the secret. Removing it from the latest commit is not enough because it remains in Git history.

## Before handoff

Run:

```sh
git status --short --ignored
git diff -- .gitignore docs/security.md
```

Check that no secret or generated output appears as a new tracked change.
