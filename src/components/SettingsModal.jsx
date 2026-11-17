import React, { useRef } from 'react';
import { X, Download, Upload, RotateCcw } from 'lucide-react';
import { ACCENT_THEMES, SEARCH_ENGINES, DEFAULT_BOOKMARKS } from '../constants/defaults';

export default function SettingsModal({
  isOpen,
  onClose,
  userName,
  setUserName,
  githubUser,
  setGithubUser,
  is24h,
  setIs24h,
  themeId,
  setThemeId,
  searchEngineId,
  setSearchEngineId,
  bookmarks,
  setBookmarks,
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExportData = () => {
    const data = {
      userName,
      githubUser,
      is24h,
      themeId,
      searchEngineId,
      bookmarks,
      todos: JSON.parse(localStorage.getItem('devtab_todos') || '[]'),
      scratchpad: localStorage.getItem('devtab_scratchpad') || '',
      version: 1,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devtab-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.userName) setUserName(parsed.userName);
        if (parsed.githubUser) setGithubUser(parsed.githubUser);
        if (typeof parsed.is24h === 'boolean') setIs24h(parsed.is24h);
        if (parsed.themeId) setThemeId(parsed.themeId);
        if (parsed.searchEngineId) setSearchEngineId(parsed.searchEngineId);
        if (Array.isArray(parsed.bookmarks)) setBookmarks(parsed.bookmarks);
        if (Array.isArray(parsed.todos)) localStorage.setItem('devtab_todos', JSON.stringify(parsed.todos));
        if (typeof parsed.scratchpad === 'string') localStorage.setItem('devtab_scratchpad', JSON.stringify(parsed.scratchpad));
      } catch (err) {
        console.error('Import failed', err);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset preferences and bookmarks to default?')) {
      setUserName('Andrej');
      setGithubUser('Andreyy05');
      setIs24h(true);
      setThemeId('blue');
      setSearchEngineId('google');
      setBookmarks(DEFAULT_BOOKMARKS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#16171d]/95 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden p-6 relative max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white/95">
            Preferences
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Andrej"
                className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-white/[0.25] text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                GitHub Account
              </label>
              <input
                type="text"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value)}
                placeholder="Andreyy05"
                className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-white/[0.25] text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {Object.values(ACCENT_THEMES).map((theme) => {
                const isSelected = theme.id === themeId;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#16171d]' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: theme.primary }}
                    title={theme.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Search Engine & Clock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Search Engine
              </label>
              <select
                value={searchEngineId}
                onChange={(e) => setSearchEngineId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#1c1d25] border border-white/[0.08] focus:border-white/[0.25] text-xs text-white outline-none"
              >
                {Object.values(SEARCH_ENGINES).map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Clock
              </label>
              <button
                type="button"
                onClick={() => setIs24h(!is24h)}
                className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs text-neutral-300 flex items-center justify-between"
              >
                <span>{is24h ? '24 Hours' : '12 Hours'}</span>
              </button>
            </div>
          </div>

          {/* Backup */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-neutral-300 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-neutral-300 transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span>Import</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </div>

            <button
              onClick={handleResetDefaults}
              className="text-[11px] text-neutral-500 hover:text-red-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium bg-white text-black hover:bg-neutral-200 transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
