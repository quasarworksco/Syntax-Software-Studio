# Syntax Software Studio — Copy y guía UX por sección

Documento de referencia del sitio. El texto exacto vive en `src/pages/*.html`; aquí está el porqué de cada decisión.

## Identidad
- **Paleta (tomada del logo):** azul marino `#17507B` / `#0E426A` y turquesa `#32B3B9` / `#1D939F`. Sobre fondo oscuro (`#070B10`, paneles `#0E1621`) se usan aclarados: turquesa `#3CC3CA` y azul `#5B9FDB`. Degradado azul→turquesa en palabras clave.
- **Ritmo de secciones:** alternan oscuras y claras (`#F3F7FA` con retícula de puntos y halo turquesa). Home: hero oscuro → visión + Por qué Syntax claros → Labs oscuro → Para quién/FAQ oscuro → CTA. Labs: hero oscuro → intro clara → soluciones oscuras → incluido claro → CTA.
- **Tipografía:** Space Grotesk (titulares, tracking negativo), Inter (texto), JetBrains Mono (etiquetas tipo código: `// manifiesto`, `análisis()`).
- **Logo:** `assets/img/logo.png` (fondo claro) y `logo-dark.png` (variante con el azul aclarado para fondo oscuro). Original en `assets/img/logo-original.png`.
- **Voz:** directa y en lenguaje de negocio. Sin términos técnicos que el cliente no use (nada de commit, deploy, API, sprint, frontend/backend, LCP…). Si un término es necesario (CRM, Google), se acompaña de una explicación sencilla. Hablamos de nuestros servicios y de lo que gana el cliente, no de lo que hacen otros.

## Sistema de animación (heredado de JP Real Estate, Solar Engineering y All in One + efectos propios)
| Efecto | Origen | Dónde |
|---|---|---|
| Lenis smooth scroll + GSAP ScrollTrigger | los 3 repos | todo el sitio |
| Preloader de pantalla partida | Solar | primera visita (ahora como terminal que compila) |
| Titulares en líneas enmascaradas y palabras que suben | los 3 | hero y todos los H2 |
| Rotador de palabras 3D | los 3 | `> compilando: ventas_predecibles…` |
| Texto que se ilumina con el scroll | los 3 | manifiestos |
| Marquesina que reacciona a la velocidad del scroll | los 3 | stack tecnológico |
| Vista previa que sigue al cursor | los 3 | catálogo de soluciones (mockups CSS) |
| Banda CTA que se expande a pantalla completa | los 3 | cierre de cada página |
| Wordmark gigante del footer, botones magnéticos, texto de botón que rueda, cursor propio | los 3 | global |
| Ilustraciones SVG que se dibujan + inclinación 3D | Solar | tarjetas de «Por qué Syntax» y labs |
| **Nuevo:** IDE con borde de luz giratorio que escribe 3 archivos (negocio.ts, crm.ts, landing.tsx), resalta la línea activa y ejecuta comandos en su terminal | Syntax | hero |
| **Nuevo:** red de nodos en canvas que reacciona al puntero | Syntax | hero |
| **Nuevo:** etiquetas que se «descifran» (scramble) | Syntax | eyebrows de sección |
| **Nuevo:** spotlight de borde que sigue al mouse | Syntax | tarjetas |
| **Nuevo:** cortina con el logo entre páginas | Syntax | navegación interna |
| **Nuevo:** medidores Lighthouse y pipeline con pulso | Syntax | Lab Web / Lab Software |

Todo respeta `prefers-reduced-motion` y funciona sin JS de animación (fallback estático).

---

## 1. Hero
**Copy**
- Eyebrow: `● Estudio de ingeniería digital · Software a medida` (sin ciudad: el sitio habla a todo el país; la ubicación solo aparece en el footer)
- H1: **Tu negocio no necesita otra página web. Necesita un _motor_.**
- Línea mono: `> compilando: ventas_predecibles | operación_sin_fricción | clientes_que_regresan | crecimiento_escalable`
- Subtítulo: Diseñamos la infraestructura digital de tu empresa: **sitios web de alto rendimiento, CRMs y software interno a medida** que trabajan tan duro como tu equipo comercial.
- CTAs: **Agendar Consultoría Técnica →** (primario, cian) · **Ver Soluciones** (fantasma)

