import React, { useEffect, useMemo, useState } from 'react';
import {
  BookMarked,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  Dices,
  GraduationCap,
  HelpCircle,
  History,
  Landmark,
  Library,
  Loader2,
  Moon,
  NotebookPen,
  Plus,
  ScrollText,
  Search,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react';
import { EPOCHS, SACRED_SEEDS } from './data/seeds';
import {
  filterQuotes,
  getChronologicalTimeline,
  pickDailySeeds,
  pickRandomAuthorSeed,
} from './core/quoteEngine';
import {
  fetchDynamicHistoricalQuote,
  fetchDynamicSacredQuote,
  searchAndCreateAuthorFromWiki,
} from './services/liveWikiApi';
import {
  EpochId,
  Quote,
  QuoteCategory,
  SacredTradition,
} from './core/types';
import { useCollection } from './state/useCollection';
import { QuoteBentoSheet } from './components/QuoteBentoSheet';
import { AddCustomQuoteModal } from './components/AddCustomQuoteModal';
import { AuthorsAtlasSection } from './components/AuthorsAtlasSection';
import { HistoricalInquiriesSection } from './components/HistoricalInquiriesSection';

type ActiveTab = 'daily' | 'authors' | 'inquiries' | 'collection' | 'journal';

function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatItalianDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return dt.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('memorable_quotes_theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('memorable_quotes_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('memorable_quotes_theme', 'light');
    }
  }, [darkMode]);

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    formatIsoDate(new Date())
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const {
    discoveredQuotes,
    allAuthorSeeds,
    records,
    studiedAuthors,
    registerDiscoveredQuote,
    toggleFavorite,
    saveNote,
    addCustomQuote,
    deleteCustomQuote,
    toggleAuthorStudied,
    addAuthorSeed,
  } = useCollection();

  const dailySeeds = useMemo(
    () => pickDailySeeds(allAuthorSeeds, SACRED_SEEDS, selectedDate),
    [allAuthorSeeds, selectedDate]
  );

  const [dailyHistorical, setDailyHistorical] = useState<Quote | null>(null);
  const [dailySacred, setDailySacred] = useState<Quote | null>(null);
  const [loadingDaily, setLoadingDaily] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingDaily(true);

    Promise.all([
      fetchDynamicHistoricalQuote(
        dailySeeds.authorSeed,
        dailySeeds.quoteIndex
      ),
      fetchDynamicSacredQuote(dailySeeds.sacredSeed),
    ])
      .then(([histQ, sacrQ]) => {
        if (!cancelled) {
          setDailyHistorical(histQ);
          setDailySacred(sacrQ);
          registerDiscoveredQuote(histQ);
          registerDiscoveredQuote(sacrQ);
          setLoadingDaily(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingDaily(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dailySeeds, registerDiscoveredQuote]);

  const [drawCategory, setDrawCategory] = useState<QuoteCategory | 'all'>('all');
  const [drawEpoch, setDrawEpoch] = useState<EpochId | 'all'>('all');
  const [customTopicQuery, setCustomTopicQuery] = useState('');
  const [isDrawingApi, setIsDrawingApi] = useState(false);
  const [drawnQuotes, setDrawnQuotes] = useState<Quote[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<QuoteCategory | 'all'>(
    'all'
  );
  const [filterSacredTradition, setFilterSacredTradition] = useState<
    SacredTradition | 'all'
  >('all');
  const [filterEpoch, setFilterEpoch] = useState<EpochId | 'all'>('all');
  const [chronologicalOrder, setChronologicalOrder] = useState(true);

  const handleStepDate = (deltaDays: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + deltaDays);
    setSelectedDate(formatIsoDate(dt));
  };

  const handleOpenAuthorFromAnywhere = (authorId: string) => {
    setSelectedAuthorId(authorId);
    setActiveTab('authors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDrawNewQuote = async () => {
    setIsDrawingApi(true);
    try {
      if (customTopicQuery.trim()) {
        const foundSeed = await searchAndCreateAuthorFromWiki(
          customTopicQuery.trim()
        );
        if (foundSeed) {
          addAuthorSeed(foundSeed);
          const randomIndex = Math.floor(Math.random() * 6);
          const quote = await fetchDynamicHistoricalQuote(
            foundSeed,
            randomIndex
          );
          registerDiscoveredQuote(quote);
          setDrawnQuotes((prev) => [
            quote,
            ...prev.filter((q) => q.id !== quote.id),
          ]);
          setCustomTopicQuery('');
          setIsDrawingApi(false);
          return;
        }
      }

      const chooseSacred =
        drawCategory === 'biblical' ||
        (drawCategory === 'all' && Math.random() < 0.35);

      if (chooseSacred) {
        const seed =
          SACRED_SEEDS[Math.floor(Math.random() * SACRED_SEEDS.length)];
        const quote = await fetchDynamicSacredQuote(seed);
        registerDiscoveredQuote(quote);
        setDrawnQuotes((prev) => [
          quote,
          ...prev.filter((q) => q.id !== quote.id),
        ]);
      } else {
        const seed = pickRandomAuthorSeed(allAuthorSeeds, drawEpoch);
        const randomIndex = Math.floor(Math.random() * 8);
        const quote = await fetchDynamicHistoricalQuote(seed, randomIndex);
        registerDiscoveredQuote(quote);
        setDrawnQuotes((prev) => [
          quote,
          ...prev.filter((q) => q.id !== quote.id),
        ]);
      }
    } finally {
      setIsDrawingApi(false);
    }
  };

  const filteredCollection = useMemo(() => {
    const list = filterQuotes(
      discoveredQuotes,
      {
        query: searchQuery,
        category: filterCategory,
        sacredTradition: filterSacredTradition,
        epochId: filterEpoch,
      },
      records
    );
    return chronologicalOrder ? getChronologicalTimeline(list) : list;
  }, [
    discoveredQuotes,
    searchQuery,
    filterCategory,
    filterSacredTradition,
    filterEpoch,
    chronologicalOrder,
    records,
  ]);

  const journalQuotes = useMemo(() => {
    return discoveredQuotes.filter((q) => {
      const rec = records[q.id];
      return (
        rec?.favorite ||
        (rec?.note && rec.note.trim().length > 0) ||
        q.isCustom
      );
    });
  }, [discoveredQuotes, records]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Editorial Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--bg-page)]/90 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Title */}
          <div
            onClick={() => setActiveTab('daily')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] flex items-center justify-center font-serif-editorial text-2xl italic select-none">
              Μ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-2xl tracking-tight font-normal">
                  Memorable Quotes
                </span>
                <span className="font-mono-meta text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                  by Simon Kola
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] m-0 hidden sm:block">
                Voci dalla Storia, Filosofia, Letteratura, Bibbia e Corano
              </p>
            </div>
          </div>

          {/* Navigation Pills (senza contatori numerici) */}
          <nav className="flex flex-wrap items-center gap-1 bg-[var(--bg-subtle)] p-1.5 rounded-xl border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Oggi & Estrai
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('authors')}
              className={`px-3 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'authors'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Filosofi, Autori & Studia
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Perché è successo?
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('collection')}
              className={`px-3 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'collection'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              Raccolta
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('journal')}
              className={`px-3 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <NotebookPen className="w-3.5 h-3.5" />
              Preferiti & Note
            </button>
          </nav>

          {/* Actions: New Custom Quote + Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] text-xs font-mono-meta flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Aggiungi Voce</span>
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              title={
                darkMode
                  ? 'Passa a Pergamena Chiara'
                  : 'Passa a Biblioteca Notturna'
              }
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-main)] cursor-pointer transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* =====================================================================
            TAB 1: OGGI & ESTRAI
        ===================================================================== */}
        {activeTab === 'daily' && (
          <div className="space-y-12">
            {/* Editorial Hero Section */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--border-subtle)] pb-8">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono-meta text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                    Giorno {dailySeeds.dayNumber}
                  </span>
                  <span className="font-mono-meta text-xs text-[var(--text-muted)] capitalize">
                    {formatItalianDate(selectedDate)}
                  </span>
                </div>
                <h1 className="hero-title m-0">
                  Parole che hanno inciso nella storia e nello spirito.
                </h1>
                <p className="text-base text-[var(--text-muted)] leading-relaxed m-0">
                  Ogni giorno una voce <strong>storica, filosofica o letteraria</strong>{' '}
                  e un passo dalle <strong>Sacre Scritture (Bibbia e Corano)</strong>,
                  accompagnati da ritratto, contesto dell’avvenimento, traduzioni
                  e approfondimento.
                </p>
              </div>

              {/* Date Switcher */}
              <div className="flex items-center gap-2 self-start lg:self-end bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => handleStepDate(-1)}
                  title="Giorno precedente"
                  className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 px-2 font-mono-meta text-xs">
                  <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                      e.target.value && setSelectedDate(e.target.value)
                    }
                    className="bg-transparent text-[var(--text-main)] focus:outline-none cursor-pointer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleStepDate(1)}
                  title="Giorno successivo"
                  className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(formatIsoDate(new Date()))}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-subtle)] text-[11px] font-mono-meta uppercase tracking-wider hover:opacity-80 cursor-pointer"
                >
                  Oggi
                </button>
              </div>
            </section>

            {/* Quick Navigation Banner to Authors & Historical Inquiries */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('authors')}
                className="bento-card p-5 flex items-center justify-between gap-4 cursor-pointer hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-1">
                  <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-hist)] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    Linea del Tempo Ordinata · Dal Big Bang al 2000 AD
                  </span>
                  <h3 className="font-serif-editorial text-2xl m-0">
                    Ere, Sottocartelle (es. Illuminismo → Kant) e Collegamenti
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] m-0">
                    Esplora filosofi e autori divisi con filo logico per epoca
                    (a.C. / AD), sottocartelle tematiche e mappa dei
                    collegamenti diretti tra pensatori.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
              </div>

              <div
                onClick={() => setActiveTab('inquiries')}
                className="bento-card p-5 flex items-center justify-between gap-4 cursor-pointer hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-1">
                  <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-bibl)] flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    Perché è successo? · Dal Big Bang alle Svolte del ’900
                  </span>
                  <h3 className="font-serif-editorial text-2xl m-0">
                    Paradossi, Bolle, Congiure e Sviste che hanno cambiato il mondo
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] m-0">
                    Dal Big Bang alla Bolla dei Tulipani, dalle Idi di Marzo
                    all’autista di Sarajevo fino a Černobyl’ e al Watergate:
                    raccontati con ironia, metafore e ripercussioni nel presente.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
              </div>
            </section>

            {/* Daily Pair: 1 Historical + 1 Biblical/Quranic */}
            <section className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif-editorial text-2xl md:text-3xl m-0">
                  Il Dittico del Giorno
                </h2>
              </div>

              {loadingDaily ? (
                <div className="bento-card p-12 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-gold)]" />
                  <p className="font-serif-editorial text-2xl m-0">
                    Apertura del Dittico del Giorno...
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {dailyHistorical && (
                    <QuoteBentoSheet
                      quote={dailyHistorical}
                      record={records[dailyHistorical.id]}
                      badgeLabel="Voce Storica, Filosofica & Letteraria del Giorno"
                      onToggleFavorite={toggleFavorite}
                      onSaveNote={saveNote}
                      onDeleteCustom={deleteCustomQuote}
                      onSelectAuthor={handleOpenAuthorFromAnywhere}
                    />
                  )}

                  {dailySacred && (
                    <QuoteBentoSheet
                      quote={dailySacred}
                      record={records[dailySacred.id]}
                      badgeLabel={`Passo Sacro del Giorno (${
                        dailySacred.sacredTradition ?? 'Bibbia & Corano'
                      })`}
                      onToggleFavorite={toggleFavorite}
                      onSaveNote={saveNote}
                      onDeleteCustom={deleteCustomQuote}
                      onSelectAuthor={handleOpenAuthorFromAnywhere}
                    />
                  )}
                </div>
              )}
            </section>

            {/* Quote Generator */}
            <section className="bento-card p-6 md:p-8 space-y-6 border-2 border-[var(--border-strong)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-gold)] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Esplorazione Libera
                  </span>
                  <h2 className="font-serif-editorial text-2xl md:text-3xl m-0">
                    Cerca o estrai nuove citazioni dalla Storia, dai Libri, dalla Bibbia e dal Corano
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] m-0">
                    Puoi estrarre a caso oppure scrivere il titolo di un libro o
                    il nome di un filosofo o autore (es.{' '}
                    <em>Friedrich Nietzsche</em>, <em>Tristano e Isotta</em>,{' '}
                    <em>Sofocle</em>, <em>Dante</em>, <em>Caravaggio</em>,{' '}
                    <em>Platone</em>).
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isDrawingApi}
                  onClick={handleDrawNewQuote}
                  className="px-6 py-3.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] font-mono-meta text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2.5 hover:opacity-90 transition-all cursor-pointer shrink-0 shadow-md"
                >
                  {isDrawingApi ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Dices className="w-4 h-4" />
                  )}
                  {customTopicQuery.trim()
                    ? `Cerca "${customTopicQuery}"`
                    : 'Estrai Nuova Citazione'}
                </button>
              </div>

              {/* Generator Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border-subtle)]">
                <div>
                  <label className="block font-mono-meta text-[11px] uppercase text-[var(--text-muted)] mb-1">
                    Autore, Filosofo, Libro o Fatto Storico (opzionale)
                  </label>
                  <input
                    type="text"
                    value={customTopicQuery}
                    onChange={(e) => setCustomTopicQuery(e.target.value)}
                    placeholder="Es. Nietzsche, Tristano e Isotta, Sofocle, Iliade, Pasolini..."
                    className="w-full rounded-lg px-3 py-2 text-xs bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-mono-meta text-[11px] uppercase text-[var(--text-muted)] mb-1">
                    Tipo di Voce (per estrazione casuale)
                  </label>
                  <select
                    value={drawCategory}
                    onChange={(e) =>
                      setDrawCategory(e.target.value as QuoteCategory | 'all')
                    }
                    className="w-full rounded-lg px-3 py-2 text-xs font-mono-meta bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                  >
                    <option value="all">
                      Tutte (Storia, Filosofia, Bibbia e Corano)
                    </option>
                    <option value="historical">
                      Solo Storiche, Filosofiche & Libri
                    </option>
                    <option value="biblical">
                      Solo Sacre Scritture (Bibbia & Corano)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono-meta text-[11px] uppercase text-[var(--text-muted)] mb-1">
                    Epoca Storica
                  </label>
                  <select
                    value={drawEpoch}
                    onChange={(e) =>
                      setDrawEpoch(e.target.value as EpochId | 'all')
                    }
                    className="w-full rounded-lg px-3 py-2 text-xs font-mono-meta bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                  >
                    <option value="all">Qualsiasi Epoca (Antichità → ’900)</option>
                    {EPOCHS.map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        {ep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drawn Quotes Display */}
              {drawnQuotes.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)]">
                      Voci estratte in questa sessione
                    </span>
                    <button
                      type="button"
                      onClick={() => setDrawnQuotes([])}
                      className="font-mono-meta text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] underline cursor-pointer"
                    >
                      Pulisci vista sessione (restano salvate nella Raccolta)
                    </button>
                  </div>

                  <div className="space-y-6">
                    {drawnQuotes.map((q, idx) => (
                      <QuoteBentoSheet
                        key={q.id}
                        quote={q}
                        record={records[q.id]}
                        badgeLabel={
                          idx === 0
                            ? 'Appena estratta'
                            : `Estratta ${drawnQuotes.length - idx}`
                        }
                        onToggleFavorite={toggleFavorite}
                        onSaveNote={saveNote}
                        onDeleteCustom={deleteCustomQuote}
                        onSelectAuthor={handleOpenAuthorFromAnywhere}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* =====================================================================
            TAB 2: FILOSOFI, AUTORI & STUDIA
        ===================================================================== */}
        {activeTab === 'authors' && (
          <AuthorsAtlasSection
            authorSeeds={allAuthorSeeds}
            records={records}
            studiedAuthors={studiedAuthors}
            selectedAuthorId={selectedAuthorId}
            onSelectAuthor={setSelectedAuthorId}
            onToggleAuthorStudied={toggleAuthorStudied}
            onAddAuthorSeed={addAuthorSeed}
            onRegisterDiscoveredQuote={registerDiscoveredQuote}
            onToggleFavorite={toggleFavorite}
            onSaveNote={saveNote}
          />
        )}

        {/* =====================================================================
            TAB 3: PERCHÉ È SUCCESSO?
        ===================================================================== */}
        {activeTab === 'inquiries' && (
          <HistoricalInquiriesSection
            onOpenAuthor={handleOpenAuthorFromAnywhere}
          />
        )}

        {/* =====================================================================
            TAB 4: RACCOLTA DELLE VOCI SCOPERTE
        ===================================================================== */}
        {activeTab === 'collection' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
              <div className="space-y-2">
                <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-hist)]">
                  Archivio Personale delle Citazioni
                </span>
                <h1 className="hero-title m-0">La Tua Raccolta nel Tempo</h1>
                <p className="text-sm text-[var(--text-muted)] m-0 max-w-2xl">
                  Ogni citazione che scopri nel Dittico del Giorno, che estrai o
                  che approfondisci studiando un autore viene custodita
                  automaticamente qui nella tua raccolta personale.
                </p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bento-card p-4 md:p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="relative md:col-span-2">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca nelle voci scoperte..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--border-strong)]"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) =>
                    setFilterCategory(e.target.value as QuoteCategory | 'all')
                  }
                  className="rounded-xl px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono-meta text-[var(--text-main)]"
                >
                  <option value="all">Tutte le categorie</option>
                  <option value="historical">
                    Storiche, Filosofiche & Letterarie
                  </option>
                  <option value="biblical">
                    Sacre Scritture (Bibbia & Corano)
                  </option>
                </select>

                <select
                  value={filterSacredTradition}
                  onChange={(e) =>
                    setFilterSacredTradition(
                      e.target.value as SacredTradition | 'all'
                    )
                  }
                  className="rounded-xl px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono-meta text-[var(--text-main)]"
                >
                  <option value="all">Bibbia + Corano + Storia</option>
                  <option value="Bibbia">Solo Passi della Bibbia</option>
                  <option value="Corano">Solo Versi del Corano</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)] text-xs font-mono-meta">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterEpoch('all')}
                    className={`px-2.5 py-1 rounded-md cursor-pointer ${
                      filterEpoch === 'all'
                        ? 'bg-[var(--text-main)] text-[var(--bg-surface)]'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                    }`}
                  >
                    Tutte le epoche
                  </button>
                  {EPOCHS.map((ep) => (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() =>
                        setFilterEpoch(filterEpoch === ep.id ? 'all' : ep.id)
                      }
                      className={`px-2.5 py-1 rounded-md cursor-pointer ${
                        filterEpoch === ep.id
                          ? 'bg-[var(--text-main)] text-[var(--bg-surface)]'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      {ep.shortName}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chronologicalOrder}
                    onChange={(e) => setChronologicalOrder(e.target.checked)}
                  />
                  <History className="w-3.5 h-3.5" />
                  Ordine Cronologico
                </label>
              </div>
            </div>

            {filteredCollection.length === 0 ? (
              <div className="bento-card p-12 text-center space-y-3">
                <p className="font-serif-editorial text-2xl m-0">
                  Nessuna citazione trovata con questi filtri.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCollection.map((quote) => (
                  <QuoteBentoSheet
                    key={quote.id}
                    quote={quote}
                    record={records[quote.id]}
                    onToggleFavorite={toggleFavorite}
                    onSaveNote={saveNote}
                    onDeleteCustom={deleteCustomQuote}
                    onSelectAuthor={handleOpenAuthorFromAnywhere}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 5: PREFERITI & DIARIO DI RIFLESSIONE
        ===================================================================== */}
        {activeTab === 'journal' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
              <div className="space-y-2">
                <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-gold)]">
                  Quaderno Personale · Salvato sul Dispositivo
                </span>
                <h1 className="hero-title m-0">
                  Preferiti, Appunti e Voci Personali
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] text-xs font-mono-meta uppercase tracking-wider flex items-center gap-2 cursor-pointer self-start md:self-end"
              >
                <Plus className="w-4 h-4" />
                Aggiungi Citazione o Versetto
              </button>
            </div>

            {journalQuotes.length === 0 ? (
              <div className="bento-card p-12 text-center space-y-4">
                <BookMarked className="w-10 h-10 mx-auto text-[var(--accent-gold)] opacity-80" />
                <h3 className="font-serif-editorial text-2xl m-0">
                  Il tuo quaderno è ancora vuoto
                </h3>
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto m-0">
                  Salva una citazione nei <strong>Preferiti</strong> o scrivi una{' '}
                  <strong>Nota personale</strong> sotto una scheda.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {journalQuotes.map((quote) => (
                  <QuoteBentoSheet
                    key={quote.id}
                    quote={quote}
                    record={records[quote.id]}
                    onToggleFavorite={toggleFavorite}
                    onSaveNote={saveNote}
                    onDeleteCustom={deleteCustomQuote}
                    onSelectAuthor={handleOpenAuthorFromAnywhere}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] font-mono-meta">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-main)] font-semibold">
              Memorable Quotes
            </span>
            <span>·</span>
            <span>by Simon Kola</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-[var(--accent-hist)]" />
              Storia, Filosofia & Libri
            </span>
            <span className="flex items-center gap-1">
              <ScrollText className="w-3.5 h-3.5 text-[var(--accent-bibl)]" />
              Bibbia & Corano
            </span>
          </div>
        </div>
      </footer>

      <AddCustomQuoteModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddQuote={addCustomQuote}
      />
    </div>
  );
};

export default App;
