# 🚀 AstroView - Space Intelligence Platform

<div align="center">

![AstroView Banner](https://img.shields.io/badge/AstroView-Space%20Intelligence-0B0F1A?style=for-the-badge&logo=rocket&logoColor=00D9FF)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Express](https://img.shields.io/badge/Express-5.x-green?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A modern, futuristic space intelligence dashboard for real-time monitoring of space data, NASA integrations, and celestial events.**

[Features](#-features) • [Sky Watch](#-sky-watch---constellation-viewer) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Reference](#-api-reference) • [Screenshots](#-screenshots)

</div>

---

## 📖 Overview

**AstroView** is a comprehensive space intelligence platform that aggregates data from NASA APIs, ISRO, and other space agencies to provide real-time monitoring of:

- Near-Earth objects (asteroids)
- Space weather events (solar flares, CMEs, geomagnetic storms)
- Satellite tracking (ISS, Hubble, and more)
- Mars weather conditions
- Upcoming space missions
- Earth impact detection alerts
- **Sky Watch** - Interactive constellation viewer with gyroscope support

Built with a modern tech stack featuring **Next.js 14**, **TypeScript**, **Firebase Authentication**, and a **Node.js/Express** backend with **MongoDB** for data persistence.

---

## ✨ Features

### Core Features

| Feature | Description | Key Capabilities |
|---------|-------------|------------------|
| 🔐 **Authentication** | Secure Firebase-based auth system | Email/Password login, Google OAuth, Protected routes, Session persistence, Auto-refresh tokens |
| 🚀 **Mission Tracker** | Live space mission monitoring | NASA/ISRO/SpaceX/ESA missions, Real-time countdowns, Launch site info, Detailed mission timelines |
| ☄️ **NEO Detection** | Near-Earth Object tracking | Asteroid monitoring, Hazard detection, Miss distance & velocity, Size estimation, Visual alerts |
| 🌊 **Space Weather** | Solar activity monitoring | KP Index (0-9), Solar flares, CME tracking, Geomagnetic storms, Historical charts |
| 🛰️ **Satellite Tracker** | Real-time spacecraft positions | ISS & Hubble tracking, World map visualization, Live coordinates, Altitude & velocity data |
| 🌍 **Earth Intelligence** | NASA satellite imagery | GIBS integration, Layer toggles (vegetation/weather/temp), Historical data access |
| ⚠️ **Impact Alerts** | Threat detection system | Tsunami warnings, Severe weather, Asteroid approaches, Severity indicators, Real-time notifications |
| 🔴 **Mars Weather** | Martian atmospheric data | Sol data from rovers, Temperature (min/max/avg), Wind speed & pressure, Trend charts |
| 🌌 **Sky Watch** | Constellation viewer | Gyroscope-based navigation, 200+ stars, ISS marker, Night/Day mode, Desktop mouse fallback |

### Additional Features

| Category | Features |
|----------|----------|
| 📊 **Data Visualization** | Interactive Recharts graphs, KP Index gauge, Temperature trends, Launch frequency charts |
| 🎨 **UI/UX Design** | Glassmorphism cards, Glow effects, Smooth Framer Motion animations, Dark theme |
| 📱 **Responsive** | Mobile-first design, Tablet & desktop optimized, Touch-friendly controls |
| 🗄️ **Backend Services** | NASA API integration, MongoDB persistence, Redis caching, Cron job scheduling |
| 📚 **NASA Resources** | APOD (Picture of the Day), Media Library, Tech Transfer database, Open Science Data Repository |

---

## 🌌 Sky Watch - Constellation Viewer

<div align="center">

### 📱 **Interactive Gyroscope-Based Star Gazing Experience**

</div>

Sky Watch is an immersive constellation viewer that transforms your device into a window to the cosmos.

### Features

| Feature | Description |
|---------|-------------|
| **🔄 Gyroscope Integration** | Real-time device orientation tracking using DeviceOrientationEvent API |
| **📱 iOS 13+ Support** | Explicit permission request for iOS devices |
| **🖱️ Desktop Fallback** | Mouse drag controls for non-mobile devices |
| **⭐ Dynamic Star Field** | 200+ procedurally generated stars with twinkling effect |
| **🛰️ ISS Marker** | Real-time ISS position with glowing pulse animation |
| **🌙 Night/Day Mode** | Toggle for optimal viewing in different conditions |
| **📐 Coordinate Display** | Live alpha (α), beta (β), gamma (γ) orientation data |
| **🎯 Grid Overlay** | Reference grid for celestial navigation |

### How It Works

```
┌─────────────────────────────────────┐
│                                     │
│  SKY WATCH                          │
│  Rotate your device to view the sky │
│                                     │
│  [🌙 Night Mode Toggle]             │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ ★ ★   ★    ★ ★ ★   ★ ★   ★ │   │
│  │   ★     ◆ (ISS)        ★    │   │
│  │ ★   ★ ★  ★ ★   ★ ★   ★   ★ │   │
│  │   ★        ★           ★     │   │
│  │ ★ ★    ★    ★ ★ ★   ★ ★   ★ │   │
│  │                               │   │
│  │  α: 45°  β: 25°  γ: 0°       │   │
│  └──────────────────────────────┘   │
│                                     │
│  ISS Position                       │
│  Lat: 45.5231° | Long: -122.6765°   │
│  Alt: 408 km   | Vel: 27,600 km/h   │
│                                     │
└─────────────────────────────────────┘
```

### Controls

**Mobile Devices:**
- 📱 Rotate your device to explore the night sky
- 🔄 View updates in real-time with device orientation
- 🌙 Toggle night/day mode for better visibility

**Desktop:**
- 🖱️ Click and drag to rotate the view
- ↔️ Horizontal movement controls azimuth (left-right)
- ↕️ Vertical movement controls altitude (up-down)

---

## 🛠️ Tech Stack

### Frontend (Client)

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **TailwindCSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Recharts** | Data visualization charts |
| **Zustand** | Lightweight state management |
| **Firebase** | Authentication (Email + Google OAuth) |
| **Axios** | HTTP client with interceptors |
| **Leaflet** | Interactive maps |
| **Three.js** | 3D graphics (React Three Fiber) |
| **Lucide React** | Modern icon library |

### Backend (Server)

| Technology | Purpose |
|------------|---------|
| **Express 5** | Node.js web framework |
| **TypeScript** | Type-safe development |
| **MongoDB** | Database with Mongoose ODM |
| **Redis** | Caching layer |
| **Firebase Admin** | Server-side auth verification |
| **LangChain** | AI/ML integrations |
| **Node Cron** | Scheduled jobs |
| **JWT** | Token-based authentication |

---

## 📁 Project Structure

```
SR-16-Invictus/
├── Client/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── auth/                # Authentication page
│   │   │   ├── dashboard/           # Main dashboard
│   │   │   │   ├── nasa-media/      # NASA media library
│   │   │   │   ├── osdr/            # Open Science Data Repo
│   │   │   │   └── tech-transfer/   # NASA tech transfer
│   │   │   ├── isro/                # ISRO missions page
│   │   │   ├── mars/                # Mars weather page
│   │   │   ├── mission/[id]/        # Mission detail page
│   │   │   ├── neo/                 # NEO tracking
│   │   │   │   └── [id]/            # NEO detail page
│   │   │   ├── satellite/[id]/      # Satellite detail
│   │   │   ├── solar-system/        # Solar system explorer
│   │   │   └── solar-view/          # 🌌 Sky Watch viewer
│   │   ├── components/
│   │   │   ├── animations/          # Chart components
│   │   │   ├── common/              # Reusable UI components
│   │   │   ├── layouts/             # Layout wrappers
│   │   │   └── ui/                  # UI primitives
│   │   ├── features/
│   │   │   ├── auth/                # Auth components
│   │   │   ├── dashboard/           # Dashboard widgets
│   │   │   └── missions/            # Mission components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Libraries & configs
│   │   │   └── firebase/            # Firebase setup
│   │   ├── services/                # API service layer
│   │   ├── store/                   # Zustand stores
│   │   ├── types/                   # TypeScript types
│   │   └── utils/                   # Helper functions
│   └── public/                      # Static assets
│
└── server/                          # Express Backend
    ├── src/
    │   ├── config/
    │   │   ├── database.ts          # MongoDB connection
    │   │   ├── firebaseAdmin.ts     # Firebase Admin SDK
    │   │   └── redis.ts             # Redis configuration
    │   ├── controllers/
    │   │   ├── authController.ts
    │   │   ├── nasaMediaController.ts
    │   │   ├── osdrController.ts
    │   │   └── techTransferController.ts
    │   ├── jobs/
    │   │   └── cronJobs.ts          # Scheduled tasks
    │   ├── middleware/
    │   │   └── authMiddleware.ts    # JWT verification
    │   ├── models/
    │   │   ├── Asteroid.ts
    │   │   ├── Mission.ts
    │   │   ├── SatelliteTLE.ts
    │   │   ├── SolarStorm.ts
    │   │   └── User.ts
    │   ├── routes/
    │   │   ├── apodRoutes.ts        # Astronomy Picture of Day
    │   │   ├── authRoutes.ts
    │   │   ├── isroRoutes.ts
    │   │   ├── marsRoutes.ts
    │   │   ├── missionRoutes.ts
    │   │   ├── nasaMediaRoutes.ts
    │   │   ├── nasaRoutes.ts
    │   │   ├── neoRoutes.ts
    │   │   ├── osdrRoutes.ts
    │   │   └── spaceWeatherRoutes.ts
    │   └── services/
    │       ├── apodService.ts
    │       ├── nasaMediaService.ts
    │       ├── nasaService.ts
    │       ├── neoService.ts
    │       ├── osdrService.ts
    │       └── techTransferService.ts
    └── docker-compose.yml           # Docker orchestration
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.17 or higher
- **npm** 9+ or **yarn** 4+
- **MongoDB** instance (local or Atlas)
- **Redis** (optional, for caching)
- **Firebase Project** for authentication

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SR-16-Invictus.git
cd SR-16-Invictus
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/astroview

# Redis
REDIS_URL=redis://localhost:6379

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# NASA API
NASA_API_KEY=your-nasa-api-key
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd Client

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Start the frontend:

```bash
npm run dev
```

### 4. Access the Application

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001](http://localhost:3001)

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### NASA Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nasa/neo` | Near-Earth Objects |
| GET | `/api/apod` | Astronomy Picture of the Day |
| GET | `/api/nasa-media` | NASA Media Library |
| GET | `/api/tech-transfer` | NASA Technology Transfer |

### Space Weather

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/space-weather` | Current space weather |
| GET | `/api/space-weather/kp` | KP Index data |
| GET | `/api/space-weather/flares` | Solar flare events |

### Missions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/missions` | All upcoming missions |
| GET | `/api/missions/:id` | Single mission detail |
| GET | `/api/isro` | ISRO missions |

### Mars

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mars/weather` | Mars weather data |
| GET | `/api/mars/photos` | Mars rover photos |

### Open Science Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/osdr` | NASA OSDR datasets |
| GET | `/api/osdr/search` | Search datasets |

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0B0F1A` | Main background |
| Surface | `#0F1429` | Cards, panels |
| Cyan | `#00D9FF` | Primary accent |
| Purple | `#B24BFF` | Secondary accent |
| Blue | `#0066FF` | Tertiary accent |
| Danger | `#FF3B3B` | Alerts, warnings |

### UI Components

- **Glassmorphism Cards** - Frosted glass effect with blur
- **Glow Effects** - Cyan/purple glow animations
- **Status Indicators** - Animated pulse for system status
- **Progress Meters** - Gradient threat level displays
- **Skeleton Loaders** - Animated loading placeholders

---

## 📱 Screenshots

<div align="center">

### Dashboard
*Real-time space intelligence monitoring*

### Sky Watch
*Interactive constellation viewer with gyroscope*

### Mission Details
*Detailed mission information with countdown*

### Space Weather
*Solar activity monitoring and alerts*

</div>

---

## 🔧 Development

### Available Scripts

**Frontend (Client):**

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript validation
```

**Backend (Server):**

```bash
npm run dev        # Start with nodemon
npm run build      # Compile TypeScript
npm run start      # Start production server
```

### Docker Deployment

```bash
cd server
docker-compose up -d
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NASA Open APIs** - Space data and imagery
- **ISRO** - Indian Space Research data
- **SpaceX API** - Launch information
- **N2YO** - Satellite tracking data
- **Open-Meteo** - Mars weather data

---

<div align="center">

**Built with ❤️ for space enthusiasts**

[![Star on GitHub](https://img.shields.io/github/stars/your-username/SR-16-Invictus?style=social)](https://github.com/your-username/SR-16-Invictus)

</div>
