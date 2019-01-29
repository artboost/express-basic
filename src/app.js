const express = require('express');
const cors = require('cors');

const router = require('./routes');

const app = express();

// MIDDLEWARE
app.use(cors({
  // Allow all origins in prod;
  // Allow request origin in dev.
  // This is a workaround, as Chrome does not adhere to the standard, and considers ports to be
  // a different origin. E.g. localhost:3000 !== localhost:3005.
  // In addition, it refuses wildcard origins when sending credentials: include.
  // Therefore, to be able to send response cookies in dev, this shit must be added ;_;
  origin: process.env.NODE_ENV === 'production' ? '*' : (origin, callback) => callback(null, true),
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
