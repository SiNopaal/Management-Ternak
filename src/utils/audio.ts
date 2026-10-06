// Web Audio API Beep Generator for Barcode/QR Scanner
let audioCtx: AudioContext | null = null;

export function playScanBeep(type: 'success' | 'double' = 'success') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === 'double') {
      // Crisp double-beep (familiar POS/warehouse chime)
      playTone(audioCtx, 1760, now, 0.08);
      playTone(audioCtx, 2349, now + 0.1, 0.09);
    } else {
      // Classic Honeywell / Zebra barcode scanner high-frequency beep
      playTone(audioCtx, 1950, now, 0.11);
    }

    // Trigger haptic feedback vibration on mobile devices if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(type === 'double' ? [60, 40, 80] : 100);
    }
  } catch (err) {
    console.warn('AudioContext playback error (silenced):', err);
  }
}

function playTone(ctx: AudioContext, frequency: number, startTime: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, startTime);

  // Attack & Decay Envelope
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}
