import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Sliders,
  Palette,
  Sparkles,
  QrCode,
  Brush,
  RotateCcw,
  Music,
  Video,
  Play,
  Pause,
  Scissors,
  Layers,
  Check,
  RefreshCw,
  Eye,
  Pipette,
} from 'lucide-react';
import { Tool } from '../../types';
import { DownloadAdModal } from '../DownloadAdModal';

interface ImageToolsViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

// Client-side PCM WAV Encoder from AudioBuffer
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const length = buffer.length * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = buffer.getChannelData(channel)[i];
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export const ImageToolsView: React.FC<ImageToolsViewProps> = ({ tool, onToast }) => {
  // Common Image states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState('image');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const [imageDims, setImageDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Resizer parameters
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Background Remover States
  const [bgRemoveTolerance, setBgRemoveTolerance] = useState<number>(30);
  const [bgRemoveTargetColor, setBgRemoveTargetColor] = useState<string>('#ffffff');
  const [bgReplacementMode, setBgReplacementMode] = useState<'transparent' | 'solid'>('transparent');
  const [bgSolidColor, setBgSolidColor] = useState<string>('#2563eb');
  const [processedBgUrl, setProcessedBgUrl] = useState<string | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Video to MP3 states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isExtractingAudio, setIsExtractingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioChannels, setAudioChannels] = useState<number>(2);
  const [audioSampleRate, setAudioSampleRate] = useState<number>(44100);

  // Filters
  const [filterType, setFilterType] = useState<'none' | 'grayscale' | 'sepia' | 'invert' | 'blackwhite' | 'blur'>('none');

  // Sponsored Download Gate States
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [pendingDownloadFn, setPendingDownloadFn] = useState<(() => void) | null>(null);
  const [pendingDownloadName, setPendingDownloadName] = useState<string>('downloaded-file');

  const triggerSponsoredDownload = (name: string, fn: () => void) => {
    setPendingDownloadName(name);
    setPendingDownloadFn(() => fn);
    setIsDownloadModalOpen(true);
  };

  const executePendingDownload = () => {
    if (pendingDownloadFn) {
      pendingDownloadFn();
    }
    setIsDownloadModalOpen(false);
    setPendingDownloadFn(null);
  };
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);

  // QR Code States
  const [qrText, setQrText] = useState('https://toolbazar.app');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');

  // Drawing Canvas States
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(5);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name.replace(/\.[^/.]+$/, ''));
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setImageDims({ width: img.width, height: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        if (img.height > 0) {
          setAspectRatio(img.width / img.height);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Video Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setAudioUrl(null);
    onToast(`Loaded ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
  };

  // Extract Audio from Video using Web Audio API
  const handleExtractAudio = async () => {
    if (!videoFile) return;

    try {
      setIsExtractingAudio(true);
      onToast('Extracting audio track in browser...');

      const arrayBuffer = await videoFile.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();

      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      setAudioDuration(decodedBuffer.duration);
      setAudioChannels(decodedBuffer.numberOfChannels);
      setAudioSampleRate(decodedBuffer.sampleRate);

      const wavBlob = audioBufferToWav(decodedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
      setIsExtractingAudio(false);
      onToast('Audio successfully extracted!');
    } catch (err) {
      console.error('Audio extraction error:', err);
      setIsExtractingAudio(false);
      onToast('Could not extract audio track. Ensure the video contains an audio stream.');
    }
  };

  // Download Extracted Audio
  const downloadAudio = (format: 'wav' | 'mp3') => {
    if (!audioUrl) return;
    const fileName = `${videoFile?.name.replace(/\.[^/.]+$/, '') || 'audio'}.${format}`;
    triggerSponsoredDownload(fileName, () => {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = fileName;
      a.click();
      onToast(`Downloaded as ${format.toUpperCase()}!`);
    });
  };

  // Background Remover Execution
  useEffect(() => {
    if (!imageSrc || (tool.id !== 'background-remover' && !tool.id.includes('background'))) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = bgCanvasRef.current || document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Parse target color hex
      const hex = bgRemoveTargetColor.replace('#', '');
      const tr = parseInt(hex.substring(0, 2), 16) || 255;
      const tg = parseInt(hex.substring(2, 4), 16) || 255;
      const tb = parseInt(hex.substring(4, 6), 16) || 255;

      // Parse replacement solid color hex
      const repHex = bgSolidColor.replace('#', '');
      const sr = parseInt(repHex.substring(0, 2), 16) || 37;
      const sg = parseInt(repHex.substring(2, 4), 16) || 99;
      const sb = parseInt(repHex.substring(4, 6), 16) || 235;

      const tolerance = bgRemoveTolerance * 2.5;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance
        const dist = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);

        if (dist <= tolerance) {
          if (bgReplacementMode === 'transparent') {
            data[i + 3] = 0; // Alpha 0
          } else {
            data[i] = sr;
            data[i + 1] = sg;
            data[i + 2] = sb;
            data[i + 3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setProcessedBgUrl(canvas.toDataURL('image/png'));
    };
    img.src = imageSrc;
  }, [imageSrc, bgRemoveTolerance, bgRemoveTargetColor, bgReplacementMode, bgSolidColor, tool.id]);

  // Click on canvas to sample target background color
  const handleSampleBgColor = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageSrc) return;
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * imageDims.width;
    const y = ((e.clientY - rect.top) / rect.height) * imageDims.height;

    const canvas = document.createElement('canvas');
    canvas.width = imageDims.width;
    canvas.height = imageDims.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sourceImg = new Image();
    sourceImg.onload = () => {
      ctx.drawImage(sourceImg, 0, 0);
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      setBgRemoveTargetColor(hex);
      onToast(`Sampled background color: ${hex}`);
    };
    sourceImg.src = imageSrc;
  };

  // Generate QR Code
  useEffect(() => {
    if (tool.id.includes('qr')) {
      QRCode.toDataURL(
        qrText || 'https://toolbazar.app',
        {
          width: 400,
          margin: 2,
          color: {
            dark: qrColor,
            light: qrBgColor,
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [qrText, qrColor, qrBgColor, tool.id]);

  // Download Resized Image
  const downloadProcessedImage = (ext: string = 'jpg', format: string = 'image/jpeg') => {
    if (!imageSrc) return;
    const fileName = `${imageName}-resized.${ext}`;
    triggerSponsoredDownload(fileName, () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            setProcessedSize(blob.size);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            onToast('Image resized and downloaded!');
          },
          format,
          quality / 100
        );
      };
      img.src = imageSrc;
    });
  };

  // 1. VIDEO TO MP3 / AUDIO EXTRACTOR
  if (tool.id === 'video-to-mp3' || tool.id.includes('video') || tool.id.includes('audio-extract')) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#09152b] border border-blue-100 dark:border-blue-900/60">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Music className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Video to MP3 & Audio Extractor
          </h2>
          <p className="text-xs text-slate-600 dark:text-blue-200/70 mt-1">
            Extract high-fidelity audio tracks from MP4, WebM, MOV, or MKV videos directly inside your browser. Zero server upload.
          </p>
        </div>

        {/* Upload Box */}
        {!videoFile ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-[#07132a]/50 text-center hover:bg-blue-50/60 transition-colors">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shadow-xs">
              <Video className="h-7 w-7" />
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Select or Drop a Video File
            </p>
            <p className="text-xs text-slate-500 dark:text-blue-300/60 mt-1 mb-4">
              Supports MP4, WebM, MOV, MKV, AVI, and audio formats
            </p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Browse Video File</span>
              <input
                type="file"
                accept="video/*,audio/*,.mp4,.webm,.mov,.mkv"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Video Preview & File Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              <div className="rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900/60 bg-black aspect-video flex items-center justify-center">
                <video
                  src={videoUrl || undefined}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-4 p-5 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/40 dark:bg-[#09152b]">
                <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/60 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[200px]">
                      {videoFile.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-blue-300/60">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <label className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Change Video
                    <input
                      type="file"
                      accept="video/*,audio/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Extract Button */}
                <button
                  id="extract-audio-btn"
                  onClick={handleExtractAudio}
                  disabled={isExtractingAudio}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
                >
                  <Music className={`h-4 w-4 ${isExtractingAudio ? 'animate-spin' : ''}`} />
                  <span>{isExtractingAudio ? 'Extracting Audio Track...' : 'Extract Audio Now'}</span>
                </button>

                {/* Audio Result & Download */}
                {audioUrl && (
                  <div className="space-y-3 pt-2 border-t border-blue-100 dark:border-blue-900/60 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="h-4 w-4" /> Ready to Play & Download
                      </span>
                      <span className="text-slate-500 dark:text-blue-300/60">
                        {Math.floor(audioDuration / 60)}:
                        {Math.floor(audioDuration % 60)
                          .toString()
                          .padStart(2, '0')}{' '}
                        • {audioSampleRate}Hz
                      </span>
                    </div>

                    <audio src={audioUrl} controls className="w-full h-10" />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => downloadAudio('mp3')}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download MP3</span>
                      </button>
                      <button
                        onClick={() => downloadAudio('wav')}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#07132a] text-blue-700 dark:text-blue-200 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download WAV</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. BACKGROUND REMOVER & CHANGER
  if (tool.id === 'background-remover' || tool.id.includes('background')) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#09152b] border border-blue-100 dark:border-blue-900/60">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Image Background Remover & Color Changer
          </h2>
          <p className="text-xs text-slate-600 dark:text-blue-200/70 mt-1">
            Remove solid or studio backgrounds, make transparent PNGs, or replace with custom colors in real time.
          </p>
        </div>

        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-[#07132a]/50 text-center hover:bg-blue-50/60 transition-colors">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shadow-xs">
              <Upload className="h-7 w-7" />
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Upload Image to Remove Background
            </p>
            <p className="text-xs text-slate-500 dark:text-blue-300/60 mt-1 mb-4">
              Works best with solid white, green, blue, or monochrome photo backgrounds
            </p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Select Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/30 dark:bg-[#09152b]">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-blue-200 mb-1">
                  Background Mode:
                </label>
                <div className="flex rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800 p-0.5 bg-white dark:bg-[#0c1936]">
                  <button
                    onClick={() => setBgReplacementMode('transparent')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      bgReplacementMode === 'transparent'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-blue-300 hover:text-blue-600'
                    }`}
                  >
                    Transparent
                  </button>
                  <button
                    onClick={() => setBgReplacementMode('solid')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      bgReplacementMode === 'solid'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-blue-300 hover:text-blue-600'
                    }`}
                  >
                    Solid Color
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-blue-200 mb-1">
                  Color Tolerance ({bgRemoveTolerance}%):
                </label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={bgRemoveTolerance}
                  onChange={(e) => setBgRemoveTolerance(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-blue-200 mb-1">
                  Target Color to Remove:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={bgRemoveTargetColor}
                    onChange={(e) => setBgRemoveTargetColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border border-blue-200"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-blue-200">
                    {bgRemoveTargetColor}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-blue-300/50">
                    (or click image to sample)
                  </span>
                </div>
              </div>
            </div>

            {bgReplacementMode === 'solid' && (
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/20 dark:bg-[#07132a]">
                <span className="text-xs font-bold text-slate-700 dark:text-blue-200 mr-2">
                  Replace With:
                </span>
                {['#2563eb', '#38bdf8', '#ffffff', '#0f172a', '#10b981', '#f59e0b', '#ef4444'].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setBgSolidColor(c)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform ${
                        bgSolidColor === c ? 'scale-125 border-blue-600' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  )
                )}
                <input
                  type="color"
                  value={bgSolidColor}
                  onChange={(e) => setBgSolidColor(e.target.value)}
                  className="h-7 w-7 rounded cursor-pointer border ml-2"
                />
              </div>
            )}

            {/* Side-by-side view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-center">
                <span className="text-xs font-bold text-slate-500 dark:text-blue-300/60">
                  Original (Click anywhere to pick background color)
                </span>
                <div className="rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900/60 bg-slate-100 dark:bg-[#09152b] flex items-center justify-center p-2 min-h-64">
                  <img
                    src={imageSrc}
                    alt="Original"
                    onClick={handleSampleBgColor}
                    className="max-h-72 object-contain cursor-crosshair rounded-lg"
                    title="Click on background to sample color"
                  />
                </div>
              </div>

              <div className="space-y-1 text-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Processed Cutout
                </span>
                <div
                  className="rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900/60 flex items-center justify-center p-2 min-h-64"
                  style={{
                    backgroundImage:
                      bgReplacementMode === 'transparent'
                        ? 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)'
                        : undefined,
                    backgroundSize: '16px 16px',
                    backgroundColor: bgReplacementMode === 'solid' ? bgSolidColor : '#ffffff',
                  }}
                >
                  {processedBgUrl && (
                    <img
                      src={processedBgUrl}
                      alt="Cutout Result"
                      className="max-h-72 object-contain rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Download Button */}
            {processedBgUrl && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <label className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                  Upload New Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <a
                  href={processedBgUrl}
                  download={`${imageName}-cutout.png`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Cutout (.png)</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 3. IMAGE RESIZER
  if (tool.id === 'image-resizer' || tool.id.includes('resize')) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#09152b] border border-blue-100 dark:border-blue-900/60">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Maximize className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Image Resizer
          </h2>
          <p className="text-xs text-slate-600 dark:text-blue-200/70 mt-1">
            Resize photos by exact pixel dimensions, aspect ratio presets, or percentage with aspect lock.
          </p>
        </div>

        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-[#07132a]/50 text-center hover:bg-blue-50/60 transition-colors">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shadow-xs">
              <Upload className="h-7 w-7" />
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Upload Image to Resize
            </p>
            <p className="text-xs text-slate-500 dark:text-blue-300/60 mt-1 mb-4">
              JPG, PNG, WEBP, GIF, BMP
            </p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Select Image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-blue-200">
                Quick Social & Standard Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Instagram (1080×1080)', w: 1080, h: 1080 },
                  { label: 'Story / Reels (1080×1920)', w: 1080, h: 1920 },
                  { label: 'YouTube Thumb (1280×720)', w: 1280, h: 720 },
                  { label: 'Passport (600×600)', w: 600, h: 600 },
                  { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
                  { label: '50% Half Size', w: Math.round(imageDims.width * 0.5), h: Math.round(imageDims.height * 0.5) },
                  { label: '25% Quarter', w: Math.round(imageDims.width * 0.25), h: Math.round(imageDims.height * 0.25) },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setTargetWidth(preset.w);
                      setTargetHeight(preset.h);
                      setMaintainAspect(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/60 dark:bg-[#09152b] text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/20 dark:bg-[#09152b]">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-blue-200 mb-1">
                  Width (px):
                </label>
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => {
                    const w = Number(e.target.value);
                    setTargetWidth(w);
                    if (maintainAspect && aspectRatio > 0) {
                      setTargetHeight(Math.round(w / aspectRatio));
                    }
                  }}
                  className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#0c1936] px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-blue-200 mb-1">
                  Height (px):
                </label>
                <input
                  type="number"
                  value={targetHeight}
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    setTargetHeight(h);
                    if (maintainAspect && aspectRatio > 0) {
                      setTargetWidth(Math.round(h * aspectRatio));
                    }
                  }}
                  className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#0c1936] px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-blue-200 cursor-pointer py-2.5">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Lock Aspect Ratio</span>
                </label>
              </div>
            </div>

            {/* Preview Image */}
            <div className="rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900/60 bg-slate-50 dark:bg-[#09152b] p-3 text-center">
              <img
                src={imageSrc}
                alt="Preview"
                className="max-h-72 object-contain mx-auto rounded-lg"
              />
              <p className="text-xs text-slate-500 dark:text-blue-300/60 mt-2">
                Original: {imageDims.width} × {imageDims.height} px • Target: {targetWidth} ×{' '}
                {targetHeight} px
              </p>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                Change Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadProcessedImage('jpg', 'image/jpeg')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download JPG</span>
                </button>
                <button
                  onClick={() => downloadProcessedImage('png', 'image/png')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#0c1936] text-blue-700 dark:text-blue-200 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. QR CODE GENERATOR
  if (tool.id.includes('qr')) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#09152b] border border-blue-100 dark:border-blue-900/60">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            High-Resolution QR Code Generator
          </h2>
          <p className="text-xs text-slate-600 dark:text-blue-200/70 mt-1">
            Generate customized QR codes for websites, WiFi, phone numbers, and plain text.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-blue-200 mb-1">
              QR Code Content (URL or Text):
            </label>
            <input
              type="text"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder="https://toolbazar.app"
              className="w-full rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#0c1936] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-blue-200">QR Color:</label>
              <input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-blue-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-blue-200">Background:</label>
              <input
                type="color"
                value={qrBgColor}
                onChange={(e) => setQrBgColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-blue-200"
              />
            </div>
          </div>

          {qrDataUrl && (
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/30 dark:bg-[#09152b] gap-4">
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="h-56 w-56 rounded-xl shadow-md bg-white p-2"
              />
              <a
                href={qrDataUrl}
                download="qrcode.png"
                className="flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Download QR Code (PNG)</span>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. DEFAULT IMAGE PROCESSING & COMPRESSOR VIEW
  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-[#07132a]/50 text-center hover:bg-blue-50/60 transition-colors">
          <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 shadow-xs">
            <Upload className="h-7 w-7" />
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Upload Image for {tool.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-blue-300/60 mt-1 mb-4">
            Supports JPG, PNG, WEBP, GIF, BMP
          </p>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Select Image File</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Quality Slider for Compressor */}
          <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/30 dark:bg-[#09152b] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-blue-200">
                Compression Quality ({quality}%):
              </label>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                Original Size: {(originalSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Preview */}
          <div className="rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900/60 bg-slate-50 dark:bg-[#09152b] p-3 text-center">
            <img
              src={imageSrc}
              alt="Preview"
              className="max-h-72 object-contain mx-auto rounded-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
              Choose Another Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => downloadProcessedImage('jpg', 'image/jpeg')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save Compressed JPG</span>
              </button>
              <button
                onClick={() => downloadProcessedImage('webp', 'image/webp')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#0c1936] text-blue-700 dark:text-blue-200 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save as WEBP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sponsored Download Gate Modal */}
      <DownloadAdModal
        isOpen={isDownloadModalOpen}
        fileName={pendingDownloadName}
        onComplete={executePendingDownload}
        onCancel={() => {
          setIsDownloadModalOpen(false);
          setPendingDownloadFn(null);
        }}
      />
    </div>
  );
};
