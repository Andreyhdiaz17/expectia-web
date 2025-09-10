import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CRITERIA = [
  { characteristic: 'Funcionalidad', sub: 'Adecuación funcional', crit: 'Cobertura de funciones' },
  { characteristic: 'Fiabilidad',    sub: 'Madurez',               crit: 'Tasa de fallos' },
];

export default function Checklist() {
  const { access, user } = useAuth();
  const [project, setProject] = useState({ name: '', client: '' });
  const [evaluator, setEvaluator] = useState({ name: '' });
  const [meta, setMeta] = useState({ date: new Date().toISOString().slice(0,10) });

  const [scores, setScores] = useState(
    CRITERIA.map(c => ({ characteristic: c.characteristic, subcharacteristic: c.sub, criterion: c.crit, score: 0, comment: '' }))
  );
  const [findings, setFindings] = useState([]);
  const [overall, setOverall] = useState({ overallScore: 0, notes: '' });
  const [busy, setBusy] = useState(false);

  const setScore = (i, k, v) => setScores(prev => prev.map((r, idx) => idx===i ? { ...r, [k]: v } : r));
  const addFinding = () => setFindings(p => [...p, { title:'', severity:'medium', status:'open', description:'' }]);
  const setFinding = (i, k, v) => setFindings(p => p.map((f, idx) => idx===i ? { ...f, [k]: v } : f));
  const removeFinding = (i) => setFindings(p => p.filter((_,idx)=> idx!==i));

  async function generatePDF() {
    setBusy(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports/pdf-from-payload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
        body: JSON.stringify({ project, evaluator, meta, scores, findings, summary: overall, requestedBy: user?.email }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), {
        href: url, download: `reporte_iso25010_${project.name || 'proyecto'}.pdf`
      });
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message || 'Error generando PDF');
    } finally { setBusy(false); }
  }

  // —— CSS embebido ——
  const styles = `
  .chk-wrap { max-width: 1080px; margin: 0 auto; padding: 22px 18px 40px; }
  .chk-title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; margin: 0 0 6px; }
  .chk-helper { color: #475569; line-height: 1.6; margin: 0 0 18px; }
  .chk-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
  @media (min-width: 900px){ .chk-grid { grid-template-columns: 1fr 1fr; } }
  .chk-wrap .card-section {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 28px rgba(15,23,42,0.06);
  }
  .chk-wrap .subtitle { font-size: 18px; font-weight: 700; color: #0f172a; }
  .chk-wrap .input, .chk-wrap .select, .chk-wrap .textarea {
    border-radius: 12px; border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 14px; width: 100%;
    transition: border-color 140ms ease, box-shadow 140ms ease; background: #fff;
  }
  .chk-wrap .input:focus, .chk-wrap .select:focus, .chk-wrap .textarea:focus {
    outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
  }
  .chk-wrap .label { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: inline-block; }
  .chk-wrap .table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .chk-wrap .table th, .chk-wrap .table td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; text-align: left; }
  .chk-wrap .table thead th { background: #f8fafc; font-weight: 700; color: #0f172a; }
  .chk-wrap .table tbody tr:hover { background: #f9fafb; }
  .chk-wrap .btn-primary, .chk-wrap .btn-ghost, .chk-wrap .btn-danger {
    display: inline-flex; align-items: center; gap: 8px; font-weight: 600; border-radius: 12px; padding: 10px 14px;
    cursor: pointer; border: 1px solid transparent; transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
  }
  .chk-wrap .btn-primary { background: #2563eb; color: #fff; }
  .chk-wrap .btn-primary:hover { background: #1d4ed8; box-shadow: 0 6px 18px rgba(37,99,235,.25); transform: translateY(-1px); }
  .chk-wrap .btn-primary[disabled] { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }
  .chk-findings-grid { display: grid; gap: 12px; grid-template-columns: 1fr; }
  @media (min-width: 900px){ .chk-findings-grid { grid-template-columns: 1fr 140px 140px; } }
  .chk-findings-row { border: 1px dashed #e2e8f0; border-radius: 12px; padding: 12px; background: #fff; }
  .chk-empty { color: #64748b; }
  .chk-summary-grid { display: grid; gap: 12px; grid-template-columns: 160px 1fr; }
  @media (max-width: 720px){ .chk-summary-grid { grid-template-columns: 1fr; } }
  `;

  return (
    <div className="chk-wrap">
      <style>{styles}</style>

      <h1 className="chk-title">Checklist ISO/IEC 25010</h1>
      <p className="chk-helper">
        Completa los datos del proyecto y registra puntajes por criterio (0–5). Añade hallazgos y genera el PDF de evaluación.
      </p>

      <div className="chk-grid">
        <div className="card-section">
          <div className="subtitle">Proyecto</div>
          <div className="mt-3" style={{ display: 'grid', gap: 12 }}>
            <div>
              <label className="label">Nombre</label>
              <input className="input" value={project.name} onChange={e=>setProject(p=>({ ...p, name: e.target.value }))}/>
            </div>
            <div>
              <label className="label">Cliente</label>
              <input className="input" value={project.client} onChange={e=>setProject(p=>({ ...p, client: e.target.value }))}/>
            </div>
          </div>
        </div>

        <div className="card-section">
          <div className="subtitle">Evaluación</div>
          <div className="mt-3" style={{ display: 'grid', gap: 12 }}>
            <div>
              <label className="label">Evaluador</label>
              <input className="input" value={evaluator.name} onChange={e=>setEvaluator({ name: e.target.value })}/>
            </div>
            <div>
              <label className="label">Fecha</label>
              <input type="date" className="input" value={meta.date} onChange={e=>setMeta({ date: e.target.value })}/>
            </div>
          </div>
        </div>
      </div>

      <div className="card-section" style={{ marginTop: 16 }}>
        <div className="subtitle">Criterios (0–5)</div>
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th style={{ width: 180 }}>Característica</th>
              <th style={{ width: 220 }}>Subcaracterística</th>
              <th>Criterio</th>
              <th style={{ width: 90 }}>Score</th>
              <th style={{ width: '34%' }}>Comentario</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((row, i) => (
              <tr key={i}>
                <td>{row.characteristic}</td>
                <td>{row.subcharacteristic}</td>
                <td>{row.criterion}</td>
                <td>
                  <select className="select" value={row.score}
                    onChange={e=>setScore(i,'score', Number(e.target.value))}>
                    {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </td>
                <td>
                  <input className="input" placeholder="Observaciones" value={row.comment}
                     onChange={e=>setScore(i,'comment', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-section" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="subtitle">Hallazgos</div>
          <button className="btn-ghost" onClick={addFinding}>Añadir hallazgo</button>
        </div>

        <div className="mt-4" style={{ display: 'grid', gap: 12 }}>
          {findings.length === 0 && <p className="chk-empty">Aún no has añadido hallazgos.</p>}

          {findings.map((f, i) => (
            <div key={i} className="chk-findings-row">
              <div className="chk-findings-grid">
                <input className="input" placeholder="Título"
                       value={f.title} onChange={e=>setFinding(i,'title', e.target.value)} />
                <select className="select" value={f.severity} onChange={e=>setFinding(i,'severity', e.target.value)}>
                  <option value="low">Bajo</option><option value="medium">Medio</option><option value="high">Alto</option>
                </select>
                <select className="select" value={f.status} onChange={e=>setFinding(i,'status', e.target.value)}>
                  <option value="open">Abierto</option><option value="in_review">En revisión</option><option value="closed">Cerrado</option>
                </select>
                <textarea className="textarea" placeholder="Descripción / evidencia"
                          value={f.description} onChange={e=>setFinding(i,'description', e.target.value)} />
                <div>
                  <button className="btn-danger" onClick={()=>removeFinding(i)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-section" style={{ marginTop: 16 }}>
        <div className="subtitle">Resumen</div>
        <div className="chk-summary-grid" style={{ marginTop: 12 }}>
          <div>
            <label className="label">Puntaje global (0–5)</label>
            <select className="select" value={overall.overallScore}
              onChange={e=>setOverall(o=>({ ...o, overallScore: Number(e.target.value) }))}>
              {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notas</label>
            <input className="input" value={overall.notes} onChange={e=>setOverall(o=>({ ...o, notes: e.target.value }))} />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="btn-primary" onClick={generatePDF} disabled={busy}>
            {busy ? 'Generando…' : 'Generar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
