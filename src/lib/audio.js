export function playTone(type = 'beep') {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const tones = {
    start: [440, 660, 880],
    siren: [520, 780, 520, 780],
    complete: [880, 660, 440],
    point: [880],
    alarm: [160, 160, 160]
  }[type] || [500];

  tones.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = type === 'alarm' ? 'sawtooth' : 'square';
    gain.gain.setValueAtTime(0.001, now + i * 0.18);
    gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.18 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.18);
    osc.stop(now + i * 0.18 + 0.16);
  });
}
