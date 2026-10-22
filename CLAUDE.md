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
3. **A fine sessione** proponi un commit con un messaggio chiaro in italiano e il push su GitHub.
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

## Struttura cartelle

- `immagini/` — materiale grezzo fornito dall'utente (screenshot, foto)
- `mockup/` — primo mockup statico (scartato, tenuto come riferimento)
