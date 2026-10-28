import type { PieceType } from '../engine/types.ts';

export interface CustomTemplateItem {
  id: string;
  name: string;
  description: string;
  boardTopDown: string[];
  queue: PieceType[];
  hold: PieceType | null;
  createdAt: number;
}

const STORAGE_KEY = 'fourlol_dojo_custom_templates_v1';

export const DEFAULT_CUSTOM_TEMPLATES: CustomTemplateItem[] = [
  {
    id: 'preset-cspin-sandbox',
    name: 'Sandbox C-Spin Libre',
    description: 'Cueva C-Spin lista con cola T → T para experimentar giros y continuaciones.',
    boardTopDown: [
      'ZZ........',
      '.ZZ..OO...',
      '##...OO.##',
      '##.#####.#',
      '##..####.#',
      '##.#######',
      '########.#',
      '########.#',
    ],
    queue: ['T', 'T', 'I', 'J', 'L', 'S', 'Z'],
    hold: 'I',
    createdAt: 1700000000000,
  },
];

export function loadCustomTemplates(): CustomTemplateItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CUSTOM_TEMPLATES;
    const parsed = JSON.parse(raw) as CustomTemplateItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CUSTOM_TEMPLATES;
  } catch {
    return DEFAULT_CUSTOM_TEMPLATES;
  }
}

export function saveCustomTemplates(items: CustomTemplateItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage quota errors
  }
}
