import emailjs, { EMAILJS_CONFIG } from '../config/emailjs.js';

/**
 * 发送联系邮件给开发者
 * @param {Object} contactData - 联系表单数据
 * @param {string} contactData.name - 用户姓名
 * @param {string} contactData.email - 用户邮箱
 * @param {string} contactData.subject - 邮件主题
 * @param {string} contactData.message - 邮件内容
 * @param {File|null} contactData.attachment - 附件文件
 * @param {boolean} contactData.subscribeNewsletter - 是否订阅新闻
 * @returns {Promise<boolean>} - 发送是否成功
 */
export async function sendContactEmail(contactData) {
  try {
    console.log('Sending contact email from:', contactData.email);
    
    // 处理附件信息
    let attachmentInfo = '';
    if (contactData.attachment) {
      attachmentInfo = `

📎 ATTACHMENT INFORMATION:
File Name: ${contactData.attachment.name}
File Size: ${formatFileSize(contactData.attachment.size)}
File Type: ${contactData.attachment.type}`;
    }
    
    // 使用EmailJS支持的模板参数
    const templateParams = {
      user_name: contactData.name,
      user_email: contactData.email,
      subject: contactData.subject,
      message: `${contactData.message}${attachmentInfo}

Additional Information:
- Newsletter Subscription: ${contactData.subscribeNewsletter ? 'Yes' : 'No'}
- Timestamp: ${new Date().toLocaleString()}
- Page URL: ${window.location.href}`
    };

    // EmailJS附件处理 - 使用官方推荐的方式
    if (contactData.attachment) {
      try {
        // 将文件转换为base64
        const base64File = await fileToBase64(contactData.attachment);
        
        // EmailJS附件参数
        templateParams.attachment_base64 = base64File;
        templateParams.attachment_filename = contactData.attachment.name;
        templateParams.attachment_type = contactData.attachment.type;
        
        console.log('Attachment processed for EmailJS:', {
          filename: contactData.attachment.name,
          size: contactData.attachment.size,
          type: contactData.attachment.type
        });
      } catch (error) {
        console.warn('Failed to process attachment:', error);
        // 继续发送邮件，但不包含附件
      }
    }

    // 使用联系表单模板发送邮件
    console.log('Sending email with params:', templateParams);
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('Template ID:', EMAILJS_CONFIG.templates.contact);
    
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.contact,
      templateParams
    );

    console.log('Contact email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send contact email:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status,
      text: error.text
    });
    return false;
  }
}

/**
 * 发送简化的联系邮件（用于测试）
 * @param {Object} contactData - 联系表单数据
 * @returns {Promise<boolean>} - 发送是否成功
 */
export async function sendSimpleContactEmail(contactData) {
  try {
    console.log('Sending simple contact email from:', contactData.email);
    
    // 使用最基本的模板参数
    const templateParams = {
      user_name: contactData.name,
      user_email: contactData.email,
      subject: contactData.subject,
      message: contactData.message
    };

    console.log('Sending simple email with params:', templateParams);
    
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.contact,
      templateParams
    );

    console.log('Simple contact email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send simple contact email:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status,
      text: error.text
    });
    return false;
  }
}

/**
 * 发送密码重置邮件
 * @param {Object} userData - 用户数据
 * @param {string} userData.name - 用户姓名
 * @param {string} userData.email - 用户邮箱
 * @param {string} resetLink - 重置链接
 * @returns {Promise<boolean>} - 发送是否成功
 */
export async function sendPasswordResetEmail(userData, resetLink) {
  try {
    console.log('Sending password reset email to:', userData.email);
    
    const templateParams = {
      user_name: userData.name,
      user_email: userData.email,
      reset_link: resetLink
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.passwordReset,
      templateParams
    );

    console.log('Password reset email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

/**
 * 发送通用邮件
 * @param {string} templateId - 模板ID
 * @param {Object} templateParams - 模板参数
 * @returns {Promise<boolean>} - 发送是否成功
 */
export async function sendEmail(templateId, templateParams) {
  try {
    console.log('Sending email with template:', templateId);
    
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      templateId,
      templateParams
    );

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * 将文件转换为Base64字符串
 * @param {File} file - 要转换的文件
 * @returns {Promise<string>} - Base64字符串
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} - 格式化后的文件大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
