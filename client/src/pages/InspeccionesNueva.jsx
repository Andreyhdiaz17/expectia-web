import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function InspeccionesNueva() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ projectId: '', title: '', scope: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/projects', { token }).then(d => setProjects(d.items || []));
  }, [token]);

  const on = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/inspections', form, { token });
      setMsg(`Inspección creada con ID ${res.item.id}`);
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }
  };

  return (
    <section>
      <h2 className="h2">Nueva inspección</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={submit} className="card" style={{ maxWidth: 600 }}>
        <label>Proyecto<br/>
          <select value={form.projectId} onChange={on('projectId')} required>
            <option value="">Seleccione...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label><br/>
        <label>Título<br/>
          <input value={form.title} onChange={on('title')} required />
        </label><br/>
        <label>Alcance<br/>
          <textarea value={form.scope} onChange={on('scope')} />
        </label><br/>
        <button className="link" style={{ border:'1px solid #e2e8f0' }}>Crear</button>
      </form>
    </section>
  );
}
