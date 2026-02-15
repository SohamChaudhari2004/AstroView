# Architecture & Development Guide

## Project Overview

This is a modern, full-featured Next.js 14 space intelligence dashboard with real-time data visualization, Firebase authentication, and comprehensive UI components.

## Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety

### Styling & Animation
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **CSS3** - Custom animations & effects

### State Management
- **Zustand** - Lightweight state management
- **React Context** - For providers

### Data Fetching & APIs
- **Axios** - HTTP client with interceptors
- **React Query** - Query caching (can be added)

### Authentication
- **Firebase Auth** - Email/password & OAuth
- **JWT Tokens** - For API authentication

### Data Visualization
- **Recharts** - React charting library
- **LeafletJS** - Map library (placeholder)

---

## Folder Structure Explained

```
src/
├── app/                           # Next.js App Router
│   ├── (auth)/
│   │   └── page.tsx               # Login/Register page
│   ├── (protected)/                # Protected route group
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Main dashboard
│   │   ├── mission/[id]/
│   │   │   └── page.tsx           # Single mission detail
│   │   └── solar-view/
│   │       └── page.tsx           # Constellation viewer
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Redirect page
│   └── providers.tsx              # Toast & other providers
│
├── components/
│   ├── common/                    # Reusable components
│   │   ├── Button.tsx             # Styled button
│   │   ├── Card.tsx               # Glass card container
│   │   ├── Input.tsx              # Form input
│   │   ├── Modal.tsx              # Modal dialog
│   │   ├── Badge.tsx              # Label badge
│   │   ├── LoadingSkeleton.tsx    # Loading state
│   │   ├── StatusIndicator.tsx    # Status dot
│   │   └── ThreatMeter.tsx        # Progress meter
│   │
│   ├── layouts/
│   │   ├── Navigation.tsx         # Top navigation bar
│   │   ├── ProtectedLayout.tsx    # Protected page wrapper
│   │   └── AuthLayout.tsx         # Auth page wrapper
│   │
│   ├── animations/
│   │   ├── KpIndexChart.tsx       # Area chart
│   │   ├── TemperatureChart.tsx   # Line chart
│   │   └── LaunchFrequencyChart.tsx # Bar chart
│   │
│   └── index.ts                   # Component exports
│
├── features/
│   ├── auth/
│   │   └── AuthForm.tsx           # Login/register form
│   │
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx    # Header section
│   │   ├── MissionsGrid.tsx       # Missions cards
│   │   ├── NEOGrid.tsx            # Asteroid tracking
│   │   ├── SpaceWeatherWidget.tsx # Space weather
│   │   ├── SatelliteTracker.tsx   # ISS tracker
│   │   ├── MarsWeatherWidget.tsx  # Mars data
│   │   └── ImpactAlertsWidget.tsx # Alerts
│   │
│   └── missions/                  # Future mission features
│
├── hooks/
│   ├── useAuth.ts                 # Authentication hooks
│   └── index.ts                   # Exports
│
├── services/
│   ├── dashboardService.ts        # API calls for dashboard
│   └── index.ts                   # Exports
│
├── store/
│   ├── authStore.ts               # Auth state (Zustand)
│   ├── dashboardStore.ts          # Dashboard state
│   ├── alertsStore.ts             # Alerts state
│   └── index.ts                   # Exports
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts              # Firebase initialization
│   │   └── auth.ts                # Auth service methods
│   └── axios.ts                   # Axios instance with interceptors
│
├── utils/
│   └── helpers.ts                 # Utility functions
│
├── types/
│   └── index.ts                   # TypeScript interfaces
│
├── globals.css                    # Global styles
├── middleware.ts                  # Next.js middleware
└── providers.tsx                  # Root providers
```

---

## Component Architecture

### Component Types

#### 1. **Presentational Components** (UI only)
```typescript
// Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  return <button>{children}</button>;
};
```

#### 2. **Container Components** (Business logic)
```typescript
// MissionsGrid.tsx
const MissionsGrid: React.FC<MissionsGridProps> = ({ missions, onSelect }) => {
  const [filter, setFilter] = useState('');
  
  return <div>{/* Render missions */}</div>;
};
```

#### 3. **Page Components** (Route handlers)
```typescript
// app/(protected)/dashboard/page.tsx
export default function DashboardPage() {
  const { data } = useDashboardStore();
  return <ProtectedLayout>{/* Content */}</ProtectedLayout>;
}
```

### Data Flow

```
User Action
    ↓
Component Handler
    ↓
Zustand Store Updated
    ↓
Component Re-renders
    ↓
API Call (Axios)
    ↓
Firebase Auth Check (Interceptor)
    ↓
Backend Response
    ↓
Store Updated
    ↓
UI Updates
```

---

## State Management

### Zustand Stores

#### Auth Store
```typescript
const { user, isAuthenticated, setUser } = useAuthStore();
```

