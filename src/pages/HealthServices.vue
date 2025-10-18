<!-- HealthServices.vue - Health services locator page -->
<template>
  <div class="health-services-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="page-title">
              <i class="fas fa-map-marker-alt me-3"></i>
              Health Services Locator
            </h1>
            <p class="page-subtitle">
              Find nearby health services, get directions, and access health risk assessments 
              tailored for men's health needs in Melbourne and surrounding areas.
            </p>
          </div>
          <div class="col-md-4 text-end">
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-number">{{ healthServicesCount }}</span>
                <span class="stat-label">Services</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ coverageArea }}</span>
                <span class="stat-label">Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Services Map -->
    <div class="map-section">
      <div class="container-fluid px-0">
        <HealthMap :height="'600px'" />
      </div>
    </div>

    <!-- Health Service Categories -->
    <div class="categories-section">
      <div class="container">
        <h2 class="section-title">Health Service Categories</h2>
        <div class="row">
          <div 
            v-for="category in serviceCategories" 
            :key="category.id"
            class="col-lg-4 col-md-6 mb-4"
          >
            <div class="category-card" @click="scrollToMap">
              <div class="category-icon">
                <i :class="category.icon"></i>
              </div>
              <div class="category-content">
                <h5>{{ category.name }}</h5>
                <p>{{ category.description }}</p>
                <div class="category-stats">
                  <span class="stat">
                    <i class="fas fa-hospital"></i>
                    {{ category.count }} Services
                  </span>
                  <span class="stat">
                    <i class="fas fa-clock"></i>
                    {{ category.avgWaitTime }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Risk Assessment -->
    <div class="risk-assessment-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <h2 class="section-title">Health Risk Assessment</h2>
            <p class="section-description">
              Get personalized health risk assessments based on your location, 
              lifestyle factors, and local health data to make informed decisions about your health.
            </p>
            
            <div class="assessment-features">
              <div class="feature-item">
                <i class="fas fa-map-marked-alt"></i>
                <div>
                  <h6>Location-Based Analysis</h6>
                  <p>Assess health risks based on your geographic location and local environmental factors.</p>
                </div>
              </div>
              
              <div class="feature-item">
                <i class="fas fa-chart-line"></i>
                <div>
                  <h6>Personalized Recommendations</h6>
                  <p>Receive tailored health recommendations based on your risk profile and local resources.</p>
                </div>
              </div>
              
              <div class="feature-item">
                <i class="fas fa-users"></i>
                <div>
                  <h6>Community Health Insights</h6>
                  <p>Access community health statistics and trends in your area to understand local health patterns.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="assessment-card">
              <h5>Quick Health Check</h5>
              <form @submit.prevent="submitHealthCheck">
                <div class="mb-3">
                  <label class="form-label">Age Group</label>
                  <select class="form-select" v-model="healthCheck.ageGroup" required>
                    <option value="">Select Age Group</option>
                    <option value="18-30">18-30 years</option>
                    <option value="31-45">31-45 years</option>
                    <option value="46-60">46-60 years</option>
                    <option value="60+">60+ years</option>
                  </select>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Health Concerns</label>
                  <div class="form-check" v-for="concern in healthConcerns" :key="concern.id">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :value="concern.id"
                      v-model="healthCheck.concerns"
                      :id="concern.id"
                    >
                    <label class="form-check-label" :for="concern.id">
                      {{ concern.name }}
                    </label>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-100">
                  <i class="fas fa-calculator me-2"></i>
                  Get Assessment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Emergency Services -->
    <div class="emergency-section">
      <div class="container">
        <h2 class="section-title">Emergency Health Services</h2>
        <div class="row">
          <div class="col-md-6">
            <div class="emergency-card urgent">
              <div class="emergency-icon">
                <i class="fas fa-ambulance"></i>
              </div>
              <div class="emergency-content">
                <h5>Emergency Services</h5>
                <p>24/7 emergency medical services and ambulance services</p>
                <div class="emergency-actions">
                  <button class="btn btn-danger" @click="callEmergency">
                    <i class="fas fa-phone"></i> Call 000
                  </button>
                  <button class="btn btn-outline-danger" @click="findEmergencyServices">
                    <i class="fas fa-map-marker-alt"></i> Find Nearest
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="emergency-card">
              <div class="emergency-icon">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div class="emergency-content">
                <h5>Mental Health Crisis</h5>
                <p>24/7 mental health crisis support and counseling services</p>
                <div class="emergency-actions">
                  <button class="btn btn-warning" @click="callMentalHealth">
                    <i class="fas fa-phone"></i> Lifeline: 13 11 14
                  </button>
                  <button class="btn btn-outline-warning" @click="findMentalHealthServices">
                    <i class="fas fa-map-marker-alt"></i> Find Services
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Tips -->
    <div class="tips-section">
      <div class="container">
        <h2 class="section-title">Health Tips for Your Area</h2>
        <div class="row">
          <div 
            v-for="tip in healthTips" 
            :key="tip.id"
            class="col-lg-4 col-md-6 mb-4"
          >
            <div class="tip-card">
              <div class="tip-icon">
                <i :class="tip.icon"></i>
              </div>
              <div class="tip-content">
                <h6>{{ tip.title }}</h6>
                <p>{{ tip.description }}</p>
                <div class="tip-meta">
                  <span class="tip-category">{{ tip.category }}</span>
                  <span class="tip-relevance">{{ tip.relevance }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HealthMap from '../components/HealthMap.vue';

// Reactive data
const healthServicesCount = ref(25);
const coverageArea = ref('Melbourne Metro');
const showRiskAssessment = ref(false);

// Service categories
const serviceCategories = ref([
  {
    id: 'mental',
    name: 'Mental Health Services',
    icon: 'fas fa-brain',
    description: 'Specialized mental health support, counseling, and therapy services for men.',
    count: 8,
    avgWaitTime: '2-3 weeks'
  },
  {
    id: 'cardio',
    name: 'Cardiovascular Care',
    icon: 'fas fa-heartbeat',
    description: 'Heart health specialists, cardiac assessments, and preventive care.',
    count: 6,
    avgWaitTime: '1-2 weeks'
  },
  {
    id: 'diabetes',
    name: 'Diabetes Management',
    icon: 'fas fa-vial',
    description: 'Diabetes care, blood sugar monitoring, and nutrition counseling.',
    count: 4,
    avgWaitTime: '1 week'
  },
  {
    id: 'general',
    name: 'General Practice',
    icon: 'fas fa-user-md',
    description: 'Primary healthcare, health checkups, and preventive medicine.',
    count: 12,
    avgWaitTime: 'Same day'
  },
  {
    id: 'emergency',
    name: 'Emergency Services',
    icon: 'fas fa-ambulance',
    description: '24/7 emergency medical care and urgent health services.',
    count: 3,
    avgWaitTime: 'Immediate'
  }
]);

// Health check form
const healthCheck = ref({
  ageGroup: '',
  concerns: []
});

// Health concerns
const healthConcerns = ref([
  { id: 'mental-health', name: 'Mental Health & Depression' },
  { id: 'heart-disease', name: 'Heart Disease Risk' },
  { id: 'diabetes', name: 'Diabetes Risk' },
  { id: 'obesity', name: 'Weight Management' },
  { id: 'substance-abuse', name: 'Substance Use' },
  { id: 'stress', name: 'Stress Management' }
]);

// Health tips
const healthTips = ref([
  {
    id: 1,
    title: 'Regular Health Checkups',
    description: 'Schedule annual health checkups to catch potential health issues early.',
    icon: 'fas fa-calendar-check',
    category: 'Prevention',
    relevance: 'High'
  },
  {
    id: 2,
    title: 'Mental Health Awareness',
    description: 'Be aware of mental health signs and seek help when needed.',
    icon: 'fas fa-brain',
    category: 'Mental Health',
    relevance: 'High'
  },
  {
    id: 3,
    title: 'Exercise Regularly',
    description: 'Aim for at least 150 minutes of moderate exercise per week.',
    icon: 'fas fa-dumbbell',
    category: 'Lifestyle',
    relevance: 'High'
  },
  {
    id: 4,
    title: 'Healthy Diet',
    description: 'Eat a balanced diet with plenty of fruits, vegetables, and lean proteins.',
    icon: 'fas fa-apple-alt',
    category: 'Nutrition',
    relevance: 'Medium'
  },
  {
    id: 5,
    title: 'Sleep Quality',
    description: 'Maintain good sleep hygiene for 7-9 hours of quality sleep.',
    icon: 'fas fa-bed',
    category: 'Lifestyle',
    relevance: 'High'
  },
  {
    id: 6,
    title: 'Stress Management',
    description: 'Practice stress reduction techniques like meditation or deep breathing.',
    icon: 'fas fa-leaf',
    category: 'Mental Health',
    relevance: 'High'
  }
]);

// Methods
const scrollToMap = () => {
  document.querySelector('.map-section').scrollIntoView({ 
    behavior: 'smooth' 
  });
};

const submitHealthCheck = () => {
  console.log('Health check submitted:', healthCheck.value);
  // Here you would typically send the data to a backend service
  alert('Health assessment submitted! Check the map for personalized recommendations.');
};

const callEmergency = () => {
  window.open('tel:000', '_self');
};

const findEmergencyServices = () => {
  // This would filter the map to show only emergency services
  console.log('Finding emergency services...');
};

const callMentalHealth = () => {
  window.open('tel:131114', '_self');
};

const findMentalHealthServices = () => {
  // This would filter the map to show only mental health services
  console.log('Finding mental health services...');
};

// Lifecycle
onMounted(() => {
  console.log('Health Services page mounted');
});
</script>

<style scoped>
.health-services-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 0;
  margin-bottom: 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 0;
}

.quick-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.map-section {
  background: white;
  padding: 20px 0;
}

.categories-section,
.risk-assessment-section,
.emergency-section,
.tips-section {
  padding: 60px 0;
  background: white;
}

.categories-section {
  background: #f8f9fa;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.section-description {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 30px;
  text-align: center;
}

.category-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.category-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 20px;
}

