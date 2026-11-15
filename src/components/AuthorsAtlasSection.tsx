import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  FolderOpen,
  GitBranch,
  Globe2,
  GraduationCap,
  Landmark,
  Loader2,
  Plus,
  ScrollText,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  AuthorSeed,
  EPOCHS,
  SUBFOLDER_MOVEMENTS,
  WIKI_DISCOVERY_CATEGORIES,
  WikiDiscoveryCategory,
} from '../data/seeds';
import { filterAuthorSeeds } from '../core/quoteEngine';
import {
  discoverAuthorsFromWikiCategory,
  fetchAuthorFullDossier,
  searchAndCreateAuthorFromWiki,
} from '../services/liveWikiApi';
import {
  AuthorProfession,
  AuthorProfile,
  EpochId,
  Quote,
  UserQuoteRecord,
} from '../core/types';
import { AuthorPortrait } from './AuthorPortrait';
import { QuoteBentoSheet } from './QuoteBentoSheet';

interface AuthorsAtlasSectionProps {
  authorSeeds: AuthorSeed[];
  records: Record<string, UserQuoteRecord>;
  studiedAuthors: Record<string, boolean>;
  selectedAuthorId: string | null;
  onSelectAuthor: (id: string | null) => void;
  onToggleAuthorStudied: (id: string) => void;
  onAddAuthorSeed: (seed: AuthorSeed) => void;
  onRegisterDiscoveredQuote: (quote: Quote) => void;
  onToggleFavorite: (quoteId: string) => void;
  onSaveNote: (quoteId: string, note: string) => void;
}

const PROFESSIONS: AuthorProfession[] = [
  'Filosofo',
  'Scrittore e Poeta',
  'Drammaturgo e Tragediografo',
  'Pittore, Artista e Genio Universale',
  'Storico, Politico e Statista',
  'Scienziato e Pensatore',
];

