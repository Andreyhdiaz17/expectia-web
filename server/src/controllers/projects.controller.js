import { db } from '../db.js';

function getUserId(req) {
  return Number(req?.user?.id ?? 0);
}

export async function listProjects(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const [items] = await db.execute(
      'SELECT * FROM project WHERE ownerId = ? ORDER BY id DESC',
      [userId]
    );

    res.json({ items });
  } catch (e) { next(e); }
}

export async function createProject(req, res, next) {
  try {
    const { name, description } = req.body || {};
    const trimmed = (name || '').trim();
    if (!trimmed) return res.status(400).json({ error: 'name requerido' });

    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const [result] = await db.execute(
      'INSERT INTO project (name, description, ownerId) VALUES (?, ?, ?)',
      [trimmed, (description ?? '').trim() || null, userId]
    );

    const [rows] = await db.execute('SELECT * FROM project WHERE id = ?', [result.insertId]);
    res.status(201).json({ item: rows[0] });
  } catch (e) { next(e); }
}
