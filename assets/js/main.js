/* Syntax Software Studio — interacciones (GSAP + ScrollTrigger + Lenis)
   Base de movimiento heredada de JP Real Estate, Solar Engineering y All in One,
   con efectos propios de estudio de software: logo que se arma al cargar, editor que se
   escribe solo, red de nodos, texto que se descifra y cortina entre páginas. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const body = document.body;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGsap && !reduced;
  const CFG = window.SYNTAX || {};
  const waUrl = (text) => `https://wa.me/${CFG.wa}?text=${encodeURIComponent(text)}`;

  if (!motion) root.classList.add("no-motion");
  if (hasGsap) { gsap.registerPlugin(ScrollTrigger); gsap.config({ nullTargetWarn: false }); }
  const nav = $(".nav");
  const wa = $(".wa-float");
  const lightHero = $(".hero--light");
  nav.classList.toggle("on-light", !!lightHero);

  /* ---------- Botones: el texto rueda al pasar el mouse ---------- */
  $$(".btn__text").forEach((t) => {
    const label = t.textContent.trim();
    t.innerHTML = `<i data-text="${label.replace(/"/g, "&quot;")}">${label}</i>`;
  });

  /* ---------- Scroll suave ---------- */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Menú móvil ---------- */
  const burger = $(".burger");
  const menu = $("#mobile-menu");
  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.setAttribute("aria-hidden", !open);
    if (lenis) open ? lenis.stop() : lenis.start();
    else body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------- Enlaces: anclas de la misma página y cortina entre páginas ---------- */
  const curtain = $(".curtain");
  const samePage = (url) => url.origin === location.origin && url.pathname.replace(/index\.html$/, "") === location.pathname.replace(/index\.html$/, "");
  const scrollToHash = (hash) => {
    const target = hash === "#top" ? body : $(hash);
    if (!target) return false;
    const go = () => (lenis ? lenis.scrollTo(target, { duration: 1.6, offset: hash === "#top" ? 0 : -20 }) : target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));
    const wasOpen = body.classList.contains("menu-open");
    setMenu(false);
    wasOpen ? setTimeout(go, 500) : go();
    return true;
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    const url = new URL(a.getAttribute("href"), location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:" && url.protocol !== "file:") return;
    if (samePage(url)) {
      if (url.hash && scrollToHash(url.hash)) e.preventDefault();
      return;
    }
    if (url.origin !== location.origin || !motion) return;
    e.preventDefault();
    setMenu(false);
    try { sessionStorage.setItem("syntax-curtain", "1"); } catch (err) {}
    gsap.timeline({ onComplete: () => (location.href = url.href) })
      .set(curtain, { transformOrigin: "bottom" })
      .to(curtain, { scaleY: 1, duration: 0.6, ease: "expo.inOut" })
      .to(curtain, { "--o": 1, duration: 0.2 }, "-=0.15");
  });
  // Al volver con el botón "atrás" el navegador restaura la página con la cortina puesta.
  addEventListener("pageshow", (e) => { if (e.persisted && hasGsap) gsap.set(curtain, { scaleY: 0, "--o": 0 }); });

  /* ---------- Preselección de servicio desde la URL (?servicio=web|software) ---------- */
  const pre = new URLSearchParams(location.search).get("servicio");
  if (pre) $$(`.chip-opt input[data-group="${pre}"]`).slice(0, 1).forEach((i) => (i.checked = true));

  /* ---------- Rotador de palabras del hero ---------- */
  let rotatorTimer = null;
  const startRotator = () => {
    const items = $$(".rotator__item");
    if (reduced || rotatorTimer || !items.length) return;
    let i = 0;
    rotatorTimer = setInterval(() => {
      const cur = items[i];
      cur.classList.replace("is-active", "is-leaving");
      setTimeout(() => cur.classList.remove("is-leaving"), 1000);
      i = (i + 1) % items.length;
      items[i].classList.add("is-active");
    }, 2600);
  };

  /* ---------- IDE del hero: tres archivos que se escriben solos ---------- */
  const FILES = [
    {
      lang: "TypeScript",
      code: [
        ["c", "// Syntax Software Studio\n"],
        ["k", "import"], ["p", " { "], ["f", "Motor"], ["p", " } "], ["k", "from"], ["s", ' "@syntax/core"'], ["p", ";\n\n"],
        ["k", "const"], ["p", " negocio = "], ["k", "new"], ["f", " Motor"], ["p", "({\n"],
        ["a", "  web:      "], ["s", '"alto-rendimiento"'], ["p", ",\n"],
        ["a", "  crm:      "], ["s", '"a-la-medida"'], ["p", ",\n"],
        ["a", "  procesos: "], ["f", "automatizar"], ["p", "(["], ["s", '"ventas"'], ["p", "]),\n"],
        ["a", "  reportes: "], ["s", '"tiempo-real"'], ["p", ",\n});\n\n"],
        ["k", "await"], ["p", " negocio."], ["f", "deploy"], ["p", "();"],
      ],
      out: ['<span class="t-c">$</span> syntax preparar', '<span class="t-ok">✓</span> motor del negocio listo <span class="t-d">· 1.2 s</span>'],
    },
    {
      lang: "TypeScript",
      code: [
        ["k", "import"], ["p", " { "], ["f", "defineCRM"], ["p", " } "], ["k", "from"], ["s", ' "@syntax/crm"'], ["p", ";\n\n"],
        ["k", "export const"], ["p", " pipeline = "], ["f", "defineCRM"], ["p", "({\n"],
        ["a", "  etapas: "], ["p", "["], ["s", '"nuevo"'], ["p", ", "], ["s", '"propuesta"'], ["p", ",\n"],
        ["p", "           "], ["s", '"negociación"'], ["p", ", "], ["s", '"cierre"'], ["p", "],\n"],
        ["a", "  asignar: "], ["p", "(lead) "], ["k", "=>"], ["f", " libre"], ["p", "(lead.zona),\n"],
        ["a", "  seguimiento: "], ["p", "{ cada: "], ["s", '"24h"'], ["p", " },\n"],
        ["a", "  reportes: "], ["p", "["], ["s", '"vendedor"'], ["p", ", "], ["s", '"canal"'], ["p", "],\n});"],
      ],
      out: ['<span class="t-c">$</span> syntax crm activar', '<span class="t-ok">✓</span> CRM activo <span class="t-d">· 4 etapas de venta</span>'],
    },
    {
      lang: "TSX",
      code: [
        ["k", "export default function"], ["f", " Landing"], ["p", "() {\n"],
        ["k", "  return"], ["p", " (\n"],
        ["p", "    <"], ["t", "Pagina"], ["a", " velocidad"], ["p", "="], ["s", '"<1s"'], ["a", " seo"], ["p", ">\n"],
        ["p", "      <"], ["t", "Hero"], ["a", " titulo"], ["p", "="], ["s", '"Vende más"'], ["p", " />\n"],
        ["p", "      <"], ["t", "Catalogo"], ["a", " filtros lazy"], ["p", " />\n"],
        ["p", "      <"], ["t", "Formulario"], ["a", " destino"], ["p", "="], ["s", '"crm"'], ["p", " />\n"],
        ["p", "    </"], ["t", "Pagina"], ["p", ">\n  );\n}"],
      ],
      out: ['<span class="t-c">$</span> syntax publicar', '<span class="t-ok">✓</span> sitio publicado <span class="t-d">· carga en 0.8 s</span>'],
    },
  ];
  const ide = $(".ide");
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const ideParts = ide && {
    code: $("[data-type]", ide),
    pre: $(".ide__code", ide),
    tabs: $$(".ide__tab", ide),
    out: $(".ide__out", ide),
    lang: $(".ide__lang", ide),
    gutter: $(".ide__gutter", ide),
    editor: $(".ide__editor", ide),
  };
  if (ide) ideParts.gutter.textContent = Array.from({ length: 11 }, (_, i) => i + 1).join("\n");
  const showFile = (i) => {
    ideParts.tabs.forEach((t, k) => t.classList.toggle("is-active", k === i));
    ideParts.lang.textContent = FILES[i].lang;
  };
  const printOut = (lines) => lines.forEach((l) => { const d = document.createElement("div"); d.innerHTML = l; ideParts.out.appendChild(d); while (ideParts.out.children.length > 3) ideParts.out.firstChild.remove(); });
  const ideStatic = () => {
    if (!ide) return;
    showFile(0);
    ideParts.code.innerHTML = FILES[0].code.map(([c, t]) => `<span class="${c}">${esc(t)}</span>`).join("");
    ideParts.editor.style.setProperty("--ln", 11);
    printOut(FILES[0].out);
  };
  const startIde = () => {
    if (!ide) return;
    let visible = true;
    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(ide);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const untilVisible = async () => { while (!visible || document.hidden) await wait(300); };
    (async () => {
      for (let f = 0; ; f = (f + 1) % FILES.length) {
        await untilVisible();
        showFile(f);
        ideParts.code.textContent = "";
        ideParts.pre.classList.remove("is-fading");
        let line = 1;
        ideParts.editor.style.setProperty("--ln", line);
        for (const [cls, text] of FILES[f].code) {
          const span = document.createElement("span");
          span.className = cls;
          ideParts.code.appendChild(span);
          for (const ch of text) {
            span.textContent += ch;
            if (ch === "\n") { line++; ideParts.editor.style.setProperty("--ln", line); await wait(70); }
            else await wait(14 + Math.random() * 26);
          }
        }
        await wait(350);
        printOut([FILES[f].out[0]]);
        await wait(650);
        printOut([FILES[f].out[1]]);
        await wait(2600);
        ideParts.pre.classList.add("is-fading");
        await wait(450);
      }
    })();
  };

  /* ---------- Dividir texto en palabras enmascaradas (conserva <em> y <br>) ---------- */
  const splitWords = (el) => {
    const inners = [];
    const frag = document.createDocumentFragment();
    [...el.childNodes].forEach((node) => {
      const tag = node.nodeType === 1 ? node.tagName.toLowerCase() : null;
      if (tag === "br") { frag.appendChild(document.createElement("br")); return; }
      node.textContent.split(/\s+/).filter(Boolean).forEach((word) => {
        const mask = document.createElement("span");
        mask.className = "w-mask";
        const inner = document.createElement("span");
        inner.className = "w-in";
        if (tag) { const t = document.createElement(tag); t.className = node.className; t.textContent = word; inner.appendChild(t); }
        else inner.textContent = word;
        mask.appendChild(inner);
        frag.append(mask, " ");
        inners.push(inner);
      });
    });
    el.textContent = "";
    el.appendChild(frag);
    return inners;
  };

  /* ---------- Texto que se descifra (etiquetas tipo código) ---------- */
  const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
  const scramble = (el) => {
    const final = el.dataset.final || (el.dataset.final = el.textContent);
    let frame = 0;
    const total = 26;
    const run = () => {
      const p = frame / total;
      el.textContent = [...final].map((c, i) => (c === " " || i / final.length < p ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (frame++ < total) requestAnimationFrame(run);
      else el.textContent = final;
    };
    run();
  };

  /* ---------- Spotlight: el brillo sigue al mouse ---------- */
  if (finePointer) {
    $$(".spot, .ide").forEach((el) => el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }));
  }

  /* ---------- Red de nodos del hero (canvas) ---------- */
  const net = $(".hero__net");
  if (net && !reduced) {
    const ctx = net.getContext("2d");
    let w, h, pts = [], mouse = { x: -999, y: -999 }, running = true, raf;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const resize = () => {
      w = net.offsetWidth; h = net.offsetHeight;
      net.width = w * dpr; net.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.round((w * h) / 17000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 180) { p.x += (p.x - mouse.x) * 0.004; p.y += (p.y - mouse.y) * 0.004; }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) { ctx.strokeStyle = `rgba(60,195,202,${(1 - d / 130) * 0.22})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 200) { ctx.strokeStyle = `rgba(91,159,219,${(1 - dm / 200) * 0.55})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = dm < 200 ? "rgba(91,159,219,.95)" : "rgba(148,163,184,.45)";
        ctx.beginPath(); ctx.arc(a.x, a.y, dm < 200 ? 2 : 1.4, 0, Math.PI * 2); ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    resize();
    addEventListener("resize", resize);
    const hero = net.parentElement;
    hero.addEventListener("pointermove", (e) => { const r = net.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
    hero.addEventListener("pointerleave", () => (mouse = { x: -999, y: -999 }));
    new IntersectionObserver(([en]) => { running = en.isIntersecting; cancelAnimationFrame(raf); if (running) draw(); }).observe(net);
  }

  /* ---------- Formulario de contacto ---------- */
  const form = $("#lead-form");
  if (form) {
    const status = $(".form__status", form);
    const f = form.elements;
    const fields = [
      [f.nombre, (v) => v.length >= 2],
      [f.correo, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)],
      [f.whatsapp, (v) => v.replace(/\D/g, "").length >= 7],
      [f.mensaje, (v) => v.length >= 15],
    ];
    const validate = () => {
      for (const [input, ok] of fields) {
        const bad = !ok(input.value.trim());
        input.closest(".field").classList.toggle("has-error", bad);
        if (bad) { input.focus(); status.textContent = "> revisa los campos marcados"; return false; }
      }
      return true;
    };
    const collect = () => ({
      servicios: $$('input[name="servicio"]:checked', form).map((i) => i.value).join(", ") || "Sin especificar",
      nombre: f.nombre.value.trim(),
      empresa: f.empresa.value.trim(),
      correo: f.correo.value.trim(),
      whatsapp: f.whatsapp.value.trim(),
      presupuesto: f.presupuesto.value,
      plazo: f.plazo.value,
      mensaje: f.mensaje.value.trim(),
    });
    const done = () => {
      form.classList.remove("is-sending");
      form.classList.add("is-done");
      $(".form__done", form).setAttribute("aria-hidden", "false");
      status.textContent = "";
      if (motion) gsap.from(".form__done > *", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "expo.out" });
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (f._honey.value) return;
      if (!validate()) return;
      const d = collect();
      if (CFG.endpoint) {
        // Envío directo (FormSubmit u otro servicio que acepte JSON).
        form.classList.add("is-sending");
        status.textContent = "> enviando solicitud…";
        try {
          const res = await fetch(CFG.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ ...d, _subject: `Nueva consultoría: ${d.nombre}${d.empresa ? " — " + d.empresa : ""}`, _template: "table", _captcha: "false" }),
          });
          if (!res.ok) throw new Error(res.status);
          done();
        } catch (err) {
          form.classList.remove("is-sending");
          status.innerHTML = `> no se pudo enviar. <a href="${waUrl("Hola Syntax, quiero agendar una consultoría técnica.")}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>`;
        }
        return;
      }
      // Sin servicio de envío configurado: la solicitud sale por WhatsApp ya redactada.
      const text = [
        "Hola Syntax, quiero agendar una consultoría técnica.",
        "",
        `• Nombre: ${d.nombre}`,
        d.empresa && `• Empresa: ${d.empresa}`,
        `• Correo: ${d.correo}`,
        `• WhatsApp: ${d.whatsapp}`,
        `• Necesito: ${d.servicios}`,
        d.presupuesto && `• Inversión: ${d.presupuesto}`,
        d.plazo && `• Plazo: ${d.plazo}`,
        `• Proyecto: ${d.mensaje}`,
      ].filter(Boolean).join("\n");
      window.open(waUrl(text), "_blank", "noopener");
      done();
    });
    $$("input, select, textarea", form).forEach((el) => el.addEventListener("input", () => { el.closest(".field")?.classList.remove("has-error"); status.textContent = ""; }));
  }

  /* =========================================================
     Sin GSAP o con movimiento reducido
     ========================================================= */
  if (!motion) {
    $(".preloader")?.remove();
    root.classList.remove("intro", "from-curtain");
    startRotator();
    ideStatic();
    $$(".step").forEach((s) => s.classList.add("is-in"));
    $$(".pnode").forEach((s) => s.classList.add("is-on"));
    $$("[data-gauge]").forEach((c) => c.style.setProperty("--g", c.dataset.gauge / 100));
    let lastY = 0;
    const onScroll = () => {
      const y = scrollY;
      wa.classList.toggle("is-visible", y > innerHeight * 0.5);
      nav.classList.toggle("is-hidden", y > lastY && y > innerHeight && !body.classList.contains("menu-open"));
      nav.classList.toggle("is-solid", y > 40);
      nav.classList.toggle("on-light", !!lightHero && y <= 40);
      lastY = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    try { sessionStorage.removeItem("syntax-curtain"); } catch (e) {}
    return;
  }

  /* =========================================================
     Movimiento (GSAP)
     ========================================================= */
  const expo = "expo.out";
  const preloader = $(".preloader");
  const withIntro = root.classList.contains("intro");
  const withCurtain = root.classList.contains("from-curtain");
  try { sessionStorage.removeItem("syntax-curtain"); } catch (e) {}

  /* ---------- Preloader (logo con anillo de progreso) + entrada del hero ---------- */
  body.classList.add("is-loading");
  lenis?.stop();
  gsap.set("[data-hero]", { y: 34, autoAlpha: 0 });
  gsap.set(".hero__title .line__in", { y: 0, yPercent: 115 });
  gsap.set(nav, { yPercent: -100, autoAlpha: 0 });
  gsap.set(".marquee", { yPercent: 60, autoAlpha: 0 });

  const intro = gsap.timeline({ paused: true });
  let t = 0;
  if (withIntro && preloader) {
    // Secuencia de ~1,2 s: entra el logo, el anillo llega a 100 %, se sostiene la composición completa y se abre.
    const pct = $(".pl__pct b");
    const counter = { v: 0 };
    gsap.set(".pl__mark", { scale: 0.4, rotate: -90, autoAlpha: 0, filter: "blur(10px)" });
    gsap.set(".pl__word span", { yPercent: 110 });
    gsap.set([".pl__sub", ".pl__pct", ".pl__orbit"], { autoAlpha: 0 });
    intro
      .fromTo(".pl__rings", { scale: 0.75, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: expo }, 0)
      .to(".pl__mark", { scale: 1, rotate: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }, 0.03)
      .to([".pl__orbit", ".pl__pct"], { autoAlpha: 1, duration: 0.25 }, 0.1)
      .to(".pl__prog", { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.08)
      .to(counter, { v: 100, duration: 0.7, ease: "power2.inOut", onUpdate: () => (pct.textContent = Math.round(counter.v)) }, 0.08)
      .to(".pl__word span", { yPercent: 0, duration: 0.45, stagger: 0.03, ease: expo }, 0.18)
      .fromTo(".pl__sub", { letterSpacing: "0.7em", autoAlpha: 0 }, { letterSpacing: "0.32em", autoAlpha: 1, duration: 0.5, ease: expo }, 0.28)
      // composición completa visible un instante; el logo late
      .to(".pl__mark", { scale: 1.1, duration: 0.12, ease: "power2.out" }, 0.78)
      .to(".pl__mark", { scale: 1, duration: 0.2, ease: "back.out(3)" }, 0.9)
      .to(".pl__rings", { scale: 1.2, autoAlpha: 0, duration: 0.25, ease: "power2.in" }, 0.92)
      .to(".pl__orbit", { scale: 0.5, autoAlpha: 0, duration: 0.22, ease: "power2.in" }, 0.92)
      .to(".preloader__stage", { autoAlpha: 0, y: -14, duration: 0.2, ease: "power2.in" }, 0.98)
      .to(".preloader__half--top", { yPercent: -100, duration: 0.55, ease: "expo.inOut" }, 1.0)
      .to(".preloader__half--bot", { yPercent: 100, duration: 0.55, ease: "expo.inOut" }, 1.0);
    t = 1.15;
  } else if (withCurtain) {
    gsap.set(curtain, { scaleY: 1, transformOrigin: "top", "--o": 1 });
    intro.to(curtain, { "--o": 0, duration: 0.2 }, 0).to(curtain, { scaleY: 0, duration: 0.8, ease: "expo.inOut" }, 0.1);
    t = 0.45;
  }
  intro
    .to(".hero__title .line__in", { yPercent: 0, duration: 1.4, stagger: 0.1, ease: expo }, t + 0.1)
    .to("[data-hero]", { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08, ease: expo }, t + 0.3)
    .to(nav, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: expo, clearProps: "transform" }, t + 0.25)
    .to(".marquee", { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: expo }, t + 0.6)
    .add(() => {
      preloader?.remove();
      root.classList.remove("intro", "from-curtain");
      body.classList.remove("is-loading");
      lenis?.start();
      startRotator();
      startIde();
      ScrollTrigger.refresh();
    }, t + 0.5);

  let started = false;
  const play = () => { if (!started) { started = true; intro.play(); } };
  // Con pantalla de carga se arranca de inmediato (la propia pantalla cubre la carga de fuentes).
  if (withIntro && preloader) play();
  else {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(play);
    setTimeout(play, 900);
  }

  /* ---------- Hero: parallax y brillo que sigue al puntero ---------- */
  if ($(".hero__content")) {
    gsap.to(".hero__content", { y: -100, autoAlpha: 0.1, ease: "none", scrollTrigger: { trigger: ".hero", start: "30% top", end: "bottom top", scrub: true } });
    gsap.to(".hero__visual", { y: -40, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }
  if ($(".hero__photo")) {
    gsap.to(".hero__photo", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.from(".glass", { y: 40, scale: 0.9, autoAlpha: 0, duration: 1.1, stagger: 0.15, ease: "back.out(1.5)", delay: 1.5 });
    if (finePointer) $(".hero").addEventListener("mousemove", (e) => {
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      $$(".glass").forEach((g, n) => gsap.to(g, { x: dx * (18 + n * 10), y: dy * (14 + n * 6), duration: 1.2, ease: "power3", overwrite: "auto" }));
    });
  }
  const glow = $(".hero__glow");
  if (glow && finePointer) {
    const gx = gsap.quickTo(glow, "x", { duration: 1.6, ease: "power3" });
    const gy = gsap.quickTo(glow, "y", { duration: 1.6, ease: "power3" });
    glow.parentElement.addEventListener("mousemove", (e) => { gx((e.clientX / innerWidth - 0.5) * 260); gy((e.clientY / innerHeight - 0.5) * 160); });
  }

  /* ---------- Nav oculta/sólida, enlace activo y WhatsApp ---------- */
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (s) => {
      const y = s.scroll();
      nav.classList.toggle("is-hidden", s.direction === 1 && y > innerHeight && !body.classList.contains("menu-open"));
      nav.classList.toggle("is-solid", y > 40);
      nav.classList.toggle("on-light", !!lightHero && y <= 40);
      wa.classList.toggle("is-visible", y > innerHeight * 0.5);
    },
  });
  $$('.nav__links a[href^="./#"]').forEach((a) => {
    const sec = $("#" + a.getAttribute("href").split("#")[1]);
    if (sec) ScrollTrigger.create({ trigger: sec, start: "top 50%", end: "bottom 50%", onToggle: (s) => a.classList.toggle("is-current", s.isActive) });
  });

  /* ---------- Títulos: palabras que suben ---------- */
  $$("[data-split]").forEach((el) => {
    gsap.from(splitWords(el), { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.05, ease: expo, scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  /* ---------- Etiquetas que se descifran ---------- */
  $$("[data-scramble]").forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => scramble(el) }));

  /* ---------- Manifiesto: palabras que se iluminan con el scroll ---------- */
  $$("[data-words]").forEach((el) => {
    gsap.fromTo(splitWords(el), { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
  });

  /* ---------- Revelado general en lotes ---------- */
  gsap.set("[data-reveal]", { y: 60, autoAlpha: 0 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 92%",
    onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.3, stagger: 0.08, ease: expo, overwrite: true, clearProps: "transform" }),
  });

  /* ---------- Tabla comparativa: filas en cascada ---------- */
  if ($(".compare")) {
    gsap.from(".compare__row", { x: -30, autoAlpha: 0, duration: 1, stagger: 0.07, ease: expo, scrollTrigger: { trigger: ".compare", start: "top 75%" } });
  }

  /* ---------- Flujograma: pasos en cascada ---------- */
  const flow = $(".flow__steps");
  if (flow) {
    gsap.from($$(".flow__step", flow), { y: 30, autoAlpha: 0, duration: 1, stagger: 0.09, ease: expo, scrollTrigger: { trigger: flow, start: "top 85%" } });
  }

  /* ---------- Ilustraciones que se dibujan solas ---------- */
  $$("svg.draw").forEach((svg) => {
    const parts = [...svg.children].filter((p) => p.getTotalLength && !p.classList.contains("fd"));
    parts.forEach((p) => { const len = Math.ceil(p.getTotalLength() || 300); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; p.dataset.len = len; });
    gsap.to(parts, { strokeDashoffset: 0, duration: 1.8, stagger: 0.06, ease: "power2.inOut", scrollTrigger: { trigger: svg, start: "top 88%" } });
    const card = svg.closest(".pcard, .lab");
    if (card && finePointer) card.addEventListener("mouseenter", () => gsap.fromTo(parts, { strokeDashoffset: (i, p) => p.dataset.len }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.04, ease: "power2.inOut", overwrite: true }));
  });

  /* ---------- Labs: la foto se revela como una cortina y se mueve con el scroll ---------- */
  $$(".lab__media").forEach((m) => {
    const img = $("img", m);
    gsap.fromTo(m, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: m, start: "top 88%" } });
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---------- Bento de servicios: tarjetas que se revelan y foto con parallax ---------- */
  $$(".svc").forEach((card, n) => {
    const img = $(".svc__img", card);
    gsap.fromTo(card, { clipPath: "inset(18% 6% 18% 6% round 24px)", autoAlpha: 0 }, { clipPath: "inset(0% 0% 0% 0% round 24px)", autoAlpha: 1, duration: 1.4, clearProps: "clipPath", ease: "expo.out", delay: (n % 2) * 0.12, scrollTrigger: { trigger: card, start: "top 90%" } });
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---------- Inclinación 3D ---------- */
  if (finePointer) $$(".tilt").forEach((card) => {
    const rx = gsap.quickTo(card, "rotateX", { duration: 0.7, ease: "power3" });
    const ry = gsap.quickTo(card, "rotateY", { duration: 0.7, ease: "power3" });
    gsap.set(card, { transformPerspective: 1100 });
    const amt = card.classList.contains("ide") ? 8 : 5;
    card.addEventListener("mousemove", (e) => { const r = card.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * amt); rx(-((e.clientY - r.top) / r.height - 0.5) * amt); });
    card.addEventListener("mouseleave", () => { rx(0); ry(0); });
  });

  /* ---------- Marquesina que reacciona a la velocidad del scroll ---------- */
  const mTrack = $(".marquee__track");
  if (mTrack) {
    let mx = 0, dir = 1, boost = 0;
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { dir = s.direction === 1 ? 1 : -1; boost = Math.min(8, Math.abs(s.getVelocity()) / 250); } });
    gsap.ticker.add(() => {
      boost *= 0.93;
      mx -= (0.035 + boost * 0.09) * dir;
      if (mx <= -50) mx += 50;
      if (mx > 0) mx -= 50;
      gsap.set(mTrack, { xPercent: mx, skewX: boost * dir * 0.9 });
    });
  }

  /* ---------- Contadores ---------- */
  $$("[data-count]").forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    el.textContent = "0";
    gsap.to(o, { v: end, duration: 2.2, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: { trigger: el, start: "top 92%" } });
  });

  /* ---------- Medidores de rendimiento (Lab Web) ---------- */
  $$("[data-gauge]").forEach((c) => gsap.to(c, { strokeDashoffset: 100 - c.dataset.gauge, duration: 2.2, ease: "power3.out", delay: 0.2, scrollTrigger: { trigger: c, start: "top bottom" } }));

  /* ---------- Pipeline (Lab Software): un pulso recorre las etapas ---------- */
  const pipe = $(".pipeline");
  if (pipe && innerWidth > 860) {
    const nodes = $$(".pnode", pipe);
    const pulse = $(".pipeline__pulse", pipe);
    const centers = () => nodes.map((n) => { const i = $("i", n); return i.offsetLeft + i.offsetWidth / 2 + n.offsetLeft - 5; });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
    const build = () => {
      tl.clear();
      const xs = centers();
      tl.set(pulse, { x: xs[0], autoAlpha: 1 });
      xs.forEach((x, i) => {
        tl.to(pulse, { x, duration: i ? 0.7 : 0.01, ease: "power2.inOut" });
        tl.add(() => nodes[i].classList.add("is-on"));
      });
      tl.to(pulse, { autoAlpha: 0, duration: 0.3 }, "+=0.4").add(() => nodes.forEach((n) => n.classList.remove("is-on")), "+=0.3");
    };
    build();
    addEventListener("resize", build);
    ScrollTrigger.create({ trigger: pipe, start: "top 95%", end: "bottom top", onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
  }

  /* ---------- Proceso: pista horizontal anclada (escritorio) ---------- */
  const track = $(".process__track");
  if (track) {
    const steps = $$(".step", track);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 861px)", () => {
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: ".process", start: "top top", end: () => `+=${dist() + innerHeight * 0.4}`,
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (s) => {
            gsap.set(".process__progress i", { scaleX: s.progress });
            steps.forEach((st, i) => st.classList.toggle("is-in", s.progress >= i / steps.length - 0.02));
          },
        },
      });
    });
    mm.add("(max-width: 860px)", () => {
      steps.forEach((st) => ScrollTrigger.create({ trigger: st, start: "top 70%", onEnter: () => st.classList.add("is-in") }));
      gsap.from(steps, { y: 60, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: expo, scrollTrigger: { trigger: track, start: "top 85%" } });
    });
  }

  /* ---------- Bloques de funcionalidades: mockup con parallax ---------- */
  $$(".fblock__visual .mock").forEach((m) => gsap.fromTo(m, { yPercent: 8, rotate: -1.5 }, { yPercent: -8, rotate: 1.5, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } }));

  /* ---------- Hero Lab Web: pila de sitios reales que rota ---------- */
  const stackCards = $$(".stack__card");
  if (stackCards.length) {
    const POS = [{ x: 0, y: 0, scale: 1, rotate: 0, filter: "brightness(1)" }, { x: "9%", y: "-15%", scale: 0.9, rotate: 3, filter: "brightness(.6)" }, { x: "18%", y: "-30%", scale: 0.8, rotate: 6, filter: "brightness(.4)" }];
    let order = stackCards.map((_, i) => i);
    const place = (instant) => order.forEach((ci, slot) => {
      const card = stackCards[ci];
      card.style.zIndex = 3 - slot;
      gsap.to(card, { ...POS[slot], duration: instant ? 0 : 1.2, ease: "expo.inOut" });
    });
    place(true);
    gsap.from(stackCards, { y: 80, autoAlpha: 0, rotate: -6, duration: 1.4, stagger: 0.12, ease: expo, delay: 0.6 });
    let timer = null;
    const cycle = () => {
      const front = stackCards[order[0]];
      gsap.timeline()
        .to(front, { y: "28%", x: "-6%", rotate: -8, autoAlpha: 0, duration: 0.6, ease: "power3.in" })
        .add(() => { order.push(order.shift()); place(); })
        .to(front, { autoAlpha: 1, duration: 0.6 }, "+=0.2");
    };
    ScrollTrigger.create({ trigger: ".stack", start: "top bottom", end: "bottom top", onToggle: (s) => { clearInterval(timer); if (s.isActive) timer = setInterval(cycle, 3400); } });
  }
  /* ---------- Hero Lab Software: tarjetas que aparecen sobre el panel ---------- */
  if ($(".appstack")) {
    gsap.from(".appstack .device-browser", { y: 60, autoAlpha: 0, rotateY: -20, duration: 1.6, ease: expo, delay: 0.6 });
    gsap.from(".hcard", { y: 30, scale: 0.85, autoAlpha: 0, duration: 1, stagger: 0.2, ease: "back.out(1.6)", delay: 1.3 });
    gsap.from(".hcard .band__chart i", { scaleY: 0, transformOrigin: "bottom", duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 1.9 });
    if (finePointer) {
      const box = $(".appstack");
      box.parentElement.addEventListener("mousemove", (e) => {
        const r = box.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        $$(".hcard", box).forEach((c, n) => gsap.to(c, { x: dx * (16 + n * 8), y: dy * (12 + n * 5), duration: 1, ease: "power3", overwrite: "auto" }));
      });
    }
  }

  /* ---------- Vitrina del portafolio: la página real se recorre sola; el sistema se acerca con el scroll ---------- */
  $$(".scrollshot").forEach((shot) => {
    const screen = shot.parentElement;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1.4, paused: true, delay: 0.8 })
      .to(shot, { y: () => -(shot.offsetHeight - screen.offsetHeight), duration: 9, ease: "sine.inOut" });
    shot.addEventListener("load", () => { tl.invalidate(); ScrollTrigger.refresh(); });
    ScrollTrigger.create({ trigger: screen, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
    const box = screen.closest(".showcase");
    box.addEventListener("mouseenter", () => gsap.to(tl, { timeScale: 2.4, duration: 0.6 }));
    box.addEventListener("mouseleave", () => gsap.to(tl, { timeScale: 1, duration: 0.6 }));
  });
  $$(".device-phone").forEach((ph) => gsap.fromTo(ph, { y: 50, rotate: 4 }, { y: -30, rotate: -2, ease: "none", scrollTrigger: { trigger: ph.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
  $$(".appshot").forEach((img) => gsap.fromTo(img, { scale: 1 }, { scale: 1.12, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
  $$(".showcase .device-browser").forEach((d) => gsap.fromTo(d, { clipPath: "inset(0% 0% 100% 0% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: d, start: "top 85%" } }));

  /* ---------- Banda final: foto en cortina, tarjetas que aparecen y barras que crecen ---------- */
  if ($(".band__visual")) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".band__panel", start: "top 72%" } });
    tl.fromTo(".band__photo", { clipPath: "inset(100% 0% 0% 0% round 26px)" }, { clipPath: "inset(0% 0% 0% 0% round 26px)", duration: 1.5, ease: "expo.inOut" })
      .fromTo(".band__photo img", { scale: 1.35 }, { scale: 1.06, duration: 2, ease: expo }, 0.2)
      .from(".band__card", { y: 40, scale: 0.85, autoAlpha: 0, duration: 1, stagger: 0.18, ease: "back.out(1.6)" }, 0.9)
      .from(".band__panel .band__chart i", { scaleY: 0, duration: 0.8, stagger: 0.07, ease: "power3.out" }, 1.3)
      .from(".band__ring", { scale: 0.4, autoAlpha: 0, duration: 1.2, ease: expo }, 0.6);
    gsap.fromTo(".band__visual", { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true } });
    if (finePointer) {
      const v = $(".band__visual");
      const cards = $$(".band__card", v);
      v.parentElement.addEventListener("mousemove", (e) => {
        const r = v.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        cards.forEach((c, n) => gsap.to(c, { x: dx * (14 + n * 8), y: dy * (10 + n * 6), duration: 1, ease: "power3", overwrite: "auto" }));
        gsap.to(".band__photo img", { x: dx * -14, y: dy * -10, duration: 1.2, ease: "power3", overwrite: "auto" });
      });
    }
  }

  /* ---------- Wordmark gigante del footer ---------- */
  gsap.from(".footer__big span", { yPercent: 105, duration: 1.6, stagger: 0.07, ease: expo, scrollTrigger: { trigger: ".footer__big", start: "top 98%" } });

  /* ---------- Botones magnéticos ---------- */
  if (finePointer) {
    $$(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, .4)" }));
    });
  }

  /* ---------- Cursor personalizado ---------- */
  if (finePointer) {
    root.classList.add("has-cursor");
    const cursor = $(".cursor");
    const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    addEventListener("mousemove", (e) => { cx(e.clientX); cy(e.clientY); });
    document.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".lab");
      const hot = e.target.closest("a, button, select, input, textarea, label, summary");
      cursor.classList.toggle("is-label", !!card);
      cursor.classList.toggle("is-hover", !card && !!hot);
    });
    document.addEventListener("mouseleave", () => gsap.to(cursor, { autoAlpha: 0, duration: 0.3 }));
    document.addEventListener("mouseenter", () => gsap.to(cursor, { autoAlpha: 1, duration: 0.3 }));
  }

  addEventListener("load", () => ScrollTrigger.refresh());
})();
