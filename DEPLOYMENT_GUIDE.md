# 🚀 Deployment Guide

This guide covers all deployment options for the Men's Health Resource Platform.

## 🌐 Live URLs

- **Firebase Hosting**: https://mens-health-app-b7749.web.app
- **Cloudflare Pages**: https://fit5032-assessment-3.pages.dev
- **Cloud Functions**: https://us-central1-mens-health-app-b7749.cloudfunctions.net

## 📋 Prerequisites

- Node.js 18+
- Firebase CLI installed globally
- Git repository access
- Firebase project configured

## 🔧 Quick Setup

### 1. Install Dependencies
```bash
npm install
cd functions && npm install && cd ..
```

### 2. Environment Configuration
```bash
cp env.example .env
# Edit .env with your Firebase configuration
```

### 3. Firebase Login
```bash
firebase login
firebase use --add
```

## 🚀 Deployment Options

### Option 1: Firebase Hosting (Recommended)

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
```

### Option 2: Cloudflare Pages

1. **Connect Repository**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Connect your GitHub repository
   - Select `FIT5032-Assessment-3`

2. **Build Settings**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

3. **Environment Variables**
   Add these in Cloudflare Pages dashboard:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Option 3: Automated Deployment Scripts

**Windows:**
```cmd
deploy.bat
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

## ☁️ Cloud Functions Deployment

### Deploy All Functions
```bash
firebase deploy --only functions
```

### Deploy Individual Functions
```bash
firebase deploy --only functions:sendEmail
firebase deploy --only functions:processData
```

### Set Environment Variables
```bash
firebase functions:config:set email.user="your_email@gmail.com"
firebase functions:config:set email.password="your_app_password"
firebase functions:config:set admin.email="admin@example.com"
```

## 🔄 GitHub Actions (Automatic Deployment)

The project includes GitHub Actions for automatic deployment:

1. **Push to main branch** triggers deployment
2. **Builds the project** using npm
3. **Deploys to Firebase** automatically
4. **Updates Cloudflare Pages** (if configured)

## 🧪 Testing Deployment

### 1. Verify Firebase Hosting
```bash
# Test the main URL
curl https://mens-health-app-b7749.web.app

# Test Cloud Functions
curl https://us-central1-mens-health-app-b7749.cloudfunctions.net/healthCheck
```

### 2. Test All Features
- [ ] User authentication (login/register)
- [ ] Contact form submission
- [ ] Interactive data tables
- [ ] Admin dashboard access
- [ ] Cloud Functions responses

### 3. Performance Check
- [ ] Page load speed < 3 seconds
- [ ] Mobile responsiveness
- [ ] All images and assets loading
- [ ] No console errors

## 🔧 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Firebase Deploy Fails:**
```bash
# Check Firebase login
firebase login --reauth

# Check project selection
firebase use

# Deploy with verbose output
firebase deploy --debug
```

**Cloud Functions Not Working:**
```bash
# Check function logs
firebase functions:log

# Test functions locally
firebase emulators:start --only functions
```

**Environment Variables Not Loading:**
- Verify `.env` file exists and has correct values
- Check variable names start with `VITE_`
- Restart development server after changes

## 📊 Deployment Status

| Platform | Status | URL | Last Updated |
|----------|--------|-----|--------------|
| Firebase Hosting | ✅ Active | https://mens-health-app-b7749.web.app | Auto |
| Cloudflare Pages | ✅ Active | https://fit5032-assessment-3.pages.dev | Auto |
| Cloud Functions | ✅ Active | 5 functions deployed | Manual |

## 🔒 Security Considerations

1. **Never commit** `.env` files to version control
2. **Use environment variables** for all sensitive data
3. **Configure Firebase Security Rules** properly
4. **Enable HTTPS** for all deployments
5. **Regular security updates** for dependencies

## 📈 Performance Optimization

1. **Code splitting** implemented in Vite config
2. **Asset optimization** with compression
3. **CDN delivery** via Cloudflare Pages
4. **Lazy loading** for components
5. **Image optimization** for faster loading

## 🆘 Support

If you encounter deployment issues:

1. Check the [Firebase Console](https://console.firebase.google.com/)
2. Review [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
3. Check GitHub Actions logs
4. Verify environment variables
5. Test locally first with `npm run dev`

---

**Happy Deploying! 🚀**
