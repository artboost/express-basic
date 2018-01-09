const express = require('express');

const ping = require('./ping');

const router = express.Router();

router.use('/ping', ping);

module.exports = router;
