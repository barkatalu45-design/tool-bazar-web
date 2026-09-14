import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export const AntiAdBlockerModal: React.FC = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    let checkTimer: any = null;

    const checkAdBlock = async () => {
      // 1. Bait element detection
      const bait = document.createElement('div');
      bait.setAttribute('class', 'pub_300x250 pub_728x90 adsbox ad-placement banner-ad ad_unit text-ad ads-banner');
      bait.setAttribute('id', 'ad-detect-element');
      bait.setAttribute('style', 'position: absolute !important; left: -9999px !important; top: -9999px !important; width: 10px !important; height: 10px !important; pointer-events: none !important;');
      document.body.appendChild(bait);

      // 2. Fetch probe against standard ad script URL to see if network filter blocks it
      let networkBlocked = false;
      try {
        const response = await fetch('https://www.highrevenueformat.com/c66e265a6347fea7ce89338c845ed83d/invoke.js', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
        }).catch(() => {
          networkBlocked = true;
        });
        if (networkBlocked) {
          setIsBlocked(true);
          return;
        }
      } catch {
        networkBlocked = true;
      }

      // Check bait element styles
      setTimeout(() => {
        const computed = window.getComputedStyle(bait);
        const isHidden =
          networkBlocked ||
          bait.offsetParent === null ||
          bait.offsetHeight === 0 ||
          bait.offsetLeft === 0 ||
          computed.display === 'none' ||
          computed.visibility === 'hidden';

        if (isHidden) {
          setIsBlocked(true);
        }
        bait.remove();
      }, 500);
    };

    checkTimer = setTimeout(checkAdBlock, 600);
    return () => clearTimeout(checkTimer);
  }, []);

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1f2c] max-w-md w-full rounded-2xl p-6 sm:p-8 text-center shadow-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-2 tracking-tight">
          AdBlocker Detected
        </h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
          All <strong>260+ free tools</strong> are provided at zero cost. We rely on clean, unobtrusive advertisements to pay for hosting and development.
        </p>

        <div className="bg-neutral-50 dark:bg-[#111520] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 mb-6 text-left space-y-2">
          <p className="font-bold text-neutral-900 dark:text-white">To continue using Tool Bazar:</p>
          <p>1. Please disable or pause your AdBlocker / DNS filter for this website.</p>
          <p>2. Click the button below to refresh the page.</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>I have disabled my AdBlocker (Refresh)</span>
        </button>
      </div>
    </div>
  );
};
