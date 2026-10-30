# Syntax Software Studio

Sitio web del estudio: HTML/CSS/JS estático con GSAP + ScrollTrigger + Lenis (vendorizados en `assets/vendor`).

## Estructura
- `src/pages/*.html`: contenido de cada página (se edita aquí)
- `src/partials/*.html`: head, header, footer y CTA compartidos
- `src/site.json`: datos de contacto, URL y endpoint del formulario
- `assets/css/styles.css` (se edita) → `styles.min.css` (lo genera el build), `assets/js/main.js`: diseño y animaciones
- `docs/contenido-y-ux.md`: copy y guía UX por sección

## Compilar
```bash
node build.mjs
```
Genera los `.html` finales en la raíz, además de `sitemap.xml` y `robots.txt`. Funciona con GitHub Pages (raíz del repo) y con Vercel (`vercel.json`).

## Formulario
Con `formEndpoint` vacío en `src/site.json`, la solicitud se abre en WhatsApp ya redactada.
Para recibirla por correo con FormSubmit:
1. Pon `"formEndpoint": "https://formsubmit.co/ajax/TU_CORREO"` y ejecuta `node build.mjs`.
2. Envía el formulario una vez y confirma el correo de activación que manda FormSubmit.

## Fotos
`assets/img/photos/` usa fotos de [Unsplash](https://unsplash.com) (licencia libre para uso comercial):
- `lab-web.webp`: foto `1547658719-da2b51169166`
- `lab-software.webp`: foto `1460925895917-afdab827c52f`
- `cta-equipo.webp`: foto `1600880292203-757bb62b4baf`
- `svc-landing.webp`: `1551650975-87deedd944c3` · `svc-corporativo.webp`: `1559028012-481c04fa702d` · `svc-catalogo.webp`: `1556742049-0cfed4f6a45d`
- `svc-crm.webp`: `1522202176988-66273c2fd55f` · `svc-gestion.webp`: `1551288049-bebda4e38f71` · `svc-automatizacion.webp`: `1563986768609-322da13575f3`

## Portafolio
`assets/img/portafolio/` contiene capturas de proyectos reales del portafolio de DGP Global Group (repositorio `dgpglobal`):
Cleaning Group, Pina Water System, MQ Store, Tecmeca, Caibo Construction y The Sweet Zone (sitios web).
Las pantallas `sistema-*.webp` son maquetas con datos ficticios (marca «Tu Empresa»), no datos de clientes.

## Conectar el dominio propio
1. En `src/site.json` cambia `"url"` por `https://tudominio.com` y `"basePath"` por `"/"`.
2. Crea un archivo `CNAME` en la raíz con el dominio (sin https).
3. Ejecuta `node build.mjs` y sube los cambios. Canónicas, sitemap, datos estructurados e imagen para redes se actualizan solos.
