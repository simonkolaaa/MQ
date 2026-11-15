# ADR 0001: Architettura API-Driven Leggera (Wikiquote, Wikipedia, AlQuran, Bible API & MyMemory)

* **Stato**: Approvato e Aggiornato
* **Data**: 2026-11-15
* **Riferimento Wiki**: Archetipo F (`vocabe` — Web App in React + TypeScript + Vite per GitHub Pages) potenziato con **API Pubbliche Gratuite**

## Contesto e Problema

Per evitare di appesantire il repository con grandi file statici di citazioni, biografie e traduzioni scritte a mano, il progetto deve recuperare dinamicamente:
- **Citazioni di autori, filosofi, tragediografi e libri celebri** (es. *Socrate*, *Sofocle*, *Dante Alighieri*, *Tristano e Isotta*, *Leonardo da Vinci*, *Pier Paolo Pasolini*) da **Wikiquote**.
- **Fotografie/ritratti, contesto storico, biografie, aneddoti e risposte alle domande storiche** (es. *Perché si è arrivati ai campi di concentramento?*) da **Wikipedia REST & MediaWiki API**.
- **Versetti della Bibbia e del Corano** da **Bible-API.com**, **Wikiquote** e **AlQuran Cloud API**.
- **Opere famose degli autori** da **OpenLibrary API** e da Wikipedia.
- **Traduzioni in tempo reale** (*Latino*, *Inglese*, *Francese*, *Tedesco*) da **MyMemory Translation API**.

Tutte le API scelte devono essere **100% gratuite, senza API key e con supporto CORS nativo (`origin=*`)**, così da funzionare direttamente nel browser sia in `localhost` sia una volta pubblicato su **GitHub Pages**.

## Decisione

1. **Eliminazione dei grandi dataset statici**: `src/data/` contiene solo un piccolo file di configurazione leggero (`src/data/seeds.ts`) con l'indice iniziale degli autori, delle epoche e dei riferimenti sacri/storici.
2. **Client API unificato (`src/services/liveWikiApi.ts`)**:
   - Interroga `https://it.wikiquote.org/w/api.php?origin=*` per estrarre le vere citazioni dalle pagine di autori, opere letterarie ed eventi storici.
   - Interroga `https://it.wikipedia.org/api/rest_v1/page/summary/...` e `https://it.wikipedia.org/w/api.php?origin=*` per ottenere ritratto fotografico, descrizione del periodo storico, sezioni biografiche/curiosità e per rispondere a **qualsiasi domanda storica** nella sezione *"Perché è accaduto?"*.
   - Interroga `https://api.alquran.cloud/v1/ayah/...` e `https://bible-api.com/...` per i testi sacri (con arabo/latino originale e traduzioni).
   - Interroga `https://api.mymemory.translated.net/get` per tradurre in tempo reale qualsiasi citazione quando l'utente clicca su `Latino`, `English`, `Français` o `Deutsch`.
3. **Cache locale in `localStorage`**: le risposte delle API vengono memorizzate automaticamente in cache sul dispositivo per evitare chiamate duplicate e garantire velocità istantanea.
