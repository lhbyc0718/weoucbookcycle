# WeOUC BookCycle

![BookCycle](https://img.shields.io/badge/version-1.0.0-blue)
![Go](https://img.shields.io/badge/go-1.25-brightgreen)
![React](https://img.shields.io/badge/react-18+-brightgreen)
![WeChat MiniProgram](https://img.shields.io/badge/WeChat-MiniProgram-brightgreen)

一个**双前端单后端**的二手书籍交易平台，支持 Web 网站和微信小程序两种访问方式，使用 Go + React 开发。

## 🎯 项目特性

### 核心功能

- **📚 书籍管理**
  - 发布、编辑、删除书籍信息
  - 书籍搜索和分类浏览
  - 热门推荐和个性化推荐

- **💬 实时聊天**
  - WebSocket 实时通信
  - 聊天记录存储
  - 未读消息计数

- **❤️ 加入购物清单**
  - 添加希望购买的书籍到愿望单
  - 快速路由到卖家

- **⭐ 用户评价系统**
  - 购买完成后评价卖家信誉
  - 用户信誉等级展示

- **🔐 认证系统**
  - 邮箱注册与登录
  - 微信小程序一键登录
  - JWT token 管理
  - 密码重置和邮件验证

- **📤 文件上传**
  - 支持本地存储或对象存储（S3/MinIO/阿里 OSS）
  - 图片拍照预览
  - 缩略图生成（可选）

### 架构亮点

- ✅ **单一后端服务**：统一的 Go API 服务所有平台
- ✅ **双前端客户端**：
  - **Web**（React + Vite）：现代化的响应式网页版
  - **微信小程序**（WeChat MiniProgram）：原生小程序开发
- ✅ **可扩展对象存储**：切换本地/云存储只需改环境变量
- ✅ **Redis 缓存**：可选的性能优化
- ✅ **WebSocket 聊天**：数据库与实时通信并行
- ✅ **环境隔离**：开发/测试/生产模式清晰区分

---

## 📂 项目结构

```
weoucbookcycle/
│
├── backend/                           # 后端 (Go)
│   └── weoucbookcycle_go/
│       ├── config/                    # 配置管理 (DB, Redis, Storage, JWT)
│       ├── controllers/               # API 控制器
│       ├── models/                    # 数据模型
│       ├── services/                  # 业务逻辑
│       ├── routes/                    # 路由定义
│       ├── middleware/                # 中间件 (Auth, CORS, Logger)
│       ├── utils/                     # 工具函数 (上传、验证、加密)
│       ├── websocket/                 # WebSocket 聊天处理
│       ├── main.go                    # 入口程序
│       ├── go.mod & go.sum            # 依赖管理
│       ├── .env.example               # 环境变量示例
│       └── README.md                  # 后端专项说明
│
├── frontend/                          # 前端
│   ├── web/                           # Web 版本 (React + Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/              # API 调用接口
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json               # npm 依赖
│   │   ├── vite.config.ts
│   │   ├── .env.example
│   │   ├── README.md
│   │   └── index.html
│   │
│   └── weapp/                         # 微信小程序版本
│       ├── app.js                     # 全局应用配置
│       ├── app.json                   # 小程序配置
│       ├── pages/                     # 页面组件
│       ├── cloudfunctions/            # 云函数（可选）
│       ├── project.config.json        # 微信开发者工具配置
│       ├── README.md
│       └── ...
│
└── README.md                          # 项目总体说明（本文件）
```

---

## 🚀 快速开始

### 前置要求

- **Node.js** >= 16.0（Web 前端和 npm 包管理）
- **Go** >= 1.20（后端服务）
- **MySQL** >= 5.7（数据库）
- **Redis**（可选，用于缓存和消息队列）
- **微信开发者工具**（可选，用于开发微信小程序）

### 1️⃣ 克隆项目

```bash
git clone https://github.com/lhbyc0718/weoucbookcycle_1.git
cd weoucbookcycle_1
```

### 2️⃣ 后端部署

#### 2.1 配置环境

进入后端目录并复制环境文件：

```bash
cd backend/weoucbookcycle_go
cp .env.example .env
```

编辑 `.env` 文件，根据你的环境填入相应参数：

```dotenv
# 服务器配置
SERVER_PORT=8080                  # API 服务端口
GIN_MODE=debug                    # 开发模式: debug / release
API_BASE=http://localhost:8080    # 供前端调用的 API 基地址

# 数据库配置（MySQL）
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=weoucbookcycle
DB_CHARSET=utf8mb4

# JWT 密钥（生产环境必须更改！）
JWT_SECRET=your-super-secret-jwt-key-change-this

# Redis 配置（可选）
REDIS_ENABLED=true
REDIS_ADDR=localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# 邮件配置（SMTP，用于发送验证码和重置密码）
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=your_email@qq.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=your_email@qq.com
FROM_NAME=WeOUC BookCycle

# 对象存储配置（可选，不配置则使用本地 ./uploads）
# 支持 AWS S3、MinIO、DigitalOcean Spaces、阿里 OSS 等
STORAGE_PROVIDER=s3
STORAGE_ENDPOINT=s3.amazonaws.com
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key
STORAGE_BUCKET=your_bucket_name
STORAGE_REGION=us-east-1
STORAGE_USE_SSL=true
STORAGE_PUBLIC_URL=https://cdn.example.com  # 可选，用于 CDN 加速
```

#### 2.2 初始化数据库

确保 MySQL 已启动，然后运行：

```bash
# 数据库将在程序启动时自动迁移（若 ENABLE_AUTO_MIGRATE=true）
```

#### 2.3 启动后端服务

```bash
go run main.go
```

或编译并运行：

```bash
go build -o bin/server ./...
./bin/server  # Windows: .\bin\server.exe
```

服务将在 `http://localhost:8080` 启动。可通过 `http://localhost:8080/health` 检查健康状态。

---

### 3️⃣ Web 前端部署

#### 3.1 配置环境

```bash
cd frontend/web
cp .env.example .env.local
```

编辑 `.env.local`：

```dotenv
# API 后端地址
VITE_API_BASE_URL=http://localhost:8080

# （可选）其他 API 或第三方服务
GEMINI_API_KEY=your_gemini_key
APP_URL=http://localhost:5173
```

#### 3.2 安装依赖

```bash
npm install
```

#### 3.3 本地开发

```bash
npm run dev
```

Web 应用将在 `http://localhost:5173` 启动。

#### 3.4 生产构建

```bash
npm run build
```

生成的 `dist` 目录可部署到任何静态服务器或配置后端的 `SERVE_WEB=true` 由 Go 服务直接托管。

---

### 4️⃣ 微信小程序部署

#### 4.1 准备工作

1. 在 [微信开发平台](https://mp.weixin.qq.com/) 注册或登录
2. 创建小程序，获取 **AppID**
3. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

#### 4.2 配置小程序

进入小程序目录：

```bash
cd frontend/weapp
```

编辑 `app.js` 配置 API 基地址：

```javascript
globalData: {
  apiBase: 'https://your-backend-domain.com'  // 修改为你的后端地址
}
```

或通过云环境配置 `ext.json`：

```json
{
  "apiBase": "https://your-backend-domain.com"
}
```

#### 4.3 在开发者工具中打开

1. 打开微信开发者工具
2. 点击 **新建项目**
3. 选择 `frontend/weapp` 目录
4. 输入你的 **AppID**
5. 点击 **新建**

#### 4.4 开发与测试

- 在左侧编辑器修改代码，右侧实时预览
- 使用 **手机预览** 扫二维码在真机测试
- 点击 **上传** 提交审核

---

## 🔧 环境变量详解

### 后端（`backend/weoucbookcycle_go/.env`）

| 变量名 | 示例值 | 说明 | 必需 |
|--------|--------|------|------|
| `SERVER_PORT` | `8080` | API 服务端口 | ✅ |
| `GIN_MODE` | `debug` | 运行模式（debug/release） | ✅ |
| `API_BASE` | `http://localhost:8080` | 供前端调用的后端地址 | ✅ |
| `DB_HOST` | `localhost` | MySQL 主机 | ✅ |
| `DB_PORT` | `3306` | MySQL 端口 | ✅ |
| `DB_USER` | `root` | MySQL 用户 | ✅ |
| `DB_PASSWORD` | `password` | MySQL 密码 | ✅ |
| `DB_NAME` | `weoucbookcycle` | 数据库名 | ✅ |
| `JWT_SECRET` | `your-secret` | JWT 签密钥（生产必改！） | ✅ |
| `REDIS_ENABLED` | `true` | 是否启用 Redis | ❌ |
| `REDIS_ADDR` | `localhost:6379` | Redis 地址 | ❌ |
| `SMTP_HOST` | `smtp.qq.com` | SMTP 服务器 | ❌ |
| `SMTP_PORT` | `465` | SMTP 端口 | ❌ |
| `SMTP_USER` | `xxx@qq.com` | 发件邮箱 | ❌ |
| `SMTP_PASSWORD` | `app_password` | 邮箱应用密码 | ❌ |
| `STORAGE_PROVIDER` | `s3` | 存储提供商（s3/minio/本地） | ❌ |
| `STORAGE_ENDPOINT` | `s3.amazonaws.com` | 对象存储端点 | ❌ |
| `STORAGE_ACCESS_KEY` | `xxx` | 存储访问密钥 | ❌ |
| `STORAGE_SECRET_KEY` | `xxx` | 存储密钥 | ❌ |
| `STORAGE_BUCKET` | `bucket-name` | 存储桶名 | ❌ |
| `ALLOW_ORIGINS` | `http://localhost:3000,http://localhost:5173` | CORS 允许的源 | ✅ |

### 前端 Web（`frontend/web/.env.local`）

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | 后端 API 地址 |
| `GEMINI_API_KEY` | `xxx` | Gemini AI 密钥（可选） |
| `APP_URL` | `http://localhost:5173` | Web 应用本身的 URL |

### 微信小程序（`frontend/weapp/app.js`）

在 `app.js` 中配置：

```javascript
globalData: {
  apiBase: 'https://your-backend.com'  // 对应后端的 API_BASE
}
```

---

## 📝 API 端点概览

所有 API 均在 `/api` 下，主要分组如下：

### 认证（`/api/auth`）
- `POST /register` - 用户注册
- `POST /login` - 邮箱登录
- `POST /wechat` - 微信登录
- `POST /refresh` - 刷新 Token

### 用户（`/api/users`）
- `GET /me` - 获取当前用户信息
- `GET /:id` - 获取用户档案
- `PUT /profile` - 更新个人资料
- `POST /wishlist/toggle` - 添加/移除愿望单

### 书籍（`/api/books`）
- `GET /` - 获取书籍列表
- `GET /hot` - 热门书籍
- `GET /:id` - 书籍详情
- `POST /` - 发布书籍
- `PUT /:id` - 编辑书籍
- `DELETE /:id` - 删除书籍

### 聊天（`/api/chats`）
- `GET /` - 获取聊天会话列表
- `GET /:id/messages` - 获取聊天记录
- `POST /:id/messages` - 发送消息
- **WebSocket**: `GET /ws` - 实时通信

### 发布（`/api/listings`）
- `GET /mine` - 我的发布
- `POST /` - 新建发布

更多端点详见[后端 README](./backend/weoucbookcycle_go/README.md)。

---

## 🔒 安全建议

1. **生产环境必做**
   - ✅ 修改 `JWT_SECRET` 为强随机字符串
   - ✅ 使用生产环境的 MySQL 用户和强密码
   - ✅ 启用 HTTPS/TLS
   - ✅ 限制 CORS 源（`ALLOW_ORIGINS`）
   - ✅ 移除或禁用调试日志（`GIN_MODE=release`）

2. **邮件与存储**
   - 不要在代码中硬编码敏感信息，全部使用环境变量
   - SMTP 密码使用应用专用密码而非账户密码
   - 如使用对象存储，配置访问控制和 CORS 策略

3. **数据库**
   - 定期备份
   - 设置适当的访问权限
   - 生产环境使用 SSL/TLS 连接

---

## 📚 进一步了解

- [后端详细说明](./backend/weoucbookcycle_go/README.md)
- [Web 前端说明](./frontend/web/README.md)
- [微信小程序说明](./frontend/weapp/README.md)

---

## 📞 问题排查

### 后端连接数据库失败

**症状**：`Error: Unknown database driver or bad connection string`

**解决**：
1. 检查 MySQL 是否运行
2. 验证 `DB_HOST`, `DB_USER`, `DB_PASSWORD` 是否正确
3. 确保数据库存在或让程序自动创建（`ENABLE_AUTO_MIGRATE=true`）

### 前端无法连接后端

**症状**：`API request failed: CORS error` 或网络超时

**解决**：
1. 检查 `VITE_API_BASE_URL` 是否指向正确的后端地址
2. 验证后端的 `ALLOW_ORIGINS` 包含前端的域名
3. 确认后端服务已启动（`http://localhost:8080/health`）

### 上传文件失败

**症状**：上传返回 500 或保存失败

**解决**：
1. 检查本地 `./uploads` 目录是否可写
2. 若使用对象存储，验证 `STORAGE_ENDPOINT`, 凭证和桶名配置
3. 检查文件大小是否超过 `MaxFileSize`

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 改进项目！

---

## 👨‍💻 开发者

- 后端架构和 API 设计
- Web 前端（React + Vite）
- 微信小程序集成
- 对象存储和部署优化

---

**最后更新**: 2026 年 3 月 5 日
