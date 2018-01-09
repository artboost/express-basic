const express = require('express');
const test = require('../db/test');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', (req, res, next) => test.all(data => res.json(data), next));

router.get('/:id', (req, res, next) => test.find(req.params.id, data => res.json(data), next));

router.post('/', validate.body(['message']), (req, res, next) => {
  // Also supports promise based approach
  test.insert(req.body.message)
    .then(data => res.json(data))
    .catch(next);
});

module.exports = router;
