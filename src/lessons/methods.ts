import type { LessonDefinition } from '../engine/types.ts';
import { compileMultiStageSteps } from './lessonBuilder.ts';

export const METHOD_LESSONS: LessonDefinition[] = [
  // 12. C-SPIN / TRIPLE DOUBLE (MID-GAME) — FEATURED!
  {
    id: 'c-spin-midgame',
    title: 'C-Spin / Triple Double',
    jpTitle: 'TDアタック (中盤C-Spin)',
    category: 'methods',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/triple-double',
    summary: 'Plantilla de medio juego lista para practicar el giro C-Spin (TST → B2B TSD) de forma inmediata.',
    theory:
      'El Triple Double (conocido como C-Spin por la silueta en "C" de su techo) es uno de los ataques más letales de medio juego. Cubre una cueva TST con un alero doble que deja preparada arriba una cavidad TSD lista para encadenar 11 líneas de ataque.',
    whenToUse:
      'En medio juego cuando tienes desnivel favorable sobre un hueco único y dos piezas T cercanas en tu cola.',
    keyTip:
      'Con la plantilla lista: 1ª T → pulsa Z (↺), baja hasta tocar la base (↓) y pulsa dos veces ↑/X (↻, ↻) para patear al TST. 2ª T → Z (↺), bajar al fondo (↓) y Z (↺) para el TSD.',
    initialBoardTopDown: [
      '##......##',
      '##.#######',
      '##..######',
      '##.#######',
      '###.######',
    ],
    steps: compileMultiStageSteps(
      [
        '##......##',
        '##.#######',
        '##..######',
        '##.#######',
        '###.######',
      ],
      [
        {
          diagramTopDown: [
            'ZZ........',
            '.ZZ..J....',
            '##...JJJ##',
            '##.#######',
            '##..######',
            '##.#######',
            '###.######',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z construye el alero en forma de C sobre columna 2' },
            { token: 'J', piece: 'J', hint: 'J cierra la fila superior del TSD y levanta el tope en col 5' },
          ],
        },
        {
          diagramTopDown: [
            '##........',
            '.##..#....',
            '##...#####',
            '##T#######',
            '##TT######',
            '##T#######',
            '###.######',
          ],
          specs: [
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TST',
              hint: '¡1ª T: patea dentro de la cueva para el T-Spin Triple!',
              spinInstruction: 'Z (↺) → bajar hasta tocar base (↓) → ↑/X dos veces (↻, ↻).',
            },
          ],
        },
        {
          diagramTopDown: [
            '##........',
            '.##..#....',
            '##TTT#####',
            '###T######',
          ],
          specs: [
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡2ª T: remata con el Back-to-Back T-Spin Double!',
              spinInstruction: 'Z (↺) → bajar al fondo (↓) → Z (↺).',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Ejecuta el C-Spin completo: T-Spin Triple (TST) → B2B T-Spin Double (TSD).',
    goal: { requiredClears: ['TST', 'TSD'] },
  },

  // 13. T-SPIN TRIPLE (TST BASIC)
  {
    id: 'tst-basic',
    title: 'T-Spin Triple (TST)',
    jpTitle: 'Tスピントリプル',
    category: 'methods',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/methods/tspin-triple',
    summary: 'Domina la construcción del techo TST y el famoso 5º kick SRS (±1, -2) para limpiar 3 líneas con una T.',
    theory:
      'Un T-Spin Triple envía 6 líneas de ataque base (7 con Back-to-Back). Funciona gracias al quinto desplazamiento de la tabla SRS de JLSTZ: cuando una T intenta girar bajo un alero bloqueado arriba y a los lados, el motor la desplaza 1 columna lateralmente y 2 filas hacia abajo.',
    whenToUse: 'Cuando tienes una pared vertical de 2 bloques junto a un pozo de 1 columna y puedes colocar un alero 2 filas arriba.',
    keyTip: 'Gira antihorario (Z), baja hasta apoyarte junto al alero y pulsa dos veces giro horario (↑/X, ↑/X).',
    initialBoardTopDown: [
      '##.....###',
      '##.#######',
      '##..######',
      '##.#######',
    ],
    steps: compileMultiStageSteps(
      [
        '##.....###',
        '##.#######',
        '##..######',
        '##.#######',
      ],
      [
        {
          diagramTopDown: [
            'ZZ........',
            '.ZZ..OO...',
            '##...OO###',
            '##T#######',
            '##TT######',
            '##T#######',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z proyecta el techo TST sobre la columna 2' },
            { token: 'O', piece: 'O', hint: 'O forma la pared opuesta de apoyo en columna 5' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TST',
              hint: '¡Ejecuta el kick (-1, -2) para el T-Spin Triple!',
              spinInstruction: 'Z (↺) → bajar (↓) → ↑/X, ↑/X (↻, ↻).',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Limpia las 3 líneas mediante un T-Spin Triple (TST).',
    goal: { requiredClears: ['TST'] },
  },

  // 14. MID-GAME DT CANNON
  {
    id: 'dt-cannon-midgame',
    title: 'Mid-game DT Cannon',
    jpTitle: '中盤DT砲',
    category: 'methods',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/dt-cannon#mid-game-dt',
    summary: 'Construye un DT Cannon (TSD → B2B TST) sobre un pozo abierto a mitad de partida.',
    theory:
      'El DT Cannon de medio juego intercala un TSD en las filas intermedias sobre la cueva inferior del TST. Al limpiar las 2 líneas del TSD, el techo alto (L) desciende exactamente a su posición para habilitar el TST inmediatamente después.',
    whenToUse: 'Cuando tu pozo lateral tiene un escalón interno y quieres convertirlo en 11 líneas de daño (TSD + B2B TST).',
    keyTip: 'Construye tanto el alero bajo (S) como el alero alto (L) antes de lanzar tu primera T.',
    initialBoardTopDown: [
      '#####.....',
      '####....#.',
      '#####...##',
      '######.###',
      '#######.##',
    ],
    steps: compileMultiStageSteps(
      [
        '#####.....',
        '####....#.',
        '#####...##',
        '######.###',
        '#######.##',
      ],
      [
        {
          diagramTopDown: [
            '.......LLI',
            '........LI',
            '#####SS.LI',
            '####SS..#I',
            '#####...##',
            '######.###',
            '#######.##',
          ],
          specs: [
            { token: 'I', piece: 'I', hint: 'I vertical eleva la pared derecha en col 9' },
            { token: 'L', piece: 'L', hint: 'L prepara arriba el alero del futuro TST' },
            { token: 'S', piece: 'S', hint: 'S desliza bajo el escalón creando el alero del TSD intermedio' },
          ],
        },
        {
          diagramTopDown: [
            '.......###',
            '........##',
            '#######.##',
            '######..##',
            '#####TTT##',
            '######T###',
            '#######.##',
          ],
          specs: [
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡1ª T: dispara el T-Spin Double intermedio!',
            },
          ],
        },
        {
          diagramTopDown: [
            '.......###',
            '........##',
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
              hint: '¡2ª T: patea en la cueva inferior para el B2B TST!',
            },
          ],
        },
      ]
    ),
    preloadCount: 3,
    goalDescription: 'Completa el DT Cannon de medio juego: TSD → B2B TST.',
    goal: { requiredClears: ['TSD', 'TST'] },
  },

  // 15. FRACTAL (DOUBLE DAGGER)
  {
    id: 'fractal',
    title: 'Fractal (Double Dagger)',
    jpTitle: 'ダブルダガー',
    category: 'methods',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/methods/fractal',
    summary: 'Doble T-Spin Double (TSD → B2B TSD) apilado en la misma columna reutilizando el mismo alero.',
    theory:
      'Llamado "Double Dagger" en Japón y "Fractal" en occidente por su geometría autosimilar: el alero superior (Z) permanece intacto tras limpiar el primer TSD y cae 2 filas para convertirse automáticamente en el alero del segundo TSD.',
    whenToUse: 'Cuando ves dos cavidades TSD superpuestas o puedes puentear una cavidad inferior con L y J.',
    keyTip: 'Observa cómo una sola pieza Z arriba basta para habilitar ambos T-Spin Doubles seguidos.',
    initialBoardTopDown: [
      '##...#####',
      '###.######',
      '##...#####',
      '###.######',
    ],
    steps: compileMultiStageSteps(
      [
        '##...#####',
        '###.######',
        '##...#####',
        '###.######',
      ],
      [
        {
          diagramTopDown: [
            'ZZ........',
            '#ZZ.......',
            '##TTT#####',
            '###T######',
            '##...#####',
            '###.######',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z crea el alero reutilizable sobre la columna 2' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡1ª T: limpia el TSD superior haciendo bajar el alero Z!',
            },
          ],
        },
        {
          diagramTopDown: [
            '##........',
            '###.......',
            '##TTT#####',
            '###T######',
          ],
          specs: [
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡2ª T: reutiliza el mismo alero Z para el B2B TSD!',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Completa ambos T-Spin Doubles de Fractal (TSD → B2B TSD).',
    goal: { requiredClears: ['TSD', 'TSD'] },
  },

  // 16. IMPERIAL CROSS (EXACT FOUR.LOL FUMEN)
  {
    id: 'imperial-cross',
    title: 'Imperial Cross',
    jpTitle: 'インペリアルクロス',
    category: 'methods',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/methods/imperial-cross',
    summary: 'Icónica cavidad en forma de cruz que produce TSD → B2B TSD limpiando primero dos filas no adyacentes.',
    theory:
      'Imperial Cross desplaza el techo superior 1 columna sobre el pozo. La primera T entra verticalmente en el centro de la cruz limpiando las filas 0 y 2 mientras rellena parcialmente la fila 1, transformando la mitad superior de la cruz en un segundo TSD limpio.',
    whenToUse: 'Cuando tienes una cavidad en cruz de 3 de ancho en medio juego y dos piezas T disponibles.',
    keyTip: 'Patea la primera T con el kick (-1, -2) hacia el interior de la cruz y gírala para encajarla en la pared izquierda de la cruz.',
    initialBoardTopDown: [
      '###...####',
      '###.######',
      '##...#####',
      '###.######',
    ],
    steps: compileMultiStageSteps(
      [
        '###...####',
        '###.######',
        '##...#####',
        '###.######',
      ],
      [
        {
          diagramTopDown: [
            '.ZZ...OO..',
            '..ZZ..OO..',
            '###...####',
            '###T######',
            '##TT.#####',
            '###T######',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z proyecta el techo de la cruz sobre columna 3' },
            { token: 'O', piece: 'O', hint: 'O levanta el muro derecho en columna 6' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡1ª T: encaja verticalmente en la cruz limpiando las filas 0 y 2!',
            },
          ],
        },
        {
          diagramTopDown: [
            '..##..##..',
            '...##.##..',
            '###TTT####',
            '####T#####',
          ],
          specs: [
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡2ª T: limpia el B2B TSD resultante!',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Resuelve la Imperial Cross completa: TSD vertical → B2B TSD.',
    goal: { requiredClears: ['TSD', 'TSD'] },
  },

  // 17. PARAPET (EXACT FOUR.LOL FUMEN)
  {
    id: 'parapet',
    title: 'Parapet',
    jpTitle: '欄干 (らんかん)',
    category: 'methods',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/methods/parapet',
    summary: 'Técnica de donación con J/L de pie ("barandilla") sobre un pozo de Tetris para disparar TSD → B2B Tetris.',
    theory:
      'Recibe su nombre porque la pieza J (o L) colocada de pie sobre el pozo parece un parapeto o barandilla. Permite ejecutar un T-Spin Double justo encima de tu columna de Tetris sin taparla de forma permanente.',
    whenToUse: 'Cuando tu pozo de Tetris está listo pero tienes una T antes que la I y quieres sumar daño B2B.',
    keyTip: 'Apoya la base de J cubriendo temporalmente el pozo en fila 4; al limpiar las filas 4 y 5 con el TSD, el pozo de 4 filas queda totalmente despejado.',
    initialBoardTopDown: [
      '###......#',
      '######...#',
      '#######.##',
      '#######.##',
      '#######.##',
      '#######.##',
    ],
    steps: compileMultiStageSteps(
      [
        '###......#',
        '######...#',
        '#######.##',
        '#######.##',
        '#######.##',
        '#######.##',
      ],
      [
        {
          diagramTopDown: [
            '....SS..J.',
            '###SSTTTJ#',
            '######TJJ#',
            '#######.##',
            '#######.##',
            '#######.##',
            '#######.##',
          ],
          specs: [
            { token: 'J', piece: 'J', hint: 'J de pie ("parapeto") puentea la columna 7 del pozo' },
            { token: 'S', piece: 'S', hint: 'S crea el alero izquierdo del TSD' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Ejecuta el Donation TSD abriendo de nuevo el pozo!',
            },
          ],
        },
        {
          diagramTopDown: [
            '....##..#.',
            '#######I##',
            '#######I##',
            '#######I##',
            '#######I##',
          ],
          specs: [
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡Remata metiendo I en el pozo para un Back-to-Back Tetris!',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Ejecuta el Donation TSD de Parapet seguido del B2B Tetris.',
    goal: { requiredClears: ['TSD', 'TETRIS'] },
  },

  // 18. KAIDAN (EXACT FOUR.LOL FUMEN)
  {
    id: 'kaidan',
    title: 'Kaidan (Staircase TSD)',
    jpTitle: '階段積み',
    category: 'methods',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/methods/kaidan',
    summary: 'Donación clásica sobre una escalera 1×1 usando Z/S vertical en los peldaños para lograr un TSD limpio.',
    theory:
      'Kaidan significa "escalera" en japonés. Cuando el tablero tiene pendiente escalonada de 4 peldaños, apoyar una Z (o S) vertical en los dos peldaños inferiores transforma la escalera en una ranura perfecta de T-Spin Double sin dejar huecos tapados.',
    whenToUse: 'Cada vez que observes una pendiente 1-1-1 hacia la pared y tengas Z/S + T.',
    keyTip: 'El bloque inferior de Z descansa sobre el primer peldaño y sobrevive al TSD manteniendo el pozo limpio.',
    initialBoardTopDown: [
      '######....',
      '#######...',
      '########..',
      '#########.',
    ],
    steps: compileMultiStageSteps(
      [
        '######....',
        '#######...',
        '########..',
        '#########.',
      ],
      [
        {
          diagramTopDown: [
            '....zz....',
            '.....zz...',
            '######TTTZ',
            '#######TZZ',
            '########Z.',
            '#########.',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z vertical se apoya en la escalera cerrando la pared derecha del TSD' },
            { token: 'z', piece: 'Z', hint: 'Segunda Z crea el alero izquierdo sobre columna 6' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Gira T sobre los peldaños para el Kaidan TSD!',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Completa el T-Spin Double sobre la escalera Kaidan.',
    goal: { requiredClears: ['TSD'] },
  },

  // 19. STMB CAVE (EXACT FOUR.LOL FUMEN)
  {
    id: 'stmb-cave',
    title: 'STMB Cave',
    jpTitle: 'STMBケイブ',
    category: 'methods',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/methods/stmb',
    summary: 'Técnica de Air T-Spin colgando una Z o S sobre un pozo de 3 columnas de ancho sin rellenarlo.',
    theory:
      'Un foso de 3 columnas suele ser incómodo de resolver. STMB Cave cuelga una Z horizontal desde el borde izquierdo del foso de 3 de ancho y añade un alero S a la derecha, fabricando un TSD flotante en el aire que deja intacto el foso inferior.',
    whenToUse: 'Cuando tienes un pozo de 3 columnas de ancho entre dos torres de igual altura.',
    keyTip: 'La pieza Z se sostiene únicamente por su extremo superior izquierdo en la columna 4 mientras el resto vuela sobre el foso.',
    initialBoardTopDown: [
      '####......',
      '#####...##',
      '#####...##',
      '#####...##',
      '#####...##',
    ],
    steps: compileMultiStageSteps(
      [
        '####......',
        '#####...##',
        '#####...##',
        '#####...##',
        '#####...##',
      ],
      [
        {
          diagramTopDown: [
            '........S.',
            '........SS',
            '####ZZTTTS',
            '#####ZZT##',
            '#####...##',
            '#####...##',
            '#####...##',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Cuelga Z horizontal desde el borde izquierdo del pozo de 3 columnas' },
            { token: 'S', piece: 'S', hint: 'S vertical en el borde derecho crea el alero del TSD' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Gira T en el aire para completar el STMB Cave TSD!',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Ejecuta el Air T-Spin Double de STMB Cave.',
    goal: { requiredClears: ['TSD'] },
  },

  // 20. STSD (SUPER T-SPIN DOUBLE)
  {
    id: 'stsd',
    title: 'STSD (Super T-Spin Double)',
    jpTitle: 'スーパーTSD',
    category: 'methods',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/stsd',
    summary: 'Configuración compacta que rinde 2 T-Spin Doubles seguidos usando un Iso-TSD vertical para el primero.',
    theory:
      'STSD utiliza una primera T pateada verticalmente (kick #4) que limpia las 2 filas inferiores mientras su bloque superior sobrevive para formar la pared de un segundo T-Spin Double inmediato.',
    whenToUse: 'Cuando tienes un hueco escalonado de 2 filas y quieres extraer dos TSD consecutivos en poco espacio.',
    keyTip: 'La primera T usa rotación doble (kick SRS ±1, -2) para entrar vertical; la segunda T gira de forma estándar bajo el alero restante.',
    initialBoardTopDown: [
      '##....####',
      '###.#.####',
      '##...#####',
      '###.######',
    ],
    steps: compileMultiStageSteps(
      [
        '##....####',
        '###.#.####',
        '##...#####',
        '###.######',
      ],
      [
        {
          diagramTopDown: [
            '....LL....',
            '##TTTl####'.replace('l', 'L'),
            '###T#L####',
            '##...#####',
            '###.######',
          ],
          specs: [
            { token: 'L', piece: 'L', hint: 'L vertical crea simultáneamente el cierre y el doble alero de STSD' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡1ª T: gira bajo L para el primer T-Spin Double!',
            },
          ],
        },
        {
          diagramTopDown: [
            '....##....',
            '##TTT#####',
            '###T######',
          ],
          specs: [
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡2ª T: el resto de L cayó formando el nuevo techo; remata el B2B TSD!',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Ejecuta los 2 T-Spin Doubles consecutivos de STSD (TSD → B2B TSD).',
    goal: { requiredClears: ['TSD', 'TSD'] },
  },

  // 21. SHACHIKU TRAIN (EXACT FOUR.LOL FUMEN)
  {
    id: 'shachiku-train',
    title: 'Shachiku Train',
    jpTitle: '社畜トレイン',
    category: 'methods',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/methods/shachiku-train',
    summary: 'Ingeniosa donación dentro de una cuenca plana de 4 columnas de ancho por 2 de alto.',
    theory:
      'Cuando aparece una meseta vacía de 4×2 sobre tu pozo de Tetris, Shachiku Train encaja S + L flotante dentro de la cuenca de 4 columnas para generar dos T-Spin Doubles seguidos sin tapar el pozo inferior.',
    whenToUse: 'Cuando tienes un foso de 4 columnas × 2 filas sobre tu pozo y recibes S, L y Z.',
    keyTip: 'Coloca primero S en la base izquierda de la cuenca, luego cuelga L a la derecha y usa Z arriba como alero del TSD.',
    initialBoardTopDown: [
      '##........',
      '####....##',
      '####....##',
      '#######.##',
      '#######.##',
    ],
    steps: compileMultiStageSteps(
      [
        '##........',
        '####....##',
        '####....##',
        '#######.##',
        '#######.##',
      ],
      [
        {
          diagramTopDown: [
            '...Z......',
            '..ZZ....OO',
            '##ZTTTLLOO',
            '####TSSL##',
            '####SS.L##',
            '#######.##',
            '#######.##',
          ],
          specs: [
            { token: 'S', piece: 'S', hint: 'S se apoya en la mitad izquierda de la cuenca 4×2' },
            { token: 'O', piece: 'O', hint: 'O eleva la pared derecha' },
            { token: 'L', piece: 'L', hint: 'L cuelga cerrando temporalmente el lado derecho' },
            { token: 'Z', piece: 'Z', hint: 'Z vertical forma el alero del primer TSD' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Gira T para disparar el vagón de Shachiku Train (Donation TSD)!',
            },
          ],
        },
      ]
    ),
    preloadCount: 4,
    goalDescription: 'Ejecuta el Donation TSD de Shachiku Train preservando el pozo.',
    goal: { requiredClears: ['TSD'] },
  },

  // 22. POLYMER: FIN TSD
  {
    id: 'polymer-fin',
    title: 'Polymer: Fin TSD',
    jpTitle: 'フィンTSD',
    category: 'methods',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/polymer-tspin',
    summary: 'T-Spin Double avanzado que usa el 5º kick SRS (-1, -2) para deslizar la T bajo una "aleta" (Fin).',
    theory:
      'Los Polymer T-Spins combinan kicks no convencionales (Fin, Neo, Iso). Aunque en el Fin TSD solo 1 esquina frontal de la T queda ocupada al aterrizar, la regla oficial Guideline otorga T-Spin Double completo (no Mini) por haber usado el 5º test de kick.',
    whenToUse: 'Cuando tienes un pozo de 2 columnas con escalón inferior y un alero sobre la columna interna.',
    keyTip: 'Coloca la T vertical pegada a la pared derecha, baja hasta el fondo y pulsa dos veces giro horario (↑/X, ↑/X).',
    initialBoardTopDown: [
      '###...####',
      '.##.######',
      '###..#####',
      '###.######',
    ],
    steps: compileMultiStageSteps(
      [
        '###...####',
        '.##.######',
        '###..#####',
        '###.######',
      ],
      [
        {
          diagramTopDown: [
            '.ZZ...OO..',
            '..ZZ..OO..',
            '###...####',
            '.##T######',
            '###TT#####',
            '###T######',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z proyecta la "aleta" (Fin) sobre la columna 3' },
            { token: 'O', piece: 'O', hint: 'O crea la pared derecha de rebote en col 6' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Ejecuta el 5º kick SRS (-1, -2) para el Fin TSD!',
              spinInstruction: 'Derecha → Z (↺) → bajar (↓) → ↑/X dos veces (↻, ↻).',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Completa el Fin T-Spin Double.',
    goal: { requiredClears: ['TSD'] },
  },

  // 23. POLYMER: NEO TSD
  {
    id: 'polymer-neo',
    title: 'Polymer: Neo TSD',
    jpTitle: 'ネオTSD',
    category: 'methods',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/polymer-tspin',
    summary: 'Patea una T hacia abajo 2 filas (kick SRS #3: 0, -2) a través de un estrechamiento hacia una cavidad lateral.',
    theory:
      'El Neo TSD aprovecha los desplazamientos verticales profundos de SRS para colar la pieza T en un bolsillo inferior desplazado respecto a la entrada.',
    whenToUse: 'Cuando el alero cubre el lado derecho de una entrada de 2 columnas sobre un bolsillo T-Spin.',
    keyTip: 'Mueve a la izquierda, gira en sentido horario (↑/X), baja hasta tocar base y pulsa dos veces Z (↺, ↺).',
    initialBoardTopDown: [
      '##....####',
      '.###.#####',
      '###..#####',
      '####.#####',
    ],
    steps: compileMultiStageSteps(
      [
        '##....####',
        '.###.#####',
        '###..#####',
        '####.#####',
      ],
      [
        {
          diagramTopDown: [
            'OO....L...',
            'OO..LLL...',
            '##....####',
            '.###T#####',
            '###TT#####',
            '####T#####',
          ],
          specs: [
            { token: 'O', piece: 'O', hint: 'O forma la pared izquierda en cols 0-1' },
            { token: 'L', piece: 'L', hint: 'L en voladizo crea el techo Neo sobre cols 4-5' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Desliza la T con doble giro antihorario para el Neo TSD!',
              spinInstruction: 'Izquierda ×2 → ↑/X (↻) → bajar (↓) → Z, Z (↺, ↺).',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Ejecuta el Neo T-Spin Double.',
    goal: { requiredClears: ['TSD'] },
  },

  // 24. POLYMER: ISO TSD
  {
    id: 'polymer-iso',
    title: 'Polymer: Iso TSD',
    jpTitle: 'アイソTSD',
    category: 'methods',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/polymer-tspin',
    summary: 'Variante Polymer que usa la pared izquierda y alero derecho para patear la T (+1, -2) al hueco.',
    theory:
      'Iso TSD es el complemento geométrico de Fin y Neo: la pieza T rebota entre la pared cercana y el alero opuesto, cayendo 2 filas y 1 columna hacia el interior de la cueva.',
    whenToUse: 'Cuando el acceso libre de 2 columnas está desplazado hacia la izquierda de la cueva T-Spin.',
    keyTip: 'Usa ↑/X (↻), baja por las columnas 2-3 y pulsa dos veces Z (↺, ↺) para activar el kick (+1, -2).',
    initialBoardTopDown: [
      '##...#####',
      '.###.#####',
      '###..#####',
      '####.#####',
    ],
    steps: compileMultiStageSteps(
      [
        '##...#####',
        '.###.#####',
        '###..#####',
        '####.#####',
      ],
      [
        {
          diagramTopDown: [
            'OO...SS...',
            'OO..SS....',
            '##...#####',
            '.###T#####',
            '###TT#####',
            '####T#####',
          ],
          specs: [
            { token: 'O', piece: 'O', hint: 'O levanta la pared izquierda en cols 0-1' },
            { token: 'S', piece: 'S', hint: 'S proyecta el alero Iso en cols 4-5' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Activa el kick (+1, -2) para completar el Iso TSD!',
              spinInstruction: 'Izquierda ×2 → ↑/X (↻) → bajar (↓) → Z, Z (↺, ↺).',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Completa el Iso T-Spin Double.',
    goal: { requiredClears: ['TSD'] },
  },

  // 25. YOSHIHIRO SD (EXACT FOUR.LOL FUMEN)
  {
    id: 'yoshihiro-sd',
    title: 'Yoshihiro SD',
    jpTitle: 'よしひろ積み (TSM → TSD)',
    category: 'methods',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/methods/yoshihiro',
    summary: 'Ingenioso método TSM → B2B TSD donde los 3 bloques supervivientes del T-Spin Mini crean el techo del TSD.',
    theory:
      'Cuando queda un bolsillo de esquina 1-2 junto a la pared, puedes girar una T vertical para hacer un T-Spin Mini Single (que activa Back-to-Back). Los 3 minos restantes de esa T forman una "L" invertida perfecta para encajar de inmediato un B2B TSD.',
    whenToUse: 'Cuando ves un hueco de esquina junto a una escalera corta y tienes dos T cercanas.',
    keyTip: 'La primera T entra vertical contra la pared derecha haciendo TSM; luego nivela a la izquierda con Z y gira la segunda T para el B2B TSD.',
    initialBoardTopDown: [
      '######....',
      '#######...',
      '#########.',
    ],
    steps: compileMultiStageSteps(
      [
        '######....',
        '#######...',
        '#########.',
      ],
      [
        {
          diagramTopDown: [
            '######...T',
            '#######.TT',
            '#########T',
          ],
          specs: [
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSMS',
              hint: '¡1ª T: gira en la esquina derecha para el T-Spin Mini Single (activa B2B)!',
            },
          ],
        },
        {
          diagramTopDown: [
            '....ZZ....',
            '.....ZZ...',
            '######TTT#',
            '#######T##',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z proyecta el alero sobre columna 6 apoyándose en la pila' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡2ª T: usa los bloques restantes de la 1ª T para el B2B TSD inmediato!',
            },
          ],
        },
      ]
    ),
    preloadCount: 0,
    goalDescription: 'Ejecuta la secuencia Yoshihiro SD: T-Spin Mini Single → B2B T-Spin Double.',
    goal: { requiredClears: ['TSMS', 'TSD'] },
  },

  // 26. ANCHOR SET (EXACT FOUR.LOL FUMEN)
  {
    id: 'anchor-set',
    title: 'Anchor Set',
    jpTitle: 'アンカーセット',
    category: 'methods',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/methods/anchor-set',
    summary: 'Usa una J vertical como "ancla" sobre el residuo de un TST de esquina para mantener B2B con un Tetris limpio.',
    theory:
      'Tras hacer un TST pegado a la esquina suele quedar un molesto alero saliente en columna 2. En lugar de romper Back-to-Back haciendo skimming o perder tiempo con soft-drop de L, deja caer una J de pie ("ancla") creando un pozo de Tetris temporal en columna 0 que destapa la columna 2 al limpiarse.',
    whenToUse: 'Después de un TST de esquina cuando quieres mantener Back-to-Back a toda velocidad.',
    keyTip: 'Deja caer J en vertical (cols 0-1) sin soft-drop, sube 2 filas con O y L, y lanza I en columna 0 para el Tetris.',
    initialBoardTopDown: [
      '........##',
      '..########',
      '...#######',
    ],
    steps: compileMultiStageSteps(
      [
        '........##',
        '..########',
        '...#######',
      ],
      [
        {
          diagramTopDown: [
            'Illlffffoo',
            'IlOOjLLLoo',
            'IJOOjjjL##',
            'IJ########',
            'JJ.#######',
          ],
          specs: [
            { token: 'J', piece: 'J', hint: 'J vertical actúa como "ancla" dejando la columna 0 abierta' },
            { token: 'O', piece: 'O', hint: 'O sube 2 filas sobre el residuo' },
            { token: 'l', piece: 'L', hint: 'L cierra la columna 1 sobre el ancla' },
            { token: 'j', piece: 'J', hint: 'Segunda J aplana el centro' },
            { token: 'L', piece: 'J', hint: 'Tercera J complementa el rectángulo central' },
            { token: 'o', piece: 'O', hint: 'O nivela las columnas 8-9 hasta altura 4' },
            { token: 'f', piece: 'I', hint: 'I horizontal termina de nivelar la cuarta fila' },
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡Lanza I en columna 0 para el Donation Tetris manteniendo B2B!',
            },
          ],
        },
      ]
    ),
    preloadCount: 7,
    goalDescription: 'Coloca el ancla J y ejecuta el Tetris de donación en columna 0.',
    goal: { requiredClears: ['TETRIS'] },
  },
];
