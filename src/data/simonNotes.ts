import { EpochId } from '../core/types';

export type SimonNoteTrack =
  | 'Letteratura: Realismo, Naturalismo & Verismo'
  | 'Letteratura del ’900: Decadentismo, Crisi dell’Io & Ermetismo'
  | 'Storia & Filosofia: Da Marx e Bismarck alle Guerre Mondiali'
  | 'Argomentazione & Attualità';

export interface SimonStudyNote {
  id: string;
  track: SimonNoteTrack;
  title: string;
  periodLabel: string;
  epochId: EpochId;
  simonSays: string;
  keyPoints: {
    heading: string;
    detail: string;
  }[];
  linkedAuthorIds: string[];
}

/**
 * Il Quaderno degli Appunti Scolastici di Simon Kola, raccontati con la voce naturale,
 * ironica e diretta degli appunti di scuola ("Simon dice...").
 */
export const SIMON_STUDY_NOTES: SimonStudyNote[] = [
  // ===========================================================================
  // PERCORSO 1: DAL REALISMO DI FLAUBERT AL NATURALISMO DI ZOLA E VERISMO DI VERGA
  // ===========================================================================
  {
    id: 'simon-realismo-flaubert-zola',
    track: 'Letteratura: Realismo, Naturalismo & Verismo',
    title: 'Dal Romanzo Realista di Flaubert al Naturalismo di Zola (L’Ammazzatoio)',
    periodLabel: '1830 AD – 1880 AD',
    epochId: 'illuminismo_ottocento',
    simonSays:
      'Simon dice: Negli anni ’30 dell’800 la poesia si fa da parte e il romanzo diventa il re (Hegel lo chiamava la "moderna epopea dei borghesi"). Prendi Madame Bovary di Flaubert: Emma cresce in convento leggendo troppi romanzi d’amore, poi nella vita vera si ritrova sposata con un marito insulso che è l’antitesi del principe azzurro, lo tradisce, si riempie di debiti e si suicida. Da lì arrivano i francesi come Zola che dicono: basta inventare, lo scrittore deve fare lo scienziato col camice bianco e raccontare persino i bar dove gli operai si sfondano di alcol ("L’Ammazzatoio").',
    keyPoints: [
      {
        heading: 'Flaubert e il narratore che si nasconde',
        detail:
          'Niente paroloni complicati e niente morale: in Madame Bovary il narratore è impersonale, quasi nascosto dietro le quinte, e usa il discorso indiretto libero per farti entrare direttamente nei pensieri illusi di Emma.',
      },
      {
        heading: 'Positivismo, Darwinismo + Determinismo = Naturalismo',
        detail:
          'L’idea del Positivismo è semplice: applichiamo le regole della matematica e della fisica pure agli esseri umani. Se nasci in una famiglia povera con certe "tare" ereditarie (come nella saga dei Rougon-Macquart di Zola), il tuo destino è quasi già scritto dall’ambiente.',
      },
      {
        heading: 'Zola: lo scrittore-scienziato e "L’Ammazzatoio"',
        detail:
          'Zola usa il linguaggio "volgare" (cioè del volgo, del popolo vero) e racconta il bar parigino L’Ammazzatoio dove i proletari si rovinano la vita, ma lo fa con un obiettivo preciso: fare una fotografia spietata dei quartieri poveri per costringere la politica a cambiare le cose.',
      },
    ],
    linkedAuthorIds: ['flaubert', 'zola', 'verga'],
  },
  {
    id: 'simon-verga-tecniche-malpelo',
    track: 'Letteratura: Realismo, Naturalismo & Verismo',
    title: 'Giovanni Verga: Perché Rosso Malpelo viene trattato come un cane e suo padre fa "la fine del sorcio"',
    periodLabel: '1878 AD – 1880 AD',
    epochId: 'illuminismo_ottocento',
    simonSays:
      'Simon dice: Qui all’interrogazione casca sempre l’asino: Zola e Verga sembrano uguali ma pensano l’opposto. Zola vive a Parigi e crede che denunciando la miseria il mondo migliorerà; Verga vive tra la Sicilia e Milano ed è pessimista nero: il progresso è un fiume in piena che travolge i deboli, e se nasci sfortunato non ti salva nessuno. Per raccontarlo inventa un trucco geniale: la regressione e lo straniamento.',
    keyPoints: [
      {
        heading: 'Meccanismo di Regressione & Eclissi dell’autore',
        detail:
          'Verga non parla mai con la sua voce da signore istruito: si "eclissa" e fa parlare un narratore popolare corale (il chiacchiericcio ignorante dei minatori o del paese). La focalizzazione è tutta interna a quel mondo duro.',
      },
      {
        heading: 'Lo Straniamento in Rosso Malpelo',
        detail:
          'Malpelo è schiacciato dal pregiudizio: ha i capelli rossi, quindi per il paese è "cattivo per forza" e viene paragonato continuamente ai cani. Quando suo padre Mastro Misciu muore sepolto sotto un pilastro di sabbia ("fa la fine del sorcio") e Malpelo scava con le unghie per salvarlo, il narratore del paese dice che lo fa perché è strano: così noi lettori proviamo uno "straniamento" perché capiamo che Malpelo è l’unico umano in una gabbia di bestie.',
      },
      {
        heading: 'L’Ideale dell’Ostrica e la Fiumana del Progresso',
        detail:
          'La regola di sopravvivenza di Verga: finché l’ostrica sta incollata al suo scoglio (la famiglia, il lavoro dei padri) tira a campare; appena si stacca dallo scoglio perché vuole arricchirsi, il pesce grosso (la "fiumana del progresso") se la mangia.',
      },
    ],
    linkedAuthorIds: ['verga', 'zola', 'flaubert'],
  },
  {
    id: 'simon-verga-ciclo-dei-vinti',
    track: 'Letteratura: Realismo, Naturalismo & Verismo',
    title: 'Il Ciclo dei Vinti: I lupini andati a male dei Malavoglia e l’incendio in camera di Mastro-don Gesualdo',
    periodLabel: '1881 AD – 1889 AD',
    epochId: 'illuminismo_ottocento',
    simonSays:
      'Simon dice: Il Ciclo dei Vinti è letteralmente la classifica degli sconfitti della storia: parti dai pescatori (I Malavoglia), sali al muratore diventato ricco (Mastro-don Gesualdo), poi alla nobiltà vanitosa (La Duchessa di Leyra) e ai politici corrotti (L’Onorevole Scipioni). E la morale è che nessuno vince mai davvero.',
    keyPoints: [
      {
        heading: 'I Malavoglia (1881): Il soprannome al contrario e la barca Provvidenza',
        detail:
          'Ad Aci Trezza (Catania) la famiglia Toscano è chiamata "Malavoglia" per antifrasi (cioè l’esatto contrario, perché lavoravano come matti). Padron ’Ntoni compra a credito una partita di lupini dall’usuraio Zio Crocifisso per rimettere in sesto i conti: disastro totale. La barca Provvidenza affonda, muore il figlio Bastianazzo, il nipote Luca muore nella battaglia di Lissa (1866), la nuora Maruzza "la Longa" muore di colera, Lia finisce a prostituirsi in città e il giovane ’Ntoni si dà al contrabbando e all’alcol. Solo il fratello Alessi, sposando Nunziata, ricompra la Casa del Nespolo (ma quando ’Ntoni esce di prigione e rivede la casa, capisce che non può più restare).',
      },
      {
        heading: 'I due Cronotopi: Spazio Interno vs Spazio Esterno',
        detail:
          'Nei Malavoglia spazio e tempo ("cronotopo") sono divisi in due: lo spazio interno del paese e della Casa del Nespolo ha un tempo circolare (le stagioni, i proverbi, la sicurezza); lo spazio esterno fuori dal paese ha il tempo lineare della Storia (la leva militare, le tasse, i treni) che porta solo guai.',
      },
      {
        heading: 'Mastro-don Gesualdo (1889): Bianca Trao, Ninì Rubiera e il cancro',
        detail:
          'Gesualdo è intelligente e si è fatto da solo, ma per salire di classe sacrifica la serva fedele Diodata e sposa Bianca Trao, nobile decaduta senza dote (che all’inizio del romanzo viene pure sorpresa durante un incendio chiusa in camera col cugino Ninì Rubiera!). Quel trattino tra "Mastro" (muratore) e "don" (signore) è la sua condanna: odiato da tutti, vede la figlia Isabella scappare a Palermo e muore solo di cancro allo stomaco, come se tutta la "roba" ingoiata in vita gli avesse mangiato la pancia.',
      },
    ],
    linkedAuthorIds: ['verga'],
  },

  // ===========================================================================
  // PERCORSO 2: DECADENTISMO, SIMBOLISMO, PASCOLI, D'ANNUNZIO, SVEVO, PIRANDELLO, UNGARETTI
  // ===========================================================================
  {
    id: 'simon-decadentismo-baudelaire-coordinate',
    track: 'Letteratura del ’900: Decadentismo, Crisi dell’Io & Ermetismo',
    title: 'Decadentismo, Simbolismo ed Estetismo: Baudelaire perde l’aureola mentre arrivano Freud e Nietzsche',
    periodLabel: '1857 AD – 1905 AD',
    epochId: 'illuminismo_ottocento',
    simonSays:
      'Simon dice: A fine ’800 gli artisti mandano a quel paese la scienza positivista: altro che realtà oggettiva! Tra Einstein con la relatività, Bergson che spiega che il tempo interiore non è uguale per tutti, Freud che tira fuori l’inconscio (Es, Io, Super-Io) e Nietzsche che divide il mondo tra Apollineo e Dionisiaco, il poeta capisce che la natura è una foresta di simboli segreti.',
    keyPoints: [
      {
        heading: 'Baudelaire: Lo Spleen di Parigi e le Corrispondenze (1857)',
        detail:
          'Con I Fiori del Male Baudelaire racconta la "perdita dell’aureola" del poeta nella società di massa e lo "Spleen" (quella noia grigia e malinconica che ti prende il petto). Per lui la natura parla per "corrispondenze" nascoste che il poeta decifra usando l’analogia.',
      },
      {
        heading: 'Estetismo (Il Dandy) vs Fonosimbolismo (Rimbaud)',
        detail:
          'Da un lato nasce l’Estetismo (da "A ritroso" di Huysmans alla figura inglese del Dandy e a D’Annunzio): fare della propria vita un’opera d’arte cercando la bellezza artificiale a tutti i costi. Dall’altro Rimbaud inventa il "poeta veggente" che usa il suono delle parole (fonosimbolismo) per vedere oltre le apparenze.',
      },
      {
        heading: 'Freud (Es, Io, Super-Io) e Nietzsche (Apollineo vs Dionisiaco)',
        detail:
          'Freud divide la testa umana in tre: l’Es (gli impulsi scatenati dei sogni), il Super-Io (il vigile urbano del dovere e della legge) e l’Io (la coscienza schiacciata in mezzo). Nietzsche invece distingue la parte Apollinea (che cerca ordine e misura) da quella Dionisiaca (l’impulso folle del dio del vino che vuole fondersi con la natura).',
      },
    ],
    linkedAuthorIds: ['baudelaire', 'nietzsche', 'freud', 'pascoli', 'dannunzio'],
  },
  {
    id: 'simon-pascoli-nido-fanciullino',
    track: 'Letteratura del ’900: Decadentismo, Crisi dell’Io & Ermetismo',
    title: 'Giovanni Pascoli: Il trauma del 10 agosto, la fissa del Nido con le sorelle e lo slang di Molly',
    periodLabel: '1855 AD – 1912 AD',
    epochId: 'contemporanea',
    simonSays:
      'Simon dice: La vita di Pascoli cambia per sempre il 10 agosto 1867, quando sparano a suo padre Ruggero mentre torna a casa verso Villa Torlonia. Dopo una raffica di lutti e la borsa di studio vinta a Bologna grazie a Carducci, Pascoli va a vivere a Castelvecchio di Barga con le sorelle Ida e Mariù e sviluppa una vera ossessione per il "nido familiare": quando Ida decide di sposarsi, lui la vive letteralmente come un tradimento.',
    keyPoints: [
      {
        heading: 'Il Poeta Fanciullino e il Fonosimbolismo',
        detail:
          'Per Pascoli dentro ognuno di noi c’è un bambino ("il Fanciullino") che guarda le cose come se fosse la prima volta. Per farlo parlare, Pascoli rompe il verso classico e usa il fonosimbolismo: onomatopee (il verso "chiù" ne L’Assiuolo), allitterazioni, sinestesie (mischiare sensi diversi) e parole iper-precise da contadino o botanico.',
      },
      {
        heading: 'Myricae (1900): Le umili tamerici e i cari morti',
        detail:
          'Il titolo viene dalla IV Egloga di Virgilio ("non a tutti piacciono gli arbusti e le umili tamerici"): sono quadri impressionisti fatti di tocchi veloci sulla campagna, dove però dietro ogni siepe o lampo spunta sempre il fantasma dei suoi morti.',
      },
      {
        heading: 'I Poemetti (1904-1909): Da Digitale purpurea allo slang di "Italy"',
        detail:
          'Ispirati alle Georgiche di Virgilio: raccontano le sorelle contadine Rosa e Viola, il fiore proibito dell’amore in Digitale purpurea, l’inquietudine di Nebbia e si chiudono col poemetto sperimentale Italy, dove la piccola Molly nata in America torna in Toscana e parla un mix assurdo di slang inglese e dialetto italiano applicando il fonosimbolismo pure all’inglese!',
      },
    ],
    linkedAuthorIds: ['pascoli', 'baudelaire', 'dannunzio'],
  },
  {
    id: 'simon-dannunzio-estetismo-superuomo',
    track: 'Letteratura del ’900: Decadentismo, Crisi dell’Io & Ermetismo',
    title: 'Gabriele D’Annunzio: Da cognome Rapagnetta alla Capponcina, il Superuomo, Ermione e il Notturno',
    periodLabel: '1863 AD – 1938 AD',
    epochId: 'contemporanea',
    simonSays:
      'Simon dice: D’Annunzio (che all’anagrafe faceva Rapagnetta) è l’opposto esatto di Pascoli: invece di chiudersi nel nido coi ricordi, si fidanza con la più grande attrice dell’epoca (Eleonora Duse), affitta la villa La Capponcina a Firenze riempiendola di oggetti di lusso e prende il Superuomo di Nietzsche trasformandolo in uno che si sente superiore alla massa ("poeta vate").',
    keyPoints: [
      {
        heading: '1. Dall’Estetismo de Il Piacere (1889) alla "Stagione della Bontà"',
        detail:
          'Esordisce con le Novelle della Pescara (simili a Verga ma senza alcuna impersonalità) e col romanzo dell’estetismo Il Piacere. Poi attraversa la "stagione della bontà", dove legge i russi Tolstoj (rinascita spirituale) e Dostoevskij (scissione interiore) cercando un riscatto morale ne L’Innocente (1892) e nel Poema paradisiaco (1893).',
      },
      {
        heading: '2. Le opere del Superuomo, il Panismo e La pioggia nel pineto',
        detail:
          'Con Il trionfo della morte e Le vergini delle rocce lancia il mito del Superuomo e del "panismo" dionisiaco (fondersi totalmente con la natura). Il capolavoro è Alcyone (nelle Laudi): ne La pioggia nel pineto passeggia con Ermione (figlia di Elena) sotto l’acquazzone estivo finché i loro volti diventano foglie e corteccia.',
      },
      {
        heading: '3. L’Impresa di Fiume e il Notturno (1921)',
        detail:
          'Dopo il teatro (La figlia di Iorio) e l’occupazione di Fiume, rimane ferito a un occhio in un incidente aereo: costretto a stare bendato al buio, scrive il Notturno con l’aiuto della figlia Renata su migliaia di striscioline di carta, passando dai paroloni solenni a un frammentismo lirico modernissimo.',
      },
    ],
    linkedAuthorIds: ['dannunzio', 'nietzsche', 'dostoevskij', 'pascoli'],
  },
  {
    id: 'simon-futurismo-svevo-zeno',
    track: 'Letteratura del ’900: Decadentismo, Crisi dell’Io & Ermetismo',
    title: 'Marinetti abolisce gli aggettivi, mentre l’inetto Zeno Cosini sbaglia funerale e frega lo psicoanalista',
    periodLabel: '1909 AD – 1923 AD',
    epochId: 'contemporanea',
    simonSays:
      'Simon dice: Nel 1909 Marinetti pubblica su Le Figaro a Parigi il Manifesto del Futurismo (elenco puntato a tutta velocità: via aggettivi, via avverbi, viva la guerra e i motori). Intanto a Trieste l’impiegato di banca Ettore Schmitz — in arte Italo Svevo — scrive di nascosto, fa amicizia con James Joyce alla scuola d’inglese e scopre Freud perché suo cognato va in terapia: nasce così La coscienza di Zeno.',
    keyPoints: [
      {
        heading: 'La beffa del Dottor S. e il narratore bugiardo',
        detail:
          'Svevo si fida pochissimo della psicoanalisi come cura medica: nel romanzo lo psicoanalista Dottor S. (parodia di Freud) convince il vecchio Zeno Cosini a scrivere la propria autobiografia, e quando Zeno molla la terapia il medico per vendetta pubblica il diario! Il bello è che Zeno è un narratore completamente inattendibile: mente a sé stesso, fuma centinaia di "ultime sigarette" e per un lapsus freudiano (tra Eros e Thanatos) segue persino il corteo funebre sbagliato invece di quello del cognato Guido.',
      },
      {
        heading: 'La figura dell’Inetto e il tempo per temi',
        detail:
          'Dopo Una vita (Alfonso Nitti) e Senilità, Zeno è il re degli "inetti": quello schiacciato dalla società perché privo di volontà ferrea. E il tempo del romanzo non va in ordine cronologico, ma procede in 6 temi per associazioni mentali perché il tempo della coscienza non è mai dritto.',
      },
      {
        heading: 'La "guarigione" da speculatore e la Terra che salta in aria',
        detail:
          'Quando scoppia la Prima Guerra Mondiale Zeno rimane solo a Trieste, si mette a comprare e rivendere qualunque merce con l’inflazione, fa un sacco di soldi e dice: «Sono guarito, sono diventato un lottatore!». Ma è un’ironia feroce che ribalta Darwin e Schopenhauer: Zeno si è solo integrato in una società capitalista malata ("la vita è inquinata alle radici"), dove l’uomo cosiddetto sano finirà per piazzare un ordigno al centro della Terra.',
      },
    ],
    linkedAuthorIds: ['svevo', 'freud', 'marinetti', 'schopenhauer'],
  },
  {
    id: 'simon-pirandello-ungaretti-levi',
    track: 'Letteratura del ’900: Decadentismo, Crisi dell’Io & Ermetismo',
    title: 'Pirandello (la miniera allagata e Mattia Pascal), Ungaretti (il poeta-palombaro) e Primo Levi',
    periodLabel: '1904 AD – 1947 AD',
    epochId: 'contemporanea',
    simonSays:
      'Simon dice: Qui abbiamo il trio che spiega tutto il Novecento italiano: Pirandello che capisce che il confine tra sanità e follia è un filo di capello dopo che gli si allaga la miniera di zolfo del padre; Ungaretti che sul Carso fa il "palombaro" della parola; e Primo Levi che a 24 anni finisce da chimico partigiano nel lager di Auschwitz.',
    keyPoints: [
      {
        heading: 'Pirandello: L’Umorismo (1908) e Il fu Mattia Pascal (1904)',
        detail:
          'Dopo il crollo economico della zolfara (messa su con la dote della moglie, che per lo shock cade nella follia), Pirandello teorizza che noi non abbiamo un’identità sola, ma una frantumazione dell’Io chiusa in mille maschere ("Vita vs Forma"). Ne L’Umorismo separa il "comico" (avvertimento del contrario) dall’"umorismo" (sentimento del contrario). Ne Il fu Mattia Pascal (16 capitoli ad anello che iniziano dalla fine), Mattia scappa dalla vita soffocante di Miragno, sbanca il casinò, legge sul giornale che l’hanno trovato morto e si inventa la nuova vita di Adriano Meis tra Milano e Roma: ma senza documenti non può né sposarsi né denunciare un furto, così finge un secondo suicidio e torna a Miragno dove però sua moglie si è risposata!',
      },
      {
        heading: 'Ungaretti: Il Porto Sepolto, Mattina (1917) e Soldati (1918)',
        detail:
          'Nato ad Alessandria d’Egitto nel 1888, prende la leggenda dell’antico porto sommerso di Alessandria come metafora: il poeta è un palombaro che scende nell’abisso e torna su col segreto della vita (Il Porto Sepolto, 1916; poi Allegria di naufragi, 1919 e L’Allegria, 1942 divisa in Ultime, Il Porto Sepolto, Naufragi, Girovago, Prime). In trincea scrive Mattina («M’illumino / d’immenso», con elisione e allitterazione delle m/n) e in Francia prima della battaglia scrive Soldati («Si sta come / d’autunno / sugli alberi / le foglie»), riprendendo il famoso paragone delle foglie di Omero, Virgilio e Dante nel III canto dell’Inferno.',
      },
      {
        heading: 'Primo Levi: Dalle Leggi Razziali del ’38 a Fossoli e Auschwitz',
        detail:
          'Torinese ed ebreo, riesce a laurearsi in Chimica nel 1941 nonostante le Leggi Razziali del 1938. Sale in montagna coi partigiani, viene catturato dai fascisti a 24 anni e, dichiaratosi ebreo, viene chiuso nel campo di Fossoli e poi caricato sul treno per Auschwitz.',
      },
    ],
    linkedAuthorIds: ['pirandello', 'ungaretti', 'primo-levi', 'dante-alighieri'],
  },

  // ===========================================================================
  // PERCORSO 3: STORIA E FILOSOFIA POLITICA (MARX, BISMARCK, GIOLITTI, GUERRE MONDIALI)
  // ===========================================================================
  {
    id: 'simon-owen-marx-bismarck-comune',
    track: 'Storia & Filosofia: Da Marx e Bismarck alle Guerre Mondiali',
    title: 'Owen vs Marx (il Plusvalore) e come Bismarck fregò Napoleone III col comunicato di Ems',
    periodLabel: '1848 AD – 1871 AD',
    epochId: 'illuminismo_ottocento',
    simonSays:
      'Simon dice: Per ricordarti i 3 Reich basta contare: il 1° era il Sacro Romano Impero, il 2° lo fanno Guglielmo I e Bismarck nel 1871 e il 3° sarà quello di Hitler. Ma la parte più geniale è come nasce il 2° Reich: Bismarck non poteva dichiarare guerra per primo alla Francia, così a Ems modifica un comunicato stampa per far imbestialire i giornali francesi, Napoleone III ci casca in pieno e a Sedan finisce pure prigioniero!',
    keyPoints: [
      {
        heading: 'Socialismo Utopico (Owen) vs Socialismo Materialista (Marx)',
        detail:
          'Owen sperava nella "buona volontà" dei padroni per trattare meglio gli operai; Marx risponde che la storia è tutta storia economica (materialismo storico). I capitalisti hanno i mezzi di produzione, pagano agli operai il minimo per sopravvivere e si intascano il "plusvalore" (il valore in più prodotto dal lavoro operaio). Con le macchine lo sfruttamento e l’alienazione crescono finché gli operai non si uniranno in una rivoluzione internazionale senza confini.',
      },
      {
        heading: 'La Prussia degli Junker, Bismarck e il trucco di Ems (1870)',
        detail:
          'Dopo il fallimento del 1848, la Prussia investe in istruzione ed esercito sotto la vecchia aristocrazia terriera (gli Junker). Nel 1862 il re Guglielmo I nomina cancelliere Bismarck, che governa a colpi di decreti scavalcando il Parlamento: nel 1866 asfalta l’Austria e nel luglio 1870, dopo un incontro cordiale nella località termale di Ems con l’ambasciatore francese, manda ai giornali un dispaccio tagliato apposta per sembrare un’offesa. Napoleone III dichiara guerra ma l’1-2 settembre 1870 viene travolto e catturato a Sedan.',
      },
      {
        heading: 'Assedio di Parigi, nascita del II Reich e la Comune (marzo-maggio 1871)',
        detail:
          'Crolla il Secondo Impero, nasce la 3ª Repubblica francese e i prussiani arrivano a Versailles bombardando Parigi (gennaio 1871) e prendendosi Alsazia e Lorena col Trattato di Francoforte. Quando alle elezioni vincono i monarchici, Parigi si ribella e il 18 marzo 1871 fonda la Comune di Parigi (autogoverno operaio ispirato alla Prima Internazionale), repressa nel sangue nella settimana dal 21 al 28 maggio.',
      },
    ],
    linkedAuthorIds: ['marx'],
  },
  {
    id: 'simon-giolitti-prima-guerra-mondiale',
    track: 'Storia & Filosofia: Da Marx e Bismarck alle Guerre Mondiali',
    title: 'Dalla Legge Coppino e Giolitti fino a Sarajevo, al Patto segreto di Londra e alle carneficine del 1916',
    periodLabel: '1877 AD – 1918 AD',
    epochId: 'contemporanea',
    simonSays:
      'Simon dice: In Italia dopo la Sinistra Storica (Legge Coppino del 1877 che porta l’obbligo scolastico a 9 anni) e il governo repressivo di Crispi, sale al trono Vittorio Emanuele III e arriva Giovanni Giolitti (1903-1914). Giolitti aveva capito benissimo che l’esercito italiano era arretrato e che conveniva restare neutrali nella Prima Guerra Mondiale, ma Salandra, il Re, D’Annunzio e Mussolini firmano di nascosto il Patto di Londra e il 24 maggio 1915 ci buttano in trincea con Cadorna.',
    keyPoints: [
      {
        heading: 'L’Età Giolittiana (1903-1914): INA, scuola statale e voto a 30 anni',
        detail:
          'Giolitti fa una politica centrista intelligente: lascia che gli scioperi si sfoghino senza mandare l’esercito, crea l’INA (Istituto Nazionale Assicurazioni), fissa l’età minima lavorativa a 12 anni, passa le scuole elementari dai Comuni allo Stato con la Legge Daneo-Credaro (1911) e nel 1912 allarga il voto a tutti i maschi di 30 anni (o 21 se avevano fatto il militare).',
      },
      {
        heading: 'I Balcani, Sarajevo (28 giugno 1914) e l’effetto domino',
        detail:
          'Dal Congresso di Berlino di Bismarck (1878) i Balcani sono una polveriera (l’Austria annette la Bosnia nel 1908 facendo infuriare la Serbia; l’Italia attacca l’Impero Ottomano in Libia nel 1911-12). Quando il 28 giugno 1914 a Sarajevo viene ucciso l’arciduca Francesco Ferdinando, scattano i due blocchi: Triplice Alleanza (1882, difensiva) contro Triplice Intesa (1907, Francia-Russia-Inghilterra). I belgi frenano i tedeschi permettendo ai francesi di salvarsi sulla Marna (settembre 1914), mentre a est i russi vengono battuti a Tannenberg e ai Laghi Masuri (e persino il Giappone entra con l’Intesa per prendersi le colonie tedesche in Cina!).',
      },
      {
        heading: 'Dal Patto di Londra (26 aprile 1915) alla Guerra Totale del 1916',
        detail:
          'Con lo Statuto Albertino il governo poteva firmare patti segreti senza dirlo al Parlamento: Salandra promette l’entrata in guerra in cambio delle terre irredente (Trento, Istria, Dalmazia) e il 24 maggio 1915 iniziano gli assalti frontali di Cadorna. Il 1916 è l’anno delle carneficine totali: fallita la spedizione inglese dei Dardanelli, si combatte a Verdun, sulla Somme e nella gigantesca battaglia navale dello Jutland.',
      },
    ],
    linkedAuthorIds: ['dannunzio', 'ungaretti'],
  },
  {
    id: 'simon-fascismo-weimar-seconda-guerra',
    track: 'Storia & Filosofia: Da Marx e Bismarck alle Guerre Mondiali',
    title: 'Biennio Rosso, Marcia su Roma, i 4 miliardi di marchi per 1 dollaro a Weimar e la Seconda Guerra Mondiale',
    periodLabel: '1919 AD – 1942 AD',
    epochId: 'contemporanea',
    simonSays:
      'Simon dice: Pensa alla Germania dei primi anni ’20: l’inflazione arriva al record assurdo di 4 miliardi di marchi per comprare 1 solo dollaro! È lì che Hitler (dopo il golpe fallito in birreria a Monaco nel 1923 dove in prigione scrive il Mein Kampf) capisce come cavalcare la rabbia della gente, mentre in Italia Mussolini passa dai Fasci del 1919 alla Marcia su Roma, alla Legge Acerbo e al discorso del 3 gennaio 1925 dopo l’omicidio Matteotti.',
    keyPoints: [
      {
        heading: 'Dal Biennio Rosso (1919-20) allo Stato Fascista',
        detail:
          'Nel 1919 si vota col proporzionale e le fabbriche di Torino vengono occupate sul modello della Russia (dove c’era la Duma e poi la rivoluzione del ’17). Il 23 marzo 1919 Mussolini fonda i Fasci di combattimento (usando la parola "fascio" della sinistra unita al fascio littorio romano), organizza i Ras provinciali e il PNF e nel 1922 fa la Marcia su Roma. Con la Legge Acerbo (basta il 25% per prendersi tutto il Parlamento) e il rapimento/omicidio di Giacomo Matteotti, il 3 gennaio 1925 Mussolini si prende la responsabilità politica e chiude la democrazia: patto di Palazzo Chigi sulle corporazioni, Riforma Gentile (religione alle elementari e primato del liceo classico), polizia segreta OVRA, Manifesto antifascista di Benedetto Croce (1925), invasione dell’Etiopia (3 ottobre 1935) e Leggi Razziali (1938).',
      },
      {
        heading: 'Repubblica di Weimar: Dai Freikorps al rogo del Reichstag (1933)',
        detail:
          'Nel gennaio 1919 nella fragile Repubblica di Weimar (guidata dalla SPD di Ebert) i paramilitari di destra (Freikorps) uccidono Rosa Luxemburg e Karl Liebknecht della Lega di Spartaco. Dopo il tentato golpe di Kapp (1920), la nascita del partito nazista NSDAP con le squadre d’assalto SA di Röhm e l’iperinflazione, nel 1925 col Trattato di Locarno sembra tornare la pace (la Germania entra nella Società delle Nazioni nel 1926). Ma la crisi del ’29 fa esplodere Hitler: cancelliere nel 1933, incendio del Reichstag (27 febbraio 1933), teoria dello "spazio vitale", Leggi di Norimberga (15 settembre 1935), Anschluss dell’Austria (marzo 1938) e Notte dei Cristalli (9-10 novembre 1938).',
      },
      {
        heading: 'Dalla Polonia (1° settembre 1939) a Pearl Harbor e Stalingrado (1942)',
        detail:
          'Firmato il Patto d’Acciaio (maggio 1939, anche se Mussolini aveva chiesto di aspettare 2 anni!), il 1° settembre 1939 la Wehrmacht invade la Polonia. Mentre l’URSS fatica nella guerra contro la Finlandia, Hitler prende Danimarca e Norvegia e il 10 maggio 1940 travolge la Francia passando da Belgio e Olanda (nord occupato, sud governo di Vichy), mentre l’Inghilterra resiste con Churchill. Il 10 giugno 1940 Mussolini entra in guerra ("Vincere e vinceremo!") fallendo in Grecia e in Egitto. Nel giugno 1941 Hitler lancia l’Operazione Barbarossa contro l’URSS ma si blocca davanti alla linea Leningrado-Mosca-Stalingrado; il 7 dicembre 1941 il Giappone attacca Pearl Harbor facendo entrare gli USA, e nell’inverno 1942 a Stalingrado inizia la disfatta dell’Asse.',
      },
    ],
    linkedAuthorIds: ['gramsci', 'primo-levi', 'arendt'],
  },

  // ===========================================================================
  // PERCORSO 4: LABORATORIO DI ARGOMENTAZIONE & ATTUALITÀ
  // ===========================================================================
  {
    id: 'simon-argomentazione-linguaggio-trap',
    track: 'Argomentazione & Attualità',
    title: 'Schema per il Tema Argomentativo: La musica Trap influenza davvero in modo negativo chi l’ascolta?',
    periodLabel: 'Metodo & Attualità',
    epochId: 'contemporanea',
    simonSays:
      'Simon dice: Quando devi scrivere un tema argomentativo senza girare a vuoto, tieni a mente la scaletta fissa: 1) Introduzione che aggancia subito chi legge; 2) Tesi chiara appoggiata al testo di partenza e agli esempi; 3) Confutazione dell’opinione opposta usando bene i connettivi logici; 4) Conclusione che lascia il segno. Noi l’abbiamo applicata al caso della Trap tra Vera Gheno e Gino Cecchettin.',
    keyPoints: [
      {
        heading: 'Il confronto: Gino Cecchettin vs Vera Gheno',
        detail:
          'Da una parte Gino Cecchettin lancia un appello diretto ai rapper chiedendo di riflettere sul modo in cui parlano delle donne nelle canzoni (e ad Arsego alcuni ragazzi decidono persino di modificare dei testi); dall’altra la linguista Vera Gheno (legata al Manifesto della comunicazione non ostile) racconta di aver sempre ascoltato musica dura e giocato ai videogiochi di ruolo senza per questo diventare violenta: per lei la Trap è una forma d’arte che fotografa un disagio, anche se personalmente non le piace.',
      },
      {
        heading: 'Come chiudere il discorso in modo intelligente',
        detail:
          'Proprio come facevano Zola con L’Ammazzatoio o Baudelaire coi Fiori del Male, raccontare il brutto o la rabbia in una canzone non crea automaticamente il male, ma senza spirito critico e educazione emotiva le parole possono trasformarsi in modelli tossici.',
      },
    ],
    linkedAuthorIds: ['baudelaire', 'pasolini', 'zola'],
  },
];
