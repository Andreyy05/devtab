import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ACCENT_THEMES } from './constants/defaults';

export default function App() {
  const [userName, setUserName] = useLocalStorage('devtab_username', 'Andrej');
  const [is24h, setIs24h] = useLocalStorage('devtab_is24h', true);
  const [themeId, setThemeId] = useLocalStorage('devtab_theme', 'emerald');

  const accentTheme = ACCENT_THEMES[themeId] || ACCENT_THEMES.emerald;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-500/30">
      <Header
        userName={userName}
        is24h={is24h}
        onOpenSettings={() => console.log('open settings')}
        onOpenShortcuts={() => console.log('open shortcuts')}
        accentTheme={accentTheme}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex-1 flex flex-col items-center justify-center py-6 text-center text-neutral-400">
        <p>DevTab Startpage ready.</p>
      </main>

      <footer className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 border-t border-neutral-900 gap-2">
        <div>
          <span>Crafted with ❤️ for developers by </span>
          <a
            href="https://github.com/Andreyy05"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-emerald-400 transition-colors font-medium"
          >
            Andrej Pavliščak
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[10px]">?</kbd> for shortcuts</span>
        </div>
      </footer>
    </div>
  );
}
