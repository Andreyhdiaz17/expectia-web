import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function InspeccionesNuevas() {
  const { token } = useAuth();

  // Estado original + mejoras de UX (loading/err)
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ projectId: '', title: '', scope: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoadingProjects(true);
    setErr('');
    (async () => {
      try {
        const d = await api.get('/projects', { token });
        if (!alive) return;
        setProjects(d.items || []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || 'No fue posible cargar proyectos');
      } finally {
        if (alive) setLoadingProjects(false);
      }
    })();
    return () => { alive = false; };
  }, [token]);

  const on = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    // Validaciones básicas (sin cambiar la lógica de envío)
    if (!form.projectId) return setErr('Selecciona un proyecto.');
    if (!form.title.trim()) return setErr('El título es obligatorio.');

    setLoading(true);
    try {
      const res = await api.post(
        '/inspections',
        { projectId: Number(form.projectId), title: form.title.trim(), scope: form.scope || '' },
        { token }
      );
      setMsg(`Inspección creada con ID ${res.item.id}`);
      // Limpieza ligera (mantengo projectId para crear varias seguidas si quieres)
      setForm(f => ({ projectId: f.projectId, title: '', scope: '' }));
    } catch (e) {
      setErr(e.message || 'Error creando inspección');
    } finally {
      setLoading(false);
    }
  };

  // ---------- CSS embebido (solo estilos; la lógica queda intacta) ----------
  const styles = `
  .ins-wrap { max-width: 920px; margin: 0 auto; padding: 24px 18px 40px; }
  .ins-title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; margin: 0 0 8px; }
  .ins-helper { color: #475569; margin: 0 0 16px; line-height: 1.6; }

  .ins-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 10px 28px rgba(15,23,42,.06);
    transition: border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
  }
  .ins-card:hover { border-color: #cbd5e1; transform: translateY(-1px); }

  .ins-grid { display: grid; gap: 12px; grid-template-columns: 1fr; }
  @media (min-width: 840px){ .ins-grid { grid-template-columns: 1fr 1fr; } }

  .ins-label { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: inline-block; }
  .ins-input, .ins-select, .ins-textarea {
    width: 100%; font-size: 14px; border-radius: 12px; background: #fff;
    border: 1px solid #cbd5e1; padding: 10px 12px; transition: border-color 140ms ease, box-shadow 140ms ease;
  }
  .ins-input:focus, .ins-select:focus, .ins-textarea:focus {
    outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15);
  }

  .ins-actions { display:flex; gap:10px; align-items:center; margin-top: 10px; }
  .ins-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:700;
    border-radius:12px; padding:10px 14px; cursor:pointer; transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
  }
  .ins-btn.primary { background:#2563eb; color:#fff; border:1px solid #1d4ed8; }
  .ins-btn.primary:hover { background:#1d4ed8; border-color:#1e40af; box-shadow:0 6px 18px rgba(37,99,235,.25); transform: translateY(-1px); }
  .ins-btn[disabled] { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }

  .ins-msg-ok { color:#065f46; margin: 8px 0; }
  .ins-msg-err { color:#b91c1c; margin: 8px 0; }
  .ins-muted { color:#64748b; }
  `;

  return (
    <section className="ins-wrap">
      <style>{styles}</style>

      <h2 className="ins-title">Nueva inspección</h2>
      <p className="ins-helper">Crea una nueva inspección vinculada a un proyecto existente.</p>

      {msg && <p className="ins-msg-ok">{msg}</p>}
      {err && <p className="ins-msg-err">{err}</p>}

      <form onSubmit={submit} className="ins-card" style={{ maxWidth: 720, opacity: loading ? 0.7 : 1 }}>
        <div className="ins-grid">
          <div>
            <label className="ins-label">Proyecto</label>
            <select
              className="ins-select"
              value={form.projectId}
              onChange={on('projectId')}
              required
              disabled={loadingProjects}
            >
              <option value="">{loadingProjects ? 'Cargando…' : 'Seleccione…'}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {loadingProjects && <div className="ins-muted" style={{ marginTop: 6 }}>Cargando proyectos…</div>}
          </div>

          <div>
            <label className="ins-label">Título</label>
            <input
              className="ins-input"
              value={form.title}
              onChange={on('title')}
              placeholder="Ej. Inspección de usabilidad"
              required
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="ins-label">Alcance</label>
          <textarea
            className="ins-textarea"
            rows={5}
            value={form.scope}
            onChange={on('scope')}
            placeholder="Módulos, criterios, alcance de la revisión…"
          />
        </div>

        <div className="ins-actions">
          <button className="ins-btn primary" disabled={loading || loadingProjects}>
            {loading ? 'Creando…' : 'Crear'}
          </button>
        </div>
      </form>
    </section>
  );
}
