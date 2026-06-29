import Layout from '../components/Layout.jsx';
import Panel from '../components/Panel.jsx';
import TimerText from '../components/TimerText.jsx';
export default function Briefing({ state }) { return <Layout title="MISSION BRIEFING"><Panel title="MISSION BRIEFING" className="single briefing-screen"><img src="/assets/logo.png"/><h1>{state.missionName}</h1><h2>{state.missionType}</h2><p>{state.missionText}</p><ul>{state.rules?.map((r,i)=><li key={i}>{r}</li>)}</ul><div className="countdown huge"><TimerText state={state} /></div></Panel></Layout> }
