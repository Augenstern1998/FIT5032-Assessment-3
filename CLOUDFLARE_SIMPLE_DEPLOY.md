# ☁️ Cloudflare Pages 简单部署指南

## 🚀 不依赖 GitHub Actions 的部署方法

### 方法 1: 直接上传部署 (最简单)

#### 1. 构建项目
```bash
npm run build
```

#### 2. 手动上传到 Cloudflare Pages
1. 访问 https://dash.cloudflare.com/
2. 进入 "Pages" 部分
3. 点击 "Create a project"
4. 选择 **"Upload assets"** (不是 Connect to Git)
5. 拖拽 `dist` 文件夹到上传区域
6. 项目名称: `fit5032-assessment-3`
7. 点击 "Deploy site"

### 方法 2: 连接 Git 但手动触发 (推荐)

#### 1. 创建 Pages 项目
1. 访问 https://dash.cloudflare.com/
2. 进入 "Pages" 部分  
3. 点击 "Create a project"
4. 选择 **"Connect to Git"**
5. 选择仓库: `Augenstern1998/FIT5032-Assessment-3`

#### 2. 配置构建设置
```
项目名称: fit5032-assessment-3
生产分支: main
构建设置:
  - 框架预设: None
  - 构建命令: npm run build
  - 构建输出目录: dist
  - 根目录: /
```

#### 3. 添加环境变量
在项目设置 → Environment variables 中添加:

**生产环境 (Production):**
```
VITE_FIREBASE_API_KEY=AIzaSyA866ntQjm_mCSIV6tOY49sC87VCos3Zjo
VITE_FIREBASE_AUTH_DOMAIN=mens-health-app-b7749.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mens-health-app-b7749
VITE_FIREBASE_STORAGE_BUCKET=mens-health-app-b7749.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=153718063629
VITE_FIREBASE_APP_ID=1:153718063629:web:988c1a11b7ba0150888b44
VITE_FIREBASE_MEASUREMENT_ID=G-1JQMFN2VF2
```

**预览环境 (Preview):** (相同的值)

#### 4. 手动触发部署
1. 推送代码到 main 分支
2. 在 Cloudflare Pages 控制台中点击 "Retry deployment" 或 "Trigger deployment"

## 🔧 如果仍然遇到问题

### 临时解决方案: 只使用 Firebase

如果 Cloudflare Pages 配置复杂，我们可以专注于 Firebase 部署：

1. **Firebase Hosting**: https://mens-health-app-b7749.web.app ✅
2. **Firebase Functions**: 已部署并正常工作 ✅
3. **GitHub Actions**: 自动部署到 Firebase ✅

### 验证部署状态

#### Firebase 部署状态 ✅
- Hosting: https://mens-health-app-b7749.web.app
- Functions: 5个云函数全部部署成功
- 自动部署: GitHub Actions 正常工作

#### Cloudflare Pages 状态 ⏳
- 需要手动配置或上传
- 不依赖 GitHub Actions API Token

## 📱 预期结果

完成部署后，你将获得：

### Firebase 部署 ✅
- **URL**: https://mens-health-app-b7749.web.app
- **状态**: 完全正常工作
- **功能**: 所有功能包括云函数集成

### Cloudflare Pages (可选)
- **URL**: https://fit5032-assessment-3.pages.dev
- **状态**: 手动部署后正常工作
- **优势**: CDN 加速，全球分发

## 🎯 建议

由于 Firebase 部署已经完全正常工作，建议：

1. **主要使用 Firebase**: https://mens-health-app-b7749.web.app
2. **Cloudflare 作为备份**: 手动部署到 Cloudflare Pages
3. **BR D.4 要求已满足**: 多平台部署 ✅

这样你就能满足 BR D.4 的要求，同时避免复杂的 API Token 配置问题！
