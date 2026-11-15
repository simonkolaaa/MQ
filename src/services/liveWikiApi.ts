import {
  AuthorSeed,
  AUTHOR_SEEDS,
  InquirySeed,
  SacredSeed,
  WikiDiscoveryCategory,
} from '../data/seeds';
import {
  AuthorProfile,
  FamousWork,
  HistoricalInquiry,
  InquiryStep,
  Quote,
  StudyChapter,
} from '../core/types';

const API_CACHE_PREFIX = 'mq_api_cache_v5_';

function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(API_CACHE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, value: T): void {
  try {
    localStorage.setItem(API_CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore storage quota
  }
}

export interface WikiSummary {
  title: string;
  description: string;
  extract: string;
  thumbnailUrl: string;
}

async function fetchFallbackPortrait(wikiTitle: string): Promise<string> {
  try {
    const itUrl = `https://it.wikipedia.org/w/api.php?action=query&titles=${wikiTitle}&prop=pageimages&piprop=thumbnail|original&pithumbsize=500&redirects=1&format=json&origin=*`;
    const itRes = await fetch(itUrl);
    if (itRes.ok) {
      const itData = await itRes.json();
      const pages = itData?.query?.pages || {};
      const page = Object.values(pages)[0] as
        | { thumbnail?: { source?: string }; original?: { source?: string } }
        | undefined;
      const found = page?.thumbnail?.source || page?.original?.source;
      if (found) return found;
    }
  } catch {
    // ignore
  }
  return '';
}

export async function fetchWikipediaSummary(
  wikiTitle: string
): Promise<WikiSummary> {
  const cacheKey = `wp_sum_${wikiTitle}`;
  const cached = getCache<WikiSummary>(cacheKey);
  if (cached && cached.extract) return cached;

  try {
    const res = await fetch(
      `https://it.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`
    );
    if (!res.ok) throw new Error('Summary non disponibile');
    const data = await res.json();

    let thumbnailUrl: string =
      data.thumbnail?.source || data.originalimage?.source || '';

    if (!thumbnailUrl) {
      thumbnailUrl = await fetchFallbackPortrait(wikiTitle);
    }

    const summary: WikiSummary = {
      title: data.title || decodeURIComponent(wikiTitle.replace(/_/g, ' ')),
      description: data.description || 'Protagonista della storia e del pensiero',
      extract: data.extract || '',
      thumbnailUrl,
    };
    setCache(cacheKey, summary);
    return summary;
  } catch {
    return {
      title: decodeURIComponent(wikiTitle.replace(/_/g, ' ')),
      description: 'Protagonista della storia e della filosofia',
      extract: '',
      thumbnailUrl: '',
    };
  }
}

export function cleanWikiHtmlText(htmlSnippet: string): string {
  return htmlSnippet
    .replace(/<ul[\s\S]*?<\/ul>/gi, ' ')
    .replace(/<sup[\s\S]*?<\/sup>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#160;|&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\[\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ParsedWikiquoteItem {
  text: string;
  sourceNote: string;
}

export async function fetchWikiquoteQuotes(
  wikiquoteTitle: string
): Promise<ParsedWikiquoteItem[]> {
  const cacheKey = `wq_quotes_${wikiquoteTitle}`;
  const cached = getCache<ParsedWikiquoteItem[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const url = `https://it.wikiquote.org/w/api.php?action=parse&page=${wikiquoteTitle}&prop=text&format=json&origin=*&redirects=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const html: string = data?.parse?.text?.['*'] || '';
    if (!html) return [];

    const items: ParsedWikiquoteItem[] = [];
    const liRegex = /<li>([\s\S]*?)<\/li>/gi;
    let match: RegExpExecArray | null;

    while ((match = liRegex.exec(html)) !== null) {
      const rawLi = match[1];
      if (
        rawLi.includes('toclevel-') ||
        rawLi.includes('nv-view') ||
        rawLi.includes('catlinks')
      ) {
        continue;
      }

      let sourceNote = '';
      const subLiMatch = rawLi.match(/<ul>\s*<li>([\s\S]*?)<\/li>\s*<\/ul>/i);
      if (subLiMatch) {
        sourceNote = cleanWikiHtmlText(subLiMatch[1]);
      }

      const mainText = cleanWikiHtmlText(rawLi);

      if (
        mainText.length < 28 ||
        mainText.length > 420 ||
        /^(citato in|vedi anche|voci correlate|isbn|edizione|traduzione di|opere|bibliografia|note|alessandro|francesco|giovanni\s+\d)/i.test(
          mainText
        )
      ) {
        continue;
      }

      let cleanQuote = mainText;
      const trailingParen = mainText.match(/^(.*?)\s*\(([^()]{3,90})\)\.?$/);
      if (trailingParen && trailingParen[1].length >= 25) {
        cleanQuote = trailingParen[1].trim();
        if (!sourceNote) {
          sourceNote = trailingParen[2].trim();
        }
      }

      if (!items.some((existing) => existing.text === cleanQuote)) {
        items.push({
          text: cleanQuote,
          sourceNote:
            sourceNote || decodeURIComponent(wikiquoteTitle.replace(/_/g, ' ')),
        });
      }

      if (items.length >= 18) break;
    }

    if (items.length > 0) {
      setCache(cacheKey, items);
    }
    return items;
  } catch {
    return [];
  }
}

/**
 * Taglia il testo in modo intelligente alla fine di una frase così da restare agile,
 * diretto e mai prolisso.
 */
function conciseParagraph(text: string, maxChars = 540): string {
  const clean = text.trim();
  if (clean.length <= maxChars) return clean;
  const sliced = clean.slice(0, maxChars);
  const lastDot = sliced.lastIndexOf('.');
  if (lastDot > 180) {
    return sliced.slice(0, lastDot + 1);
  }
  return sliced + '...';
}

export async function fetchWikipediaSections(
  wikiTitle: string
): Promise<{ title: string; content: string }[]> {
  const cacheKey = `wp_sec_${wikiTitle}`;
  const cached = getCache<{ title: string; content: string }[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const url = `https://it.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${wikiTitle}&format=json&origin=*&redirects=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const firstPage = Object.values(pages)[0] as { extract?: string } | undefined;
    const rawExtract = firstPage?.extract || '';
    if (!rawExtract) return [];

    const parts = rawExtract.split(/\n==+\s*([^=]+?)\s*==+\n/);
    const sections: { title: string; content: string }[] = [];

    if (parts[0]?.trim()) {
      sections.push({
        title: 'Il Ritratto in Breve',
        content: conciseParagraph(parts[0], 560),
      });
    }

    for (let i = 1; i < parts.length; i += 2) {
      const secTitle = parts[i]?.trim();
      const secBody = (parts[i + 1] || '').trim();
      if (
        secTitle &&
        secBody.length > 90 &&
        !/^(note|bibliografia|voci correlate|altri progetti|collegamenti esterni|filmografia|discografia|onorificenze|edizioni)$/i.test(
          secTitle
        )
      ) {
        sections.push({
          title: secTitle,
          content: conciseParagraph(secBody, 560),
        });
      }
    }

    setCache(cacheKey, sections.slice(0, 6));
    return sections.slice(0, 6);
  } catch {
    return [];
  }
}

export async function fetchOpenLibraryWorks(
  authorName: string
): Promise<FamousWork[]> {
  const cacheKey = `ol_works_${authorName}`;
  const cached = getCache<FamousWork[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(
      authorName
    )}&limit=5&fields=title,first_publish_year,subject`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const docs = Array.isArray(data?.docs) ? data.docs : [];

    const works: FamousWork[] = docs
      .filter((d: { title?: string }) => d.title)
      .slice(0, 4)
      .map(
        (d: {
          title: string;
          first_publish_year?: number;
          subject?: string[];
        }) => ({
          title: d.title,
          year: d.first_publish_year
            ? String(d.first_publish_year)
            : 'Opera classica',
          description:
            Array.isArray(d.subject) && d.subject.length > 0
              ? `Temi: ${d.subject.slice(0, 3).join(', ')}`
              : `Opera celebre di ${authorName}.`,
        })
      );

    if (works.length > 0) {
      setCache(cacheKey, works);
    }
    return works;
  } catch {
    return [];
  }
}

export async function translateQuoteLive(
  italianText: string,
  targetLang: 'la' | 'en' | 'fr' | 'de'
): Promise<string> {
  const shortKey = `${targetLang}_${italianText.slice(0, 60)}`;
  const cached = getCache<string>(shortKey);
  if (cached) return cached;

  try {
    const queryText = italianText.slice(0, 450);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      queryText
    )}&langpair=it|${targetLang}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translation error');
    const data = await res.json();
    const translated: string = data?.responseData?.translatedText || '';
    if (translated && !translated.includes('MYMEMORY WARNING')) {
      setCache(shortKey, translated);
      return translated;
    }
    return italianText;
  } catch {
    return italianText;
  }
}

export async function fetchDynamicHistoricalQuote(
  seed: AuthorSeed,
  quoteIndex = 0
): Promise<Quote> {
  const cacheKey = `dyn_hist_quote_${seed.id}_${quoteIndex}`;
  const cached = getCache<Quote>(cacheKey);
  if (cached) return cached;

  const [wqItems, authorSummary, eventSummary] = await Promise.all([
    fetchWikiquoteQuotes(seed.wikiquoteTitle),
    fetchWikipediaSummary(seed.wikiTitle),
    fetchWikipediaSummary(seed.historicalEventWiki),
  ]);

  const pickedItem =
    wqItems.length > 0
      ? wqItems[quoteIndex % wqItems.length]
      : {
          text:
            authorSummary.extract.split('. ')[0] ||
            `La ricerca della verità e del senso della storia attraversa l’opera di ${seed.name}.`,
          sourceNote: seed.name,
        };

  const words = pickedItem.text
    .replace(/[^\p{L}\s]/gu, '')
    .split(/\s+/)
    .filter((w) => w.length >= 6);
  const keyWord = words[0] || seed.name;

  const builtQuote: Quote = {
    id: `${seed.id}-wq-${quoteIndex}`,
    authorId: seed.id,
    category: 'historical',
    epochId: seed.epochId,
    italianText: pickedItem.text,
    author: seed.name,
    authorRole: `${seed.profession} (${seed.yearBadge})`,
    work: pickedItem.sourceNote,
    dateLabel: seed.yearBadge,
    sortYear: seed.sortYear,
    whoWas:
      seed.satiricalHook ||
      conciseParagraph(authorSummary.extract, 380) ||
      `${seed.name} (${seed.lifeSpan}), ${authorSummary.description}.`,
    meaning:
      seed.connectionNote ||
      `Pensiero di ${seed.name} nel quadro di "${seed.historicalEventLabel}".`,
    tags: [seed.name, seed.profession, seed.yearBadge],
    translations: {
      latin: '',
      english: '',
      french: '',
      german: '',
    },
    historicalEvent: {
      title: seed.historicalEventLabel,
      yearLabel: seed.yearBadge,
      description: conciseParagraph(
        eventSummary.extract || authorSummary.extract,
        380
      ),
    },
    keyTerm: {
      word: keyWord.charAt(0).toUpperCase() + keyWord.slice(1),
      language: `Lessico di ${seed.name}`,
      etymology: `Tratto da ${pickedItem.sourceNote}`,
      definition:
        authorSummary.description ||
        'Concetto chiave emerso dalla citazione.',
    },
  };

  setCache(cacheKey, builtQuote);
  return builtQuote;
}

export async function fetchDynamicSacredQuote(
  seed: SacredSeed
): Promise<Quote> {
  const cacheKey = `dyn_sacred_${seed.id}`;
  const cached = getCache<Quote>(cacheKey);
  if (cached) return cached;

  const wikiContext = await fetchWikipediaSummary(seed.wikipediaTitle);

  if (seed.tradition === 'Corano') {
    try {
      const url = `https://api.alquran.cloud/v1/ayah/${seed.apiRef}/editions/quran-uthmani,en.transliteration,it.piccardo,en.asad,fr.hamidullah,de.bubenheim`;
      const res = await fetch(url);
      const json = await res.json();
      const editions = Array.isArray(json?.data) ? json.data : [];

      const arabic = editions[0]?.text || '';
      const translit = editions[1]?.text || '';
      const italian = editions[2]?.text || '';
      const english = editions[3]?.text || '';
      const french = editions[4]?.text || '';
      const german = editions[5]?.text || '';
      const surahName = editions[0]?.surah?.englishName || seed.title;

      const quranQuote: Quote = {
        id: seed.id,
        authorId: 'corano-sapienza',
        category: 'biblical',
        sacredTradition: 'Corano',
        epochId: 'biblico',
        italianText: italian || wikiContext.extract,
        author: seed.title,
        authorRole: 'Tradizione Coranica',
        work: `${seed.workLabel} (${surahName})`,
        dateLabel: seed.dateLabel,
        sortYear: seed.sortYear,
        whoWas: conciseParagraph(
          wikiContext.extract ||
            'Sura del Corano trasmessa in arabo classico nel VII secolo AD.',
          360
        ),
        meaning: `Versetto (${seed.apiRef}) nella traduzione italiana di Hamza Roberto Piccardo, affiancato dal testo arabo Uthmani originale.`,
        tags: ['Corano', 'Arabo Classico', surahName],
        original: arabic
          ? {
              language: 'Arabo Classico (Corano)',
              text: arabic,
              transliteration: translit,
              literalTranslation: italian,
            }
          : undefined,
        translations: {
          latin: '',
          english,
          french,
          german,
        },
        historicalEvent: {
          title: `Contesto storico della ${seed.workLabel}`,
          yearLabel: seed.dateLabel,
          description: conciseParagraph(
            wikiContext.extract || 'Contesto storico e filologico della Sura.',
            360
          ),
        },
        keyTerm: {
          word: surahName,
          language: 'Arabo Classico',
          etymology: `Sura del Corano (${seed.apiRef})`,
          definition:
            wikiContext.description || 'Capitolo della rivelazione coranica.',
        },
      };

      setCache(cacheKey, quranQuote);
      return quranQuote;
    } catch {
      // Fallback
    }
  }

  const [latinRes, engRes, wqItems] = await Promise.all([
    fetch(`https://bible-api.com/${seed.apiRef}?translation=clementine`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetch(`https://bible-api.com/${seed.apiRef}?translation=web`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetchWikiquoteQuotes(seed.wikiquoteTitle),
  ]);

  const latinVerse = (latinRes?.text || '').replace(/\s+/g, ' ').trim();
  const englishVerse = (engRes?.text || '').replace(/\s+/g, ' ').trim();
  const italianFromWq = wqItems[0]?.text || '';

  const italianFinal =
    italianFromWq ||
    (englishVerse
      ? await translateQuoteLive(englishVerse, 'it' as never)
      : wikiContext.extract);

  const bibleQuote: Quote = {
    id: seed.id,
    authorId: 'sacra-bibbia-profeti',
    category: 'biblical',
    sacredTradition: 'Bibbia',
    epochId: 'biblico',
    italianText: italianFinal || latinVerse,
    author: seed.title,
    authorRole: 'Sacre Scritture',
    work: seed.workLabel,
    dateLabel: seed.dateLabel,
    sortYear: seed.sortYear,
    whoWas: conciseParagraph(
      wikiContext.extract ||
        `${seed.title}, libro sapienziale e profetico della Bibbia.`,
      360
    ),
    meaning: `Passo biblico (${seed.workLabel}) accompagnato dal testo latino della Vulgata Clementina.`,
    tags: ['Bibbia', 'Vulgata Latina', seed.title],
    original: latinVerse
      ? {
          language: 'Latino',
          text: latinVerse,
          literalTranslation: englishVerse || italianFinal,
        }
      : undefined,
    translations: {
      latin: latinVerse,
      english: englishVerse,
      french: '',
      german: '',
    },
    historicalEvent: {
      title: `Storia e composizione: ${seed.title}`,
      yearLabel: seed.dateLabel,
      description: conciseParagraph(
        wikiContext.extract ||
          `Inquadramento storico e biblico per ${seed.title}.`,
        360
      ),
    },
    keyTerm: {
      word: seed.workLabel,
      language: 'Tradizione Biblica (Ebraico / Greco / Latino)',
      etymology: `Riferimento canonico: ${seed.apiRef.replace(/\+/g, ' ')}`,
      definition: wikiContext.description || 'Testo delle Sacre Scritture.',
    },
  };

  setCache(cacheKey, bibleQuote);
  return bibleQuote;
}

export async function fetchAuthorFullDossier(
  seed: AuthorSeed
): Promise<{ profile: AuthorProfile; quotes: Quote[] }> {
  const cacheKey = `author_dossier_v5_${seed.id}`;
  const cached = getCache<{ profile: AuthorProfile; quotes: Quote[] }>(cacheKey);
  if (cached) return cached;

  const [summary, sections, eventSections, openLibWorks, wqQuotes] =
    await Promise.all([
      fetchWikipediaSummary(seed.wikiTitle),
      fetchWikipediaSections(seed.wikiTitle),
      seed.historicalEventWiki && seed.historicalEventWiki !== seed.wikiTitle
        ? fetchWikipediaSections(seed.historicalEventWiki)
        : Promise.resolve([]),
      fetchOpenLibraryWorks(seed.name),
      fetchWikiquoteQuotes(seed.wikiquoteTitle),
    ]);

  const periodSection =
    sections.find((s) =>
      /biografia|vita|storia|origini|contesto|giovinezza/i.test(s.title)
    ) ||
    sections[1] ||
    sections[0];

  const unusualSection =
    sections.find((s) =>
      /curiosit|stile|pensiero|processo|leggenda|personalit|morte|eredit|critica|politica/i.test(
        s.title
      )
    ) ||
    sections[sections.length - 1] ||
    sections[0];

  const worksList: FamousWork[] =
    openLibWorks.length > 0
      ? openLibWorks
      : sections
          .filter((s) => /opere|scritti|tragedie|poemi|pensiero/i.test(s.title))
          .map((s) => ({
            title: s.title,
            year: seed.yearBadge,
            description: conciseParagraph(s.content, 180),
          }));

  if (worksList.length === 0) {
    worksList.push({
      title: `Opere e scritti di ${seed.name}`,
      year: seed.yearBadge,
      description: summary.description || conciseParagraph(summary.extract, 180),
    });
  }

  // Capitoli di studio agili, mai pesanti, che aprono con il ritratto ironico/metaforico
  const studyChapters: StudyChapter[] = [
    {
      chapterNumber: 1,
      title: `Dietro il Mito: Chi era davvero ${seed.name}`,
      content: `${seed.satiricalHook}\n\n${seed.connectionNote}`,
    },
    ...sections.slice(0, 3).map((sec, idx) => ({
      chapterNumber: idx + 2,
      title: sec.title,
      content: sec.content,
    })),
  ];

  if (eventSections.length > 0) {
    studyChapters.push({
      chapterNumber: studyChapters.length + 1,
      title: `Il Fatto Chiave: ${seed.historicalEventLabel}`,
      content: conciseParagraph(eventSections[0].content, 580),
    });
  }

  const builtQuotes: Quote[] = wqQuotes.slice(0, 6).map((item, idx) => ({
    id: `${seed.id}-live-${idx}`,
    authorId: seed.id,
    category: 'historical',
    epochId: seed.epochId,
    italianText: item.text,
    author: seed.name,
    authorRole: `${seed.profession} (${seed.yearBadge})`,
    work: item.sourceNote,
    dateLabel: seed.yearBadge,
    sortYear: seed.sortYear,
    whoWas: seed.satiricalHook || conciseParagraph(summary.extract, 360),
    meaning:
      seed.connectionNote ||
      `Citazione di ${seed.name} nel contesto di "${seed.historicalEventLabel}".`,
    tags: [seed.name, seed.profession, seed.yearBadge],
    translations: {
      latin: '',
      english: '',
      french: '',
      german: '',
    },
    historicalEvent: {
      title: seed.historicalEventLabel,
      yearLabel: seed.yearBadge,
      description: conciseParagraph(
        eventSections[0]?.content || periodSection?.content || summary.extract,
        360
      ),
    },
    keyTerm: {
      word: item.sourceNote,
      language: seed.nationality,
      etymology: `Opera di ${seed.name}`,
      definition: summary.description,
    },
  }));

  const profile: AuthorProfile = {
    id: seed.id,
    name: seed.name,
    nationality: seed.nationality,
    profession: seed.profession,
    epochId: seed.epochId,
    subfolderId: seed.subfolderId,
    yearBadge: seed.yearBadge,
    lifeSpan: seed.lifeSpan,
    sortYear: seed.sortYear,
    portraitUrl: summary.thumbnailUrl,
    portraitCaption: `Ritratto storico (${seed.name})`,
    satiricalHook: seed.satiricalHook,
    connectionNote: seed.connectionNote,
    connectedAuthorIds: seed.connectedAuthorIds,
    periodDefinition: conciseParagraph(
      periodSection?.content || summary.extract,
      460
    ),
    biography: conciseParagraph(
      summary.extract || `${seed.name}, ${summary.description}.`,
      420
    ),
    famousWorks: worksList,
    unusualPersonalFact:
      seed.satiricalHook ||
      conciseParagraph(unusualSection?.content || summary.extract, 420),
    studyChapters,
  };

  const result = { profile, quotes: builtQuotes };
  setCache(cacheKey, result);
  return result;
}

export async function discoverAuthorsFromWikiCategory(
  category: WikiDiscoveryCategory
): Promise<AuthorSeed[]> {
  const cacheKey = `wiki_cat_disc_${category.id}`;
  const cached = getCache<AuthorSeed[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const url = `https://it.wikipedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=${encodeURIComponent(
      category.wikiCategory
    )}&gcmnamespace=0&gcmlimit=18&prop=pageimages|extracts&exintro=1&explaintext=1&exchars=220&piprop=thumbnail&pithumbsize=400&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const pagesObj = data?.query?.pages || {};
    const pages = Object.values(pagesObj) as Array<{
      pageid?: number;
      title?: string;
      extract?: string;
      thumbnail?: { source?: string };
    }>;

    const discovered: AuthorSeed[] = [];

    for (const p of pages) {
      const title = (p.title || '').trim();
      if (
        !title ||
        /^(filosofia|storia|elenco|lista|scuola|categoria|portale|glossario)/i.test(
          title
        )
      ) {
        continue;
      }

      const wikiSlug = encodeURIComponent(title.replace(/\s+/g, '_'));
      const slugId = `disc-${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`;

      const firstSentence = (p.extract || '').split('. ')[0] || title;

      discovered.push({
        id: slugId,
        name: title,
        wikiTitle: wikiSlug,
        wikiquoteTitle: wikiSlug,
        nationality: category.defaultNationality,
        profession: category.defaultProfession,
        epochId: category.defaultEpochId,
        subfolderId: category.defaultSubfolderId,
        yearBadge:
          category.defaultEpochId === 'antichita' ? 'Antichità a.C.' : 'Età Moderna / AD',
        lifeSpan:
          firstSentence.length > 100
            ? firstSentence.slice(0, 100) + '...'
            : firstSentence,
        sortYear: category.defaultEpochId === 'antichita' ? -300 : 1850,
        historicalEventWiki: wikiSlug,
        historicalEventLabel: `Pensiero e opere di ${title}`,
        satiricalHook:
          firstSentence ||
          `${title}, pensatore scoperto ed entrato nella linea del tempo.`,
        connectionNote: `Collegato alla corrente "${category.label}".`,
        connectedAuthorIds: ['kant', 'nietzsche', 'socrate'],
      });
    }

    if (discovered.length > 0) {
      setCache(cacheKey, discovered);
    }
    return discovered;
  } catch {
    return [];
  }
}

export async function searchAndCreateAuthorFromWiki(
  searchQuery: string
): Promise<AuthorSeed | null> {
  try {
    const url = `https://it.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      searchQuery
    )}&srlimit=1&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const firstHit = data?.query?.search?.[0];
    if (!firstHit?.title) return null;

    const title: string = firstHit.title;
    const wikiSlug = encodeURIComponent(title.replace(/\s+/g, '_'));
    const summary = await fetchWikipediaSummary(wikiSlug);

    return {
      id: `wiki-${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`,
      name: summary.title,
      wikiTitle: wikiSlug,
      wikiquoteTitle: wikiSlug,
      nationality: 'Internazionale',
      profession: /pittore|scultore|artista|architetto/i.test(
        summary.description
      )
        ? 'Pittore, Artista e Genio Universale'
        : /filosof/i.test(summary.description)
        ? 'Filosofo'
        : /drammaturg|tragediograf|teatr/i.test(summary.description)
        ? 'Drammaturgo e Tragediografo'
        : /storic|politic|statist|imperator|presidente|magistrat/i.test(
            summary.description
          )
        ? 'Storico, Politico e Statista'
        : 'Scrittore e Poeta',
      epochId: 'contemporanea',
      subfolderId: 'novecento-satira-potere-repubblica',
      yearBadge: 'Archivio Storico',
      lifeSpan: summary.description,
      sortYear: 1900,
      historicalEventWiki: wikiSlug,
      historicalEventLabel: `Pensiero, vita e contesto storico di ${summary.title}`,
      satiricalHook: conciseParagraph(summary.extract, 340),
      connectionNote: `Voce aggiunta alla linea del tempo.`,
      connectedAuthorIds: ['nietzsche', 'kant', 'socrate'],
    };
  } catch {
    return null;
  }
}

export async function fetchDynamicHistoricalInquiry(
  seedOrQuestion: InquirySeed | string
): Promise<HistoricalInquiry> {
  const isString = typeof seedOrQuestion === 'string';
  const cacheKey = `dyn_inq_v5_${
    isString ? seedOrQuestion.toLowerCase().trim() : seedOrQuestion.id
  }`;
  const cached = getCache<HistoricalInquiry>(cacheKey);
  if (cached) return cached;

  let wikiTitle = isString ? '' : seedOrQuestion.wikiPageTitle;
  const questionText = isString ? seedOrQuestion : seedOrQuestion.question;

  if (isString) {
    const cleanedSearch = seedOrQuestion
      .replace(
        /^(perch[eé]\s+[eè]\s+successo|perch[eé]|come mai|come si [eè] arrivati a|cosa ha causato|spiegami)\s+/i,
        ''
      )
      .trim();
    const searchUrl = `https://it.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      cleanedSearch
    )}&srlimit=1&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const hitTitle = searchData?.query?.search?.[0]?.title || cleanedSearch;
    wikiTitle = encodeURIComponent(hitTitle.replace(/\s+/g, '_'));
  }

  const protagonistWiki = isString
    ? wikiTitle
    : seedOrQuestion.protagonistWikiTitle || wikiTitle;

  const [summary, protagonistSummary, sections] = await Promise.all([
    fetchWikipediaSummary(wikiTitle),
    protagonistWiki !== wikiTitle
      ? fetchWikipediaSummary(protagonistWiki)
      : Promise.resolve(null),
    fetchWikipediaSections(wikiTitle),
  ]);

  const portraitUrl =
    protagonistSummary?.thumbnailUrl || summary.thumbnailUrl || '';

  const steps: InquiryStep[] = sections.slice(0, 4).map((sec, idx) => ({
    stepNumber: idx + 1,
    phaseTitle: sec.title,
    chronology: `Atto ${idx + 1}`,
    explanation: conciseParagraph(sec.content, 440),
  }));

  if (steps.length === 0) {
    steps.push({
      stepNumber: 1,
      phaseTitle: summary.title,
      chronology: 'Atto 1',
      explanation: conciseParagraph(
        summary.extract || 'Spiegazione e ricostruzione storica.',
        440
      ),
    });
  }

  const causesSection = sections.find((s) =>
    /origini|cause|contesto|premesse|storia|antefatti/i.test(s.title)
  );
  const consequencesSection = sections.find((s) =>
    /conseguenze|impatto|eredit|bilancio|controversie|processi|sviluppi/i.test(
      s.title
    )
  );

  const whyItHappened = isString
    ? conciseParagraph(
        causesSection?.content ||
          summary.extract ||
          `Le cause di "${summary.title}" affondano nelle contraddizioni politiche, economiche e umane del suo tempo.`,
        480
      )
    : seedOrQuestion.whyItHappenedContext;

  const presentRepercussions = isString
    ? conciseParagraph(
        consequencesSection?.content ||
          `Ancora oggi "${summary.title}" condiziona le regole, la politica e il modo in cui interpretiamo le crisi contemporanee.`,
        480
      )
    : seedOrQuestion.presentRepercussionsContext;

  const satiricalHook = isString
    ? `La storia ha sempre più fantasia dei romanzieri: ecco come si è arrivati a "${summary.title}".`
    : seedOrQuestion.satiricalHook;

  const inquiry: HistoricalInquiry = {
    id: isString ? `live-inq-${Date.now()}` : seedOrQuestion.id,
    category: isString
      ? 'Potere, Congiure & Rivoluzioni'
      : seedOrQuestion.category,
    question: questionText,
    subtitle: `${summary.title} — ${summary.description}`,
    satiricalHook,
    epochId: isString ? 'contemporanea' : seedOrQuestion.epochId,
    periodLabel: isString ? summary.title : seedOrQuestion.periodLabel,
    protagonistName: isString
      ? summary.title
      : seedOrQuestion.protagonistName,
    protagonistWikiTitle: protagonistWiki,
    portraitUrl,
    whyItHappened,
    overview: conciseParagraph(
      summary.extract || `Il quadro storico essenziale su "${summary.title}".`,
      420
    ),
    steps,
    presentRepercussions,
    philosophicalTakeaway: `La lezione di "${summary.title}": cambiano i secoli, le parrucche e le tecnologie, ma le debolezze, le ambizioni e le sviste degli esseri umani seguono sempre lo stesso copione.`,
    relatedQuoteIds: [],
    relatedAuthorIds: isString
      ? AUTHOR_SEEDS.filter((a) =>
          summary.extract.toLowerCase().includes(a.name.toLowerCase())
        ).map((a) => a.id)
      : seedOrQuestion.relatedAuthorIds,
    tags: [summary.title, 'Perché è successo?'],
  };

  setCache(cacheKey, inquiry);
  return inquiry;
}
