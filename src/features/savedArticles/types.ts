export interface SavedArticle {
  id: string;
  articleId: string;
  title: string;
  url: string | null;
  image: string | null;
  sourceName: string | null;
  category: string | null;
  publishedAt: string | null;
  savedAt: string;
}

export interface SaveArticlePayload {
  articleId: string;
  title: string;
  url?: string;
  image?: string;
  sourceName?: string;
  category?: string;
  publishedAt?: string;
}
