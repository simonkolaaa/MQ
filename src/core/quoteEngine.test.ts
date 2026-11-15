import { describe, expect, it } from 'vitest';
import {
  filterAuthorSeeds,
  filterQuotes,
  getChronologicalTimeline,
  pickDailySeeds,
} from './quoteEngine';
import {
  AUTHOR_SEEDS,
  INQUIRY_SEEDS,
  SACRED_SEEDS,
  SUBFOLDER_MOVEMENTS,
} from '../data/seeds';
import { cleanWikiHtmlText } from '../services/liveWikiApi';
import { Quote } from './types';

describe('quoteEngine & Chrono-Subfolder Architecture', () => {
  it('seleziona in modo deterministico i semi del giorno', () => {
    const first = pickDailySeeds(AUTHOR_SEEDS, SACRED_SEEDS, '2026-11-15');
    const second = pickDailySeeds(AUTHOR_SEEDS, SACRED_SEEDS, '2026-11-15');

    expect(first.authorSeed.id).toBe(second.authorSeed.id);
    expect(first.sacredSeed.id).toBe(second.sacredSeed.id);
    expect(first.quoteIndex).toBe(second.quoteIndex);
  });

  it('pulisce correttamente il markup HTML', () => {
    const rawHtml =
      '«Una vita senza <b>ricerca</b> non è degna di essere vissuta.»<sup>[1]</sup><ul><li>(Apologia)</li></ul>';
    const cleaned = cleanWikiHtmlText(rawHtml);
    expect(cleaned).toBe(
      '«Una vita senza ricerca non è degna di essere vissuta.»'
    );
  });

  it('organizza i filosofi in sottocartelle cronologiche (es. Illuminismo con Voltaire, Rousseau e Kant) e verifica i collegamenti', () => {
    const illuminismoSubfolder = SUBFOLDER_MOVEMENTS.find(
      (sf) => sf.id === 'illuminismo-criticismo'
    );
    expect(illuminismoSubfolder).toBeDefined();

    const illuministi = filterAuthorSeeds(AUTHOR_SEEDS, {
      subfolderId: 'illuminismo-criticismo',
    });
    const ids = illuministi.map((a) => a.id);
    expect(ids).toContain('voltaire');
    expect(ids).toContain('rousseau');
    expect(ids).toContain('kant');

    // Verifica ordine cronologico (Voltaire 1759 -> Rousseau 1762 -> Kant 1784)
    expect(ids[0]).toBe('voltaire');
    expect(ids[1]).toBe('rousseau');
    expect(ids[2]).toBe('kant');

    const kant = illuministi.find((a) => a.id === 'kant');
    expect(kant?.connectedAuthorIds).toContain('rousseau');
    expect(kant?.connectedAuthorIds).toContain('voltaire');
  });

  it('include una casistica variata dal Big Bang al 2000 AD con metafore/satira in "Perché è successo?"', () => {
    expect(INQUIRY_SEEDS.length).toBeGreaterThanOrEqual(11);
    const bigBang = INQUIRY_SEEDS.find(
      (i) => i.id === 'big-bang-polvere-di-stelle'
    );
    expect(bigBang).toBeDefined();
    expect(bigBang?.satiricalHook.length).toBeGreaterThan(20);

    const tulipani = INQUIRY_SEEDS.find(
      (i) => i.id === 'bolla-tulipani-wall-street-2008'
    );
    expect(tulipani).toBeDefined();
  });

  it('filtra e ordina cronologicamente le citazioni salvate nella Raccolta', () => {
    const sampleQuotes: Quote[] = [
      {
        id: 'q-1',
        authorId: 'pasolini',
        category: 'historical',
        epochId: 'contemporanea',
        italianText: 'Io so i nomi.',
        author: 'Pier Paolo Pasolini',
        authorRole: 'Scrittore',
        work: 'Scritti corsari',
        dateLabel: '1974 AD',
        sortYear: 1974,
        whoWas: 'Poeta e regista.',
        meaning: 'Verità storica.',
        tags: ['Pasolini'],
        translations: { latin: '', english: '', french: '', german: '' },
        historicalEvent: {
          title: 'Anni di piombo',
          yearLabel: '1974 AD',
          description: 'Contesto.',
        },
        keyTerm: {
          word: 'Verità',
          language: 'IT',
          etymology: 'Opera',
          definition: 'Def.',
        },
      },
      {
        id: 'q-2',
        authorId: 'socrate',
        category: 'historical',
        epochId: 'antichita',
        italianText: 'Una vita senza ricerca.',
        author: 'Socrate',
        authorRole: 'Filosofo',
        work: 'Apologia',
        dateLabel: '399 a.C.',
        sortYear: -399,
        whoWas: 'Filosofo greco.',
        meaning: 'Esame critico.',
        tags: ['Socrate'],
        translations: { latin: '', english: '', french: '', german: '' },
        historicalEvent: {
          title: 'Processo a Socrate',
          yearLabel: '399 a.C.',
          description: 'Contesto.',
        },
        keyTerm: {
          word: 'Ricerca',
          language: 'GR',
          etymology: 'Opera',
          definition: 'Def.',
        },
      },
    ];

    const filtered = filterQuotes(sampleQuotes, { query: 'Socrate' });
    expect(filtered).toHaveLength(1);

    const timeline = getChronologicalTimeline(sampleQuotes);
    expect(timeline[0].id).toBe('q-2');
    expect(timeline[1].id).toBe('q-1');
  });
});
