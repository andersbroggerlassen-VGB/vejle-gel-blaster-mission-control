import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { subscribeState } from './lib/firebase';
import { getRemainingSeconds } from './lib/time';
import { playTone } from './lib/audio';
import App from './App.jsx';
import './styles.css';

function Root() {
  const [state, setState] = useState(null);
  const [tick, setTick] = useState(Date.now());
  const [lastSound, setLastSound] = useState(0);

  useEffect(() => subscribeState(setState), []);
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state?.soundEvent?.at || state.soundEvent.at === lastSound) return;
    setLastSound(state.soundEvent.at);
    playTone(state.soundEvent.type);
  }, [state?.soundEvent?.at]);

  const computed = useMemo(() => {
    if (!state) return null;
    const remaining = getRemainingSeconds(state);
    const displayStatus = state.status === 'LIVE' && remaining <= 0 ? 'COMPLETE' : state.status;
    return { ...state, remaining, displayStatus };
  }, [state, tick]);

  if (!computed) return <div className="boot">INITIALISERER MISSION CONTROL...</div>;
  return <App state={computed} />;
}

createRoot(document.getElementById('root')).render(<Root />);
