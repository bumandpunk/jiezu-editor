'use strict';

module.exports = appInfo => {
  const config = {};

  // 本地开发允许所有 origin
  config.cors = {
    origin: 'http://localhost:3002',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  return config;
};