export const AuthorsAtlasSection: React.FC<AuthorsAtlasSectionProps> = ({
  authorSeeds,
  records,
  studiedAuthors,
  selectedAuthorId,
  onSelectAuthor,
  onToggleAuthorStudied,
  onAddAuthorSeed,
  onRegisterDiscoveredQuote,
  onToggleFavorite,
  onSaveNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [wikiSearchInput, setWikiSearchInput] = useState('');
  const [isSearchingWiki, setIsSearchingWiki] = useState(false);

  const [discoveringCategoryId, setDiscoveringCategoryId] = useState<
    string | null
  >(null);
  const [discoveryFeedback, setDiscoveryFeedback] = useState<string>('');

  const [selectedNationality, setSelectedNationality] = useState<string>('all');
  const [selectedProfession, setSelectedProfession] = useState<
    AuthorProfession | 'all'
  >('all');
  const [selectedEpoch, setSelectedEpoch] = useState<EpochId | 'all'>('all');
  const [selectedSubfolder, setSelectedSubfolder] = useState<string>('all');
  const [onlyStudied, setOnlyStudied] = useState(false);

  // Stato di apertura/chiusura delle sottocartelle (tutte aperte di default per mostrare il filo logico)
  const [collapsedFolders, setCollapsedFolders] = useState<
    Record<string, boolean>
  >({});

  const [loadingDossier, setLoadingDossier] = useState(false);
  const [loadedProfile, setLoadedProfile] = useState<AuthorProfile | null>(
    null
  );
  const [loadedQuotes, setLoadedQuotes] = useState<Quote[]>([]);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);

  const nationalities = useMemo(() => {
    const set = new Set<string>(authorSeeds.map((a) => a.nationality));
    return Array.from(set);
  }, [authorSeeds]);

  const filteredSeeds = useMemo(() => {
    return filterAuthorSeeds(
      authorSeeds,
      {
        query: searchQuery,
        nationality: selectedNationality,
        profession: selectedProfession,
        epochId: selectedEpoch,
        subfolderId: selectedSubfolder,
        onlyStudied,
      },
      studiedAuthors
    );
  }, [
    authorSeeds,
    searchQuery,
    selectedNationality,
    selectedProfession,
    selectedEpoch,
    selectedSubfolder,
    onlyStudied,
    studiedAuthors,
  ]);

  const activeSeed = useMemo(
    () => authorSeeds.find((a) => a.id === selectedAuthorId),
    [authorSeeds, selectedAuthorId]
  );

  useEffect(() => {
    if (!activeSeed) {
      setLoadedProfile(null);
      setLoadedQuotes([]);
      return;
    }

    let cancelled = false;
    setLoadingDossier(true);
    setActiveChapterIdx(0);

    fetchAuthorFullDossier(activeSeed)
      .then((res) => {
        if (!cancelled) {
          setLoadedProfile(res.profile);
          setLoadedQuotes(res.quotes);
          res.quotes.forEach((q) => onRegisterDiscoveredQuote(q));
          setLoadingDossier(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingDossier(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSeed, onRegisterDiscoveredQuote]);

  const handleSearchWikiAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wikiSearchInput.trim()) return;
    setIsSearchingWiki(true);
    const foundSeed = await searchAndCreateAuthorFromWiki(
      wikiSearchInput.trim()
    );
    setIsSearchingWiki(false);
    if (foundSeed) {
      onAddAuthorSeed(foundSeed);
      setWikiSearchInput('');
      onSelectAuthor(foundSeed.id);
    }
  };

  const handleDiscoverCategory = async (cat: WikiDiscoveryCategory) => {
    setDiscoveringCategoryId(cat.id);
    setDiscoveryFeedback('');
    const discoveredList = await discoverAuthorsFromWikiCategory(cat);
    setDiscoveringCategoryId(null);

    if (discoveredList.length > 0) {
      discoveredList.forEach((seed) => onAddAuthorSeed(seed));
      setSelectedEpoch(cat.defaultEpochId);
      setSelectedSubfolder(cat.defaultSubfolderId);
      setDiscoveryFeedback(
        `Aggiunti nuovi pensatori nella sottocartella "${cat.label}".`
      );
    }
  };

  const toggleFolder = (folderId: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // ===========================================================================
  // VISTA DETTAGLIO E STUDIO AUTORE
  // ===========================================================================
  if (activeSeed) {
    const epoch = EPOCHS.find((e) => e.id === activeSeed.epochId);
    const subfolder = SUBFOLDER_MOVEMENTS.find(
      (s) => s.id === activeSeed.subfolderId
    );
    const isStudied = !!studiedAuthors[activeSeed.id];

    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onSelectAuthor(null)}
            className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] text-xs font-mono-meta uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla Linea del Tempo (Big Bang → 2000 AD)
          </button>

          <button
            type="button"
            onClick={() => onToggleAuthorStudied(activeSeed.id)}
            className={`px-4 py-2 rounded-xl border text-xs font-mono-meta uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              isStudied
                ? 'badge-gold font-semibold'
                : 'border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-main)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isStudied ? 'Autore Studiato' : 'Segna come Studiato'}
          </button>
        </div>

        {loadingDossier || !loadedProfile ? (
          <div className="bento-card p-12 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-gold)]" />
            <p className="font-serif-editorial text-2xl m-0">
              Apertura scheda e collegamenti di {activeSeed.name}...
            </p>
          </div>
        ) : (
          <>
            <section className="bento-card p-6 md:p-8 space-y-6">
              {/* Breadcrumb Cronologico: Era -> Sottocartella -> Anno */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-meta pb-3 border-b border-[var(--border-subtle)]">
                {epoch && (
                  <span className="badge-gold px-3 py-1 rounded-full">
                    {epoch.name} ({epoch.period})
                  </span>
                )}
                {subfolder && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="badge-hist px-3 py-1 rounded-full flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5" />
                      {subfolder.name}
                    </span>
                  </>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="badge-bibl px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {loadedProfile.yearBadge}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex flex-col items-start gap-2">
                  <AuthorPortrait
                    name={loadedProfile.name}
                    portraitUrl={loadedProfile.portraitUrl}
                    wikiTitle={activeSeed.wikiTitle}
                    size="xl"
                  />
                  <span className="font-mono-meta text-[10px] text-[var(--text-faint)] max-w-[160px]">
                    {loadedProfile.portraitCaption}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono-meta text-xs px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[var(--accent-hist)]" />
                      {loadedProfile.profession}
                    </span>

                    <span className="font-mono-meta text-xs px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-[var(--accent-bibl)]" />
                      {loadedProfile.nationality}
                    </span>
                  </div>

                  <h1 className="hero-title m-0">{loadedProfile.name}</h1>

                  <div className="font-mono-meta text-xs text-[var(--text-muted)]">
                    Coordinate storiche: <strong>{loadedProfile.lifeSpan}</strong>
                  </div>

                  {/* Il Ritratto Brillante / Satirico che aggancia il lettore */}
                  <div className="bento-subbox p-4 border-l-4 border-[var(--accent-gold)] space-y-1">
                    <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-gold)] font-semibold block">
                      Il Personaggio senza filtro:
                    </span>
                    <p className="text-sm md:text-base leading-relaxed text-[var(--text-main)] m-0">
                      {loadedProfile.satiricalHook}
                    </p>
                  </div>
                </div>
              </div>

              {/* RETE DEI COLLEGAMENTI CON ALTRI FILOSOFI E AUTORI */}
              <div className="bento-subbox p-5 space-y-3 border border-[var(--border-strong)]">
                <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-hist)] font-semibold">
                  <GitBranch className="w-4 h-4" />
                  Filo Logico & Collegamenti Diretti nella Storia del Pensiero
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                  {loadedProfile.connectionNote}
                </p>

                {loadedProfile.connectedAuthorIds.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {loadedProfile.connectedAuthorIds.map((connId) => {
                      const connSeed = authorSeeds.find((a) => a.id === connId);
                      if (!connSeed) return null;
                      return (
                        <button
                          key={connSeed.id}
                          type="button"
                          onClick={() => {
                            onSelectAuthor(connSeed.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] flex items-center gap-2.5 cursor-pointer transition-all text-left"
                        >
                          <AuthorPortrait
                            name={connSeed.name}
                            wikiTitle={connSeed.wikiTitle}
                            size="sm"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[var(--text-main)]">
                              {connSeed.name}
                            </div>
                            <div className="font-mono-meta text-[10px] text-[var(--accent-gold)]">
                              {connSeed.yearBadge} · Apri collegamento →
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bento Grid: Inquadramento + Biografia */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                <div className="bento-subbox p-5 space-y-2">
                  <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-bibl)] font-semibold">
                    <Landmark className="w-4 h-4" />
                    Il Contesto del Suo Tempo
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                    {loadedProfile.periodDefinition}
                  </p>
                </div>

                <div className="bento-subbox p-5 space-y-2">
                  <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold">
                    <Sparkles className="w-4 h-4" />
                    Sintesi Biografica
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                    {loadedProfile.biography}
                  </p>
                </div>
              </div>

              {/* Opere Principali */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-hist)] font-semibold">
                  <BookOpen className="w-4 h-4" />
                  Opere Principali e Libri Chiave
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {loadedProfile.famousWorks.map((work) => (
                    <div
                      key={work.title}
                      className="bento-subbox p-4 space-y-1.5"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="font-serif-editorial text-xl text-[var(--text-main)] m-0">
                          {work.title}
                        </h4>
                        <span className="font-mono-meta text-[11px] text-[var(--accent-gold)] shrink-0">
                          {work.year}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-muted)] m-0">
                        {work.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SEZIONE "STUDIA": RACCONTO AGILE E DIRETTO IN CAPITOLI */}
            <section className="bento-card p-6 md:p-8 space-y-6 border-2 border-[var(--border-strong)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div className="space-y-1">
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-gold)] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    Sezione Studia · Il Racconto Essenziale del Pensiero e dei Fatti
                  </span>
                  <h2 className="font-serif-editorial text-2xl md:text-3xl m-0">
                    Studia {loadedProfile.name} in {loadedProfile.studyChapters.length} tappe
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleAuthorStudied(activeSeed.id)}
                  className="px-4 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] text-xs font-mono-meta uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  {isStudied
                    ? 'Studio Completato'
                    : 'Conferma Studio Completato'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {loadedProfile.studyChapters.map((chap, idx) => (
                  <button
                    key={chap.chapterNumber}
                    type="button"
                    onClick={() => setActiveChapterIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl font-mono-meta text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeChapterIdx === idx
                        ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-semibold'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    <ScrollText className="w-3.5 h-3.5" />
                    {chap.chapterNumber}. {chap.title}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loadedProfile.studyChapters.map((chap, idx) => {
                  const isFocused = idx === activeChapterIdx;
                  return (
                    <article
                      key={chap.chapterNumber}
                      onClick={() => setActiveChapterIdx(idx)}
                      className={`bento-subbox p-5 space-y-2.5 transition-all cursor-pointer ${
                        isFocused
                          ? 'border-2 border-[var(--accent-gold)] shadow-sm'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="badge-gold font-mono-meta text-xs px-2.5 py-0.5 rounded-full font-semibold">
                          Tappa {chap.chapterNumber}
                        </span>
                        <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                          {loadedProfile.yearBadge}
                        </span>
                      </div>

                      <h3 className="font-serif-editorial text-xl text-[var(--text-main)] m-0">
                        {chap.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-[var(--text-main)] m-0 whitespace-pre-line">
                        {chap.content}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Citazioni dell'autore */}
            <section className="space-y-5">
              <h2 className="font-serif-editorial text-2xl md:text-3xl m-0">
                Citazioni di {loadedProfile.name}
              </h2>

              <div className="space-y-6">
                {loadedQuotes.map((q) => (
                  <QuoteBentoSheet
                    key={q.id}
                    quote={q}
                    record={records[q.id]}
                    onToggleFavorite={onToggleFavorite}
                    onSaveNote={onSaveNote}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    );
  }

  // ===========================================================================
  // VISTA ALBERO CRONOLOGICO ORDINATO (DAL BIG BANG AL 2000 AD) CON SOTTOCARTELLE
  // ===========================================================================
  const chronologicalEpochs = EPOCHS.filter((e) => e.id !== 'biblico');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div className="space-y-2">
          <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-hist)]">
            Percorso Cronologico Ordinato · Dal Big Bang al 2000 AD
          </span>
          <h1 className="hero-title m-0">
            Mappa del Pensiero: Ere, Sottocartelle e Collegamenti
          </h1>
          <p className="text-sm text-[var(--text-muted)] m-0 max-w-3xl">
            Niente più autori sparsi a caso: esplora la storia seguendo il{' '}
            <strong>filo logico cronologico (a.C. → AD)</strong>. Ogni{' '}
            <strong>Era</strong> contiene le sue{' '}
            <strong>
              Sottocartelle tematiche (es. L’Illuminismo con Voltaire, Rousseau
              e Kant)
            </strong>{' '}
            e mostra come ogni pensatore ha ispirato o sfidato i successivi.
          </p>
        </div>
      </div>

      {/* BARRA RAPIDA DELLE ERE (BIG BANG -> 2000 AD) E SOTTOCARTELLE */}
      <div className="bento-card p-5 space-y-4">
        <div className="space-y-2">
          <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-gold)] font-semibold block">
            1. Seleziona l’Era Storica (a.C. / AD):
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedEpoch('all');
                setSelectedSubfolder('all');
              }}
              className={`px-3.5 py-2 rounded-xl font-mono-meta text-xs cursor-pointer transition-all ${
                selectedEpoch === 'all'
                  ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-semibold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Tutte le Ere (Big Bang → 2000 AD)
            </button>

            {chronologicalEpochs.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => {
                  setSelectedEpoch(selectedEpoch === ep.id ? 'all' : ep.id);
                  setSelectedSubfolder('all');
                }}
                className={`px-3.5 py-2 rounded-xl font-mono-meta text-xs cursor-pointer transition-all ${
                  selectedEpoch === ep.id
                    ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-semibold'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {ep.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro rapido per Sottocartella (es. Illuminismo, Stoicismo, Nietzsche...) */}
        <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
          <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-hist)] font-semibold block">
            2. Oppure apri direttamente una Sottocartella / Corrente:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedSubfolder('all')}
              className={`px-3 py-1.5 rounded-lg font-mono-meta text-xs cursor-pointer transition-all ${
                selectedSubfolder === 'all'
                  ? 'badge-gold font-semibold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Tutte le Sottocartelle
            </button>

            {SUBFOLDER_MOVEMENTS.filter(
              (sf) => selectedEpoch === 'all' || sf.epochId === selectedEpoch
            ).map((sf) => (
              <button
                key={sf.id}
                type="button"
                onClick={() =>
                  setSelectedSubfolder(
                    selectedSubfolder === sf.id ? 'all' : sf.id
                  )
                }
                className={`px-3 py-1.5 rounded-lg font-mono-meta text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                  selectedSubfolder === sf.id
                    ? 'badge-gold font-semibold'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <FolderOpen className="w-3 h-3" />
                {sf.name.split(':')[0]} ({sf.yearsLabel})
              </button>
            ))}
          </div>
        </div>

        {/* Ricerca testuale, Ruolo e Nazionalità */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca filosofo, corrente o anno (es. Illuminismo, Kant, Nietzsche, 1784 AD, Socrate...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--border-strong)]"
            />
          </div>

          <div>
            <select
              value={selectedProfession}
              onChange={(e) =>
                setSelectedProfession(
                  e.target.value as AuthorProfession | 'all'
                )
              }
              className="w-full rounded-xl px-3 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono-meta text-[var(--text-main)]"
            >
              <option value="all">Tutti i Ruoli</option>
              {PROFESSIONS.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono-meta text-[var(--text-main)]"
            >
              <option value="all">Tutte le Nazionalità</option>
              {nationalities.map((nat) => (
                <option key={nat} value={nat}>
                  {nat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end pt-1">
          <label className="flex items-center gap-2 text-xs font-mono-meta cursor-pointer">
            <input
              type="checkbox"
              checked={onlyStudied}
              onChange={(e) => setOnlyStudied(e.target.checked)}
            />
            Mostra solo autori già studiati
          </label>
        </div>
      </div>

      {/* SEZIONI CRONOLOGICHE ORDINATE (ERA -> SOTTOCARTELLA -> AUTORI COLLEGATI) */}
      <div className="space-y-12">
        {chronologicalEpochs.map((epoch) => {
          const epochSeeds = filteredSeeds.filter(
            (s) => s.epochId === epoch.id
          );
          if (epochSeeds.length === 0) return null;

          const subfoldersForEpoch = SUBFOLDER_MOVEMENTS.filter(
            (sf) => sf.epochId === epoch.id
          );

          return (
            <section
              key={epoch.id}
              className="space-y-6 border-l-2 border-[var(--accent-gold)] pl-4 md:pl-6"
            >
              {/* Intestazione della Macro-Era (con anni a.C. / AD) */}
              <div className="bento-card p-5 md:p-6 bg-[var(--bg-surface)] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="badge-gold font-mono-meta text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Coordinate: {epoch.period}
                  </span>
                  <span className="font-mono-meta text-xs text-[var(--text-muted)]">
                    Macro-Sezione Cronologica
                  </span>
                </div>

                <h2 className="font-serif-editorial text-3xl md:text-4xl text-[var(--text-main)] m-0">
                  {epoch.name}
                </h2>
                <p className="text-sm text-[var(--text-muted)] m-0 max-w-3xl">
                  {epoch.description}
                </p>
              </div>

              {/* Sottocartelle (Movimenti / Correnti) dentro la Macro-Era */}
              <div className="space-y-6">
                {subfoldersForEpoch.map((subfolder) => {
                  const folderAuthors = epochSeeds.filter(
                    (s) => s.subfolderId === subfolder.id
                  );
                  if (folderAuthors.length === 0) return null;

                  const isCollapsed = !!collapsedFolders[subfolder.id];

                  return (
                    <div
                      key={subfolder.id}
                      className="bento-card p-5 md:p-6 space-y-5 border border-[var(--border-strong)]"
                    >
                      {/* Intestazione Sottocartella */}
                      <div
                        onClick={() => toggleFolder(subfolder.id)}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="badge-hist font-mono-meta text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                              <FolderOpen className="w-3.5 h-3.5" />
                              Sottocartella · {subfolder.yearsLabel}
                            </span>
                          </div>

                          <h3 className="font-serif-editorial text-2xl md:text-3xl text-[var(--text-main)] m-0">
                            {subfolder.name}
                          </h3>
                        </div>

                        <button
                          type="button"
                          className="self-start md:self-center px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] text-xs font-mono-meta text-[var(--text-main)] flex items-center gap-1.5"
                        >
                          {isCollapsed ? (
                            <>
                              <ChevronRight className="w-4 h-4" />
                              Apri Sottocartella
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Chiudi Sottocartella
                            </>
                          )}
                        </button>
                      </div>

                      {!isCollapsed && (
                        <>
                          {/* Spiegazione ironica/metaforica della corrente + Mappa dei Collegamenti */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                            <div className="bento-subbox p-4 space-y-1">
                              <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-gold)] font-semibold block">
                                Lo Spirito dell’Epoca:
                              </span>
                              <p className="text-xs md:text-sm leading-relaxed text-[var(--text-main)] m-0">
                                {subfolder.wittyDescription}
                              </p>
                            </div>

                            <div className="bento-subbox p-4 space-y-1 border border-[var(--accent-hist)]/40">
                              <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-hist)] font-semibold flex items-center gap-1">
                                <GitBranch className="w-3.5 h-3.5" />
                                Come si collegano tra loro:
                              </span>
                              <p className="text-xs md:text-sm leading-relaxed text-[var(--text-main)] m-0">
                                {subfolder.connectionMapLabel}
                              </p>
                            </div>
                          </div>

                          {/* Griglia ordinata per anno degli autori nella sottocartella */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                            {folderAuthors.map((seed) => {
                              const isStudied = !!studiedAuthors[seed.id];

                              return (
                                <div
                                  key={seed.id}
                                  onClick={() => {
                                    onSelectAuthor(seed.id);
                                    window.scrollTo({
                                      top: 0,
                                      behavior: 'smooth',
                                    });
                                  }}
                                  className="bento-subbox p-4 flex flex-col justify-between gap-4 cursor-pointer hover:border-[var(--border-strong)] hover:-translate-y-0.5 transition-all bg-[var(--bg-surface)]"
                                >
                                  <div className="space-y-3">
                                    {/* Riga superiore: Anno (a.C. / AD) + Stato studio */}
                                    <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2">
                                      <span className="badge-bibl font-mono-meta text-[11px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {seed.yearBadge}
                                      </span>
                                      {isStudied ? (
                                        <span className="badge-gold font-mono-meta text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Studiato
                                        </span>
                                      ) : (
                                        <span className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                                          {seed.profession}
                                        </span>
                                      )}
                                    </div>

                                    {/* Foto + Nome */}
                                    <div className="flex items-center gap-3.5">
                                      <AuthorPortrait
                                        name={seed.name}
                                        wikiTitle={seed.wikiTitle}
                                        size="lg"
                                      />
                                      <div className="space-y-0.5 min-w-0 flex-1">
                                        <h4 className="font-serif-editorial text-2xl leading-tight text-[var(--text-main)] m-0">
                                          {seed.name}
                                        </h4>
                                        <div className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                                          {seed.nationality}
                                        </div>
                                        <div className="font-mono-meta text-[10px] text-[var(--accent-hist)] line-clamp-1">
                                          {seed.historicalEventLabel}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Hook ironico / metaforico */}
                                    <p className="text-xs leading-relaxed text-[var(--text-main)] m-0 line-clamp-4">
                                      {seed.satiricalHook}
                                    </p>

                                    {/* Pillole dei Collegamenti Diretti */}
                                    {seed.connectedAuthorIds.length > 0 && (
                                      <div className="pt-1 space-y-1">
                                        <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                                          <GitBranch className="w-3 h-3 text-[var(--accent-gold)]" />
                                          Collegato con:
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                          {seed.connectedAuthorIds.map(
                                            (connId) => {
                                              const conn = authorSeeds.find(
                                                (a) => a.id === connId
                                              );
                                              if (!conn) return null;
                                              return (
                                                <button
                                                  key={conn.id}
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectAuthor(conn.id);
                                                    window.scrollTo({
                                                      top: 0,
                                                      behavior: 'smooth',
                                                    });
                                                  }}
                                                  className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-inset)] border border-[var(--border-subtle)] font-mono-meta text-[10px] text-[var(--text-main)] cursor-pointer"
                                                >
                                                  ↔ {conn.name}
                                                </button>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-subtle)] text-xs font-mono-meta">
                                    <span className="text-[var(--text-muted)]">
                                      {seed.yearBadge}
                                    </span>
                                    <span className="text-[var(--text-main)] font-semibold flex items-center gap-1">
                                      <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                                      Apri & Studia →
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* PANNELLO SCOPERTA DI ALTRI FILOSOFI E AUTORI NELLE SOTTOCARTELLE */}
      <section className="bento-card p-5 md:p-6 space-y-4 border-2 border-[var(--border-strong)]">
        <div className="space-y-1">
          <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5 font-semibold">
            <Compass className="w-4 h-4" />
            Amplia le Sottocartelle · Scopri altri Filosofi e Autori (anche meno conosciuti)
          </span>
          <p className="text-xs text-[var(--text-muted)] m-0">
            Clicca su una corrente per aggiungere automaticamente altri
            pensatori nella relativa sottocartella cronologica, oppure cerca un
            nome specifico:
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {WIKI_DISCOVERY_CATEGORIES.map((cat) => {
            const isLoadingCat = discoveringCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                disabled={isLoadingCat}
                onClick={() => handleDiscoverCategory(cat)}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs font-mono-meta text-[var(--text-main)] flex items-center gap-2 cursor-pointer transition-all"
              >
                {isLoadingCat ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-gold)]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>

        {discoveryFeedback && (
          <div className="px-3.5 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--accent-gold)]/50 font-mono-meta text-xs text-[var(--accent-gold)]">
            {discoveryFeedback}
          </div>
        )}

        <form
          onSubmit={handleSearchWikiAuthor}
          className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="flex-1">
            <input
              type="text"
              value={wikiSearchInput}
              onChange={(e) => setWikiSearchInput(e.target.value)}
              placeholder="Cerca e aggiungi qualsiasi altro filosofo o autore (es. Montesquieu, Cesare Beccaria, Epicuro, Karl Popper, Talete...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--border-strong)]"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingWiki}
            className="px-5 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] text-xs font-mono-meta uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isSearchingWiki ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Cerca & Apri Scheda
          </button>
        </form>
      </section>
    </div>
  );
};
