import { CATEGORIES } from '@/data/categories';
import type { Article } from '@/data/mockArticles';
import type { ArticleCategory } from '@/data/categories';
import { useTopHeadlines } from './useTopHeadlines';
import { useSectionNews } from './useSectionNews';

export interface HomeFeedSection {
  key: ArticleCategory;
  label: string;
  path: string;
  articles: Article[];
}

export interface HomeFeed {
  lead?: Article;
  topStories: Article[];
  latest: Article[];
  sections: HomeFeedSection[];
  loading: boolean;
  error: string | null;
}

interface SectionFeed {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

const SECTION_KEYS: ArticleCategory[] = ['politics', 'world', 'business', 'health', 'tech', 'sport'];

export function useHomeFeed(): HomeFeed {
  // The News API has no per-article category field, so a single general feed
  // can't be sliced into sections client-side — each section is its own
  // request. The category list is fixed at build time, so calling these
  // hooks once per key here does not violate the rules of hooks.
  const general = useTopHeadlines();
  // No native News API category — served via the everything-section route.
  const politics = useSectionNews('politics');
  const world = useSectionNews('world');
  // Real News API categories — served via top-headlines.
  const business = useTopHeadlines('business');
  const health = useTopHeadlines('health');
  const tech = useTopHeadlines('tech');
  const sport = useTopHeadlines('sport');

  const sectionResults: Record<ArticleCategory, SectionFeed> = {
    politics,
    world,
    business,
    health,
    tech,
    sport,
  };

  const lead = general.articles[0];
  const topStories = general.articles.slice(1, 4);
  const latest = general.articles.slice(4, 8);

  const usedIds = new Set<string>(
    [lead, ...topStories, ...latest].filter((article): article is Article => Boolean(article)).map((a) => a.id),
  );

  const sections: HomeFeedSection[] = SECTION_KEYS.map((key) => {
    const category = CATEGORIES.find((item) => item.key === key)!;
    const deduped = sectionResults[key].articles.filter((article) => !usedIds.has(article.id)).slice(0, 4);
    deduped.forEach((article) => usedIds.add(article.id));
    return { key, label: category.label, path: category.path, articles: deduped };
  });

  const loading = general.loading || SECTION_KEYS.some((key) => sectionResults[key].loading);
  const error = general.error ?? SECTION_KEYS.map((key) => sectionResults[key].error).find(Boolean) ?? null;

  return { lead, topStories, latest, sections, loading, error };
}
