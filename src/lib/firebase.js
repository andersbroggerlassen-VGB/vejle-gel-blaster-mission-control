import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';

const requiredEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const missing = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length) {
  console.error('Missing Firebase environment variables:', missing);
}

const firebaseConfig = requiredEnv;

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const stateRef = ref(db, 'missionControl/state');

export const defaultState = {
  missionName: 'Operation Alpha',
  missionType: 'Capture the Flag',
  missionText: 'Find flaget, bring det tilbage til jeres base og beskyt holdet.',
  rules: ['Briller på - altid', 'Ingen skud på meget kort afstand', 'Respektér dommeren', 'Fair play giver den bedste oplevelse'],
  redTeam: 'RØD HOLD',
  blueTeam: 'BLÅ HOLD',
  redScore: 0,
  blueScore: 0,
  duration: 900,
  remaining: 900,
  status: 'READY',
  endsAt: null,
  cameraRedUrl: '',
  cameraBlueUrl: '',
  cameraOverviewUrl: '',
  mapUrl: '',
  message: 'Gør jer klar. Næste mission starter snart.',
  soundEvent: { type: 'none', at: 0 }
};

export function subscribeState(callback) {
  return onValue(stateRef, (snapshot) => {
    const value = snapshot.val();
    if (!value) {
      set(stateRef, defaultState);
      callback(defaultState);
    } else {
      callback({ ...defaultState, ...value });
    }
  });
}

export function patchState(patch) {
  return update(stateRef, patch);
}

export function resetState() {
  return set(stateRef, defaultState);
}
