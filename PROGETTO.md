# LOOP — stato del progetto

_Ultimo aggiornamento: 2026-10-22 (sera)_

## Dove siamo arrivati (leggi prima questo)

C'è una **prima bozza completa del sito** in `sito/`:

- `sito/index.html` — la home, con hero gialla, manifesto, lampada, due luci, cinque colori, galleria, **scatola che si apre allo scroll**, bioplastica, ricette, progetto, chi sono.
- `sito/lampada.html` — la pagina **"Scopri la lampada"** con la lampada 3D: si gira, si regola la luce, si cambiano bioplastica e colore, si impila.

Per vederlo, dalla cartella del progetto:

```
python3 -m http.server 8765
```

e poi apri http://localhost:8765/sito/index.html (serve il server: aprendo il file con doppio clic le texture 3D non si caricano).

**Cosa guardare stasera:** il giudizio generale sullo stile, la scatola allo scroll (sezione "Kit"), la nuova luce della lampada 3D, i testi (sono presi dalla tesi e riscritti in breve: vanno riletti).

## Struttura del sito

| Sezione | Contenuto | Fonte |
|---|---|---|
| Hero | Logo animato, titolo, foto lampada accesa | foto ufficio IMG_9095 |
| Manifesto | "Il design non serve solo a creare oggetti…" | testi post social |
| La lampada | 3 punti (incastro, base in ferro + lampadina magnetica, cornici magnetiche) + esploso con etichette | tesi pp. 165–173 |
| Due lati, due luci | Davanti: bioplastica in controluce. Dietro: riflesso sul muro. Link al 3D | tesi p. 172 |
| Cinque colori | Render giallo (★ preferito), alluminio, arancione, bianco, nero | tesi p. 170 |
| Galleria | Lampade accese, scorrimento orizzontale | foto ufficio |
| Kit (scroll) | Scatola vista dall'alto: si apre, escono gli ingredienti, poi le 8 lastre, poi compare la lampada montata | tesi p. 178 |
| Bioplastica | 4 basi testate → scelta la pectina; 4 coloranti naturali | tesi pp. 58–163 |
| Ricette | 4 passi + 5 schede (base, curcuma, barbabietola, spirulina, spirulina blu) con dosi e osservazioni | tesi pp. 138–157 |
| Il progetto | Citazione, testo dall'abstract, scheda tesi, 3 riferimenti (Alum Studio, FlatFlat, Teenage Engineering) | abstract + tesi pp. 166–168 |
| Chi sono | Testo breve + link | da completare |

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
- 2026-10-22 — **Il giallo è il colore guida del sito** (piace all'utente, accompagna tutta la tesi): hero, footer, pulsanti principali, sezione galleria.
- 2026-10-22 — **Il 3D non sta nella home**: è una pagina a parte ("Scopri la lampada", `sito/lampada.html`) per esplorare la lampada e come rendono le bioplastiche. La home ci rimanda da più punti.
- 2026-10-22 — ~~Bagliore come alone attorno alla lampada~~ → non piaceva. Sostituito con luce più realistica, come nelle foto: **muro fisso dietro** che si colora quando una finestra lo guarda + **luce sul pavimento** che esce dalle finestre. Ora si gira la lampada (non la camera), così il muro resta sempre dietro.
- 2026-10-22 — **Cursore dell'intensità della luce** nella pagina 3D (a 0 = spenta, alzandolo si riaccende).
- 2026-10-22 — Scatola allo scroll fatta come **vista dall'alto disegnata in CSS** (come la foto IMG_9069), animata con GSAP ScrollTrigger: leggera, nitida, funziona anche su telefono. Con "riduci animazioni" mostra direttamente il contenuto del kit.
- 2026-10-22 — Il sito è statico (HTML/CSS/JS, niente build). GSAP e Three.js da CDN. Si potrà passare a Vite più avanti se serve.

## Fatto

- [x] 2026-10-22 — Ricerca reference e direzione di stile
- [x] 2026-10-22 — Mockup statico della home (scartato)
- [x] 2026-10-22 — Setup repository git e collegamento a GitHub
- [x] 2026-10-22 — Misure: cubo 12 × 12 × 12 cm; cornice 1 cm → finestra ~10 × 10 cm
- [x] 2026-10-22 — Font scaricati e convertiti (Lemon Milk solo maiuscole; Garet Book/Heavy)
- [x] 2026-10-22 — Logo vettoriale estratto dall'abstract → `logo/loop-logo.svg`
- [x] 2026-10-22 — Bozza lampada 3D (`prototipi/lampada-3d.html`): texture vere dalle foto, 5 colori struttura, fessure illuminate, impilamento, inquadratura automatica
- [x] 2026-10-22 — Lampada 3D: nuova luce (muro + pavimento), cursore intensità, base in ferro, rotazione con inerzia. Verificata con Playwright.
- [x] 2026-10-22 — Immagini del sito ottimizzate in `sito/img/` (28 webp, ~1 MB in tutto) da foto ufficio, render, e foto dei campioni estratte dal PDF della tesi
- [x] 2026-10-22 — Bozza scatola che si apre allo scroll (sezione Kit della home)
- [x] 2026-10-22 — Bozza completa del sito: `sito/index.html` + `sito/lampada.html`, desktop e telefono, verificata con Playwright

## Da fare

### Da decidere / rivedere con l'utente
- [ ] Giudizio sullo stile generale della bozza
- [ ] Rileggere tutti i testi (sono riassunti dalla tesi: controllare che il tono vada bene)
- [ ] La luce nuova della lampada 3D convince?
- [ ] La scatola allo scroll: ritmo, oggetti, finale

### Materiali che mancano
- [ ] Foto ritratto per "Chi sono" (ora c'è un riquadro segnaposto)
- [ ] Email e link al profilo Instagram (ora il link punta al post, l'email è vuota)
- [ ] Foto frontali e piatte delle bioplastiche per avere più texture nel 3D (ora 4, ritagliate dalle foto ufficio)
- [ ] Foto definitive dei singoli pezzi della struttura (opzionale)

### Sviluppo
- [ ] Lampada 3D: transizioni morbide tra texture/colori, lampadina visibile dentro, sovrapposizione di due bioplastiche (idea dalla tesi p. 172)
- [ ] Pagina con **tutte** le sperimentazioni della tesi (gelatina, agar-agar, amido, pectina: >60 campioni)
- [ ] Ricette: eventuale filtro per colore
- [ ] Animazione "esploso" della lampada allo scroll (ora è un'immagine statica con etichette)
- [ ] Valutare il modello Rhino (.obj) compresso al posto della lampada costruita nel codice (probabilmente non serve)
- [ ] Test prestazioni (Lighthouse, telefono economico) e accessibilità
- [ ] Pubblicazione online (GitHub Pages / Netlify / Vercel) e dominio
- [ ] Favicon e immagine di anteprima per i social (og:image)

## File e cartelle

- `sito/` — **il sito** (questa è la versione di riferimento).
  - `css/style.css` — tutto lo stile (colori e font in `:root`).
  - `js/main.js` — header, menu, comparse, animazione della scatola (le posizioni degli oggetti sono negli attributi `data-p`/`data-d` dell'HTML, `data-pm`/`data-dm` per il telefono).
  - `img/`, `tex/`, `font/` — risorse ottimizzate.
- `prototipi/lampada-3d.html` — prototipo della lampada 3D (stessa logica di `sito/lampada.html`; se si modifica il 3D, farlo in `sito/lampada.html`).
- `mockup/` — primo mockup scartato, solo riferimento.
- `font/`, `logo/` — sorgenti di font e logo.
- `immagini/` — screenshot dai social e foto della struttura.
- `tesi-2026-def/` (316 MB, **escluso da git**: va copiato a mano sull'altro computer o tenuto su Drive):
  - `IMPAGINAZIONE TESI.pdf` — tesi completa, 186 pagine. Autrice: Atena Tomasetti, LABA Rimini, relatore Prof. Carlo Rausa, giugno 2026. Ricette pp. 72–157, scelta pectina pp. 162–163, lampada pp. 165–177, kit p. 178.
  - `lampada in 3D.obj` — modello Rhino, 2,5 MB.
  - `render-struttura-colori/`, `cubo_*_sfondo_trasparente.png` — render dei 5 colori (sfondo trasparente).
  - Render esplosi (ChatGPT Image 27 mag / 12 giu).
  - `foto-ari-ufficio/` — 14 foto: scatola aperta, lampade accese.
  - `scatola foto.png`, `scatola sopra.png`, `grafica-scatola/`.
  - `disegni-tecnici/`, `libretto istruzioni.pdf`, `icone-libretto-istruzioni/`, `presentazione 2.pdf`.
