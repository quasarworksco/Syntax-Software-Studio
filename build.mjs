// Ensambla las páginas de src/pages con los parciales de src/partials
// y escribe el HTML final en la raíz del repo (lo que sirve GitHub Pages / Vercel).
//
//   node build.mjs
//
// Cada página empieza con un comentario de metadatos:
//   <!--meta {"title":"…","description":"…","nav":"lab-web"} -->
// Marcadores disponibles en páginas y parciales:
//   {{site.clave}}      → valor de src/site.json
//   {{page.clave}}      → valor de los metadatos de la página
//   {{active:nav}}      → aria-current="page" si la página pertenece a ese menú
//   <!-- @include nombre -->  → contenido de src/partials/nombre.html

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const site = JSON.parse(readFileSync(join(root, "src/site.json"), "utf8"));
// Permite publicar en otro hosting sin tocar site.json (ver vercel.json).
if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/$/, "");
if (process.env.BASE_PATH) site.basePath = process.env.BASE_PATH;
const partial = (name) => readFileSync(join(root, "src/partials", `${name}.html`), "utf8");

function render(tpl, page) {
  let out = tpl;
  // Los includes pueden anidarse; se resuelven hasta que no quede ninguno.
  for (let i = 0; i < 5 && out.includes("<!-- @include"); i++) {
    out = out.replace(/<!-- @include ([\w-]+) -->/g, (_, n) => partial(n));
  }
  return out
    .replace(/\{\{active:([\w-]+)\}\}/g, (_, n) => (page.nav === n ? ' aria-current="page"' : ""))
    .replace(/\{\{site\.([\w]+)\}\}/g, (m, k) => (k in site ? site[k] : m))
    .replace(/\{\{page\.([\w]+)\}\}/g, (m, k) => (k in page ? page[k] : m))
    .replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
}

// CSS minificado (se edita styles.css; se publica styles.min.css)
const css = readFileSync(join(root, "assets/css/styles.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{};,>])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();
writeFileSync(join(root, "assets/css/styles.min.css"), css);
console.log("✓ styles.min.css", Math.round(css.length / 1024), "KB");

// Datos estructurados (schema.org) de cada página: empresa, sitio, página, migas,
// servicio (Labs) y preguntas frecuentes (extraídas del propio HTML).
function schema(page, body) {
  const org = {
    "@type": "ProfessionalService", "@id": `${site.url}/#empresa`, name: site.name, url: `${site.url}/`,
    logo: `${site.url}/assets/img/logo.png`, image: `${site.url}/assets/img/og-image.jpg`,
    telephone: site.phoneHref, email: site.email, priceRange: "$$",
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.region, addressCountry: "VE" },
    areaServed: [{ "@type": "Country", name: "Venezuela" }, { "@type": "Place", name: "Latinoamérica" }, { "@type": "Country", name: "Estados Unidos" }],
    availableLanguage: ["es", "en"],
    contactPoint: { "@type": "ContactPoint", telephone: site.phoneHref, email: site.email, contactType: "sales", availableLanguage: ["es", "en"] },
    knowsAbout: ["Diseño de páginas web", "Landing pages", "SEO técnico", "Catálogos digitales", "CRM a medida", "Software de gestión", "Automatización de procesos"],
  };
  const graph = [org,
    { "@type": "WebSite", "@id": `${site.url}/#sitio`, url: `${site.url}/`, name: site.name, inLanguage: "es", publisher: { "@id": org["@id"] } },
    { "@type": "WebPage", "@id": `${page.canonical}#pagina`, url: page.canonical, name: page.title, description: page.description, inLanguage: "es", isPartOf: { "@id": `${site.url}/#sitio` }, about: { "@id": org["@id"] }, primaryImageOfPage: `${site.url}/assets/img/og-image.jpg` },
  ];
  if (page.crumb) graph.push({ "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${site.url}/` },
    { "@type": "ListItem", position: 2, name: page.crumb, item: page.canonical } ] });
  if (page.service) graph.push({ "@type": "Service", name: page.service.name, serviceType: page.service.serviceType, provider: { "@id": org["@id"] }, areaServed: org.areaServed, url: page.canonical });
  const faqs = [...body.matchAll(/<summary>([\s\S]*?)<span[^>]*><\/span><\/summary>\s*<p>([\s\S]*?)<\/p>/g)];
  if (faqs.length) graph.push({ "@type": "FAQPage", mainEntity: faqs.map(([, q, a]) => ({ "@type": "Question", name: q.trim(), acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "").trim() } })) });
  return { "@context": "https://schema.org", "@graph": graph };
}

const pages = readdirSync(join(root, "src/pages")).filter((f) => f.endsWith(".html"));
const urls = [];

for (const file of pages) {
  const raw = readFileSync(join(root, "src/pages", file), "utf8");
  const m = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: falta el comentario <!--meta {...} -->`);
  const page = { path: file === "index.html" ? "" : file, bodyClass: "", ...JSON.parse(m[1]) };
  // La 404 se sirve desde cualquier ruta: necesita <base> para que los enlaces relativos funcionen.
  page.extraHead = page.noindex ? `<meta name="robots" content="noindex" />\n<base href="${site.basePath || "/"}" />` : "";
  // Las vistas previas (variantes de diseño) no se indexan ni van al sitemap.
  if (page.preview) page.extraHead = `<meta name="robots" content="noindex" />`;
  page.canonical = `${site.url}/${page.path}`;
  page.robots = page.noindex || page.preview ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1";
  const body = raw.slice(m[0].length);
  page.schema = JSON.stringify(schema(page, body));
  const html = render(`<!-- @include head -->\n<!-- @include header -->\n<main id="contenido">\n${body}</main>\n<!-- @include footer -->\n`, page);
  writeFileSync(join(root, file), html);
  if (!page.noindex && !page.preview) urls.push([page.canonical, page.path === "" ? "1.0" : "0.8"]);
  console.log("✓", file);
}

writeFileSync(
  join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(([u, pr]) => `  <url><loc>${u}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><priority>${pr}</priority></url>`)
    .join("\n")}\n</urlset>\n`
);
console.log("✓ sitemap.xml");

writeFileSync(join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
console.log("✓ robots.txt");
