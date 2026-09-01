export interface CommentAuthor {
  id: string | null;
  displayName: string;
}

export interface Comment {
  id: string;
  articleId: string;
  author: CommentAuthor;
  body: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  /** Client-only — an optimistic comment not yet confirmed by the server. */
  pending?: boolean;
  /** Client-only — an optimistic comment whose server request failed. */
  failed?: boolean;
}

export type CommentSort = 'newest' | 'oldest';

export interface CommentsPage {
  comments: Comment[];
  nextCursor: string | null;
  totalCount: number;
}
