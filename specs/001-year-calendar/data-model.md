# Data Model: Digital Year-View Calendar

**Date**: 2026-01-13
**Feature**: 001-year-calendar

## Overview

This document defines the data structures used in the year-view calendar application. The app uses three primary data sources:
1. **Firebase Auth** - User authentication and identity
2. **Firestore** - User preferences (NoSQL documents)
3. **Google Calendar API** - Calendar events (read-only, not persisted)

## Firebase Authentication

### User Identity

Provided by Firebase Auth after Google sign-in:

```typescript
interface FirebaseUser {
  uid: string;              // Unique Firebase user ID (used as Firestore document key)
  email: string | null;     // User's email from Google
  displayName: string | null; // User's full name from Google
  photoURL: string | null;  // User's profile photo URL
  providerId: string;       // 'google.com'
}
```

**Usage**:
- `uid` used as document ID in Firestore (`users/{uid}/preferences`)
- All other fields for display purposes only
- Not stored in Firestore (managed by Firebase Auth)

---

## Firestore NoSQL Schema

### Collection: `users/{userId}/preferences`

**Document Structure**:

```typescript
interface UserPreferences {
  visibleCalendars: string[];           // Array of Google Calendar IDs to display
  selectedYear: number;                 // Currently viewing year (e.g., 2026)
  defaultView: 'year';                  // View type (only 'year' for MVP)
  lastUpdated: FirebaseTimestamp;       // Last preference update timestamp
  calendarColors?: Record<string, string>; // Optional: Custom color overrides (calendarId -> hex color)
}
```

**Field Details**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `visibleCalendars` | `string[]` | Yes | Array of calendar IDs that should be shown | `['primary', 'work@example.com']` |
| `selectedYear` | `number` | Yes | Year currently being viewed | `2026` |
| `defaultView` | `'year'` | Yes | View mode (fixed to 'year' for MVP) | `'year'` |
| `lastUpdated` | `Timestamp` | Yes | When preferences were last modified | Firestore timestamp |
| `calendarColors` | `Record<string, string>` | No | Custom color mappings (optional override of Google Calendar colors) | `{ 'primary': '#FF5733' }` |

**Document Path**: `users/{firebaseAuthUID}/preferences`

**Example Document**:
```json
{
  "visibleCalendars": ["primary", "holidays@group.calendar.google.com"],
  "selectedYear": 2026,
  "defaultView": "year",
  "lastUpdated": {
    "_seconds": 1705161600,
    "_nanoseconds": 0
  },
  "calendarColors": {
    "primary": "#1E90FF"
  }
}
```

**Validation Rules**:
- `visibleCalendars`: Must be an array (can be empty)
- `selectedYear`: Must be a valid 4-digit year (1900-2100)
- `defaultView`: Must be 'year'
- `lastUpdated`: Automatically set by Firestore
- `calendarColors`: Optional map of calendar ID to hex color strings

