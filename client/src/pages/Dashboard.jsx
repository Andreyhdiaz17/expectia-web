export default function Dashboard() {
  // ——— CSS embebido (solo estilos) ———
  const styles = `
  .dash-container { max-width: 980px; margin: 0 auto; padding: 24px 20px 40px; }
  .dash-title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; color: #0f172a; }
  .dash-helper { color: #475569; margin: 0 0 18px; line-height: 1.6; }
  .dash-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
  @media (min-width: 768px){ .dash-grid { grid-template-columns: repeat(3, 1fr); } }
  .dash-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(15,23,42,.06);
    transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
  }
  .dash-card:hover { transform: translateY(-2px); border-color: #cbd5e1; box-shadow: 0 4px 10px rgba(0,0,0,.06), 0 16px 40px rgba(15,23,42,.10); }
  .dash-card-title { font-weight: 700; color: #0f172a; }
  .dash-metric { font-size: 36px; font-weight: 800; margin-top: 6px; color: #0f172a; letter-spacing: -0.02em; }
  .dash-note { margin-top: 8px; font-size: 13px; color: #64748b; }
  .dash-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px; margin-top: 18px; }
  .dash-subtitle { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
  .dash-list { margin: 10px 0 0 18px; color: #334155; line-height: 1.6; }
  .dash-list li { margin-bottom: 6px; }
  `;

  return (
    <div className="dash-container">
      <style>{styles}</style>

      <h1 className="dash-title">Panel de Control</h1>
      <p className="dash-helper">
        Bienvenido al panel principal del sistema de auditoría ISO/IEC 25010. Aquí verás un resumen de tus actividades.
      </p>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-title">Auditorías en curso</div>
          <div className="dash-metric">0</div>
          <div className="dash-note">Cantidad de auditorías activas actualmente.</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Hallazgos abiertos</div>
          <div className="dash-metric">0</div>
          <div className="dash-note">Hallazgos reportados que aún no han sido resueltos.</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Último reporte</div>
          <div className="dash-note">Genera tu primer PDF para visualizarlo aquí.</div>
        </div>
      </div>

      <div className="dash-section">
        <h2 className="dash-subtitle">¿Cómo usar el panel?</h2>
        <ul className="dash-list">
          <li>Revisa las auditorías en curso para seguir el estado del proyecto.</li>
          <li>Prioriza la corrección de los hallazgos abiertos.</li>
          <li>Genera y comparte el reporte en PDF con los interesados.</li>
        </ul>
      </div>
    </div>
  );
}
