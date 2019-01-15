const express = require('express');
const ExpressBasic = require('../services/ExpressBasic');

const router = express.Router();

router.get('/', (req, res) => res.send('hello world'));

router.get('/byService', (req, res, next) => {
  ExpressBasic.helloWorld()
    .then(serviceRes => res.json(serviceRes))
    .catch(next);
});

module.exports = router;
