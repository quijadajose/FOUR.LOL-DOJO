import type { LessonDefinition } from '../engine/types.ts';
import { compileMultiStageSteps } from './lessonBuilder.ts';

export const MIDGAME_AND_STACKING_LESSONS: LessonDefinition[] = [
  // 27. FINESSE DRILL
  {
    id: 'finesse-drill',
    title: 'Finesse (0 Errores)',
    jpTitle: '最適操作 (Finesse)',
    category: 'midgame',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/mid-game/finesse',
    summary: 'Coloca una bolsa completa usando el número mínimo exacto de pulsaciones por pieza (0 errores de Finesse).',
    theory:
      'Finesse es el sistema estándar para colocar cualquier pieza en cualquier columna y orientación con a lo sumo 2 movimientos horizontales/DAS y 1 rotación. Reducir pulsaciones innecesarias multiplica tu velocidad (PPS) y elimina errores bajo presión.',
    whenToUse: 'En absolutamente cada pieza que coloques en cualquier partida.',
    keyTip:
      'Usa DAS hacia la pared (mantener ← o →) y retrocede 1 casilla ("tapback") en lugar de pulsar repetidamente ← ← ←. Observa el contador de Finesse en tiempo real.',
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
          { token: 'L', piece: 'L', hint: 'Finesse L: ← ←, Hard Drop' },
          { token: 'O', piece: 'O', hint: 'Finesse O: DAS ←, →, Hard Drop' },
          { token: 'J', piece: 'J', hint: 'Finesse J: 180° (A), ← ←, Hard Drop' },
          { token: 'I', piece: 'I', hint: 'Finesse I vertical pared izq: Z (↺), DAS ←' },
          { token: 'Z', piece: 'Z', hint: 'Finesse Z: → → → (o DAS →, ←)' },
          { token: 'T', piece: 'T', hint: 'Finesse T vertical pared der: Z (↺), DAS →' },
          { token: 'S', piece: 'S', hint: 'Finesse S esquina der: DAS →' },
        ],
      },
    ]),
    preloadCount: 0,
    goalDescription: 'Coloca las 7 piezas de la bolsa con 0 faltas de Finesse.',
    goal: { maxFinesseFaults: 0 },
  },

  // 28. DONATION (BASIC WELL DONATION)
  {
    id: 'donation-tsd',
    title: 'Donation (Donación sobre Pozo)',
    jpTitle: 'ドネイト',
    category: 'midgame',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/mid-game/donation',
    summary: 'Cubre temporalmente tu pozo de Tetris en columna 9 para ejecutar un TSD sin bloquear las 4 filas inferiores.',
    theory:
      'Donar consiste en tapar de forma deliberada y temporal una columna abierta debajo porque sabes que las filas tapadas serán limpiadas de inmediato por un T-Spin. Así sumas un TSD antes de lanzar tu Tetris y mantienes Back-to-Back.',
    whenToUse: 'Cuando tu pozo en columna 9 está listo pero tienes O + Z + T antes que tu pieza I.',
    keyTip: 'Apoya O en voladizo sobre la columna 8-9: como O mide exactamente 2 filas de alto, el TSD evapora los 4 bloques de O dejando el pozo 100% libre.',
    initialBoardTopDown: [
      '#####.....',
      '######.#..',
      '#########.',
      '#########.',
      '#########.',
      '#########.',
    ],
    steps: compileMultiStageSteps(
      [
        '#####.....',
        '######.#..',
        '#########.',
        '#########.',
        '#########.',
        '#########.',
      ],
      [
        {
          diagramTopDown: [
            '...ZZ.....',
            '....ZZ....',
            '#####TTTOO',
            '######T#OO',
            '#########.',
            '#########.',
            '#########.',
            '#########.',
          ],
          specs: [
            { token: 'O', piece: 'O', hint: 'O cuelga sobre cols 8-9 apoyándose en (8,3); desaparecerá por completo con el TSD' },
            { token: 'Z', piece: 'Z', hint: 'Z proyecta el alero izquierdo del TSD sobre columna 5' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Ejecuta el O-Donation TSD evaporando O y abriendo el pozo!',
            },
          ],
        },
        {
          diagramTopDown: [
            '...##.....',
            '....##....',
            '#########I',
            '#########I',
            '#########I',
            '#########I',
          ],
          specs: [
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡Lanza I vertical en columna 9 para el B2B Tetris!',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Realiza la donación TSD sobre el pozo seguida de un B2B Tetris.',
    goal: { requiredClears: ['TSD', 'TETRIS'] },
  },

  // 29. SKIMMING
  {
    id: 'skimming',
    title: 'Skimming (Limpieza Táctica)',
    jpTitle: 'スキミング (削り)',
    category: 'midgame',
    difficulty: 1,
    fourLolUrl: 'https://four.lol/mid-game/skimming',
    summary: 'Limpia una línea táctica para eliminar un bloque que obstruye tu pozo de Tetris y estabilizar el tablero.',
    theory:
      'Skimming consiste en hacer una limpieza simple o doble intencionada (aunque no sea Back-to-Back) para quitar un alero mal puesto o abrir un pozo enterrado, evitando apilar peligrosamente cerca del techo.',
    whenToUse: 'Cuando un error de colocación o basura rival tapó tu columna de Tetris por 1 fila.',
    keyTip: 'Acuesta L sobre la fila que tapa el pozo para borrar exactamente el tapón y disparar el Tetris debajo.',
    initialBoardTopDown: [
      '######...#',
      '#########.',
      '#########.',
      '#########.',
      '#########.',
    ],
    steps: compileMultiStageSteps(
      [
        '######...#',
        '#########.',
        '#########.',
        '#########.',
        '#########.',
      ],
      [
        {
          diagramTopDown: [
            '........L.',
            '######LLL#',
            '#########.',
            '#########.',
            '#########.',
            '#########.',
          ],
          specs: [
            {
              token: 'L',
              piece: 'L',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: 'Usa L para hacer Skimming de la fila que tapa el pozo',
            },
          ],
        },
        {
          diagramTopDown: [
            '........#.',
            '#########I',
            '#########I',
            '#########I',
            '#########I',
          ],
          specs: [
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡Con el pozo destapado, anota el Tetris limpio!',
            },
          ],
        },
      ]
    ),
    preloadCount: 0,
    goalDescription: 'Destapa el pozo haciendo Skimming (Single) y remata con Tetris.',
    goal: { requiredClears: ['SINGLE', 'TETRIS'] },
  },

  // 30. LST STACKING
  {
    id: 'lst-stacking',
    title: 'LST Stacking',
    jpTitle: 'LST積み',
    category: 'stacking',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/stacking/lst',
    summary: 'El método reina del juego medio competitivo: combina L + S a la izquierda con J + Z a la derecha para TSDs continuos.',
    theory:
      'LST mantiene un pozo T-Spin perpetuo en la columna 3 dividiendo el campo en una pared izquierda de 2-3 columnas (alimentada por L y S) y una plataforma derecha de 5 columnas (alimentada por J, Z, O, I). Conserva paridad limpia ciclo tras ciclo.',
    whenToUse: 'Después de TKI, MKO o cualquier apertura plana para presionar sin descanso en Versus o puntuar en Ultra.',
    keyTip: 'Coloca S horizontal sobre la base izquierda para proyectar el alero en columna 2; tras limpiar el TSD, encaja L encima para reiniciar el ciclo.',
    initialBoardTopDown: [
      '.....##...',
      '###.###...',
    ],
    steps: compileMultiStageSteps(
      [
        '.....##...',
        '###.###...',
      ],
      [
        {
          diagramTopDown: [
            '.......OOI',
            '.SS....OOI',
            'SSTTT##ooI',
            '###T###ooI',
          ],
          specs: [
            { token: 'o', piece: 'O', hint: 'O rellena la base derecha (cols 7-8)' },
            { token: 'O', piece: 'O', hint: 'O continúa subiendo de forma plana a la derecha' },
            { token: 'I', piece: 'I', hint: 'I vertical sella la columna 9' },
            { token: 'S', piece: 'S', hint: 'S horizontal en la izquierda crea el alero característico de LST' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡1ª T: limpia el TSD de LST dejando listos los bloques de S!',
            },
          ],
        },
      ]
    ),
    preloadCount: 4,
    goalDescription: 'Completa el ciclo LST construyendo el alero S y ejecutando el T-Spin Double.',
    goal: { requiredClears: ['TSD'] },
  },

  // 31. 9-0 TETRIS STACKING
  {
    id: 'tetris-9-0',
    title: '9-0 Tetris Stacking',
    jpTitle: '9-0平積み (テトリス)',
    category: 'stacking',
    difficulty: 1,
    fourLolUrl: 'https://four.lol/stacking/tetris',
    summary: 'Apilado plano fundamental dejando la columna 9 abierta para encadenar Tetrises limpios.',
    theory:
      'Contar hasta 4 de altura manteniendo una superficie horizontal sin dientes de sierra es la habilidad base más importante de Tetris. Evita crear dependencias de I o J/L en el centro del tablero.',
    whenToUse: 'En Sprint 40L, Maratón y siempre que acumules altura para defender o contraatacar.',
    keyTip: 'Mantén todas las columnas 0 a 8 niveladas a altura 4 antes de soltar tu pieza I en la columna 9.',
    initialBoardTopDown: [
      '#####.....',
      '#####.....',
      '#########.',
      '#########.',
    ],
    steps: compileMultiStageSteps(
      [
        '#####.....',
        '#####.....',
        '#########.',
        '#########.',
      ],
      [
        {
          diagramTopDown: [
            '#####lllLI',
            '#####lLLLI',
            '#########I',
            '#########I',
          ],
          specs: [
            { token: 'l', piece: 'L', hint: '1ª L (rotada 180°) nivela las columnas 5-7' },
            { token: 'L', piece: 'L', hint: '2ª L encaja formando un rectángulo plano 4×2 hasta col 8' },
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡Suelta I en la columna 9 para completar el Tetris!',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Nivela la pila 9-0 y limpia un Tetris (4 líneas).',
    goal: { requiredClears: ['TETRIS'] },
  },

  // 32. ST STACKING
  {
    id: 'st-stacking',
    title: 'ST Stacking',
    jpTitle: 'ST積み',
    category: 'stacking',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/stacking/st',
    summary: 'Método clásico de puntuación máxima en modo Ultra repitiendo piezas S verticales sobre un gancho lateral.',
    theory:
      'ST Stacking encadena pieza S tras pieza S sobre las columnas 1-2 para generar un flujo continuo de T-Spin Doubles Back-to-Back mientras el lado derecho se apila plano.',
    whenToUse: 'En modo Ultra (2 minutos) o Maratón de puntuación alta.',
    keyTip: 'Cada pieza S colocada en vertical regenera exactamente el alero que consumió el TSD anterior.',
    initialBoardTopDown: [
      '....######',
      '#.########',
    ],
    steps: compileMultiStageSteps(
      [
        '....######',
        '#.########',
      ],
      [
        {
          diagramTopDown: [
            '..S.......',
            '..SS......',
            'TTTS######',
            '#T########',
          ],
          specs: [
            { token: 'S', piece: 'S', hint: 'S vertical se apoya en col 3 creando el alero de ST Stacking' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Gira T bajo S en las columnas 0-2 para el TSD!',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Construye el gancho S y ejecuta el T-Spin Double de ST Stacking.',
    goal: { requiredClears: ['TSD'] },
  },

  // 33. 4-WIDE COMBO (3-RESIDUAL)
  {
    id: 'four-wide',
    title: '4-Wide Combo (4列REN)',
    jpTitle: '4列REN (3残し)',
    category: 'stacking',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/stacking/4-wide',
    summary: 'El célebre corredor de combos de 4 columnas de ancho con 3 bloques residuales en la base.',
    theory:
      'Al dejar exactamente 3 minos en el fondo de un pasillo de 4 columnas de ancho, cada pieza nueva que cae completa 1 línea y deja otros 3 minos residuales (3 + 4 - 4 = 3), permitiendo enlazar combos larguísimos pieza tras pieza.',
    whenToUse: 'Cuando lograste acumular paredes altas dejando un canal limpio de 4 columnas.',
    keyTip: 'Cada pieza colocada en el canal de 4 columnas DEBE limpiar 1 línea para mantener viva la racha de Combo.',
    initialBoardTopDown: [
      '######....',
      '######....',
      '######....',
      '######....',
      '######....',
      '######...#',
      '######..##',
    ],
    steps: compileMultiStageSteps(
      [
        '######....',
        '######....',
        '######....',
        '######....',
        '######....',
        '######...#',
        '######..##',
      ],
      [
        {
          diagramTopDown: [
            '######....',
            '######L...',
            '######L..#',
            '######LL##',
          ],
          specs: [
            {
              token: 'L',
              piece: 'L',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '1ª línea (inicio de racha): L limpia la fila 0 dejando 3 bloques',
            },
          ],
        },
        {
          diagramTopDown: [
            '######.OO.',
            '#######OO#',
          ],
          specs: [
            {
              token: 'O',
              piece: 'O',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '2ª línea (Combo ×1): O continúa manteniendo 3 residuales',
            },
          ],
        },
        {
          diagramTopDown: [
            '######...I',
            '######...I',
            '######...I',
            '#########I',
          ],
          specs: [
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '3ª línea (Combo ×2): I vertical despeja la base',
            },
          ],
        },
        {
          diagramTopDown: [
            '######J..#',
            '######JJJ#',
          ],
          specs: [
            {
              token: 'J',
              piece: 'J',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '4ª línea (Combo ×3): J mantiene vivo el combo',
            },
          ],
        },
        {
          diagramTopDown: [
            '######.OO#',
            '#######OO#',
          ],
          specs: [
            {
              token: 'O',
              piece: 'O',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '5ª línea (Combo ×4): ¡Remata la cadena 4-Wide!',
            },
          ],
        },
      ]
    ),
    preloadCount: 0,
    goalDescription: 'Encadena un Combo ×3 o superior sin fallar ninguna línea en el pozo 4-Wide.',
    goal: { minCombo: 3 },
  },
];
