import path from 'node:path';

export async function listImages(_req, res) {
  res.json({ items: [] }); // placeholder si aún no guardas en DB
}

export async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ error: 'file requerido' });
  const fileUrl = `/uploads/inspections/${req.file.filename}`;
  res.status(201).json({
    item: {
      filename: req.file.filename,
      path: fileUrl,
      absPath: path.resolve(req.file.path),
      size: req.file.size,
      mimetype: req.file.mimetype,
    }
  });
}
