import { Router } from 'express';
import { demo, login, logout, me, register } from '../controllers/authController.js';
import { csrfProtection, issueCsrfToken, requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/csrf', issueCsrfToken);
router.post('/register', csrfProtection, register);
router.post('/login', csrfProtection, login);
router.post('/demo', demo);
router.post('/logout', requireAuth, csrfProtection, logout);
router.get('/me', me);

export default router;