**Defaults** (if document doesn't exist):
```typescript
const defaultPreferences: UserPreferences = {
  visibleCalendars: [],  // Will be populated with all calendars on first load
  selectedYear: new Date().getFullYear(),
  defaultView: 'year',
  lastUpdated: Timestamp.now(),
};
```

---

## Google Calendar API Data

*Note: This data is fetched from Google Calendar API and NOT stored in Firestore. Events are re-fetched when year changes.*

### Calendar List

**API Endpoint**: `GET https://www.googleapis.com/calendar/v3/users/me/calendarList`

```typescript
interface GoogleCalendar {
  id: string;                    // Calendar ID (e.g., 'primary', 'email@domain.com')
  summary: string;               // Calendar name (e.g., 'Personal', 'Work')
  backgroundColor: string;       // Hex color (e.g., '#9fe1e7')
  foregroundColor: string;       // Text color for events
  primary?: boolean;             // True if this is the user's primary calendar
  accessRole: string;            // 'owner', 'reader', 'writer', etc.
}
```

**Usage**:
- Fetched once on authentication
- Cached in component state for session
- Used to populate calendar toggle list in sidebar
- `id` values stored in Firestore `visibleCalendars` array

---

### Calendar Events

**API Endpoint**: `GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events`

```typescript
interface GoogleCalendarEvent {
  id: string;                    // Unique event ID
  summary: string;               // Event title
  description?: string;          // Event description (optional)
  location?: string;             // Event location (optional)

  // Start date/time (one of these will be present)
  start: {
    dateTime?: string;           // ISO 8601 for timed events (e.g., '2026-03-15T14:00:00-07:00')
    date?: string;               // Date only for all-day events (e.g., '2026-03-15')
    timeZone?: string;           // Timezone (e.g., 'America/Los_Angeles')
  };

  // End date/time (one of these will be present)
  end: {
    dateTime?: string;           // ISO 8601 for timed events
    date?: string;               // Date only for all-day events
    timeZone?: string;           // Timezone
  };

  attendees?: Array<{
    email: string;               // Attendee email
    displayName?: string;        // Attendee name
    responseStatus?: string;     // 'accepted', 'declined', 'tentative', 'needsAction'
  }>;

  recurrence?: string[];         // RRULE for recurring events (if not expanded)
  recurringEventId?: string;     // ID of recurring event parent

  status: string;                // 'confirmed', 'tentative', 'cancelled'
  visibility?: string;           // 'default', 'public', 'private', 'confidential'

  htmlLink: string;              // Link to event in Google Calendar UI
  calendarId: string;            // Which calendar this event belongs to (added by us)
}
```

**Event Type Detection**:
```typescript
// All-day event: has `start.date` instead of `start.dateTime`
const isAllDayEvent = event.start.date !== undefined;

// Multi-day event: end date > start date
const isMultiDayEvent = event.end.date > event.start.date;

// Recurring event: has `recurrence` or `recurringEventId`
const isRecurring = event.recurrence !== undefined || event.recurringEventId !== undefined;
```

**Fetching Strategy**:
- Fetch events for currently selected year only
- Use `timeMin` and `timeMax` to filter by year:
  - `timeMin`: `{selectedYear}-01-01T00:00:00Z`
  - `timeMax`: `{selectedYear+1}-01-01T00:00:00Z`
- Use `singleEvents=true` to expand recurring events
- Fetch events for each visible calendar (parallel requests)

---

## Client-Side View Models

*These are TypeScript interfaces for component state - not persisted anywhere*

### YearViewState

```typescript
interface YearViewState {
  year: number;                          // Currently viewing year
  calendars: GoogleCalendar[];           // All available calendars
  visibleCalendarIds: string[];          // IDs of calendars to show
  events: GoogleCalendarEvent[];         // All events for the year
  isLoading: boolean;                    // Loading state
  error: string | null;                  // Error message if any
  selectedEvent: GoogleCalendarEvent | null; // Event shown in detail modal
}
```

### MonthViewModel

```typescript
interface MonthViewModel {
  month: number;                         // 0-11 (JavaScript Date month)
  year: number;
  days: DayViewModel[];                  // Array of 28-31 day objects
}

interface DayViewModel {
  date: Date;
  dayOfMonth: number;                    // 1-31
  isCurrentMonth: boolean;               // False for padding days
  isToday: boolean;
  events: GoogleCalendarEvent[];         // Events on this day
  eventCount: number;                    // Total events (for overflow indicator)
}
```

---

## Data Flow

```
┌─────────────────┐
│  Firebase Auth  │
│                 │
│  Provides:      │
│  - User UID     │
│  - Email        │
│  - Access Token │
└────────┬────────┘
         │
         ├─────────────────────────────┬──────────────────────────────┐
         │                             │                              │
         v                             v                              v
┌────────────────────┐     ┌──────────────────────┐      ┌─────────────────────┐
│  Firestore         │     │  Google Calendar API │      │  Client State       │
│                    │     │                      │      │                     │
│  Store:            │     │  Fetch:              │      │  Hold:              │
│  - User prefs      │     │  - Calendar list     │      │  - Current year     │
│  - Visible cals    │     │  - Events by year    │      │  - UI state         │
│  - Selected year   │     │                      │      │  - Selected event   │
└────────────────────┘     └──────────────────────┘      └─────────────────────┘
```

### Data Operations

**On Authentication (User Sign-In)**:
1. Firebase Auth provides user UID and access token
2. Fetch user preferences from Firestore (`users/{uid}/preferences`)
3. Fetch calendar list from Google Calendar API
4. If preferences exist, use `visibleCalendars` and `selectedYear`
5. If no preferences, create defaults (all calendars visible, current year)
6. Fetch events for selected year from visible calendars
7. Store preferences to Firestore

**On Year Change**:
1. Update local state (`selectedYear`)
2. Fetch events for new year from visible calendars
3. Update Firestore preferences (`selectedYear` and `lastUpdated`)

**On Calendar Toggle (Sidebar)**:
1. Update local state (`visibleCalendarIds`)
2. Filter displayed events by visible calendars
3. Update Firestore preferences (`visibleCalendars` and `lastUpdated`)

**On Sign-Out**:
1. Clear all local state
2. Firebase Auth signs out (automatic session clear)
3. Redirect to login page

---

## Security Considerations

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own preferences
    match /users/{userId}/preferences {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Prevent unauthorized access to other users' data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Data Access Patterns

| Data Source | Access Type | Auth Required | Scope |
|-------------|-------------|---------------|-------|
| Firebase Auth | Read | Yes (own user only) | Current user's identity |
| Firestore Preferences | Read/Write | Yes (own document only) | Current user's preferences |
| Google Calendar API | Read Only | Yes (own calendars only) | User's calendar data via OAuth |

---

## Summary

- **Firebase Auth**: Manages user identity (no custom storage needed)
- **Firestore**: Stores user preferences as NoSQL documents (one doc per user)
- **Google Calendar API**: Source of truth for events (fetched on-demand, not cached)
- **Client State**: Temporary UI state (not persisted)
