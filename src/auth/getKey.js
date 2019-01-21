const axios = require('axios');

const getKey = (header, callback) => {
  const keyPath = process.env.KEY_PATH;
  axios.get(keyPath)
    .then(res => callback(null, res.data))
    .catch(err => callback(err));
};

module.exports = getKey;
