# 📧 邮件服务设置指南

## 🔧 **Cloud Functions 邮件服务配置**

### 1. 设置环境变量

在Firebase Console中设置以下环境变量：

```bash
# 设置邮件服务环境变量
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:set admin.email="admin@example.com"
```

### 2. Gmail App Password 设置

1. 启用Gmail的2步验证
2. 生成应用专用密码：
   - 访问 [Google Account Settings](https://myaccount.google.com/)
   - 安全 → 2步验证 → 应用密码
   - 生成新的应用密码
   - 使用这个密码作为 `email.password`

### 3. 部署Cloud Functions

```bash
# 部署所有函数
firebase deploy --only functions

# 或者部署特定函数
firebase deploy --only functions:sendEmail
```

## 📎 **附件支持**

### ✅ **支持的附件类型**
- **文档**: PDF, DOC, DOCX, TXT
- **图片**: JPG, JPEG, PNG, GIF
- **最大文件大小**: 25MB (Gmail限制)

### 🔄 **附件处理流程**
1. 用户选择文件
2. 前端验证文件类型和大小
3. 转换为Base64格式
4. 发送到Cloud Functions
5. Nodemailer处理附件发送

## 🆓 **免费替代方案**

### 方案1: SendGrid (推荐)
```bash
# 安装SendGrid
npm install @sendgrid/mail

# 设置API密钥
firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
```

**优势:**
- 免费额度: 100封/天
- 支持所有附件类型
- 更好的送达率

### 方案2: Mailgun
```bash
# 安装Mailgun
npm install mailgun-js

# 设置API密钥
firebase functions:config:set mailgun.api_key="your-mailgun-api-key"
firebase functions:config:set mailgun.domain="your-mailgun-domain"
```

**优势:**
- 免费额度: 10,000封/月
- 支持大附件
- 详细的发送统计

### 方案3: AWS SES
```bash
# 安装AWS SDK
npm install aws-sdk

# 设置AWS凭证
firebase functions:config:set aws.access_key="your-aws-access-key"
firebase functions:config:set aws.secret_key="your-aws-secret-key"
firebase functions:config:set aws.region="us-east-1"
```

**优势:**
- 按使用量付费
- 高可靠性
- 支持大量发送

## 🚀 **快速开始**

### 使用Gmail (当前实现)
1. 设置Gmail应用密码
2. 配置环境变量
3. 部署Cloud Functions
4. 测试邮件发送

### 使用SendGrid (推荐)
1. 注册SendGrid账户
2. 获取API密钥
3. 修改 `functions/src/emailService.ts`
4. 部署更新

## 📊 **邮件服务对比**

| 服务 | 免费额度 | 附件支持 | 设置难度 | 推荐度 |
|------|----------|----------|----------|--------|
| Gmail | 无限制 | 25MB | 简单 | ⭐⭐⭐ |
| SendGrid | 100封/天 | 无限制 | 简单 | ⭐⭐⭐⭐⭐ |
| Mailgun | 10,000封/月 | 无限制 | 中等 | ⭐⭐⭐⭐ |
| AWS SES | 按使用量 | 无限制 | 复杂 | ⭐⭐⭐ |

## 🔍 **故障排除**

### 常见问题
1. **Gmail认证失败**: 检查应用密码是否正确
2. **附件发送失败**: 检查文件大小是否超过限制
3. **邮件被标记为垃圾邮件**: 配置SPF和DKIM记录

### 调试步骤
1. 检查Cloud Functions日志
2. 验证环境变量设置
3. 测试邮件发送功能
4. 检查附件格式和大小

## 📞 **技术支持**

如果遇到问题，请检查：
1. Firebase Console中的函数日志
2. 环境变量是否正确设置
3. 邮件服务提供商的限制
4. 网络连接和防火墙设置
