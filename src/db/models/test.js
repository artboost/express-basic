const mongoose = require('mongoose');
const { NotFoundError } = require('../../errors');

const testSchema = mongoose.Schema({ message: String });

const Test = mongoose.model('Test', testSchema);

const all = () => Test.find({});

const find = id => Test
  .findById(id)
  .then((doc) => {
    if (!doc) {
      throw new NotFoundError('No such document');
    }
    return doc;
  });

const insert = message => new Test({ message }).save();

module.exports.all = all;
module.exports.find = find;
module.exports.insert = insert;
