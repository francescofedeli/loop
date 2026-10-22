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
- 2026-10-22 — Font: **Lemon Milk** per logo e titoli, **Garet** per il resto (come nella tesi). Nessuno dei due è su Google Fonts: vanno inclusi come file .woff2. Verificare le licenze per uso web.

## Fatto

- [x] 2026-10-22 — Ricerca reference e direzione di stile
- [x] 2026-10-22 — Mockup statico della home (scartato)
- [x] 2026-10-22 — Setup repository git e file di progetto

## Da fare

### Materiali (dall'utente)
- [ ] Foto lampada da più lati, struttura smontata, base in ferro
- [ ] Misure del cubo
- [ ] Foto frontali e piatte di 4–6 pannelli di bioplastica (per le texture 3D)
- [ ] Foto scatola chiusa, aperta e dei singoli oggetti
- [x] 2026-10-22 — Nome dei font (Lemon Milk + Garet)
- [ ] File dei font (Lemon Milk, Garet) e file vettoriale del logo (SVG/PDF)
- [ ] PDF della tesi
- [ ] Ricette delle bioplastiche
- [ ] Eventuali file 3D (.glb / .obj / .stl) dalla tesi
- [ ] Testi e foto per "Chi sono"

### Sviluppo
- [ ] Collegare il repository a GitHub (creare repo su github.com e fare push)
- [ ] Scegliere lo stack (proposta: Vite + Three.js + GSAP, sito statico)
- [ ] Lampada 3D: modello, rotazione, accensione, bagliore
- [ ] Configuratore texture bioplastica + impilamento
- [ ] Animazione scatola allo scroll
- [ ] Pagina/sezione ricette
- [ ] Sezioni "Il perché" e "Chi sono"
- [ ] Fallback statico e test prestazioni (Lighthouse, telefono economico)
- [ ] Pubblicazione online (es. GitHub Pages / Netlify / Vercel) e dominio

## Materiali presenti

- `immagini/` — 6 screenshot dai post social (lampada bianca, lampada rosa, lampada ambra, lampade impilate, scatola aperta, griglia ~64 campioni). Contengono UI del carosello: solo segnaposto.
- Abstract della tesi (incollato in chat, non ancora nel repo).
