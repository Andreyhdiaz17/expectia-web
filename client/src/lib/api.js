
const BASE = import.meta.env.VITE_API_BASE_URL; 

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });


  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = (data && data.error) ? data.error : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data ?? {};
}

//  Helpers genéricos que usa Proyectos.jsx
export const api = {
  get:   (path, { token } = {})           => request(path, { method: 'GET', token }),
  post:  (path, body, { token } = {})     => request(path, { method: 'POST', body, token }),
  patch: (path, body, { token } = {})     => request(path, { method: 'PATCH', body, token }),
  del:   (path, { token } = {})           => request(path, { method: 'DELETE', token }),

  
  register: (d)  => request('/auth/register', { method: 'POST', body: d }),
  login:    (d)  => request('/auth/login',    { method: 'POST', body: d }),
  me:       (t)  => request('/auth/me',       { token: t }),
  refresh:  (rt) => request('/auth/refresh',  { method: 'POST', body: { token: rt } }),

  
  products: ()    => request('/products'),
  audits:   (t)   => request('/audits', { token: t }),
};
