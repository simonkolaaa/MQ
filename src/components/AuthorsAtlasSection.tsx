import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Compass,
  FolderOpen,
  GitBranch,
  Globe2,
  GraduationCap,
  Landmark,
  Loader2,
  Orbit,
  Plus,
  ScrollText,
  Search,
  Sparkles,
  UserRoundSearch,
  Zap,
} from 'lucide-react';
import {
  AuthorSeed,
  EPOCHS,
  SUBFOLDER_MOVEMENTS,
  WIKI_DISCOVERY_CATEGORIES,
  WikiDiscoveryCategory,
} from '../data/seeds';
import { IDEOLOGIES_CATALOG, IdeologyItem } from '../data/ideologies';
import { filterAuthorSeeds } from '../core/quoteEngine';
import {
  discoverAuthorsFromWikiCategory,
  fetchAuthorFullDossier,
  fetchWikipediaSections,
  fetchWikipediaSummary,
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
  onTriggerWarp?: () => void;
}

const PROFESSIONS: AuthorProfession[] = [
  'Filosofo',
  'Scrittore e Poeta',
  'Drammaturgo e Tragediografo',
  'Pittore, Artista e Genio Universale',
  'Storico, Politico e Statista',
  'Scienziato e Pensatore',
];

interface SmallPlanetNode {
  id: string;
  shortTitle: string;
  yearsLabel: string;
  epochId: EpochId | 'ideologies';
  wikiTitleForImage: string;
  ringIndex: 1 | 2 | 3;
  baseAngle: number;
  speed: number;
  ringColor: string;
  isIdeologyFolder?: boolean;
}

