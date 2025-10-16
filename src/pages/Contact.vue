<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Contact Us</span>
          </h1>
          <p class="hero-subtitle">
            Have questions, feedback, or need support? We'd love to hear from you! 
            Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-container">
          <div class="contact-form-wrapper">
            <div class="form-header">
              <h2 class="section-title">
                <i class="fas fa-paper-plane me-3"></i>
                Send us a Message
              </h2>
              <p class="section-subtitle">We're here to help and would love to hear from you</p>
            </div>

            <div v-if="notice" class="alert" :class="noticeClass" role="alert">{{ notice }}</div>

            <form @submit.prevent="onSubmit" novalidate class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name" class="form-label">
                    <i class="fas fa-user me-2"></i>
                    Your Name *
                  </label>
                  <input 
                    id="name" 
                    type="text" 
                    class="form-control" 
                    v-model.trim="formData.name" 
                    required 
                    :disabled="isLoading"
                    placeholder="Enter your full name"
                  />
                </div>
                <div class="form-group">
                  <label for="email" class="form-label">
                    <i class="fas fa-envelope me-2"></i>
                    Your Email *
                  </label>
                  <input 
                    id="email" 
                    type="email" 
                    class="form-control" 
                    v-model.trim="formData.email" 
                    required 
                    :disabled="isLoading"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="subject" class="form-label">
                  <i class="fas fa-tag me-2"></i>
                  Subject *
                </label>
                <select 
                  id="subject" 
                  class="form-select" 
                  v-model="formData.subject" 
                  required 
                  :disabled="isLoading"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message" class="form-label">
                  <i class="fas fa-comment me-2"></i>
                  Message *
                </label>
                <textarea 
                  id="message" 
                  class="form-control" 
                  rows="6" 
                  v-model.trim="formData.message" 
                  required 
                  :disabled="isLoading"
                  placeholder="Please describe your inquiry in detail (minimum 10 characters)..."
                ></textarea>
                <div class="form-text">
                  {{ formData.message.length }}/1000 characters
                  <span v-if="formData.message.length > 0 && formData.message.length < 10" class="text-danger">
                    (Minimum 10 characters required)
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="attachment" class="form-label">
                  <i class="fas fa-paperclip me-2"></i>
                  Attachment (Optional)
                </label>
                <input 
                  id="attachment" 
                  type="file" 
                  class="form-control" 
                  @change="handleFileUpload"
                  :disabled="isLoading"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
                <div class="form-text">
                  Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF (Max 5MB)
                </div>
                <div v-if="formData.attachment" class="mt-2">
                  <div class="alert alert-info d-flex justify-content-between align-items-center">
                    <span>
                      <i class="fas fa-paperclip me-2"></i>
                      {{ formData.attachment.name }} ({{ formatFileSize(formData.attachment.size) }})
                    </span>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removeAttachment">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="form-check">
                  <input 
                    id="newsletter" 
                    class="form-check-input" 
                    type="checkbox" 
                    v-model="formData.subscribeNewsletter"
                    :disabled="isLoading"
                  />
                  <label class="form-check-label" for="newsletter">
                    <i class="fas fa-bell me-2"></i>
                    Subscribe to our newsletter for updates and health tips
                  </label>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline-secondary" @click="resetForm" :disabled="isLoading">
                  <i class="fas fa-refresh me-2"></i>
                  Reset
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isLoading || !isFormValid">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <i v-else class="fas fa-paper-plane me-2"></i>
                  {{ isLoading ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </form>
          </div>

          <div class="contact-info-wrapper">
            <div class="info-card">
              <div class="info-header">
                <h3 class="info-title">
                  <i class="fas fa-info-circle me-2"></i>
                  Get in Touch
                </h3>
                <p class="info-subtitle">We're here to help you succeed</p>
              </div>
              
              <div class="info-content">
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="info-details">
                    <h6 class="info-label">Email</h6>
                    <p class="info-text">jackyw123y@gmail.com</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="info-details">
                    <h6 class="info-label">Response Time</h6>
                    <p class="info-text">We typically respond within 24-48 hours</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-calendar"></i>
                  </div>
                  <div class="info-details">
                    <h6 class="info-label">Business Hours</h6>
                    <p class="info-text">Monday - Friday<br>9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div class="info-divider"></div>

                <div class="quick-links">
                  <h6 class="quick-links-title">Quick Links</h6>
                  <div class="quick-links-list">
                    <RouterLink to="/resources" class="quick-link">
                      <i class="fas fa-book me-2"></i>
                      Health Resources
                    </RouterLink>
                    <RouterLink to="/join" class="quick-link">
                      <i class="fas fa-users me-2"></i>
                      Join Community
                    </RouterLink>
                    <RouterLink to="/" class="quick-link">
                      <i class="fas fa-home me-2"></i>
                      Home
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { validateEmail, sanitizeInput } from '../utils/security.js';
import { sendContactEmail, sendSimpleContactEmail } from '../utils/emailService.js';
import cloudFunctionService from '../services/cloudFunctions.js';

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  attachment: null,
  subscribeNewsletter: false
});

