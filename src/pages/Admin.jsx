import { useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Panel from '../components/Panel.jsx';
import { patchState, resetState } from '../lib/firebase';
import { getRemainingSeconds } from '../lib/time';

const sound = (type) => patchState({ soundEvent: { type, at: Date.now() } });
export default function Admin({ state }) {
  useEffect(() => {
    if (state.status !== 'LIVE' || !state.endsAt) return;

    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));

      patchState({
        remaining,
        status: remaining <= 0 ? 'COMPLETE' : 'LIVE'
      });
    }, 1000);

    return () => clearInterval(id);
  }, [state.status, state.endsAt]);
  const setField = (key, value) => patchState({ [key]: value });
 const start = () => {
  const duration = Number(state.duration || state.remaining || 900);
  patchState({
    status: 'LIVE',
    duration,
    remaining: duration,
    endsAt: Date.now() + duration * 1000,
    soundEvent: { type: 'start', at: Date.now() }
  });
};
  const pauseResume = () => {
    if (state.status === 'LIVE') return patchState({ status: 'PAUSED', remaining: getRemainingSeconds(state), endsAt: null });
    if (state.status === 'PAUSED') return patchState({ status: 'LIVE', endsAt: Date.now() + Number(state.remaining) * 1000 });
  };
  const stop = () => patchState({ status: 'READY', remaining: Number(state.duration), endsAt: null, redScore: 0, blueScore: 0 });
  return <Layout title="ADMIN PANEL" compact>
    <div className="admin-grid">
      <Panel title="KAMPSTYRING">
        <div className="buttons"><button onClick={start}>START MISSION</button><button onClick={pauseResume}>PAUSE / GENOPTAG</button><button className="danger" onClick={stop}>STOP / NULSTIL</button></div>
        <div className="buttons"><button className="red" onClick={()=>patchState({redScore: Number(state.redScore)+1, soundEvent:{type:'point',at:Date.now()}})}>+1 RØD</button><button className="blue" onClick={()=>patchState({blueScore: Number(state.blueScore)+1, soundEvent:{type:'point',at:Date.now()}})}>+1 BLÅ</button><button onClick={()=>patchState({redScore: Math.max(0, Number(state.redScore)-1)})}>-1 RØD</button><button onClick={()=>patchState({blueScore: Math.max(0, Number(state.blueScore)-1)})}>-1 BLÅ</button></div>
        <label>Missionstid i minutter<input type="number" value={Math.round(Number(state.duration)/60)} onChange={e=>{const d=Number(e.target.value)*60; patchState({duration:d, remaining:d})}} /></label>
      </Panel>
      <Panel title="MISSION">
        <label>Mission navn<input value={state.missionName} onChange={e=>setField('missionName', e.target.value)} /></label>
        <label>Mission type<input value={state.missionType} onChange={e=>setField('missionType', e.target.value)} /></label>
        <label>Mission tekst<textarea value={state.missionText} onChange={e=>setField('missionText', e.target.value)} /></label>
        <label>Besked til skærme<input value={state.message} onChange={e=>setField('message', e.target.value)} /></label>
      </Panel>
      <Panel title="HOLD">
        <label>Rødt hold<input value={state.redTeam} onChange={e=>setField('redTeam', e.target.value)} /></label>
        <label>Blåt hold<input value={state.blueTeam} onChange={e=>setField('blueTeam', e.target.value)} /></label>
      </Panel>
      <Panel title="KAMERAER OG KORT">
        <label>Rød kamera URL<input value={state.cameraRedUrl} onChange={e=>setField('cameraRedUrl', e.target.value)} /></label>
        <label>Blå kamera URL<input value={state.cameraBlueUrl} onChange={e=>setField('cameraBlueUrl', e.target.value)} /></label>
        <label>Overblik kamera URL<input value={state.cameraOverviewUrl} onChange={e=>setField('cameraOverviewUrl', e.target.value)} /></label>
        <label>Banekort URL<input value={state.mapUrl} onChange={e=>setField('mapUrl', e.target.value)} /></label>
      </Panel>
      <Panel title="LYD"><div className="buttons"><button onClick={()=>sound('siren')}>SIRENE</button><button onClick={()=>sound('alarm')}>ALARM</button><button onClick={()=>sound('complete')}>MISSION COMPLETE</button><button onClick={()=>sound('start')}>START LYD</button></div></Panel>
      <Panel title="SYSTEM"><button className="danger" onClick={resetState}>RESET ALT</button></Panel>
    </div>
  </Layout>
}
