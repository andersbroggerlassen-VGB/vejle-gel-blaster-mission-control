import TimerText from './TimerText.jsx';
export default function Scoreboard({ state, big = false }) {
  const redWins = state.redScore > state.blueScore;
  const blueWins = state.blueScore > state.redScore;
  return <div className={big ? 'scoreboard big' : 'scoreboard'}>
    <div className={`team red ${redWins ? 'leading' : ''}`}><span>{state.redTeam}</span><strong>{state.redScore}</strong></div>
    <div className="versus">VS</div>
    <div className={`team blue ${blueWins ? 'leading' : ''}`}><span>{state.blueTeam}</span><strong>{state.blueScore}</strong></div>
    <div className="timebox"><small>KAMPTID</small><b><TimerText state={state} /></b><em>{state.displayStatus}</em></div>
  </div>
}
