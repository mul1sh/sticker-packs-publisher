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

deploy: install build
	$(eval VERSION = $(shell git rev-parse --short HEAD))
	$(eval MESSAGE = 'Deploying \#$(VERSION)')
	npx gh-pages --dotfiles --message ${MESSAGE} --dist dist

clean:
	rm -rf node_modules/ dist/ yarn.lock
