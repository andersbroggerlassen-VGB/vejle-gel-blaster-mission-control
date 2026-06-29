import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, onValue, update, set, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const gameRef = ref(db, 'missionControl/current');

const defaults = {
  mission: 'Operation Alpha',
  missionType: 'Capture the Flag',
  briefing: 'Find flaget, bring det tilbage til jeres base og beskyt holdet.',
  redName: 'RØDT HOLD',
  blueName: 'BLÅT HOLD',
  redScore: 0,
  blueScore: 0,
  duration: 900,
  remaining: 900,
  startedAt: 0,
  status: 'READY',
  winner: '',
  cameraRed: '',
  cameraBlue: '',
  cameraOverview: '',
  mapUrl: '',
  sound: '',
  updatedAt: Date.now()
};

let state = { ...defaults };
let listeners = [];
let interval = null;

function now(){ return Date.now(); }
function calcRemaining(s = state){
  if (s.status === 'LIVE' && s.startedAt) {
    const elapsed = Math.floor((now() - s.startedAt) / 1000);
    return Math.max(0, (s.remaining ?? s.duration ?? 900) - elapsed);
  }
  return Math.max(0, s.remaining ?? s.duration ?? 900);
}
function fmt(sec){
  sec = Math.max(0, Number(sec || 0));
  const m = Math.floor(sec / 60).toString().padStart(2,'0');
  const s = Math.floor(sec % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
function save(patch){ return update(gameRef, { ...patch, updatedAt: now() }); }
async function ensure(){
  const snap = await get(gameRef);
  if(!snap.exists()) await set(gameRef, defaults);
}
function subscribe(cb){
  listeners.push(cb);
  cb(state);
  onValue(gameRef, snap => {
    state = { ...defaults, ...(snap.val() || {}) };
    listeners.forEach(fn => fn(state));
  });
}
function startMission(){
  const rem = state.status === 'PAUSED' ? calcRemaining(state) : (state.duration || 900);
  return save({ status:'LIVE', winner:'', remaining: rem, startedAt: now(), sound:'start-' + now() });
}
function pauseResume(){
  if(state.status === 'LIVE') return save({ status:'PAUSED', remaining: calcRemaining(state), startedAt:0, sound:'pause-' + now() });
  if(state.status === 'PAUSED') return save({ status:'LIVE', startedAt: now(), sound:'resume-' + now() });
  return startMission();
}
function stopMission(){
  const r = calcRemaining(state);
  let winner = '';
  if((state.redScore||0) > (state.blueScore||0)) winner = state.redName;
  if((state.blueScore||0) > (state.redScore||0)) winner = state.blueName;
  if(!winner) winner = 'UAFGJORT';
  return save({ status:'COMPLETE', remaining:r, startedAt:0, winner, sound:'complete-' + now() });
}
function resetAll(){ return set(gameRef, { ...defaults, updatedAt: now() }); }
function tick(cb){
  clearInterval(interval);
  interval = setInterval(() => {
    const rem = calcRemaining(state);
    cb(rem, state);
    if(state.status === 'LIVE' && rem <= 0) stopMission();
  }, 250);
}
function playLocalSound(type){
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const tones = type.includes('alarm') ? [440, 660, 440, 660] : type.includes('complete') ? [523,659,784] : [330,440,660];
  tones.forEach((f,i)=>{
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value=f; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime+i*.18);
    g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime+i*.18+.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+i*.18+.15);
    o.start(ctx.currentTime+i*.18); o.stop(ctx.currentTime+i*.18+.16);
  });
}

ensure();
window.MC = { subscribe, save, startMission, pauseResume, stopMission, resetAll, tick, fmt, calcRemaining, playLocalSound, defaults };
