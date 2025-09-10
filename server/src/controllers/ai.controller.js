export async function classifyMock(req, res) {
  const rnd = Math.random();
  const label = rnd > 0.66 ? 'No conformidad' : rnd > 0.33 ? 'Observación' : 'Mejora';
  const score = Math.round(60 + rnd * 40);
  return res.json({ label, score, reasons: ['Borde difuso', 'Contraste bajo'] });
}
