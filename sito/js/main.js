// LOOP — interazioni comuni a tutte le pagine
(() => {
  const riduci = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const anima = (el, kf, opt) => el ? el.animate(kf, { fill: "both", ...opt }).finished : Promise.resolve();

  // ============================================================
  // VELO: la riga verticale al centro che si apre.
  // - intro (prima visita): il logo si compone, la riga si disegna, poi si apre
  // - cambio pagina: le due metà si chiudono sulla riga, la pagina nuova si apre dalla riga
  // ============================================================
  const velo = $("#velo");
  const sx = velo && $(".velo-meta.sx", velo), dx = velo && $(".velo-meta.dx", velo);
  const riga = velo && $(".velo-riga", velo), logoVelo = velo && $(".velo-logo", velo);
  const APRI = { duration: 1100, easing: "cubic-bezier(.76, 0, .24, 1)" };
  let velaAperto;
  const veloAperto = new Promise(r => velaAperto = r);

  function apriVelo(ritardo = 0) {
    // resta visibile per tutta l'apertura (la classe che lo mostrava viene tolta qui)
    velo.style.visibility = "visible";
    // l'opacità del logo va letta prima di togliere la classe che lo mostra, altrimenti sparisce di colpo
    const opacitaLogo = getComputedStyle(logoVelo).opacity;
    anima(riga, [{ transform: "scaleY(1)" }, { transform: "scaleY(1)" }], { duration: 1 });
    anima(logoVelo, [{ opacity: opacitaLogo, transform: "none" }, { opacity: 0, transform: "scale(.85)" }], { duration: 650, delay: ritardo, easing: "cubic-bezier(.4, 0, .2, 1)" });
    root.classList.remove("velo-arrivo");
    // la riga svanisce insieme al logo: non resta mai da sola a tutta altezza
    anima(riga, [{ transform: "scaleY(1)", opacity: 1 }, { transform: "scaleY(1)", opacity: 0 }], { duration: 450, delay: ritardo, easing: "cubic-bezier(.4, 0, .2, 1)" });
    anima(sx, [{ transform: "none" }, { transform: "translateX(-101%)" }], { ...APRI, delay: ritardo + 300 });
    return anima(dx, [{ transform: "none" }, { transform: "translateX(101%)" }], { ...APRI, delay: ritardo + 300 }).then(() => {
      root.classList.remove("intro-on");
      velo.style.visibility = "hidden";
    });
  }

  if (velo && root.classList.contains("intro-on")) {
    // intro: logo (CSS) → riga che si disegna → apertura
    const inizio = performance.now();
    let partito = false;
    const vai = () => {
      if (partito) return;
      partito = true;
      try { sessionStorage.setItem("loop-intro", "1"); } catch (e) {}
      anima(riga, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 600, easing: "cubic-bezier(.65, 0, .35, 1)" })
        .then(() => { setTimeout(velaAperto, 350); return apriVelo(80); });
    };
    const pronta = new Promise(r => document.readyState === "complete" ? r() : addEventListener("load", r));
    Promise.race([pronta, new Promise(r => setTimeout(r, 3500))])
      .then(() => setTimeout(vai, Math.max(0, 1500 - (performance.now() - inizio))));
    $("#velo-salta").addEventListener("click", vai);
    velo.addEventListener("click", vai);
  } else if (velo && root.classList.contains("velo-arrivo")) {
    // arrivo da un'altra pagina: il velo è chiuso sulla riga e si apre quando la pagina è pronta
    // (se si aprisse subito, una pagina pesante come il 3D bloccherebbe l'animazione a metà)
    let partito = false;
    const apri = () => { if (partito) return; partito = true; requestAnimationFrame(() => requestAnimationFrame(() => apriVelo(60).then(velaAperto))); };
    document.readyState === "complete" ? setTimeout(apri, 150) : addEventListener("load", () => setTimeout(apri, 150));
    setTimeout(apri, 2500);
  } else {
    velaAperto();
  }

  // uscita: clic su un link interno → le due metà si chiudono sulla riga, poi si cambia pagina
  addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || !velo || riduci || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return; // ancore nella stessa pagina: le gestisce lo scroll
    e.preventDefault();
    try { sessionStorage.setItem("loop-velo", "1"); } catch (err) {}
    velo.style.visibility = "visible";
    root.classList.add("velo-uscita");
    const CHIUDI = { duration: 750, easing: "cubic-bezier(.76, 0, .24, 1)" };
    anima(riga, [{ transform: "scaleY(1)", opacity: 0 }, { transform: "scaleY(1)", opacity: 1 }], { duration: 200, delay: 650 });
    anima(logoVelo, [{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: 600, easing: "cubic-bezier(.2,.7,.2,1)" });
    anima(sx, [{ transform: "translateX(-101%)" }, { transform: "none" }], CHIUDI);
    anima(dx, [{ transform: "translateX(101%)" }, { transform: "none" }], CHIUDI).then(() => setTimeout(() => location.href = a.href, 120));
  });
  // tornando indietro con il browser la pagina può essere ripresa dalla cache: riapre il velo
  addEventListener("pageshow", e => { if (e.persisted && velo) { root.classList.remove("velo-uscita"); velo.style.visibility = "hidden"; } });

  // ============================================================
  // SCROLL FLUIDO (Lenis) e header
  // ============================================================
  let lenis = null;
  if (!riduci && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollA = (dest) => lenis ? lenis.scrollTo(dest, { offset: 0 }) : (typeof dest === "number" ? scrollTo({ top: dest, behavior: "smooth" }) : dest.scrollIntoView({ behavior: "smooth" }));
  // ancore interne con lo scroll fluido
  $$('a[href^="#"], a[href^="index.html#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href").split("#")[1];
    const dest = id && document.getElementById(id);
    if (!dest || (a.pathname !== location.pathname && !a.getAttribute("href").startsWith("#"))) return;
    e.preventDefault();
    chiudiMenu();
    scrollA(dest);
  }));
  const su = $("#su");
  if (su) su.addEventListener("click", () => scrollA(0));

  const barra = $("#barra");
  let ultimoY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    if (barra && !root.classList.contains("menu-aperto")) barra.classList.toggle("nascosta", y > ultimoY && y > 200);
    ultimoY = y;
  }, { passive: true });

  // ============================================================
  // MENU A PANNELLO
  // ============================================================
  const bottoneMenu = $("#apri-menu"), menu = $("#menu");
  function chiudiMenu() {
    if (!root.classList.contains("menu-aperto")) return;
    root.classList.remove("menu-aperto");
    bottoneMenu.setAttribute("aria-expanded", "false");
    lenis && lenis.start();
    bottoneMenu.focus({ preventScroll: true });
  }
  if (bottoneMenu && menu) {
    bottoneMenu.addEventListener("click", () => {
      if (root.classList.contains("menu-aperto")) return chiudiMenu();
      root.classList.add("menu-aperto");
      bottoneMenu.setAttribute("aria-expanded", "true");
      barra.classList.remove("nascosta");
      lenis && lenis.stop();
      setTimeout(() => $(".menu-voce", menu).focus({ preventScroll: true }), 500);
    });
    addEventListener("keydown", e => e.key === "Escape" && chiudiMenu());
    // passando su una voce cambia l'immagine di anteprima
    const anteprime = $$(".menu-anteprima img", menu);
    $$(".menu-voce", menu).forEach(v => {
      const mostra = () => anteprime.forEach(img => img.classList.toggle("on", img.dataset.i === v.dataset.img));
      v.addEventListener("mouseenter", mostra);
      v.addEventListener("focus", mostra);
    });
  }

  // ============================================================
  // COMPARSE, COLORI, BIOPLASTICA IN PROSPETTIVA
  // ============================================================
  const io = new IntersectionObserver(voci => voci.forEach(v => {
    if (v.isIntersecting) { v.target.classList.add("visto"); io.unobserve(v.target); }
  }), { rootMargin: "0px 0px -10% 0px" });
  $$(".rivela").forEach(el => io.observe(el));

  // cinque colori: stesso render ricolorato, la bioplastica resta ferma
  const cubo = $("#ls-cubo");
  const bottoniColore = $$("#ls-colori button");
  bottoniColore.forEach((b, i) => b.addEventListener("click", () => {
    $$(":scope > img", cubo).forEach((img, k) => img.classList.toggle("on", k === i));
    bottoniColore.forEach((x, k) => x.setAttribute("aria-pressed", k === i));
  }));

  // la bioplastica è un quadrato messo in prospettiva sulla finestra della cornice (omografia → matrix3d)
  // angoli della finestra nel render (700 × 684): alto-sx, alto-dx, basso-dx, basso-sx
  const FINESTRA = [[225, 179], [626, 132], [605, 530], [234, 608]]; // calibrati a mano con ?calibra
  function omografia(w, h, q) {
    const src = [[0, 0], [w, 0], [w, h], [0, h]], A = [], B = [];
    src.forEach(([u, v], i) => {
      const [x, y] = q[i];
      A.push([u, v, 1, 0, 0, 0, -u * x, -v * x]); B.push(x);
      A.push([0, 0, 0, u, v, 1, -u * y, -v * y]); B.push(y);
    });
    // eliminazione di Gauss
    for (let c = 0; c < 8; c++) {
      let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]];
      for (let r = 0; r < 8; r++) if (r !== c) {
        const f = A[r][c] / A[c][c];
        for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
        B[r] -= f * B[c];
      }
    }
    const [a, b, c, d, e, f, g, hh] = B.map((v, i) => v / A[i][i]);
    return `matrix3d(${a},${d},0,${g},${b},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
  }
  const bio = $("#ls-bio");
  // centro della luce della lampadina, nelle coordinate del render (700 × 684)
  const LUCE = [364, 504]; // calibrata a mano con ?calibra
  const luce = $(".ls-luce");
  const posaLuce = () => { if (luce) { luce.style.left = LUCE[0] / 700 * 100 + "%"; luce.style.top = LUCE[1] / 684 * 100 + "%"; } };
  posaLuce();
  function posaBio() {
    if (!bio || !cubo) return;
    const k = cubo.offsetWidth / 700;
    const cx = 422, cy = 362, g = /calibra/.test(location.search) ? 1 : 1.012; // allarga dell'1,2% dal centro della finestra
    bio.style.transform = omografia(100, 100, FINESTRA.map(([x, y]) => [(cx + (x - cx) * g) * k, (cy + (y - cy) * g) * k]));
  }
  posaBio();
  addEventListener("resize", posaBio);

  // strumento di calibrazione: index.html?calibra → quattro maniglie sugli angoli della bioplastica,
  // si trascinano finché combacia con la cornice e si leggono i numeri da copiare in FINESTRA
  if (bio && cubo && /calibra/.test(location.search)) {
    const pannello = document.createElement("div");
    pannello.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:500;background:#121110;color:#f3c300;font:700 14px monospace;padding:12px 14px;max-width:calc(100vw - 32px)";
    document.body.append(pannello);
    const scrivi = () => pannello.innerHTML = "FINESTRA = " + JSON.stringify(FINESTRA) + "<br>LUCE = " + JSON.stringify(LUCE) + '<br><small style="color:#f4f1ea;font-weight:400">rossi = angoli della bioplastica, giallo = centro della luce. Trascina, oppure clic su uno (bordo/colore blu) e usa le frecce: 1 px, con Maiusc 5 px</small>';
    const maniglie = FINESTRA.map((p, i) => {
      const h = document.createElement("span"); h.className = "maniglia";
      h.style.cssText = "position:absolute;z-index:20;width:6px;height:6px;margin:-3px 0 0 -3px;background:#e8432b;outline:1px solid #fff;cursor:grab;touch-action:none";
      const metti = () => { h.style.left = FINESTRA[i][0] / 700 * 100 + "%"; h.style.top = FINESTRA[i][1] / 684 * 100 + "%"; };
      metti();
      h.addEventListener("pointerdown", e => { e.preventDefault(); h.setPointerCapture(e.pointerId); h.dataset.su = 1; scegli(i); });
      h.addEventListener("pointermove", e => {
        if (!h.dataset.su) return;
        const r = cubo.getBoundingClientRect();
        FINESTRA[i] = [Math.round((e.clientX - r.left) / r.width * 700), Math.round((e.clientY - r.top) / r.height * 684)];
        metti(); posaBio(); scrivi();
      });
      h.addEventListener("pointerup", () => delete h.dataset.su);
      cubo.append(h);
      return h;
    });
    // quinto quadratino (giallo): il centro della luce della lampadina, sempre accesa mentre si calibra
    const hl = document.createElement("span"); hl.className = "maniglia";
    hl.style.cssText = "position:absolute;z-index:21;width:6px;height:6px;margin:-3px 0 0 -3px;background:#f3c300;outline:1px solid #121110;cursor:grab;touch-action:none";
    const mettiLuce = () => { hl.style.left = LUCE[0] / 700 * 100 + "%"; hl.style.top = LUCE[1] / 684 * 100 + "%"; posaLuce(); };
    mettiLuce();
    hl.addEventListener("pointerdown", e => { e.preventDefault(); hl.setPointerCapture(e.pointerId); hl.dataset.su = 1; scegli(4); });
    hl.addEventListener("pointermove", e => {
      if (!hl.dataset.su) return;
      const r = cubo.getBoundingClientRect();
      LUCE[0] = Math.round((e.clientX - r.left) / r.width * 700); LUCE[1] = Math.round((e.clientY - r.top) / r.height * 684);
      mettiLuce(); scrivi();
    });
    hl.addEventListener("pointerup", () => delete hl.dataset.su);
    cubo.append(hl);
    addEventListener("load", () => setTimeout(() => luce.style.cssText += ";opacity:1!important", 500));
    // regolazione fine: clic su un quadratino, poi frecce (1 px) o Maiusc + frecce (5 px)
    let scelto = 0;
    function scegli(i) {
      scelto = i;
      maniglie.forEach((m, k) => m.style.background = k === i ? "#2f7fd0" : "#e8432b");
      hl.style.outlineColor = i === 4 ? "#2f7fd0" : "#121110"; hl.style.outlineWidth = i === 4 ? "2px" : "1px";
    }
    addEventListener("keydown", e => {
      const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!d) return;
      e.preventDefault(); e.stopPropagation();
      const passo = e.shiftKey ? 5 : 1;
      if (scelto === 4) { LUCE[0] += d[0] * passo; LUCE[1] += d[1] * passo; mettiLuce(); scrivi(); return; }
      FINESTRA[scelto] = [FINESTRA[scelto][0] + d[0] * passo, FINESTRA[scelto][1] + d[1] * passo];
      const h = maniglie[scelto];
      h.style.left = FINESTRA[scelto][0] / 700 * 100 + "%"; h.style.top = FINESTRA[scelto][1] / 684 * 100 + "%";
      posaBio(); scrivi();
    }, true);
    setTimeout(() => scegli(0));
    // la bioplastica resta sempre visibile mentre si calibra
    addEventListener("load", () => setTimeout(() => { bio.querySelector("i").style.cssText = "transform:none!important"; posaBio(); }, 500));
    scrivi();
  }

  // divide un testo in parole (per le animazioni parola per parola)
  function dividi(el, classe) {
    const parole = [];
    const giro = nodo => [...nodo.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) return frag.append(t);
          const s = document.createElement("span");
          s.className = classe;
          if (classe === "parola") { const i = document.createElement("span"); i.textContent = t; s.append(i); parole.push(i); }
          else { s.textContent = t; parole.push(s); }
          frag.append(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains("sr")) giro(n);
    });
    giro(el);
    return parole;
  }

  // cursore: un cerchio giallo che segue il mouse con un leggero ritardo;
  // sui link diventa un anello, dove c'è data-cursore si ingrandisce e mostra una parola
  if (!riduci && matchMedia("(pointer: fine)").matches) {
    const c = document.createElement("div");
    c.className = "cursore nascosto";
    c.innerHTML = "<span></span>";
    document.body.append(c);
    const testo = c.firstChild;
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; c.classList.remove("nascosto"); }, { passive: true });
    document.addEventListener("pointerleave", () => c.classList.add("nascosto"));
    const giro = () => {
      cx += (mx - cx) * .16; cy += (my - cy) * .16;
      c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(giro);
    };
    giro();
    addEventListener("pointerover", e => {
      const speciale = e.target.closest("[data-cursore]");
      const link = e.target.closest("a, button, input, summary, [role=button]");
      c.classList.toggle("su-giallo", !!e.target.closest(".piede, .gialla, .nastro, .pill-3d, .btn.giallo, .marchio, .velo, .ls-colori"));
      c.classList.toggle("grande", !!speciale);
      c.classList.toggle("link", !speciale && !!link);
      if (speciale) testo.textContent = speciale.dataset.cursore;
    });
  }

  // galleria: le carte si inclinano in 3D seguendo il mouse, con un riflesso di luce
  if (!riduci && matchMedia("(pointer: fine)").matches) $$(".galleria figure").forEach(f => {
    f.addEventListener("pointermove", e => {
      const r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      f.classList.add("inclinata");
      f.style.transform = `rotateY(${(x - .5) * 6}deg) rotateX(${(.5 - y) * 5}deg) scale(1.01)`;
      f.style.setProperty("--gx", x * 100 + "%");
      f.style.setProperty("--gy", y * 100 + "%");
    });
    f.addEventListener("pointerleave", () => { f.classList.remove("inclinata"); f.style.transform = ""; });
  });

  // foto a tutto schermo: clic su una foto della galleria o delle due luci; frecce per scorrere, Esc per chiudere
  const apribili = $$(".galleria figure, .apribile");
  if (apribili.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-label", "Foto");
    lb.innerHTML = '<img alt=""><button class="chiudi">Chiudi ✕</button><button class="prec" aria-label="Foto precedente">←</button><button class="succ" aria-label="Foto successiva">→</button><p class="conta"></p>';
    document.body.append(lb);
    const img = $("img", lb), conta = $(".conta", lb);
    let gruppo = [], n = 0;
    const mostra = k => {
      n = (k + gruppo.length) % gruppo.length;
      const src = gruppo[n].querySelector("img");
      img.src = src.currentSrc || src.src; img.alt = src.alt;
      conta.textContent = gruppo.length > 1 ? `${n + 1} / ${gruppo.length}` : "";
      $(".prec", lb).hidden = $(".succ", lb).hidden = gruppo.length < 2;
    };
    const chiudi = () => { lb.classList.remove("aperta"); lenis && lenis.start(); };
    apribili.forEach(f => f.addEventListener("click", e => {
      if (e.target.closest("a")) return;
      gruppo = f.closest(".galleria") ? $$(".galleria figure") : $$(".apribile");
      mostra(gruppo.indexOf(f));
      lb.classList.add("aperta");
      lenis && lenis.stop();
      $(".chiudi", lb).focus({ preventScroll: true });
    }));
    $(".chiudi", lb).addEventListener("click", chiudi);
    $(".prec", lb).addEventListener("click", e => { e.stopPropagation(); mostra(n - 1); });
    $(".succ", lb).addEventListener("click", e => { e.stopPropagation(); mostra(n + 1); });
    lb.addEventListener("click", e => { if (e.target === lb) chiudi(); });
    addEventListener("keydown", e => {
      if (!lb.classList.contains("aperta")) return;
      if (e.key === "Escape") chiudi();
      if (e.key === "ArrowLeft") mostra(n - 1);
      if (e.key === "ArrowRight") mostra(n + 1);
    });
  }

  // hero: il cursore è una luce calda
  const hero = $("#hero");
  if (hero && !riduci) hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--x", ((e.clientX - r.left) / r.width * 100) + "%");
    hero.style.setProperty("--y", ((e.clientY - r.top) / r.height * 100) + "%");
  });

  // ============================================================
  // ANIMAZIONI CON GSAP
  // ============================================================
  addEventListener("load", () => {
    posaBio();
    if (riduci || !window.gsap || !window.ScrollTrigger) {
      $$(".ls-nota").forEach(n => n.style.opacity = 1);
      if (bio) bio.querySelector("i").style.transform = "none";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) { lenis.on("scroll", ScrollTrigger.update); }

    // hero: il titolo sale riga per riga quando il velo si apre; scorrendo la foto si allontana
    if (hero) {
      const righe = $$(".hero-titolo .riga > span");
      gsap.set(righe, { yPercent: 110 });
      gsap.set([".hero .etichetta", ".hero-sotto", ".bollino"], { opacity: 0, y: 20 });
      veloAperto.then(() => {
        gsap.to(righe, { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: .1 });
        gsap.to([".hero .etichetta", ".hero-sotto", ".bollino"], { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: .1, delay: .3 });
        gsap.fromTo(".hero-media img", { scale: 1.15 }, { scale: 1, duration: 2.2, ease: "power3.out" });
      });
      gsap.to(".hero-media", { yPercent: 18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-testo", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    }

    // titoli grandi: le parole salgono da sotto una maschera
    $$(".intesta .h2, .titolo-anim").forEach(h => {
      h.classList.remove("rivela", "visto");
      const parole = dividi(h, "parola");
      const parte = () => gsap.from(parole, { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .06, scrollTrigger: { trigger: h, start: "top 88%" } });
      h.classList.contains("titolo-anim") ? (gsap.set(parole, { yPercent: 110 }), veloAperto.then(() => gsap.to(parole, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: .06 }))) : parte();
    });

    // manifesto: le parole si accendono man mano che si scende
    const man = $(".manifesto-testo");
    if (man) {
      const parole = dividi(man, "m-parola");
      gsap.to(parole, { opacity: 1, ease: "none", stagger: .1, scrollTrigger: { trigger: man, start: "top 80%", end: "bottom 45%", scrub: true } });
    }

    // foto con parallasse
    $$(".parallasse img").forEach(img => {
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // pulsante del footer: si avvicina al cursore (magnete)
    $$("[data-magnete]").forEach(el => {
      const xTo = gsap.quickTo(el, "x", { duration: .6, ease: "power3" }), yTo = gsap.quickTo(el, "y", { duration: .6, ease: "power3" });
      el.parentElement.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (d < 220) { xTo((e.clientX - cx) * .35); yTo((e.clientY - cy) * .35); } else { xTo(0); yTo(0); }
      });
      el.parentElement.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });

    const mm = gsap.matchMedia();

    // galleria: su schermi larghi scorre in orizzontale mentre si scende
    const galleria = $(".galleria");
    if (galleria) mm.add("(min-width: 901px)", () => {
      galleria.classList.add("orizzontale");
      const sezione = galleria.closest("section");
      const distanza = () => galleria.scrollWidth - innerWidth + 48;
      const tw = gsap.to(galleria, { x: () => -distanza(), ease: "none",
        scrollTrigger: { trigger: sezione, start: "top top", end: () => "+=" + distanza(), pin: true, scrub: .8, invalidateOnRefresh: true } });
      return () => { tw.scrollTrigger.kill(); tw.kill(); gsap.set(galleria, { x: 0 }); galleria.classList.remove("orizzontale"); };
    });

    // ---- la lampada: il cubo resta fermo e i dettagli si accendono uno alla volta ----
    const ls = $(".ls");
    if (ls && cubo) mm.add({ tel: "(max-width: 900px)", desk: "(min-width: 901px)" }, ctx => {
      ls.classList.add("attiva");
      posaBio(); posaLuce();
      const passi = gsap.utils.toArray(".ls-passo");
      const pallini = $$(".ls-avanzamento i");
      const quote = $$(".ls-segni .quote path"), testiQuote = $$(".ls-segni .quote text");
      const richiami = n => $$(`.ls-segni .richiamo[data-passo="${n}"]`);
      const note = n => $$(`.ls-nota[data-passo="${n}"]`);
      const linee = $$(".ls-segni path");
      linee.forEach(p => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
      gsap.set([testiQuote, ".ls-segni circle", ".ls-nota"], { opacity: 0 });
      gsap.set(passi, { autoAlpha: (i) => i === 0 ? 1 : 0, y: 0 });

      // avvicina il cubo a un punto (in % del render), senza perderlo di vista
      const zoom = (fx, fy, s) => ({ scale: s, xPercent: -(fx - 50) * (s - 1) * .9, yPercent: -(fy - 50) * (s - 1) * .9 });
      const mostra = (n, t) => tl
        .to(richiami(n).map(g => g.querySelector("path")), { strokeDashoffset: 0, duration: .5, stagger: .1 }, t)
        .to(richiami(n).map(g => g.querySelector("circle")), { opacity: 1, duration: .2, stagger: .1 }, t)
        .fromTo(note(n), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3, stagger: .1 }, t + .35);
      const nascondi = (n, t) => tl.to([...richiami(n), ...note(n)], { opacity: 0, duration: .3 }, t);

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: {
          trigger: ls, pin: ".ls-pin", start: "top top", end: "+=" + (ctx.conditions.tel ? 380 : 440) + "%", scrub: .8,
          onUpdate: self => {
            const i = Math.min(4, Math.floor(self.progress * 5));
            pallini.forEach((p, k) => p.classList.toggle("on", k === i));
          }
        }
      });
      const cambia = (da, a, t) => tl
        .to(passi[da], { autoAlpha: 0, y: -30, duration: .4 }, t)
        .fromTo(passi[a], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .5 }, t + .3);

      // 0. le quote si disegnano: 12 cm per lato
      tl.to(quote, { strokeDashoffset: 0, duration: .8, stagger: .15 }, .1)
        .to(testiQuote, { opacity: 1, duration: .3, stagger: .2 }, .6)
        .to({}, { duration: .4 });
      // 1. incastri
      cambia(0, 1, 1.2);
      tl.to(".ls-segni .quote", { opacity: 0, duration: .4 }, 1.2)
        .to(cubo, zoom(45, 45, 1.06), 1.2);
      mostra(1, 1.6);
      // 2. base in ferro: la lampadina si accende dentro
      cambia(1, 2, 2.6);
      nascondi(1, 2.6);
      tl.to(cubo, zoom(59, 60, 1.08), 2.6);
      mostra(2, 3.0);
      tl.to(".ls-luce", { opacity: 1, duration: .6 }, 3.2)
        .to(".ls-alone", { opacity: .6, duration: .6 }, 3.3);
      // 3. la bioplastica scende nella cornice
      cambia(2, 3, 4.1);
      nascondi(2, 4.1);
      tl.to(cubo, zoom(50, 45, 1.03), 4.1)
        .to(".ls-bio i", { yPercent: 101, duration: 1, ease: "power3.out" }, 4.4)
        .to(bio, { "--accesa": 1, duration: .6 }, 5.1)
        .to(".ls-alone", { opacity: 1, duration: .5 }, 5.1);
      mostra(3, 4.9);
      // 4. i colori: si scelgono a mano, il cubo torna intero
      cambia(3, 4, 5.9);
      nascondi(3, 5.9);
      tl.to(cubo, { scale: 1, xPercent: 0, yPercent: 0 }, 5.9)
        .to({}, { duration: .8 });

      return () => { ls.classList.remove("attiva"); tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); gsap.set([cubo, ...passi, ".ls-bio i", ".ls-luce", ".ls-alone", ".ls-nota", ...linee], { clearProps: "all" }); };
    });

    // dopo aver caricato font e immagini le misure cambiano: ricalcola i trigger
    setTimeout(() => ScrollTrigger.refresh(), 300);
  });
})();
