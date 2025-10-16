<template>
  <section class="container py-4" style="max-width: 800px">
    <div class="row">
      <div class="col-lg-8">
        <h2 class="h4 mb-4">Contact Us</h2>
        <p class="text-muted mb-4">
          Have questions, feedback, or need support? We'd love to hear from you! 
          Send us a message and we'll get back to you as soon as possible.
        </p>

        <div v-if="notice" class="alert" :class="noticeClass" role="alert">{{ notice }}</div>

        <form @submit.prevent="onSubmit" novalidate>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="name" class="form-label">Your Name *</label>
              <input 
                id="name" 
                type="text" 
                class="form-control" 
                v-model.trim="formData.name" 
                required 
                :disabled="isLoading"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Your Email *</label>
              <input 
                id="email" 
                type="email" 
                class="form-control" 
                v-model.trim="formData.email" 
                required 
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="mb-3">
            <label for="subject" class="form-label">Subject *</label>
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

          <div class="mb-3">
            <label for="message" class="form-label">Message *</label>
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

          <div class="mb-3">
            <label for="attachment" class="form-label">Attachment (Optional)</label>
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

          <div class="mb-3">
            <div class="form-check">
              <input 
                id="newsletter" 
                class="form-check-input" 
                type="checkbox" 
                v-model="formData.subscribeNewsletter"
                :disabled="isLoading"
              />
              <label class="form-check-label" for="newsletter">
                Subscribe to our newsletter for updates and health tips
              </label>
            </div>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="button" class="btn btn-outline-secondary" @click="resetForm" :disabled="isLoading">
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

      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Get in Touch</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <h6 class="fw-bold">Email</h6>
              <p class="mb-0">jackyw123y@gmail.com</p>
            </div>
            
            <div class="mb-3">
              <h6 class="fw-bold">Response Time</h6>
              <p class="mb-0">We typically respond within 24-48 hours</p>
            </div>
            
            <div class="mb-3">
              <h6 class="fw-bold">Business Hours</h6>
              <p class="mb-0">Monday - Friday<br>9:00 AM - 6:00 PM</p>
            </div>

            <hr>

            <div class="mb-3">
              <h6 class="fw-bold">Quick Links</h6>
              <ul class="list-unstyled">
                <li><RouterLink to="/resources" class="text-decoration-none">Health Resources</RouterLink></li>
                <li><RouterLink to="/join" class="text-decoration-none">Join Community</RouterLink></li>
                <li><RouterLink to="/" class="text-decoration-none">Home</RouterLink></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
.form-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.card {
  border: 1px solid #dee2e6;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.list-unstyled li {
  margin-bottom: 0.5rem;
}
</style>
