# Project Structure Guide

This document provides a detailed overview of the project's file organization and the purpose of each directory and file.

## Root Directory

```
FIT5032-Assessment-3/
├── src/                    # Frontend source code
├── functions/              # Firebase Cloud Functions
├── public/                 # Static public assets
├── dist/                   # Production build output
├── node_modules/           # Dependencies (auto-generated)
├── Configuration Files     # Project configuration
├── Documentation Files     # Project documentation
└── Deployment Files        # Deployment scripts and configs
```

## Frontend Structure (`src/`)

### Components (`src/components/`)
- **InteractiveTable.vue** - Advanced data table with sorting, searching, pagination
- **NavBar.vue** - Main navigation component
- **ResourceCard.vue** - Individual resource display card
- **ResponsiveGrid.vue** - Responsive grid layout component

### Pages (`src/pages/`)
- **AdminDashboard.vue** - Admin management panel with user statistics
- **AuthTest.vue** - Authentication testing page
- **Contact.vue** - Contact form with email functionality
- **ForgotPassword.vue** - Password reset functionality
- **Home.vue** - Landing page with hero section
- **JoinCommunity.vue** - Community joining page
- **Login.vue** - User authentication page
- **Register.vue** - User registration page
- **ResourceManagement.vue** - Resource administration panel
- **Resources.vue** - Public resource listing page

### Configuration (`src/config/`)
- **firebase.js** - Firebase SDK configuration and initialization
- **emailjs.js** - EmailJS service configuration

### Services (`src/services/`)
- **cloudFunctions.js** - Client-side service for Firebase Cloud Functions

### Utilities (`src/utils/`)
- **auth.js** - Hybrid authentication utilities (Firebase + local fallback)
- **authStatus.js** - Authentication status management
- **emailService.js** - Email service utilities and functions
- **firebaseAuth.js** - Firebase Authentication wrapper
- **ratings.js** - Rating system utilities
- **security.js** - Security utilities (validation, sanitization)
- **session.js** - Session management utilities
- **storage.js** - Local storage utilities

### Data (`src/data/`)
- **resources.json** - Static health resources data
- **tips.json** - Health tips and advice data

### Router (`src/router/`)
- **index.js** - Vue Router configuration and route definitions

## Backend Structure (`functions/`)

### Source Code (`functions/src/`)
- **index.ts** - Main Cloud Functions entry point
- **emailService.ts** - Email service functions (contact, password reset, welcome)
- **dataProcessor.ts** - Data processing functions (user stats, resource management)

### Compiled Code (`functions/lib/`)
- **index.js** - Compiled JavaScript from TypeScript
- **emailService.js** - Compiled email service functions
- **dataProcessor.js** - Compiled data processing functions
- **\*.js.map** - Source maps for debugging

### Configuration
- **package.json** - Cloud Functions dependencies
- **tsconfig.json** - TypeScript configuration for functions

## Configuration Files

### Firebase Configuration
- **firebase.json** - Firebase project configuration (hosting, functions, firestore)
- **firestore.rules** - Database security rules
- **firestore.indexes.json** - Database query indexes

### Build Configuration
- **vite.config.js** - Vite build tool configuration
- **eslint.config.js** - ESLint code quality configuration
- **jsconfig.json** - JavaScript project configuration

### Environment
- **env.example** - Environment variables template
- **package.json** - Project dependencies and scripts

## Documentation Files

### Setup Guides
- **FIREBASE_AUTO_DEPLOY_SETUP.md** - Firebase deployment setup guide
- **CLOUDFLARE_PAGES_SETUP.md** - Cloudflare Pages setup guide
- **QUICK_FIREBASE_SETUP.md** - Quick Firebase setup guide

### Implementation Documentation
- **IMPLEMENTATION_SUMMARY.md** - Complete BR requirements implementation summary
- **DEPLOYMENT_STATUS.md** - Current deployment status and URLs
- **TESTING_GUIDE.md** - Comprehensive testing guide

### Troubleshooting
- **AUTH_FIX.md** - Authentication troubleshooting guide
- **LOGIN_TROUBLESHOOTING.md** - Login issues troubleshooting
- **ADMIN_USER_CHECK.md** - Admin user verification guide

## Deployment Files

### Scripts
- **deploy.sh** - Linux/macOS deployment script
- **deploy.bat** - Windows deployment script

### Cloudflare
- **_headers** - Cloudflare Pages headers configuration
- **_redirects** - Cloudflare Pages redirects configuration

### Testing
- **test-cloud-functions.js** - Cloud Functions testing script

## Build Output (`dist/`)

The `dist/` directory contains the production build output:
- **index.html** - Main HTML file
- **assets/** - Compiled CSS and JavaScript files
- **favicon.ico** - Site favicon

## Public Assets (`public/`)

- **favicon.ico** - Site favicon (copied to dist during build)

## File Naming Conventions

- **Vue Components**: PascalCase (e.g., `InteractiveTable.vue`)
- **JavaScript Files**: camelCase (e.g., `firebaseAuth.js`)
- **Configuration Files**: lowercase with extensions (e.g., `firebase.json`)
- **Documentation**: UPPERCASE with underscores (e.g., `DEPLOYMENT_STATUS.md`)

## Key Files to Know

### For Development
- `src/main.js` - Application entry point
- `src/App.vue` - Root Vue component
- `src/router/index.js` - Route configuration
- `vite.config.js` - Build configuration

### For Deployment
- `firebase.json` - Firebase configuration
- `package.json` - Dependencies and scripts
- `deploy.sh` / `deploy.bat` - Deployment scripts

### For Understanding the App
- `src/pages/` - All application pages
- `src/components/` - Reusable components
- `functions/src/` - Backend logic
- `README.md` - Project overview and setup

## Important Notes

1. **Never commit** `.env` files (use `env.example` as template)
2. **Build output** in `dist/` is auto-generated
3. **Node modules** are auto-generated from `package.json`
4. **Firebase functions** are compiled from TypeScript in `functions/src/`
5. **Documentation files** should be kept up-to-date with code changes
