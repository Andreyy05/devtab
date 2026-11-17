import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘K or /', desc: 'Spotlight Search' },
    { key: 'Esc', desc: 'Dismiss focus or modal' },
    { key: 'S', desc: 'Open Preferences' },
    { key: '?', desc: 'Keyboard Shortcuts' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xs bg-[#16171d]/95 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden p-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white/95">
            Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3.5 space-y-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-white/[0.02] text-xs"
            >
              <span className="text-neutral-400 font-normal">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white/[0.08] text-white font-mono text-[11px] font-medium tracking-wider">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1 rounded-xl text-xs font-medium bg-white text-black hover:bg-neutral-200 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
