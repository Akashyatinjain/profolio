// src/utils/soundEffects.js
// Procedural Web Audio API sound synthesizer - zero external audio assets, zero latency.

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const isSoundEnabled = () => soundEnabled;

export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio_sound_enabled', enabled ? 'true' : 'false');
  }
  return soundEnabled;
};

export const initSoundPreference = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('portfolio_sound_enabled');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  }
  return soundEnabled;
};

// 1. Mechanical Button Click
export const playClick = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
};

// 2. High-Tech Toggle Switch
export const playSwitch = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

  gain.gain.setValueAtTime(0.09, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.06);
};

// 3. Authentic Porsche Motor Rev (Plays /Audio/freesound_community-car-motor-revving-99317.mp3)
let motorAudio = null;

export const playSynthesizedRev = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Cylinder rumble oscillator (sawtooth)
  const osc1 = ctx.createOscillator();
  // Sub-bass boxer pulse (triangle)
  const osc2 = ctx.createOscillator();
  // Filter for exhaust resonance
  const filter = ctx.createBiquadFilter();
  const masterGain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc2.type = 'triangle';
  filter.type = 'lowpass';
  filter.Q.value = 4.5;

  // Rev Profile: Idle (75Hz) -> Hard Throttle (280Hz) -> Shift blip (360Hz) -> Spool down (90Hz)
  osc1.frequency.setValueAtTime(75, now);
  osc1.frequency.exponentialRampToValueAtTime(260, now + 0.45);
  osc1.frequency.exponentialRampToValueAtTime(380, now + 0.85);
  osc1.frequency.exponentialRampToValueAtTime(190, now + 1.25);
  osc1.frequency.exponentialRampToValueAtTime(85, now + 1.8);

  osc2.frequency.setValueAtTime(38, now);
  osc2.frequency.exponentialRampToValueAtTime(130, now + 0.45);
  osc2.frequency.exponentialRampToValueAtTime(190, now + 0.85);
  osc2.frequency.exponentialRampToValueAtTime(95, now + 1.25);
  osc2.frequency.exponentialRampToValueAtTime(42, now + 1.8);

  // Exhaust filter opens with throttle
  filter.frequency.setValueAtTime(280, now);
  filter.frequency.exponentialRampToValueAtTime(1800, now + 0.5);
  filter.frequency.exponentialRampToValueAtTime(2800, now + 0.85);
  filter.frequency.exponentialRampToValueAtTime(600, now + 1.4);
  filter.frequency.exponentialRampToValueAtTime(240, now + 1.8);

  // Master Gain Envelope
  masterGain.gain.setValueAtTime(0.01, now);
  masterGain.gain.linearRampToValueAtTime(0.22, now + 0.2);
  masterGain.gain.setValueAtTime(0.25, now + 0.8);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.85);

  // Procedural Turbo Spool White Noise
  const bufferSize = ctx.sampleRate * 1.5;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(1800, now);
  noiseFilter.frequency.exponentialRampToValueAtTime(4500, now + 0.8);
  noiseFilter.Q.value = 3.0;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.001, now);
  noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.6);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  whiteNoise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  whiteNoise.start(now + 0.2);

  osc1.stop(now + 1.85);
  osc2.stop(now + 1.85);
  whiteNoise.stop(now + 1.7);
};

export const playEngineRev = () => {
  if (!soundEnabled) return;

  if (typeof window !== 'undefined') {
    try {
      if (!motorAudio) {
        motorAudio = new Audio('/Audio/freesound_community-car-motor-revving-99317.mp3');
        motorAudio.volume = 0.85;
      }
      motorAudio.currentTime = 0;
      const playPromise = motorAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Real motor rev audio playback issue, fallback to WebAudio synth:', err);
          playSynthesizedRev();
        });
      }
      return;
    } catch {
      playSynthesizedRev();
      return;
    }
  }

  playSynthesizedRev();
};

// 4. Celebratory Arpeggio (Confetti / Submission)
export const playCelebration = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.08;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.35);
  });
};