.category-content h5 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}

.category-content p {
  color: #6c757d;
  margin-bottom: 20px;
}

.category-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.stat {
  font-size: 0.9rem;
  color: #6c757d;
}

.stat i {
  margin-right: 5px;
  color: #667eea;
}

.assessment-features {
  margin-top: 30px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.feature-item i {
  font-size: 2rem;
  color: #667eea;
  margin-right: 20px;
  margin-top: 5px;
}

.feature-item h6 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.feature-item p {
  color: #6c757d;
  margin-bottom: 0;
}

.assessment-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.assessment-card h5 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.emergency-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  align-items: center;
}

.emergency-card.urgent {
  border-left: 5px solid #dc3545;
}

.emergency-icon {
  font-size: 3rem;
  color: #dc3545;
  margin-right: 20px;
}

.emergency-content h5 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.emergency-content p {
  color: #6c757d;
  margin-bottom: 20px;
}

.emergency-actions {
  display: flex;
  gap: 10px;
}

.tip-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
}

.tip-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.tip-icon {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 15px;
}

.tip-content h6 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.tip-content p {
  color: #6c757d;
  margin-bottom: 15px;
}

.tip-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.tip-category {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
}

.tip-relevance {
  color: #28a745;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .quick-stats {
    justify-content: center;
    margin-top: 20px;
  }
  
  .emergency-card {
    flex-direction: column;
    text-align: center;
  }
  
  .emergency-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .emergency-actions {
    flex-direction: column;
  }
}
</style>
