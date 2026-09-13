import React, { useState } from 'react';
import { Palette, Copy, Check, RefreshCw, Sparkles, Sliders } from 'lucide-react';
import { Tool } from '../../types';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  calculateContrastRatio,
  getRandomHex,
} from '../../utils/colorUtils';

interface ColorToolsViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const ColorToolsView: React.FC<ColorToolsViewProps> = ({ tool, onToast }) => {
  const [hexColor, setHexColor] = useState('#6366f1');
  const [contrastFg, setContrastFg] = useState('#ffffff');
  const [contrastBg, setContrastBg] = useState('#4f46e5');

  // Gradient states
  const [gradColor1, setGradColor1] = useState('#6366f1');
  const [gradColor2, setGradColor2] = useState('#ec4899');
  const [gradAngle, setGradAngle] = useState(90);

  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(hexColor) || { r: 99, g: 102, b: 241 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    onToast(`Copied ${text}`);
    setTimeout(() => setCopied(null), 1800);
  };

  // WCAG Contrast Checker view
  if (tool.id.includes('contrast')) {
    const contrast = calculateContrastRatio(contrastFg, contrastBg);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Foreground (Text) Color:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={contrastFg}
                onChange={(e) => setContrastFg(e.target.value)}
                className="h-10 w-12 rounded cursor-pointer border"
              />
              <input
                type="text"
                value={contrastFg}
                onChange={(e) => setContrastFg(e.target.value)}
                className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 p-2 text-xs font-mono uppercase bg-white dark:bg-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Background Color:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={contrastBg}
                onChange={(e) => setContrastBg(e.target.value)}
                className="h-10 w-12 rounded cursor-pointer border"
              />
              <input
                type="text"
                value={contrastBg}
                onChange={(e) => setContrastBg(e.target.value)}
                className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 p-2 text-xs font-mono uppercase bg-white dark:bg-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Box */}
        <div
          style={{ backgroundColor: contrastBg, color: contrastFg }}
          className="p-8 rounded-2xl border text-center transition-colors shadow-xs"
        >
          <div className="text-2xl sm:text-3xl font-bold mb-1">Previewing Text Readability</div>
          <p className="text-sm opacity-90">WCAG 2.1 Contrast Testing Sample Paragraph</p>
        </div>

        {/* Contrast Score Card */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
          <div className="text-center mb-4">
            <span className="text-xs text-neutral-500 uppercase font-semibold">Contrast Ratio</span>
            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {contrast.ratio} : 1
            </div>
            <div className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mt-1">
              Rating: {contrast.scoreText}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-lg border ${contrast.aaNormal ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              <span className="block font-bold">AA Normal Text</span>
              <span>{contrast.aaNormal ? 'Pass (≥ 4.5:1)' : 'Fail'}</span>
            </div>
            <div className={`p-2.5 rounded-lg border ${contrast.aaLarge ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              <span className="block font-bold">AA Large Text</span>
              <span>{contrast.aaLarge ? 'Pass (≥ 3.0:1)' : 'Fail'}</span>
            </div>
            <div className={`p-2.5 rounded-lg border ${contrast.aaaNormal ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              <span className="block font-bold">AAA Normal Text</span>
              <span>{contrast.aaaNormal ? 'Pass (≥ 7.0:1)' : 'Fail'}</span>
            </div>
            <div className={`p-2.5 rounded-lg border ${contrast.aaaLarge ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              <span className="block font-bold">AAA Large Text</span>
              <span>{contrast.aaaLarge ? 'Pass (≥ 4.5:1)' : 'Fail'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CSS Gradient Generator View
  if (tool.id.includes('gradient')) {
    const cssGradient = `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`;
    return (
      <div className="space-y-6">
        <div
          style={{ background: cssGradient }}
          className="h-44 rounded-2xl shadow-md border flex items-center justify-center text-white font-bold drop-shadow"
        >
          Gradient Preview
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Color 1:</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gradColor1}
                onChange={(e) => setGradColor1(e.target.value)}
                className="h-9 w-12 rounded cursor-pointer border"
              />
              <input
                type="text"
                value={gradColor1}
                onChange={(e) => setGradColor1(e.target.value)}
                className="flex-1 p-2 rounded-lg border text-xs font-mono uppercase bg-white dark:bg-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Color 2:</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gradColor2}
                onChange={(e) => setGradColor2(e.target.value)}
                className="h-9 w-12 rounded cursor-pointer border"
              />
              <input
                type="text"
                value={gradColor2}
                onChange={(e) => setGradColor2(e.target.value)}
                className="flex-1 p-2 rounded-lg border text-xs font-mono uppercase bg-white dark:bg-neutral-900"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              <span>Angle:</span>
              <span>{gradAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={gradAngle}
              onChange={(e) => setGradAngle(parseInt(e.target.value))}
              className="w-full accent-indigo-600 mt-2"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <span>CSS Code:</span>
            <button onClick={() => handleCopy(`background: ${cssGradient};`, 'grad')} className="text-indigo-600 hover:underline">
              {copied === 'grad' ? 'Copied' : 'Copy CSS'}
            </button>
          </div>
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 font-mono text-xs text-emerald-400">
            background: {cssGradient};
          </div>
        </div>
      </div>
    );
  }

  // Default: Color Picker, Converter & Harmony Palette
  const complementaryHex = rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="color"
          value={hexColor}
          onChange={(e) => setHexColor(e.target.value)}
          className="h-16 w-20 rounded-2xl cursor-pointer border border-neutral-300 dark:border-neutral-700"
        />
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            HEX Color Code:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm font-mono uppercase"
            />
            <button
              onClick={() => setHexColor(getRandomHex())}
              className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-semibold shrink-0"
              title="Pick random color"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500 uppercase font-bold">HEX</span>
            <div className="text-base font-mono font-bold uppercase mt-0.5">{hexColor}</div>
          </div>
          <button onClick={() => handleCopy(hexColor, 'hex')} className="text-neutral-400 hover:text-indigo-600">
            {copied === 'hex' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500 uppercase font-bold">RGB</span>
            <div className="text-base font-mono font-bold mt-0.5">rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          </div>
          <button onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')} className="text-neutral-400 hover:text-indigo-600">
            {copied === 'rgb' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500 uppercase font-bold">HSL</span>
            <div className="text-base font-mono font-bold mt-0.5">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
          </div>
          <button onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')} className="text-neutral-400 hover:text-indigo-600">
            {copied === 'hsl' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Palette / Harmony */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-2">
        <span className="text-xs font-bold uppercase text-neutral-500">Color Harmony:</span>
        <div className="flex gap-2">
          <div style={{ backgroundColor: hexColor }} className="flex-1 h-12 rounded-lg shadow-xs flex items-center justify-center text-xs font-mono font-bold text-white drop-shadow">
            Base
          </div>
          <div style={{ backgroundColor: complementaryHex }} className="flex-1 h-12 rounded-lg shadow-xs flex items-center justify-center text-xs font-mono font-bold text-white drop-shadow">
            Complement
          </div>
        </div>
      </div>
    </div>
  );
};
