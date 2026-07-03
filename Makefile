.PHONY: lint types test security check bundle e2e check-all

lint:
	npx eslint . --ext .ts,.tsx --max-warnings 0

types:
	npx tsc --noEmit

test:
	npx jest --passWithNoTests

coverage:
	npx jest --coverage --passWithNoTests

# Metro bundler full compile check — catches what tsc/jest miss (missing imports, native modules, exports)
bundle:
	npx expo export --platform all --dev false --output-dir /tmp/expo-bundle-check --clear

security:
	npm audit --audit-level=high

# E2E via Maestro (requires simulator running)
e2e:
	npx maestro test e2e/flows/

# Standard CI check — no simulator needed
check: lint types bundle security coverage

# Full check including E2E (requires simulator)
check-all: check e2e

