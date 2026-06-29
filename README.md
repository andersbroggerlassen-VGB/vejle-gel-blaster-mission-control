# Vejle Gel Blaster Mission Control

React/Vite version with Firebase Realtime Database.

## Netlify

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

## Environment variables

Add these in Netlify > Project configuration > Environment variables:

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_DATABASE_URL
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

If Netlify smart secret scanning blocks the Firebase web API key, add:

- SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES = your Firebase API key

Firebase web API keys are meant to be present in browser apps. Security must be handled with Firebase Database Rules.
