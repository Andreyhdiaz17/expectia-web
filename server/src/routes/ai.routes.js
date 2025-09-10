import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { classifyMock } from '../controllers/ai.controller.js';

const r = Router();
r.use(requireAuth);
r.post('/classify', classifyMock);

export default r;
