import type { ArticleCategory } from '@/data/categories';
import { useEverythingNews } from './useEverythingNews';

/** Politics/World — sections News API has no native category for, served
 * via `/api/news/everything?section=`. The section's query content is
 * owned entirely server-side (`server/config/newsSources.js`). */
export function useSectionNews(section: ArticleCategory) {
  return useEverythingNews(undefined, { section });
}
