'use strict';

const { Controller } = require('egg');

class AuthController extends Controller {
  // POST /api/auth/register
  async register() {
    const { ctx } = this;
    ctx.validate({
      phone: { type: 'string', format: /^1[3-9]\d{9}$/ },
      password: { type: 'string', min: 6 },
    });

    const { phone, password } = ctx.request.body;
    const result = await ctx.service.auth.register({ phone, password });

    if (!result.success) {
      ctx.status = 400;
      ctx.body = { code: 400, message: result.message };
      return;
    }

    ctx.body = {
      code: 0,
      message: '注册成功',
      data: {
        token: result.token,
        user: result.user,
      },
    };
  }

  // POST /api/auth/login
  async login() {
    const { ctx } = this;
    ctx.validate({
      phone: { type: 'string', format: /^1[3-9]\d{9}$/ },
      password: { type: 'string', min: 1 },
    });

    const { phone, password } = ctx.request.body;
    const result = await ctx.service.auth.login({ phone, password });

    if (!result.success) {
      ctx.status = 401;
      ctx.body = { code: 401, message: result.message };
      return;
    }

    ctx.body = {
      code: 0,
      message: '登录成功',
      data: { token: result.token, user: result.user },
    };
  }

  // GET /api/auth/me （需要 JWT）
  async me() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const user = await ctx.service.auth.getUserById(userId);

    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }

    ctx.body = { code: 0, data: user };
  }
}

module.exports = AuthController;
