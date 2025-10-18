<!-- HealthMap.vue - Interactive health services map for men's health platform -->
<template>
  <div class="health-map-container" role="application" aria-label="Interactive health services map">
    <!-- Map Controls - Floating Panel -->
    <div class="map-controls-floating" role="toolbar" aria-label="Map controls">
      <div class="search-section">
        <div class="search-container">
          <div class="input-group mb-3">
            <input 
              type="text" 
              class="form-control" 
              v-model="searchQuery"
              placeholder="Search for locations..."
              @input="handleSearchInput"
              @keyup.enter="searchHealthServices"
              @focus="showSuggestions = true"
              :aria-label="'Search for health service locations'"
              :aria-describedby="'search-help'"
              ref="searchInput"
            >
            <button 
              class="btn btn-primary" 
              @click="searchHealthServices"
              :disabled="isSearching"
              :aria-label="'Search button'"
            >
              <i class="fas fa-search" v-if="!isSearching"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
            </button>
          </div>
          
          <!-- Search Help Text -->
          <div id="search-help" class="form-text">
            <small>Type to search for health services, hospitals, or addresses. Use arrow keys to navigate suggestions.</small>
          </div>
          
          <!-- Search Suggestions Dropdown -->
          <div v-if="showSuggestions && searchSuggestions.length > 0" class="suggestions-dropdown">
            <div 
              v-for="(suggestion, index) in searchSuggestions" 
              :key="index"
              class="suggestion-item"
              @click="selectSuggestion(suggestion)"
              :class="{ active: selectedSuggestionIndex === index }"
            >
              <div class="suggestion-content">
                <i class="fas fa-map-marker-alt me-2"></i>
                <div>
                  <div class="suggestion-title">{{ suggestion.place_name }}</div>
                  <div class="suggestion-category">{{ suggestion.properties?.category || 'Location' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="filter-buttons">
          <button 
            v-for="category in healthCategories" 
            :key="category.id"
            class="btn btn-outline-primary btn-sm me-2 mb-2"
            :class="{ active: selectedCategory === category.id }"
            @click="filterByCategory(category.id)"
            :aria-label="`Filter by ${category.name}`"
          >
            <i :class="category.icon"></i> {{ category.name }}
          </button>
        </div>
        
        <div class="location-controls">
          <button 
            class="btn btn-success btn-sm me-2"
            @click="getCurrentLocation"
            :disabled="isGettingLocation"
            :aria-label="'Get current location'"
          >
            <i class="fas fa-location-arrow" v-if="!isGettingLocation"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            My Location
          </button>
          
          <button 
            class="btn btn-info btn-sm"
            @click="showAllServices"
            :aria-label="'Show all health services'"
          >
            <i class="fas fa-eye"></i>
            Show All Services
          </button>
        </div>
      </div>
    </div>


    <!-- Map Container -->
    <div 
      id="health-map" 
      class="health-map"
      :style="{ height: mapHeight }"
      role="img"
      :aria-label="'Interactive map showing health services in Melbourne area'"
      :aria-describedby="'map-instructions'"
      tabindex="0"
      @keydown="handleMapKeyboard"
    ></div>
    
    <!-- Map Instructions -->
    <div id="map-instructions" class="sr-only">
      <p>Interactive map showing health services. Use mouse to pan and zoom, or use keyboard navigation.</p>
      <p>Health services are marked with colored icons: Blue for general practice, Red for emergency, Purple for mental health, Green for cardiology.</p>
    </div>

    <!-- Health Service Info Panel -->
    <div v-if="selectedService" class="service-info-panel">
      <div class="panel-header">
        <h6>{{ selectedService.name }}</h6>
        <button @click="selectedService = null" class="btn-close" aria-label="Close panel"></button>
      </div>
      <div class="panel-body">
        <div class="service-type">
          <span class="badge" :class="getCategoryBadgeClass(selectedService.category)">
            {{ getCategoryDisplayName(selectedService.category) }}
          </span>
        </div>
        <p><strong>Address:</strong> {{ selectedService.address }}</p>
        <p><strong>Phone:</strong> {{ selectedService.phone }}</p>
        <p><strong>Hours:</strong> {{ selectedService.hours }}</p>
        <div class="services-list">
          <strong>Services:</strong>
          <ul class="list-unstyled mt-1">
            <li v-for="service in selectedService.services" :key="service" class="service-item">
              <i class="fas fa-check-circle text-success me-2"></i>
              {{ service }}
            </li>
          </ul>
        </div>
        <div class="action-buttons mt-3">
          <button 
            class="btn btn-primary btn-sm me-2"
            @click="getDirections(selectedService)"
            :aria-label="`Get directions to ${selectedService.name}`"
          >
            <i class="fas fa-directions"></i> Navigate
          </button>
          <button 
            class="btn btn-outline-primary btn-sm me-2"
            @click="callService(selectedService)"
            :aria-label="`Call ${selectedService.name}`"
          >
            <i class="fas fa-phone"></i> Call
          </button>
          <button 
            class="btn btn-outline-info btn-sm"
            @click="showServiceDetails(selectedService)"
            :aria-label="`View details for ${selectedService.name}`"
          >
            <i class="fas fa-info-circle"></i> Details
          </button>
        </div>
      </div>
    </div>

    <!-- Health Risk Assessment Panel -->
    <div v-if="showRiskAssessment" class="risk-assessment-panel">
      <div class="panel-header">
        <h6>Health Risk Assessment</h6>
        <button @click="showRiskAssessment = false" class="btn-close" aria-label="Close assessment"></button>
      </div>
      <div class="panel-body">
        <div class="risk-factors">
          <h6>Local Health Factors:</h6>
          <ul>
            <li v-for="factor in riskFactors" :key="factor.name" :class="factor.level">
              <i :class="factor.icon"></i>
              {{ factor.name }}: {{ factor.description }}
            </li>
          </ul>
        </div>
        <div class="recommendations">
          <h6>Recommendations:</h6>
          <ul>
            <li v-for="rec in recommendations" :key="rec">{{ rec }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Props
const props = defineProps({
  height: {
    type: String,
    default: '500px'
  }
});

// Reactive data
const map = ref(null);
const mapHeight = ref(props.height);
const searchQuery = ref('');
const isSearching = ref(false);
const isGettingLocation = ref(false);
const selectedCategory = ref('all');
const selectedService = ref(null);
const showRiskAssessment = ref(false);
const userLocation = ref(null);
const searchSuggestions = ref([]);
const showSuggestions = ref(false);
const selectedSuggestionIndex = ref(-1);
const searchInput = ref(null);
const searchSession = ref(null);

// Health service categories
const healthCategories = ref([
  { id: 'all', name: 'All Services', icon: 'fas fa-hospital' },
  { id: 'mental', name: 'Mental Health', icon: 'fas fa-brain' },
  { id: 'cardio', name: 'Cardiology', icon: 'fas fa-heartbeat' },
  { id: 'diabetes', name: 'Diabetes Care', icon: 'fas fa-vial' },
  { id: 'general', name: 'General Practice', icon: 'fas fa-user-md' },
  { id: 'emergency', name: 'Emergency', icon: 'fas fa-ambulance' }
]);

// Sample health services data - Melbourne Metro area
const healthServices = ref([
  // CBD Area
  {
    id: 1,
    name: 'Melbourne Men\'s Health Clinic',
    category: 'mental',
    address: '123 Collins St, Melbourne VIC 3000',
    phone: '(03) 1234 5678',
    hours: 'Mon-Fri: 8AM-6PM',
    services: ['Mental Health Counseling', 'Depression Support', 'Anxiety Treatment'],
    coordinates: [144.9631, -37.8136],
    description: 'Specialized mental health services for men'
  },
  {
    id: 2,
    name: 'Heart Health Center',
    category: 'cardio',
    address: '456 Bourke St, Melbourne VIC 3000',
    phone: '(03) 2345 6789',
    hours: 'Mon-Fri: 7AM-7PM, Sat: 8AM-4PM',
    services: ['Cardiac Assessment', 'Heart Disease Prevention', 'Exercise Programs'],
    coordinates: [144.9638, -37.8146],
    description: 'Comprehensive cardiovascular care for men'
  },
  {
    id: 3,
    name: 'Emergency Medical Center',
    category: 'emergency',
    address: '654 Elizabeth St, Melbourne VIC 3000',
    phone: '(03) 5678 9012',
    hours: '24/7',
    services: ['Emergency Care', 'Trauma Treatment', 'Urgent Medical Services'],
    coordinates: [144.9659, -37.8176],
    description: '24/7 emergency medical services'
  },
  
  // Eastern Suburbs
  {
    id: 4,
    name: 'Box Hill Mental Health Clinic',
    category: 'mental',
    address: '789 Whitehorse Rd, Box Hill VIC 3128',
    phone: '(03) 9898 1234',
    hours: 'Mon-Fri: 9AM-5PM',
    services: ['Mental Health Support', 'Group Therapy', 'Individual Counseling'],
    coordinates: [145.1234, -37.8196],
    description: 'Mental health services in eastern suburbs'
  },
  {
    id: 5,
    name: 'Ringwood Cardiology Center',
    category: 'cardio',
    address: '456 Maroondah Hwy, Ringwood VIC 3134',
    phone: '(03) 9876 5432',
    hours: 'Mon-Fri: 8AM-6PM',
    services: ['Heart Surgery', 'Cardiac Rehabilitation', 'Stress Testing'],
    coordinates: [145.2345, -37.8123],
    description: 'Cardiology services in eastern suburbs'
  },
  {
    id: 6,
    name: 'Glen Waverley Medical Center',
    category: 'general',
    address: '123 Springvale Rd, Glen Waverley VIC 3150',
    phone: '(03) 9560 1234',
    hours: 'Mon-Fri: 7AM-7PM, Sat: 8AM-2PM',
    services: ['General Health Checkups', 'Preventive Care', 'Health Screenings'],
    coordinates: [145.1678, -37.8789],
    description: 'General practice in eastern suburbs'
  },
  
  // Northern Suburbs
  {
    id: 7,
    name: 'Preston Diabetes Clinic',
    category: 'diabetes',
    address: '789 High St, Preston VIC 3072',
    phone: '(03) 9470 5678',
    hours: 'Mon-Fri: 8AM-5PM',
    services: ['Diabetes Management', 'Blood Sugar Monitoring', 'Nutrition Counseling'],
    coordinates: [145.0123, -37.7456],
    description: 'Diabetes care in northern suburbs'
  },
  {
    id: 8,
    name: 'Bundoora Emergency Care',
    category: 'emergency',
    address: '456 Plenty Rd, Bundoora VIC 3083',
    phone: '(03) 9479 2000',
    hours: '24/7',
    services: ['Emergency Care', 'Trauma Treatment', 'Urgent Medical Services'],
    coordinates: [145.0567, -37.7123],
    description: 'Emergency services in northern suburbs'
  },
  {
    id: 9,
    name: 'Epping Mental Health Support',
    category: 'mental',
    address: '123 High St, Epping VIC 3076',
    phone: '(03) 9401 2345',
    hours: 'Mon-Fri: 9AM-5PM',
    services: ['Crisis Support', 'Group Therapy', 'Individual Counseling'],
    coordinates: [145.0345, -37.6789],
    description: 'Mental health support in northern suburbs'
  },
  
  // Western Suburbs
  {
    id: 10,
    name: 'Footscray General Practice',
    category: 'general',
    address: '456 Nicholson St, Footscray VIC 3011',
    phone: '(03) 9689 1234',
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-1PM',
    services: ['General Health Checkups', 'Preventive Care', 'Health Screenings'],
    coordinates: [144.9012, -37.8012],
    description: 'General practice in western suburbs'
  },
  {
    id: 11,
    name: 'Sunshine Heart Clinic',
    category: 'cardio',
    address: '789 Hampshire Rd, Sunshine VIC 3020',
    phone: '(03) 9312 3456',
    hours: 'Mon-Fri: 8AM-6PM',
    services: ['Cardiac Assessment', 'Heart Disease Prevention', 'Exercise Programs'],
    coordinates: [144.8345, -37.7890],
    description: 'Cardiology services in western suburbs'
  },
  {
    id: 12,
    name: 'Werribee Diabetes Center',
    category: 'diabetes',
    address: '123 Watton St, Werribee VIC 3030',
    phone: '(03) 9741 2345',
    hours: 'Mon-Fri: 8AM-5PM',
    services: ['Insulin Management', 'Dietary Counseling', 'Foot Care'],
    coordinates: [144.6678, -37.9012],
    description: 'Diabetes care in western suburbs'
  },
  
  // Southern Suburbs
  {
    id: 13,
    name: 'St Kilda Mental Health Clinic',
    category: 'mental',
    address: '456 Acland St, St Kilda VIC 3182',
    phone: '(03) 9534 5678',
    hours: 'Mon-Fri: 9AM-5PM',
    services: ['Mental Health Support', 'Group Therapy', 'Individual Counseling'],
    coordinates: [144.9789, -37.8567],
    description: 'Mental health services in southern suburbs'
  },
  {
    id: 14,
    name: 'Frankston Emergency Hospital',
    category: 'emergency',
    address: '123 Hastings Rd, Frankston VIC 3199',
    phone: '(03) 9784 7000',
    hours: '24/7',
    services: ['Emergency Department', 'Trauma Center', 'Intensive Care'],
    coordinates: [145.1234, -38.1456],
    description: 'Emergency services in southern suburbs'
  },
  {
    id: 15,
    name: 'Cheltenham Medical Center',
    category: 'general',
    address: '789 Charman Rd, Cheltenham VIC 3192',
    phone: '(03) 9553 1234',
    hours: 'Mon-Fri: 7AM-7PM, Sat: 8AM-2PM',
    services: ['General Health Checkups', 'Preventive Care', 'Health Screenings'],
    coordinates: [145.0456, -37.9678],
    description: 'General practice in southern suburbs'
  },
  
  // Major Hospitals
  {
    id: 16,
    name: 'Royal Melbourne Hospital',
    category: 'emergency',
    address: '300 Grattan St, Parkville VIC 3052',
    phone: '(03) 9342 7000',
    hours: '24/7',
    services: ['Emergency Department', 'Trauma Center', 'Intensive Care'],
    coordinates: [144.9694, -37.8226],
    description: 'Major teaching hospital with emergency services'
  },
  {
    id: 17,
    name: 'Alfred Hospital',
    category: 'emergency',
    address: '55 Commercial Rd, Melbourne VIC 3004',
    phone: '(03) 9076 2000',
    hours: '24/7',
    services: ['Emergency Department', 'Trauma Center', 'Intensive Care'],
    coordinates: [144.9789, -37.8567],
    description: 'Major hospital with emergency services'
  }
]);

// Risk assessment data
const riskFactors = ref([
  {
    name: 'Air Quality',
    level: 'low',
    icon: 'fas fa-wind',
    description: 'Good air quality in this area'
  },
  {
    name: 'Healthcare Access',
    level: 'high',
    icon: 'fas fa-hospital',
    description: 'Excellent healthcare facilities nearby'
  },
  {
    name: 'Mental Health Support',
    level: 'medium',
    icon: 'fas fa-brain',
    description: 'Good mental health services available'
  }
]);

const recommendations = ref([
  'Regular health checkups recommended',
  'Consider mental health screening',
  'Maintain active lifestyle',
  'Access local support groups'
]);

// Initialize map
const initializeMap = async () => {
  try {
    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFja3l3MTIzeSIsImEiOiJjbWdleGsxbGYwMmMzMmpvZHdsMWd1Y3czIn0.ZJjFUb21fbpfHeULJpzv_A';
    
    // Create map
    map.value = new mapboxgl.Map({
      container: 'health-map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [144.9631, -37.8136], // Melbourne CBD
      zoom: 10 // Zoomed out to show more of Melbourne metro area
    });

    // Wait for map to load
    map.value.on('load', () => {
      console.log('Map loaded successfully');
      
      // Add navigation controls
      map.value.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add geolocate control with proper event handling
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: true
      });
      
      // Add event listeners for geolocate
      geolocate.on('geolocate', (e) => {
        console.log('Geolocation successful:', e.coords);
        userLocation.value = [e.coords.longitude, e.coords.latitude];
        
        // Add user location marker
        addUserLocationMarker(e.coords.longitude, e.coords.latitude);
      });
      
      geolocate.on('error', (e) => {
        console.error('Geolocation error:', e);
      });
      
      map.value.addControl(geolocate, 'top-right');

      // Add markers for health services
      addHealthServiceMarkers();
      
    // Add click event to close service panel when clicking on map
    map.value.on('click', (e) => {
      // Only close if clicking on map, not on markers
      if (e.originalEvent.target === map.value.getCanvas()) {
        selectedService.value = null;
        showRiskAssessment.value = false;
      }
    });
    });

  } catch (error) {
    console.error('Error initializing map:', error);
  }
};

// Add user location marker
const addUserLocationMarker = (lng, lat) => {
  if (!map.value) return;
  
  // Remove existing user marker
  if (window.userLocationMarker) {
    window.userLocationMarker.remove();
  }
  
  // Create user location marker with inner wrapper
  const el = document.createElement('div');
  el.className = 'user-location-marker';
  
  // Create inner element for animations
  const innerEl = document.createElement('div');
  innerEl.className = 'marker-inner';
  innerEl.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
  
  // Style the outer container (don't add transform here!)
  el.style.cssText = `
    width: 20px;
    height: 20px;
  `;
  
  // Style the inner element (this is where we add animations)
  innerEl.style.cssText = `
    width: 100%;
    height: 100%;
    background: #007bff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    animation: pulse 2s infinite;
    transform-origin: center center;
  `;
  
  el.appendChild(innerEl);
  
  // Add pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Create marker
  window.userLocationMarker = new mapboxgl.Marker(el)
    .setLngLat([lng, lat])
    .addTo(map.value);
};

// Add health service markers
const addHealthServiceMarkers = () => {
  if (!map.value) return;

  // Clear existing markers
  document.querySelectorAll('.health-marker').forEach(marker => marker.remove());

  console.log('Adding health service markers:', healthServices.value.length);

  healthServices.value.forEach(service => {
    // Create marker element - let Mapbox handle all positioning
    const el = document.createElement('div');
    el.className = 'health-marker';
    el.setAttribute('data-service-id', service.id);
    
    // Create inner element for animations
    const innerEl = document.createElement('div');
    innerEl.className = 'marker-inner';
    innerEl.innerHTML = `<i class="fas ${getCategoryIcon(service.category)}"></i>`;
    
    // Don't set any positioning styles on the outer element
    el.style.cssText = `
      width: 30px;
      height: 30px;
      cursor: pointer;
    `;
    
    // Style the inner element (this is where we add animations)
    innerEl.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: ${getCategoryColor(service.category)};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      transform-origin: center center;
    `;
    
    el.appendChild(innerEl);

    // Add hover effect with popup (on inner element)
    el.addEventListener('mouseenter', () => {
      innerEl.style.transform = 'scale(1.2)';
      innerEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
      
      // Show popup on hover
      showServicePopup(service, el);
    });

    el.addEventListener('mouseleave', () => {
      innerEl.style.transform = 'scale(1)';
      innerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Hide popup
      hideServicePopup();
    });

    // Add click event
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Service clicked:', service.name);
      selectedService.value = service;
    });

    // Create marker - let Mapbox handle all positioning
    const marker = new mapboxgl.Marker(el)
      .setLngLat(service.coordinates)
      .addTo(map.value);

    // Debug: Check if marker is in correct container
    setTimeout(() => {
      const markerContainer = document.querySelector('.mapboxgl-marker-container');
      const ourMarker = document.querySelector(`[data-service-id="${service.id}"]`);
      if (markerContainer && ourMarker) {
        console.log(`Marker ${service.name} is in Mapbox container:`, markerContainer.contains(ourMarker));
      }
    }, 100);

    console.log(`Added marker for ${service.name} at ${service.coordinates}`);
  });
};

// Get category icon
const getCategoryIcon = (category) => {
  const icons = {
    mental: 'fa-brain',
    cardio: 'fa-heartbeat',
    diabetes: 'fa-vial',
    general: 'fa-user-md',
    emergency: 'fa-ambulance'
  };
  return icons[category] || 'fa-hospital';
};

// Get category color
const getCategoryColor = (category) => {
  const colors = {
    mental: '#6f42c1',
    cardio: '#dc3545',
    diabetes: '#fd7e14',
    general: '#198754',
    emergency: '#dc3545'
  };
  return colors[category] || '#6c757d';
};

// Handle search input with suggestions
const handleSearchInput = async () => {
  if (searchQuery.value.length < 2) {
    searchSuggestions.value = [];
    showSuggestions.value = false;
    return;
  }
  
  try {
    // Use Mapbox Geocoding API for suggestions
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?access_token=${mapboxgl.accessToken}&country=AU&proximity=144.9631,-37.8136&limit=5&types=place,locality,neighborhood,address,poi`
    );
    
    if (response.ok) {
      const data = await response.json();
      searchSuggestions.value = data.features || [];
      showSuggestions.value = true;
    }
  } catch (error) {
    console.error('Search suggestions error:', error);
  }
};

// Select a search suggestion
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.place_name;
  showSuggestions.value = false;
  searchSuggestions.value = [];
  
  // Navigate to the selected location
  navigateToLocation(suggestion);
};

