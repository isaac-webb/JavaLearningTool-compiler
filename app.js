'use strict';

// Import package dependencies
const debug = require('debug')('javalearningtool-compiler:app');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Import express routers
const java = require('./routers/java.router');
const users = require('./routers/users.router');

// Create a new express application
const app = express();

// Configure logger to write to debug, format depending on environment
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev', { stream: { write: (msg) => debug(msg) } }));
} else {
  app.use(morgan('tiny', { stream: { write: (msg) => debug(msg) } }));
}

// Configure other application middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure the express app to use the routers
app.use('/java', java);
app.use('/users', users);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use(function(err, req, res, next) {
  // Render the error page
  res.status(err.status || 500);
  process.env.NODE_ENV !== 'production' ? res.send(err.message) : res.send();
});

module.exports = app;
