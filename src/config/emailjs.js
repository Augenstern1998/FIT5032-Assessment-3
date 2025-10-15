import emailjs from '@emailjs/browser';

// EmailJS配置
const EMAILJS_CONFIG = {
  publicKey: '9iMVKiv0rnMYk2IUp',
  serviceId: 'service_mens_health',
  templates: {
    contact: 'template_contact_form', // 联系表单模板
    passwordReset: 'template_ux7hltn' // 密码重置模板
  },
  senderEmail: 'jackyw123y@gmail.com'
};

// 初始化EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

export { EMAILJS_CONFIG };
export default emailjs;