// Navigate to a specific location
const navigateToLocation = (location) => {
  const [lng, lat] = location.center;
  
  // Fly to the location
  map.value.flyTo({
    center: [lng, lat],
    zoom: 15,
    essential: true
  });
  
  // Add search result marker
  addSearchResultMarker(lng, lat, location.place_name);
  
  // Filter health services near the location
  filterServicesNearLocation(lng, lat);
  
  // Show nearby services
  showNearbyHealthServices(lng, lat);
};

// Show nearby health services
const showNearbyHealthServices = (lng, lat) => {
  const nearbyServices = healthServices.value.filter(service => {
    const distance = getDistanceFromLatLonInKm(lat, lng, service.coordinates[1], service.coordinates[0]);
    return distance <= 5; // Within 5km
  });
  
  console.log(`Found ${nearbyServices.length} health services within 5km`);
  
  // Update markers to show nearby services
  addHealthServiceMarkers();
  
  // Highlight nearby services
  nearbyServices.forEach(service => {
    const marker = document.querySelector(`[data-service-id="${service.id}"]`);
    if (marker) {
      const innerEl = marker.querySelector('.marker-inner');
      if (innerEl) {
        innerEl.style.transform = 'scale(1.2)';
        innerEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
      }
    }
  });
};

// Search health services using Mapbox Geocoding API
const searchHealthServices = async () => {
  if (!searchQuery.value.trim()) return;
  
  isSearching.value = true;
  showSuggestions.value = false;
  
  try {
    // Use Mapbox Geocoding API for address search
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?access_token=${mapboxgl.accessToken}&country=AU&proximity=144.9631,-37.8136&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      navigateToLocation(feature);
    } else {
      // Fallback to text-based filtering
      const filteredServices = healthServices.value.filter(service => 
        service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        service.services.some(s => s.toLowerCase().includes(searchQuery.value.toLowerCase()))
      );
      
      if (filteredServices.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        filteredServices.forEach(service => {
          bounds.extend(service.coordinates);
        });
        map.value.fitBounds(bounds, { padding: 50 });
      }
    }
    
  } catch (error) {
    console.error('Search error:', error);
    // Fallback to local search
    const filteredServices = healthServices.value.filter(service => 
      service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      service.services.some(s => s.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
    
    if (filteredServices.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredServices.forEach(service => {
        bounds.extend(service.coordinates);
      });
      map.value.fitBounds(bounds, { padding: 50 });
    }
  } finally {
    isSearching.value = false;
  }
};

// Add search result marker
const addSearchResultMarker = (lng, lat, placeName) => {
  // Remove existing search marker
  if (window.searchResultMarker) {
    window.searchResultMarker.remove();
  }
  
  // Create search result marker
  const el = document.createElement('div');
  el.className = 'search-result-marker';
  el.innerHTML = '<i class="fas fa-search"></i>';
  el.style.cssText = `
    width: 25px;
    height: 25px;
    background: #28a745;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  `;
  
  // Create marker
  window.searchResultMarker = new mapboxgl.Marker(el)
    .setLngLat([lng, lat])
    .addTo(map.value);
  
  // Add popup
  new mapboxgl.Popup({ offset: 25 })
    .setLngLat([lng, lat])
    .setHTML(`<div><strong>Search Result</strong><br/>${placeName}</div>`)
    .addTo(map.value);
};

// Filter services near a location
const filterServicesNearLocation = (lng, lat) => {
  const nearbyServices = healthServices.value.filter(service => {
    const distance = getDistanceFromLatLonInKm(lat, lng, service.coordinates[1], service.coordinates[0]);
    return distance <= 5; // Within 5km
  });
  
  console.log(`Found ${nearbyServices.length} services within 5km of ${lng}, ${lat}`);
  
  // Clear all markers first
  document.querySelectorAll('.health-marker').forEach(marker => marker.remove());
  
  // Add only nearby services
  nearbyServices.forEach(service => {
    const el = document.createElement('div');
    el.className = 'health-marker nearby-service';
    el.setAttribute('data-service-id', service.id);
    
    // Create inner element for animations
    const innerEl = document.createElement('div');
    innerEl.className = 'marker-inner';
    innerEl.innerHTML = `<i class="fas ${getCategoryIcon(service.category)}"></i>`;
    
    // Don't set any positioning styles on the outer element
    el.style.cssText = `
      width: 35px;
      height: 35px;
      cursor: pointer;
    `;
    
    // Style the inner element (this is where we add animations)
    innerEl.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: ${getCategoryColor(service.category)};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #28a745;
      box-shadow: 0 4px 8px rgba(0,0,0,0.4);
      transition: all 0.3s ease;
      animation: pulse 2s infinite;
      transform-origin: center center;
    `;
    
    el.appendChild(innerEl);

    // Add hover effect with popup (on inner element)
    el.addEventListener('mouseenter', () => {
      innerEl.style.transform = 'scale(1.3)';
      innerEl.style.boxShadow = '0 6px 12px rgba(0,0,0,0.5)';
      
      // Show popup on hover
      showServicePopup(service, el);
    });

    el.addEventListener('mouseleave', () => {
      innerEl.style.transform = 'scale(1)';
      innerEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
      
      // Hide popup
      hideServicePopup();
    });

    // Add click event
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Nearby service clicked:', service.name);
      selectedService.value = service;
    });

    // Create marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat(service.coordinates)
      .addTo(map.value);

    console.log(`Added nearby service marker for ${service.name}`);
  });
};

// Calculate distance between two points
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Filter by category
const filterByCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  console.log('Filtering by category:', categoryId);
  
  // Clear existing markers
  document.querySelectorAll('.health-marker').forEach(marker => marker.remove());
  
  let filteredServices = healthServices.value;
  
  if (categoryId !== 'all') {
    filteredServices = healthServices.value.filter(service => service.category === categoryId);
    console.log('Filtered services:', filteredServices);
  }
  
  // Add filtered markers
  filteredServices.forEach(service => {
    // Create marker element with inner wrapper
    const el = document.createElement('div');
    el.className = 'health-marker';
    el.setAttribute('data-service-id', service.id);
    
    // Create inner element for animations
    const innerEl = document.createElement('div');
    innerEl.className = 'marker-inner';
    innerEl.innerHTML = `<i class="fas ${getCategoryIcon(service.category)}"></i>`;
    
    // Don't set any positioning styles on the outer element
    el.style.cssText = `
      width: 30px;
      height: 30px;
      cursor: pointer;
    `;
    
    // Style the inner element (this is where we add animations)
    innerEl.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: ${getCategoryColor(service.category)};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      transform-origin: center center;
    `;
    
    el.appendChild(innerEl);
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat(service.coordinates)
      .addTo(map.value);
    
    el.addEventListener('click', () => {
      selectedService.value = service;
      console.log('Service selected:', service);
    });
    
    // Add hover effect (on inner element)
    el.addEventListener('mouseenter', () => {
      innerEl.style.transform = 'scale(1.1)';
      innerEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
    });
    
    el.addEventListener('mouseleave', () => {
      innerEl.style.transform = 'scale(1)';
      innerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    });
  });
  
  // Update map view to show filtered services
  if (filteredServices.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    filteredServices.forEach(service => {
      bounds.extend(service.coordinates);
    });
    map.value.fitBounds(bounds, { padding: 50 });
  }
};

// Get current location
const getCurrentLocation = () => {
  isGettingLocation.value = true;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = [position.coords.longitude, position.coords.latitude];
        console.log('User location:', userLocation.value);
        
        // Fly to user location
        map.value.flyTo({
          center: userLocation.value,
          zoom: 15,
          essential: true
        });
        
        // Add user location marker
        addUserLocationMarker(position.coords.longitude, position.coords.latitude);
        
        isGettingLocation.value = false;
      },
      (error) => {
        console.error('Geolocation error:', error);
        isGettingLocation.value = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  } else {
    console.error('Geolocation not supported');
    isGettingLocation.value = false;
  }
};

