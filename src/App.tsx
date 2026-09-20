import { useState, useEffect, useCallback, useRef } from 'react';

type Mode = 'focus' | 'shortBreak' | 'longBreak';

interface Settings {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

interface SessionRecord {
  date: string; // YYYY-MM-DD
  mode: Mode;
  duration: number; // in seconds
  completedAt: number; // timestamp
}

interface Stats {
  sessions: SessionRecord[];
}

const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem('pomodoro-settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_SETTINGS;
}

function loadStats(): Stats {
  try {
    const saved = localStorage.getItem('pomodoro-stats');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { sessions: [] };
}

function saveSettings(settings: Settings) {
  localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
}

function saveStats(stats: Stats) {
  localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
}

function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();

    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.3) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Pleasant three-tone chime: C5 → E5 → G5
    const now = ctx.currentTime;
    playTone(523.25, now, 0.4, 0.3);        // C5
    playTone(659.25, now + 0.15, 0.4, 0.3); // E5
    playTone(783.99, now + 0.3, 0.6, 0.35); // G5 (longer sustain)

    // Second chime after a short pause
    playTone(523.25, now + 0.8, 0.4, 0.25);
    playTone(659.25, now + 0.95, 0.4, 0.25);
    playTone(783.99, now + 1.1, 0.8, 0.3);

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 3000);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}

