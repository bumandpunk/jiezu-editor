'use strict';

const jwt = require('jsonwebtoken');

module.exports = () => {
  return async (ctx, next) => {
    const authHeader = ctx.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      ctx.status = 401;
      ctx.body = { code: 401, message: '未登录，请先登录' };
      return;
    }

    const secret = ctx.app.config.jwt.secret;

    try {
      const decoded = jwt.verify(token, secret);
      ctx.state.user = decoded;
    } catch (e) {
      ctx.logger.warn('[jwtAuth] verify failed: %s', e.message);
      ctx.status = 401;
      ctx.body = { code: 401, message: 'Token 无效或已过期，请重新登录' };
      return;
    }

    await next();
  };
};
