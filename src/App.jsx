import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BookmarkGrid from './components/BookmarkGrid';
import GitHubWidget from './components/GitHubWidget';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ACCENT_THEMES, DEFAULT_BOOKMARKS } from './constants/defaults';

export default function App() {
  const [userName, setUserName] = useLocalStorage('devtab_username', 'Andrej');
  const [githubUser, setGithubUser] = useLocalStorage('devtab_gh_user', 'Andreyy05');
  const [is24h, setIs24h] = useLocalStorage('devtab_is24h', true);
  const [themeId, setThemeId] = useLocalStorage('devtab_theme', 'emerald');
  const [searchEngineId, setSearchEngineId] = useLocalStorage('devtab_engine', 'google');
  const [bookmarks, setBookmarks] = useLocalStorage('devtab_bookmarks', DEFAULT_BOOKMARKS);

  const accentTheme = ACCENT_THEMES[themeId] || ACCENT_THEMES.emerald;

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
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-500/30">
      <Header
        userName={userName}
        is24h={is24h}
        onOpenSettings={() => console.log('open settings')}
        onOpenShortcuts={() => console.log('open shortcuts')}
        accentTheme={accentTheme}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex-1 flex flex-col items-center py-2">
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

        <section className="w-full max-w-7xl mx-auto my-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GitHubWidget
            username={githubUser}
            accentTheme={accentTheme}
          />
        </section>
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
