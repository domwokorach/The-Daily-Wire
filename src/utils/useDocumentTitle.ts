import { useEffect } from 'react';

const DESCRIPTION_META_NAME = 'description';

function getOrCreateDescriptionTag(): HTMLMetaElement {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${DESCRIPTION_META_NAME}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = DESCRIPTION_META_NAME;
    document.head.appendChild(tag);
  }
  return tag;
}

/**
 * Sets the document title and `<meta name="description">` for the current
 * page, restoring the previous values on unmount. This app has no
 * app-wide SEO/head-management library — kept intentionally minimal rather
 * than introducing one for a handful of static legal pages.
 */
export function useDocumentTitle(title: string, description?: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let previousDescription: string | null = null;
    if (description) {
      const tag = getOrCreateDescriptionTag();
      previousDescription = tag.content;
      tag.content = description;
    }

    return () => {
      document.title = previousTitle;
      if (description) {
        getOrCreateDescriptionTag().content = previousDescription ?? '';
      }
    };
  }, [title, description]);
}
