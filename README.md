# Syntax Software Studio

Sitio web del estudio: HTML/CSS/JS estático con GSAP + ScrollTrigger + Lenis (vendorizados en `assets/vendor`).

## Estructura
- `src/pages/*.html`: contenido de cada página (se edita aquí)
- `src/partials/*.html`: head, header, footer y CTA compartidos
- `src/site.json`: datos de contacto, URL y endpoint del formulario
- `assets/css/styles.css`, `assets/js/main.js`: diseño y animaciones
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
