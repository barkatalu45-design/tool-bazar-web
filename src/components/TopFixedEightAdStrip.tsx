import React, { useState, useEffect } from 'react';
import { OfflineAdItem, getRandomSmartAds, recordSmartAdClick } from '../data/offlineSmartAds';
import { Sparkles, ExternalLink } from 'lucide-react';

export const TopFixedEightAdStrip: React.FC = () => {
  const [ads, setAds] = useState<OfflineAdItem[]>([]);

  useEffect(() => {
    // Exactly 8 smart ads simultaneously
    setAds(getRandomSmartAds(8));

    // Rotate every 35s
    const interval = setInterval(() => {
      setAds(getRandomSmartAds(8));
    }, 35000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-neutral-900 text-white border-b-2 border-blue-500 shadow-md py-1.5 px-2 select-none z-40">
      <div className="max-w-[850px] mx-auto">
        {/* Little Label */}
        <div className="flex items-center justify-between px-1 mb-1 text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">
          <span className="flex items-center gap-1 text-blue-400">
            <Sparkles className="w-2.5 h-2.5" />
            Featured Apps & Offers (8 Instant Sponsors)
          </span>
          <span className="bg-blue-900/60 text-blue-300 border border-blue-700/60 px-1.5 py-0.2 rounded-full text-[8px]">
            Live & Offline Active
          </span>
        </div>

        {/* 8 mini ad buttons in a tight, high-converting mobile grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 w-full">
          {ads.map((ad, idx) => (
            <button
              key={`${ad.id}-${idx}`}
              onClick={() => recordSmartAdClick(ad)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-700 hover:border-blue-400 active:scale-95 transition-all text-center group cursor-pointer overflow-hidden min-h-[56px]"
            >
              <span className="text-base leading-none mb-1 group-hover:scale-110 transition-transform">
                {ad.icon}
              </span>
              <span className="text-[10px] font-bold text-neutral-100 truncate w-full leading-tight">
                {ad.title.split(' ')[0]}
              </span>
              <span className="text-[8px] font-extrabold text-blue-400 uppercase tracking-tighter leading-tight mt-0.5">
                {ad.ctaText}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
