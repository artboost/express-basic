/* eslint-disable no-underscore-dangle */
const axios = require('axios');

const AuthService = require('./AuthService');

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
   * @param {{ [body]: {}, [authorize]: boolean }} [options]
   */
  static get(endpoint, options) {
    return this._fetch('get', endpoint, options);
  }

  /**
   * @param endpoint
   * @param {{ [body]: {}, [authorize]: boolean }} [options]
   */
  static post(endpoint, options) {
    return this._fetch('post', endpoint, options);
  }

  /**
   * @param endpoint
   * @param {{ [body]: {}, [authorize]: boolean }} [options]
   */
  static put(endpoint, options) {
    return this._fetch('put', endpoint, options);
  }

  /**
   * @param endpoint
   * @param {{ [body]: {}, [authorize]: boolean }} [options]
   */
  static delete(endpoint, options) {
    return this._fetch('delete', endpoint, options);
  }

  /**
   * @param {'get'|'post'|'put'|'delete'} method
   * @param {string} endpoint
   * @param {{ [body]: {}, [authorize]: boolean }} [options]
   * @return {Promise<*>}
   * @private
   */
  static async _fetch(method, endpoint, options = {}) {
    const url = `${this.URL}/${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (options.authorize) {
      const token = await AuthService.getServiceToken();
      headers.Authorization = `Bearer ${token}`;
    }

    const request = axios({
      method,
      url,
      headers,
      data: options.body,
    });

    return executeRequest(request);
  }
}

module.exports = Service;
