import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';
import Score from './pages/Score.jsx';
import Briefing from './pages/Briefing.jsx';
import MapPage from './pages/MapPage.jsx';
import CameraPage from './pages/CameraPage.jsx';

export default function App({ state }) {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/admin') return <Admin state={state} />;
  if (path === '/score') return <Score state={state} />;
  if (path === '/briefing') return <Briefing state={state} />;
  if (path === '/map') return <MapPage state={state} />;
  if (path === '/camera-red') return <CameraPage state={state} camera="red" />;
  if (path === '/camera-blue') return <CameraPage state={state} camera="blue" />;
  if (path === '/camera-overview') return <CameraPage state={state} camera="overview" />;
  return <Dashboard state={state} />;
}
