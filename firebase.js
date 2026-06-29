

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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set, update, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const stateRef = ref(db, 'missionControl/state');
const defaultState = {
  brand:'VEJLE GEL BLASTER', status:'READY', mission:'CAPTURE THE FLAG', briefing:'Eliminér modstanderen, beskyt egen base og erobr flaget i midten. Respektér sikkerhedsreglerne. Masker på. Ingen skud på kort afstand.',
  redName:'RØDT HOLD', blueName:'BLÅT HOLD', redScore:0, blueScore:0, duration:900, remaining:900, startedAt:0, pausedAt:0,
  cameraRed:'', cameraBlue:'', cameraOverview:'', sound:'none', winner:'', mapTitle:'BANEKORT - OUTDOOR ARENA'
};
let current={...defaultState};let timerInt=null;
export function subscribe(cb){onValue(stateRef, async snap=>{if(!snap.exists()){await set(stateRef, defaultState);return} current={...defaultState,...snap.val()}; cb(current); });}
export function save(patch){return update(stateRef, patch)}
export function resetAll(){return set(stateRef, defaultState)}
export function startMission(){
  const now=Date.now();
  const rem = (current.status==='PAUSED' && current.remaining) ? current.remaining : (current.remaining || current.duration);
  return update(stateRef,{status:'LIVE',startedAt:now,pausedAt:0,winner:'',remaining:rem});
}
export function pauseMission(){
  let rem=current.remaining||current.duration;
  if(current.status==='LIVE' && current.startedAt){
    const elapsed=Math.floor((Date.now()-current.startedAt)/1000);
    rem=Math.max(0,(current.remaining||current.duration)-elapsed);
  }
  return update(stateRef,{status:'PAUSED',pausedAt:Date.now(),startedAt:0,remaining:rem});
}
export function togglePauseResume(){
  if(current.status==='LIVE') return pauseMission();
  return startMission();
}
export function stopMission(){let winner=current.redScore===current.blueScore?'UAFGJORT':(current.redScore>current.blueScore?current.redName:current.blueName); return update(stateRef,{status:'COMPLETE',winner})}
export function tickLocal(render){clearInterval(timerInt); timerInt=setInterval(()=>{let s=current;if(s.status==='LIVE'&&s.startedAt){let elapsed=Math.floor((Date.now()-s.startedAt)/1000);let rem=Math.max(0,(s.remaining||s.duration)-elapsed);render(rem); if(rem<=0) stopMission();}else render(s.remaining||s.duration)},500)}
export function fmt(sec){sec=Math.max(0,Math.floor(sec||0));let m=String(Math.floor(sec/60)).padStart(2,'0');let s=String(sec%60).padStart(2,'0');return `${m}:${s}`}
export function playBeep(kind='start'){try{const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value=kind==='alarm'?220:kind==='complete'?520:880; g.gain.setValueAtTime(.0001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.18,ctx.currentTime+.02); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.45); o.start(); o.stop(ctx.currentTime+.5)}catch(e){}}
export function embed(el,url,label){if(!el)return; if(!url){el.innerHTML=`<div class="placeholder">${label}<br><span style="font-size:18px">Indsæt stream-link i admin</span></div>`;return} if(url.includes('youtube')||url.includes('vimeo')||url.includes('iframe')) el.innerHTML=`<iframe src="${url}" allow="autoplay; fullscreen"></iframe>`; else el.innerHTML=`<video src="${url}" autoplay muted playsinline controls></video>`;}
window.MC={subscribe,save,resetAll,startMission,pauseMission,togglePauseResume,stopMission,tickLocal,fmt,playBeep,embed};
