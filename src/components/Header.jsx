import React, { useState, useEffect } from 'react';
import { Settings, Command } from 'lucide-react';

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
    let ampm = '';

    if (!is24h) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12 || 12;
    }
    const formattedHours = String(hours).padStart(2, '0');
    return { formattedHours, minutes, ampm };
  };

  const formatDate = () => {
    return time.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const { formattedHours, minutes, ampm } = formatTime();

  return (
    <header className="w-full max-w-6xl mx-auto pt-10 pb-4 px-6 flex items-center justify-between">
      {/* Left: Refined Greeting & Date */}
      <div>
        <p className="text-xs font-medium text-neutral-400 tracking-wide uppercase">
          {formatDate()}
        </p>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mt-0.5">
          {getGreeting()}, <span className="text-neutral-300 font-normal">{userName || 'Developer'}</span>
        </h1>
      </div>

      {/* Center: Apple-style Clock */}
      <div className="flex items-baseline font-light tracking-tighter select-none">
        <span className="text-4xl sm:text-5xl font-medium text-white/95">
          {formattedHours}:{minutes}
        </span>
        {ampm && (
          <span className="text-xs font-medium text-neutral-400 ml-1.5 uppercase tracking-wider">
            {ampm}
          </span>
        )}
      </div>

      {/* Right: Minimal Frosted Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (⌘ / ?)"
          className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] backdrop-blur-xl flex items-center justify-center text-neutral-300 hover:text-white transition-all shadow-sm active:scale-95"
        >
          <Command className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenSettings}
          title="Preferences"
          className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] backdrop-blur-xl flex items-center justify-center text-neutral-300 hover:text-white transition-all shadow-sm active:scale-95"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
