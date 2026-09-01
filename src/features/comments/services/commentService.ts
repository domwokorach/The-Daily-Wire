import { apiClient } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { Comment } from '../types';

const ARTICLES_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/articles`;
const COMMENTS_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/comments`;

export function listComments(articleId: string): Promise<Comment[]> {
  return apiClient
    .get<{ comments: Comment[] }>(`${ARTICLES_ENDPOINT}/${encodeURIComponent(articleId)}/comments`)
    .then((r) => r.comments);
}

export function createComment(articleId: string, body: string): Promise<Comment> {
  return apiClient
    .post<{ comment: Comment }>(`${ARTICLES_ENDPOINT}/${encodeURIComponent(articleId)}/comments`, { body })
    .then((r) => r.comment);
}

export function updateComment(commentId: string, body: string): Promise<Comment> {
  return apiClient
    .patch<{ comment: Comment }>(`${COMMENTS_ENDPOINT}/${encodeURIComponent(commentId)}`, { body })
    .then((r) => r.comment);
}

export function deleteComment(commentId: string): Promise<void> {
  return apiClient.delete(`${COMMENTS_ENDPOINT}/${encodeURIComponent(commentId)}`);
}
