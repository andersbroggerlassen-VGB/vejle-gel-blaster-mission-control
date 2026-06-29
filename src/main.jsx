import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { subscribeState, patchState } from './lib/firebase';
import { getRemainingSeconds } from './lib/time';
import { playTone } from './lib/audio';
import App from './App.jsx';
import './styles.css';

function Root() {
  const [state, setState] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [lastSound, setLastSound] = useState(0);

  useEffect(() => subscribeState(setState), []);

  // Tving alle skærme til at opdatere tiden lokalt hvert sekund.
  // Firebase gemmer start/slut-tidspunktet, men selve nedtællingen renderes lokalt.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state?.soundEvent?.at || state.soundEvent.at === lastSound) return;
    setLastSound(state.soundEvent.at);
    playTone(state.soundEvent.type);
  }, [state?.soundEvent?.at, lastSound]);

  const computed = useMemo(() => {
    if (!state) return null;
    const remaining = getRemainingSeconds(state, now);
    const displayStatus = state.status === 'LIVE' && remaining <= 0 ? 'COMPLETE' : state.status;
    return { ...state, remaining, displayStatus, now };
  }, [state, now]);

  // Når tiden rammer 0, skriv COMPLETE tilbage til Firebase én gang.
  useEffect(() => {
    if (!computed) return;
    if (computed.status === 'LIVE' && computed.remaining <= 0) {
      patchState({ status: 'COMPLETE', remaining: 0, endsAt: null, soundEvent: { type: 'complete', at: Date.now() } });
    }
  }, [computed?.status, computed?.remaining]);

  if (!computed) return <div className="boot">INITIALISERER MISSION CONTROL...</div>;
  return <App state={computed} />;
}

createRoot(document.getElementById('root')).render(<Root />);
