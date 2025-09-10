import { Router } from 'express';
import { register, login, me, refresh } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.post('/register', register);
router.post('/login',    login);
router.post('/refresh',  refresh);
router.get('/me',        requireAuth, me);

export default router;
