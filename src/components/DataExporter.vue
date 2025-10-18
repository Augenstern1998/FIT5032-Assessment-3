<!-- DataExporter.vue - Data export functionality for health resources -->
<template>
  <div class="data-exporter">
    <!-- Export Controls -->
    <div class="export-controls">
      <div class="export-header">
        <h5>
          <i class="fas fa-download me-2"></i>
          Export Data
        </h5>
        <p class="text-muted">Export health resources and data in various formats</p>
      </div>
      
      <div class="export-options">
        <!-- Format Selection -->
        <div class="form-group mb-3">
          <label for="exportFormat" class="form-label">Export Format</label>
          <select 
            id="exportFormat" 
            class="form-select" 
            v-model="selectedFormat"
            @change="updateExportOptions"
            aria-describedby="formatHelp"
          >
            <option value="csv">CSV (Comma Separated Values)</option>
            <option value="pdf">PDF Document</option>
            <option value="json">JSON (JavaScript Object Notation)</option>
            <option value="excel">Excel Spreadsheet</option>
          </select>
          <div id="formatHelp" class="form-text">
            Choose the format that best suits your needs
          </div>
        </div>

        <!-- Data Selection -->
        <div class="form-group mb-3">
          <label class="form-label">Data to Export</label>
          <div class="form-check" v-for="dataType in availableDataTypes" :key="dataType.id">
            <input 
              class="form-check-input" 
              type="checkbox" 
              :id="dataType.id"
              :value="dataType.id"
              v-model="selectedDataTypes"
              :disabled="dataType.disabled"
            >
            <label class="form-check-label" :for="dataType.id">
              {{ dataType.name }}
              <small class="text-muted d-block">{{ dataType.description }}</small>
            </label>
          </div>
        </div>

        <!-- Filter Options -->
        <div class="form-group mb-3" v-if="showFilters">
          <label class="form-label">Filter Options</label>
          <div class="row">
            <div class="col-md-6">
              <label for="categoryFilter" class="form-label">Category</label>
              <select id="categoryFilter" class="form-select" v-model="filters.category">
                <option value="">All Categories</option>
                <option value="mental-health">Mental Health</option>
                <option value="physical-health">Physical Health</option>
                <option value="prevention">Prevention</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="dateRange" class="form-label">Date Range</label>
              <select id="dateRange" class="form-select" v-model="filters.dateRange">
                <option value="all">All Time</option>
                <option value="last-week">Last Week</option>
                <option value="last-month">Last Month</option>
                <option value="last-year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Export Settings -->
        <div class="form-group mb-3" v-if="showAdvancedOptions">
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="includeMetadata"
              v-model="exportSettings.includeMetadata"
            >
            <label class="form-check-label" for="includeMetadata">
              Include metadata (creation date, last updated, etc.)
            </label>
          </div>
          
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="includeImages"
              v-model="exportSettings.includeImages"
            >
            <label class="form-check-label" for="includeImages">
              Include images and attachments
            </label>
          </div>
          
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="compressFile"
              v-model="exportSettings.compressFile"
            >
            <label class="form-check-label" for="compressFile">
              Compress file (ZIP format)
            </label>
          </div>
        </div>

        <!-- Export Button -->
        <div class="export-actions">
          <button 
            class="btn btn-primary"
            @click="startExport"
            :disabled="!canExport || isExporting"
            :aria-label="`Export data as ${selectedFormat.toUpperCase()}`"
          >
            <i class="fas fa-download me-2" v-if="!isExporting"></i>
            <i class="fas fa-spinner fa-spin me-2" v-else></i>
            {{ isExporting ? 'Exporting...' : 'Export Data' }}
          </button>
          
          <button 
            class="btn btn-outline-secondary ms-2"
            @click="previewExport"
            :disabled="!canExport || isExporting"
            aria-label="Preview export data"
          >
            <i class="fas fa-eye me-2"></i>
            Preview
          </button>
        </div>
      </div>
    </div>

    <!-- Export Progress -->
    <div v-if="isExporting" class="export-progress">
      <div class="progress mb-3">
        <div 
          class="progress-bar progress-bar-striped progress-bar-animated" 
          :style="{ width: exportProgress + '%' }"
          :aria-valuenow="exportProgress"
          aria-valuemin="0"
          aria-valuemax="100"
          role="progressbar"
        >
          {{ exportProgress }}%
        </div>
      </div>
      <p class="text-center">{{ exportStatus }}</p>
    </div>

    <!-- Export History -->
    <div v-if="exportHistory.length > 0" class="export-history">
      <h6>Recent Exports</h6>
      <div class="list-group">
        <div 
          v-for="exportItem in exportHistory" 
          :key="exportItem.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{{ exportItem.filename }}</strong>
            <small class="text-muted d-block">{{ exportItem.format.toUpperCase() }} - {{ exportItem.size }}</small>
          </div>
          <div>
            <button 
              class="btn btn-sm btn-outline-primary me-2"
              @click="downloadExport(exportItem)"
              :aria-label="`Download ${exportItem.filename}`"
            >
              <i class="fas fa-download"></i>
            </button>
            <button 
              class="btn btn-sm btn-outline-danger"
              @click="deleteExport(exportItem.id)"
              :aria-label="`Delete ${exportItem.filename}`"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Preview Modal -->
    <div v-if="showPreview" class="export-preview-modal" role="dialog" aria-labelledby="preview-title">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="preview-title">Export Preview</h5>
          <button @click="showPreview = false" class="btn-close" aria-label="Close preview"></button>
        </div>
        <div class="modal-body">
          <div class="preview-content">
            <h6>Export Summary</h6>
            <ul class="list-unstyled">
              <li><strong>Format:</strong> {{ selectedFormat.toUpperCase() }}</li>
              <li><strong>Data Types:</strong> {{ selectedDataTypes.join(', ') }}</li>
              <li><strong>Records:</strong> {{ previewData.recordCount }}</li>
              <li><strong>File Size:</strong> {{ previewData.estimatedSize }}</li>
            </ul>
            
            <h6>Sample Data</h6>
            <div class="preview-table">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th v-for="column in previewData.columns" :key="column">{{ column }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in previewData.sampleRows" :key="index">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showPreview = false">Cancel</button>
          <button class="btn btn-primary" @click="confirmExport">Confirm Export</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Reactive data
const selectedFormat = ref('csv');
const selectedDataTypes = ref(['resources']);
const showFilters = ref(false);
const showAdvancedOptions = ref(false);
const showPreview = ref(false);
const isExporting = ref(false);
const exportProgress = ref(0);
const exportStatus = ref('');
const exportHistory = ref([]);

// Filter options
const filters = ref({
  category: '',
  dateRange: 'all'
});

// Export settings
const exportSettings = ref({
  includeMetadata: true,
  includeImages: false,
  compressFile: false
});

// Preview data
const previewData = ref({
  recordCount: 0,
  estimatedSize: '',
  columns: [],
  sampleRows: []
});

// Available data types
const availableDataTypes = ref([
  {
    id: 'resources',
    name: 'Health Resources',
    description: 'Educational materials, articles, and health information',
    disabled: false
  },
  {
    id: 'services',
    name: 'Health Services',
    description: 'Healthcare providers, clinics, and service locations',
    disabled: false
  },
  {
    id: 'users',
    name: 'User Data',
    description: 'User profiles and preferences (admin only)',
    disabled: false
  },
  {
    id: 'analytics',
    name: 'Analytics Data',
    description: 'Usage statistics and engagement metrics (admin only)',
    disabled: false
  }
]);

// Computed properties
const canExport = computed(() => {
  return selectedDataTypes.value.length > 0 && selectedFormat.value;
});

// Methods
const updateExportOptions = () => {
  showFilters.value = selectedFormat.value === 'csv' || selectedFormat.value === 'excel';
  showAdvancedOptions.value = selectedFormat.value === 'pdf' || selectedFormat.value === 'excel';
};

const startExport = async () => {
  if (!canExport.value) return;
  
  isExporting.value = true;
  exportProgress.value = 0;
  exportStatus.value = 'Preparing export...';
  
  try {
    // Simulate export process
    await simulateExportProcess();
    
    // Create export record
    const exportItem = {
      id: Date.now(),
      filename: `health-data-${new Date().toISOString().split('T')[0]}.${selectedFormat.value}`,
      format: selectedFormat.value,
      size: getEstimatedFileSize(),
      timestamp: new Date().toISOString()
    };
    
    exportHistory.value.unshift(exportItem);
    
    // Trigger download
    await downloadFile(exportItem);
    
    exportStatus.value = 'Export completed successfully!';
    
  } catch (error) {
    console.error('Export error:', error);
    exportStatus.value = 'Export failed. Please try again.';
  } finally {
    setTimeout(() => {
      isExporting.value = false;
      exportProgress.value = 0;
      exportStatus.value = '';
    }, 2000);
  }
};

const simulateExportProcess = async () => {
  const steps = [
    'Validating data...',
    'Processing records...',
    'Generating file...',
    'Finalizing export...'
  ];
  
  for (let i = 0; i < steps.length; i++) {
    exportStatus.value = steps[i];
    exportProgress.value = ((i + 1) / steps.length) * 100;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

const previewExport = async () => {
  try {
    // Generate preview data
    previewData.value = {
      recordCount: getRecordCount(),
      estimatedSize: getEstimatedFileSize(),
      columns: getPreviewColumns(),
      sampleRows: getSampleRows()
    };
    
    showPreview.value = true;
  } catch (error) {
    console.error('Preview error:', error);
  }
};

const confirmExport = () => {
  showPreview.value = false;
  startExport();
};

const getRecordCount = () => {
  // Simulate record count based on selected data types
  const counts = {
    resources: 150,
    services: 25,
    users: 500,
    analytics: 1000
  };
  
  return selectedDataTypes.value.reduce((total, type) => {
    return total + (counts[type] || 0);
  }, 0);
};

const getEstimatedFileSize = () => {
  const recordCount = getRecordCount();
  const baseSize = recordCount * 0.5; // KB per record
  
  const formatMultipliers = {
    csv: 1,
    json: 1.2,
    excel: 1.5,
    pdf: 2
  };
  
  const size = baseSize * (formatMultipliers[selectedFormat.value] || 1);
  
  if (size < 1024) {
    return `${Math.round(size)} KB`;
  } else {
    return `${Math.round(size / 1024)} MB`;
  }
};

const getPreviewColumns = () => {
  const columns = {
    resources: ['Title', 'Category', 'Description', 'URL'],
    services: ['Name', 'Type', 'Address', 'Phone'],
    users: ['Name', 'Email', 'Role', 'Join Date'],
    analytics: ['Date', 'Page Views', 'Unique Visitors', 'Engagement']
  };
  
  return selectedDataTypes.value.flatMap(type => columns[type] || []);
};

const getSampleRows = () => {
  const sampleData = {
    resources: [
      ['Mental Health Guide', 'Mental Health', 'Comprehensive guide to mental wellness', 'https://example.com/guide'],
      ['Exercise Tips', 'Physical Health', 'Daily exercise recommendations', 'https://example.com/exercise']
    ],
    services: [
      ['Melbourne Health Clinic', 'General Practice', '123 Collins St, Melbourne', '(03) 1234 5678'],
      ['Mental Health Center', 'Mental Health', '456 Bourke St, Melbourne', '(03) 2345 6789']
    ],
    users: [
      ['John Smith', 'john@example.com', 'Member', '2024-01-15'],
      ['Jane Doe', 'jane@example.com', 'Admin', '2024-01-10']
    ],
    analytics: [
      ['2024-01-15', '1250', '450', 'High'],
      ['2024-01-14', '980', '320', 'Medium']
    ]
  };
  
  return selectedDataTypes.value.flatMap(type => sampleData[type] || []);
};

const downloadFile = async (exportItem) => {
  // Simulate file download
  const blob = new Blob(['Sample export data'], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = exportItem.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

const downloadExport = (exportItem) => {
  downloadFile(exportItem);
};

const deleteExport = (exportId) => {
  exportHistory.value = exportHistory.value.filter(item => item.id !== exportId);
};

// Lifecycle
onMounted(() => {
  // Load export history from localStorage
  const savedHistory = localStorage.getItem('export-history');
  if (savedHistory) {
    try {
      exportHistory.value = JSON.parse(savedHistory);
    } catch (error) {
      console.error('Error loading export history:', error);
    }
  }
  
  // Save export history when it changes
  const saveHistory = () => {
    localStorage.setItem('export-history', JSON.stringify(exportHistory.value));
  };
  
  // Watch for changes and save
  const unwatch = () => {
    // This would be implemented with a watcher in a real app
  };
});
</script>

<style scoped>
.data-exporter {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.export-header {
  margin-bottom: 25px;
  text-align: center;
}

.export-header h5 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 10px;
}

.export-options {
  margin-bottom: 30px;
}

.export-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.export-progress {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.export-history {
  margin-top: 30px;
}

.export-history h6 {
  color: #495057;
  margin-bottom: 15px;
}

.export-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 20px;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.preview-content {
  max-height: 400px;
  overflow-y: auto;
}

.preview-table {
  overflow-x: auto;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Responsive design */
@media (max-width: 768px) {
  .data-exporter {
    padding: 20px;
  }
  
  .export-actions {
    flex-direction: column;
  }
  
  .export-actions .btn {
    width: 100%;
  }
  
  .modal-content {
    margin: 10px;
    max-height: 90vh;
  }
}
</style>