const SOLAR_PLANET_NODES: SmallPlanetNode[] = [
  // ANELLO INTERNO
  {
    id: 'big-bang-mito-logos',
    shortTitle: 'Big Bang & Mito',
    yearsLabel: '13,8 mld – 750 a.C.',
    epochId: 'origini_cosmo',
    wikiTitleForImage: 'Omero',
    ringIndex: 1,
    baseAngle: 0,
    speed: 0.12,
    ringColor: '#f59e0b',
  },
  {
    id: 'presocratici-scuola-ionica',
    shortTitle: 'Presocratici',
    yearsLabel: '600 – 470 a.C.',
    epochId: 'antichita',
    wikiTitleForImage: 'Eraclito',
    ringIndex: 1,
    baseAngle: 1.25,
    speed: 0.12,
    ringColor: '#e07652',
  },
  {
    id: 'atene-classica-tragedia',
    shortTitle: 'Atene & Tragedia',
    yearsLabel: '496 – 322 a.C.',
    epochId: 'antichita',
    wikiTitleForImage: 'Socrate',
    ringIndex: 1,
    baseAngle: 2.5,
    speed: 0.12,
    ringColor: '#e07652',
  },
  {
    id: 'cinismo-stoicismo-roma',
    shortTitle: 'Cinismo & Stoicismo',
    yearsLabel: '400 a.C. – 180 AD',
    epochId: 'antichita',
    wikiTitleForImage: 'Marco_Aurelio',
    ringIndex: 1,
    baseAngle: 3.75,
    speed: 0.12,
    ringColor: '#d4a959',
  },
  {
    id: 'tardo-antico-patristica',
    shortTitle: 'Tramonto di Roma',
    yearsLabel: '350 – 525 AD',
    epochId: 'tardo_antico_medioevo',
    wikiTitleForImage: 'Agostino_d%27Ippona',
    ringIndex: 1,
    baseAngle: 5.0,
    speed: 0.12,
    ringColor: '#10b981',
  },

  // ANELLO INTERMEDIO
  {
    id: 'amor-cortese-stilnovo',
    shortTitle: 'Amor Cortese & Dante',
    yearsLabel: '1150 – 1321 AD',
    epochId: 'tardo_antico_medioevo',
    wikiTitleForImage: 'Dante_Alighieri',
    ringIndex: 2,
    baseAngle: 0.4,
    speed: -0.085,
    ringColor: '#10b981',
  },
  {
    id: 'umanesimo-rinascimento',
    shortTitle: 'Rinascimento',
    yearsLabel: '1452 – 1564 AD',
    epochId: 'moderna',
    wikiTitleForImage: 'Leonardo_da_Vinci',
    ringIndex: 2,
    baseAngle: 1.45,
    speed: -0.085,
    ringColor: '#38bdf8',
  },
  {
    id: 'rivoluzione-scientifica-razionalismo',
    shortTitle: 'Cosmo & Ragione ’600',
    yearsLabel: '1564 – 1677 AD',
    epochId: 'moderna',
    wikiTitleForImage: 'Baruch_Spinoza',
    ringIndex: 2,
    baseAngle: 2.5,
    speed: -0.085,
    ringColor: '#38bdf8',
  },
  {
    id: 'illuminismo-criticismo',
    shortTitle: 'L’Illuminismo & Kant',
    yearsLabel: '1715 – 1804 AD',
    epochId: 'illuminismo_ottocento',
    wikiTitleForImage: 'Immanuel_Kant',
    ringIndex: 2,
    baseAngle: 3.55,
    speed: -0.085,
    ringColor: '#facc15',
  },
  {
    id: 'romanticismo-pessimismo-esistenza',
    shortTitle: 'Pessimismo & ’800',
    yearsLabel: '1798 – 1881 AD',
    epochId: 'illuminismo_ottocento',
    wikiTitleForImage: 'Arthur_Schopenhauer',
    ringIndex: 2,
    baseAngle: 4.6,
    speed: -0.085,
    ringColor: '#facc15',
  },
  {
    id: 'realismo-naturalismo-verismo',
    shortTitle: 'Realismo & Verismo',
    yearsLabel: '1848 – 1889 AD',
    epochId: 'illuminismo_ottocento',
    wikiTitleForImage: 'Giovanni_Verga',
    ringIndex: 2,
    baseAngle: 5.65,
    speed: -0.085,
    ringColor: '#f97316',
  },

  // ANELLO ESTERNO
  {
    id: 'nietzsche-martello-filosofia',
    shortTitle: 'Nietzsche & Simbolismo',
    yearsLabel: '1844 – 1900 AD',
    epochId: 'illuminismo_ottocento',
    wikiTitleForImage: 'Friedrich_Nietzsche',
    ringIndex: 3,
    baseAngle: 0.2,
    speed: 0.06,
    ringColor: '#f43f5e',
  },
  {
    id: 'decadentismo-pascoli-dannunzio',
    shortTitle: 'Pascoli & D’Annunzio',
    yearsLabel: '1889 – 1921 AD',
    epochId: 'contemporanea',
    wikiTitleForImage: 'Giovanni_Pascoli',
    ringIndex: 3,
    baseAngle: 1.45,
    speed: 0.06,
    ringColor: '#a855f7',
  },
  {
    id: 'avanguardie-crisi-io-ermetismo',
    shortTitle: 'Svevo, Pirandello & ’900',
    yearsLabel: '1900 – 1942 AD',
    epochId: 'contemporanea',
    wikiTitleForImage: 'Luigi_Pirandello',
    ringIndex: 3,
    baseAngle: 2.7,
    speed: 0.06,
    ringColor: '#a855f7',
  },
  {
    id: 'novecento-totalitarismi-testimoni',
    shortTitle: 'Testimoni del ’900',
    yearsLabel: '1900 – 1987 AD',
    epochId: 'contemporanea',
    wikiTitleForImage: 'Primo_Levi',
    ringIndex: 3,
    baseAngle: 3.95,
    speed: 0.06,
    ringColor: '#ec4899',
  },
  {
    id: 'novecento-satira-potere-repubblica',
    shortTitle: 'Potere & Fine ’900',
    yearsLabel: '1945 – 2000 AD',
    epochId: 'contemporanea',
    wikiTitleForImage: 'Pier_Paolo_Pasolini',
    ringIndex: 3,
    baseAngle: 5.1,
    speed: 0.06,
    ringColor: '#ec4899',
  },
  {
    id: 'ideologies',
    shortTitle: 'Ideologie',
    yearsLabel: 'Politica & Società',
    epochId: 'ideologies',
    wikiTitleForImage: 'Karl_Marx',
    ringIndex: 3,
    baseAngle: 6.0,
    speed: 0.06,
    ringColor: '#d4a959',
    isIdeologyFolder: true,
  },
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
  onTriggerWarp,
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

  const [openedView, setOpenedView] = useState<
    'solar' | 'subfolder' | 'ideologies'
  >('solar');

  // Coordinate del pianeta cliccato per far muovere ed entrare fisicamente l'interfaccia dentro quel pianeta!
  const [planetZoomTarget, setPlanetZoomTarget] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [warpAnim, setWarpAnim] = useState<{
    direction: 'in' | 'out';
    label: string;
  } | null>(null);

  const [orbitTime, setOrbitTime] = useState<number>(0);
  const isHoveringPlanetRef = useRef<boolean>(false);
  const swipeLockRef = useRef<boolean>(false);

  useEffect(() => {
    if (openedView !== 'solar' || selectedAuthorId || planetZoomTarget) return;
    let rafId = 0;
    let last = performance.now();

    const animateOrbit = (now: number) => {
      const dt = (now - last) * 0.001;
      last = now;
      if (!isHoveringPlanetRef.current) {
        setOrbitTime((prev) => prev + dt);
      }
      rafId = requestAnimationFrame(animateOrbit);
    };

    rafId = requestAnimationFrame(animateOrbit);
    return () => cancelAnimationFrame(rafId);
  }, [openedView, selectedAuthorId, planetZoomTarget]);

  const [selectedIdeology, setSelectedIdeology] =
    useState<IdeologyItem | null>(null);
  const [ideologyDeepDive, setIdeologyDeepDive] = useState<{
    extract: string;
    sections: { title: string; content: string }[];
  } | null>(null);
  const [loadingIdeologyApi, setLoadingIdeologyApi] = useState(false);

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

  const fireWarpTransition = useCallback(
    (direction: 'in' | 'out', label: string, callback: () => void) => {
      onTriggerWarp?.();
      setWarpAnim({ direction, label });
      setTimeout(() => {
        callback();
      }, 280);
      setTimeout(() => {
        setWarpAnim(null);
        setPlanetZoomTarget(null);
      }, 560);
    },
    [onTriggerWarp]
  );

  // ===========================================================================
  // ROUTING PER OGNI PIANETA E AUTORE + FRECCIA INDIETRO DEL BROWSER & TOUCHPAD
  // ===========================================================================
  const navigateToSolarRoot = useCallback(
    (pushRoute = true) => {
      if (pushRoute) {
        window.history.pushState(
          { cosmicRoute: 'solar' },
          '',
          '#/sistema-solare'
        );
      }
      fireWarpTransition('out', 'Sistema Solare del Pensiero', () => {
        onSelectAuthor(null);
        setSelectedSubfolder('all');
        setSelectedIdeology(null);
        setOpenedView('solar');
      });
    },
    [fireWarpTransition, onSelectAuthor]
  );

  const navigateToPlanetRoute = useCallback(
    (
      planetId: string,
      label: string,
      coords?: { x: number; y: number },
      pushRoute = true
    ) => {
      if (coords) {
        setPlanetZoomTarget(coords);
      }
      if (pushRoute) {
        window.history.pushState(
          { cosmicRoute: 'planet', planetId },
          '',
          `#/pianeta/${planetId}`
        );
      }
      fireWarpTransition('in', label, () => {
        onSelectAuthor(null);
        if (planetId === 'ideologies') {
          setOpenedView('ideologies');
        } else {
          setSelectedSubfolder(planetId);
          setOpenedView('subfolder');
        }
      });
    },
    [fireWarpTransition, onSelectAuthor]
  );

  const navigateToAuthorRoute = useCallback(
    (authorId: string, authorName: string, pushRoute = true) => {
      if (pushRoute) {
        window.history.pushState(
          { cosmicRoute: 'author', authorId },
          '',
          `#/pianeta/autore/${authorId}`
        );
      }
      fireWarpTransition('in', authorName, () => {
        onSelectAuthor(authorId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    [fireWarpTransition, onSelectAuthor]
  );

  // Sincronizzazione con il pulsante Indietro/Avanti del browser (popstate)
  useEffect(() => {
    const applyHashRoute = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/pianeta/autore/')) {
        const aId = hash.replace('#/pianeta/autore/', '').trim();
        if (aId) {
          onSelectAuthor(aId);
          return;
        }
      }
      if (hash.startsWith('#/pianeta/')) {
        const pId = hash.replace('#/pianeta/', '').trim();
        onSelectAuthor(null);
        if (pId === 'ideologies') {
          setOpenedView('ideologies');
        } else if (pId) {
          setSelectedSubfolder(pId);
          setOpenedView('subfolder');
        }
        return;
      }
      // Default: torna al Sistema Solare
      onSelectAuthor(null);
      setSelectedSubfolder('all');
      setOpenedView('solar');
    };

    window.addEventListener('popstate', applyHashRoute);
    return () => window.removeEventListener('popstate', applyHashRoute);
  }, [onSelectAuthor]);

  // Supporto gesture di scorrimento orizzontale sul Touchpad (2 dita verso sinistra) per tornare indietro
  const handleTouchpadBackGesture = (e: React.WheelEvent) => {
    if (openedView === 'solar' && !selectedAuthorId) return;
    if (swipeLockRef.current) return;

    if (e.deltaX < -48 && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5) {
      swipeLockRef.current = true;
      setTimeout(() => {
        swipeLockRef.current = false;
      }, 700);

      if (window.location.hash.startsWith('#/pianeta')) {
        window.history.back();
      } else {
        navigateToSolarRoot(true);
      }
    }
  };

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

  useEffect(() => {
    if (!selectedIdeology) {
      setIdeologyDeepDive(null);
      return;
    }
    let cancelled = false;
    setLoadingIdeologyApi(true);

    Promise.all([
      fetchWikipediaSummary(selectedIdeology.wikiTitle),
      fetchWikipediaSections(selectedIdeology.wikiTitle),
    ])
      .then(([sum, secs]) => {
        if (!cancelled) {
          setIdeologyDeepDive({
            extract: sum.extract,
            sections: secs.slice(0, 4),
          });
          setLoadingIdeologyApi(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingIdeologyApi(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIdeology]);

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
      navigateToAuthorRoute(foundSeed.id, foundSeed.name);
    }
  };

  const handleDiscoverCategory = async (cat: WikiDiscoveryCategory) => {
    setDiscoveringCategoryId(cat.id);
    setDiscoveryFeedback('');
    const discoveredList = await discoverAuthorsFromWikiCategory(cat);
    setDiscoveringCategoryId(null);

    if (discoveredList.length > 0) {
      discoveredList.forEach((seed) => onAddAuthorSeed(seed));
      setDiscoveryFeedback(`Nuovi pensatori aggiunti in "${cat.label}"!`);
      navigateToPlanetRoute(cat.defaultSubfolderId, cat.label);
    }
  };

  const renderWarpBeamOverlay = () => {
    if (!warpAnim) return null;
    return (
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
        <div
          className={`w-[88vw] h-[88vw] max-w-[860px] max-h-[860px] rounded-full border-4 border-[var(--accent-gold)] flex items-center justify-center ${
            warpAnim.direction === 'in' ? 'warp-tunnel-in' : 'warp-tunnel-out'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(212,169,89,0.42) 0%, rgba(168,71,38,0.2) 45%, transparent 72%)',
            boxShadow: '0 0 120px 40px rgba(212, 169, 89, 0.35)',
          }}
        >
          <div className="px-6 py-3 rounded-full bg-[var(--bg-surface)]/95 border border-[var(--accent-gold)] font-serif-editorial text-2xl md:text-3xl text-[var(--text-main)] shadow-2xl">
            {warpAnim.label}
          </div>
        </div>
      </div>
    );
  };

  // Tasto pulito, minimale ed elegante per tornare indietro
  const renderCleanBackButton = (label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="group px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:border-[var(--accent-gold)] text-xs font-mono-meta text-[var(--text-main)] flex items-center gap-2 cursor-pointer transition-all shadow-xs"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent-gold)] group-hover:-translate-x-1 transition-transform" />
      <span>{label}</span>
    </button>
  );

  // ===========================================================================
  // VISTA DETTAGLIO SINGOLO AUTORE
  // ===========================================================================
  if (activeSeed) {
    const epoch = EPOCHS.find((e) => e.id === activeSeed.epochId);
    const subfolder = SUBFOLDER_MOVEMENTS.find(
      (s) => s.id === activeSeed.subfolderId
    );
    const isStudied = !!studiedAuthors[activeSeed.id];

    return (
      <div onWheel={handleTouchpadBackGesture} className="space-y-8">
        {renderWarpBeamOverlay()}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {renderCleanBackButton(
              subfolder
                ? `Torna a ${subfolder.name.split(':')[0]}`
                : 'Indietro',
              () => {
                if (subfolder) {
                  navigateToPlanetRoute(
                    subfolder.id,
                    subfolder.name.split(':')[0]
                  );
                } else {
                  navigateToSolarRoot(true);
                }
              }
            )}

            <button
              type="button"
              onClick={() => navigateToSolarRoot(true)}
              className="px-3.5 py-2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs font-mono-meta text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer"
            >
              <Orbit className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              Sistema Solare
            </button>
          </div>

          <button
            type="button"
            onClick={() => onToggleAuthorStudied(activeSeed.id)}
            className={`px-4 py-2 rounded-full border text-xs font-mono-meta uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
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
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-meta pb-3 border-b border-[var(--border-subtle)]">
                {epoch && (
                  <span className="badge-gold px-3 py-1 rounded-full">
                    {epoch.name} ({epoch.period})
                  </span>
                )}
                {subfolder && (
                  <span className="badge-hist px-3 py-1 rounded-full flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5" />
                    {subfolder.name}
                  </span>
                )}
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

                  <div className="bento-subbox p-4 border-l-4 border-[var(--accent-gold)] space-y-1">
                    <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-gold)] font-semibold block">
                      Il Personaggio senza filtro:
                    </span>
                    <p className="text-sm md:text-base leading-relaxed text-[var(--text-main)] m-0">
                      {loadedProfile.satiricalHook}
                    </p>
                  </div>

                  {loadedProfile.simonNote && (
                    <div className="bento-subbox p-4 border-l-4 border-[var(--accent-hist)] space-y-1 bg-[var(--bg-surface)]">
                      <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-hist)] font-semibold block">
                        Dagli Appunti di Simon:
                      </span>
                      <p className="text-sm md:text-base leading-relaxed text-[var(--text-main)] m-0">
                        {loadedProfile.simonNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bento-subbox p-5 space-y-3 border border-[var(--border-strong)]">
                <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-hist)] font-semibold">
                  <GitBranch className="w-4 h-4" />
                  Filo Logico & Collegamenti Diretti
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
                          onClick={() =>
                            navigateToAuthorRoute(connSeed.id, connSeed.name)
                          }
                          className="px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] flex items-center gap-2.5 cursor-pointer transition-all text-left"
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
                              {connSeed.yearBadge} · Apri →
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

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

            {/* SEZIONE STUDIA */}
            <section className="bento-card p-6 md:p-8 space-y-6 border-2 border-[var(--border-strong)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div className="space-y-1">
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-gold)] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    Sezione Studia · Il Racconto del Pensiero e dei Fatti
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
  // VISTA PRINCIPALE:
  // 1) SOPRA: RIQUADRO "MAPPA DEL PENSIERO: ERE, SOTTOCARTELLE E COLLEGAMENTI"
  // 2) SOTTO: TITOLO CENTRATO "Sistema Solare del Pensiero" + IL SISTEMA SOLARE
  // ===========================================================================
  const chronologicalEpochs = EPOCHS.filter((e) => e.id !== 'biblico');

  return (
    <div onWheel={handleTouchpadBackGesture} className="space-y-8">
      {renderWarpBeamOverlay()}

      {/* 1. INTESTAZIONE MAPPA DEL PENSIERO */}
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

      {/* 2. RIQUADRO FILTRI MAPPA DEL PENSIERO */}
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
                setOpenedView('solar');
              }}
              className={`px-3.5 py-2 rounded-xl font-mono-meta text-xs cursor-pointer transition-all ${
                selectedEpoch === 'all' && openedView === 'solar'
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
                  setOpenedView('solar');
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

            <button
              type="button"
              onClick={() => navigateToPlanetRoute('ideologies', 'Ideologie')}
              className={`px-3.5 py-2 rounded-xl font-mono-meta text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                openedView === 'ideologies'
                  ? 'badge-gold font-semibold'
                  : 'bg-[var(--bg-subtle)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/40 hover:border-[var(--accent-gold)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ideologie
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
          <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-hist)] font-semibold block">
            2. Oppure apri direttamente una Sottocartella / Corrente:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigateToSolarRoot(true)}
              className={`px-3 py-1.5 rounded-lg font-mono-meta text-xs cursor-pointer transition-all ${
                selectedSubfolder === 'all' && openedView === 'solar'
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
                  navigateToPlanetRoute(sf.id, sf.name.split(':')[0])
                }
                className={`px-3 py-1.5 rounded-lg font-mono-meta text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                  selectedSubfolder === sf.id && openedView === 'subfolder'
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
              placeholder="Cerca filosofo, corrente o anno (es. Illuminismo, Kant, Verga, Svevo, Nietzsche...)"
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

      {/* =====================================================================
          3. TITOLO CENTRATO SOPRA IL SISTEMA SOLARE + IL SISTEMA SOLARE CON PICCOLI PIANETI
      ===================================================================== */}
      {openedView === 'solar' &&
        !searchQuery.trim() &&
        selectedProfession === 'all' &&
        selectedNationality === 'all' &&
        !onlyStudied && (
          <div className="space-y-5 pt-4">
            {/* Titolo centrato sopra il Sistema Solare con lo stesso font di Mappa del Pensiero */}
            <div className="text-center space-y-2">
              <h2 className="hero-title m-0">Sistema Solare del Pensiero</h2>
              <p className="text-sm text-[var(--text-muted)] m-0">
                Clicca su un pianeta per entrarci dentro · Passa col mouse per
                fermare l’orbita
              </p>
            </div>

            {/* Contenitore del Sistema Solare che zooma fisicamente dentro il pianeta cliccato! */}
            <div
              onMouseEnter={() => {
                isHoveringPlanetRef.current = true;
              }}
              onMouseLeave={() => {
                isHoveringPlanetRef.current = false;
              }}
              style={{
                transformOrigin: planetZoomTarget
                  ? `${planetZoomTarget.x}% ${planetZoomTarget.y}%`
                  : '50% 50%',
                transform: planetZoomTarget ? 'scale(5.2)' : 'scale(1)',
                opacity: planetZoomTarget ? 0 : 1,
                transition:
                  'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.48s ease',
              }}
              className="relative w-full h-[640px] md:h-[720px] rounded-3xl border-2 border-[var(--border-strong)] bg-[#0b0c12] overflow-hidden shadow-2xl select-none"
            >
              {/* Le 3 Orbite Ellittiche */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full border border-dashed border-amber-400/25"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[56%] h-[56%] rounded-full border border-dashed border-white/15"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[78%] rounded-full border border-dashed border-[#d4a959]/25"
              />

              {/* IL SOLE CENTRALE (Senza scritta Logos!) */}
              <div
                onClick={() => setSelectedEpoch('all')}
                title="Sole Centrale"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-orange-600 shadow-[0_0_70px_22px_rgba(245,158,11,0.5)] border-2 border-amber-100/80 cursor-pointer hover:scale-105 transition-transform"
              />

              {/* I PICCOLI PIANETI IN MOVIMENTO */}
              {SOLAR_PLANET_NODES.filter(
                (node) =>
                  selectedEpoch === 'all' ||
                  node.epochId === selectedEpoch ||
                  node.isIdeologyFolder
              ).map((node) => {
                const rx =
                  node.ringIndex === 1
                    ? 15
                    : node.ringIndex === 2
                    ? 28
                    : 39.5;
                const ry =
                  node.ringIndex === 1
                    ? 15
                    : node.ringIndex === 2
                    ? 27.5
                    : 38.5;

                const currentAngle = node.baseAngle + orbitTime * node.speed;
                const leftPct = 50 + Math.cos(currentAngle) * rx;
                const topPct = 50 + Math.sin(currentAngle) * ry;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() =>
                      navigateToPlanetRoute(node.id, node.shortTitle, {
                        x: leftPct,
                        y: topPct,
                      })
                    }
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="group absolute z-20 flex flex-col items-center cursor-pointer focus:outline-none"
                  >
                    <div
                      style={{
                        boxShadow: `0 0 22px 2px ${node.ringColor}55`,
                        borderColor: node.ringColor,
                      }}
                      className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 overflow-hidden bg-[#161822] group-hover:scale-125 transition-transform duration-200 flex items-center justify-center"
                    >
                      <AuthorPortrait
                        name={node.shortTitle}
                        wikiTitle={node.wikiTitleForImage}
                        size="md"
                        className="!w-full !h-full !rounded-full !border-0"
                      />
                    </div>

                    <div className="mt-1.5 px-2 py-0.5 rounded-full bg-black/85 border border-white/20 group-hover:border-[#d4a959] text-center shadow-md whitespace-nowrap transition-colors">
                      <span className="block font-serif-editorial text-xs sm:text-sm text-white leading-tight">
                        {node.shortTitle}
                      </span>
                      <span className="block font-mono-meta text-[8px] text-[#d4a959]">
                        {node.yearsLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {/* =====================================================================
          4A. DENTRO IL PIANETA "IDEOLOGIE"
      ===================================================================== */}
      {openedView === 'ideologies' && (
        <section className="space-y-6 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-4 bento-card p-6 border-2 border-[var(--accent-gold)]">
            <div className="space-y-1">
              <span className="badge-gold font-mono-meta text-xs px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Spiegate con Metafore Divertenti e Linguaggio Naturale
              </span>
              <h2 className="font-serif-editorial text-3xl md:text-4xl m-0">
                Ideologie
              </h2>
            </div>

            {renderCleanBackButton('Torna al Sistema Solare', () =>
              navigateToSolarRoot(true)
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {IDEOLOGIES_CATALOG.map((ideo) => {
              const isSelected = selectedIdeology?.id === ideo.id;

              return (
                <article
                  key={ideo.id}
                  className={`bento-card p-6 space-y-4 border-2 transition-all ${
                    isSelected
                      ? 'border-[var(--accent-gold)] shadow-xl'
                      : 'border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: ideo.colorAccent }}
                        className="w-4 h-4 rounded-full inline-block"
                      />
                      <h3 className="font-serif-editorial text-3xl text-[var(--text-main)] m-0">
                        {ideo.name}
                      </h3>
                    </div>
                    <span className="font-mono-meta text-xs text-[var(--text-muted)]">
                      {ideo.periodLabel}
                    </span>
                  </div>

                  <div className="bento-subbox p-4 border-l-4 border-[var(--accent-gold)] space-y-1">
                    <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-gold)] font-semibold block">
                      Capirlo subito con una metafora:
                    </span>
                    <p className="text-sm leading-relaxed text-[var(--text-main)] m-0 font-medium">
                      {ideo.funnyMetaphor}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-hist)] font-semibold block">
                      Spiegato semplice:
                    </span>
                    <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                      {ideo.naturalExplanation}
                    </p>
                  </div>

                  <div className="bento-subbox p-3.5 space-y-1 bg-[var(--bg-surface)]">
                    <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-bibl)] font-semibold block">
                      Il Paradosso:
                    </span>
                    <p className="text-xs md:text-sm leading-relaxed text-[var(--text-muted)] m-0 italic">
                      {ideo.satiricalPlotTwist}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {ideo.linkedAuthorIds.map((aId) => {
                        const auth = authorSeeds.find((a) => a.id === aId);
                        if (!auth) return null;
                        return (
                          <button
                            key={auth.id}
                            type="button"
                            onClick={() =>
                              navigateToAuthorRoute(auth.id, auth.name)
                            }
                            className="px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-inset)] border border-[var(--border-subtle)] font-mono-meta text-[11px] text-[var(--text-main)] flex items-center gap-1 cursor-pointer"
                          >
                            <UserRoundSearch className="w-3 h-3 text-[var(--accent-hist)]" />
                            {auth.name}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedIdeology(isSelected ? null : ideo)
                      }
                      className="px-4 py-2 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] font-mono-meta text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {isSelected
                        ? 'Chiudi Approfondimento'
                        : 'Approfondisci'}
                    </button>
                  </div>

                  {isSelected && (
                    <div className="bento-subbox p-5 space-y-3 border border-[var(--accent-gold)] mt-2">
                      {loadingIdeologyApi || !ideologyDeepDive ? (
                        <div className="flex items-center gap-2 font-mono-meta text-xs text-[var(--accent-gold)]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Caricamento approfondimento storico su {ideo.name}...
                        </div>
                      ) : (
                        <>
                          <div className="font-mono-meta text-xs uppercase text-[var(--accent-gold)] font-semibold">
                            Approfondimento Storico · {ideo.name}
                          </div>
                          <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                            {ideologyDeepDive.extract}
                          </p>
                          {ideologyDeepDive.sections.map((sec) => (
                            <div
                              key={sec.title}
                              className="space-y-1 pt-2 border-t border-[var(--border-subtle)]"
                            >
                              <h4 className="font-serif-editorial text-lg text-[var(--text-main)] m-0">
                                {sec.title}
                              </h4>
                              <p className="text-xs md:text-sm leading-relaxed text-[var(--text-muted)] m-0">
                                {sec.content}
                              </p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
          4B. DENTRO UN PIANETA / SOTTOCARTELLA
      ===================================================================== */}
      {(openedView === 'subfolder' ||
        searchQuery.trim().length > 0 ||
        selectedProfession !== 'all' ||
        selectedNationality !== 'all' ||
        onlyStudied) && (
        <section className="space-y-6 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-4 bento-card p-6 border-2 border-[var(--accent-gold)]">
            <div className="space-y-1">
              <span className="badge-hist font-mono-meta text-xs px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5" />
                {selectedSubfolder !== 'all'
                  ? SUBFOLDER_MOVEMENTS.find((s) => s.id === selectedSubfolder)
                      ?.yearsLabel
                  : 'Risultati Filtro'}
              </span>
              <h2 className="font-serif-editorial text-3xl md:text-4xl m-0">
                {selectedSubfolder !== 'all'
                  ? SUBFOLDER_MOVEMENTS.find((s) => s.id === selectedSubfolder)
                      ?.name
                  : `Autori Filtrati (${filteredSeeds.length})`}
              </h2>
            </div>

            {renderCleanBackButton('Torna al Sistema Solare', () =>
              navigateToSolarRoot(true)
            )}
          </div>

          {selectedSubfolder !== 'all' &&
            SUBFOLDER_MOVEMENTS.find((s) => s.id === selectedSubfolder) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bento-card p-5 space-y-1.5">
                  <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold block">
                    Lo Spirito dell’Epoca:
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                    {
                      SUBFOLDER_MOVEMENTS.find(
                        (s) => s.id === selectedSubfolder
                      )?.wittyDescription
                    }
                  </p>
                </div>

                <div className="bento-card p-5 space-y-1.5 border border-[var(--accent-hist)]/50">
                  <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-hist)] font-semibold flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4" />
                    Come si collegano tra loro:
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                    {
                      SUBFOLDER_MOVEMENTS.find(
                        (s) => s.id === selectedSubfolder
                      )?.connectionMapLabel
                    }
                  </p>
                </div>
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSeeds.map((seed) => {
              const isStudied = !!studiedAuthors[seed.id];

              return (
                <div
                  key={seed.id}
                  onClick={() => navigateToAuthorRoute(seed.id, seed.name)}
                  className="bento-card p-5 flex flex-col justify-between gap-4 cursor-pointer hover:border-[var(--accent-gold)] hover:-translate-y-1 transition-all"
                >
                  <div className="space-y-3">
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

                    <div className="flex items-center gap-3.5">
                      <AuthorPortrait
                        name={seed.name}
                        wikiTitle={seed.wikiTitle}
                        size="lg"
                      />
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h3 className="font-serif-editorial text-2xl leading-tight text-[var(--text-main)] m-0">
                          {seed.name}
                        </h3>
                        <div className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                          {seed.nationality}
                        </div>
                        <div className="font-mono-meta text-[10px] text-[var(--accent-hist)] line-clamp-1">
                          {seed.historicalEventLabel}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-[var(--text-main)] m-0 line-clamp-3">
                      {seed.satiricalHook}
                    </p>

                    {seed.simonNote && (
                      <div className="p-2.5 rounded-lg bg-[var(--bg-subtle)] border-l-2 border-[var(--accent-gold)] text-[11px] leading-relaxed text-[var(--text-main)] line-clamp-3">
                        <strong className="text-[var(--accent-gold)] font-mono-meta uppercase text-[10px] block mb-0.5">
                          Simon dice:
                        </strong>
                        {seed.simonNote.replace(/^Simon dice:\s*/i, '')}
                      </div>
                    )}

                    {seed.connectedAuthorIds.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                          <GitBranch className="w-3 h-3 text-[var(--accent-gold)]" />
                          Collegato con:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {seed.connectedAuthorIds.map((connId) => {
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
                                  navigateToAuthorRoute(conn.id, conn.name);
                                }}
                                className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-inset)] border border-[var(--border-subtle)] font-mono-meta text-[10px] text-[var(--text-main)] cursor-pointer"
                              >
                                ↔ {conn.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-subtle)] text-xs font-mono-meta">
                    <span className="text-[var(--text-muted)]">
                      {seed.yearBadge}
                    </span>
                    <span className="text-[var(--text-main)] font-semibold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                      Apri & Studia →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Barra compatta inferiore per aggiungere nuovi autori */}
      <section className="bento-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5 font-semibold">
            <Compass className="w-4 h-4" />
            Amplia le Sottocartelle · Scopri altri Filosofi e Autori
          </span>
          {discoveryFeedback && (
            <span className="font-mono-meta text-xs text-[var(--accent-gold)]">
              {discoveryFeedback}
            </span>
          )}
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
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs font-mono-meta text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer transition-all"
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

        <form
          onSubmit={handleSearchWikiAuthor}
          className="pt-2 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <input
            type="text"
            value={wikiSearchInput}
            onChange={(e) => setWikiSearchInput(e.target.value)}
            placeholder="Cerca e aggiungi qualsiasi altro filosofo o poeta (es. Montesquieu, Cesare Beccaria, Epicuro, Karl Popper, Talete...)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--border-strong)]"
          />
          <button
            type="submit"
            disabled={isSearchingWiki}
            className="px-4 py-2 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] text-xs font-mono-meta uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            {isSearchingWiki ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Aggiungi & Apri
          </button>
        </form>
      </section>
    </div>
  );
};
