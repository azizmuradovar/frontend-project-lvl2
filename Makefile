install:
	npm install

test-coverage:
	npx -n --experimental-vm-modules jest --coverage

test:
	npx -n --experimental-vm-modules jest

publish:
	npm publish --dry-run

lint:
	npx eslint .
	