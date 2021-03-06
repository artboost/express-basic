const http = require('http');
const app = require('../app');

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`listening @ localhost:${PORT}`));

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');

  // Stop server from accepting new connections and finishes existing connections.
  server.close((err) => {
    // if error, log and exit with error (1 code)
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
