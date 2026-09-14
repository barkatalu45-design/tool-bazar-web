import React from 'react';

interface AdProps {
  className?: string;
  label?: string;
}

// Sleek compact 468x60 banner (perfect for under Search bar or mobile)
export const CompactAdBanner: React.FC<AdProps> = ({ className = '', label = 'Advertisement' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center my-3 overflow-hidden ${className}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
        {label}
      </span>
      <div className="w-full max-w-[468px] overflow-hidden flex justify-center py-1 bg-neutral-50/70 dark:bg-neutral-900/30 rounded-xl border border-neutral-200/60 dark:border-neutral-800 shadow-2xs">
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

// 728x90 Classic Leaderboard (Responsive scaler on mobile)
export const LeaderboardAdBanner: React.FC<AdProps> = ({ className = '', label = 'Sponsored Link' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center my-3 overflow-hidden ${className}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
        {label}
      </span>
      <div className="w-full max-w-[728px] overflow-x-auto overflow-y-hidden flex justify-center py-1 bg-neutral-50/70 dark:bg-neutral-900/30 rounded-xl border border-neutral-200/60 dark:border-neutral-800 shadow-2xs">
        <iframe
          src="./adsterra-banner.html"
          width="728"
          height="90"
          title="Sponsored Ad 728x90"
          scrolling="no"
          frameBorder="0"
          className="border-0 overflow-hidden"
          style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
};

// Standard Adsterra Banner (backward compatibility)
export const AdsterraBanner: React.FC<AdProps> = (props) => <LeaderboardAdBanner {...props} />;

// Double Banner layout specifically for under tools: Both ads arranged side-by-side or stacked cleanly!
export const AdsterraDoubleBanner: React.FC<AdProps> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center mt-6 pt-5 border-t border-dashed border-neutral-200 dark:border-neutral-800 ${className}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-2 select-none">
        Sponsored Links & Special Offers
      </span>

      <div className="w-full flex flex-col items-center justify-center gap-3">
        {/* Ad 1 (468x60) */}
        <div className="w-full max-w-[468px] overflow-hidden flex justify-center py-1 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <iframe
            src="./adsterra-banner-468.html"
            width="468"
            height="60"
            title="Tool Sponsored Ad 1"
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden"
            style={{ width: '468px', height: '60px', border: 'none', overflow: 'hidden', maxWidth: '100%' }}
          />
        </div>

        {/* Ad 2 (728x90) */}
        <div className="w-full max-w-[728px] overflow-x-auto overflow-y-hidden flex justify-center py-1 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <iframe
            src="./adsterra-banner.html"
            width="728"
            height="90"
            title="Tool Sponsored Ad 2"
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden"
            style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden' }}
          />
        </div>
      </div>
    </div>
  );
};

// Persistent Bottom Footer Ad Bar: Shows always on every page (Main menu, category list, tools)!
export const AlwaysOnBottomAdBar: React.FC = () => {
  return (
    <div className="w-full max-w-[850px] mx-auto px-4 mt-8 pb-4 flex flex-col items-center justify-center">
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
        Advertisements
      </span>
      <div className="w-full flex flex-wrap items-center justify-center gap-3">
        {/* Small 468x60 unit */}
        <div className="overflow-hidden flex justify-center p-1 bg-neutral-50/90 dark:bg-neutral-900/50 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
          <iframe
            src="./adsterra-banner-468.html"
            width="468"
            height="60"
            title="Persistent Bottom Ad 1"
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden"
            style={{ width: '468px', height: '60px', border: 'none', overflow: 'hidden', maxWidth: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
