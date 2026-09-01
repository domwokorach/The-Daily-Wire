import { Router } from 'express';
import resendWebhookRoute from './resend.js';

const router = Router();

router.post('/resend', resendWebhookRoute);

export default router;
