# Cloud Sync Setup

MathQuest now syncs player state with Firebase. To enable cloud features, configure Firebase and provide the environment variables described below.

## Firebase Project Requirements

1. Create a Firebase project (https://console.firebase.google.com/) if you do not already have one.
2. Enable the following services:
   - **Authentication** → enable **Anonymous** sign-in (or your preferred provider) so the app can bootstrap a user session.
   - **Cloud Firestore** in production mode (rules should guard the `profiles`, `dailyRuns`, and `leaderboards` collections).
3. From your Firebase project settings, register a new Web app and copy the configuration values.

## Environment Variables

Create a `.env` file (or `.env.local` when using Vite) at the project root with the Firebase settings:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Restart the dev server after adding these variables.

## Firestore Data Model

The app expects the following collections:

- `profiles/{uid}` – stores the player profile, XP totals, and unlocked modules.
- `dailyRuns/{uid}/runs/{date}` – tracks daily challenge completions and uses Firestore server timestamps for streak calculations.
- `leaderboards/weekly/entries/{uid}` – caches weekly leaderboard entries so the UI can display ranked XP totals.

Writes to `profiles` and `leaderboards/weekly` occur in a single batch to keep XP in sync after each reward distribution.

## Authentication Providers

Anonymous authentication is enabled by default through the new `useCloudProfile` hook. You can switch to other providers (Google, email/password, etc.) by enabling them in Firebase Auth and updating `ensureAnonymousUser` in `src/services/firebase.ts` to perform the relevant sign-in flow.

## Local Development

1. Install dependencies: `npm install`
2. Provide the Firebase environment variables described above.
3. Start the dev server: `npm run dev`

Cloud sync automatically falls back to the existing local cache until Firebase responds, so you can continue developing offline if needed.
