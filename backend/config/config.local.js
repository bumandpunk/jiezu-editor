'use strict';

module.exports = appInfo => {
  const config = {};

  // 本地开发允许 pc-admin 和 3d-builder 自身的 origin
  config.cors = {
    origin: (ctx) => {
      const allowed = [
        'http://localhost:3002',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://10.10.80.40:3002',
        'http://10.10.80.40:5173',
        'http://10.10.80.40:5174',
      ];
      const origin = ctx.get('Origin');
      return allowed.includes(origin) ? origin : '';
    },
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // 本地开发时，ESO 主系统后端地址
  config.esoApi = process.env.ESO_API_URL || 'http://localhost:7001';

  return config;
};
