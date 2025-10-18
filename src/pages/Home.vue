<!-- Home page component displaying welcome message and daily health tips -->
<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Men's Health Platform</span>
          </h1>
          <p class="hero-subtitle">
            Empowering men with personalized health assessments, interactive maps, and comprehensive resources for better health outcomes
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">20+</span>
              <span class="stat-label">Health Questions</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">Interactive</span>
              <span class="stat-label">Health Maps</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">100%</span>
              <span class="stat-label">Free & Private</span>
            </div>
          </div>
          
          <!-- Show error message if redirected from unauthorized access -->
          <div v-if="$route.query.error === 'unauthorized'" class="alert alert-warning mt-4" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Access Denied:</strong> You don't have permission to access that page.
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-star me-3"></i>
            Key Features
          </h2>
          <p class="section-subtitle">Comprehensive health tools designed specifically for men</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <h4>Personalized Health Assessment</h4>
            <p>Complete 20+ health questions across mental, physical, cardiovascular, and diabetes categories to get personalized risk analysis and recommendations.</p>
            <router-link to="/health-services" class="feature-link">Start Assessment <i class="fas fa-arrow-right"></i></router-link>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-map-marked-alt"></i>
            </div>
            <h4>Interactive Health Maps</h4>
            <p>Find nearby health services with our interactive map. Search by location, filter by service type, and get directions to healthcare providers.</p>
            <router-link to="/health-services" class="feature-link">Explore Map <i class="fas fa-arrow-right"></i></router-link>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-book-open"></i>
            </div>
            <h4>Comprehensive Resources</h4>
            <p>Access detailed health resources covering stress management, sleep optimization, nutrition, exercise, and mental health strategies.</p>
            <router-link to="/resources" class="feature-link">Browse Resources <i class="fas fa-arrow-right"></i></router-link>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-download"></i>
            </div>
            <h4>Download Health Reports</h4>
            <p>Generate and download your personalized health assessment reports in multiple formats (HTML, PDF, CSV) for your records.</p>
            <router-link to="/health-services" class="feature-link">Get Reports <i class="fas fa-arrow-right"></i></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Health Tips Section -->
    <section class="tips-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-lightbulb me-3"></i>
            Today's Health Tips
          </h2>
          <p class="section-subtitle">Simple, actionable advice for better health</p>
        </div>

        <div class="tips-grid">
          <div v-for="(t, index) in tips" :key="t.id" class="tip-card" :class="`tip-card-${index + 1}`">
            <div class="tip-icon">
              <i :class="getTipIcon(index)"></i>
            </div>
            <div class="tip-content">
              <h5 class="tip-title">{{ t.title || 'Daily Tip' }}</h5>
              <p class="tip-text">{{ t.text }}</p>
              <div class="tip-category">{{ t.category || 'General Health' }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Section -->
    <section class="why-choose-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose Our Platform?</h2>
          <p class="section-subtitle">Designed specifically for men's health needs</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-user-md"></i>
            </div>
            <h4>Evidence-Based</h4>
            <p>Health assessments and recommendations based on medical research and best practices</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <h4>Accessible Design</h4>
            <p>WCAG 2.1 AA compliant with accessibility features for all users</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <h4>Local Services</h4>
            <p>Find nearby health services in Melbourne with real addresses and contact information</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h4>Privacy First</h4>
            <p>Your health data is secure, private, and never shared without your consent</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Take Control of Your Health?</h2>
          <p>Start your personalized health journey with our comprehensive assessment and interactive tools</p>
          <div class="cta-buttons">
            <router-link to="/health-services" class="btn btn-primary btn-lg">
              <i class="fas fa-clipboard-check me-2"></i>
              Start Health Assessment
            </router-link>
            <router-link to="/resources" class="btn btn-outline-primary btn-lg">
              <i class="fas fa-book me-2"></i>
              Browse Resources
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getCurrentUser, AUTH_CHANGED_EVENT } from '../utils/auth.js'
import tipsData from '../data/tips.json'

// Reactive reference for tips data
const tips = ref([])
const user = ref(null)

// Load tips data when component is mounted
onMounted(() => {
  tips.value = tipsData
  
  // Load current user
  loadUser()
  
  // Listen to auth changes
  window.addEventListener(AUTH_CHANGED_EVENT, loadUser)
  window.addEventListener('firebase_auth_changed', loadUser)
})

onBeforeUnmount(() => {
  window.removeEventListener(AUTH_CHANGED_EVENT, loadUser)
  window.removeEventListener('firebase_auth_changed', loadUser)
})

async function loadUser() {
  try {
    user.value = await getCurrentUser()
    console.log('Home page user loaded:', user.value)
  } catch (error) {
    console.error('Failed to load user in home page:', error)
    user.value = null
  }
}

// Get icon for each tip based on index
const getTipIcon = (index) => {
  const icons = [
    'fas fa-walking',
    'fas fa-coffee',
    'fas fa-clock',
    'fas fa-bed',
    'fas fa-lungs',
    'fas fa-carrot'
  ]
  return icons[index] || 'fas fa-heart'
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 70vh;
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
  font-size: 3.5rem;
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
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  font-weight: 300;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Tips Section */
.tips-section {
  padding: 5rem 0;
  background: #f8f9fa;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.tip-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tip-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.tip-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.tip-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.tip-icon i {
  font-size: 1.5rem;
  color: white;
}

.tip-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.tip-text {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tip-category {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: white;
}

.why-choose-section {
  padding: 5rem 0;
  background: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 15px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.feature-icon i {
  font-size: 2rem;
  color: white;
}

.feature-card h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.feature-link:hover {
  color: #764ba2;
  transform: translateX(5px);
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-outline-primary {
  border: 2px solid #667eea;
  color: #667eea;
  background: transparent;
}

.btn-outline-primary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-lg {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .tip-card {
    padding: 1.5rem;
  }
}
</style>

