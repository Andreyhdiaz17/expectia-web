import { useAuth } from '../context/AuthContext';
import { downloadPdf } from '../lib/pdf';

export default function Reportes() {
  const { token, user } = useAuth();

  const onGenerate = async () => {
    const payload = {
      project:   { name: 'Proyecto Demo', client: 'ACME' },
      evaluator: { name: user?.name || user?.email || 'Evaluador' },
      meta:      { date: new Date().toISOString().slice(0,10) },
      scores:    [{ characteristic: 'Usabilidad', subcharacteristic: 'Operabilidad', criterion: 'Navegación', score: 4 }],
      findings:  [{ title: 'Contraste bajo', severity: 'low', status: 'open', description: 'Ajustar CSS' }],
      summary:   { overallScore: 4, notes: 'OK' }
    };

    try {
      await downloadPdf({
        url: `${import.meta.env.VITE_API_BASE_URL}/reports/pdf-from-payload`,
        payload,
        token,
        filename: 'reporte_iso25010.pdf',
      });
    } catch (e) {
      alert(`No se pudo generar el PDF: ${e.message}`);
    }
  };

  // —— CSS embebido ——
  const styles = `
  .rp-wrap { max-width: 800px; margin: 0 auto; padding: 24px 18px 40px; }
  .title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; margin: 0 0 10px; }
  .helper { color: #475569; line-height: 1.6; margin: 0 0 18px; }
  .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px;
          box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 10px 28px rgba(15,23,42,.06); }
  .subtitle { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:700;
         border-radius:12px; padding:10px 14px; border:1px solid #1d4ed8; background:#2563eb; color:#fff;
         cursor:pointer; transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease; }
  .btn:hover { background:#1d4ed8; border-color:#1e40af; box-shadow:0 6px 18px rgba(37,99,235,.25); transform: translateY(-1px); }
  ul.rp-list { margin: 10px 0 10px 20px; color:#334155; }
  `;

  return (
    <div className="rp-wrap">
      <style>{styles}</style>

      <h1 className="title">Reportes</h1>
      <p className="helper">
        Genera reportes finales de la auditoría de calidad de software según la norma <strong>ISO/IEC 25010</strong>.
        El informe incluye datos del proyecto, evaluador, puntajes por característica y hallazgos documentados.
      </p>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="subtitle">¿Qué incluye el reporte?</h2>
        <ul className="rp-list">
          <li>Datos del proyecto (nombre y cliente)</li>
          <li>Información del evaluador responsable</li>
          <li>Fecha de generación del informe</li>
          <li>Puntajes por característica, subcaracterística y criterio</li>
          <li>Hallazgos identificados con su severidad y estado</li>
          <li>Resumen con nota global y observaciones</li>
        </ul>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <p className="helper">Haz clic para generar un reporte de ejemplo en formato PDF.</p>
        <button onClick={onGenerate} className="btn">Generar PDF</button>
      </div>
    </div>
  );
}
