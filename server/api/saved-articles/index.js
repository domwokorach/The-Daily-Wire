import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { savedArticlesLimiter } from '../../middleware/rateLimit.js';
import listRoute from './list.js';
import saveRoute from './save.js';
import removeRoute from './remove.js';
import checkRoute from './check.js';

// Entirely private — saved articles are never readable by anyone but the
// owning account, so every route requires authentication, with no public
// read path at all (unlike comments).
const router = Router();

router.get('/', requireAuth, listRoute);
router.get('/:articleId', requireAuth, checkRoute);
router.post('/', requireAuth, savedArticlesLimiter, saveRoute);
router.delete('/:articleId', requireAuth, savedArticlesLimiter, removeRoute);

export default router;
