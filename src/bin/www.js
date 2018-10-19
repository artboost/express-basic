const http = require('http');

const app = require('../app');
const db = require('../db');

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

// Connect to DB before listening.
db.connect().then(() => {
  server.listen(PORT, () => console.log(`listening @ localhost:${PORT}`));
});
