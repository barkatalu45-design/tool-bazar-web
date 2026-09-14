import React from 'react';

interface AdProps {
  className?: string;
  label?: string;
}

// Sleek compact 468x60 banner: Non-intrusive, neat, and doesn't hijack user clicks
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

// Compact clean ad specifically placed directly under each active tool
export const ToolBottomAd: React.FC<AdProps> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center mt-6 pt-5 border-t border-dashed border-neutral-200 dark:border-neutral-800 ${className}`}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-2 select-none">
        Sponsored Link
      </span>
      <div className="w-full max-w-[468px] overflow-hidden flex justify-center py-1 bg-neutral-50/80 dark:bg-neutral-900/40 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <iframe
          src="./adsterra-banner-468.html"
          width="468"
          height="60"
          title="Tool Advertisement"
          scrolling="no"
          frameBorder="0"
          className="border-0 overflow-hidden"
          style={{ width: '468px', height: '60px', border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        />
      </div>
    </div>
  );
};

// Persistent Footer Ad: Placed nicely right next to Terms of Service & Privacy Policy
export const FooterPolicyAd: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-6 pb-2">
      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
        Sponsored
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
