const express = require('express');

const entries = require('./entry/entries');
const entry = require('./entry');

const router = express.Router();

router.get('/', (req, res) => res.send('hello world'));


/**
 * /entries
 *    GET  -> All entries
 *    POST -> Create new entry
 *      Body: { message }
 */
router.use('/entries', entries);

/**
 * /entry/:id
 *    GET
 *    POST -> Update
 *      Body: { message }
 *    DELETE
 */
router.use('/entry', entry);

module.exports = router;
