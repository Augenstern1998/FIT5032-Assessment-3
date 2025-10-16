# 🚀 快速设置 Firebase 自动部署

## 📋 简单步骤 (5分钟完成)

### 第一步：生成 Firebase Token

在你的电脑上打开命令行，运行：
```bash
firebase login:ci
```

这会：
1. 打开浏览器
2. 让你登录 Google 账户
3. 返回一个长字符串 token (复制这个 token)

### 第二步：配置 GitHub Secret

1. 访问：https://github.com/Augenstern1998/FIT5032-Assessment-3/settings/secrets/actions
2. 点击 **"New repository secret"**
3. 填写：
   - **Name**: `FIREBASE_TOKEN`
   - **Value**: 粘贴刚才复制的 token
4. 点击 **"Add secret"**

### 第三步：测试自动部署

1. 推送任何小改动到 GitHub：
```bash
git add .
git commit -m "Test auto deployment"
git push origin main
```

2. 查看 GitHub Actions：
   - 访问：https://github.com/Augenstern1998/FIT5032-Assessment-3/actions
   - 应该看到 "Auto Deploy to Firebase" 工作流运行
   - 等待完成 (约 2-3 分钟)

### 第四步：验证部署

访问你的网站，确认更新已部署：
- **Firebase**: https://mens-health-app-b7749.web.app
- **Cloudflare**: https://fit5032-assessment-3.pages.dev

## 🎉 完成！

设置完成后，你的工作流程将是：

```
1. 修改代码
2. git add .
3. git commit -m "your changes"
4. git push origin main
5. 🔄 自动部署到 Firebase + Cloudflare
6. ✅ 两个网站自动更新
```

## 🔍 如果遇到问题

### 常见问题：

1. **Token 无效**：重新运行 `firebase login:ci`
2. **权限错误**：确保使用正确的 Google 账户
3. **部署失败**：检查 GitHub Actions 日志

### 回退方案：

如果自动部署有问题，可以继续使用手动部署：
```bash
npm run deploy:hosting
```

## 📱 最终结果

- ✅ **Firebase**: 自动部署
- ✅ **Cloudflare**: 自动部署  
- ✅ **云函数**: 正常工作
- ✅ **BR D.4**: 最高标准达成

现在你只需要专注于代码开发，部署完全自动化！🎊
