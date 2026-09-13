import React from 'react';
import { X, Shield, FileText, Mail } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'contact' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 sm:p-8 shadow-2xl border transition-all"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
          borderColor: 'var(--border-color)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' && (
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
              <Shield className="w-6 h-6" />
              <h2>Privacy Policy</h2>
            </div>
            <p className="text-xs opacity-70">Last updated: September 2026</p>

            <p>
              Welcome to <strong>Tool Bazar</strong>. Your privacy is paramount to us. This Privacy Policy explains how our website operates and protects your data.
            </p>

            <h3 className="font-semibold text-base pt-2">1. 100% Client-Side Processing</h3>
            <p>
              Unlike conventional web utilities, all processing (image resizing, background removal, password generation, file converters, and calculations) occurs directly inside your local web browser. We do not transmit, upload, or store your private images, files, or calculations on any external server.
            </p>

            <h3 className="font-semibold text-base pt-2">2. Google AdSense & Cookies</h3>
            <p>
              Tool Bazar uses Google AdSense to serve advertisements. Google, as a third-party vendor, uses cookies to serve ads on this website based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
            </p>
            <p>
              Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-blue-600 underline">Google Ads Settings</a>.
            </p>

            <h3 className="font-semibold text-base pt-2">3. Local Storage</h3>
            <p>
              We utilize browser localStorage solely to preserve user preferences such as your Dark/Light theme mode and pinned Favorite tools. This data stays exclusively on your own device.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
              <FileText className="w-6 h-6" />
              <h2>Terms of Service</h2>
            </div>
            <p className="text-xs opacity-70">Last updated: September 2026</p>

            <p>
              By accessing and using <strong>Tool Bazar</strong>, you agree to comply with and be bound by the following terms of use.
            </p>

            <h3 className="font-semibold text-base pt-2">1. Free Tool Usage</h3>
            <p>
              All tools, calculators, and converters provided on Tool Bazar are completely free of charge for both personal and commercial everyday utility.
            </p>

            <h3 className="font-semibold text-base pt-2">2. Disclaimer of Warranty</h3>
            <p>
              The tools and calculation algorithms are provided "as-is" without any explicit warranty. While we strive for absolute mathematical and technical accuracy, users are encouraged to verify critical financial, medical, or engineering calculations independently.
            </p>

            <h3 className="font-semibold text-base pt-2">3. Intellectual Property</h3>
            <p>
              The Tool Bazar user interface and code repository are protected by copyright. Any content or media generated using our tools belongs entirely to the user.
            </p>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
              <Mail className="w-6 h-6" />
              <h2>Contact Us</h2>
            </div>

            <p>
              Have a tool suggestion, feedback, or need help with Tool Bazar? We would love to hear from you!
            </p>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="font-semibold">Official Contact:</p>
              <p className="text-blue-600 dark:text-blue-400 font-mono text-sm">barkatalu45@gmail.com</p>
              <p className="text-xs opacity-75">We typically respond to community inquiries and tool recommendations within 24 to 48 hours.</p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
