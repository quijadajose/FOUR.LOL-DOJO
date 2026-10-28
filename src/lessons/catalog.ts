import type { FourLolCategory, LessonDefinition } from '../engine/types.ts';
import { OPENER_LESSONS } from './openers.ts';
import { METHOD_LESSONS } from './methods.ts';
import { MIDGAME_AND_STACKING_LESSONS } from './midgameAndStacking.ts';
import { PC_SRS_MISC_LESSONS } from './perfectClearsAndSrs.ts';

export interface CategoryMeta {
  id: FourLolCategory | 'all';
  label: string;
  shortLabel: string;
  description: string;
  badgeColor: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    id: 'all',
    label: 'Todas las Lecciones',
    shortLabel: 'Todas',
    description: 'Catálogo completo de teoría competitiva inspirado en four.lol.',
    badgeColor: '#38bdf8',
  },
  {
    id: 'openers',
    label: 'Openers (Aperturas)',
    shortLabel: 'Openers',
    description: 'Aperturas de primera bolsa: C-Spin, TKI, DT Cannon, PCO, Hachispin, MKO, BT Cannon, Albatross...',
    badgeColor: '#f43f5e',
  },
  {
    id: 'methods',
    label: 'Methods (Métodos T-Spin)',
    shortLabel: 'Methods',
    description: 'Patrones tácticos de medio juego: C-Spin Mid-game, TST, Fractal, Imperial Cross, STMB, STSD, Polymer...',
    badgeColor: '#c084fc',
  },
  {
    id: 'midgame',
    label: 'Mid-game (Técnica)',
    shortLabel: 'Mid-game',
    description: 'Habilidades esenciales: Finesse de 0 faltas, Donation TSD y Skimming.',
    badgeColor: '#34d399',
  },
  {
    id: 'stacking',
    label: 'Stacking (Apilado)',
    shortLabel: 'Stacking',
    description: 'Métodos de apilado continuo: LST Stacking, 9-0 Tetris, ST Stacking y 4-Wide Combo.',
    badgeColor: '#fbbf24',
  },
  {
    id: 'pc',
    label: 'Perfect Clears',
    shortLabel: 'PC',
    description: 'Patrones para dejar el tablero vacío: Grace System, ILSZ 100%, 2nd PC, DPC Loop y 2-Line PC.',
    badgeColor: '#22d3ee',
  },
  {
    id: 'srs',
    label: 'SRS & Wall Kicks',
    shortLabel: 'SRS Kicks',
    description: 'Regla de las 3 esquinas y wall kicks avanzados para T, J, L, S, Z e I.',
    badgeColor: '#fb923c',
  },
  {
    id: 'misc',
    label: 'Misc & Especiales',
    shortLabel: 'Misc',
    description: 'Joyas modernas: Gamushiro, Sailboat, SDPC, TTPC, Black Tea Cannon, Sakana 100% y Viper.',
    badgeColor: '#a78bfa',
  },
  {
    id: 'custom',
    label: 'Mis Plantillas',
    shortLabel: 'Mis Plantillas',
    description: 'Plantillas personalizadas creadas con el editor integrado.',
    badgeColor: '#94a3b8',
  },
];

export const ALL_LESSONS: LessonDefinition[] = [
  ...OPENER_LESSONS,
  ...METHOD_LESSONS,
  ...MIDGAME_AND_STACKING_LESSONS,
  ...PC_SRS_MISC_LESSONS,
];

export function getLessonById(id: string): LessonDefinition | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}
