'use strict';

const { Controller } = require('egg');

class ProjectController extends Controller {
  // GET /api/projects  列表
  async index() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const projects = await ctx.service.project.list(userId);
    ctx.body = { code: 0, data: projects };
  }

  // POST /api/projects  新建
  async create() {
    const { ctx } = this;
    ctx.validate({
      name: { type: 'string', min: 1, max: 100 },
    });

    const userId = ctx.state.user.id;
    const { name, is_private = 0 } = ctx.request.body;
    const project = await ctx.service.project.create({ userId, name, is_private });
    ctx.status = 201;
    ctx.body = { code: 0, data: project };
  }

  // GET /api/projects/:id  详情（含 scene_json）
  async show() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const project = await ctx.service.project.findById(ctx.params.id, userId);

    if (!project) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '项目不存在' };
      return;
    }

    // 解析 scene_json
    if (project.scene_json) {
      try {
        project.scene = JSON.parse(project.scene_json);
      } catch (e) {
        project.scene = null;
      }
      delete project.scene_json;
    }

    ctx.body = { code: 0, data: project };
  }

  // PUT /api/projects/:id  保存（更新名称或 scene）
  async update() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { name, scene, thumbnail_url, is_private } = ctx.request.body;

    const ok = await ctx.service.project.update(ctx.params.id, userId, {
      name,
      scene_json: scene ? JSON.stringify(scene) : undefined,
      thumbnail_url,
      is_private,
    });

    if (!ok) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '项目不存在或无权限' };
      return;
    }

    ctx.body = { code: 0, message: '保存成功' };
  }

  // DELETE /api/projects/:id  删除
  async destroy() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const ok = await ctx.service.project.remove(ctx.params.id, userId);

    if (!ok) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '项目不存在或无权限' };
      return;
    }

    ctx.body = { code: 0, message: '删除成功' };
  }
}

module.exports = ProjectController;
