export interface IdeologyItem {
  id: string;
  name: string;
  wikiTitle: string;
  periodLabel: string;
  colorAccent: string;
  /** Spiegazione immediata con la metafora della pizzeria / condominio / due mucche */
  funnyMetaphor: string;
  /** Spiegazione naturale, chiara e diretta ("in parole povere") */
  naturalExplanation: string;
  /** Il punto debole / paradosso storico raccontato con ironia */
  satiricalPlotTwist: string;
  /** Pensatori o protagonisti collegati nel sito */
  keyFigures: string[];
  linkedAuthorIds: string[];
}

/**
 * Cartella a parte: Le Grandi Ideologie spiegate in modo naturale, simpatico e immediato,
 * con possibilità di approfondimento storico dinamico.
 */
export const IDEOLOGIES_CATALOG: IdeologyItem[] = [
  {
    id: 'socialismo',
    name: 'Socialismo',
    wikiTitle: 'Socialismo',
    periodLabel: 'Ottocento – Oggi',
    colorAccent: '#e07652',
    funnyMetaphor:
      'Metafora della Pizzeria: I pizzaioli che impastano e sudano davanti al forno a legna dicono: «Scusate, ma perché il proprietario che sta seduto alla cassa si tiene quasi tutto l’incasso? Dividiamo i guadagni e gestiamo il forno insieme, o almeno mettiamo turni umani e ferie pagate».',
    naturalExplanation:
      'Nasce nell’800 quando gli operai lavoravano 14 ore al giorno in fabbrica per due spiccioli. All’inizio c’è il "socialismo utopico" (come quello di Owen nei miei appunti), che sperava nella bontà di cuore dei padroni; poi arriva il socialismo vero e proprio che dice: la ricchezza la produce chi lavora, quindi lo Stato o i lavoratori devono controllare i servizi fondamentali (scuola, sanità, trasporti) per non lasciare indietro i più deboli.',
    satiricalPlotTwist:
      'Il paradosso: i socialisti moderati e i comunisti rivoluzionari hanno passato metà del Novecento a litigare più tra di loro al bar del sindacato che contro i capitalisti.',
    keyFigures: ['Robert Owen', 'Karl Marx', 'Jean Jaurès', 'Filippo Turati'],
    linkedAuthorIds: ['marx', 'gramsci'],
  },
  {
    id: 'comunismo',
    name: 'Comunismo',
    wikiTitle: 'Comunismo',
    periodLabel: '1848 AD – 1991 AD',
    colorAccent: '#c93b2b',
    funnyMetaphor:
      'Metafora delle Due Mucche: Hai due mucche. Lo Stato te le prende entrambe, le mette nella stalla collettiva del popolo e ti passa un bicchiere di latte deciso dal piano quinquennale (sempre che il modulo burocratico sia timbrato giusto).',
    naturalExplanation:
      'È la versione radicale teorizzata da Marx ed Engels: siccome nella storia chi ha i mezzi di produzione (fabbriche, terre, macchinari) ha sempre schiacciato gli operai pagandoli meno di quanto producono (il famoso "plusvalore"), non basta fare qualche riforma. Bisogna abolire del tutto la proprietà privata delle fabbriche, rovesciare i capitalisti, passare per la "dittatura del proletariato" e arrivare a una società senza classi e senza confini nazionali.',
    satiricalPlotTwist:
      'Il paradosso: Marx aveva progettato un sistema pensato per i paesi industrializzati e senza Stato né confini; nella realtà è stato applicato in paesi contadini creando gli Stati più burocratici e blindati del pianeta.',
    keyFigures: ['Karl Marx', 'Friedrich Engels', 'Lenin', 'Antonio Gramsci'],
    linkedAuthorIds: ['marx', 'gramsci'],
  },
  {
    id: 'capitalismo',
    name: 'Capitalismo',
    wikiTitle: 'Capitalismo',
    periodLabel: 'Rivoluzione Industriale – Oggi',
    colorAccent: '#d4a959',
    funnyMetaphor:
      'Metafora delle Due Mucche: Hai due mucche. Ne vendi una, col ricavato compri un toro, fai un mutuo in banca, apri una multinazionale del latte quotata a Wall Street e convinci i consumatori che senza il tuo cappuccino da 7 euro non sono nessuno.',
    naturalExplanation:
      'Si basa su tre idee semplici: proprietà privata, libero mercato (la legge della domanda e dell’offerta) e ricerca del profitto. Chi ha i capitali investe in un’impresa, assume lavoratori, compete con le altre aziende per fare il prodotto migliore al prezzo più basso e tiene per sé il guadagno. È il motore che ha creato una ricchezza e un’innovazione tecnologica mai viste nella storia.',
    satiricalPlotTwist:
      'Il paradosso: funziona alla grande finché la competizione è vera, ma come notava già Marx (e come si è visto nel 1929 e nel 2008), lasciato senza regole tende a creare monopoli, disuguaglianze enormi e bolle finanziarie che poi tocca allo Stato salvare.',
    keyFigures: ['Adam Smith', 'Milton Friedman', 'Henry Ford'],
    linkedAuthorIds: ['marx', 'svevo', 'verga'],
  },
  {
    id: 'liberalismo',
    name: 'Liberalismo',
    wikiTitle: 'Liberalismo',
    periodLabel: 'Seicento / Illuminismo – Oggi',
    colorAccent: '#4a90d9',
    funnyMetaphor:
      'Metafora del Condominio: Ognuno nel proprio appartamento è sacro e inviolabile: può pensare, pregare, stampare giornali e fare affari come vuole, e l’amministratore di condominio (lo Stato) ha un solo compito: fare l’arbitro e non mettere mai il naso in camera tua.',
    naturalExplanation:
      'Nato tra il ’600 e l’Illuminismo contro i re assoluti che decidevano tutto, il liberalismo mette al primo posto i diritti dell’individuo: libertà di parola, di stampa, di religione, proprietà privata e divisione dei poteri (chi fa le leggi non deve essere lo stesso che comanda i giudici o la polizia). In Italia nell’inizio ’900 lo incarna Giovanni Giolitti.',
    satiricalPlotTwist:
      'Il paradosso: proclama che "siamo tutti liberi di correre la gara della vita", ma se uno parte con la Ferrari ereditata dal nonno e l’altro parte a piedi scalzi, dire che la pista è uguale per tutti suona un filo ironico.',
    keyFigures: ['John Locke', 'Voltaire', 'Montesquieu', 'Giovanni Giolitti'],
    linkedAuthorIds: ['voltaire', 'kant', 'spinoza'],
  },
  {
    id: 'anarchismo',
    name: 'Anarchismo',
    wikiTitle: 'Anarchismo',
    periodLabel: 'Ottocento – Novecento',
    colorAccent: '#b052c0',
    funnyMetaphor:
      'Metafora della Scuola: Non vuol dire "spacchiamo i banchi", ma: «Non abbiamo bisogno né del preside né dei professori né delle note sul registro: ci mettiamo d’accordo noi studenti da soli su cosa studiare e chi pulisce l’aula».',
    naturalExplanation:
      'Dal greco "an-archia" (senza capo/comando). Gli anarchici sostengono che qualsiasi potere imposto dall’alto — che sia lo Stato capitalista, il Re, la Chiesa o persino la "dittatura del proletariato" di Marx — finisce sempre per opprimere l’uomo. L’obiettivo è una società fatta di libere comunità che cooperano volontariamente senza polizia, né confini, né padroni.',
    satiricalPlotTwist:
      'Il paradosso: funziona benissimo finché nella riunione di condominio autogestita sono tutti gentili e ragionevoli; appena arriva il primo vicino che suona la batteria alle tre di notte, tutti rimpiangono un regolamento.',
    keyFigures: ['Michail Bakunin', 'Pëtr Kropotkin', 'Errico Malatesta'],
    linkedAuthorIds: ['marx', 'rousseau'],
  },
  {
    id: 'conservatorismo',
    name: 'Conservatorismo',
    wikiTitle: 'Conservatorismo',
    periodLabel: 'Dal 1789 AD – Oggi',
    colorAccent: '#5a7d6a',
    funnyMetaphor:
      'Metafora del Ponte Antico: Prima di buttare giù un vecchio ponte di pietra perché ti sembra fuori moda, chiediti come mai sta in piedi da cinquecento anni mentre i ponti progettati ieri dai rivoluzionari crollano alla prima piena.',
    naturalExplanation:
      'Nasce come reazione agli eccessi della Rivoluzione Francese: i conservatori diffidano delle utopie che vogliono azzerare il passato e rifare l’uomo da capo. Puntano a difendere le istituzioni collaudate dal tempo: la famiglia tradizionale, la religione, l’ordine pubblico, la proprietà e i cambiamenti molto graduali.',
    satiricalPlotTwist:
      'Il paradosso: come diceva il Gattopardo in Sicilia, spesso i conservatori più furbi accettano che «tutto cambi affinché tutto resti esattamente com’è».',
    keyFigures: ['Edmund Burke', 'Klemens von Metternich', 'Otto von Bismarck'],
    linkedAuthorIds: ['verga', 'dostoevskij'],
  },
  {
    id: 'nazionalismo',
    name: 'Nazionalismo',
    wikiTitle: 'Nazionalismo',
    periodLabel: 'Ottocento – Novecento',
    colorAccent: '#c47f2a',
    funnyMetaphor:
      'Metafora dello Stadio: Voler bene alla propria squadra del cuore (il patriottismo) è bellissimo; convincersi che la propria squadra abbia il diritto divino di invadere il campo delle altre e prendersi la coppa a bastonate è il nazionalismo.',
    naturalExplanation:
      'Nell’inizio ’800 l’idea di Nazione nasce come desiderio nobile dei popoli di liberarsi dagli imperi stranieri condividendo lingua, storia e cultura. Ma a fine ’800 si trasforma in nazionalismo aggressivo e imperialista: la propria nazione viene vista come un organismo superiore che deve espandersi a spese dei vicini (la miccia che farà esplodere Sarajevo nel 1914).',
    satiricalPlotTwist:
      'Il paradosso: ogni nazionalismo è convinto di essere "unico e speciale", usando però esattamente gli stessi identici slogan, bandiere e marce militari di tutti gli altri nazionalismi.',
    keyFigures: ['Otto von Bismarck', 'Gabriele D’Annunzio'],
    linkedAuthorIds: ['dannunzio', 'pascoli'],
  },
  {
    id: 'fascismo',
    name: 'Fascismo',
    wikiTitle: 'Fascismo',
    periodLabel: '1919 AD – 1945 AD',
    colorAccent: '#8c4b3e',
    funnyMetaphor:
      'Metafora del Fascio Littorio: Un bastoncino da solo si spezza, legati insieme in un fascio diventano un randello; il problema è che quel randello finisce sulla testa di chiunque non sia d’accordo col capo.',
    naturalExplanation:
      'Come scritto nei miei appunti: nasce il 23 marzo 1919 coi Fasci di combattimento di Mussolini (usando all’inizio persino una parola, "fascio", presa dal mondo sindacale, unita al fascio littorio romano). Sfrutta la paura della borghesia durante il Biennio Rosso, usa le squadre d’azione dei Ras provinciali, prende il potere con la Marcia su Roma (1922) e dopo la Legge Acerbo e il delitto Matteotti (1924-1925) cancella i partiti, crea il corporativismo, la polizia segreta (OVRA), il culto del Duce e porta l’Italia alle leggi razziali e alla Seconda Guerra Mondiale.',
    satiricalPlotTwist:
      'Il paradosso: prometteva un’Italia guerriera invincibile da "otto milioni di baionette", ma il 10 giugno 1940 mandò i soldati in Grecia e in Russia con gli scarponi di cartone.',
    keyFigures: ['Benito Mussolini', 'Giovanni Gentile'],
    linkedAuthorIds: ['gramsci', 'dannunzio', 'primo-levi', 'arendt'],
  },
];
