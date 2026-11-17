import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { SEARCH_ENGINES } from '../constants/defaults';

export default function SearchBar({ activeEngineId, onSelectEngine, bookmarks = [], accentTheme }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEngineMenu, setShowEngineMenu] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const engine = SEARCH_ENGINES[activeEngineId] || SEARCH_ENGINES.google;

  // Shortcuts: '/' or 'Cmd+K' to focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && !isInput) {
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

    // Check if input is a valid URL
    const isUrl = /^https?:\/\//i.test(trimmed) || 
      /^[a-zA-Z0-9-]+\.(com|org|net|dev|io|cz|sk|app|ai|me|co)(\/.*)?$/i.test(trimmed) ||
      /^localhost(:\d+)?/i.test(trimmed);

    if (isUrl) {
      const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      window.location.href = url;
      return;
    }

    window.location.href = `${engine.url}${encodeURIComponent(trimmed)}`;
  };

  const matchingBookmarks = query.trim().length > 1
    ? bookmarks.filter((b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.url.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4 relative z-30">
      {/* Spotlight Bar */}
      <form
        onSubmit={handleSearch}
        className={`relative flex items-center bg-white/[0.05] hover:bg-white/[0.07] backdrop-blur-2xl border rounded-2xl transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.36)] ${
          isFocused
            ? 'border-white/[0.22] bg-white/[0.09] ring-4 ring-white/[0.04]'
            : 'border-white/[0.08]'
        }`}
      >
        <div className="pl-4.5 pr-1 flex items-center text-neutral-400">
          <Search className="w-4 h-4 text-neutral-400/80 stroke-[2.2]" />
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
          className="flex-1 bg-transparent px-3 py-3.5 text-sm sm:text-base text-white/95 placeholder-neutral-500 font-normal focus:outline-none"
        />

        {/* Engine selector pill */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowEngineMenu(!showEngineMenu)}
            className="flex items-center gap-1 px-2.5 py-1 mr-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[11px] font-medium text-neutral-300 transition-colors border border-white/[0.06]"
          >
            <span>{engine.name}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {showEngineMenu && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#16171d]/95 backdrop-blur-3xl border border-white/[0.1] rounded-xl shadow-2xl p-1 z-50 animate-fadeIn">
              {Object.values(SEARCH_ENGINES).map((eng) => (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => {
                    onSelectEngine(eng.id);
                    setShowEngineMenu(false);
                    inputRef.current?.focus();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    eng.id === engine.id
                      ? 'bg-white/[0.1] text-white font-medium'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{eng.name}</span>
                  {eng.id === engine.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shortcut Badge */}
        {!query && (
          <div className="pr-4 hidden sm:flex items-center">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 bg-white/[0.06] border border-white/[0.08] rounded-md tracking-wider">
              ⌘K
            </kbd>
          </div>
        )}

        {/* Clear query */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="mr-3 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Suggested bookmarks */}
      {isFocused && matchingBookmarks.length > 0 && (
        <div className="absolute left-4 right-4 top-full mt-2 bg-[#16171d]/95 backdrop-blur-3xl border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-40 p-1.5">
          {matchingBookmarks.map((b) => (
            <a
              key={b.id}
              href={b.url}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.06] text-neutral-200 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${b.url}&sz=32`}
                  alt=""
                  className="w-4 h-4 rounded-md"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <span className="font-medium text-white/90">{b.title}</span>
                <span className="text-neutral-500 font-normal text-[11px] truncate max-w-xs">{b.url}</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
