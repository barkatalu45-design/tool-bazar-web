import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { TopFixedEightAdStrip } from './components/TopFixedEightAdStrip';
import { InterstitialSkipAdModal } from './components/InterstitialSkipAdModal';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { AntiAdBlockerModal } from './components/AntiAdBlockerModal';

export default function App() {
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ub_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('ub_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites Management
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ub_favorites');
      return saved ? JSON.parse(saved) : ['word-counter', 'case-converter', 'qr-code-generator', 'image-compressor'];
    } catch {
      return ['word-counter', 'case-converter'];
    }
  });

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      localStorage.setItem('ub_favorites', JSON.stringify(next));
      showToast(prev.includes(toolId) ? 'Removed from favorites' : 'Added to favorites ★');
      return next;
    });
  };

  // Recent Tools Tracking
  const [recentToolIds, setRecentToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ub_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const recordRecentTool = (toolId: string) => {
    setRecentToolIds((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 8);
      localStorage.setItem('ub_recent', JSON.stringify(updated));
      return updated;
    });
  };

  // Toast System
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 2400);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  return (
    <HashRouter>
      <div
        className="min-h-screen flex flex-col font-sans antialiased transition-colors duration-200"
        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
      >
        <TopFixedEightAdStrip />
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onToggleTheme={toggleTheme}
          favoritesCount={favorites.length}
        />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  favorites={favorites}
                  recentToolIds={recentToolIds}
                  onToggleFavorite={toggleFavorite}
                  onToast={showToast}
                />
              }
            />
            <Route
              path="/tool/:toolId"
              element={
                <ToolPage
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onRecordRecent={recordRecentTool}
                  onToast={showToast}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Floating Toast Notification */}
        {toastMsg && (
          <div
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold border animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Interstitial Skip Ad Modal (Pop-up after 40s/90s with Skip button) */}
        <InterstitialSkipAdModal />

        {/* Anti-AdBlocker Detection Modal */}
        <AntiAdBlockerModal />
      </div>
    </HashRouter>
  );
}
