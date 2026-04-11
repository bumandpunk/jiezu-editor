# 锦绣编辑器

```
editor/
├── frontend/      # Next.js 前端应用（入口：frontend/editor）
├── packages/      # 前端公共包（editor、viewer、core 等）
├── backend/       # EggJS 后端服务（API + 数据库）
├── DEPLOY.md      # 线上部署手册
└── tooling/       # 工具链配置
```

## 前端（frontend/editor）

基于 Next.js 16 + React Three Fiber 的 3D 建造编辑器。

### 本地开发

```bash
# 根目录安装依赖（monorepo）
npm install

# 启动前端开发服务器（端口 3002）
cd frontend/editor && npm run dev
```

## 后端（backend/）

基于 EggJS 的 REST API 服务。

### 本地开发

```bash
cd backend
npm install
npm run dev    # 端口 7001
```

### 环境变量

复制并编辑本地配置：

```bash
# backend/config/config.local.js 已有本地配置模板
# 线上需创建 backend/config/config.prod.js（不进 git）
```

## 部署

详见 [DEPLOY.md](./DEPLOY.md)
