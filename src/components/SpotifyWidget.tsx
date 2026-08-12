import React, { useState, useRef, useEffect } from 'react';

export const SpotifyWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef1 = useRef<OscillatorNode | null>(null);
  const oscRef2 = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Toggle Web Audio Synth Sound
  const togglePlay = () => {
    if (isPlaying) {
      // Stop playing
      stopSynth();
      setIsPlaying(false);
    } else {
      // Start playing
      startSynth();
      setIsPlaying(true);
    }
  };

  const startSynth = () => {
    try {
      // Initialize AudioContext on user interaction
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create a master gain node for volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime); // Low volume
      masterGain.connect(ctx.destination);
      gainRef.current = masterGain;

      // Synth Oscillator 1 (Root note - E3)
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 frequency
      osc1.connect(masterGain);
      osc1.start();
      oscRef1.current = osc1;

      // Synth Oscillator 2 (Fifth - B3, slightly detuned for chorus effect)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(246.94 + 0.5, ctx.currentTime); // B3 + minor detune
      osc2.connect(masterGain);
      osc2.start();
      oscRef2.current = osc2;

      // Add a very slow LFO filter filter/gain sweep for lo-fi atmospheric feel
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 0.2Hz (5 seconds cycle)
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      lfo.start();

    } catch (err) {
      console.warn('Web Audio API not fully supported or blocked:', err);
    }
  };

  const stopSynth = () => {
    try {
      if (oscRef1.current) {
        oscRef1.current.stop();
        oscRef1.current.disconnect();
        oscRef1.current = null;
      }
      if (oscRef2.current) {
        oscRef2.current.stop();
        oscRef2.current.disconnect();
        oscRef2.current = null;
      }
      if (gainRef.current) {
        gainRef.current.disconnect();
        gainRef.current = null;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Cleanup synth when component unmounts
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  return (
    <div className="spotify-card" onClick={togglePlay} title={isPlaying ? "Click to Pause" : "Click to Play Ambient Beat"}>
      <div className="spotify-logo">
        {/* Custom Spotify Icon SVG */}
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"></path>
        </svg>
      </div>

      <div className="spotify-info">
        <span className="spotify-status">
          {isPlaying ? 'Now Playing' : 'Spotify'}
        </span>
        <div className="spotify-track">
          {isPlaying ? 'Resonance' : 'Oopsie, No Tunes to Spin!'}
        </div>
        <div className="spotify-artist">
          {isPlaying ? 'Home — Ambient Lo-Fi Synth' : 'Offline — Click to play coding beat'}
        </div>
      </div>

      <div className={`sound-wave ${isPlaying ? '' : 'paused'}`}>
        <div className="sound-wave-bar"></div>
        <div className="sound-wave-bar"></div>
        <div className="sound-wave-bar"></div>
        <div className="sound-wave-bar"></div>
      </div>
    </div>
  );
};
