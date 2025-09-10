import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { createFinding, listFindings, updateFinding, deleteFinding } from '../controllers/findings.controller.js';

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get('/',       listFindings);
router.post('/',      createFinding);
router.patch('/:id',  updateFinding);
router.delete('/:id', deleteFinding);

export default router;
