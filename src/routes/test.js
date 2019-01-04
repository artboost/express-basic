const express = require('express');
const test = require('../db/models/test');

const authorize = require('../middleware/authorize');
const executeAsync = require('../middleware/executeAsync');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', authorize.optional, executeAsync(async (req, res) => {
  const tests = await test.all();
  res.json(tests);
}));

router.get('/:id', authorize.optional, executeAsync(async (req, res) => {
  const doc = await test.find(req.params.id);
  res.json(doc);
}));

router.post('/', authorize.admin, validate.body(['message']), executeAsync(async (req, res) => {
  const newTest = await test.insert(req.body.message);
  res.json(newTest);
}));

module.exports = router;
