import React, { useEffect, useRef } from 'react';

export const AdsterraBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Check if ad was already injected inside this container
    if (bannerRef.current.children.length > 0) return;

    try {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.text = `
        atOptions = {
          'key' : '39074e51ceed883903b23f5427dc3eb1',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highrevenueformat.com/39074e51ceed883903b23f5427dc3eb1/invoke.js';

      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(invokeScript);
    } catch (e) {
      console.error('Adsterra load error:', e);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 overflow-hidden">
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
        Sponsored Advertisement
      </span>
      <div 
        ref={bannerRef} 
        className="min-h-[90px] w-full max-w-[728px] flex items-center justify-center bg-slate-100/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800/60 overflow-hidden"
      />
    </div>
  );
};
