# Year Calendar App

A beautiful year-at-a-glance calendar application that displays all 12 months simultaneously with Google Calendar events integration.

## Features

- 📅 **Year-at-a-glance view**: See all 12 months on one screen
- 🔐 **Google Authentication**: Sign in with your Google account using Firebase Auth
- 📆 **Google Calendar Integration**: View all your Google Calendar events
- 🎨 **Beautiful Design**: Clean, Bootstrap-based responsive interface
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- 🎯 **Demo Mode**: View sample calendar without signing in

## Tech Stack

- **Framework**: React 18 + Vite
- **Authentication**: Firebase Auth (Google provider)
- **Calendar API**: Google Calendar API
- **Styling**: Bootstrap CSS 5.3+
- **Type Safety**: TypeScript
- **Testing**: Vitest + React Testing Library
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication enabled
- Google Cloud project with Calendar API enabled

### Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd spec-kit-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   
   Copy `.env.local` and fill in your Firebase configuration:
   ```bash
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Firebase Setup

Follow the detailed setup instructions in `/specs/001-year-calendar/quickstart.md` for:
- Creating a Firebase project
- Enabling Google Authentication
- Configuring Google Calendar API
- Setting up OAuth consent screen

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── calendar/       # Calendar view components
│   └── ui/             # Reusable UI components
├── lib/                # Utilities and configs
│   ├── firebase/       # Firebase initialization and helpers
│   └── google-calendar/# Google Calendar API client
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── styles/             # Global CSS
├── App.tsx             # Main app component
└── main.tsx            # React entry point
```

## Architecture

This is a **client-side single-page application** (SPA) with no server-side rendering:
- Firebase Authentication for Google sign-in
- Google Calendar API for fetching events
- No database/persistence (stateless)
- Fully client-side rendering with Vite

## Design

The calendar design is inspired by wall calendars showing all 12 months in a grid layout. See `/specs/001-year-calendar/calendar.webp` for the visual reference.

## Contributing

This project follows a **specification-first, test-driven development** approach:
1. All features start with a specification (`spec.md`)
2. Tests are written before implementation
3. Simple solutions are preferred over complex ones

See `.specify/memory/constitution.md` for development principles.

## License

MIT

## Support

For detailed documentation, see:
- Feature Spec: `/specs/001-year-calendar/spec.md`
- Implementation Plan: `/specs/001-year-calendar/plan.md`
- Task Breakdown: `/specs/001-year-calendar/tasks.md`
- Setup Guide: `/specs/001-year-calendar/quickstart.md`
