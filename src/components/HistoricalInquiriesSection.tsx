import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Compass,
  Flame,
  History,
  Landmark,
  Loader2,
  Scale,
  Search,
  Sparkles,
  TrendingUp,
  UserRoundSearch,
} from 'lucide-react';
import { AUTHOR_SEEDS, EPOCHS, INQUIRY_SEEDS, InquirySeed } from '../data/seeds';
import { fetchDynamicHistoricalInquiry } from '../services/liveWikiApi';
import { HistoricalInquiry, InquiryCategory } from '../core/types';
import { AuthorPortrait } from './AuthorPortrait';

interface HistoricalInquiriesSectionProps {
  onOpenAuthor: (authorId: string) => void;
}

const CATEGORIES: (InquiryCategory | 'all')[] = [
  'all',
  'Cosmo, Scienza & Paradossi',
  'Economia, Bolle & Follie Collettive',
  'Potere, Congiure & Rivoluzioni',
  'Geopolitica, Guerre & Segreti del ’900',
];

export const HistoricalInquiriesSection: React.FC<
  HistoricalInquiriesSectionProps
> = ({ onOpenAuthor }) => {
  const [customQuery, setCustomQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<InquiryCategory | 'all'>(
    'all'
  );
  const [selectedSeed, setSelectedSeed] = useState<InquirySeed | string>(
    INQUIRY_SEEDS[0]
  );
  const [loadedInquiry, setLoadedInquiry] = useState<HistoricalInquiry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const filteredSeeds = useMemo(() => {
    if (activeCategory === 'all') return INQUIRY_SEEDS;
    return INQUIRY_SEEDS.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchDynamicHistoricalInquiry(selectedSeed)
      .then((res) => {
        if (!cancelled) {
          setLoadedInquiry(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSeed]);

  const handleAskLiveWiki = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    setSelectedSeed(customQuery.trim());
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div className="space-y-2">
          <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-bibl)] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            Dal Big Bang al 2000 AD · Paradossi, Scelte, Scandali e Svolte della Storia
          </span>
          <h1 className="hero-title m-0">Perché è successo?</h1>
          <p className="text-sm text-[var(--text-muted)] m-0 max-w-3xl">
            Dall’esplosione del <strong>Big Bang</strong> alla{' '}
            <strong>Bolla dei Tulipani</strong>, dall’autogol delle{' '}
            <strong>Idi di Marzo</strong> all’autista che sbagliò strada a{' '}
            <strong>Sarajevo nel 1914</strong>, fino al{' '}
            <strong>Watergate</strong>, a <strong>Černobyl’</strong> e ai grandi
            scandali di fine Novecento: raccontati senza mattoni noiosi, con
            ironia, metafore e ripercussioni nel presente.
          </p>
        </div>
      </div>

      {/* Search & Category Explorer */}
      <div className="bento-card p-5 md:p-6 space-y-5 border-2 border-[var(--border-strong)]">
        <form onSubmit={handleAskLiveWiki} className="space-y-2">
          <label className="block font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold">
            Curioso di un altro fatto storico, politico o scientifico? Cercalo qui:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Es. Progetto Manhattan, Disastro del Titanic, Guerra di Troia, Crisi di Sigonella, Rivoluzione russa..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--border-strong)]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] text-xs font-mono-meta uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Compass className="w-4 h-4" />
              )}
              Scopri perché è successo
            </button>
          </div>
        </form>

        {/* Category Filter Tabs */}
        <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-mono-meta text-xs cursor-pointer transition-all ${
                  activeCategory === cat
                    ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-semibold'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {cat === 'all' ? 'Tutti i Fatti (Big Bang → 2000 AD)' : cat}
              </button>
            ))}
          </div>

          {/* Grid of Case Study Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {filteredSeeds.map((seed) => {
              const isSelected =
                typeof selectedSeed !== 'string' &&
                selectedSeed.id === seed.id;
              return (
                <button
                  key={seed.id}
                  type="button"
                  onClick={() => setSelectedSeed(seed)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-[var(--bg-inset)] border-2 border-[var(--accent-gold)] shadow-xs'
                      : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AuthorPortrait
                      name={seed.protagonistName}
                      wikiTitle={seed.protagonistWikiTitle}
                      size="md"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-hist)] font-semibold block truncate">
                        {seed.category}
                      </span>
                      <div className="font-serif-editorial text-lg leading-snug text-[var(--text-main)] line-clamp-2">
                        {seed.question}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] m-0 line-clamp-2 italic">
                    «{seed.satiricalHook}»
                  </p>

                  <div className="font-mono-meta text-[10px] text-[var(--accent-gold)] pt-1 border-t border-[var(--border-subtle)]">
                    {seed.periodLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Inquiry Result Dossier */}
      {isLoading || !loadedInquiry ? (
        <div className="bento-card p-12 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-bibl)]" />
          <p className="font-serif-editorial text-2xl m-0">
            Apertura del racconto storico...
          </p>
        </div>
      ) : (
        <article className="bento-card p-6 md:p-8 space-y-7">
          {/* Top Dossier Header */}
          <div className="flex flex-col md:flex-row gap-6 md:items-center border-b border-[var(--border-subtle)] pb-6">
            <div className="flex flex-col items-start gap-2 shrink-0">
              <AuthorPortrait
                name={loadedInquiry.protagonistName}
                portraitUrl={loadedInquiry.portraitUrl}
                wikiTitle={loadedInquiry.protagonistWikiTitle}
                size="xl"
              />
              <span className="font-mono-meta text-[10px] text-[var(--text-faint)] max-w-[150px]">
                {loadedInquiry.protagonistName}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-hist font-mono-meta text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  {loadedInquiry.category}
                </span>
                <span className="badge-bibl font-mono-meta text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  {loadedInquiry.periodLabel}
                </span>
                {EPOCHS.find((e) => e.id === loadedInquiry.epochId) && (
                  <span className="font-mono-meta text-xs px-2.5 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)]">
                    {
                      EPOCHS.find((e) => e.id === loadedInquiry.epochId)
                        ?.shortName
                    }
                  </span>
                )}
              </div>

              <h2 className="quote-display text-[var(--text-main)] m-0">
                {loadedInquiry.question}
              </h2>

              {/* Il Paradosso / Metafora che aggancia subito il lettore */}
              <div className="bento-subbox p-4 border-l-4 border-[var(--accent-gold)] space-y-1">
                <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-gold)] font-semibold block">
                  Il Paradosso in una frase:
                </span>
                <p className="font-serif-editorial text-xl md:text-2xl text-[var(--text-main)] m-0">
                  {loadedInquiry.satiricalHook}
                </p>
              </div>
            </div>
          </div>

          {/* 1. PERCHÉ È SUCCESSO? & 2. COSA RESTA OGGI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bento-subbox p-6 space-y-3 border-2 border-[var(--accent-hist)]/40">
              <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-hist)] font-semibold">
                <AlertTriangle className="w-4 h-4" />
                1. Perché è successo davvero?
              </div>
              <p className="text-sm md:text-base leading-relaxed text-[var(--text-main)] m-0">
                {loadedInquiry.whyItHappened}
              </p>
            </div>

            <div className="bento-subbox p-6 space-y-3 border-2 border-[var(--accent-gold)]/50">
              <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold">
                <TrendingUp className="w-4 h-4" />
                2. Ripercussioni nel Presente (Perché ci riguarda ancora)
              </div>
              <p className="text-sm md:text-base leading-relaxed text-[var(--text-main)] m-0">
                {loadedInquiry.presentRepercussions}
              </p>
            </div>
          </div>

          {/* 3. STUDIA IL FATTO IN BREVE */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif-editorial text-2xl md:text-3xl m-0 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--accent-hist)]" />
                3. Il Fatto in Breve: Gli Atti Chiave
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loadedInquiry.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bento-subbox p-5 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="badge-hist font-mono-meta text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        {step.chronology}
                      </span>
                      <Flame className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    </div>

                    <h4 className="font-serif-editorial text-xl text-[var(--text-main)] m-0">
                      {step.phaseTitle}
                    </h4>

                    <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                      {step.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Morale Storica */}
          <div className="bento-subbox p-5 border border-[var(--accent-gold)]/40 space-y-1.5">
            <div className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              La Morale della Storia
            </div>
            <p className="font-serif-editorial text-xl text-[var(--text-main)] m-0">
              {loadedInquiry.philosophicalTakeaway}
            </p>
          </div>

          {/* Protagonisti e Pensatori Collegati */}
          {loadedInquiry.relatedAuthorIds.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
              <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                Filosofi, Autori e Protagonisti Collegati:
              </span>
              <div className="flex flex-wrap gap-3">
                {loadedInquiry.relatedAuthorIds.map((aId) => {
                  const auth = AUTHOR_SEEDS.find((a) => a.id === aId);
                  if (!auth) return null;
                  return (
                    <button
                      key={auth.id}
                      type="button"
                      onClick={() => onOpenAuthor(auth.id)}
                      className="bento-subbox p-3 flex items-center gap-3 hover:border-[var(--border-strong)] cursor-pointer transition-all text-left"
                    >
                      <AuthorPortrait
                        name={auth.name}
                        wikiTitle={auth.wikiTitle}
                        size="sm"
                      />
                      <div>
                        <div className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-1">
                          {auth.name}
                          <UserRoundSearch className="w-3.5 h-3.5 text-[var(--accent-hist)]" />
                        </div>
                        <div className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                          {auth.yearBadge} · Apri nella Linea del Tempo
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      )}
    </div>
  );
};
