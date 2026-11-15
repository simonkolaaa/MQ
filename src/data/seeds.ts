import {
  AuthorProfession,
  EpochId,
  EpochInfo,
  InquiryCategory,
  SacredTradition,
  SubfolderMovement,
} from '../core/types';

export const EPOCHS: EpochInfo[] = [
  {
    id: 'origini_cosmo',
    name: '1. Dal Big Bang all’Alba delle Civiltà',
    shortName: 'Big Bang – 700 a.C.',
    period: '13,8 mld a.C. – VIII sec. a.C.',
    description:
      'Dall’esplosione primordiale dell’atomo cosmico ai primi poemi epici con cui l’uomo ha provato a spiegarsi il mondo prima della filosofia.',
  },
  {
    id: 'antichita',
    name: '2. Antichità Classica (Grecia e Roma)',
    shortName: '600 a.C. – 200 AD',
    period: 'VI sec. a.C. – II sec. AD',
    description:
      'Quando ad Atene e a Roma si inventarono la democrazia, il teatro tragico e l’arte di restare calmi mentre l’Impero brucia.',
  },
  {
    id: 'tardo_antico_medioevo',
    name: '3. Tardo Antico e Medioevo',
    shortName: '300 AD – 1400 AD',
    period: '300 AD – 1400 AD',
    description:
      'Dal crollo di Roma alle cattedrali gotiche: filosofi in prigione, cavalieri innamorati del filtro sbagliato e Dante che spedisce i nemici all’Inferno.',
  },
  {
    id: 'moderna',
    name: '4. Rinascimento e Rivoluzione Scientifica',
    shortName: '1400 AD – 1700 AD',
    period: '1400 AD – 1700 AD',
    description:
      'Artisti universali, principi senza scrupoli e filosofi che scoprono che la Terra non è il centro del condominio cosmico.',
  },
  {
    id: 'illuminismo_ottocento',
    name: '5. Illuminismo, Romanticismo e Ottocento',
    shortName: '1700 AD – 1900 AD',
    period: '1700 AD – 1900 AD',
    description:
      'Dalla Dea Ragione di Voltaire e Kant fino ai grandi "guastafeste" dell’Ottocento: Schopenhauer, Leopardi, Dostoevskij e il martello di Nietzsche.',
  },
  {
    id: 'contemporanea',
    name: '6. Il Novecento fino al 2000 AD',
    shortName: '1900 AD – 2000 AD',
    period: '1900 AD – 2000 AD',
    description:
      'Il secolo più veloce e feroce della storia: totalitarismi, fisica quantistica, insonnia esistenzialista e grandi intrighi della Repubblica.',
  },
  {
    id: 'biblico',
    name: 'Tradizione Biblica e Coranica',
    shortName: 'Bibbia & Corano',
    period: 'X sec. a.C. – VII sec. AD',
    description:
      'Versetti e passi sapienziali della Bibbia e del Corano.',
  },
];

/**
 * Sottocartelle ordinate cronologicamente dal Big Bang al 2000 AD:
 * ogni sottocartella raggruppa gli autori della corrente e mostra come sono collegati tra loro.
 */
export const SUBFOLDER_MOVEMENTS: SubfolderMovement[] = [
  {
    id: 'big-bang-mito-logos',
    epochId: 'origini_cosmo',
    name: 'Dal Big Bang al Mito: L’Origine del Cosmo e della Parola',
    yearsLabel: '13,8 mld a.C. – 750 a.C.',
    wittyDescription:
      'Prima che arrivassero i filosofi col libretto degli appunti, l’universo è esploso dal nulla, le stelle hanno cucinato il carbonio di cui siamo fatti e i poeti greci hanno dato la colpa di tutto ai capricci degli dèi dell’Olimpo.',
    connectionMapLabel:
      'Dal caos cosmico di Esiodo e Omero nasce la domanda su cui si accapiglieranno i Presocratici: di che pasta è fatto il mondo?',
  },
  {
    id: 'presocratici-scuola-ionica',
    epochId: 'antichita',
    name: 'I Presocratici & Il Divenire: I Primi "Fisici" Ribelli',
    yearsLabel: '600 a.C. – 470 a.C.',
    wittyDescription:
      'I primi esseri umani a svegliarsi una mattina nella Ionia dicendo: «E se il fulmine non fosse Zeus arrabbiato, ma una legge della natura?».',
    connectionMapLabel:
      'Eraclito ("Tutto scorre") accende la miccia dialettica che ispirerà sia Platone nell’antichità sia Hegel e Nietzsche due millenni dopo.',
  },
  {
    id: 'atene-classica-tragedia',
    epochId: 'antichita',
    name: 'L’Età d’Oro di Atene: Socrate, la Scuola Filosofica e la Tragedia',
    yearsLabel: '496 a.C. – 322 a.C.',
    wittyDescription:
      'La più incredibile catena di montaggio del pensiero occidentale: Socrate fa domande scomode gratis per strada, il suo allievo Platone fonda l’Accademia e l’allievo di Platone, Aristotele, cataloga praticamente tutto lo scibile umano.',
    connectionMapLabel:
      'Catena diretta: Sofocle mette in scena il destino tragico → Socrate interroga Atene → Platone trascrive il maestro → Aristotele fonda la logica scientifica.',
  },
  {
    id: 'cinismo-stoicismo-roma',
    epochId: 'antichita',
    name: 'Cinismo & Stoicismo Imperiale: Dalla Botte al Trono di Roma',
    yearsLabel: '400 a.C. – 180 AD',
    wittyDescription:
      'Un corto circuito sociale meraviglioso: una filosofia nata con Diogene che vive in una botte senza un soldo finisce per diventare la bussola morale di uno schiavo liberato (Epitteto), di un senatore miliardario (Seneca) e dell’uomo più potente del pianeta (l’imperatore Marco Aurelio).',
    connectionMapLabel:
      'Diogene ispira l’autarchia stoica → Seneca la porta nella corte di Nerone → il manuale dello schiavo Epitteto diventa il libro sul comodino dell’imperatore Marco Aurelio.',
  },
  {
    id: 'tardo-antico-patristica',
    epochId: 'tardo_antico_medioevo',
    name: 'Il Tramonto di Roma: Tra Alessandria, Ippona e Pavia',
    yearsLabel: '350 AD – 525 AD',
    wittyDescription:
      'Mentre l’Impero Romano cade a pezzi come un soffitto infiltrato d’acqua, tre menti giganti cercano di salvare la cultura classica traghettandola nel futuro.',
    connectionMapLabel:
      'Ipazia difende la matematica e il neoplatonismo → Agostino inventa l’autobiografia interiore moderna → Boezio scrive in cella il testo che leggerà Dante.',
  },
  {
    id: 'amor-cortese-stilnovo',
    epochId: 'tardo_antico_medioevo',
    name: 'L’Amor Cortese, i Cavalieri e la Rivoluzione di Dante',
    yearsLabel: '1150 AD – 1321 AD',
    wittyDescription:
      'Il Medioevo non era affatto solo buio e peste: qui si inventa l’amore romantico (quello che fa soffrire benissimo) e nasce la lingua italiana grazie a un esiliato fiorentino dal carattere decisamente vendicativo.',
    connectionMapLabel:
      'La leggenda celtica di Tristano e Isotta incanta le corti europee → Dante Alighieri mette Tristano nel V canto dell’Inferno (con Paolo e Francesca) e si fa guidare da Virgilio e Boezio.',
  },
  {
    id: 'umanesimo-rinascimento',
    epochId: 'moderna',
    name: 'Rinascimento & Realismo Politico: Geni, Pennelli e Pugnali',
    yearsLabel: '1452 AD – 1564 AD',
    wittyDescription:
      'Nella stessa Firenze in cui Leonardo progetta macchine volanti e Michelangelo litiga col Papa dipingendo la Sistina, Machiavelli spiega ai governanti che la politica non si fa con le buone intenzioni.',
    connectionMapLabel:
      'Leonardo e Michelangelo rivaleggiano a Firenze → Machiavelli osserva dal vivo Cesare Borgia e i Medici fondando la scienza politica moderna.',
  },
  {
    id: 'rivoluzione-scientifica-razionalismo',
    epochId: 'moderna',
    name: 'Cosmo Infinito, Dubbio & Razionalismo del ’600',
    yearsLabel: '1564 AD – 1677 AD',
    wittyDescription:
      'Il secolo in cui l’uomo scopre due cose traumatiche: che la Terra è un granello di polvere lanciato nell’infinito e che anche il cuore umano è un abisso pieno di contraddizioni.',
    connectionMapLabel:
      'Giordano Bruno spalanca l’universo infinito → Shakespeare porta il dubbio moderno a teatro ("Essere o non essere") → Spinoza identifica Dio con la Natura mentre Pascal calcola le probabilità dell’infinito.',
  },
  {
    id: 'illuminismo-criticismo',
    epochId: 'illuminismo_ottocento',
    name: 'L’Illuminismo & L’Età della Ragione (Voltaire, Rousseau, Kant)',
    yearsLabel: '1715 AD – 1804 AD',
    wittyDescription:
      'Il secolo dei Lumi accende la luce nella stanza buia dei dogmi: Voltaire demolisce i fanatismi a colpi di sarcasmo, Rousseau dà fuoco alle parrucche della nobiltà e Immanuel Kant — così metodico che gli abitanti di Königsberg regolavano l’orologio sulla sua passeggiata delle 15:30 — ridisegna per sempre i confini della ragione umana.',
    connectionMapLabel:
      'Collegamento chiave: il sarcasmo di Voltaire contro il potere assoluto + la ribellione di Rousseau ("l’uomo nasce libero e ovunque è in catene") convergono in Immanuel Kant, che sintetizza l’Illuminismo nel motto «Sapere aude!» (abbi il coraggio di usare la tua testa).',
  },
  {
    id: 'romanticismo-pessimismo-esistenza',
    epochId: 'illuminismo_ottocento',
    name: 'Il Rovescio dei Lumi: Pessimismo, Noia Cosmica & Abisso Interiore',
    yearsLabel: '1798 AD – 1881 AD',
    wittyDescription:
      'Dopo l’entusiasmo illuminista, arriva il conto del ristorante: Schopenhauer e Leopardi smontano l’illusione che la Natura voglia il nostro bene, mentre Kierkegaard e Dostoevskij scoprono la vertigine della libertà.',
    connectionMapLabel:
      'Schopenhauer (che teneva lezioni alla stessa ora di Hegel trovando l’aula vuota) e Leopardi dialogano a distanza sul dolore cosmico → Kierkegaard e Dostoevskij preparano il terreno a Nietzsche e all’esistenzialismo.',
  },
  {
    id: 'nietzsche-martello-filosofia',
    epochId: 'illuminismo_ottocento',
    name: 'Il Martello della Filosofia: Friedrich Nietzsche e la Crisi d’Occidente',
    yearsLabel: '1844 AD – 1900 AD',
    wittyDescription:
      'Alla vigilia del Novecento, un filologo solitario con dei baffi monumentali passeggia tra le Alpi svizzere e la Liguria prendendo a martellate duemila anni di morale occidentale, annunciando che "Dio è morto" e che dobbiamo diventare degni di questa vertigine.',
    connectionMapLabel:
      'Nietzsche parte da Schopenhauer e dalla tragedia greca di Sofocle, definisce Dostoevskij "l’unico psicologo da cui ho avuto qualcosa da imparare" e influenza tutto il ’900 (da Cioran a Foucault).',
  },
  {
    id: 'novecento-totalitarismi-testimoni',
    epochId: 'contemporanea',
    name: 'Coscienza Civile & Testimoni davanti ai Totalitarismi',
    yearsLabel: '1900 AD – 1987 AD',
    wittyDescription:
      'Quando il Novecento ha trasformato la burocrazia e la tecnica in macchine di oppressione, queste menti hanno rifiutato di voltarsi dall’altra parte, pagando in prima persona.',
    connectionMapLabel:
      'Gramsci scrive nei quaderni del carcere → Simone Weil entra in fabbrica per capire gli operai → Primo Levi testimonia Auschwitz → Hannah Arendt svela la "banalità del male".',
  },
  {
    id: 'novecento-satira-potere-repubblica',
    epochId: 'contemporanea',
    name: 'Aforismi, Corsari e Grandi Intrighi di Fine Millennio',
    yearsLabel: '1945 AD – 2000 AD',
    wittyDescription:
      'Dalle mansarde parigine in cui Cioran trasforma l’insonnia in battute fulminanti fino ai palazzi romani tra Anni di Piombo, lotta alla mafia e il crollo fragoroso della Prima Repubblica sotto una pioggia di monetine.',
    connectionMapLabel:
      'Cioran raccoglie l’eredità aforistica di Nietzsche → Pasolini profetizza l’Italia del consumismo e dei misteri → Moro, Falcone e Craxi segnano i tre grandi spartiacque politici italiani prima del 2000.',
  },
];

