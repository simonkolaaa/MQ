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
import { SIMON_STUDY_NOTES } from '../data/simonNotes';
import { IDEOLOGIES_CATALOG } from '../data/ideologies';
import { cleanWikiHtmlText } from '../services/liveWikiApi';
import { Quote } from './types';

describe('quoteEngine, Trittico Giornaliero & Appunti di Simon', () => {
  it('seleziona in modo deterministico 1 Voce Storica + 1 Passo Bibbia + 1 Versetto Corano per la Home', () => {
    const first = pickDailySeeds(AUTHOR_SEEDS, SACRED_SEEDS, '2026-11-16');
    const second = pickDailySeeds(AUTHOR_SEEDS, SACRED_SEEDS, '2026-11-16');

    expect(first.authorSeed.id).toBe(second.authorSeed.id);
    expect(first.bibleSeed.id).toBe(second.bibleSeed.id);
    expect(first.quranSeed.id).toBe(second.quranSeed.id);
    expect(first.bibleSeed.tradition).toBe('Bibbia');
    expect(first.quranSeed.tradition).toBe('Corano');
  });

  it('pulisce correttamente il markup HTML', () => {
    const rawHtml =
      '«Una vita senza <b>ricerca</b> non è degna di essere vissuta.»<sup>[1]</sup><ul><li>(Apologia)</li></ul>';
    const cleaned = cleanWikiHtmlText(rawHtml);
    expect(cleaned).toBe(
      '«Una vita senza ricerca non è degna di essere vissuta.»'
    );
  });

  it('organizza i filosofi e i poeti in sottocartelle cronologiche (Illuminismo, Verismo, Decadentismo, ’900) con gli appunti "Simon dice..."', () => {
    const illuminismoSubfolder = SUBFOLDER_MOVEMENTS.find(
      (sf) => sf.id === 'illuminismo-criticismo'
    );
    expect(illuminismoSubfolder).toBeDefined();

    const illuministi = filterAuthorSeeds(AUTHOR_SEEDS, {
      subfolderId: 'illuminismo-criticismo',
    });
    expect(illuministi.map((a) => a.id)).toEqual([
      'voltaire',
      'rousseau',
      'kant',
    ]);

    const veristi = filterAuthorSeeds(AUTHOR_SEEDS, {
      subfolderId: 'realismo-naturalismo-verismo',
    });
    expect(veristi.map((a) => a.id)).toContain('flaubert');
    expect(veristi.map((a) => a.id)).toContain('zola');
    expect(veristi.map((a) => a.id)).toContain('verga');
    expect(veristi.map((a) => a.id)).toContain('marx');

    const verga = AUTHOR_SEEDS.find((a) => a.id === 'verga');
    expect(verga?.simonNote).toContain('Simon dice:');

    const svevo = AUTHOR_SEEDS.find((a) => a.id === 'svevo');
    expect(svevo?.simonNote).toContain('Simon dice:');

    const pirandello = AUTHOR_SEEDS.find((a) => a.id === 'pirandello');
    expect(pirandello?.simonNote).toContain('Simon dice:');

    const ungaretti = AUTHOR_SEEDS.find((a) => a.id === 'ungaretti');
    expect(ungaretti?.simonNote).toContain('Simon dice:');
  });

  it('contiene il Quaderno degli Appunti di Simon e la Cartella a Parte delle 8 Grandi Ideologie', () => {
    expect(SIMON_STUDY_NOTES.length).toBeGreaterThanOrEqual(8);
    expect(
      SIMON_STUDY_NOTES.every((n) => n.simonSays.startsWith('Simon dice:'))
    ).toBe(true);
    expect(INQUIRY_SEEDS.length).toBeGreaterThanOrEqual(11);

    const ideologyIds = IDEOLOGIES_CATALOG.map((i) => i.id);
    expect(ideologyIds).toEqual(
      expect.arrayContaining([
        'socialismo',
        'comunismo',
        'capitalismo',
        'liberalismo',
        'anarchismo',
        'conservatorismo',
        'nazionalismo',
        'fascismo',
      ])
    );
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
