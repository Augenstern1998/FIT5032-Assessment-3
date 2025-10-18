<!-- DataExport.vue - Data export and download page -->
<template>
  <div class="data-export-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="page-title">
              <i class="fas fa-download me-3"></i>
              Data Export Center
            </h1>
            <p class="page-subtitle">
              Export health resources, user data, and analytics in various formats. 
              Access comprehensive data exports for research, analysis, and reporting purposes.
            </p>
          </div>
          <div class="col-md-4 text-end">
            <div class="export-stats">
              <div class="stat-item">
                <span class="stat-number">{{ totalExports }}</span>
                <span class="stat-label">Total Exports</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ availableFormats }}</span>
                <span class="stat-label">Formats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Tools -->
    <div class="export-section">
      <div class="container">
        <DataExporter />
      </div>
    </div>

    <!-- Export Guidelines -->
    <div class="guidelines-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <h2 class="section-title">Export Guidelines</h2>
            <div class="guidelines-content">
              <div class="guideline-item">
                <div class="guideline-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="guideline-content">
                  <h5>Data Privacy & Security</h5>
                  <p>
                    All exported data is anonymized and complies with privacy regulations. 
                    Personal information is protected and only aggregated data is included in exports.
                  </p>
                </div>
              </div>
              
              <div class="guideline-item">
                <div class="guideline-icon">
                  <i class="fas fa-file-alt"></i>
                </div>
                <div class="guideline-content">
                  <h5>Export Formats</h5>
                  <p>
                    Choose from CSV, PDF, JSON, or Excel formats based on your needs. 
                    Each format is optimized for different use cases and analysis tools.
                  </p>
                </div>
              </div>
              
              <div class="guideline-item">
                <div class="guideline-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="guideline-content">
                  <h5>Export Limits</h5>
                  <p>
                    Large exports may take time to process. Downloads are available for 7 days 
                    after generation. Contact support for bulk data requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="quick-actions-card">
              <h5>Quick Actions</h5>
              <div class="quick-actions">
                <button 
                  class="btn btn-outline-primary w-100 mb-2"
                  @click="exportHealthResources"
                  :disabled="isLoading"
                >
                  <i class="fas fa-heartbeat me-2"></i>
                  Export Health Resources
                </button>
                
                <button 
                  class="btn btn-outline-success w-100 mb-2"
                  @click="exportUserData"
                  :disabled="isLoading"
                >
                  <i class="fas fa-users me-2"></i>
                  Export User Data
                </button>
                
                <button 
                  class="btn btn-outline-info w-100 mb-2"
                  @click="exportAnalytics"
                  :disabled="isLoading"
                >
                  <i class="fas fa-chart-bar me-2"></i>
                  Export Analytics
                </button>
                
                <button 
                  class="btn btn-outline-warning w-100"
                  @click="exportAllData"
                  :disabled="isLoading"
                >
                  <i class="fas fa-database me-2"></i>
                  Export All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export History -->
    <div class="history-section">
      <div class="container">
        <h2 class="section-title">Export History</h2>
        <div class="row">
          <div class="col-12">
            <div class="history-table">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Filename</th>
                      <th>Format</th>
                      <th>Size</th>
                      <th>Created</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="exportItem in exportHistory" :key="exportItem.id">
                      <td>
                        <i class="fas fa-file me-2"></i>
                        {{ exportItem.filename }}
                      </td>
                      <td>
                        <span class="badge" :class="getFormatBadgeClass(exportItem.format)">
                          {{ exportItem.format.toUpperCase() }}
                        </span>
                      </td>
                      <td>{{ exportItem.size }}</td>
                      <td>{{ formatDate(exportItem.timestamp) }}</td>
                      <td>
                        <span class="badge bg-success">Completed</span>
                      </td>
                      <td>
                        <div class="btn-group" role="group">
                          <button 
                            class="btn btn-sm btn-outline-primary"
                            @click="downloadExport(exportItem)"
                            :aria-label="`Download ${exportItem.filename}`"
                          >
                            <i class="fas fa-download"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-info"
                            @click="previewExport(exportItem)"
                            :aria-label="`Preview ${exportItem.filename}`"
                          >
                            <i class="fas fa-eye"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteExport(exportItem.id)"
                            :aria-label="`Delete ${exportItem.filename}`"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Templates -->
    <div class="templates-section">
      <div class="container">
        <h2 class="section-title">Export Templates</h2>
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4" v-for="template in exportTemplates" :key="template.id">
            <div class="template-card">
              <div class="template-icon">
                <i :class="template.icon"></i>
              </div>
              <div class="template-content">
                <h5>{{ template.name }}</h5>
                <p>{{ template.description }}</p>
                <div class="template-meta">
                  <span class="template-format">{{ template.format }}</span>
                  <span class="template-size">{{ template.size }}</span>
                </div>
                <button 
                  class="btn btn-primary btn-sm"
                  @click="useTemplate(template)"
                  :aria-label="`Use ${template.name} template`"
                >
                  Use Template
                </button>
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
import DataExporter from '../components/DataExporter.vue';