#### Dashboard Store
```typescript
const { data, loading, setData } = useDashboardStore();
```

#### Alerts Store
```typescript
const { alerts, addAlert, removeAlert } = useAlertsStore();
```

---

## API Integration

### Service Layer Pattern

```typescript
// services/dashboardService.ts
export const dashboardService = {
  async getMissions() {
    return apiClient.get('/missions');
  },
};
```

### Usage in Components

```typescript
// In useEffect or event handler
const data = await dashboardService.getMissions();
setData(data);
```

### Error Handling

```typescript
try {
  const data = await dashboardService.getMissions();
  setData(data);
} catch (error) {
  toast.error('Failed to load data');
}
```

---

## Styling System

### Tailwind Configuration

```typescript
// tailwind.config.ts
theme: {
  colors: {
    background: '#0B0F1A',        // Dark navy
    'accent-cyan': '#00D9FF',     // Bright cyan
    'accent-purple': '#B24BFF',   // Bright purple
    'accent-deep-blue': '#0066FF', // Deep blue
    'accent-danger': '#FF3B3B',   // Red (danger only)
  },
}
```

### Custom Classes

```css
/* globals.css */
.glass {
  @apply bg-card-bg backdrop-blur-glass border border-white/10 rounded-2xl;
}

.glow-cyan {
  @apply shadow-glow-cyan;
}
```

### Usage

```typescript
// Component
<div className="glass glow-cyan">
  Glassmorphism card with glow
</div>
```

---

## Authentication Flow

```
User Visits /auth
    ↓
AuthForm Component Renders
    ↓
User Enters Credentials
    ↓
Submit → useLogin() hook
    ↓
Firebase Auth API Call
    ↓
Success → useAuthStore.setUser()
    ↓
Redirect to /dashboard
    ↓
middleware.ts Checks Auth Token
    ↓
Allow Access → Dashboard Loads
```

### Protected Routes

```typescript
// middleware.ts
const protectedPaths = ['/dashboard', '/mission', '/solar-view'];

if (isProtectedPath && !token) {
  return NextResponse.redirect(new URL('/auth', request.url));
}
```

---

## Animation Patterns

### Page Transitions
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Hover Effects
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

### Continuous Animations
```typescript
<motion.div
  animate={{
    boxShadow: ['0 0 0 0 rgba(0,217,255,0.7)', '0 0 0 10px rgba(0,217,255,0)'],
  }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

---

## Performance Tips

### 1. Code Splitting
```typescript
const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <LoadingSkeleton />,
});
```

### 2. Memoization
```typescript
const MemoizedCard = React.memo(Card);

const filtered = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);
```

### 3. Image Optimization
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

---

## Testing Strategy

### Unit Tests (Jest)
```typescript
// components/common/Button.test.tsx
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument();
  });
});
```

### Integration Tests (Cypress)
```typescript
// cypress/e2e/dashboard.cy.ts
describe('Dashboard', () => {
  it('loads and displays missions', () => {
    cy.visit('/dashboard');
    cy.contains('Upcoming Missions').should('be.visible');
  });
});
```

---

## Future Enhancements

1. **Real-time Updates**
   - WebSocket integration for live data
   - React Query for caching

2. **Advanced Analytics**
   - Mixpanel or Segment integration
   - User behavior tracking

3. **Additional Pages**
   - User profile/settings
   - Mission bookmarks
   - Custom alerts

4. **Performance**
   - Image CDN (Cloudinary)
   - Database caching (Redis)
   - Service workers for offline

5. **Features**
   - Dark/light theme toggle
   - Multi-language support
   - Mobile app (React Native)

---

## Debugging

### Browser DevTools
- Network tab: Check API calls
- Console: TypeScript/runtime errors
- Performance: Identify bottlenecks

### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229
    }
  ]
}
```

### Logging Best Practices
```typescript
// Good
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info', data);
}

// Bad - Never log sensitive data
console.log('Token:', authToken);
```

---

## Code Style

### TypeScript First
- Always type function parameters
- Export types from components
- Avoid `any` types

### Component Organization
```typescript
// Imports
import React from 'react';
import { motion } from 'framer-motion';

// Type definitions
interface Props {
  title: string;
}

// Component
const Component: React.FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};

// Export
export default Component;
```

### Naming Conventions
- Components: PascalCase (`Button.tsx`)
- Functions: camelCase (`handleClick()`)
- Constants: UPPER_SNAKE_CASE (`API_KEY`)
- CSS classes: lowercase-with-dashes (`.mission-card`)

---

## Contributing Guidelines

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/name`
5. Create Pull Request

---

## Maintenance

### Regular Updates
```bash
# Check for outdated packages
npm outdated

# Update packages safely
npm update

# Major version updates
npm install next@latest react@latest
```

### Security Audits
```bash
npm audit
npm audit fix
```

---

**Last Updated:** February 14, 2026

