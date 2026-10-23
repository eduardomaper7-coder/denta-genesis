# Web Denta Genesis — guía rápida

Abre `index.html` con doble clic para verla en el navegador.

## Fotos (ya incluidas en `img/fotos/`, recortadas y comprimidas)
| Archivo | Dónde sale |
|---|---|
| hero.jpg | Portada (pared de recepción con el logo) |
| implantes-gabinete.jpg | Sección implantes (gabinete) |
| radiologia.jpg | Sin usar (equipo de radiología) |
| clinica-slide-1…4.jpg | La clínica: fotos que rotan (sala de espera, 2 gabinetes, pasillo) |
| clinica-1/2/3.jpg | Sin usar (versión anterior) |
| dr-joseph-cesares.jpg, dr-doctor-2.jpg | Sección "Nuestro equipo" y páginas de cada doctor |
| equipo-1.jpg | Sin usar (versión anterior) |
| recorrido-1…6.jpg | Carrusel "Instalaciones" (fachada, gabinetes, pasillo, cristalera) |

Para cambiar una foto, sustituye el archivo manteniendo el nombre.

## Datos PENDIENTES (buscar y reemplazar en todos los .html)
- Teléfonos ya puestos: fijo 822 646 609 y móvil 641 314 797 (sacados del rótulo)
- Email: `info@dentagenesis.es`
- Dominio: `https://www.dentagenesis.es` (también en robots.txt y sitemap.xml)
- Horario: lunes a viernes 9:00–14:00 · 16:00–20:00 (también en el bloque JSON-LD de index.html)
- Segundo doctor: nombre, especialidad y CV → tarjeta en index.html (sección #equipo) y página dr-doctor-2.html (todo lo marcado en verde). Al tener el nombre, renombrar el archivo (p. ej. dr-nombre-apellido.html), cambiar el enlace de la tarjeta y añadirlo a sitemap.xml.
- Dr. Joseph Cesares: revisar su página dr-joseph-cesares.html (la cita entre comillas es un texto propuesto) y confirmar el nº de colegiado vigente en Tenerife.
- Páginas legales: razón social, CIF, nº de registro sanitario (marcados en verde)
- Revisar que las afirmaciones (financiación, carga inmediata, ortodoncia invisible…) coinciden con lo que ofrece la clínica.

## SEO incluido
- Título y descripción optimizados para "implantes dentales La Orotava" / "clínica dental La Orotava".
- Datos estructurados de Google: `Dentist` (dirección, horario, servicios, zonas) y `FAQPage`.
- Open Graph para compartir en redes, favicon, sitemap.xml y robots.txt.
- HTML semántico, textos alternativos en imágenes, carga diferida y mapa bajo demanda (rápida y sin cookies).

## Tras publicar
1. Dar de alta el dominio en Google Search Console y enviar `sitemap.xml`.
2. Crear/verificar la ficha de Google Business Profile con el mismo nombre, dirección y teléfono que la web, y añadir su enlace al campo `sameAs` del JSON-LD.
3. Si se añade Google Analytics, poner un banner de consentimiento de cookies.
