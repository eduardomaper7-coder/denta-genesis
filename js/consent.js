/* Aviso de cookies: Google Ads solo se carga si el visitante acepta */
(function () {
  var CLAVE = "dg_cookies"; // "si" | "no"
  var ID = "AW-18533062211";

  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }

  var cargado = false;
  function activar() {
    gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    if (cargado) return;
    cargado = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
  }

  var css = ".ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:70;max-width:560px;margin:0 auto;background:var(--ink,#072a24);color:var(--mint-soft,#e6f5f0);border-radius:18px;padding:20px 22px;box-shadow:0 20px 50px -20px rgba(0,0,0,.55);font-size:.94rem;line-height:1.55}" +
    ".ck p{margin:0 0 14px}.ck a{color:var(--mint,#9fe3ce)}.ck__btns{display:flex;gap:10px;flex-wrap:wrap}" +
    ".ck button{font:inherit;font-weight:500;border-radius:999px;padding:.6em 1.3em;cursor:pointer;border:1px solid var(--mint,#9fe3ce)}" +
    ".ck__si{background:var(--mint,#9fe3ce);color:var(--ink,#072a24)}.ck__no{background:transparent;color:var(--mint,#9fe3ce)}";

  function mostrar() {
    if (document.getElementById("ck")) return;
    if (!document.getElementById("ck-css")) {
      var st = document.createElement("style"); st.id = "ck-css"; st.textContent = css; document.head.appendChild(st);
    }
    var d = document.createElement("div");
    d.id = "ck"; d.className = "ck"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Aviso de cookies");
    d.innerHTML = '<p>Usamos cookies de Google Ads para medir si nuestros anuncios funcionan (por ejemplo, cuántas personas nos llaman o piden cita desde la web). Solo las activamos si nos das permiso. <a href="politica-cookies.html">Más información</a>.</p>' +
      '<div class="ck__btns"><button type="button" class="ck__si">Aceptar</button><button type="button" class="ck__no">Rechazar</button></div>';
    document.body.appendChild(d);
    d.querySelector(".ck__si").addEventListener("click", function () { guardar("si"); activar(); d.remove(); });
    d.querySelector(".ck__no").addEventListener("click", function () { guardar("no"); gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }); d.remove(); });
  }

  // Enlace "Configurar cookies" del pie de página
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-cookies]");
    if (a) { e.preventDefault(); mostrar(); }
  });

  var v = leer();
  if (v === "si") activar();
  else if (v !== "no") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mostrar); else mostrar();
  }
})();
