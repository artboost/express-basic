const express = require('express');
const cors = require('cors');

const router = require('./routes');

const PORT = process.env.PORT || 4000;

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.use(router);

app.use((err, req, res, next) => {
  if (err instanceof Error) {
    console.error(err);
    next({
      message: err.toString(),
      status: 500,
    });
  } else {
    next(err);
  }
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err }));

app.listen(PORT, () => console.log(`listening @ localhost:${PORT}`));
