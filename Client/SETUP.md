# Space Intelligence Platform - Setup & Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
6. [Building for Production](#building-for-production)
7. [Deployment](#deployment)
8. [Backend API Integration](#backend-api-integration)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

- **Node.js** 18.17 or higher ([download](https://nodejs.org))
- **npm** 9+ or **yarn** 4+
- **Firebase Project** ([create one](https://firebase.google.com))
- **Backend API** running on `http://localhost:3001` (for development)

### Optional

- **Git** for version control
- **Docker** for containerization
- **VS Code** with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Firebase Explorer

---

## Local Development Setup

### 1. Clone or Navigate to Project

```bash
cd /home/faraday/Desktop/SR-16-Invictus/Client
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Verify Installation

```bash
npm list next react typescript tailwindcss framer-motion
```

---

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: `space-intelligence-platform`
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Set Up Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. **Sign-in methods:**
   - Enable **Email/Password**
   - Enable **Google**
   - For Google: Use your Google Cloud Console credentials

### Step 3: Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. **General** tab
3. Scroll to **Your apps** section
4. Click the web app icon (`</>`)</your> or create new web app
5. Copy the Firebase config object

### Step 4: Create Firestore Database (Optional)

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose production mode
4. Set security rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /missions/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

---

## Environment Variables

### Create .env.local File

```bash
cp .env.local.example .env.local
```

### Edit .env.local with Your Values

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...YourKeyHere...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=space-intelligence-platform.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=space-intelligence-platform
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=space-intelligence-platform.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Backend API (Development)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001

# NASA API Key (Optional - if direct API calls needed)
NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key_here
```

### Get NASA API Key (Optional)

1. Visit [NASA API Portal](https://api.nasa.gov)
2. Fill registration form
3. Check your email for API key
4. Use "DEMO_KEY" for testing

---

## Running the Application

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Features to Test

1. **Authentication:**
   - Register with email/password
   - Login with email/password
   - Login with Google
   - Logout

2. **Dashboard:**
   - View upcoming missions with countdown timers
   - Toggle hazardous NEO filter
   - Check space weather and KP index
   - View satellite positions
   - Check Mars weather

3. **Mission Details:**
   - Click any mission card
   - View countdown timer
   - See mission timeline
   - Review payload details

4. **Solar View:**
   - On desktop: drag to rotate sky
   - On mobile: rotate device (requires permission)
   - Toggle night/day mode
   - View ISS position

### Hot Reload

The app automatically refreshes when you save changes. TypeScript errors appear in terminal.

---

## Building for Production

### 1. Create Production Build

```bash
npm run build
```

This:
- Compiles TypeScript
- Optimizes JavaScript and CSS
- Generates static pages
- Checks for errors

### 2. Test Production Build Locally

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

### 3. Check Build Output

```bash
# View build size
npm run build -- --analyze

# Check for errors
npm run type-check
npm run lint
```

---

## Deployment

### Option 1: Vercel (Recommended)

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/space-intel-frontend.git
git push -u origin main
```

#### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Environment Variables:**
   - Add all variables from `.env.local`
5. **Build Settings:**
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
6. Click "Deploy"

#### 3. Configure Custom Domain

In Vercel project settings → Domains

### Option 2: Docker (Self-Hosted)

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. Build Docker Image

```bash
docker build -t space-intel:latest .
```

#### 3. Run Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com \
  space-intel:latest
```

### Option 3: AWS Amplify

1. Push code to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
3. Click "New app" → "Host web app"
4. Connect repository
5. Add environment variables
6. Deploy

### Option 4: Netlify

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

---

## Backend API Integration

### Expected Backend Endpoints

The frontend expects these REST API endpoints:

```
GET  /api/status          → System status
GET  /api/missions        → All missions
GET  /api/missions/:id    → Single mission
GET  /api/neo             → Near-Earth objects
GET  /api/space-weather   → Space weather events
GET  /api/kp-index        → KP index data
GET  /api/satellites      → Satellite positions
GET  /api/satellites/:name → Single satellite position
GET  /api/alerts          → Impact alerts
GET  /api/mars-weather    → Mars weather data
GET  /api/earth-imagery   → Earth satellite imagery
GET  /api/dashboard       → Complete dashboard data
```

### Mock Data

The dashboard currently uses **mock data** for demonstration. To connect to real backend:

1. Update `.env.local`:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com/api
   ```

2. In `dashboardService.ts`, uncomment API calls:
   ```typescript
   // Instead of mock data:
   const data = await dashboardService.getDashboardData();
   setData(data);
   ```

### API Authentication

All requests include Firebase auth token:

```typescript
// Automatically added by Axios interceptor in lib/axios.ts
Authorization: Bearer {firebase_id_token}
```

Your backend should verify this token.

---

## Troubleshooting

### Issue: Firebase Config Not Loading

**Solution:**
- Verify `.env.local` exists and has correct values
- Restart dev server after adding env vars
- Check Firebase Console credentials match

### Issue: Authentication Not Working

**Solution:**
- Check Firebase Authentication is enabled
- Verify sign-in methods are configured
- Check browser console for errors
- Clear browser cache and cookies

### Issue: Blank Dashboard

**Solution:**
- Check browser console for API errors
- Verify backend API is running (if using real API)
- Try with mock data (current default)
- Check network tab for failed requests

### Issue: TypeScript Errors

**Solution:**
```bash
npm run type-check
# Fix errors reported, then:
npm run build
```

### Issue: Build Fails

**Solution:**
```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm run build
```

### Issue: Mobile Responsive Issues

**Solution:**
- Test in Chrome DevTools device mode
- Check Tailwind breakpoints (sm, md, lg, xl)
- Verify viewport meta tag in layout.tsx
- Test on actual mobile device

### Issue: Animations Stuttering

**Solution:**
- Reduce animation complexity
- Check browser performance in DevTools
- Disable background effects if needed
- Update GPU acceleration in tailwind.config.ts

---

## Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/rocket.jpg"
  alt="Rocket"
  width={400}
  height={300}
  priority
/>
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <LoadingSkeleton />,
});
```

### Caching Strategies

```typescript
// In API service:
const cachedData = useMemo(() => {
  return expensiveComputation();
}, [dependencies]);
```

---

## Security Checklist

- [ ] Firebase auth enabled
- [ ] Environment variables hidden (`.env.local` in `.gitignore`)
- [ ] CORS configured on backend
- [ ] API tokens properly validated
- [ ] Sensitive data not logged
- [ ] HTTPS enforced on production
- [ ] Content Security Policy headers set
- [ ] Rate limiting enabled on backend

---

## Monitoring & Analytics

### Firebase Analytics

Enable in Firebase Console for user tracking.

### Error Reporting

Add error boundary:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <YourComponent />
</ErrorBoundary>
```

### Performance Monitoring

Use Next.js built-in metrics:

```typescript
// pages/_app.tsx
import { useReportWebVitals } from 'next/web-vitals';

useReportWebVitals((metric) => {
  console.log(metric); // Send to analytics service
});
```

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion
- **Zustand:** https://github.com/pmndrs/zustand

---

## License

Proprietary - Space Intelligence Platform

