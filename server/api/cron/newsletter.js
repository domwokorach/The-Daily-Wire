import { Router } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { getEnv } from '../../config/env.js';
import { sendDailyDigestToSubscribers, sendWeeklyDigestToSubscribers } from '../../services/newsletterService.js';

const router = Router();

function requireCronAuth(req, res, next) {
  const secret = getEnv().cronSecret;
  if (!secret || req.headers['authorization'] !== `Bearer ${secret}`) {
    res.status(401).json({ error: true, code: 'UNAUTHORIZED' });
    return;
  }
  next();
}

router.get('/daily', requireCronAuth, asyncHandler(async (_req, res) => {
  const sentCount = await sendDailyDigestToSubscribers();
  res.status(200).json({ ok: true, sentCount });
}));

router.get('/weekly', requireCronAuth, asyncHandler(async (_req, res) => {
  const sentCount = await sendWeeklyDigestToSubscribers();
  res.status(200).json({ ok: true, sentCount });
}));

export default router;
