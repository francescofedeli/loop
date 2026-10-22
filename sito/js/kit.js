// LOOP — pagina del kit: la scatola si apre allo scroll, poi la lampada si monta in 3D (js/kit3d.js)
// Oggetti disegnati in SVG, vista dall'alto. Le posizioni "dentro" vengono dalla foto della scatola
// aperta (IMG_9069): frazioni della scatola, x da sinistra e y dall'alto, diametro in frazioni della larghezza.
(() => {
  const scena = document.getElementById("kit-scena");
  if (!scena) return;

  // ---- disegni ----
  const latta = testo => `<svg class="forma" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="49" fill="url(#k-bordo)"/>
    <circle cx="50" cy="50" r="45" fill="url(#k-coperchio)"/>
    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,.18)" stroke-width=".8"/>
    <circle cx="50" cy="50" r="40.5" fill="none" stroke="rgba(255,255,255,.6)" stroke-width=".7"/>
    <circle cx="50" cy="50" r="25" fill="#f8f6f0" stroke="rgba(0,0,0,.08)"/>
    <text x="50" y="53.2" text-anchor="middle" font-family="Lemon Milk, sans-serif" font-weight="700" font-size="${testo.length > 7 ? 7 : 8.4}" fill="#121110">${testo}</text>
  </svg>`;
  // boccetta vista dall'alto: tappo a vite, attorno si vede il vetro con il colorante
  const boccetta = colore => `<svg class="forma" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="${colore}"/>
    <circle cx="50" cy="50" r="48" fill="url(#k-vetro)"/>
    <circle cx="50" cy="50" r="34" fill="url(#k-bordo)"/>
    <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="3" stroke-dasharray="1.4 1.6"/>
    <circle cx="50" cy="50" r="27" fill="url(#k-coperchio)"/>
  </svg>`;
  const lampadina = () => `<svg class="forma" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="url(#k-bulbo)"/>
    <ellipse cx="36" cy="30" rx="16" ry="9" fill="#fff" opacity=".7" transform="rotate(-35 36 30)"/>
  </svg>`;
  const telecomando = () => {
    const tasti = ["#f3c300", "#e8432b", "#d63a2a", "#3f9d4a", "#2f7fd0", "#f0601c", "#8a4fc0", "#3fb8c9"];
    return `<svg class="forma" viewBox="0 0 110 34">
      <rect x="0" y="0" width="110" height="34" rx="7" fill="url(#k-plastica)" stroke="rgba(0,0,0,.12)"/>
      <rect x="6" y="11" width="12" height="12" rx="3" fill="#121110"/>
      ${tasti.map((c, i) => `<circle cx="${28 + (i % 4) * 11}" cy="${i < 4 ? 11 : 23}" r="4" fill="${c}"/>`).join("")}
      <rect x="76" y="7" width="28" height="20" rx="4" fill="none" stroke="rgba(0,0,0,.12)"/>
      <circle cx="90" cy="17" r="5.5" fill="#e9e7e1" stroke="rgba(0,0,0,.15)"/>
    </svg>
    <svg class="taglio" viewBox="0 0 110 34" aria-hidden="true"><rect x="0" y="13" width="110" height="8" rx="3" fill="url(#k-plastica)" stroke="rgba(0,0,0,.18)"/><rect x="2" y="16" width="106" height="1.5" fill="rgba(0,0,0,.08)"/></svg>`;
  };
  const libretto = () => `<svg class="forma" viewBox="0 0 148 105">
    <rect x="3" y="3" width="145" height="102" fill="#e6e2d8"/>
    <rect x="0" y="0" width="145" height="102" fill="#fbfaf6" stroke="rgba(0,0,0,.08)"/>
    <rect x="0" y="0" width="7" height="102" fill="#f3c300"/>
    <rect x="22" y="18" width="44" height="44" fill="#121110"/>
    <svg x="26" y="22" width="36" height="36" viewBox="0 0 129.04 131.47" color="#fbfaf6"><use href="#logo"/></svg>
    <text x="22" y="80" font-family="Lemon Milk, sans-serif" font-weight="700" font-size="9" fill="#121110">ISTRUZIONI</text>
    <text x="22" y="91" font-family="Garet, sans-serif" font-size="6.5" fill="#6d6a64">ricette e montaggio</text>
  </svg>`;
  // pila di lastre vista dall'alto: si vede la prima (coperchio, con le fessure) e i bordi delle altre
  const lastre = () => `<svg class="forma" viewBox="-4 -4 112 112">
    ${[6, 4.5, 3, 1.5].map(o => `<rect x="${o}" y="${o}" width="100" height="100" fill="#8d8b86"/>`).join("")}
    <rect x="0" y="0" width="100" height="100" fill="url(#k-alu)" stroke="rgba(0,0,0,.2)" stroke-width=".6"/>
    <rect x="14" y="30" width="2.4" height="40" fill="rgba(0,0,0,.45)"/><rect x="83.6" y="30" width="2.4" height="40" fill="rgba(0,0,0,.45)"/>
  </svg>`;

  // ---- oggetti ----
  // dentro: [fx, fy] e diametro/larghezza d in frazioni della scatola; rot = rotazione nella scatola
  // fuori: d = desktop, dm = telefono, in % della scena
  const O = [
    { k: "latta", svg: latta("PECTINA"), nome: "Pectina", g: "base", f: [.660, .191], d: .426, out: [13, 30], outm: [17, 62] },
    { k: "latta", svg: latta("GLICERINA"), nome: "Glicerina", g: "base", f: [.285, .388], d: .404, out: [27, 30], outm: [41, 62] },
    { k: "boccetta", svg: boccetta("#e3a90c"), nome: "Curcuma", g: "colori", f: [.311, .122], d: .162, out: [11, 63], outm: [10, 77] },
    { k: "boccetta", svg: boccetta("#a3123a"), nome: "Barbabietola", g: "colori", f: [.145, .209], d: .162, out: [25, 63], outm: [30, 77] },
    { k: "boccetta", svg: boccetta("#2f6fd0"), nome: "Spirulina blu", g: "colori", f: [.787, .375], d: .162, out: [11, 82], outm: [10, 89] },
    { k: "boccetta", svg: boccetta("#3a6b25"), nome: "Spirulina", g: "colori", f: [.621, .457], d: .162, out: [25, 82], outm: [30, 89] },
    { k: "lampadina", svg: lampadina(), nome: "Lampadina", sotto: "magnetica", g: "luce", f: [.302, .729], d: .477, out: [78, 30], outm: [67, 62] },
    { k: "telecomando", svg: telecomando(), nome: "Telecomando", g: "luce", f: [.694, .720], d: .6, rot: 110, out: [82, 58], rotOut: 0, outm: [70, 79], rotOutm: 0 },
    // sotto il separè: libretto in basso, la pila di lastre in alto
    { k: "libretto", svg: libretto(), nome: "Libretto", sotto: "istruzioni", g: "libretto", f: [.5, .78], d: .58, rot: 90, out: [82, 80], dOut: .55, rotOut: -4, outm: [70, 92], rotOutm: -3 },
    { k: "lastre", svg: lastre(), g: "lastre", f: [.5, .29], d: .9 },
  ];
  // la scatola in % della scena: desktop al centro, telefono in alto (gli oggetti escono sotto)
  const SCATOLA = { desk: { cx: 50, cy: 52, w: 23 }, tel: { cx: 50, cy: 31, w: 46 } };
  const ASPETTO = { desk: 16 / 9, tel: 9 / 16 }; // larghezza / altezza della scena
  const RAPPORTO = 23.3 / 12.6; // altezza / larghezza della scatola

  const el = (html, cls) => { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; return d; };
  const scatola = el('<div class="fondo-scatola"></div>', "scatola");
  const inserto = el('<div class="piano"></div><div class="parete"></div>', "inserto");
  const coperchio = el('<div class="marchio-scatola"><svg viewBox="0 0 129.04 131.47"><use href="#logo"/></svg></div>', "coperchio");
  scena.append(scatola);
  const oggetti = O.map(o => {
    const e = el(o.svg + (o.nome ? `<p class="nome">${o.nome}${o.sotto ? `<small>${o.sotto}</small>` : ""}</p>` : ""), "ogg " + o.k);
    e._ = o;
    return e;
  });
  // ordine: lastre e libretto sotto il separè, poi il separè, poi gli oggetti, il coperchio sopra
  oggetti.filter(e => ["lastre", "libretto"].includes(e._.g)).forEach(e => scena.append(e));
  scena.append(inserto);
  oggetti.filter(e => !["lastre", "libretto"].includes(e._.g)).forEach(e => scena.append(e));
  scena.append(coperchio);
  // i fori nel separè, dove stanno latte, boccette e lampadina
  O.filter(o => ["base", "colori"].includes(o.g) || o.k === "lampadina").forEach(o => {
    const f = document.createElement("i"); f.className = "foro";
    f.style.left = o.f[0] * 100 + "%";
    f.style.top = o.f[1] * 100 + "%";
    f.style.width = o.d * 104 + "%";
    f.style.aspectRatio = "1";
    inserto.append(f);
  });
  // il telecomando sta in piedi, infilato di taglio in una fessura larga quanto il suo spessore
  const tc = O.find(o => o.k === "telecomando"), fessura = document.createElement("i");
  fessura.className = "fessura";
  Object.assign(fessura.style, { left: tc.f[0] * 100 + "%", top: tc.f[1] * 100 + "%", width: tc.d * 104 + "%", transform: `translate(-50%, -50%) rotate(${tc.rot}deg)` });
  inserto.append(fessura);

  // posizioni dentro la scatola, in % della scena
  const dentro = (o, m) => {
    const b = SCATOLA[m ? "tel" : "desk"], h = b.w * RAPPORTO * ASPETTO[m ? "tel" : "desk"];
    return [b.cx + (o.f[0] - .5) * b.w, b.cy + (o.f[1] - .5) * h];
  };
  const larghezza = (o, m, fuori) => (fuori && o.dOut ? o.dOut : o.d) * SCATOLA[m ? "tel" : "desk"].w;

  const tel = () => matchMedia("(max-width: 760px)").matches;
  // subito, prima che arrivi GSAP: ogni oggetto al suo posto nella scatola
  function inScatola() {
    const m = tel();
    oggetti.forEach(e => {
      const [x, y] = dentro(e._, m);
      Object.assign(e.style, { left: x + "%", top: y + "%", width: larghezza(e._, m) + "%", transform: `translate(-50%, -50%) rotate(${e._.rot || 0}deg)` });
    });
  }
  inScatola();
  const didascalie = [...document.querySelectorAll(".kit-didascalia")];
  const finale = document.getElementById("kit-finale");

  // senza GSAP o con animazioni ridotte: tutto già fuori dalla scatola, niente pin
  function statico() {
    const m = tel();
    scena.classList.add("kit-statico");
    oggetti.forEach(e => {
      const o = e._, pos = o.out ? (m ? o.outm : o.out) : dentro(o, m);
      Object.assign(e.style, { left: pos[0] + "%", top: pos[1] + "%", width: larghezza(o, m, !!o.out) + "%" });
    });
    scena.querySelectorAll(".nome").forEach(n => n.style.opacity = 1);
    Object.assign(finale.style, { opacity: 1, visibility: "visible" });
  }

  addEventListener("load", () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap || !window.ScrollTrigger) return statico();
    gsap.registerPlugin(ScrollTrigger);

    // il montaggio 3D si carica quando la pagina è pronta (three.js solo qui, non in home)
    let monta = null, pMontaggio = 0;
    const carica3d = () => import("./kit3d.js").then(m => {
      monta = m.avvia(document.getElementById("kit-3d"));
      if (monta) monta(pMontaggio);
    }).catch(() => {});
    setTimeout(carica3d, 800);

    const mm = gsap.matchMedia();
    mm.add({ tel: "(max-width: 760px)", desk: "(min-width: 761px)" }, ctx => {
      const m = ctx.conditions.tel;
      const gruppo = g => oggetti.filter(e => e._.g === g);
      const nomi = g => gruppo(g).map(e => e.querySelector(".nome")).filter(Boolean);

      scena.classList.add("gsap");
      gsap.set(scena.children, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
      oggetti.forEach(e => {
        const [x, y] = dentro(e._, m);
        gsap.set(e, { left: x + "%", top: y + "%", width: larghezza(e._, m) + "%", rotation: e._.rot || 0, opacity: 1, scale: 1 });
        if (e._.k === "telecomando") gsap.set(e.querySelector(".forma"), { opacity: 0, scaleY: .15 });
      });
      gsap.set(scena.querySelectorAll(".nome"), { opacity: 0 });
      gsap.set(coperchio, { opacity: 1, scale: 1, rotation: 0, y: 0, x: 0 });
      gsap.set([scatola, inserto], { opacity: 1, scale: 1, y: 0 });
      gsap.set(didascalie, { opacity: (i) => i === 0 ? 1 : 0, y: 0 });
      gsap.set("#kit-3d", { opacity: 0 });
      gsap.set(finale, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: ".kit", pin: ".kit-pin", start: "top top", end: "+=" + (m ? 1100 : 1300) + "%", scrub: 1.2 }
      });
      tl.to(".kit-barra i", { scaleX: 1, ease: "none", duration: 14.5 }, 0);
      const didascalia = (a, t) => tl
        .to(didascalie.filter((_, i) => i !== a), { opacity: 0, y: -14, duration: .3 }, t)
        .fromTo(didascalie[a], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4 }, t + .25);
      // un gruppo esce dalla scatola e va al suo posto, sempre fuori dalla scatola
      const esce = (g, t, attenua = []) => {
        gruppo(g).forEach((e, i) => {
          const o = e._, pos = m ? o.outm : o.out, rot = m ? (o.rotOutm ?? 0) : (o.rotOut ?? 0);
          tl.to(e, { left: pos[0] + "%", top: pos[1] + "%", width: larghezza(o, m, true) + "%", rotation: rot, duration: 1.1 }, t + i * .12);
          // il telecomando esce dalla fessura e si gira a faccia in su
          if (o.k === "telecomando") tl.to(e.querySelector(".taglio"), { opacity: 0, duration: .3 }, t + .5)
            .to(e.querySelector(".forma"), { opacity: 1, scaleY: 1, duration: .6, ease: "power2.out" }, t + .5);
        });
        tl.to(nomi(g), { opacity: 1, duration: .4, stagger: .05 }, t + .9);
        if (attenua.length) tl.to(attenua.flatMap(gruppo), { opacity: .4, duration: .5 }, t);
      };

      // 1. la scatola chiusa, ferma un attimo
      tl.to({}, { duration: .6 });
      // 2. il coperchio si solleva e scivola via
      didascalia(1, .5);
      tl.to(coperchio, { scale: 1.06, duration: .6, ease: "power1.out" }, .7)
        .to(coperchio, { y: "-120%", x: m ? "40%" : "60%", rotation: -8, opacity: 0, duration: 1.2 }, 1.3);
      // 3–5. gli oggetti escono un gruppo alla volta
      didascalia(2, 2.4); esce("base", 2.6);
      didascalia(3, 3.8); esce("colori", 4.0, ["base"]);
      didascalia(4, 5.2); esce("luce", 5.4, ["base", "colori"]);
      // 6. il separè si solleva: sotto ci sono istruzioni e struttura
      didascalia(5, 6.6);
      tl.to(gruppo("luce"), { opacity: .4, duration: .5 }, 6.6)
        .to(inserto, { scale: 1.04, duration: .4, ease: "power1.out" }, 6.8)
        .to(inserto, { y: "-115%", opacity: 0, duration: 1.1 }, 7.2);
      // 7. il libretto esce
      didascalia(6, 8.0); esce("libretto", 8.2);
      // 8–10. la struttura: si passa al 3D, le lastre si aprono e si montano
      didascalia(7, 9.4);
      tl.to([scatola, ...oggetti], { opacity: 0, duration: .6 }, 9.4)
        .to("#kit-3d", { opacity: 1, duration: .6 }, 9.5);
      const proxy = { p: 0 };
      tl.to(proxy, { p: 1, duration: 4.4, ease: "none", onUpdate: () => { pMontaggio = proxy.p; monta && monta(proxy.p); } }, 9.6);
      didascalia(8, 11.0);
      didascalia(9, 13.5);
      tl.to(finale, { autoAlpha: 1, duration: .4 }, 13.95)
        .to({}, { duration: .5 });

      return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); };
    });
  });
})();
