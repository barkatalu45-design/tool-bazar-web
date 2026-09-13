import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Share2, Sparkles, Filter, RotateCcw } from 'lucide-react';
import { generateAllStyles, TextStyleResult } from '../../utils/stylishFonts';

interface StylishTextGeneratorViewProps {
  onToast: (msg: string) => void;
}

export const StylishTextGeneratorView: React.FC<StylishTextGeneratorViewProps> = ({ onToast }) => {
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allGeneratedStyles = useMemo(() => {
    return generateAllStyles(inputText);
  }, [inputText]);

  const categories = useMemo(() => {
    const set = new Set(allGeneratedStyles.map((s) => s.category));
    return ['all', ...Array.from(set)];
  }, [allGeneratedStyles]);

  const filteredStyles = useMemo(() => {
    if (selectedCategory === 'all') return allGeneratedStyles;
    return allGeneratedStyles.filter((s) => s.category === selectedCategory);
  }, [allGeneratedStyles, selectedCategory]);

  const handleCopySingle = (style: TextStyleResult) => {
    navigator.clipboard.writeText(style.text);
    setCopiedId(style.id);
    onToast(`Copied "${style.name}"!`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyAll = () => {
    const combined = filteredStyles.map((s) => `${s.name}:\n${s.text}`).join('\n\n');
    navigator.clipboard.writeText(combined);
    onToast(`Copied all ${filteredStyles.length} styles!`);
  };

  const handleDownloadTxt = () => {
    const combined = filteredStyles.map((s) => `[${s.name}]\n${s.text}`).join('\n\n');
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stylish-text-${inputText.slice(0, 15) || 'styles'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Downloaded styles as TXT file');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Stylish Text from Utility Bazaar',
          text: `Check out these text styles for "${inputText}":\n\n${filteredStyles[0]?.text || ''}\n${filteredStyles[1]?.text || ''}`,
          url: window.location.href,
        });
        onToast('Shared successfully!');
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyAll();
      onToast('Sharing not supported on this browser; copied to clipboard instead!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="rounded-xl border border-indigo-100 dark:border-indigo-950/80 bg-indigo-50/70 dark:bg-indigo-950/30 p-4 text-xs leading-relaxed text-indigo-900 dark:text-indigo-200">
        <span className="font-bold">✨ Authentic Unicode Text Transformations:</span> These are real copyable Unicode characters (Mathematical Alphanumerics, Combining Diacritics, and Enclosed Glyphs) — not CSS font-family tricks. They work natively across Instagram, WhatsApp, Discord, TikTok, and game handles like PUBG/COD without losing formatting. Non-Latin scripts (Urdu, Arabic, Chinese, Emoji) are preserved safely.
      </div>

      {/* Input Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Enter Text to Style:
          </label>
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Text
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your name or message here (e.g. your name, brand, gaming tag)..."
            className="w-full rounded-xl border p-3.5 text-base sm:text-lg font-medium placeholder-slate-400 focus:ring-2 focus:ring-[#007bff] focus:outline-none transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)',
              boxShadow: 'var(--shadow)',
            }}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 dark:text-slate-400">
            {inputText.length} chars
          </div>
        </div>
      </div>

      {/* Action Bar (Category Filters + Bulk Actions) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y py-3" style={{ borderColor: 'var(--border-color)' }}>
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#007bff] text-white shadow-xs'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)',
            }}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy All
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)',
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Download TXT
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl bg-[#007bff] text-white px-3.5 py-1.5 text-xs font-bold hover:opacity-90 transition-colors shadow-xs cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* Generated Styles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredStyles.map((style) => (
          <div
            key={style.id}
            className="group relative flex flex-col justify-between rounded-xl border p-4 transition-all"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {style.name}
              </span>
              <span className="text-[11px] rounded bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 px-2 py-0.5 font-bold">
                {style.category}
              </span>
            </div>

            {/* Unicode Live Result */}
            <div
              className="py-2.5 text-base sm:text-lg font-medium break-words select-all"
              style={{ color: 'var(--text-color)' }}
            >
              {style.text}
            </div>

            {/* Copy Button */}
            <div className="pt-2 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => handleCopySingle(style)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  copiedId === style.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700'
                }`}
              >
                {copiedId === style.id ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
