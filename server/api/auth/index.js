import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/requireAuth.js';
import { authLimiter } from '../../middleware/rateLimit.js';
import registerRoute from './register.js';
import loginRoute from './login.js';
import logoutRoute from './logout.js';
import meRoute from './me.js';
import forgotPasswordRoute from './forgotPassword.js';
import resetPasswordRoute from './resetPassword.js';
import changePasswordRoute from './changePassword.js';
import changeEmailRoute from './changeEmail.js';
import verifyEmailRoute from './verifyEmail.js';
import deleteAccountRoute from './deleteAccount.js';
import profileRoute from './profile.js';

const router = Router();

router.post('/register', authLimiter, registerRoute);
router.post('/login', authLimiter, loginRoute);
router.post('/logout', optionalAuth, logoutRoute);
router.get('/me', requireAuth, meRoute);
router.post('/forgot-password', authLimiter, forgotPasswordRoute);
router.post('/reset-password', authLimiter, resetPasswordRoute);
router.post('/verify-email', verifyEmailRoute);
router.post('/change-password', requireAuth, changePasswordRoute);
router.post('/change-email', requireAuth, changeEmailRoute);
router.patch('/profile', requireAuth, profileRoute);
router.delete('/me', requireAuth, deleteAccountRoute);

export default router;
