import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopFixedEightAdStrip } from './TopFixedEightAdStrip';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  favoritesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  theme,
  onToggleTheme,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col">
      {/* 8 Instant Top Sponsors Grid (Real Links + 50 Offline Ads) */}
      <TopFixedEightAdStrip />

      <header
        id="top-corner-header"
        className="w-full max-w-[850px] mx-auto flex justify-between items-center px-4 pt-4 pb-2 transition-colors duration-200"
      >
        <div
          id="app-logo"
          className="text-2xl font-bold cursor-pointer select-none text-[#007bff] dark:text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          onClick={() => {
            navigate('/');
            onSearchChange('');
          }}
        >
          <span>🛠️ Tool Bazar</span>
        </div>

        <button
          id="themeBtn"
          onClick={onToggleTheme}
          className="px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer border shadow-sm select-none dark:text-white"
          style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-color)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow)',
          }}
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>
    </div>
  );
};
