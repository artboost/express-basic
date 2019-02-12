const express = require('express');
const cors = require('cors');

const router = require('./routes');

const app = express();

// MIDDLEWARE
app.use(cors({
  // Allow all origins; respond with requester origin.
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json());

app.use(router);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(err);
});

module.exports = app;
