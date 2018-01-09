const mongoose = require('mongoose');
const url = require('./config').url;

mongoose.Promise = Promise;

mongoose.connect(url, { useMongoClient: true });

const testSchema = mongoose.Schema({ message: String });

module.exports.test = mongoose.model('Test', testSchema);
module.exports.execute = (promise, cb, err) => {
  if (cb) {
    return promise.then(cb).catch(err);
  }
  return promise;
};
