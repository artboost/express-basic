/* eslint-disable no-underscore-dangle */
const axios = require('axios');
const { executeRequest } = require('./util');

class Service {
  /**
   * Getter for service URL. Must be overridden.
   * @return string Service URL.
   */
  static get URL() {
    throw new Error('Static getter URL is not overridden.');
  }

  /**
   * @param endpoint
   * @param {{ [body]: {}, [token]: string }} [options]
   */
  static get(endpoint, options) {
    return this._fetch('get', endpoint, options);
  }

  /**
   * @param endpoint
   * @param {{ [body]: {}, [token]: string }} [options]
   */
  static post(endpoint, options) {
    return this._fetch('post', endpoint, options);
  }

  /**
   * @param endpoint
   * @param {{ [body]: {}, [token]: string }} [options]
   */
  static put(endpoint, options) {
    return this._fetch('put', endpoint, options);
  }

  /**
   * @param endpoint
   * @param {{ [body]: {}, [token]: string }} [options]
   */
  static delete(endpoint, options) {
    return this._fetch('delete', endpoint, options);
  }

  /**
   * @param method
   * @param endpoint
   * @param {{ [body]: {}, [token]: string }} [options]
   */
  static _fetch(method, endpoint, { body, token } = {}) {
    const url = `${this.URL}/${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const request = axios({
      method,
      url,
      data: body,
    });

    return executeRequest(request);
  }
}

module.exports = Service;
