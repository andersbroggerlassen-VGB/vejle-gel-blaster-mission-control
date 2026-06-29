import Layout from '../components/Layout.jsx';
import CameraFrame from '../components/CameraFrame.jsx';
export default function CameraPage({ state, camera }) {
  const data = { red:['LIVE CAMERA - RØD', state.cameraRedUrl], blue:['LIVE CAMERA - BLÅ', state.cameraBlueUrl], overview:['LIVE CAMERA - OVERBLIK', state.cameraOverviewUrl] }[camera];
  return <Layout title={data[0]} compact><div className="camera-full"><CameraFrame title={data[0]} url={data[1]} /></div></Layout>
}
