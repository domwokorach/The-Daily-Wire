import { apiClient, buildQueryString } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { Comment, CommentSort, CommentsPage } from '../types';

const ARTICLES_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/articles`;
const COMMENTS_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/comments`;

export function commentStreamUrl(articleId: string): string {
  return `${ARTICLES_ENDPOINT}/${encodeURIComponent(articleId)}/comments/stream`;
}

export interface ListCommentsOptions {
  cursor?: string | null;
  sort?: CommentSort;
  limit?: number;
}

export function listComments(articleId: string, options: ListCommentsOptions = {}): Promise<CommentsPage> {
  const query = buildQueryString({ cursor: options.cursor ?? undefined, sort: options.sort, limit: options.limit });
  return apiClient.get<CommentsPage>(`${ARTICLES_ENDPOINT}/${encodeURIComponent(articleId)}/comments${query}`);
}

interface CreateCommentResult {
  comment: Comment;
  clientMutationId?: string;
}

export function createComment(articleId: string, body: string, clientMutationId: string): Promise<CreateCommentResult> {
  return apiClient.post<CreateCommentResult>(`${ARTICLES_ENDPOINT}/${encodeURIComponent(articleId)}/comments`, {
    body,
    clientMutationId,
  });
}

export function updateComment(commentId: string, body: string): Promise<Comment> {
  return apiClient
    .patch<{ comment: Comment }>(`${COMMENTS_ENDPOINT}/${encodeURIComponent(commentId)}`, { body })
    .then((r) => r.comment);
}

export function deleteComment(commentId: string): Promise<void> {
  return apiClient.delete(`${COMMENTS_ENDPOINT}/${encodeURIComponent(commentId)}`);
}
