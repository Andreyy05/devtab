import React, { useState, useMemo } from 'react';
import BookmarkCard from './BookmarkCard';
import BookmarkModal from './BookmarkModal';
import { Plus } from 'lucide-react';

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
    <section className="w-full max-w-6xl mx-auto my-4 px-6">
      {/* Category Segmented Control & Add Button */}
      <div className="flex items-center justify-between gap-4 mb-3.5">
        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-xl border border-white/[0.06] backdrop-blur-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-white/[0.12] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white/[0.12] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/[0.08] transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Link</span>
        </button>
      </div>

      {/* Grid */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={handleEdit}
              onDelete={onDeleteBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-xs text-neutral-500">No bookmarks in this folder.</p>
          <button
            onClick={handleAddNew}
            className="mt-2 text-xs text-neutral-400 hover:text-white flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add one
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
        existingCategories={categories.length > 0 ? categories : ['Favorites', 'Development', 'Cloud', 'Utilities']}
      />
    </section>
  );
}
