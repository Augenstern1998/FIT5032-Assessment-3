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
              <h5>Personalized Health Assessment</h5>
              <p class="text-muted mb-4">Get a comprehensive health risk evaluation tailored to your profile</p>
              
              <form @submit.prevent="startHealthAssessment">
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
                  <label class="form-label">Postcode</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="healthCheck.postcode"
                    placeholder="Enter your postcode (e.g., 3000)"
                    pattern="[0-9]{4}"
                    maxlength="4"
                    required
                  >
                  <small class="text-muted">We'll find nearby health services based on your postcode</small>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Primary Health Concerns</label>
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
                
                <button type="submit" class="btn btn-primary w-100" :disabled="!healthCheck.ageGroup || !healthCheck.postcode || healthCheck.concerns.length === 0">
                  <i class="fas fa-clipboard-list me-2"></i>
                  Start Assessment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Health Assessment Questionnaire Modal -->
    <div v-if="showAssessmentModal" class="assessment-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Health Risk Assessment</h4>
          <button @click="closeAssessment" class="btn-close" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
          <!-- Progress Bar -->
          <div class="progress mb-4">
            <div class="progress-bar" :style="{ width: `${(currentQuestion / assessmentQuestions.length) * 100}%` }"></div>
          </div>
          
          <!-- Question -->
          <div v-if="currentQuestion < assessmentQuestions.length" class="question-section">
            <h5 class="question-title">{{ assessmentQuestions[currentQuestion].question }}</h5>
            <p class="question-description">{{ assessmentQuestions[currentQuestion].description }}</p>
            
            <div class="answer-options">
              <div 
                v-for="(option, index) in assessmentQuestions[currentQuestion].options" 
                :key="index"
                class="option-card"
                :class="{ selected: selectedAnswer === option.value }"
                @click="selectAnswer(option.value)"
              >
                <div class="option-content">
                  <h6>{{ option.label }}</h6>
                  <p>{{ option.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Results -->
          <div v-else class="results-section">
            <div class="results-header">
              <h4>Your Health Assessment Results</h4>
              <p class="text-muted">Based on your responses, here are your personalized health insights</p>
            </div>
            
            <div class="risk-factors">
              <h6>Risk Factors Identified:</h6>
              <ul>
                <li v-for="risk in assessmentResults.riskFactors" :key="risk.id" :class="risk.level">
                  <i :class="risk.icon"></i>
                  {{ risk.name }} - {{ risk.description }}
                </li>
              </ul>
            </div>
            
            <div class="recommendations">
              <h6>Personalized Recommendations:</h6>
              <ul>
                <li v-for="recommendation in assessmentResults.recommendations" :key="recommendation.id">
                  <i class="fas fa-check-circle text-success"></i>
                  {{ recommendation.text }}
                </li>
              </ul>
            </div>
            
            <div class="nearby-services">
              <h6>Recommended Services Near You:</h6>
              <div class="service-list">
                <div v-for="service in assessmentResults.nearbyServices" :key="service.id" class="service-item">
                  <i :class="service.icon"></i>
                  <div>
                    <strong>{{ service.name }}</strong>
                    <p>{{ service.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button v-if="currentQuestion < assessmentQuestions.length" @click="nextQuestion" class="btn btn-primary" :disabled="!selectedAnswer">
            {{ currentQuestion === assessmentQuestions.length - 1 ? 'Get Results' : 'Next Question' }}
          </button>
          <div v-else class="download-section">
            <button @click="showDownloadOptions = true" class="btn btn-success btn-lg">
              <i class="fas fa-download me-2"></i>
              Download Report
            </button>
          </div>
          <button @click="closeAssessment" class="btn btn-secondary">
            {{ currentQuestion < assessmentQuestions.length ? 'Cancel' : 'Close' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Download Options Modal -->
    <div v-if="showDownloadOptions" class="download-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Choose Download Format</h4>
          <button @click="showDownloadOptions = false" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="text-muted mb-4">Select the format you'd like to download your health assessment report:</p>
          <div class="download-options">
            <button @click="downloadReport('html')" class="download-option">
              <div class="option-icon">
                <i class="fas fa-file-code"></i>
              </div>
              <div class="option-content">
                <h6>HTML Report</h6>
                <p>Complete formatted report with styling</p>
              </div>
            </button>
            <button @click="downloadReport('pdf')" class="download-option">
              <div class="option-icon">
                <i class="fas fa-file-pdf"></i>
              </div>
              <div class="option-content">
                <h6>PDF Report</h6>
                <p>Print-ready document for sharing</p>
              </div>
            </button>
            <button @click="downloadReport('csv')" class="download-option">
              <div class="option-icon">
                <i class="fas fa-file-csv"></i>
              </div>
              <div class="option-content">
                <h6>CSV Data</h6>
                <p>Structured data for analysis</p>
              </div>
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showDownloadOptions = false" class="btn btn-secondary">Cancel</button>
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
const showAssessmentModal = ref(false);
const showDownloadOptions = ref(false);
const currentQuestion = ref(0);
const selectedAnswer = ref(null);
const assessmentAnswers = ref([]);


// Health check form
const healthCheck = ref({
  ageGroup: '',
  postcode: '',
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

// Assessment questions - Comprehensive health assessment
const assessmentQuestions = ref([
  // Mental Health Questions (1-5)
  {
    id: 1,
    question: "How would you rate your current stress levels?",
    description: "Consider work, personal life, and daily pressures",
    category: 'mental',
    options: [
      { value: 'low', label: 'Low Stress', description: 'I feel calm and in control most of the time' },
      { value: 'moderate', label: 'Moderate Stress', description: 'I experience stress but can manage it' },
      { value: 'high', label: 'High Stress', description: 'I often feel overwhelmed and stressed' },
      { value: 'severe', label: 'Severe Stress', description: 'I feel constantly overwhelmed and unable to cope' }
    ]
  },
  {
    id: 2,
    question: "How often do you feel anxious or worried?",
    description: "Consider both general anxiety and specific worries",
    category: 'mental',
    options: [
      { value: 'rarely', label: 'Rarely', description: 'I rarely feel anxious or worried' },
      { value: 'sometimes', label: 'Sometimes', description: 'I occasionally feel anxious but it passes quickly' },
      { value: 'often', label: 'Often', description: 'I frequently feel anxious or worried' },
      { value: 'constantly', label: 'Constantly', description: 'I feel anxious or worried most of the time' }
    ]
  },
  {
    id: 3,
    question: "How would you describe your mood over the past month?",
    description: "Consider your overall emotional state and outlook",
    category: 'mental',
    options: [
      { value: 'excellent', label: 'Excellent', description: 'I feel positive and optimistic most of the time' },
      { value: 'good', label: 'Good', description: 'I generally feel good with occasional low moods' },
      { value: 'fair', label: 'Fair', description: 'I have mixed moods, sometimes good, sometimes low' },
      { value: 'poor', label: 'Poor', description: 'I often feel down, sad, or hopeless' }
    ]
  },
  {
    id: 4,
    question: "How well do you cope with life's challenges?",
    description: "Consider your ability to handle problems and setbacks",
    category: 'mental',
    options: [
      { value: 'very_well', label: 'Very Well', description: 'I handle challenges effectively and bounce back quickly' },
      { value: 'well', label: 'Well', description: 'I generally cope well with most challenges' },
      { value: 'moderately', label: 'Moderately', description: 'I cope with some challenges but struggle with others' },
      { value: 'poorly', label: 'Poorly', description: 'I often struggle to cope with life\'s challenges' }
    ]
  },
  {
    id: 5,
    question: "Do you have a support network of friends and family?",
    description: "Consider people you can talk to and rely on",
    category: 'mental',
    options: [
      { value: 'strong', label: 'Strong Network', description: 'I have many close friends and family I can rely on' },
      { value: 'moderate', label: 'Moderate Network', description: 'I have some close relationships and support' },
      { value: 'limited', label: 'Limited Network', description: 'I have a few people I can talk to' },
      { value: 'isolated', label: 'Isolated', description: 'I feel alone and have few people to talk to' }
    ]
  },
  
  // Physical Health Questions (6-10)
  {
    id: 6,
    question: "How often do you exercise?",
    description: "Include all physical activities like walking, gym, sports",
    category: 'physical',
    options: [
      { value: 'daily', label: 'Daily', description: 'I exercise every day for at least 30 minutes' },
      { value: 'regular', label: '3-4 times per week', description: 'I exercise regularly throughout the week' },
      { value: 'occasional', label: '1-2 times per week', description: 'I exercise occasionally but not consistently' },
      { value: 'rarely', label: 'Rarely or never', description: 'I rarely or never exercise' }
    ]
  },
  {
    id: 7,
    question: "How would you describe your sleep quality?",
    description: "Consider both duration and quality of your sleep",
    category: 'physical',
    options: [
      { value: 'excellent', label: 'Excellent', description: 'I sleep 7-9 hours and wake up refreshed' },
      { value: 'good', label: 'Good', description: 'I usually sleep well with occasional issues' },
      { value: 'poor', label: 'Poor', description: 'I often have trouble sleeping or feel tired' },
      { value: 'severe', label: 'Severe problems', description: 'I have chronic sleep problems affecting my daily life' }
    ]
  },
  {
    id: 8,
    question: "How would you rate your diet?",
    description: "Consider your daily eating habits and food choices",
    category: 'physical',
    options: [
      { value: 'excellent', label: 'Excellent', description: 'I eat a balanced diet with plenty of fruits and vegetables' },
      { value: 'good', label: 'Good', description: 'I generally eat well with some room for improvement' },
      { value: 'fair', label: 'Fair', description: 'My diet is okay but could be much better' },
      { value: 'poor', label: 'Poor', description: 'My diet is unhealthy and needs significant improvement' }
    ]
  },
  {
    id: 9,
    question: "How often do you consume alcohol?",
    description: "Consider your drinking habits and frequency",
    category: 'physical',
    options: [
      { value: 'never', label: 'Never', description: 'I don\'t drink alcohol' },
      { value: 'rarely', label: 'Rarely', description: 'I drink occasionally, less than once a week' },
      { value: 'moderately', label: 'Moderately', description: 'I drink 1-2 times per week in moderation' },
      { value: 'frequently', label: 'Frequently', description: 'I drink several times per week or daily' }
    ]
  },
  {
    id: 10,
    question: "Do you smoke or use tobacco products?",
    description: "Include cigarettes, vaping, chewing tobacco, etc.",
    category: 'physical',
    options: [
      { value: 'never', label: 'Never', description: 'I have never smoked or used tobacco' },
      { value: 'former', label: 'Former User', description: 'I used to smoke but have quit' },
      { value: 'occasional', label: 'Occasionally', description: 'I smoke occasionally or socially' },
      { value: 'regular', label: 'Regularly', description: 'I smoke daily or regularly' }
    ]
  },
  
  // Cardiovascular Health Questions (11-15)
  {
    id: 11,
    question: "Do you have any family history of heart disease?",
    description: "Consider parents, grandparents, siblings with heart conditions",
    category: 'cardio',
    options: [
      { value: 'none', label: 'No Family History', description: 'No heart disease in my immediate family' },
      { value: 'distant', label: 'Distant Relatives', description: 'Some distant relatives had heart issues' },
      { value: 'close', label: 'Close Family', description: 'One or more close family members affected' },
      { value: 'multiple', label: 'Multiple Family Members', description: 'Several close family members with heart disease' }
    ]
  },
  {
    id: 12,
    question: "How often do you experience chest pain or discomfort?",
    description: "Consider any chest pain, pressure, or tightness",
    category: 'cardio',
    options: [
      { value: 'never', label: 'Never', description: 'I never experience chest pain or discomfort' },
      { value: 'rarely', label: 'Rarely', description: 'I rarely have chest pain, maybe once a year' },
      { value: 'sometimes', label: 'Sometimes', description: 'I occasionally have chest pain or discomfort' },
      { value: 'frequently', label: 'Frequently', description: 'I often experience chest pain or discomfort' }
    ]
  },
  {
    id: 13,
    question: "How would you rate your blood pressure awareness?",
    description: "Consider your knowledge of your blood pressure status",
    category: 'cardio',
    options: [
      { value: 'excellent', label: 'Excellent', description: 'I know my BP is normal and check it regularly' },
      { value: 'good', label: 'Good', description: 'I check my BP occasionally and it\'s usually normal' },
      { value: 'fair', label: 'Fair', description: 'I don\'t check my BP often but it seems okay' },
      { value: 'poor', label: 'Poor', description: 'I rarely or never check my blood pressure' }
    ]
  },
  {
    id: 14,
    question: "How often do you feel short of breath during normal activities?",
    description: "Consider breathing difficulties during everyday tasks",
    category: 'cardio',
    options: [
      { value: 'never', label: 'Never', description: 'I never feel short of breath during normal activities' },
      { value: 'rarely', label: 'Rarely', description: 'I rarely feel short of breath' },
      { value: 'sometimes', label: 'Sometimes', description: 'I sometimes feel short of breath' },
      { value: 'often', label: 'Often', description: 'I frequently feel short of breath' }
    ]
  },
  {
    id: 15,
    question: "How would you describe your cholesterol awareness?",
    description: "Consider your knowledge of your cholesterol levels",
    category: 'cardio',
    options: [
      { value: 'excellent', label: 'Excellent', description: 'I know my cholesterol is normal and monitor it' },
      { value: 'good', label: 'Good', description: 'I check my cholesterol occasionally' },
      { value: 'fair', label: 'Fair', description: 'I don\'t check often but it seems okay' },
      { value: 'poor', label: 'Poor', description: 'I rarely or never check my cholesterol' }
    ]
  },
  
  // Diabetes Risk Questions (16-20)
  {
    id: 16,
    question: "Do you have a family history of diabetes?",
    description: "Consider parents, grandparents, siblings with diabetes",
    category: 'diabetes',
    options: [
      { value: 'none', label: 'No Family History', description: 'No diabetes in my immediate family' },
      { value: 'distant', label: 'Distant Relatives', description: 'Some distant relatives had diabetes' },
      { value: 'close', label: 'Close Family', description: 'One or more close family members affected' },
      { value: 'multiple', label: 'Multiple Family Members', description: 'Several close family members with diabetes' }
    ]
  },
  {
    id: 17,
    question: "How often do you feel unusually thirsty?",
    description: "Consider excessive thirst that seems abnormal",
    category: 'diabetes',
    options: [
      { value: 'never', label: 'Never', description: 'I never feel unusually thirsty' },
      { value: 'rarely', label: 'Rarely', description: 'I rarely feel unusually thirsty' },
      { value: 'sometimes', label: 'Sometimes', description: 'I sometimes feel unusually thirsty' },
      { value: 'often', label: 'Often', description: 'I frequently feel unusually thirsty' }
    ]
  },
  {
    id: 18,
    question: "How often do you need to urinate?",
    description: "Consider frequency of urination throughout the day",
    category: 'diabetes',
    options: [
      { value: 'normal', label: 'Normal', description: 'I urinate a normal amount, 4-6 times per day' },
      { value: 'slightly_more', label: 'Slightly More', description: 'I urinate slightly more than usual' },
      { value: 'frequently', label: 'Frequently', description: 'I urinate very frequently throughout the day' },
      { value: 'excessive', label: 'Excessively', description: 'I urinate excessively, disrupting my daily life' }
    ]
  },
  {
    id: 19,
    question: "How would you describe your weight management?",
    description: "Consider your weight stability and management efforts",
    category: 'diabetes',
    options: [
      { value: 'excellent', label: 'Excellent', description: 'I maintain a healthy weight easily' },
      { value: 'good', label: 'Good', description: 'I generally maintain a healthy weight' },
      { value: 'struggling', label: 'Struggling', description: 'I struggle to maintain a healthy weight' },
      { value: 'difficult', label: 'Very Difficult', description: 'I find it very difficult to manage my weight' }
    ]
  },
  {
    id: 20,
    question: "How often do you experience fatigue or low energy?",
    description: "Consider persistent tiredness that affects your daily life",
    category: 'diabetes',
    options: [
      { value: 'never', label: 'Never', description: 'I rarely feel fatigued or low on energy' },
      { value: 'rarely', label: 'Rarely', description: 'I occasionally feel tired but it\'s normal' },
      { value: 'sometimes', label: 'Sometimes', description: 'I sometimes feel unusually tired' },
      { value: 'often', label: 'Often', description: 'I frequently feel fatigued or low on energy' }
    ]
  }
]);

// Assessment results
const assessmentResults = ref({
  riskFactors: [],
  recommendations: [],
  nearbyServices: []
});


// Methods
const scrollToMap = () => {
  document.querySelector('.map-section').scrollIntoView({ 
    behavior: 'smooth' 
  });
};


// Assessment methods
const startHealthAssessment = () => {
  if (!healthCheck.value.ageGroup || !healthCheck.value.postcode || healthCheck.value.concerns.length === 0) {
    alert('Please fill in all required fields: age group, postcode, and at least one health concern');
    return;
  }
  
  showAssessmentModal.value = true;
  currentQuestion.value = 0;
  selectedAnswer.value = null;
  assessmentAnswers.value = [];
};

const selectAnswer = (value) => {
  selectedAnswer.value = value;
};

const nextQuestion = () => {
  if (!selectedAnswer.value) return;
  
  // Store the answer
  assessmentAnswers.value.push({
    questionId: assessmentQuestions.value[currentQuestion.value].id,
    answer: selectedAnswer.value
  });
  
  // Move to next question or show results
  if (currentQuestion.value < assessmentQuestions.value.length - 1) {
    currentQuestion.value++;
    selectedAnswer.value = null;
  } else {
    // Calculate results
    calculateAssessmentResults();
  }
};

const calculateAssessmentResults = () => {
  // Analyze answers and generate personalized results
  const results = {
    riskFactors: [],
    recommendations: [],
    nearbyServices: []
  };
  
  // Mental Health Analysis (Questions 1-5)
  const mentalHealthScore = calculateCategoryScore('mental', 1, 5);
  if (mentalHealthScore >= 3) {
    results.riskFactors.push({
      id: 'mental-health',
      name: 'Mental Health Concerns',
      description: 'Your responses indicate potential mental health challenges',
      level: mentalHealthScore >= 4 ? 'high' : 'moderate',
      icon: 'fas fa-brain'
    });
    results.recommendations.push({
      id: 'mental-health-support',
      text: 'Consider seeking professional mental health support and counseling'
    });
    results.nearbyServices.push({
      id: 'mental-health-1',
      name: 'Melbourne Men\'s Health Clinic',
      description: 'Specialized mental health services for men',
      icon: 'fas fa-brain'
    });
  }
  
  // Physical Health Analysis (Questions 6-10)
  const physicalHealthScore = calculateCategoryScore('physical', 6, 10);
  if (physicalHealthScore >= 3) {
    results.riskFactors.push({
      id: 'physical-health',
      name: 'Physical Health Risks',
      description: 'Your lifestyle choices may be impacting your physical health',
      level: physicalHealthScore >= 4 ? 'high' : 'moderate',
      icon: 'fas fa-dumbbell'
    });
    results.recommendations.push({
      id: 'lifestyle-improvement',
      text: 'Focus on improving diet, exercise, and sleep habits'
    });
  }
  
  // Cardiovascular Risk Analysis (Questions 11-15)
  const cardioScore = calculateCategoryScore('cardio', 11, 15);
  if (cardioScore >= 3) {
    results.riskFactors.push({
      id: 'cardiovascular',
      name: 'Cardiovascular Risk Factors',
      description: 'You may have increased risk for heart disease',
      level: cardioScore >= 4 ? 'high' : 'moderate',
      icon: 'fas fa-heartbeat'
    });
    results.recommendations.push({
      id: 'cardio-care',
      text: 'Schedule regular cardiovascular checkups and monitor blood pressure'
    });
    results.nearbyServices.push({
      id: 'cardio-1',
      name: 'Heart Health Center',
      description: 'Cardiac assessments and preventive care',
      icon: 'fas fa-heartbeat'
    });
  }
  
  // Diabetes Risk Analysis (Questions 16-20)
  const diabetesScore = calculateCategoryScore('diabetes', 16, 20);
  if (diabetesScore >= 3) {
    results.riskFactors.push({
      id: 'diabetes',
      name: 'Diabetes Risk Factors',
      description: 'You may have increased risk for diabetes',
      level: diabetesScore >= 4 ? 'high' : 'moderate',
      icon: 'fas fa-vial'
    });
    results.recommendations.push({
      id: 'diabetes-prevention',
      text: 'Monitor blood sugar levels and maintain a healthy weight'
    });
    results.nearbyServices.push({
      id: 'diabetes-1',
      name: 'Diabetes Care Center',
      description: 'Diabetes management and blood sugar monitoring',
      icon: 'fas fa-vial'
    });
  }
  
  // Add nearby services based on user location and concerns
  const nearbyServices = getNearbyServices(healthCheck.value.postcode, healthCheck.value.concerns);
  results.nearbyServices = nearbyServices;
  
  // Add general recommendations based on overall health
  if (results.riskFactors.length === 0) {
    results.recommendations.push({
      id: 'maintain-health',
      text: 'Great job! Continue maintaining your healthy lifestyle'
    });
  } else {
    results.recommendations.push({
      id: 'regular-checkups',
      text: 'Schedule regular health checkups with your GP'
    });
  }
  
  assessmentResults.value = results;
  currentQuestion.value = assessmentQuestions.value.length; // Show results
};

// Helper function to calculate category scores
const calculateCategoryScore = (category, startId, endId) => {
  let score = 0;
  const categoryAnswers = assessmentAnswers.value.filter(a => a.questionId >= startId && a.questionId <= endId);
  
  categoryAnswers.forEach(answer => {
    // Higher risk answers get higher scores
    if (['severe', 'constantly', 'poor', 'frequently', 'often', 'multiple', 'excessive', 'difficult'].includes(answer.answer)) {
      score += 3;
    } else if (['high', 'sometimes', 'fair', 'moderately', 'close', 'struggling'].includes(answer.answer)) {
      score += 2;
    } else if (['moderate', 'occasionally', 'good', 'well', 'distant', 'limited'].includes(answer.answer)) {
      score += 1;
    }
    // Low risk answers (low, rarely, excellent, very_well, none, strong) get 0 points
  });
  
  return score;
};

// Get nearby services based on user location and concerns
const getNearbyServices = (postcode, concerns) => {
  const nearbyServices = [];
  
  // Define service categories and their corresponding concerns
  const serviceCategories = {
    'mental-health': 'mental',
    'heart-disease': 'cardio', 
    'diabetes': 'diabetes',
    'obesity': 'general',
    'substance-abuse': 'mental',
    'stress': 'mental'
  };
  
  // Get services based on user concerns
  concerns.forEach(concern => {
    const category = serviceCategories[concern];
    if (category) {
      const services = getServicesByCategoryAndLocation(category, postcode);
      nearbyServices.push(...services);
    }
  });
  
  // If no specific concerns, recommend general practice
  if (concerns.length === 0) {
    const generalServices = getServicesByCategoryAndLocation('general', postcode);
    nearbyServices.push(...generalServices);
  }
  
  // Remove duplicates and limit to 5 services
  const uniqueServices = nearbyServices.filter((service, index, self) => 
    index === self.findIndex(s => s.id === service.id)
  ).slice(0, 5);
  
  return uniqueServices;
};

// Get services by category and location
const getServicesByCategoryAndLocation = (category, postcode) => {
  // This would typically query a database or API
  // For now, we'll return sample services based on location
  const allServices = [
    // Mental Health Services - Real Melbourne mental health services
    {
      id: 'mental-1',
      name: 'Melbourne Health Mental Health Services',
      address: '300 Grattan St, Parkville VIC 3052',
      category: 'mental',
      icon: 'fas fa-brain'
    },
    {
      id: 'mental-2', 
      name: 'Eastern Health Mental Health',
      address: '8 Arnold St, Box Hill VIC 3128',
      category: 'mental',
      icon: 'fas fa-brain'
    },
    {
      id: 'mental-3',
      name: 'Alfred Mental Health Service', 
      address: '55 Commercial Rd, Prahran VIC 3181',
      category: 'mental',
      icon: 'fas fa-brain'
    },
    {
      id: 'mental-4',
      name: 'Monash Health Mental Health',
      address: '246 Clayton Rd, Clayton VIC 3168',
      category: 'mental',
      icon: 'fas fa-brain'
    },
    
    // Cardiovascular Services - Real cardiac services
    {
      id: 'cardio-1',
      name: 'Melbourne Heart Centre',
      address: '100 Victoria Parade, Fitzroy VIC 3065', 
      category: 'cardio',
      icon: 'fas fa-heartbeat'
    },
    {
      id: 'cardio-2',
      name: 'Eastern Health Cardiology',
      address: '5 Arnold St, Box Hill VIC 3128',
      category: 'cardio', 
      icon: 'fas fa-heartbeat'
    },
    {
      id: 'cardio-3',
      name: 'Alfred Heart Centre',
      address: '55 Commercial Rd, Prahran VIC 3181',
      category: 'cardio',
      icon: 'fas fa-heartbeat'
    },
    {
      id: 'cardio-4',
      name: 'Monash Heart',
      address: '246 Clayton Rd, Clayton VIC 3168',
      category: 'cardio',
      icon: 'fas fa-heartbeat'
    },
    
    // Diabetes Services - Real diabetes clinics
    {
      id: 'diabetes-1',
      name: 'Royal Melbourne Hospital Diabetes Centre',
      address: '300 Grattan St, Parkville VIC 3052',
      category: 'diabetes',
      icon: 'fas fa-vial'
    },
    {
      id: 'diabetes-2',
      name: 'Eastern Health Diabetes Service',
      address: '8 Arnold St, Box Hill VIC 3128',
      category: 'diabetes',
      icon: 'fas fa-vial'
    },
    {
      id: 'diabetes-3',
      name: 'Alfred Diabetes Centre',
      address: '55 Commercial Rd, Prahran VIC 3181',
      category: 'diabetes',
      icon: 'fas fa-vial'
    },
    {
      id: 'diabetes-4',
      name: 'Monash Health Diabetes Centre',
      address: '246 Clayton Rd, Clayton VIC 3168',
      category: 'diabetes',
      icon: 'fas fa-vial'
    },
    
    // General Practice - Real GP clinics
    {
      id: 'general-1',
      name: 'Collins Street Medical Centre',
      address: '123 Collins St, Melbourne VIC 3000',
      category: 'general',
      icon: 'fas fa-user-md'
    },
    {
      id: 'general-2',
      name: 'Box Hill Medical Centre',
      address: '8 Arnold St, Box Hill VIC 3128',
      category: 'general',
      icon: 'fas fa-user-md'
    },
    {
      id: 'general-3',
      name: 'St Kilda Medical Centre',
      address: '156 Acland St, St Kilda VIC 3182',
      category: 'general',
      icon: 'fas fa-user-md'
    },
    {
      id: 'general-4',
      name: 'Clayton Medical Centre',
      address: '246 Clayton Rd, Clayton VIC 3168',
      category: 'general',
      icon: 'fas fa-user-md'
    },
    {
      id: 'general-5',
      name: 'Prahran Medical Centre',
      address: '55 Commercial Rd, Prahran VIC 3181',
      category: 'general',
      icon: 'fas fa-user-md'
    },
    
    // Emergency Services - Real hospitals
    {
      id: 'emergency-1',
      name: 'Royal Melbourne Hospital',
      address: '300 Grattan St, Parkville VIC 3052',
      category: 'emergency',
      icon: 'fas fa-ambulance'
    },
    {
      id: 'emergency-2',
      name: 'The Alfred Hospital',
      address: '55 Commercial Rd, Prahran VIC 3181',
      category: 'emergency',
      icon: 'fas fa-ambulance'
    },
    {
      id: 'emergency-3',
      name: 'Box Hill Hospital',
      address: '8 Arnold St, Box Hill VIC 3128',
      category: 'emergency',
      icon: 'fas fa-ambulance'
    },
    {
      id: 'emergency-4',
      name: 'Monash Medical Centre',
      address: '246 Clayton Rd, Clayton VIC 3168',
      category: 'emergency',
      icon: 'fas fa-ambulance'
    },
    {
      id: 'emergency-5',
      name: 'St Vincent\'s Hospital',
      address: '41 Victoria Parade, Fitzroy VIC 3065',
      category: 'emergency',
      icon: 'fas fa-ambulance'
    }
  ];
  
  // Filter services by category
  const categoryServices = allServices.filter(service => service.category === category);
  
  // For demo purposes, return services based on postcode proximity
  // In a real app, this would use geolocation APIs
  const postcodeNum = parseInt(postcode);
  let selectedServices = [];
  
  // CBD and inner city (3000-3009)
  if (postcodeNum >= 3000 && postcodeNum <= 3009) {
    selectedServices = categoryServices.filter(s => 
      s.address.includes('Collins St') || s.address.includes('Melbourne VIC 3000')
    );
  }
  // Eastern suburbs (3100-3199)
  else if (postcodeNum >= 3100 && postcodeNum <= 3199) {
    selectedServices = categoryServices.filter(s => 
      s.address.includes('Box Hill') || s.address.includes('Clayton')
    );
  }
  // Northern suburbs (3000-3099, excluding CBD)
  else if (postcodeNum >= 3010 && postcodeNum <= 3099) {
    selectedServices = categoryServices.filter(s => 
      s.address.includes('Parkville') || s.address.includes('Fitzroy')
    );
  }
  // Southern suburbs (3180-3199)
  else if (postcodeNum >= 3180 && postcodeNum <= 3199) {
    selectedServices = categoryServices.filter(s => 
      s.address.includes('St Kilda') || s.address.includes('Prahran')
    );
  }
  // Western suburbs (3000-3099, excluding CBD and North)
  else if (postcodeNum >= 3000 && postcodeNum <= 3099) {
    selectedServices = categoryServices.filter(s => 
      s.address.includes('Parkville') || s.address.includes('Fitzroy')
    );
  }
  // Default to major hospitals and CBD services
  else {
    selectedServices = categoryServices.filter(s => 
      s.address.includes('Parkville') || s.address.includes('Prahran') || s.address.includes('Box Hill')
    );
  }
  
  // If no services found for specific area, return general services
  if (selectedServices.length === 0) {
    selectedServices = categoryServices.slice(0, 2);
  }
  
  return selectedServices.map(service => ({
    id: service.id,
    name: service.name,
    description: service.address,
    icon: service.icon
  }));
};

const closeAssessment = () => {
  showAssessmentModal.value = false;
  currentQuestion.value = 0;
  selectedAnswer.value = null;
  assessmentAnswers.value = [];
};

// Download report function with multiple formats
const downloadReport = (format) => {
  const reportData = generateReportData();
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Close the download options modal
  showDownloadOptions.value = false;
  
  switch (format) {
    case 'html':
      downloadHTMLReport(reportData, timestamp);
      break;
    case 'pdf':
      downloadPDFReport(reportData, timestamp);
      break;
    case 'csv':
      downloadCSVReport(reportData, timestamp);
      break;
    default:
      console.error('Unsupported format:', format);
  }
};

// HTML Report Download
const downloadHTMLReport = (data, timestamp) => {
  const reportContent = generateReportHTML(data);
  const blob = new Blob([reportContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `health-assessment-report-${timestamp}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// PDF Report Download (using browser print to PDF)
const downloadPDFReport = (data, timestamp) => {
  const reportContent = generateReportHTML(data);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Please allow popups for this site to download PDF reports');
    return;
  }
  
  printWindow.document.write(reportContent);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    
    // Close the window after a short delay
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  }, 500);
};

// CSV Data Download
const downloadCSVReport = (data, timestamp) => {
  const csvContent = generateCSVContent(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `health-assessment-data-${timestamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


// Generate CSV content
const generateCSVContent = (data) => {
  let csvContent = '';
  
  // Add headers
  csvContent += 'Health Assessment Report\n';
  csvContent += 'Generated on,' + new Date().toLocaleDateString() + '\n\n';
  
  // User Profile Section
  csvContent += 'USER PROFILE\n';
  csvContent += 'Age Group,' + data.userProfile.ageGroup + '\n';
  csvContent += 'Postcode,' + data.userProfile.postcode + '\n';
  csvContent += 'Health Concerns,' + data.userProfile.concerns.join('; ') + '\n';
  csvContent += 'Questions Completed,' + data.userProfile.completedQuestions + '/' + data.userProfile.totalQuestions + '\n\n';
  
  // Risk Factors Section
  csvContent += 'RISK FACTORS\n';
  if (data.results.riskFactors.length > 0) {
    csvContent += 'Risk Factor,Level,Description\n';
    data.results.riskFactors.forEach(risk => {
      csvContent += `"${risk.name}","${risk.level}","${risk.description}"\n`;
    });
  } else {
    csvContent += 'No significant risk factors identified\n';
  }
  csvContent += '\n';
  
  // Recommendations Section
  csvContent += 'RECOMMENDATIONS\n';
  if (data.results.recommendations.length > 0) {
    csvContent += 'Recommendation\n';
    data.results.recommendations.forEach(rec => {
      csvContent += `"${rec.text}"\n`;
    });
  } else {
    csvContent += 'Continue maintaining your healthy lifestyle\n';
  }
  csvContent += '\n';
  
  // Nearby Services Section
  csvContent += 'RECOMMENDED SERVICES\n';
  if (data.results.nearbyServices.length > 0) {
    csvContent += 'Service Name,Description,Category\n';
    data.results.nearbyServices.forEach(service => {
      csvContent += `"${service.name}","${service.description}","${service.icon}"\n`;
    });
  } else {
    csvContent += 'No specific services recommended\n';
  }
  csvContent += '\n';
  
  // Assessment Answers Section
  csvContent += 'ASSESSMENT ANSWERS\n';
  csvContent += 'Question ID,Answer\n';
  data.answers.forEach(answer => {
    const question = assessmentQuestions.value.find(q => q.id === answer.questionId);
    if (question) {
      const option = question.options.find(opt => opt.value === answer.answer);
      csvContent += `${answer.questionId},"${option ? option.label : answer.answer}"\n`;
    }
  });
  
  return csvContent;
};

// Generate report data
const generateReportData = () => {
  const userProfile = {
    ageGroup: healthCheck.value.ageGroup,
    postcode: healthCheck.value.postcode,
    concerns: healthCheck.value.concerns,
    assessmentDate: new Date().toLocaleDateString(),
    totalQuestions: assessmentQuestions.value.length,
    completedQuestions: assessmentAnswers.value.length
  };
  
  return {
    userProfile,
    results: assessmentResults.value,
    answers: assessmentAnswers.value
  };
};

// Generate HTML report
const generateReportHTML = (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Assessment Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
        }
        .section {
            background: white;
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .risk-factor {
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #dc3545;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .risk-factor.moderate {
            border-left-color: #ffc107;
        }
        .risk-factor.low {
            border-left-color: #28a745;
        }
        .recommendation {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .service-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            margin: 10px 0;
        }
        .service-item i {
            font-size: 1.5rem;
            color: #667eea;
            margin-right: 15px;
        }
        .footer {
            text-align: center;
            color: #6c757d;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Health Assessment Report</h1>
        <p>Personalized Health Risk Assessment for Men's Health</p>
        <p>Generated on: ${data.userProfile.assessmentDate}</p>
    </div>

    <div class="section">
        <h2>Assessment Profile</h2>
        <p><strong>Age Group:</strong> ${data.userProfile.ageGroup}</p>
        <p><strong>Postcode:</strong> ${data.userProfile.postcode}</p>
        <p><strong>Health Concerns:</strong> ${data.userProfile.concerns.join(', ')}</p>
        <p><strong>Questions Completed:</strong> ${data.userProfile.completedQuestions}/${data.userProfile.totalQuestions}</p>
    </div>

    <div class="section">
        <h2>Risk Factors Identified</h2>
        ${data.results.riskFactors.length > 0 ? 
          data.results.riskFactors.map(risk => `
            <div class="risk-factor ${risk.level}">
                <h4>${risk.name}</h4>
                <p>${risk.description}</p>
            </div>
          `).join('') : 
          '<p>No significant risk factors identified. Keep up the good work!</p>'
        }
    </div>

    <div class="section">
        <h2>Personalized Recommendations</h2>
        ${data.results.recommendations.map(rec => `
            <div class="recommendation">
                <p>• ${rec.text}</p>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Recommended Health Services</h2>
        ${data.results.nearbyServices.length > 0 ? 
          data.results.nearbyServices.map(service => `
            <div class="service-item">
                <i class="${service.icon}"></i>
                <div>
                    <h4>${service.name}</h4>
                    <p>${service.description}</p>
                </div>
            </div>
          `).join('') : 
          '<p>No specific services recommended at this time.</p>'
        }
    </div>

    <div class="footer">
        <p>This report is generated by the Men's Health Platform</p>
        <p>For medical advice, please consult with a healthcare professional</p>
    </div>
</body>
</html>
  `;
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

.risk-assessment-section {
  padding: 60px 0;
  background: white;
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



/* Assessment Modal Styles */
.assessment-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.assessment-modal .modal-content {
  background: white;
  border-radius: 15px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.assessment-modal .modal-header {
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assessment-modal .modal-header h4 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assessment-modal .modal-body {
  padding: 30px;
}

.progress {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(45deg, #667eea, #764ba2);
  height: 100%;
  transition: width 0.3s ease;
}

.question-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.question-description {
  color: #6c757d;
  margin-bottom: 25px;
}

.answer-options {
  display: grid;
  gap: 15px;
}

.option-card {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.option-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.option-card.selected {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.option-content h6 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.option-content p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.results-section {
  text-align: left;
}

.results-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.risk-factors,
.recommendations,
.nearby-services {
  margin-bottom: 25px;
}

.risk-factors h6,
.recommendations h6,
.nearby-services h6 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}

.risk-factors ul,
.recommendations ul {
  list-style: none;
  padding: 0;
}

.risk-factors li,
.recommendations li {
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
  display: flex;
  align-items: flex-start;
}

.risk-factors li i,
.recommendations li i {
  margin-right: 10px;
  margin-top: 2px;
}

.risk-factors li.high {
  color: #dc3545;
}

.risk-factors li.moderate {
  color: #ffc107;
}

.risk-factors li.low {
  color: #28a745;
}

.service-list {
  display: grid;
  gap: 15px;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.service-item i {
  font-size: 1.5rem;
  color: #667eea;
  margin-right: 15px;
}

.service-item strong {
  color: #2c3e50;
  display: block;
  margin-bottom: 5px;
}

.service-item p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.assessment-modal .modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  
}

/* Download Section Styles */
.download-section {
  width: 100%;
  margin-bottom: 15px;
  text-align: center;
}

.download-section .btn {
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.download-section .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* Download Options Modal */
.download-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.download-modal .modal-content {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.download-modal .modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.download-modal .modal-header h4 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.download-modal .modal-body {
  padding: 25px;
}

.download-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.download-option {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.download-option:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(102, 126, 234, 0.2);
}

.option-icon {
  font-size: 2.5rem;
  color: #667eea;
  margin-right: 20px;
  width: 60px;
  text-align: center;
}

.option-content h6 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.option-content p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.download-modal .modal-footer {
  padding: 20px 25px;
  border-top: 1px solid #eee;
  text-align: right;
}

@media (max-width: 768px) {
  .download-modal .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .download-option {
    padding: 15px;
  }
  
  .option-icon {
    font-size: 2rem;
    margin-right: 15px;
    width: 50px;
  }
}
</style>
