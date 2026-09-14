import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_TOOLS, CATEGORIES } from '../data/toolsRegistry';
import { Tool, CategoryId } from '../types';
import { searchToolsMultilingual } from '../utils/multilingualSearch';

// Import all comprehensive tool views so NO feature is cut!
import { CalculatorView } from '../components/tools/CalculatorView';
import { ImageToolsView } from '../components/tools/ImageToolsView';
import { TextToolsView } from '../components/tools/TextToolsView';
import { TextDesignView } from '../components/tools/TextDesignView';
import { DeveloperToolsView } from '../components/tools/DeveloperToolsView';
import { PdfToolsView } from '../components/tools/PdfToolsView';
import { DateTimeView } from '../components/tools/DateTimeView';
import { DeviceInfoView } from '../components/tools/DeviceInfoView';
import { ColorToolsView } from '../components/tools/ColorToolsView';
import { GeneratorView } from '../components/tools/GeneratorView';
import { FileToolsView } from '../components/tools/FileToolsView';
import { MiscellaneousView } from '../components/tools/MiscellaneousView';
import { StylishTextGeneratorView } from '../components/tools/StylishTextGeneratorView';
import { NotepadView } from '../components/tools/NotepadView';
import { LegalModal } from '../components/legal/LegalModal';
import { AdsterraBanner, AdsterraDoubleBanner } from '../components/AdsterraBanner';

interface HomePageProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favorites: string[];
  recentToolIds: string[];
  onToggleFavorite: (id: string) => void;
  onToast: (msg: string) => void;
}

// Category cards with custom icons and labels as requested
interface MainCategoryCard {
  id: string;
  name: string;
  icon: string;
  description: string;
  matchCategoryId?: CategoryId;
}

