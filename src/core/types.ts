export type QuoteCategory = 'historical' | 'biblical';

export type SacredTradition = 'Bibbia' | 'Corano';

export type EpochId =
  | 'origini_cosmo'
  | 'biblico'
  | 'antichita'
  | 'tardo_antico_medioevo'
  | 'moderna'
  | 'illuminismo_ottocento'
  | 'contemporanea';

export type OriginalLanguage =
  | 'Greco Antico'
  | 'Latino'
  | 'Ebraico Biblico'
  | 'Arabo Classico (Corano)'
  | 'Antico Francese / Romanzo Cortese'
  | 'Italiano Volgare / Storico'
  | 'Francese / Tedesco / Inglese / Russo';

export type AuthorProfession =
  | 'Filosofo'
  | 'Scrittore e Poeta'
  | 'Drammaturgo e Tragediografo'
  | 'Pittore, Artista e Genio Universale'
  | 'Storico, Politico e Statista'
  | 'Scienziato e Pensatore'
  | 'Voce Profetica e Sapienziale';

export type InquiryCategory =
  | 'Cosmo, Scienza & Paradossi'
  | 'Potere, Congiure & Rivoluzioni'
  | 'Economia, Bolle & Follie Collettive'
  | 'Geopolitica, Guerre & Segreti del ’900';

export type TranslationLangKey =
  | 'it'
  | 'original'
  | 'la'
  | 'en'
  | 'fr'
  | 'de';

export interface EpochInfo {
  id: EpochId;
  name: string;
  shortName: string;
  period: string;
  description: string;
}

/**
 * Sottocartella tematica/corrente dentro ciascuna Era (es. Illuminismo, Stoicismo, Maestri del Sospetto)
 * che raggruppa in modo ordinato gli autori e mostra i collegamenti tra loro.
 */
export interface SubfolderMovement {
  id: string;
  epochId: EpochId;
  name: string;
  yearsLabel: string;
  wittyDescription: string;
  connectionMapLabel: string;
}

export interface OriginalScript {
  language: OriginalLanguage;
  text: string;
  transliteration?: string;
  literalTranslation: string;
}

export interface QuoteTranslations {
  latin: string;
  english: string;
  french: string;
  german: string;
}

export interface HistoricalEvent {
  title: string;
  yearLabel: string;
  description: string;
}

export interface KeyTerm {
  word: string;
  language: string;
  etymology: string;
  definition: string;
}

export interface Quote {
  id: string;
  authorId: string;
  category: QuoteCategory;
  sacredTradition?: SacredTradition;
  epochId: EpochId;
  italianText: string;
  author: string;
  authorRole: string;
  work: string;
  dateLabel: string;
  sortYear: number;
  whoWas: string;
  meaning: string;
  tags: string[];
  original?: OriginalScript;
  translations: QuoteTranslations;
  historicalEvent: HistoricalEvent;
  keyTerm: KeyTerm;
  isCustom?: boolean;
}

export interface FamousWork {
  title: string;
  year: string;
  description: string;
}

export interface StudyChapter {
  chapterNumber: number;
  title: string;
  content: string;
}

export interface AuthorProfile {
  id: string;
  name: string;
  nationality: string;
  profession: AuthorProfession;
  epochId: EpochId;
  subfolderId: string;
  yearBadge: string;
  lifeSpan: string;
  sortYear: number;
  portraitUrl: string;
  portraitCaption: string;
  satiricalHook: string;
  simonNote?: string;
  connectionNote: string;
  connectedAuthorIds: string[];
  periodDefinition: string;
  biography: string;
  famousWorks: FamousWork[];
  unusualPersonalFact: string;
  studyChapters: StudyChapter[];
}

export interface AuthorFilters {
  query?: string;
  nationality?: string | 'all';
  profession?: AuthorProfession | 'all';
  epochId?: EpochId | 'all';
  subfolderId?: string | 'all';
  onlyStudied?: boolean;
}

export interface InquiryStep {
  stepNumber: number;
  phaseTitle: string;
  chronology: string;
  explanation: string;
}

export interface HistoricalInquiry {
  id: string;
  category: InquiryCategory;
  question: string;
  subtitle: string;
  satiricalHook: string;
  epochId: EpochId;
  periodLabel: string;
  protagonistName: string;
  protagonistWikiTitle: string;
  portraitUrl: string;
  whyItHappened: string;
  overview: string;
  steps: InquiryStep[];
  presentRepercussions: string;
  philosophicalTakeaway: string;
  relatedQuoteIds: string[];
  relatedAuthorIds: string[];
  tags: string[];
  isCustom?: boolean;
}

export interface UserQuoteRecord {
  quoteId: string;
  unlocked: boolean;
  favorite: boolean;
  note: string;
  unlockedAt: string;
}

export interface QuoteFilters {
  query?: string;
  category?: QuoteCategory | 'all';
  sacredTradition?: SacredTradition | 'all';
  epochId?: EpochId | 'all';
  authorId?: string | 'all';
  onlyOriginalScript?: boolean;
  onlyFavorites?: boolean;
  onlyWithNotes?: boolean;
  onlyUnlocked?: boolean;
}

export interface DailyPair {
  dateStr: string;
  dayNumber: number;
  historical: Quote;
  biblical: Quote;
}

export interface DrawOptions {
  category?: QuoteCategory | 'all';
  epochId?: EpochId | 'all';
  onlyAncientLanguages?: boolean;
  excludeIds?: string[];
  seed?: number;
}
