'use strict';

// Import dependencies
const { Router } = require('express');
const java = require('../controllers/java.controller');

// Create the router
const router = Router();

router.post('/:testName', java.runTest);

module.exports = router;
