import React, { useState, useEffect, useRef } from 'react';
import { Tool } from '../../types';
import {
  Plus,
  Trash2,
  Pin,
  Save,
  Download,
  Copy,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Palette,
  List,
  ListOrdered,
  Search,
  Check,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  content: string; // HTML formatted
  isPinned: boolean;
  category: 'Personal' | 'Work' | 'Study' | 'Ideas' | 'General';
  colorTag: string;
  updatedAt: number;
}

interface NotepadViewProps {
  tool?: Tool;
  onToast: (msg: string) => void;
}

const STORAGE_KEY = 'tb_smart_notes_v1';

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-welcome-1',
    title: 'My First Note 📝',
    content: `<div>Welcome to your <b>Smart Note Pad</b>!</div><div><br></div><div>Features you can use:</div><ul><li><b>Bold text</b>, <u>Underline text</u>, and <s>Strikethrough</s></li><li><span style="background-color: #fef08a; color: #000000;">Highlight important words</span> with bright colors</li><li>Change text to <span style="color: #ef4444;">Red</span>, <span style="color: #3b82f6;">Blue</span>, or <span style="color: #10b981;">Green</span></li><li>📌 <b>Pin</b> your critical notes to the top</li><li>💾 Notes <b>auto-save</b> in your browser storage</li><li>📥 Download notes as a <b>.txt file</b> anytime!</li></ul>`,
    isPinned: true,
    category: 'General',
    colorTag: '#3b82f6',
    updatedAt: Date.now(),
  },
];

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Green', color: '#bbf7d0' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Cyan', color: '#bae6fd' },
  { name: 'Orange', color: '#fed7aa' },
];

