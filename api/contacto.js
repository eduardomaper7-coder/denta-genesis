/*
 * Denta Genesis — envío del formulario de cita
 * Función de Vercel: POST /api/contacto
 *
 * Variables de entorno (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY   (obligatoria) clave de https://resend.com
 *   MAIL_TO          (opcional) destino. Por defecto info@dentagenesis.es
 *   MAIL_FROM        (opcional) remitente. Por defecto "Web Denta Genesis <web@dentagenesis.es>"
 *                    (el dominio dentagenesis.es debe estar verificado en Resend)
 *   SUPABASE_URL + SUPABASE_KEY  (opcionales) si existen, cada solicitud se guarda
 *                    también en la tabla "solicitudes" como copia de seguridad.
 */

const MAX = { nombre: 120, telefono: 40, email: 160, tratamiento: 80, mensaje: 2000 };
const ORIGENES = ["https://dentagenesis.es", "https://www.dentagenesis.es"];

function limpiar(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B-\u001F]/g, "").trim().slice(0, max);
}
function esc(s) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function enviarEmail(d) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Falta RESEND_API_KEY");
  const filas = [["Nombre", d.nombre], ["Teléfono", d.telefono], ["Email", d.email || "-"],
    ["Tratamiento", d.tratamiento || "-"], ["Mensaje", d.mensaje || "-"]]
    .map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f1f7f5;font-weight:600;vertical-align:top">${k}</td><td style="padding:8px 12px;white-space:pre-wrap">${esc(v)}</td></tr>`).join("");
  const tel = d.telefono.replace(/[^\d+]/g, "");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#072a24">
    <h2 style="margin:0 0 12px">Nueva solicitud de cita desde la web</h2>
    <table style="border-collapse:collapse;border:1px solid #d8e6e1">${filas}</table>
    <p style="margin-top:16px"><a href="tel:${esc(tel)}">Llamar a ${esc(d.nombre)}</a></p></div>`;
  const texto = `Nueva solicitud de cita\n\nNombre: ${d.nombre}\nTeléfono: ${d.telefono}\nEmail: ${d.email || "-"}\nTratamiento: ${d.tratamiento || "-"}\nMensaje: ${d.mensaje || "-"}`;

  const body = {
    from: process.env.MAIL_FROM || "Web Denta Genesis <web@dentagenesis.es>",
    to: (process.env.MAIL_TO || "info@dentagenesis.es").split(",").map(s => s.trim()),
    subject: "Nueva solicitud de cita web - " + d.nombre,
    html, text: texto
  };
  if (d.email) body.reply_to = d.email;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000)
  });
  if (!r.ok) throw new Error("Resend " + r.status + ": " + (await r.text()).slice(0, 300));
}

async function guardar(d) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_KEY;
  if (!url || !key) return false;
  const r = await fetch(url.replace(/\/$/, "") + "/rest/v1/solicitudes", {
    method: "POST",
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(d),
    signal: AbortSignal.timeout(8000)
  });
  if (!r.ok) throw new Error("Supabase " + r.status + ": " + (await r.text()).slice(0, 300));
  return true;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false }); }

  const origen = req.headers.origin;
  if (origen && !ORIGENES.includes(origen) && !/\.vercel\.app$/.test(origen)) {
    return res.status(403).json({ ok: false, error: "origen" });
  }

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};

  // Campo trampa: los robots lo rellenan. Respondemos "ok" para no darles pistas.
  if (b._honey) return res.status(200).json({ ok: true });

  const d = {
    nombre: limpiar(b.nombre, MAX.nombre),
    telefono: limpiar(b.telefono, MAX.telefono),
    email: limpiar(b.email, MAX.email),
    tratamiento: limpiar(b.tratamiento, MAX.tratamiento),
    mensaje: limpiar(b.mensaje, MAX.mensaje)
  };
  if (!d.nombre || (d.telefono.match(/\d/g) || []).length < 6 || b.privacidad !== true) {
    return res.status(400).json({ ok: false, error: "datos" });
  }
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) d.email = "";

  // Email y copia en base de datos a la vez; basta con que una de las dos funcione
  const [mail, db] = await Promise.allSettled([enviarEmail(d), guardar(d)]);
  if (mail.status === "rejected") console.error("[contacto] email:", mail.reason && mail.reason.message);
  if (db.status === "rejected") console.error("[contacto] db:", db.reason && db.reason.message);

  const okMail = mail.status === "fulfilled";
  const okDb = db.status === "fulfilled" && db.value === true;
  if (okMail || okDb) return res.status(200).json({ ok: true });
  return res.status(502).json({ ok: false });
};
