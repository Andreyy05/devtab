import React, { useState } from 'react';
import { ExternalLink, Trash2, Edit2, Globe } from 'lucide-react';

export default function BookmarkCard({ bookmark, onEdit, onDelete, accentTheme }) {
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
    <div className="group relative bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-neutral-700/80 rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl flex flex-col justify-between">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 w-full"
      >
        <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center shrink-0 overflow-hidden p-1.5 group-hover:border-neutral-600 transition-colors">
          {!imgError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <Globe className="w-5 h-5 text-neutral-400" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-emerald-400 transition-colors truncate">
            {bookmark.title}
          </h3>
          <p className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">
            {getHostname(bookmark.url)}
          </p>
        </div>
      </a>

      {/* Category Tag */}
      <div className="mt-2.5 flex items-center justify-between text-[10px]">
        <span className="px-2 py-0.5 rounded-md bg-neutral-800/60 text-neutral-400 font-medium border border-neutral-700/40">
          {bookmark.category || 'General'}
        </span>
      </div>

      {/* Hover Action Buttons */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(bookmark);
          }}
          className="p-1 rounded-lg bg-neutral-850 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
          title="Edit bookmark"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(bookmark.id);
          }}
          className="p-1 rounded-lg bg-neutral-850 hover:bg-rose-950/80 text-neutral-400 hover:text-rose-400 transition-colors"
          title="Delete bookmark"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
