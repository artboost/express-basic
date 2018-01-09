// Insert mongo uri here
// For more, see: https://docs.mongodb.com/manual/reference/connection-string/
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/express-basic';

module.exports.uri = uri;
