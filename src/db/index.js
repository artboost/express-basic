const mongoose = require('mongoose');

const { uri } = require('./config');

module.exports.connect = async () => {
  await mongoose.connect(uri, { useNewUrlParser: true });
};

module.exports.disconnect = async () => {
  await mongoose.disconnect();
};
