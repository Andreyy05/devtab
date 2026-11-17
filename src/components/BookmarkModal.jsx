import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function BookmarkModal({ isOpen, onClose, onSave, editingBookmark, existingCategories = [] }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Favorites');
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title || '');
      setUrl(editingBookmark.url || '');
      setCategory(editingBookmark.category || 'Favorites');
    } else {
      setTitle('');
      setUrl('');
      setCategory('Favorites');
      setCustomCategory('');
    }
  }, [editingBookmark, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const finalCategory = category === '__custom__' ? (customCategory.trim() || 'General') : category;

    onSave({
      id: editingBookmark ? editingBookmark.id : Date.now().toString(),
      title: title.trim(),
      url: finalUrl,
      category: finalCategory,
    });
    onClose();
  };

  const handleUrlBlur = () => {
    if (!title && url) {
      try {
        let clean = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
        clean = clean.split('/')[0].split('.')[0];
        if (clean) {
          setTitle(clean.charAt(0).toUpperCase() + clean.slice(1));
        }
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#16171d]/95 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden p-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white/95">
            {editingBookmark ? 'Edit Bookmark' : 'New Bookmark'}
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              URL
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="e.g. github.com"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-white/[0.25] text-xs text-white placeholder-neutral-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GitHub"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-white/[0.25] text-xs text-white placeholder-neutral-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Folder
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1c1d25] border border-white/[0.08] focus:border-white/[0.25] text-xs text-white outline-none transition-all"
            >
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">+ New Folder...</option>
            </select>

            {category === '__custom__' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Folder name"
                className="mt-2 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-white/[0.25] text-xs text-white placeholder-neutral-500 outline-none transition-all"
                autoFocus
              />
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-medium bg-white text-black hover:bg-neutral-200 transition-all active:scale-95"
            >
              {editingBookmark ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
