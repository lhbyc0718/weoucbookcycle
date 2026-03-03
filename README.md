# WeOUC BookCycle

[![Go](https://img.shields.io/badge/Go-1.20+-blue)](https://golang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)](https://www.mysql.com)
[![Node](https://img.shields.io/badge/Node-18+-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**一个基于微信小程序 + Go 后端的二手书交易平台**

前端采用微信小程序API，后端使用Go + Gin + MySQL，支持实时聊天和列表管理。

## ✨ 核心特性

- 📱 **微信小程序前端** - 使用WeChat API的完整功能
- 🚀 **Go后端服务** - 基于Gin框架，高性能并发
- 💾 **MySQL数据库** - 统一存储所有业务数据
- 🔐 **JWT认证** - 可自动刷新的Token机制
- 💬 **实时通信** - WebSocket支持实时消息推送
- 🔍 **搜索功能** - 高效的书籍查询和过滤
- 📊 **完整模型** - 用户、书籍、列表、聊天、消息

## 📦 项目结构

```
weoucbookcycle/
├── backend/
│   └── weoucbookcycle_go/          # Go后端服务
│       ├── config/                 # 配置加载与验证
│       ├── controllers/            # API业务逻辑
│       ├── models/                 # GORM数据模型
│       ├── services/               # 业务服务层
│       ├── routes/                 # 路由定义
│       ├── middleware/             # 中间件（认证、CORS等）
│       ├── websocket/              # WebSocket实现
│       └── utils/                  # 工具函数
│
├── frontend/
│   └── bookcycle--4-/              # 微信小程序
│       ├── pages/                  # 页面逻辑
│       ├── utils/                  # 工具函数（含request.js）
│       ├── components/             # 可复用组件
│       └── app.js                  # 应用入口
│
├── DEVELOPMENT_GUIDE.md            # 详细开发指南（新增）
└── README.md                       # 本文件
```

## 🚀 快速开始

### 前置要求

- **Go 1.20+** - [下载](https://golang.org/dl)
- **MySQL 8.0+** - [下载](https://www.mysql.com/downloads)
- **Node.js 18+** - [下载](https://nodejs.org)
- **微信开发者工具** - 用于小程序开发

### 1. 后端启动

```bash
# 进入后端目录
cd backend/weoucbookcycle_go

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入数据库凭证

# 编译&运行
go run main.go
```

**预期输出：**
```
✅ .env file loaded successfully
========== Book Cycle Application ==========
📍 Server Port: 8080
🔗 API Base: http://localhost:8080
☁️  Cloud Functions: DISABLED
🔐 JWT Secret: sec***key
🗄️  Database: root@127.0.0.1/book_cycle_db
=============================================
🚀 Server starting on port 8080 (mode=debug)
```

### 2. 前端启动

```bash
# 进入前端目录
cd frontend/bookcycle--4-

# 安装依赖
npm install

# 在微信开发者工具中打开此目录
# 配置apiBase指向后端服务器地址
```

### 3. 数据库初始化

```bash
# 使用MySQL客户端
mysql -u root -p

# 创建数据库
CREATE DATABASE book_cycle_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出并让应用自动迁移表
exit
```

运行后端时，若 `ENABLE_AUTO_MIGRATE=true`，将自动创建所有表。

## ⚙️ 环境配置

### .env 文件示例

```env
# 应用配置
GIN_MODE=debug
SERVER_PORT=8080
API_BASE=http://localhost:8080

# 数据库配置（MySQL）
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=book_cycle_db
DB_CHARSET=utf8mb4
DB_TIMEZONE=Asia/Shanghai

# JWT配置
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_EXPIRATION=7200

# Redis配置（可选，缓存）
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# 云开发（固定为false，使用自建后端）
USE_CLOUD=false

# 自动迁移（开发阶段使用true，生产使用false）
ENABLE_AUTO_MIGRATE=true

# 微信配置
WEIXIN_APPID=your-appid
WEIXIN_APPSECRET=your-appsecret

# 日志
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 🔄 架构改进（最新版本）

本版本实现了以下关键改进，参考 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) 了解详情：

### 1. 统一数据源
- ✅ 移除微信云开发依赖
- ✅ 所有数据存储在MySQL中
- ✅ 前后端通过REST API通信

### 2. Token智能管理
- ✅ 后端返回 `expiresIn` 字段（秒数）
- ✅ 前端自动计算过期时间
- ✅ 401错误自动刷新Token
- ✅ 双重机制防止认证失败

### 3. API抽象层
- ✅ 前端统一 `request.js` 模块
- ✅ 自动添加Authorization headers
- ✅ 集成错误处理和超时控制
- ✅ Promise链式调用方便易用

### 4. 启动验证
- ✅ 验证必需环境变量
- ✅ 检查数据库连接
- ✅ 可选Redis验证
- ✅ 打印启动信息便于调试

## 📚 API端点示例

### 认证

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/auth/wechat` | 微信小程序登录 |
| POST | `/api/auth/refresh` | 刷新Token |
| POST | `/api/auth/logout` | 登出 |

### 聊天

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/chats` | 获取聊天列表 |
| GET | `/api/users` | 获取用户列表 |
| POST | `/api/chats/{chatId}/messages` | 发送消息 |

### 书籍

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/books` | 书籍列表 |
| POST | `/api/books` | 创建书籍 |
| GET | `/api/books/{id}` | 书籍详情 |
| PUT | `/api/books/{id}` | 更新书籍 |
| DELETE | `/api/books/{id}` | 删除书籍 |

详细API文档见 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md#api文档)

## 🧪 测试

### 后端测试
```bash
cd backend/weoucbookcycle_go
go test ./...
go test -v ./services
```

### 前端检查
```bash
cd frontend/bookcycle--4-
npm run lint
npm run build
```

## 📖 详细文档

- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - 完整开发指南，包含：
  - 详细的项目架构说明
  - 环境配置指南
  - 开发流程和最佳实践
  - 完整的API文档
  - 常见问题解答
  - 生产部署建议

## 🛠️ 常见命令

```bash
# 后端
cd backend/weoucbookcycle_go
go run main.go              # 运行开发服务
go build                    # 编译为二进制文件
go test ./...               # 运行测试
go vet ./...                # 代码检查

# 前端
cd frontend/bookcycle--4-
npm install                 # 安装依赖
npm run lint                # 代码检查
npm run build               # 构建项目
npm run dev                 # 开发模式
```

## 🔒 安全考虑

1. **JWT Secret** - 使用强随机字符串（至少32字符）
2. **HTTPS** - 生产环境必须启用TLS
3. **CORS** - 配置合法域名白名单
4. **数据库** - 使用强密码，限制访问IP
5. **环境变量** - 永远不要提交.env到仓库

## 📝 提交历史

- **v1.1.0** (当前版本)
  - ✨ 添加request.js统一请求层
  - ✨ Token自动刷新机制
  - ✨ 启动验证和配置检查
  - 📖 完整的DEVELOPMENT_GUIDE.md文档
  - 🔧 改进消息处理，使用后端轮询而非云数据库
  
- **v1.0.0**
  - 基础功能实现

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📧 联系方式

如有问题或建议，请通过GitHub Issue联系我们。

---

**提示：** 首次使用请参考 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)，获得更详细的设置和开发指导。

