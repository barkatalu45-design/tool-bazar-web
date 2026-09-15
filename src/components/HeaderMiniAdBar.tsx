import React, { useState, useEffect } from 'react';
import { OfflineAdItem, getRandomSmartAds, recordSmartAdClick } from '../data/offlineSmartAds';

export const HeaderMiniAdBar: React.FC = () => {
  const [topAds, setTopAds] = useState<OfflineAdItem[]>([]);

  useEffect(() => {
    // 4 to 5 compact micro ads for the top header strip
    setTopAds(getRandomSmartAds(5));

    // Rotate every 30 seconds
    const interval = setInterval(() => {
      setTopAds(getRandomSmartAds(5));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-50/90 dark:bg-neutral-900/90 border-b border-neutral-200/70 dark:border-neutral-800 py-1 px-2 overflow-x-auto no-scrollbar select-none">
      <div className="max-w-[850px] mx-auto flex items-center justify-between gap-1.5 min-w-[340px]">
        {topAds.map((ad, index) => (
          <button
            key={`${ad.id}-${index}`}
            onClick={() => recordSmartAdClick(ad)}
            title={`${ad.title}: ${ad.tagline}`}
            className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-blue-500 shadow-2xs hover:shadow-xs active:scale-95 transition-all text-left group cursor-pointer"
          >
            <span className="text-sm leading-none flex-shrink-0">{ad.icon}</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 max-w-[65px] sm:max-w-[100px] leading-tight">
                {ad.title}
              </span>
              <span className="text-[8px] font-extrabold text-blue-600 dark:text-blue-400 leading-none">
                {ad.ctaText}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
