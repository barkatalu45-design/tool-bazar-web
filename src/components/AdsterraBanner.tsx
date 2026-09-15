import React, { useState, useEffect } from 'react';
import { OfflineAdItem, getRandomSmartAds, recordSmartAdClick } from '../data/offlineSmartAds';
import { ExternalLink } from 'lucide-react';

interface AdProps {
  className?: string;
  label?: string;
}

// Sleek compact 468x60 banner with smart offline fallback
export const CompactAdBanner: React.FC<AdProps> = ({ className = '', label = 'Advertisement' }) => {
  const [offlineAd, setOfflineAd] = useState<OfflineAdItem | null>(null);

  useEffect(() => {
    setOfflineAd(getRandomSmartAds(1)[0]);
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-3 overflow-hidden ${className}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
        {label}
      </span>
      <div className="w-full max-w-[468px] overflow-hidden flex justify-center py-1 bg-neutral-50/70 dark:bg-neutral-900/30 rounded-xl border border-neutral-200/60 dark:border-neutral-800 shadow-2xs relative">
        <iframe
          src="./adsterra-banner-468.html"
          width="468"
          height="60"
          title="Sponsored Ad 468x60"
          scrolling="no"
          frameBorder="0"
          className="border-0 overflow-hidden"
          style={{ width: '468px', height: '60px', border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        />
      </div>
    </div>
  );
};

// High-CPM Medium Box Ad (300x250) placed directly under tools
export const LargeBoxAd: React.FC<AdProps> = ({ className = '' }) => {
  const [offlineFallback, setOfflineFallback] = useState<OfflineAdItem | null>(null);

  useEffect(() => {
    setOfflineFallback(getRandomSmartAds(1)[0]);
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 ${className}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-2 select-none">
        Featured Sponsor • 300x250 High CPM
      </span>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        {/* Live Adsterra 300x250 Box */}
        <div className="w-[300px] h-[250px] overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-xs flex items-center justify-center">
          <iframe
            src="./adsterra-box-300.html"
            width="300"
            height="250"
            title="Sponsor 300x250"
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden"
            style={{ width: '300px', height: '250px', border: 'none', overflow: 'hidden' }}
          />
        </div>

        {/* Co-existing Offline-Ready Smart Native Feature Card */}
        {offlineFallback && (
          <div
            onClick={() => recordSmartAdClick(offlineFallback)}
            className="w-[300px] h-[250px] p-5 rounded-xl border border-blue-200/80 dark:border-neutral-800 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 dark:from-neutral-900 dark:to-neutral-950 shadow-xs flex flex-col justify-between cursor-pointer group hover:border-blue-500 transition-all text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl p-2 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shadow-xs">
                  {offlineFallback.icon}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                  {offlineFallback.badge}
                </span>
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 transition-colors">
                {offlineFallback.title}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                {offlineFallback.tagline}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-500">{offlineFallback.rating}</span>
              <button className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 group-hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs">
                <span>{offlineFallback.ctaText}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact clean ad specifically placed directly under each active tool
export const ToolBottomAd: React.FC<AdProps> = ({ className = '' }) => {
  return <LargeBoxAd className={className} />;
};

// Persistent Footer Ad: Placed nicely right next to Terms of Service & Privacy Policy
export const FooterPolicyAd: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-6 pb-2">
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
        Sponsored Network
      </span>
      <div className="overflow-hidden flex justify-center p-1 bg-neutral-50/90 dark:bg-neutral-900/50 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
        <iframe
          src="./adsterra-banner-468.html"
          width="468"
          height="60"
          title="Footer Advertisement"
          scrolling="no"
          frameBorder="0"
          className="border-0 overflow-hidden"
          style={{ width: '468px', height: '60px', border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        />
      </div>
    </div>
  );
};

// Aliases for compatibility
export const AdsterraBanner = ToolBottomAd;
export const AdsterraDoubleBanner = ToolBottomAd;
export const AlwaysOnBottomAdBar = FooterPolicyAd;
