<!-- AccessibilityTools.vue - WCAG 2.1 AA compliance tools -->
<template>
  <div class="accessibility-tools">
    <!-- Accessibility Controls -->
    <div class="accessibility-controls" :class="{ 'expanded': isExpanded }">
      <button 
        class="accessibility-toggle"
        @click="toggleExpanded"
        :aria-label="isExpanded ? 'Close accessibility tools' : 'Open accessibility tools'"
        :aria-expanded="isExpanded"
      >
        <i class="fas fa-universal-access"></i>
        <span class="sr-only">Accessibility Tools</span>
      </button>
      
      <div class="accessibility-panel" v-if="isExpanded">
        <!-- Text Size Controls -->
        <div class="control-group">
          <h6>Text Size</h6>
          <div class="btn-group" role="group" aria-label="Text size controls">
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click="decreaseTextSize"
              :aria-label="'Decrease text size'"
            >
              <i class="fas fa-minus"></i>
            </button>
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click="resetTextSize"
              :aria-label="'Reset text size'"
            >
              <i class="fas fa-undo"></i>
            </button>
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click="increaseTextSize"
              :aria-label="'Increase text size'"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <!-- High Contrast Toggle -->
        <div class="control-group">
          <h6>High Contrast</h6>
          <div class="form-check form-switch">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="highContrast"
              v-model="highContrast"
              @change="toggleHighContrast"
            >
            <label class="form-check-label" for="highContrast">
              High Contrast Mode
            </label>
          </div>
        </div>

        <!-- Color Blind Support -->
        <div class="control-group">
          <h6>Color Vision</h6>
          <select 
            class="form-select form-select-sm"
            v-model="colorBlindMode"
            @change="applyColorBlindMode"
            aria-label="Color vision support"
          >
            <option value="normal">Normal Vision</option>
            <option value="protanopia">Protanopia (Red-blind)</option>
            <option value="deuteranopia">Deuteranopia (Green-blind)</option>
            <option value="tritanopia">Tritanopia (Blue-blind)</option>
            <option value="monochrome">Monochrome</option>
          </select>
        </div>

        <!-- Focus Indicators -->
        <div class="control-group">
          <h6>Focus Indicators</h6>
          <div class="form-check form-switch">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="enhancedFocus"
              v-model="enhancedFocus"
              @change="toggleEnhancedFocus"
            >
            <label class="form-check-label" for="enhancedFocus">
              Enhanced Focus
            </label>
          </div>
        </div>

        <!-- Screen Reader Announcements - Removed as not needed -->

        <!-- Motion Reduction -->
        <div class="control-group">
          <h6>Motion</h6>
          <div class="form-check form-switch">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="reduceMotion"
              v-model="reduceMotion"
              @change="toggleReduceMotion"
            >
            <label class="form-check-label" for="reduceMotion">
              Reduce Motion
            </label>
          </div>
        </div>

        <!-- Focus Management -->
        <div class="control-group">
          <h6>Focus Management</h6>
          <button 
            class="btn btn-sm btn-secondary"
            @click="focusMainContent"
            :aria-label="'Focus on main content'"
          >
            <i class="fas fa-crosshairs"></i>
            Focus Main
          </button>
        </div>

        <!-- Keyboard Navigation Help -->
        <div class="control-group">
          <h6>Keyboard Navigation</h6>
          <button 
            class="btn btn-sm btn-info"
            @click="showKeyboardHelp = !showKeyboardHelp"
            :aria-label="'Show keyboard navigation help'"
          >
            <i class="fas fa-keyboard"></i>
            Help
          </button>
        </div>
      </div>
    </div>

    <!-- Keyboard Help Modal -->
    <div v-if="showKeyboardHelp" class="keyboard-help-modal" role="dialog" aria-labelledby="keyboard-help-title">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="keyboard-help-title">Keyboard Navigation Help</h5>
          <button 
            @click="showKeyboardHelp = false" 
            class="btn-close"
            aria-label="Close keyboard help"
          ></button>
        </div>
        <div class="modal-body">
          <div class="keyboard-shortcuts">
            <div class="shortcut-item">
              <kbd>Tab</kbd>
              <span>Navigate forward through interactive elements</span>
            </div>
            <div class="shortcut-item">
              <kbd>Shift</kbd> + <kbd>Tab</kbd>
              <span>Navigate backward through interactive elements</span>
            </div>
            <div class="shortcut-item">
              <kbd>Enter</kbd> / <kbd>Space</kbd>
              <span>Activate buttons and links</span>
            </div>
            <div class="shortcut-item">
              <kbd>Escape</kbd>
              <span>Close modals and menus</span>
            </div>
            <div class="shortcut-item">
              <kbd>Arrow Keys</kbd>
              <span>Navigate within menus and lists</span>
            </div>
            <div class="shortcut-item">
              <kbd>Alt</kbd> + <kbd>1</kbd>
              <span>Go to main content</span>
            </div>
            <div class="shortcut-item">
              <kbd>Alt</kbd> + <kbd>2</kbd>
              <span>Go to navigation</span>
            </div>
            <div class="shortcut-item">
              <kbd>Alt</kbd> + <kbd>3</kbd>
              <span>Go to search</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skip Links -->
    <div class="skip-links">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Reactive data
