import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Hammer,
  Lightbulb,
  Play,
  Repeat,
  Zap,
} from 'lucide-react';
import { PIECE_COLORS } from '../engine/srs.ts';
import { ACTION_LABELS_ES, type AtomicAction } from '../engine/srsPathfinder.ts';
import type { LessonDefinition, LessonPracticeMode } from '../engine/types.ts';

interface TheoryPanelProps {
  lesson: LessonDefinition;
  practiceMode: LessonPracticeMode;
  onChangePracticeMode: (mode: LessonPracticeMode) => void;
  completedSteps: Set<number>;
  currentStepIdx: number | null;
  computedActions: AtomicAction[] | null;
  isAutoPlaying: boolean;
  onDemoCurrentStep: () => void;
  showGuide: boolean;
  onToggleGuide: () => void;
  autoRepeat: boolean;
  onToggleAutoRepeat: () => void;
}

export function TheoryPanel({
  lesson,
  practiceMode,
  onChangePracticeMode,
  completedSteps,
  currentStepIdx,
  computedActions,
  isAutoPlaying,
  onDemoCurrentStep,
  showGuide,
  onToggleGuide,
  autoRepeat,
  onToggleAutoRepeat,
}: TheoryPanelProps) {
  const currentStep =
    currentStepIdx !== null ? lesson.steps[currentStepIdx] ?? null : null;

  return (
    <section className="flex flex-col h-full bg-slate-900/75 border border-slate-800/90 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Lesson Title & four.lol External Link */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-100 leading-tight">
              {lesson.title}
            </h2>
            {lesson.jpTitle && (
              <div className="text-xs text-fuchsia-300/90 font-medium mt-0.5">
                {lesson.jpTitle}
              </div>
            )}
          </div>
          <a
            href={lesson.fourLolUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-sky-300 transition"
          >
            four.lol
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Practice Mode Switcher: Plantilla Lista vs Construcción Guiada */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800">
          <button
            onClick={() => onChangePracticeMode('execute')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              practiceMode === 'execute'
                ? 'bg-fuchsia-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Plantilla Lista
          </button>
          <button
            onClick={() => onChangePracticeMode('guided')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              practiceMode === 'guided'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            Construcción Guiada
          </button>
        </div>

        {/* Helper Toggles + Demo Spin Button */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onDemoCurrentStep}
            disabled={isAutoPlaying || currentStep === null}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 disabled:opacity-40 border border-amber-400/50 text-amber-200 font-bold text-xs cursor-pointer transition"
          >
            <Play className="w-3.5 h-3.5 fill-amber-300" />
            {isAutoPlaying ? 'Demostrando SRS...' : 'Demostrar Giro'}
          </button>

          <button
            onClick={onToggleGuide}
            title="Mostrar/ocultar silueta objetivo en el tablero"
            className={`inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
              showGuide
                ? 'bg-sky-500/20 border-sky-400/50 text-sky-200'
                : 'bg-slate-800/70 border-slate-700 text-slate-400'
            }`}
          >
            {showGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Silueta
          </button>

          <button
            onClick={onToggleAutoRepeat}
            title="Recargar automáticamente la plantilla al completar el movimiento"
            className={`inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
              autoRepeat
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                : 'bg-slate-800/70 border-slate-700 text-slate-400'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            Bucle
          </button>
        </div>
      </div>

      {/* Scrollable Body: Coach + Theory + Step List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Goal Box */}
        <div className="p-3 rounded-xl bg-slate-950/75 border border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Objetivo de la Lección
          </div>
          <div className="text-xs font-semibold text-slate-100 mt-0.5">
            {lesson.goalDescription}
          </div>
        </div>

        {/* Live Current Step Coach */}
        {currentStep && (
          <div className="p-3.5 rounded-xl bg-fuchsia-950/35 border border-fuchsia-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300">
                Paso Actual ({(currentStepIdx ?? 0) + 1}/{lesson.steps.length})
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-black text-slate-950"
                style={{ backgroundColor: PIECE_COLORS[currentStep.piece].fill }}
              >
                Pieza {currentStep.piece}
              </span>
            </div>

            {currentStep.hint && (
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                {currentStep.hint}
              </p>
            )}

            {currentStep.spinInstruction && (
              <div className="p-2 rounded-lg bg-slate-950/80 border border-fuchsia-400/30 text-[11px] font-mono text-fuchsia-200">
                🎮 Maniobra: {currentStep.spinInstruction}
              </div>
            )}

            {computedActions && computedActions.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Secuencia SRS sugerida desde Spawn:
                </div>
                <div className="flex flex-wrap gap-1">
                  {computedActions.map((act, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-200"
                    >
                      {ACTION_LABELS_ES[act]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Theory Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-300">
            <BookOpen className="w-3.5 h-3.5" />
            Teoría (four.lol)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{lesson.theory}</p>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-200">¿Cuándo usarlo?</div>
            <p className="text-xs text-slate-400 leading-relaxed">{lesson.whenToUse}</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 flex gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-bold text-amber-300">Consejo Clave</div>
              <p className="text-xs text-amber-100/85 leading-relaxed mt-0.5">
                {lesson.keyTip}
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Checklist */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
             Secuencia de Piezas ({lesson.steps.length} pasos)
          </div>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {lesson.steps.map((st, idx) => {
              const done = completedSteps.has(idx);
              const isCurrent = idx === currentStepIdx;
              const isPreloaded = practiceMode === 'execute' && idx < lesson.preloadCount;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${
                    isCurrent
                      ? 'bg-fuchsia-500/15 border-fuchsia-400/60 text-white'
                      : done
                        ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[11px] font-black text-slate-950 shrink-0"
                      style={{ backgroundColor: PIECE_COLORS[st.piece].fill }}
                    >
                      {st.piece}
                    </span>
                    <span className="truncate text-[11px]">
                      {st.hint ?? (st.role === 'attack' ? 'Ejecutar ataque' : 'Construir base')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isPreloaded ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        Precargado
                      </span>
                    ) : st.expectedClear ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500/30">
                        {st.expectedClear}
                      </span>
                    ) : null}
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
