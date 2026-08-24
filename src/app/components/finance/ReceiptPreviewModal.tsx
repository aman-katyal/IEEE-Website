import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  FileText,
  Maximize2,
  ExternalLink,
} from 'lucide-react';

export interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptUrl?: string;
  receiptFilename?: string;
  requesterName?: string;
  vendorName?: string;
  totalAmount?: number;
  description?: string;
}

export function ReceiptPreviewModal({
  isOpen,
  onClose,
  receiptUrl,
  receiptFilename = 'receipt.pdf',
  requesterName,
  vendorName,
  totalAmount,
  description,
}: ReceiptPreviewModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const isPdf = receiptFilename.toLowerCase().endsWith('.pdf');

  const handleDownload = () => {
    if (!receiptUrl) return;
    const a = document.createElement('a');
    a.href = receiptUrl;
    a.download = receiptFilename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] flex flex-col bg-[#121214] text-slate-100 border border-slate-700/80 shadow-2xl p-0 overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-800 bg-[#16161a] text-left">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                  <span>{receiptFilename}</span>
                  {totalAmount !== undefined && (
                    <span className="text-sm font-mono font-normal text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      ${totalAmount.toFixed(2)}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription
                  className="text-xs text-slate-400 mt-0.5"
                >
                  {requesterName && `Submitted by ${requesterName}`}
                  {vendorName && ` · Vendor: ${vendorName}`}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#0f0f11] border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              aria-label="Zoom out"
              className="h-8 px-2.5 bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5 mr-1" />
              <span>-</span>
            </Button>
            <span className="font-mono text-xs px-2 min-w-[3.5rem] text-center text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              aria-label="Zoom in"
              className="h-8 px-2.5 bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5 mr-1" />
              <span>+</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              aria-label="Reset zoom"
              className="h-8 px-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 ml-1"
            >
              <Maximize2 className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRotate}
              aria-label="Rotate clockwise"
              className="h-8 px-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <RotateCw className="w-3.5 h-3.5 mr-1" />
              Rotate
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs transition-colors"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Viewport Canvas */}
        <div className="flex-1 min-h-[380px] max-h-[58vh] overflow-auto bg-[#0a0a0c] p-6 flex items-center justify-center relative select-none">
          {receiptUrl ? (
            <div
              className="transition-transform duration-200 ease-out origin-center flex items-center justify-center shadow-2xl rounded"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              }}
            >
              {isPdf ? (
                <div className="w-[500px] h-[650px] bg-slate-900 border border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-4">
                    <FileText className="w-16 h-16" />
                  </div>
                  <h4 className="text-base font-semibold text-white mb-2">{receiptFilename}</h4>
                  <p className="text-xs text-slate-400 mb-6 max-w-xs">
                    This PDF document is stored securely in Private Cloudflare R2 bucket. Click below to view the original PDF.
                  </p>
                  <Button
                    type="button"
                    onClick={handleDownload}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download / Open PDF
                  </Button>
                </div>
              ) : (
                <img
                  src={receiptUrl}
                  alt={`Receipt for ${vendorName || receiptFilename}`}
                  className="max-h-[520px] w-auto max-w-full object-contain rounded border border-slate-700/60 shadow-2xl bg-black"
                />
              )}
            </div>
          ) : (
            <div className="text-center p-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
              <p className="text-sm font-medium text-slate-300">No Receipt Document Attached</p>
              <p className="text-xs text-slate-500 mt-1">
                The submitter did not attach a digital receipt image or PDF file.
              </p>
            </div>
          )}
        </div>

        {/* Optional Description / Details Footer */}
        {description && (
          <div className="px-6 py-2.5 bg-[#141417] border-t border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 mr-2">Expense Description:</span>
            {description}
          </div>
        )}

        {/* Action Footer */}
        <DialogFooter className="px-6 py-3 bg-[#16161a] border-t border-slate-800 flex items-center justify-between sm:justify-between">
          <span className="text-xs font-mono text-slate-400">
            BoilerBooks 3.0 · Cloudflare R2 Vault
          </span>
          <div className="flex items-center gap-2">
            {receiptUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download Receipt
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onClose}
              className="bg-sky-600 hover:bg-sky-500 text-white"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
