# spec-kit-test Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-13

## Active Technologies

- JavaScript/TypeScript with React 18+ and Vite (Node.js 18+ for build tools) (001-year-calendar)
- Firebase Web SDK v9+ (modular) for Authentication and Firestore
- Bootstrap CSS 5.3+ for styling
- Vitest + React Testing Library for unit testing

## Project Structure

```text
/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── calendar/       # Calendar view components
│   │   └── ui/             # Reusable UI components
│   ├── lib/                # Utilities and configs
│   │   ├── firebase/       # Firebase initialization and helpers
│   │   └── google-calendar/ # Google Calendar API client
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global CSS
│   ├── App.tsx             # Main app component
│   └── main.tsx            # React entry point
├── public/                 # Static assets
│   └── index.html          # HTML template
├── __tests__/              # Unit tests (Vitest)
│   ├── components/
│   ├── hooks/
│   └── lib/
├── specs/                  # Feature specifications
│   └── 001-year-calendar/  # Active feature
├── .specify/               # SpecKit configuration
│   └── memory/
│       └── constitution.md
└── firebase.json           # Firebase configuration
```

## Commands

```bash
# Development
npm run dev                  # Start Vite dev server (localhost:5173)
npm run build               # Build for production (tsc && vite build)
npm run preview             # Preview production build locally

# Testing
npm test                    # Run Vitest tests
npm run test:watch          # Run tests in watch mode
npm run test:ui             # Run tests with UI
npm run test:coverage       # Generate coverage report

# Firebase
firebase emulators:start    # Start Firebase emulators
firebase deploy             # Deploy to Firebase Hosting
```

## Code Style

**React/TypeScript**:
- React 18+ with functional components and hooks
- TypeScript strict mode enabled
- Use React Context for global state (AuthProvider)
- Custom hooks for data fetching (useAuth, useCalendarEvents, useUserPreferences)
- Component naming: PascalCase (e.g., `YearView.tsx`)
- Hook naming: camelCase with 'use' prefix (e.g., `useAuth.ts`)

**Firebase**:
- Use modular Firebase SDK v9+ (tree-shakeable imports)
- Client-side SDK only (no server-side Firebase Admin)
- Environment variables use `VITE_` prefix (e.g., `VITE_FIREBASE_API_KEY`)

**Testing**:
- TDD workflow: Write tests BEFORE implementation
- Vitest + React Testing Library
- Unit tests only (no E2E tests)
- Test files in `__tests__/` directory

**Styling**:
- Bootstrap CSS 5.3+ (constitutional requirement)
- Import Bootstrap in `src/main.tsx`
- Custom styles in `src/styles/globals.css`
- Use Bootstrap utility classes where possible

## Architecture Principles

From `.specify/memory/constitution.md`:

1. **Specification-First Development**: All features start with `spec.md` before any code
2. **Test-Driven Development (NON-NEGOTIABLE)**: Tests must be written before implementation
3. **Simplicity & Maintainability**: Choose the simplest solution, avoid premature abstraction

## Active Features

### 001-year-calendar (In Planning)

**Description**: Digital year-view calendar displaying Google Calendar events

**Tech Stack**:
- React 18 + Vite (client-side SPA)
- Firebase Auth (Google provider)
- Firestore (NoSQL) for user preferences
- Google Calendar API (read-only)
- Bootstrap CSS for responsive grid layout

**Status**: Planning complete, ready for implementation (84 tasks defined)

**Key Files**:
- Spec: `specs/001-year-calendar/spec.md`
- Plan: `specs/001-year-calendar/plan.md`
- Tasks: `specs/001-year-calendar/tasks.md`
- Research: `specs/001-year-calendar/research.md`
- Quickstart: `specs/001-year-calendar/quickstart.md`

## Recent Changes

- 2026-01-13: Changed from Next.js to React + Vite for client-side only architecture
- 2026-01-13: Updated to single-page app with demo calendar for unauthenticated users
- 2026-01-13: Added manual refresh functionality and login banner
- 2026-01-13: Established constitutional technology stack (React, Bootstrap, Firebase, Firestore)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
