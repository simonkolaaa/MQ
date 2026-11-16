import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
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
import { SimonNotesSection } from './components/SimonNotesSection';
import { WebGLEditorialCanvas } from './components/WebGLEditorialCanvas';
import { CinematicIntroExperience } from './components/CinematicIntroExperience';

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

function formatLiveTime(date: Date): string {
  return date.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
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

  // Orologio e data reale in tempo reale
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayIso = useMemo(() => formatIsoDate(now), [now]);

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    formatIsoDate(new Date())
  );
  const [futureWarning, setFutureWarning] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [warpActive, setWarpActive] = useState<boolean>(false);

  const triggerWarpBoost = () => {
    setWarpActive(true);
    setTimeout(() => {
      setWarpActive(false);
    }, 620);
  };

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
  const [dailyBible, setDailyBible] = useState<Quote | null>(null);
  const [dailyQuran, setDailyQuran] = useState<Quote | null>(null);
  const [loadingDaily, setLoadingDaily] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingDaily(true);

    Promise.all([
      fetchDynamicHistoricalQuote(
        dailySeeds.authorSeed,
        dailySeeds.quoteIndex
      ),
      fetchDynamicSacredQuote(dailySeeds.bibleSeed),
      fetchDynamicSacredQuote(dailySeeds.quranSeed),
    ])
      .then(([histQ, bibleQ, quranQ]) => {
        if (!cancelled) {
          setDailyHistorical(histQ);
          setDailyBible(bibleQ);
          setDailyQuran(quranQ);
          registerDiscoveredQuote(histQ);
          registerDiscoveredQuote(bibleQ);
          registerDiscoveredQuote(quranQ);
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
    const nextIso = formatIsoDate(dt);

    if (nextIso > todayIso) {
      setFutureWarning(
        'Il domani non è ancora stato scritto: non è possibile andare nei giorni futuri. Le nuove voci si sbloccheranno allo scoccare della mezzanotte.'
      );
      return;
    }

    setFutureWarning('');
    setSelectedDate(nextIso);
  };

  const handlePickDate = (newIso: string) => {
    if (!newIso) return;
    if (newIso > todayIso) {
      setSelectedDate(todayIso);
      setFutureWarning(
        'Il domani non è ancora stato scritto: puoi consultare le voci di oggi o viaggiare nei giorni passati, ma non nel futuro.'
      );
      return;
    }
    setFutureWarning('');
    setSelectedDate(newIso);
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

  const isViewingToday = selectedDate === todayIso;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Sfondo Spaziale 3D con Costellazioni e Fascio Veloce */}
      <WebGLEditorialCanvas darkMode={darkMode} warpActive={warpActive} />

      {/* Esperienza Intro mostrata una sola volta fino al refresh della pagina */}
      {showIntro && (
        <CinematicIntroExperience
          onSelectSection={(tab) => setActiveTab(tab)}
          onTriggerWarp={triggerWarpBoost}
          onDismissIntro={() => {
            setShowIntro(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Top Editorial Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--bg-page)]/85 border-b border-[var(--border-subtle)]">
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

          {/* Navigation Pills */}
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
              Oggi
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
              onClick={() => setActiveTab('journal')}
              className={`px-3 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <NotebookPen className="w-3.5 h-3.5" />
              Appunti di Simon & Note
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-10">
        {/* =====================================================================
            TAB 1: OGGI (TRITTICO STORIA + BIBBIA + CORANO E DATA REALE)
        ===================================================================== */}
        {activeTab === 'daily' && (
          <div className="space-y-10">
            {/* Editorial Hero Section con Data e Ora Reale */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--border-subtle)] pb-6">
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-gold font-mono-meta text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Ora attuale: {formatLiveTime(now)}
                  </span>
                  <span className="font-mono-meta text-xs text-[var(--text-muted)] capitalize">
                    {formatItalianDate(selectedDate)}
                  </span>
                </div>
                <h1 className="hero-title m-0">
                  Parole che hanno inciso nella storia e nello spirito.
                </h1>
                <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed m-0">
                  Ogni giorno tre voci — una{' '}
                  <strong>storica, filosofica o letteraria</strong>, un passo
                  della <strong>Bibbia</strong> e un versetto del{' '}
                  <strong>Corano</strong> — accompagnate dalle sottocartelle
                  cronologiche, dalle inchieste storiche e dagli appunti di
                  studio di Simon.
                </p>
              </div>

              {/* Selettore Data con blocco sul futuro */}
              <div className="flex flex-col items-start lg:items-end gap-2">
                <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => handleStepDate(-1)}
                    title="Vai al giorno precedente"
                    className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 px-2 font-mono-meta text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    <input
                      type="date"
                      value={selectedDate}
                      max={todayIso}
                      onChange={(e) => handlePickDate(e.target.value)}
                      className="bg-transparent text-[var(--text-main)] focus:outline-none cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStepDate(1)}
                    title={
                      isViewingToday
                        ? 'Non puoi andare nel futuro'
                        : 'Giorno successivo'
                    }
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      isViewingToday
                        ? 'opacity-40 text-[var(--text-faint)]'
                        : 'hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {!isViewingToday && (
                    <button
                      type="button"
                      onClick={() => {
                        setFutureWarning('');
                        setSelectedDate(todayIso);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--text-main)] text-[var(--bg-surface)] text-[11px] font-mono-meta uppercase tracking-wider cursor-pointer"
                    >
                      Torna a Oggi
                    </button>
                  )}
                </div>

                {futureWarning && (
                  <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--accent-gold)] text-xs font-mono-meta text-[var(--accent-gold)] flex items-center gap-2 max-w-md">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{futureWarning}</span>
                  </div>
                )}
              </div>
            </section>

            {/* 3 Scatole di Navigazione Rapida e Ordinata */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveTab('authors')}
                className="bento-card p-5 flex flex-col justify-between gap-3 cursor-pointer hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-1.5">
                  <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-hist)] flex items-center gap-1.5 font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    Dal Big Bang al 2000 AD
                  </span>
                  <h3 className="font-serif-editorial text-2xl m-0">
                    Filosofi, Poeti & Sottocartelle
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] m-0">
                    Dall’Illuminismo di Kant al Verismo di Verga, fino a
                    Nietzsche, Svevo, Pirandello e Ungaretti.
                  </p>
                </div>
                <span className="font-mono-meta text-xs text-[var(--text-main)] font-semibold flex items-center gap-1">
                  Esplora la Linea del Tempo <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('inquiries')}
                className="bento-card p-5 flex flex-col justify-between gap-3 cursor-pointer hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-1.5">
                  <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-bibl)] flex items-center gap-1.5 font-semibold">
                    <HelpCircle className="w-4 h-4" />
                    Cause, Ironia & Presente
                  </span>
                  <h3 className="font-serif-editorial text-2xl m-0">
                    Perché è successo?
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] m-0">
                    Dalla Bolla dei Tulipani e le Idi di Marzo fino a Sarajevo
                    1914, Černobyl’, Watergate e Prima Repubblica.
                  </p>
                </div>
                <span className="font-mono-meta text-xs text-[var(--text-main)] font-semibold flex items-center gap-1">
                  Scopri i Fatti Storici <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('journal')}
                className="bento-card p-5 flex flex-col justify-between gap-3 cursor-pointer hover:-translate-y-0.5 transition-all border border-[var(--accent-gold)]/50"
              >
                <div className="space-y-1.5">
                  <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5 font-semibold">
                    <NotebookPen className="w-4 h-4" />
                    Rubrica «Simon dice...»
                  </span>
                  <h3 className="font-serif-editorial text-2xl m-0">
                    Gli Appunti Scolastici di Simon
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] m-0">
                    Letteratura dell’800 e ’900 (Flaubert, Zola, Verga, Pascoli,
                    D’Annunzio, Svevo, Pirandello) e Storia contemporanea.
                  </p>
                </div>
                <span className="font-mono-meta text-xs text-[var(--accent-gold)] font-semibold flex items-center gap-1">
                  Apri il Quaderno di Simon <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </section>

            {/* TRITTICO DEL GIORNO: 1 STORICA + 1 BIBBIA + 1 CORANO */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif-editorial text-2xl md:text-3xl m-0">
                  Le Tre Voci di Oggi: Storia, Bibbia e Corano
                </h2>
                <span className="font-mono-meta text-xs text-[var(--text-muted)]">
                  Clicca su «Apri approfondimento» sotto ogni voce per leggere i dettagli
                </span>
              </div>

              {loadingDaily ? (
                <div className="bento-card p-12 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-gold)]" />
                  <p className="font-serif-editorial text-2xl m-0">
                    Apertura delle voci del giorno...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {dailyHistorical && (
                    <QuoteBentoSheet
                      quote={dailyHistorical}
                      record={records[dailyHistorical.id]}
                      badgeLabel="1. Voce Storica, Filosofica & Letteraria del Giorno"
                      onToggleFavorite={toggleFavorite}
                      onSaveNote={saveNote}
                      onDeleteCustom={deleteCustomQuote}
                      onSelectAuthor={handleOpenAuthorFromAnywhere}
                    />
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {dailyBible && (
                      <QuoteBentoSheet
                        quote={dailyBible}
                        record={records[dailyBible.id]}
                        badgeLabel="2. Passo del Giorno · La Bibbia"
                        compactByDefault={true}
                        onToggleFavorite={toggleFavorite}
                        onSaveNote={saveNote}
                        onDeleteCustom={deleteCustomQuote}
                        onSelectAuthor={handleOpenAuthorFromAnywhere}
                      />
                    )}

                    {dailyQuran && (
                      <QuoteBentoSheet
                        quote={dailyQuran}
                        record={records[dailyQuran.id]}
                        badgeLabel="3. Versetto del Giorno · Il Corano"
                        compactByDefault={true}
                        onToggleFavorite={toggleFavorite}
                        onSaveNote={saveNote}
                        onDeleteCustom={deleteCustomQuote}
                        onSelectAuthor={handleOpenAuthorFromAnywhere}
                      />
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Esploratore Libero di Nuove Citazioni */}
            <section className="bento-card p-6 md:p-7 space-y-5 border border-[var(--border-strong)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-gold)] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Scoperta Istantanea
                  </span>
                  <h2 className="font-serif-editorial text-2xl md:text-3xl m-0">
                    Vuoi leggere un’altra citazione o cercare un autore?
                  </h2>
                </div>

                <button
                  type="button"
                  disabled={isDrawingApi}
                  onClick={handleDrawNewQuote}
                  className="px-5 py-3 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] font-mono-meta text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer shrink-0"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border-subtle)]">
                <div>
                  <label className="block font-mono-meta text-[11px] uppercase text-[var(--text-muted)] mb-1">
                    Autore, Poeta o Libro (opzionale)
                  </label>
                  <input
                    type="text"
                    value={customTopicQuery}
                    onChange={(e) => setCustomTopicQuery(e.target.value)}
                    placeholder="Es. Verga, Svevo, Pirandello, Nietzsche, Pascoli..."
                    className="w-full rounded-lg px-3 py-2 text-xs bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-mono-meta text-[11px] uppercase text-[var(--text-muted)] mb-1">
                    Categoria
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
                      Solo Storiche, Filosofiche & Letterarie
                    </option>
                    <option value="biblical">
                      Solo Sacre Scritture (Bibbia & Corano)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono-meta text-[11px] uppercase text-[var(--text-muted)] mb-1">
                    Era Cronologica
                  </label>
                  <select
                    value={drawEpoch}
                    onChange={(e) =>
                      setDrawEpoch(e.target.value as EpochId | 'all')
                    }
                    className="w-full rounded-lg px-3 py-2 text-xs font-mono-meta bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                  >
                    <option value="all">Qualsiasi Era (Big Bang → 2000 AD)</option>
                    {EPOCHS.map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        {ep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {drawnQuotes.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)]">
                      Voci appena estratte
                    </span>
                    <button
                      type="button"
                      onClick={() => setDrawnQuotes([])}
                      className="font-mono-meta text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] underline cursor-pointer"
                    >
                      Chiudi anteprima
                    </button>
                  </div>

                  <div className="space-y-6">
                    {drawnQuotes.map((q) => (
                      <QuoteBentoSheet
                        key={q.id}
                        quote={q}
                        record={records[q.id]}
                        compactByDefault={true}
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
            TAB 2: FILOSOFI, AUTORI & STUDIA (LINEA DEL TEMPO BIG BANG -> 2000 AD)
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
            onTriggerWarp={triggerWarpBoost}
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
            TAB 4: APPUNTI DI SIMON («SIMON DICE...») & PREFERITI
        ===================================================================== */}
        {activeTab === 'journal' && (
          <SimonNotesSection
            journalQuotes={journalQuotes}
            records={records}
            onToggleFavorite={toggleFavorite}
            onSaveNote={saveNote}
            onDeleteCustom={deleteCustomQuote}
            onOpenAuthor={handleOpenAuthorFromAnywhere}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
          />
        )}

        {/* =====================================================================
            TAB 5: RACCOLTA DELLE VOCI SCOPERTE
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
                  Ogni citazione che scopri viene custodita automaticamente qui
                  nella tua raccolta personale, ordinata cronologicamente.
                </p>
              </div>
            </div>

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
                    compactByDefault={true}
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
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[var(--text-main)] font-semibold">
              Memorable Quotes
            </span>
            <span>·</span>
            <span>made by Simon Kola</span>
            <span>·</span>
            <a
              href="https://github.com/simonkolaaa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-main)] transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5 text-[var(--accent-gold)]"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
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
