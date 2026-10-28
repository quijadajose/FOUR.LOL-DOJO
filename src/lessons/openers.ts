import type { LessonDefinition } from '../engine/types.ts';
import { compileMultiStageSteps } from './lessonBuilder.ts';

export const OPENER_LESSONS: LessonDefinition[] = [
  // 1. C-SPIN OPENER
  {
    id: 'c-spin-opener',
    title: 'C-Spin Opener',
    jpTitle: 'TKI積み (開幕C-Spin)',
    category: 'openers',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/triple-double#opening-c-spin',
    summary: 'El clásico opener TST → B2B TSD desde tablero vacío que envía 11 líneas de ataque explosivo.',
    theory:
      'El C-Spin apila una cueva de T-Spin Triple debajo de una ranura de T-Spin Double coronada por un techo en forma de "C". Tras limpiar las 3 filas del TST, el techo cae exactamente a la altura necesaria para encadenar un TSD Back-to-Back inmediato.',
    whenToUse:
      'Al inicio de partida cuando quieres abrir con presión ofensiva pesada (TST + B2B TSD = 11 de daño base) manteniendo una superficie plana.',
    keyTip:
      'Para el TST: gira la primera T antihorario (Z), déjala bajar hasta tocar base (↓) y pulsa dos veces giro horario (↑/X) para activar el 5º kick SRS (-1, -2). Para el TSD siguiente: Z → bajar al fondo → Z.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '........L.',
          'S......IL.',
          'SS....TILL',
          'JS.ZZTTIOO',
          'JJJ.ZZTIOO',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'Base izquierda con J plana' },
          { token: 'S', piece: 'S', hint: 'Apoya S vertical sobre J' },
          { token: 'Z', piece: 'Z', hint: 'Z crea el hueco inferior del futuro TSD en col 3' },
          { token: 'T', piece: 'T', hint: 'T vertical forma el escalón medio del TST' },
          { token: 'O', piece: 'O', hint: 'Bloque O en la esquina derecha' },
          { token: 'I', piece: 'I', hint: 'I vertical en columna 7' },
          { token: 'L', piece: 'L', hint: 'L vertical sobre O' },
        ],
      },
      {
        diagramTopDown: [
          'I.........',
          'I.........',
          'IJJ..aaaLL',
          'IJ...aSS#L',
          '#JTZZSS##L',
          '##TTZZ####',
          '##T#######',
          '###.######',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'J crea el techo en forma de C sobre columna 2' },
          { token: 'I', piece: 'I', hint: 'I vertical cierra la pared izquierda' },
          { token: 'Z', piece: 'Z', hint: 'Z cierra el techo interno del TST' },
          { token: 'S', piece: 'S', hint: 'S nivela la plataforma derecha' },
          { token: 'L', piece: 'L', hint: 'L completa la columna 9' },
          { token: 'a', piece: 'L', hint: 'L forma la pared derecha del canal de entrada' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TST',
            hint: '¡Ejecuta el T-Spin Triple del C-Spin!',
            spinInstruction: 'Z (↺) → bajar hasta tocar base (↓) → ↑/X dos veces (↻, ↻) para encajar el kick (-1, -2).',
          },
        ],
      },
      {
        diagramTopDown: [
          '#.........',
          '#.........',
          '###..#####',
          '##TTT#####',
          '###T######',
        ],
        specs: [
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Remata el C-Spin con el Back-to-Back T-Spin Double!',
            spinInstruction: 'Z (↺) → bajar al fondo (↓) → Z (↺).',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Completa la secuencia C-Spin: T-Spin Triple (TST) → B2B T-Spin Double (TSD).',
    goal: { requiredClears: ['TST', 'TSD'] },
  },

  // 2. TKI 3 (CASTLE TOP)
  {
    id: 'tki-castle',
    title: 'TKI 3 (Castle Top)',
    jpTitle: '開幕TSD (城型)',
    category: 'openers',
    difficulty: 1,
    fourLolUrl: 'https://four.lol/openers/tki',
    summary: 'El opener más popular de Tetris competitivo: envía un TSD rapidísimo con tu primera bolsa usando I temprana.',
    theory:
      'TKI coloca la pieza I horizontal en el suelo (cols 3-6) y construye un techo simétrico con S y Z ("Castle Top"). Es seguro contra ataques tempranos, no desperdicia piezas y fluye de forma natural hacia cadenas de TSD Back-to-Back o Perfect Clears.',
    whenToUse: 'Siempre que recibas una pieza I temprano en la primera bolsa.',
    keyTip: 'Deja la columna 2 libre sobre el suelo y usa Z en (3,2)-(5,1) para formar el alero del T-Spin Double.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '.....S....',
          'L..ZZSS.OO',
          'LTTTZZSJOO',
          'LLTIIIIJJJ',
        ],
        specs: [
          { token: 'I', piece: 'I', hint: 'I horizontal centrada en cols 3-6' },
          { token: 'L', piece: 'L', hint: 'L vertical apoyada en pared izquierda' },
          { token: 'J', piece: 'J', hint: 'J plana en cols 7-9' },
          { token: 'O', piece: 'O', hint: 'O sobre el lado derecho de J' },
          { token: 'Z', piece: 'Z', hint: 'Z crea el alero del TSD' },
          { token: 'S', piece: 'S', hint: 'S vertical corona el Castle Top' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Gira T bajo el alero Z para enviar el TSD de apertura!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Ejecuta el T-Spin Double (TSD) inicial de TKI 3.',
    goal: { requiredClears: ['TSD'] },
  },

  // 3. TKI (FONZIE / SAKANA BASE)
  {
    id: 'tki-fonzie',
    title: 'TKI 3 (Fonzie Variant)',
    jpTitle: '開幕TSD (Fonzie型)',
    category: 'openers',
    difficulty: 1,
    fourLolUrl: 'https://four.lol/openers/tki',
    summary: 'Variante ultra flexible de TKI con O y J a la derecha que deja una plataforma limpia de 5 columnas.',
    theory:
      'A diferencia de Castle Top, la variante Fonzie agrupa J y O formando un bloque compacto en las columnas 5 a 9 y apila S+Z en el centro-izquierda. Esto deja el lado derecho totalmente libre tras el primer TSD para continuar con LST Stacking.',
    whenToUse: 'Con I temprana cuando O llega antes que J o cuando prefieres transicionar a LST Stacking.',
    keyTip: 'Coloca S vertical en cols 3-4 creando el alero izquierdo del TSD y refuerza con Z encima.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '...SZZ....',
          'L..SSZZ...',
          'LTTTSJJJOO',
          'LLTIIIIJOO',
        ],
        specs: [
          { token: 'I', piece: 'I', hint: 'I en el suelo (cols 3-6)' },
          { token: 'L', piece: 'L', hint: 'L en pared izquierda' },
          { token: 'O', piece: 'O', hint: 'O en la esquina derecha (cols 8-9)' },
          { token: 'J', piece: 'J', hint: 'J puenteando I y O' },
          { token: 'S', piece: 'S', hint: 'S vertical forma el alero del TSD' },
          { token: 'Z', piece: 'Z', hint: 'Z horizontal estabiliza el techo' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Gira T en la ranura para el TSD Fonzie!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Completa el T-Spin Double de TKI Fonzie.',
    goal: { requiredClears: ['TSD'] },
  },

  // 4. DT CANNON OPENER
  {
    id: 'dt-cannon-opener',
    title: 'DT Cannon',
    jpTitle: 'DT砲 (Double Triple Cannon)',
    category: 'openers',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/dt-cannon',
    summary: 'El legendario cañón TSD → B2B TST: limpia un T-Spin Double superior que destapa un T-Spin Triple inferior.',
    theory:
      'DT Cannon construye la cueva inferior del TST y el TSD intermedio al mismo tiempo durante las primeras dos bolsas. El TSD limpia las filas 1 y 2, haciendo caer el techo superior a la posición exacta para patear la siguiente T en un TST devastador.',
    whenToUse: 'Cuando tienes inicio temprano de L/J o L/S y quieres enviar 11 líneas de golpe (TSD + B2B TST) con opción a bucle de C-Spin.',
    keyTip: 'Primero encaja el TSD intermedio girando T bajo el alero; inmediatamente después usa doble rotación en la segunda T para el kick (-1,-2) / (+1,-2) del TST.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'LLL.....S.',
          'LOO.T...SS',
          'JOOTTT.ZZS',
          'JJJIIII.ZZ',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'J en esquina izquierda' },
          { token: 'I', piece: 'I', hint: 'I horizontal en cols 3-6 dejando col 7 libre' },
          { token: 'O', piece: 'O', hint: 'O sobre J' },
          { token: 'L', piece: 'L', hint: 'L cerrando la torre izquierda' },
          { token: 'T', piece: 'T', hint: 'Primera T plana en la pila para nivelar' },
          { token: 'Z', piece: 'Z', hint: 'Z a la derecha dejando el pozo en col 7' },
          { token: 'S', piece: 'S', hint: 'S vertical en cols 8-9' },
        ],
      },
      {
        diagramTopDown: [
          '...Z...LLI',
          'OOZZ....LI',
          'OOZJJSS.LI',
          '###JSS..#I',
          '###J#TTT##',
          '######T###',
          '#######.##',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'J nivela el centro-izquierda' },
          { token: 'O', piece: 'O', hint: 'O en columnas 0-1' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical sobre J' },
          { token: 'S', piece: 'S', hint: 'S crea el alero izquierdo del TSD' },
          { token: 'I', piece: 'I', hint: 'I vertical en columna 9' },
          { token: 'L', piece: 'L', hint: 'L forma el doble alero para el futuro TST' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Dispara el primer cañonazo: T-Spin Double!',
          },
        ],
      },
      {
        diagramTopDown: [
          '...#...###',
          '####....##',
          '#######.##',
          '######.T##',
          '######TT##',
          '#######T##',
        ].length < 0
          ? []
          : [
              '...#...###',
              '####....##',
              '#######T##',
              '######TT##',
              '#######T##',
            ],
        specs: [
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TST',
            hint: '¡Segundo cañonazo: patea la T al fondo para el B2B T-Spin Triple!',
            spinInstruction: 'Gira horario (↑/X), baja a la entrada y pulsa dos veces antihorario (Z, Z) para el kick (+1, -2).',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Ejecuta el combo completo: T-Spin Double (TSD) → B2B T-Spin Triple (TST).',
    goal: { requiredClears: ['TSD', 'TST'] },
  },

  // 5. PERFECT CLEAR OPENER (PCO)
  {
    id: 'pco',
    title: 'Perfect Clear Opener (PCO)',
    jpTitle: 'パフェクリテンプレ',
    category: 'openers',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/perfect-clears/opener',
    summary: 'El opener clásico de Perfect Clear de 4 líneas con 84.64% de éxito cuando tienes I en Hold.',
    theory:
      'PCO construye una caja 4×4 sólida a la izquierda con I, J, L, O y un triángulo S, Z, T a la derecha. Solo quedan 3 piezas por colocar de la segunda bolsa en el hueco central de 12 celdas para vaciar todo el tablero y enviar 10 líneas instantáneas.',
    whenToUse: 'Al abrir la partida cuando I, J, L, O permiten armar el bloque izquierdo limpio.',
    keyTip: 'Memoriza el bloque izquierdo (I vertical + O + J + L) y el bloque derecho (Z + S + T vertical contra la pared).',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'IJJJ....SS',
          'IOOJ...SST',
          'IOOL..ZZTT',
          'ILLL...ZZT',
        ],
        specs: [
          { token: 'L', piece: 'L', hint: 'L en la base del bloque izquierdo' },
          { token: 'O', piece: 'O', hint: 'O en el corazón del bloque 4×4' },
          { token: 'J', piece: 'J', hint: 'J cierra el techo del bloque 4×4' },
          { token: 'I', piece: 'I', hint: 'I vertical sella la columna 0' },
          { token: 'Z', piece: 'Z', hint: 'Z inicia la estructura derecha' },
          { token: 'T', piece: 'T', hint: 'T vertical pegada a la pared derecha' },
          { token: 'S', piece: 'S', hint: 'S corona el triángulo derecho' },
        ],
      },
      {
        diagramTopDown: [
          '####....##',
          '####...###',
          '####J.####',
          '####JJJ###',
        ],
        specs: [
          {
            token: 'J',
            piece: 'J',
            role: 'attack',
            expectedClear: 'SINGLE',
            hint: 'J rellena la base central limpiando 1 línea',
          },
        ],
      },
      {
        diagramTopDown: [
          '####....##',
          '####TTT###',
          '#####T####',
        ],
        specs: [
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'DOUBLE',
            hint: 'T encaja en el hueco central limpiando 2 líneas',
          },
        ],
      },
      {
        diagramTopDown: [
          '####IIII##',
        ],
        specs: [
          {
            token: 'I',
            piece: 'I',
            role: 'attack',
            expectedClear: 'SINGLE',
            hint: '¡Cierra la última fila con I para lograr el Perfect Clear!',
          },
        ],
      },
    ]),
    preloadCount: 7,
    goalDescription: 'Vacía completamente el tablero logrando un Perfect Clear (All Clear).',
    goal: { requirePerfectClear: true },
  },

  // 6. HACHISPIN (EXACT FOUR.LOL FUMEN)
  {
    id: 'hachispin',
    title: 'Hachispin',
    jpTitle: 'にはち砲',
    category: 'openers',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/openers/hachispin',
    summary: 'Opener agresivo TSS → B2B TST creado por hachispin con altísima probabilidad de Perfect Clear en bolsa 3.',
    theory:
      'Hachispin aprovecha una O temprana para ejecutar un T-Spin Single rápido en la primera bolsa que alinea un T-Spin Triple en la segunda bolsa, dejando un residuo limpio de 14 minos ideal para un Perfect Clear de 8 líneas.',
    whenToUse: 'Cuando recibes O temprana en la primera bolsa y buscas una ruta rápida hacia TST → PC.',
    keyTip: 'El TSS de la primera bolsa construye la base del TST: en la segunda bolsa patea la T con giro antihorario/horario al hueco de la columna 1-2.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '......Z...',
          'I....ZZ...',
          'I.JJJZTTT.',
          'ILLLJOOTSS',
          'IL...OOSS.',
        ],
        specs: [
          { token: 'O', piece: 'O', hint: 'O temprana en cols 5-6' },
          { token: 'L', piece: 'L', hint: 'L formando el puente izquierdo' },
          { token: 'I', piece: 'I', hint: 'I vertical en columna 0' },
          { token: 'S', piece: 'S', hint: 'S en la esquina derecha' },
          { token: 'J', piece: 'J', hint: 'J sobre L y O' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical crea el alero del TSS' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSS',
            hint: '¡Gira T para limpiar el T-Spin Single de preparación!',
          },
        ],
      },
      {
        diagramTopDown: [
          'JJ.....I..',
          'J....SSIOO',
          'JTZZSS#IOO',
          '#TTZZ##ILL',
          '#T#######L',
          '##...####L',
        ],
        specs: [
          { token: 'L', piece: 'L', hint: 'L vertical en columna 9' },
          { token: 'I', piece: 'I', hint: 'I vertical en columna 7' },
          { token: 'O', piece: 'O', hint: 'O sobre L' },
          { token: 'Z', piece: 'Z', hint: 'Z cierra la cavidad TST' },
          { token: 'S', piece: 'S', hint: 'S apoya el lado derecho' },
          { token: 'J', piece: 'J', hint: 'J crea el alero del TST en col 1' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TST',
            hint: '¡Ejecuta el B2B T-Spin Triple de Hachispin!',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Completa el T-Spin Triple característico de Hachispin (TSS → TST en modo guiado).',
    goal: { requiredClears: ['TST'] },
  },

  // 7. MKO OPENER (EXACT FOUR.LOL FUMEN)
  {
    id: 'mko',
    title: 'MKO Opener',
    jpTitle: 'MKO積み',
    category: 'openers',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/openers/mko',
    summary: 'Apilado simétrico con T en Hold que permite encadenar TSDs centrales o buscar un Perfect Clear del 33%.',
    theory:
      'Con L y J tempranas en el suelo dejando la columna 3 abierta, MKO construye una copa central con S y Z mientras guarda T en Hold. Esto permite disparar dos TSD consecutivos directamente en la columna central.',
    whenToUse: 'Cuando recibes J y L temprano en la primera bolsa.',
    keyTip: 'Guarda la primera T para usarla apenas Z y S formen el alero sobre la columna 3.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'S.....Z..I',
          'SS...ZZ..I',
          'JS...ZLOOI',
          'JJJ.LLLOOI',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'J plana a la izquierda' },
          { token: 'L', piece: 'L', hint: 'L plana dejando col 3 libre' },
          { token: 'O', piece: 'O', hint: 'O en cols 7-8' },
          { token: 'I', piece: 'I', hint: 'I vertical en col 9' },
          { token: 'S', piece: 'S', hint: 'S vertical en cols 0-1' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical sobre L' },
        ],
      },
      {
        diagramTopDown: [
          '.....Z....',
          '#...ZZ#..#',
          '##..Z##..#',
          '##TTT#####',
          '###T######',
        ],
        specs: [
          { token: 'Z', piece: 'Z', hint: '2ª Z crea el alero sobre columna 4 para el TSD' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Gira la T guardada bajo Z para el primer TSD de MKO!',
          },
        ],
      },
    ]),
    preloadCount: 7,
    goalDescription: 'Construye la copa MKO y ejecuta el T-Spin Double central.',
    goal: { requiredClears: ['TSD'] },
  },

  // 8. BT CANNON (EXACT FOUR.LOL FUMEN)
  {
    id: 'bt-cannon',
    title: 'BT Cannon',
    jpTitle: 'BT砲 (Beta Cannon)',
    category: 'openers',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/methods/bt-cannon',
    summary: 'Variante avanzada del DT Cannon creada por 26_nameless que desplaza el TSD 1 columna para enlazar con C-Spin → PC.',
    theory:
      'En BT Cannon, el TSD superior está centrado en la columna 6 mientras que la cueva TST inferior está en la columna 7. Este desfase de 1 columna deja un residuo mucho más limpio que el DT Cannon tradicional, facilitando continuar en un bucle C-Spin → Perfect Clear.',
    whenToUse: 'Alternativa moderna a DT Cannon cuando quieres continuar la presión en bolsa 3 y 4 con C-Spin.',
    keyTip: 'El TSD inicial limpia las filas 1-2 sin alero derecho, usando el alero izquierdo creado por S en columna 5.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'LLL.....S.',
          'LOO.T...SS',
          'JOOTTT.ZZS',
          'JJJIIII.ZZ',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'J base izquierda' },
          { token: 'I', piece: 'I', hint: 'I en cols 3-6' },
          { token: 'O', piece: 'O', hint: 'O sobre J' },
          { token: 'L', piece: 'L', hint: 'L sobre O' },
          { token: 'T', piece: 'T', hint: 'T plana en el centro' },
          { token: 'Z', piece: 'Z', hint: 'Z en la derecha' },
          { token: 'S', piece: 'S', hint: 'S vertical sobre Z' },
        ],
      },
      {
        diagramTopDown: [
          '...Z...LLI',
          'OOZZ....LI',
          'OOZJJSS.LI',
          '###JSS..#I',
          '###J#TTT##',
          '######T###',
          '#######.##',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'J sobre T' },
          { token: 'O', piece: 'O', hint: 'O a la izquierda' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical' },
          { token: 'S', piece: 'S', hint: 'S forma el alero del TSD en col 5' },
          { token: 'I', piece: 'I', hint: 'I vertical en col 9' },
          { token: 'L', piece: 'L', hint: 'L prepara el alero del TST en col 7' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Ejecuta el TSD desplazado de BT Cannon!',
          },
        ],
      },
      {
        diagramTopDown: [
          '...#...###',
          '####....##',
          '#######T##',
          '######TT##',
          '#######T##',
        ],
        specs: [
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TST',
            hint: '¡Patea la siguiente T en el B2B TST!',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Completa la secuencia BT Cannon: TSD → B2B TST.',
    goal: { requiredClears: ['TSD', 'TST'] },
  },

  // 9. MR. T-SPIN'S STD (EXACT FOUR.LOL FUMEN)
  {
    id: 'mr-tspin-std',
    title: "Mr. T-Spin's STD",
    jpTitle: 'Mr.T-SpinのSTD (TSS→TST→TSD)',
    category: 'openers',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/openers/mr-tspin',
    summary: 'Opener "Single-Triple-Double" (TSS → TST → TSD) para aperturas tempranas con S, Z y O.',
    theory:
      'Diseñado por Mr. T-Spin para resolver bolsas difíciles con S y Z tempranas. Envía un TSS en bolsa 1, un TST en bolsa 2 mientras pre-construye con L el techo del TSD de bolsa 3, manteniendo Back-to-Back ininterrumpido.',
    whenToUse: 'Cuando tu primera bolsa empieza con S, Z y O tempranas.',
    keyTip: 'Observa cómo la pieza L en las columnas 8-9 durante la segunda bolsa queda suspendida tras el TST para servir de techo del TSD final.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '.........I',
          '....J....I',
          '....J....I',
          'L..JJ..Z.I',
          'LTTTSSZZOO',
          'LLTSS.Z.OO',
        ],
        specs: [
          { token: 'O', piece: 'O', hint: 'O en esquina inferior derecha' },
          { token: 'L', piece: 'L', hint: 'L en pared izquierda' },
          { token: 'S', piece: 'S', hint: 'S en cols 3-5' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical junto a O' },
          { token: 'I', piece: 'I', hint: 'I vertical sobre O en col 9' },
          { token: 'J', piece: 'J', hint: 'J vertical crea el alero del TSS' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSS',
            hint: '¡Ejecuta el TSS de apertura!',
          },
        ],
      },
      {
        diagramTopDown: [
          '........L.',
          '........L.',
          '........LL',
          '.OO......#',
          'SOOZ#IJJT#',
          'SSZZ#IJTT#',
          '#SZ##IJ#T#',
          '#####I#.##',
        ],
        specs: [
          { token: 'I', piece: 'I', hint: 'I vertical rellena la columna 5' },
          { token: 'J', piece: 'J', hint: 'J forma la pared interna del TST' },
          { token: 'Z', piece: 'Z', hint: 'Z sobre la izquierda' },
          { token: 'S', piece: 'S', hint: 'S junto a Z' },
          { token: 'O', piece: 'O', hint: 'O corona la pila izquierda' },
          { token: 'L', piece: 'L', hint: 'L en cols 8-9 crea el alero del TST y futuro TSD' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TST',
            hint: '¡Patea la T hacia la derecha para el B2B TST!',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Ejecuta el T-Spin Triple de Mr. T-Spin STD (TSS → TST en modo guiado).',
    goal: { requiredClears: ['TST'] },
  },

  // 10. ALBATROSS SPECIAL (EXACT FOUR.LOL FUMEN)
  {
    id: 'albatross',
    title: 'Albatross Special',
    jpTitle: 'アルバトロスSP',
    category: 'openers',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/openers/albatross',
    summary: 'El famoso opener "pájaro" de velocidad: Air-TSD (bolsa 1) → TST (bolsa 2) → TSD o PC (bolsa 3).',
    theory:
      'Albatross ejecuta un TSD aéreo en las filas 1 y 2 durante la primera bolsa, dejando una muesca asimétrica perfecta para un TST rapidísimo en la segunda bolsa y una cueva TSD natural en la tercera.',
    whenToUse: 'Cuando tienes O temprana y dominas los giros con soft-drop rápido.',
    keyTip: 'En la primera bolsa el TSD ocurre a 1 fila sobre el suelo; tras el TST de la segunda bolsa queda un hueco TSD automático en columna 3.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '...ZZ....I',
          'STTTZZJJJI',
          'SSTOOLLLJI',
          '.S.OOL...I',
        ],
        specs: [
          { token: 'O', piece: 'O', hint: 'O temprana en cols 3-4' },
          { token: 'L', piece: 'L', hint: 'L puenteando cols 5-7' },
          { token: 'I', piece: 'I', hint: 'I vertical en col 9' },
          { token: 'J', piece: 'J', hint: 'J sobre L' },
          { token: 'S', piece: 'S', hint: 'S vertical en cols 0-1' },
          { token: 'Z', piece: 'Z', hint: 'Z forma el alero aéreo sobre col 3' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Ejecuta el Air-TSD de Albatross en las filas 1-2!',
          },
        ],
      },
      {
        diagramTopDown: [
          '..LL.Z....',
          '...LZZ....',
          'JJTLZSIIII',
          'JTT##SSOO#',
          'J#T###SOO#',
        ],
        specs: [
          { token: 'O', piece: 'O', hint: 'O en cols 7-8' },
          { token: 'S', piece: 'S', hint: 'S vertical en cols 5-6' },
          { token: 'I', piece: 'I', hint: 'I horizontal sobre S y O' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical sobre el centro' },
          { token: 'J', piece: 'J', hint: 'J vertical en cols 0-1' },
          { token: 'L', piece: 'L', hint: 'L construye el techo TST y el futuro TSD' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TST',
            hint: '¡Patea la T para el B2B TST de Albatross!',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Ejecuta el TST de Albatross Special (Air-TSD → TST en modo guiado).',
    goal: { requiredClears: ['TST'] },
  },

  // 11. PRACTICAL OPENERS (EARLY O / PELICAN TSD)
  {
    id: 'practical-openers',
    title: 'Practical Opener (Early O / L)',
    jpTitle: '開幕実戦TSD (O早い順)',
    category: 'openers',
    difficulty: 1,
    fourLolUrl: 'https://four.lol/openers/practical-openers',
    summary: 'Apertura práctica de TSD cuando I llega tarde pero cuentas con O, J y L tempranas.',
    theory:
      'No siempre tendrás una I temprana para TKI. La guía de Practical Openers de four.lol enseña a usar O en la esquina junto con L/J planas para armar un TSD seguro en la primera bolsa sin depender del orden de I.',
    whenToUse: 'Cuando I viene al final de tu primera bolsa y O + J/L salen primero.',
    keyTip: 'Usa O en columnas 0-1 como pilar sólido y proyecta Z sobre la columna 2 para asegurar tu TSD inicial.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '..ZZ...S..',
          '..JZZ..SS.',
          'OOJJJTTTSL',
          'OOIIIITLLL',
        ],
        specs: [
          { token: 'O', piece: 'O', hint: 'O temprana asegura las columnas 0-1' },
          { token: 'L', piece: 'L', hint: 'L plana en la esquina derecha dejando col 6 libre' },
          { token: 'I', piece: 'I', hint: 'I conecta O con el pozo TSD' },
          { token: 'J', piece: 'J', hint: 'J nivela las columnas 2-4 sobre I' },
          { token: 'Z', piece: 'Z', hint: 'Z mantiene plana la pila izquierda' },
          { token: 'S', piece: 'S', hint: 'S vertical rellena (8,1) y crea el alero del TSD' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Gira T bajo S para completar el TSD práctico!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Completa el T-Spin Double de apertura con O temprana.',
    goal: { requiredClears: ['TSD'] },
  },
];
