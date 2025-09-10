import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { requireAuth } from '../middlewares/requireAuth.js';
import { uploadImage, listImages } from '../controllers/images.controller.js';

const uploadsDir = path.join(process.cwd(), 'uploads', 'inspections');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

const r = Router({ mergeParams: true });
r.use(requireAuth);
r.get('/', listImages);
r.post('/', upload.single('file'), uploadImage);

export default r;
