'use strict';

// Import dependencies
const debug = require('debug')('javalearningtool-compiler:server');
const app = require('./app');

// Start the server
app.listen(process.env.PORT || 3000, () => {
  debug(`Listening on port ${process.env.PORT || 3000}`);
});
