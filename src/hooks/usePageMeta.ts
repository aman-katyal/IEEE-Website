import { useEffect } from "react";

export interface PageMetaOptions {
  title: string;
  description?: string;
}

const DEFAULT_TITLE = "Purdue IEEE | Official Student Branch of Purdue University";
const DEFAULT_DESCRIPTION =
  "The official website of the Purdue University IEEE Student Branch. Purdue's premier student-run engineering organization featuring technical project committees, workshops, and professional development since 1903.";

export function usePageMeta({ title, description }: PageMetaOptions): void {
  useEffect(() => {
    const prevTitle = document.title;
    const formattedTitle = (!title || title === "Home" || title === "Purdue IEEE")
      ? DEFAULT_TITLE
      : `${title} | Purdue IEEE`;
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
