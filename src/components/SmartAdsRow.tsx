import React, { useState, useEffect } from 'react';
import { OfflineAdItem, getRandomSmartAds, recordSmartAdClick } from '../data/offlineSmartAds';
import { Sparkles, ExternalLink, Flame } from 'lucide-react';

interface SmartAdsRowProps {
  count?: number;
  className?: string;
  title?: string;
  variant?: 'compact' | 'cards' | 'grid';
}

export const SmartAdsRow: React.FC<SmartAdsRowProps> = ({
  count = 6,
  className = '',
  title = 'Sponsored Apps & Web Rewards',
  variant = 'compact',
}) => {
  const [ads, setAds] = useState<OfflineAdItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    // Pick dynamic randomized ads from the 50 ads pool on every load
    setAds(getRandomSmartAds(count));

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodically softly refresh ads every 45s for fresh impressions
    const interval = setInterval(() => {
      setAds(getRandomSmartAds(count));
    }, 45000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [count]);

  const handleAdClick = (ad: OfflineAdItem) => {
    recordSmartAdClick(ad);
  };

  return (
    <div
      id="smart-ads-container"
      className={`w-full my-3.5 p-3 rounded-2xl border transition-all duration-300 ${
        isOnline
          ? 'bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-transparent dark:from-neutral-900/50 dark:via-neutral-900/20 dark:to-transparent border-blue-200/50 dark:border-neutral-800'
          : 'bg-gradient-to-b from-emerald-50/70 via-slate-50/40 to-transparent dark:from-emerald-950/20 dark:via-neutral-900/20 dark:to-transparent border-emerald-300/60 dark:border-emerald-900/40'
      } ${className}`}
    >
      {/* Header bar of ads widget */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOnline ? 'bg-blue-400' : 'bg-emerald-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isOnline ? 'bg-blue-600' : 'bg-emerald-600'
              }`}
            />
          </span>
          <span className="text-[11px] font-bold tracking-tight text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            {isOnline ? 'Active Sponsors' : 'Offline Ready (50 Ads)'}
          </span>
        </div>
      </div>

      {/* Grid of Mini Native Ads (4 to 8 simultaneously) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full">
        {ads.map((ad, idx) => (
          <button
            key={`${ad.id}-${idx}`}
            onClick={() => handleAdClick(ad)}
            className="group relative text-left flex flex-col justify-between p-2.5 rounded-xl bg-white dark:bg-neutral-900/90 border border-neutral-200/70 dark:border-neutral-800 hover:border-blue-500/80 dark:hover:border-blue-500/80 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer overflow-hidden"
          >
            {/* Corner Badge */}
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="text-xl select-none">{ad.icon}</span>
              <span className="text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                {ad.badge}
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="w-full min-w-0">
              <p className="text-[12px] font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {ad.title}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-tight mt-0.5">
                {ad.tagline}
              </p>
            </div>

            {/* Bottom CTA & Rating */}
            <div className="mt-2.5 pt-1.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between w-full">
              <span className="text-[9.5px] font-semibold text-amber-500 flex items-center gap-0.5">
                {ad.rating}
              </span>
              <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700 transition-all flex items-center gap-1 shadow-2xs">
                <span>{ad.ctaText}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