export interface AuthorSeed {
  id: string;
  name: string;
  wikiTitle: string;
  wikiquoteTitle: string;
  nationality: string;
  profession: AuthorProfession;
  epochId: EpochId;
  subfolderId: string;
  yearBadge: string;
  lifeSpan: string;
  sortYear: number;
  historicalEventWiki: string;
  historicalEventLabel: string;
  satiricalHook: string;
  connectionNote: string;
  connectedAuthorIds: string[];
}

export interface SacredSeed {
  id: string;
  tradition: SacredTradition;
  title: string;
  workLabel: string;
  dateLabel: string;
  sortYear: number;
  wikiquoteTitle: string;
  wikipediaTitle: string;
  apiRef: string;
}

export interface InquirySeed {
  id: string;
  category: InquiryCategory;
  question: string;
  satiricalHook: string;
  wikiPageTitle: string;
  protagonistName: string;
  protagonistWikiTitle: string;
  epochId: EpochId;
  periodLabel: string;
  whyItHappenedContext: string;
  presentRepercussionsContext: string;
  relatedAuthorIds: string[];
}

export interface WikiDiscoveryCategory {
  id: string;
  label: string;
  wikiCategory: string;
  defaultProfession: AuthorProfession;
  defaultEpochId: EpochId;
  defaultSubfolderId: string;
  defaultNationality: string;
}

export const WIKI_DISCOVERY_CATEGORIES: WikiDiscoveryCategory[] = [
  {
    id: 'filosofi-illuministi',
    label: 'Illuminismo (Montesquieu, Diderot, Beccaria, Hume...)',
    wikiCategory: 'Categoria:Filosofi_illuministi',
    defaultProfession: 'Filosofo',
    defaultEpochId: 'illuminismo_ottocento',
    defaultSubfolderId: 'illuminismo-criticismo',
    defaultNationality: 'Europea',
  },
  {
    id: 'filosofi-tedeschi',
    label: 'Filosofi Tedeschi (Hegel, Heidegger, Leibniz, Fichte...)',
    wikiCategory: 'Categoria:Filosofi_tedeschi',
    defaultProfession: 'Filosofo',
    defaultEpochId: 'illuminismo_ottocento',
    defaultSubfolderId: 'nietzsche-martello-filosofia',
    defaultNationality: 'Tedesca',
  },
  {
    id: 'filosofi-greci',
    label: 'Filosofi Greci Antichi (Epicuro, Parmenide, Zenone, Plotino...)',
    wikiCategory: 'Categoria:Filosofi_greci_antichi',
    defaultProfession: 'Filosofo',
    defaultEpochId: 'antichita',
    defaultSubfolderId: 'atene-classica-tragedia',
    defaultNationality: 'Greca',
  },
  {
    id: 'filosofi-francesi',
    label: 'Filosofi Francesi (Cartesio, Foucault, Sartre, Bergson...)',
    wikiCategory: 'Categoria:Filosofi_francesi',
    defaultProfession: 'Filosofo',
    defaultEpochId: 'moderna',
    defaultSubfolderId: 'rivoluzione-scientifica-razionalismo',
    defaultNationality: 'Francese',
  },
  {
    id: 'filosofi-italiani',
    label: 'Filosofi Italiani (Vico, Croce, Gentile, Campanella, Severino...)',
    wikiCategory: 'Categoria:Filosofi_italiani',
    defaultProfession: 'Filosofo',
    defaultEpochId: 'contemporanea',
    defaultSubfolderId: 'novecento-totalitarismi-testimoni',
    defaultNationality: 'Italiana',
  },
  {
    id: 'filosofi-esistenzialisti',
    label: 'Esistenzialismo & Pensatori Inquieti',
    wikiCategory: 'Categoria:Filosofi_esistenzialisti',
    defaultProfession: 'Filosofo',
    defaultEpochId: 'contemporanea',
    defaultSubfolderId: 'novecento-satira-potere-repubblica',
    defaultNationality: 'Europea',
  },
];

