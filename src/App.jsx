import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BookmarkGrid from './components/BookmarkGrid';
import GitHubWidget from './components/GitHubWidget';
import ScratchpadWidget from './components/ScratchpadWidget';
import SettingsModal from './components/SettingsModal';
import ShortcutsModal from './components/ShortcutsModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ACCENT_THEMES, DEFAULT_BOOKMARKS } from './constants/defaults';

export default function App() {
  const [userName, setUserName] = useLocalStorage('devtab_username', 'Andrej');
  const [githubUser, setGithubUser] = useLocalStorage('devtab_gh_user', 'Andreyy05');
  const [is24h, setIs24h] = useLocalStorage('devtab_is24h', true);
  const [themeId, setThemeId] = useLocalStorage('devtab_theme', 'blue');
  const [searchEngineId, setSearchEngineId] = useLocalStorage('devtab_engine', 'google');
  const [bookmarks, setBookmarks] = useLocalStorage('devtab_bookmarks', DEFAULT_BOOKMARKS);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const accentTheme = ACCENT_THEMES[themeId] || ACCENT_THEMES.blue;

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '?' || ((e.metaKey || e.ctrlKey) && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 's' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveBookmark = (bookmark) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === bookmark.id);
      if (exists) {
        return prev.map((b) => (b.id === bookmark.id ? bookmark : b));
      }
      return [bookmark, ...prev];
    });
  };

  const handleDeleteBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-white/20 selection:text-white pb-6">
      <div>
        <Header
          userName={userName}
          is24h={is24h}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          accentTheme={accentTheme}
        />

        <main className="w-full flex flex-col items-center">
          <SearchBar
            activeEngineId={searchEngineId}
            onSelectEngine={setSearchEngineId}
            bookmarks={bookmarks}
            accentTheme={accentTheme}
          />

          <BookmarkGrid
            bookmarks={bookmarks}
            onSaveBookmark={handleSaveBookmark}
            onDeleteBookmark={handleDeleteBookmark}
            accentTheme={accentTheme}
          />

          {/* Cupertino Widgets Grid */}
          <section className="w-full max-w-6xl mx-auto my-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <GitHubWidget
              username={githubUser}
              accentTheme={accentTheme}
            />
            <ScratchpadWidget
              accentTheme={accentTheme}
            />
          </section>
        </main>
      </div>

      {/* Minimal Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between text-[11px] text-neutral-400">
        <div>
          <span>DevTab</span>
          <span className="mx-2 text-neutral-500">·</span>
          <span>Crafted by </span>
          <a
            href="https://github.com/Andreyy05"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white transition-colors"
          >
            Andrej Pavliščak
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-neutral-300 font-mono text-[10px]">⌘K</kbd> to search</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-neutral-300 font-mono text-[10px]">S</kbd> settings</span>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        setUserName={setUserName}
        githubUser={githubUser}
        setGithubUser={setGithubUser}
        is24h={is24h}
        setIs24h={setIs24h}
        themeId={themeId}
        setThemeId={setThemeId}
        searchEngineId={searchEngineId}
        setSearchEngineId={setSearchEngineId}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
