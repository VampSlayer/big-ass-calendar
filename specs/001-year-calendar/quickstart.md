# Quickstart Guide: Digital Year-View Calendar

**Date**: 2026-01-13
**Feature**: 001-year-calendar

## Overview

This guide walks through setting up the development environment, configuring Firebase, and running the application locally.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **Google Account** for Firebase and Calendar access
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Code Editor** (VS Code recommended)

Verify installations:
```bash
node --version  # Should be v18.x or higher
npm --version
git --version
firebase --version
```

---

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `year-calendar-app` (or your preferred name)
4. Disable Google Analytics (optional for development)
5. Click "Create project"

### 1.2 Enable Firebase Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Select "Google" as sign-in provider
4. Enable Google provider
5. Enter project support email
6. Click "Save"

### 1.3 Create Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Select "Start in **production mode**" (we'll add rules next)
4. Choose location (e.g., `us-central1`)
5. Click "Enable"

### 1.4 Set Firestore Security Rules

1. Go to **Firestore Database > Rules** tab
2. Replace default rules with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
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

    match /users/{userId}/preferences {
      allow read: if isOwner(userId);
      allow create, update: if isOwner(userId) && hasValidPreferences();
      allow delete: if isOwner(userId);
    }

    match /users/{userId}/{document=**} {
      allow read, write: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click "Publish"

### 1.5 Get Firebase Config

1. Go to **Project settings** (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon (</>) to add web app
4. Register app name: `year-calendar-web`
5. Check "Also set up Firebase Hosting"
6. Click "Register app"
7. **Copy the Firebase config object** (you'll need this later):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## Step 2: Google Calendar API Setup

### 2.1 Enable Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (it auto-creates a Cloud project)
3. Go to **APIs & Services > Library**
4. Search for "Google Calendar API"
5. Click "Google Calendar API"
6. Click "Enable"

### 2.2 Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Select "External" user type
3. Click "Create"
4. Fill in required fields:
   - App name: `Year Calendar Viewer`
   - User support email: Your email
   - Developer contact: Your email
5. Click "Save and Continue"
6. Skip "Scopes" for now
7. Add test users (your Google account)
8. Click "Save and Continue"

### 2.3 Create OAuth Client ID

1. Go to **APIs & Services > Credentials**
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Name: `Year Calendar Web Client`
5. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (add later)
6. Authorized redirect URIs:
   - `http://localhost:3000`
   - Your Firebase Auth domain (from Firebase config)
7. Click "Create"
8. **Copy the Client ID** (you'll need this)

### 2.4 Add Google Calendar Scope to Firebase Auth

1. Back in Firebase Console, go to **Authentication > Settings > Authorized domains**
2. Add `localhost` if not already present
3. Go to **Authentication > Sign-in method > Google**
4. Click edit (pencil icon)
5. Expand "Advanced settings"
6. Add OAuth scope: `https://www.googleapis.com/auth/calendar.readonly`
7. Click "Save"

---

## Step 3: Project Setup

### 3.1 Create React + Vite Project

```bash
# Navigate to repository root
cd /Users/sayahussain/Repos/spec-kit-test

# Create Vite + React + TypeScript app
npm create vite@latest . -- --template react-ts

# Answer prompts:
# ✓ Select a framework: React
# ✓ Select a variant: TypeScript

# Project will be created in current directory
```

### 3.2 Install Dependencies

```bash
# Install base dependencies first
npm install

# Firebase SDKs (modular v9+)
npm install firebase

# Google APIs
npm install @react-oauth/google gapi-script

# React Router for client-side routing
npm install react-router-dom

# Bootstrap CSS
npm install bootstrap react-bootstrap

# Date utilities
npm install date-fns

# TypeScript types
npm install -D @types/gapi @types/gapi.auth2 @types/gapi.client.calendar

# Testing libraries (Vitest + React Testing Library)
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jsdom
npm install -D msw  # Mock Service Worker for API mocking
npm install -D @vitejs/plugin-react  # Should already be installed by Vite template

# Firebase tools (globally if not already installed)
npm install -g firebase-tools
```

### 3.3 Create Environment File

Create `.env.local` in project root:

```bash
# Firebase Config (VITE_ prefix required for Vite)
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Google OAuth
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com

# Development
NODE_ENV=development
```

**⚠️ Important**: Add `.env.local` to `.gitignore` (should be there by default)

### 3.4 Initialize Firebase in Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select:
# (*) Firestore: Configure security rules and indexes files
# (*) Hosting: Configure files for Firebase Hosting

# Use existing project: Select your Firebase project

# Firestore rules file: firestore.rules
# Firestore indexes file: firestore.indexes.json

# Public directory: out (Next.js export output)
# Configure as single-page app: No
# Set up automatic builds with GitHub: No (optional)
```

---

## Step 4: Configure Bootstrap CSS

### 4.1 Import Bootstrap in Main Entry Point

Edit `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'  // Import Bootstrap CSS
import './styles/globals.css'  // Custom global styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 4.2 Create Global CSS File

Create `src/styles/globals.css`:

```css
/* Custom global styles */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Add any custom Bootstrap overrides here */
```

---

## Step 5: Run Development Environment

### 5.1 Start Firebase Emulators (Optional but Recommended)

In a separate terminal:

```bash
# Start Firestore and Auth emulators
firebase emulators:start --only firestore,auth

# Emulator UI will be available at: http://localhost:4000
# Firestore emulator: localhost:8080
# Auth emulator: localhost:9099
```

### 5.2 Start Vite Development Server

```bash
npm run dev
```

Application should now be running at: **http://localhost:5173** (Vite default port)

---

## Step 6: Verify Setup

### 6.1 Check Firebase Connection

1. Navigate to `http://localhost:5173`
2. Open browser DevTools > Console
3. Look for Firebase initialization messages (if any)
4. No errors should appear

### 6.2 Test Authentication

1. Click "Sign in with Google" button
2. Complete Google OAuth flow
3. Should redirect back to app authenticated
4. Check Firestore database for created `users/{uid}/preferences` document

### 6.3 Test Google Calendar API

1. After authentication, app should fetch calendar list
2. Should display year view with your events
3. Check Network tab for Google Calendar API requests

---

## Step 7: Common Issues & Troubleshooting

### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Solution**: Add `localhost` to Firebase Console > Authentication > Settings > Authorized domains

### Issue: "Google Calendar API quota exceeded"

**Solution**: Wait 24 hours or increase quota in Google Cloud Console

### Issue: "CORS error when fetching Google Calendar"

**Solution**: Ensure you're using client-side fetch (not server-side), and OAuth client is configured correctly

### Issue: "Firestore permission denied"

**Solution**: Verify security rules are deployed and user is authenticated

### Issue: "Module not found: Can't resolve 'bootstrap'"

**Solution**: Run `npm install bootstrap` and restart dev server

---

## Step 8: Configure Vitest

### 8.1 Create Vitest Config

Create `vitest.config.ts` in project root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 8.2 Create Vitest Setup File

Create `vitest.setup.ts` in project root:

```typescript
import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

### 8.3 Update package.json Scripts

Update `package.json` scripts (Vite template provides base scripts):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Step 9: Optional - VS Code Extensions

Recommended VS Code extensions:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Firebase (`toba.vsfire`)
- TypeScript + JavaScript (`ms-vscode.vscode-typescript-next`)
- Vitest (`ZixuanChen.vitest-explorer`)

---

## Next Steps

You're now ready to start development! Proceed to:

1. `/speckit.tasks` to generate implementation tasks
2. Follow TDD workflow (write unit tests first with Vitest)
3. Implement components following project structure

---

## Quick Reference

### Start Development

```bash
# Terminal 1: Firebase Emulators
firebase emulators:start --only firestore,auth

# Terminal 2: Vite Dev Server
npm run dev
```

### Deploy to Firebase Hosting

```bash
# Build React app with Vite
npm run build

# Preview production build locally (optional)
npm run preview

# Deploy to Firebase
firebase deploy
```

### Run Tests

```bash
# Unit tests with Vitest
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode (interactive)
npm run test:ui
```

### View Logs

```bash
# Firebase emulator logs
firebase emulators:start --only firestore --debug

# Vite logs
npm run dev (logs appear in terminal)
```

---

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Calendar API Reference](https://developers.google.com/calendar/api)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)

---

## Support

For issues specific to this project:
- Check `specs/001-year-calendar/` documentation
- Review constitution at `.specify/memory/constitution.md`
- Consult research decisions in `specs/001-year-calendar/research.md`
