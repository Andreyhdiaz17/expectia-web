import { db } from '../db.js';

const okSeverity = new Set(['low', 'medium', 'high']);
const okStatus   = new Set(['open', 'closed']);
const okType     = new Set(['NO_CONFORMIDAD', 'OBSERVACION', 'MEJORA']);

const getUserId = (req) => Number(req?.user?.id ?? 0);

export async function listFindings(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const inspectionId = Number(req.params.inspectionId || req.query.inspectionId);
    if (!inspectionId) return res.status(400).json({ error: 'inspectionId requerido' });

    const [items] = await db.execute(
      'SELECT * FROM finding WHERE inspectionId = ? ORDER BY id DESC',
      [inspectionId]
    );

    res.json({ items });
  } catch (e) { next(e); }
}

export async function createFinding(req, res, next) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const inspectionId = Number(req.params.inspectionId || req.body.inspectionId);
    if (!inspectionId) return res.status(400).json({ error: 'inspectionId requerido' });

    const title = (req.body?.title || '').trim();
    const description = (req.body?.description ?? '').trim() || null;
    const severity = (req.body?.severity || 'medium').toLowerCase();
    let type = (req.body?.type || 'NO_CONFORMIDAD').toString().toUpperCase();
    const status = (req.body?.status || 'open').toLowerCase();

    if (!title) return res.status(400).json({ error: 'title requerido' });
    if (!okSeverity.has(severity)) return res.status(400).json({ error: 'severity inválido (low|medium|high)' });
    if (!okType.has(type)) return res.status(400).json({ error: `type inválido (${[...okType].join('|')})` });

    // verifica inspección
    const [ins] = await db.execute('SELECT id FROM inspection WHERE id = ?', [inspectionId]);
    if (!ins.length) return res.status(404).json({ error: 'Inspección no existe' });

    const finalStatus = okStatus.has(status) ? status : 'open';

    const [result] = await db.execute(
      `INSERT INTO finding (inspectionId, title, description, severity, type, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [inspectionId, title, description, severity, type, finalStatus]
    );

    const [rows] = await db.execute('SELECT * FROM finding WHERE id = ?', [result.insertId]);
    res.status(201).json({ item: rows[0] });
  } catch (e) {
    // normaliza errores comunes
    if (e?.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'FK inválida (inspection no existente)' });
    }
    if (e?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Hallazgo duplicado (unique)' });
    }
    next(e);
  }
}

export async function updateFinding(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id requerido' });

    const fields = [];
    const params = [];

    if ('title' in req.body) {
      fields.push('title = ?');
      params.push((req.body.title || '').trim() || null);
    }
    if ('description' in req.body) {
      fields.push('description = ?');
      params.push((req.body.description || '').trim() || null);
    }
    if ('severity' in req.body) {
      const sev = String(req.body.severity || '').toLowerCase();
      if (!okSeverity.has(sev)) return res.status(400).json({ error: 'severity inválido' });
      fields.push('severity = ?');
      params.push(sev);
    }
    if ('status' in req.body) {
      const st = String(req.body.status || '').toLowerCase();
      fields.push('status = ?');
      params.push(okStatus.has(st) ? st : 'open');
    }
    if ('type' in req.body) {
      const t = String(req.body.type || '').toUpperCase();
      if (!okType.has(t)) return res.status(400).json({ error: `type inválido (${[...okType].join('|')})` });
      fields.push('type = ?');
      params.push(t);
    }

    if (!fields.length) return res.status(400).json({ error: 'Nada para actualizar' });

    params.push(id);
    const [result] = await db.execute(`UPDATE finding SET ${fields.join(', ')} WHERE id = ?`, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Hallazgo no existe' });

    const [rows] = await db.execute('SELECT * FROM finding WHERE id = ?', [id]);
    res.json({ item: rows[0] });
  } catch (e) { next(e); }
}

export async function deleteFinding(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id requerido' });

    const [result] = await db.execute('DELETE FROM finding WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Hallazgo no existe' });

    res.status(204).end();
  } catch (e) { next(e); }
}
