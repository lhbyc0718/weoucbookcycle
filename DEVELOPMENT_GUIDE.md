# WeOUC Book Cycle - 开发指南

## 目录
- [项目架构](#项目架构)
- [环境配置](#环境配置)
- [快速开始](#快速开始)
- [文件结构](#文件结构)
- [开发流程](#开发流程)
- [API文档](#api文档)
- [常见问题](#常见问题)

---

## 项目架构

### 整体架构设计

本项目采用**微服务分离模式**：

```
WeOUC Book Cycle
├── Frontend (WeChat MiniApp)          # 微信小程序前端
│   ├── Request Layer                   # 统一请求层 (request.js)
│   ├── Pages                          # 页面逻辑
│   ├── Components                     # 可复用组件
│   └── Utils                          # 工具函数
│
└── Backend (Go + MySQL + Redis)        # 自建服务器后端
    ├── API Routes                     # API路由
    ├── Controllers                    # 业务逻辑
    ├── Models                         # 数据模型
    ├── Services                       # 服务层
    ├── Middleware                     # 中间件
    └── WebSocket                      # 实时通信
```

### 核心特性

1. **统一的数据源**
   - 所有数据存储在自建MySQL数据库中
   - 不再依赖微信云开发和本地Mock数据

2. **智能Token管理**
   - 前端自动计算Token过期时间
   - 后端返回expiresIn字段（秒数）
   - 前端401错误自动刷新Token
   - 双重保障防止身份验证失败

3. **API抽象层**
   - 前端使用统一的request.js模块
   - 集成消息、错误处理、超时控制
   - 自动添加Authentication headers
   - 支持Promise链式调用

4. **配置验证**
   - 启动时自动验证环境变量
   - 检查数据库连接
   - 可选Redis连接验证

---

## 环境配置

### 后端环境变量 (.env)

创建项目根目录的 `.env` 文件：

```env
# 服务器配置
GIN_MODE=debug
SERVER_PORT=8080

# JWT配置
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_EXPIRATION=7200

# 数据库配置（MySQL 8.0+）
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=book_cycle_db
DB_CHARSET=utf8mb4
DB_TIMEZONE=Asia/Shanghai

# Redis配置（可选）
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# 云开发配置（固定为false，使用自建后端）
USE_CLOUD=false

# 数据库自动迁移
ENABLE_AUTO_MIGRATE=true

# TLS/HTTPS配置（可选）
TLS_CERT_FILE=
TLS_KEY_FILE=

# API基础URL（前端使用）
API_BASE=http://localhost:8080

# 日志配置
LOG_LEVEL=info
LOG_FILE=logs/app.log

# 微信小程序配置
WEIXIN_APPID=your-appid
WEIXIN_APPSECRET=your-appsecret
```

### 前端配置 (app.json)

```json
{
  "pages": [...],
  "window": {...},
  "globalData": {
    "apiBase": "http://localhost:8080",
    "useCloud": false,
    "autoMigrate": false
  }
}
```

---

## 快速开始

### 1. 后端启动

```bash
# 进入后端目录
cd backend/weoucbookcycle_go

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入正确的数据库凭证

# 下载依赖
go mod download

# 编译
go build

# 运行
./weoucbookcycle_go

# 或使用go run直接运行
go run main.go
```

**预期输出：**
```
⚠️  No .env file found, using system environment variables
✅ .env file loaded successfully
========== Book Cycle Application ==========
📍 Server Port: 8080
🔗 API Base: http://localhost:8080
☁️  Cloud Functions: DISABLED
🔐 JWT Secret: sec***key
🗄️  Database: root@127.0.0.1/book_cycle_db
💾 Redis: 127.0.0.1:6379
=============================================
🚀 Server starting on port 8080 (mode=debug)
📚 API health: http://localhost:8080/health
```

### 2. 前端启动

```bash
# 进入前端目录
cd frontend/bookcycle--4-

# 安装依赖
npm install

# 编译TypeScript（如需要）
npm run build

# 在微信开发者工具中打开此目录
# 使用本地开发服务器或构建产物
```

### 3. 数据库准备

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE book_cycle_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
exit
```

应用启动时会自动创建表（如ENABLE_AUTO_MIGRATE=true）。

---

## 文件结构

### 后端文件结构

```
backend/weoucbookcycle_go/
├── main.go                    # 应用入口，在此处添加启动验证
├── go.mod                     # Go模块定义
├── config/
│   ├── config.go             # 配置加载
│   ├── database.go           # MySQL连接
│   ├── jwt.go                # JWT管理
│   ├── server.go             # Gin配置
│   └── validation.go         # ✨新增：启动验证
├── controllers/
│   ├── auth_controller.go    # ✨已更新：添加expiresIn和中文消息
│   ├── book_controller.go
│   ├── user_controller.go
│   ├── chat_controller.go
│   ├── listing_controller.go
│   └── search_controller.go
├── models/
│   ├── user.go
│   ├── book.go
│   ├── listing.go
│   ├── chat.go
│   ├── message.go
│   └── utils.go
├── services/
│   ├── auth_service.go
│   ├── book_service.go
│   └── chat_service.go
├── middleware/
│   ├── auth.go               # JWT验证中间件
│   ├── cors.go               # CORS处理
│   └── logger.go             # 请求日志
├── routes/
│   └── routes.go             # 路由定义
├── utils/
│   ├── response.go           # 统一响应格式
│   ├── validator.go          # 数据验证
│   └── uploader.go           # 文件上传
└── websocket/
    └── chat.go               # WebSocket聊天
```

### 前端文件结构

```
frontend/bookcycle--4-/
├── app.js                    # ✨已完全重写：移除云初始化，加入token验证
├── app.json                  # ✨已更新：apiBase配置
├── pages/
│   ├── index/               # 首页
│   ├── market/              # 书籍市场
│   ├── bookdetail/          # 书籍详情
│   ├── messages/            # ✨已重写：使用request.js和后端API
│   ├── chatdetail/          # 聊天详情
│   ├── profile/             # 用户个人资料
│   ├── post/                # 发布列表
│   ├── mylistings/          # 我的列表
│   ├── wishlist/            # 愿望清单
│   └── sellerlisting/       # 卖家列表
├── utils/
│   ├── request.js           # ✨新增：统一请求层
│   ├── validator.js
│   └── uploader.js
├── components/
│   ├── BookCard.tsx
│   ├── BottomNav.tsx
│   └── UsageInstructionsModal.tsx
├── data/
│   └── mockData.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    └── pages/
```

---

## 开发流程

### 添加新的API端点

**后端步骤：**

1. **定义Model** (models/example.go)
   ```go
   type Example struct {
       ID        uint      `gorm:"primaryKey"`
       Name      string    `json:"name"`
       CreatedAt time.Time `json:"created_at"`
   }
   ```

2. **创建Service** (services/example_service.go)
   ```go
   type ExampleService struct {}
   
   func (s *ExampleService) GetExample(id uint) (*models.Example, error) {
       var example models.Example
       if err := config.DB.First(&example, id).Error; err != nil {
           return nil, err
       }
       return &example, nil
   }
   ```

3. **创建Controller** (controllers/example_controller.go)
   ```go
   type ExampleController struct {
       exampleService *services.ExampleService
   }
   
   func (ec *ExampleController) GetExample(c *gin.Context) {
       id := c.Param("id")
       example, err := ec.exampleService.GetExample(id)
       if err != nil {
           c.JSON(http.StatusNotFound, gin.H{"code": 40400, "message": "Not found"})
           return
       }
       c.JSON(http.StatusOK, gin.H{
           "code": 20000,
           "message": "成功",
           "data": example,
       })
   }
   ```

4. **注册路由** (routes/routes.go)
   ```go
   exampleController := controllers.NewExampleController()
   r.GET("/api/examples/:id", middleware.AuthMiddleware(), exampleController.GetExample)
   ```

**前端步骤：**

1. **使用统一request.js**
   ```javascript
   const request = require('../../utils/request');
   
   request.get('/api/examples/1').then(data => {
       console.log(data);
   }).catch(error => {
       console.error(error.message);
   });
   ```

2. **错误处理自动集成**
   - 401错误自动刷新token
   - 网络错误显示用户友好提示
   - 所有请求包含Authorization header

### Token刷新流程

**前端实现细节：**

1. 登录时获取token和expiresIn
2. 计算过期时间：`expireTime = Math.floor(Date.now()/1000) + expiresIn`
3. 本地存储：`wx.setStorageSync('authToken', token)` + `wx.setStorageSync('tokenExpiry', expireTime)`
4. 发请求前检查：`currentTime >= expireTime`
5. 若已过期，调用request.js的`refreshAccessToken()`
6. request.js自动捕获401，刷新token并重试原请求

---

## API文档

### 认证API

#### 微信登录
```
POST /api/auth/wechat
Content-Type: application/json

{
  "code": "微信小程序的code"
}

响应（成功）:
{
  "code": 20000,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGc...",
    "expiresIn": 7200,
    "user": {
      "id": "user-123",
      "username": "张三",
      "avatar": "https://...",
      "email_verified": false
    }
  }
}
```

#### 刷新Token
```
POST /api/auth/refresh
Authorization: Bearer <old_token>

响应：
{
  "code": 20000,
  "message": "Token刷新成功",
  "data": {
    "token": "新token",
    "expiresIn": 7200,
    "user": {...}
  }
}
```

### 聊天API

#### 获取聊天列表
```
GET /api/chats
Authorization: Bearer <token>

响应：
{
  "code": 20000,
  "message": "成功",
  "data": [
    {
      "id": "chat-1",
      "participantId": "user-2",
      "lastMessage": "你好",
      "lastMessageTime": "2024-01-01T10:00:00Z",
      "unreadCount": 2
    }
  ]
}
```

#### 获取用户列表
```
GET /api/users
Authorization: Bearer <token>

响应：
{
  "code": 20000,
  "data": [
    {
      "id": "user-1",
      "nickname": "Alex",
      "avatar": "https://...",
      "email": "alex@example.com"
    }
  ]
}
```

---

## 常见问题

### Q: 启动时报错 "缺少必需的环境变量"

**A:** 检查 `.env` 文件是否存在且包含所有必需变量：
- JWT_SECRET
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

```bash
# 检查.env文件
cat .env

# 补充缺少的变量后重启
go run main.go
```

### Q: 前端报错 "网络错误，请检查是否连接到互联网"

**A:** 
1. 检查后端是否运行：`curl http://localhost:8080/health`
2. 检查apiBase配置是否正确 (app.json)
3. 微信开发者工具中检查网络请求 (开发者工具 > 调试)

### Q: Token过期后无法自动刷新

**A:** 确保：
1. 后端返回了expiresIn字段（已更新auth_controller.go）
2. 前端计算了tokenExpiry并存储（app.js中已实现）
3. request.js有正确的401处理логic

### Q: 数据库连接失败

**A:**
1. 检查MySQL服务运行状态
2. 验证数据库凭证
3. 检查防火墙是否阻止3306端口
4. 查看后端输出中的数据库验证信息

### Q: Redis连接可选，不影响应用启动吗？

**A:** 是的，Redis是可选的。ValidationRedis()仅记录警告，如果连接失败不会停止应用启动。

### Q: 如何在生产环境部署？

**A:**
1. 设置 `GIN_MODE=release`
2. 使用强JWT_SECRET（至少32字符）
3. 配置HTTPS证书 (TLS_CERT_FILE, TLS_KEY_FILE)
4. 禁用 `ENABLE_AUTO_MIGRATE`（手动管理数据库迁移）
5. Redis配置为实际服务器地址

---

## 提示和最佳实践

1. **开发中使用DEBUG日志**
   ```bash
   GIN_MODE=debug go run main.go
   ```

2. **生产中关闭自动迁移**
   ```env
   ENABLE_AUTO_MIGRATE=false
   GIN_MODE=release
   ```

3. **前端调试Token问题**
   ```javascript
   // 在微信开发者工具Console中查看
   console.log('Token:', wx.getStorageSync('authToken'));
   console.log('Expiry:', wx.getStorageSync('tokenExpiry'));
   console.log('Current:', Math.floor(Date.now()/1000));
   ```

4. **定期更换JWT_SECRET**
   - 在安全审计后更换
   - 使用至少32字符的随机字符串

5. **监控API响应时间**
   - 开启日志中的duration字段
   - 识别性能瓶颈

---

## 贡献指南

所有改动遵循：
- 代码风格：Google Go Style Guide
- 提交消息：中英文混合，清晰描述变更
- 测试覆盖率：关键业务逻辑>80%

---

## 许可证

MIT License - 详见 LICENSE 文件
