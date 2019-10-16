module.exports = {
  apps: [{
    name: 'express-basic',
    script: './src/bin/www.js',
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    watch: true,
    env: {
      NODE_ENV: 'development',
      PORT: 4001,
      KEY_PATH: 'https://static.artboost.com/jwt.dev.key.pub',
      SERVICE_ID: 'BASIC_d3cZPTLEtRBnWR7CzbAJjyHBH32P7jYfy2kSEeLSJdgkx9TMY7TjWLPybM',
    },
  }],
};
