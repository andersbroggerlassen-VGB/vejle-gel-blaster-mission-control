import Layout from '../components/Layout.jsx';
import Panel from '../components/Panel.jsx';
import Scoreboard from '../components/Scoreboard.jsx';
export default function Score({ state }) { return <Layout title="LIVE SCOREBOARD"><Panel title="SCOREBOARD" className="single"><Scoreboard state={state} big /></Panel></Layout> }
