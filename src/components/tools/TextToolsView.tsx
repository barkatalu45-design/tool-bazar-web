import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Download, ArrowRightLeft } from 'lucide-react';
import { Tool } from '../../types';
import {
  analyzeText,
  repeatText,
  toUppercase,
  toLowercase,
  toCapitalized,
  toTitleCase,
  removeExtraSpaces,
  removeEmptyLines,
  removeDuplicateLines,
  sortLines,
  reverseText,
  reverseLines,
  findAndReplace,
  cleanText,
  extractEmails,
  extractUrls,
  extractPhoneNumbers,
  extractNumbers,
  extractHashtags,
  extractMentions,
  textToBinary,
  binaryToText,
  textToAscii,
  asciiToText,
  textToBase64,
  base64ToText,
  textToHex,
  hexToText,
  textToMorse,
  morseToText,
} from '../../utils/textTransform';

interface TextToolsViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const TextToolsView: React.FC<TextToolsViewProps> = ({ tool, onToast }) => {
  // Start with clean empty inputs so user types their own text
  const [inputText, setInputText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [repeatCount, setRepeatCount] = useState(10);
  const [repeatSeparator, setRepeatSeparator] = useState('\n');
  const [findWord, setFindWord] = useState('');
  const [replaceWord, setReplaceWord] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live Text Analysis Stats
  const stats = useMemo(() => analyzeText(inputText), [inputText]);

  // Compute transformation according to tool.id
  const transformedResult = useMemo(() => {
    setErrorMessage('');
    try {
      switch (tool.id) {
        case 'text-repeater':
          return repeatText(inputText, repeatCount, repeatSeparator);
        case 'uppercase-converter':
          return toUppercase(inputText);
        case 'lowercase-converter':
          return toLowercase(inputText);
        case 'capitalize-text':
          return toCapitalized(inputText);
        case 'title-case-converter':
          return toTitleCase(inputText);
        case 'remove-extra-spaces':
          return removeExtraSpaces(inputText);
        case 'remove-empty-lines':
          return removeEmptyLines(inputText);
        case 'remove-duplicate-lines':
          return removeDuplicateLines(inputText);
        case 'sort-lines-az':
          return sortLines(inputText, true);
        case 'sort-lines-za':
          return sortLines(inputText, false);
        case 'reverse-text':
          return reverseText(inputText);
        case 'reverse-lines':
          return reverseLines(inputText);
        case 'find-and-replace':
          return findAndReplace(inputText, findWord, replaceWord, isRegex, true);
        case 'text-cleaner':
          return cleanText(inputText);
        case 'extract-emails':
          return extractEmails(inputText).join('\n') || 'No email addresses found.';
        case 'extract-urls':
          return extractUrls(inputText).join('\n') || 'No URLs found.';
        case 'extract-phone-numbers':
          return extractPhoneNumbers(inputText).join('\n') || 'No phone numbers found.';
        case 'extract-numbers':
          return extractNumbers(inputText).join('\n') || 'No numeric values found.';
        case 'extract-hashtags':
          return extractHashtags(inputText).join('\n') || 'No hashtags found.';
        case 'extract-mentions':
          return extractMentions(inputText).join('\n') || 'No @mentions found.';
        case 'text-to-binary':
          return textToBinary(inputText);
        case 'binary-to-text':
          return binaryToText(inputText);
        case 'text-to-ascii':
          return textToAscii(inputText);
        case 'ascii-to-text':
          return asciiToText(inputText);
        case 'text-to-base64':
          return textToBase64(inputText);
        case 'base64-to-text':
          return base64ToText(inputText);
        case 'text-to-hex':
          return textToHex(inputText);
        case 'hex-to-text':
          return hexToText(inputText);
        case 'morse-code-converter':
          return textToMorse(inputText);
        case 'morse-code-to-text':
          return morseToText(inputText);
        default:
          return inputText;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transformation error';
      setErrorMessage(msg);
      return '';
    }
  }, [tool.id, inputText, repeatCount, repeatSeparator, findWord, replaceWord, isRegex]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (text: string, filename = 'result.txt') => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    onToast('File downloaded successfully');
  };

  const handleClear = () => {
    setInputText('');
    setFindWord('');
    setReplaceWord('');
  };

  const isDiffTool = tool.id === 'text-compare';
  const isCounterTool = [
    'word-counter',
    'character-counter',
    'character-counter-no-spaces',
    'letter-counter',
    'number-counter',
    'sentence-counter',
    'line-counter',
    'paragraph-counter',
    'reading-time-calculator',
  ].includes(tool.id);

  return (
    <div className="space-y-6">
      {/* Live Text Metric Badges with Crystal Clear High Contrast */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          className="rounded-xl border p-3.5 text-center transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="text-2xl sm:text-3xl font-black text-[#007bff] dark:text-[#60a5fa] tracking-tight">
            {stats.words}
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mt-1">
            Words
          </div>
        </div>

        <div
          className="rounded-xl border p-3.5 text-center transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="text-2xl sm:text-3xl font-black text-[#007bff] dark:text-[#60a5fa] tracking-tight">
            {stats.characters}
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mt-1">
            Characters
          </div>
        </div>

        <div
          className="rounded-xl border p-3.5 text-center transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="text-2xl sm:text-3xl font-black text-[#007bff] dark:text-[#60a5fa] tracking-tight">
            {stats.charactersNoSpaces}
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mt-1">
            No Spaces
          </div>
        </div>

        <div
          className="rounded-xl border p-3.5 text-center transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="text-2xl sm:text-3xl font-black text-[#007bff] dark:text-[#60a5fa] tracking-tight">
            {stats.sentences}
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mt-1">
            Sentences
          </div>
        </div>

        <div
          className="rounded-xl border p-3.5 text-center transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="text-2xl sm:text-3xl font-black text-[#007bff] dark:text-[#60a5fa] tracking-tight">
            {stats.lines}
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mt-1">
            Lines
          </div>
        </div>

        <div
          className="rounded-xl border p-3.5 text-center transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="text-2xl sm:text-3xl font-black text-[#007bff] dark:text-[#60a5fa] tracking-tight">
            {stats.readingTimeMinutes} min
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mt-1">
            Reading Time
          </div>
        </div>
      </div>

      {/* Specific Controls for Repeater or Find & Replace */}
      {tool.id === 'text-repeater' && (
        <div
          className="flex flex-wrap items-center gap-4 rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-900 dark:text-slate-100">Repeat Count:</label>
            <input
              type="number"
              min="1"
              max="5000"
              value={repeatCount}
              onChange={(e) => setRepeatCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 rounded-lg border px-2.5 py-1.5 text-sm font-semibold"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-900 dark:text-slate-100">Separator:</label>
            <select
              value={repeatSeparator}
              onChange={(e) => setRepeatSeparator(e.target.value)}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <option value="\n">New Line</option>
              <option value=" ">Space</option>
              <option value=", ">Comma + Space</option>
              <option value=" - ">Hyphen</option>
              <option value="">No separator</option>
            </select>
          </div>
        </div>
      )}

      {tool.id === 'find-and-replace' && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border p-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">Find String:</label>
            <input
              type="text"
              placeholder="e.g. quick"
              value={findWord}
              onChange={(e) => setFindWord(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">Replace With:</label>
            <input
              type="text"
              placeholder="e.g. speedy"
              value={replaceWord}
              onChange={(e) => setReplaceWord(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="regex-check"
              checked={isRegex}
              onChange={(e) => setIsRegex(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="regex-check" className="text-xs text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
              Use Regular Expressions (Regex)
            </label>
          </div>
        </div>
      )}

      {/* Main Input Field */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {isDiffTool ? 'Original Text (Left)' : 'Enter or Paste Text:'}
          </label>
          {inputText && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Text
            </button>
          )}
        </div>
        <textarea
          rows={isDiffTool ? 6 : 5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full rounded-xl border p-3.5 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#007bff] focus:outline-none transition-all resize-y"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-color)',
            boxShadow: 'var(--shadow)',
          }}
        />
      </div>

      {/* Diff comparison field */}
      {isDiffTool && (
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Modified Text (Right):
          </label>
          <textarea
            rows={6}
            value={secondaryText}
            onChange={(e) => setSecondaryText(e.target.value)}
            placeholder="Type or paste modified text here..."
            className="w-full rounded-xl border p-3.5 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#007bff] focus:outline-none transition-all resize-y"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)',
              boxShadow: 'var(--shadow)',
            }}
          />

          <div
            className="mt-4 p-4 rounded-xl border"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2">
              Diff Comparison Results:
            </h4>
            <div className="space-y-1 font-mono text-xs">
              {inputText.split('\n').map((line, i) => {
                const modLine = secondaryText.split('\n')[i] || '';
                if (line === modLine) {
                  return (
                    <div key={i} className="text-slate-600 dark:text-slate-300 py-0.5">
                      {line}
                    </div>
                  );
                }
                return (
                  <div key={i} className="py-0.5 space-y-0.5">
                    <div className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded font-semibold">
                      - {line}
                    </div>
                    <div className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded font-semibold">
                      + {modLine}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/60 p-3.5 text-xs text-rose-800 dark:text-rose-200 font-semibold">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Result Container (For all transformation tools) */}
      {!isDiffTool && !isCounterTool && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ArrowRightLeft className="h-4 w-4 text-[#007bff]" />
              Live Result:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(transformedResult)}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={() => handleDownload(transformedResult, `${tool.id}-result.txt`)}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>

          <textarea
            readOnly
            rows={5}
            value={transformedResult}
            placeholder="Result will appear here automatically when you type above..."
            className="w-full rounded-xl border p-3.5 text-sm font-mono focus:outline-none resize-y"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-color)',
              boxShadow: 'var(--shadow)',
            }}
          />
        </div>
      )}
    </div>
  );
};
