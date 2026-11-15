import { AuthorSeed, SacredSeed } from '../data/seeds';
import {
  AuthorFilters,
  EpochId,
  Quote,
  QuoteFilters,
  UserQuoteRecord,
} from './types';

/**
 * Calcola un hash numerico deterministico a partire da una stringa data (es. "2026-11-15").
 */
export function hashDateString(dateStr: string): number {
  let hash = 2166136261;
  for (let i = 0; i < dateStr.length; i++) {
    hash ^= dateStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

/**
 * Calcola il numero progressivo del giorno rispetto a un'epoca di partenza (1 Gennaio 2025).
 */
export function getDayIndex(dateStr: string): number {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return 1;
  }
  const utcCurrent = Date.UTC(parts[0], parts[1] - 1, parts[2]);
  const utcBase = Date.UTC(2025, 0, 1);
  const diffDays = Math.floor((utcCurrent - utcBase) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

/**
 * Seleziona in modo deterministico i semi del giorno (1 Autore Storico/Letterario + 1 Passo Biblico/Coranico)
 * e l'indice della citazione da estrarre via API.
 */
export function pickDailySeeds(
  authorSeeds: AuthorSeed[],
  sacredSeeds: SacredSeed[],
  dateStr: string
): {
  dayNumber: number;
  authorSeed: AuthorSeed;
  quoteIndex: number;
  sacredSeed: SacredSeed;
} {
  const dayNumber = getDayIndex(dateStr);
  const hashH = hashDateString(`hist:${dateStr}`);
  const hashB = hashDateString(`sacr:${dateStr}`);

  const authorSeed = authorSeeds[(dayNumber + hashH) % authorSeeds.length];
  const sacredSeed = sacredSeeds[(dayNumber + hashB) % sacredSeeds.length];
  const quoteIndex = (dayNumber + (hashH % 7)) % 10;

  return {
    dayNumber,
    authorSeed,
    quoteIndex,
    sacredSeed,
  };
}

/**
 * Filtra gli AuthorSeed per nazionalità, professione, epoca, stato di studio e ricerca testuale.
 */
export function filterAuthorSeeds(
  seeds: AuthorSeed[],
  filters: AuthorFilters,
  studiedMap: Record<string, boolean> = {}
): AuthorSeed[] {
  const normalizedQuery = (filters.query ?? '').trim().toLowerCase();

  return seeds.filter((seed) => {
    if (
      filters.nationality &&
      filters.nationality !== 'all' &&
      seed.nationality !== filters.nationality
    ) {
      return false;
    }

    if (
      filters.profession &&
      filters.profession !== 'all' &&
      seed.profession !== filters.profession
    ) {
      return false;
    }

    if (
      filters.epochId &&
      filters.epochId !== 'all' &&
      seed.epochId !== filters.epochId
    ) {
      return false;
    }

    if (
      filters.subfolderId &&
      filters.subfolderId !== 'all' &&
      seed.subfolderId !== filters.subfolderId
    ) {
      return false;
    }

    if (filters.onlyStudied && !studiedMap[seed.id]) {
      return false;
    }

    if (normalizedQuery.length > 0) {
      const haystack = [
        seed.name,
        seed.nationality,
        seed.profession,
        seed.yearBadge,
        seed.lifeSpan,
        seed.historicalEventLabel,
        seed.satiricalHook,
        seed.connectionNote,
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => a.sortYear - b.sortYear);
}

/**
 * Filtra e cerca le citazioni salvate/scoperte nella Raccolta.
 */
export function filterQuotes(
  quotes: Quote[],
  filters: QuoteFilters,
  userRecords: Record<string, UserQuoteRecord> = {}
): Quote[] {
  const normalizedQuery = (filters.query ?? '').trim().toLowerCase();

  return quotes.filter((quote) => {
    const record = userRecords[quote.id];

    if (
      filters.category &&
      filters.category !== 'all' &&
      quote.category !== filters.category
    ) {
      return false;
    }

    if (
      filters.sacredTradition &&
      filters.sacredTradition !== 'all' &&
      quote.sacredTradition !== filters.sacredTradition
    ) {
      return false;
    }

    if (
      filters.epochId &&
      filters.epochId !== 'all' &&
      quote.epochId !== filters.epochId
    ) {
      return false;
    }

    if (
      filters.authorId &&
      filters.authorId !== 'all' &&
      quote.authorId !== filters.authorId
    ) {
      return false;
    }

    if (filters.onlyOriginalScript && !quote.original) {
      return false;
    }

    if (filters.onlyFavorites && !record?.favorite) {
      return false;
    }

    if (
      filters.onlyWithNotes &&
      !(record?.note && record.note.trim().length > 0)
    ) {
      return false;
    }

    if (normalizedQuery.length > 0) {
      const haystack = [
        quote.italianText,
        quote.author,
        quote.authorRole,
        quote.work,
        quote.dateLabel,
        quote.whoWas,
        quote.meaning,
        quote.historicalEvent.title,
        quote.historicalEvent.description,
        quote.original?.text ?? '',
        quote.keyTerm.word,
        record?.note ?? '',
        ...quote.tags,
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Ordina le citazioni in ordine cronologico (dall'Antichità al Novecento).
 */
export function getChronologicalTimeline(quotes: Quote[]): Quote[] {
  return [...quotes].sort((a, b) => a.sortYear - b.sortYear);
}

/**
 * Sceglie un seme casuale per il generatore a piacimento filtrando per epoca.
 */
export function pickRandomAuthorSeed(
  seeds: AuthorSeed[],
  epochId: EpochId | 'all' = 'all'
): AuthorSeed {
  const pool =
    epochId === 'all' ? seeds : seeds.filter((s) => s.epochId === epochId);
  const candidates = pool.length > 0 ? pool : seeds;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
