'use strict';

module.exports = () => {
  const config = {};

  // 应用密钥
  config.keys = 'jiezu_secret_2026';

  // 关闭 CSRF（纯 API 项目）
  config.security = {
    csrf: { enable: false },
  };

  // CORS 配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // JWT 配置
  config.jwt = {
    secret: 'jiezu_jwt_secret_2026',
    expiresIn: '7d',
  };

  // MySQL 配置
  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'jiezu',
    },
    app: true,
    agent: false,
  };

  // ESO 主系统后端地址（供 SSO ticket 验证用）
  config.esoApi = process.env.ESO_API_URL || 'http://localhost:7001';
  config.cos = {
    secretId: process.env.COS_SECRET_ID || '',
    secretKey: process.env.COS_SECRET_KEY || '',
    bucket: process.env.COS_BUCKET || 'hso-1256704435',
    region: process.env.COS_REGION || 'ap-guangzhou',
    domain: process.env.COS_DOMAIN || '',
  };

  // 腾讯云 COS 配置
 
  // multipart 上传大小限制（提高到 500MB）
  config.multipart = {
    mode: 'stream',
    fileSize: '500mb',
    // 扩展允许的文件类型（egg 默认不含 glb/gltf/obj 等模型格式）
    // whitelist 为 null 时，fileExtensions 追加到内置白名单；whitelist 为数组时完全替换，不能设为路由
    fileExtensions: [ '.glb', '.gltf', '.obj', '.mtl', '.zip' ],
  };

  // 中间件
  config.middleware = [];

  // 关闭 bodyParser 大小限制（场景 JSON 可能较大）
  config.bodyParser = {
    jsonLimit: '50mb',
    formLimit: '50mb',
  };

  return config;
};
