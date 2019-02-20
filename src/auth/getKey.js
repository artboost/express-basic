const axios = require('axios');

let key;
const getKey = (header, callback) => {
  if (key) {
    callback(null, key);
    return;
  }

  const keyPath = process.env.KEY_PATH;
  axios.get(keyPath)
    .then((res) => {
      key = res.data;
      callback(null, key);
    })
    .catch(err => callback(err));
};

module.exports = getKey;
