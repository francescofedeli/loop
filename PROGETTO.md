# LOOP — stato del progetto

_Ultimo aggiornamento: 2026-10-23_

## Dove siamo arrivati (leggi prima questo)

**Terza bozza** (2026-10-22, notte), dopo il giro di commenti sulla seconda:

- `sito/index.html` — home **centrata sul prodotto**: hero al buio (IMG_9114) con la luce che segue il cursore e bollino rotante verso il 3D, nastro, manifesto, scena "La lampada", due luci, galleria orizzontale, anteprima del kit, due schede verso le altre pagine.
- `sito/kit.html` — la scatola si apre come nella foto vera, poi **il montaggio in 3D** comandato dallo scroll.
- `sito/bioplastica.html` — basi, coloranti e ricette (tolte dalla home).
- `sito/progetto.html` — la tesi, i riferimenti, chi sono (tolti dalla home).
- `sito/lampada.html` — il 3D.
- In tutte le pagine: header nuovo (marchio giallo, "Scopri in 3D", "Menu"), **menu a pannello** a tutto schermo che si apre dalla riga centrale con anteprima delle pagine, **footer nuovo** (grande invito al 3D, link, LOOP gigante), **transizione con la riga verticale** a ogni cambio pagina, scroll fluido (Lenis).

Per vederlo: `python3 -m http.server 8765` e http://localhost:8765/sito/index.html. L'intro si vede una volta per scheda: per rivederla, nuova finestra in incognito.

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
- 2026-10-22 — **Intro all'apertura del sito**: il logo si compone (lettere che cadono), poi si apre un **sipario giallo** come a teatro. Solo alla prima visita della sessione; si può saltare (clic o tasto); con "riduci animazioni" non c'è.
- 2026-10-22 — ~~Scatola allo scroll nella home~~ → **pagina dedicata `kit.html`**, più lenta (scroll lungo, un gruppo di oggetti per volta). In home resta solo un'anteprima veloce del kit con pulsante "Apri la scatola".
- 2026-10-22 — Oggetti del kit ridisegnati in SVG partendo dalla foto della scatola aperta: latte in alluminio (pectina, glicerina), boccette con tappo a vite (coloranti), lampadina opalina, telecomando bianco con tasti colorati, libretto, lastre con linguette, fessure, finestre e calamite.
- 2026-10-22 — ~~Sezione "La lampada" con foto + 3 punti + esploso statico~~ (non piaceva) → **scena ferma allo scroll**: il cubo resta al centro, si disegnano le quote 12 cm, poi si accendono uno alla volta incastri, base/lampadina, bioplastica nella cornice, e infine i 5 colori (cliccabili). La vecchia sezione "Cinque colori" è confluita qui; l'esploso statico è tolto dalla home.
- 2026-10-22 — Sito più dinamico: titoli che salgono parola per parola, manifesto che si accende scorrendo, nastro di parole, galleria che scorre in orizzontale (desktop), foto con parallasse.
- 2026-10-22 — 3D: rotazione automatica più lenta (e trascinamento meno sensibile); corretto lo "sfarfallio" alla base (pezzi che si compenetravano e ombra dentro i pannelli); **si può inclinare la vista trascinando in verticale** (fino a quasi dall'alto); **pulsante "Montala"** che ricostruisce la lampada pezzo per pezzo come nel video d'animazione della tesi, con la lampadina dentro.
- 2026-10-22 — Aggiunte al 3D tre nuove bioplastiche (aurora blu/turchese, rossa con bolle, blu a pois rossi), raddrizzate in prospettiva dalle foto.
- 2026-10-22 — ~~Sipario teatrale all'apertura~~ → **intro con la riga verticale**: il logo si compone, una riga nera si disegna al centro e lo schermo giallo si apre da lì. La stessa riga fa da **transizione tra le pagine** (le due metà si chiudono sulla riga, la pagina nuova si apre).
- 2026-10-22 — ~~Foto dell'hero IMG_9095~~ → **IMG_9114** (lampada al buio, luce ambra, bioplastica bianca/gialla/azzurra), hero a tutto schermo.
- 2026-10-22 — Scena "La lampada": ~~pallini gialli con contorno nero~~ → richiami a linea sottile con cerchietto ed etichette nere, come nei disegni tecnici. ~~5 render diversi~~ (la bioplastica si spostava) → **un solo render ricolorato in 5 colori**, bioplastica messa in prospettiva esatta sulla finestra (matrix3d). Bioplastica "marmo" (giallo/azzurro, IMG_9114) al posto dei pois. I colori **non scorrono più da soli**: si scelgono con i pallini.
- 2026-10-22 — **Texture delle bioplastiche non più sgranate**: ritagliate a 1024 px dalle foto originali (3000 px) con correzione prospettica: marmo, corallo, rossa, pois. Nel 3D filtro anisotropico.
- 2026-10-22 — **La home parla del prodotto**: bioplastica e ricette → `bioplastica.html`; progetto, riferimenti e chi sono → `progetto.html`.
- 2026-10-22 — Pagina kit: scatola di cartone **uniforme** (senza righe); oggetti **posizionati come nella foto IMG_9069**; **separè** in cartone con i fori e la parete tra ingredienti e luce; tolto il separè ci sono **lastre e libretto**; gli oggetti escono **di lato** (su telefono sotto), mai sopra la scatola; alla fine **montaggio 3D** (Three.js caricato solo in questa pagina): lastre impilate → aperte sul piano → base, lampadina che cade, cornici, lati, coperchio, cornici in ferro con bioplastica → si accende.
- 2026-10-22 — Scroll fluido con **Lenis** (da CDN), come nei siti Awwwards.
- 2026-10-23 — Transizioni: **una sola riga** (prima le due metà avevano un bordo nero e se ne vedevano due). All'arrivo il velo si apre solo quando la pagina è pronta (prima nel 3D si apriva di colpo).
- 2026-10-23 — Scena lampada: angoli della finestra rimisurati, la bioplastica ora combacia con la cornice; la luce della lampadina è al centro del cubo.
- 2026-10-23 — Galleria "Impilabili, modulari, uniche": **carte che si inclinano in 3D** seguendo il mouse, con un riflesso di luce.
- 2026-10-23 — Footer: tolto il LOOP gigante (non piaceva), il resto resta.
- 2026-10-23 — Kit: il **telecomando sta di taglio in una fessura** del separè; uscendo si gira a faccia in su; la sua etichetta sta **sopra**. Nel montaggio 3D **tutti i pezzi sono gialli** (niente cornici scure).
- 2026-10-23 — Titoli e testi con `text-wrap: balance/pretty`: niente più a capo strani.
- 2026-10-23 — 3D: **zoom** con la rotella o con due dita; tolta la texture "cielo" (era un doppione sgranato di "marmo"); pois, bolle, pois blu, marmo e corallo ritagliati più stretti (niente bordi vuoti).
- 2026-10-23 — **Cursore personalizzato**: cerchio giallo che segue il mouse con un leggero ritardo; anello sui link; grande con una parola su galleria ("Guarda") e bollino ("3D"). Solo con il mouse, non su telefono.
- 2026-10-23 — Pubblicato su **GitHub Pages**: https://francescofedeli.github.io/loop/ (ogni push aggiorna il sito in 1–2 minuti).
- 2026-10-23 — Bioplastica e luce della sezione "La lampada" **calibrate a mano** dall'utente con lo strumento `index.html?calibra` (valori FINESTRA e LUCE in `js/main.js`). Provata la lampadina disegnata dentro il cubo: ~~lampadina~~ non piaceva, resta solo la luce.
- 2026-10-23 — **Cornici in rientranza** (come la lampada vera): nel 3D e nel montaggio del kit le cornici stanno dentro il cubo, arretrate di 7 mm dal bordo; lati, base e coperchio sono profondi tutto il cubo.
- 2026-10-23 — Tolto il nastro di parole dalla home. Le foto della home (galleria e due luci) **si aprono a tutto schermo**. Cubo della sezione lampada ridimensionato sugli schermi bassi (portatili).
- 2026-10-23 — Pagina progetto **senza i dettagli della tesi** (relatore, scheda, riferimenti): non serve scrivere tutto quello che c'è nella tesi. Anche il footer dice solo "Progetto di tesi in Design, LABA Rimini, 2026".
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
- [x] 2026-10-22 — Terza bozza: intro/transizioni con la riga, header + menu a pannello, footer, nuova hero, scena lampada (render ricolorato, bioplastica in prospettiva, richiami a linea), pagine bioplastica/progetto, kit come la foto + montaggio 3D, texture 1024 px. Verificata con Playwright (Chromium e WebKit) su desktop e telefono.
- [x] 2026-10-22 — Seconda bozza: intro col sipario, nuova scena "La lampada", pagina `kit.html`, animazioni in tutta la home, 3D (lento, senza sfarfallio, vista dall'alto, montaggio, 3 nuove bioplastiche). Verificata con Playwright su desktop e telefono.

## Da fare

### Da decidere / rivedere con l'utente
- [ ] Giudizio sulla terza bozza: intro con la riga, transizioni, menu, footer, hero, scena lampada, montaggio 3D del kit
- [ ] Pubblicare una versione di prova online per mostrarla (GitHub Pages / Netlify): da decidere con l'utente
- [x] 2026-10-23 — Striscia nera sopra le foto "due luci": era la parallasse senza margine, sistemata
- [ ] Quali immagini "non si vedevano"? (trovata e sistemata solo la galleria in Safari: ora le foto si caricano subito)
- [ ] Bioplastica e progetto: ora sono pagine a sé ma con l'impaginazione vecchia, da rendere belle come la home
- [ ] Rileggere tutti i testi (sono riassunti dalla tesi: controllare che il tono vada bene)
- [ ] La luce nuova della lampada 3D convince?
- [ ] Pagina kit: posizione degli oggetti dentro la scatola (ora "a occhio", si può rifare uguale alla foto), ritmo
- [ ] Il video d'animazione del montaggio (`tesi-2026-def/WhatsApp Video 2026-10-22 at 18.45.55.mp4`): usarlo anche direttamente nel sito (es. pagina kit), compresso?
- [ ] Le altre sezioni (bioplastica, ricette, progetto, chi sono) sono ancora "statiche": rivederle con lo stesso spirito

### Materiali che mancano
- [ ] Foto ritratto per "Chi sono" (ora c'è un riquadro segnaposto)
- [x] 2026-10-23 — Email: atenatomasetti@gmail.com (in menu, footer e Chi sono)
- [x] 2026-10-23 — Instagram: https://www.instagram.com/atena.tomasetti/
- [ ] Foto frontali e piatte delle bioplastiche per avere più texture nel 3D (ora 4, ritagliate dalle foto ufficio)
- [ ] Foto definitive dei singoli pezzi della struttura (opzionale)

### Sviluppo
- [ ] Lampada 3D: transizioni morbide tra texture/colori, lampadina visibile dentro, sovrapposizione di due bioplastiche (idea dalla tesi p. 172)
- [ ] Pagina con **tutte** le sperimentazioni della tesi (gelatina, agar-agar, amido, pectina: >60 campioni)
- [ ] Ricette: eventuale filtro per colore
- [ ] ~~Animazione "esploso" della lampada allo scroll~~ (sostituita dalla scena "La lampada" e dal montaggio nel 3D)
- [ ] 3D: lampadina visibile anche a lampada montata (ora si vede solo durante il montaggio; le bioplastiche sono opache)
- [ ] Valutare il modello Rhino (.obj) compresso al posto della lampada costruita nel codice (probabilmente non serve)
- [ ] Test prestazioni (Lighthouse, telefono economico) e accessibilità
- [ ] Pubblicazione online (GitHub Pages / Netlify / Vercel) e dominio
- [ ] Favicon e immagine di anteprima per i social (og:image)

## File e cartelle

- `sito/` — **il sito** (questa è la versione di riferimento).
  - `css/style.css` — tutto lo stile (colori e font in `:root`).
  - `bioplastica.html`, `progetto.html` — pagine interne.
  - `js/kit3d.js` — montaggio 3D della pagina kit (modulo, caricato solo lì).
  - `img/cubo-*.webp` — il render della lampada ricolorato nei 5 colori (stessa inquadratura). Angoli della finestra in `js/main.js` (FINESTRA).
  - Header, menu, footer e velo sono ripetuti in ogni pagina (sito statico): se si cambiano, cambiarli in tutte.
  - `js/main.js` — comune a tutte le pagine (velo/transizioni, Lenis, menu, footer, hero, scena lampada); prima era: intro col sipario, header, menu, comparse, titoli animati, manifesto, galleria orizzontale, parallasse, scena "La lampada".
  - `kit.html` + `css/kit.css` + `js/kit.js` — pagina del kit. Gli oggetti sono disegnati in `kit.js` (SVG) e lì ci sono le posizioni: `p` dentro la scatola, `d` fuori, `pm`/`dm` per il telefono.
  - `tex/` — bioplastiche per il 3D (512px webp): pois, rossa, cielo, corallo, aurora, bolle, pois-blu.
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
  - `immagini-bioplastiche/` — 3 foto di nuove bioplastiche nella lampada (usate per le texture aurora, bolle, pois-blu).
  - `WhatsApp Video 2026-10-22 at 18.45.55.mp4` — animazione 3D del montaggio (30 s, verticale): base → lampadina → cornici → lati.
  - `scatola foto.png`, `scatola sopra.png`, `grafica-scatola/`.
  - `disegni-tecnici/`, `libretto istruzioni.pdf`, `icone-libretto-istruzioni/`, `presentazione 2.pdf`.