// Get directions using Google Maps
const getDirections = (service) => {
  let directionsUrl;
  
  if (userLocation.value) {
    // Navigate from user location to service
    directionsUrl = `https://www.google.com/maps/dir/${userLocation.value[1]},${userLocation.value[0]}/${service.coordinates[1]},${service.coordinates[0]}`;
  } else {
    // Navigate to service location
    directionsUrl = `https://www.google.com/maps/search/?api=1&query=${service.coordinates[1]},${service.coordinates[0]}`;
  }
  
  console.log('Opening Google Maps navigation:', directionsUrl);
  window.open(directionsUrl, '_blank');
};

// Show service details
const showServiceDetails = (service) => {
  console.log('Service details:', service);
  // You can implement a modal or expand the panel to show more details
  alert(`Service Details:\n\nName: ${service.name}\nAddress: ${service.address}\nPhone: ${service.phone}\nHours: ${service.hours}\n\nServices:\n${service.services.join('\n')}`);
};

// Get category display name
const getCategoryDisplayName = (category) => {
  const names = {
    mental: 'Mental Health',
    cardio: 'Cardiology',
    diabetes: 'Diabetes Care',
    general: 'General Practice',
    emergency: 'Emergency Services'
  };
  return names[category] || 'Health Service';
};

// Get category badge class
const getCategoryBadgeClass = (category) => {
  const classes = {
    mental: 'bg-purple',
    cardio: 'bg-danger',
    diabetes: 'bg-warning',
    general: 'bg-success',
    emergency: 'bg-danger'
  };
  return classes[category] || 'bg-secondary';
};

