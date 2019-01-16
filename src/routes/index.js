const express = require('express');

const ExpressBasic = require('../services/ExpressBasic');

const router = express.Router();

router.get('/', (req, res) => res.send('hello world'));

router.get('/recursive/:depth', (req, res, next) => {
  const depth = parseInt(req.params.depth, 10);
  console.log('DEPTH', depth);

  if (depth >= 50) {
    ExpressBasic.helloWorld()
      .then(serviceRes => res.json(serviceRes))
      .catch(next);
  } else {
    console.time(`DEPTH ${depth}`);

    ExpressBasic.recursive(depth + 1)
      .then(serviceRes => res.json(`hello world, ${serviceRes}`))
      .then(() => console.timeEnd(`DEPTH ${depth}`))
      .catch(next);
  }
});

module.exports = router;
