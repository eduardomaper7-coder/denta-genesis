# Web Denta Genesis — guía rápida

Abre `index.html` con doble clic para verla en el navegador.

## Fotos
Guarda las fotos en `img/fotos/` con estos nombres exactos y aparecerán solas en su sitio:

| Archivo | Dónde sale | Tamaño recomendado |
|---|---|---|
| hero.jpg | Portada (vertical) | 1200×1400 |
| implantes.jpg | Sección implantes | 1000×1200 |
| clinica-1.jpg | Recepción / fachada | 1200×900 |
| clinica-2.jpg | Gabinete | 900×900 |
| clinica-3.jpg | Detalle de la clínica | 900×900 |
| equipo-1.jpg, equipo-2.jpg, equipo-3.jpg | Equipo | 800×1000 |

Comprímelas antes (por ejemplo en squoosh.app), idealmente menos de 300 KB cada una.

## Datos PENDIENTES (buscar y reemplazar en todos los .html)
- Teléfono: `922 000 000` y `+34922000000`
- Email: `info@dentagenesis.es`
- Dominio: `https://www.dentagenesis.es` (también en robots.txt y sitemap.xml)
- Horario: lunes a viernes 9:00–14:00 · 16:00–20:00 (también en el bloque JSON-LD de index.html)
- Equipo: nombres y nº de colegiado
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
