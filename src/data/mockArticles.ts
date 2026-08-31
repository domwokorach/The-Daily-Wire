import type { CategoryKey } from './categories';

export interface Article {
  id: string;
  /** Omitted for cross-category feeds (e.g. the homepage's general pool). */
  category?: Exclude<CategoryKey, 'home' | 'weather'>;
  categoryLabel?: string;
  headline: string;
  /** Omitted when the source provides no description. */
  summary?: string;
  image: string;
  /** Omitted when the source provides no publish date or it fails to parse. */
  timestamp?: string;
  author?: string;
  /** Link to the original source article. */
  url?: string;
  sourceName?: string;
  breaking?: boolean;
  live?: boolean;
}
