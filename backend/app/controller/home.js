'use strict';

const { Controller } = require('egg');
const jwt = require('jsonwebtoken');

class HomeController extends Controller {
  async health() {
    this.ctx.body = { status: 'ok', time: new Date().toISOString() };
  }

  async debugJwt() {
    const { ctx, app } = this;
    const secret = app.config.jwt.secret;
    const authHeader = ctx.headers['authorization'];
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    let result = null;
    let err = null;
    if (token) {
      try {
        result = jwt.verify(token, secret);
      } catch (e) {
        err = e.message;
      }
    }
    ctx.body = { secret, tokenLen: token?.length, result, err };
  }
}

module.exports = HomeController;
