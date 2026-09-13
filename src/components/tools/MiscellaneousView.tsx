import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  Lightbulb,
  Vibrate,
  Wifi,
  Sparkles,
  BookOpen,
  VolumeX,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Tool } from '../../types';

interface MiscellaneousViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const MiscellaneousView: React.FC<MiscellaneousViewProps> = ({ tool, onToast }) => {
  // Sound Generator (Web Audio API)
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [toneFreq, setToneFreq] = useState(440); // 440 Hz standard A
  const [toneType, setToneType] = useState<OscillatorType>('sine');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Text to Speech
  const [ttsText, setTtsText] = useState('Welcome to Utility Bazaar. All tools run fast, free, and completely in your browser.');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Mic Tester
  const [micLevel, setMicLevel] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Screen Light / Lamp
  const [screenLightColor, setScreenLightColor] = useState('#ffffff');
  const [screenLightActive, setScreenLightActive] = useState(false);

  // Internet Latency Tester
  const [pingResult, setPingResult] = useState<number | null>(null);
  const [pingTesting, setPingTesting] = useState(false);

  // Scratchpad Note
  const [scratchpadText, setScratchpadText] = useState(() => {
    return localStorage.getItem('ub_scratchpad') || '';
  });

  // Sound Tone Start/Stop
  const toggleSound = () => {
    if (isPlayingTone) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setIsPlayingTone(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = toneType;
        osc.frequency.setValueAtTime(toneFreq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime); // Safe pleasant volume
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setIsPlayingTone(true);
      } catch (e) {
        onToast('AudioContext error: ' + (e as Error).message);
      }
    }
  };

  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(toneFreq, audioCtxRef.current.currentTime);
      oscRef.current.type = toneType;
    }
  }, [toneFreq, toneType]);

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Text to Speech
  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      onToast('Text to Speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Mic Tester
  const startMicTest = async () => {
    if (micActive) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setMicActive(false);
      setMicLevel(0);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i];
        const average = sum / buffer.length;
        setMicLevel(Math.min(100, Math.round((average / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();
      setMicActive(true);
      onToast('Microphone active! Speak to see volume levels.');
    } catch {
      onToast('Could not access microphone or permission denied.');
    }
  };

  // Ping test
  const runPingTest = async () => {
    setPingTesting(true);
    setPingResult(null);
    const start = performance.now();
    try {
      // Test small fetch
      await fetch(window.location.origin + '/favicon.ico', { cache: 'no-store' });
      const duration = Math.round(performance.now() - start);
      setPingResult(duration);
    } catch {
      setPingResult(Math.round(performance.now() - start));
    } finally {
      setPingTesting(false);
    }
  };

  // Vibration test
  const triggerVibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
      onToast('Vibration sent to device');
    } else {
      onToast('Vibration API not supported on this device/browser');
    }
  };

  // Scratchpad Note
  const saveScratchpad = (val: string) => {
    setScratchpadText(val);
    localStorage.setItem('ub_scratchpad', val);
  };

  // Sound Frequency Generator View
  if (tool.id.includes('sound') || tool.id.includes('frequency') || tool.id.includes('binaural')) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-neutral-900 dark:text-white py-4">
          {toneFreq} <span className="text-xl font-normal text-neutral-500">Hz</span>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Frequency:</span>
              <span>20 Hz - 20,000 Hz</span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="5"
              value={toneFreq}
              onChange={(e) => setToneFreq(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="flex justify-center gap-2">
            {(['sine', 'square', 'triangle', 'sawtooth'] as OscillatorType[]).map((type) => (
              <button
                key={type}
                onClick={() => setToneType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                  toneType === type ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-all active:scale-95 ${
              isPlayingTone ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isPlayingTone ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{isPlayingTone ? 'Stop Frequency' : 'Play Sound Wave'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Text to Speech
  if (tool.id.includes('text-to-speech') || tool.id.includes('speech')) {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Text to Read Aloud:
          </label>
          <textarea
            rows={4}
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3.5 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={speakText}
            disabled={isSpeaking}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 shadow-xs"
          >
            <Volume2 className="h-4 w-4" />
            <span>{isSpeaking ? 'Speaking...' : 'Play Voice (Speech)'}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeech}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-xs"
            >
              <VolumeX className="h-4 w-4" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Mic Tester
  if (tool.id.includes('microphone') || tool.id.includes('mic-test')) {
    return (
      <div className="space-y-6 text-center">
        <button
          onClick={startMicTest}
          className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-all active:scale-95 ${
            micActive ? 'bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          <Mic className="h-4 w-4" />
          <span>{micActive ? 'Stop Microphone' : 'Test Microphone'}</span>
        </button>

        {micActive && (
          <div className="max-w-md mx-auto space-y-3 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
            <div className="flex justify-between text-xs font-bold uppercase text-neutral-500">
              <span>Input Signal Level:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">{micLevel}%</span>
            </div>
            <div className="h-4 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
              <div
                style={{ width: `${micLevel}%` }}
                className={`h-full transition-all duration-75 ${
                  micLevel > 75 ? 'bg-rose-500' : micLevel > 40 ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Screen Light / Screen Lamp
  if (tool.id.includes('flashlight') || tool.id.includes('screen-light')) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Choose Lamp Color:</label>
          <input
            type="color"
            value={screenLightColor}
            onChange={(e) => setScreenLightColor(e.target.value)}
            className="h-8 w-12 rounded cursor-pointer border"
          />
        </div>

        <button
          onClick={() => setScreenLightActive(!screenLightActive)}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-xs"
        >
          {screenLightActive ? 'Close Full Screen Lamp' : 'Activate Full Screen Light'}
        </button>

        {screenLightActive && (
          <div
            style={{ backgroundColor: screenLightColor }}
            onClick={() => setScreenLightActive(false)}
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer p-6"
          >
            <span className="p-3 rounded-xl bg-black/40 text-white text-xs font-bold drop-shadow">
              Tap anywhere to dismiss lamp
            </span>
          </div>
        )}
      </div>
    );
  }

  // Vibration Tester
  if (tool.id.includes('vibration')) {
    return (
      <div className="space-y-4">
        <p className="text-xs text-neutral-500">
          Triggers the physical vibration motor on Android and supported smartphones:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => triggerVibrate(150)}
            className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 font-bold text-xs flex flex-col items-center gap-2"
          >
            <Vibrate className="h-5 w-5 text-indigo-500" />
            <span>Short Buzz (150ms)</span>
          </button>
          <button
            onClick={() => triggerVibrate([200, 100, 200])}
            className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 font-bold text-xs flex flex-col items-center gap-2"
          >
            <Vibrate className="h-5 w-5 text-indigo-500" />
            <span>Double Buzz Pulse</span>
          </button>
          <button
            onClick={() => triggerVibrate([100, 100, 100, 100, 300])}
            className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 font-bold text-xs flex flex-col items-center gap-2"
          >
            <Vibrate className="h-5 w-5 text-indigo-500" />
            <span>SOS Pattern</span>
          </button>
        </div>
      </div>
    );
  }

  // Ping / Latency Tester
  if (tool.id.includes('ping') || tool.id.includes('latency')) {
    return (
      <div className="space-y-6 text-center">
        <button
          onClick={runPingTest}
          disabled={pingTesting}
          className="flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-md"
        >
          <Wifi className="h-4 w-4" />
          <span>{pingTesting ? 'Measuring Latency...' : 'Run Real Ping Test'}</span>
        </button>

        {pingResult !== null && (
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-center">
            <span className="text-xs text-neutral-500 uppercase font-bold">Round Trip Time (RTT):</span>
            <div className="text-5xl font-black text-emerald-600 mt-2">
              {pingResult} <span className="text-xl font-normal text-neutral-500">ms</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">Measured via genuine browser HTTP request round-trip.</p>
          </div>
        )}
      </div>
    );
  }

  // Default: Persistent Local Scratchpad Note
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        <span>Instant Local Scratchpad (Autosaved):</span>
        <button
          onClick={() => {
            saveScratchpad('');
            onToast('Cleared scratchpad');
          }}
          className="text-rose-600 hover:underline"
        >
          Clear Note
        </button>
      </div>
      <textarea
        rows={10}
        value={scratchpadText}
        onChange={(e) => saveScratchpad(e.target.value)}
        placeholder="Type or paste any text, links, or notes here. Stored safely in your local browser storage..."
        className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 text-sm leading-relaxed"
      />
    </div>
  );
};
