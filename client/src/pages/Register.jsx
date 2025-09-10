import { useState } from 'react';
import { api } from '../lib/api';

export default function Register() {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault(); setMsg(''); setErr('');
    try {
      await api.register({ name, email, password });
      setMsg('Cuenta creada. Ahora inicia sesión.');
    } catch (e) { setErr(e.message || 'Error al registrar'); }
  }

  return (
    <section className="container max-w-md">
      <div className="card p-6 mt-8">
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <form className="space-y-3 mt-4" onSubmit={onSubmit}>
          <label className="label">Nombre</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} />

          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />

          <label className="label">Contraseña</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

          <button className="btn-primary w-full mt-2">Registrarme</button>
        </form>
        {msg && <p className="text-sm text-green-700 mt-3">{msg}</p>}
        {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
      </div>
    </section>
  );
}
