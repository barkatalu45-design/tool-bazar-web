import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Maximize2,
  Smartphone,
  Tablet,
  Monitor,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Tool } from '../../types';

interface DeveloperToolsViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

const TEMPLATES = {
  webpage: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Webpage</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; background: #f8fafc; color: #1e293b; }
    .card { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); max-width: 600px; margin: 0 auto; text-align: center; }
    h1 { color: #4f46e5; margin-bottom: 8px; }
    p { color: #64748b; line-height: 1.6; }
    button { background: #4f46e5; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello from Utility Bazaar!</h1>
    <p>This is a live, sandboxed HTML preview running completely in your browser.</p>
    <button onclick="alert('Hello from safe JavaScript!')">Click Me</button>
  </div>
</body>
</html>`,
  card: `<div style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 80vh; background: #f1f5f9;">
  <div style="background: white; border-radius: 16px; padding: 24px; width: 320px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
    <div style="height: 120px; background: linear-gradient(135deg, #6366f1, #ec4899); border-radius: 12px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px;">
      Featured Card
    </div>
    <h3 style="margin: 0 0 8px 0; color: #0f172a;">Modern Design</h3>
    <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.5;">Clean UI elements crafted with inline styles.</p>
    <button style="width: 100%; padding: 10px; background: #0f172a; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">Explore More</button>
  </div>
</div>`,
  buttons: `<div style="font-family: sans-serif; padding: 40px; display: flex; flex-wrap: gap: 16px; justify-content: center; gap: 12px; background: #f8fafc;">
  <button style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">Primary</button>
  <button style="padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">Success</button>
  <button style="padding: 12px 24px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">Danger</button>
  <button style="padding: 12px 24px; background: white; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; cursor: pointer;">Outline</button>
</div>`,
  form: `<div style="font-family: sans-serif; max-width: 400px; margin: 40px auto; padding: 32px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
  <h2 style="margin: 0 0 20px 0; color: #1e293b;">Sign In</h2>
  <div style="margin-bottom: 16px;">
    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #475569;">Email Address</label>
    <input type="email" placeholder="you@example.com" style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
  </div>
  <div style="margin-bottom: 24px;">
    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #475569;">Password</label>
    <input type="password" placeholder="••••••••" style="width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
  </div>
  <button type="button" style="width: 100%; padding: 12px; background: #6366f1; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Continue</button>
</div>`,
  portfolio: `<div style="font-family: sans-serif; min-height: 90vh; background: #09090b; color: #fafafa; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; text-align: center;">
  <div style="display: inline-block; padding: 6px 16px; background: #27272a; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #a1a1aa; margin-bottom: 24px; border: 1px solid #3f3f46;">✦ AVAILABLE FOR WORK</div>
  <h1 style="font-size: 48px; font-weight: 800; margin: 0 0 16px 0; letter-spacing: -1px; background: linear-gradient(to right, #fff, #a1a1aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Crafting Digital Experiences</h1>
  <p style="font-size: 18px; color: #71717a; max-width: 500px; margin: 0 0 32px 0; line-height: 1.6;">Full-stack developer specializing in modern web applications, high performance, and accessible systems.</p>
  <div style="display: flex; gap: 12px;">
    <button style="padding: 12px 28px; background: #ffffff; color: #09090b; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">View Projects</button>
    <button style="padding: 12px 28px; background: #18181b; color: #ffffff; border: 1px solid #27272a; border-radius: 8px; font-weight: 600; cursor: pointer;">Contact</button>
  </div>
</div>`,
};

export const DeveloperToolsView: React.FC<DeveloperToolsViewProps> = ({ tool, onToast }) => {
  const isHtmlViewer = [
    'html-viewer',
    'html-previewer',
    'code-runner',
    'html-editor',
    'html-code-tester',
    'html-playground',
  ].includes(tool.id);

  // States for HTML Playground (empty by default so user can write or choose template)
  const [htmlCode, setHtmlCode] = useState('');
  const [activeTab, setActiveTab] = useState<'split' | 'code' | 'preview'>('split');
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);

  // States for JSON & formatting tools - empty by default so user writes own code
  const [inputData, setInputData] = useState('');
  const [formatResult, setFormatResult] = useState('');
  const [formatError, setFormatError] = useState('');

  // States for Regex Tester
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexTestString, setRegexTestString] = useState('');

  // States for JWT Decoder
  const [jwtInput, setJwtInput] = useState('');
  const [jwtHeader, setJwtHeader] = useState('');
  const [jwtPayload, setJwtPayload] = useState('');
  const [jwtStatus, setJwtStatus] = useState<{ expired: boolean; expDate: string } | null>(null);

  // States for UUID & Hashes
  const [hashInput, setHashInput] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);

  // States for URL Parser
  const [urlToParse, setUrlToParse] = useState('');

  // Compute SHA-256 using native Web Crypto API
  useEffect(() => {
    async function computeHash() {
      if (!hashInput.trim()) {
        setSha256Hash('');
        return;
      }
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(hashInput);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        setSha256Hash(hashHex);
      } catch {
        setSha256Hash('Error generating hash');
      }
    }
    computeHash();
  }, [hashInput]);

  // Handle JSON, CSS, JS formatting/minification
  useEffect(() => {
    setFormatError('');
    if (!inputData.trim()) {
      setFormatResult('');
      return;
    }
    try {
      if (tool.id.includes('json')) {
        const parsed = JSON.parse(inputData);
        if (tool.id === 'json-minifier') {
          setFormatResult(JSON.stringify(parsed));
        } else {
          setFormatResult(JSON.stringify(parsed, null, 2));
        }
      } else if (tool.id.includes('css')) {
        if (tool.id === 'css-minifier') {
          setFormatResult(inputData.replace(/\s+/g, ' ').replace(/ ?([:;{}]) ?/g, '$1').trim());
        } else {
          // CSS Beautifier
          setFormatResult(inputData.replace(/{/g, ' {\n  ').replace(/;/g, ';\n  ').replace(/}/g, '\n}\n'));
        }
      } else if (tool.id.includes('js')) {
        if (tool.id === 'js-minifier') {
          setFormatResult(inputData.replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').trim());
        } else {
          setFormatResult(inputData);
        }
      } else if (tool.id.includes('url')) {
        if (tool.id === 'url-encoder') {
          setFormatResult(encodeURIComponent(inputData));
        } else if (tool.id === 'url-decoder') {
          setFormatResult(decodeURIComponent(inputData));
        }
      } else if (tool.id.includes('html-entity')) {
        if (tool.id === 'html-entity-encoder') {
          setFormatResult(inputData.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m)));
        } else {
          setFormatResult(inputData.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }
      } else {
        setFormatResult(inputData);
      }
    } catch (err: unknown) {
      setFormatError(err instanceof Error ? err.message : 'Invalid format syntax');
      setFormatResult('');
    }
  }, [tool.id, inputData]);

  // JWT Decoder computation
  useEffect(() => {
    if (!jwtInput.trim()) {
      setJwtHeader('');
      setJwtPayload('');
      setJwtStatus(null);
      return;
    }
    try {
      const parts = jwtInput.trim().split('.');
      if (parts.length >= 2) {
        const headerJson = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        setJwtHeader(JSON.stringify(JSON.parse(headerJson), null, 2));
        const payloadObj = JSON.parse(payloadJson);
        setJwtPayload(JSON.stringify(payloadObj, null, 2));

        if (payloadObj.exp) {
          const expMs = payloadObj.exp * 1000;
          const isExpired = Date.now() > expMs;
          setJwtStatus({
            expired: isExpired,
            expDate: new Date(expMs).toLocaleString(),
          });
        } else {
          setJwtStatus(null);
        }
      }
    } catch {
      setJwtHeader('Invalid JWT format');
      setJwtPayload('');
      setJwtStatus(null);
    }
  }, [jwtInput]);

  // Generate UUIDs
  const generateNewUuids = (count = 5) => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }));
    }
    setGeneratedUuids(list);
  };

  useEffect(() => {
    if (tool.id.includes('uuid')) {
      generateNewUuids(5);
    }
  }, [tool.id]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onToast(`Downloaded ${filename}`);
  };

  // Safe Sandboxed HTML Iframe Runner
  if (isHtmlViewer) {
    const getViewportWidth = () => {
      switch (viewportSize) {
        case 'mobile':
          return 'max-w-sm';
        case 'tablet':
          return 'max-w-xl';
        default:
          return 'w-full';
      }
    };

    return (
      <div className="space-y-4">
        {/* Top Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 p-3">
          {/* Template presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Templates:</span>
            <select
              onChange={(e) => {
                const key = e.target.value as keyof typeof TEMPLATES;
                if (TEMPLATES[key]) setHtmlCode(TEMPLATES[key]);
              }}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:text-neutral-200"
            >
              <option value="webpage">Simple Webpage</option>
              <option value="card">Modern Card</option>
              <option value="buttons">Button Collection</option>
              <option value="form">Sign In Form</option>
              <option value="portfolio">Portfolio Hero</option>
            </select>
          </div>

          {/* Viewport size selectors */}
          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setViewportSize('mobile')}
              className={`p-1.5 rounded text-xs ${viewportSize === 'mobile' ? 'bg-indigo-600 text-white' : 'text-neutral-500'}`}
              title="Mobile Preview (375px)"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`p-1.5 rounded text-xs ${viewportSize === 'tablet' ? 'bg-indigo-600 text-white' : 'text-neutral-500'}`}
              title="Tablet Preview (640px)"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewportSize('desktop')}
              className={`p-1.5 rounded text-xs ${viewportSize === 'desktop' ? 'bg-indigo-600 text-white' : 'text-neutral-500'}`}
              title="Desktop Fullwidth"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIframeKey((k) => k + 1)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </button>
            <button
              onClick={() => handleCopy(htmlCode)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => handleDownload(htmlCode, 'index.html')}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        </div>

        {/* Editor & Preview Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* HTML Code Editor */}
          <div className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2 bg-neutral-950 text-xs text-neutral-400 font-mono">
              <span>HTML / CSS / JS Code</span>
              <button
                onClick={() => setHtmlCode(TEMPLATES.webpage)}
                className="text-neutral-500 hover:text-white"
              >
                Reset
              </button>
            </div>
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="w-full h-96 p-4 font-mono text-xs bg-neutral-900 text-neutral-200 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Sandboxed Live Iframe */}
          <div className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 bg-neutral-50 dark:bg-neutral-950 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Safe Sandboxed Preview
              </span>
              <span className="text-[10px] text-neutral-400">sandbox="allow-scripts"</span>
            </div>

            <div className="h-96 w-full flex items-center justify-center p-2 bg-neutral-100 dark:bg-neutral-950 overflow-auto">
              <iframe
                key={iframeKey}
                title="Sandboxed Output"
                srcDoc={htmlCode}
                sandbox="allow-scripts"
                className={`h-full bg-white shadow-md rounded-lg transition-all ${getViewportWidth()}`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regex Tester View
  if (tool.id.includes('regex')) {
    let matchesCount = 0;
    let matchItems: string[] = [];
    let regexError = '';

    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches = regexTestString.match(re);
      if (matches) {
        matchesCount = matches.length;
        matchItems = Array.from(matches);
      }
    } catch (e: unknown) {
      regexError = e instanceof Error ? e.message : 'Invalid Regular Expression';
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Regular Expression Pattern:
            </label>
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 font-mono text-sm text-neutral-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Flags (e.g. g, i, m):
            </label>
            <input
              type="text"
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 font-mono text-sm text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        {regexError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            ⚠️ {regexError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Test String:
          </label>
          <textarea
            rows={4}
            value={regexTestString}
            onChange={(e) => setRegexTestString(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3.5 text-sm text-neutral-900 dark:text-white"
          />
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Matches Found: <span className="text-indigo-600 dark:text-indigo-400">{matchesCount}</span>
            </span>
          </div>
          {matchItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchItems.map((m, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-indigo-100 dark:bg-indigo-950 px-2.5 py-1 text-xs font-mono font-medium text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  {m}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500">No match found in test string.</p>
          )}
        </div>
      </div>
    );
  }

  // JWT Decoder View
  if (tool.id.includes('jwt')) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Paste JWT Token:
          </label>
          <textarea
            rows={3}
            value={jwtInput}
            onChange={(e) => setJwtInput(e.target.value)}
            placeholder="Paste your eyJ... token here"
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 font-mono text-xs text-neutral-900 dark:text-white"
          />
        </div>

        {jwtStatus && (
          <div
            className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
              jwtStatus.expired
                ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300'
            }`}
          >
            <span>{jwtStatus.expired ? 'Token Expired' : 'Token Valid (Not Expired)'}</span>
            <span>Expiration: {jwtStatus.expDate}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span>HEADER (ALGORITHM & TOKEN TYPE)</span>
              <button onClick={() => handleCopy(jwtHeader)} className="text-indigo-600 hover:underline">Copy</button>
            </div>
            <pre className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 p-3 font-mono text-xs text-indigo-300 h-44 overflow-auto">
              {jwtHeader}
            </pre>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span>PAYLOAD (DATA CLAIMS)</span>
              <button onClick={() => handleCopy(jwtPayload)} className="text-indigo-600 hover:underline">Copy</button>
            </div>
            <pre className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 p-3 font-mono text-xs text-emerald-400 h-44 overflow-auto">
              {jwtPayload}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // UUID Generator View
  if (tool.id.includes('uuid')) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-500">
            Cryptographically secure RFC 4122 v4 UUIDs generated locally via Web Crypto API.
          </span>
          <button
            onClick={() => generateNewUuids(5)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-indigo-700"
          >
            Generate New
          </button>
        </div>

        <div className="space-y-2">
          {generatedUuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 p-3 font-mono text-xs sm:text-sm text-neutral-900 dark:text-white"
            >
              <span>{uuid}</span>
              <button
                onClick={() => handleCopy(uuid)}
                className="flex items-center gap-1 rounded bg-white dark:bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Hash Generator View
  if (tool.id.includes('hash')) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Input Text to Hash:
          </label>
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-white"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1 text-xs font-bold text-neutral-600 dark:text-neutral-400">
            <span>SHA-256 Hash (Web Crypto API):</span>
            <button onClick={() => handleCopy(sha256Hash)} className="text-indigo-600 hover:underline">Copy</button>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 p-3.5 font-mono text-xs text-amber-400 break-all select-all">
            {sha256Hash || 'Computing...'}
          </div>
        </div>
      </div>
    );
  }

  // URL Parser View
  if (tool.id.includes('url-parser')) {
    let parsedUrl: URL | null = null;
    try {
      parsedUrl = new URL(urlToParse);
    } catch {
      parsedUrl = null;
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Enter Full URL:
          </label>
          <input
            type="text"
            value={urlToParse}
            onChange={(e) => setUrlToParse(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-white"
          />
        </div>

        {parsedUrl ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800/40">
              <span className="font-semibold text-neutral-500">Protocol:</span>
              <div className="font-mono text-neutral-900 dark:text-white mt-0.5">{parsedUrl.protocol}</div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800/40">
              <span className="font-semibold text-neutral-500">Host / Domain:</span>
              <div className="font-mono text-neutral-900 dark:text-white mt-0.5">{parsedUrl.hostname}</div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800/40">
              <span className="font-semibold text-neutral-500">Pathname:</span>
              <div className="font-mono text-neutral-900 dark:text-white mt-0.5">{parsedUrl.pathname}</div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800/40">
              <span className="font-semibold text-neutral-500">Hash / Anchor:</span>
              <div className="font-mono text-neutral-900 dark:text-white mt-0.5">{parsedUrl.hash || 'None'}</div>
            </div>
            <div className="sm:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800/40">
              <span className="font-semibold text-neutral-500">Query Parameters:</span>
              <div className="font-mono text-neutral-900 dark:text-white mt-1 space-y-1">
                {Array.from(parsedUrl.searchParams.entries()).length > 0 ? (
                  Array.from(parsedUrl.searchParams.entries()).map(([k, v], idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400">{k}:</span>
                      <span>{v}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-neutral-400">No query parameters</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            Please enter a valid URL starting with http:// or https://
          </div>
        )}
      </div>
    );
  }

  // Default: JSON / CSS / JS / HTML Entity Formatters
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Source Code / Input:
          </label>
          <button
            onClick={() => setInputData('')}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-rose-500"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        </div>
        <textarea
          rows={6}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Paste code or text here..."
          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 font-mono text-xs text-neutral-900 dark:text-white focus:outline-none"
        />
      </div>

      {formatError && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formatError}</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Formatted Output:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(formatResult)}
              className="flex items-center gap-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => handleDownload(formatResult, `${tool.id}-output.txt`)}
              className="flex items-center gap-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
            >
              <Download className="h-3 w-3" />
              Download
            </button>
          </div>
        </div>
        <textarea
          readOnly
          rows={6}
          value={formatResult}
          placeholder="Output will appear here..."
          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-3 font-mono text-xs text-neutral-900 dark:text-white focus:outline-none"
        />
      </div>
    </div>
  );
};
