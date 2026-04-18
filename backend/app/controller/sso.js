'use strict';

const { Controller } = require('egg');
const jwt = require('jsonwebtoken');

class SsoController extends Controller {
  // POST /api/sso/exchange
  // body: { ticket: string }
  // 向 eso 主系统验证 ticket，换取 jiezu_token
  async exchange() {
    const { ctx, app } = this;
    const ESO_API = app.config.esoApi || process.env.ESO_API_URL || 'http://10.10.80.40:7001';
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

    // 用 eso tenantId + userId 作为唯一标识，存入 sso_id 字段
    const ssoId = `sso_${esoUser.tenantId}_${esoUser.userId}`;
    const tenantId = Number(esoUser.tenantId);

    // 查找或自动创建用户，同时确保 tenant_id 字段最新
    let user = await app.mysql.get('users', { sso_id: ssoId });
    if (!user) {
      const now = new Date();
      const result = await app.mysql.insert('users', {
        sso_id: ssoId,
        tenant_id: tenantId,
        phone: null,
        password_hash: null,
        avatar_url: null,
        created_at: now,
        updated_at: now,
      });
      user = { id: result.insertId, sso_id: ssoId, tenant_id: tenantId };
    } else if (user.tenant_id !== tenantId) {
      // 兼容旧数据：tenant_id 字段缺失时补填
      await app.mysql.update('users', { tenant_id: tenantId }, { where: { id: user.id } });
      user.tenant_id = tenantId;
    }

    // 签发 jiezu_token，payload 中携带 tenantId 供后续接口直接使用
    const token = jwt.sign(
      { id: user.id, sso_id: user.sso_id, tenantId, esoUserId: esoUser.userId },
      app.config.jwt.secret,
      { expiresIn: app.config.jwt.expiresIn }
    );

    ctx.body = {
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          realName: esoUser.realName,
        },
      },
    };
  }
}

module.exports = SsoController;
