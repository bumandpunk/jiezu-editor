'use strict';

module.exports = appInfo => {
  const config = {};

  // 本地开发允许 pc-admin 和 3d-builder 自身的 origin
  config.cors = {
    origin: (ctx) => {
      const allowed = [
        'http://10.10.80.13:3002',
        'http://10.10.80.13:5173',
        'http://10.10.80.13:5174',
      ];
      const origin = ctx.get('Origin');
      return allowed.includes(origin) ? origin : '';
    },
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  return config;
};
