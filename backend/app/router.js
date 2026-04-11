'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.jwtAuth();

  // 健康检查
  router.get('/api/health', controller.home.health);
  router.get('/api/debug-jwt', controller.home.debugJwt);

  // 认证
  router.post('/api/auth/register', controller.auth.register);
  router.post('/api/auth/login', controller.auth.login);
  router.get('/api/auth/me', jwt, controller.auth.me);

  // 文件上传（需要登录）
  router.post('/api/upload', jwt, controller.file.upload);

  // 项目（需要登录）
  router.get('/api/projects', jwt, controller.project.index);
  router.post('/api/projects', jwt, controller.project.create);
  router.get('/api/projects/:id', jwt, controller.project.show);
  router.put('/api/projects/:id', jwt, controller.project.update);
  router.delete('/api/projects/:id', jwt, controller.project.destroy);
};