// Call service
const callService = (service) => {
  window.open(`tel:${service.phone}`, '_self');
};

// Show all services
const showAllServices = () => {
  console.log('Showing all services...');
  addHealthServiceMarkers();
  
  // Fit map to show all services in Melbourne metro area
  if (healthServices.value.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    healthServices.value.forEach(service => {
      bounds.extend(service.coordinates);
    });
    map.value.fitBounds(bounds, { padding: 100 }); // Increased padding to show more area
  }
};

// Show service popup on hover
const showServicePopup = (service, markerElement) => {
  // Remove existing popup
  if (window.servicePopup) {
    window.servicePopup.remove();
  }
  
  // Create popup content - only show name and category
  const popupContent = `
    <div class="service-popup">
      <div class="popup-category">
        <span class="badge ${getCategoryBadgeClass(service.category)}">${getCategoryDisplayName(service.category)}</span>
      </div>
      <h6 class="popup-title">${service.name}</h6>
    </div>
  `;
  
  // Create popup
  window.servicePopup = new mapboxgl.Popup({
    offset: 15,
    closeButton: false,
    closeOnClick: false,
    className: 'service-hover-popup'
  })
    .setLngLat(service.coordinates)
    .setHTML(popupContent)
    .addTo(map.value);
};

// Hide service popup
const hideServicePopup = () => {
  if (window.servicePopup) {
    window.servicePopup.remove();
    window.servicePopup = null;
  }
};


