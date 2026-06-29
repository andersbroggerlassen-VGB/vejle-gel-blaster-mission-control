import Layout from '../components/Layout.jsx';
import Panel from '../components/Panel.jsx';
export default function MapPage({ state }) { return <Layout title="BANEKORT"><Panel title="BANEKORT" className="single map-single">{state.mapUrl ? <img className="map-img" src={state.mapUrl}/> : <div className="map-placeholder">Banekort ikke sat endnu</div>}</Panel></Layout> }