const TEXT_COLORS = [
  { name: 'Default', color: 'inherit' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Green', color: '#10b981' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'White', color: '#ffffff' },
  { name: 'Dark', color: '#0f172a' },
];

export const NotepadView: React.FC<NotepadViewProps> = ({ onToast }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_NOTES;
  });

  const [activeId, setActiveId] = useState<string>(() => {
    return notes[0]?.id || '';
  });

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Saved');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Active note lookup
  const activeNote = notes.find((n) => n.id === activeId) || notes[0] || null;

  // Sync editor innerHTML when activeNote changes externally
  useEffect(() => {
    if (editorRef.current && activeNote) {
      if (editorRef.current.innerHTML !== activeNote.content) {
        editorRef.current.innerHTML = activeNote.content;
      }
    }
  }, [activeNote?.id]);

  // Save notes to localStorage whenever notes array changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setSaveStatus('Saved');
    } catch {
      // storage quota or error
    }
  }, [notes]);

  // Handle Add Note
  const handleAddNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: '',
      content: '',
      isPinned: false,
      category: 'General',
      colorTag: '#3b82f6',
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveId(newNote.id);
    setSaveStatus('New Note');
    onToast('New note created! 📝');
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 50);
  };

  // Handle Delete Note
  const handleDeleteNote = (idToDelete: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (notes.length <= 1) {
      // If last note, clear it instead of leaving 0
      const emptyNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: '',
        content: '',
        isPinned: false,
        category: 'General',
        colorTag: '#3b82f6',
        updatedAt: Date.now(),
      };
      setNotes([emptyNote]);
      setActiveId(emptyNote.id);
      onToast('Note deleted');
      return;
    }

    const remaining = notes.filter((n) => n.id !== idToDelete);
    setNotes(remaining);
    if (activeId === idToDelete) {
      setActiveId(remaining[0].id);
    }
    onToast('Note deleted 🗑️');
  };

  // Handle Pin / Unpin Note
  const handleTogglePin = (idToPin: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === idToPin) {
          const nextPinned = !n.isPinned;
          onToast(nextPinned ? 'Note pinned to top 📌' : 'Note unpinned');
          return { ...n, isPinned: nextPinned, updatedAt: Date.now() };
        }
        return n;
      })
    );
  };

  // Handle Manual Save
  const handleManualSave = () => {
    if (!activeNote) return;
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : activeNote.content;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNote.id ? { ...n, content: currentHtml, updatedAt: Date.now() } : n))
    );
    setSaveStatus('Saved Just Now');
    onToast('Note saved successfully! 💾');
  };

  // Handle Content change from contentEditable
  const handleContentInput = () => {
    if (!activeNote || !editorRef.current) return;
    const newHtml = editorRef.current.innerHTML;
    setSaveStatus('Saving...');
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNote.id ? { ...n, content: newHtml, updatedAt: Date.now() } : n))
    );
  };

  // Handle Title change
  const handleTitleChange = (newTitle: string) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNote.id ? { ...n, title: newTitle, updatedAt: Date.now() } : n))
    );
  };

  // Handle Category change
  const handleCategoryChange = (cat: NoteItem['category']) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNote.id ? { ...n, category: cat, updatedAt: Date.now() } : n))
    );
  };

  // Formatting helpers using document.execCommand
  const applyCommand = (cmd: string, val: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    handleContentInput();
  };

  // Apply Highlight
  const applyHighlight = (color: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('hiliteColor', false, color);
    setShowHighlightPicker(false);
    handleContentInput();
  };

  // Apply Font Color
  const applyTextColor = (color: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('foreColor', false, color);
    setShowColorPicker(false);
    handleContentInput();
  };

  // Export / Download as .txt file
  const handleDownloadFile = () => {
    if (!activeNote) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = activeNote.content;
    const plainText = tempDiv.innerText || tempDiv.textContent || '';
    const fileData = `${activeNote.title || 'Untitled Note'}\nCategory: ${activeNote.category}\nDate: ${new Date(activeNote.updatedAt).toLocaleString()}\n----------------------------------------\n\n${plainText}`;

    const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = (activeNote.title || 'note').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    link.download = `${cleanTitle}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Note downloaded as .txt file 📥');
  };

  // Copy plain text
  const handleCopyNote = () => {
    if (!activeNote) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = activeNote.content;
    const text = `${activeNote.title ? activeNote.title + '\n\n' : ''}${tempDiv.innerText || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Note copied to clipboard! 📋');
  };

  // Sort notes: pinned first, then newest updated
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  // Filter notes by search query and category
  const filteredNotes = sortedNotes.filter((n) => {
    const matchCat = selectedCategory === 'All' || n.category === selectedCategory;
    if (!matchCat) return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  });

  // Word count & Character count calculation
  const getNoteStats = () => {
    if (!activeNote) return { words: 0, chars: 0 };
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = activeNote.content;
    const text = tempDiv.innerText || '';
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { words, chars };
  };

  const stats = getNoteStats();

  return (
    <div
      id="rich-notepad-app"
      className="w-full rounded-2xl border shadow-lg overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-color)',
      }}
    >
      {/* Top Header Bar */}
      <div className="px-5 py-4 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 bg-slate-100/50 dark:bg-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Smart Note Pad</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold">
                Auto-Saved
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Save, edit, pin, color, bold, underline, highlight & download notes
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAddNote}
            id="add-new-note-btn"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>

          <button
            onClick={handleManualSave}
            id="save-current-note-btn"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Note</span>
          </button>

          <button
            onClick={handleDownloadFile}
            id="download-note-btn"
            title="Download note as .txt file"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-color)] hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-all active:scale-95 cursor-pointer text-slate-800 dark:text-white"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download File</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Notes List + Active Note Editor */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* SIDEBAR: NOTES DIRECTORY */}
        <div className="md:col-span-4 border-r border-[var(--border-color)] p-4 flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-900/30">
          {/* Search notes */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-notes-input"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search in notes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 placeholder-slate-400 focus:border-blue-500"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {(['All', 'General', 'Personal', 'Work', 'Study', 'Ideas'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                No notes found. Tap <b>Add Note</b> to write one!
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeId;
                const dateStr = new Date(note.updatedAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <div
                    key={note.id}
                    id={`note-item-${note.id}`}
                    onClick={() => setActiveId(note.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative group ${
                      isActive
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm'
                        : 'border-[var(--border-color)] bg-white dark:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs truncate text-slate-900 dark:text-white flex-1">
                        {note.isPinned && (
                          <span title="Pinned Note" className="text-amber-500 shrink-0">
                            📌
                          </span>
                        )}
                        <span className="truncate">{note.title.trim() || 'Untitled Note'}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Pin button */}
                        <button
                          onClick={(e) => handleTogglePin(note.id, e)}
                          title={note.isPinned ? 'Unpin' : 'Pin to top'}
                          className={`p-1 rounded-md text-xs transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 ${
                            note.isPinned ? 'text-amber-500 font-bold' : 'text-slate-400 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          title="Delete note"
                          className="p-1 rounded-md text-xs text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 font-medium">
                        {note.category}
                      </span>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MAIN EDITOR COLUMN */}
        {activeNote ? (
          <div className="md:col-span-8 p-4 sm:p-6 flex flex-col gap-4 bg-white dark:bg-slate-900">
            {/* Title Input & Category selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                ref={titleInputRef}
                type="text"
                id="active-note-title-input"
                value={activeNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note Title..."
                className="flex-1 text-lg sm:text-xl font-bold border-b border-[var(--border-color)] py-1.5 px-1 outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 transition-colors"
              />

              <div className="flex items-center gap-2">
                <select
                  value={activeNote.category}
                  onChange={(e) => handleCategoryChange(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-color)] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
                >
                  <option value="General">General</option>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Ideas">Ideas</option>
                </select>

                <button
                  onClick={() => handleTogglePin(activeNote.id)}
                  title={activeNote.isPinned ? 'Pinned to top' : 'Pin note'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                    activeNote.isPinned
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300'
                      : 'border-[var(--border-color)] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>{activeNote.isPinned ? 'Pinned' : 'Pin'}</span>
                </button>
              </div>
            </div>

            {/* RICH FORMATTING TOOLBAR */}
            <div
              id="notepad-formatting-toolbar"
              className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-[var(--border-color)] bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-white"
            >
              {/* Bold */}
              <button
                onClick={() => applyCommand('bold')}
                title="Bold (Ctrl+B)"
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Bold className="w-4 h-4" />
              </button>

              {/* Italic */}
              <button
                onClick={() => applyCommand('italic')}
                title="Italic (Ctrl+I)"
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Italic className="w-4 h-4" />
              </button>

              {/* Underline */}
              <button
                onClick={() => applyCommand('underline')}
                title="Underline (Ctrl+U)"
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>

              {/* Strikethrough */}
              <button
                onClick={() => applyCommand('strikeThrough')}
                title="Strikethrough"
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

              {/* Highlight Picker Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowHighlightPicker(!showHighlightPicker);
                    setShowColorPicker(false);
                  }}
                  title="Highlight Text Color"
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                >
                  <Highlighter className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">Highlight</span>
                </button>

                {showHighlightPicker && (
                  <div className="absolute left-0 top-9 z-30 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                    {HIGHLIGHT_COLORS.map((h) => (
                      <button
                        key={h.name}
                        onClick={() => applyHighlight(h.color)}
                        title={h.name}
                        style={{ backgroundColor: h.color }}
                        className="w-6 h-6 rounded-md border border-slate-400 hover:scale-110 transition-transform cursor-pointer"
                      />
                    ))}
                    <button
                      onClick={() => applyHighlight('transparent')}
                      className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-slate-700 font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Font Color Picker Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowHighlightPicker(false);
                  }}
                  title="Font Color"
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-blue-500" />
                  <span className="hidden sm:inline">Color</span>
                </button>

                {showColorPicker && (
                  <div className="absolute left-0 top-9 z-30 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 flex-wrap max-w-[200px]">
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => applyTextColor(c.color)}
                        title={c.name}
                        style={{ backgroundColor: c.color === 'inherit' ? '#94a3b8' : c.color }}
                        className="w-5 h-5 rounded-full border border-slate-400 hover:scale-110 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="w-[1px] h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

              {/* Bullet List */}
              <button
                onClick={() => applyCommand('insertUnorderedList')}
                title="Bullet List"
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <List className="w-4 h-4" />
              </button>

              {/* Numbered List */}
              <button
                onClick={() => applyCommand('insertOrderedList')}
                title="Numbered List"
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              {/* Font Size Selector */}
              <select
                onChange={(e) => applyCommand('fontSize', e.target.value)}
                defaultValue="3"
                className="ml-auto px-2 py-1 rounded text-xs font-semibold border border-[var(--border-color)] bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none cursor-pointer"
              >
                <option value="2">Small Text</option>
                <option value="3">Normal</option>
                <option value="4">Medium</option>
                <option value="5">Large</option>
                <option value="6">Heading</option>
              </select>
            </div>

            {/* WYSIWYG CONTENT-EDITABLE NOTE EDITOR */}
            <div
              ref={editorRef}
              id="active-note-editor"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={handleContentInput}
              onBlur={handleContentInput}
              data-placeholder="Start typing your note here... (supports bold, underline, colors & highlight)"
              className="flex-1 min-h-[300px] p-4 rounded-xl border border-[var(--border-color)] outline-none overflow-y-auto leading-relaxed text-sm sm:text-base font-normal bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500/20"
              style={{
                minHeight: '320px',
              }}
            />

            {/* Bottom Status & Quick Utilities */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {saveStatus}
                </span>
                <span>•</span>
                <span>{stats.words} words</span>
                <span>•</span>
                <span>{stats.chars} characters</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNote}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-8 p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
            <p className="font-semibold text-base text-slate-700 dark:text-white">No Note Selected</p>
            <button
              onClick={handleAddNote}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer shadow-md"
            >
              + Create a Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
