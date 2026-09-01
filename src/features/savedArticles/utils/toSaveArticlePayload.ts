import type { Article } from '@/data/mockArticles';
import type { SaveArticlePayload } from '../types';

/** Builds the minimal normalized snapshot the server persists — used both
 * by `SaveArticleButton` (already on the article page) and by the
 * post-login "perform the pending save" flow (`LoginForm`/`RegisterForm`),
 * which resolves the article from the same in-session article cache
 * instead of ever re-fetching it. */
export function toSaveArticlePayload(article: Article): SaveArticlePayload {
  return {
    articleId: article.id,
    title: article.headline,
    url: article.url,
    image: article.image,
    sourceName: article.sourceName,
    category: article.category,
    publishedAt: article.timestamp,
  };
}
