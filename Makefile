default:
	$(MAKE) all

circleci:
	circleci build

build_app:
	npm run-script build

all:
	$(MAKE) build_app
