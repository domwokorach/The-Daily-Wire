import { apiClient } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { SavedArticle, SaveArticlePayload } from '../types';

const SAVED_ARTICLES_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/saved-articles`;

interface SaveResult {
  saved: true;
  alreadySaved?: boolean;
  savedArticle: SavedArticle;
}

interface CheckResult {
  saved: boolean;
  savedArticle: SavedArticle | null;
}

interface ListResult {
  savedArticles: SavedArticle[];
  nextCursor: string | null;
}

export function saveArticle(payload: SaveArticlePayload): Promise<SaveResult> {
  return apiClient.post(SAVED_ARTICLES_ENDPOINT, payload);
}

export function removeSavedArticle(articleId: string): Promise<{ saved: false }> {
  return apiClient.delete(`${SAVED_ARTICLES_ENDPOINT}/${encodeURIComponent(articleId)}`);
}

export function checkSavedArticle(articleId: string): Promise<CheckResult> {
  return apiClient.get(`${SAVED_ARTICLES_ENDPOINT}/${encodeURIComponent(articleId)}`);
}

export function listSavedArticles(cursor?: string): Promise<ListResult> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  return apiClient.get(`${SAVED_ARTICLES_ENDPOINT}${query}`);
}
