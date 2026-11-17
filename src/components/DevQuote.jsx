import React, { useState, useEffect } from 'react';
import { Quote, Shuffle } from 'lucide-react';
import { DEV_QUOTES } from '../constants/defaults';

export default function DevQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Pick quote based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    setIndex(dayOfYear % DEV_QUOTES.length);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % DEV_QUOTES.length);
  };

  const current = DEV_QUOTES[index];

  return (
    <div className="w-full max-w-7xl mx-auto my-4 px-4 sm:px-6">
      <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-start gap-3 flex-1">
          <Quote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs sm:text-sm text-neutral-300 italic font-serif">
              "{current.text}"
            </p>
            <p className="text-[11px] text-neutral-400 font-sans mt-1 font-medium">
              — {current.author}
            </p>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs transition-colors shrink-0"
          title="Show another quote"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>New Quote</span>
        </button>
      </div>
    </div>
  );
}
