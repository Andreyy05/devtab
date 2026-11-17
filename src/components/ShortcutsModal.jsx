import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        onClose ? onClose(!isOpen) : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', desc: 'Focus omni-search input' },
    { key: 'Esc', desc: 'Blur search or close modals' },
    { key: '?', desc: 'Toggle this keyboard shortcut helper' },
    { key: 'Tab', desc: 'Navigate through bookmarks and controls' },
    { key: 'Enter', desc: 'Perform search or execute URL' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Command className="w-4 h-4 text-emerald-400" />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/60 text-xs"
            >
              <span className="text-neutral-300 font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-[11px] font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
