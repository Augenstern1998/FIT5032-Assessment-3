import emailjs, { EMAILJS_CONFIG } from '../config/emailjs.js';

/**
 * Send contact email using sendForm method (supports file attachments)
 * @param {HTMLFormElement} formElement - Form element containing all data
 * @returns {Promise<boolean>} - Whether sending was successful
 */
export async function sendContactEmailWithForm(formElement) {
  try {
    console.log('Sending contact email with form and attachments...');
    
    const result = await emailjs.sendForm(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.contact,
      formElement
    );

    console.log('Contact email with attachments sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send contact email with form:', error);
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
 * Send contact email to developer
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - User name
 * @param {string} contactData.email - User email
 * @param {string} contactData.subject - Email subject
 * @param {string} contactData.message - Email content
 * @param {File|null} contactData.attachment - Attachment file
 * @param {boolean} contactData.subscribeNewsletter - Whether to subscribe to newsletter
 * @returns {Promise<boolean>} - Whether sending was successful
 */
export async function sendContactEmail(contactData) {
  try {
    console.log('Sending contact email from:', contactData.email);
    
    // Handle attachment information
    let attachmentInfo = '';
    if (contactData.attachment) {
      attachmentInfo = `

📎 ATTACHMENT INFORMATION:
File Name: ${contactData.attachment.name}
File Size: ${formatFileSize(contactData.attachment.size)}
File Type: ${contactData.attachment.type}`;
    }
    
    // Use EmailJS supported template parameters
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

    // EmailJS attachment handling - using official recommended method
    if (contactData.attachment) {
      try {
        // Convert file to base64
        const base64File = await fileToBase64(contactData.attachment);
        
        // EmailJS attachment parameters
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
        // Continue sending email, but without attachment
      }
    }

    // Send email using contact form template
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
 * Send simplified contact email (for testing)
 * @param {Object} contactData - Contact form data
 * @returns {Promise<boolean>} - Whether sending was successful
 */
export async function sendSimpleContactEmail(contactData) {
  try {
    console.log('Sending simple contact email from:', contactData.email);
    
    // Use most basic template parameters
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
 * Send password reset email
 * @param {Object} userData - User data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} resetLink - Reset link
 * @returns {Promise<boolean>} - Whether sending was successful
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
 * Send general email
 * @param {string} templateId - Template ID
 * @param {Object} templateParams - Template parameters
 * @returns {Promise<boolean>} - Whether sending was successful
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
 * Convert file to Base64 string
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 string
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
 * Format file size
 * @param {number} bytes - Number of bytes
 * @returns {string} - Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
