const express = require('express');
const Category = require('../../db/models/Category');
const Entry = require('../../db/models/Entry');

const {
  executeAsync,
  authorize: { admin: authorizeAdmin },
  validate: { body: validateBody },
} = require('../../middleware');

const router = express.Router();

router.use('/:id', executeAsync(async (req, res, next) => {
  res.locals.category = await Category.findOne({ id: req.params.id });
  next();
}));

router.get('/:id', (req, res) => {
  console.log('hello');

  res.json(req.locals.category);
});

router.get('/:id/entries', executeAsync(async (req, res) => {
  const entries = await Entry.find({ category_id: req.params.id });
  res.json(entries);
}));

/**
 * Add log entry to category
 */
router.post('/:id/entries', authorizeAdmin, validateBody(['message']), executeAsync(async (req, res) => {
  const { message } = req.body;

  const entry = await new Entry({ message, category_id: req.params.id }).save();

  res.json(entry.toJSON());
}));

module.exports = router;
