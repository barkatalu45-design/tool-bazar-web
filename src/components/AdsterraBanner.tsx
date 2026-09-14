import React from 'react';

interface AdsterraBannerProps {
  className?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 overflow-hidden ${className}`}>
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 select-none">
        Sponsored Advertisement
      </span>
      <div className="w-full max-w-[728px] overflow-x-auto overflow-y-hidden flex justify-center py-1">
        <iframe
          src="./adsterra-banner.html"
          width="728"
          height="90"
          title="Advertisement"
          scrolling="no"
          frameBorder="0"
          className="border-0 overflow-hidden rounded-lg shadow-sm"
          style={{ width: '728px', height: '90px', border: 'none', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
};
