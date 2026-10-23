/* Denta Genesis — interacciones */
(function () {
  "use strict";

  // Email de destino del formulario (cámbialo si es otro)
  var EMAIL_CLINICA = "info@dentagenesis.es";

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

  // Formulario: validación y envío por email (sin servidor)
  var form = document.getElementById("form");
  var msg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (f) {
        var valid = f.type === "checkbox" ? f.checked : f.value.trim() !== "";
        f.classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) { msg.textContent = "Revisa los campos obligatorios y acepta la política de privacidad."; return; }

      var d = new FormData(form);
      var body =
        "Nombre: " + d.get("nombre") + "\n" +
        "Teléfono: " + d.get("telefono") + "\n" +
        "Email: " + (d.get("email") || "-") + "\n" +
        "Tratamiento: " + d.get("tratamiento") + "\n\n" +
        (d.get("mensaje") || "");
      window.location.href = "mailto:" + EMAIL_CLINICA +
        "?subject=" + encodeURIComponent("Solicitud de cita web - " + d.get("nombre")) +
        "&body=" + encodeURIComponent(body);
      msg.textContent = "¡Gracias! Se abrirá tu correo para enviar la solicitud. Te contactaremos lo antes posible.";
      form.reset();
    });
  }
})();
