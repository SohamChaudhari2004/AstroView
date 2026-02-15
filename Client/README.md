# Space Intelligence Platform - Frontend

A modern, futuristic, dark-themed space intelligence dashboard built with Next.js 14, TypeScript, and TailwindCSS. Integrates NASA space data APIs with real-time monitoring and visualization.

## Features

- 🚀 **Asteroid Detection** - Real-time near-Earth object tracking
- 🌊 **Space Weather Monitoring** - Solar flares, CMEs, geomagnetic storms
- 🛰️ **Satellite Tracking** - ISS and other spacecraft real-time positions
- 🌍 **Earth Intelligence** - NASA GIBS satellite imagery and analysis
- 🔴 **Impact Detection** - Tsunami, severe weather, and asteroid alerts
- 🔴 **Mars Weather** - Real-time Martian atmospheric data
- 🎯 **Mission Tracking** - Upcoming launch countdown and details
- 🔐 **Firebase Auth** - Email/password and Google OAuth
- 📱 **Responsive Design** - Mobile-first, glassmorphism UI
- ✨ **Animations** - Framer Motion for smooth transitions
- 📊 **Charts** - Recharts for data visualization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Maps**: LeafletJS & React-Leaflet
- **Auth**: Firebase (Email/Password + Google OAuth)
- **State**: Zustand
- **HTTP**: Axios
- **UI Library**: react-hot-toast

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page (redirects to auth/dashboard)
│   ├── (auth)/          # Auth route group
│   │   └── page.tsx     # Login/Register page
│   └── (protected)/      # Protected route group
│       ├── dashboard/   # Dashboard page
│       ├── mission/[id] # Single mission page
│       └── solar-view/  # Gyroscope view
├── components/          # Reusable UI components
│   ├── common/          # Global components
│   ├── layouts/         # Layout components
│   └── animations/      # Framer Motion components
├── features/            # Feature-specific components
│   ├── dashboard/       # Dashboard sections
│   ├── auth/            # Auth components
│   └── missions/        # Mission components
├── hooks/               # Custom React hooks
├── services/            # API services & external integrations
├── store/               # Zustand stores
├── lib/                 # Library utilities
│   ├── firebase/        # Firebase setup
│   └── axios.ts         # Axios instance
├── utils/               # Utility functions
├── types/               # TypeScript types
├── middleware.ts        # Next.js middleware (auth)
└── globals.css          # Global styles
```

## Key Pages

### `/auth` - Authentication
- Login with email/password
- Register new account
- Google OAuth
- Animated galaxy background
- Form validation

### `/dashboard` - Main Dashboard
Multiple interactive sections:
- **Upcoming Missions** - Countdown timers, mission details
- **Near Earth Objects** - Asteroid tracking and trends
- **Space Weather** - Solar activity and alerts
- **Satellite Tracker** - Real-time ISS position
- **Earth Intelligence** - NASA satellite imagery
- **Impact Detection** - Natural disaster alerts
- **Mars Weather** - Martian atmospheric data

### `/mission/[id]` - Single Mission View
- Hero banner with rocket image
- Detailed mission information
- Countdown timer
- Timeline progression
- Parallax effects

### `/solar-view` - Gyroscope Mode (Mobile)
- Device orientation-based constellation viewer
- ISS tracking overlay
- Desktop mouse drag fallback
- Night mode toggle

## Configuration

### Tailwind Theme Colors

```typescript
background: #0B0F1A
card: rgba(255,255,255,0.05)
accent-cyan: #00D9FF
accent-purple: #B24BFF
accent-deep-blue: #0066FF
danger: #FF3B3B (alerts only)
```

### Firebase Setup

1. Create Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Copy config to `.env.local`
4. Enable CORS on your backend API

## API Integration

Backend APIs connected through Axios:
- `/api/neo` - Near-Earth Objects (NeoWs)
- `/api/space-weather` - Space weather data (DONKI)
- `/api/satellites` - Satellite TLE (CelesTrak)
- `/api/earth` - Earth imagery (NASA GIBS)
- `/api/mars` - Mars weather
- `/api/missions` - Mission data
- `/api/alerts` - Impact alerts

## Development

### Build for production:
```bash
npm run build
npm start
```

### Type checking:
```bash
npm run type-check
```

### Linting:
```bash
npm run lint
```

## Security

- Firebase authentication guards all protected routes
- Next.js middleware implements auth checks
- Axios interceptor adds auth tokens to API calls
- Environment variables for sensitive data
- CORS configured for backend communication

## Performance

- Lazy-loaded components
- Image optimization via Next.js
- Dynamic imports for heavy libraries
- Skeleton loaders during data fetch
- Optimized animations using Framer Motion
- Error boundaries for resilience

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Space Intelligence Platform

## Support

For issues or questions, contact the development team.
