# Research: Digital Year-View Calendar

**Date**: 2026-01-13
**Feature**: 001-year-calendar

## Purpose

Research technical decisions, best practices, and integration patterns for building a Next.js web app with Firebase Auth, Firestore, and Google Calendar API integration.

## Research Areas

### 1. Firebase Authentication with Google Provider

**Decision**: Use Firebase Authentication with Google OAuth provider

**Rationale**:
- Mandated by project constitution (Firebase for all backend services)
- Simplifies OAuth flow - Firebase handles token management
- Automatic session persistence across browser sessions
- Built-in security with Firebase Auth SDK
- Seamless integration with Firestore security rules

**Implementation Approach**:
- Use `signInWithPopup(auth, googleProvider)` for Google sign-in
- Request Google Calendar API scopes during authentication: `https://www.googleapis.com/auth/calendar.readonly`
- Store Google access token for Calendar API calls
- Use `onAuthStateChanged` listener for auth state management

**Best Practices**:
- Use Firebase Auth emulator for local development
- Implement proper error handling for blocked popups
- Provide fallback to `signInWithRedirect` for mobile browsers
- Store minimal user data - rely on Firebase Auth for user info

**Alternatives Considered**:
- Direct Google OAuth 2.0: Rejected - more complex token management, doesn't align with Firebase-first constitution
- Third-party auth libraries: Rejected - adds unnecessary abstraction layer over Firebase Auth

---

### 2. Google Calendar API Integration

**Decision**: Use Google APIs Client Library (@google-cloud/calendar or gapi client) with OAuth tokens from Firebase Auth

**Rationale**:
- Official Google library provides type-safe API access
- Handles API quotas, rate limiting, and retries
- Supports batch requests for fetching multiple calendars
- Well-documented with TypeScript support

**Implementation Approach**:
- Client-side API calls (not server-side) to avoid CORS issues
- Use access token from Firebase Auth credentials
- Implement calendar list fetch: `calendar.calendarList.list()`
- Implement events fetch: `calendar.events.list()` with time range filters
- Filter events by year (timeMin, timeMax parameters)
- Handle recurring events expansion on client side