**UX:** dos columnas: mensaje a la izquierda y, a la derecha, un IDE que escribe en ciclo `negocio.ts`, `crm.ts` y `landing.tsx`, rodeado de chips flotantes (`deploy → producción`, `API 200 OK`, `Nuevo lead → CRM`). El fondo lleva una retícula con máscara radial, una red de nodos que reacciona al puntero y un halo cian que sigue al mouse. El titular entra por líneas enmascaradas. En móvil todo queda en una columna y el editor baja debajo de los CTAs.

## Manifiesto
**Copy:** Construimos tecnología con un solo propósito: que tu negocio venda más y opere mejor. Sitios que cargan en un parpadeo, sistemas que ordenan tu operación y datos que guían cada decisión.
**UX:** texto grande que se ilumina palabra por palabra al hacer scroll.

## 2. Por qué Syntax
**Copy**
- H2: **Tecnología que _trabaja por ti._**
- Lead: Una web bonita que no vende es un gasto. Un sistema bien construido es un activo que trabaja 24/7.
- 4 principios: **Estrategia primero** · **Código limpio** (la «Syntax» de nuestro nombre) · **Arquitectura escalable** · **A la medida exacta**
- Flujograma corto «Lo que hacemos → lo que gana tu negocio»: Analizamos, Optimizamos, Conectamos, Entregamos, Crecemos, Acompañamos (cada paso con su beneficio en una línea).

**UX:** 4 tarjetas con iconos de línea que se dibujan solos y un brillo que sigue al mouse. La tabla muestra qué hacemos y, al lado con ✓, el beneficio para el negocio; las filas entran en cascada. Los contadores animados usan el degradado de marca.

## 3. Los dos pilares
**Copy**
- H2: **Dos laboratorios. _Un mismo motor._**
- **Lab Web (Frontend & Conversión):** tu vitrina digital, construida para cargar al instante, posicionar en Google y convertir visitas en conversaciones de venta. Landing pages de alta velocidad · Sitios corporativos con SEO técnico · Catálogos digitales interactivos.
- **Lab Software (Backend & Sistemas):** los sistemas que hacen funcionar tu empresa por dentro. CRMs personalizados a tu flujo de venta · Plataformas de gestión interna · Automatizaciones, conectores y APIs.
- Catálogo de 6 soluciones (W.01–W.03, S.01–S.03), cada una enlazada a su sección.

**UX:** dos tarjetas grandes con inclinación 3D (cian para Web, verde para Software) y una ilustración SVG que se dibuja (un navegador en una, un diagrama de nodos con datos en movimiento en la otra). Debajo va la lista de servicios: al pasar el mouse aparece un mockup flotante distinto para cada fila.

## 4. Autoridad y cierre
**Copy**
- FAQ («Lo que suelen preguntarnos»): costo, cobertura geográfica, propiedad del código, integraciones, soporte posterior.
- Banda final: **Deja atrás los sistemas lentos. _Escala de verdad._** + consultoría de 45 min con mapa técnico. CTAs: Agendar Consultoría Técnica · Escribir por WhatsApp. Microcopy: sin compromiso · respuesta en menos de 24 h hábiles · hablas directo con un ingeniero.

**UX:** el FAQ es un acordeón nativo (`<details>`), accesible y bueno para SEO. La banda final tiene una retícula en perspectiva animada y dos orbes de luz, y se expande de tarjeta a pantalla completa con el scroll.

## Páginas
- `index.html`: home (hero, visión, Por qué Syntax, Labs, para quién + FAQ, CTA)
- `lab-web.html`: medidores Lighthouse, 3 soluciones con mockups y lo incluido en cada proyecto
- `lab-software.html`: pipeline animado (lead → CRM → seguimiento → venta → reporte), 3 módulos y estándares de construcción
- `contacto.html`: formulario de consultoría (chips de servicio, presupuesto, plazo) con confirmación tipo terminal
- `404.html`: `ROUTE_NOT_FOUND`
