'use strict';

const { Service } = require('egg');

class ProjectService extends Service {
  // 列出租户下所有项目（is_private=1 时只返回自己创建的）
  async list(tenantId, userId) {
    const { app } = this;
    const projects = await app.mysql.query(
      `SELECT id, tenant_id, created_by, name, thumbnail_url, is_private, created_at, updated_at
       FROM projects
       WHERE tenant_id = ? AND (is_private = 0 OR created_by = ?)
       ORDER BY updated_at DESC`,
      [tenantId, userId]
    );
    return projects;
  }

  async create({ tenantId, userId, name, is_private = 0 }) {
    const { app } = this;
    const now = new Date();
    const result = await app.mysql.insert('projects', {
      tenant_id: tenantId,
      created_by: userId,
      name,
      is_private,
      scene_json: null,
      thumbnail_url: null,
      created_at: now,
      updated_at: now,
    });
    return {
      id: result.insertId,
      tenant_id: tenantId,
      created_by: userId,
      name,
      is_private,
      created_at: now,
      updated_at: now,
    };
  }

  // 详情：租户内所有人都可以查看共享项目；私有项目只有创建者可查
  async findById(id, tenantId, userId) {
    const { app } = this;
    const rows = await app.mysql.query(
      `SELECT * FROM projects
       WHERE id = ? AND tenant_id = ? AND (is_private = 0 OR created_by = ?)
       LIMIT 1`,
      [id, tenantId, userId]
    );
    return rows[0] || null;
  }

  async update(id, tenantId, userId, updates) {
    const { app } = this;
    const data = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.scene_json !== undefined) data.scene_json = updates.scene_json;
    if (updates.thumbnail_url !== undefined) data.thumbnail_url = updates.thumbnail_url;
    if (updates.is_private !== undefined) data.is_private = updates.is_private;
    data.updated_at = new Date();

    // 只有创建者才能修改
    const result = await app.mysql.update('projects', data, {
      where: { id, tenant_id: tenantId, created_by: userId },
    });
    return result.affectedRows > 0;
  }

  async remove(id, tenantId, userId) {
    const { app } = this;
    // 只有创建者才能删除
    const result = await app.mysql.delete('projects', {
      id,
      tenant_id: tenantId,
      created_by: userId,
    });
    return result.affectedRows > 0;
  }
}

module.exports = ProjectService;
