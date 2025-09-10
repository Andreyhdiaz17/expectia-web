// server/src/controllers/reports.controller.js
import PDFDocument from 'pdfkit';

function h1(doc, t){ doc.fontSize(18).text(t,{underline:true}); doc.moveDown(0.5); }
function h2(doc, t){ doc.fontSize(14).text(t); doc.moveDown(0.3); }
function p (doc, t){ doc.fontSize(11).fillColor('#111').text(t); }
function small(doc,t){ doc.fontSize(9).fillColor('#444').text(t); }

export async function pdfFromPayload(req, res, next) {
  try {
    const {
      project = {}, evaluator = {}, meta = {},
      scores = [], findings = [], summary = {}
    } = req.body || {};

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="reporte_iso25010.pdf"');

    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    // manejar errores de stream
    doc.on('error', next);

    doc.pipe(res);

    h1(doc, 'Informe de Auditoría - ISO/IEC 25010');
    p(doc, `Proyecto: ${project.name || '-'}`);
    p(doc, `Cliente: ${project.client || '-'}`);
    p(doc, `Evaluador: ${evaluator.name || '-'}`);
    p(doc, `Fecha: ${meta.date || new Date().toLocaleDateString()}`);
    doc.moveDown();

    if (summary?.overallScore != null) {
      h2(doc, `Puntaje global: ${summary.overallScore}/5`);
      if (summary?.notes) small(doc, `Notas: ${summary.notes}`);
      doc.moveDown();
    }

    h2(doc, 'Resultados por característica');
    if (!scores.length) small(doc, 'No se registraron puntuaciones.');
    let current = '';
    for (const s of scores) {
      if (s.characteristic !== current) {
        doc.moveDown(0.3);
        p(doc, `• ${s.characteristic}`);
        current = s.characteristic;
      }
      small(doc, `   - ${s.subcharacteristic} / ${s.criterion}: ${s.score}/5`);
      if (s.comment) small(doc, `     comentario: ${s.comment}`);
    }
    doc.moveDown();

    h2(doc, 'Hallazgos');
    if (!findings.length) small(doc, 'No se registraron hallazgos.');
    findings.forEach((f, i) => {
      p(doc, `${i+1}. ${f.title} [${f.severity||'medium'}] (${f.status||'open'})`);
      if (f.description) small(doc, `   ${f.description}`);
      doc.moveDown(0.2);
    });

    doc.moveDown();
    small(doc, 'Generado automáticamente por el módulo de auditoría.');

    doc.end(); // 🔚 importante
  } catch (e) {
    next(e);
  }
}
