# 快速参考指南

快速启动各个服务的 shell 脚本和关键命令。

## 一键启动脚本

### Windows PowerShell

#### 1. 启动后端服务

```powershell
# 进入后端目录
cd backend\weoucbookcycle_go

# 启动 Go 服务
go run main.go
```

#### 2. 启动 Web 前端（另一个终端）

```powershell
cd frontend\web
npm install  # 第一次需要
npm run dev
```

#### 3. 启动微信小程序

```
打开微信开发者工具 -> 打开项目 -> 选择 frontend\weapp 目录
```

### Linux / macOS

#### 启动后端

```bash
cd backend/weoucbookcycle_go
go run main.go
```

#### 启动 Web 前端

```bash
cd frontend/web
npm install
npm run dev
```

---

## 常用命令速览

### 后端

```bash
# 构建可执行文件
go build -o bin/server ./...

# 运行测试
go test ./...

# 查看依赖
go mod graph

# 更新依赖
go mod tidy
```

### Web 前端

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# ESLint 检查
npm run lint
```

### 微信小程序

- 在开发者工具中直接编辑、保存、预览
- 上传到微信审核前，点击上传按钮

---

## 端口分配

| 服务 | 默认端口 | 环境变量 |
|------|---------|---------|
| 后端 Go API | 8080 | `SERVER_PORT` |
| Web 前端开发服务器 | 5173 | 无 |
| Web 前端生产构建 | 3000（示例） | 无 |

---

## 数据库初始化

后端启动时如果 `ENABLE_AUTO_MIGRATE=true`（非生产模式默认），会自动创建以下表：

- `users` - 用户数据
- `books` - 书籍信息
- `listings` - 用户发布的书籍销售信息
- `chats` - 聊天会话
- `messages` - 聊天消息

无需手动执行 SQL 脚本。

---

## 环境变量快速检查清单

### 后端 `.env` 必填项

- [ ] `SERVER_PORT` - 通常 `8080`
- [ ] `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MySQL 连接信息
- [ ] `JWT_SECRET` - 强随机字符串（生产环境！）
- [ ] `API_BASE` - 后端外部访问地址
- [ ] `ALLOW_ORIGINS` - 前端域名列表

### Web 前端 `.env.local` 必填项

- [ ] `VITE_API_BASE_URL` - 后端 API 地址（通常 `http://localhost:8080`）

### 微信小程序 `app.js`

- [ ] `globalData.apiBase` - 后端地址

---

## 常见问题速查

| 问题 | 原因 | 解决 |
|------|------|------|
| 数据库连接失败 | MySQL 未启动或凭证错误 | 检查 MySQL 运行状态和 `.env` 配置 |
| CORS 错误 | 前端域不在 `ALLOW_ORIGINS` 中 | 修改后端 `.env` 的 `ALLOW_ORIGINS` |
| 文件上传失败 | 存储配置错误或权限不足 | 检查 `STORAGE_*` 变量或 `./uploads` 目录权限 |
| 小程序无法连接后端 | `apiBase` 错误 | 修改 `frontend/weapp/app.js` 中的 `globalData.apiBase` |
| 邮件验证码未收到 | SMTP 配置错误 | 验证 `SMTP_*` 变量和邮箱应用密码 |

---

## 生产部署检清单

- [ ] 修改 `JWT_SECRET` 为强随机值
- [ ] 设置 `GIN_MODE=release`
- [ ] 配置生产数据库主机和密码
- [ ] 设置正确的 `API_BASE`（生产域名）
- [ ] 配置 HTTPS/TLS（`TLS_CERT_FILE`, `TLS_KEY_FILE`）
- [ ] 限制 `ALLOW_ORIGINS` 到已知的前端域
- [ ] 配置对象存储（如有）以持久化文件
- [ ] 启用 Redis 以提升性能
- [ ] 定期备份 MySQL 数据库
- [ ] 监控日志和性能指标

---

## 获取帮助

遇到问题？

1. 查看各模块的 README：
   - [后端](./backend/weoucbookcycle_go/README.md)
   - [Web 前端](./frontend/web/README.md)
   - [微信小程序](./frontend/weapp/README.md)

2. 检查项目的 Issue 列表

3. 查看代码中的注释和文档字符串

---

**更新于**: 2026 年 3 月 5 日
