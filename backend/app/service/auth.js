'use strict';

const { Service } = require('egg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService extends Service {
  async register({ phone, password }) {
    const { app } = this;

    const existing = await app.mysql.get('users', { phone });
    if (existing) {
      return { success: false, message: '该手机号已被注册' };
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await app.mysql.insert('users', {
      phone,
      password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const user = { id: result.insertId, phone };
    const token = this._signToken(user);
    return { success: true, token, user };
  }

  async login({ phone, password }) {
    const { app } = this;

    const user = await app.mysql.get('users', { phone });
    if (!user) {
      return { success: false, message: '手机号或密码错误' };
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return { success: false, message: '手机号或密码错误' };
    }

    const userInfo = { id: user.id, phone: user.phone };
    const token = this._signToken(userInfo);
    return { success: true, token, user: userInfo };
  }

  async getUserById(id) {
    const { app } = this;
    const user = await app.mysql.get('users', { id });
    if (!user) return null;
    return { id: user.id, phone: user.phone };
  }

  _signToken(payload) {
    const { app } = this;
    return jwt.sign(payload, app.config.jwt.secret, {
      expiresIn: app.config.jwt.expiresIn,
    });
  }
}

module.exports = AuthService;
