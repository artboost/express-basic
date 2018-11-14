const express = require('express');

const validate = require('../../middleware/validate');
const authorize = require('../../middleware/authorize');
const executeAsync = require('../../middleware/executeAsync');

const Entry = require('../../db/models/Entry');

const router = express.Router();

// Limits post and delete to admins
router.post('*', authorize.admin);
router.delete('*', authorize.admin);

// Add Entry to res.locals
router.use('/:id', executeAsync(async (req, res, next) => {
  res.locals.entry = await Entry.findOne({ id: req.params.id });
  next();
}));

router.get('/:id', (req, res) => {
  res.json(res.locals.entry);
});

/**
 * Update entry. Only its message is mutable directly.
 * ID is immutable.
 * Use DB directly to update ID if absolutely necessary.
 */
router.post('/:id', validate.body(['message']), executeAsync(async (req, res) => {
  const { entry } = res.locals;

  entry.message = req.body.message;

  if (req.body.category_id) {
    entry.category_id = req.body.category_id;
  }

  await entry.save();

  res.json(entry);
}));

router.delete('/:id', (req, res) => {
  res.locals.entry.delete().then(() => res.sendStatus(200));
});

module.exports = router;
