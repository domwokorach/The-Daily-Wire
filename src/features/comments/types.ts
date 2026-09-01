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
}
