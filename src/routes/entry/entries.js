const express = require('express');

const {
  validate: { body: validateBody },
  executeAsync,
  authorize: { admin: authorizeAdmin },
} = require('../../middleware');

const Entry = require('../../db/models/Entry');

const entryCount = require('../../db/queries/entryCount');

const router = express.Router();

// Limit POST to admins
router.post('*', authorizeAdmin);

/**
 * Creates log entry
 */
router.post('/', validateBody(['message']), executeAsync(async (req, res) => {
  const {
    message,
    category_id: catId,
  } = req.body;

  const entry = await new Entry({ message, category_id: catId }).save();

  res.json(entry);
}));

/**
 * Retrieves all categories
 */
router.get('/', executeAsync(async (req, res) => {
  const entries = await Entry.all();
  res.json(entries);
}));

/**
 * Retrieves all categories
 */
router.get('/count', executeAsync(async (req, res) => {
  const count = await entryCount();
  res.json({ count });
}));

module.exports = router;
