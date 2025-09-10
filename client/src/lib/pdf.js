
export async function downloadPdf({ url, payload, token, filename = 'reporte.pdf' }) {
  console.log('[PDF] token que envío =>', token); 
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}), //  header
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
 
    let msg = `HTTP ${res.status}`;
    try { const data = await res.json(); msg = data?.error || msg; } catch {}
    throw new Error(msg);
  }

  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  window.open(href, '_blank', 'noopener'); 
}
