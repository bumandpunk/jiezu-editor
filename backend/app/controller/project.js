'use strict';

const { Controller } = require('egg');

class ProjectController extends Controller {
  // 从 JWT payload 解析租户ID和用户ID
  _getTenantAndUser() {
    const { id: userId, tenantId } = this.ctx.state.user;
    return { userId, tenantId: Number(tenantId) || 0 };
  }

  // GET /api/projects
  async index() {
    const { ctx } = this;
    const { userId, tenantId } = this._getTenantAndUser();
    const projects = await ctx.service.project.list(tenantId, userId);
    ctx.body = { code: 0, data: projects };
  }

  // POST /api/projects
  async create() {
    const { ctx } = this;
    ctx.validate({ name: { type: 'string', min: 1, max: 100 } });
    const { userId, tenantId } = this._getTenantAndUser();
    const { name, is_private = 0 } = ctx.request.body;
    const project = await ctx.service.project.create({ tenantId, userId, name, is_private });
    ctx.status = 201;
    ctx.body = { code: 0, data: project };
  }

  // GET /api/projects/:id
  async show() {
    const { ctx } = this;
    const { userId, tenantId } = this._getTenantAndUser();
    const project = await ctx.service.project.findById(ctx.params.id, tenantId, userId);

    if (!project) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '项目不存在或无权限查看' };
      return;
    }

    if (project.scene_json) {
      try { project.scene = JSON.parse(project.scene_json); } catch { project.scene = null; }
      delete project.scene_json;
    }

    ctx.body = { code: 0, data: project };
  }

  // PUT /api/projects/:id
  async update() {
    const { ctx } = this;
    const { userId, tenantId } = this._getTenantAndUser();
    const { name, scene, thumbnail_url, is_private } = ctx.request.body;

    const ok = await ctx.service.project.update(ctx.params.id, tenantId, userId, {
      name,
      scene_json: scene ? JSON.stringify(scene) : undefined,
      thumbnail_url,
      is_private,
    });

    if (!ok) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '项目不存在或无权限修改' };
      return;
    }

    ctx.body = { code: 0, message: '保存成功' };
  }

  // DELETE /api/projects/:id
  async destroy() {
    const { ctx } = this;
    const { userId, tenantId } = this._getTenantAndUser();
    const ok = await ctx.service.project.remove(ctx.params.id, tenantId, userId);

    if (!ok) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '项目不存在或无权限删除' };
      return;
    }

    ctx.body = { code: 0, message: '删除成功' };
  }
}

module.exports = ProjectController;
