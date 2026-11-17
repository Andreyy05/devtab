import React, { useRef } from 'react';
import { X, Settings, Download, Upload, RotateCcw, Palette, User, Clock, Search } from 'lucide-react';
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
        alert('Data successfully imported!');
      } catch (err) {
        alert('Failed to parse backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all bookmarks and settings to defaults?')) {
      setUserName('Andrej');
      setGithubUser('Andreyy05');
      setIs24h(true);
      setThemeId('emerald');
      setSearchEngineId('google');
      setBookmarks(DEFAULT_BOOKMARKS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            DevTab Preferences
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-5">
          {/* User & GitHub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Greeting Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Andrej"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                GitHub Username
              </label>
              <input
                type="text"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value)}
                placeholder="Andreyy05"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 text-sm text-white outline-none"
              />
            </div>
          </div>

          {/* Theme Accent */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Theme Accent
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(ACCENT_THEMES).map((theme) => {
                const isSelected = theme.id === themeId;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-neutral-500 bg-neutral-800 text-white font-semibold'
                        : 'border-neutral-800/80 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span>{theme.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Engine & Clock Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Default Engine
              </label>
              <select
                value={searchEngineId}
                onChange={(e) => setSearchEngineId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 text-sm text-white outline-none"
              >
                {Object.values(SEARCH_ENGINES).map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Clock Format
              </label>
              <button
                type="button"
                onClick={() => setIs24h(!is24h)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-sm text-white flex items-center justify-between"
              >
                <span>{is24h ? '24-Hour (14:30)' : '12-Hour (2:30 PM)'}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                  Toggle
                </span>
              </button>
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="pt-2 border-t border-neutral-800">
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Data Backup & Sync
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Import JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />

              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-950 hover:bg-rose-950/40 text-xs font-semibold text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
