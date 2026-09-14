import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_TOOLS, CATEGORIES } from '../data/toolsRegistry';
import { ToolLayout } from '../components/ToolLayout';
import { TextToolsView } from '../components/tools/TextToolsView';
import { StylishTextGeneratorView } from '../components/tools/StylishTextGeneratorView';
import { TextDesignView } from '../components/tools/TextDesignView';
import { DeveloperToolsView } from '../components/tools/DeveloperToolsView';
import { PdfToolsView } from '../components/tools/PdfToolsView';
import { ImageToolsView } from '../components/tools/ImageToolsView';
import { CalculatorView } from '../components/tools/CalculatorView';
import { DateTimeView } from '../components/tools/DateTimeView';
import { DeviceInfoView } from '../components/tools/DeviceInfoView';
import { FileToolsView } from '../components/tools/FileToolsView';
import { ColorToolsView } from '../components/tools/ColorToolsView';
import { GeneratorView } from '../components/tools/GeneratorView';
import { MiscellaneousView } from '../components/tools/MiscellaneousView';
import { NotepadView } from '../components/tools/NotepadView';
import { AdsterraDoubleBanner } from '../components/AdsterraBanner';
import { ArrowLeft, Search } from 'lucide-react';

interface ToolPageProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onRecordRecent: (id: string) => void;
  onToast: (msg: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({
  favorites,
  onToggleFavorite,
  onRecordRecent,
  onToast,
}) => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();

  const tool = ALL_TOOLS.find((t) => t.id === toolId);

  useEffect(() => {
    if (toolId && tool) {
      onRecordRecent(toolId);
      window.scrollTo(0, 0);
    }
  }, [toolId, tool]);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Tool Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">
          The tool you are looking for might have moved or does not exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tool Bazar</span>
        </button>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const isFavorite = favorites.includes(tool.id);

  // Determine which specialized View component to render
  const renderToolComponent = () => {
    // 0. Smart Note Pad
    if (tool.id === 'notepad' || tool.id.includes('note')) {
      return <NotepadView tool={tool} onToast={onToast} />;
    }

    // 1. Stylish Text generator
    if (tool.id.includes('stylish') || tool.id.includes('glitch-text') || tool.id.includes('morse') || tool.id.includes('binary-text') || tool.id.includes('caesar') || tool.category === 'stylish-text') {
      return <StylishTextGeneratorView tool={tool} onToast={onToast} />;
    }

    // 2. CSS / Typography design
    if (tool.id.includes('design') || tool.id.includes('gradient-text') || tool.id.includes('curved') || tool.id.includes('stroke') || tool.id.includes('neon-text') || tool.id.includes('3d-text') || tool.id.includes('css-text') || tool.id.includes('ascii-art')) {
      return <TextDesignView tool={tool} onToast={onToast} />;
    }

    // 3. Developer Tools (JSON, HTML, Regex, Hashes, UUID)
    if (tool.category === 'developer' || tool.id.includes('html') || tool.id.includes('json') || tool.id.includes('regex') || tool.id.includes('jwt') || tool.id.includes('xml') || tool.id.includes('yaml') || tool.id.includes('hash-generator')) {
      return <DeveloperToolsView tool={tool} onToast={onToast} />;
    }

    // 4. PDF Tools
    if (tool.category === 'pdf' || tool.id.includes('pdf')) {
      return <PdfToolsView tool={tool} onToast={onToast} />;
    }

    // 5. Media, Image & Canvas Tools
    if (
      tool.category === 'image' ||
      tool.category === 'media' ||
      tool.id.includes('image') ||
      tool.id.includes('video') ||
      tool.id.includes('background') ||
      tool.id.includes('qr') ||
      tool.id.includes('canvas') ||
      tool.id.includes('meme') ||
      tool.id.includes('favicon')
    ) {
      return <ImageToolsView tool={tool} onToast={onToast} />;
    }

    // 6. Calculators & Math
    if (tool.category === 'calculators' || tool.id.includes('calculator') || tool.id.includes('percent') || tool.id.includes('tax') || tool.id.includes('gst') || tool.id.includes('discount') || tool.id.includes('bmi') || tool.id.includes('tip') || tool.id.includes('interest') || tool.id.includes('unit-converter')) {
      return <CalculatorView tool={tool} onToast={onToast} />;
    }

    // 7. Date & Time
    if (tool.category === 'date-time' || tool.id.includes('stopwatch') || tool.id.includes('countdown') || tool.id.includes('timer') || tool.id.includes('clock') || tool.id.includes('date') || tool.id.includes('pomodoro')) {
      return <DateTimeView tool={tool} onToast={onToast} />;
    }

    // 8. Real Device & Diagnostics
    if (tool.category === 'device' || tool.id.includes('device') || tool.id.includes('screen') || tool.id.includes('browser') || tool.id.includes('battery') || tool.id.includes('pixel-ratio') || tool.id.includes('hardware') || tool.id.includes('touch-screen')) {
      return <DeviceInfoView tool={tool} onToast={onToast} />;
    }

    // 9. Files & Hash inspect
    if (tool.category === 'files' || tool.id.includes('file')) {
      return <FileToolsView tool={tool} onToast={onToast} />;
    }

    // 10. Colors & WCAG Contrast
    if (tool.category === 'colors' || tool.id.includes('color') || tool.id.includes('contrast') || tool.id.includes('gradient')) {
      return <ColorToolsView tool={tool} onToast={onToast} />;
    }

    // 11. Generators
    if (tool.category === 'generators' || tool.id.includes('password') || tool.id.includes('lorem') || tool.id.includes('coin') || tool.id.includes('dice') || tool.id.includes('choice') || tool.id.includes('symbol')) {
      return <GeneratorView tool={tool} onToast={onToast} />;
    }

    // 12. Miscellaneous & Audio
    if (tool.category === 'everyday' || tool.category === 'network' || tool.category === 'student' || tool.id.includes('sound') || tool.id.includes('speech') || tool.id.includes('vibration') || tool.id.includes('ping') || tool.id.includes('scratchpad') || tool.id.includes('mic')) {
      return <MiscellaneousView tool={tool} onToast={onToast} />;
    }

    // Default fallback to versatile Text tools engine
    return <TextToolsView tool={tool} onToast={onToast} />;
  };

  return (
    <ToolLayout
      tool={tool}
      categoryName={category?.name || 'Tools'}
      isFavorite={isFavorite}
      onToggleFavorite={() => onToggleFavorite(tool.id)}
    >
      {renderToolComponent()}
      <AdsterraDoubleBanner />
    </ToolLayout>
  );
};
