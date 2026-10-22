// LOOP — pagina del kit: il montaggio della lampada in 3D, comandato dallo scroll
// avvia(contenitore) restituisce una funzione monta(p) con p da 0 a 1:
//   0 → 0.22  le otto lastre, impilate come nella scatola, si aprono sul piano (vista dall'alto)
//   0.18 → 0.4  la camera scende di tre quarti
//   0.3 → 0.88  un pezzo alla volta, come nel video: base, lampadina (cade dall'alto), cornici,
//               bioplastica e cornici in ferro, lati, coperchio
//   0.89 → 1    la lampada si accende
import * as THREE from "three";

export function avvia(contenitore) {
  const canvas = document.createElement("canvas");
  if (!(canvas.getContext("webgl2") || canvas.getContext("webgl"))) return null;
  contenitore.append(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 5, 1500);
  const ambiente = new THREE.HemisphereLight(0xffffff, 0xb0a08a, 1.7);
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(18, 40, 26);
  scene.add(ambiente, key);

  // ---- pezzi: misure come la lampada vera (cubo 12 cm, finestra 10 cm) ----
  const S = 12, T = 0.15, W = 10;
  const RIENTRO = 0.7, F = S - 2 * T - 0.04; // le cornici stanno dentro il cubo, arretrate dal bordo
  const giallo = new THREE.MeshStandardMaterial({ color: 0xf3c300, metalness: .05, roughness: .5 });
  // tutta la struttura è verniciata dello stesso colore (anche base e cornici in ferro)
  const ferro = giallo;
  const fessuraMat = new THREE.MeshBasicMaterial({ color: 0x3a3000 });
  const telaioGeo = (esterno, foro, spessore) => {
    const s = new THREE.Shape();
    s.moveTo(-esterno / 2, -esterno / 2); s.lineTo(esterno / 2, -esterno / 2); s.lineTo(esterno / 2, esterno / 2); s.lineTo(-esterno / 2, esterno / 2);
    const h = new THREE.Path();
    h.moveTo(-foro / 2, -foro / 2); h.lineTo(-foro / 2, foro / 2); h.lineTo(foro / 2, foro / 2); h.lineTo(foro / 2, -foro / 2);
    s.holes.push(h);
    const g = new THREE.ExtrudeGeometry(s, { depth: spessore, bevelEnabled: false });
    g.translate(0, 0, -spessore / 2);
    return g;
  };
  const conFessure = (mesh, asse) => {
    for (const k of [1, -1]) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(asse === "y" ? 4.5 : 0.18, asse === "y" ? 0.18 : 4.5, T + 0.02), fessuraMat);
      if (asse === "y") f.position.y = k * 4.4; else f.position.x = k * 4.4;
      mesh.add(f);
    }
    return mesh;
  };
  // ogni pezzo nasce "in piedi" come una lastra nel piano XY (spessore lungo z), poi viene orientato
  const lastra = (w, h, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, T), mat);
  const pezzi = [];
  // fine: posizione e rotazione nel cubo; inizio: quando parte (valore di p);
  // da: da che lato entra (il pezzo si porta lì, fuori dal cubo, e poi scivola al suo posto: niente pezzi che si attraversano)
  const aggiungi = (mesh, pos, rot, inizio, nome, da) => {
    const fine = { p: new THREE.Vector3(...pos), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)) };
    pezzi.push({ mesh, fine, inizio, nome, da: new THREE.Vector3(...da) });
    scene.add(mesh);
  };
  aggiungi(lastra(S - 2 * T - .02, S, ferro), [0, -S / 2 + T / 2, 0], [-Math.PI / 2, 0, 0], 0.3, "base", [0, 9, 0]);
  aggiungi(conFessure(lastra(S, S, giallo), "x"), [S / 2 - T / 2, 0, 0], [0, Math.PI / 2, 0], 0.7, "lato", [16, 0, 0]);
  aggiungi(conFessure(lastra(S, S, giallo), "x"), [-S / 2 + T / 2, 0, 0], [0, Math.PI / 2, 0], 0.76, "lato", [-16, 0, 0]);
  aggiungi(conFessure(lastra(S - 2 * T - .02, S, giallo), "y"), [0, S / 2 - T / 2, 0], [-Math.PI / 2, 0, 0], 0.82, "coperchio", [0, 16, 0]);
  aggiungi(new THREE.Mesh(telaioGeo(F, W, .3), giallo), [0, 0, S / 2 - RIENTRO - .15], [0, 0, 0], 0.43, "cornice", [0, 0, 16]);
  aggiungi(new THREE.Mesh(telaioGeo(F, W, .3), giallo), [0, 0, -S / 2 + RIENTRO + .15], [0, Math.PI, 0], 0.49, "cornice", [0, 0, -16]);
  aggiungi(new THREE.Mesh(telaioGeo(F - .06, W, .12), ferro), [0, 0, S / 2 - RIENTRO + .08], [0, 0, 0], 0.585, "cornice-ferro", [0, 0, 16]);
  aggiungi(new THREE.Mesh(telaioGeo(F - .06, W, .12), ferro), [0, 0, -S / 2 + RIENTRO - .08], [0, Math.PI, 0], 0.645, "cornice-ferro", [0, 0, -16]);

  // bioplastica: compare tra cornice e cornice in ferro
  const tex = new THREE.TextureLoader().load("tex/marmo.webp", () => render());
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const bioMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, opacity: 0 });
  const bio = [S / 2 - RIENTRO + .01, -S / 2 + RIENTRO - .01].map((z, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(W + .4, W + .4), bioMat);
    m.position.z = z; if (i) m.rotation.y = Math.PI;
    scene.add(m);
    return m;
  });

  // lampadina magnetica: cade dall'alto sulla base
  const vetro = new THREE.MeshBasicMaterial({ color: 0xd9d6cf });
  const lampadina = new THREE.Group();
  const piede = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 1.6, 24), new THREE.MeshStandardMaterial({ color: 0xe8e6e1, roughness: .5 }));
  piede.position.y = .8;
  const sfera = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 20), vetro);
  sfera.position.y = 4.2;
  lampadina.add(piede, sfera);
  scene.add(lampadina);

  // ombra e luce finte sul piano (niente ombre in tempo reale)
  const sfumatura = (stops) => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext("2d"), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([o, col]) => g.addColorStop(o, col));
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  };
  const ombra = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.MeshBasicMaterial({ map: sfumatura([[0, "rgba(60,40,10,.35)"], [1, "rgba(60,40,10,0)"]]), transparent: true, depthWrite: false }));
  ombra.rotation.x = -Math.PI / 2; ombra.position.y = -S / 2 - .05;
  const alone = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.MeshBasicMaterial({ map: sfumatura([[0, "rgba(255,200,60,.9)"], [.4, "rgba(255,190,60,.3)"], [1, "rgba(255,190,60,0)"]]), transparent: true, depthWrite: false, opacity: 0 }));
  alone.rotation.x = -Math.PI / 2; alone.position.y = -S / 2 - .04;
  scene.add(ombra, alone);

  // ---- pose di partenza: impilate (come nella scatola) e aperte sul piano in una griglia 4 × 2 ----
  const piatta = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  const GRIGLIA = [[-21, -7.5], [-7, -7.5], [7, -7.5], [21, -7.5], [-21, 7.5], [-7, 7.5], [7, 7.5], [21, 7.5]];
  const ordineGriglia = ["coperchio", "lato", "lato", "base", "cornice", "cornice", "cornice-ferro", "cornice-ferro"];
  const usate = new Set();
  pezzi.forEach((pz, i) => {
    const slot = ordineGriglia.findIndex((n, k) => n === pz.nome && !usate.has(k));
    usate.add(slot);
    pz.pila = new THREE.Vector3(0, -S / 2 + .2 + (7 - slot) * .32, 0);
    pz.slot = slot;
    pz.ritardo = slot * .012;
  });

  // ---- camera: dall'alto (come la scatola) a tre quarti ----
  const camAlto = new THREE.Vector3(0, 125, .01), camFine = new THREE.Vector3(32, 22, 50);
  const guardaAlto = new THREE.Vector3(0, -S / 2, 0), guardaFine = new THREE.Vector3(0, -.5, 0);
  const tmpV = new THREE.Vector3(), tmpA = new THREE.Vector3(), tmpG = new THREE.Vector3(), tmpQ = new THREE.Quaternion();
  const liscio = t => t * t * (3 - 2 * t);
  const tra = (p, a, b) => THREE.MathUtils.clamp((p - a) / (b - a), 0, 1);
  let ultimoP = 0, distanza = 1;
  // griglia 4 × 2 su schermi larghi, 2 × 4 su schermi stretti (telefono)
  function disponi(verticale) {
    pezzi.forEach(pz => {
      const [x, z] = GRIGLIA[pz.slot];
      pz.piano = verticale ? new THREE.Vector3(z, -S / 2 + .2, x) : new THREE.Vector3(x, -S / 2 + .2, z);
    });
  }
  disponi(false);

  function monta(p) {
    ultimoP = p;
    // 1. le lastre si aprono sul piano
    const apri = tra(p, .02, .22);
    // 2. la camera si abbassa
    const cam = liscio(tra(p, .18, .42));
    camera.position.lerpVectors(camAlto, camFine, cam).multiplyScalar(distanza);
    tmpG.lerpVectors(guardaAlto, guardaFine, cam);
    camera.lookAt(tmpG);
    // 3. montaggio, un pezzo alla volta: dal piano si porta fuori dal cubo dal suo lato (girandosi), poi scivola dentro
    pezzi.forEach(pz => {
      const a = liscio(THREE.MathUtils.clamp((apri - pz.ritardo) / .85, 0, 1));
      const k1 = liscio(tra(p, pz.inizio, pz.inizio + .035)), k2 = liscio(tra(p, pz.inizio + .03, pz.inizio + .06));
      tmpV.lerpVectors(pz.pila, pz.piano, a);
      tmpQ.copy(piatta);
      if (k1 > 0) {
        tmpA.copy(pz.fine.p).add(pz.da);          // il punto d'ingresso, fuori dal cubo
        tmpV.lerp(tmpA, k1);
        tmpV.y += Math.sin(Math.PI * k1) * 4;     // un piccolo arco mentre si solleva
        tmpQ.slerp(pz.fine.q, k1);
        if (k2 > 0) tmpV.lerp(pz.fine.p, k2);
      }
      pz.mesh.position.copy(tmpV);
      pz.mesh.quaternion.copy(tmpQ);
    });
    // la lampadina cade sulla base subito dopo la base
    const l = tra(p, .37, .42);
    lampadina.position.set(0, -S / 2 + T + (1 - l * l) * 26, 0);
    lampadina.visible = p > .365;
    // la bioplastica si appoggia sulle cornici, prima delle cornici in ferro
    bioMat.opacity = tra(p, .54, .58);
    // 4. si accende
    const luce = liscio(tra(p, .89, .97));
    vetro.color.setHex(0xd9d6cf).lerp(new THREE.Color(0xfff6dc), luce);
    bioMat.color.setScalar(.55 + .45 * luce);
    alone.material.opacity = luce * .8;
    ambiente.intensity = 1.7 - luce * .3;
    // a lampada finita gira piano su se stessa
    const giro = tra(p, .88, 1) * .9;
    scene.rotation.y = giro;
    render();
  }

  function render() { renderer.render(scene, camera); }
  function resize() {
    const w = contenitore.clientWidth, h = contenitore.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // su schermi stretti la camera si allontana, così la griglia di lastre ci sta tutta
    disponi(camera.aspect < 1);
    distanza = camera.aspect < 1 ? Math.max(1, .95 / camera.aspect) : Math.max(1, 1.5 / camera.aspect);
    camera.updateProjectionMatrix();
    monta(ultimoP);
  }
  new ResizeObserver(resize).observe(contenitore);
  resize();
  return monta;
}
