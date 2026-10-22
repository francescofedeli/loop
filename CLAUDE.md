# LOOP — sito web

Sito per far conoscere l'autrice/autore e LOOP, il progetto di tesi di laurea: un kit educativo per creare una lampada con bioplastiche fatte a mano (pubblico del kit: bambini e ragazzi; pubblico del sito: docenti, studi di design, aziende).

Lo stato del lavoro (fatto / da fare / decisioni) è in [PROGETTO.md](PROGETTO.md).

## Istruzioni per Claude (valgono in ogni sessione)

1. **All'inizio di ogni sessione** leggi `PROGETTO.md` e fai `git pull` per avere l'ultima versione.
2. **Quando finisci un pezzo di lavoro** aggiorna `PROGETTO.md`:
   - sposta i task completati in "Fatto" con la data (AAAA-MM-GG);
   - aggiungi in "Da fare" i nuovi task emersi;
   - scrivi in "Decisioni" ogni scelta presa con l'utente (e il perché);
   - aggiorna "Materiali" se arrivano nuovi file.
3. **Commit e push su GitHub solo quando l'utente lo dice** (di solito prima di staccare). Messaggi di commit chiari, in italiano.
4. Non cancellare decisioni passate: se una cambia, barrala e scrivi la nuova sotto.

## Vincoli di progetto

- **Prestazioni prima di tutto**: il 3D non deve rallentare il sito.
  - lampada costruita nel codice (Three.js) con geometria semplice, niente modelli pesanti;
  - texture bioplastica compresse (WebP/KTX2, ~512px), caricate solo quando servono;
  - 3D caricato in differita, con foto statica al primo caricamento;
  - render solo quando è visibile o in interazione;
  - niente riflessi/ombre in tempo reale: bagliore finto;
  - fallback statico su dispositivi lenti e con `prefers-reduced-motion`;
  - budget: < 300 KB aggiuntivi per il 3D, buon punteggio Lighthouse.
- **Il prodotto viene prima**: la lampada è un oggetto di design ed è protagonista; le ricette sono una sezione secondaria ma presente.
- Testi in italiano.

- **Il giallo (#f3c300) è il colore guida**; font Lemon Milk (titoli, solo maiuscole) + Garet.
- **Il 3D sta in una pagina dedicata** (`sito/lampada.html`), non nella home.

## Struttura cartelle

- `sito/` — il sito (versione di riferimento): `index.html`, `kit.html`, `bioplastica.html`, `progetto.html`, `lampada.html`, `css/`, `js/`, `img/`, `tex/`, `font/`
- `prototipi/` — prototipo della lampada 3D (le modifiche al 3D vanno fatte in `sito/lampada.html`)
- `immagini/` — materiale grezzo fornito dall'utente (screenshot, foto)
- `mockup/` — primo mockup statico (scartato, tenuto come riferimento)
- `tesi-2026-def/` — materiale della tesi, **escluso da git** (troppo pesante)

## Come vedere il sito in locale

```
python3 -m http.server 8765
```
poi http://localhost:8765/sito/index.html (serve il server, non il doppio clic).

Per controllare le pagine si può usare Playwright (non è nel progetto: installarlo in una cartella temporanea).
