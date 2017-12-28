'use strict';

// Import dependencies
const { Router } = require('express');
const java = require('../controllers/java.controller');

// Create the router
const router = Router();

// POST Java compiler route
router.post('/:testName', java.runTest);

module.exports = router;
