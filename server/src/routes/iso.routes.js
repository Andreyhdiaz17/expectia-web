import { Router } from 'express';
import { getCatalog } from '../controllers/iso.controller.js';

const router = Router();
router.get('/characteristics', getCatalog);
export default router;
