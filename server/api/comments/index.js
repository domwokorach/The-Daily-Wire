import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/requireAuth.js';
import { requireCommentOwner } from '../../middleware/requireCommentOwner.js';
import { commentLimiter } from '../../middleware/rateLimit.js';
import listCommentsRoute from './listComments.js';
import createCommentRoute from './createComment.js';
import updateCommentRoute from './updateComment.js';
import deleteCommentRoute from './deleteComment.js';
import commentStreamRoute from './stream.js';

export const articleCommentsRouter = Router();
articleCommentsRouter.get('/:articleId/comments', optionalAuth, listCommentsRoute);
articleCommentsRouter.get('/:articleId/comments/stream', optionalAuth, commentStreamRoute);
articleCommentsRouter.post('/:articleId/comments', requireAuth, commentLimiter, createCommentRoute);

export const commentByIdRouter = Router();
commentByIdRouter.patch('/:commentId', requireAuth, requireCommentOwner, updateCommentRoute);
commentByIdRouter.delete('/:commentId', requireAuth, requireCommentOwner, deleteCommentRoute);
