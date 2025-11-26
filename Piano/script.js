/* WebAudio-only piano: plays tones for the 21 white keys */

const whiteNotes = [
  'C4','D4','E4','F4','G4','A4','B4',
  'C5','D5','E5','F5','G5','A5','B5',
  'C6','D6','E6','F6','G6','A6','B6'
];

const freqs = {
  C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
  C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00, B5:987.77,
  C6:1046.50, D6:1174.66, E6:1318.51, F6:1396.91, G6:1567.98, A6:1760.00, B6:1975.53
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynth(note, duration = 0.6) {
  const now = audioCtx.currentTime;
  const freq = freqs[note] || 440;

  const osc = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc2.type = 'sine';
  osc.frequency.value = freq;
  osc2.frequency.value = freq;
  osc2.detune.value = 6;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.8, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = Math.max(1500, freq * 4);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + duration + 0.02);
  osc2.stop(now + duration + 0.02);
}

document.addEventListener('DOMContentLoaded', () => {
  const keys = document.querySelectorAll('.key');
  keys.forEach((key, i) => {
    const note = whiteNotes[i] || 'C4';
    key.dataset.note = note;

    key.addEventListener('click', () => {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      key.classList.add('active');
      playSynth(note);
      setTimeout(() => key.classList.remove('active'), 150);
    });
  });

  console.log('WebAudio piano initialized — keys:', keys.length);
});
