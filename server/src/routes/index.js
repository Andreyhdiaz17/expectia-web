import { Router } from 'express';

import authRoutes from './auth.routes.js';
import projectsRoutes from './projects.routes.js';
import inspectionsRoutes from './inspections.routes.js';
import reportsRoutes from './reports.routes.js';
import isoRoutes from './iso.routes.js';
import imagesRoutes from './images.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.use('/auth',        authRoutes);
router.use('/projects',    projectsRoutes);
router.use('/inspections', inspectionsRoutes); // incluye /:inspectionId/findings
router.use('/reports',     reportsRoutes);
router.use('/iso',         isoRoutes);
router.use('/images',      imagesRoutes);
router.use('/ai',          aiRoutes);

export default router;
