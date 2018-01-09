const Test = require('./models').test;
const execute = require('./models').execute;

const all = () => Test.find({});
const find = id => Test.find({ _id: id });
const insert = message => new Test({ message }).save();

module.exports.all = (cb, err) => execute(all(), cb, err);
module.exports.find = (id, cb, err) => execute(find(id), cb, err);
module.exports.insert = (message, cb, err) => execute(insert(message), cb, err);
