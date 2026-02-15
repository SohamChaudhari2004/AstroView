# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
cd /home/faraday/Desktop/SR-16-Invictus/Client
npm install
```

### 2. Configure Firebase
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit [http://localhost:3000](http://localhost:3000)

---

## 🔥 Firebase Setup (If Not Done Yet)

1. Go to [firebase.google.com](https://firebase.google.com)
2. Create new project → `space-intelligence-platform`
3. Enable **Authentication** → Add **Email/Password** and **Google OAuth**
4. Go to **Project Settings** → Copy web app config
5. Paste into `.env.local`

---

## 📋 What Works Out of Box

✅ **Authentication**
- Register with email/password
- Login with email/password
- Login with Google OAuth
- Session persistence

✅ **Dashboard**
- Mission cards with countdown timers
- Near-Earth Object tracking
- Space weather monitoring
- Satellite tracker (ISS)
- Mars weather data
- Impact alerts
- Auto-refresh toggle

✅ **Pages**
- `/auth` - Login/Register
- `/dashboard` - Main dashboard
- `/mission/[id]` - Mission details
- `/solar-view` - Constellation viewer

✅ **UI Components**
- Glassmorphism cards
- Animated buttons and badges
- Form inputs with validation
- Loading skeletons
- Status indicators
- Threat meter

✅ **Animations**
- Page transitions
- Hover effects
- Pulse animations
- Glowing accents
- Countdown timers
- Chart animations

✅ **Styling**
- Dark theme (#0B0F1A background)
- Cyan/Purple accent gradients
- Responsive grid layouts
- Custom Tailwind config
- CSS animations

---

## 🧪 Test Features

### Authentication
1. Click "Register" on auth page
2. Create account with email
3. Login
4. See dashboard
5. Try "Continue with Google"
6. Click Logout

### Dashboard Interactions
1. Hover over mission cards → scales up
2. Click mission → goes to detail page
3. Toggle "Hazardous Only" filter on NEO section
4. Click satellite selector buttons
5. Click "Refresh Now" button
6. Toggle "Auto-refresh" checkbox

### Mission Page
1. View countdown timer (updates every second)
2. See mission timeline with animated dots
3. Click "Back to Dashboard"

### Solar View
1. Drag to rotate constellation (desktop)
2. Toggle night/day mode
3. View ISS position

---

## 📊 Mock Data Features

The dashboard includes realistic mock data:

```typescript
// Missions
- Artemis II (NASA) - 30 days until launch
- Chandrayaan-4 (ISRO) - 60 days until launch
- Starship Flight 5 (SpaceX) - 45 days until launch

// Near-Earth Objects
- 2024 AB5 (non-hazardous)
- 2024 CD1 (hazardous - shows danger badge)

// Space Weather
- Solar flares (M-class)
- KP Index data

// Satellites
- ISS at 45.52°N, 122.68°W
- Hubble Space Telescope

// Mars Weather
- Sol 3845
- Temperature: -142°C to -38°C
- Wind speed: 4.5 m/s
```

---

## 🔌 Connect Real API

When your backend is ready:

1. Update `.env.local`:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com/api
   ```

2. In `src/services/dashboardService.ts`:
   ```typescript
   const data = await dashboardService.getDashboardData();
   setData(data);
   ```

Backend should provide these endpoints:
```
GET /api/missions
GET /api/neo
GET /api/space-weather
GET /api/kp-index
GET /api/satellites
GET /api/alerts
GET /api/mars-weather
GET /api/dashboard
```

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
accent: {
  cyan: '#00D9FF',      // Change cyan
  purple: '#B24BFF',    // Change purple
  danger: '#FF3B3B',    // Change danger red
}
```

### Update Brand
- Logo: `src/components/layouts/Navigation.tsx`
- Name: Search for "SPACE INTEL"
- Colors: `tailwind.config.ts`

### Add New Pages
```bash
# Create new protected page
mkdir -p src/app/\(protected\)/new-page
touch src/app/\(protected\)/new-page/page.tsx
```

---

## 🐛 Common Issues

### 401 Unauthorized
- Check Firebase credentials in `.env.local`
- Make sure auth token is being sent
- Check browser Network tab

### Page Blank
- Check browser console (F12)
- Verify backend API is running
- Check `.env.local` has all variables

### Animations Janky
- Check GPU acceleration
- Reduce animation count
- Update Tailwind config

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Documentation

- **Setup Guide:** See `SETUP.md`
- **Architecture:** See `ARCHITECTURE.md`
- **Project README:** See `README.md`
- **Component Docs:** Inline JSDoc comments

---

## 📦 Build & Deploy

### Create Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Docker Deployment
```bash
docker build -t space-intel .
docker run -p 3000:3000 space-intel
```

---

## ✨ Next Steps

1. ✅ Get app running locally
2. ⬜ Connect real backend API
3. ⬜ Configure Firebase auth properly
4. ⬜ Add more pages/features
5. ⬜ Deploy to production

---

## 📞 Support

- **Next.js:** https://nextjs.org/docs
- **Firebase:** https://firebase.google.com/docs
- **Tailwind:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion

---

**You're all set! Happy coding! 🚀**
