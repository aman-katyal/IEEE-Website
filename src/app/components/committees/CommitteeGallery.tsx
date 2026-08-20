import { useState } from "react";
import { Skeleton } from "boneyard-js/react";
import { Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "../ui/dialog";
import type { CommitteeSection, GalleryItem } from "../../../data/committees/types";

interface CommitteeGalleryProps {
  sections: CommitteeSection[];
  loading: boolean;
  isLight: boolean;
}

export function CommitteeGallery({ sections, loading, isLight }: CommitteeGalleryProps) {
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  if (!sections || sections.length === 0) return null;

  return (
    <Skeleton
      name="committee-gallery"
      loading={loading}
      color={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {sections.map((section, idx) => {
          if (section.type !== "gallery") return null;
          return (
            <div key={idx}>
              <p className="section-eyebrow" style={{ marginBottom: "20px" }}>
                // {section.title || "Gallery & Media"}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {section.items?.map((item, i) => (
                  <div
                    key={i}
                    className="gallery-item-container group relative rounded-lg overflow-hidden border border-[var(--glass-border)] cursor-pointer aspect-square bg-black/20"
                    onClick={() => setActiveImage(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveImage(item)}
                  >
                    <img
                      src={item.image || item.src}
                      alt={item.caption || item.name || "Gallery item"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="caption-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-3">
                      <p className="text-xs font-mono text-white/90 line-clamp-2">
                        {item.caption || item.name}
                      </p>
                      <span className="text-[10px] font-mono text-[var(--electric-blue)] mt-1 flex items-center gap-1">
                        <Maximize2 size={10} /> View full
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Lightbox Dialog */}
      <Dialog
        open={!!activeImage}
        onOpenChange={(open) => !open && setActiveImage(null)}
      >
        <DialogContent className="max-w-4xl bg-[var(--boiler-black)] border-[var(--glass-border)] p-4 text-[var(--text-primary)]">
          {activeImage && (
            <div className="flex flex-col gap-3">
              <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-lg bg-black/40">
                <img
                  src={activeImage.image}
                  alt={activeImage.caption || activeImage.name || "Enlarged view"}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
                />
              </div>
              {(activeImage.caption || activeImage.name) && (
                <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-secondary)] text-center">
                  {activeImage.caption || activeImage.name}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Skeleton>
  );
}
