'use strict';

const { Controller } = require('egg');
const jwt = require('jsonwebtoken');

// eso 主系统后端地址
const ESO_API = process.env.ESO_API_URL || 'http://localhost:7001';

class SsoController extends Controller {
  // POST /api/sso/exchange
  // body: { ticket: string }
  // 向 eso 主系统验证 ticket，换取 jiezu_token
  async exchange() {
    const { ctx, app } = this;
    const { ticket } = ctx.request.body;

    if (!ticket) {
      ctx.status = 400;
      ctx.body = { code: 400, message: 'ticket 不能为空' };
      return;
    }

    // 调用 eso 主系统验证 ticket
    let esoUser;
    try {
      const res = await ctx.curl(`${ESO_API}/api/sso/verify?ticket=${ticket}`, {
        method: 'GET',
        dataType: 'json',
        timeout: 5000,
      });

      if (res.status !== 200 || res.data.code !== 0) {
        ctx.status = 401;
        ctx.body = { code: 401, message: res.data.message || 'ticket 验证失败' };
        return;
      }

      esoUser = res.data.data;
    } catch (err) {
      ctx.logger.error('[SSO Exchange] 调用 eso 验证接口失败', err);
      ctx.status = 502;
      ctx.body = { code: 502, message: '主系统连接失败，请稍后重试' };
      return;
    }

    // 用 eso userId + tenantId 作为 jiezu 的唯一标识
    // phone 字段用 sso_{tenantId}_{userId} 占位，确保唯一
    const ssoPhone = `sso_${esoUser.tenantId}_${esoUser.userId}`;

    // 查找或自动创建 jiezu 用户
    let user = await app.mysql.get('users', { phone: ssoPhone });
    if (!user) {
      const now = new Date();
      const result = await app.mysql.insert('users', {
        phone: ssoPhone,
        password_hash: 'sso_no_password',
        avatar_url: null,
        created_at: now,
        updated_at: now,
      });
      user = { id: result.insertId, phone: ssoPhone };
    }

    // 签发 jiezu_token
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      app.config.jwt.secret,
      { expiresIn: app.config.jwt.expiresIn }
    );

    ctx.body = {
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          realName: esoUser.realName,
        },
      },
    };
  }
}

module.exports = SsoController;