**Best Practices**:
- Respect API quota limits (10,000 requests/day default)
- Implement exponential backoff for rate limit errors
- Cache calendar list in component state (doesn't change often)
- Fetch events for current year on load, lazy-load other years
- Use `singleEvents: true` to expand recurring events
- Handle timezone conversion with date-fns or dayjs

**API Quota Management**:
- One request per calendar per year (optimized with date ranges)
- For 10 calendars × 1 year = 10 requests per load
- Should stay well within daily quota for personal use

**Alternatives Considered**:
- Server-side API calls: Rejected - adds unnecessary backend complexity for client-only app
- Third-party calendar libraries: Rejected - unnecessary abstraction, less control

---

### 3. Firestore NoSQL Schema for User Preferences

**Decision**: Store user preferences in Firestore using user UID as document ID

**Rationale**:
- NoSQL document structure perfect for user-specific settings
- Fast reads/writes for preference updates
- Real-time sync capabilities (optional future enhancement)
- Security rules can restrict access to user's own document

**Schema Design**:

```
users/{userId}/
  └── preferences (document)
      ├── visibleCalendars: string[]     # Array of calendar IDs
      ├── selectedYear: number           # Currently viewing year
      ├── defaultView: string            # 'year' (future: 'month', 'week')
      ├── lastUpdated: timestamp
      └── calendarColors: map<string, string>  # Optional custom colors
```

**Implementation Approach**:
- Document path: `users/{firebaseAuthUID}/preferences`
- Use `getDoc()` to fetch preferences on auth
- Use `setDoc()` with merge option to update preferences
- Provide sensible defaults if document doesn't exist

**Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/preferences {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Best Practices**:
- Use Firestore emulator for local development
- Implement optimistic UI updates before Firestore write
- Handle offline scenarios with local state fallback
- Keep document size small (well under 1MB limit)

**Alternatives Considered**:
- LocalStorage only: Rejected - doesn't persist across devices
- Relational database: Rejected - overkill for simple key-value preferences, not mandated by constitution

---

### 4. Year-View Grid Layout with Bootstrap

**Decision**: Use Bootstrap 5 grid system with CSS Grid for year layout

**Visual Reference**: Design inspired by `calendar.webp` - wall calendar showing all 12 months simultaneously

**Rationale**:
- Bootstrap mandated by constitution for styling
- Bootstrap grid handles responsive breakpoints
- CSS Grid perfect for calendar grid structure (7 columns for weekdays)
- Minimal custom CSS needed
- Reference design shows clear, professional year-at-a-glance layout

**Implementation Approach**:
- Container: Bootstrap `.container-fluid` for full-width
- Month grid: 3×4 grid for 12 months using Bootstrap row/col system (`.col-lg-3` for 4 per row)
- Day cells: CSS Grid within each month (7 columns for weekdays, ~5-6 rows for weeks)
- Each day cell contains day number and space for event items
- Responsive breakpoints:
  - Desktop (≥992px): 3-4 months per row for optimal year-at-a-glance viewing
  - Tablet (≥768px): 2 months per row
  - Mobile (<768px): 1 month per row (vertical scroll)

**Layout Strategy**:
```html
<div className="container-fluid">
  <div className="row">
    {months.map(month => (
      <div className="col-lg-3 col-md-6 col-12">
        <MonthGrid month={month} />
      </div>
    ))}
  </div>
</div>
```

**Best Practices**:
- Use Bootstrap utilities for spacing (p-*, m-*, g-*)
- Leverage Bootstrap responsive display classes
- Keep day cells accessible (proper ARIA labels)
- Use Bootstrap cards for event detail modal
- Maintain minimum click target size (44x44px) for mobile

**Performance Considerations**:
- Virtualization not needed for 365 cells (reasonable DOM size)
- Memoize month components to prevent unnecessary re-renders
- Use `key` prop properly for event lists

**Alternatives Considered**:
- Pure CSS Grid without Bootstrap: Rejected - violates constitution requirement
- Tailwind CSS: Rejected - Bootstrap mandated by constitution
- Full-Calendar library: Rejected - doesn't provide year view, unnecessary dependency

---

### 5. Build Tool: Vite vs Create React App

**Decision**: Use Vite as build tool and dev server

**Rationale**:
- Vite provides instant server start with native ESM
- Faster hot module replacement (HMR) than CRA
- Built-in TypeScript support without configuration
- Optimized production builds with Rollup
- Better developer experience and performance

**Implementation Approach**:
- Single page: `src/App.tsx` (main component with conditional rendering)
- Entry point: `src/main.tsx` (ReactDOM.render)
- HTML template: `public/index.html`
- Environment variables via `.env.local` (VITE_ prefix)
- Bootstrap CSS imported in main.tsx or globals.css

**Best Practices**:
- Use Vite's fast refresh for development
- Leverage tree-shaking for optimal bundle size
- Use dynamic imports for code splitting if needed
- Configure path aliases in vite.config.ts

**Alternatives Considered**:
- Create React App: Rejected - slower build times, outdated tooling
- Next.js: Rejected - unnecessary complexity for client-only app
- Parcel/Webpack: Rejected - Vite provides better DX for modern React

---

### 6. State Management Strategy

**Decision**: Use React Context + hooks for global state (no Redux/Zustand)

**Rationale**:
- Application state is simple (auth, preferences, events)
- Context sufficient for auth state sharing
- Custom hooks for data fetching logic
- Aligns with simplicity principle (avoid unnecessary dependencies)

**Implementation Approach**:
- `AuthProvider` wrapping entire app in `App.tsx`
- `useAuth` hook for Firebase Auth state
- `useCalendarEvents` hook for fetching/caching events
- `useUserPreferences` hook for Firestore preferences
- Local component state for UI (modal open/closed, selected event)

**Best Practices**:
- Split contexts by concern (auth separate from calendar data)
- Use React Query or SWR if caching becomes complex (future optimization)
- Wrap app with providers in main component hierarchy

**Alternatives Considered**:
- Redux: Rejected - overkill for this app, violates simplicity principle
- Zustand/Jotai: Rejected - unnecessary third-party dependency
- React Query: Deferred - start simple, add if needed

---

### 7. TypeScript Type Definitions

**Decision**: Define strict TypeScript interfaces for all data structures

**Rationale**:
- Type safety prevents runtime errors
- Better IDE autocomplete and documentation
- Catches integration issues at compile time
- Aligns with Next.js best practices

**Key Type Definitions Needed**:
```typescript
// Firebase Auth
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Google Calendar
interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  attendees?: Array<{ email: string }>;
  recurrence?: string[];
  calendarId: string;
}

interface Calendar {
  id: string;
  summary: string;
  backgroundColor: string;
  primary?: boolean;
}

// Firestore
interface UserPreferences {
  visibleCalendars: string[];
  selectedYear: number;
  defaultView: string;
  lastUpdated: Timestamp;
  calendarColors?: Record<string, string>;
}
```

---

### 8. Testing Strategy

**Decision**: Vitest + React Testing Library for unit tests only

**Rationale**:
- Vitest is faster than Jest and better integrated with Vite-based tools
- Native ESM support and TypeScript compatibility
- React Testing Library encourages accessible, user-focused tests
- Aligns with TDD principle in constitution
- Aligns with simplicity principle (no E2E framework overhead)

**Testing Approach**:
- Unit tests only: Individual components (DayCell, EventItem, MonthGrid, etc.)
- Component tests: Full YearView with mock data
- Hook tests: Custom hooks (useAuth, useCalendarEvents, useUserPreferences)
- Utility tests: Date formatting, calendar calculations
- Use Firebase emulators for testing (Auth + Firestore)
- Mock Google Calendar API in tests with MSW (Mock Service Worker)

**Test Coverage Goals**:
- 80%+ coverage for business logic
- All critical components have corresponding unit tests
- Critical paths (auth, event display, preference storage) fully tested

**No E2E Testing**:
- Manual testing for full user flows
- Focus on comprehensive unit test coverage instead
- Simplifies CI/CD pipeline

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Authentication | Firebase Auth (Google provider) | Constitution requirement, simplifies OAuth |
| Calendar API | Google APIs Client Library | Official, well-supported, type-safe |
| User Data Storage | Firestore (NoSQL documents) | Constitution requirement, perfect for preferences |
| Styling | Bootstrap 5 + CSS Grid | Constitution requirement, responsive grid system |
| Framework | React (client-side SPA) | Constitution requirement, simple client-only app |
| Build Tool | Vite | Fast dev server, optimized builds, modern tooling |
| State Management | React Context + hooks | Simple, no external dependencies needed |
| Types | TypeScript (strict mode) | Type safety, better DX |
| Testing | Vitest + React Testing Library | Fast unit testing, no E2E overhead |

## Next Steps

Proceed to Phase 1:
- Create data-model.md (Firestore schema details)
- Create contracts/firestore-schema.md (security rules)
- Create quickstart.md (setup instructions)
