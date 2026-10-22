# LOOP — stato del progetto

_Ultimo aggiornamento: 2026-10-22_

## Idea del sito

Sito interattivo, moderno e bello per presentare LOOP e chi l'ha progettato.

1. **Hero** — lampada LOOP in 3D, ruotabile, accendibile.
2. **Configuratore** — scegli la bioplastica (texture vere) e vedi la lampada cambiare; impila 2–3 cubi.
3. **La scatola allo scroll** — scorrendo il coperchio si apre, escono uno alla volta gli elementi (glicerina, pectina, coloranti, struttura, lampadina, telecomando) con etichette; alla fine la struttura si monta e la lampada si accende.
4. **Ricette** — schede delle bioplastiche (ingredienti, dosi, procedimento, foto del campione), filtrabili per colore/texture.
5. **Il perché** — estratto dell'abstract (plastica, educazione, kit dell'infanzia).
6. **Chi sono** — percorso, contatti.

## Reference

- 3D / atmosfera: [Igloo Inc](https://www.igloo.inc), [Lusion](https://lusion.co), [Bruno Simon](https://bruno-simon.com), [Active Theory](https://activetheory.net) — solo come ispirazione, sono molto più pesanti di quanto vogliamo.
- Configuratori: [Nike By You](https://www.nike.com/it/nike-by-you), [Porsche](https://configurator.porsche.com)
- Scroll prodotto: [Apple AirPods Pro](https://www.apple.com/it/airpods-pro/), [Nothing](https://nothing.tech)
- Archivi: [Awwwards 3D](https://www.awwwards.com/websites/3d/), [GSAP Showcase](https://gsap.com/showcase/), [Spline Community](https://spline.design/community)
- Materiali/ricette: [Materiom](https://materiom.org), [Atelier Luma](https://atelier-luma.org)

## Decisioni

- 2026-10-22 — Priorità al prodotto (lampada = oggetto di design); ricette presenti ma secondarie.
- 2026-10-22 — Primo mockup statico (`mockup/`) scartato: troppo "pagina prodotto standard", serve più interazione e più bellezza.
- 2026-10-22 — Lampada 3D con Three.js costruita nel codice; scatola allo scroll con CSS/GSAP (non una seconda scena 3D) per restare leggeri.
- 2026-10-22 — Ottimizzazione del 3D è un requisito fondamentale (vedi vincoli in CLAUDE.md).
- 2026-10-22 — Codice sincronizzato tramite GitHub per lavorare da più computer.
- 2026-10-22 — Font: **Lemon Milk** per logo e titoli, **Garet** per il resto (come nella tesi). Nessuno dei due è su Google Fonts: inclusi come file .woff2. Licenze: il sito è per uso personale, quindi le versioni gratuite vanno bene (da rivedere solo se in futuro diventa commerciale).

## Fatto

- [x] 2026-10-22 — Ricerca reference e direzione di stile
- [x] 2026-10-22 — Mockup statico della home (scartato)
- [x] 2026-10-22 — Setup repository git e file di progetto

## Da fare

### Materiali (dall'utente)
- [ ] Foto lampada da più lati e base in ferro
- [x] 2026-10-22 — Misure: cubo perfetto 12 × 12 × 12 cm; cornice in ferro larga 1 cm → finestra bioplastica ~10 × 10 cm
- [ ] Foto frontali e piatte di 4–6 pannelli di bioplastica (per le texture 3D)
- [ ] Foto scatola chiusa, aperta e dei singoli oggetti
- [x] 2026-10-22 — Nome dei font (Lemon Milk + Garet)
- [x] 2026-10-22 — Font scaricati (versioni gratuite da dafont) e convertiti in `font/`: Lemon Milk Regular/Medium/Bold (solo maiuscole; gratuito per uso personale/educativo, donazione per uso commerciale — vedi `font/LemonMilk-LICENZA.txt`), Garet Book/Heavy
- [x] 2026-10-22 — Logo vettoriale estratto dall'abstract PDF → `logo/loop-logo.svg` (1,3 KB, colore = `currentColor`)
- [x] 2026-10-22 — Foto struttura smontata (provvisoria): `immagini/struttura-lampada.jpeg`. Pezzi: striscia a U (3 pannelli con incastri, centrale con 2 fessure), pannello singolo con 2 fessure (base/coperchio), 2 telai con calamite, 2 cornici sottili in ferro
- [ ] Foto definitive dei singoli pezzi della struttura
- [ ] PDF della tesi
- [ ] Ricette delle bioplastiche
- [ ] Eventuali file 3D (.glb / .obj / .stl) dalla tesi
- [ ] Testi e foto per "Chi sono"

### Idee emerse dal materiale della tesi (da confermare)
- [x] 2026-10-22 — Configuratore anche per il **colore della struttura** (alluminio, nero, bianco, giallo, arancione): aggiunto nella bozza 3D
- [ ] Animazione "esploso" della struttura allo scroll, basata sui render esplosi
- [ ] Sezione ricette costruita dai dati della tesi (pp. 57–150)
- [ ] Valutare: modello Rhino (.obj) compresso vs lampada costruita nel codice

### Sviluppo
- [ ] Collegare il repository a GitHub (creare repo su github.com e fare push)
- [ ] Scegliere lo stack (proposta: Vite + Three.js + GSAP, sito statico)
- [x] 2026-10-22 — Bozza lampada 3D: `prototipi/lampada-3d.html` (Three.js da CDN, rotazione, accesa/spenta, 2 texture provvisorie, impila 3 cubi, alone colorato, ombra finta, render solo se visibile, fallback foto). Si apre con un server locale: `python3 -m http.server 8765` dalla cartella del progetto → http://localhost:8765/prototipi/lampada-3d.html
- [x] 2026-10-22 — Bozza 3D migliorata: bagliore dinamico (alone che segue la finestra + controluce + pozza di luce sul pavimento), 4 texture vere dalle foto (`prototipi/tex/*.webp`, ~50 KB l'una), 5 colori struttura dai render, fessure degli incastri che si illuminano, inquadratura automatica (1 o 3 cubi, desktop e telefono), fallback con foto vera. Verificata con Playwright.
- [ ] Lampada 3D: rifinitura (calamite, lampadina visibile, transizioni tra texture/colori, base in ferro)
- [ ] Configuratore texture bioplastica + impilamento
- [ ] Animazione scatola allo scroll
- [ ] Pagina/sezione ricette
- [ ] Sezioni "Il perché" e "Chi sono"
- [ ] Fallback statico e test prestazioni (Lighthouse, telefono economico)
- [ ] Pubblicazione online (es. GitHub Pages / Netlify / Vercel) e dominio

## Materiali presenti

- `immagini/` — 6 screenshot dai post social (lampada bianca, lampada rosa, lampada ambra, lampade impilate, scatola aperta, griglia ~64 campioni). Contengono UI del carosello: solo segnaposto.
- Abstract della tesi: `~/Downloads/abstract.pdf`.
- `tesi-2026-def/` (316 MB, **escluso da git** in `.gitignore`: va copiato a mano sull'altro computer o tenuto su Drive):
  - `IMPAGINAZIONE TESI.pdf` — tesi completa, 186 pagine. Ricette con ingredienti, procedimento e osservazioni da p. 57 a ~p. 150 (gelatina, agar-agar, amido di mais, coloranti naturali: spirulina, barbabietola, curcuma…).
  - `lampada in 3D.obj` — modello Rhino, 2,5 MB, 15k vertici: da convertire e comprimere (glb + meshopt/draco) se lo usiamo.
  - `render-struttura-colori/` + `cubo_*_sfondo_trasparente.png` — render della struttura in alluminio, nero, bianco, giallo, arancione.
  - Render esplosi della struttura (ChatGPT Image 27 mag / 12 giu) — utili per l'animazione di montaggio.
  - `foto-ari-ufficio/` — 14 foto belle: scatola aperta con contenuto, lampade accese su fondi colorati.
  - `scatola foto.png`, `scatola sopra.png`, render scatola chiusa, `grafica-scatola/` (loop.ai + pdf della grafica).
  - `disegni-tecnici/` (5 pdf), `libretto istruzioni.pdf`, `icone-libretto-istruzioni/` (psd), `presentazione 2.pdf`.
