import { Link } from 'react-router-dom';

const features = [
  { t: 'Basado en ISO/IEC 25010', d: '8 características, subcaracterísticas y criterios claros.' },
  { t: 'Evaluaciones guiadas', d: 'Escala 0–5 con comentarios por criterio.' },
  { t: 'Indicadores visuales', d: 'Radar y barras por característica y total.' },
  { t: 'Informe PDF', d: 'Descarga un reporte con hallazgos y recomendaciones.' },
];

export default function Home() {
  const styles = `
  :root{
    --ink:#0f172a; --muted:#475569; --border:#e2e8f0; --bg:#f8fafc; --card:#ffffff;
    --g1:#2563eb; --g2:#4f46e5; --g3:#0ea5e9; --ring:#93c5fd;
  }
  *{box-sizing:border-box}
  body{background:var(--bg)}
  .home-wrap { max-width: 1200px; margin: 0 auto; padding: 24px 18px 80px; }

  /* ===== Navbar mejorado ===== */
  .header {
    position: sticky; top: 0; z-index: 30;
    background: rgba(255,255,255,.8); backdrop-filter: blur(8px);
    border: 1px solid var(--border); border-radius: 14px;
    padding: 10px 14px; margin-bottom: 14px;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
  }
  .logo { display:flex; align-items:center; gap:10px; font-weight:800; color:var(--ink) }
  .logo .logo-icon{font-size:20px}
  .logo .logo-subtitle{ font-size:11px; font-weight:700; color:#64748b; letter-spacing:.12em }
  .nav { display:flex; align-items:center; gap:10px; }
  .nav ul{ display:flex; gap:6px; list-style:none; margin:0; padding:0 }
  .nav a, .nav button, .nav li{
    font-size:14px; color:#1f2937; font-weight:700;
    padding:8px 12px; border-radius:999px; border:1px solid transparent; cursor:pointer;
  }
  .nav li:hover{ background:#f1f5f9; border-color:var(--border) }
  .nav .nav-login {
    border:1px solid var(--border);
    background:linear-gradient(135deg,#eef2ff,#eff6ff);
  }
  .nav .nav-login:hover{
    box-shadow:0 0 0 3px var(--ring);
  }

  /* ===== HERO (sin botones de CTA) ===== */
  .hero {
    position: relative; overflow: hidden; border-radius: 18px; color: #fff;
    border: 1px solid var(--border);
    box-shadow: 0 10px 28px rgba(15,23,42,.06), 0 1px 2px rgba(0,0,0,.04);
    margin-top:16px;
  }
  .hero-bg { position:absolute; inset:0; background:linear-gradient(135deg,var(--g1) 0%, var(--g2) 50%, var(--g3) 100%); opacity:.95; }
  .hero-content { position:relative; padding: 34px 28px 8px; }
  .hero-title { font-size: 36px; font-weight: 900; letter-spacing: -.02em; margin: 0 0 10px; }
  .hero-p { margin: 0 0 18px; opacity: .95; max-width: 760px; line-height: 1.6; }
  .hero-extras { position:relative; padding: 0 28px 28px; }
  .hero-grid { display:grid; grid-template-columns: 1fr; gap:16px; }
  @media (min-width: 900px){ .hero-grid { grid-template-columns: 1.2fr .8fr; } }

  .ai-badges { display:flex; gap:10px; flex-wrap:wrap; margin-top:8px; }
  .ai-badge { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:700;
              padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.3); }

  .ai-features { display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }
  .ai-feature { display:flex; gap:8px; align-items:center; padding:8px 10px; border-radius:12px;
                background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.25); }

  .hero-metrics { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:10px; margin-top:14px; }
  .metric { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.25); border-radius:14px; padding:12px; text-align:center; }
  .metric-number { font-weight:800; font-size:20px; }
  .metric-label { opacity:.9; font-size:12px; }

  .hero-visual { display:flex; align-items:center; justify-content:center; }
  .ai-dashboard { width:100%; background:#0b1220; border:1px solid #1f2a44; border-radius:16px; padding:14px; color:#e2e8f0; box-shadow: inset 0 0 0 1px rgba(255,255,255,.03); }
  .dashboard-header { display:flex; align-items:center; gap:8px; font-weight:700; font-size:12px; margin-bottom:12px; }
  .status-indicator{ width:8px; height:8px; border-radius:999px; background:#10b981; box-shadow:0 0 0 4px rgba(16,185,129,.18) }
  .ai-metrics-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .ai-metric{ display:flex; gap:10px; align-items:center; background:#0f172a; border:1px solid #22304f; border-radius:12px; padding:10px; }
  .ai-metric.active{ border-color:#3b82f6 }
  .metric-icon{ font-size:18px }
  .metric-data{ display:flex; flex-direction:column; line-height:1.1 }
  .metric-value{ font-weight:800 }
  .metric-desc{ font-size:11px; color:#94a3b8 }
  .ai-visual-scan{ position:relative; height:90px; margin-top:12px; background:linear-gradient(180deg, rgba(59,130,246,.12), transparent);
                   border:1px dashed #334155; border-radius:12px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .scan-line{ position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, #60a5fa, transparent);
              animation:scan 2.2s linear infinite; }
  .scan-text{ font-size:12px; color:#cbd5e1 }
  @keyframes scan { 0%{ transform: translateY(0)} 100%{ transform: translateY(90px)} }

  /* ===== Secciones ===== */
  .section { margin-top: 48px; }
  .section-title { font-size: 22px; font-weight: 900; color: var(--ink); margin: 0 0 14px; }
  .grid { display:grid; gap: 12px; grid-template-columns: 1fr; }
  @media (min-width: 640px){ .grid { grid-template-columns: 1fr 1fr; } }

  .card {
    background:var(--card); border:1px solid var(--border); border-radius:16px; padding:18px 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 10px 28px rgba(15,23,42,.06);
    transition: border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
  }
  .card:hover { border-color:#cbd5e1; transform: translateY(-1px); }
  .card h3 { margin:0; font-size:15px; font-weight:800; color:var(--ink); }
  .card p { margin:6px 0 0; color:var(--muted); line-height:1.6; }

  /* Rejillas y bloques extra (IA Solutions / Benefits / etc.) */
  .section-header{ text-align:center; margin-bottom:18px }
  .section-header .section-badge{ display:inline-flex; gap:8px; align-items:center; font-size:11px; font-weight:800;
                                  letter-spacing:.12em; padding:6px 10px; border-radius:999px; color:#1e293b;
                                  background:#e0e7ff; border:1px solid #c7d2fe; }

  .ai-solutions-grid{ display:grid; gap:12px; grid-template-columns:1fr; }
  @media (min-width: 900px){ .ai-solutions-grid{ grid-template-columns:1.2fr 1fr 1fr 1fr; } }
  .ai-solution-card{ background:#fff; border:1px solid var(--border); border-radius:16px; padding:16px }
  .ai-solution-card.featured{ border-color:#c7d2fe; box-shadow:0 10px 24px rgba(99,102,241,.08) }
  .ai-solution-card .card-header{ display:flex; align-items:center; gap:10px; margin-bottom:6px }
  .solution-icon{ font-size:18px }
  .solution-badge{ margin-left:auto; font-size:11px; font-weight:800; color:#3730a3; background:#eef2ff; border:1px solid #c7d2fe; border-radius:999px; padding:4px 8px }
  .solution-features{ display:flex; flex-wrap:wrap; gap:6px; margin-top:8px }
  .solution-features .feature{ font-size:12px; background:#f8fafc; border:1px dashed var(--border); border-radius:999px; padding:6px 8px }
  .solution-metrics{ display:flex; gap:8px; margin-top:10px }
  .solution-metric{ font-size:12px; font-weight:800; background:#ecfeff; color:#0369a1; border:1px solid #bae6fd; border-radius:999px; padding:6px 8px }

  .benefits-grid{ display:grid; gap:12px; grid-template-columns:1fr; }
  @media (min-width: 800px){ .benefits-grid{ grid-template-columns:repeat(4, 1fr); } }
  .benefit-item{ background:#fff; border:1px solid var(--border); border-radius:16px; padding:16px }

  .industry-cards{ display:grid; gap:12px; grid-template-columns:1fr; }
  @media (min-width: 900px){ .industry-cards{ grid-template-columns:repeat(4, 1fr); } }
  .industry-card{ background:#fff; border:1px solid var(--border); border-radius:16px; padding:16px }

  .stats-grid{ display:grid; gap:12px; grid-template-columns:1fr; }
  @media (min-width: 800px){ .stats-grid{ grid-template-columns:repeat(4, 1fr); } }
  .stat-item{ background:#fff; border:1px solid var(--border); border-radius:16px; padding:16px; text-align:center }
  .stat-number{ font-size:22px; font-weight:800; color:#111827 }

  .cta{ background:linear-gradient(135deg, #f0f9ff, #eef2ff); border:1px solid #dbeafe; border-radius:18px; padding:22px; text-align:center }

  .footer{ margin-top:36px; }
  .footer .container{ background:#fff; border:1px solid var(--border); border-radius:18px; padding:18px }
  .footer-content{ display:grid; gap:14px; grid-template-columns:1fr; }
  @media (min-width: 900px){ .footer-content{ grid-template-columns: 1.2fr .8fr .8fr .9fr; } }
  .footer-bottom{ display:flex; flex-direction:column; gap:8px; align-items:center; justify-content:center; margin-top:12px; padding-top:12px; border-top:1px solid var(--border); color:#475569 }
  `;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className="home-wrap">
      <style>{styles}</style>

      {/* NAVBAR (sin Consultoría / Acceso Cliente) + botón Iniciar sesión */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🤖</span>
          INSPECTIA <span className="logo-subtitle">AI ENTERPRISE</span>
        </div>
        <nav className="nav">
          <ul>
            <li onClick={() => scrollTo('ia-solutions')}>IA Solutions</li>
            <li onClick={() => scrollTo('industries')}>Industrias</li>
            <li onClick={() => scrollTo('benefits')}>Beneficios</li>
            <li onClick={() => scrollTo('stats')}>Resultados</li>
            <li onClick={() => scrollTo('contact')}>Contacto</li>
          </ul>
          <Link to="/Login" className="nav-login">Iniciar sesión</Link>
        </nav>
      </header>

      {/* HERO (sin “Comenzar gratis” ni “Ver productos”) */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1 className="hero-title">Expectia Web / Auditoría de Calidad de Software</h1>
          <p className="hero-p">
            Evalúa proyectos con el estándar ISO/IEC 25010. Registra evidencias, calcula puntajes
            y exporta reportes en PDF con hallazgos y recomendaciones.
          </p>
        </div>

        {/* Extras visuales conservados */}
        <div className="hero-extras">
          <div className="ai-badges">
            <span className="ai-badge">🧠 IA EMPRESARIAL</span>
            <span className="ai-badge">⚙️ AUTOMATIZACIÓN</span>
            <span className="ai-badge">🔒 COMPLIANCE</span>
          </div>

          <div className="hero-grid">
            <div>
              <div className="ai-features">
                <div className="ai-feature"><span>🎯</span><span>Detección Inteligente</span></div>
                <div className="ai-feature"><span>📊</span><span>Análisis Predictivo</span></div>
                <div className="ai-feature"><span>⚡</span><span>Tiempo Real</span></div>
              </div>

              <div className="hero-metrics">
                <div className="metric"><span className="metric-number">99.2%</span><div className="metric-label">Precisión IA</div></div>
                <div className="metric"><span className="metric-number">85%</span><div className="metric-label">Ahorro Costos</div></div>
                <div className="metric"><span className="metric-number">24/7</span><div className="metric-label">Monitoreo IA</div></div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="ai-dashboard">
                <div className="dashboard-header">
                  <span className="status-indicator"></span>
                  <span className="dashboard-title">IA Dashboard - Live</span>
                </div>
                <div className="ai-metrics-grid">
                  <div className="ai-metric active">
                    <span className="metric-icon">🧠</span>
                    <div className="metric-data">
                      <span className="metric-value">98.7%</span>
                      <span className="metric-desc">Precisión IA</span>
                    </div>
                  </div>
                  <div className="ai-metric">
                    <span className="metric-icon">👁️</span>
                    <div className="metric-data">
                      <span className="metric-value">1,247</span>
                      <span className="metric-desc">Defectos Detectados</span>
                    </div>
                  </div>
                  <div className="ai-metric">
                    <span className="metric-icon">⚡</span>
                    <div className="metric-data">
                      <span className="metric-value">0.3s</span>
                      <span className="metric-desc">Tiempo Proceso</span>
                    </div>
                  </div>
                  <div className="ai-metric">
                    <span className="metric-icon">📈</span>
                    <div className="metric-data">
                      <span className="metric-value">+47%</span>
                      <span className="metric-desc">Eficiencia</span>
                    </div>
                  </div>
                </div>
                <div className="ai-visual-scan">
                  <div className="scan-line"></div>
                  <span className="scan-text">🔍 Servicio en ejecución</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? (se mantiene la lógica del mapeo) */}
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

      {/* Resto de secciones (IA Solutions, Benefits, Industries, Stats, CTA, Footer) — idénticas visualmente */}
      <section className="section ai-solutions" id="ia-solutions">
        <div className="section-header">
          <div className="section-badge"><span>🤖</span><span>TECNOLOGÍA IA AVANZADA</span></div>
          <h2>Soluciones de Inteligencia Artificial Empresarial</h2>
          <p>Algoritmos de última generación que aprenden y se adaptan a sus necesidades específicas.</p>
        </div>
        <div className="ai-solutions-grid">
          <div className="ai-solution-card featured">
            <div className="card-header">
              <span className="solution-icon">🧠</span><h3>Deep Learning Vision</h3>
              <span className="solution-badge">FLAGSHIP</span>
            </div>
            <p>Redes neuronales profundas que identifican defectos microscópicos con precisión superhumana.</p>
            <div className="solution-features">
              <div className="feature">✓ CNN Optimizadas</div>
              <div className="feature">✓ Transfer Learning</div>
              <div className="feature">✓ Detección Multi-clase</div>
            </div>
            <div className="solution-metrics">
              <span className="solution-metric">99.4% Precisión</span>
              <span className="solution-metric">0.2s Respuesta</span>
            </div>
          </div>
          <div className="ai-solution-card">
            <div className="card-header"><span className="solution-icon">📊</span><h3>Predictive Analytics</h3></div>
            <p>Algoritmos predictivos que anticipan fallos antes de que ocurran.</p>
            <div className="solution-features">
              <div className="feature">✓ Machine Learning</div>
              <div className="feature">✓ Análisis Temporal</div>
              <div className="feature">✓ Alertas Inteligentes</div>
            </div>
          </div>
          <div className="ai-solution-card">
            <div className="card-header"><span className="solution-icon">⚡</span><h3>Real-time Processing</h3></div>
            <p>Procesamiento en tiempo real con capacidad de edge computing.</p>
            <div className="solution-features">
              <div className="feature">✓ Edge AI</div>
              <div className="feature">✓ GPU Acelerado</div>
              <div className="feature">✓ Streaming Analytics</div>
            </div>
          </div>
          <div className="ai-solution-card">
            <div className="card-header"><span className="solution-icon">🎯</span><h3>Auto-Optimization</h3></div>
            <p>Sistemas que se auto-optimizan basándose en patrones de uso.</p>
            <div className="solution-features">
              <div className="feature">✓ AutoML</div>
              <div className="feature">✓ Hyperparameter Tuning</div>
              <div className="feature">✓ Continuous Learning</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section benefits" id="benefits">
        <div className="section-header">
          <h2>Ventajas Competitivas con IA</h2>
          <p>Resultados medibles que transforman su operación empresarial.</p>
        </div>
        <div className="benefits-grid">
          <div className="benefit-item"><h3>🚀 Eficiencia Multiplicada</h3><p>Procesos 1000x más rápidos, 24/7 sin fatiga.</p></div>
          <div className="benefit-item"><h3>💎 Precisión Superhuman</h3><p>Defectos imperceptibles al ojo humano.</p></div>
          <div className="benefit-item"><h3>🧠 Aprendizaje Continuo</h3><p>Mejora automática con cada inspección.</p></div>
          <div className="benefit-item"><h3>💰 ROI Inteligente</h3><p>Menos desperdicio y retrabajo.</p></div>
        </div>
      </section>

      <section className="section industries" id="industries">
        <div className="section-header">
          <h2>IA Especializada por Industria</h2>
          <p>Algoritmos entrenados para cada sector.</p>
        </div>
        <div className="industry-cards">
          <div className="industry-card"><h3>🏭 Manufactura Inteligente</h3><ul><li>Detección de defectos</li><li>Fallas de maquinaria</li><li>Optimización</li></ul></div>
          <div className="industry-card"><h3>🔬 Farmacéutica IA</h3><ul><li>Validación automática</li><li>Trazabilidad</li><li>Compliance</li></ul></div>
          <div className="industry-card"><h3>🍽️ Food-Tech IA</h3><ul><li>Contaminantes</li><li>Análisis espectral</li><li>Vida útil</li></ul></div>
          <div className="industry-card"><h3>🚗 Automotriz 4.0</h3><ul><li>Inspección 3D</li><li>Control de soldaduras</li><li>Mantenimiento predictivo</li></ul></div>
        </div>
      </section>

      <section className="section stats" id="stats">
        <div className="section-header">
          <h2>Resultados Comprobados de IA</h2>
          <p>Métricas reales de nuestros sistemas de inteligencia artificial.</p>
        </div>
        <div className="stats-grid">
          <div className="stat-item"><span className="stat-number">$5.2M+</span><div>Ahorros anuales</div></div>
          <div className="stat-item"><span className="stat-number">2.5M+</span><div>Inspecciones/mes</div></div>
          <div className="stat-item"><span className="stat-number">99.8%</span><div>Uptime</div></div>
          <div className="stat-item"><span className="stat-number">500+</span><div>Empresas</div></div>
        </div>
      </section>

      <section className="section cta" id="contact">
        <h2>¿Listo para la Revolución IA?</h2>
        <p>Únase a las empresas que ya transformaron sus procesos con nuestra IA empresarial.</p>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <strong>INSPECTIA <span className="logo-subtitle">AI ENTERPRISE</span></strong>
              <p>Soluciones de IA para la industria 4.0.</p>
            </div>
            <div><strong>Soluciones IA</strong><div>Vision • Predictive • Edge</div></div>
            <div><strong>Industrias</strong><div>Manufactura • Pharma • Food • Auto</div></div>
            <div><strong>Contacto</strong><div>📧 donovanherrera1317@gmail.com</div></div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 INSPECTIA AI Enterprise.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
