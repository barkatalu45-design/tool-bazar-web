import React, { useState } from 'react';
import { Upload, FileText, Check, Copy, HardDrive, Shield } from 'lucide-react';
import { Tool } from '../../types';

interface FileToolsViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const FileToolsView: React.FC<FileToolsViewProps> = ({ tool, onToast }) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileSha256, setFileSha256] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileListObj = e.target.files;
    if (!fileListObj || fileListObj.length === 0) return;
    const files: File[] = Array.from(fileListObj);
    setFileList(files);

    const first = files[0];
    // If text viewer
    if (first.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFileContent(ev.target?.result as string);
      };
      reader.readAsText(first);
    } else {
      setFileContent(`[File preview truncated because file size is > 2 MB (${(first.size / (1024 * 1024)).toFixed(2)} MB)]`);
    }

    // Compute SHA-256
    try {
      const buffer = await first.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setFileSha256(hashHex);
    } catch {
      setFileSha256('Error computing hash');
    }
  };

  const totalSize = fileList.reduce((acc, f) => acc + f.size, 0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Privacy guarantee */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
        <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
        <span>Files are read entirely into browser memory and are NEVER uploaded across any network.</span>
      </div>

      {/* File Drop / Select Area */}
      <label className="block cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 rounded-2xl p-6 text-center bg-neutral-50 dark:bg-neutral-850 transition-colors">
        <input
          type="file"
          multiple={tool.id.includes('multiple')}
          onChange={handleFiles}
          className="hidden"
        />
        <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Click to choose file(s) to inspect
        </p>
        <p className="text-xs text-neutral-500 mt-1">Supports any file type</p>
      </label>

      {/* File Info Cards */}
      {fileList.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Selected Files ({fileList.length}) - Total Size: {formatBytes(totalSize)}
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {fileList.map((file, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="truncate font-medium text-neutral-800 dark:text-neutral-200">
                    {file.name}
                  </div>
                  <div className="shrink-0 flex items-center gap-3 text-neutral-500">
                    <span>{file.type || 'Unknown MIME'}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formatBytes(file.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash */}
          {fileSha256 && (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-xs">
              <div className="flex justify-between items-center mb-1 text-neutral-400 font-bold">
                <span>File SHA-256 Hash:</span>
                <button onClick={() => handleCopy(fileSha256)} className="text-indigo-400 hover:underline">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-amber-400 break-all select-all">{fileSha256}</div>
            </div>
          )}

          {/* Text/Content Preview */}
          {fileContent && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  File Content Viewer:
                </span>
                <button
                  onClick={() => handleCopy(fileContent)}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                >
                  <Copy className="h-3 w-3" />
                  Copy Text
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={fileContent}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 font-mono text-xs text-neutral-900 dark:text-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
