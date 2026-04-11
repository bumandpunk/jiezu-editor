'use strict';

const { Service } = require('egg');

class ProjectService extends Service {
  async list(userId) {
    const { app } = this;
    const projects = await app.mysql.select('projects', {
      where: { user_id: userId },
      orders: [['updated_at', 'desc']],
      columns: ['id', 'name', 'thumbnail_url', 'is_private', 'created_at', 'updated_at'],
    });
    return projects;
  }

  async create({ userId, name, is_private = 0 }) {
    const { app } = this;
    const now = new Date();
    const result = await app.mysql.insert('projects', {
      user_id: userId,
      name,
      is_private,
      scene_json: null,
      thumbnail_url: null,
      created_at: now,
      updated_at: now,
    });
    return {
      id: result.insertId,
      name,
      is_private,
      created_at: now,
      updated_at: now,
    };
  }

  async findById(id, userId) {
    const { app } = this;
    const project = await app.mysql.get('projects', { id, user_id: userId });
    return project || null;
  }

  async update(id, userId, updates) {
    const { app } = this;
    // 过滤掉 undefined 字段
    const data = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.scene_json !== undefined) data.scene_json = updates.scene_json;
    if (updates.thumbnail_url !== undefined) data.thumbnail_url = updates.thumbnail_url;
    if (updates.is_private !== undefined) data.is_private = updates.is_private;
    data.updated_at = new Date();

    const result = await app.mysql.update('projects', data, {
      where: { id, user_id: userId },
    });
    return result.affectedRows > 0;
  }

  async remove(id, userId) {
    const { app } = this;
    const result = await app.mysql.delete('projects', { id, user_id: userId });
    return result.affectedRows > 0;
  }
}

module.exports = ProjectService;
