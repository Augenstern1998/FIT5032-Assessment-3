# ☁️ Cloudflare Pages 设置指南

## 1. 创建 Cloudflare 账户

1. 访问 https://pages.cloudflare.com/
2. 点击 "Sign up" 注册账户
3. 验证邮箱

## 2. 创建 Pages 项目

### 方法 1: 通过 GitHub 连接 (推荐)
1. 登录 Cloudflare Dashboard
2. 进入 "Pages" 部分
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择你的 GitHub 仓库: `Augenstern1998/FIT5032-Assessment-3`
6. 配置项目设置:
   - **项目名称**: `fit5032-assessment-3`
   - **生产分支**: `main`
   - **构建命令**: `npm run build`
   - **构建输出目录**: `dist`
   - **根目录**: `/`

### 方法 2: 手动上传
1. 先构建项目: `npm run build`
2. 在 Pages 中选择 "Upload assets"
3. 上传 `dist` 文件夹

## 3. 环境变量设置

在 Cloudflare Pages 项目设置中添加以下环境变量:

### 生产环境变量
```
VITE_FIREBASE_API_KEY=AIzaSyA866ntQjm_mCSIV6tOY49sC87VCos3Zjo
VITE_FIREBASE_AUTH_DOMAIN=mens-health-app-b7749.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mens-health-app-b7749
VITE_FIREBASE_STORAGE_BUCKET=mens-health-app-b7749.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=153718063629
VITE_FIREBASE_APP_ID=1:153718063629:web:988c1a11b7ba0150888b44
VITE_FIREBASE_MEASUREMENT_ID=G-1JQMFN2VF2
```

### 预览环境变量 (相同)
```
VITE_FIREBASE_API_KEY=AIzaSyA866ntQjm_mCSIV6tOY49sC87VCos3Zjo
VITE_FIREBASE_AUTH_DOMAIN=mens-health-app-b7749.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mens-health-app-b7749
VITE_FIREBASE_STORAGE_BUCKET=mens-health-app-b7749.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=153718063629
VITE_FIREBASE_APP_ID=1:153718063629:web:988c1a11b7ba0150888b44
VITE_FIREBASE_MEASUREMENT_ID=G-1JQMFN2VF2
```

## 4. 自定义域名 (可选)

1. 在项目设置中点击 "Custom domains"
2. 添加你的自定义域名
3. 配置 DNS 记录

## 5. 获取 API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 "Create Token"
3. 选择 "Custom token"
4. 配置权限:
   - **Account**: `Account:Read`, `Zone:Read`
   - **Zone Resources**: `Include All zones`
5. 复制生成的 token

## 6. 配置 GitHub Secrets

在你的 GitHub 仓库设置中添加以下 secrets:

1. 进入 GitHub 仓库
2. 点击 Settings → Secrets and variables → Actions
3. 添加以下 secrets:

```
CLOUDFLARE_API_TOKEN=你的_API_TOKEN
CLOUDFLARE_ACCOUNT_ID=你的_账户_ID
```

### 获取 Account ID:
1. 在 Cloudflare Dashboard 右侧边栏找到 "Account ID"
2. 复制这个 ID

## 7. 测试部署

推送代码到 main 分支，GitHub Actions 会自动触发部署:

```bash
git add .
git commit -m "Test Cloudflare Pages deployment"
git push origin main
```

## 8. 访问部署的网站

部署成功后，你会获得以下 URL:
- **生产环境**: `https://fit5032-assessment-3.pages.dev`
- **预览环境**: 每次 PR 都会生成预览 URL

## 9. 监控部署状态

1. 在 Cloudflare Pages 控制台查看部署状态
2. 在 GitHub Actions 中查看部署日志
3. 检查网站功能是否正常

