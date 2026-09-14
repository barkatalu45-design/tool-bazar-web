import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export const AntiAdBlockerModal: React.FC = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Quick test to detect if common ad scripts or elements are blocked
    const detectAdBlock = async () => {
      try {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links';
        testAd.style.position = 'absolute';
        testAd.style.top = '-9999px';
        testAd.style.left = '-9999px';
        testAd.style.width = '1px';
        testAd.style.height = '1px';
        document.body.appendChild(testAd);

        window.setTimeout(() => {
          const isHidden =
            testAd.offsetParent === null ||
            testAd.offsetHeight === 0 ||
            testAd.offsetLeft === 0 ||
            testAd.offsetTop === 0 ||
            testAd.offsetWidth === 0 ||
            testAd.clientHeight === 0 ||
            testAd.clientWidth === 0 ||
            window.getComputedStyle(testAd).display === 'none' ||
            window.getComputedStyle(testAd).visibility === 'hidden';

          testAd.remove();

          if (isHidden) {
            setIsBlocked(true);
          }
        }, 1200);
      } catch {
        // Fallback ignore
      }
    };

    detectAdBlock();
  }, []);

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1e2330] max-w-md w-full rounded-2xl p-6 sm:p-8 text-center shadow-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          AdBlocker Detected
        </h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
          All <strong>260+ Tools</strong> on Tool Bazar are completely free to use. We rely on non-intrusive advertisements to maintain our servers and keep these utilities free for everyone.
        </p>

        <div className="bg-neutral-50 dark:bg-[#141822] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 mb-6 text-left space-y-2">
          <p className="font-semibold text-neutral-900 dark:text-white">To continue using this tool:</p>
          <p>1. Please pause or disable your AdBlocker / Private DNS for this site.</p>
          <p>2. Click the button below to reload the page.</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>I have disabled my AdBlocker (Refresh)</span>
        </button>
      </div>
    </div>
  );
};
