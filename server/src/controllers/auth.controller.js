import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const ACCESS_SECRET  = process.env.JWT_SECRET || 'devsecret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || ACCESS_SECRET;

function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email, role: user.role ?? null, name: user.name ?? null },
    ACCESS_SECRET,
    { expiresIn: '1h' }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req, res, next) {
  try {
    let { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }

    email = String(email).trim().toLowerCase();

    // ¿ya existe?
    const [exists] = await db.execute('SELECT id FROM user WHERE email = ?', [email]);
    if (exists.length) return res.status(409).json({ error: 'Email ya registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const role = 'user';

    const [result] = await db.execute(
      'INSERT INTO user (name, email, passwordHash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email, passwordHash, role]
    );

    const user = { id: result.insertId, name: name.trim(), email, role };
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password requeridos' });
    }

    email = String(email).trim().toLowerCase();

    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role ?? 'user' },
      accessToken,
      refreshToken,
    });
  } catch (e) { next(e); }
}

export async function me(_req, res) {
  // requireAuth coloca el usuario en req.user
  res.json({ user: res.req.user });
}

export async function refresh(req, res, next) {
  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ error: 'Falta refresh token' });

    const payload = jwt.verify(token, REFRESH_SECRET);
    const userId = Number(payload.sub);
    if (!userId) return res.status(401).json({ error: 'Refresh token inválido' });

    const [rows] = await db.execute(
      'SELECT id, name, email, role FROM user WHERE id = ?',
      [userId]
    );
    if (!rows.length) return res.status(401).json({ error: 'Usuario no encontrado' });

    const accessToken = signAccessToken(rows[0]);
    res.json({ accessToken });
  } catch (e) {
    if (e.name === 'TokenExpiredError') return res.status(401).json({ error: 'Refresh token expirado' });
    if (e.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Refresh token inválido' });
    next(e);
  }
}
