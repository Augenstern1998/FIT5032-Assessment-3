import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  publicKey: '9iMVKiv0rnMYk2IUp',
  serviceId: 'service_mens_health',
  templates: {
    contact: 'template_contact_form', // Contact form template
    passwordReset: 'template_ux7hltn' // Password reset template
  },
  senderEmail: 'jackyw123y@gmail.com'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

export { EMAILJS_CONFIG };
export default emailjs;
