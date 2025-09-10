import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { listInspections, createInspection, getInspection } from '../controllers/inspections.controller.js';
import findingsRoutes from './findings.routes.js';

const r = Router();
r.use(requireAuth);

r.get('/',    listInspections);
r.post('/',   createInspection);
r.get('/:id', getInspection);

// Anidadas: /api/v1/inspections/:inspectionId/findings
r.use('/:inspectionId/findings', findingsRoutes);

export default r;
