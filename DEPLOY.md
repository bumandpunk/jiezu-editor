# 锦绣编辑器 · 线上部署手册

> 适用版本：当前主分支  
> 技术栈：Next.js 前端 + EggJS 后端 + MySQL 8.0 + 腾讯云 COS  
> 建议操作系统：Ubuntu 22.04 LTS

---

## 目录

1. [服务器要求](#1-服务器要求)
2. [基础环境安装](#2-基础环境安装)
3. [MySQL 初始化](#3-mysql-初始化)
4. [后端部署（EggJS）](#4-后端部署eggjs)
5. [前端部署（Next.js）](#5-前端部署nextjs)
6. [Nginx 反向代理](#6-nginx-反向代理)
7. [进程管理（PM2）](#7-进程管理pm2)
8. [环境变量说明](#8-环境变量说明)
9. [后续更新流程](#9-后续更新流程)
10. [常见问题](#10-常见问题)

---

## 1. 服务器要求

| 项目 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2 核 | 4 核 |
| 内存 | 2 GB | 4 GB |
| 硬盘 | 20 GB | 50 GB SSD |
| 操作系统 | Ubuntu 20.04+ | Ubuntu 22.04 LTS |
| 开放端口 | 80、443、22 | 同左 |

> **注意**：后端端口 7001 和前端端口 3000 **不需要**对外开放，统一由 Nginx 代理。

---

## 2. 基础环境安装

### 2.1 更新系统

```bash
apt update && apt upgrade -y
```

### 2.2 安装 Node.js 20（推荐用 nvm）

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v   # 应输出 v20.x.x
```

### 2.3 安装 PM2

```bash
npm install -g pm2
pm2 -v
```

### 2.4 安装 Nginx

```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 2.5 安装 MySQL 8.0

```bash
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql

# 安全初始化（设置 root 密码）
mysql_secure_installation
```

---

## 3. MySQL 初始化

```bash
# 登录 MySQL（使用安装时设置的 root 密码）
mysql -u root -p

# 在 MySQL 命令行中执行：
CREATE DATABASE jiezu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jiezu'@'localhost' IDENTIFIED BY '你的数据库密码';
GRANT ALL PRIVILEGES ON jiezu.* TO 'jiezu'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 导入表结构
mysql -u jiezu -p jiezu < /var/www/jiezu/backend/sql/init.sql
```

> **建议**：线上不要直接用 root，新建专用账号 `jiezu`。

---

## 4. 后端部署（EggJS）

### 4.1 上传代码

前后端在同一个仓库，克隆一次即可（如果前端已经克隆，跳过此步）：

```bash
git clone https://你的git地址/editor.git /var/www/jiezu
```

### 4.2 安装依赖

```bash
cd /var/www/jiezu/backend
npm install --production
```

### 4.3 创建生产环境配置

```bash
# 创建 config/config.prod.js（此文件不进 git，内含敏感信息）
cat > /var/www/jiezu/backend/config/config.prod.js << 'EOF'
'use strict';

module.exports = () => {
  const config = {};

  config.keys = '修改为随机长字符串_生产密钥';

  config.logger = {
    dir: '/var/log/jiezu-backend',
  };

  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: 3306,
      user: 'jiezu',
      password: '你的数据库密码',
      database: 'jiezu',
    },
    app: true,
    agent: false,
  };

  config.jwt = {
    secret: '修改为随机长字符串_JWT密钥',
    expiresIn: '7d',
  };

  config.cors = {
    origin: 'https://你的前端域名',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // 腾讯云 COS（密钥从环境变量读取，不要写死在此文件）
  config.cos = {
    secretId: process.env.COS_SECRET_ID || '',
    secretKey: process.env.COS_SECRET_KEY || '',
    bucket: process.env.COS_BUCKET || 'your-bucket-1256704435',
    region: process.env.COS_REGION || 'ap-guangzhou',
    domain: process.env.COS_DOMAIN || '',   // 自定义 CDN 域名，留空则用默认 COS 域名
  };

  return config;
};
EOF
```

> **COS 密钥设置方式**（二选一）：
>
> 方式 A — 写入服务器环境变量（推荐）：
> ```bash
> # 追加到 /etc/environment，重启后永久生效
> echo 'COS_SECRET_ID=AKIDxxxxx' >> /etc/environment
> echo 'COS_SECRET_KEY=xxxxxxxx' >> /etc/environment
> echo 'COS_BUCKET=your-bucket-1256704435' >> /etc/environment
> echo 'COS_REGION=ap-guangzhou' >> /etc/environment
> # echo 'COS_DOMAIN=https://cdn.你的域名.com' >> /etc/environment  # 可选
> source /etc/environment
> ```
>
> 方式 B — 直接写进 `config.prod.js`（简单但有泄露风险，确保此文件不进 git）：
> ```js
> config.cos = {
>   secretId: 'AKIDxxxxx',
>   secretKey: 'xxxxxxxx',
>   bucket: 'your-bucket-1256704435',
>   region: 'ap-guangzhou',
>   domain: '',
> };
> ```

### 4.4 创建日志目录

```bash
mkdir -p /var/log/jiezu-backend
```

### 4.5 用 egg-scripts 启动后端

```bash
cd /var/www/jiezu/backend

# EggJS 生产模式（daemon 模式，自带多进程）
EGG_SERVER_ENV=prod npm run start

# 验证
curl http://127.0.0.1:7001/api/health
# 期望返回：{"status":"ok","time":"..."}
```

> `npm run start` 即 `egg-scripts start --daemon --title=jiezu-backend`，EggJS 自带进程守护，无需额外 PM2 管理后端。

**停止后端：**
```bash
cd /var/www/jiezu/backend && npm run stop
```

---

## 5. 前端部署（Next.js）

### 5.1 克隆仓库并安装依赖

```bash
# 前后端在同一仓库，如后端已克隆则跳过 git clone
git clone https://你的git地址/editor.git /var/www/jiezu

cd /var/www/jiezu
npm install
```

### 5.2 创建环境变量文件

```bash
cat > /var/www/jiezu/frontend/editor/.env.production << 'EOF'
# 后端 API 地址（EggJS，填写你的域名）
NEXT_PUBLIC_API_URL=https://api.你的域名.com
EOF
```

### 5.3 构建

```bash
cd /var/www/jiezu
# 构建前端（monorepo 结构，在根目录执行）
npm run build --workspace=frontend/editor
# 或者直接进子目录
cd frontend/editor && npm run build
```

### 5.4 用 PM2 启动前端

```bash
cd /var/www/jiezu/frontend/editor

pm2 start npm --name "jiezu-frontend" -- start
pm2 save
pm2 startup   # 按提示执行输出的命令，设置开机自启
```

> Next.js `npm run start` 默认监听 3000 端口。

---

## 6. Nginx 反向代理

创建 Nginx 站点配置（前后端同域，通过路径区分）：

```bash
cat > /etc/nginx/sites-available/jiezu << 'EOF'
server {
    listen 80;
    server_name 你的域名.com www.你的域名.com;

    # 前端
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:7001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 文件上传大小限制
        client_max_body_size 50m;
    }
}
EOF

# 启用站点
ln -s /etc/nginx/sites-available/jiezu /etc/nginx/sites-enabled/
nginx -t   # 检查配置语法
systemctl reload nginx
```

### 配置 HTTPS（推荐，使用 Let's Encrypt）

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d 你的域名.com -d www.你的域名.com
# 按提示操作，certbot 会自动修改 Nginx 配置并续期
```

---

## 7. 进程管理（PM2）

前端进程用 PM2 管理，常用命令：

```bash
pm2 list              # 查看所有进程状态
pm2 logs jiezu-frontend   # 查看前端日志
pm2 restart jiezu-frontend
pm2 stop jiezu-frontend
pm2 delete jiezu-frontend
```

后端由 EggJS 自带的 `egg-scripts` 管理：

```bash
cd /var/www/jiezu/backend
npm run start   # 启动
npm run stop    # 停止

# 查看后端日志
tail -f /var/log/jiezu-backend/jiezu-backend-web.log
tail -f /var/log/jiezu-backend/common-error.log
```

---

## 8. 环境变量说明

所有敏感配置**不要写死在代码里**，通过环境变量或 `config.prod.js` 注入。

### 后端（服务器系统级环境变量，供 `config.default.js` 读取）

| 变量名 | 必填 | 说明 | 获取方式 |
|--------|:----:|------|---------|
| `COS_SECRET_ID` | ✅ | 腾讯云 COS SecretId | 腾讯云控制台 → 访问管理 → API 密钥 |
| `COS_SECRET_KEY` | ✅ | 腾讯云 COS SecretKey | 同上 |
| `COS_BUCKET` | ✅ | COS Bucket 名称（含 AppId） | COS 控制台，如 `hso-1256704435` |
| `COS_REGION` | ✅ | COS 地域标识 | COS 控制台，如 `ap-guangzhou` |
| `COS_DOMAIN` | ☐ | 自定义 CDN 域名 | 留空则用 COS 默认域名 |

```bash
# 写入服务器，重启后永久生效
echo 'COS_SECRET_ID=AKIDxxxxx' >> /etc/environment
echo 'COS_SECRET_KEY=xxxxxxxx' >> /etc/environment
echo 'COS_BUCKET=your-bucket-1256704435' >> /etc/environment
echo 'COS_REGION=ap-guangzhou' >> /etc/environment
source /etc/environment
```

### 前端（`frontend/editor/.env.production`）

| 变量名 | 必填 | 说明 |
|--------|:----:|------|
| `NEXT_PUBLIC_API_URL` | ✅ | 后端 EggJS API 基础地址，如 `https://api.xxx.com` |

---

## 9. 后续更新流程

每次有新版本，按以下步骤更新：

### 更新后端

```bash
cd /var/www/jiezu
git pull                                    # 拉取最新代码
cd backend
npm install --production                    # 如有新依赖
npm run stop                                # 停止旧进程
EGG_SERVER_ENV=prod npm run start           # 启动新进程
curl http://127.0.0.1:7001/api/health       # 验证
```

### 更新前端

```bash
cd /var/www/jiezu
git pull
npm install
cd frontend/editor && npm run build         # 重新构建
pm2 restart jiezu-frontend                  # 重启
```

---

## 10. 常见问题

**Q: 后端启动后 `curl /api/health` 无响应？**  
A: 检查日志 `tail -f /var/log/jiezu-server/common-error.log`，通常是 MySQL 连接失败或端口被占用 (`lsof -i:7001`)。

**Q: 前端请求 API 报 CORS 错误？**  
A: 检查 `config/config.prod.js` 中 `config.cors.origin` 是否与前端域名完全一致（包括 `https://`）。

**Q: 上传文件报 413 错误？**  
A: Nginx `client_max_body_size` 未设置或太小，确认 `/etc/nginx/sites-available/jiezu` 中已有 `client_max_body_size 50m`。

**Q: 数据库连接报 `ER_ACCESS_DENIED_ERROR`？**  
A: 检查 `config.prod.js` 中 MySQL 用户名、密码、数据库名是否正确，并确认 MySQL 账号有权限：  
```sql
GRANT ALL PRIVILEGES ON jiezu.* TO 'jiezu'@'localhost';
FLUSH PRIVILEGES;
```

**Q: 页面刷新后显示 404？**  
A: Next.js App Router 需要 Nginx 将所有路径都代理到 3000 端口，当前配置 `location /` 已覆盖，确认 Nginx 已 reload。

---

## 附：目录结构参考

```
/var/www/
└── jiezu/                         # 整个项目仓库（前后端同仓库）
    ├── backend/                   # EggJS 后端
    │   ├── app/
    │   ├── config/
    │   │   ├── config.default.js
    │   │   └── config.prod.js     ← 线上敏感配置（不进 git）
    │   └── sql/init.sql
    └── frontend/editor/           # Next.js 前端
        ├── .env.production        ← 线上环境变量（不进 git）
        └── .next/                 ← 构建产物
```

---

*文档生成时间：2026-04-11*