// Handle keyboard navigation for map
const handleMapKeyboard = (event) => {
  if (!map.value) return;
  
  const key = event.key;
  const center = map.value.getCenter();
  const zoom = map.value.getZoom();
  
  switch (key) {
    case 'ArrowUp':
      event.preventDefault();
      map.value.panTo([center.lng, center.lat + 0.01]);
      break;
    case 'ArrowDown':
      event.preventDefault();
      map.value.panTo([center.lng, center.lat - 0.01]);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      map.value.panTo([center.lng - 0.01, center.lat]);
      break;
    case 'ArrowRight':
      event.preventDefault();
      map.value.panTo([center.lng + 0.01, center.lat]);
      break;
    case '+':
    case '=':
      event.preventDefault();
      map.value.zoomTo(zoom + 1);
      break;
    case '-':
      event.preventDefault();
      map.value.zoomTo(zoom - 1);
      break;
    case 'Home':
      event.preventDefault();
      map.value.fitBounds([
        [144.5, -38.0], // Southwest
        [145.5, -37.5]  // Northeast
      ]);
      break;
  }
};

// Lifecycle hooks
onMounted(async () => {
  await nextTick();
  await initializeMap();
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>

<style scoped>
.health-map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Floating Map Controls */
.map-controls-floating {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  max-width: 350px;
  max-height: 70vh;
  overflow-y: auto;
}

.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 15px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.filter-buttons .btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
}

.filter-buttons .btn.active {
  background-color: var(--bs-primary);
  color: white;
}

.location-controls {
  display: flex;
  gap: 10px;
}

.health-map {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.service-info-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.panel-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-body {
  padding: 15px;
}

.risk-assessment-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}


.risk-factors ul {
  list-style: none;
  padding: 0;
}

.risk-factors li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.risk-factors li.low {
  color: #28a745;
}

.risk-factors li.medium {
  color: #ffc107;
}

.risk-factors li.high {
  color: #dc3545;
}

.recommendations ul {
  list-style: none;
  padding: 0;
}

.recommendations li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

/* Search Suggestions */
.search-container {
  position: relative;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover,
.suggestion-item.active {
  background-color: #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-content {
  display: flex;
  align-items: center;
}

.suggestion-title {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 2px;
}

.suggestion-category {
  font-size: 0.85rem;
  color: #6c757d;
}

/* Service Info Panel Enhancements */
.service-info-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
}

.panel-header {
  padding: 20px 20px 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.panel-header h6 {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.panel-body {
  padding: 20px;
}

.service-type {
  margin-bottom: 15px;
}

.badge {
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 20px;
}

.bg-purple {
  background-color: #6f42c1 !important;
}

.services-list {
  margin: 15px 0;
}

.service-item {
  padding: 4px 0;
  font-size: 0.9rem;
  color: #495057;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-buttons .btn {
  flex: 1;
  min-width: 80px;
}

/* Enhanced markers - Let Mapbox handle all positioning */
.health-marker,
.user-location-marker,
.nearby-service {
  /* Don't interfere with Mapbox positioning */
  display: block;
}

/* Apply animations only to inner elements */
.marker-inner {
  transform-origin: center center;
  transition: all 0.3s ease;
}

.marker-inner:hover {
  transform: scale(1.1);
}

/* Pulse animation for nearby services */
.nearby-service .marker-inner {
  animation: pulse 2s infinite;
}

/* User location marker pulse */
.user-location-marker .marker-inner {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

/* Service Hover Popup */
.service-hover-popup .mapboxgl-popup-content {
  padding: 10px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: white;
  border: none;
  min-width: 150px;
  max-width: 200px;
}

.service-popup {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.popup-category {
  margin-bottom: 6px;
}

.popup-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  line-height: 1.3;
}

/* Popup badge styles - ensure proper contrast */
.service-hover-popup .badge {
  color: white !important;
  font-weight: 600;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}

/* Force specific colors for each category */
.service-hover-popup .bg-purple {
  background-color: #6f42c1 !important;
  color: white !important;
}

.service-hover-popup .bg-danger {
  background-color: #dc3545 !important;
  color: white !important;
}

.service-hover-popup .bg-warning {
  background-color: #fd7e14 !important;
  color: white !important;
}

.service-hover-popup .bg-success {
  background-color: #28a745 !important;
  color: white !important;
}

.service-hover-popup .bg-secondary {
  background-color: #6c757d !important;
  color: white !important;
}

/* Additional specificity to override any conflicting styles */
.service-hover-popup .popup-category .badge {
  color: white !important;
  background-color: inherit !important;
}

/* Screen reader only content */
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

/* Responsive design */
@media (max-width: 768px) {
  .map-controls-floating {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    margin-bottom: 10px;
    max-width: 100%;
    max-height: none;
  }
  
  .map-controls {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    margin-bottom: 10px;
  }
  
  .service-info-panel,
  .risk-assessment-panel {
    position: relative;
    bottom: 0;
    right: 0;
    width: 100%;
    margin-top: 10px;
  }
  
  
  .suggestions-dropdown {
    position: relative;
    margin-top: 5px;
  }
}
</style>
