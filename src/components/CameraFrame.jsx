export default function CameraFrame({ title, url }) {
  return <div className="camera-frame">
    <div className="camera-head"><span>{title}</span><b><i></i> LIVE</b></div>
    <div className="camera-body">
      {url ? (url.includes('youtube') || url.includes('http') ? <iframe title={title} src={url} allow="autoplay; fullscreen" /> : <video src={url} controls autoPlay muted />) : <div className="empty-feed">Indsæt stream-link i admin</div>}
    </div>
  </div>
}
