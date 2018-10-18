const express = require('express');

const {
  validate: { body: validateBody },
  executeAsync,
  authorize: { admin: authorizeAdmin },
} = require('../../middleware');

const Entry = require('../../db/models/Entry');

const router = express.Router();

// Limit POST to admins
router.post('*', authorizeAdmin);

/**
 * Creates log entry
 */
router.post('/', validateBody(['message']), executeAsync(async (req, res) => {
  const { message } = req.body;
  const entry = await new Entry({ message }).save();

  res.json(entry.toJSON());
}));

/**
 * Retrieves all categories
 */
router.get('/', executeAsync(async (req, res) => {
  const entries = await Entry.all();
  res.send(entries.toString());
}));

module.exports = router;
