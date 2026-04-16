-- 捷租先登建造工具 最新版初始化脚本
-- 用途：新环境首次建库/建表
-- 执行方式：mysql -uroot -p123456 < sql/init.sql

CREATE DATABASE IF NOT EXISTS `jiezu`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `jiezu`;

-- 用户表：本地账号 + SSO 自动落库账号共用
CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `phone`         VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `sso_id`        VARCHAR(64) DEFAULT NULL COMMENT 'SSO 登录标识（sso_{tenantId}_{userId}）',
  `tenant_id`     INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ESO 租户 ID（SSO 用户专用）',
  `password_hash` VARCHAR(100) DEFAULT NULL COMMENT '加密密码',
  `avatar_url`    VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_phone` (`phone`),
  UNIQUE KEY `uk_users_sso_id` (`sso_id`),
  KEY `idx_users_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 项目表：当前版本统一按租户共享模型运行
CREATE TABLE IF NOT EXISTS `projects` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tenant_id`     INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ESO 租户 ID，同租户共享项目',
  `created_by`    INT UNSIGNED NOT NULL COMMENT '创建者 user_id',
  `name`          VARCHAR(100) NOT NULL COMMENT '项目名称',
  `scene_json`    LONGTEXT DEFAULT NULL COMMENT '场景数据 JSON',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '缩略图',
  `is_private`    TINYINT(1) NOT NULL DEFAULT 0 COMMENT '兼容保留字段，当前版本固定为 0（共享）',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_projects_tenant_id` (`tenant_id`),
  KEY `idx_projects_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目表';

-- 说明：
-- 1. 该脚本用于新环境初始化，直接得到当前最新表结构。
-- 2. 当前产品未开放私有项目能力，服务端会统一按共享项目处理。
