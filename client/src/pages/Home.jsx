import { Link } from 'react-router-dom';

const features = [
  { t: 'Basado en ISO/IEC 25010', d: '8 características, subcaracterísticas y criterios claros.' },
  { t: 'Evaluaciones guiadas', d: 'Escala 0–5 con comentarios por criterio.' },
  { t: 'Indicadores visuales', d: 'Radar y barras por característica y total.' },
  { t: 'Informe PDF', d: 'Descarga un reporte con hallazgos y recomendaciones.' },
];

export default function Home() {
  const styles = `
  .home-wrap { max-width: 1080px; margin: 0 auto; padding: 24px 18px 48px; }
  .hero {
    position: relative; overflow: hidden; border-radius: 18px; color: #fff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 10px 28px rgba(15,23,42,.06), 0 1px 2px rgba(0,0,0,.04);
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg,#2563eb 0%, #4f46e5 50%, #0ea5e9 100%);
    opacity: .92;
  }
  .hero-content { position: relative; padding: 34px 28px 28px; }
  .hero-title { font-size: 34px; font-weight: 800; letter-spacing: -.02em; margin: 0 0 8px; }
  .hero-p { margin: 0; opacity: .95; max-width: 760px; line-height: 1.6; }
  .hero-actions { display:flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }

  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px;
         font-weight:700; border-radius:12px; padding:10px 16px; cursor:pointer;
         transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease; }
  .btn.primary { background:#ffffff; color:#0f172a; border:1px solid #e2e8f0; }
  .btn.primary:hover { transform: translateY(-1px); box-shadow:0 10px 24px rgba(255,255,255,.15); }
  .btn.ghost   { background:transparent; color:#ffffff; border:1px solid rgba(255,255,255,.55); }
  .btn.ghost:hover { background: rgba(255,255,255,.08); transform: translateY(-1px); }

  .section { margin-top: 36px; }
  .section-title { font-size: 20px; font-weight: 800; color:#0f172a; margin: 0 0 14px; }
  .grid { display:grid; gap: 12px; grid-template-columns: 1fr; }
  @media (min-width: 640px){ .grid { grid-template-columns: 1fr 1fr; } }

  .card {
    background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:18px 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 10px 28px rgba(15,23,42,.06);
    transition: border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
  }
  .card:hover { border-color:#cbd5e1; transform: translateY(-1px); }
  .card h3 { margin:0; font-size:15px; font-weight:700; color:#0f172a; }
  .card p { margin:6px 0 0; color:#475569; line-height:1.6; }
  `;

  return (
    <div className="home-wrap">
      <style>{styles}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1 className="hero-title">Expectia Web / Auditoría de Calidad de Software</h1>
          <p className="hero-p">
            Evalúa proyectos con el estándar ISO/IEC 25010. Registra evidencias, calcula puntajes
            y exporta reportes en PDF con hallazgos y recomendaciones.
          </p>
          <div className="hero-actions">
            <Link to="/Register" className="btn primary">Comenzar gratis</Link>
            <Link to="/Productos" className="btn ghost">Ver productos</Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="grid">
          {features.map(f => (
            <div key={f.t} className="card">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
