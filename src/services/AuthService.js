const axios = require('axios');

const { executeRequest } = require('./util');

const serviceId = process.env.SERVICE_ID;

if (!serviceId) {
  throw new Error('SERVICE_ID NOT SET.');
}

class AuthService {
  static get URL() {
    return process.env.AUTH_SERVICE_URL;
  }

  static async getServiceToken() {
    const url = `${this.URL}/service/${serviceId}/token`;

    const { token } = await executeRequest(axios(url));

    return token;
  }
}

module.exports = AuthService;
