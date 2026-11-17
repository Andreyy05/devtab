import React, { useState } from 'react';
import { Trash2, Edit2, Globe } from 'lucide-react';

export default function BookmarkCard({ bookmark, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false);

  const getHostname = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`;

  return (
    <div className="group relative bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.14] rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 w-full"
      >
        {/* Squircle Favicon Container */}
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden p-2 group-hover:scale-105 transition-transform duration-200">
          {!imgError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <Globe className="w-4 h-4 text-neutral-400" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-xs font-medium text-white/90 group-hover:text-white transition-colors truncate">
            {bookmark.title}
          </h3>
          <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-normal">
            {getHostname(bookmark.url)}
          </p>
        </div>
      </a>

      {/* Subtle hover edit / delete actions */}
      <div className="absolute top-2.5 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(bookmark);
          }}
          className="p-1 rounded-md bg-white/[0.08] hover:bg-white/[0.15] text-neutral-300 hover:text-white transition-colors"
          title="Edit"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(bookmark.id);
          }}
          className="p-1 rounded-md bg-white/[0.08] hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