export const AUTHOR_SEEDS: AuthorSeed[] = [
  // =========================================================================
  // 1. DAL BIG BANG ALL'ALBA DELLE CIVILTÀ (13,8 mld a.C. - 700 a.C.)
  // =========================================================================
  {
    id: 'omero',
    name: 'Omero',
    wikiTitle: 'Omero',
    wikiquoteTitle: 'Omero',
    nationality: 'Greca',
    profession: 'Scrittore e Poeta',
    epochId: 'origini_cosmo',
    subfolderId: 'big-bang-mito-logos',
    yearBadge: 'VIII sec. a.C.',
    lifeSpan: 'Ionia, VIII secolo a.C.',
    sortYear: -750,
    historicalEventWiki: 'Guerra_di_Troia',
    historicalEventLabel: 'L’Iliade, l’Odissea e la nascita dell’immaginario occidentale',
    satiricalHook:
      'Sette città greche si litigavano il vanto di avergli dato i natali, e gli storici moderni non sono nemmeno sicuri che sia esistito davvero: eppure con un cavallo di legno e un viaggio di ritorno lungo dieci anni ha inventato la letteratura occidentale.',
    connectionNote:
      'I suoi poemi educarono tutta la Grecia, finché Eraclito, Socrate e Platone non decisero di sostituire i capricci degli dèi omerici con la filosofia.',
    connectedAuthorIds: ['eraclito', 'sofocle', 'dante-alighieri'],
  },

  // =========================================================================
  // 2. ANTICHITÀ CLASSICA: PRESOCRATICI, ATENE & STOICISMO (600 a.C. - 200 AD)
  // =========================================================================
  {
    id: 'eraclito',
    name: 'Eraclito',
    wikiTitle: 'Eraclito',
    wikiquoteTitle: 'Eraclito',
    nationality: 'Greca',
    profession: 'Filosofo',
    epochId: 'antichita',
    subfolderId: 'presocratici-scuola-ionica',
    yearBadge: '535 – 475 a.C.',
    lifeSpan: 'Efeso, 535 a.C. – 475 a.C.',
    sortYear: -500,
    historicalEventWiki: 'Scuola_ionica',
    historicalEventLabel: 'La nascita del Logos e del divenire (Panta Rei) nella Ionia',
    satiricalHook:
      'Soprannominato "l’Oscuro" perché scriveva per enigmi così densi che persino Socrate disse che per capirlo serviva "un tuffatore di Delo". Odiava la folla al punto da preferire giocare a dadi coi bambini nel tempio piuttosto che fare politica coi suoi concittadini.',
    connectionNote:
      'Apre la filosofia del divenire: ventiquattro secoli dopo, Nietzsche dirà che Eraclito è l’unico filosofo antico a non aver mai mentito.',
    connectedAuthorIds: ['omero', 'socrate', 'nietzsche'],
  },
  {
    id: 'sofocle',
    name: 'Sofocle',
    wikiTitle: 'Sofocle',
    wikiquoteTitle: 'Sofocle',
    nationality: 'Greca',
    profession: 'Drammaturgo e Tragediografo',
    epochId: 'antichita',
    subfolderId: 'atene-classica-tragedia',
    yearBadge: '496 – 406 a.C.',
    lifeSpan: 'Colono, 496 a.C. – Atene, 406 a.C.',
    sortYear: -406,
    historicalEventWiki: 'Edipo_a_Colono',
    historicalEventLabel: 'Il Processo a Sofocle intentato dai figli e la lettura dell’Edipo a Colono (406 a.C.)',
    satiricalHook:
      'A novant’anni suo figlio lo trascinò in tribunale sostenendo che fosse rimbambito per soffiargli l’eredità. Sofocle non chiamò avvocati: lesse in aula il coro dell’Edipo a Colono appena scritto e chiese ai giudici: «Vi sembra l’opera di un idiota?». Fu assolto con applauso.',
    connectionNote:
      'Con Antigone ed Edipo Re crea il conflitto tra legge dello Stato e coscienza individuale che tormenterà Socrate e affascinerà Nietzsche.',
    connectedAuthorIds: ['socrate', 'aristotele', 'nietzsche'],
  },
  {
    id: 'socrate',
    name: 'Socrate',
    wikiTitle: 'Socrate',
    wikiquoteTitle: 'Socrate',
    nationality: 'Greca',
    profession: 'Filosofo',
    epochId: 'antichita',
    subfolderId: 'atene-classica-tragedia',
    yearBadge: '470 – 399 a.C.',
    lifeSpan: 'Atene, 470 a.C. – 399 a.C.',
    sortYear: -399,
    historicalEventWiki: 'Processo_di_Socrate',
    historicalEventLabel: 'Il Processo a Socrate e la condanna della democrazia ateniese (399 a.C.)',
    satiricalHook:
      'Girava scalzo per Atene fermando politici, generali e poeti convinti di sapere tutto, e con tre domande gentili dimostrava in pubblico che non avevano la minima idea di cosa stessero dicendo. Gli ateniesi la presero così bene che gli offrirono una tazza di cicuta.',
    connectionNote:
      'Non scrisse una sola riga: tutto ciò che sappiamo di lui lo dobbiamo al suo allievo Platone.',
    connectedAuthorIds: ['platone', 'sofocle', 'diogene'],
  },
  {
    id: 'platone',
    name: 'Platone',
    wikiTitle: 'Platone',
    wikiquoteTitle: 'Platone',
    nationality: 'Greca',
    profession: 'Filosofo',
    epochId: 'antichita',
    subfolderId: 'atene-classica-tragedia',
    yearBadge: '428 – 348 a.C.',
    lifeSpan: 'Atene, 428 a.C. – 348 a.C.',
    sortYear: -380,
    historicalEventWiki: 'Mito_della_caverna',
    historicalEventLabel: 'La fondazione dell’Accademia e il Mito della Caverna',
    satiricalHook:
      '"Platone" era in realtà il suo soprannome da lottatore ("Spalle larghe"). Con il Mito della Caverna ha descritto con 2.400 anni di anticipo l’umanità incollata agli schermi convinta che le ombre proiettate siano la realtà.',
    connectionNote:
      'Allievo prediletto di Socrate e maestro per vent’anni di Aristotele (che però gli smonterà la teoria delle Idee).',
    connectedAuthorIds: ['socrate', 'aristotele', 'agostino'],
  },
  {
    id: 'aristotele',
    name: 'Aristotele',
    wikiTitle: 'Aristotele',
    wikiquoteTitle: 'Aristotele',
    nationality: 'Greca',
    profession: 'Filosofo',
    epochId: 'antichita',
    subfolderId: 'atene-classica-tragedia',
    yearBadge: '384 – 322 a.C.',
    lifeSpan: 'Stagira, 384 a.C. – Calcide, 322 a.C.',
    sortYear: -340,
    historicalEventWiki: 'Liceo_(scuola_filosofica)',
    historicalEventLabel: 'Il Liceo peripatetico e l’educazione di Alessandro Magno',
    satiricalHook:
      'L’uomo che mise in ordine l’universo: classificò animali, tragedie, costituzioni politiche e sillogismi camminando avanti e indietro nel cortile del Liceo, dopo aver fatto da professore privato a un ragazzino macedone un po’ irrequieto di nome Alessandro Magno.',
    connectionNote:
      'Discepolo di Platone; nel Medioevo Dante lo chiamerà semplicemente «il Maestro di color che sanno».',
    connectedAuthorIds: ['platone', 'diogene', 'dante-alighieri'],
  },
  {
    id: 'diogene',
    name: 'Diogene di Sinope',
    wikiTitle: 'Diogene_di_Sinope',
    wikiquoteTitle: 'Diogene_di_Sinope',
    nationality: 'Greca',
    profession: 'Filosofo',
    epochId: 'antichita',
    subfolderId: 'cinismo-stoicismo-roma',
    yearBadge: '412 – 323 a.C.',
    lifeSpan: 'Sinope, 412 a.C. – Corinto, 323 a.C.',
    sortYear: -335,
    historicalEventWiki: 'Cinismo',
    historicalEventLabel: 'L’incontro a Corinto con Alessandro Magno («Scostati dal mio sole»)',
    satiricalHook:
      'Viveva in una botte di terracotta, girava in pieno giorno con una lanterna accesa gridando «Cerco l’uomo!» e quando l’imperatore del mondo Alessandro Magno gli chiese cosa potesse regalargli, gli rispose: «Spostati di mezzo che mi fai ombra».',
    connectionNote:
      'Platone lo definì "un Socrate impazzito"; la sua libertà radicale dai beni materiali preparò la strada allo Stoicismo di Epitteto e Seneca.',
    connectedAuthorIds: ['socrate', 'epitteto', 'seneca'],
  },
  {
    id: 'seneca',
    name: 'Lucio Anneo Seneca',
    wikiTitle: 'Lucio_Anneo_Seneca',
    wikiquoteTitle: 'Lucio_Anneo_Seneca',
    nationality: 'Romana',
    profession: 'Filosofo',
    epochId: 'antichita',
    subfolderId: 'cinismo-stoicismo-roma',
    yearBadge: '4 a.C. – 65 AD',
    lifeSpan: 'Cordova, 4 a.C. – Roma, 65 AD',
    sortYear: 49,
    historicalEventWiki: 'Congiura_di_Pisone',
    historicalEventLabel: 'Lo Stoicismo imperiale, Nerone e la Congiura di Pisone (65 AD)',
    satiricalHook:
      'Predicava il disprezzo delle ricchezze essendo uno degli uomini più ricchi dell’Impero, ed ebbe la sfortuna lavorativa di fare da precettore al giovane Nerone: quando il suo ex alunno gli ordinò di suicidarsi, Seneca affrontò la morte con una calma che lasciò sbalorditi i centurioni.',
    connectionNote:
      'Le sue Lettere a Lucilio sulla brevità della vita collegano lo stoicismo greco a Marco Aurelio e a Montaigne.',
    connectedAuthorIds: ['epitteto', 'marco-aurelio', 'diogene'],
  },
  {
    id: 'epitteto',
    name: 'Epitteto',
    wikiTitle: 'Epitteto',
    wikiquoteTitle: 'Epitteto',
    nationality: 'Greco-Romana',
    profession: 'Filosofo',
    epochId: 'antichita',
    subfolderId: 'cinismo-stoicismo-roma',
    yearBadge: '50 AD – 135 AD',
    lifeSpan: 'Ierapoli, 50 AD – Nicopoli, 135 AD',
    sortYear: 108,
    historicalEventWiki: 'Manuale_di_Epitteto',
    historicalEventLabel: 'Dalla schiavitù a Roma alla scuola stoica di Nicopoli',
    satiricalHook:
      'Nato schiavo e rimasto zoppo per le violenze del padrone, una volta liberato aprì una scuola filosofica con una regola d’oro capace di azzerare il 90% dell’ansia umana: dividi il mondo tra ciò che dipende da te e ciò che non dipende da te, e smetti di disperarti per il secondo.',
    connectionNote:
      'Il suo Manuale (tradotto in italiano secoli dopo da Giacomo Leopardi!) formò il pensiero dell’imperatore Marco Aurelio.',
    connectedAuthorIds: ['marco-aurelio', 'seneca', 'leopardi'],
  },
  {
    id: 'marco-aurelio',
    name: 'Marco Aurelio',
    wikiTitle: 'Marco_Aurelio',
    wikiquoteTitle: 'Marco_Aurelio',
    nationality: 'Romana',
    profession: 'Filosofo',
    epochId: 'antichita',
    subfolderId: 'cinismo-stoicismo-roma',
    yearBadge: '121 AD – 180 AD',
    lifeSpan: 'Roma, 121 AD – Vindobona, 180 AD',
    sortYear: 175,
    historicalEventWiki: 'Guerre_marcomanniche',
    historicalEventLabel: 'I Colloqui con sé stesso scritti nelle tende militari sul Danubio (170-180 AD)',
    satiricalHook:
      'L’unico monarca assoluto della storia che, invece di costruirsi statue d’oro, la sera nella tenda gelata al confine germanico scriveva un diario privato per ricordarsi che stamattina incontrerà gente ingrata e arrogante, e che pure i Cesari diventano presto cenere.',
    connectionNote:
      'Chiude l’età d’oro dello Stoicismo antico applicando sul trono di Roma gli insegnamenti dello schiavo Epitteto.',
    connectedAuthorIds: ['epitteto', 'seneca', 'boezio'],
  },

  // =========================================================================
  // 3. TARDO ANTICO E MEDIOEVO (300 AD - 1400 AD)
  // =========================================================================
  {
    id: 'ipazia',
    name: 'Ipazia d’Alessandria',
    wikiTitle: 'Ipazia',
    wikiquoteTitle: 'Ipazia',
    nationality: 'Greco-Egizia',
    profession: 'Filosofo',
    epochId: 'tardo_antico_medioevo',
    subfolderId: 'tardo-antico-patristica',
    yearBadge: '360 AD – 415 AD',
    lifeSpan: 'Alessandria d’Egitto, 360 circa – 415 AD',
    sortYear: 415,
    historicalEventWiki: 'Biblioteca_di_Alessandria',
    historicalEventLabel: 'La scuola neoplatonica e astronomica di Alessandria (415 AD)',
    satiricalHook:
      'Astronoma, matematica e filosofa a capo della scuola di Alessandria: in un’epoca in cui i fanatismi iniziavano a prendere a sassate i libri, lei continuava a insegnare Platone ed Euclide a cristiani, pagani ed ebrei nella stessa aula.',
    connectionNote:
      'Simbolo della libertà di ricerca tra antichità e medioevo; verrà celebrata dagli illuministi come Voltaire.',
    connectedAuthorIds: ['platone', 'agostino', 'voltaire'],
  },
  {
    id: 'agostino',
    name: 'Sant’Agostino d’Ippona',
    wikiTitle: 'Agostino_d%27Ippona',
    wikiquoteTitle: 'Agostino_d%27Ippona',
    nationality: 'Romano-Africana',
    profession: 'Filosofo',
    epochId: 'tardo_antico_medioevo',
    subfolderId: 'tardo-antico-patristica',
    yearBadge: '354 AD – 430 AD',
    lifeSpan: 'Tagaste, 354 AD – Ippona, 430 AD',
    sortYear: 398,
    historicalEventWiki: 'Sacco_di_Roma_(410)',
    historicalEventLabel: 'Il Sacco di Roma del 410 AD, Le Confessioni e l’enigma del Tempo',
    satiricalHook:
      'Prima di diventare santo e vescovo visse una giovinezza turbolenta (celebre la sua preghiera giovanile: «Signore, fammi casto, ma non ancora!»). Sul concetto di tempo scrisse la battuta più onesta della filosofia: «Se nessuno me lo chiede, so cos’è; se devo spiegarlo, non lo so più».',
    connectionNote:
      'Fonde il pensiero di Platone con il Cristianesimo e apre l’introspezione psicologica che arriverà fino a Pascal e Kierkegaard.',
    connectedAuthorIds: ['platone', 'boezio', 'pascal'],
  },
  {
    id: 'boezio',
    name: 'Severino Boezio',
    wikiTitle: 'Severino_Boezio',
    wikiquoteTitle: 'Severino_Boezio',
    nationality: 'Romana',
    profession: 'Filosofo',
    epochId: 'tardo_antico_medioevo',
    subfolderId: 'tardo-antico-patristica',
    yearBadge: '475 AD – 524 AD',
    lifeSpan: 'Roma, 475 AD – Pavia, 524 AD',
    sortYear: 524,
    historicalEventWiki: 'De_consolatione_philosophiae',
    historicalEventLabel: 'La prigionia a Pavia e la stesura della Consolazione della Filosofia',
    satiricalHook:
      'Passò dall’essere il primo ministro più potente d’Italia al ritrovarsi chiuso in una torre a Pavia per un’accusa di tradimento: invece di scrivere memorie difensive, immaginò che Donna Filosofia entrasse in cella a spiegargli perché la Ruota della Fortuna gira per tutti.',
    connectionNote:
      'Tradusse Aristotele in latino salvando la logica antica e divenne la guida filosofica di Dante Alighieri dopo la morte di Beatrice.',
    connectedAuthorIds: ['aristotele', 'agostino', 'dante-alighieri'],
  },
  {
    id: 'tristano-e-isotta',
    name: 'Tristano e Isotta (Romanzo Cortese)',
    wikiTitle: 'Tristano_e_Isotta',
    wikiquoteTitle: 'Tristano_e_Isotta',
    nationality: 'Franco-Normanna / Celtica',
    profession: 'Scrittore e Poeta',
    epochId: 'tardo_antico_medioevo',
    subfolderId: 'amor-cortese-stilnovo',
    yearBadge: 'XII sec. AD',
    lifeSpan: 'Tradizione celtica e cortese, 1150 – 1190 AD',
    sortYear: 1170,
    historicalEventWiki: 'Amor_cortese',
    historicalEventLabel: 'La nascita del Romanzo Cortese nel XII secolo',
    satiricalHook:
      'Tutto nasce perché sulla nave verso la Cornovaglia bevono per sbaglio il filtro d’amore destinato alle nozze dello zio Re Marco: da quel sorso sbagliato nasce l’idea tutta occidentale che l’amore vero debba essere assoluto, impossibile e preferibilmente tragico.',
    connectionNote:
      'Ispirò direttamente il canto di Paolo e Francesca nella Divina Commedia di Dante («Galeotto fu ’l libro e chi lo scrisse»).',
    connectedAuthorIds: ['dante-alighieri', 'shakespeare', 'leopardi'],
  },
  {
    id: 'dante-alighieri',
    name: 'Dante Alighieri',
    wikiTitle: 'Dante_Alighieri',
    wikiquoteTitle: 'Dante_Alighieri',
    nationality: 'Italiana',
    profession: 'Scrittore e Poeta',
    epochId: 'tardo_antico_medioevo',
    subfolderId: 'amor-cortese-stilnovo',
    yearBadge: '1265 AD – 1321 AD',
    lifeSpan: 'Firenze, 1265 AD – Ravenna, 1321 AD',
    sortYear: 1310,
    historicalEventWiki: 'Guelfi_e_ghibellini',
    historicalEventLabel: 'L’esilio da Firenze (1302 AD) e la creazione della Divina Commedia',
    satiricalHook:
      'Cacciato da Firenze con condanna al rogo dai suoi avversari politici, si prese la rivincita letteraria più grandiosa della storia: costruì un intero Aldilà in endecasillabi per piazzare papi, politici e nemici personali nei gironi dell’Inferno mentre erano ancora vivi.',
    connectionNote:
      'Raccoglie l’eredità di Omero, Virgilio, Aristotele e Boezio fondando la lingua italiana.',
    connectedAuthorIds: ['omero', 'boezio', 'tristano-e-isotta'],
  },

  // =========================================================================
  // 4. RINASCIMENTO E RIVOLUZIONE SCIENTIFICA (1400 AD - 1700 AD)
  // =========================================================================
  {
    id: 'leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    wikiTitle: 'Leonardo_da_Vinci',
    wikiquoteTitle: 'Leonardo_da_Vinci',
    nationality: 'Italiana',
    profession: 'Pittore, Artista e Genio Universale',
    epochId: 'moderna',
    subfolderId: 'umanesimo-rinascimento',
    yearBadge: '1452 AD – 1519 AD',
    lifeSpan: 'Vinci, 1452 AD – Amboise, 1519 AD',
    sortYear: 1498,
    historicalEventWiki: 'Rinascimento_italiano',
    historicalEventLabel: 'L’Alto Rinascimento tra pittura, codici a specchio e scienza sperimentale',
    satiricalHook:
      'Mancino, scriveva i suoi appunti da destra a sinistra allo specchio e iniziava cento progetti contemporaneamente facendo disperare i committenti: si portò la Gioconda nel bagaglio per quindici anni fino in Francia perché secondo lui mancava sempre una velatura.',
    connectionNote:
      'Rivale di Michelangelo a Firenze; incrocia Niccolò Machiavelli durante le campagne militari del Valentino.',
    connectedAuthorIds: ['michelangelo', 'machiavelli', 'giordano-bruno'],
  },
  {
    id: 'michelangelo',
    name: 'Michelangelo Buonarroti',
    wikiTitle: 'Michelangelo_Buonarroti',
    wikiquoteTitle: 'Michelangelo_Buonarroti',
    nationality: 'Italiana',
    profession: 'Pittore, Artista e Genio Universale',
    epochId: 'moderna',
    subfolderId: 'umanesimo-rinascimento',
    yearBadge: '1475 AD – 1564 AD',
    lifeSpan: 'Caprese, 1475 AD – Roma, 1564 AD',
    sortYear: 1512,
    historicalEventWiki: 'Volta_della_Cappella_Sistina',
    historicalEventLabel: 'La scultura del marmo e gli affreschi della Cappella Sistina (1508-1512 AD)',
    satiricalHook:
      'Sosteneva di essere uno scultore e non un pittore: quando papa Giulio II lo costrinse a dipingere la volta della Cappella Sistina, passò quattro anni sui ponteggi col collo piegato indietro, ma quando un cardinale criticò i nudi del Giudizio Universale lo ritrasse all’Inferno con le orecchie d’asino.',
    connectionNote:
      'Insieme a Leonardo e Machiavelli incarna il vertice drammatico del Rinascimento italiano.',
    connectedAuthorIds: ['leonardo-da-vinci', 'dante-alighieri', 'machiavelli'],
  },
  {
    id: 'machiavelli',
    name: 'Niccolò Machiavelli',
    wikiTitle: 'Niccolò_Machiavelli',
    wikiquoteTitle: 'Niccolò_Machiavelli',
    nationality: 'Italiana',
    profession: 'Storico, Politico e Statista',
    epochId: 'moderna',
    subfolderId: 'umanesimo-rinascimento',
    yearBadge: '1469 AD – 1527 AD',
    lifeSpan: 'Firenze, 1469 AD – 1527 AD',
    sortYear: 1513,
    historicalEventWiki: 'Il_Principe',
    historicalEventLabel: 'La caduta della Repubblica fiorentina e la stesura de Il Principe (1513 AD)',
    satiricalHook:
      'Di giorno in esilio giocava a carte e litigava con l’oste e il macellaio all’osteria; di sera si toglieva i vestiti infangati, indossava gli abiti curiali e dialogava con gli antichi scrivendo Il Principe, il libro che ha avuto il torto imperdonabile di dire ad alta voce come funziona davvero il potere.',
    connectionNote:
      'Separa per primo la politica dalla morale astratta, influenzando Gramsci e tutti gli analisti del potere moderno.',
    connectedAuthorIds: ['leonardo-da-vinci', 'gramsci', 'bettino-craxi'],
  },
  {
    id: 'giordano-bruno',
    name: 'Giordano Bruno',
    wikiTitle: 'Giordano_Bruno',
    wikiquoteTitle: 'Giordano_Bruno',
    nationality: 'Italiana',
    profession: 'Filosofo',
    epochId: 'moderna',
    subfolderId: 'rivoluzione-scientifica-razionalismo',
    yearBadge: '1548 AD – 1600 AD',
    lifeSpan: 'Nola, 1548 AD – Roma, 1600 AD',
    sortYear: 1600,
    historicalEventWiki: 'Processo_di_Giordano_Bruno',
    historicalEventLabel: 'L’infinità dei mondi e la sentenza dell’8 febbraio 1600 AD',
    satiricalHook:
      'Mentre l’Europa litigava se il Sole girasse attorno alla Terra o viceversa, lui alzò la mano per dire che il Sole era solo una stella qualunque in un universo infinito pieno di infiniti mondi abitati. Agli inquisitori che lo condannavano rispose che tremavano più loro a leggere la sentenza che lui ad ascoltarla.',
    connectionNote:
      'La sua idea di Dio immanente nella Natura ("Mens insita omnibus") prepara direttamente il panteismo di Baruch Spinoza.',
    connectedAuthorIds: ['spinoza', 'leonardo-da-vinci', 'voltaire'],
  },
  {
    id: 'shakespeare',
    name: 'William Shakespeare',
    wikiTitle: 'William_Shakespeare',
    wikiquoteTitle: 'William_Shakespeare',
    nationality: 'Inglese',
    profession: 'Drammaturgo e Tragediografo',
    epochId: 'moderna',
    subfolderId: 'rivoluzione-scientifica-razionalismo',
    yearBadge: '1564 AD – 1616 AD',
    lifeSpan: 'Stratford-upon-Avon, 1564 AD – 1616 AD',
    sortYear: 1601,
    historicalEventWiki: 'Teatro_elisabettiano',
    historicalEventLabel: 'Il Teatro Elisabettiano e il Globe Theatre di Londra',
    satiricalHook:
      'Figlio di un guantaio di provincia, sul palco di legno del Globe Theatre ha messo in scena re assassini, fantasmi, amanti suicidi e buffoni più saggi dei sovrani, coniando oltre 1.700 parole inglesi che usiamo ancora oggi.',
    connectionNote:
      'Con Amleto trasforma l’eroe d’azione antico nell’uomo moderno paralizzato dal dubbio filosofico.',
    connectedAuthorIds: ['tristano-e-isotta', 'pascal', 'kierkegaard'],
  },
  {
    id: 'pascal',
    name: 'Blaise Pascal',
    wikiTitle: 'Blaise_Pascal',
    wikiquoteTitle: 'Blaise_Pascal',
    nationality: 'Francese',
    profession: 'Scienziato e Pensatore',
    epochId: 'moderna',
    subfolderId: 'rivoluzione-scientifica-razionalismo',
    yearBadge: '1623 AD – 1662 AD',
    lifeSpan: 'Clermont-Ferrand, 1623 AD – Parigi, 1662 AD',
    sortYear: 1658,
    historicalEventWiki: 'Pensieri_(Pascal)',
    historicalEventLabel: 'La prima calcolatrice meccanica e i Pensieri sul "divertissement"',
    satiricalHook:
      'A diciannove anni inventò la prima calcolatrice meccanica per risparmiare i conti sulle tasse al padre, poi fondò il calcolo delle probabilità studiando il gioco d’azzardo e concluse che tutta l’infelicità degli uomini nasce da una sola cosa: non saper stare tranquilli in una stanza da soli.',
    connectionNote:
      'La sua analisi della distrazione umana ("divertissement") anticipa Leopardi, Kierkegaard e l’era degli smartphone.',
    connectedAuthorIds: ['agostino', 'leopardi', 'kierkegaard'],
  },
  {
    id: 'spinoza',
    name: 'Baruch Spinoza',
    wikiTitle: 'Baruch_Spinoza',
    wikiquoteTitle: 'Baruch_Spinoza',
    nationality: 'Olandese',
    profession: 'Filosofo',
    epochId: 'moderna',
    subfolderId: 'rivoluzione-scientifica-razionalismo',
    yearBadge: '1632 AD – 1677 AD',
    lifeSpan: 'Amsterdam, 1632 AD – L’Aia, 1677 AD',
    sortYear: 1670,
    historicalEventWiki: 'Etica_(Spinoza)',
    historicalEventLabel: 'La scomunica del 1656 AD e la stesura geometrica dell’Etica (Deus sive Natura)',
    satiricalHook:
      'Scomunicato a ventiquattro anni per le sue idee troppo libere, rifiutò cattedre universitarie e pensioni reali per non perdere l’indipendenza di pensiero: preferì guadagnarsi da vivere molando lenti per microscopi e telescopi mentre dimostrava l’Etica come un teorema di geometria.',
    connectionNote:
      'Ponte fondamentale tra il Rinascimento di Giordano Bruno e l’Illuminismo europeo; Einstein dirà: «Io credo nel Dio di Spinoza».',
    connectedAuthorIds: ['giordano-bruno', 'voltaire', 'kant'],
  },

  // =========================================================================
  // 5. ILLUMINISMO, ROMANTICISMO E OTTOCENTO (1700 AD - 1900 AD)
  //    -> Sottocartella Illuminismo collegata a Kant, Voltaire e Rousseau!
  // =========================================================================
  {
    id: 'voltaire',
    name: 'Voltaire',
    wikiTitle: 'Voltaire',
    wikiquoteTitle: 'Voltaire',
    nationality: 'Francese',
    profession: 'Filosofo',
    epochId: 'illuminismo_ottocento',
    subfolderId: 'illuminismo-criticismo',
    yearBadge: '1694 AD – 1778 AD',
    lifeSpan: 'Parigi, 1694 AD – 1778 AD',
    sortYear: 1759,
    historicalEventWiki: 'Candido_(Voltaire)',
    historicalEventLabel: 'L’Illuminismo francese, il Trattato sulla tolleranza e il Candido (1759 AD)',
    satiricalHook:
      'Finì due volte alla Bastiglia perché non riusciva a trattenere le battute sui nobili, beveva quaranta tazze di caffè al giorno e con il romanzo satirico Candido prese in giro chi sosteneva che viviamo nel "migliore dei mondi possibili" proprio mentre un terremoto radeva al suolo Lisbona.',
    connectionNote:
      'Anima satirica dell’Illuminismo: si scontrò ferocemente con Rousseau ma aprì la stagione della tolleranza che culminerà in Kant.',
    connectedAuthorIds: ['rousseau', 'kant', 'spinoza'],
  },
  {
    id: 'rousseau',
    name: 'Jean-Jacques Rousseau',
    wikiTitle: 'Jean-Jacques_Rousseau',
    wikiquoteTitle: 'Jean-Jacques_Rousseau',
    nationality: 'Svizzera / Francese',
    profession: 'Filosofo',
    epochId: 'illuminismo_ottocento',
    subfolderId: 'illuminismo-criticismo',
    yearBadge: '1712 AD – 1778 AD',
    lifeSpan: 'Ginevra, 1712 AD – Ermenonville, 1778 AD',
    sortYear: 1762,
    historicalEventWiki: 'Il_contratto_sociale',
    historicalEventLabel: 'Il Contratto Sociale, l’Emilio e le radici della Rivoluzione Francese (1762 AD)',
    satiricalHook:
      'L’illuminista che litigò con tutti gli altri illuministi: quando mandò a Voltaire il suo libro in cui sosteneva che la civiltà aveva corrotto l’uomo naturale, Voltaire gli rispose che leggendolo «viene voglia di camminare a quattro zampe». Eppure con Il Contratto Sociale accese la miccia del 1789.',
    connectionNote:
      'Influenzò talmente Immanuel Kant che nell’austero studio di Kant a Königsberg l’unico quadro appeso al muro era proprio il ritratto di Rousseau.',
    connectedAuthorIds: ['kant', 'voltaire', 'leopardi'],
  },
  {
    id: 'kant',
    name: 'Immanuel Kant',
    wikiTitle: 'Immanuel_Kant',
    wikiquoteTitle: 'Immanuel_Kant',
    nationality: 'Tedesca',
    profession: 'Filosofo',
    epochId: 'illuminismo_ottocento',
    subfolderId: 'illuminismo-criticismo',
    yearBadge: '1724 AD – 1804 AD',
    lifeSpan: 'Königsberg, 1724 AD – 1804 AD',
    sortYear: 1784,
    historicalEventWiki: 'Illuminismo',
    historicalEventLabel: 'Risposta alla domanda: che cos’è l’Illuminismo? («Sapere aude!», 1784 AD)',
    satiricalHook:
      'Non si allontanò mai per più di qualche chilometro dalla sua Königsberg ed era così cronometrico nelle sue abitudini che le casalinghe prussiane rimettevano l’orologio quando lo vedevano passare col bastone: saltò la passeggiata solo due volte in tutta la vita, quando lesse l’Emilio di Rousseau e quando arrivarono le notizie della Rivoluzione Francese.',
    connectionNote:
      'Vertice dell’Illuminismo: raccoglie l’eredità di Rousseau e Voltaire e compie la "rivoluzione copernicana" da cui partirà Schopenhauer.',
    connectedAuthorIds: ['rousseau', 'voltaire', 'schopenhauer'],
  },
  {
    id: 'schopenhauer',
    name: 'Arthur Schopenhauer',
    wikiTitle: 'Arthur_Schopenhauer',
    wikiquoteTitle: 'Arthur_Schopenhauer',
    nationality: 'Tedesca',
    profession: 'Filosofo',
    epochId: 'illuminismo_ottocento',
    subfolderId: 'romanticismo-pessimismo-esistenza',
    yearBadge: '1788 AD – 1860 AD',
    lifeSpan: 'Danzica, 1788 AD – Francoforte, 1860 AD',
    sortYear: 1819,
    historicalEventWiki: 'Il_mondo_come_volontà_e_rappresentazione',
    historicalEventLabel: 'Il Velo di Maya e la vita come pendolo tra dolore e noia (1819 AD)',
    satiricalHook:
      'Così sicuro del proprio genio da fissare le sue lezioni all’Università di Berlino esattamente alla stessa ora del celeberrimo Hegel: si presentarono in tre, così lasciò l’università e passò il resto della vita con una serie di barboncini chiamati tutti "Atma" (Anima del Mondo), spiegando che la vita oscilla come un pendolo tra il dolore e la noia.',
    connectionNote:
      'Si considerava il vero erede di Kant; la scoperta del suo libro su una bancarella dell’usato folgorò il giovane Friedrich Nietzsche.',
    connectedAuthorIds: ['kant', 'leopardi', 'nietzsche'],
  },
  {
    id: 'leopardi',
    name: 'Giacomo Leopardi',
    wikiTitle: 'Giacomo_Leopardi',
    wikiquoteTitle: 'Giacomo_Leopardi',
    nationality: 'Italiana',
    profession: 'Scrittore e Poeta',
    epochId: 'illuminismo_ottocento',
    subfolderId: 'romanticismo-pessimismo-esistenza',
    yearBadge: '1798 AD – 1837 AD',
    lifeSpan: 'Recanati, 1798 AD – Napoli, 1837 AD',
    sortYear: 1819,
    historicalEventWiki: 'Operette_morali',
    historicalEventLabel: 'L’Infinito, la satira delle Operette Morali e La Ginestra',
    satiricalHook:
      'Altro che poeta lamentoso chiuso in camera: nelle Operette Morali ha scritto i dialoghi più ironici della letteratura italiana (dai folletti che ridono degli uomini convinti che il pianeta sia stato creato per loro, fino a Napoli dove andava matto per i gelati di Vito Pinto alle pendici del Vesuvio).',
    connectionNote:
      'Tradusse il Manuale di Epitteto, lesse Rousseau e giunse a una visione della Natura sorprendentemente affine a Schopenhauer (che lo ammirò).',
    connectedAuthorIds: ['schopenhauer', 'epitteto', 'nietzsche'],
  },
  {
    id: 'kierkegaard',
    name: 'Søren Kierkegaard',
    wikiTitle: 'Søren_Kierkegaard',
    wikiquoteTitle: 'Søren_Kierkegaard',
    nationality: 'Danese',
    profession: 'Filosofo',
    epochId: 'illuminismo_ottocento',
    subfolderId: 'romanticismo-pessimismo-esistenza',
    yearBadge: '1813 AD – 1855 AD',
    lifeSpan: 'Copenaghen, 1813 AD – 1855 AD',
    sortYear: 1843,
    historicalEventWiki: 'Aut-Aut',
    historicalEventLabel: 'Aut-Aut e la vertigine della libertà individuale (1843 AD)',
    satiricalHook:
      'Ruppe il fidanzamento con l’amata Regine Olsen perché convinto di essere troppo malinconico per il matrimonio, poi scrisse decine di capolavori firmandoli con pseudonimi diversi che polemizzavano tra loro sui giornali di Copenaghen. Definì l’angoscia non come una malattia, ma come «la vertigine della libertà» quando guardi giù nel burrone delle tue scelte.',
    connectionNote:
      'Padre dell’esistenzialismo moderno: riprende il paradosso della fede di Pascal e apre la strada a Dostoevskij e al Novecento.',
    connectedAuthorIds: ['pascal', 'dostoevskij', 'cioran'],
  },
  {
    id: 'dostoevskij',
    name: 'Fëdor Dostoevskij',
    wikiTitle: 'Fëdor_Dostoevskij',
    wikiquoteTitle: 'Fëdor_Dostoevskij',
    nationality: 'Russa',
    profession: 'Scrittore e Poeta',
    epochId: 'illuminismo_ottocento',
    subfolderId: 'romanticismo-pessimismo-esistenza',
    yearBadge: '1821 AD – 1881 AD',
    lifeSpan: 'Mosca, 1821 AD – San Pietroburgo, 1881 AD',
    sortYear: 1879,
    historicalEventWiki: 'I_fratelli_Karamazov',
    historicalEventLabel: 'La finta fucilazione del 1849 AD e i grandi romanzi sull’abisso umano',
    satiricalHook:
      'Nel 1849 fu legato al palo di fronte al plotone d’esecuzione zarista, e solo mentre i soldati prendevano la mira arrivò il contrordine che commutava la pena nei lavori forzati in Siberia; anni dopo dettò Il Giocatore in ventisei giorni a una stenografa (che poi sposò) per non perdere i diritti di tutti i suoi libri per debiti alla roulette.',
    connectionNote:
      'Scava nei sotterranei della coscienza umana influenzando direttamente Friedrich Nietzsche.',
    connectedAuthorIds: ['kierkegaard', 'nietzsche', 'cioran'],
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    wikiTitle: 'Friedrich_Nietzsche',
    wikiquoteTitle: 'Friedrich_Nietzsche',
    nationality: 'Tedesca',
    profession: 'Filosofo',
    epochId: 'illuminismo_ottocento',
    subfolderId: 'nietzsche-martello-filosofia',
    yearBadge: '1844 AD – 1900 AD',
    lifeSpan: 'Röcken, 1844 AD – Weimar, 1900 AD',
    sortYear: 1883,
    historicalEventWiki: 'Così_parlò_Zarathustra',
    historicalEventLabel: 'La "morte di Dio", l’Oltreuomo, l’Eterno Ritorno e il crollo di Torino (1889 AD)',
    satiricalHook:
      'Diventato professore universitario a soli ventiquattro anni, lasciò la cattedra per vivere da viandante tra le Alpi dell’Engadina, Rapallo e Torino, scrivendo libri dinamitardi («Io non sono un uomo, sono dinamite»). Il 3 gennaio 1889 a Torino abbracciò in lacrime un cavallo frustato dal cocchiere prima di sprofondare in undici anni di silenzio.',
    connectionNote:
      'Parte dal pessimismo di Schopenhauer e dalla tragedia di Sofocle per rovesciarli nell’amor fati; segna l’ingresso filosofico nel Novecento.',
    connectedAuthorIds: ['schopenhauer', 'dostoevskij', 'cioran'],
  },

  // =========================================================================
  // 6. IL NOVECENTO FINO AL 2000 AD (1900 AD - 2000 AD)
  // =========================================================================
  {
    id: 'gramsci',
    name: 'Antonio Gramsci',
    wikiTitle: 'Antonio_Gramsci',
    wikiquoteTitle: 'Antonio_Gramsci',
    nationality: 'Italiana',
    profession: 'Filosofo',
    epochId: 'contemporanea',
    subfolderId: 'novecento-totalitarismi-testimoni',
    yearBadge: '1891 AD – 1937 AD',
    lifeSpan: 'Ales, 1891 AD – Roma, 1937 AD',
    sortYear: 1932,
    historicalEventWiki: 'Quaderni_del_carcere',
    historicalEventLabel: 'I Quaderni del carcere e la condanna dell’indifferenza ("Odio gli indifferenti")',
    satiricalHook:
      'Al processo del 1928 il pubblico ministero fascista pronunciò la frase rimasta tristemente celebre: «Per vent’anni dobbiamo impedire a questo cervello di funzionare». Risultato: in cella Gramsci riempì trentatré quaderni fitti che sono diventati l’opera politica italiana più tradotta nel mondo dopo Machiavelli.',
    connectionNote:
      'Rilegge Il Principe di Machiavelli nel Novecento e ispira profondamente Pier Paolo Pasolini ("Le ceneri di Gramsci").',
    connectedAuthorIds: ['machiavelli', 'pasolini', 'aldo-moro'],
  },
  {
    id: 'simone-weil',
    name: 'Simone Weil',
    wikiTitle: 'Simone_Weil',
    wikiquoteTitle: 'Simone_Weil',
    nationality: 'Francese',
    profession: 'Filosofo',
    epochId: 'contemporanea',
    subfolderId: 'novecento-totalitarismi-testimoni',
    yearBadge: '1909 AD – 1943 AD',
    lifeSpan: 'Parigi, 1909 AD – Ashford, 1943 AD',
    sortYear: 1942,
    historicalEventWiki: 'La_prima_radice',
    historicalEventLabel: 'Il lavoro in catena di montaggio alla Renault e la filosofia dell’attenzione',
    satiricalHook:
      'Mentre gli intellettuali parigini parlavano della classe operaia sorseggiando liquori nei caffè di Saint-Germain, questa brillante professoressa di filosofia si licenziò per andare a lavorare un anno intero come operaia metallurgica alla catena di montaggio della Renault per capire sulla propria pelle cosa facesse la macchina all’anima umana.',
    connectionNote:
      'Unisce il rigore di Platone e degli Stoici alla critica radicale dei totalitarismi del Novecento, in parallelo a Hannah Arendt.',
    connectedAuthorIds: ['platone', 'arendt', 'primo-levi'],
  },
  {
    id: 'arendt',
    name: 'Hannah Arendt',
    wikiTitle: 'Hannah_Arendt',
    wikiquoteTitle: 'Hannah_Arendt',
    nationality: 'Tedesca / Statunitense',
    profession: 'Filosofo',
    epochId: 'contemporanea',
    subfolderId: 'novecento-totalitarismi-testimoni',
    yearBadge: '1906 AD – 1975 AD',
    lifeSpan: 'Hannover, 1906 AD – New York, 1975 AD',
    sortYear: 1961,
    historicalEventWiki: 'La_banalità_del_male',
    historicalEventLabel: 'Il Processo ad Adolf Eichmann a Gerusalemme (1961 AD)',
    satiricalHook:
      'Inviata a Gerusalemme nel 1961 per seguire il processo al gerarca nazista Eichmann, si aspettava di vedere sul banco degli imputati un mostro demoniaco shakesperiano; si trovò invece davanti un grigio burocrate preoccupato solo dei timbri e della carriera, coniando la formula immortale: "la banalità del male".',
    connectionNote:
      'Dialoga con la testimonianza di Primo Levi sui Lager e riporta al centro del ’900 il dovere socratico di pensare con la propria testa.',
    connectedAuthorIds: ['primo-levi', 'simone-weil', 'socrate'],
  },
  {
    id: 'primo-levi',
    name: 'Primo Levi',
    wikiTitle: 'Primo_Levi',
    wikiquoteTitle: 'Primo_Levi',
    nationality: 'Italiana',
    profession: 'Scrittore e Poeta',
    epochId: 'contemporanea',
    subfolderId: 'novecento-totalitarismi-testimoni',
    yearBadge: '1919 AD – 1987 AD',
    lifeSpan: 'Torino, 1919 AD – 1987 AD',
    sortYear: 1947,
    historicalEventWiki: 'Se_questo_è_un_uomo',
    historicalEventLabel: 'La testimonianza di Auschwitz, Se questo è un uomo e Il sistema periodico',
    satiricalHook:
      'Chimico torinese dal linguaggio limpido come una formula di laboratorio, si salvò negli ultimi giorni di Auschwitz proprio perché ai tedeschi serviva un chimico per la fabbrica di gomma sintetica, e nel lager tenne viva l’umanità cercando di ricordare a memoria i versi del canto di Ulisse di Dante.',
    connectionNote:
      'Si lega direttamente a Dante Alighieri (il canto di Ulisse ad Auschwitz) e all’analisi di Hannah Arendt.',
    connectedAuthorIds: ['dante-alighieri', 'arendt', 'simone-weil'],
  },
  {
    id: 'cioran',
    name: 'Emil Cioran',
    wikiTitle: 'Emil_Cioran',
    wikiquoteTitle: 'Emil_Cioran',
    nationality: 'Rumena / Francese',
    profession: 'Filosofo',
    epochId: 'contemporanea',
    subfolderId: 'novecento-satira-potere-repubblica',
    yearBadge: '1911 AD – 1995 AD',
    lifeSpan: 'Rășinari, 1911 AD – Parigi, 1995 AD',
    sortYear: 1949,
    historicalEventWiki: 'Sommario_di_decomposizione',
    historicalEventLabel: 'La mansarda del Quartiere Latino e l’arte dell’aforisma disilluso',
    satiricalHook:
      'Il più divertente pessimista del Novecento: visse per decenni in una minuscola mansarda a Parigi mangiando alla mensa universitaria finché non lo cacciarono per limiti d’età, rifiutò tutti i premi letterari e confessò che l’idea stessa della possibilità del suicidio gli aveva permesso di sopportare allegramente una vita fino a 84 anni.',
    connectionNote:
      'Erede diretto dello stile aforistico e tagliente di Nietzsche, Schopenhauer e Leopardi.',
    connectedAuthorIds: ['nietzsche', 'schopenhauer', 'leopardi'],
  },
  {
    id: 'pasolini',
    name: 'Pier Paolo Pasolini',
    wikiTitle: 'Pier_Paolo_Pasolini',
    wikiquoteTitle: 'Pier_Paolo_Pasolini',
    nationality: 'Italiana',
    profession: 'Scrittore e Poeta',
    epochId: 'contemporanea',
    subfolderId: 'novecento-satira-potere-repubblica',
    yearBadge: '1922 AD – 1975 AD',
    lifeSpan: 'Bologna, 1922 AD – Ostia, 1975 AD',
    sortYear: 1974,
    historicalEventWiki: 'Scritti_corsari',
    historicalEventLabel: 'Gli Scritti Corsari e la profezia sulla società dei consumi (1974-1975 AD)',
    satiricalHook:
      'Riusciva a far arrabbiare contemporaneamente la destra, la sinistra, la Chiesa e i contestatori del ’68: capì prima di tutti che la pubblicità televisiva e il consumismo avevano cambiato gli italiani in pochi anni molto più di quanto avesse mai fatto qualunque regime.',
    connectionNote:
      'Parte da Gramsci e anticipa il crollo etico e politico dell’Italia tra il Caso Moro e la fine della Prima Repubblica.',
    connectedAuthorIds: ['gramsci', 'aldo-moro', 'bettino-craxi'],
  },
  {
    id: 'aldo-moro',
    name: 'Aldo Moro',
    wikiTitle: 'Aldo_Moro',
    wikiquoteTitle: 'Aldo_Moro',
    nationality: 'Italiana',
    profession: 'Storico, Politico e Statista',
    epochId: 'contemporanea',
    subfolderId: 'novecento-satira-potere-repubblica',
    yearBadge: '1916 AD – 1978 AD',
    lifeSpan: 'Maglie, 1916 AD – Roma, 1978 AD',
    sortYear: 1978,
    historicalEventWiki: 'Caso_Moro',
    historicalEventLabel: 'Le "convergenze parallele" e i 55 giorni del sequestro (1978 AD)',
    satiricalHook:
      'Professore pugliese capace di andare in spiaggia a Bari in giacca, cravatta e gilet sotto il sole d’agosto, inventò l’ossimoro geometrico più celebre della politica italiana — le «convergenze parallele» — per tenere insieme alleati che si detestavano, fino al tragico sequestro del 1978.',
    connectionNote:
      'Il suo assassinio nel 1978 blocca l’evoluzione della Repubblica preparando la crisi degli anni ’80 e ’90.',
    connectedAuthorIds: ['pasolini', 'bettino-craxi', 'giovanni-falcone'],
  },
  {
    id: 'giovanni-falcone',
    name: 'Giovanni Falcone',
    wikiTitle: 'Giovanni_Falcone',
    wikiquoteTitle: 'Giovanni_Falcone',
    nationality: 'Italiana',
    profession: 'Storico, Politico e Statista',
    epochId: 'contemporanea',
    subfolderId: 'novecento-satira-potere-repubblica',
    yearBadge: '1939 AD – 1992 AD',
    lifeSpan: 'Palermo, 1939 AD – Capaci, 1992 AD',
    sortYear: 1992,
    historicalEventWiki: 'Maxiprocesso_di_Palermo',
    historicalEventLabel: 'Il metodo "segui i soldi", il Maxiprocesso e l’eredità civile (1992 AD)',
    satiricalHook:
      'Capì una verità semplicissima che nessuno voleva applicare: i boss mafiosi potranno anche giurare fedeltà ai "codici d’onore", ma gli assegni bancari non mentono mai. Seguendo gli estratti conto costruì nel bunker dell’Ucciardone il primo processo che mandò all’ergastolo l’intera Cupola.',
    connectionNote:
      'Il 1992 unisce in un unico anno spartiacque le stragi mafiose di Palermo e il terremoto giudiziario di Mani Pulite.',
    connectedAuthorIds: ['bettino-craxi', 'aldo-moro', 'pasolini'],
  },
  {
    id: 'bettino-craxi',
    name: 'Bettino Craxi',
    wikiTitle: 'Bettino_Craxi',
    wikiquoteTitle: 'Bettino_Craxi',
    nationality: 'Italiana',
    profession: 'Storico, Politico e Statista',
    epochId: 'contemporanea',
    subfolderId: 'novecento-satira-potere-repubblica',
    yearBadge: '1934 AD – 2000 AD',
    lifeSpan: 'Milano, 1934 AD – Hammamet, 2000 AD',
    sortYear: 1992,
    historicalEventWiki: 'Mani_pulite',
    historicalEventLabel: 'Sigonella, Tangentopoli e la caduta della Prima Repubblica (1992-1994 AD)',
    satiricalHook:
      'Dall’apice del potere negli anni ’80 della "Milano da bere" — quando a Sigonella arrivò a far circondare dai carabinieri i militari americani della Delta Force — al 3 luglio 1992, quando si alzò in un Parlamento improvvisamente muto per dire: «Qui dentro rubano tutti per finanziare i partiti, chi dice che non lo sapeva mente».',
    connectionNote:
      'Con la sua parabola e l’esilio ad Hammamet nel 2000 si chiude il Novecento politico italiano.',
    connectedAuthorIds: ['machiavelli', 'aldo-moro', 'giovanni-falcone'],
  },
];

