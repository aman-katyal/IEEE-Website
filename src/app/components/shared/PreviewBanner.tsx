import { useSearchParams } from "react-router";
import { Eye, X } from "lucide-react";

/**
 * Sanity CMS Preview Mode Banner.
 * Displays when viewing draft content with a one-click exit preview button.
 */
export function PreviewBanner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isPreview = searchParams.has("preview");

  if (!isPreview) return null;

  const handleExitPreview = () => {
    searchParams.delete("preview");
    setSearchParams(searchParams, { replace: true });
    window.location.reload();
  };

  return (
    <div
      role="status"
      aria-label="Sanity Live Preview Mode Active"
      className="fixed top-0 left-0 right-0 z-[300] bg-amber-500/95 text-black px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" aria-hidden="true" />
        <span>Live Preview Mode Active — Displaying unpublished draft content.</span>
      </div>
      <button
        onClick={handleExitPreview}
        className="flex items-center gap-1 bg-black text-white hover:bg-neutral-800 px-2.5 py-1 rounded transition-colors cursor-pointer text-xs uppercase tracking-wider font-mono"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Exit Preview</span>
      </button>
    </div>
  );
}
