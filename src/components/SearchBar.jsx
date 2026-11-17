import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Shield, Layers, BookOpen, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { SEARCH_ENGINES } from '../constants/defaults';
import { GithubIcon, GoogleIcon } from './Icons';

const ENGINE_ICONS = {
  google: GoogleIcon,
  github: GithubIcon,
  duckduckgo: Shield,
  stackoverflow: Layers,
  mdn: BookOpen,
  perplexity: Sparkles,
};

export default function SearchBar({ activeEngineId, onSelectEngine, bookmarks = [], accentTheme }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEngineMenu, setShowEngineMenu] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const engine = SEARCH_ENGINES[activeEngineId] || SEARCH_ENGINES.google;
  const EngineIcon = ENGINE_ICONS[engine.id] || Search;

  // Global shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setIsFocused(false);
        setShowEngineMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close engine menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowEngineMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Direct URL check
    const isUrl = /^https?:\/\//i.test(trimmed) || 
      /^[a-zA-Z0-9-]+\.(com|org|net|dev|io|cz|sk|app|ai|me|co)(\/.*)?$/i.test(trimmed) ||
      /^localhost(:\d+)?/i.test(trimmed);

    if (isUrl) {
      const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      window.location.href = url;
      return;
    }

    // Normal search
    window.location.href = `${engine.url}${encodeURIComponent(trimmed)}`;
  };

  // Filter matching bookmarks
  const matchingBookmarks = query.trim().length > 1
    ? bookmarks.filter((b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.url.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4 relative z-30">
      <form
        onSubmit={handleSearch}
        className={`relative flex items-center bg-neutral-900/90 backdrop-blur-xl border rounded-2xl transition-all duration-200 shadow-2xl ${
          isFocused
            ? `${accentTheme.border} ring-2 ring-emerald-500/20 bg-neutral-900`
            : 'border-neutral-800 hover:border-neutral-700'
        }`}
      >
        {/* Engine Selector Dropdown Button */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowEngineMenu(!showEngineMenu)}
            className="flex items-center gap-2 pl-4 pr-3 py-3.5 text-neutral-300 hover:text-white transition-colors border-r border-neutral-800"
            title="Switch search engine"
          >
            <EngineIcon className="w-5 h-5 text-emerald-400" />
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {engine.name}
            </span>
          </button>

          {/* Engine Menu Dropdown */}
          {showEngineMenu && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50">
              <div className="text-[10px] font-bold text-neutral-500 uppercase px-2.5 py-1 tracking-wider">
                Select Engine
              </div>
              {Object.values(SEARCH_ENGINES).map((eng) => {
                const Icon = ENGINE_ICONS[eng.id] || Search;
                const isSelected = eng.id === engine.id;
                return (
                  <button
                    key={eng.id}
                    type="button"
                    onClick={() => {
                      onSelectEngine(eng.id);
                      setShowEngineMenu(false);
                      inputRef.current?.focus();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{eng.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={engine.placeholder}
          className="flex-1 bg-transparent px-4 py-3.5 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1.5 mr-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Shortcut Indicator */}
        <div className="pr-4 flex items-center">
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-400 bg-neutral-800/80 border border-neutral-700/60 rounded-md">
            /
          </kbd>
        </div>
      </form>

      {/* Bookmark quick match suggestions */}
      {isFocused && matchingBookmarks.length > 0 && (
        <div className="absolute left-4 right-4 top-full mt-2 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-40 p-1">
          <div className="text-[10px] font-bold text-neutral-500 uppercase px-3 py-1.5 tracking-wider">
            Matching Bookmarks
          </div>
          {matchingBookmarks.map((b) => (
            <a
              key={b.id}
              href={b.url}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-neutral-800 text-neutral-200 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${b.url}&sz=32`}
                  alt=""
                  className="w-4 h-4 rounded"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <span className="font-medium text-white">{b.title}</span>
                <span className="text-neutral-500 font-mono text-[11px] truncate max-w-xs">{b.url}</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
