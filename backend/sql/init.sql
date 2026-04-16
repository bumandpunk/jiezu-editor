-- 捷租先登建造工具 数据库初始化脚本
-- 执行前请先创建数据库：CREATE DATABASE jiezu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE jiezu;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `phone`         VARCHAR(20) DEFAULT NULL UNIQUE COMMENT '手机号',
  `sso_id`        VARCHAR(64) DEFAULT NULL UNIQUE COMMENT 'SSO 登录标识（sso_{tenantId}_{userId}）',
  `tenant_id`     INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ESO 租户 ID（SSO 用户专用）',
  `password_hash` VARCHAR(100) DEFAULT NULL COMMENT '加密密码',
  `avatar_url`    VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 项目表
CREATE TABLE IF NOT EXISTS `projects` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id`     INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ESO 租户 ID，同租户共享项目',
  `created_by`    INT UNSIGNED NOT NULL COMMENT '创建者 user_id',
  `name`          VARCHAR(100) NOT NULL COMMENT '项目名称',
  `scene_json`    LONGTEXT DEFAULT NULL COMMENT '场景数据 JSON',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '缩略图',
  `is_private`    TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否私有（0=租户共享，1=仅本人可见）',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tenant_id` (`tenant_id`),
  INDEX `idx_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目表';

-- 已有数据库的迁移语句（新部署可忽略此段）
-- ALTER TABLE users ADD COLUMN `tenant_id` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ESO 租户 ID' AFTER `sso_id`;
-- ALTER TABLE users ADD INDEX `idx_tenant_id` (`tenant_id`);
-- ALTER TABLE projects ADD COLUMN `tenant_id` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ESO 租户 ID' AFTER `id`;
-- ALTER TABLE projects ADD COLUMN `created_by` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建者 user_id' AFTER `tenant_id`;
-- ALTER TABLE projects ADD INDEX `idx_tenant_id` (`tenant_id`);
-- UPDATE projects p JOIN users u ON p.user_id = u.id SET p.tenant_id = u.tenant_id, p.created_by = p.user_id WHERE u.tenant_id > 0;
