import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { pdfFromPayload } from '../controllers/reports.controller.js';

const router = Router();
router.post('/pdf-from-payload', requireAuth, pdfFromPayload);
export default router;
