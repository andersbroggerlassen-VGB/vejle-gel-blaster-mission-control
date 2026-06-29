import { Link } from './Link.jsx';
import logo from '../assets/vgb-logo.png';

export default function Layout({ children, title = 'MISSION CONTROL', compact = false }) {
  return <main className={compact ? 'app compact' : 'app'}>
    <header className="topbar">
      <div className="brand"><img src={logo} alt="Vejle Gel Blaster" /><div><strong>VEJLE GEL BLASTER</strong><span>{title}</span></div></div>
      <nav>
        <Link href="/admin">Admin</Link><Link href="/briefing">Briefing</Link><Link href="/score">Score</Link><Link href="/map">Kort</Link><Link href="/camera-red">Rød cam</Link><Link href="/camera-blue">Blå cam</Link><Link href="/camera-overview">Overblik</Link>
      </nav>
    </header>
    {children}
  </main>
}