const MAIN_CATEGORY_CARDS: MainCategoryCard[] = [
  {
    id: 'calculators',
    name: 'Calculate Tool',
    icon: '🧮',
    description: 'Click to open available calculators (Normal, Heavy Math, Age, Percentage, GST & more)',
    matchCategoryId: 'calculators',
  },
  {
    id: 'image',
    name: 'Media & Image Tools',
    icon: '🎬',
    description: 'Video to MP3, background remover, image resizer, compressor, QR code generator & more',
    matchCategoryId: 'image',
  },
  {
    id: 'text',
    name: 'Word & Text Tools',
    icon: '📝',
    description: 'Word counter, case converter, remove extra spaces, text diff checker & slug generator',
    matchCategoryId: 'text',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    icon: '💻',
    description: 'HTML live preview, JSON formatter, Base64 encoder/decoder, regex tester & JWT decoder',
    matchCategoryId: 'developer',
  },
  {
    id: 'date-time',
    name: 'Date & Time Tools',
    icon: '⏱️',
    description: 'Stopwatch, countdown timer, Pomodoro focus timer, world clock & timestamps',
    matchCategoryId: 'date-time',
  },
  {
    id: 'pdf',
    name: 'PDF & Document Tools',
    icon: '📄',
    description: 'Text to PDF, images to PDF, PDF preview & metadata document inspectors',
    matchCategoryId: 'pdf',
  },
  {
    id: 'stylish-text',
    name: 'Stylish Fonts',
    icon: '✨',
    description: '100+ copyable Unicode font styles, symbols, Zalgo & fancy text designer',
    matchCategoryId: 'stylish-text',
  },
  {
    id: 'device',
    name: 'Device Diagnostics',
    icon: '📱',
    description: 'Real battery status, screen info, internet speed test, latency & browser specs',
    matchCategoryId: 'device',
  },
  {
    id: 'colors',
    name: 'Colors & Design',
    icon: '🎨',
    description: 'Color picker, HEX to RGB, contrast checker, CSS gradients & palette generator',
    matchCategoryId: 'colors',
  },
  {
    id: 'generators',
    name: 'Generators & Everyday',
    icon: '🪄',
    description: 'Cryptographic passwords, UUID, Lorem Ipsum generator, coin flip & dice roller',
    matchCategoryId: 'generators',
  },
  {
    id: 'student',
    name: 'Student Tools',
    icon: '🎓',
    description: 'GPA calculator, marks percentage, attendance planner & study timers',
    matchCategoryId: 'student',
  },
  {
    id: 'network',
    name: 'Network Tools',
    icon: '🌐',
    description: 'Real latency tester, IP lookup, user-agent inspector & connection stats',
    matchCategoryId: 'network',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  onSearchChange,
  favorites,
  onToggleFavorite,
  onToast,
}) => {
  const navigate = useNavigate();

  // Step state: 1 = 'main' (Main Categories), 2 = 'subtools' (Sub-Tools List), 3 = 'tool' (Actual Tool Screen)
  const [currentStep, setCurrentStep] = useState<'main' | 'subtools' | 'tool'>('main');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Normal Calculator Dedicated State
  const [normalDisplay, setNormalDisplay] = useState('');

  // Heavy Math Dedicated State
  const [mathDisplay, setMathDisplay] = useState('');

  // Age Calculator Dedicated State
  const [dob, setDob] = useState('');
  const [ageResult, setAgeResult] = useState<string | null>(null);

  // Legal Modal State (Required for Google AdSense compliance)
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Multilingual Search: Runs across English, Roman Urdu, Urdu Script, Hindi Script, etc.
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchToolsMultilingual(searchQuery);
  }, [searchQuery]);

  // When user types in search bar, automatically transition to sub-tools view showing results!
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setCurrentStep('subtools');
    }
  }, [searchQuery]);

  // Get tools for the selected category
  const categoryTools = useMemo(() => {
    if (!selectedCategory) return [];
    // If it's calculators, prioritize the 3 key ones from sample: Normal Calculator, Heavy Mathematics, Age Calculator
    const toolsInCat = ALL_TOOLS.filter((t) => t.category === selectedCategory);
    if (selectedCategory === 'calculators') {
      const basic = toolsInCat.find((t) => t.id === 'basic-calculator');
      const sci = toolsInCat.find((t) => t.id === 'scientific-calculator');
      const age = toolsInCat.find((t) => t.id === 'age-calculator');
      const others = toolsInCat.filter(
        (t) => !['basic-calculator', 'scientific-calculator', 'age-calculator'].includes(t.id)
      );
      return [basic, sci, age, ...others].filter(Boolean) as Tool[];
    }
    return toolsInCat;
  }, [selectedCategory]);

  // Active tools shown in Step 2: either search results or selected category tools
  const activeSubTools = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return searchResults;
    }
    return categoryTools;
  }, [searchQuery, searchResults, categoryTools]);

  // Handlers for Navigation Steps
  const openCategorySection = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentStep('subtools');
    setSelectedTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBackToMain = () => {
    setCurrentStep('main');
    setSelectedCategory(null);
    setSelectedTool(null);
    onSearchChange('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBackToSubTools = () => {
    setCurrentStep('subtools');
    setSelectedTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectSubTool = (tool: Tool) => {
    setSelectedTool(tool);
    setCurrentStep('tool');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Normal Calculator Button logic
  const pressNormal = (val: string) => {
    if (val === '.') {
      setNormalDisplay((prev) => {
        if (!prev || prev === 'Error') return '0.';
        const tokens = prev.split(/[+\-*/()]/);
        const lastToken = tokens[tokens.length - 1];
        if (lastToken.includes('.')) return prev;
        return prev + '.';
      });
      return;
    }
    setNormalDisplay((prev) => (prev === 'Error' ? val : prev + val));
  };
  const clearNormal = () => {
    setNormalDisplay('');
  };
  const backspaceNormal = () => {
    setNormalDisplay((prev) => (prev === 'Error' ? '' : prev.slice(0, -1)));
  };
  const evalNormal = () => {
    try {
      if (!normalDisplay.trim()) return;
      // Sanitize input to only allow arithmetic digits and operators
      const sanitized = normalDisplay.replace(/[^0-9+\-*/.()]/g, '');
      // Evaluate cleanly
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${sanitized})`)();
      setNormalDisplay(String(res));
    } catch {
      setNormalDisplay('Error');
    }
  };

  // Heavy Math Button logic
  const pressMath = (val: string) => {
    if (val === '.') {
      setMathDisplay((prev) => {
        if (!prev || prev === 'Error') return '0.';
        const tokens = prev.split(/[+\-*/(),]/);
        const lastToken = tokens[tokens.length - 1];
        if (lastToken.includes('.')) return prev;
        return prev + '.';
      });
      return;
    }
    setMathDisplay((prev) => (prev === 'Error' ? val : prev + val));
  };
  const clearMath = () => {
    setMathDisplay('');
  };
  const backspaceMath = () => {
    setMathDisplay((prev) => (prev === 'Error' ? '' : prev.slice(0, -1)));
  };
  const evalMath = () => {
    try {
      if (!mathDisplay.trim()) return;
      // Replace friendly expressions into JavaScript Math functions
      let expression = mathDisplay
        .replace(/Math\.sin\(/g, 'Math.sin(')
        .replace(/Math\.cos\(/g, 'Math.cos(')
        .replace(/Math\.tan\(/g, 'Math.tan(')
        .replace(/Math\.sqrt\(/g, 'Math.sqrt(');
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${expression})`)();
      setMathDisplay(String(res));
    } catch {
      setMathDisplay('Error');
    }
  };

  // Age Calculator logic
  const calculateAgeHandler = () => {
    if (!dob) {
      setAgeResult('Please select a valid date of birth.');
      return;
    }
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) {
      setAgeResult('Please select a valid date.');
      return;
    }
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    setAgeResult(`Your exact age is: ${years} Years, ${months} Months, and ${days} Days (${totalDays} total days lived)`);
  };

  // Keyboard support for Normal Calculator
  useEffect(() => {
    if (selectedTool?.id === 'basic-calculator' && currentStep === 'tool') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.'].includes(e.key)) {
          e.preventDefault();
          pressNormal(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
          e.preventDefault();
          evalNormal();
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          setNormalDisplay((prev) => prev.slice(0, -1));
        } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
          e.preventDefault();
          clearNormal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedTool, currentStep, normalDisplay]);

  // Selected Category Object
  const currentCategoryObj = MAIN_CATEGORY_CARDS.find((c) => c.id === selectedCategory);

  // Helper to render tools by category
  const renderToolComponent = (tool: Tool) => {
    // 1. Check if user requested the sample's direct Normal Calculator
    if (tool.id === 'basic-calculator') {
      return (
        <div id="normalCalc" className="calculator-box">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-[#007bff] dark:text-white">Normal Calculator</h3>
            <span className="text-xs opacity-70">Keyboard numbers & operators supported</span>
          </div>
          <input
            type="text"
            id="normalDisplay"
            value={normalDisplay}
            onChange={(e) => setNormalDisplay(e.target.value)}
            className="calc-display"
            placeholder="0"
          />
          <div className="calc-grid">
            <button onClick={clearNormal} className="text-red-500 font-bold">C</button>
            <button onClick={() => pressNormal('(')}>(</button>
            <button onClick={() => pressNormal(')')}>)</button>
            <button onClick={() => pressNormal('/')}>÷</button>

            <button onClick={() => pressNormal('7')}>7</button>
            <button onClick={() => pressNormal('8')}>8</button>
            <button onClick={() => pressNormal('9')}>9</button>
            <button onClick={() => pressNormal('*')}>×</button>

            <button onClick={() => pressNormal('4')}>4</button>
            <button onClick={() => pressNormal('5')}>5</button>
            <button onClick={() => pressNormal('6')}>6</button>
            <button onClick={() => pressNormal('-')}>-</button>

            <button onClick={() => pressNormal('1')}>1</button>
            <button onClick={() => pressNormal('2')}>2</button>
            <button onClick={() => pressNormal('3')}>3</button>
            <button onClick={() => pressNormal('+')}>+</button>

            <button onClick={() => pressNormal('0')}>0</button>
            <button onClick={() => pressNormal('.')} id="calc-dot-btn" className="font-bold text-lg">.</button>
            <button onClick={backspaceNormal} title="Backspace" className="text-amber-500 font-bold">⌫</button>
            <button onClick={evalNormal} className="bg-[#007bff]! text-white font-bold">=</button>
          </div>
        </div>
      );
    }

    // 2. Check if user requested the sample's direct Heavy Mathematics
    if (tool.id === 'scientific-calculator') {
      return (
        <div id="mathCalc" className="calculator-box">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-[#007bff] dark:text-white">Heavy Mathematics Calculator</h3>
            <span className="text-xs opacity-70">Scientific & Trigonometric functions</span>
          </div>
          <input
            type="text"
            id="mathDisplay"
            value={mathDisplay}
            onChange={(e) => setMathDisplay(e.target.value)}
            className="calc-display"
            placeholder="0"
          />
          <div className="calc-grid">
            <button onClick={() => pressMath('Math.sin(')}>sin</button>
            <button onClick={() => pressMath('Math.cos(')}>cos</button>
            <button onClick={() => pressMath('Math.tan(')}>tan</button>
            <button onClick={() => pressMath('Math.sqrt(')}>√</button>

            <button onClick={() => pressMath('**')}>xʸ</button>
            <button onClick={() => pressMath('(')}>(</button>
            <button onClick={() => pressMath(')')}>)</button>
            <button onClick={clearMath} className="text-red-500 font-bold">C</button>

            <button onClick={() => pressMath('7')}>7</button>
            <button onClick={() => pressMath('8')}>8</button>
            <button onClick={() => pressMath('9')}>9</button>
            <button onClick={() => pressMath('/')}>÷</button>

            <button onClick={() => pressMath('4')}>4</button>
            <button onClick={() => pressMath('5')}>5</button>
            <button onClick={() => pressMath('6')}>6</button>
            <button onClick={() => pressMath('*')}>×</button>

            <button onClick={() => pressMath('1')}>1</button>
            <button onClick={() => pressMath('2')}>2</button>
            <button onClick={() => pressMath('3')}>3</button>
            <button onClick={() => pressMath('-')}>-</button>

            <button onClick={() => pressMath('0')}>0</button>
            <button onClick={() => pressMath('.')} id="math-dot-btn" className="font-bold text-lg">.</button>
            <button onClick={() => pressMath('+')}>+</button>
            <button onClick={evalMath} className="bg-[#007bff]! text-white font-bold">=</button>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
            <p className="text-xs text-center opacity-75">
              Need advanced mode? Use radians or degrees with full function chaining.
            </p>
          </div>
        </div>
      );
    }

    // 3. Check if user requested the sample's direct Age Calculator
    if (tool.id === 'age-calculator') {
      return (
        <div id="ageCalc" className="calculator-box">
          <h3 className="text-xl font-bold text-[#007bff] dark:text-white mb-3">Age Calculator</h3>
          <p className="text-xs opacity-75 mb-4">Calculate exact age from date of birth</p>
          <div className="input-group">
            <label className="text-sm font-semibold">Select Date of Birth:</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full"
            />
          </div>
          <button className="action-btn" onClick={calculateAgeHandler}>
            Calculate Age
          </button>
          {ageResult && (
            <div
              id="ageResult"
              className="mt-4 p-3 rounded-lg border text-center font-bold text-sm"
              style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              {ageResult}
            </div>
          )}
        </div>
      );
    }

    // 4. Note Pad Tool
    if (tool.id === 'notepad' || tool.id.includes('note')) {
      return <NotepadView tool={tool} onToast={onToast} />;
    }

    // 5. Fallback to our existing 260+ rich interactive tool components without cutting any tool!
    if (tool.category === 'stylish-text') {
      return <StylishTextGeneratorView tool={tool} onToast={onToast} />;
    }
    if (tool.id.includes('design') || tool.id.includes('gradient-text') || tool.id.includes('curved') || tool.id.includes('stroke') || tool.id.includes('neon-text') || tool.id.includes('3d-text')) {
      return <TextDesignView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'developer' || tool.id.includes('html') || tool.id.includes('json') || tool.id.includes('regex') || tool.id.includes('jwt') || tool.id.includes('base64')) {
      return <DeveloperToolsView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'pdf' || tool.id.includes('pdf')) {
      return <PdfToolsView tool={tool} onToast={onToast} />;
    }
    if (
      tool.category === 'image' ||
      tool.category === 'media' ||
      tool.id.includes('image') ||
      tool.id.includes('video') ||
      tool.id.includes('background') ||
      tool.id.includes('qr') ||
      tool.id.includes('canvas') ||
      tool.id.includes('meme')
    ) {
      return <ImageToolsView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'calculators' || tool.id.includes('calculator') || tool.id.includes('percent') || tool.id.includes('tax') || tool.id.includes('gst') || tool.id.includes('discount') || tool.id.includes('bmi') || tool.id.includes('unit-converter')) {
      return <CalculatorView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'date-time' || tool.id.includes('stopwatch') || tool.id.includes('countdown') || tool.id.includes('timer') || tool.id.includes('clock')) {
      return <DateTimeView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'device' || tool.id.includes('device') || tool.id.includes('screen') || tool.id.includes('battery') || tool.id.includes('speed')) {
      return <DeviceInfoView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'files' || tool.id.includes('file')) {
      return <FileToolsView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'colors' || tool.id.includes('color') || tool.id.includes('contrast') || tool.id.includes('gradient')) {
      return <ColorToolsView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'generators' || tool.id.includes('password') || tool.id.includes('lorem') || tool.id.includes('coin') || tool.id.includes('dice')) {
      return <GeneratorView tool={tool} onToast={onToast} />;
    }
    if (tool.category === 'everyday' || tool.category === 'network' || tool.category === 'student') {
      return <MiscellaneousView tool={tool} onToast={onToast} />;
    }
    return <TextToolsView tool={tool} onToast={onToast} />;
  };

  return (
    <div className="w-full max-w-[850px] mx-auto px-4 py-4 space-y-6">
      {/* Center Search Bar - Multi-language Algorithm */}
      <div className="w-full max-w-[600px] mx-auto text-center">
        <div className="relative">
          <input
            type="text"
            id="searchInput"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search any tool..."
            className="w-full py-3.5 px-6 text-base rounded-full outline-none text-center transition-all duration-200 border"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                if (currentStep === 'subtools' && !selectedCategory) {
                  setCurrentStep('main');
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded-full opacity-60 hover:opacity-100"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-[11px] mt-1.5 text-center text-slate-500 dark:text-slate-400">
          Smart multilingual search: Type keywords in English, Roman Urdu, or Hindi
        </p>
      </div>

      {/* Main Content Area */}
      <div className="content-area w-full">
        {/* STEP 1: Main Tool Box (Main Category Cards) */}
        {currentStep === 'main' && !searchQuery && (
          <div id="mainToolBox" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {MAIN_CATEGORY_CARDS.map((cat) => {
                const count = ALL_TOOLS.filter((t) => t.category === cat.matchCategoryId).length;
                return (
                  <div
                    key={cat.id}
                    id={`cat-card-${cat.id}`}
                    className="tool-card select-none"
                    onClick={() => openCategorySection(cat.matchCategoryId || cat.id)}
                  >
                    <h3 className="topic-title">{cat.icon} {cat.name}</h3>
                    <p className="text-black dark:text-white">{cat.description}</p>
                    <span className="inline-block mt-3 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border-color)] text-black dark:text-white">
                      {count} Tools Available
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Sub-Tools List (Shown on category click OR when searching in any language) */}
        {currentStep === 'subtools' && (
          <div id="subToolsList" className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <button className="back-btn" onClick={goBackToMain}>
                ← Main Menu
              </button>

              <div className="text-sm font-bold opacity-80">
                {searchQuery.trim() ? (
                  <span>
                    Found {activeSubTools.length} results for "{searchQuery}"
                  </span>
                ) : (
                  <span>
                    {currentCategoryObj ? `${currentCategoryObj.icon} ${currentCategoryObj.name}` : 'Tools'}{' '}
                    ({activeSubTools.length} Tools)
                  </span>
                )}
              </div>
            </div>

            {activeSubTools.length === 0 ? (
              <div
                className="p-12 text-center rounded-xl border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <h3 className="text-lg font-bold mb-2">No matching tools found</h3>
                <p className="text-sm opacity-70 mb-4">
                  Try searching with Roman Urdu ("hisab", "awaz", "tasveer", "umr"), Urdu or English.
                </p>
                <button className="back-btn" onClick={goBackToMain}>
                  ← Back to Main Menu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeSubTools.map((tool) => (
                  <div
                    key={tool.id}
                    id={`sub-tool-${tool.id}`}
                    className="tool-card sub-tool select-none text-left flex flex-col justify-between"
                    onClick={() => selectSubTool(tool)}
                  >
                    <div>
                      <h3>{tool.name}</h3>
                      <p>{tool.description}</p>
                    </div>
                    <div className="mt-3 pt-2 flex items-center justify-between border-t border-[var(--border-color)] text-xs font-semibold opacity-85">
                      <span className="capitalize">{tool.category}</span>
                      <span className="text-[#007bff] dark:text-white">Open Tool →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Actual Calculator Screen / Tool Screen */}
        {currentStep === 'tool' && selectedTool && (
          <div id="calculatorScreen" className="space-y-4">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button className="back-btn" onClick={goBackToSubTools}>
                ← Back to {currentCategoryObj ? currentCategoryObj.name : 'Tools List'}
              </button>
              <button
                className="back-btn"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                }}
                onClick={goBackToMain}
              >
                ← Main Menu
              </button>
            </div>

            {/* Render Tool */}
            <div className="w-full">
              {renderToolComponent(selectedTool)}
            </div>

            {/* Double Ads under tool: 728x90 Banner + 468x60 Banner */}
            <AdsterraDoubleBanner />
          </div>
        )}
      </div>

      {/* Clean Footer with Google AdSense Policy Links - ONLY visible on Main / Subtools menu, hidden during active Tool usage */}
      {currentStep !== 'tool' && (
        <footer className="pt-8 pb-10 text-center text-xs opacity-75 border-t border-[var(--border-color)] mt-12 space-y-2">
          <p className="font-semibold">🛠️ Tool Bazar — 260+ Free Everyday Tools Working 100% In Browser</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-1">
            <button
              onClick={() => setLegalModalType('privacy')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Privacy Policy
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => setLegalModalType('terms')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Terms of Service
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => setLegalModalType('contact')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Contact
            </button>
          </div>
          <p className="text-[11px] opacity-60">© {new Date().getFullYear()} Tool Bazar. Fast, Free & Secure.</p>
        </footer>
      )}

      {/* Policy and Terms Modal for AdSense */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};