export const SACRED_SEEDS: SacredSeed[] = [
  {
    id: 'isaia-40-31',
    tradition: 'Bibbia',
    title: 'Profeta Isaia',
    workLabel: 'Libro di Isaia 40:31 (cfr. Isaia 10:20-21)',
    dateLabel: 'Gerusalemme / Esilio, VIII-VI sec. a.C.',
    sortYear: -700,
    wikiquoteTitle: 'Libro_di_Isaia',
    wikipediaTitle: 'Libro_di_Isaia',
    apiRef: 'Isaiah+40:31',
  },
  {
    id: 'isaia-40-8',
    tradition: 'Bibbia',
    title: 'Profeta Isaia',
    workLabel: 'Libro di Isaia 40:8',
    dateLabel: 'Gerusalemme, VI sec. a.C.',
    sortYear: -540,
    wikiquoteTitle: 'Libro_di_Isaia',
    wikipediaTitle: 'Isaia_(profeta)',
    apiRef: 'Isaiah+40:8',
  },
  {
    id: 'qoelet-3-1',
    tradition: 'Bibbia',
    title: 'Qoelet (Ecclesiaste)',
    workLabel: 'Libro del Qoelet (Ecclesiaste) 3:1-8',
    dateLabel: 'Gerusalemme, III sec. a.C.',
    sortYear: -250,
    wikiquoteTitle: 'Qoelet',
    wikipediaTitle: 'Qoelet',
    apiRef: 'Ecclesiastes+3:1-4',
  },
  {
    id: 'salmo-90-12',
    tradition: 'Bibbia',
    title: 'Libro dei Salmi',
    workLabel: 'Salmo 90:12',
    dateLabel: 'Tradizione Sapienziale d’Israele',
    sortYear: -600,
    wikiquoteTitle: 'Libro_dei_Salmi',
    wikipediaTitle: 'Libro_dei_Salmi',
    apiRef: 'Psalms+90:12',
  },
  {
    id: 'giovanni-8-32',
    tradition: 'Bibbia',
    title: 'Vangelo secondo Giovanni',
    workLabel: 'Vangelo di Giovanni 8:32',
    dateLabel: 'I secolo AD',
    sortYear: 30,
    wikiquoteTitle: 'Vangelo_secondo_Giovanni',
    wikipediaTitle: 'Vangelo_secondo_Giovanni',
    apiRef: 'John+8:32',
  },
  {
    id: 'corano-94-5',
    tradition: 'Corano',
    title: 'Il Corano — Sura Al-Inshirah',
    workLabel: 'Sura 94 (L’Apertura del Cuore), versetti 5-6',
    dateLabel: 'La Mecca, VII secolo AD',
    sortYear: 615,
    wikiquoteTitle: 'Corano',
    wikipediaTitle: 'Al-Inshirah',
    apiRef: '94:5',
  },
  {
    id: 'corano-5-32',
    tradition: 'Corano',
    title: 'Il Corano — Sura Al-Ma’idah',
    workLabel: 'Sura 5 (La Mensa), versetto 32',
    dateLabel: 'Medina, VII secolo AD',
    sortYear: 630,
    wikiquoteTitle: 'Corano',
    wikipediaTitle: 'Al-Ma%27ida',
    apiRef: '5:32',
  },
  {
    id: 'corano-49-13',
    tradition: 'Corano',
    title: 'Il Corano — Sura Al-Hujurat',
    workLabel: 'Sura 49 (Gli Appartamenti), versetto 13',
    dateLabel: 'Medina, VII secolo AD',
    sortYear: 631,
    wikiquoteTitle: 'Corano',
    wikipediaTitle: 'Corano',
    apiRef: '49:13',
  },
  {
    id: 'corano-96-1',
    tradition: 'Corano',
    title: 'Il Corano — Sura Al-‘Alaq',
    workLabel: 'Sura 96 (Il Grumo di Sangue / Leggi!), versetti 1-5',
    dateLabel: 'Monte Hira (La Mecca), 610 AD',
    sortYear: 610,
    wikiquoteTitle: 'Corano',
    wikipediaTitle: 'Al-%27Alaq',
    apiRef: '96:1',
  },
];

