import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { Tool } from '../types';
import { ALL_TOOLS } from '../data/toolsRegistry';
import { DynamicIcon } from './DynamicIcon';
import { ToolCard } from './ToolCard';

interface ToolLayoutProps {
  tool: Tool;
  categoryName?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack?: () => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  categoryName,
  isFavorite,
  onToggleFavorite,
  onBack,
  children,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  // Find 4 related tools in the same category
  const relatedTools = ALL_TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
        <button
          id="tool-back-btn"
          onClick={handleBack}
          className="back-btn mb-0!"
        >
          ← Main Menu
        </button>

        <div className="flex items-center gap-1 truncate text-xs font-semibold opacity-80">
          <button
            onClick={() => navigate('/')}
            className="hover:underline text-[#007bff] dark:text-white"
          >
            Tool Bazar
          </button>
          <ChevronRight className="h-3.5 w-3.5 opacity-50 shrink-0" />
          <span className="capitalize opacity-80 truncate">
            {categoryName || tool.category.replace('-', ' ')}
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-50 shrink-0" />
          <span className="font-bold opacity-100 truncate">
            {tool.name}
          </span>
        </div>
      </div>

      {/* Tool Header Card */}
      <div
        className="rounded-2xl border p-5 sm:p-6 shadow-sm"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[#007bff] dark:text-white border"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
              }}
            >
              <DynamicIcon name={tool.icon} className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#007bff] dark:text-white">
                  {tool.name}
                </h1>
                {tool.isPopular && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold border border-blue-500/40 text-[#007bff] dark:text-white dark:bg-blue-900/40">
                    POPULAR
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-black dark:text-white">
                {tool.description}
              </p>
            </div>
          </div>

          <button
            id="tool-page-favorite-btn"
            onClick={onToggleFavorite}
            className="rounded-xl border p-2.5 transition-colors shrink-0"
            style={{
              backgroundColor: 'var(--bg-color)',
              borderColor: 'var(--border-color)',
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Star
              className={`h-5 w-5 ${
                isFavorite
                  ? 'fill-amber-400 text-amber-500'
                  : 'opacity-40'
              }`}
            />
          </button>
        </div>

        {/* 100% Client-Side Privacy Guarantee */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 px-3.5 py-2 text-xs font-medium text-black dark:text-white border border-blue-100 dark:border-blue-900/50">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#007bff] dark:text-blue-400" />
          <span>
            Client-Side Privacy: Runs 100% inside your browser. No files, text, or videos are ever uploaded to any server.
          </span>
        </div>
      </div>

      {/* Main Tool Interactive Interface */}
      <div className="rounded-2xl border border-blue-100/90 dark:border-blue-900/60 bg-white dark:bg-[#0c1833] p-5 sm:p-6 shadow-2xs">
        {children}
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#007bff] dark:text-white">
            More Tools in {categoryName || tool.category.replace('-', ' ')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {relatedTools.map((relTool) => (
              <ToolCard
                key={relTool.id}
                tool={relTool}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
