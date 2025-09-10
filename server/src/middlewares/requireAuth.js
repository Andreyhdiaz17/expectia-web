import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || '';
  // LOG de depuración
  if (!hdr) console.warn('[AUTH] Falta header Authorization');
  else console.log('[AUTH] Authorization:', hdr.slice(0, 40) + '...'); // no loguees completo en prod

  const [, token] = hdr.split(' ');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const id = Number(payload.id ?? payload.sub);
    if (!id) return res.status(401).json({ error: 'Invalid token payload' });

    req.user = {
      id,
      email: payload.email || null,
      role: payload.role || null,
      name: payload.name || null,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
