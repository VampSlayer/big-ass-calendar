# Implementation Plan: Digital Year-View Calendar

**Branch**: `001-year-calendar` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-year-calendar/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a web application that displays all 12 months of a year simultaneously with Google Calendar events integrated. Users authenticate via Firebase Auth (Google provider), view their calendar events in a year-at-a-glance grid layout, and interact with events to see details. User preferences (visible calendars, selected year) are stored in Firestore NoSQL documents for persistence across sessions.

**Visual Design**: The layout is inspired by wall calendar design (see `calendar.webp`) showing all 12 months in a clear grid format with each day cell capable of displaying events.

**Technical Approach**: Client-side React application with Firebase Authentication (web SDK), Firestore for user preferences, Google Calendar API for event data, and Bootstrap CSS for responsive year-view grid layout.

## Technical Context

**Language/Version**: JavaScript/TypeScript with React 18+ (Node.js 18+ for build tools)
**Primary Dependencies**:
  - React 18+ (UI library)
  - React Router (client-side routing)
  - Firebase Web SDK v9+ (Authentication, Firestore - modular SDK)
  - Google APIs Client Library (Calendar API)
  - Bootstrap CSS 5.3+
  - React Bootstrap (optional for components)
  - Vite (build tool and dev server)

**Storage**:
  - Firestore (Native mode - NoSQL) for user preferences
  - No local storage for events (fetched fresh from Google Calendar API)

**Testing**: Vitest + React Testing Library for unit tests only
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) on desktop and tablet devices (1920x1080+ primary, 768px+ secondary)
**Project Type**: Single-Page Application (SPA) - pure client-side with Firebase backend services
**Performance Goals**:
  - Initial page load < 2 seconds
  - Calendar event fetch and display < 3 seconds
  - Year view render 365 days without lag
  - Handle 1000 events/year without performance degradation

**Constraints**:
  - Read-only access to Google Calendar (no event creation/editing)
  - Firebase free tier limits (authentication, Firestore reads/writes)
  - Google Calendar API quota limits (10,000 requests/day default)
  - Must work without local event caching initially

**Scale/Scope**:
  - Single-user personal calendar viewer (not multi-tenant)
  - Support 5+ years of navigation (past and future)
  - Up to 10 calendars per user
  - Up to 1000 events per year per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Specification-First Development
- [x] Feature specification completed and approved ([spec.md](./spec.md))
- [x] All user scenarios defined with acceptance criteria
- [x] Requirements documented before technical planning
- [x] Specification is technology-agnostic (references approach, not implementation)

**Status**: PASS - Specification created and validated before planning phase.

### ✅ II. Test-Driven Development (NON-NEGOTIABLE)
- [x] Testing framework identified (Vitest + React Testing Library for unit tests)
- [ ] Tests will be written before implementation (deferred to implementation phase)
- [ ] Red-Green-Refactor workflow will be enforced during tasks

**Status**: PASS (Planning Phase) - Testing strategy defined. TDD workflow will be enforced during `/speckit.tasks` and implementation phases.

### ✅ III. Simplicity & Maintainability
- [x] Minimal dependencies (Next.js, Firebase SDK, Google Calendar API, Bootstrap)
- [x] No unnecessary abstractions introduced at planning stage
- [x] Each dependency justified by genuine need:
  - Next.js: Required by constitution, provides React framework
  - Firebase SDK: Required by constitution for auth and storage
  - Google Calendar API: Required for core feature (calendar event access)
  - Bootstrap CSS: Required by constitution for styling
- [x] No speculative features beyond current requirements

**Status**: PASS - Simple, focused approach with justified dependencies only.

### ✅ Technology Stack Compliance
- [x] Frontend Framework: React (mandated by constitution) ✅
- [x] Styling: Bootstrap CSS (mandated by constitution) ✅
- [x] Deployment Platform: Firebase (mandated by constitution) ✅
- [x] Database/Storage: Firestore NoSQL (mandated by constitution) ✅
- [x] No alternative frameworks proposed

**Status**: PASS - Full compliance with constitutional technology stack.

### Overall Constitution Compliance

**GATE STATUS**: ✅ **PASS**

All three core principles satisfied. Technology stack fully compliant. No violations to justify. Ready to proceed to Phase 0 (Research).

## Project Structure

### Documentation (this feature)

```text
specs/001-year-calendar/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already created)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── firestore-schema.md
├── checklists/
│   └── requirements.md  # Already created
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
/
├── src/
│   ├── components/             # React components
│   │   ├── auth/
│   │   │   ├── GoogleSignIn.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── LoginBanner.tsx
│   │   ├── calendar/
│   │   │   ├── YearView.tsx          # Main year grid
│   │   │   ├── MonthGrid.tsx         # Individual month
│   │   │   ├── DayCell.tsx           # Day with events
│   │   │   ├── EventItem.tsx         # Event display
│   │   │   ├── EventDetailModal.tsx  # Event popup
│   │   │   └── YearNavigation.tsx    # Year selector
│   │   └── ui/
│   │       ├── CalendarSidebar.tsx   # Calendar toggle list
│   │       └── LoadingSpinner.tsx
│   │
│   ├── lib/                    # Utilities and configs
│   │   ├── firebase/
│   │   │   ├── config.ts      # Firebase initialization
│   │   │   ├── auth.ts        # Auth helpers
│   │   │   └── firestore.ts   # Firestore helpers
│   │   ├── google-calendar/
│   │   │   ├── api.ts         # Google Calendar API client
│   │   │   └── utils.ts       # Calendar data transformations
│   │   └── utils.ts           # General utilities (incl demo data generator)
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCalendarEvents.ts
│   │   └── useUserPreferences.ts
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── calendar.ts
│   │   ├── user.ts
│   │   └── firestore.ts
│   │
│   ├── App.tsx                 # Main app component (single page)
│   ├── main.tsx                # React entry point
│   └── styles/
│       └── globals.css         # Global styles + Bootstrap imports
│
├── public/                     # Static assets
│   ├── index.html              # HTML entry point
│   └── favicon.ico
│
├── __tests__/                  # Unit tests
│   ├── components/
│   ├── hooks/
│   └── lib/
│
├── firebase.json               # Firebase configuration
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore indexes
├── .env.local                  # Environment variables (not committed)
├── vite.config.ts              # Vite configuration
├── vitest.config.ts            # Vitest configuration
├── package.json
├── tsconfig.json
└── README.md
```

**Structure Decision**: Standard React SPA structure with Vite build tool. This is a pure client-side application where:
- Vite handles bundling, dev server, and build optimization
- React provides component-based UI
- Firebase Web SDK (v9 modular) provides authentication and user preference storage
- Google Calendar API provides event data (client-side fetch)
- All source code in `/src` for clarity
- Single-page app with conditional rendering based on auth state
- Unit tests in `/__tests__` following Vitest conventions

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations** - All constitutional requirements satisfied. No complexity justifications needed.
