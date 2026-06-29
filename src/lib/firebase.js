import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA83faZQ7gUY7zu0f1E7N7uThyLyDRWHAk",
  authDomain: "vejle-gel-blaster.firebaseapp.com",
  databaseURL: "https://vejle-gel-blaster-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vejle-gel-blaster",
  storageBucket: "vejle-gel-blaster.firebasestorage.app",
  messagingSenderId: "616189849145",
  appId: "1:616189849145:web:6c03f05afcbde48501a7e8",
  measurementId: "G-GHFWYTPRT6"
};

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