const isExpanded = ref(false);
const highContrast = ref(false);
const colorBlindMode = ref('normal');
const enhancedFocus = ref(false);
const showKeyboardHelp = ref(false);
const textSize = ref(100);
const reduceMotion = ref(false);

// Initialize accessibility features
onMounted(() => {
  // Load saved preferences
  loadAccessibilityPreferences();
  
  // Add keyboard event listeners
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Initialize ARIA live region
  createAriaLiveRegion();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboardNavigation);
});

// Load saved accessibility preferences
const loadAccessibilityPreferences = () => {
  const savedTextSize = localStorage.getItem('accessibility-text-size');
  const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
  const savedColorBlindMode = localStorage.getItem('accessibility-color-blind');
  const savedEnhancedFocus = localStorage.getItem('accessibility-enhanced-focus');
  const savedReduceMotion = localStorage.getItem('accessibility-reduce-motion');
  
  if (savedTextSize) {
    textSize.value = parseInt(savedTextSize);
    applyTextSize();
  }
  
  if (savedHighContrast === 'true') {
    highContrast.value = true;
    toggleHighContrast();
  }
  
  if (savedColorBlindMode) {
    colorBlindMode.value = savedColorBlindMode;
    applyColorBlindMode();
  }
  
  if (savedEnhancedFocus === 'true') {
    enhancedFocus.value = true;
    toggleEnhancedFocus();
  }
  
  if (savedReduceMotion === 'true') {
    reduceMotion.value = true;
    toggleReduceMotion();
  }
};

// Toggle expanded state
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
  announceToScreenReader(isExpanded.value ? 'Accessibility tools opened' : 'Accessibility tools closed');
};

// Text size controls
const increaseTextSize = () => {
  if (textSize.value < 200) {
    textSize.value += 10;
    applyTextSize();
    announceToScreenReader(`Text size increased to ${textSize.value}%`);
  }
};

const decreaseTextSize = () => {
  if (textSize.value > 80) {
    textSize.value -= 10;
    applyTextSize();
    announceToScreenReader(`Text size decreased to ${textSize.value}%`);
  }
};

const resetTextSize = () => {
  textSize.value = 100;
  applyTextSize();
  announceToScreenReader('Text size reset to 100%');
};

const applyTextSize = () => {
  document.documentElement.style.setProperty('--accessibility-text-size', `${textSize.value}%`);
  localStorage.setItem('accessibility-text-size', textSize.value.toString());
};

// High contrast toggle
const toggleHighContrast = () => {
  if (highContrast.value) {
    document.body.classList.add('high-contrast');
    announceToScreenReader('High contrast mode enabled');
  } else {
    document.body.classList.remove('high-contrast');
    announceToScreenReader('High contrast mode disabled');
  }
  localStorage.setItem('accessibility-high-contrast', highContrast.value.toString());
};

// Color blind mode
const applyColorBlindMode = () => {
  document.body.className = document.body.className.replace(/color-blind-\w+/g, '');
  if (colorBlindMode.value !== 'normal') {
    document.body.classList.add(`color-blind-${colorBlindMode.value}`);
  }
  localStorage.setItem('accessibility-color-blind', colorBlindMode.value);
  announceToScreenReader(`Color vision mode changed to ${colorBlindMode.value}`);
};

// Enhanced focus toggle
const toggleEnhancedFocus = () => {
  if (enhancedFocus.value) {
    document.body.classList.add('enhanced-focus');
    announceToScreenReader('Enhanced focus indicators enabled');
  } else {
    document.body.classList.remove('enhanced-focus');
    announceToScreenReader('Enhanced focus indicators disabled');
  }
  localStorage.setItem('accessibility-enhanced-focus', enhancedFocus.value.toString());
};

