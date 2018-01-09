const express = require('express');

const ping = require('./test');

const router = express.Router();

router.get('/', (req, res) => res.send('hello world'));

router.use('/test', ping);

module.exports = router;
