import React, { useState, useEffect } from 'react';
import { OfflineAdItem, getRandomSmartAds, recordSmartAdClick } from '../data/offlineSmartAds';
import { X, ExternalLink, Flame } from 'lucide-react';

export const InterstitialSkipAdModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ad, setAd] = useState<OfflineAdItem | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  useEffect(() => {
    // Show interstitial pop-up ad after 40 seconds, then every 90 seconds
    const showAd = () => {
      const picked = getRandomSmartAds(1)[0];
      setAd(picked);
      setCountdown(5);
      setCanSkip(false);
      setIsOpen(true);
    };

    const firstTimer = setTimeout(showAd, 40000); // 40 seconds initial
    const interval = setInterval(showAd, 90000); // every 90s afterwards

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  // Countdown timer for Skip button
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !ad) return null;

  const handleClaim = () => {
    recordSmartAdClick(ad);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center overflow-hidden">
        {/* Top Header with Skip Button */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            Sponsored Spotlight
          </span>

          {canSkip ? (
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all cursor-pointer"
            >
              <span>Skip Ad</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
              Skip in {countdown}s
            </span>
          )}
        </div>

        {/* Large 300x250 Adsterra Box Inside Interstitial */}
        <div className="w-full flex flex-col items-center justify-center my-3">
          <div className="w-[300px] h-[250px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 shadow-inner flex items-center justify-center">
            <iframe
              src="./adsterra-box-300.html"
              width="300"
              height="250"
              title="Interstitial Big Ad"
              scrolling="no"
              frameBorder="0"
              style={{ width: '300px', height: '250px', border: 'none', overflow: 'hidden' }}
            />
          </div>
        </div>

        {/* Action Button & App Details */}
        <div
          onClick={handleClaim}
          className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-850 border border-blue-200/70 dark:border-neutral-700 flex items-center justify-between cursor-pointer group hover:border-blue-500 transition-all text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-3xl p-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-2xs">
              {ad.icon}
            </span>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                {ad.title}
              </h4>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                {ad.tagline}
              </p>
            </div>
          </div>

          <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 group-hover:bg-blue-700 flex items-center gap-1 shadow-xs transition-colors shrink-0">
            <span>{ad.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <p className="text-[9px] text-neutral-400 mt-3">
          Ads help keep Tool Bazar 100% free forever for all users
        </p>
      </div>
    </div>
  );
};
