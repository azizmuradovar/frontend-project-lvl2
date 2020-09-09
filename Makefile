install:
	npm install

test:
	npx -n --experimental-vm-modules jest
	
test-coverage:
	npx -n --experimental-vm-modules jest --coverage

test-watch:
	npx -n --experimental-vm-modules jest --watch

publish:
	npm publish --dry-run

lint:
	npx eslint .
	