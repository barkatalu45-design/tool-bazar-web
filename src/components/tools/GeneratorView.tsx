import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Dice5,
  Coins,
  ShieldAlert,
  Sparkles,
  Shuffle,
  FileText,
} from 'lucide-react';
import { Tool } from '../../types';

interface GeneratorViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ tool, onToast }) => {
  // Password Generator States
  const [passLength, setPassLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Lorem Ipsum States
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [loremCount, setLoremCount] = useState(3);
  const [loremOutput, setLoremOutput] = useState('');

  // Coin Flip & Dice States
  const [coinResult, setCoinResult] = useState<'Heads' | 'Tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Random Choice / Decision Maker
  const [choiceInput, setChoiceInput] = useState('Pizza\nBurgers\nSushi\nSalad\nTacos');
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);

  // CSS Box Shadow States
  const [bsX, setBsX] = useState(0);
  const [bsY, setBsY] = useState(10);
  const [bsBlur, setBsBlur] = useState(25);
  const [bsSpread, setBsSpread] = useState(-5);
  const [bsColor, setBsColor] = useState('rgba(0, 0, 0, 0.15)');

  // CSS Border Radius States
  const [brTL, setBrTL] = useState(16);
  const [brTR, setBrTR] = useState(16);
  const [brBR, setBrBR] = useState(16);
  const [brBL, setBrBL] = useState(16);

  const [copied, setCopied] = useState(false);

  // Generate strong password using Web Crypto API
  const generatePassword = () => {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    const array = new Uint32Array(passLength);
    crypto.getRandomValues(array);
    let pwd = '';
    for (let i = 0; i < passLength; i++) {
      pwd += chars[array[i] % chars.length];
    }
    setGeneratedPassword(pwd);
  };

  useEffect(() => {
    if (tool.id.includes('password') || tool.id.includes('pin')) {
      generatePassword();
    }
  }, [tool.id, passLength, useUpper, useLower, useNumbers, useSymbols]);

  // Generate Lorem Ipsum
  const generateLorem = () => {
    const wordsPool = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
      'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
      'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
      'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
      'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
    ];

