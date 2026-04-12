.PHONY: lint types test security check

lint:
	npx eslint . --ext .ts,.tsx --max-warnings 0

types:
	npx tsc --noEmit

test:
	npx jest --passWithNoTests

coverage:
	npx jest --coverage --passWithNoTests

security:
	npm audit --audit-level=high

check: lint types security coverage
