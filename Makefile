# Specify the challenges directory if not specified already
CHALLENGES ?= $(CURDIR)/challenges

# Specify the version if not already specified
VERSION ?= v1.0.0

# Specify the image name if not already specified
IMAGENAME ?= isaacwebb/compiler

# Default makefile target that updates dependencies, builds a new docker image,
# and runs it
all: node_modules build run

# Test target that updates dependencies, runs unit tests, and generates a
# coverage report
test: node_modules coverage

# Docker-test target that builds a new docker testing image and runs it
docker-test: node_modules build-test run-test

# node_modules target that ensures all dependencies are up to date
node_modules: package.json
	npm install

# Removes the latest image and builds a new docker latest dev image
build:
	-docker rmi $(IMAGENAME):latest-dev
	docker build -t $(IMAGENAME):latest-dev .

# Removes the latest test image and builds a new docker latest test image
build-test: test/test.js
	-docker rmi $(IMAGENAME):latest-test
	docker build -t $(IMAGENAME):latest-test .

# Runs the latest docker image in detached mode, mounting the challenges
# directory and forwarding port 3000 for API communication
run:
	docker run -d -p 3000:3000 --name=compiler_server \
	--volume=$(CHALLENGES):/home/node/app/challenges \
	$(IMAGENAME):latest-dev

# Runs the latest docker test image, mounting the challenges directory
run-test:
	docker run -it --rm --name=compiler_server_test \
	--volume=$(CHALLENGES):/home/node/app/challenges \
	-e "DEBUG=" $(IMAGENAME):latest-test npm run test

# Coverage target that runs the unit tests and generates an html coverage
# report
coverage: test/test.js challenges
	npm run coverage
	open coverage/index.html

# Remove the node_modules folder for space-saving or reinstalling
clean:
	rm -rf node_modules
