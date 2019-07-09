.PHONY: build, dev

init: clean install
	echo "Ready"

install:
	yarn

build:
	yarn run build

dev:
#  requires export NODE_OPTIONS=--max_old_space_size=4096
	yarn run dev

deploy-website: install compile
	$(eval VERSION = $(shell git rev-parse --short HEAD))
	$(eval MESSAGE = 'Deploying \#$(VERSION)')
	./node_modules/gh-pages/bin/gh-pages.js --dotfiles --message ${MESSAGE} --dist resources/public

clean:
	rm -rf node_modules/ dist/ yarn.lock