/**
 * Casistiche brillanti, curiose e variate per "Perché è successo?" (dal Big Bang al 2000 AD),
 * scritte con ritmo agile, metafore e ironia per catturare subito il lettore.
 */
export const INQUIRY_SEEDS: InquirySeed[] = [
  {
    id: 'big-bang-polvere-di-stelle',
    category: 'Cosmo, Scienza & Paradossi',
    question:
      'Dal Big Bang al Lunedì Mattina: perché l’Universo è esploso da un puntino più piccolo di un atomo e perché siamo fatti di scorie di stelle esplose?',
    satiricalHook:
      'Tredici miliardi e otto milioni di anni di evoluzione cosmica, supernove che fondono atomi di carbonio a miliardi di gradi... e poi usiamo quegli stessi atomi per suonare il clacson in tangenziale.',
    wikiPageTitle: 'Big_Bang',
    protagonistName: 'Giordano Bruno',
    protagonistWikiTitle: 'Big_Bang',
    epochId: 'origini_cosmo',
    periodLabel: '13,8 miliardi di anni fa – Oggi',
    whyItHappenedContext:
      'Non è stata un’esplosione "nello" spazio, ma l’espansione dello spazio stesso da uno stato di densità e temperatura infinite. Nei primi tre minuti si sono formati solo idrogeno ed elio; per avere il ferro del nostro sangue, il calcio delle ossa e l’oro degli anelli abbiamo dovuto aspettare che le prime stelle giganti bruciassero il loro combustibile ed esplodessero come supernove, seminando lo spazio di elementi pesanti.',
    presentRepercussionsContext:
      'Cosa resta oggi: ogni volta che una vecchia televisione a tubo catodico faceva "neve" sullo schermo, l’1% di quel fruscio era letteralmente la radiazione fossile del Big Bang (scoperta per caso nel 1965 da due fisici che pensavano fosse colpa degli escrementi dei piccioni sull’antenna). E la scoperta che l’universo sta accelerando la sua espansione continua a mettere in crisi la fisica contemporanea.',
    relatedAuthorIds: ['giordano-bruno', 'spinoza', 'pascal'],
  },
  {
    id: 'bolla-tulipani-wall-street-2008',
    category: 'Economia, Bolle & Follie Collettive',
    question:
      'Dalla "Bolla dei Tulipani" (1637) al Crollo di Wall Street (1929 e 2008): perché gli esseri umani perdono ciclicamente la testa per un fiore, un’azione o un mutuo?',
    satiricalHook:
      'Ad Amsterdam nel 1637 un singolo bulbo di tulipano striato costava quanto un palazzo di tre piani sui canali; poi un giorno qualcuno si è accorto che era pur sempre una cipolla da giardino, e il mercato è venuto giù.',
    wikiPageTitle: 'Bolla_dei_tulipani',
    protagonistName: 'Baruch Spinoza',
    protagonistWikiTitle: 'Crollo_di_Wall_Street',
    epochId: 'moderna',
    periodLabel: '1637 AD · 1929 AD · 2008 AD',
    whyItHappenedContext:
      'Tutte le grandi bolle finanziarie funzionano con la cosiddetta "teoria del più folle": compri una cosa a un prezzo assurdo non perché valga davvero quella cifra, ma perché sei convinto che domani troverai qualcuno ancora più euforico disposto a pagarla il doppio. Nel 1637 furono i tulipani olandesi, nel 1929 le azioni comprate a debito da chiunque (anche dal lustrascarpe di Rockefeller), nel 2008 i mutui subprime americani impacchettati come titoli sicurissimi.',
    presentRepercussionsContext:
      'Cosa resta oggi: cambiano le tecnologie ma non la psicologia umana. Dalle bolle delle dot-com del 2000 fino alla febbre per le criptovalute e i meme-token, ogni generazione riscopre a proprie spese che quando persino il vicino di casa ti dà consigli finanziari in ascensore, è il momento di scappare.',
    relatedAuthorIds: ['spinoza', 'voltaire', 'simone-weil'],
  },
  {
    id: 'idi-di-marzo-cesare-autogol',
    category: 'Potere, Congiure & Rivoluzioni',
    question:
      'Le Idi di Marzo (44 a.C.): perché Bruto e 60 senatori pugnalarono Giulio Cesare per "salvare la Repubblica" ottenendo l’esatto contrario (l’Impero)?',
    satiricalHook:
      'Il più clamoroso autogol politico dell’antichità: uccidi il dittatore per restaurare la Repubblica dei senatori, ma ti dimentichi di preparare un piano per il giorno dopo e regali Roma agli imperatori per cinque secoli.',
    wikiPageTitle: 'Idi_di_marzo',
    protagonistName: 'Marco Aurelio',
    protagonistWikiTitle: 'Gaio_Giulio_Cesare',
    epochId: 'antichita',
    periodLabel: 'Roma, 15 marzo 44 a.C.',
    whyItHappenedContext:
      'Giulio Cesare si era appena fatto nominare "dittatore perpetuo", svuotando il potere dell’aristocrazia senatoria. I congiurati guidati da Bruto e Cassio erano convinti che bastasse eliminare fisicamente Cesare perché la Repubblica tornasse magicamente a funzionare. Non avevano capito che il popolo romano amava le riforme di Cesare molto più dei privilegi dei senatori: al funerale, quando Marco Antonio lesse il testamento in cui Cesare lasciava denaro e giardini pubblici a ogni cittadino, la folla diede fuoco alle case dei congiurati.',
    presentRepercussionsContext:
      'Cosa resta oggi: in politica e geopolitica si chiama "eterogenesi dei fini" (o sindrome del cambio di regime): abbattere un leader senza aver capito le cause profonde che lo hanno portato al potere produce quasi sempre il caos o un potere ancora più assoluto (quello di Augusto).',
    relatedAuthorIds: ['seneca', 'marco-aurelio', 'machiavelli'],
  },
  {
    id: 'rivoluzione-francese-ghigliottina',
    category: 'Potere, Congiure & Rivoluzioni',
    question:
      'La Rivoluzione Francese (1789-1794): come si passò in quattro anni dai Diritti dell’Uomo al tagliare la testa anche ai capi della Rivoluzione?',
    satiricalHook:
      'Inizi con le idee luminose di Voltaire e Rousseau, abolisci i privilegi feudali e finisci con Robespierre che manda alla ghigliottina gli amici della settimana prima, finché non ghigliottinano pure lui.',
    wikiPageTitle: 'Rivoluzione_francese',
    protagonistName: 'Jean-Jacques Rousseau',
    protagonistWikiTitle: 'Rivoluzione_francese',
    epochId: 'illuminismo_ottocento',
    periodLabel: 'Parigi, 1789 AD – 1794 AD',
    whyItHappenedContext:
      'La Francia del 1789 era in bancarotta perché nobiltà e alto clero (il 2% della popolazione) non pagavano le tasse, mentre il Terzo Stato pagava il conto di guerre e regge di Versailles. Ma una volta abbattuta la monarchia assoluta e assaltata la Bastiglia, la paura dell’invasione straniera e dei complotti interni spinse i Giacobini di Robespierre a instaurare il "Terrore": per imporre la Virtù per legge, chiunque non fosse abbastanza entusiasta diventava automaticamente un nemico del popolo.',
    presentRepercussionsContext:
      'Cosa resta oggi: ci ha lasciato i concetti moderni di "Destra" e "Sinistra" (nati letteralmente da dove sedevano i deputati nell’Assemblea di Parigi), il sistema metrico decimale, i codici civili europei e una lezione eterna: diffidare sempre di chi promette di creare l’uomo perfetto per decreto.',
    relatedAuthorIds: ['rousseau', 'voltaire', 'kant'],
  },
  {
    id: 'incidente-sarajevo-svolta-sbagliata',
    category: 'Geopolitica, Guerre & Segreti del ’900',
    question:
      'L’Effetto Farfalla di Sarajevo (1914): come l’autista dell’Arciduca sbagliò strada davanti a un caffè e fece scoppiare la Prima Guerra Mondiale?',
    satiricalHook:
      'Se il 28 giugno 1914 a Sarajevo ci fosse stato il navigatore satellitare, probabilmente il Novecento avrebbe avuto tutta un’altra storia.',
    wikiPageTitle: 'Attentato_di_Sarajevo',
    protagonistName: 'Antonio Gramsci',
    protagonistWikiTitle: 'Attentato_di_Sarajevo',
    epochId: 'contemporanea',
    periodLabel: 'Sarajevo, 28 giugno 1914 AD',
    whyItHappenedContext:
      'La mattina del 28 giugno 1914 sei giovani cospiratori appostati lungo il corteo dell’arciduca Francesco Ferdinando d’Austria fallirono l’attentato: la bomba rimbalzò sulla capote dell’auto. L’arciduca era salvo. Ma nel pomeriggio il suo autista non fu avvisato del cambio di percorso, svoltò per errore in una via laterale e si fermò per fare retromarcia... esattamente davanti alla tavola calda da cui stava uscendo per caso uno degli attentatori, il diciannovenne Gavrilo Princip, che si trovò il bersaglio fermo a due metri.',
    presentRepercussionsContext:
      'Cosa resta oggi: quei due colpi di pistola fecero scattare come tessere del domino le alleanze militari segrete europee, spazzando via in quattro anni quattro imperi (austro-ungarico, tedesco, russo e ottomano) e disegnando con il righello i confini del Medio Oriente e dei Balcani che generano crisi ancora oggi.',
    relatedAuthorIds: ['gramsci', 'simone-weil', 'arendt'],
  },
  {
    id: 'stanislav-petrov-cuba-guerra-fredda',
    category: 'Geopolitica, Guerre & Segreti del ’900',
    question:
      'Crisi di Cuba (1962) e il Falso Allarme del 1983: perché siamo ancora tutti vivi solo grazie a due ufficiali sovietici che si rifiutarono di premere il bottone?',
    satiricalHook:
      'Nel 1983 il supercomputer nucleare sovietico vide partire cinque missili americani: in realtà era il riflesso del sole sulle nuvole, e il mondo si salvò perché l’ufficiale di turno usò il cervello invece del regolamento.',
    wikiPageTitle: 'Crisi_dei_missili_di_Cuba',
    protagonistName: 'Hannah Arendt',
    protagonistWikiTitle: 'Crisi_dei_missili_di_Cuba',
    epochId: 'contemporanea',
    periodLabel: 'Ottobre 1962 AD & 26 settembre 1983 AD',
    whyItHappenedContext:
      'Durante la Guerra Fredda il mondo è andato a un centimetro dall’apocalisse nucleare due volte: nel 1962 durante il blocco navale di Cuba, quando l’ufficiale sovietico Vasilij Archipov a bordo di un sottomarino colpito da cariche di profondità pose il veto al lancio di un siluro nucleare; e la notte del 26 settembre 1983, quando il tenente colonnello Stanislav Petrov decise che i cinque missili segnalati dal satellite sovietico dovevano essere un errore del computer («Chi inizia una guerra nucleare non lancia solo cinque missili»).',
    presentRepercussionsContext:
      'Cosa resta oggi: dimostra quanto sia fragile l’affidamento cieco agli algoritmi nei sistemi militari automatizzati. Nell’era dell’intelligenza artificiale applicata alla difesa, il "caso Petrov" viene studiato in tutte le accademie per ricordare perché l’ultima decisione non va mai lasciata a una macchina.',
    relatedAuthorIds: ['arendt', 'pascal', 'kant'],
  },
  {
    id: 'watergate-nixon-nastri',
    category: 'Potere, Congiure & Rivoluzioni',
    question:
      'Lo Scandalo Watergate (1972-1974): perché Richard Nixon perse la presidenza degli Stati Uniti per essersi registrato da solo nello Studio Ovale?',
    satiricalHook:
      'Nixon stravinse le elezioni del 1972 in 49 Stati su 50: non aveva alcun bisogno di spiare gli avversari, e soprattutto non aveva bisogno di installare i microfoni segreti che registrarono la sua stessa voce mentre ordinava l’insabbiamento.',
    wikiPageTitle: 'Scandalo_Watergate',
    protagonistName: 'Niccolò Machiavelli',
    protagonistWikiTitle: 'Scandalo_Watergate',
    epochId: 'contemporanea',
    periodLabel: 'Washington D.C., 1972 AD – 1974 AD',
    whyItHappenedContext:
      'Una guardia giurata notò un pezzo di nastro adesivo sulla serratura di una porta nel palazzo Watergate a Washington e fece arrestare cinque "idraulici" legati al comitato di Nixon. Il presidente non cadde per il furto, ma per la paranoia con cui cercò di bloccare l’FBI usando fondi neri: quando la Corte Suprema lo obbligò a consegnare le bobine audio che lui stesso aveva fatto installare nello Studio Ovale, spuntò la "pistola fumante" che lo costrinse alle dimissioni.',
    presentRepercussionsContext:
      'Cosa resta oggi: da allora ogni scandalo politico mondiale prende il suffisso "-gate" (Irangate, Qatargate, Dieselgate) e ha insegnato ai politici una regola ferrea: nella storia quasi mai ti rovina l’errore iniziale, ti rovina il goffo tentativo di nasconderlo.',
    relatedAuthorIds: ['machiavelli', 'arendt', 'bettino-craxi'],
  },
  {
    id: 'craxi-tangentopoli-monetine',
    category: 'Potere, Congiure & Rivoluzioni',
    question:
      'Tangentopoli e Mani Pulite (1992-1994): come una mazzetta da 7 milioni di lire ("un mariuolo isolato") fece crollare in due anni tutti i partiti della Prima Repubblica?',
    satiricalHook:
      'Quando il 17 febbraio 1992 arrestarono Mario Chiesa mentre cercava di buttare le banconote nel water, i leader dissero che era solo un "mariuolo isolato"; due anni dopo era sparito l’intero Parlamento.',
    wikiPageTitle: 'Mani_pulite',
    protagonistName: 'Bettino Craxi',
    protagonistWikiTitle: 'Bettino_Craxi',
    epochId: 'contemporanea',
    periodLabel: 'Milano e Roma, 1992 AD – 1994 AD',
    whyItHappenedContext:
      'Per tutti gli anni ’80 i partiti italiani avevano mantenuto sedi, giornali, congressi faraonici e correnti incassando una percentuale fissa sugli appalti pubblici. Finché c’era il Muro di Berlino, gli elettori si turavano il naso in funzione anticomunista e lo Stato copriva i costi col debito pubblico. Caduto il Muro (1989) e firmato il Trattato di Maastricht (1992), i soldi finirono: gli imprenditori iniziarono a parlare col pool di Milano e Bettino Craxi alla Camera ammise che il sistema era illegale ma condiviso da tutti, prima del lancio di monetine davanti all’Hotel Raphael e dell’esilio ad Hammamet.',
    presentRepercussionsContext:
      'Cosa resta oggi: spazzati via i vecchi partiti (DC, PSI, PRI, PLI, PSDI), è nata la "Seconda Repubblica" dei partiti personali, della guerra infinita tra politica e magistratura e dell’abolizione del finanziamento pubblico, lasciando gli italiani in perenne oscillazione tra la ricerca di un "salvatore della patria" e la sfiducia nelle istituzioni.',
    relatedAuthorIds: ['bettino-craxi', 'machiavelli', 'pasolini'],
  },
  {
    id: 'chernobyl-bugie-burocrazia',
    category: 'Cosmo, Scienza & Paradossi',
    question:
      'Il Disastro di Černobyl’ (1986): come un test sulla sicurezza fatto di notte e il culto burocratico del "va tutto benissimo" fecero implodere un impero?',
    satiricalHook:
      'Il paradosso definitivo del Novecento: il più grave incidente nucleare della storia è avvenuto proprio mentre stavano eseguendo un test per verificare i sistemi di sicurezza.',
    wikiPageTitle: 'Disastro_di_Černobyl%27',
    protagonistName: 'Emil Cioran',
    protagonistWikiTitle: 'Disastro_di_Černobyl%27',
    epochId: 'contemporanea',
    periodLabel: 'Ucraina (URSS), 26 aprile 1986 AD',
    whyItHappenedContext:
      'Nella notte del 26 aprile 1986 gli operatori del reattore 4 disattivarono i sistemi di emergenza per completare a tutti i costi un test rimandato dal turno del pomeriggio. Quando premettero il pulsante di spegnimento rapido (AZ-5), un difetto delle barre di controllo in grafite — che il governo sovietico conosceva ma teneva segreto agli stessi ingegneri per non ammettere errori — fece schizzare la potenza a cento volte il normale, facendo saltare in aria il tetto da 2.000 tonnellate.',
    presentRepercussionsContext:
      'Cosa resta oggi: come ammise lo stesso Gorbačëv, Černobyl’ fu la vera causa del crollo dell’URSS cinque anni dopo perché dimostrò che il segreto burocratico uccide più dell’atomo; in Italia portò al referendum del 1987 che chiuse le centrali nucleari, tema ancora oggi al centro del dibattito energetico.',
    relatedAuthorIds: ['cioran', 'primo-levi', 'arendt'],
  },
  {
    id: 'banalita-del-male-novecento',
    category: 'Geopolitica, Guerre & Segreti del ’900',
    question:
      'La "Banalità del Male" (1933-1945): perché il male più atroce del Novecento non è stato compiuto da fanatici urlanti ma da impiegati puntuali che timbravano il cartellino?',
    satiricalHook:
      'La scoperta più inquietante di Hannah Arendt: i peggiori disastri della storia moderna li organizzano funzionari educati che la sera tornano a casa ad annaffiare i gerani sul balcone.',
    wikiPageTitle: 'La_banalità_del_male',
    protagonistName: 'Hannah Arendt',
    protagonistWikiTitle: 'Hannah_Arendt',
    epochId: 'contemporanea',
    periodLabel: 'Europa, 1933 AD – 1961 AD',
    whyItHappenedContext:
      'Dopo la crisi economica del 1929, il totalitarismo non si impose solo con la violenza, ma spezzando la responsabilità individuale in mille piccoli ingranaggi burocratici: chi compilava gli elenchi anagrafici, chi calcolava gli orari dei treni e chi firmava i moduli diceva a sé stesso «io eseguo solo il mio pezzetto di regolamento». Quando si smette di pensare al significato di ciò che si fa, qualunque mostruosità diventa normale amministrazione.',
    presentRepercussionsContext:
      'Cosa resta oggi: dal diritto internazionale di Norimberga (che stabilì che "aver obbedito agli ordini" non cancella mai la colpa penale) fino agli esperimenti psicologici di Milgram sull’obbedienza cieca all’autorità.',
    relatedAuthorIds: ['arendt', 'primo-levi', 'simone-weil'],
  },
  {
    id: 'processo-socrate-giordano-bruno',
    category: 'Cosmo, Scienza & Paradossi',
    question:
      'Da Socrate (399 a.C.) a Giordano Bruno e Galileo (1600-1633): perché chi fa troppe domande finisce sempre per dare fastidio al potere di turno?',
    satiricalHook:
      'Nel Seicento alcuni professori universitari si rifiutarono persino di appoggiare l’occhio al cannocchiale di Galileo per non rischiare di vedere i satelliti di Giove e dover buttare via i propri libri di testo.',
    wikiPageTitle: 'Processo_di_Socrate',
    protagonistName: 'Socrate',
    protagonistWikiTitle: 'Socrate',
    epochId: 'antichita',
    periodLabel: '399 a.C. & 1600-1633 AD',
    whyItHappenedContext:
      'Che si tratti dell’Atene democratica appena uscita sconfitta dalla guerra contro Sparta o dell’Europa della Controriforma spaventata dalla perdita del centro cosmico, i poteri in crisi reagiscono sempre allo stesso modo: cercano di chiudere la bocca a chi mette in discussione le certezze ufficiali.',
    presentRepercussionsContext:
      'Cosa resta oggi: il metodo scientifico moderno, la libertà accademica e il principio costituzionale secondo cui nessuna maggioranza può stabilire per legge quale sia la verità scientifica o filosofica.',
    relatedAuthorIds: ['socrate', 'giordano-bruno', 'spinoza'],
  },
  {
    id: 'caso-moro-falcone-misteri-italiani',
    category: 'Geopolitica, Guerre & Segreti del ’900',
    question:
      'Dal Caso Moro (1978) alla Strage di Capaci (1992): perché l’Italia tra anni ’70 e ’90 è stata il laboratorio più complesso della Guerra Fredda?',
    satiricalHook:
      'Un Paese di confine in cui ogni volta che qualcuno provava a spostare gli equilibri o a controllare i conti correnti giusti, la storia prendeva improvvisamente una deviazione drammatica.',
    wikiPageTitle: 'Caso_Moro',
    protagonistName: 'Giovanni Falcone',
    protagonistWikiTitle: 'Giovanni_Falcone',
    epochId: 'contemporanea',
    periodLabel: 'Italia, 1978 AD – 1992 AD',
    whyItHappenedContext:
      'Stretta al confine tra blocco NATO e Patto di Varsavia, l’Italia ha vissuto nel 1978 il rapimento e l’uccisione di Aldo Moro (proprio il giorno in cui nasceva il governo di solidarietà nazionale) e nel 1992 l’attacco frontale di Cosa Nostra contro Giovanni Falcone e Paolo Borsellino, colpevoli di aver scoperto che per battere la mafia non bastavano le retate ma bisognava tracciare i flussi bancari e gli appalti.',
    presentRepercussionsContext:
      'Cosa resta oggi: l’eredità del metodo investigativo finanziario di Falcone (oggi adottato dall’FBI e in tutta Europa contro il riciclaggio internazionale) e le leggi sul 41-bis e sui beni confiscati.',
    relatedAuthorIds: ['giovanni-falcone', 'aldo-moro', 'pasolini'],
  },
];
