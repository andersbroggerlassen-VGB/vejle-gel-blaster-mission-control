import Layout from '../components/Layout.jsx';
import Panel from '../components/Panel.jsx';
import Scoreboard from '../components/Scoreboard.jsx';
import CameraFrame from '../components/CameraFrame.jsx';
import TimerText from '../components/TimerText.jsx';

export default function Dashboard({ state }) {
  return <Layout title="MISSION CONTROL SYSTEM">
    <div className="grid dashboard-grid">
      <Panel title="MISSION BRIEFING" className="brief"><h1>{state.missionName}</h1><h3>{state.missionType}</h3><p>{state.missionText}</p><ul>{state.rules?.map((r,i)=><li key={i}>{r}</li>)}</ul><div className="countdown"><TimerText state={state} /></div></Panel>
      <Panel title="SCOREBOARD" className="score-panel"><Scoreboard state={state} /></Panel>
      <Panel title="LIVE CAMERA - RØD"><CameraFrame title="RØD BASE" url={state.cameraRedUrl}/></Panel>
      <Panel title="LIVE CAMERA - BLÅ"><CameraFrame title="BLÅ BASE" url={state.cameraBlueUrl}/></Panel>
      <Panel title="BANEKORT" className="map-panel">{state.mapUrl ? <img className="map-img" src={state.mapUrl}/> : <div className="map-placeholder">Upload/indsæt link til banekort i admin</div>}</Panel>
      <Panel title="LIVE CAMERA - OVERBLIK"><CameraFrame title="BANEN OVENFRA" url={state.cameraOverviewUrl}/></Panel>
    </div>
  </Layout>
}
