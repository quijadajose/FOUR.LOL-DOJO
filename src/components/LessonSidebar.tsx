import { CheckCircle2, Eye, EyeOff, Search, Sparkles, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FourLolCategory, LessonDefinition } from '../engine/types.ts';
import { CATEGORY_META } from '../lessons/catalog.ts';
import type { CustomTemplateItem } from '../lessons/customTemplates.ts';

interface LessonSidebarProps {
  lessons: LessonDefinition[];
  selectedLessonId: string | null;
  completedIds: Set<string>;
  hideCompleted: boolean;
  onToggleHideCompleted: () => void;
  customTemplates: CustomTemplateItem[];
  onSelectLesson: (lesson: LessonDefinition) => void;
  onLaunchCustomTemplate: (tpl: CustomTemplateItem) => void;
  onOpenEditor: () => void;
}

export function LessonSidebar({
  lessons,
  selectedLessonId,
  completedIds,
  hideCompleted,
  onToggleHideCompleted,
  customTemplates,
  onSelectLesson,
  onLaunchCustomTemplate,
  onOpenEditor,
}: LessonSidebarProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FourLolCategory | 'all'>('all');

  const incompleteTotal = useMemo(
    () => lessons.filter((l) => !completedIds.has(l.id)).length,
    [lessons, completedIds]
  );

  const categoryCounts = useMemo(() => {
    const visiblePool = hideCompleted
      ? lessons.filter((l) => !completedIds.has(l.id))
      : lessons;
    const counts: Record<string, number> = {
      all: visiblePool.length,
      custom: customTemplates.length,
    };
    for (const l of visiblePool) {
      counts[l.category] = (counts[l.category] ?? 0) + 1;
    }
    return counts;
  }, [lessons, completedIds, hideCompleted, customTemplates.length]);

  const filteredLessons = useMemo(() => {
    const q = search.trim().toLowerCase();
    return lessons.filter((l) => {
      if (hideCompleted && completedIds.has(l.id)) {
        return false;
      }
      if (activeCategory !== 'all' && activeCategory !== 'custom' && l.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        l.title.toLowerCase().includes(q) ||
        (l.jpTitle?.toLowerCase().includes(q) ?? false) ||
        l.summary.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      );
    });
  }, [lessons, hideCompleted, completedIds, activeCategory, search]);

  const cSpinMidgame = lessons.find((l) => l.id === 'c-spin-midgame');
  const cSpinOpener = lessons.find((l) => l.id === 'c-spin-opener');

  return (
    <aside className="flex flex-col h-full bg-slate-900/75 border border-slate-800/90 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header + Search */}
      <div className="p-3.5 border-b border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            Catálogo four.lol
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            {completedIds.size}/{lessons.length} dominadas
          </span>
        </div>

        {/* Instant C-Spin Shortcuts */}
        {(cSpinMidgame || cSpinOpener) && (
          <div className="flex gap-1.5">
            {cSpinMidgame && (
              <button
                onClick={() => onSelectLesson(cSpinMidgame)}
                className={`flex-1 text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                  selectedLessonId === cSpinMidgame.id
                    ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-200'
                    : 'bg-slate-800/70 border-slate-700/80 text-slate-200 hover:border-fuchsia-500/50'
                }`}
              >
                ★ C-Spin Plantilla
              </button>
            )}
            {cSpinOpener && (
              <button
                onClick={() => onSelectLesson(cSpinOpener)}
                className={`flex-1 text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                  selectedLessonId === cSpinOpener.id
                    ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-slate-800/70 border-slate-700/80 text-slate-200 hover:border-rose-500/50'
                }`}
              >
                ★ C-Spin Opener
              </button>
            )}
          </div>
        )}

        {/* Search Input + Hide Completed Filter */}
        <div className="space-y-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar: C-Spin, TKI, DT, PC, Kick..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          <button
            onClick={onToggleHideCompleted}
            className={`w-full py-1.5 px-2.5 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition cursor-pointer ${
              hideCompleted
                ? 'bg-amber-500/15 border-amber-400/60 text-amber-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {hideCompleted ? (
                <EyeOff className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-slate-400" />
              )}
              {hideCompleted ? 'Ocultando completadas' : 'Ocultar completadas'}
            </span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                hideCompleted
                  ? 'bg-amber-400/20 text-amber-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {incompleteTotal} pendientes
            </span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1">
          {CATEGORY_META.map((cat) => {
            const active = activeCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  active
                    ? 'bg-slate-100 text-slate-950 shadow-sm'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/80'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cat.badgeColor }}
                />
                <span>{cat.shortLabel}</span>
                <span className={active ? 'text-slate-600' : 'text-slate-500'}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson List or Custom Templates List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {activeCategory === 'custom' ? (
          <div className="space-y-2">
            <button
              onClick={onOpenEditor}
              className="w-full py-2 px-3 rounded-xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-400/50 text-fuchsia-200 font-bold text-xs cursor-pointer transition"
            >
              + Crear / Editar Plantilla en el Tablero
            </button>
            {customTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => onLaunchCustomTemplate(tpl)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 transition cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-100">{tpl.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {tpl.description}
                </div>
                <div className="text-[10px] font-mono text-sky-400 mt-1">
                  Cola: {tpl.queue.join(' → ')} {tpl.hold ? `| Hold: ${tpl.hold}` : ''}
                </div>
              </button>
            ))}
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-8 px-3 space-y-2">
            <div className="text-xs text-slate-400">
              {hideCompleted && !search.trim()
                ? '🎉 ¡Ya completaste todas las lecciones de esta categoría!'
                : `No se encontraron lecciones${search.trim() ? ` para «${search}»` : ''}.`}
            </div>
            {hideCompleted && (
              <button
                onClick={onToggleHideCompleted}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-sky-300 cursor-pointer transition"
              >
                Mostrar completadas
              </button>
            )}
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            const isDone = completedIds.has(lesson.id);
            const catMeta = CATEGORY_META.find((c) => c.id === lesson.category);

            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer group ${
                  isSelected
                    ? 'bg-slate-800/95 border-fuchsia-400/80 shadow-[0_0_18px_rgba(217,70,239,0.16)]'
                    : 'bg-slate-950/55 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: catMeta?.badgeColor ?? '#94a3b8' }}
                      />
                      <span className="text-xs font-bold text-slate-100 truncate">
                        {lesson.title}
                      </span>
                    </div>
                    {lesson.jpTitle && (
                      <div className="text-[10px] text-slate-400 font-medium ml-3.5">
                        {lesson.jpTitle}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <div className="flex items-center text-[10px] text-amber-400 font-mono">
                      <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                      {lesson.difficulty}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                  {lesson.summary}
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