    if (loremType === 'words') {
      const arr = [];
      for (let i = 0; i < loremCount; i++) {
        arr.push(wordsPool[Math.floor(Math.random() * wordsPool.length)]);
      }
      setLoremOutput(arr.join(' '));
    } else if (loremType === 'sentences') {
      const sentences = [];
      for (let s = 0; s < loremCount; s++) {
        const words = [];
        const length = 8 + Math.floor(Math.random() * 8);
        for (let w = 0; w < length; w++) {
          words.push(wordsPool[Math.floor(Math.random() * wordsPool.length)]);
        }
        const str = words.join(' ');
        sentences.push(str.charAt(0).toUpperCase() + str.slice(1) + '.');
      }
      setLoremOutput(sentences.join(' '));
    } else {
      // Paragraphs
      const paras = [];
      for (let p = 0; p < loremCount; p++) {
        const sentences = [];
        for (let s = 0; s < 4; s++) {
          const words = [];
          for (let w = 0; w < 10; w++) {
            words.push(wordsPool[Math.floor(Math.random() * wordsPool.length)]);
          }
          const str = words.join(' ');
          sentences.push(str.charAt(0).toUpperCase() + str.slice(1) + '.');
        }
        paras.push(sentences.join(' '));
      }
      setLoremOutput(paras.join('\n\n'));
    }
  };

  useEffect(() => {
    if (tool.id.includes('lorem')) {
      generateLorem();
    }
  }, [tool.id, loremType, loremCount]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Flip Coin
  const flipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const res = Math.random() >= 0.5 ? 'Heads' : 'Tails';
      setCoinResult(res);
      setIsFlipping(false);
    }, 600);
  };

  // Roll Dice
  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceResult(roll);
      setIsRolling(false);
    }, 500);
  };

  // Random Choice
  const pickChoice = () => {
    const list = choiceInput.split('\n').map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) return;
    const randomItem = list[Math.floor(Math.random() * list.length)];
    setPickedChoice(randomItem);
  };

  // Password / PIN view
  if (tool.id.includes('password') || tool.id.includes('pin')) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between gap-3">
          <div className="font-mono text-base sm:text-xl font-bold tracking-wider text-neutral-900 dark:text-white break-all select-all">
            {generatedPassword}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(generatedPassword)}
              className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
              title="Copy password"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={generatePassword}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              title="Regenerate"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-neutral-500">Security Strength:</span>
            <span className={passLength >= 14 ? 'text-emerald-600' : 'text-amber-600'}>
              {passLength >= 16 ? 'Extremely Strong' : passLength >= 12 ? 'Strong' : 'Moderate'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
            <div
              className={`h-full transition-all ${
                passLength >= 16 ? 'bg-emerald-500 w-full' : passLength >= 12 ? 'bg-indigo-500 w-3/4' : 'bg-amber-500 w-1/2'
              }`}
            />
          </div>
        </div>

        {/* Password Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              <span>Password Length:</span>
              <span>{passLength} characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={passLength}
              onChange={(e) => setPassLength(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={(e) => setUseUpper(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useLower}
                onChange={(e) => setUseLower(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Lorem Ipsum view
  if (tool.id.includes('lorem')) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <select
              value={loremType}
              onChange={(e) => setLoremType(e.target.value as 'paragraphs' | 'sentences' | 'words')}
              className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-900"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
            <input
              type="number"
              min="1"
              max="50"
              value={loremCount}
              onChange={(e) => setLoremCount(parseInt(e.target.value) || 1)}
              className="w-20 p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs text-center font-bold bg-white dark:bg-neutral-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateLorem}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Generate
            </button>
            <button
              onClick={() => handleCopy(loremOutput)}
              className="flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <textarea
          readOnly
          rows={8}
          value={loremOutput}
          className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 p-4 font-serif text-sm leading-relaxed text-neutral-800 dark:text-neutral-200"
        />
      </div>
    );
  }

  // Coin Flip & Dice
  if (tool.id.includes('coin') || tool.id.includes('dice')) {
    const isCoin = tool.id.includes('coin');
    return (
      <div className="space-y-6 text-center">
        {isCoin ? (
          <div className="py-8">
            <div className={`mx-auto h-32 w-32 rounded-full border-4 border-amber-400 bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-2xl font-black text-amber-950 shadow-xl transition-all ${isFlipping ? 'animate-spin' : ''}`}>
              {coinResult || 'Flip'}
            </div>
            <button
              onClick={flipCoin}
              disabled={isFlipping}
              className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95"
            >
              Flip Coin
            </button>
          </div>
        ) : (
          <div className="py-8">
            <div className={`mx-auto h-28 w-28 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-5xl font-black text-indigo-600 dark:text-indigo-400 shadow-lg ${isRolling ? 'animate-bounce' : ''}`}>
              {diceResult || 6}
            </div>
            <button
              onClick={rollDice}
              disabled={isRolling}
              className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95"
            >
              Roll Dice (D6)
            </button>
          </div>
        )}
      </div>
    );
  }

  // Random Choice Picker
  if (tool.id.includes('choice') || tool.id.includes('decision')) {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Enter Options (One per line):
          </label>
          <textarea
            rows={5}
            value={choiceInput}
            onChange={(e) => setChoiceInput(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 text-sm font-medium text-neutral-900 dark:text-white"
          />
        </div>

        <div className="text-center">
          <button
            onClick={pickChoice}
            className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-xs"
          >
            <Shuffle className="h-4 w-4" />
            <span>Randomly Pick One</span>
          </button>
        </div>

        {pickedChoice && (
          <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-center">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 uppercase font-bold">The Winner Is:</span>
            <div className="text-3xl font-black text-indigo-900 dark:text-indigo-200 mt-1">{pickedChoice}</div>
          </div>
        )}
      </div>
    );
  }

  // CSS Box Shadow
  if (tool.id.includes('box-shadow')) {
    const shadowStyle = `${bsX}px ${bsY}px ${bsBlur}px ${bsSpread}px ${bsColor}`;
    return (
      <div className="space-y-6">
        <div className="p-12 rounded-2xl bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
          <div
            style={{ boxShadow: shadowStyle }}
            className="h-36 w-48 rounded-2xl bg-white dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-500"
          >
            Box Shadow
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span>Offset X: {bsX}px</span>
            <input type="range" min="-50" max="50" value={bsX} onChange={(e) => setBsX(parseInt(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <span>Offset Y: {bsY}px</span>
            <input type="range" min="-50" max="50" value={bsY} onChange={(e) => setBsY(parseInt(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <span>Blur: {bsBlur}px</span>
            <input type="range" min="0" max="100" value={bsBlur} onChange={(e) => setBsBlur(parseInt(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <span>Spread: {bsSpread}px</span>
            <input type="range" min="-20" max="50" value={bsSpread} onChange={(e) => setBsSpread(parseInt(e.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-900 text-xs font-mono text-emerald-400">
          <span>box-shadow: {shadowStyle};</span>
          <button onClick={() => handleCopy(`box-shadow: ${shadowStyle};`)} className="text-white hover:underline">Copy</button>
        </div>
      </div>
    );
  }

  // Default: Symbols & Kaomoji Picker
  const symbols = [
    '★', '✦', '✧', '✪', '✯', '✿', '❀', '❃', '❄', '❅', '❤', '❥', '❣', '✓', '✔', '✕', '✖', '♪', '♫', '♬',
    '⚡', '☀', '☁', '☂', '☕', '⚓', '⚔', '⚖', '✈', '✉', '✎', '✏', '✂', '➜', '➤', '➔', '©', '®', '™', '∞',
    '(✿◠‿◠)', '(｡◕‿◕｡)', '(◕‿◕✿)', '¯\\_(ツ)_/¯', '(╯°□°)╯︵ ┻━┻', '( ͡° ͜ʖ ͡°)', '(づ｡◕‿‿◕｡)づ', 'ʕ•ᴥ•ʔ',
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">Click any symbol or Kaomoji to instantly copy to clipboard:</p>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {symbols.map((sym, i) => (
          <button
            key={i}
            onClick={() => {
              navigator.clipboard.writeText(sym);
              onToast(`Copied "${sym}"!`);
            }}
            className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 hover:bg-indigo-50 hover:border-indigo-400 dark:hover:bg-indigo-950/40 text-base sm:text-lg flex items-center justify-center transition-all"
          >
            {sym}
          </button>
        ))}
      </div>
    </div>
  );
};
