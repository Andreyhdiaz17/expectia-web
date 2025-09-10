import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      window.location.href = '/Dashboard';
    } catch (e) { setErr(e.message || 'Error al iniciar sesión'); }
  }

  return (
    <section className="container max-w-md">
      <div className="card p-6 mt-8">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <form className="space-y-3 mt-4" onSubmit={onSubmit}>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />

          <label className="label">Contraseña</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

          <button className="btn-primary w-full mt-2">Entrar</button>
        </form>
        {err && <p className="text-sm text-red-600 mt-3">{err}</p>}
      </div>
    </section>
  );
}
