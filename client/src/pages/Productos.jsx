import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Productos() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/products`)
      .then(r => r.json())
      .then(d => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);

  const styles = `
    .productos-wrap { max-width: 1080px; margin: 0 auto; padding: 32px 18px 48px; }
    .productos-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
    .productos-title { font-size:26px; font-weight:800; margin:0; color:#0f172a; }
    .btn-primary {
      background:#2563eb; color:#fff; font-weight:600; padding:10px 18px; border-radius:10px;
      border:none; cursor:pointer; transition:background .2s, transform .15s;
    }
    .btn-primary:hover { background:#1e40af; transform:translateY(-1px); }

    .productos-grid { display:grid; gap:16px; margin-top:22px; grid-template-columns:1fr; }
    @media(min-width:768px){ .productos-grid { grid-template-columns:1fr 1fr; } }

    .card {
      background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:20px 24px;
      box-shadow:0 1px 2px rgba(0,0,0,.04), 0 10px 28px rgba(15,23,42,.06);
      transition:border-color .15s, transform .15s, box-shadow .15s;
    }
    .card:hover { border-color:#cbd5e1; transform:translateY(-1px); }

    .card-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
    .card-name { font-weight:700; color:#0f172a; font-size:16px; }
    .card-desc { margin-top:4px; font-size:14px; color:#475569; line-height:1.5; }
    .card-price { font-size:18px; font-weight:800; color:#047857; white-space:nowrap; }

    .btn-ghost {
      margin-top:12px; background:transparent; border:1px solid #e2e8f0; border-radius:8px;
      padding:8px 14px; font-weight:600; cursor:pointer; transition:all .15s;
    }
    .btn-ghost:hover { background:#f8fafc; border-color:#cbd5e1; }
  `;

  return (
    <section className="productos-wrap">
      <style>{styles}</style>

      <header className="productos-header">
        <h2 className="productos-title">Productos</h2>
        <Link to="/Register" className="btn-primary">Probar ahora</Link>
      </header>

      <ul className="productos-grid">
        {items.map(p => (
          <li key={p.id} className="card">
            <div className="card-head">
              <div>
                <div className="card-name">{p.name}</div>
                {p.description && <p className="card-desc">{p.description}</p>}
              </div>
              {p.price != null && <div className="card-price">${p.price}</div>}
            </div>
            <button className="btn-ghost">Detalles</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
