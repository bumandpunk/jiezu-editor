'use strict';

const jwt = require('jsonwebtoken');

module.exports = () => {
  return async (ctx, next) => {
    const authHeader = ctx.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      ctx.status = 401;
      ctx.body = { code: 401, message: '未登录，请先登录' };
      return;
    }
    try {
      const secret = ctx.app.config.jwt.secret;
      const decoded = jwt.verify(token, secret);
      ctx.state.user = decoded;
      await next();
    } catch (e) {
      ctx.status = 401;
      ctx.body = { code: 401, message: 'Token 无效或已过期，请重新登录' };
    }
  };
};
