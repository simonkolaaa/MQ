import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';

interface CinematicIntroExperienceProps {
  onSelectSection: (
    tab: 'daily' | 'authors' | 'inquiries' | 'journal' | 'collection'
  ) => void;
  onTriggerWarp: () => void;
  onDismissIntro: () => void;
}

/**
 * Intro Cinematografica Dinamica 3D:
 * 1) Preloader rapido "Memorable Quotes · made by Simon Kola"
 * 2) Volo 3D continuo guidato dallo scroll (il titolo si apre in due, le 3 porte fluttuano
 *    nello spazio 3D venendoti incontro in tempo reale ad ogni millimetro di scroll,
 *    e a fine corsa entra automaticamente nel sito con un fascio di luce, senza più riapparire fino al refresh).
 */
export const CinematicIntroExperience: React.FC<
  CinematicIntroExperienceProps
> = ({ onTriggerWarp, onDismissIntro }) => {
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [preloaderDone, setPreloaderDone] = useState<boolean>(false);
  const [scrollT, setScrollT] = useState<number>(0);
  const [exiting, setExiting] = useState<boolean>(false);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const hasExitedRef = useRef<boolean>(false);

  // Fase 1: Preloader fluido (1.1s)
  useEffect(() => {
    let rafId = 0;
    const duration = 1100;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setLoadProgress(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setPreloaderDone(true), 180);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const triggerExit = () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    setExiting(true);
    onTriggerWarp();
    setTimeout(() => {
      onDismissIntro();
    }, 480);
  };

  // Gestione dello scroll continuo dentro il contenitore
  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || hasExitedRef.current) return;
    const maxScroll = Math.max(el.scrollHeight - el.clientHeight, 1);
    const ratio = Math.min(Math.max(el.scrollTop / maxScroll, 0), 1);
    setScrollT(ratio);

    // Arrivato in fondo allo scroll breve (94%), entra automaticamente nel sito!
    if (ratio >= 0.94) {
      triggerExit();
    }
  };

  // Calcoli continui per le trasformazioni cinematografiche 3D
  const titleSplitX = scrollT * 120; // Il titolo si apre a sinistra e destra mentre scorri
  const titleScale = 1 + scrollT * 1.45;
  const titleOpacity = Math.max(0, 1 - scrollT * 2.2);

  // Avanza nel tunnel per le 3 card olografiche in sequenza continua
  const card1T = Math.min(Math.max((scrollT - 0.08) / 0.35, 0), 1);
  const card2T = Math.min(Math.max((scrollT - 0.32) / 0.35, 0), 1);
  const card3T = Math.min(Math.max((scrollT - 0.56) / 0.35, 0), 1);

  return (
    <div
      style={{
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.35)' : 'scale(1)',
        transition:
          'opacity 0.48s cubic-bezier(0.22, 1, 0.36, 1), transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className="fixed inset-0 z-50 bg-[#090a0f] text-[#f4efe4] select-none overflow-hidden"
    >
      {/* =====================================================================
          1. PRELOADER RAPIDO E FLUIDO
      ===================================================================== */}
      {!preloaderDone && (
        <div className="absolute inset-0 z-30 bg-[#090a0f] flex flex-col items-center justify-between p-8 md:p-12">
          <div className="w-full max-w-6xl flex items-center justify-between font-mono-meta text-xs text-[#9c9484]">
            <span className="uppercase tracking-widest">Memorable Quotes</span>
            <span className="uppercase tracking-widest text-[#d4a959] font-semibold">
              made by Simon Kola
            </span>
          </div>

          <div className="flex flex-col items-center text-center space-y-5">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="rgba(212,169,89,0.18)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#d4a959"
                  strokeWidth="2.5"
                  strokeDasharray={276.46}
                  strokeDashoffset={276.46 * (1 - loadProgress / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-serif-editorial italic text-3xl text-[#f4efe4]">
                Μ
              </span>
            </div>

            <h1 className="font-serif-editorial text-5xl sm:text-6xl tracking-tight m-0">
              Memorable Quotes
            </h1>
            <p className="font-mono-meta text-xs uppercase tracking-[0.3em] text-[#d4a959] m-0">
              made by Simon Kola
            </p>
          </div>

          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between font-mono-meta text-xs text-[#9c9484]">
              <span>Apertura Archivio</span>
              <span className="text-[#d4a959] font-semibold">
                {loadProgress}%
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${loadProgress}%` }}
                className="h-full bg-[#d4a959]"
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. VOLO CINEMATOGRAFICO 3D CON SCROLL CONTINUO (BREVISSIMO E DINAMICO)
      ===================================================================== */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        <div className="relative w-full h-[250vh]">
          {/* Camera Sticky Fissa mentre scorri */}
          <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between p-6 md:p-10">
            {/* Anelli Prospettici 3D che zoomano verso di te mentre scorri */}
            <div
              aria-hidden="true"
              style={{
                transform: `translate(-50%, -50%) scale(${
                  0.6 + scrollT * 2.8
                }) rotate(${scrollT * 140}deg)`,
                opacity: 0.25 + scrollT * 0.35,
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 w-[480px] h-[480px] md:w-[680px] md:h-[680px] rounded-full border border-[#d4a959]/40"
            />
            <div
              aria-hidden="true"
              style={{
                transform: `translate(-50%, -50%) scale(${
                  0.3 + scrollT * 3.4
                }) rotate(-${scrollT * 180}deg)`,
                opacity: 0.2 + scrollT * 0.4,
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 w-[320px] h-[320px] md:w-[460px] md:h-[460px] rounded-full border border-dashed border-[#e07652]/50"
            />

            {/* Top Bar con Salta Intro */}
            <div className="relative z-20 max-w-6xl w-full mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono-meta text-xs text-[#d4a959]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Memorable Quotes · made by Simon Kola</span>
              </div>

              <button
                type="button"
                onClick={triggerExit}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono-meta uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer transition-all"
              >
                Salta Intro
                <ArrowRight className="w-3.5 h-3.5 text-[#d4a959]" />
              </button>
            </div>

            {/* SCENA CENTRALE 3D: SI TRASFORMA AD OGNI PIXEL DI SCROLL */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
              {/* QUADRO INIZIALE (0% - 40%): IL TITOLO GIGANTE CHE SI SPACCA IN DUE E TI VIENE INCONTRO */}
              {titleOpacity > 0.01 && (
                <div
                  style={{
                    opacity: titleOpacity,
                    transform: `scale(${titleScale})`,
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                >
                  <span className="font-mono-meta text-xs uppercase tracking-[0.35em] text-[#d4a959] mb-3">
                    Scorri verso il basso per attraversare il portale
                  </span>

                  <div
                    style={{
                      transform: `translate3d(-${titleSplitX}px, 0, 0)`,
                    }}
                    className="font-serif-editorial text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight text-white"
                  >
                    MEMORABLE
                  </div>

                  <div
                    style={{
                      transform: `translate3d(${titleSplitX}px, 0, 0)`,
                    }}
                    className="font-serif-editorial italic text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight text-[#d4a959]"
                  >
                    QUOTES
                  </div>

                  <p className="font-mono-meta text-xs sm:text-sm uppercase tracking-[0.25em] text-white/70 mt-4">
                    made by Simon Kola
                  </p>
                </div>
              )}

              {/* CARTE OLOGRAFICHE CHE VOLANO VERSO DI TE MENTRE SCORRI */}
              {/* Card 1: Oggi (Storia, Bibbia & Corano) */}
              {card1T > 0 && card1T < 1 && (
                <div
                  style={{
                    opacity: Math.sin(card1T * Math.PI),
                    transform: `translate3d(${(0.5 - card1T) * -220}px, ${
                      (0.5 - card1T) * 80
                    }px, 0) scale(${0.65 + card1T * 0.55})`,
                  }}
                  className="absolute max-w-xl w-full mx-4 p-7 md:p-9 rounded-3xl bg-[#14151c]/90 border-2 border-[#d4a959] shadow-2xl backdrop-blur-md space-y-3 pointer-events-none"
                >
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[#d4a959]">
                    01 · Il Trittico del Giorno
                  </span>
                  <h2 className="font-serif-editorial text-4xl md:text-5xl text-white m-0">
                    Storia, Bibbia e Corano sincronizzati con l’ora reale.
                  </h2>
                  <p className="text-sm text-white/75 m-0">
                    Ogni giorno tre voci da leggere e tradurre in tempo reale in
                    Latino, Inglese, Francese e Tedesco.
                  </p>
                </div>
              )}

              {/* Card 2: Mappa del Pensiero & Sistema Solare */}
              {card2T > 0 && card2T < 1 && (
                <div
                  style={{
                    opacity: Math.sin(card2T * Math.PI),
                    transform: `translate3d(${(card2T - 0.5) * 220}px, ${
                      (0.5 - card2T) * -70
                    }px, 0) scale(${0.65 + card2T * 0.55})`,
                  }}
                  className="absolute max-w-xl w-full mx-4 p-7 md:p-9 rounded-3xl bg-[#14151c]/90 border-2 border-[#e07652] shadow-2xl backdrop-blur-md space-y-3 pointer-events-none"
                >
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[#e07652]">
                    02 · Mappa del Pensiero & Sistema Solare
                  </span>
                  <h2 className="font-serif-editorial text-4xl md:text-5xl text-white m-0">
                    Dal Big Bang al 2000 AD: piccoli pianeti in movimento.
                  </h2>
                  <p className="text-sm text-white/75 m-0">
                    Clicca su qualsiasi pianeta tematico (Illuminismo, Verismo,
                    Decadentismo o le 8 Ideologie) per entrarci dentro col
                    fascio veloce.
                  </p>
                </div>
              )}

              {/* Card 3: Perché è successo? & Appunti di Simon */}
              {card3T > 0 && (
                <div
                  style={{
                    opacity: Math.min(1, Math.sin(card3T * Math.PI) * 1.3),
                    transform: `translate3d(0, ${
                      (0.5 - card3T) * 60
                    }px, 0) scale(${0.7 + card3T * 0.5})`,
                  }}
                  className="absolute max-w-xl w-full mx-4 p-7 md:p-9 rounded-3xl bg-[#14151c]/95 border-2 border-[#d4a959] shadow-2xl backdrop-blur-md space-y-4 text-center"
                >
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[#d4a959]">
                    03 · Perché è successo? & «Simon dice...»
                  </span>
                  <h2 className="font-serif-editorial text-4xl md:text-5xl text-white m-0">
                    Paradossi della Storia e il Quaderno degli Appunti di Simon.
                  </h2>
                  <p className="text-sm text-white/75 m-0">
                    Continua a scorrere o clicca qui sotto per entrare subito
                    nell’archivio.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={triggerExit}
                      className="px-6 py-3 rounded-full bg-[#d4a959] text-[#090a0f] font-mono-meta text-xs uppercase tracking-wider font-bold cursor-pointer hover:opacity-90"
                    >
                      Entra nel Sito →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Indicatore di Scroll in Basso */}
            <div className="relative z-20 max-w-xl w-full mx-auto flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 font-mono-meta text-xs text-white/70">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#d4a959]" />
                <span>
                  Scorri per attraversare l’intro ({Math.round(scrollT * 100)}%)
                </span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/15 overflow-hidden">
                <div
                  style={{ width: `${scrollT * 100}%` }}
                  className="h-full bg-[#d4a959] transition-all duration-75"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
