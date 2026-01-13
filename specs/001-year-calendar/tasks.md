---

description: "Task list for Digital Year-View Calendar feature"
---

# Tasks: Digital Year-View Calendar

**Input**: Design documents from `/specs/001-year-calendar/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Visual Design Reference**: `calendar.webp` (wall calendar layout showing all 12 months)

**Tests**: Following TDD (Test-Driven Development) - unit tests will be written BEFORE implementation using Vitest + React Testing Library.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React + Vite SPA**: `src/components/`, `src/lib/`, `src/hooks/`, `src/types/`, `src/styles/`
- **Main files**: `src/App.tsx` (main component), `src/main.tsx` (entry point), `public/index.html`
- **Tests**: `__tests__/` at repository root
- Paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Vite + React + TypeScript project in repository root (npm create vite@latest)
- [ ] T002 Install core dependencies: firebase, @react-oauth/google, gapi-script, react-router-dom, bootstrap, react-bootstrap, date-fns
- [ ] T003 Install dev dependencies: vitest, @vitest/ui, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, msw, @vitejs/plugin-react
- [ ] T004 [P] Create vitest.config.ts with jsdom environment and path aliases (@/)
- [ ] T005 [P] Create vitest.setup.ts with testing-library cleanup
- [ ] T006 [P] Create .env.local with VITE_ prefixed Firebase and Google OAuth environment variables
- [ ] T007 [P] Create firebase.json for Firestore and Hosting configuration (public: dist, rewrites for SPA)
- [ ] T008 [P] Create firestore.rules with user-specific security rules
- [ ] T009 [P] Create firestore.indexes.json (empty array for MVP)
- [ ] T010 [P] Update package.json scripts: dev (vite), build (tsc && vite build), preview, test, test:watch, test:ui, test:coverage
- [ ] T011 [P] Update tsconfig.json with strict mode and path aliases (@/*)
- [ ] T012 [P] Update vite.config.ts with path aliases and React plugin
- [ ] T013 Create src/ directory structure: components/, lib/, hooks/, types/, styles/
- [ ] T014 Create __tests__/ directory structure: components/, hooks/, lib/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T015 Create TypeScript types in src/types/user.ts (FirebaseUser interface)
- [ ] T016 [P] Create TypeScript types in src/types/calendar.ts (GoogleCalendarEvent, GoogleCalendar, MonthViewModel, DayViewModel)
- [ ] T017 [P] Create TypeScript types in src/types/firestore.ts (UserPreferences interface)
- [ ] T018 Create Firebase config in src/lib/firebase/config.ts (initialize Firebase app)
- [ ] T019 Create Firebase Auth helpers in src/lib/firebase/auth.ts (signIn, signOut, onAuthStateChanged wrapper)
- [ ] T020 [P] Create Firestore helpers in src/lib/firebase/firestore.ts (getUserPreferences, saveUserPreferences, initializeUserPreferences)
- [ ] T021 Create Google Calendar API client in src/lib/google-calendar/api.ts (fetchCalendarList, fetchEvents functions)
- [ ] T022 [P] Create Google Calendar utilities in src/lib/google-calendar/utils.ts (date parsing, event grouping, timezone conversion)
- [ ] T023 [P] Create general utilities in src/lib/utils.ts (date formatting helpers)
- [ ] T024 Create AuthProvider context component in src/components/auth/AuthProvider.tsx
- [ ] T025 Create useAuth hook in src/hooks/useAuth.ts (wraps AuthProvider context)
- [ ] T026 Create main entry point in src/main.tsx (Bootstrap CSS import, ReactDOM render with AuthProvider wrapper)
- [ ] T027 Create global CSS in src/styles/globals.css (custom overrides, fonts)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Full Year of Google Calendar Events (Priority: P1) 🎯 MVP

**Goal**: Users can authenticate with Google and see a complete year view with their Google Calendar events

**Independent Test**: User can sign in, see 12 months displayed, and view their events on the correct dates

### Unit Tests for User Story 1 (TDD - Write FIRST) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T028 [P] [US1] Unit test for GoogleSignIn component in __tests__/components/auth/GoogleSignIn.test.tsx
- [ ] T029 [P] [US1] Unit test for useAuth hook in __tests__/hooks/useAuth.test.tsx
- [ ] T030 [P] [US1] Unit test for useCalendarEvents hook in __tests__/hooks/useCalendarEvents.test.tsx
- [ ] T031 [P] [US1] Unit test for YearView component in __tests__/components/calendar/YearView.test.tsx
- [ ] T032 [P] [US1] Unit test for MonthGrid component in __tests__/components/calendar/MonthGrid.test.tsx
- [ ] T033 [P] [US1] Unit test for DayCell component in __tests__/components/calendar/DayCell.test.tsx
- [ ] T034 [P] [US1] Unit test for EventItem component in __tests__/components/calendar/EventItem.test.tsx
- [ ] T035 [P] [US1] Unit test for Firebase auth helpers in __tests__/lib/firebase/auth.test.ts
- [ ] T036 [P] [US1] Unit test for Google Calendar API client in __tests__/lib/google-calendar/api.test.ts

### Implementation for User Story 1

- [ ] T037 [P] [US1] Create GoogleSignIn component in src/components/auth/GoogleSignIn.tsx (Firebase Auth Google sign-in button)
- [ ] T038 [P] [US1] Create LoadingSpinner component in src/components/ui/LoadingSpinner.tsx (Bootstrap spinner)
- [ ] T039 [P] [US1] Create demo calendar data generator in src/lib/utils.ts (generates example events for demo mode)
- [ ] T040 [P] [US1] Create LoginBanner component in src/components/auth/LoginBanner.tsx (Bootstrap alert with GoogleSignIn button, dismissible)
- [ ] T041 [US1] Create main App component in src/App.tsx (single page, conditionally shows demo calendar with LoginBanner when not authenticated OR real YearView when authenticated)
- [ ] T042 [US1] Create useCalendarEvents hook in src/hooks/useCalendarEvents.ts (fetches and manages calendar events for a year, uses demo data when not authenticated)
- [ ] T043 [US1] Create EventItem component in src/components/calendar/EventItem.tsx (displays single event title with color)
- [ ] T044 [US1] Create DayCell component in src/components/calendar/DayCell.tsx (renders day number and event list)
- [ ] T045 [US1] Create MonthGrid component in src/components/calendar/MonthGrid.tsx (7x~5 grid for one month with day cells, weekday headers, inspired by calendar.webp design)
- [ ] T046 [US1] Create YearView component in src/components/calendar/YearView.tsx (Bootstrap grid 3x4 layout with 12 MonthGrid components, follows calendar.webp year-at-a-glance approach)
- [ ] T047 [US1] Verify all US1 tests pass and feature is working

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate and Interact with Events (Priority: P2)

**Goal**: Users can click events for details and navigate between years

**Independent Test**: User can click an event to see details modal, close it, and switch years

### Unit Tests for User Story 2 (TDD - Write FIRST) ⚠️

- [ ] T048 [P] [US2] Unit test for EventDetailModal component in __tests__/components/calendar/EventDetailModal.test.tsx
- [ ] T049 [P] [US2] Unit test for YearNavigation component in __tests__/components/calendar/YearNavigation.test.tsx
- [ ] T050 [P] [US2] Unit test for useUserPreferences hook in __tests__/hooks/useUserPreferences.test.tsx
- [ ] T051 [P] [US2] Unit test for Firestore helpers in __tests__/lib/firebase/firestore.test.ts

### Implementation for User Story 2

- [ ] T052 [US2] Create useUserPreferences hook in src/hooks/useUserPreferences.ts (fetch/save preferences from Firestore)
- [ ] T053 [US2] Create EventDetailModal component in src/components/calendar/EventDetailModal.tsx (Bootstrap modal with event details)
- [ ] T054 [US2] Create YearNavigation component in src/components/calendar/YearNavigation.tsx (year selector with prev/next buttons and manual refresh button)
- [ ] T055 [US2] Update DayCell component to handle event click and open modal
- [ ] T056 [US2] Update YearView component to integrate EventDetailModal and YearNavigation
- [ ] T057 [US2] Update App component to persist selected year to Firestore via useUserPreferences
- [ ] T058 [US2] Add manual refresh button functionality to YearNavigation component (refetches calendar events on demand)
- [ ] T059 [US2] Add logic to fetch events for new year when year changes
- [ ] T060 [US2] Handle multiple events per day with "+N more" indicator in DayCell
- [ ] T061 [US2] Verify all US2 tests pass and features work independently

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Visual Organization and Filtering (Priority: P3)

**Goal**: Users can see calendar-specific colors and toggle calendar visibility

**Independent Test**: User can see colored events and use sidebar to show/hide specific calendars

### Unit Tests for User Story 3 (TDD - Write FIRST) ⚠️

- [ ] T062 [P] [US3] Unit test for CalendarSidebar component in __tests__/components/ui/CalendarSidebar.test.tsx
- [ ] T063 [P] [US3] Unit test for calendar color utilities in __tests__/lib/google-calendar/utils.test.ts

### Implementation for User Story 3

- [ ] T064 [P] [US3] Create CalendarSidebar component in src/components/ui/CalendarSidebar.tsx (list of calendars with checkboxes)
- [ ] T065 [US3] Update EventItem component to use calendar color from Google Calendar API
- [ ] T066 [US3] Update DayCell component to apply visual density indicators based on event count
- [ ] T067 [US3] Update YearView component to integrate CalendarSidebar
- [ ] T068 [US3] Update useCalendarEvents hook to filter events by visibleCalendars preference
- [ ] T069 [US3] Update useUserPreferences hook to save visibleCalendars array to Firestore
- [ ] T070 [US3] Add logic to toggle calendar visibility and update Firestore
- [ ] T071 [US3] Verify all US3 tests pass and all user stories work independently

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T072 [P] Add error boundary component in src/components/ErrorBoundary.tsx for graceful error handling
- [ ] T073 [P] Wrap App component with ErrorBoundary in src/main.tsx
- [ ] T074 [P] Create README.md with setup instructions and Firebase config steps
- [ ] T075 [P] Add responsive CSS adjustments for tablet view (2 months per row)
- [ ] T076 [P] Add responsive CSS adjustments for mobile view (1 month per row)
- [ ] T077 [P] Optimize event rendering for 1000+ events (memoization in MonthGrid)
- [ ] T078 [P] Add edge case handling for empty calendars (no events message)
- [ ] T079 [P] Add edge case handling for Google Calendar API errors (user-friendly messages)
- [ ] T080 [P] Add edge case handling for offline scenarios (show cached data message)
- [ ] T081 [P] Add ARIA labels and keyboard navigation for accessibility
- [ ] T082 [P] Run Vitest coverage report and ensure 80%+ coverage
- [ ] T083 Verify quickstart.md setup instructions work end-to-end
- [ ] T084 Final manual testing of all three user stories together

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 components but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1/US2 components but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Components can be built in parallel if marked [P]
- Integration tasks depend on component completion
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T004-T014) can run in parallel
- All Foundational type definitions (T015-T017) can run in parallel
- All Foundational lib files (T020-T023) can run in parallel (after types)
- All US1 tests (T028-T036) can run in parallel
- All US1 components (T037-T040) can run in parallel (after tests)
- All US2 tests (T048-T051) can run in parallel
- All US3 tests (T062-T063) can run in parallel
- All Polish tasks (T072-T082) can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Write all tests in parallel (TDD - these should FAIL initially):
Task: "Unit test for GoogleSignIn component"
Task: "Unit test for useAuth hook"
Task: "Unit test for YearView component"
Task: "Unit test for MonthGrid component"
Task: "Unit test for DayCell component"

# Then implement components in parallel (tests should now PASS):
Task: "Create GoogleSignIn component"
Task: "Create EventItem component"
Task: "Create DayCell component"
Task: "Create MonthGrid component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (including tests)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (auth + year view)
   - Developer B: User Story 2 (event details + navigation)
   - Developer C: User Story 3 (colors + filtering)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD workflow**: Write tests first, watch them fail, implement to make them pass, refactor
- Vitest watch mode recommended: `npm run test:watch`
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
