import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Flag,
  Clock,
  Globe,
  Calendar,
  Copy,
  Check,
  Bell,
} from 'lucide-react';
import { Tool } from '../../types';

interface DateTimeViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const DateTimeView: React.FC<DateTimeViewProps> = ({ tool, onToast }) => {
  // Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  // Stopwatch States
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown Timer States
  const [countdownMinutes, setCountdownMinutes] = useState(5);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [countdownRemaining, setCountdownRemaining] = useState(300);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Pomodoro States
  const [pomoMode, setPomoMode] = useState<'work' | 'break'>('work');
  const [pomoTimeLeft, setPomoTimeLeft] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoSessions, setPomoSessions] = useState(0);
  const pomoRef = useRef<NodeJS.Timeout | null>(null);

  // Date Diff States
  const [date1, setDate1] = useState('2026-01-01');
  const [date2, setDate2] = useState('2026-12-31');

  // Add/Subtract Days State
  const [baseDate, setBaseDate] = useState('2026-09-12');
  const [daysToAdd, setDaysToAdd] = useState(30);

  // Unix Timestamp State
  const [unixInput, setUnixInput] = useState(Math.floor(Date.now() / 1000));
  const [dateForUnix, setDateForUnix] = useState('2026-09-12T12:00');

  // Leap Year Input
  const [leapYearInput, setLeapYearInput] = useState(2026);

  const [copied, setCopied] = useState(false);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch interval
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    } else if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [stopwatchRunning]);

  // Countdown interval
  useEffect(() => {
    if (countdownRunning && countdownRemaining > 0) {
      countdownRef.current = setInterval(() => {
        setCountdownRemaining((prev) => {
          if (prev <= 1) {
            setCountdownRunning(false);
            setCountdownFinished(true);
            onToast('⏰ Timer finished!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [countdownRunning, countdownRemaining, onToast]);

  // Pomodoro interval
  useEffect(() => {
    if (pomoRunning && pomoTimeLeft > 0) {
      pomoRef.current = setInterval(() => {
        setPomoTimeLeft((prev) => {
          if (prev <= 1) {
            if (pomoMode === 'work') {
              setPomoMode('break');
              setPomoSessions((s) => s + 1);
              onToast('☕ Great work! Take a 5-minute break.');
              return 5 * 60;
            } else {
              setPomoMode('work');
              onToast('💪 Break over! Time to focus.');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (pomoRef.current) {
      clearInterval(pomoRef.current);
    }
    return () => {
      if (pomoRef.current) clearInterval(pomoRef.current);
    };
  }, [pomoRunning, pomoTimeLeft, pomoMode, onToast]);

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Stopwatch View
  if (tool.id.includes('stopwatch')) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-neutral-900 dark:text-white py-6">
          {formatStopwatch(stopwatchTime)}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setStopwatchRunning(!stopwatchRunning)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-all active:scale-95 ${
              stopwatchRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {stopwatchRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{stopwatchRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={() => {
              if (stopwatchRunning) {
                setLaps([stopwatchTime, ...laps]);
              }
            }}
            disabled={!stopwatchRunning}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 disabled:opacity-50"
          >
            <Flag className="h-4 w-4" />
            <span>Lap</span>
          </button>

          <button
            onClick={() => {
              setStopwatchRunning(false);
              setStopwatchTime(0);
              setLaps([]);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>

        {laps.length > 0 && (
          <div className="max-w-md mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-850">
            <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase text-neutral-500">
              <span>Laps Recorded ({laps.length})</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(laps.map((l, i) => `Lap ${laps.length - i}: ${formatStopwatch(l)}`).join('\n'));
                  onToast('Copied all laps!');
                }}
                className="text-indigo-600 hover:underline"
              >
                Copy Laps
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-xs">
              {laps.map((lap, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-800">
                  <span className="text-neutral-500">Lap {laps.length - idx}</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Countdown Timer View
  if (tool.id.includes('countdown')) {
    return (
      <div className="space-y-6 text-center">
        <div className={`text-6xl sm:text-8xl font-black font-mono tracking-tight py-6 ${countdownFinished ? 'text-rose-600 animate-bounce' : 'text-neutral-900 dark:text-white'}`}>
          {formatSeconds(countdownRemaining)}
        </div>

        {!countdownRunning && (
          <div className="flex justify-center items-center gap-3">
            <label className="text-xs font-semibold text-neutral-600">Set Minutes:</label>
            <input
              type="number"
              min="1"
              max="120"
              value={countdownMinutes}
              onChange={(e) => {
                const m = parseInt(e.target.value) || 1;
                setCountdownMinutes(m);
                setCountdownRemaining(m * 60 + countdownSeconds);
                setCountdownFinished(false);
              }}
              className="w-20 rounded-xl border border-neutral-300 dark:border-neutral-700 p-2 text-center text-sm font-bold bg-white dark:bg-neutral-900"
            />
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              setCountdownRunning(!countdownRunning);
              setCountdownFinished(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-all ${
              countdownRunning ? 'bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {countdownRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{countdownRunning ? 'Pause' : 'Start Countdown'}</span>
          </button>
          <button
            onClick={() => {
              setCountdownRunning(false);
              setCountdownRemaining(countdownMinutes * 60 + countdownSeconds);
              setCountdownFinished(false);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    );
  }

  // Pomodoro View
  if (tool.id.includes('pomodoro')) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setPomoMode('work');
              setPomoTimeLeft(25 * 60);
              setPomoRunning(false);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              pomoMode === 'work' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
            }`}
          >
            Focus (25 min)
          </button>
          <button
            onClick={() => {
              setPomoMode('break');
              setPomoTimeLeft(5 * 60);
              setPomoRunning(false);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              pomoMode === 'break' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
            }`}
          >
            Break (5 min)
          </button>
        </div>

        <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-neutral-900 dark:text-white py-4">
          {formatSeconds(pomoTimeLeft)}
        </div>

        <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
          Completed Focus Sessions Today: {pomoSessions} 🍅
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setPomoRunning(!pomoRunning)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-all ${
              pomoRunning ? 'bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {pomoRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{pomoRunning ? 'Pause' : 'Start Focus'}</span>
          </button>
          <button
            onClick={() => {
              setPomoRunning(false);
              setPomoTimeLeft(pomoMode === 'work' ? 25 * 60 : 5 * 60);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    );
  }

  // World Clock View
  if (tool.id.includes('world-clock')) {
    const timezones = [
      { city: 'UTC (Coordinated Universal Time)', tz: 'UTC' },
      { city: 'London, UK', tz: 'Europe/London' },
      { city: 'New York, USA (EST)', tz: 'America/New_York' },
      { city: 'San Francisco, USA (PST)', tz: 'America/Los_Angeles' },
      { city: 'Dubai, UAE', tz: 'Asia/Dubai' },
      { city: 'Karachi, Pakistan (PKT)', tz: 'Asia/Karachi' },
      { city: 'New Delhi, India (IST)', tz: 'Asia/Kolkata' },
      { city: 'Tokyo, Japan (JST)', tz: 'Asia/Tokyo' },
      { city: 'Sydney, Australia', tz: 'Australia/Sydney' },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {timezones.map((tzItem) => {
          const tzTime = new Intl.DateTimeFormat('en-US', {
            timeZone: tzItem.tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !is24Hour,
          }).format(currentTime);

          const tzDate = new Intl.DateTimeFormat('en-US', {
            timeZone: tzItem.tz,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }).format(currentTime);

          return (
            <div
              key={tzItem.tz}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-neutral-500">{tzItem.city}</span>
                <div className="text-2xl font-black font-mono text-neutral-900 dark:text-white mt-1">
                  {tzTime}
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 mt-2">{tzDate}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // Date Difference Calculator
  if (tool.id.includes('date-difference') || tool.id.includes('days-between')) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = (totalDays / 7).toFixed(1);
    const totalMonths = (totalDays / 30.4375).toFixed(1);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Start Date:</label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2.5 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">End Date:</label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2.5 text-sm font-semibold"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-center">
          <span className="text-xs text-neutral-500 uppercase font-semibold">Exact Difference:</span>
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
            {totalDays} Days
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Equivalent to approx. {totalWeeks} weeks or {totalMonths} months.
          </p>
        </div>
      </div>
    );
  }

  // Unix Timestamp Converter
  if (tool.id.includes('unix') || tool.id.includes('timestamp')) {
    const parsedDate = new Date(unixInput * 1000).toUTCString();
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Unix Epoch Seconds:
          </label>
          <input
            type="number"
            value={unixInput}
            onChange={(e) => setUnixInput(parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2.5 font-mono text-sm font-bold"
          />
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
          <span className="text-xs text-neutral-500 uppercase font-semibold">Human-Readable UTC Date:</span>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
            {parsedDate}
          </div>
        </div>
      </div>
    );
  }

  // Live Clock / Default
  return (
    <div className="space-y-6 text-center">
      <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-neutral-900 dark:text-white py-6">
        {currentTime.toLocaleTimeString([], { hour12: !is24Hour })}
      </div>
      <div className="text-base sm:text-lg font-semibold text-neutral-500 dark:text-neutral-400">
        {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <div>
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold hover:bg-neutral-200"
        >
          Toggle 12h / 24h format
        </button>
      </div>
    </div>
  );
};
