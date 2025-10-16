# 🔧 User Setup Guide - 用户设置指南

## 🚨 问题诊断

你遇到的错误 `auth/invalid-credential` 表示：
- 用户账户不存在于 Firebase 中
- 或者密码不正确
- 或者 Firebase 配置有问题

## 🚀 解决方案

### 方法 1: 使用 User Setup 页面（推荐）

1. **访问用户设置页面**
   ```
   http://localhost:5173/user-setup
   ```

2. **快速设置**
   - 点击 "Create Admin User" 按钮
   - 系统会自动创建一个默认的 admin 用户：
     - **Email**: `admin@menshealth.com`
     - **Password**: `admin123`
     - **Role**: `admin`

3. **测试登录**
   - 前往登录页面：`http://localhost:5173/login`
   - 使用上面的凭据登录
   - 登录成功后，你就可以访问 Admin 页面了

### 方法 2: 使用浏览器控制台

1. **打开浏览器开发者工具** (F12)
2. **在控制台中运行**：
   ```javascript
   // 创建 admin 用户
   await window.userDebug.quickSetup();
   
   // 或者创建自定义用户
   await window.userDebug.createTestUser(
     'your-email@example.com',
     'your-password',
     'Your Name',
     'admin'
   );
   ```

### 方法 3: 手动创建用户

1. **访问 User Setup 页面**
2. **使用 "Create Custom User" 表单**
   - 填写邮箱、密码、姓名
   - 选择角色（admin 或 member）
   - 点击 "Create User"

## 🔐 默认凭据

创建完成后，你可以使用以下凭据登录：

```
Email: admin@menshealth.com
Password: admin123
Role: admin
```

## 🎯 验证步骤

1. **登录测试**
   - 访问 `/login`
   - 使用创建的凭据登录
   - 确认登录成功

2. **Admin 访问测试**
   - 登录后，导航栏应该显示 "Admin" 下拉菜单
   - 点击 Admin → Dashboard
   - 应该能看到用户管理界面

3. **权限测试**
   - 尝试访问 `/admin` 和 `/admin/resources`
   - 应该能正常显示内容，而不是 "Access Denied"

## 🛠️ 故障排除

### 如果仍然无法登录：

1. **检查 Firebase 配置**
   - 确认 `src/config/firebase.js` 配置正确
   - 检查 Firebase 项目是否启用 Authentication

2. **清除浏览器缓存**
   - 清除 localStorage 和 sessionStorage
   - 刷新页面重试

3. **检查网络连接**
   - 确认能访问 Firebase 服务
   - 检查防火墙设置

### 如果用户创建失败：

1. **检查 Firebase Authentication 设置**
   - 确认 Email/Password 认证已启用
   - 检查 Firestore 规则

2. **查看控制台错误**
   - 打开开发者工具
   - 查看 Network 和 Console 标签页的错误信息

## 📱 开发环境注意事项

- User Setup 页面仅用于开发和测试
- 生产环境中应该移除或限制访问
- 创建的用户数据会存储在 Firebase 中

## 🔄 重置用户数据

如果需要重置所有用户数据：

```javascript
// 在浏览器控制台中运行
// 注意：这会删除所有用户数据，请谨慎使用
```

## 📞 获取帮助

如果问题仍然存在：

1. 检查浏览器控制台的完整错误信息
2. 确认 Firebase 项目配置
3. 尝试使用不同的浏览器或隐身模式
4. 检查网络连接和防火墙设置

---

**快速链接：**
- [User Setup Page](http://localhost:5173/user-setup)
- [Login Page](http://localhost:5173/login)
- [Admin Dashboard](http://localhost:5173/admin)
