import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { AnimatePresence } from "motion/react";

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface LightboxModalProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function LightboxModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-label="Photo Gallery Lightbox"
        aria-modal="true"
        className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
      >
        {/* Top Controls Bar */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="text-xs font-mono text-neutral-400">
            {currentIndex + 1} / {images.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 3))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-2"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Center Image Container */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-4">
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
          )}

          <img
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt || "Gallery image"}
            style={{ transform: `scale(${zoomLevel})` }}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg transition-transform duration-200"
          />

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <p className="text-xs text-neutral-300 text-center max-w-lg font-mono">
            {currentImage.caption}
          </p>
        )}
      </div>
    </AnimatePresence>
  );
}
