import React, { useState, useEffect } from 'react';
import { Terminal, Settings, HelpCircle, Sparkles } from 'lucide-react';

export default function Header({ userName, is24h, onOpenSettings, onOpenShortcuts, accentTheme }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 5) return 'Good night';
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    let ampm = '';

    if (!is24h) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12 || 12;
    }
    const formattedHours = String(hours).padStart(2, '0');
    return { formattedHours, minutes, seconds, ampm };
  };

  const formatDate = () => {
    return time.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const { formattedHours, minutes, seconds, ampm } = formatTime();

  return (
    <header className="w-full max-w-7xl mx-auto pt-8 pb-4 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Brand & Greeting */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-lg relative group">
          <Terminal className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              DevTab
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 font-mono font-normal">
                v1.0
              </span>
            </h1>
          </div>
          <p className="text-sm text-neutral-400 flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
            <span>{getGreeting()}, <strong className="text-neutral-200 font-medium">{userName || 'Developer'}</strong></span>
          </p>
        </div>
      </div>

      {/* Clock & Date */}
      <div className="flex flex-col items-center md:items-end">
        <div className="flex items-baseline gap-1 font-mono tracking-tight select-none">
          <span className="text-4xl sm:text-5xl font-extrabold text-white">
            {formattedHours}:{minutes}
          </span>
          <span className="text-xl sm:text-2xl font-semibold text-neutral-500">
            :{seconds}
          </span>
          {ampm && (
            <span className="text-sm font-semibold text-emerald-400 ml-1">
              {ampm}
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-400 mt-1 font-medium tracking-wide">
          {formatDate()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
          className="p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all shadow-sm"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenSettings}
          title="Settings (S)"
          className="p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all shadow-sm group"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </header>
  );
}
