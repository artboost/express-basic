const Service = require('./Service');

class ExpressBasic extends Service {
  static get URL() {
    return process.env.SERVICE_INTEGRATION_URL;
  }

  static helloWorld() {
    return this.get('').then(res => res.data);
  }

  static recursive(depth) {
    return this.get(`recursive/${depth}`).then(res => res.data);
  }
}

module.exports = ExpressBasic;