const notice = ref('');
const noticeClass = ref('alert-info');
const isLoading = ref(false);

const isFormValid = computed(() => {
  return formData.value.name.length >= 2 &&
         validateEmail(formData.value.email) &&
         formData.value.subject &&
         formData.value.message.length >= 10 &&
         formData.value.message.length <= 1000;
});

async function onSubmit() {
  notice.value = '';
  isLoading.value = true;
  
  try {
    // 验证表单
    if (!isFormValid.value) {
      noticeClass.value = 'alert-danger';
      notice.value = 'Please fill in all required fields correctly.';
      return;
    }

    // 清理输入
    const cleanData = {
      name: sanitizeInput(formData.value.name, 'name'),
      email: sanitizeInput(formData.value.email, 'email'),
      subject: sanitizeInput(formData.value.subject, 'text'),
      message: sanitizeInput(formData.value.message, 'text'),
      attachment: formData.value.attachment, // 文件对象不需要清理
      subscribeNewsletter: formData.value.subscribeNewsletter
    };

    // 发送联系邮件（优先使用云函数，回退到 EmailJS）
    let emailSent = false;
    try {
      // 尝试使用云函数发送邮件
      console.log('Attempting to send email via cloud function...');
      const cloudResult = await cloudFunctionService.sendContactEmail(cleanData);
      if (cloudResult.success) {
        emailSent = true;
        console.log('Email sent successfully via cloud function');
      } else {
        throw new Error('Cloud function failed');
      }
    } catch (cloudError) {
      console.warn('Cloud function failed, falling back to EmailJS:', cloudError);
      // 回退到 EmailJS
      try {
        emailSent = await sendSimpleContactEmail(cleanData);
      } catch (error) {
        console.error('Simple email failed, trying full version:', error);
        emailSent = await sendContactEmail(cleanData);
      }
    }

    if (emailSent) {
      noticeClass.value = 'alert-success';
      notice.value = 'Thank you for your message! We\'ll get back to you soon.';
      resetForm();
    } else {
      noticeClass.value = 'alert-danger';
      notice.value = 'Failed to send your message. Please try again or contact us directly.';
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    noticeClass.value = 'alert-danger';
    notice.value = 'An error occurred while sending your message. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // 验证文件大小 (5MB = 5 * 1024 * 1024 bytes)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    noticeClass.value = 'alert-danger';
    notice.value = 'File size must be less than 5MB.';
    event.target.value = ''; // 清空文件输入
    return;
  }

  // 验证文件类型
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ];

  if (!allowedTypes.includes(file.type)) {
    noticeClass.value = 'alert-danger';
    notice.value = 'File type not supported. Please upload PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, or GIF files.';
    event.target.value = ''; // 清空文件输入
    return;
  }

  formData.value.attachment = file;
  notice.value = ''; // 清除之前的错误信息
}

function removeAttachment() {
  formData.value.attachment = null;
  // 清空文件输入
  const fileInput = document.getElementById('attachment');
  if (fileInput) {
    fileInput.value = '';
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function resetForm() {
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
    attachment: null,
    subscribeNewsletter: false
  };
  notice.value = '';
  
  // 清空文件输入
  const fileInput = document.getElementById('attachment');
  if (fileInput) {
    fileInput.value = '';
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(45deg, #ffffff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
  max-width: 600px;
  margin: 0 auto;
}

/* Contact Section */
.contact-section {
  padding: 4rem 0;
  background: var(--gray-50);
}

.contact-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-form-wrapper {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: var(--gray-600);
  font-size: 1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.form-control, .form-select {
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all var(--transition-fast);
}

.form-control:focus, .form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.form-text {
  font-size: 0.875rem;
  color: var(--gray-500);
  margin-top: 0.25rem;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  margin: 0;
}

.form-check-label {
  font-weight: 500;
  color: var(--gray-700);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Contact Info Card */
.contact-info-wrapper {
  display: flex;
  flex-direction: column;
}

.info-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.info-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-subtitle {
  color: var(--gray-600);
  font-size: 0.95rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 1rem;
  color: white;
}

.info-details {
  flex: 1;
}

.info-label {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.info-text {
  color: var(--gray-600);
  font-size: 0.9rem;
  margin: 0;
}

.info-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 1rem 0;
}

.quick-links-title {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.quick-links-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--gray-700);
  font-weight: 500;
  transition: all var(--transition-fast);
  border: 1px solid var(--gray-200);
}

.quick-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(5px);
  text-decoration: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .contact-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-form-wrapper,
  .info-card {
    padding: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .info-card {
    position: static;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .contact-form-wrapper,
  .info-card {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>
