import type { LessonDefinition } from '../engine/types.ts';
import { compileMultiStageSteps } from './lessonBuilder.ts';

export const PC_SRS_MISC_LESSONS: LessonDefinition[] = [
  // ============================================================================
  // PERFECT CLEARS (four.lol/perfect-clears/*)
  // ============================================================================

  // 34. GRACE SYSTEM
  {
    id: 'grace-system',
    title: 'Grace System (88.57% PC)',
    jpTitle: 'グレースシステム',
    category: 'pc',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/perfect-clears/grace-system',
    summary: 'Apertura de Perfect Clear con 88.57% de éxito guardando la pieza T en Hold.',
    theory:
      'Grace System agrupa las otras 6 piezas de la primera bolsa en un bloque compacto de 6×4 a la izquierda dejando una caja limpia de 4×4 a la derecha. Al conservar T en Hold y recibir una segunda T de la segunda bolsa, la paridad de colores de ambas T se equilibra y resuelve la caja 4×4 con 88.57% de probabilidad.',
    whenToUse: 'Al inicio de la partida cuando puedes apilar I, O, S, Z, J, L a la izquierda y guardar T en Hold.',
    keyTip: 'Una caja de 4×4 exige siempre 0 o 2 piezas T por paridad de tablero de ajedrez.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'LLLJJJtttF',
          'LZOOSJltTF',
          'ZZOOSSlTTF',
          'ZIIIISllTF',
        ],
        specs: [
          { token: 'I', piece: 'I', hint: 'I horizontal centra la base del bloque 6×4' },
          { token: 'O', piece: 'O', hint: 'O se apoya sobre el centro de I' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical cierra la pared izquierda' },
          { token: 'S', piece: 'S', hint: 'S vertical cierra la columna 5' },
          { token: 'L', piece: 'L', hint: 'L corona la esquina superior izquierda' },
          { token: 'J', piece: 'J', hint: 'J completa el bloque 6×4 del Grace System' },
          { token: 'l', piece: 'L', role: 'attack', hint: '2ª L forma la base izquierda de la caja 4×4' },
          { token: 'T', piece: 'T', role: 'attack', hint: '1ª T (desde Hold) encaja vertical en col 8' },
          { token: 't', piece: 'T', role: 'attack', hint: '2ª T cierra el techo de las columnas 6-8' },
          {
            token: 'F',
            piece: 'I',
            role: 'attack',
            expectedClear: 'TETRIS',
            hint: '¡I vertical en col 9 completa el Tetris Perfect Clear!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Resuelve la caja 4×4 del Grace System para lograr un Perfect Clear.',
    goal: { requirePerfectClear: true },
  },

  // 35. ILSZ 100% 1ST PC
  {
    id: 'ilsz-pc',
    title: 'ILSZ 100% 1st PC',
    jpTitle: 'ILSZ 100%パフェ',
    category: 'pc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/perfect-clears/ILSZ',
    summary: 'Patrón de primera bolsa que garantiza un 100% de probabilidad matemática de lograr el 1er Perfect Clear.',
    theory:
      'Cuando tus primeras piezas permiten colocar I, L, S y Z en la esquina izquierda (forma ILSZ), existen soluciones deterministas para el 100% de las permutaciones posibles de las piezas restantes sin depender de la suerte.',
    whenToUse: 'Al abrir la partida con I, L, S, Z tempranas buscando un Perfect Clear garantizado.',
    keyTip: 'Desliza las piezas S y T un bloque hacia la izquierda bajo las muescas de L y S para sellar la unión.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'ILLLtiiiiF',
          'ILZtttTTTF',
          'IZZSSssTlF',
          'IZSSsslllF',
        ],
        specs: [
          { token: 'I', piece: 'I', hint: 'I vertical contra la pared izquierda (col 0)' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical junto a I' },
          { token: 'S', piece: 'S', hint: 'S horizontal escalonada en la base' },
          { token: 'L', piece: 'L', hint: 'L corona la estructura base ILSZ' },
          { token: 's', piece: 'S', role: 'attack', hint: 'Desliza S 1 celda a la izquierda bajo el borde de la primera S' },
          { token: 't', piece: 'T', role: 'attack', hint: 'Desliza la 1ª T a la izquierda bajo L para nivelar la fila 2' },
          { token: 'l', piece: 'L', role: 'attack', hint: 'L extiende el suelo hasta la columna 8' },
          { token: 'T', piece: 'T', role: 'attack', hint: '2ª T invertida rellena el hueco central en col 7' },
          { token: 'i', piece: 'I', role: 'attack', hint: 'I horizontal sella la fila superior entre cols 5-8' },
          {
            token: 'F',
            piece: 'I',
            role: 'attack',
            expectedClear: 'TETRIS',
            hint: '¡I final en col 9 para el Perfect Clear 100%!',
          },
        ],
      },
    ]),
    preloadCount: 4,
    goalDescription: 'Completa la solución del patrón ILSZ hasta dejar el tablero vacío (Perfect Clear).',
    goal: { requirePerfectClear: true },
  },

  // 36. 2ND PC PATTERN (KNEWJADE)
  {
    id: 'second-pc',
    title: '2nd PC Pattern (knewjade)',
    jpTitle: '2巡目パフェ (90%+)',
    category: 'pc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/perfect-clears/2nd',
    summary: 'Estructura simétrica de 2º Perfect Clear (tras PCO o Grace) con más de 90% de resolución.',
    theory:
      'Después del primer Perfect Clear de 4 líneas te sobran 4 piezas de la 2ª bolsa que se combinan con la 3ª bolsa. Construir un marco de 6×4 limpio con J, L, O, S, Z, I deja una caja estándar de 4×4 muy fácil de resolver en tiempo real.',
    whenToUse: 'Inmediatamente después de lograr tu 1er Perfect Clear con PCO o Grace System.',
    keyTip: 'Construye primero los soportes J y L en el suelo para apoyar O en el centro y S/Z en los flancos.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'SIIIIZlllF',
          'SSOOZZlooF',
          'JSOOZLjooF',
          'JJJLLLjjjF',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'J abre la esquina inferior izquierda' },
          { token: 'L', piece: 'L', hint: 'L cierra las columnas 3-5 del suelo' },
          { token: 'O', piece: 'O', hint: 'O central estabiliza el marco' },
          { token: 'S', piece: 'S', hint: 'S vertical sella la columna 0' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical sella la columna 5' },
          { token: 'I', piece: 'I', hint: 'I horizontal corona el marco 6×4 de 2nd PC' },
          { token: 'j', piece: 'J', role: 'attack', hint: '2ª J inicia la caja derecha 4×4' },
          { token: 'o', piece: 'O', role: 'attack', hint: '2ª O rellena el núcleo 2×2 derecho' },
          { token: 'l', piece: 'L', role: 'attack', hint: '2ª L tapa las columnas 6-8' },
          {
            token: 'F',
            piece: 'I',
            role: 'attack',
            expectedClear: 'TETRIS',
            hint: '¡Suelta I en col 9 para encadenar el 2º Perfect Clear!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Completa la plantilla de 2nd PC terminando con el tablero limpio (Perfect Clear).',
    goal: { requirePerfectClear: true },
  },

  // 37. DPC LOOP (EXTRA O)
  {
    id: 'dpc-loop',
    title: 'DPC (Double → PC Loop)',
    jpTitle: '3巡パフェ後テンプレ (DPC)',
    category: 'pc',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/perfect-clears/dpc',
    summary: 'Plantilla canónica tras un PC de 8 líneas (sobrante O): envía un TSD y deja la base lista para otro PC.',
    theory:
      'Tras limpiar 8 líneas en 20 piezas (2 bolsas completas + 6 piezas = 28 minos → 1 pieza extra en la bolsa 3), DPC aprovecha esa pieza sobrante (aquí O en cols 0-1) para armar un T-Spin Double inmediato y transicionar de nuevo a un bucle infinito de Perfect Clears.',
    whenToUse: 'En el ciclo competitivo PCO → 2nd PC → DPC cuando tu pieza sobrante tras el 8L PC es O.',
    keyTip: 'Coloca J antes que O en el lado derecho para darle soporte a O y deja Z como alero izquierdo del TSD.',
    initialBoardTopDown: [
      '##........',
      '##........',
    ],
    steps: compileMultiStageSteps(
      [
        '##........',
        '##........',
      ],
      [
        {
          diagramTopDown: [
            '.Z........',
            'ZZ.......I',
            'ZTTTLLOOJI',
            '##TSSLOOJI',
            '##SS.L.JJI',
          ],
          specs: [
            { token: 'S', piece: 'S', hint: 'S se adosa al bloque O residual creando la esquina inferior derecha del TSD' },
            { token: 'L', piece: 'L', hint: 'L invertida cubre las columnas 4-5' },
            { token: 'J', piece: 'J', hint: 'J vertical prepara el soporte en las columnas 7-8' },
            { token: 'O', piece: 'O', hint: 'O reposa sobre J y L en las columnas 6-7' },
            { token: 'I', piece: 'I', hint: 'I vertical cierra la columna 9' },
            { token: 'Z', piece: 'Z', hint: 'Z sobre el bloque O residual crea el alero del TSD' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Gira T bajo Z para ejecutar el TSD de DPC!',
              spinInstruction: 'Baja T vertical (↑/X) en cols 2-3 y gira horario (↑/X) bajo Z.',
            },
          ],
        },
      ]
    ),
    preloadCount: 6,
    goalDescription: 'Ejecuta el T-Spin Double del bucle DPC sobre el residuo O.',
    goal: { requiredClears: ['TSD'] },
  },

  // 38. 4TH PC (2-LINE SPRINT FINISH)
  {
    id: 'fourth-pc',
    title: '4th PC (2-Line Sprint PC)',
    jpTitle: '4巡目パフェ (2ラインPC)',
    category: 'pc',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/perfect-clears/4th',
    summary: 'Resolución ultrarrápida de Perfect Clear de 2 líneas usando exactamente 5 piezas (20 minos).',
    theory:
      'En rachas consecutivas de Perfect Clears (especialmente en el 4º PC cuando sobran 5 piezas entre bolsas), en vez de apilar 4 líneas con 10 piezas puedes cerrar un Perfect Clear instantáneo de 2 líneas con solo 5 piezas (5 × 4 = 20 celdas).',
    whenToUse: 'Cuando el tablero está limpio y tu cola muestra pares planos (O, I, J+J o L+L) capaces de cubrir 10×2 sin salientes.',
    keyTip: 'Deja un hueco de 2×2 para O hasta el final para evitar limpiar la fila 0 prematuramente.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'OOjJJJIIII',
          'OOjjjJiiii',
        ],
        specs: [
          { token: 'j', piece: 'J', hint: '1ª J forma la mitad inferior del bloque 4×2 central' },
          { token: 'J', piece: 'J', hint: '2ª J (180°) cierra el rectángulo plano en cols 2-5' },
          { token: 'i', piece: 'I', hint: '1ª I horizontal cubre el suelo en cols 6-9' },
          { token: 'I', piece: 'I', hint: '2ª I horizontal cubre la fila 1 en cols 6-9' },
          {
            token: 'O',
            piece: 'O',
            role: 'attack',
            expectedClear: 'DOUBLE',
            hint: '¡Suelta O en cols 0-1 para el Perfect Clear de 2 líneas!',
          },
        ],
      },
    ]),
    preloadCount: 4,
    goalDescription: 'Completa el Perfect Clear rápido de 2 líneas (Double PC).',
    goal: { requiredClears: ['DOUBLE'], requirePerfectClear: true },
  },

  // ============================================================================
  // SRS KICKS & T-SPIN DETECTION (four.lol/srs/*)
  // ============================================================================

  // 39. SRS T-SPIN DETECTION (3-CORNER RULE)
  {
    id: 'srs-tspin-detection',
    title: 'SRS: Regla de las 3 Esquinas',
    jpTitle: 'Tスピン判定 (3コーナー則)',
    category: 'srs',
    difficulty: 1,
    fourLolUrl: 'https://four.lol/srs/t-spin',
    summary: 'Aprende cómo detecta Guideline Tetris un T-Spin auténtico frente a un T-Spin Mini.',
    theory:
      'Guideline Tetris verifica dos condiciones al bloquear una pieza T: (1) el último movimiento exitoso antes de fijarse debe ser una rotación, y (2) al menos 3 de las 4 esquinas diagonales alrededor del centro de la T deben estar ocupadas (o fuera del tablero). Si las 2 esquinas frontales hacia donde apunta la T están llenas (o se usó el 5º kick TST), es un T-Spin completo; si solo 1 esquina frontal está llena, es T-Spin Mini.',
    whenToUse: 'En cada T-Spin que construyas: verifica siempre tus 2 esquinas traseras en el suelo y al menos 1 alero superior.',
    keyTip: 'Al girar T boca abajo (rotación 2), sus dos esquinas frontales son las inferiores: ambas están llenas, garantizando un TSD completo.',
    initialBoardTopDown: [
      '####...###',
      '#####.####',
    ],
    steps: compileMultiStageSteps(
      [
        '####...###',
        '#####.####',
      ],
      [
        {
          diagramTopDown: [
            '..ZZ......',
            '...ZZ.....',
            '####TTT###',
            '#####T####',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z coloca la 3ª esquina (alero superior izquierdo en col 4, fila 2)' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Baja T vertical y gírala bajo el alero Z para activar las 3 esquinas (TSD)!',
              spinInstruction: '↑/X (↻) → bajar a col 5 → ↑/X (↻).',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Activa la regla de las 3 esquinas para lograr un T-Spin Double completo.',
    goal: { requiredClears: ['TSD'] },
  },

  // 40. SRS T KICKS (CCW (+1, -2) KICK)
  {
    id: 'srs-t-kicks',
    title: 'SRS T Kicks (Giro Antihorario)',
    jpTitle: 'T回転入れ (左回転)',
    category: 'srs',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/srs/t-kicks',
    summary: 'Practica el 5º kick antihorario (+1, -2) de la pieza T ilustrado en four.lol/srs/t-kicks.',
    theory:
      'Cuando la pieza T está en orientación Spawn (0) o 180° (2) y giras en sentido antihorario (Z → estado 3), SRS prueba 5 posiciones: (0,0), (+1,0), (+1,+1), (0,-2) y finalmente (+1,-2). Al bloquear las primeras 4 pruebas con el alero S y la pared O izquierda, la T salta 1 columna a la derecha y 2 filas hacia abajo dentro de la cueva TST.',
    whenToUse: 'Para ejecutar T-Spin Triples en el lado derecho del tablero usando rotación antihoraria (Z).',
    keyTip: 'Gira horario (↑/X), baja por el canal entre O y S, y pulsa dos veces Z (↺, ↺).',
    initialBoardTopDown: [
      '###.....##',
      '#######.##',
      '######..##',
      '#######.##',
    ],
    steps: compileMultiStageSteps(
      [
        '###.....##',
        '#######.##',
        '######..##',
        '#######.##',
      ],
      [
        {
          diagramTopDown: [
            '........SS',
            '...OO..SS.',
            '###OO...##',
            '#######T##',
            '######TT##',
            '#######T##',
          ],
          specs: [
            { token: 'S', piece: 'S', hint: 'S proyecta el alero derecho sobre la cueva TST' },
            { token: 'O', piece: 'O', hint: 'O actúa como pared de rebote izquierda para anular los kicks 1 y 2' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TST',
              hint: '¡Usa Z, Z (↺, ↺) para teletransportar T con el kick (+1, -2)!',
              spinInstruction: '↑/X (↻) → bajar entre O y S → Z (↺) → Z (↺).',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Domina el kick antihorario (+1, -2) de T limpiando el TST.',
    goal: { requiredClears: ['TST'] },
  },

  // 41. SRS J KICKS
  {
    id: 'srs-j-kicks',
    title: 'SRS J Kicks (J-Spin Triple)',
    jpTitle: 'J回転入れ',
    category: 'srs',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/srs/j-kicks',
    summary: 'Teletransporta la pieza J 2 filas hacia abajo a través de un techo cerrado usando el kick antihorario (0, -2).',
    theory:
      'J comparte exactamente la misma tabla de kicks JLSTZ que la pieza T. Cuando un hueco en forma de J invertida en el fondo tiene su pie bloqueado desde arriba, colocar J horizontal arriba y girar antihorario (0 → 3) activa la prueba #4 (0, -2), hundiendo la J directamente dentro de la cavidad sellada.',
    whenToUse: 'Para rescatar pozos con recovecos inferiores en forma de J sin desperdiciar piezas haciendo skimming.',
    keyTip: 'Deja J en orientación inicial (0), deslízala bajo la L superior y pulsa Z (↺) para que atraviese el suelo.',
    initialBoardTopDown: [
      '######.#.#',
      '######.###',
      '#####..###',
    ],
    steps: compileMultiStageSteps(
      [
        '######.#.#',
        '######.###',
        '#####..###',
      ],
      [
        {
          diagramTopDown: [
            '.......LL.',
            '........L.',
            '######J#L#',
            '######J###',
            '#####JJ###',
          ],
          specs: [
            {
              token: 'L',
              piece: 'L',
              hint: 'L vertical bloquea la prueba #3 (+1, +1) para forzar el kick descendente (0, -2)',
            },
            {
              token: 'J',
              piece: 'J',
              role: 'attack',
              expectedClear: 'TRIPLE',
              hint: '¡Baja J sin rotar, muévela 1 celda a la derecha bajo L y pulsa Z (↺)!',
              spinInstruction: 'Bajar en col 4-6 → Derecha (→) → Z (↺) para kick (0, -2).',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Inserta la pieza J mediante su kick SRS descendente para limpiar 3 líneas.',
    goal: { requiredClears: ['TRIPLE'] },
  },

  // 42. SRS L KICKS
  {
    id: 'srs-l-kicks',
    title: 'SRS L Kicks (L-Spin Triple)',
    jpTitle: 'L回転入れ',
    category: 'srs',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/srs/l-kicks',
    summary: 'Inserta la pieza L en una cueva sellada de 3 filas mediante el kick horario (0, -2).',
    theory:
      'Simétrico al J-Spin: desde la orientación inicial (0), girar L en sentido horario (0 → 1) prueba (0,0), (-1,0), (-1,+1) y luego (0,-2). Con la pared J bloqueando la subida izquierda, la pieza L desciende instantáneamente 2 filas encajando su pie bajo el techo.',
    whenToUse: 'Cuando tienes una muesca inferior derecha atrapada bajo 2 filas de bloques.',
    keyTip: 'Baja L en orientación inicial, deslízala 1 celda a la izquierda bajo J y pulsa ↑/X (↻).',
    initialBoardTopDown: [
      '#.#.######',
      '###.######',
      '###..#####',
    ],
    steps: compileMultiStageSteps(
      [
        '#.#.######',
        '###.######',
        '###..#####',
      ],
      [
        {
          diagramTopDown: [
            '.JJ.......',
            '.J........',
            '#J#L######',
            '###L######',
            '###LL#####',
          ],
          specs: [
            {
              token: 'J',
              piece: 'J',
              hint: 'J vertical bloquea la subida (-1, +1) preparando el L-Spin',
            },
            {
              token: 'L',
              piece: 'L',
              role: 'attack',
              expectedClear: 'TRIPLE',
              hint: '¡Desliza L a la izquierda bajo J y pulsa ↑/X (↻) para limpiar 3 líneas!',
              spinInstruction: 'Bajar en cols 3-5 → Izquierda (←) → ↑/X (↻).',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Ejecuta el L-Spin Triple usando el kick SRS (0, -2).',
    goal: { requiredClears: ['TRIPLE'] },
  },

  // 43. SRS S KICKS
  {
    id: 'srs-s-kicks',
    title: 'SRS S Kicks (S-Spin Tuck)',
    jpTitle: 'S回転入れ',
    category: 'srs',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/srs/s-kicks',
    summary: 'Encaja una pieza S bajo un alero cerrado usando el kick (+1, -1) para limpiar un Double limpio.',
    theory:
      'Las piezas S y Z parecen rígidas, pero al pasar de vertical (rotación 1) a horizontal invertida (rotación 2), la prueba #3 de SRS aplica un desplazamiento diagonal (+1, -1) que mete la mitad inferior de S debajo de un techo izquierdo imposible de alcanzar cayendo.',
    whenToUse: 'Para rellenar escalones invertidos en tu pila sin tapar agujeros ni romper el ritmo.',
    keyTip: 'Gira S horario (↑/X), apóyala sobre el escalón izquierdo y vuelve a pulsar ↑/X (↻).',
    initialBoardTopDown: [
      '####..####',
      '###..#####',
    ],
    steps: compileMultiStageSteps(
      [
        '####..####',
        '###..#####',
      ],
      [
        {
          diagramTopDown: [
            '.....OO...',
            '.....OO...',
            '####SS####',
            '###SS#####',
          ],
          specs: [
            { token: 'O', piece: 'O', hint: 'O bloquea el desplazamiento lateral (+1, 0) forzando el kick diagonal (+1, -1)' },
            {
              token: 'S',
              piece: 'S',
              role: 'attack',
              expectedClear: 'DOUBLE',
              hint: '¡Baja S vertical (↑/X) en cols 3-4 y gira horario (↑/X) para encajarla!',
              spinInstruction: '↑/X (↻) → bajar en cols 3-4 → ↑/X (↻).',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Usa el kick diagonal SRS de la pieza S para limpiar las 2 líneas.',
    goal: { requiredClears: ['DOUBLE'] },
  },

  // 44. SRS Z KICKS
  {
    id: 'srs-z-kicks',
    title: 'SRS Z Kicks (Z-Spin Tuck)',
    jpTitle: 'Z回転入れ',
    category: 'srs',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/srs/z-kicks',
    summary: 'Encaja una pieza Z bajo un techo derecho mediante el kick antihorario (-1, -1).',
    theory:
      'Al bajar Z en orientación vertical izquierda (rotación 3, pulsando Z) y volver a girar antihorario (3 → 2), la prueba #3 aplica el vector (-1, -1), deslizando la Z en diagonal hacia abajo e izquierda para sellar cuevas escalonadas.',
    whenToUse: 'Cuando tienes un hueco escalonado Z protegido por un bloque superior derecho.',
    keyTip: 'Gira Z antihorario (Z), baja por las columnas 5-6 y pulsa Z (↺) una vez más al tocar suelo.',
    initialBoardTopDown: [
      '####..####',
      '#####..###',
    ],
    steps: compileMultiStageSteps(
      [
        '####..####',
        '#####..###',
      ],
      [
        {
          diagramTopDown: [
            '...OO.....',
            '...OO.....',
            '####ZZ####',
            '#####ZZ###',
          ],
          specs: [
            { token: 'O', piece: 'O', hint: 'O bloquea el kick lateral (-1, 0) obligando a usar (-1, -1)' },
            {
              token: 'Z',
              piece: 'Z',
              role: 'attack',
              expectedClear: 'DOUBLE',
              hint: '¡Baja Z vertical (Z) en cols 5-6 y pulsa Z (↺) al tocar fondo!',
              spinInstruction: 'Z (↺) → bajar en cols 5-6 → Z (↺).',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Domina el Z-Spin diagonal limpiando las 2 líneas.',
    goal: { requiredClears: ['DOUBLE'] },
  },

  // 45. SRS I KICKS (UNDERGROUND TUNNEL)
  {
    id: 'srs-i-kicks',
    title: 'SRS I Kicks (Túnel Subterráneo)',
    jpTitle: 'I回転入れ',
    category: 'srs',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/srs/i-kicks',
    summary: 'Dispara una pieza I vertical lateralmente dentro de un túnel subterráneo de 4 celdas usando su tabla asimétrica.',
    theory:
      'La pieza I tiene su propia tabla de wall kicks en SRS capaz de desplazarla hasta 2 columnas enteras. Al bajar I vertical (rotación 1) por un pozo estrecho de 1 columna y girar horario (1 → 2), la 5ª prueba aplica (+2, -1), inyectando la barra horizontalmente dentro de una cueva sellada bajo tierra.',
    whenToUse: 'Para rellenar cuevas horizontales profundas o salvar errores de misdrop que taparon un pozo.',
    keyTip: 'Gira I horario (↑/X), clávala hasta el fondo de la columna 5 y pulsa ↑/X (↻) para inyectarla en el túnel.',
    initialBoardTopDown: [
      '#####.####',
      '#####....#',
    ],
    steps: compileMultiStageSteps(
      [
        '#####.####',
        '#####....#',
      ],
      [
        {
          diagramTopDown: [
            '...OO.....',
            '...OO.....',
            '#####.####',
            '#####IIII#',
          ],
          specs: [
            { token: 'O', piece: 'O', hint: 'O bloquea la prueba aérea (-1, +2) forzando el kick subterráneo (+2, -1)' },
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '¡Baja I vertical (↑/X) por la columna 5 y gira horario (↑/X) al fondo!',
              spinInstruction: '↑/X (↻) → bajar al fondo de col 5 → ↑/X (↻).',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Inyecta la pieza I en el túnel subterráneo usando el 5º kick (+2, -1).',
    goal: { requiredClears: ['SINGLE'] },
  },

  // ============================================================================
  // MISC OPENERS & SPECIAL SETUPS (four.lol/openers/* & misc)
  // ============================================================================

  // 46. GAMUSHIRO STACKING
  {
    id: 'gamushiro',
    title: 'Gamushiro Stacking',
    jpTitle: 'ガムシロ積み',
    category: 'misc',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/openers/gamushiro',
    summary: 'Apertura TST → TSD → PC creada por KMGZ donde la 1ª bolsa prepara una cueva TST camuflada.',
    theory:
      'Gamushiro Stacking coloca la primera T verticalmente como pilar interno en la primera bolsa sin limpiar líneas, de modo que la segunda bolsa construye un TST limpio con kick (-1, -2) seguido de TSD y alta probabilidad de Perfect Clear en 8 líneas.',
    whenToUse: 'Cuando quieres sorprender con un TST pesado desde una apertura compacta que conduce a PC.',
    keyTip: 'En la 2ª bolsa, la pieza J izquierda en (2,5) bloquea los kicks superiores para forzar el kick (-1, -2) hacia el TST.',
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
          { token: 'J', piece: 'J', hint: 'J abre la esquina izquierda' },
          { token: 'S', piece: 'S', hint: 'S vertical se apoya sobre J' },
          { token: 'Z', piece: 'Z', hint: 'Z horizontal deja el hueco en col 3 para el futuro TST' },
          { token: 'T', piece: 'T', hint: '1ª T se apila verticalmente como pilar central' },
          { token: 'I', piece: 'I', hint: 'I vertical sube la columna 7' },
          { token: 'O', piece: 'O', hint: 'O rellena la esquina inferior derecha' },
          { token: 'L', piece: 'L', hint: 'L vertical reposa sobre O completando la 1ª bolsa' },
        ],
      },
      {
        diagramTopDown: [
          'i.......oo',
          'i.......oo',
          'ijj.....ll',
          'ij....ss#l',
          '#jtzzss##l',
          '##ttzz####',
          '##t#######',
          '###.######',
        ],
        specs: [
          { token: 'j', piece: 'J', hint: '2ª J crea la pared de rebote izquierda sobre S' },
          { token: 'i', piece: 'I', hint: '2ª I cierra la columna 0' },
          { token: 'z', piece: 'Z', hint: '2ª Z proyecta el techo derecho sobre la cueva TST' },
          { token: 's', piece: 'S', hint: '2ª S nivela las columnas 5-7' },
          { token: 'l', piece: 'L', hint: '2ª L invertida sube la columna 9' },
          { token: 'o', piece: 'O', hint: '2ª O corona las columnas 8-9' },
          {
            token: 't',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TST',
            hint: '¡Baja T horizontal a las cols 2-4 y gira horario (↑/X) para el TST de Gamushiro!',
            spinInstruction: 'Bajar T (orientación 0) hasta cols 2-4 sobre Z → ↑/X (↻) activa el kick (-1, -2).',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Ejecuta el T-Spin Triple característico de Gamushiro Stacking.',
    goal: { requiredClears: ['TST'] },
  },

  // 47. SAILBOAT
  {
    id: 'sailboat',
    title: 'Sailboat (SST Ship)',
    jpTitle: 'SSTシップ (Sailboat)',
    category: 'misc',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/openers/sailboat',
    summary: 'Apertura creativa de ゆう que encadena TSS → B2B TSS → B2B TST con silueta de velero.',
    theory:
      'Sailboat utiliza dos T-Spin Singles consecutivos para esculpir un voladizo natural en el lado derecho que desemboca directamente en un T-Spin Triple Back-to-Back en la tercera bolsa.',
    whenToUse: 'Cuando buscas una apertura poco convencional que mantenga presión B2B constante desde la primera bolsa.',
    keyTip: 'Cada TSS conserva la cadena Back-to-Back y deja caer el techo superior un nivel más cerca de la cueva TST.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '...LL....I',
          '.TTTLOO..I',
          'ZZTJLOOSSI',
          '.ZZJJJSS.I',
        ],
        specs: [
          { token: 'J', piece: 'J', hint: 'J en el centro-izquierda' },
          { token: 'Z', piece: 'Z', hint: 'Z crea el borde izquierdo de la ranura T' },
          { token: 'L', piece: 'L', hint: 'L vertical crea el alero derecho del 1er TSS' },
          { token: 'O', piece: 'O', hint: 'O estabiliza las columnas 5-6' },
          { token: 'S', piece: 'S', hint: 'S deja preparada la muesca inferior derecha' },
          { token: 'I', piece: 'I', hint: 'I vertical cierra la columna 9' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSS',
            hint: '¡1ª T: gira bajo L para el primer T-Spin Single (TSS)!',
          },
        ],
      },
      {
        diagramTopDown: [
          '..i.z...ll',
          'ooizz....l',
          'ooiztttssl',
          'jji##tss.#',
          'j######..#',
          'j#######.#',
        ],
        specs: [
          { token: 'j', piece: 'J', hint: '2ª J sube la columna 0' },
          { token: 'o', piece: 'O', hint: '2ª O descansa sobre J' },
          { token: 'i', piece: 'I', hint: '2ª I vertical en columna 2' },
          { token: 'z', piece: 'Z', hint: '2ª Z crea el alero del 2º TSS' },
          { token: 's', piece: 'S', hint: '2ª S prepara la pared de la cueva TST derecha' },
          { token: 'l', piece: 'L', hint: '2ª L forma el techo derecho del futuro TST' },
          {
            token: 't',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSS',
            hint: '¡2ª T: ejecuta el B2B TSS!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Ejecuta la secuencia TSS → B2B TSS de la apertura Sailboat.',
    goal: { requiredClears: ['TSS', 'TSS'] },
  },

  // 48. SINGLE DOUBLE PC (SDPC)
  {
    id: 'sd-pc',
    title: 'Single Double PC (SDPC)',
    jpTitle: 'SDパフェ',
    category: 'misc',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/openers/sd-pc',
    summary: 'Apertura TSS → B2B TSD → Perfect Clear creada por ゆう con altísima consistencia.',
    theory:
      'SDPC abre con un T-Spin Single rápido en la primera bolsa y reutiliza el residuo escalonado S+J+L para montar un T-Spin Double limpio en la segunda bolsa que deja una base ideal para Perfect Clear.',
    whenToUse: 'Cuando tienes Z, S y O tempranas y quieres presionar con B2B antes de buscar el PC.',
    keyTip: 'El primer TSS limpia únicamente la fila 1, haciendo que Z descienda para sellar el flanco izquierdo del 2º T-Spin.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '.Z........',
          'ZZ.......I',
          'ZTTT...LLI',
          'OOTSSJJJLI',
          'OOSS...JLI',
        ],
        specs: [
          { token: 'O', piece: 'O', hint: 'O en la esquina inferior izquierda' },
          { token: 'S', piece: 'S', hint: 'S junto a O define el hueco T' },
          { token: 'J', piece: 'J', hint: 'J invertida cubre las columnas 5-7' },
          { token: 'L', piece: 'L', hint: 'L vertical sube la columna 8' },
          { token: 'I', piece: 'I', hint: 'I vertical cierra la columna 9' },
          { token: 'Z', piece: 'Z', hint: 'Z sobre O proyecta el alero del TSS' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSS',
            hint: '¡1ª T: gira bajo Z para el T-Spin Single!',
          },
        ],
      },
      {
        diagramTopDown: [
          'i.........',
          'ioo.......',
          'iooz...jjj',
          'i#zz....lj',
          '##ztttlll#',
          '####tss###',
          '####ss.###',
        ],
        specs: [
          { token: 'i', piece: 'I', hint: '2ª I vertical en columna 0' },
          { token: 'o', piece: 'O', hint: '2ª O sobre el escalón izquierdo' },
          { token: 'z', piece: 'Z', hint: '2ª Z crea el nuevo alero TSD en col 3' },
          { token: 's', piece: 'S', hint: '2ª S rellena la base derecha de la T' },
          { token: 'l', piece: 'L', hint: '2ª L nivela las columnas 6-8' },
          { token: 'j', piece: 'J', hint: '2ª J completa la fila 2' },
          {
            token: 't',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡2ª T: ejecuta el B2B T-Spin Double de SDPC!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Completa la apertura Single Double PC: TSS → B2B TSD.',
    goal: { requiredClears: ['TSS', 'TSD'] },
  },

  // 49. TRIPLE TRIPLE PC (TTPC)
  {
    id: 'tt-pc',
    title: 'Triple Triple PC (TTPC)',
    jpTitle: 'TTパフェ',
    category: 'misc',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/openers/tt-pc',
    summary: 'Apertura explosiva de ゆう que construye un TST limpio seguido de continuación directa hacia PC.',
    theory:
      'Al igual que Gamushiro, TTPC invierte toda la primera bolsa en esculpir la base del tablero sin limpiar líneas, permitiendo un T-Spin Triple rápido en la segunda bolsa con excelente geometría residual.',
    whenToUse: 'Cuando recibes L, S, J, Z tempranas y quieres abrir directamente con 6 líneas de ataque (TST).',
    keyTip: 'Usa la pieza L de la 2ª bolsa como alero izquierdo del TST mientras Z bloquea la pared derecha para el kick (+1, -2).',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          '.........I',
          '.......OOI',
          'LS..T..OOI',
          'LSSTTJ.ZZI',
          'LLS.TJJJZZ',
        ],
        specs: [
          { token: 'L', piece: 'L', hint: 'L vertical en la pared izquierda' },
          { token: 'S', piece: 'S', hint: 'S vertical se engrana con L' },
          { token: 'J', piece: 'J', hint: 'J deja el hueco en col 3 en el fondo' },
          { token: 'T', piece: 'T', hint: '1ª T vertical actúa de puente sobre col 4' },
          { token: 'Z', piece: 'Z', hint: 'Z cierra la esquina inferior derecha' },
          { token: 'O', piece: 'O', hint: 'O reposa sobre J y Z' },
          { token: 'I', piece: 'I', hint: 'I vertical sube la columna 9' },
        ],
      },
      {
        diagramTopDown: [
          '.......ooj',
          'i......ooj',
          'i.....zzjj',
          'is.....zz#',
          'isslllt###',
          '##sl#tt###',
          '######t###',
          '###.######',
        ],
        specs: [
          { token: 's', piece: 'S', hint: '2ª S eleva el flanco izquierdo' },
          { token: 'i', piece: 'I', hint: '2ª I vertical en columna 0' },
          { token: 'l', piece: 'L', hint: '2ª L proyecta el alero sobre la cueva TST' },
          { token: 'z', piece: 'Z', hint: '2ª Z crea la pared derecha de rebote' },
          { token: 'j', piece: 'J', hint: '2ª J sube la columna 9' },
          { token: 'o', piece: 'O', hint: '2ª O apoya junto a J' },
          {
            token: 't',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TST',
            hint: '¡Gira T con Z, Z (↺, ↺) para el TST de TTPC!',
            spinInstruction: '↑/X (↻) → bajar entre L y Z → Z, Z (↺, ↺).',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Ejecuta el T-Spin Triple de la apertura TTPC.',
    goal: { requiredClears: ['TST'] },
  },

  // 50. BLACK TEA CANNON
  {
    id: 'black-tea-cannon',
    title: 'Black Tea Cannon (紅茶砲)',
    jpTitle: '紅茶砲',
    category: 'misc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/openers/black-tea-cannon',
    summary: 'Elegante apertura TSD → B2B TSD → Perfect Clear de 6 líneas.',
    theory:
      'Black Tea Cannon envía dos T-Spin Doubles consecutivos en las dos primeras bolsas dejando únicamente un hueco rectangular limpio de 8 celdas (2 filas) que se resuelve con O + J para un Perfect Clear de 6 líneas.',
    whenToUse: 'Cuando tienes I y L tempranas para la base plana y quieres combinar ataque doble B2B con Perfect Clear.',
    keyTip: 'En el cierre final coloca primero O en las columnas 5-6 y remata con J para limpiar ambas filas a la vez.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'JJ.....S..',
          'JOO....SS.',
          'JOOZZTTTSL',
          'IIIIZZTLLL',
        ],
        specs: [
          { token: 'I', piece: 'I', hint: 'I horizontal en la esquina inferior izquierda' },
          { token: 'L', piece: 'L', hint: 'L en la esquina inferior derecha define la ranura T' },
          { token: 'O', piece: 'O', hint: 'O reposa sobre I en cols 1-2' },
          { token: 'J', piece: 'J', hint: 'J vertical cierra la columna 0' },
          { token: 'Z', piece: 'Z', hint: 'Z junto a O prepara la esquina izquierda del TSD' },
          { token: 'S', piece: 'S', hint: 'S vertical sobre L crea el alero derecho del 1er TSD' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡1ª T: gira bajo S para el primer T-Spin Double!',
          },
        ],
      },
      {
        diagramTopDown: [
          'oo.....lli',
          'ooszztttli',
          '##sszzt#li',
          '###s...##i',
        ],
        specs: [
          { token: 's', piece: 'S', hint: '2ª S escalona el flanco izquierdo' },
          { token: 'o', piece: 'O', hint: '2ª O nivela las columnas 0-1' },
          { token: 'z', piece: 'Z', hint: '2ª Z crea la esquina izquierda del 2º TSD' },
          { token: 'i', piece: 'I', hint: '2ª I vertical cierra la columna 9' },
          { token: 'l', piece: 'L', hint: '2ª L invertida proyecta el alero derecho del 2º TSD' },
          {
            token: 't',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡2ª T: ejecuta el B2B TSD dejando solo 8 celdas libres para el PC!',
          },
        ],
      },
      {
        diagramTopDown: [
          '##jjjoo###',
          '####joo###',
        ],
        specs: [
          { token: 'o', piece: 'O', role: 'attack', hint: '3ª O rellena las columnas 5-6 sin limpiar línea todavía' },
          {
            token: 'j',
            piece: 'J',
            role: 'attack',
            expectedClear: 'DOUBLE',
            hint: '¡3ª J remata las dos filas para el Perfect Clear de Black Tea Cannon!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Completa el bucle completo de Black Tea Cannon: TSD → B2B TSD → Perfect Clear.',
    goal: { requiredClears: ['TSD', 'TSD'], requirePerfectClear: true },
  },

  // 51. SAKANA'S TSD -> PC
  {
    id: 'sakana-tsd-pc',
    title: "Sakana's 100% TSD → PC",
    jpTitle: 'さかなパフェ (開幕TSD100%6Lパフェ)',
    category: 'misc',
    difficulty: 4,
    fourLolUrl: 'https://four.lol/perfect-clears/sakanas-tsd-pc',
    summary: 'Descubrimiento de Sakana: apertura TSD de 1ª bolsa con 100% de probabilidad de Perfect Clear en 6 líneas.',
    theory:
      'Durante años se buscó una apertura que enviara un T-Spin Double en la primera bolsa y aun así garantizara matemáticamente un 100% de Perfect Clear en la 6ª línea. Sakana descubrió este patrón asimétrico cuyo residuo de 8 bloques admite solución para cualquier orden de piezas.',
    whenToUse: 'Con I temprana cuando quieres enviar 4 líneas de TSD inmediato sin renunciar a un PC garantizado.',
    keyTip: 'Observa cómo S forma el alero derecho del TSD y Z se apoya encima para dejar un residuo compacto central.',
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
          { token: 'L', piece: 'L', hint: 'L vertical en la esquina inferior izquierda' },
          { token: 'I', piece: 'I', hint: 'I horizontal cubre las columnas 3-6' },
          { token: 'O', piece: 'O', hint: 'O en la esquina inferior derecha' },
          { token: 'J', piece: 'J', hint: 'J invertida enlaza I con O' },
          { token: 'S', piece: 'S', hint: 'S vertical sobre I proyecta el alero del TSD' },
          { token: 'Z', piece: 'Z', hint: 'Z se apoya sobre S preparando el residuo del PC' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡1ª T: ejecuta el TSD inicial de Sakana!',
          },
        ],
      },
      {
        diagramTopDown: [
          'iiiitffffF',
          'jjjtttlllF',
          'zzj###looF',
          '#zz####ooF',
        ],
        specs: [
          { token: 'z', piece: 'Z', role: 'attack', hint: 'Z sella el hueco inferior izquierdo (cols 0-2)' },
          { token: 'j', piece: 'J', role: 'attack', hint: 'J nivela las columnas 0-2' },
          { token: 'o', piece: 'O', role: 'attack', hint: 'O cubre las columnas 7-8' },
          { token: 'l', piece: 'L', role: 'attack', hint: 'L tapa el hueco en col 6 y extiende la fila 2' },
          { token: 't', piece: 'T', role: 'attack', hint: 'T nivela el centro-izquierda sobre el residuo' },
          { token: 'i', piece: 'I', role: 'attack', hint: 'I horizontal corona las columnas 0-3' },
          { token: 'f', piece: 'I', role: 'attack', hint: '2ª I horizontal corona las columnas 5-8' },
          {
            token: 'F',
            piece: 'I',
            role: 'attack',
            expectedClear: 'TETRIS',
            hint: '¡I vertical en col 9 para el Perfect Clear de 6 líneas de Sakana!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: "Ejecuta el TSD inicial de Sakana y completa el Perfect Clear de 6 líneas.",
    goal: { requiredClears: ['TSD'], requirePerfectClear: true },
  },

  // 52. VIPER (99.999% TSD -> PC)
  {
    id: 'viper',
    title: 'Viper (99.999% TSD → PC)',
    jpTitle: 'ヴァイパー (Viper)',
    category: 'misc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/openers/viper',
    summary: 'Apertura TSD moderna con 99.999% teórico de probabilidad de continuar en Perfect Clear.',
    theory:
      'Viper eleva el T-Spin Double a las filas 1 y 2 apoyando L, O y S a la izquierda junto con J y Z a la derecha. Solo falla en 1 de cada ~100,000 secuencias posibles al buscar el Perfect Clear posterior.',
    whenToUse: 'Cuando tienes I, L, O y J rápidas en tu primera bolsa y buscas presión TSD + PC casi infalible.',
    keyTip: 'Coloca J invertida en las columnas 7-9 dejando la fila 0 abierta bajo las columnas 7-8 para que el TSD limpie las filas 1-2.',
    initialBoardTopDown: [],
    steps: compileMultiStageSteps([], [
      {
        diagramTopDown: [
          'I......ZZ.',
          'ILOOSTTTZZ',
          'ILOOSSTJJJ',
          'ILL..S...J',
        ],
        specs: [
          { token: 'I', piece: 'I', hint: 'I vertical contra la pared izquierda (col 0)' },
          { token: 'L', piece: 'L', hint: 'L vertical en cols 1-2 apoya el bloque O' },
          { token: 'O', piece: 'O', hint: 'O reposa sobre el pie de L en cols 2-3' },
          { token: 'S', piece: 'S', hint: 'S vertical se adosa a O creando la pared izquierda de la T' },
          { token: 'J', piece: 'J', hint: 'J invertida en cols 7-9 cierra las filas 1 y 2' },
          { token: 'Z', piece: 'Z', hint: 'Z sobre J proyecta el alero derecho del TSD de Viper' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡Gira T bajo el alero Z de Viper para enviar el T-Spin Double!',
          },
        ],
      },
    ]),
    preloadCount: 6,
    goalDescription: 'Construye la cabeza de serpiente de Viper y ejecuta su T-Spin Double.',
    goal: { requiredClears: ['TSD'] },
  },

  // 53. 3RD PC (1 EXTRA PIECE RESIDUAL)
  {
    id: 'third-pc',
    title: '3rd PC (1 Pieza Extra)',
    jpTitle: '3巡目パフェ (1ミノ余り→1個残し)',
    category: 'pc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/perfect-clears/3rd',
    summary: 'Patrones para el 3er Perfect Clear consecutivo cuando inicias con la pieza sobrante de la 3ª bolsa.',
    theory:
      'Tras completar dos Perfect Clears de 4 líneas (20 piezas colocadas = 2 bolsas + 6 piezas), siempre comienzas el 3er PC con exactamente 1 pieza sobrante de la 3ª bolsa antes de abrir la 4ª bolsa. Apoyar esa pieza a la izquierda permite cerrar las 36 celdas restantes en 9 piezas exactas.',
    whenToUse: 'Al iniciar tu 3er Perfect Clear consecutivo después de 2nd PC.',
    keyTip: 'Nivela primero la columna sobre la pieza residual para aislar una caja limpia de 4×4 a la derecha.',
    initialBoardTopDown: [
      '##........',
      '##........',
    ],
    steps: compileMultiStageSteps(
      [
        '##........',
        '##........',
      ],
      [
        {
          diagramTopDown: [
            'OOItttlllF',
            'OOILtTlooF',
            '##ILTTjooF',
            '##ILLTjjjF',
          ],
          specs: [
            { token: 'O', piece: 'O', hint: 'O corona el residuo izquierdo completando cols 0-1' },
            { token: 'I', piece: 'I', hint: 'I vertical sella la columna 2' },
            { token: 'L', piece: 'L', hint: 'L vertical abre el bloque central (cols 3-4)' },
            { token: 'T', piece: 'T', hint: '1ª T encaja en vertical en la columna 5' },
            { token: 't', piece: 'T', hint: '2ª T cierra el techo del bloque izquierdo 6×4' },
            { token: 'j', piece: 'J', role: 'attack', hint: 'J inicia el suelo de la caja derecha 4×4' },
            { token: 'o', piece: 'O', role: 'attack', hint: 'O rellena el centro de las columnas 7-8' },
            { token: 'l', piece: 'L', role: 'attack', hint: 'L cubre el techo de las columnas 6-8' },
            {
              token: 'F',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡I vertical en col 9 cierra el 3er Perfect Clear!',
            },
          ],
        },
      ]
    ),
    preloadCount: 5,
    goalDescription: 'Completa el patrón de 3rd PC sobre la pieza extra inicial.',
    goal: { requirePerfectClear: true },
  },

  // 54. 5TH PC (2 + 4 PIECE PATTERNS)
  {
    id: 'fifth-pc',
    title: '5th PC (Patrón 2 + 4)',
    jpTitle: '5巡目パフェ',
    category: 'pc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/perfect-clears/5th',
    summary: 'Patrones modulares 2 + 4 piezas para resolver el 5º Perfect Clear consecutivo.',
    theory:
      'Al llegar al 5º Perfect Clear (40 piezas colocadas = 5 bolsas + 5 piezas), te quedan exactamente 2 piezas sobrantes de la 6ª bolsa. Esas 2 piezas forman un pilar de 2×4 a la izquierda y las siguientes 4 piezas arman un módulo central 4×4 dejando la caja final lista.',
    whenToUse: 'Al entrar en el 5º Perfect Clear tras completar 16 líneas limpias.',
    keyTip: 'Divide mentalmente las 8 piezas restantes en dos cajas independientes de 4×4 (cols 2-5 y cols 6-9).',
    initialBoardTopDown: [
      '##........',
      '##........',
      '##........',
      '##........',
    ],
    steps: compileMultiStageSteps(
      [
        '##........',
        '##........',
        '##........',
        '##........',
      ],
      [
        {
          diagramTopDown: [
            '##ItttjjjF',
            '##ILtToojF',
            '##ILTToolF',
            '##ILLTlllF',
          ],
          specs: [
            { token: 'I', piece: 'I', hint: 'I vertical abre el módulo central en col 2' },
            { token: 'L', piece: 'L', hint: 'L forma la esquina inferior de cols 3-4' },
            { token: 'T', piece: 'T', hint: '1ª T encaja en vertical en col 5' },
            { token: 't', piece: 'T', hint: '2ª T completa el módulo 2+4 en cols 0-5' },
            { token: 'l', piece: 'L', role: 'attack', hint: '2ª L forma la base de la caja derecha' },
            { token: 'o', piece: 'O', role: 'attack', hint: 'O se apoya en las columnas 6-7' },
            { token: 'j', piece: 'J', role: 'attack', hint: 'J corona las columnas 6-8' },
            {
              token: 'F',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡I final en col 9 para el 5th Perfect Clear!',
            },
          ],
        },
      ]
    ),
    preloadCount: 4,
    goalDescription: 'Resuelve los dos módulos 4×4 para lograr el 5th Perfect Clear.',
    goal: { requirePerfectClear: true },
  },

  // 55. 6TH PC
  {
    id: 'sixth-pc',
    title: '6th PC (Patrones de 6ª Bolsa)',
    jpTitle: '6巡目パフェ',
    category: 'pc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/perfect-clears/6th',
    summary: 'Patrones para el 6º Perfect Clear aprovechando las 6 piezas finales antes del cierre de ciclo.',
    theory:
      'Después de 50 piezas colocadas (7 bolsas + 1 pieza), cuentas con 6 piezas conocidas de la 8ª bolsa al empezar el 6º PC. Asegurar primero un bloque de 3×4 en el flanco izquierdo permite colocar una bolsa limpia de 7 piezas.',
    whenToUse: 'En carreras de Perfect Clear Mode rumbo al 7º PC.',
    keyTip: 'Mantén una pared vertical limpia en la columna 2 para no mezclar paridades entre ambos lados.',
    initialBoardTopDown: [
      '###.......',
      '###.......',
      '###.......',
      '###.......',
    ],
    steps: compileMultiStageSteps(
      [
        '###.......',
        '###.......',
        '###.......',
        '###.......',
      ],
      [
        {
          diagramTopDown: [
            '###tttlllF',
            '###LtTlooF',
            '###LTTjooF',
            '###LLTjjjF',
          ],
          specs: [
            { token: 'L', piece: 'L', hint: 'L inicia el bloque central en cols 3-4' },
            { token: 'T', piece: 'T', hint: '1ª T cierra la pared de la columna 5' },
            { token: 't', piece: 'T', hint: '2ª T sella el techo de las columnas 3-5' },
            { token: 'j', piece: 'J', role: 'attack', hint: 'J forma la base derecha en cols 6-8' },
            { token: 'o', piece: 'O', role: 'attack', hint: 'O estabiliza las columnas 7-8' },
            { token: 'l', piece: 'L', role: 'attack', hint: '2ª L tapa las columnas 6-8' },
            {
              token: 'F',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡I en columna 9 completa el 6th Perfect Clear!',
            },
          ],
        },
      ]
    ),
    preloadCount: 3,
    goalDescription: 'Completa el 6th Perfect Clear dejando el tablero limpio.',
    goal: { requirePerfectClear: true },
  },

  // 56. 7TH PC (100% LOOP RESET)
  {
    id: 'seventh-pc',
    title: '7th PC (100% Cierre de Ciclo)',
    jpTitle: '7巡目パフェ (100%ループ完結)',
    category: 'pc',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/perfect-clears/7th',
    summary: 'Patrones 100% deterministas para el 7º PC (pieza #70 = 10 bolsas exactas) que reinician el bucle al 1er PC.',
    theory:
      '7 Perfect Clears de 4 líneas consumen exactamente 70 piezas = 10 bolsas completas de 7 piezas. Por ello, al completar el 7º PC no queda ninguna pieza suelta y la partida regresa exactamente al estado matemático inicial (PCO / Grace / ILSZ).',
    whenToUse: 'En el 7º Perfect Clear consecutivo para reiniciar el ciclo infinito de 10 bolsas.',
    keyTip: 'Con las primeras 6 piezas fijas en 6×4, las últimas 4 piezas de la 10ª bolsa siempre cierran la caja derecha.',
    initialBoardTopDown: [
      '######....',
      '######....',
      '######....',
      '######....',
    ],
    steps: compileMultiStageSteps(
      [
        '######....',
        '######....',
        '######....',
        '######....',
      ],
      [
        {
          diagramTopDown: [
            '######jjjF',
            '######oojF',
            '######oolF',
            '######lllF',
          ],
          specs: [
            { token: 'l', piece: 'L', role: 'attack', hint: 'L cubre las columnas 6-8 del suelo' },
            { token: 'o', piece: 'O', role: 'attack', hint: 'O rellena el núcleo en cols 6-7' },
            { token: 'j', piece: 'J', role: 'attack', hint: 'J invertida cierra el techo en cols 6-8' },
            {
              token: 'F',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡Pieza #70: suelta I en col 9 para cerrar el ciclo de 7 Perfect Clears!',
            },
          ],
        },
      ]
    ),
    preloadCount: 0,
    goalDescription: 'Cierra la caja final del 7th PC para reiniciar el ciclo de 10 bolsas.',
    goal: { requirePerfectClear: true },
  },

  // 57. SRS KICKS OVERVIEW
  {
    id: 'srs-kicks-overview',
    title: 'SRS: Kicks Overview (Pared y Suelo)',
    jpTitle: 'SRS回転法則の基本',
    category: 'srs',
    difficulty: 1,
    fourLolUrl: 'https://four.lol/srs/kicks-overview',
    summary: 'Introducción práctica a cómo el Super Rotation System evalúa 5 desplazamientos para encajar piezas bajo techos.',
    theory:
      'Cuando giras una pieza en SRS y su posición natural choca con un muro, el suelo o una pila, el juego no cancela el giro de inmediato: consulta una tabla ordenada de 5 desplazamientos (pruebas 0 a 4) y aplica el primero que esté libre. Esto permite deslizar J/L bajo cornisas y girar T dentro de cuevas.',
    whenToUse: 'Constantemente: entender el orden de pruebas te evita bloquear pozos y te abre giros creativos con cualquier pieza.',
    keyTip: 'Primero encaja J bajo la cornisa izquierda usando rotación en el suelo, añade el alero Z y remata con T-Spin Double.',
    initialBoardTopDown: [
      '##........',
      '#......###',
      '###.#.####',
    ],
    steps: compileMultiStageSteps(
      [
        '##........',
        '#......###',
        '###.#.####',
      ],
      [
        {
          diagramTopDown: [
            '..ZZ......',
            '##.ZZ.....',
            '#JJJTTT###',
            '###J#T####',
          ],
          specs: [
            {
              token: 'J',
              piece: 'J',
              hint: 'Baja J y gírala/deslízala bajo el techo izquierdo (cols 1-3)',
            },
            {
              token: 'Z',
              piece: 'Z',
              hint: 'Z reposa sobre J creando el alero superior de la T',
            },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Gira T bajo el alero Z aplicando la tabla de kicks SRS (TSD)!',
            },
          ],
        },
      ]
    ),
    preloadCount: 2,
    goalDescription: 'Usa los wall/floor kicks básicos de SRS para completar el T-Spin Double.',
    goal: { requiredClears: ['TSD'] },
  },

  // 58. NEW DT CANNON
  {
    id: 'new-dt-cannon',
    title: 'New DT Cannon (新DT砲)',
    jpTitle: '新DT砲 (TSD→TST→TSD)',
    category: 'misc',
    difficulty: 5,
    fourLolUrl: 'https://four.lol/openers/new-dt-cannon',
    summary: 'Evolución de 5 bolsas del DT Cannon que continúa el residuo del TST con un 3er T-Spin Double encadenado.',
    theory:
      'New DT Cannon aprovecha los bloques escalonados que sobreviven tras el TSD → TST del DT Cannon clásico para construir inmediatamente un tercer T-Spin Double Back-to-Back que encamina la partida hacia Tetris y Perfect Clear.',
    whenToUse: 'Cuando dominas el DT Cannon estándar y quieres maximizar la presión B2B en la 3ª y 4ª bolsa.',
    keyTip: 'Tras el TST, nivela las columnas 0-2 con J y usa S en el centro para dejar lista la ranura del 3er T-Spin.',
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
          { token: 'I', piece: 'I', hint: 'I horizontal en cols 3-6' },
          { token: 'O', piece: 'O', hint: 'O sobre J' },
          { token: 'L', piece: 'L', hint: 'L corona la torre izquierda' },
          { token: 'T', piece: 'T', hint: '1ª T nivela el centro' },
          { token: 'Z', piece: 'Z', hint: 'Z deja abierto el pozo en col 7' },
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
          { token: 'J', piece: 'J', hint: 'J estabiliza la columna 3' },
          { token: 'O', piece: 'O', hint: 'O sube las columnas 0-1' },
          { token: 'Z', piece: 'Z', hint: 'Z vertical sobre J' },
          { token: 'S', piece: 'S', hint: 'S proyecta el alero del 1er TSD' },
          { token: 'I', piece: 'I', hint: 'I vertical cierra col 9' },
          { token: 'L', piece: 'L', hint: 'L prepara arriba el alero del TST' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡1er disparo: T-Spin Double!',
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
            hint: '¡2º disparo: kick (+1, -2) para el B2B TST!',
          },
        ],
      },
      {
        diagramTopDown: [
          '.........i',
          '.zz......i',
          'jozz....li',
          'jooTTTllli',
          'jjj#Tss###',
          '####ss..##',
        ],
        specs: [
          { token: 'j', piece: 'J', role: 'attack', hint: 'J rellena las columnas 0-2 sobre la base izquierda' },
          { token: 's', piece: 'S', role: 'attack', hint: 'S en cols 4-6 crea la esquina derecha de la nueva ranura T' },
          { token: 'o', piece: 'O', role: 'attack', hint: 'O sube las columnas 1-2' },
          { token: 'i', piece: 'I', role: 'attack', hint: 'I vertical cierra la columna 9' },
          { token: 'l', piece: 'L', role: 'attack', hint: 'L aplana las columnas 6-8' },
          { token: 'z', piece: 'Z', role: 'attack', hint: 'Z sobre O proyecta el alero del 3er T-Spin' },
          {
            token: 'T',
            piece: 'T',
            role: 'attack',
            expectedClear: 'TSD',
            hint: '¡3er disparo de New DT Cannon: B2B T-Spin Double!',
          },
        ],
      },
    ]),
    preloadCount: 13,
    goalDescription: 'Completa la cadena triple de New DT Cannon: TSD → B2B TST → B2B TSD.',
    goal: { requiredClears: ['TSD', 'TST', 'TSD'] },
  },

  // 59. 4-WIDE 6-RESIDUAL PATTERNS
  {
    id: 'four-wide-6-res',
    title: '4-Wide (6-Residual Patterns)',
    jpTitle: '4列REN (6残し全パターン)',
    category: 'misc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/misc/all-6-residuals',
    summary: 'Variante avanzada de 4-Wide con 6 bloques residuales que ofrece aún más rutas de continuación sin ahogarse.',
    theory:
      'Mientras el 4-Wide clásico conserva 3 bloques en el fondo, el 4-Wide de 6 bloques residuales (6 + 4 - 4 = 6) mantiene una escalera más rica de apoyos que acomoda secuencias incómodas de S/Z y dobles I sin romper jamás la racha de Combo.',
    whenToUse: 'Cuando abres un 4-Wide central o lateral con 6 minos residuales en el canal.',
    keyTip: 'Observa cómo después de cada Single siguen quedando exactamente 6 bloques escalonados sin agujeros tapados.',
    initialBoardTopDown: [
      '######....',
      '######....',
      '######....',
      '######....',
      '######...#',
      '######..##',
      '######.###',
    ],
    steps: compileMultiStageSteps(
      [
        '######....',
        '######....',
        '######....',
        '######....',
        '######...#',
        '######..##',
        '######.###',
      ],
      [
        {
          diagramTopDown: [
            '######I...',
            '######I..#',
            '######I.##',
            '######I###',
          ],
          specs: [
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '1ª línea (6-res): I en col 6 limpia fila 0 dejando 6 bloques',
            },
          ],
        },
        {
          diagramTopDown: [
            '######.I..',
            '#######I..',
            '#######I.#',
            '#######I##',
          ],
          specs: [
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '2ª línea (Combo ×1): 2ª I en col 7 conserva 6 bloques limpios',
            },
          ],
        },
        {
          diagramTopDown: [
            '######..JJ',
            '#######.J.',
            '########J.',
            '########J#',
          ],
          specs: [
            {
              token: 'J',
              piece: 'J',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '3ª línea (Combo ×2): J invertida limpia col 8',
            },
          ],
        },
        {
          diagramTopDown: [
            '######..LL',
            '#######..L',
            '#########L',
          ],
          specs: [
            {
              token: 'L',
              piece: 'L',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '4ª línea (Combo ×3): L invertida cierra col 9 preservando los 6 residuos',
            },
          ],
        },
      ]
    ),
    preloadCount: 0,
    goalDescription: 'Encadena 4 limpias seguidas (Combo ×3) manteniendo el patrón de 6 residuos.',
    goal: { minCombo: 3 },
  },

  // 60. TETRIS EFFECT: ALL CLEAR MODE PUZZLE
  {
    id: 'tetris-effect-all-clear',
    title: 'Tetris Effect: All Clear Puzzle',
    jpTitle: 'テトリスエフェクト All Clear',
    category: 'misc',
    difficulty: 3,
    fourLolUrl: 'https://four.lol/tetris-effect/all-clear',
    summary: 'Rompecabezas asimétrico estilo All Clear Mode de Tetris Effect donde un T-Spin prepara el vaciado total.',
    theory:
      'En el modo All Clear de Tetris Effect muchos tableros parecen imposibles si intentas apilar de forma plana. La solución consiste en crear un alero temporal con S/Z para ejecutar un T-Spin intermedio que alinee los bloques superiores en una sola fila limpia para I.',
    whenToUse: 'Para entrenar visión espacial de residuos post-limpieza y puzzles de Perfect Clear.',
    keyTip: 'Coloca S formando el alero en col 4, gira T para limpiar las 2 filas inferiores y remata con I horizontal.',
    initialBoardTopDown: [
      '###......#',
      '##.....###',
      '#####.####',
    ],
    steps: compileMultiStageSteps(
      [
        '###......#',
        '##.....###',
        '#####.####',
      ],
      [
        {
          diagramTopDown: [
            '###SS....#',
            '##SSTTT###',
            '#####T####',
          ],
          specs: [
            { token: 'S', piece: 'S', hint: 'S rellena cols 2-3 abajo y deja su brazo superior como alero TSD' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Gira T bajo S para limpiar las 2 filas inferiores y alinear la fila superior!',
            },
          ],
        },
        {
          diagramTopDown: [
            '#####IIII#',
          ],
          specs: [
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'SINGLE',
              hint: '¡Encaja I horizontal en cols 5-8 para lograr el All Clear!',
            },
          ],
        },
      ]
    ),
    preloadCount: 0,
    goalDescription: 'Resuelve el puzzle All Clear con S → TSD → I dejando el tablero vacío.',
    goal: { requiredClears: ['TSD'], requirePerfectClear: true },
  },

  // 61. TETRIS EFFECT: BOSS ABILITIES DOWNSTACK
  {
    id: 'tetris-effect-boss',
    title: 'Tetris Effect: Boss Downstack',
    jpTitle: 'テトリスエフェクトConnected ボス対策',
    category: 'misc',
    difficulty: 2,
    fourLolUrl: 'https://four.lol/tetris-effect/boss-abilities',
    summary: 'Defensa y contraataque en Connected VS destapando basura escalonada de jefe mediante TSD → B2B Tetris.',
    theory:
      'En el modo Connected VS de Tetris Effect, las habilidades de los jefes envían basura fracturada o desnivelada. Mantener la calma y usar un T-Spin de excavación (Downstack TSD) permite abrir el pozo inferior de 4 filas sin perder la cadena Back-to-Back durante la fase Zone.',
    whenToUse: 'Al excavar basura escalonada bajo presión manteniendo el bono Back-to-Back activo.',
    keyTip: 'Limpia primero el tapón superior con TSD usando Z como alero y clava I en la columna 8 recién abierta.',
    initialBoardTopDown: [
      '####...###',
      '#####.####',
      '########.#',
      '########.#',
      '########.#',
      '########.#',
    ],
    steps: compileMultiStageSteps(
      [
        '####...###',
        '#####.####',
        '########.#',
        '########.#',
        '########.#',
        '########.#',
      ],
      [
        {
          diagramTopDown: [
            '..ZZ......',
            '...ZZ.....',
            '####TTT###',
            '#####T####',
            '########.#',
            '########.#',
            '########.#',
            '########.#',
          ],
          specs: [
            { token: 'Z', piece: 'Z', hint: 'Z proyecta el alero sobre la basura superior' },
            {
              token: 'T',
              piece: 'T',
              role: 'attack',
              expectedClear: 'TSD',
              hint: '¡Excava las 2 filas superiores con TSD destapando el pozo en col 8!',
            },
          ],
        },
        {
          diagramTopDown: [
            '..##......',
            '...##.....',
            '########I#',
            '########I#',
            '########I#',
            '########I#',
          ],
          specs: [
            {
              token: 'I',
              piece: 'I',
              role: 'attack',
              expectedClear: 'TETRIS',
              hint: '¡Lanza I en la columna 8 para limpiar las 4 filas de basura con B2B Tetris!',
            },
          ],
        },
      ]
    ),
    preloadCount: 1,
    goalDescription: 'Excava la basura del jefe encadenando Downstack TSD → B2B Tetris.',
    goal: { requiredClears: ['TSD', 'TETRIS'] },
  },
];
