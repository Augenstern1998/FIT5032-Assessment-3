# ☁️ Cloudflare Pages 正确设置指南

## 🚨 问题诊断

你遇到的错误是因为 Cloudflare Pages 配置不正确。错误信息显示：
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

这是因为 Cloudflare Pages 被误配置为 Cloudflare Workers 项目。

## ✅ 正确设置步骤

### 1. 删除错误的项目配置

1. 访问 https://dash.cloudflare.com/
2. 进入 "Pages" 部分
3. 找到你的项目 `fit5032-assessment-3`
4. **删除这个项目** (因为配置错误)

### 2. 重新创建项目 (正确方式)

#### 方法 1: 通过 GitHub 连接 (推荐)

1. 在 Cloudflare Pages 中点击 "Create a project"
2. 选择 **"Connect to Git"**
3. 选择你的 GitHub 仓库: `Augenstern1998/FIT5032-Assessment-3`
4. 配置项目设置:

```
项目名称: fit5032-assessment-3
生产分支: main
构建设置:
  - 构建命令: npm run build
  - 构建输出目录: dist
  - 根目录: /
```

#### 方法 2: 直接上传 (如果 Git 连接有问题)

1. 选择 **"Upload assets"**
2. 先构建项目: `npm run build`
3. 上传整个 `dist` 文件夹

### 3. 环境变量配置

在项目设置 → Environment variables 中添加:

**生产环境 (Production):**
```
VITE_FIREBASE_API_KEY = AIzaSyA866ntQjm_mCSIV6tOY49sC87VCos3Zjo
VITE_FIREBASE_AUTH_DOMAIN = mens-health-app-b7749.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = mens-health-app-b7749
VITE_FIREBASE_STORAGE_BUCKET = mens-health-app-b7749.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 153718063629
VITE_FIREBASE_APP_ID = 1:153718063629:web:988c1a11b7ba0150888b44
VITE_FIREBASE_MEASUREMENT_ID = G-1JQMFN2VF2
```

**预览环境 (Preview):** (相同的值)

### 4. 自定义域名 (可选)

在项目设置中点击 "Custom domains" 添加你的域名。

## 🔧 重要配置说明

### 为什么之前失败？

1. **错误配置**: 项目被配置为 Cloudflare Workers 而不是 Pages
2. **错误命令**: 使用了 `wrangler deploy` 而不是 Pages 部署
3. **错误文件**: `wrangler.toml` 配置不当

### 正确的文件结构

```
项目根目录/
├── dist/                    # 构建输出目录
├── src/                     # 源代码
├── _headers                 # Cloudflare Pages 头部配置
├── _redirects               # 路由重定向配置
├── wrangler.toml            # Pages 配置 (已修复)
├── package.json             # 项目配置
└── vite.config.js           # 构建配置
```

### 部署流程

1. **Git 推送** → **GitHub 仓库更新**
2. **Cloudflare Pages 检测到变化**
3. **自动构建** (`npm run build`)
4. **部署到 CDN** (`dist` 目录内容)

## 🚀 部署后验证

### 1. 检查部署状态
- 访问 Cloudflare Pages 控制台
- 查看 "Deployments" 标签页
- 确认部署成功 (绿色状态)

### 2. 测试网站功能
- 访问你的 Pages URL
- 测试所有页面加载
- 测试用户认证
- 测试联系表单
- 测试云函数集成

### 3. 检查环境变量
- 在浏览器开发者工具中检查
- 确认所有 `VITE_*` 变量正确加载

## 🔍 故障排除

### 如果部署仍然失败

1. **检查构建日志**
   - 在 Pages 控制台查看构建日志
   - 确认 `npm run build` 成功

2. **检查环境变量**
   - 确认所有必需的变量都已设置
   - 检查变量名称和值是否正确

3. **检查文件权限**
   - 确认 GitHub 仓库有正确的访问权限
   - 检查 Cloudflare 账户权限

### 常见错误和解决方案

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| Build failed | 依赖问题 | 检查 package.json 和 npm install |
| Environment variables not found | 变量未设置 | 在 Pages 设置中添加变量 |
| 404 on routes | 路由配置错误 | 检查 _redirects 文件 |
| CORS errors | 跨域问题 | 检查 _headers 文件 |

## 📱 预期结果

部署成功后，你应该获得：

- **Pages URL**: `https://fit5032-assessment-3.pages.dev`
- **自动部署**: 每次推送代码自动部署
- **CDN 加速**: 全球 CDN 分发
- **HTTPS**: 自动 SSL 证书
- **自定义域名**: 可选的自定义域名

## 🎯 验证清单

- [ ] 删除错误的 Pages 项目
- [ ] 重新创建正确的 Pages 项目
- [ ] 配置正确的构建设置
- [ ] 添加所有环境变量
- [ ] 推送最新代码到 GitHub
- [ ] 验证自动部署成功
- [ ] 测试网站功能正常
- [ ] 确认云函数集成工作

完成这些步骤后，你的 Cloudflare Pages 部署就应该正常工作了！
