import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function Hallazgos() {
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    projectId: '',
    title: '',
    type: 'NON_CONFORMITY',
    severity: 'LOW',
    description: ''
  });

  // Cargar proyectos del usuario (LÓGICA ORIGINAL)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api.get('/projects', { token });
        if (!alive) return;
        setProjects(data.items || []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || 'No fue posible cargar proyectos');
      }
    })();
    return () => { alive = false; };
  }, [token]);

  const on = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    if (!form.projectId) {
      setErr('Debes seleccionar un proyecto.');
      return;
    }
    if (!form.title.trim()) {
      setErr('El título del hallazgo es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      // 1) Crear inspección rápida (LÓGICA ORIGINAL)
      const ins = await api.post(
        '/inspections',
        {
          projectId: Number(form.projectId),
          title: form.title || 'Hallazgo rápido',
          scope: form.description || ''
        },
        { token }
      );

      // 2) Crear hallazgo asociado (LÓGICA ORIGINAL)
      await api.post(
        `/inspections/${ins.item.id}/findings`,
        {
          type: form.type,
          severity: form.severity,
          title: form.title,
          description: form.description
        },
        { token }
      );

      setMsg(`Hallazgo guardado ✅ (Inspección #${ins.item.id})`);
      setForm((f) => ({
        projectId: f.projectId,
        title: '',
        type: 'NON_CONFORMITY',
        severity: 'LOW',
        description: ''
      }));
    } catch (e) {
      setErr(e.message || 'Error al guardar hallazgo');
    } finally {
      setLoading(false);
    }
  };

  // —— CSS embebido ——
  const styles = `
  .hz-wrap { max-width: 980px; margin: 0 auto; padding: 22px 18px 40px; }
  .hz-title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; margin: 0 0 10px; }
  .hz-helper { color: #475569; line-height: 1.6; margin: 0 0 18px; }
  .hz-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 10px 28px rgba(15,23,42,.06);
    transition: border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
  }
  .hz-card:hover { border-color: #cbd5e1; transform: translateY(-1px); }
  .hz-sub { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
  .hz-grid-3 { display: grid; gap: 12px; grid-template-columns: 1fr; }
  @media (min-width: 860px){ .hz-grid-3 { grid-template-columns: 1fr 1fr 1fr; } }
  .hz-grid-2 { display: grid; gap: 12px; grid-template-columns: 1fr; }
  @media (min-width: 700px){ .hz-grid-2 { grid-template-columns: 1fr 1fr; } }
  .hz-label { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: inline-block; }
  .hz-input, .hz-select, .hz-textarea {
    width: 100%; font-size: 14px; border-radius: 12px; background: #fff;
    border: 1px solid #cbd5e1; padding: 10px 12px; transition: border-color 140ms ease, box-shadow 140ms ease;
  }
  .hz-input:focus, .hz-select:focus, .hz-textarea:focus {
    outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15);
  }
  .hz-action {
    display: inline-flex; align-items: center; gap: 8px; border-radius: 12px; padding: 10px 14px; border: 1px solid #e2e8f0;
    font-weight: 700; color: #0f172a; background: #fff; cursor: pointer;
    transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
  }
  .hz-action:hover { background: #f8fafc; transform: translateY(-1px); }
  .hz-action[disabled] { opacity: .6; cursor: not-allowed; transform: none; }
  .hz-ok { color: #065f46; margin: 8px 0; }
  .hz-err { color: #b91c1c; margin: 8px 0; }
  .hz-muted { color: #64748b; }
  `;

  return (
    <section className="hz-wrap">
      <style>{styles}</style>

      <h2 className="hz-title">Registro de hallazgos</h2>
      <p className="hz-helper">
        Completa el formulario para registrar un hallazgo asociado a un proyecto.
        El sistema creará automáticamente una <strong>inspección</strong> y vinculará el hallazgo.
      </p>

      {msg && <p className="hz-ok">{msg}</p>}
      {err && <p className="hz-err">{err}</p>}

      <form onSubmit={onSubmit} className="hz-card" style={{ maxWidth: 980, opacity: loading ? 0.7 : 1 }}>
        <div className="hz-grid-3">
          <div>
            <label className="hz-label">Proyecto</label>
            <select className="hz-select" value={form.projectId} onChange={on('projectId')} required>
              <option value="">Seleccionar proyecto</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="hz-label">Título del hallazgo</label>
            <input
              className="hz-input"
              placeholder="Ej. Contraste insuficiente en encabezados"
              value={form.title}
              onChange={on('title')}
              required
            />
          </div>

          <div>
            <label className="hz-label">Severidad</label>
            <select className="hz-select" value={form.severity} onChange={on('severity')}>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
        </div>

        <div className="hz-grid-2" style={{ marginTop: 12 }}>
          <div>
            <label className="hz-label">Tipo</label>
            <select className="hz-select" value={form.type} onChange={on('type')}>
              <option value="NON_CONFORMITY">No conformidad</option>
              <option value="OBSERVATION">Observación</option>
              <option value="IMPROVEMENT">Mejora</option>
            </select>
          </div>
          <div>
            <label className="hz-label">&nbsp;</label>
            <div className="hz-muted">Espacio reservado para adjuntos u otro campo futuro.</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="hz-label">Descripción / evidencia</label>
          <textarea
            className="hz-textarea"
            rows={5}
            placeholder="Describe problema, impacto y evidencia. Ej.: capturas, pasos para reproducir, contexto…"
            value={form.description}
            onChange={on('description')}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="hz-action" style={{ border: '1px solid #cbd5e1' }} disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar hallazgo'}
          </button>
        </div>
      </form>
    </section>
  );
}
