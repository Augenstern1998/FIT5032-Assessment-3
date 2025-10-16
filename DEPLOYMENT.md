# 🚀 部署指南 - FIT5032 Assessment 3

本指南将帮助您将应用部署到云端，满足 BR D.4 (部署到云端) 和 BR E.1 (云函数) 的要求。

## 📋 部署要求

### BR D.4: 部署到云端
- ✅ 将完整运行的 Web 应用部署到公共云平台
- ✅ 使用 Cloudflare Pages 和 Firebase Hosting
- ✅ 应用可正常访问且功能齐全
- ✅ 部署版本与 GitHub 同步
- ✅ 使用 GitHub Actions 自动部署

### BR E.1: 云函数
- ✅ 使用 Firebase Cloud Functions 实现无服务器后端逻辑
- ✅ 实现邮件发送、数据处理等服务端功能
- ✅ 展示对 Serverless 架构的深入理解
- ✅ 安全的后端逻辑（避免前端暴露密钥）

## 🛠️ 部署选项

### 选项 1: Firebase Hosting + Cloud Functions
```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录 Firebase
firebase login

# 部署到 Firebase
npm run deploy
```

### 选项 2: Cloudflare Pages
```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Cloudflare Pages
npm run deploy:cloudflare
```

### 选项 3: 自动部署 (推荐)
使用提供的脚本进行一键部署：

**Windows:**
```cmd
deploy.bat
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔧 环境配置

### 1. Firebase 配置
确保在 `src/config/firebase.js` 中配置了正确的 Firebase 项目信息。

### 2. 环境变量
创建 `.env` 文件（参考 `env.example`）：
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... 其他配置
```

### 3. 云函数环境变量
在 Firebase Console 中设置云函数环境变量：
```bash
firebase functions:config:set email.user="your_email@gmail.com"
firebase functions:config:set email.password="your_app_password"
firebase functions:config:set admin.email="admin@example.com"
```

## 🚀 GitHub Actions 自动部署

### 设置 GitHub Secrets
在 GitHub 仓库设置中添加以下 secrets：

**Cloudflare:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

**Firebase:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

**其他:**
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_MAPBOX_ACCESS_TOKEN`

### 自动部署流程
1. 推送到 `main` 分支
2. GitHub Actions 自动触发
3. 构建项目
4. 部署到 Cloudflare Pages
5. 部署云函数到 Firebase

## ☁️ 云函数功能

### 已实现的云函数
1. **sendEmail** - 邮件发送服务
   - 联系表单邮件
   - 密码重置邮件
   - 欢迎邮件

2. **processData** - 数据处理服务
   - 用户数据管理
   - 资源统计
   - 数据聚合

3. **getUserProfile** - 用户认证服务
   - 获取用户资料
   - 认证验证

4. **getResourceStats** - 资源统计服务
   - 资源统计信息
   - 分类统计

5. **healthCheck** - 健康检查
   - 服务状态检查
   - 版本信息

### 云函数端点
```
https://us-central1-mens-health-app-b7749.cloudfunctions.net/
├── sendEmail
├── processData
├── getUserProfile
├── getResourceStats
└── healthCheck
```

## 🔍 测试部署

### 1. 本地测试
```bash
# 启动开发服务器
npm run dev

# 启动 Firebase 模拟器
npm run emulator
```

### 2. 部署后测试
1. 访问部署的 URL
2. 测试用户认证功能
3. 测试联系表单（云函数邮件发送）
4. 测试交互式数据表
5. 测试地图功能

## 📱 部署 URL

### Firebase Hosting
- **生产环境**: https://mens-health-app-b7749.web.app
- **开发环境**: http://localhost:5000

### Cloudflare Pages
- **生产环境**: https://fit5032-assessment-3.pages.dev
- **预览环境**: 每次推送自动生成预览 URL

## 🔧 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本 (要求 v20+)
   - 清理 node_modules 并重新安装
   - 检查环境变量配置

2. **云函数部署失败**
   - 检查 Firebase CLI 版本
   - 确保 Firebase 项目配置正确
   - 检查云函数代码语法

3. **邮件发送失败**
   - 检查邮件服务配置
   - 验证环境变量设置
   - 查看云函数日志

### 查看日志
```bash
# Firebase 函数日志
firebase functions:log

# Cloudflare 页面日志
wrangler pages deployment tail
```

## 📊 性能优化

### 构建优化
- 代码分割 (Code Splitting)
- 资源压缩
- 缓存策略

### 部署优化
- CDN 分发
- 边缘计算
- 自动扩展

## 🔒 安全考虑

### 环境变量安全
- 不在代码中硬编码敏感信息
- 使用 GitHub Secrets 管理密钥
- 定期轮换 API 密钥

### 云函数安全
- 输入验证
- 身份认证
- 错误处理
- 日志记录

## 📈 监控和维护

### 性能监控
- Firebase Analytics
- Cloudflare Analytics
- 错误追踪

### 定期维护
- 依赖更新
- 安全补丁
- 性能优化
- 备份检查

---

## 🎯 完成状态

- ✅ **BR D.4**: 部署到云端 - 已完成
- ✅ **BR E.1**: 云函数 - 已完成

**部署成功标志:**
- 应用可在公网访问
- 所有功能正常工作
- 云函数响应正常
- 邮件发送功能正常
- 自动部署流程正常

