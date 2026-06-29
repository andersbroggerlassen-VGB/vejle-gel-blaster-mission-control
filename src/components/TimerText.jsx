import { useEffect, useState } from 'react';
import { formatTime, getRemainingSeconds } from '../lib/time';

export default function TimerText({ state }) {
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(state));

  useEffect(() => {
    const update = () => setRemaining(getRemainingSeconds(state));
    update();
    const id = setInterval(update, 250);
    return () => clearInterval(id);
  }, [state.status, state.endsAt, state.remaining, state.duration]);

  return formatTime(remaining);
}
