import { RotateCcw, Sliders, X } from 'lucide-react';
import type { HandlingSettings } from '../engine/types.ts';

interface SettingsModalProps {
  open: boolean;
  settings: HandlingSettings;
  onChange: (next: HandlingSettings) => void;
  onClose: () => void;
}

export const DEFAULT_HANDLING: HandlingSettings = {
  das: 110,
  arr: 10,
  sdf: 25,
  enableGhost: true,
  enableGrid: true,
  enableSound: true,
};

export function SettingsModal({
  open,
  settings,
  onChange,
  onClose,
}: SettingsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 font-extrabold text-slate-100">
            <Sliders className="w-4 h-4 text-fuchsia-400" />
            Ajustes de Manejo (DAS / ARR / SDF) y Controles
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Handling Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-200">DAS (Delayed Auto Shift)</span>
                <span className="font-mono text-fuchsia-300">{settings.das} ms</span>
              </div>
              <input
                type="range"
                min={35}
                max={220}
                step={5}
                value={settings.das}
                onChange={(e) =>
                  onChange({ ...settings, das: Number(e.target.value) })
                }
                className="w-full accent-fuchsia-500"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tiempo antes de que mantener pulsada ←/→ deslice la pieza a máxima velocidad.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-200">ARR (Auto Repeat Rate)</span>
                <span className="font-mono text-fuchsia-300">
                  {settings.arr === 0 ? '0 ms (Instantáneo)' : `${settings.arr} ms`}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                step={2}
                value={settings.arr}
                onChange={(e) =>
                  onChange({ ...settings, arr: Number(e.target.value) })
                }
                className="w-full accent-fuchsia-500"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                0 ms teletransporta la pieza hasta la pared al activarse el DAS (estilo TETR.IO/Jstris).
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-200">SDF (Soft Drop Factor)</span>
                <span className="font-mono text-fuchsia-300">
                  {settings.sdf >= 41 ? '∞ (Sonic Drop)' : `${settings.sdf}x`}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={41}
                step={1}
                value={settings.sdf}
                onChange={(e) =>
                  onChange({ ...settings, sdf: Number(e.target.value) })
                }
                className="w-full accent-fuchsia-500"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                En 41x (Sonic Drop), pulsar ↓ baja al instante hasta el suelo sin bloquear la pieza (ideal para T-Spins y C-Spin).
              </p>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() =>
                onChange({ ...settings, enableGhost: !settings.enableGhost })
              }
              className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
                settings.enableGhost
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Pieza Fantasma: {settings.enableGhost ? 'SÍ' : 'NO'}
            </button>
            <button
              onClick={() =>
                onChange({ ...settings, enableGrid: !settings.enableGrid })
              }
              className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
                settings.enableGrid
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Cuadrícula: {settings.enableGrid ? 'SÍ' : 'NO'}
            </button>
            <button
              onClick={() =>
                onChange({ ...settings, enableSound: !settings.enableSound })
              }
              className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
                settings.enableSound
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Sonido SFX: {settings.enableSound ? 'SÍ' : 'NO'}
            </button>
          </div>

          {/* Controls Reference Table */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Atajos de Teclado (Estándar Guideline)
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Mover Izq / Der</span>
                <kbd className="font-mono text-sky-300">← / →</kbd>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Soft Drop</span>
                <kbd className="font-mono text-sky-300">↓</kbd>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Hard Drop</span>
                <kbd className="font-mono text-sky-300">Espacio</kbd>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Giro Horario (CW)</span>
                <kbd className="font-mono text-fuchsia-300">↑ o X</kbd>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Giro Antihorario (CCW)</span>
                <kbd className="font-mono text-fuchsia-300">Z o Ctrl</kbd>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Giro 180°</span>
                <kbd className="font-mono text-fuchsia-300">A</kbd>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Guardar en Hold</span>
                <kbd className="font-mono text-amber-300">C o Shift</kbd>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Reiniciar / Deshacer</span>
                <kbd className="font-mono text-emerald-300">R / Backspace</kbd>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <button
              onClick={() => onChange(DEFAULT_HANDLING)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar valores competitivos
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
