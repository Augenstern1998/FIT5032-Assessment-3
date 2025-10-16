# 🔥 Firebase 自动部署设置指南

## 🎯 目标

设置 Firebase 自动部署，这样你就不需要每次手动部署了！

## 🔧 设置步骤

### 方法 1: 使用 Firebase CI Token (推荐)

#### 1. 生成 Firebase CI Token

在你的本地命令行中运行：
```bash
firebase login:ci
```

这会打开浏览器，登录后返回一个 token。

#### 2. 配置 GitHub Secrets

1. 访问你的 GitHub 仓库: https://github.com/Augenstern1998/FIT5032-Assessment-3
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 secret:

```
Name: FIREBASE_TOKEN
Value: [粘贴从 firebase login:ci 获得的 token]
```

### 方法 2: 使用 Service Account (备选)

#### 1. 获取 Firebase Service Account 密钥

1. 访问 https://console.firebase.google.com/project/mens-health-app-b7749
2. 点击左下角的 **⚙️ 设置** → **项目设置**
3. 滚动到 **服务账户** 部分
4. 点击 **生成新的私钥**
5. 下载 JSON 文件

#### 2. 配置 GitHub Secrets

```
Name: FIREBASE_SERVICE_ACCOUNT
Value: [粘贴整个 JSON 文件内容]
```

### 3. 验证设置

设置完成后：
1. 推送任何代码更改到 `main` 分支
2. 查看 GitHub Actions 运行状态
3. 确认 Firebase 自动部署成功

## 🚀 设置完成后的工作流程

### 自动部署流程：
```
1. 修改本地代码
2. git add .
3. git commit -m "your changes"
4. git push origin main
5. GitHub Actions 自动触发
6. Firebase 自动部署 ✅
7. Cloudflare Pages 自动部署 ✅
```

### 部署 URL：
- **Firebase**: https://mens-health-app-b7749.web.app (自动更新)
- **Cloudflare**: https://fit5032-assessment-3.pages.dev (自动更新)

## ⚠️ 注意事项

### 如果不想设置自动部署：
你也可以继续使用手动部署：
```bash
npm run deploy:hosting
```

### 安全提示：
- 不要将 Service Account JSON 文件提交到代码仓库
- 只在 GitHub Secrets 中存储密钥
- 定期轮换密钥

## 🎉 完成后的好处

设置完成后，你将获得：
- ✅ **完全自动化**: 代码推送 → 自动部署
- ✅ **双平台部署**: Firebase + Cloudflare Pages
- ✅ **无需手动操作**: 专注于代码开发
- ✅ **BR D.4 最高标准**: 完整的自动部署流程

## 🔍 故障排除

### 如果自动部署失败：
1. 检查 GitHub Secrets 是否正确配置
2. 验证 Firebase Service Account 权限
3. 查看 GitHub Actions 日志
4. 必要时回退到手动部署

### 手动部署命令：
```bash
# 部署到 Firebase Hosting
npm run deploy:hosting

# 部署云函数
npm run deploy:functions

# 部署所有
npm run deploy
```
