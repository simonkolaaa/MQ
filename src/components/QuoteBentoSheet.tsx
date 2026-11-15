import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Check,
  Copy,
  Feather,
  Flame,
  Globe,
  Landmark,
  Languages,
  Loader2,
  NotebookPen,
  ScrollText,
  Sparkles,
  Trash2,
  UserRoundSearch,
} from 'lucide-react';
import { AUTHOR_SEEDS, EPOCHS } from '../data/seeds';
import { translateQuoteLive } from '../services/liveWikiApi';
import {
  Quote,
  TranslationLangKey,
  UserQuoteRecord,
} from '../core/types';
import { AuthorPortrait } from './AuthorPortrait';

interface QuoteBentoSheetProps {
  quote: Quote;
  record?: UserQuoteRecord;
  badgeLabel?: string;
  onToggleFavorite: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onDeleteCustom?: (id: string) => void;
  onSelectAuthor?: (authorId: string) => void;
  compactByDefault?: boolean;
}

const LANG_OPTIONS: {
  key: TranslationLangKey;
  label: string;
}[] = [
  { key: 'it', label: 'Italiano' },
  { key: 'la', label: 'Latino' },
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'Français' },
  { key: 'de', label: 'Deutsch' },
];

export const QuoteBentoSheet: React.FC<QuoteBentoSheetProps> = ({
  quote,
  record,
  badgeLabel,
  onToggleFavorite,
  onSaveNote,
  onDeleteCustom,
  onSelectAuthor,
  compactByDefault = false,
}) => {
  const [expanded, setExpanded] = useState(!compactByDefault);
  const [activeLang, setActiveLang] = useState<TranslationLangKey>('it');
  const [liveTranslatedText, setLiveTranslatedText] = useState<string>(
    quote.italianText
  );
  const [isTranslating, setIsTranslating] = useState(false);

  const [noteDraft, setNoteDraft] = useState(record?.note ?? '');
  const [copied, setCopied] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);

  useEffect(() => {
    setNoteDraft(record?.note ?? '');
  }, [record?.note, quote.id]);

  useEffect(() => {
    setActiveLang('it');
    setLiveTranslatedText(quote.italianText);
  }, [quote.id, quote.italianText]);

  useEffect(() => {
    if (activeLang === 'it') {
      setLiveTranslatedText(quote.italianText);
      return;
    }
    if (activeLang === 'original') {
      setLiveTranslatedText(quote.original?.text || quote.italianText);
      return;
    }

    const preloaded =
      activeLang === 'la'
        ? quote.translations.latin
        : activeLang === 'en'
        ? quote.translations.english
        : activeLang === 'fr'
        ? quote.translations.french
        : quote.translations.german;

    if (preloaded && preloaded.trim().length > 0) {
      setLiveTranslatedText(preloaded);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);
    translateQuoteLive(quote.italianText, activeLang)
      .then((res) => {
        if (!cancelled) {
          setLiveTranslatedText(res);
          setIsTranslating(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLiveTranslatedText(quote.italianText);
          setIsTranslating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeLang, quote]);

  const epoch = EPOCHS.find((e) => e.id === quote.epochId);
  const linkedSeed = AUTHOR_SEEDS.find(
    (a) =>
      a.id === quote.authorId ||
      a.name.toLowerCase() === quote.author.toLowerCase()
  );
  const isHistorical = quote.category === 'historical';
  const isFavorite = record?.favorite ?? false;

  const handleCopy = () => {
    const text = `«${liveTranslatedText}» — ${quote.author} (${quote.work}, ${quote.dateLabel})`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleNoteSave = () => {
    onSaveNote(quote.id, noteDraft);
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 1800);
  };

  return (
    <article className="bento-card p-6 md:p-8 flex flex-col gap-6">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`font-mono-meta text-xs uppercase tracking-wider px-3 py-1 rounded-full font-medium flex items-center gap-1.5 ${
              isHistorical ? 'badge-hist' : 'badge-bibl'
            }`}
          >
            {isHistorical ? (
              <Landmark className="w-3.5 h-3.5" />
            ) : (
              <ScrollText className="w-3.5 h-3.5" />
            )}
            {badgeLabel ??
              (isHistorical
                ? 'Storia, Filosofia & Letteratura'
                : quote.sacredTradition === 'Corano'
                ? 'Sacre Scritture · Il Corano'
                : 'Sacre Scritture · La Bibbia')}
          </span>

          {epoch && (
            <span className="font-mono-meta text-xs px-2.5 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)]">
              {epoch.shortName}
            </span>
          )}

          {quote.original && (
            <span className="badge-gold font-mono-meta text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              <Languages className="w-3.5 h-3.5" />
              {quote.original.language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono-meta text-xs text-[var(--text-faint)] mr-1">
            {quote.dateLabel}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            title="Copia citazione nella lingua selezionata"
            className="p-2 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(quote.id)}
            title={isFavorite ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-meta flex items-center gap-1.5 transition-all cursor-pointer ${
              isFavorite
                ? 'badge-gold font-semibold'
                : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-muted)]'
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`}
            />
            {isFavorite ? 'Custodita' : 'Salva'}
          </button>

          {quote.isCustom && onDeleteCustom && (
            <button
              type="button"
              onClick={() => onDeleteCustom(quote.id)}
              title="Elimina citazione personale"
              className="p-2 rounded-lg border border-[var(--border-subtle)] text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Multilingual Translation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
        <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          Traduzione in tempo reale:
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setActiveLang(opt.key)}
              className={`px-2.5 py-1 rounded-md font-mono-meta text-xs transition-all cursor-pointer ${
                activeLang === opt.key
                  ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-semibold'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {opt.label}
            </button>
          ))}

          {quote.original && (
            <button
              type="button"
              onClick={() => setActiveLang('original')}
              className={`px-2.5 py-1 rounded-md font-mono-meta text-xs flex items-center gap-1 transition-all cursor-pointer ${
                activeLang === 'original'
                  ? 'bg-[var(--accent-gold)] text-white font-semibold'
                  : 'badge-gold hover:opacity-90'
              }`}
            >
              <Languages className="w-3 h-3" />
              Originale ({quote.original.language.split(' ')[0]})
            </button>
          )}
        </div>
      </div>

      {/* Main Monumental Quote + Author Portrait Bar */}
      <div className="space-y-5">
        {isTranslating ? (
          <div className="flex items-center gap-2 py-4 font-mono-meta text-xs text-[var(--accent-gold)]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Traduzione in tempo reale in corso...
          </div>
        ) : (
          <blockquote className="quote-display text-[var(--text-main)] m-0 transition-all">
            «{liveTranslatedText}»
          </blockquote>
        )}

        {activeLang !== 'it' && !isTranslating && (
          <p className="text-xs font-mono-meta text-[var(--text-muted)] bg-[var(--bg-subtle)] px-3.5 py-2 rounded-lg border border-[var(--border-subtle)] m-0">
            Testo italiano originale: «{quote.italianText}»
          </p>
        )}

        {/* Author Row with Portrait & Link to Author Dossier */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-[var(--border-subtle)] pb-5">
          <div className="flex items-center gap-3.5">
            <AuthorPortrait
              name={quote.author}
              wikiTitle={
                linkedSeed?.wikiTitle ||
                encodeURIComponent(quote.author.replace(/\s+/g, '_'))
              }
              size="md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-base text-[var(--text-main)]">
                  {quote.author}
                </span>
                {linkedSeed && onSelectAuthor && (
                  <button
                    type="button"
                    onClick={() => onSelectAuthor(linkedSeed.id)}
                    className="font-mono-meta text-[11px] px-2.5 py-0.5 rounded-md bg-[var(--bg-subtle)] hover:bg-[var(--bg-inset)] border border-[var(--border-subtle)] text-[var(--text-main)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <UserRoundSearch className="w-3 h-3 text-[var(--accent-hist)]" />
                    Apri & Studia Autore
                  </button>
                )}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {quote.authorRole}
              </div>
            </div>
          </div>

          <div className="font-mono-meta text-xs text-[var(--text-muted)]">
            Fonte:{' '}
            <span className="text-[var(--text-main)] font-medium">
              {quote.work}
            </span>
          </div>
        </div>
      </div>

      {/* Original Ancient Text Box (when viewing Italian) */}
      {quote.original && activeLang === 'it' && (
        <div className="bento-subbox p-4 md:p-5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-gold)] font-semibold flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              Testo Originale · {quote.original.language}
            </span>
          </div>
          <p className="font-serif-editorial text-xl md:text-2xl italic text-[var(--text-main)] leading-relaxed m-0">
            {quote.original.text}
          </p>
          {quote.original.transliteration && (
            <p className="font-mono-meta text-xs text-[var(--text-muted)] m-0">
              Traslitterazione: {quote.original.transliteration}
            </p>
          )}
        </div>
      )}

      {/* Toggle button when in compact collection view */}
      {compactByDefault && (
        <div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-mono-meta uppercase tracking-wider px-3.5 py-2 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-main)] cursor-pointer transition-colors"
          >
            {expanded
              ? 'Chiudi approfondimento storico e filosofico'
              : 'Apri approfondimento (Chi era · Avvenimento · Significato · Lessico)'}
          </button>
        </div>
      )}

      {/* 4-Panel Editorial Bento Breakdown */}
      {expanded && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. Chi era l'autore */}
            <div className="bento-subbox p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-hist)] font-semibold">
                <Feather className="w-4 h-4" />
                Chi era · {quote.author}
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                {quote.whoWas}
              </p>
            </div>

            {/* 2. L'Avvenimento Memorabile / Contesto Storico */}
            <div className="bento-subbox p-5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-bibl)] font-semibold">
                  <Flame className="w-4 h-4" />
                  Contesto & Avvenimento Storico
                </span>
                <span className="font-mono-meta text-[11px] px-2 py-0.5 rounded bg-[var(--bg-inset)] text-[var(--text-muted)]">
                  {quote.historicalEvent.yearLabel}
                </span>
              </div>
              <h4 className="font-serif-editorial text-lg font-normal text-[var(--text-main)] m-0">
                {quote.historicalEvent.title}
              </h4>
              <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                {quote.historicalEvent.description}
              </p>
            </div>

            {/* 3. Significato Filosofico e Riflessivo */}
            <div className="bento-subbox p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold">
                <Sparkles className="w-4 h-4" />
                Significato Filosofico & Riflessivo
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                {quote.meaning}
              </p>
            </div>

            {/* 4. Parola Chiave & Etimologia */}
            <div className="bento-subbox p-5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  <BookOpen className="w-4 h-4" />
                  Riferimento & Lessico
                </span>
                <span className="font-mono-meta text-[11px] text-[var(--text-faint)]">
                  {quote.keyTerm.language}
                </span>
              </div>
              <div className="font-serif-editorial text-xl text-[var(--text-main)]">
                {quote.keyTerm.word}
              </div>
              <p className="font-mono-meta text-xs text-[var(--text-muted)] m-0">
                Fonte: {quote.keyTerm.etymology}
              </p>
              <p className="text-sm leading-relaxed text-[var(--text-main)] m-0">
                {quote.keyTerm.definition}
              </p>
            </div>
          </div>

          {/* Personal Note / Journal Box */}
          <div className="bento-subbox p-4 md:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor={`note-${quote.id}`}
                className="font-mono-meta text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center gap-1.5"
              >
                <NotebookPen className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                La tua nota o riflessione personale (salvata in locale)
              </label>
              {savedIndicator && (
                <span className="font-mono-meta text-xs text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Appunto salvato nella Raccolta
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <textarea
                id={`note-${quote.id}`}
                rows={2}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Scrivi qui un tuo collegamento storico, una riflessione filosofica o cosa ti lascia questa frase..."
                className="flex-1 rounded-lg px-3.5 py-2.5 text-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--border-strong)] text-[var(--text-main)] resize-y"
              />
              <button
                type="button"
                onClick={handleNoteSave}
                className="self-end sm:self-stretch px-4 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider bg-[var(--text-main)] text-[var(--bg-surface)] hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                Salva Nota
              </button>
            </div>
          </div>

          {/* Tags without # */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {quote.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono-meta text-[11px] px-2.5 py-0.5 rounded-md bg-[var(--bg-inset)] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
