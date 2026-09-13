import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { Tool } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/tool/${tool.id}`);
  };

  return (
    <div
      id={`tool-card-${tool.id}`}
      onClick={handleOpen}
      className="group relative flex flex-col justify-between rounded-2xl border border-blue-100/90 dark:border-blue-900/60 bg-white dark:bg-[#0c1936] p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
            <DynamicIcon name={tool.icon} className="h-5 w-5" />
          </div>

          <button
            id={`favorite-btn-${tool.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(tool.id);
            }}
            className="rounded-lg p-2 text-slate-400 hover:text-amber-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Star
              className={`h-4 w-4 ${
                isFavorite
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <h3 className="font-bold text-[#007bff] dark:text-white text-sm sm:text-base group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors line-clamp-1">
            {tool.name}
          </h3>
          {tool.isPopular && (
            <span className="rounded-full bg-blue-100/70 dark:bg-blue-950/80 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 shrink-0">
              POPULAR
            </span>
          )}
        </div>

        <p className="text-xs text-black dark:text-white leading-relaxed line-clamp-2 mb-3">
          {tool.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-blue-50 dark:border-blue-950/80 text-xs font-semibold text-blue-600 dark:text-blue-400">
        <span className="capitalize text-slate-400 dark:text-blue-300/50 font-medium text-[11px]">
          {tool.category.replace('-', ' ')}
        </span>
        <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Open</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};
