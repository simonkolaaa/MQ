import React, { useMemo, useState } from 'react';
import {
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  GraduationCap,
  NotebookPen,
  Plus,
  Search,
  Sparkles,
  UserRoundSearch,
} from 'lucide-react';
import {
  SIMON_STUDY_NOTES,
  SimonNoteTrack,
} from '../data/simonNotes';
import { AUTHOR_SEEDS } from '../data/seeds';
import { Quote, UserQuoteRecord } from '../core/types';
import { AuthorPortrait } from './AuthorPortrait';
import { QuoteBentoSheet } from './QuoteBentoSheet';

interface SimonNotesSectionProps {
  journalQuotes: Quote[];
  records: Record<string, UserQuoteRecord>;
  onToggleFavorite: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onDeleteCustom: (id: string) => void;
  onOpenAuthor: (authorId: string) => void;
  onOpenCustomModal: () => void;
}

const TRACKS: (SimonNoteTrack | 'all')[] = [
  'all',
  'Letteratura: Realismo, Naturalismo & Verismo',
  'Letteratura del ’900: Decadentismo, Crisi dell’Io & Ermetismo',
  'Storia & Filosofia: Da Marx e Bismarck alle Guerre Mondiali',
  'Argomentazione & Attualità',
];

export const SimonNotesSection: React.FC<SimonNotesSectionProps> = ({
  journalQuotes,
  records,
  onToggleFavorite,
  onSaveNote,
  onDeleteCustom,
  onOpenAuthor,
  onOpenCustomModal,
}) => {
  const [subView, setSubView] = useState<'simon' | 'personal'>('simon');
  const [selectedTrack, setSelectedTrack] = useState<SimonNoteTrack | 'all'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNoteIds, setExpandedNoteIds] = useState<
    Record<string, boolean>
  >(() => ({
    [SIMON_STUDY_NOTES[0].id]: true,
    [SIMON_STUDY_NOTES[3].id]: true,
  }));

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SIMON_STUDY_NOTES.filter((note) => {
      if (selectedTrack !== 'all' && note.track !== selectedTrack) {
        return false;
      }
      if (q.length > 0) {
        const hay = [
          note.title,
          note.track,
          note.periodLabel,
          note.simonSays,
          ...note.keyPoints.map((kp) => `${kp.heading} ${kp.detail}`),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedTrack, searchQuery]);

  const toggleNoteExpand = (id: string) => {
    setExpandedNoteIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header & Sub-View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div className="space-y-2">
          <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-gold)] flex items-center gap-1.5">
            <NotebookPen className="w-3.5 h-3.5" />
            Il Quaderno di Studio & Le Note Personali
          </span>
          <h1 className="hero-title m-0">
            Gli Appunti di Simon & Le Tue Voci Custodite
          </h1>
          <p className="text-sm text-[var(--text-muted)] m-0 max-w-3xl">
            Esplora gli appunti presi durante gli anni di studio su{' '}
            <strong>
              poeti, romanzieri, filosofi e grandi snodi storici dell’Ottocento
              e del Novecento
            </strong>{' '}
            rielaborati nella rubrica <strong>«Simon dice...»</strong>, oppure
            consulta le citazioni che hai salvato nei Preferiti.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[var(--bg-subtle)] p-1.5 rounded-xl border border-[var(--border-subtle)] self-start md:self-end shrink-0">
          <button
            type="button"
            onClick={() => setSubView('simon')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              subView === 'simon'
                ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            Appunti di Simon («Simon dice...»)
          </button>

          <button
            type="button"
            onClick={() => setSubView('personal')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              subView === 'personal'
                ? 'bg-[var(--bg-surface)] text-[var(--text-main)] font-semibold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-[var(--accent-hist)]" />
            Preferiti & Note Salvate
          </button>
        </div>
      </div>

      {/* =====================================================================
          VISTA 1: IL QUADERNO DEGLI APPUNTI DI SIMON ("SIMON DICE...")
      ===================================================================== */}
      {subView === 'simon' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca negli appunti di Simon (es. Verga, Malavoglia, Pascoli, D’Annunzio, Zeno, Pirandello, Ungaretti, Marx, Bismarck, Giolitti, Weimar...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--border-strong)]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
              {TRACKS.map((tr) => (
                <button
                  key={tr}
                  type="button"
                  onClick={() => setSelectedTrack(tr)}
                  className={`px-3 py-1.5 rounded-lg font-mono-meta text-xs cursor-pointer transition-all ${
                    selectedTrack === tr
                      ? 'bg-[var(--text-main)] text-[var(--bg-surface)] font-semibold'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {tr === 'all' ? 'Tutti i Percorsi di Studio' : tr}
                </button>
              ))}
            </div>
          </div>

          {/* Lista Ordinata degli Appunti di Simon */}
          <div className="space-y-5">
            {filteredNotes.map((note) => {
              const isExpanded = !!expandedNoteIds[note.id];

              return (
                <article
                  key={note.id}
                  className="bento-card p-6 md:p-7 space-y-5 border border-[var(--border-strong)]"
                >
                  {/* Intestazione Appunto */}
                  <div
                    onClick={() => toggleNoteExpand(note.id)}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge-hist font-mono-meta text-xs px-3 py-1 rounded-full font-semibold">
                          {note.track}
                        </span>
                        <span className="badge-bibl font-mono-meta text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {note.periodLabel}
                        </span>
                      </div>

                      <h2 className="font-serif-editorial text-2xl md:text-3xl text-[var(--text-main)] m-0">
                        {note.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      className="self-start md:self-center px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] text-xs font-mono-meta text-[var(--text-main)] flex items-center gap-1.5 shrink-0"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Chiudi Dettagli
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-4 h-4" />
                          Apri Appunti Completi
                        </>
                      )}
                    </button>
                  </div>

                  {/* Box "Simon dice..." sempre visibile per agganciare subito il lettore */}
                  <div className="bento-subbox p-5 border-l-4 border-[var(--accent-gold)] space-y-1.5">
                    <span className="font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Il Punto Chiave · Simon dice...
                    </span>
                    <p className="text-sm md:text-base leading-relaxed text-[var(--text-main)] m-0">
                      {note.simonSays}
                    </p>
                  </div>

                  {/* Punti chiave espandibili */}
                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      {note.keyPoints.map((kp) => (
                        <div
                          key={kp.heading}
                          className="bento-subbox p-4 space-y-2 bg-[var(--bg-surface)]"
                        >
                          <div className="flex items-center gap-1.5 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-hist)] font-semibold">
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            {kp.heading}
                          </div>
                          <p className="text-xs md:text-sm leading-relaxed text-[var(--text-main)] m-0">
                            {kp.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Poeti e Pensatori collegati */}
                  {note.linkedAuthorIds.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                          Autori studiati in questo appunto:
                        </span>
                        {note.linkedAuthorIds.map((aId) => {
                          const auth = AUTHOR_SEEDS.find((a) => a.id === aId);
                          if (!auth) return null;
                          return (
                            <button
                              key={auth.id}
                              type="button"
                              onClick={() => onOpenAuthor(auth.id)}
                              className="px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] flex items-center gap-2 cursor-pointer transition-all"
                            >
                              <AuthorPortrait
                                name={auth.name}
                                wikiTitle={auth.wikiTitle}
                                size="sm"
                              />
                              <div className="text-left">
                                <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                                  {auth.name}
                                  <UserRoundSearch className="w-3 h-3 text-[var(--accent-hist)]" />
                                </div>
                                <div className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                                  {auth.yearBadge} · Vai all’autore
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          VISTA 2: PREFERITI & NOTE PERSONALI SALVATE SUL DISPOSITIVO
      ===================================================================== */}
      {subView === 'personal' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onOpenCustomModal}
              className="px-4 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-surface)] text-xs font-mono-meta uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Aggiungi Citazione o Versetto Personale
            </button>
          </div>

          {journalQuotes.length === 0 ? (
            <div className="bento-card p-12 text-center space-y-4">
              <BookMarked className="w-10 h-10 mx-auto text-[var(--accent-gold)] opacity-80" />
              <h3 className="font-serif-editorial text-2xl m-0">
                Nessuna citazione salvata nei Preferiti per ora
              </h3>
              <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto m-0">
                Clicca su <strong>Salva</strong> o scrivi una{' '}
                <strong>Nota personale</strong> sotto qualsiasi citazione per
                ritrovarla qui.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {journalQuotes.map((quote) => (
                <QuoteBentoSheet
                  key={quote.id}
                  quote={quote}
                  record={records[quote.id]}
                  onToggleFavorite={onToggleFavorite}
                  onSaveNote={onSaveNote}
                  onDeleteCustom={onDeleteCustom}
                  onSelectAuthor={onOpenAuthor}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
