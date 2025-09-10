import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { listProjects, createProject } from '../controllers/projects.controller.js';

const r = Router();
r.use(requireAuth);
r.get('/',  listProjects);
r.post('/', createProject);

export default r;
