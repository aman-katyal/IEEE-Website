import { useEffect } from "react";

export interface PageMetaOptions {
  title: string;
  description?: string;
}

const DEFAULT_TITLE = "Purdue University IEEE Student Branch";
const DEFAULT_DESCRIPTION =
  "Official website for the Purdue University IEEE Student Branch. Advancing technology for humanity through student-led engineering committees and innovation.";

export function usePageMeta({ title, description }: PageMetaOptions): void {
  useEffect(() => {
    const prevTitle = document.title;
    const formattedTitle = title
      ? `${title} | Purdue IEEE`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";

    const contentToSet = description || DEFAULT_DESCRIPTION;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", contentToSet);

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute("content", prevDesc);
      }
    };
  }, [title, description]);
}
