import React from 'react';

interface AdsterraBannerProps {
  className?: string;
}

// 728x90 Banner (Leaderboard)
export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden ${className}`}>
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1 select-none">
        Sponsored Advertisement
      </span>
      <div className="w-full max-w-[728px] overflow-x-auto overflow-y-hidden flex justify-center py-1">
        <iframe
          src="./adsterra-banner.html"
          width="728"
          height="90"
          title="Advertisement 728x90"
          scrolling="no"
          frameBorder="0"
          className="border-0 overflow-hidden rounded-lg shadow-xs"
          style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
};

// 468x60 Banner
export const AdsterraBanner468: React.FC<AdsterraBannerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center my-3 overflow-hidden ${className}`}>
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1 select-none">
        Sponsored Offer
      </span>
      <div className="w-full max-w-[468px] overflow-x-auto overflow-y-hidden flex justify-center py-1">
        <iframe
          src="./adsterra-banner-468.html"
          width="468"
          height="60"
          title="Advertisement 468x60"
          scrolling="no"
          frameBorder="0"
          className="border-0 overflow-hidden rounded-lg shadow-xs"
          style={{ width: '468px', height: '60px', border: 'none', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
};

// Double Banner layout under Tool: Shows 728x90 Banner + 468x60 Banner!
export const AdsterraDoubleBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center mt-8 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800 ${className}`}>
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-3 select-none">
        Sponsored Links & Special Offers
      </span>

      <div className="w-full flex flex-col items-center justify-center gap-4">
        {/* Banner 1: 728x90 Leaderboard */}
        <div className="w-full max-w-[728px] overflow-x-auto overflow-y-hidden flex justify-center py-2 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-neutral-200/70 dark:border-neutral-800">
          <iframe
            src="./adsterra-banner.html"
            width="728"
            height="90"
            title="Advertisement 1"
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden rounded-lg"
            style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden' }}
          />
        </div>

        {/* Banner 2: 468x60 Classic Banner */}
        <div className="w-full max-w-[468px] overflow-x-auto overflow-y-hidden flex justify-center py-2 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-neutral-200/70 dark:border-neutral-800">
          <iframe
            src="./adsterra-banner-468.html"
            width="468"
            height="60"
            title="Advertisement 2"
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden rounded-lg"
            style={{ width: '468px', height: '60px', border: 'none', overflow: 'hidden' }}
          />
        </div>
      </div>
    </div>
  );
};