const MODE_CONFIG: Record<Mode, { label: string; color: string; bgGradient: string; ringColor: string; btnColor: string }> = {
  focus: {
    label: 'Focus',
    color: 'text-rose-600',
    bgGradient: 'from-rose-50 to-orange-50',
    ringColor: 'stroke-rose-500',
    btnColor: 'bg-rose-500 hover:bg-rose-600',
  },
  shortBreak: {
    label: 'Short Break',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    ringColor: 'stroke-emerald-500',
    btnColor: 'bg-emerald-500 hover:bg-emerald-600',
  },
  longBreak: {
    label: 'Long Break',
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    ringColor: 'stroke-blue-500',
    btnColor: 'bg-blue-500 hover:bg-blue-600',
  },
};

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [stats, setStats] = useState<Stats>(loadStats);
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<Settings>(loadSettings);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('pomodoro-sound');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const initialTimeRef = useRef<number>(settings.focus * 60);

  const totalTime = settings[mode === 'focus' ? 'focus' : mode === 'shortBreak' ? 'shortBreak' : 'longBreak'] * 60;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;

  // Get today's stats
  const today = getToday();
  const todaySessions = stats.sessions.filter(s => s.date === today);
  const todayFocusSessions = todaySessions.filter(s => s.mode === 'focus');
  const todayFocusMinutes = Math.round(
    todayFocusSessions.reduce((acc, s) => acc + s.duration, 0) / 60
  );

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      initialTimeRef.current = timeLeft;
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            // Play notification sound
            if (soundEnabledRef.current) {
              playNotificationSound();
            }
            // Record completed session
            const duration = initialTimeRef.current;
            const newSession: SessionRecord = {
              date: getToday(),
              mode,
              duration,
              completedAt: Date.now(),
            };
            setStats(prev => {
              const updated = { sessions: [...prev.sessions, newSession] };
              saveStats(updated);
              return updated;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  // Update document title
  useEffect(() => {
    document.title = isRunning
      ? `${formatTime(timeLeft)} - ${MODE_CONFIG[mode].label} | Pomodoro`
      : 'Pomodoro Focus Timer';
  }, [timeLeft, isRunning, mode]);

  const handleStart = useCallback(() => {
    if (timeLeft > 0) setIsRunning(true);
  }, [timeLeft]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    const duration = mode === 'focus' ? settings.focus : mode === 'shortBreak' ? settings.shortBreak : settings.longBreak;
    setTimeLeft(duration * 60);
  }, [mode, settings]);

  const handleModeChange = useCallback((newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    const duration = newMode === 'focus' ? settings.focus : newMode === 'shortBreak' ? settings.shortBreak : settings.longBreak;
    setTimeLeft(duration * 60);
  }, [settings]);

  const handleSaveSettings = useCallback(() => {
    setSettings(tempSettings);
    saveSettings(tempSettings);
    // Reset timer with new settings if not running
    if (!isRunning) {
      const duration = mode === 'focus' ? tempSettings.focus : mode === 'shortBreak' ? tempSettings.shortBreak : tempSettings.longBreak;
      setTimeLeft(duration * 60);
    }
    setShowSettings(false);
  }, [tempSettings, mode, isRunning]);

  const handleClearStats = useCallback(() => {
    const cleared = { sessions: [] };
    setStats(cleared);
    saveStats(cleared);
  }, []);

  // SVG circle progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const config = MODE_CONFIG[mode];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} transition-all duration-700 flex flex-col items-center justify-center p-4`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          🍅 Pomodoro Timer
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Stay focused, take breaks</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm">
        {(['focus', 'shortBreak', 'longBreak'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              mode === m
                ? `${MODE_CONFIG[m].btnColor} text-white shadow-md`
                : 'text-gray-600 hover:bg-white/60'
            }`}
          >
            {MODE_CONFIG[m].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative mb-8">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={`${config.ringColor} transition-all duration-1000`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-mono font-bold ${config.color} tracking-wider`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-gray-400 mt-2 uppercase tracking-wide">
            {config.label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-10">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={timeLeft === 0}
            className={`${config.btnColor} text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {timeLeft === totalTime ? '▶ Start' : '▶ Resume'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            ⏸ Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="bg-white hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-xl font-medium shadow-sm border border-gray-200 transition-all duration-200"
        >
          ↺ Reset
        </button>
        <button
          onClick={() => {
            const newVal = !soundEnabled;
            setSoundEnabled(newVal);
            localStorage.setItem('pomodoro-sound', JSON.stringify(newVal));
            if (newVal) playNotificationSound(); // Preview sound when enabling
          }}
          className={`px-4 py-3 rounded-xl font-medium shadow-sm border transition-all duration-200 ${
            soundEnabled
              ? 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-400 border-gray-200'
          }`}
          title={soundEnabled ? 'Sound on' : 'Sound off'}
        >
          {soundEnabled ? '🔔' : '🔕'}
        </button>
        <button
          onClick={() => {
            setTempSettings(settings);
            setShowSettings(!showSettings);
          }}
          className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-3 rounded-xl font-medium shadow-sm border border-gray-200 transition-all duration-200"
        >
          ⚙
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 w-full max-w-sm border border-white/50">
          <h3 className="font-semibold text-gray-700 mb-4 text-center">Custom Durations (minutes)</h3>
          <div className="space-y-4">
            {([
              { key: 'focus' as const, label: '🎯 Focus', min: 1, max: 120 },
              { key: 'shortBreak' as const, label: '☕ Short Break', min: 1, max: 30 },
              { key: 'longBreak' as const, label: '🌿 Long Break', min: 1, max: 60 },
            ]).map(({ key, label, min, max }) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-gray-600 font-medium">{label}</label>
                <input
                  type="number"
                  min={min}
                  max={max}
                  value={tempSettings[key]}
                  onChange={(e) => {
                    const val = Math.max(min, Math.min(max, parseInt(e.target.value) || min));
                    setTempSettings(prev => ({ ...prev, [key]: val }));
                  }}
                  className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveSettings}
            className="mt-5 w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Save Settings
          </button>
        </div>
      )}

      {/* Today's Statistics */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm w-full max-w-sm border border-white/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">📊 Today's Stats</h3>
          {todaySessions.length > 0 && (
            <button
              onClick={handleClearStats}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-500">{todayFocusSessions.length}</div>
            <div className="text-xs text-gray-500 mt-1">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">{todayFocusMinutes}</div>
            <div className="text-xs text-gray-500 mt-1">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{todaySessions.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
        </div>
        {todayFocusSessions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (todayFocusMinutes / (settings.focus * 8)) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {todayFocusMinutes}/{settings.focus * 8} min goal
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400">
        Data saved locally • {today === getToday() ? getToday() : ''}
      </p>
    </div>
  );
}
