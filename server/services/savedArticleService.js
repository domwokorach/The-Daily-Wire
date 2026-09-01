import {
  findByUserAndArticle,
  createSavedArticle,
  removeSavedArticle,
  listByUser,
  toPublicSavedArticle,
} from '../repositories/savedArticleRepository.js';

export async function saveArticle(userId, params) {
  const existing = await findByUserAndArticle(userId, params.articleId);
  if (existing) return { status: 200, body: { saved: true, alreadySaved: true, savedArticle: toPublicSavedArticle(existing) } };

  const created = await createSavedArticle({ userId, ...params });
  return { status: 201, body: { saved: true, savedArticle: toPublicSavedArticle(created) } };
}

export async function removeSaved(userId, articleId) {
  await removeSavedArticle(userId, articleId);
  return { status: 200, body: { saved: false } };
}

export async function checkSaved(userId, articleId) {
  const existing = await findByUserAndArticle(userId, articleId);
  return { status: 200, body: { saved: Boolean(existing), savedArticle: toPublicSavedArticle(existing) } };
}

export async function listSaved(userId, { limit, cursor } = {}) {
  const { rows, nextCursor } = await listByUser(userId, { limit, cursor });
  return { status: 200, body: { savedArticles: rows.map(toPublicSavedArticle), nextCursor } };
}
