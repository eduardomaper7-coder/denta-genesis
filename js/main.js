/* Denta Genesis — interacciones */
(function () {
  "use strict";

  // Cabecera: fondo al hacer scroll
  var header = document.querySelector(".header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menú móvil
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  function closeNav() { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  // Año actual en el pie
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Animaciones de entrada
  var targets = document.querySelectorAll(".section__head, .impl__item, .steps li, .card, .about__text, .slider, .member, .doctor, .tour__track, .faq__list, .form, .contact__info");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }

  // La clínica: fotos que rotan solas (pausa al pasar el ratón)
  var slider = document.getElementById("slider");
  if (slider) {
    var slides = slider.querySelectorAll(".slider__slide");
    var dots = slider.querySelectorAll(".slider__dots button");
    var cur = 0, timer = null;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function show(n) {
      slides[cur].classList.remove("is-active"); dots[cur].classList.remove("is-active");
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add("is-active"); dots[cur].classList.add("is-active");
    }
    function play() { if (!still) { stop(); timer = setInterval(function () { show(cur + 1); }, 4500); } }
    function stop() { clearInterval(timer); }
    dots.forEach(function (d, i) { d.addEventListener("click", function () { show(i); play(); }); });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", play);
    slides.forEach(function (sl) { var im = sl.querySelector("img"); if (im) im.loading = "eager"; });
    play();
  }

  // Carrusel de instalaciones: flechas
  var track = document.getElementById("tourTrack");
  document.querySelectorAll(".tour__arrow").forEach(function (b) {
    b.addEventListener("click", function () {
      var item = track.querySelector(".tour__item");
      var step = item ? item.getBoundingClientRect().width + 20 : 320;
      track.scrollBy({ left: step * Number(b.dataset.dir), behavior: "smooth" });
    });
  });

  // Mapa de Google bajo demanda
  var mapBtn = document.getElementById("mapBtn");
  if (mapBtn) {
    mapBtn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      // Ficha de Google de Denta Genesis (coordenadas de la ficha)
      iframe.src = "https://maps.google.com/maps?q=Denta+Genesis+La+Orotava&ll=28.3936367,-16.5281488&z=17&hl=es&output=embed";
      iframe.title = "Ubicación de Denta Genesis en La Orotava";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      document.getElementById("map").appendChild(iframe);
      mapBtn.remove();
    });
  }

  // Formulario: se envía a nuestra propia función /api/contacto (Vercel + Resend)
  var form = document.getElementById("form");
  var msg = document.getElementById("formMsg");
  if (form) {
    var boton = form.querySelector("button[type=submit]");
    var textoBoton = boton ? boton.textContent : "";
    var enviando = false;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (enviando) return;
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (f) {
        var valid = f.type === "checkbox" ? f.checked : f.value.trim() !== "";
        f.classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) { msg.className = "form__msg is-error"; msg.textContent = "Revisa los campos obligatorios y acepta la política de privacidad."; return; }

      var d = new FormData(form);
      var datos = {
        nombre: d.get("nombre"),
        telefono: d.get("telefono"),
        email: d.get("email") || "",
        tratamiento: d.get("tratamiento"),
        mensaje: d.get("mensaje") || "",
        privacidad: form.querySelector("[name=privacidad]").checked,
        _honey: d.get("_honey") || ""
      };

      enviando = true;
      if (boton) { boton.disabled = true; boton.textContent = "Enviando…"; }
      msg.className = "form__msg"; msg.textContent = "";

      var ctrl = window.AbortController ? new AbortController() : null;
      var t = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;

      fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(datos),
        signal: ctrl ? ctrl.signal : undefined
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.ok) throw new Error("envio"); }); })
        .then(function () {
          form.reset();
          msg.className = "form__msg is-ok";
          msg.textContent = "¡Gracias! Hemos recibido tu solicitud y te llamaremos lo antes posible.";
        })
        .catch(function () {
          // Plan B: WhatsApp con los datos ya escritos, o llamada
          var txt = "Hola, quiero pedir cita en Denta Genesis.\nNombre: " + datos.nombre + "\nTeléfono: " + datos.telefono +
            "\nTratamiento: " + datos.tratamiento + (datos.mensaje ? "\nMensaje: " + datos.mensaje : "");
          var wa = "https://wa.me/34641314797?text=" + encodeURIComponent(txt);
          msg.className = "form__msg is-error";
          msg.innerHTML = "No se ha podido enviar. <a href=\"" + wa + "\" target=\"_blank\" rel=\"noopener\">Envíanos tu solicitud por WhatsApp</a> o llámanos al <a href=\"tel:+34822646609\">822 646 609</a>.";
        })
        .then(function () {
          if (t) clearTimeout(t);
          enviando = false;
          if (boton) { boton.disabled = false; boton.textContent = textoBoton; }
        });
    });
  }
})();
