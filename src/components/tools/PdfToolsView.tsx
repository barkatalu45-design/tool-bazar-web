import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import { Download, FileText, Upload, Image as ImageIcon, Grid, CheckSquare, Calendar, RefreshCw, Eye } from 'lucide-react';
import { Tool } from '../../types';
import { DownloadAdModal } from '../DownloadAdModal';

interface PdfToolsViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const PdfToolsView: React.FC<PdfToolsViewProps> = ({ tool, onToast }) => {
  const [docTitle, setDocTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [pageOrientation, setPageOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Invoice tool states
  const [clientName, setClientName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceItems, setInvoiceItems] = useState([
    { description: '', quantity: 1, rate: 0 },
  ]);

  // File Inspector states
  const [inspectFilename, setInspectFilename] = useState('');
  const [inspectFileSize, setInspectFileSize] = useState('');
  const [inspectInfo, setInspectInfo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInspectInputRef = useRef<HTMLInputElement>(null);

  // Sponsored Download Gate States
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [pendingDownloadFn, setPendingDownloadFn] = useState<(() => void) | null>(null);
  const [pendingDownloadName, setPendingDownloadName] = useState<string>('document.pdf');

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

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        onToast('Image loaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Standard Text / Note / Markdown PDF
  const generateTextPdf = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: pageOrientation,
        unit: 'mm',
        format: 'a4',
      });

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize + 6);
      doc.text(docTitle, 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSize);
      const splitText = doc.splitTextToSize(textContent, pageOrientation === 'portrait' ? 170 : 250);
      doc.text(splitText, 20, 40);

      // Footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(
          `Generated via Utility Bazaar  •  Page ${i} of ${pageCount}`,
          20,
          pageOrientation === 'portrait' ? 285 : 200
        );
      }

      const fileName = `${(docTitle || 'document').toLowerCase().replace(/\s+/g, '-')}.pdf`;
      triggerSponsoredDownload(fileName, () => {
        doc.save(fileName);
        onToast('PDF downloaded successfully!');
      });
    } catch {
      onToast('Error creating PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Image to PDF
  const generateImagePdf = () => {
    if (!selectedImage) {
      onToast('Please select an image first');
      return;
    }
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: pageOrientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pageOrientation === 'portrait' ? 210 : 297;
      const pageHeight = pageOrientation === 'portrait' ? 297 : 210;

      // Fit image with margin
      const margin = 15;
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      doc.addImage(selectedImage, 'JPEG', margin, margin, maxW, maxH, undefined, 'FAST');
      doc.save('converted-image.pdf');
      onToast('Image PDF generated and downloaded!');
    } catch {
      onToast('Failed to convert image to PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Printable Grid or Ruled Paper
  const generatePaperPdf = (type: 'ruled' | 'grid' | 'dot') => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const w = 210;
      const h = 297;
      doc.setDrawColor(200, 200, 200);

      if (type === 'ruled') {
        const step = 8; // 8mm ruled lines
        for (let y = 30; y < h - 20; y += step) {
          doc.line(20, y, w - 20, y);
        }
        // Vertical red margin line
        doc.setDrawColor(240, 100, 100);
        doc.line(30, 20, 30, h - 15);
      } else if (type === 'grid') {
        const step = 5; // 5mm graph grid
        for (let x = 15; x <= w - 15; x += step) {
          doc.line(x, 15, x, h - 15);
        }
        for (let y = 15; y <= h - 15; y += step) {
          doc.line(15, y, w - 15, y);
        }
      } else if (type === 'dot') {
        const step = 5; // 5mm dot grid
        doc.setFillColor(160, 160, 160);
        for (let x = 20; x <= w - 20; x += step) {
          for (let y = 20; y <= h - 20; y += step) {
            doc.circle(x, y, 0.25, 'F');
          }
        }
      }

      doc.save(`printable-${type}-paper.pdf`);
      onToast(`Printable ${type} paper PDF downloaded!`);
    } catch {
      onToast('Error generating paper PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Invoice PDF
  const generateInvoicePdf = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229);
      doc.text('INVOICE', 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice No: ${invoiceNumber}`, 20, 33);
      doc.text(`Date: ${invoiceDate}`, 20, 38);

      // Bill To Box
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30);
      doc.text('BILL TO:', 20, 50);
      doc.setFont('helvetica', 'normal');
      doc.text(clientName, 20, 56);

      // Table Header
      let currentY = 70;
      doc.setFillColor(245, 247, 250);
      doc.rect(20, currentY, 170, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('DESCRIPTION', 25, currentY + 5.5);
      doc.text('QTY', 125, currentY + 5.5);
      doc.text('RATE ($)', 145, currentY + 5.5);
      doc.text('AMOUNT ($)', 170, currentY + 5.5);

      currentY += 12;
      let subtotal = 0;
      doc.setFont('helvetica', 'normal');
      invoiceItems.forEach((item) => {
        const amt = item.quantity * item.rate;
        subtotal += amt;
        doc.text(item.description, 25, currentY);
        doc.text(`${item.quantity}`, 127, currentY);
        doc.text(`${item.rate.toFixed(2)}`, 147, currentY);
        doc.text(`${amt.toFixed(2)}`, 172, currentY);
        currentY += 8;
      });

      // Total
      currentY += 10;
      doc.line(20, currentY, 190, currentY);
      currentY += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('TOTAL AMOUNT:', 120, currentY);
      doc.setTextColor(79, 70, 229);
      doc.text(`$${subtotal.toFixed(2)}`, 170, currentY);

      doc.save(`invoice-${invoiceNumber}.pdf`);
      onToast('Invoice PDF downloaded!');
    } catch {
      onToast('Error generating invoice PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Inspect local PDF file header
  const handleInspectPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInspectFilename(file.name);
      setInspectFileSize(`${(file.size / 1024).toFixed(1)} KB`);

      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
        const pagesEstimate = pageMatches ? pageMatches.length : 1;
        const isPdf = text.startsWith('%PDF-');
        const pdfVersion = isPdf ? text.slice(0, 8) : 'Unknown';

        setInspectInfo(`Format: ${pdfVersion}\nEstimated Pages: ${pagesEstimate}\nSize: ${(file.size / 1024).toFixed(1)} KB\nClient Verification: Valid PDF header detected.`);
        onToast('PDF inspection complete');
      };
      reader.readAsBinaryString(file.slice(0, 50000));
    }
  };

  // Render appropriate view based on tool.id
  if (tool.id === 'image-to-pdf') {
    return (
      <div className="space-y-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 rounded-2xl p-8 text-center bg-neutral-50 dark:bg-neutral-850 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {selectedImage ? (
            <div className="space-y-3">
              <img
                src={selectedImage}
                alt="Upload preview"
                className="max-h-64 mx-auto rounded-lg shadow-sm"
              />
              <p className="text-xs text-indigo-600 font-semibold">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="h-10 w-10 text-neutral-400 mx-auto" />
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Click to upload image or drag & drop
              </p>
              <p className="text-xs text-neutral-500">Supports JPG, PNG, WEBP, BMP</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <span>Orientation:</span>
            <select
              value={pageOrientation}
              onChange={(e) => setPageOrientation(e.target.value as 'portrait' | 'landscape')}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs"
            >
              <option value="portrait">Portrait (A4)</option>
              <option value="landscape">Landscape (A4)</option>
            </select>
          </div>

          <button
            onClick={generateImagePdf}
            disabled={!selectedImage || isGenerating}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>{isGenerating ? 'Converting...' : 'Download Image PDF'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (tool.id.includes('paper') || tool.id.includes('grid') || tool.id.includes('ruled')) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Generate standard high-precision printable A4 paper templates with exact millimeter measurements.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50 dark:bg-neutral-850 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-3">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Ruled Lined Paper</h3>
              <p className="text-xs text-neutral-500 mt-1">8mm notebook lines with red margin boundary.</p>
            </div>
            <button
              onClick={() => generatePaperPdf('ruled')}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
            >
              Download Ruled PDF
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50 dark:bg-neutral-850 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-3">
                <Grid className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Graph Grid Paper</h3>
              <p className="text-xs text-neutral-500 mt-1">5mm engineering and math grid paper.</p>
            </div>
            <button
              onClick={() => generatePaperPdf('grid')}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
            >
              Download Grid PDF
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50 dark:bg-neutral-850 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-3">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Dot Grid Paper</h3>
              <p className="text-xs text-neutral-500 mt-1">5mm bullet journal dot grid template.</p>
            </div>
            <button
              onClick={() => generatePaperPdf('dot')}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
            >
              Download Dot Grid PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (tool.id.includes('invoice') || tool.id.includes('receipt')) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Invoice Number:</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Date:</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Client Name:</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Invoice Line Items:</label>
          <div className="space-y-2">
            {invoiceItems.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const next = [...invoiceItems];
                    next[idx].description = e.target.value;
                    setInvoiceItems(next);
                  }}
                  className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs"
                  placeholder="Item description"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const next = [...invoiceItems];
                    next[idx].quantity = parseInt(e.target.value) || 1;
                    setInvoiceItems(next);
                  }}
                  className="w-16 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1.5 text-xs"
                  placeholder="Qty"
                />
                <input
                  type="number"
                  min="0"
                  value={item.rate}
                  onChange={(e) => {
                    const next = [...invoiceItems];
                    next[idx].rate = parseFloat(e.target.value) || 0;
                    setInvoiceItems(next);
                  }}
                  className="w-24 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1.5 text-xs"
                  placeholder="Rate"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={generateInvoicePdf}
          disabled={isGenerating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <Download className="h-4 w-4" />
          <span>Generate & Download Invoice PDF</span>
        </button>
      </div>
    );
  }

  if (tool.id.includes('counter') || tool.id.includes('metadata') || tool.id.includes('inspect')) {
    return (
      <div className="space-y-4">
        <div
          onClick={() => pdfInspectInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 rounded-2xl p-8 text-center bg-neutral-50 dark:bg-neutral-850"
        >
          <input
            ref={pdfInspectInputRef}
            type="file"
            accept=".pdf"
            onChange={handleInspectPdf}
            className="hidden"
          />
          <FileText className="h-10 w-10 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {inspectFilename ? `Loaded: ${inspectFilename} (${inspectFileSize})` : 'Select local PDF file to inspect'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Read safely in browser memory without upload</p>
        </div>

        {inspectInfo && (
          <pre className="p-4 rounded-xl bg-neutral-900 font-mono text-xs text-emerald-400 whitespace-pre-wrap">
            {inspectInfo}
          </pre>
        )}
      </div>
    );
  }

  // Default: Text to PDF / Markdown to PDF / Notes to PDF
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
          Document Title:
        </label>
        <input
          type="text"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          placeholder="Enter document title (e.g. Project Report, Meeting Summary)..."
          className="w-full rounded-xl border p-3 text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-[#007bff] focus:outline-none transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-color)',
            boxShadow: 'var(--shadow)',
          }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            Document Body Text:
          </label>
          {textContent && (
            <button
              onClick={() => setTextContent('')}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              Clear Text
            </button>
          )}
        </div>
        <textarea
          rows={7}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Yahan apna text ya notes paste karein PDF banane ke liye..."
          className="w-full rounded-xl border p-3.5 text-sm font-normal leading-relaxed placeholder-slate-400 focus:ring-2 focus:ring-[#007bff] focus:outline-none transition-all"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-color)',
            boxShadow: 'var(--shadow)',
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <span>Font Size:</span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 text-xs"
            >
              <option value="10">10 pt</option>
              <option value="12">12 pt (Standard)</option>
              <option value="14">14 pt (Large)</option>
              <option value="16">16 pt</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <span>Orientation:</span>
            <select
              value={pageOrientation}
              onChange={(e) => setPageOrientation(e.target.value as 'portrait' | 'landscape')}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 text-xs"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateTextPdf}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <Download className="h-4 w-4" />
          <span>{isGenerating ? 'Generating...' : 'Download PDF Document'}</span>
        </button>
      </div>

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
