import { db } from '../db.js';

export async function listInspections(req, res, next) {
  try {
    const projectId = Number(req.query.projectId || 0);

    if (!projectId) {
      const [items] = await db.execute(`
        SELECT i.*,
               p.id  AS project_id,
               p.name AS project_name
        FROM inspection i
        LEFT JOIN project p ON p.id = i.projectId
        ORDER BY i.id DESC
      `);
      return res.json({ items });
    }

    const [items] = await db.execute(`
      SELECT i.*,
             p.id  AS project_id,
             p.name AS project_name
      FROM inspection i
      LEFT JOIN project p ON p.id = i.projectId
      WHERE i.projectId = ?
      ORDER BY i.id DESC
    `, [projectId]);

    res.json({ items });
  } catch (e) { next(e); }
}

export async function createInspection(req, res, next) {
  try {
    const { projectId, title, scope } = req.body || {};
    if (!projectId || !title) {
      return res.status(400).json({ error: 'projectId y title requeridos' });
    }

    const auditorId = Number(req?.user?.id || 0);
    if (!auditorId) return res.status(401).json({ error: 'No autenticado' });

    // verifica proyecto
    const [proj] = await db.execute('SELECT id FROM project WHERE id = ?', [Number(projectId)]);
    if (!proj.length) return res.status(404).json({ error: 'Proyecto no existe' });

    const [result] = await db.execute(
      'INSERT INTO inspection (projectId, auditorId, title, scope) VALUES (?, ?, ?, ?)',
      [Number(projectId), auditorId, title, scope || null]
    );

    const [rows] = await db.execute('SELECT * FROM inspection WHERE id = ?', [result.insertId]);
    res.status(201).json({ item: rows[0] });
  } catch (e) { next(e); }
}

export async function getInspection(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id requerido' });

    const [ins] = await db.execute('SELECT * FROM inspection WHERE id = ?', [id]);
    if (!ins.length) return res.status(404).json({ error: 'No encontrada' });
    const inspection = ins[0];

    const [proj] = await db.execute('SELECT * FROM project WHERE id = ?', [inspection.projectId]);
    const [findings] = await db.execute(
      'SELECT * FROM finding WHERE inspectionId = ? ORDER BY id DESC',
      [id]
    );

    // opcional: imágenes si tienes tabla inspectionimage
    let images = [];
    try {
      const [imgs] = await db.execute(
        'SELECT * FROM inspectionimage WHERE inspectionId = ? ORDER BY id DESC',
        [id]
      );
      images = imgs;
    } catch { /* ignora si no existe */ }

    res.json({
      item: {
        ...inspection,
        project: proj[0] || null,
        findings,
        images
      }
    });
  } catch (e) { next(e); }
}
