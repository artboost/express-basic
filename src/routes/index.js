const express = require('express');

const entries = require('./entry/entries');
const entry = require('./entry');

const router = express.Router();

router.get('/', (req, res) => res.send('hello world'));

router.use('/entries', entries);
router.use('/entry', entry);

module.exports = router;
