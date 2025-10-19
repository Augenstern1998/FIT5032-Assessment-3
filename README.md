# Men's Health Resource Platform

A comprehensive web application built with Vue 3 and Firebase, designed to provide health resources and community support for men's wellness.

## Live Demo

- **Firebase Hosting**: https://mens-health-app-b7749.web.app
- **Cloudflare Pages**: https://fit5032-assessment-3.pages.dev
- **Cloud Functions**: [https://us-central1-mens-health-app-b7749.cloudfunctions.net](https://console.firebase.google.com/project/mens-health-app-b7749/functions)

## Features

### Authentication System
- **Firebase Authentication** with email/password
- **Google OAuth 2.0** integration
- **Secure session management**
- **User role management** (member/admin)

### Email Services
- **Dual email architecture**: Cloud Functions + EmailJS fallback
- **Contact form** with attachment support
- **HTML email templates**
- **Password reset functionality**

### Interactive Data Management
- **Advanced data table** with sorting, searching, and pagination
- **User management dashboard**
- **Resource management system**
- **Rating and review system**

### Cloud Infrastructure
- **Firebase Cloud Functions** (5 deployed functions)
- **Firebase Firestore** database
- **Multi-platform deployment**
- **Automated CI/CD pipeline**

## Technology Stack

### Frontend
- **Vue 3** with Composition API
- **Vite** for build tooling
- **Bootstrap 5** for UI components
- **Vue Router** for navigation

### Backend
- **Firebase Cloud Functions** (Node.js 20 + TypeScript)
- **Firebase Authentication**
- **Firebase Firestore** (NoSQL database)
- **Nodemailer** for email services

### Deployment
- **Firebase Hosting** (primary)
- **Cloudflare Pages** (CDN)
- **GitHub Actions** (CI/CD)

## Project Structure

```
FIT5032-Assessment-3/
├── src/                          # Frontend source code
│   ├── components/               # Reusable Vue components
│   │   ├── InteractiveTable.vue     # Advanced data table
│   │   ├── NavBar.vue              # Navigation component
│   │   ├── ResourceCard.vue        # Resource display card
│   │   └── ResponsiveGrid.vue      # Responsive grid layout
│   ├── pages/                   # Application pages
│   │   ├── AdminDashboard.vue      # Admin management panel
│   │   ├── Contact.vue             # Contact form page
│   │   ├── Home.vue                # Landing page
│   │   ├── Login.vue               # Authentication page
│   │   ├── Register.vue            # User registration
│   │   ├── Resources.vue           # Resource listing
│   │   └── ResourceManagement.vue  # Resource admin panel
│   ├── config/                  # Configuration files
│   │   ├── firebase.js             # Firebase configuration
│   │   └── emailjs.js              # EmailJS configuration
│   ├── services/                # External service integrations
│   │   └── cloudFunctions.js       # Cloud Functions client
│   ├── utils/                   # Utility functions
│   │   ├── auth.js                 # Authentication utilities
│   │   ├── firebaseAuth.js         # Firebase auth wrapper
│   │   ├── emailService.js         # Email service utilities
│   │   └── security.js             # Security utilities
│   └── data/                    # Static data files
│       ├── resources.json          # Health resources data
│       └── tips.json               # Health tips data
├── functions/                   # Firebase Cloud Functions
│   ├── src/                     # TypeScript source
│   │   ├── index.ts                # Main functions entry
│   │   ├── emailService.ts         # Email service functions
│   │   └── dataProcessor.ts        # Data processing functions
│   └── lib/                     # Compiled JavaScript
├── public/                      # Static assets
├── dist/                        # Production build
├── firebase.json                # Firebase configuration
├── firestore.rules              # Database security rules
├── firestore.indexes.json       # Database indexes
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies and scripts
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase CLI
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FIT5032-Assessment-3
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your Firebase configuration
   ```

4. **Firebase setup**
   ```bash
   firebase login
   firebase use --add
   ```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
npm run deploy

# Deploy Cloud Functions
npm run deploy:functions
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase Cloud Functions Environment

```bash
firebase functions:config:set email.user="your_email@gmail.com"
firebase functions:config:set email.password="your_app_password"
firebase functions:config:set admin.email="admin@example.com"
```

## Business Requirements Implementation

### BR D.1: External Authentication
- **Firebase Authentication** with email/password
- **Google OAuth 2.0** integration
- **Secure session management**
- **User-friendly login flow**

### BR D.2: Email Functionality
- **Dual email service** (Cloud Functions + EmailJS)
- **Attachment support** for contact forms
- **HTML email templates**
- **Robust error handling**

### BR D.3: Interactive Table Data
- **Advanced data table** with sorting, searching, pagination
- **Multi-dataset support** (users, resources, admin data)
- **Responsive design** for mobile compatibility
- **Real-time data filtering**

### BR D.4: Deployment to the Cloud
- **Multi-platform deployment** (Firebase + Cloudflare)
- **GitHub Actions** automated deployment
- **Live URLs** with full functionality
- **Environment management**

### BR E.1: Cloud Functions
- **5 Firebase Cloud Functions** deployed:
  - `healthCheck` - System health monitoring
  - `sendEmail` - Email sending service
  - `processData` - Data processing operations
  - `getUserStats` - User statistics
  - `getResourceStats` - Resource statistics
- **Serverless architecture** with HTTP triggers
- **Secure backend logic** with environment variables

## Testing

### Manual Testing
1. **Authentication**: Test login/register with email and Google
2. **Contact Form**: Submit form with and without attachments
3. **Data Tables**: Test sorting, searching, and pagination
4. **Admin Panel**: Verify admin-only access and functionality
5. **Cloud Functions**: Test all 5 deployed functions

### Automated Testing
```bash
# Run linting
npm run lint

# Test Cloud Functions locally
npm run test:functions
```

## Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Cloudflare Pages
- Connected to GitHub repository
- Automatic deployment on push to main branch
- Environment variables configured in Cloudflare dashboard

### Cloud Functions
```bash
firebase deploy --only functions
```

## Performance

- **Lighthouse Score**: 90+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Time**: < 3 seconds on 3G
- **Cloud Functions**: < 500ms response time

## Security

- **Firebase Security Rules** for database access
- **Input validation** and sanitization
- **CORS configuration** for API endpoints
- **Environment variable** protection
- **Authentication** required for sensitive operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of FIT5032 Assessment 3 - Monash University

## Support

For technical support or questions:
- **Email**: Contact through the application's contact form
- **Issues**: Create an issue in the GitHub repository

---

**Built with care for men's health and wellness**