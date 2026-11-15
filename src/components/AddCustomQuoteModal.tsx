import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { EPOCHS } from '../data/seeds';
import {
  EpochId,
  OriginalLanguage,
  Quote,
  QuoteCategory,
  SacredTradition,
} from '../core/types';

interface AddCustomQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuote: (quote: Quote) => void;
}

export const AddCustomQuoteModal: React.FC<AddCustomQuoteModalProps> = ({
  isOpen,
  onClose,
  onAddQuote,
}) => {
  const [category, setCategory] = useState<QuoteCategory>('historical');
  const [sacredTradition, setSacredTradition] =
    useState<SacredTradition>('Bibbia');
  const [epochId, setEpochId] = useState<EpochId>('antichita');
  const [italianText, setItalianText] = useState('');
  const [author, setAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [work, setWork] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [sortYear, setSortYear] = useState('-399');
  const [originalLang, setOriginalLang] =
    useState<OriginalLanguage>('Greco Antico');
  const [originalText, setOriginalText] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [latinText, setLatinText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [frenchText, setFrenchText] = useState('');
  const [germanText, setGermanText] = useState('');
  const [whoWas, setWhoWas] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [meaning, setMeaning] = useState('');
  const [keyWord, setKeyWord] = useState('');
  const [keyDefinition, setKeyDefinition] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!italianText.trim() || !author.trim()) return;

    const parsedYear = parseInt(sortYear, 10);
    const id = `custom-${Date.now()}`;

    const newQuote: Quote = {
      id,
      authorId: 'custom',
      category,
      sacredTradition: category === 'biblical' ? sacredTradition : undefined,
      epochId,
      italianText: italianText.trim(),
      author: author.trim(),
      authorRole: authorRole.trim() || 'Autore / Pensatore',
      work: work.trim() || 'Annotazione personale',
      dateLabel: dateLabel.trim() || 'Epoca storica',
      sortYear: isNaN(parsedYear) ? 0 : parsedYear,
      whoWas:
        whoWas.trim() ||
        `${author.trim()}, voce custodita nella tua raccolta personale.`,
      meaning:
        meaning.trim() || 'Riflessione aggiunta manualmente alla raccolta.',
      tags: [
        category === 'biblical' ? sacredTradition : 'Storia',
        'Raccolta Personale',
      ],
      original: originalText.trim()
        ? {
            language: originalLang,
            text: originalText.trim(),
            transliteration: transliteration.trim() || undefined,
            literalTranslation: italianText.trim(),
          }
        : undefined,
      translations: {
        latin: latinText.trim() || italianText.trim(),
        english: englishText.trim() || italianText.trim(),
        french: frenchText.trim() || italianText.trim(),
        german: germanText.trim() || italianText.trim(),
      },
      historicalEvent: {
        title: eventTitle.trim() || 'Contesto storico e culturale',
        yearLabel: dateLabel.trim() || 'Storia',
        description:
          eventDescription.trim() ||
          'Contesto annotato nella raccolta personale.',
      },
      keyTerm: {
        word: keyWord.trim() || author.trim(),
        language: originalText.trim() ? originalLang : 'Italiano',
        etymology: work.trim() || 'Tradizione storica e letteraria',
        definition:
          keyDefinition.trim() ||
          'Concetto chiave legato a questa citazione.',
      },
      isCustom: true,
    };

    onAddQuote(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bento-card w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)]">
              Nuova Voce d’Archivio
            </span>
            <h3 className="font-serif-editorial text-2xl md:text-3xl m-0">
              Aggiungi una Citazione o un Passo Sacro
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as QuoteCategory;
                  setCategory(val);
                  if (val === 'biblical') setEpochId('biblico');
                }}
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              >
                <option value="historical">Storica / Filosofica / Letteraria</option>
                <option value="biblical">Sacre Scritture (Bibbia / Corano)</option>
              </select>
            </div>

            {category === 'biblical' && (
              <div>
                <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                  Tradizione Sacra
                </label>
                <select
                  value={sacredTradition}
                  onChange={(e) =>
                    setSacredTradition(e.target.value as SacredTradition)
                  }
                  className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
                >
                  <option value="Bibbia">La Bibbia</option>
                  <option value="Corano">Il Corano</option>
                </select>
              </div>
            )}

            <div className={category === 'biblical' ? '' : 'sm:col-span-2'}>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Epoca Storica *
              </label>
              <select
                value={epochId}
                onChange={(e) => setEpochId(e.target.value as EpochId)}
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              >
                {EPOCHS.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.name} ({ep.period})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
              Frase in Italiano *
            </label>
            <textarea
              required
              rows={2}
              value={italianText}
              onChange={(e) => setItalianText(e.target.value)}
              placeholder="Es. Una vita senza ricerca non è degna di essere vissuta"
              className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Autore / Opera Sacra *
              </label>
              <input
                required
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Es. Sofocle / Dante Alighieri / Sura 94"
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Qualifica dell’autore
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Es. Tragediografo / Scrittore / Pittore"
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Opera, Romanzo o Versetto
              </label>
              <input
                type="text"
                value={work}
                onChange={(e) => setWork(e.target.value)}
                placeholder="Es. Tristano e Isotta / Edipo a Colono"
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Luogo e Data
              </label>
              <input
                type="text"
                value={dateLabel}
                onChange={(e) => setDateLabel(e.target.value)}
                placeholder="Atene, 406 a.C."
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Anno per Timeline (- per a.C.)
              </label>
              <input
                type="number"
                value={sortYear}
                onChange={(e) => setSortYear(e.target.value)}
                placeholder="-406"
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="bento-subbox p-4 space-y-3">
            <div className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)]">
              Testo Originale & Traduzioni (Opzionali: Greco, Latino, Inglese, Francese, Tedesco)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={originalLang}
                onChange={(e) =>
                  setOriginalLang(e.target.value as OriginalLanguage)
                }
                className="rounded-lg px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              >
                <option value="Greco Antico">Greco Antico</option>
                <option value="Latino">Latino</option>
                <option value="Ebraico Biblico">Ebraico Biblico</option>
                <option value="Arabo Classico (Corano)">Arabo Classico</option>
                <option value="Antico Francese / Romanzo Cortese">
                  Antico Francese
                </option>
                <option value="Italiano Volgare / Storico">
                  Italiano Storico
                </option>
              </select>
              <input
                type="text"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Testo in lingua originale..."
                className="sm:col-span-2 rounded-lg px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={latinText}
                onChange={(e) => setLatinText(e.target.value)}
                placeholder="Traduzione in Latino (opzionale)"
                className="rounded-lg px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
              <input
                type="text"
                value={englishText}
                onChange={(e) => setEnglishText(e.target.value)}
                placeholder="Traduzione in English (opzionale)"
                className="rounded-lg px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
              <input
                type="text"
                value={frenchText}
                onChange={(e) => setFrenchText(e.target.value)}
                placeholder="Traduzione in Français (opzionale)"
                className="rounded-lg px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
              <input
                type="text"
                value={germanText}
                onChange={(e) => setGermanText(e.target.value)}
                placeholder="Traduzione in Deutsch (opzionale)"
                className="rounded-lg px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Chi era l’autore
              </label>
              <textarea
                rows={2}
                value={whoWas}
                onChange={(e) => setWhoWas(e.target.value)}
                placeholder="Breve ritratto storico e intellettuale..."
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Significato filosofico / spirituale
              </label>
              <textarea
                rows={2}
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Perché questa frase incide nella storia..."
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Titolo avvenimento storico (es. Processo a Sofocle)
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Es. Il Processo a Sofocle del 406 a.C."
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Parola chiave etimologica
              </label>
              <input
                type="text"
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
                placeholder="Es. Logos / Anexétastos / Fin’amor"
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Racconto dell’avvenimento storico
              </label>
              <textarea
                rows={2}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Cosa accadde in quel periodo storico..."
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block font-mono-meta text-xs mb-1 text-[var(--text-muted)]">
                Spiegazione della parola chiave
              </label>
              <textarea
                rows={2}
                value={keyDefinition}
                onChange={(e) => setKeyDefinition(e.target.value)}
                placeholder="Significato profondo del termine..."
                className="w-full rounded-lg px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-xs font-mono-meta uppercase cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[var(--text-main)] text-[var(--bg-surface)] text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Salva nella Raccolta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
