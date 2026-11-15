import { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTHOR_SEEDS, AuthorSeed } from '../data/seeds';
import { Quote, UserQuoteRecord } from '../core/types';

const STORAGE_DISCOVERED_QUOTES_KEY = 'mq_live_discovered_quotes_v5';
const STORAGE_RECORDS_KEY = 'mq_live_records_v5';
const STORAGE_STUDIED_AUTHORS_KEY = 'mq_live_studied_authors_v5';
const STORAGE_EXTRA_AUTHOR_SEEDS_KEY = 'mq_live_extra_authors_v5';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useCollection() {
  const [discoveredQuotes, setDiscoveredQuotes] = useState<Quote[]>(() =>
    loadFromStorage<Quote[]>(STORAGE_DISCOVERED_QUOTES_KEY, [])
  );

  const [records, setRecords] = useState<Record<string, UserQuoteRecord>>(() =>
    loadFromStorage<Record<string, UserQuoteRecord>>(STORAGE_RECORDS_KEY, {})
  );

  const [studiedAuthors, setStudiedAuthors] = useState<Record<string, boolean>>(
    () =>
      loadFromStorage<Record<string, boolean>>(STORAGE_STUDIED_AUTHORS_KEY, {})
  );

  const [extraAuthorSeeds, setExtraAuthorSeeds] = useState<AuthorSeed[]>(() =>
    loadFromStorage<AuthorSeed[]>(STORAGE_EXTRA_AUTHOR_SEEDS_KEY, [])
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_DISCOVERED_QUOTES_KEY,
        JSON.stringify(discoveredQuotes)
      );
    } catch {
      // ignore
    }
  }, [discoveredQuotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_STUDIED_AUTHORS_KEY,
        JSON.stringify(studiedAuthors)
      );
    } catch {
      // ignore
    }
  }, [studiedAuthors]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_EXTRA_AUTHOR_SEEDS_KEY,
        JSON.stringify(extraAuthorSeeds)
      );
    } catch {
      // ignore
    }
  }, [extraAuthorSeeds]);

  const allAuthorSeeds = useMemo(
    () => [...extraAuthorSeeds, ...AUTHOR_SEEDS],
    [extraAuthorSeeds]
  );

  const registerDiscoveredQuote = useCallback((quote: Quote) => {
    const today = new Date().toISOString().slice(0, 10);
    setDiscoveredQuotes((prev) => {
      if (prev.some((q) => q.id === quote.id || q.italianText === quote.italianText)) {
        return prev;
      }
      return [quote, ...prev];
    });

    setRecords((prev) => {
      const current = prev[quote.id];
      if (current?.unlocked) return prev;
      return {
        ...prev,
        [quote.id]: {
          quoteId: quote.id,
          unlocked: true,
          favorite: current?.favorite ?? false,
          note: current?.note ?? '',
          unlockedAt: current?.unlockedAt || today,
        },
      };
    });
  }, []);

  const toggleFavorite = useCallback((quoteId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setRecords((prev) => {
      const current = prev[quoteId];
      return {
        ...prev,
        [quoteId]: {
          quoteId,
          unlocked: true,
          favorite: !(current?.favorite ?? false),
          note: current?.note ?? '',
          unlockedAt: current?.unlockedAt || today,
        },
      };
    });
  }, []);

  const saveNote = useCallback((quoteId: string, note: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setRecords((prev) => {
      const current = prev[quoteId];
      return {
        ...prev,
        [quoteId]: {
          quoteId,
          unlocked: true,
          favorite: current?.favorite ?? false,
          note,
          unlockedAt: current?.unlockedAt || today,
        },
      };
    });
  }, []);

  const addCustomQuote = useCallback((newQuote: Quote) => {
    const today = new Date().toISOString().slice(0, 10);
    setDiscoveredQuotes((prev) => [newQuote, ...prev]);
    setRecords((prev) => ({
      ...prev,
      [newQuote.id]: {
        quoteId: newQuote.id,
        unlocked: true,
        favorite: true,
        note: '',
        unlockedAt: today,
      },
    }));
  }, []);

  const deleteCustomQuote = useCallback((quoteId: string) => {
    setDiscoveredQuotes((prev) => prev.filter((q) => q.id !== quoteId));
  }, []);

  const toggleAuthorStudied = useCallback((authorId: string) => {
    setStudiedAuthors((prev) => ({
      ...prev,
      [authorId]: !prev[authorId],
    }));
  }, []);

  const addAuthorSeed = useCallback((seed: AuthorSeed) => {
    setExtraAuthorSeeds((prev) => {
      if (prev.some((s) => s.wikiTitle === seed.wikiTitle)) return prev;
      return [seed, ...prev];
    });
  }, []);

  const stats = useMemo(() => {
    const favoritesCount = discoveredQuotes.filter(
      (q) => records[q.id]?.favorite
    ).length;
    const notesCount = discoveredQuotes.filter(
      (q) => (records[q.id]?.note ?? '').trim().length > 0
    ).length;
    const studiedAuthorsCount = allAuthorSeeds.filter(
      (a) => studiedAuthors[a.id]
    ).length;

    return {
      discoveredCount: discoveredQuotes.length,
      favoritesCount,
      notesCount,
      studiedAuthorsCount,
      totalAuthorsCount: allAuthorSeeds.length,
    };
  }, [discoveredQuotes, records, allAuthorSeeds, studiedAuthors]);

  return {
    discoveredQuotes,
    allAuthorSeeds,
    records,
    studiedAuthors,
    stats,
    registerDiscoveredQuote,
    toggleFavorite,
    saveNote,
    addCustomQuote,
    deleteCustomQuote,
    toggleAuthorStudied,
    addAuthorSeed,
  };
}
