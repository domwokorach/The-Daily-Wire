import {
  findByUserAndArticle,
  createSavedArticle,
  removeSavedArticle,
  listByUser,
  toPublicSavedArticle,
} from '../repositories/savedArticleRepository.js';

export function saveArticle(userId, params) {
  const existing = findByUserAndArticle(userId, params.articleId);
  if (existing) return { status: 200, body: { saved: true, alreadySaved: true, savedArticle: toPublicSavedArticle(existing) } };

  const created = createSavedArticle({ userId, ...params });
  return { status: 201, body: { saved: true, savedArticle: toPublicSavedArticle(created) } };
}

export function removeSaved(userId, articleId) {
  removeSavedArticle(userId, articleId);
  return { status: 200, body: { saved: false } };
}

export function checkSaved(userId, articleId) {
  const existing = findByUserAndArticle(userId, articleId);
  return { status: 200, body: { saved: Boolean(existing), savedArticle: toPublicSavedArticle(existing) } };
}

export function listSaved(userId, { limit, cursor } = {}) {
  const { rows, nextCursor } = listByUser(userId, { limit, cursor });
  return { status: 200, body: { savedArticles: rows.map(toPublicSavedArticle), nextCursor } };
}
