import React, { useState, useMemo } from 'react';
import BookmarkCard from './BookmarkCard';
import BookmarkModal from './BookmarkModal';
import { Plus, LayoutGrid, Bookmark } from 'lucide-react';

export default function BookmarkGrid({ bookmarks, onSaveBookmark, onDeleteBookmark, accentTheme }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);

  const categories = useMemo(() => {
    const set = new Set();
    bookmarks.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    if (selectedCategory === 'All') return bookmarks;
    return bookmarks.filter((b) => b.category === selectedCategory);
  }, [bookmarks, selectedCategory]);

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBookmark(null);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full max-w-7xl mx-auto my-6 px-4 sm:px-6">
      {/* Section Header & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
            Workspaces & Bookmarks
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
            {filteredBookmarks.length}
          </span>
        </div>

        {/* Filter Pills + Add Button */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all ml-auto sm:ml-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Grid of Bookmarks */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={handleEdit}
              onDelete={onDeleteBookmark}
              accentTheme={accentTheme}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 border border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-sm text-neutral-500">No bookmarks in this category yet.</p>
          <button
            onClick={handleAddNew}
            className="mt-3 text-xs text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add one now
          </button>
        </div>
      )}

      {/* Modal */}
      <BookmarkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBookmark(null);
        }}
        onSave={onSaveBookmark}
        editingBookmark={editingBookmark}
        existingCategories={categories.length > 0 ? categories : ['Daily Dev', 'Reference', 'Tools', 'Cloud']}
      />
    </section>
  );
}
