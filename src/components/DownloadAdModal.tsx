import React, { useState, useEffect } from 'react';
import { OfflineAdItem, getRandomSmartAds, recordSmartAdClick } from '../data/offlineSmartAds';
import { Download, Sparkles, CheckCircle2, X } from 'lucide-react';

interface DownloadAdModalProps {
  isOpen: boolean;
  fileName?: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const DownloadAdModal: React.FC<DownloadAdModalProps> = ({
  isOpen,
  fileName = 'file',
  onComplete,
  onCancel,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [ad, setAd] = useState<OfflineAdItem | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // Pick 1 random feature ad from the 50 ads pool
      const picked = getRandomSmartAds(1)[0];
      setAd(picked);
      setCountdown(3);
      setIsReady(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsReady(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimAd = () => {
    if (ad) {
      recordSmartAdClick(ad);
    }
  };

  const handleDownloadNow = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Generating Download</span>
        </div>
        <p className="text-xs text-neutral-500 truncate max-w-[240px] mx-auto mb-4 font-mono">
          {fileName}
        </p>

        {/* Sponsored Featured Box (High Impact) */}
        {ad && (
          <div
            onClick={handleClaimAd}
            className="group cursor-pointer p-3.5 mb-4 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-850 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 text-left hover:border-blue-500 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 shadow-2xs">
                {ad.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {ad.title}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    {ad.badge}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                  {ad.tagline}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                  <span className="text-amber-500 font-bold">{ad.rating}</span>
                  <span>•</span>
                  <span>{ad.downloads} users</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-blue-600 group-hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>{ad.ctaText}</span>
              <span className="opacity-75 text-[10px]">Sponsored</span>
            </button>
          </div>
        )}

        {/* Action Button: Waiting countdown or Ready to Download */}
        {!isReady ? (
          <div className="py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Ready in {countdown}s...</span>
          </div>
        ) : (
          <button
            onClick={handleDownloadNow}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all animate-bounce duration-300 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Click to Download File</span>
          </button>
        )}

        <p className="text-[9px] text-neutral-400 mt-2.5">
          Sponsored secure download powered by Tool Bazar
        </p>
      </div>
    </div>
  );
};