// Reactive data
const isLoading = ref(false);
const totalExports = ref(12);
const availableFormats = ref(4);
const exportHistory = ref([]);

// Export templates
const exportTemplates = ref([
  {
    id: 1,
    name: 'Health Resources Report',
    description: 'Complete health resources with categories and descriptions',
    icon: 'fas fa-heartbeat',
    format: 'PDF',
    size: '2.5 MB'
  },
  {
    id: 2,
    name: 'User Analytics',
    description: 'User engagement and activity analytics',
    icon: 'fas fa-chart-line',
    format: 'Excel',
    size: '1.8 MB'
  },
  {
    id: 3,
    name: 'Service Locations',
    description: 'Healthcare service locations and contact information',
    icon: 'fas fa-map-marker-alt',
    format: 'CSV',
    size: '850 KB'
  },
  {
    id: 4,
    name: 'Mental Health Resources',
    description: 'Specialized mental health resources and support materials',
    icon: 'fas fa-brain',
    format: 'JSON',
    size: '1.2 MB'
  },
  {
    id: 5,
    name: 'Emergency Contacts',
    description: 'Emergency services and crisis support contacts',
    icon: 'fas fa-ambulance',
    format: 'PDF',
    size: '650 KB'
  },
  {
    id: 6,
    name: 'Research Data',
    description: 'Anonymized research data for academic purposes',
    icon: 'fas fa-microscope',
    format: 'Excel',
    size: '3.2 MB'
  }
]);

// Methods
const exportHealthResources = async () => {
  isLoading.value = true;
  try {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Health resources exported');
  } catch (error) {
    console.error('Export error:', error);
  } finally {
    isLoading.value = false;
  }
};

const exportUserData = async () => {
  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('User data exported');
  } catch (error) {
    console.error('Export error:', error);
  } finally {
    isLoading.value = false;
  }
};

const exportAnalytics = async () => {
  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Analytics exported');
  } catch (error) {
    console.error('Export error:', error);
  } finally {
    isLoading.value = false;
  }
};

const exportAllData = async () => {
  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('All data exported');
  } catch (error) {
    console.error('Export error:', error);
  } finally {
    isLoading.value = false;
  }
};

const getFormatBadgeClass = (format) => {
  const classes = {
    csv: 'bg-success',
    pdf: 'bg-danger',
    json: 'bg-warning',
    excel: 'bg-primary'
  };
  return classes[format] || 'bg-secondary';
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const downloadExport = (exportItem) => {
  console.log('Downloading:', exportItem.filename);
  // Implement download logic
};

const previewExport = (exportItem) => {
  console.log('Previewing:', exportItem.filename);
  // Implement preview logic
};

const deleteExport = (exportId) => {
  exportHistory.value = exportHistory.value.filter(item => item.id !== exportId);
  console.log('Deleted export:', exportId);
};

const useTemplate = (template) => {
  console.log('Using template:', template.name);
  // Implement template usage logic
};

// Lifecycle
onMounted(() => {
  // Load export history
  const savedHistory = localStorage.getItem('export-history');
  if (savedHistory) {
    try {
      exportHistory.value = JSON.parse(savedHistory);
    } catch (error) {
      console.error('Error loading export history:', error);
    }
  }
});
</script>

<style scoped>
.data-export-page {
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

.export-stats {
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

.export-section,
.guidelines-section,
.history-section,
.templates-section {
  padding: 60px 0;
  background: white;
}

.guidelines-section {
  background: #f8f9fa;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.guidelines-content {
  margin-bottom: 30px;
}

.guideline-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 25px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.guideline-icon {
  font-size: 2.5rem;
  color: #667eea;
  margin-right: 20px;
  margin-top: 5px;
}

.guideline-content h5 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.guideline-content p {
  color: #6c757d;
  margin-bottom: 0;
}

.quick-actions-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.quick-actions-card h5 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.history-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.template-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.template-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 20px;
  text-align: center;
}

.template-content h5 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: center;
}

.template-content p {
  color: #6c757d;
  margin-bottom: 15px;
  text-align: center;
}

.template-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.template-format {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
}

.template-size {
  color: #6c757d;
}

/* Responsive design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .export-stats {
    justify-content: center;
    margin-top: 20px;
  }
  
  .guideline-item {
    flex-direction: column;
    text-align: center;
  }
  
  .guideline-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>
