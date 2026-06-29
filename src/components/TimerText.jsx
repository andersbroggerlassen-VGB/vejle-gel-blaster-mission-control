import { formatTime } from '../lib/time';

export default function TimerText({ state }) {
  return formatTime(state.remaining);
}