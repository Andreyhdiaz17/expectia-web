import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Proyectos() {
  // (LÓGICA ORIGINAL)
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  // Cargar proyectos (LÓGICA ORIGINAL)
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoadingList(true);
      setErr("");
      try {
        const d = await api.get("/projects", { token });
        setItems(d?.items || []);
      } catch (e) {
        setErr("No se pudo cargar la lista de proyectos.");
      } finally {
        setLoadingList(false);
      }
    })();
  }, [token]);

  // Crear proyecto (LÓGICA ORIGINAL)
  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");

    const trimmed = (name || "").trim();
    if (!trimmed) {
      setErr("El nombre es requerido.");
      return;
    }

    setCreating(true);
    try {
      const res = await api.post("/projects", { name: trimmed }, { token });
      if (!res?.item) throw new Error("Respuesta inválida del servidor.");
      setItems(prev => [res.item, ...prev]); // prepend
      setName("");
      setOk("Proyecto creado correctamente.");
    } catch (e) {
      const msg = e?.message || "Error al crear proyecto.";
      setErr(msg.includes("401") ? "Sesión vencida o token inválido." : msg);
    } finally {
      setCreating(false);
    }
  };

  // —— CSS embebido (solo estilos; la lógica queda intacta) ——
  const styles = `
  .proj-wrap { max-width: 1000px; margin: 0 auto; padding: 24px 18px 40px; }
  .proj-title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; margin: 0 0 6px; }
  .proj-helper { color: #475569; margin: 0 0 16px; line-height: 1.6; }

  .proj-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 10px 28px rgba(15,23,42,.06);
    transition: border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
  }
  .proj-card:hover { border-color: #cbd5e1; transform: translateY(-1px); }

  .proj-label { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: inline-block; }
  .proj-input {
    width: 100%; font-size: 14px; border-radius: 12px; background: #fff;
    border: 1px solid #cbd5e1; padding: 10px 12px; transition: border-color 140ms ease, box-shadow 140ms ease;
  }
  .proj-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15); }

  .proj-actions { display: flex; gap: 8px; align-items: center; }
  .proj-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:700;
    border-radius:12px; padding:10px 14px; cursor:pointer; transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
  }
  .proj-btn.primary { background:#2563eb; color:#fff; border:1px solid #1d4ed8; }
  .proj-btn.primary:hover { background:#1d4ed8; border-color:#1e40af; box-shadow:0 6px 18px rgba(37,99,235,.25); transform: translateY(-1px); }
  .proj-btn.ghost { background:#fff; color:#0f172a; border:1px solid #e2e8f0; }
  .proj-btn.ghost:hover { background:#f8fafc; transform: translateY(-1px); }
  .proj-btn[disabled] { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }

  .proj-note-ok { color:#065f46; margin-top:8px; }
  .proj-note-err { color:#b91c1c; margin-top:8px; }

  .proj-table { width:100%; border-collapse: collapse; margin-top: 8px; font-size:14px; }
  .proj-table th, .proj-table td { border-bottom:1px solid #e2e8f0; padding: 10px 8px; text-align:left; }
  .proj-table thead th { background:#f8fafc; font-weight:700; color:#0f172a; }
  .proj-empty { color:#64748b; }
  `;

  return (
    <div className="container proj-wrap">
      <style>{styles}</style>

      <h1 className="proj-title">Proyectos</h1>
      <p className="proj-helper">Crea proyectos y revísalos en la lista. El más reciente aparece primero.</p>

      {/* Formulario (estructura y handlers originales) */}
      <div className="proj-card" style={{ marginTop: 12, maxWidth: 520 }}>
        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <div>
            <label className="proj-label">Nombre del proyecto *</label>
            <input
              className="proj-input"
              value={name}
              onChange={e=>setName(e.target.value)}
              placeholder="Ej. Auditoría Web ACME"
            />
          </div>

          <div className="proj-actions">
            <button className="proj-btn primary" disabled={creating || !name.trim()}>
              {creating ? "Creando…" : "Crear proyecto"}
            </button>
            <button
              type="button"
              className="proj-btn ghost"
              onClick={() => { setName(""); setErr(""); setOk(""); }}
              disabled={creating}
            >
              Limpiar
            </button>
          </div>

          {ok && <div className="proj-note-ok">{ok}</div>}
          {err && <div className="proj-note-err">{err}</div>}
        </form>
      </div>

      {/* Lista (estructura original) */}
      <div className="proj-card" style={{ marginTop: 12 }}>
        <div className="subtitle" style={{ marginBottom: 8, fontWeight: 700, color: '#0f172a' }}>Lista</div>
        {loadingList ? (
          <div className="proj-empty">Cargando proyectos…</div>
        ) : items.length === 0 ? (
          <div className="proj-empty">Aún no hay proyectos.</div>
        ) : (
          <table className="proj-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th style={{ width: 150 }}>ID</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
