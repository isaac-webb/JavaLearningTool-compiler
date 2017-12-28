# Java Learning Tool Compiler
The back end and compiler for an online Java learning web app

## About
The motivation for this project was providing new programming students with an
online library of programming challenges in order to further their understanding
of Java programming. This module provides an easy to use, extensible REST API
for the front end to use. It deals with executing Java code and user
authentication.

## Getting Started
To use this module, you must have Node.js installed. Go
[here](https://nodejs.org/en/download/) if you do not. Alternatively, you can
use [homebrew](https://brew.sh) to install it (recommended). To use the provided
Docker capabilities, you must have Docker installed. Go
[here](https://www.docker.com/community-edition) if you would like to use them.
To use the Makefile provided for convenience, you need the GNU make utility.

Note that, in order to run this module locally, two directories must exist and
be read/write/execute-able by you: `sandbox`, in the root of your filesystem,
and `challenges`, in this folder, containing a trivial test called `HelloWorld`.
In addition, you must have a Java JDK installed in order to provide the `java`
and `javac` executables.

### Installation
To install all of the necessary Node.js dependencies, run:

```
npm install
```

To only install the production Node.js dependencies, run:

```
npm install --production
```

Note that doing this excludes the testing modules, so unit tests and coverage
will not be available unless you install the dev dependencies.

### Running
To start the server, run:

```
npm start
```

This executes the main file, `server.js`.

To run this module in a Docker container as it was designed to, refer to the
section below.

### Docker/Makefile
This module has been designed to run inside of a Docker container. Many of the
commands to build and run Docker containers are verbose, so a Makefile has been
provided for convenience. To build and run the container, just run `make`.

### Testing
To run the unit tests, which are defined in the `test/` directory, run:

```
npm run test
```

To generate an HTML coverage report along with this, run:

```
npm run coverage
```

## Technologies
To facilitate the understanding of the codebase, the technologies are listed
below. All code is written in JavaScript and executed by Node.js.

### Deployment/Automation
* [Docker](http://www.docker.com)

### HTTP Server
* [Express](http://expressjs.com)

### Testing/Coverage
* [mocha](http://mochajs.org)
* [chai](http://chaijs.com)
* [supertest](https://github.com/visionmedia/supertest)
* [istanbul](https://istanbul.js.org)
