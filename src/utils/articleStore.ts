import type { Article } from '@/data/mockArticles';

const STORAGE_KEY = 'news-storys:articles';
const memoryStore = new Map<string, Article>();

function readStorage(): Record<string, Article> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Article>) : {};
  } catch {
    return {};
  }
}

function writeStorage(all: Record<string, Article>): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable (private mode, quota exceeded) — the in-memory
    // cache still serves lookups for the rest of this page session.
  }
}

/**
 * The News API has no "get article by id" endpoint, so article detail pages
 * are served from articles already seen in list/search views this session.
 */
export function rememberArticles(articles: Article[]): void {
  if (articles.length === 0) return;

  const all = readStorage();
  for (const article of articles) {
    memoryStore.set(article.id, article);
    all[article.id] = article;
  }
  writeStorage(all);
}

export function getRememberedArticle(id: string): Article | undefined {
  if (memoryStore.has(id)) return memoryStore.get(id);
  return readStorage()[id];
}
