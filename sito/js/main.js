// LOOP — interazioni della home
(() => {
  const riduci = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- header: diventa pieno dopo l'hero e si nasconde scorrendo verso il basso ----
  const header = document.getElementById("header");
  let ultimoY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    header.classList.toggle("solido", y > innerHeight * 0.6);
    header.classList.toggle("nascosto", y > ultimoY && y > innerHeight && !document.body.classList.contains("menu-aperto"));
    ultimoY = y;
  }, { passive: true });

  // ---- menu su telefono ----
  const toggle = document.getElementById("menu-toggle");
  const chiudiMenu = () => {
    document.body.classList.remove("menu-aperto");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Apri il menu");
  };
  toggle.addEventListener("click", () => {
    const aperto = document.body.classList.toggle("menu-aperto");
    toggle.setAttribute("aria-expanded", aperto);
    toggle.setAttribute("aria-label", aperto ? "Chiudi il menu" : "Apri il menu");
  });
  document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", chiudiMenu));
  addEventListener("keydown", e => e.key === "Escape" && chiudiMenu());

  // ---- comparse allo scroll ----
  const io = new IntersectionObserver(voci => voci.forEach(v => {
    if (v.isIntersecting) { v.target.classList.add("visto"); io.unobserve(v.target); }
  }), { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".rivela").forEach(el => io.observe(el));

  // ---- il kit: posizioni degli oggetti ----
  const scena = document.getElementById("kit-scena");
  const oggetti = [...scena.querySelectorAll(".ogg")];
  const xy = (el, chiave) => {
    const v = el.dataset[chiave];
    return v ? v.split(",").map(Number) : null;
  };
  const telefono = () => matchMedia("(max-width: 760px)").matches;
  // mette ogni oggetto nella posizione "in scatola" (p) o "fuori" (d)
  function posiziona(stato) {
    const m = telefono();
    oggetti.forEach(el => {
      const pos = xy(el, stato === "p" ? (m ? "pm" : "p") : (m ? "dm" : "d")) || xy(el, m ? "dm" : "d");
      if (!pos) return;
      el.style.left = pos[0] + "%";
      el.style.top = pos[1] + "%";
    });
  }

  // senza GSAP o con animazioni ridotte: kit già aperto, nessun pin
  function statico() {
    scena.classList.add("kit-statico");
    posiziona("d");
    scena.querySelector(".scatola").style.opacity = 0;
    scena.querySelectorAll(".nome").forEach(n => n.style.opacity = 1);
    document.querySelectorAll(".kit-didascalia").forEach((d, i) => d.style.opacity = i === 1 ? 1 : 0);
    document.querySelector(".kit-didascalia:nth-child(2) .h2").textContent = "Cosa c'è nel kit";
  }

  addEventListener("load", () => {
    if (riduci || !window.gsap || !window.ScrollTrigger) return statico();
    gsap.registerPlugin(ScrollTrigger);

    // logo dell'hero: le lettere entrano ruotando, come se cadessero al loro posto
    gsap.from(".hero-logo .lettera", { y: -40, rotation: () => gsap.utils.random(-25, 25), opacity: 0, duration: .9, ease: "back.out(1.6)", stagger: .09 });

    const mm = gsap.matchMedia();
    mm.add({ tel: "(max-width: 760px)", desk: "(min-width: 761px)" }, ctx => {
      const m = ctx.conditions.tel;
      const P = el => xy(el, m ? "pm" : "p");
      const D = el => xy(el, m ? "dm" : "d");
      const gruppo = sel => oggetti.filter(el => el.matches(sel));

      const lastre = gruppo(".lastra");
      const ingredienti = gruppo(".barattolo, .lampadina, .telecomando, .libretto");
      const etichetteIngr = gruppo(".nome-gruppo:not(.lastre-nome)");
      const etichetteLastre = gruppo(".lastre-nome");
      const didascalie = gsap.utils.toArray(".kit-didascalia");

      // GSAP gestisce tutte le trasformazioni: il centramento passa da CSS a xPercent/yPercent
      scena.classList.add("gsap");
      gsap.set(scena.children, { xPercent: -50, yPercent: -50, x: 0, y: 0 });

      // stato iniziale: tutto dentro la scatola chiusa
      [...lastre, ...ingredienti].forEach(el => gsap.set(el, { left: P(el)[0] + "%", top: P(el)[1] + "%", rotation: 0, scale: 1, opacity: 1 }));
      [...etichetteIngr, ...etichetteLastre].forEach(el => gsap.set(el, { left: D(el)[0] + "%", top: D(el)[1] + "%" }));
      gsap.set(scena.querySelectorAll(".nome"), { opacity: 0 });
      gsap.set(".coperchio", { y: 0, rotation: 0, opacity: 1 });
      gsap.set(".scatola", { opacity: 1, scale: 1 });
      gsap.set([".kit-lampada", ".kit-finale"], { opacity: 0 });
      gsap.set(didascalie, { opacity: i => i === 0 ? 1 : 0, y: 0 });

      const cambiaDidascalia = (tl, da, a, t) => {
        tl.to(didascalie[da], { opacity: 0, y: -16, duration: .3 }, t)
          .fromTo(didascalie[a], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .3 }, t + .2);
      };

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: ".kit", pin: ".kit-pin", start: "top top", end: "+=350%", scrub: .6 }
      });

      // 1. il coperchio si solleva e scivola via
      tl.to(".coperchio", { scale: 1.06, duration: .3 }, 0)
        .to(".coperchio", { x: m ? "60%" : "75%", rotation: 8, opacity: 0, duration: .9 }, .25);
      cambiaDidascalia(tl, 0, 1, .9);

      // 2. gli ingredienti escono uno alla volta
      ingredienti.forEach((el, i) => {
        tl.to(el, { left: D(el)[0] + "%", top: D(el)[1] + "%", rotation: gsap.utils.random(-6, 6), duration: 1 }, 1.1 + i * .14);
      });
      tl.to(gruppo(".barattolo, .lampadina, .telecomando, .libretto").map(el => el.querySelector(".nome")).filter(Boolean), { opacity: 1, duration: .4, stagger: .05 }, 2.4)
        .to(etichetteIngr.map(el => el.querySelector(".nome")), { opacity: 1, duration: .4 }, 2.5)
        // la scatola vuota lascia il posto alle lastre
        .to(".scatola", { opacity: 0, scale: .9, duration: .6 }, 2.6);
      cambiaDidascalia(tl, 1, 2, 2.9);

      // 3. le lastre si aprono a ventaglio
      lastre.forEach((el, i) => {
        tl.to(el, { left: D(el)[0] + "%", top: D(el)[1] + "%", rotation: 0, duration: 1 }, 3.0 + i * .08);
      });
      tl.to(etichetteLastre.map(el => el.querySelector(".nome")), { opacity: 1, duration: .4, stagger: .05 }, 4.0);
      cambiaDidascalia(tl, 2, 3, 4.6);

      // 4. le lastre si montano: la lampada compare al centro e si accende
      tl.to([...ingredienti, ...etichetteIngr], { opacity: 0, duration: .5 }, 4.6)
        .to(etichetteLastre, { opacity: 0, duration: .3 }, 4.6)
        .to(lastre, { left: "50%", top: "50%", scale: .5, opacity: 0, duration: .8, stagger: .03 }, 4.7)
        .fromTo(".kit-lampada", { opacity: 0, scale: .7, rotation: -4 }, { opacity: 1, scale: 1, rotation: 0, duration: .8, ease: "back.out(1.4)" }, 5.2)
        .to(".kit-finale", { opacity: 1, duration: .4 }, 5.7)
        .to({}, { duration: .4 }); // una piccola pausa prima che la sezione si sblocchi

      return () => tl.scrollTrigger && tl.scrollTrigger.kill();
    });
  });
})();