// Motion reduction toggle
const toggleReduceMotion = () => {
  if (reduceMotion.value) {
    document.body.classList.add('reduce-motion');
    announceToScreenReader('Motion reduction enabled');
  } else {
    document.body.classList.remove('reduce-motion');
    announceToScreenReader('Motion reduction disabled');
  }
  localStorage.setItem('accessibility-reduce-motion', reduceMotion.value.toString());
};

// Focus management
const focusMainContent = () => {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: 'smooth' });
    announceToScreenReader('Focused on main content');
  }
};

// Screen reader announcements
const announcePageContent = () => {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    const content = mainContent.textContent || mainContent.innerText;
    announceToScreenReader(`Page content: ${content.substring(0, 200)}...`);
  }
};

const announceToScreenReader = (message) => {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
  }
};

// Create ARIA live region
const createAriaLiveRegion = () => {
  const liveRegion = document.createElement('div');
  liveRegion.id = 'aria-live-region';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);
};

// Keyboard navigation
const handleKeyboardNavigation = (event) => {
  // Alt + 1: Skip to main content
  if (event.altKey && event.key === '1') {
    event.preventDefault();
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  }
  
  // Alt + 2: Skip to navigation
  if (event.altKey && event.key === '2') {
    event.preventDefault();
    const navigation = document.querySelector('nav');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView();
    }
  }
  
  // Alt + 3: Skip to search
  if (event.altKey && event.key === '3') {
    event.preventDefault();
    const search = document.querySelector('input[type="search"], input[placeholder*="search" i]');
    if (search) {
      search.focus();
      search.scrollIntoView();
    }
  }
  
  // Escape: Close modals and menus
  if (event.key === 'Escape') {
    if (showKeyboardHelp.value) {
      showKeyboardHelp.value = false;
    }
    if (isExpanded.value) {
      isExpanded.value = false;
    }
  }
};
</script>

<style scoped>
.accessibility-tools {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.accessibility-controls {
  position: relative;
}

.accessibility-toggle {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.accessibility-toggle:hover {
  background: #0056b3;
  transform: scale(1.1);
}

.accessibility-toggle:focus {
  outline: 3px solid #ffc107;
  outline-offset: 2px;
}

.accessibility-panel {
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  min-width: 300px;
  max-width: 400px;
}

.control-group {
  margin-bottom: 20px;
}

.control-group h6 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 10px;
}

.btn-group {
  display: flex;
  gap: 5px;
}

.keyboard-help-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  max-width: 600px;
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

.keyboard-shortcuts {
  display: grid;
  gap: 15px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.shortcut-item kbd {
  background: #000000 !important;
  color: #ffffff !important;
  border: 2px solid #000000 !important;
  border-radius: 4px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 0.9rem;
  min-width: 40px;
  text-align: center;
  font-weight: bold;
}

.skip-links {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 10001;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 0 0 5px 0;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast styles */
:global(.high-contrast) {
  --bs-primary: #0000ff;
  --bs-secondary: #808080;
  --bs-success: #008000;
  --bs-danger: #ff0000;
  --bs-warning: #ffff00;
  --bs-info: #00ffff;
  --bs-light: #ffffff;
  --bs-dark: #000000;
}

:global(.high-contrast) * {
  background-color: white !important;
  color: black !important;
  border-color: black !important;
}

:global(.high-contrast) a {
  color: #0000ff !important;
  text-decoration: underline !important;
}

:global(.high-contrast) button {
  background-color: #0000ff !important;
  color: white !important;
  border: 2px solid black !important;
}

/* Enhanced focus styles */
:global(.enhanced-focus) *:focus {
  outline: 3px solid #ffc107 !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.5) !important;
}

/* Color blind support */
:global(.color-blind-protanopia) {
  filter: hue-rotate(90deg) saturate(1.5);
}

:global(.color-blind-deuteranopia) {
  filter: hue-rotate(180deg) saturate(1.5);
}

:global(.color-blind-tritanopia) {
  filter: hue-rotate(270deg) saturate(1.5);
}

:global(.color-blind-monochrome) {
  filter: grayscale(100%);
}

/* Text size support */
:global(html) {
  font-size: var(--accessibility-text-size, 100%);
}

/* Motion reduction support */
:global(.reduce-motion) * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}

:global(.reduce-motion) *:before,
:global(.reduce-motion) *:after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .accessibility-tools {
    top: 10px;
    right: 10px;
  }
  
  .accessibility-panel {
    min-width: 280px;
    max-width: calc(100vw - 40px);
  }
  
  .modal-content {
    margin: 10px;
    max-height: 90vh;
  }
}
</style>
