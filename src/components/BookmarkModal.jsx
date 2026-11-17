import React, { useState, useEffect } from 'react';
import { X, Plus, Globe } from 'lucide-react';

export default function BookmarkModal({ isOpen, onClose, onSave, editingBookmark, existingCategories = [] }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Daily Dev');
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title || '');
      setUrl(editingBookmark.url || '');
      setCategory(editingBookmark.category || 'Daily Dev');
    } else {
      setTitle('');
      setUrl('');
      setCategory('Daily Dev');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            {editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              URL
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://github.com or localhost:3000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GitHub"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white outline-none transition-all"
            >
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">+ New Category...</option>
            </select>

            {category === '__custom__' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter new category name"
                className="mt-2 w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 text-sm text-white placeholder-neutral-500 outline-none transition-all"
                autoFocus
              />
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all"
            >
              {editingBookmark ? 'Save Changes' : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
