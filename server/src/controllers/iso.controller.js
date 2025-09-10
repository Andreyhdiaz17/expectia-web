export async function getCatalog(_req, res) {
  const items = [
    { key: 'functional_suitability', name: 'Adecuación Funcional' },
    { key: 'performance_efficiency', name: 'Eficiencia de Desempeño' },
    { key: 'compatibility',          name: 'Compatibilidad' },
    { key: 'usability',              name: 'Usabilidad' },
    { key: 'reliability',            name: 'Fiabilidad' },
    { key: 'security',               name: 'Seguridad' },
    { key: 'maintainability',        name: 'Mantenibilidad' },
    { key: 'portability',            name: 'Portabilidad' },
  ];
  res.json({ items });
}
