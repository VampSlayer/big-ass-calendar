# Firestore Schema & Security Rules

**Date**: 2026-01-13
**Feature**: 001-year-calendar

## Firestore Database Configuration

**Mode**: Native mode (NoSQL document database)
**Location**: Choose based on deployment region (e.g., `us-central1`)

---

## Collection Structure

```
/users/{userId}/
  └── preferences (document)
```

### Document: `preferences`

**Full Path**: `/users/{userId}/preferences`

**Schema**:
```typescript
{
  visibleCalendars: string[];          // Array of Google Calendar IDs
  selectedYear: number;                // Currently viewing year (e.g., 2026)
  defaultView: 'year';                 // View type (fixed to 'year' for MVP)
  lastUpdated: Timestamp;              // Firestore server timestamp
  calendarColors?: {                   // Optional custom color overrides
    [calendarId: string]: string;      // calendarId -> hex color
  };
}
```

**Example**:
```json
{
  "visibleCalendars": [
    "primary",
    "holidays@group.calendar.google.com",
    "work@company.com"
  ],
  "selectedYear": 2026,
  "defaultView": "year",
  "lastUpdated": {
    "_seconds": 1705161600,
    "_nanoseconds": 0
  },
  "calendarColors": {
    "primary": "#1E90FF",
    "work@company.com": "#FF5733"
  }
}
```

---

## Firestore Security Rules

**File**: `firestore.rules`

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function hasValidPreferences() {
      return request.resource.data.keys().hasAll(['visibleCalendars', 'selectedYear', 'defaultView', 'lastUpdated'])
        && request.resource.data.visibleCalendars is list
        && request.resource.data.selectedYear is number
        && request.resource.data.selectedYear >= 1900
        && request.resource.data.selectedYear <= 2100
        && request.resource.data.defaultView == 'year';
    }

    // User preferences document
    match /users/{userId}/preferences {
      // Users can only read their own preferences
      allow read: if isOwner(userId);

      // Users can create/update their own preferences with validation
      allow create, update: if isOwner(userId) && hasValidPreferences();

      // Users can delete their own preferences
      allow delete: if isOwner(userId);
    }

    // Prevent access to any other documents in users collection
    match /users/{userId}/{document=**} {
      allow read, write: if false;
    }

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Security Rules Explanation

1. **Authentication Required**: All operations require Firebase Auth
2. **Owner-Only Access**: Users can only access their own `/users/{uid}/preferences` document
3. **Validation Rules**:
   - `visibleCalendars` must be an array
   - `selectedYear` must be a number between 1900-2100
   - `defaultView` must be exactly 'year'
   - All required fields must be present
4. **No Cross-User Access**: Users cannot read/write other users' documents
5. **Default Deny**: Any path not explicitly allowed is denied

---

## Firestore Indexes

**File**: `firestore.indexes.json`

```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

**Rationale**: No indexes needed for MVP because:
- Only querying single documents by path (`users/{uid}/preferences`)
- No complex queries or filtering
- No ordering or composite queries

*Note: If future features require calendar sharing or multi-user queries, indexes will be defined here.*

---

## Firestore Operations (Client SDK)

### Read Preferences

```typescript
import { doc, getDoc } from 'firebase/firestore';

async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const docRef = doc(db, 'users', userId, 'preferences');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserPreferences;
  }

  return null; // Document doesn't exist yet
}
```

### Write/Update Preferences

```typescript
import { doc, setDoc, Timestamp } from 'firebase/firestore';

async function saveUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'preferences');

  await setDoc(docRef, {
    ...preferences,
    lastUpdated: Timestamp.now()
  }, { merge: true }); // Merge to update only specified fields
}
```

### Initialize Preferences (First Time)

```typescript
async function initializeUserPreferences(
  userId: string,
  calendars: GoogleCalendar[]
): Promise<void> {
  const defaultPrefs: UserPreferences = {
    visibleCalendars: calendars.map(cal => cal.id), // All calendars visible by default
    selectedYear: new Date().getFullYear(),
    defaultView: 'year',
    lastUpdated: Timestamp.now(),
  };

  const docRef = doc(db, 'users', userId, 'preferences');
  await setDoc(docRef, defaultPrefs);
}
```

### Delete Preferences (User Account Deletion)

```typescript
import { doc, deleteDoc } from 'firebase/firestore';

async function deleteUserPreferences(userId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'preferences');
  await deleteDoc(docRef);
}
```

---

## Testing with Firestore Emulator

### Setup Emulator

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize emulator:
   ```bash
   firebase init emulators
   ```
   Select: Firestore Emulator

3. Update `firebase.json`:
   ```json
   {
     "emulators": {
       "firestore": {
         "port": 8080
       },
       "ui": {
         "enabled": true,
         "port": 4000
       }
     }
   }
   ```

4. Start emulator:
   ```bash
   firebase emulators:start
   ```

### Connect Client to Emulator

```typescript
import { connectFirestoreEmulator } from 'firebase/firestore';

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### Test Security Rules

```bash
firebase emulators:exec --only firestore "npm test"
```

---

## Data Migration Plan

*For future reference if schema changes*

### Version 1.0 (Current)

- Initial schema with `visibleCalendars`, `selectedYear`, `defaultView`, `lastUpdated`
- No migration needed

### Future Enhancements (Examples)

If we add new fields in future versions:

```typescript
// Version 1.1: Add theme preference
interface UserPreferences {
  // ... existing fields
  theme?: 'light' | 'dark' | 'auto';  // New optional field
}
```

**Migration Strategy**:
- Add field as optional (`?`)
- Provide default in client code
- No Firestore migration needed (NoSQL flexibility)

---

## Backup & Recovery

### Enable Automatic Backups

```bash
gcloud firestore backups schedules create \
  --database='(default)' \
  --recurrence=weekly \
  --retention=4w
```

### Manual Export

```bash
gcloud firestore export gs://[BUCKET_NAME]/[EXPORT_PATH]
```

---

## Quota Limits (Firebase Free Tier)

| Operation | Free Tier Limit | Our Usage (Estimated) |
|-----------|-----------------|------------------------|
| Document Reads | 50,000/day | 1-10/user/day (~10-100/day total) |
| Document Writes | 20,000/day | 1-5/user/day (~10-50/day total) |
| Document Deletes | 20,000/day | <1/user (~1-5/day total) |
| Stored Data | 1 GB | <1 MB (minimal user prefs) |

**Conclusion**: Well within free tier limits for personal/small-scale use.

---

## Summary

- **Collection**: `/users/{userId}/preferences` (one document per user)
- **Security**: Owner-only access with validation rules
- **Indexes**: None needed for MVP
- **Operations**: Simple get/set via Firebase SDK
- **Testing**: Firestore emulator for local development
- **Quotas**: Well within Firebase free tier
